sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (JSONModel, Device) {
    "use strict";

    return {

        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        createAppStateModel: function () {
            var oModel = new JSONModel({
                currentUser: {
                    id: "EMP001",
                    name: "John Employee",
                    role: "Employee"  // Employee | Manager | Finance
                },
                roles: ["Employee", "Manager", "Finance"],
                busy: false,
                busyDelay: 0,
                dashboard: {
                    totalRequests: 0,
                    pendingApproval: 0,
                    approved: 0,
                    rejected: 0
                },
                selectedRequest: null,
                editMode: false
            });
            return oModel;
        },

        createRequestModel: function () {
            return new JSONModel({
                RequestId: "",
                EmployeeId: "",
                EmployeeName: "",
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
            });
        }
    };
});
