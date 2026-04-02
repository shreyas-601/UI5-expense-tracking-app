sap.ui.define([
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/format/NumberFormat"
], function (DateFormat, NumberFormat) {
    "use strict";

    var oDateFormat = DateFormat.getDateInstance({ pattern: "dd MMM yyyy" });
    var oCurrencyFormat = NumberFormat.getCurrencyInstance({ showMeasure: false });

    var Formatter = {

        /**
         * Format OData date string to display date
         */
        formatDate: function (sODataDate) {
            if (!sODataDate) { return ""; }
            var match = /\/Date\((\d+)\)\//.exec(sODataDate);
            if (match) {
                var oDate = new Date(parseInt(match[1], 10));
                return oDateFormat.format(oDate);
            }
            if (sODataDate instanceof Date) {
                return oDateFormat.format(sODataDate);
            }
            return sODataDate;
        },

        /**
         * Format amount with currency symbol
         */
        formatAmount: function (fAmount, sCurrency) {
            if (fAmount === null || fAmount === undefined) { return ""; }
            var sFormatted = oCurrencyFormat.format(fAmount);
            return (sCurrency || "INR") + " " + sFormatted;
        },

        /**
         * Return semantic color for status
         */
        statusState: function (sStatus) {
            var mStateMap = {
                "Draft": "None",
                "Submitted": "Warning",
                "Approved": "Success",
                "Rejected": "Error"
            };
            return mStateMap[sStatus] || "None";
        },

        /**
         * Return icon for status
         */
        statusIcon: function (sStatus) {
            var mIconMap = {
                "Draft": "sap-icon://edit",
                "Submitted": "sap-icon://pending",
                "Approved": "sap-icon://accept",
                "Rejected": "sap-icon://decline"
            };
            return mIconMap[sStatus] || "sap-icon://status-inactive";
        },

        /**
         * Return highlight color for list item
         */
        statusHighlight: function (sStatus) {
            var mHighlight = {
                "Draft": "None",
                "Submitted": "Warning",
                "Approved": "Success",
                "Rejected": "Error"
            };
            return mHighlight[sStatus] || "None";
        },

        /**
         * Is request editable (only Draft)
         */
        isEditable: function (sStatus) {
            return sStatus === "Draft";
        },

        /**
         * Is submit button visible (only Draft)
         */
        isSubmittable: function (sStatus) {
            return sStatus === "Draft";
        },

        /**
         * Travel type icon
         */
        travelTypeIcon: function (sTravelType) {
            return sTravelType === "International"
                ? "sap-icon://flight"
                : "sap-icon://map";
        },

        /**
         * KPI tile color
         */
        kpiTileColor: function (sType) {
            var mColors = {
                "total": "Default",
                "pending": "Warning",
                "approved": "Good",
                "rejected": "Error"
            };
            return mColors[sType] || "Default";
        },

        /**
         * Format number for KPI display
         */
        formatKpiNumber: function (iNumber) {
            if (iNumber === null || iNumber === undefined) { return "0"; }
            return String(iNumber);
        },

        /**
         * Role display
         */
        roleDisplay: function (sRole) {
            var mRoles = {
                "Employee": "Employee View",
                "Manager": "Manager View",
                "Finance": "Finance View"
            };
            return mRoles[sRole] || sRole;
        },

        /**
         * Check if current role allows edit
         */
        canEdit: function (sRole, sStatus) {
            return sRole === "Employee" && sStatus === "Draft";
        },

        /**
         * Boolean to visible
         */
        boolToVisible: function (bValue) {
            return !!bValue;
        },

        /**
         * Negate boolean
         */
        notBool: function (bValue) {
            return !bValue;
        }
    };

    return Formatter;
});
