sap.ui.define([
    "com/enterprise/travelexpense/controller/BaseController",
    "com/enterprise/travelexpense/service/MockDataService",
    "com/enterprise/travelexpense/util/Formatter",
    "sap/ui/model/json/JSONModel"
], function (BaseController, MockDataService, Formatter, JSONModel) {
    "use strict";

    return BaseController.extend("com.enterprise.travelexpense.controller.Dashboard", {

        formatter: Formatter,

        onInit: function () {
            this.getRouter().getRoute("dashboard").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._refreshDashboard();
        },

        _refreshDashboard: function () {
            this.setBusy(true);

            // Simulate async OData call
            setTimeout(function () {
                var oKPIs = MockDataService.getDashboardKPIs();
                var oAppState = this.getAppStateModel();
                oAppState.setProperty("/dashboard/totalRequests", oKPIs.totalRequests);
                oAppState.setProperty("/dashboard/pendingApproval", oKPIs.pendingApproval);
                oAppState.setProperty("/dashboard/approved", oKPIs.approved);
                oAppState.setProperty("/dashboard/rejected", oKPIs.rejected);

                // Load recent requests
                var aAllRequests = MockDataService.getAllRequests();
                var aRecent = aAllRequests.slice(-5).reverse();
                var oRecentModel = new JSONModel(aRecent);
                this.getView().setModel(oRecentModel, "recentRequests");

                this.setBusy(false);
            }.bind(this), 400);
        },

        onRoleChange: function (oEvent) {
            var sRole = oEvent.getParameter("selectedItem").getKey();
            var oAppState = this.getAppStateModel();
            oAppState.setProperty("/currentUser/role", sRole);

            // Update user details per role
            var mRoleUsers = {
                "Employee": { id: "EMP001", name: "John Employee" },
                "Manager": { id: "EMP002", name: "Alice Manager" },
                "Finance": { id: "EMP003", name: "Bob Finance" }
            };
            var oUser = mRoleUsers[sRole];
            oAppState.setProperty("/currentUser/id", oUser.id);
            oAppState.setProperty("/currentUser/name", oUser.name);

            this._refreshDashboard();
        },

        onUserAvatarPress: function () {
            var oUser = this.getCurrentUser();
            sap.m.MessageToast.show("Logged in as: " + oUser.name + " (" + oUser.role + ")");
        },

        onTileTotalPress: function () {
            this.navigateTo("requestList");
        },

        onTilePendingPress: function () {
            var sRole = this.getCurrentRole();
            if (sRole === "Manager") {
                this.navigateTo("managerApproval");
            } else {
                this.navigateTo("requestList");
            }
        },

        onTileApprovedPress: function () {
            var sRole = this.getCurrentRole();
            if (sRole === "Finance") {
                this.navigateTo("financeView");
            } else {
                this.navigateTo("requestList");
            }
        },

        onTileRejectedPress: function () {
            this.navigateTo("requestList");
        },

        onCreateRequest: function () {
            this.navigateTo("requestCreate");
        },

        onMyRequests: function () {
            this.navigateTo("requestList");
        },

        onManagerApprovals: function () {
            this.navigateTo("managerApproval");
        },

        onFinanceView: function () {
            this.navigateTo("financeView");
        },

        onRecentItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oCtx = oItem.getBindingContext("recentRequests");
            var sId = oCtx.getProperty("RequestId");
            this.navigateTo("requestView", { requestId: sId });
        }
    });
});
