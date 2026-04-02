sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/enterprise/travelexpense/model/models",
    "com/enterprise/travelexpense/service/MockDataService"
], function (UIComponent, Device, models, MockDataService) {
    "use strict";

    return UIComponent.extend("com.enterprise.travelexpense.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            // Call parent init
            UIComponent.prototype.init.apply(this, arguments);

            // Initialize device model
            this.setModel(models.createDeviceModel(), "device");

            // Initialize mock OData service
            MockDataService.init();

            // Initialize app state model
            this._initAppStateModel();

            // Initialize router
            this.getRouter().initialize();
        },

        _initAppStateModel: function () {
            var oAppStateModel = this.getModel("appState");
            if (!oAppStateModel) {
                var oModel = models.createAppStateModel();
                this.setModel(oModel, "appState");
            }
        },

        getContentDensityClass: function () {
            if (!this._sContentDensityClass) {
                if (Device.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCozy";
                } else {
                    this._sContentDensityClass = "sapUiSizeCompact";
                }
            }
            return this._sContentDensityClass;
        },

        destroy: function () {
            UIComponent.prototype.destroy.apply(this, arguments);
        }
    });
});
