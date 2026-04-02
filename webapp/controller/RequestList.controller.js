sap.ui.define([
    "com/enterprise/travelexpense/controller/BaseController",
    "com/enterprise/travelexpense/service/MockDataService",
    "com/enterprise/travelexpense/util/Formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, MockDataService, Formatter, JSONModel, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.enterprise.travelexpense.controller.RequestList", {

        formatter: Formatter,

        onInit: function () {
            this.getRouter().getRoute("requestList").attachPatternMatched(this._onRouteMatched, this);
            this._sStatusFilter = "All";
            this._sSearchQuery = "";
        },

        _onRouteMatched: function () {
            this._loadRequests();
        },

        _loadRequests: function () {
            this.setBusy(true);
            var sRole = this.getCurrentRole();
            var oUser = this.getCurrentUser();

            setTimeout(function () {
                var aRequests;
                if (sRole === "Employee") {
                    aRequests = MockDataService.getRequestsByEmployee(oUser.id);
                } else {
                    aRequests = MockDataService.getAllRequests();
                }

                this._aAllRequests = aRequests;
                this._applyFilters();
                this.setBusy(false);
            }.bind(this), 300);
        },

        _applyFilters: function () {
            var aFiltered = this._aAllRequests || [];

            // Status filter
            if (this._sStatusFilter && this._sStatusFilter !== "All") {
                aFiltered = aFiltered.filter(function (r) {
                    return r.Status === this._sStatusFilter;
                }.bind(this));
            }

            // Search filter
            if (this._sSearchQuery) {
                var sQuery = this._sSearchQuery.toLowerCase();
                aFiltered = aFiltered.filter(function (r) {
                    return (r.RequestId && r.RequestId.toLowerCase().includes(sQuery)) ||
                        (r.Destination && r.Destination.toLowerCase().includes(sQuery)) ||
                        (r.Purpose && r.Purpose.toLowerCase().includes(sQuery)) ||
                        (r.EmployeeName && r.EmployeeName.toLowerCase().includes(sQuery));
                });
            }

            var oModel = new JSONModel(aFiltered);
            this.getView().setModel(oModel, "requestList");

            // Update count
            var oCountText = this.byId("itemCount");
            if (oCountText) {
                oCountText.setText(this.getText("itemsFound", [aFiltered.length]));
            }
        },

        onSearch: function (oEvent) {
            this._sSearchQuery = oEvent.getParameter("query") || "";
            this._applyFilters();
        },

        onStatusFilterChange: function (oEvent) {
            this._sStatusFilter = oEvent.getParameter("item").getKey();
            this._applyFilters();
        },

        onCreateRequest: function () {
            this.navigateTo("requestCreate");
        },

        onItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oCtx = oItem.getBindingContext("requestList");
            var sId = oCtx.getProperty("RequestId");
            this.navigateTo("requestView", { requestId: sId });
        },

        onNavBack: function () {
            this.navigateTo("dashboard");
        }
    });
});
