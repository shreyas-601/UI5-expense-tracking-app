sap.ui.define([
    "com/enterprise/travelexpense/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("com.enterprise.travelexpense.controller.App", {

        onInit: function () {
            var oView = this.getView();
            var oComponent = this.getOwnerComponent();
            oView.addStyleClass(oComponent.getContentDensityClass());
        }
    });
});
