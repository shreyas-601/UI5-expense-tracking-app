sap.ui.define([
    "com/enterprise/travelexpense/controller/BaseController",
    "com/enterprise/travelexpense/service/MockDataService",
    "com/enterprise/travelexpense/util/Formatter",
    "com/enterprise/travelexpense/util/Validator",
    "com/enterprise/travelexpense/util/ErrorHandler",
    "sap/ui/model/json/JSONModel"
], function (BaseController, MockDataService, Formatter, Validator, ErrorHandler, JSONModel) {
    "use strict";

    return BaseController.extend("com.enterprise.travelexpense.controller.RequestDetail", {

        formatter: Formatter,

        onInit: function () {
            // Register routes
            this.getRouter().getRoute("requestCreate").attachPatternMatched(this._onCreateMatched, this);
            this.getRouter().getRoute("requestEdit").attachPatternMatched(this._onEditMatched, this);
            this.getRouter().getRoute("requestView").attachPatternMatched(this._onViewMatched, this);

            // Initialize detail model
            var oModel = new JSONModel({});
            this.getView().setModel(oModel, "requestDetail");
        },

        _onCreateMatched: function () {
            this._sMode = "Create";
            var oUser = this.getCurrentUser();

            var oNewRequest = {
                RequestId: "NEW",
                EmployeeId: oUser.id,
                EmployeeName: oUser.name,
                TravelType: "Domestic",
                StartDate: null,
                EndDate: null,
                Destination: "",
                EstimatedAmount: 0,
                Currency: "INR",
                Purpose: "",
                Status: "Draft",
                Remarks: "",
                CreatedAt: null,
                UpdatedAt: null
            };

            this.getView().getModel("requestDetail").setData(oNewRequest);
            this.getAppStateModel().setProperty("/editMode", true);
            this.byId("pageTitle").setText("New Travel Request");
        },

        _onEditMatched: function (oEvent) {
            this._sMode = "Edit";
            var sId = oEvent.getParameter("arguments").requestId;
            this._loadRequest(sId, true);
        },

        _onViewMatched: function (oEvent) {
            this._sMode = "View";
            var sId = oEvent.getParameter("arguments").requestId;
            this._loadRequest(sId, false);
        },

        _loadRequest: function (sId, bEditMode) {
            this.setBusy(true);
            var that = this;

            setTimeout(function () {
                var oReq = MockDataService.getRequestById(sId);
                if (!oReq) {
                    ErrorHandler.showError("Request not found: " + sId);
                    that.setBusy(false);
                    return;
                }

                that.getView().getModel("requestDetail").setData(oReq);
                that.getAppStateModel().setProperty("/editMode", bEditMode);
                that.byId("pageTitle").setText(oReq.RequestId + " — " + oReq.Destination);
                that.setBusy(false);
            }, 300);
        },

        onNavBack: function () {
            var oHistory = sap.ui.core.routing.History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("dashboard", {}, true);
            }
        },

        canEdit: function (sStatus, sRole) {
            return sRole === "Employee" && sStatus === "Draft" &&
                this._sMode === "View" &&
                !this.getAppStateModel().getProperty("/editMode");
        },

        canSubmit: function (sStatus, sRole) {
            return sRole === "Employee" && sStatus === "Draft" &&
                !this.getAppStateModel().getProperty("/editMode");
        },

        onEdit: function () {
            this.getAppStateModel().setProperty("/editMode", true);
            this._sMode = "Edit";
        },

        onCancelEdit: function () {
            if (this._sMode === "Create") {
                this.navigateTo("requestList");
            } else {
                var sId = this.getView().getModel("requestDetail").getProperty("/RequestId");
                this._loadRequest(sId, false);
                this._sMode = "View";
            }
        },

        onSave: function () {
            var oData = this.getView().getModel("requestDetail").getData();
            var oResult = Validator.validateTravelRequest(oData);

            if (!oResult.isValid) {
                this._applyValidationToControls(oResult.errors);
                ErrorHandler.showValidationErrors(oResult.errors);
                return;
            }

            this._clearValidationStates();
            this.setBusy(true);

            setTimeout(function () {
                try {
                    var oSaved;
                    if (this._sMode === "Create") {
                        oSaved = MockDataService.createRequest(oData);
                        this.getView().getModel("requestDetail").setData(oSaved);
                        ErrorHandler.showSuccess("Travel request created successfully.");
                        this._sMode = "View";
                    } else {
                        oSaved = MockDataService.updateRequest(oData.RequestId, oData);
                        this.getView().getModel("requestDetail").setData(oSaved);
                        ErrorHandler.showSuccess("Travel request updated successfully.");
                        this._sMode = "View";
                    }
                    this.getAppStateModel().setProperty("/editMode", false);
                } catch (e) {
                    ErrorHandler.handleServiceError(e);
                } finally {
                    this.setBusy(false);
                }
            }.bind(this), 500);
        },

        onSubmit: function () {
            var oData = this.getView().getModel("requestDetail").getData();
            ErrorHandler.showConfirm(
                "Are you sure you want to submit request " + oData.RequestId + "?",
                function (bConfirmed) {
                    if (bConfirmed) {
                        this._doSubmit(oData.RequestId);
                    }
                }.bind(this),
                "Submit Request"
            );
        },

        _doSubmit: function (sId) {
            this.setBusy(true);
            setTimeout(function () {
                try {
                    var oResult = MockDataService.submitRequest(sId);
                    this.getView().getModel("requestDetail").setData(oResult);
                    this.getAppStateModel().setProperty("/editMode", false);
                    ErrorHandler.showSuccess("Request " + sId + " submitted for approval.");
                } catch (e) {
                    ErrorHandler.handleServiceError(e);
                } finally {
                    this.setBusy(false);
                }
            }.bind(this), 500);
        },

        onStartDateChange: function () {
            // Clear end date validation when start date changes
            var oEndDatePicker = this.byId("dpEndDate");
            if (oEndDatePicker) {
                oEndDatePicker.setValueState("None");
            }
        },

        onEndDateChange: function () {
            var oStartDate = this.byId("dpStartDate").getDateValue();
            var oEndDate = this.byId("dpEndDate").getDateValue();
            if (oStartDate && oEndDate && oEndDate < oStartDate) {
                this.byId("dpEndDate").setValueState("Error");
                this.byId("dpEndDate").setValueStateText("End Date must be after Start Date.");
            } else {
                this.byId("dpEndDate").setValueState("None");
            }
        },

        _applyValidationToControls: function (aErrors) {
            var mFieldControl = {
                "Destination": "inputDestination",
                "Purpose": "textAreaPurpose",
                "StartDate": "dpStartDate",
                "EndDate": "dpEndDate",
                "EstimatedAmount": "inputAmount"
            };
            Object.keys(mFieldControl).forEach(function (sField) {
                var oControl = this.byId(mFieldControl[sField]);
                Validator.applyValidationState(oControl, sField, aErrors);
            }.bind(this));
        },

        _clearValidationStates: function () {
            var aControlIds = ["inputDestination", "textAreaPurpose", "dpStartDate", "dpEndDate", "inputAmount"];
            var aControls = aControlIds.map(function (sId) { return this.byId(sId); }.bind(this));
            Validator.clearValidationStates(aControls);
        },

        onNavBack: function () {
            this.getAppStateModel().setProperty("/editMode", false);
            this.navigateTo("requestList");
        }
    });
});
