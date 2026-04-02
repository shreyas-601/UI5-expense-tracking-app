sap.ui.define([
    "sap/ui/core/ValueState"
], function (ValueState) {
    "use strict";

    var Validator = {

        /**
         * Validate a travel request object
         * @returns {object} { isValid: boolean, errors: [] }
         */
        validateTravelRequest: function (oData) {
            var aErrors = [];

            if (!oData.Destination || oData.Destination.trim() === "") {
                aErrors.push({ field: "Destination", message: "Destination is mandatory." });
            }

            if (!oData.Purpose || oData.Purpose.trim() === "") {
                aErrors.push({ field: "Purpose", message: "Purpose is mandatory." });
            }

            if (!oData.StartDate) {
                aErrors.push({ field: "StartDate", message: "Start Date is mandatory." });
            }

            if (!oData.EndDate) {
                aErrors.push({ field: "EndDate", message: "End Date is mandatory." });
            }

            if (oData.StartDate && oData.EndDate) {
                var oStart = this._toDate(oData.StartDate);
                var oEnd = this._toDate(oData.EndDate);
                if (oStart && oEnd && oStart > oEnd) {
                    aErrors.push({ field: "EndDate", message: "End Date must be after Start Date." });
                }
            }

            if (!oData.EstimatedAmount || isNaN(oData.EstimatedAmount) || parseFloat(oData.EstimatedAmount) <= 0) {
                aErrors.push({ field: "EstimatedAmount", message: "Estimated Amount must be a positive number." });
            }

            if (parseFloat(oData.EstimatedAmount) > 10000000) {
                aErrors.push({ field: "EstimatedAmount", message: "Estimated Amount cannot exceed 1,00,00,000." });
            }

            if (!oData.TravelType) {
                aErrors.push({ field: "TravelType", message: "Travel Type is mandatory." });
            }

            return {
                isValid: aErrors.length === 0,
                errors: aErrors
            };
        },

        /**
         * Validate approval/rejection remarks
         */
        validateRemarks: function (sRemarks, bRequired) {
            if (bRequired && (!sRemarks || sRemarks.trim() === "")) {
                return { isValid: false, message: "Remarks are mandatory for this action." };
            }
            return { isValid: true, message: "" };
        },

        /**
         * Set ValueState on a control based on errors
         */
        applyValidationState: function (oControl, sFieldName, aErrors) {
            if (!oControl) { return; }
            var oError = aErrors.find(function (e) { return e.field === sFieldName; });
            if (oError) {
                oControl.setValueState(ValueState.Error);
                oControl.setValueStateText(oError.message);
            } else {
                oControl.setValueState(ValueState.None);
                oControl.setValueStateText("");
            }
        },

        /**
         * Clear validation state on all controls
         */
        clearValidationStates: function (aControls) {
            aControls.forEach(function (oControl) {
                if (oControl && oControl.setValueState) {
                    oControl.setValueState(ValueState.None);
                    oControl.setValueStateText("");
                }
            });
        },

        /**
         * Validate date is not in the past
         */
        isDateNotPast: function (oDate) {
            if (!oDate) { return true; }
            var oToday = new Date();
            oToday.setHours(0, 0, 0, 0);
            var oCheck = this._toDate(oDate);
            return oCheck >= oToday;
        },

        _toDate: function (oDateOrString) {
            if (!oDateOrString) { return null; }
            if (oDateOrString instanceof Date) { return oDateOrString; }
            var match = /\/Date\((\d+)\)\//.exec(oDateOrString);
            if (match) { return new Date(parseInt(match[1], 10)); }
            return new Date(oDateOrString);
        }
    };

    return Validator;
});
