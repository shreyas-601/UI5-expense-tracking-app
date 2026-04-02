sap.ui.define([
    "com/enterprise/travelexpense/controller/BaseController",
    "com/enterprise/travelexpense/service/MockDataService",
    "com/enterprise/travelexpense/util/Formatter",
    "com/enterprise/travelexpense/util/ErrorHandler",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Input",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/TextArea",
    "sap/m/VBox"
], function (BaseController, MockDataService, Formatter, ErrorHandler,
    JSONModel, MessageBox, Input, Dialog, Button, Label, TextArea, VBox) {
    "use strict";

    return BaseController.extend("com.enterprise.travelexpense.controller.ManagerApproval", {

        formatter: Formatter,

        onInit: function () {
            this.getRouter().getRoute("managerApproval").attachPatternMatched(this._onRouteMatched, this);

            var oManagerModel = new JSONModel({
                selectedCount: 0,
                totalPending: 0
            });
            this.getView().setModel(oManagerModel, "managerModel");

            this._sSearchQuery = "";
        },

        _onRouteMatched: function () {
            this._loadPendingRequests();
        },

        _loadPendingRequests: function () {
            this.setBusy(true);
            setTimeout(function () {
                var aRequests = MockDataService.getSubmittedRequests();
                this._aAllPending = aRequests;
                this._applySearch();
                this.getView().getModel("managerModel").setProperty("/totalPending", aRequests.length);
                this.getView().getModel("managerModel").setProperty("/selectedCount", 0);
                this.setBusy(false);
            }.bind(this), 300);
        },

        _applySearch: function () {
            var aFiltered = this._aAllPending || [];
            if (this._sSearchQuery) {
                var sQ = this._sSearchQuery.toLowerCase();
                aFiltered = aFiltered.filter(function (r) {
                    return (r.RequestId && r.RequestId.toLowerCase().includes(sQ)) ||
                        (r.EmployeeName && r.EmployeeName.toLowerCase().includes(sQ)) ||
                        (r.Destination && r.Destination.toLowerCase().includes(sQ));
                });
            }
            this.getView().setModel(new JSONModel(aFiltered), "approvalList");
        },

        onSearch: function (oEvent) {
            this._sSearchQuery = oEvent.getParameter("query") || "";
            this._applySearch();
        },

        onSelectionChange: function () {
            var oList = this.byId("approvalList");
            var iCount = oList.getSelectedItems().length;
            this.getView().getModel("managerModel").setProperty("/selectedCount", iCount);
        },

        _getSelectedIds: function () {
            var oList = this.byId("approvalList");
            return oList.getSelectedItems().map(function (oItem) {
                return oItem.getBindingContext("approvalList").getProperty("RequestId");
            });
        },

        onApproveSelected: function () {
            var aIds = this._getSelectedIds();
            if (aIds.length === 0) {
                ErrorHandler.showWarning("Please select at least one request.");
                return;
            }
            this._openRemarksDialog("Approve", aIds);
        },

        onRejectSelected: function () {
            var aIds = this._getSelectedIds();
            if (aIds.length === 0) {
                ErrorHandler.showWarning("Please select at least one request.");
                return;
            }
            this._openRemarksDialog("Reject", aIds);
        },

        onBulkApprove: function () {
            var aIds = this._getSelectedIds();
            if (aIds.length === 0) {
                ErrorHandler.showWarning("Please select requests to bulk approve.");
                return;
            }
            this._openRemarksDialog("Approve", aIds);
        },

        _openRemarksDialog: function (sAction, aIds) {
            var that = this;
            var bIsReject = sAction === "Reject";

            var oTextArea = new TextArea({
                id: "remarksInput",
                placeholder: bIsReject ? "Rejection reason is mandatory..." : "Add remarks (optional)...",
                rows: 3,
                width: "100%",
                growing: true
            });

            var oDialog = new Dialog({
                title: sAction + " " + aIds.length + " Request(s)",
                type: "Message",
                state: bIsReject ? "Error" : "Success",
                content: [
                    new VBox({
                        items: [
                            new Label({
                                text: bIsReject
                                    ? "Remarks are mandatory for rejection:"
                                    : "Add remarks for approval (optional):",
                                required: bIsReject
                            }),
                            oTextArea
                        ]
                    })
                ],
                beginButton: new Button({
                    text: sAction,
                    type: bIsReject ? "Reject" : "Accept",
                    press: function () {
                        var sRemarks = oTextArea.getValue();
                        if (bIsReject && (!sRemarks || sRemarks.trim() === "")) {
                            oTextArea.setValueState("Error");
                            oTextArea.setValueStateText("Remarks are mandatory for rejection.");
                            return;
                        }
                        oDialog.close();
                        that._processAction(sAction, aIds, sRemarks);
                    }
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: function () { oDialog.close(); }
                }),
                afterClose: function () { oDialog.destroy(); }
            });

            this.getView().addDependent(oDialog);
            oDialog.open();
        },

        _processAction: function (sAction, aIds, sRemarks) {
            this.setBusy(true);
            setTimeout(function () {
                try {
                    var iSuccess = 0;
                    aIds.forEach(function (sId) {
                        try {
                            if (sAction === "Approve") {
                                MockDataService.approveRequest(sId, sRemarks);
                            } else {
                                MockDataService.rejectRequest(sId, sRemarks);
                            }
                            iSuccess++;
                        } catch (e) {
                            // Continue with others
                        }
                    });
                    ErrorHandler.showSuccess(
                        iSuccess + " request(s) " + sAction.toLowerCase() + "d successfully."
                    );
                    this._loadPendingRequests();
                } catch (e) {
                    ErrorHandler.handleServiceError(e);
                } finally {
                    this.setBusy(false);
                }
            }.bind(this), 600);
        },

        onRefresh: function () {
            this._loadPendingRequests();
        },

        onNavBack: function () {
            this.navigateTo("dashboard");
        }
    });
});
