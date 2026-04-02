sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (MessageBox, MessageToast) {
    "use strict";

    var ErrorHandler = {

        /**
         * Show a toast message
         */
        showSuccess: function (sMessage) {
            MessageToast.show(sMessage, {
                duration: 3000,
                animationTimingFunction: "ease"
            });
        },

        /**
         * Show error dialog
         */
        showError: function (sMessage, sTitle) {
            MessageBox.error(sMessage, {
                title: sTitle || "Error",
                actions: [MessageBox.Action.CLOSE]
            });
        },

        /**
         * Show warning dialog
         */
        showWarning: function (sMessage, sTitle) {
            MessageBox.warning(sMessage, {
                title: sTitle || "Warning",
                actions: [MessageBox.Action.CLOSE]
            });
        },

        /**
         * Show confirmation dialog
         */
        showConfirm: function (sMessage, fnCallback, sTitle) {
            MessageBox.confirm(sMessage, {
                title: sTitle || "Confirm",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function (sAction) {
                    if (fnCallback) {
                        fnCallback(sAction === MessageBox.Action.YES);
                    }
                }
            });
        },

        /**
         * Handle OData / service errors
         */
        handleServiceError: function (oError) {
            var sMessage = "An unexpected error occurred.";
            if (oError && oError.message) {
                sMessage = oError.message;
            } else if (oError && oError.responseText) {
                try {
                    var oResponse = JSON.parse(oError.responseText);
                    sMessage = oResponse.error && oResponse.error.message
                        ? oResponse.error.message.value
                        : sMessage;
                } catch (e) {
                    sMessage = oError.responseText;
                }
            }
            this.showError(sMessage, "Service Error");
        },

        /**
         * Show validation error summary
         */
        showValidationErrors: function (aErrors) {
            if (!aErrors || aErrors.length === 0) { return; }
            var sMessage = aErrors.map(function (e) { return "• " + e.message; }).join("\n");
            MessageBox.error(sMessage, {
                title: "Validation Errors",
                actions: [MessageBox.Action.CLOSE]
            });
        }
    };

    return ErrorHandler;
});
