sap.ui.define([
    "com/enterprise/travelexpense/controller/BaseController",
    "com/enterprise/travelexpense/service/MockDataService",
    "com/enterprise/travelexpense/util/Formatter",
    "com/enterprise/travelexpense/util/ErrorHandler",
    "sap/ui/model/json/JSONModel"
], function (BaseController, MockDataService, Formatter, ErrorHandler, JSONModel) {
    "use strict";

    return BaseController.extend("com.enterprise.travelexpense.controller.FinanceView", {

        formatter: Formatter,

        onInit: function () {
            this.getRouter().getRoute("financeView").attachPatternMatched(this._onRouteMatched, this);

            var oFinanceModel = new JSONModel({
                totalCount: 0,
                totalAmount: 0,
                totalAmountFormatted: "INR 0",
                domesticCount: 0,
                internationalCount: 0
            });
            this.getView().setModel(oFinanceModel, "financeModel");
        },

        _onRouteMatched: function () {
            this._loadApprovedRequests();
        },

        _loadApprovedRequests: function () {
            this.setBusy(true);
            setTimeout(function () {
                this._aAllApproved = MockDataService.getApprovedRequests();
                this._applyFilters();
                this.setBusy(false);
            }.bind(this), 300);
        },

        _applyFilters: function () {
            var aFiltered = (this._aAllApproved || []).slice();

            var sEmployee = this.byId("filterEmployee") ? this.byId("filterEmployee").getValue() : "";
            var oFromDate = this.byId("filterFromDate") ? this.byId("filterFromDate").getDateValue() : null;
            var oToDate = this.byId("filterToDate") ? this.byId("filterToDate").getDateValue() : null;
            var fMinAmount = this.byId("filterMinAmount") ? parseFloat(this.byId("filterMinAmount").getValue()) : 0;

            if (sEmployee) {
                var sEmpLower = sEmployee.toLowerCase();
                aFiltered = aFiltered.filter(function (r) {
                    return (r.EmployeeId && r.EmployeeId.toLowerCase().includes(sEmpLower)) ||
                        (r.EmployeeName && r.EmployeeName.toLowerCase().includes(sEmpLower));
                });
            }

            if (oFromDate) {
                aFiltered = aFiltered.filter(function (r) {
                    var oReqDate = this._extractDate(r.StartDate);
                    return oReqDate && oReqDate >= oFromDate;
                }.bind(this));
            }

            if (oToDate) {
                aFiltered = aFiltered.filter(function (r) {
                    var oReqDate = this._extractDate(r.EndDate);
                    return oReqDate && oReqDate <= oToDate;
                }.bind(this));
            }

            if (!isNaN(fMinAmount) && fMinAmount > 0) {
                aFiltered = aFiltered.filter(function (r) {
                    return parseFloat(r.EstimatedAmount) >= fMinAmount;
                });
            }

            this.getView().setModel(new JSONModel(aFiltered), "financeList");
            this._updateSummary(aFiltered);
        },

        _extractDate: function (sODataDate) {
            if (!sODataDate) { return null; }
            var match = /\/Date\((\d+)\)\//.exec(sODataDate);
            return match ? new Date(parseInt(match[1], 10)) : null;
        },

        _updateSummary: function (aData) {
            var fTotal = aData.reduce(function (acc, r) { return acc + parseFloat(r.EstimatedAmount || 0); }, 0);
            var iDomestic = aData.filter(function (r) { return r.TravelType === "Domestic"; }).length;
            var iIntl = aData.filter(function (r) { return r.TravelType === "International"; }).length;

            var oFinanceModel = this.getView().getModel("financeModel");
            oFinanceModel.setProperty("/totalCount", aData.length);
            oFinanceModel.setProperty("/totalAmount", fTotal);
            oFinanceModel.setProperty("/totalAmountFormatted", "INR " + fTotal.toLocaleString("en-IN"));
            oFinanceModel.setProperty("/domesticCount", iDomestic);
            oFinanceModel.setProperty("/internationalCount", iIntl);
        },

        onFilterChange: function () {
            this._applyFilters();
        },

        onClearFilters: function () {
            var oEmpFilter = this.byId("filterEmployee");
            var oFromDate = this.byId("filterFromDate");
            var oToDate = this.byId("filterToDate");
            var oMinAmt = this.byId("filterMinAmount");
            if (oEmpFilter) { oEmpFilter.setValue(""); }
            if (oFromDate) { oFromDate.setValue(""); }
            if (oToDate) { oToDate.setValue(""); }
            if (oMinAmt) { oMinAmt.setValue(""); }
            this._applyFilters();
        },

        onExport: function () {
            // Simulated export - in production would use sap.ui.export
            var aData = this.getView().getModel("financeList").getData();
            var sCSV = "RequestId,EmployeeId,EmployeeName,TravelType,Destination,EstimatedAmount,Currency,Purpose\n";
            aData.forEach(function (r) {
                sCSV += [r.RequestId, r.EmployeeId, r.EmployeeName, r.TravelType,
                    r.Destination, r.EstimatedAmount, r.Currency, '"' + r.Purpose + '"'
                ].join(",") + "\n";
            });
            var oBlob = new Blob([sCSV], { type: "text/csv" });
            var sUrl = URL.createObjectURL(oBlob);
            var oLink = document.createElement("a");
            oLink.href = sUrl;
            oLink.download = "approved_expenses_" + new Date().toISOString().slice(0, 10) + ".csv";
            oLink.click();
            URL.revokeObjectURL(sUrl);
            ErrorHandler.showSuccess("Export completed successfully.");
        },

        onRefresh: function () {
            this._loadApprovedRequests();
        },

        onNavBack: function () {
            this.navigateTo("dashboard");
        }
    });
});
