sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History"
], function (Controller, UIComponent, History) {
    "use strict";

    return Controller.extend("com.enterprise.travelexpense.controller.BaseController", {

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        getModel: function (sName) {
            return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        getText: function (sKey, aArgs) {
            return this.getResourceBundle().getText(sKey, aArgs);
        },

        getAppStateModel: function () {
            return this.getOwnerComponent().getModel("appState");
        },

        getCurrentUser: function () {
            return this.getAppStateModel().getProperty("/currentUser");
        },

        getCurrentRole: function () {
            return this.getAppStateModel().getProperty("/currentUser/role");
        },

        setBusy: function (bBusy) {
            this.getAppStateModel().setProperty("/busy", bBusy);
        },

        navigateTo: function (sRouteName, oParams) {
            this.getRouter().navTo(sRouteName, oParams || {});
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("dashboard", {}, true);
            }
        }
    });
});
