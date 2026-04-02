sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function () {
    "use strict";

    var _oData = {
        TravelRequests: [
            {
                RequestId: "REQ001",
                EmployeeId: "EMP001",
                EmployeeName: "John Employee",
                TravelType: "Domestic",
                StartDate: "/Date(1710288000000)/",
                EndDate: "/Date(1710547200000)/",
                Destination: "Mumbai",
                EstimatedAmount: 25000,
                Currency: "INR",
                Purpose: "Client Meeting and product demo at HQ",
                Status: "Submitted",
                Remarks: "",
                CreatedAt: "/Date(1709856000000)/",
                UpdatedAt: "/Date(1709856000000)/"
            },
            {
                RequestId: "REQ002",
                EmployeeId: "EMP001",
                EmployeeName: "John Employee",
                TravelType: "International",
                StartDate: "/Date(1711497600000)/",
                EndDate: "/Date(1711843200000)/",
                Destination: "Singapore",
                EstimatedAmount: 150000,
                Currency: "INR",
                Purpose: "Annual Technology Conference 2024",
                Status: "Approved",
                Remarks: "Approved. Please book economy class.",
                CreatedAt: "/Date(1709942400000)/",
                UpdatedAt: "/Date(1710028800000)/"
            },
            {
                RequestId: "REQ003",
                EmployeeId: "EMP001",
                EmployeeName: "John Employee",
                TravelType: "Domestic",
                StartDate: "/Date(1712102400000)/",
                EndDate: "/Date(1712188800000)/",
                Destination: "Bengaluru",
                EstimatedAmount: 8000,
                Currency: "INR",
                Purpose: "Internal team training workshop",
                Status: "Draft",
                Remarks: "",
                CreatedAt: "/Date(1710115200000)/",
                UpdatedAt: "/Date(1710115200000)/"
            },
            {
                RequestId: "REQ004",
                EmployeeId: "EMP002",
                EmployeeName: "Alice Manager",
                TravelType: "Domestic",
                StartDate: "/Date(1710374400000)/",
                EndDate: "/Date(1710460800000)/",
                Destination: "Delhi",
                EstimatedAmount: 18000,
                Currency: "INR",
                Purpose: "Quarterly Business Review Meeting",
                Status: "Submitted",
                Remarks: "",
                CreatedAt: "/Date(1709942400000)/",
                UpdatedAt: "/Date(1709942400000)/"
            },
            {
                RequestId: "REQ005",
                EmployeeId: "EMP003",
                EmployeeName: "Bob Finance",
                TravelType: "International",
                StartDate: "/Date(1712966400000)/",
                EndDate: "/Date(1713484800000)/",
                Destination: "Dubai",
                EstimatedAmount: 200000,
                Currency: "INR",
                Purpose: "Finance Summit and regulatory compliance workshop",
                Status: "Rejected",
                Remarks: "Budget not available for international travel in Q1. Please resubmit in Q2.",
                CreatedAt: "/Date(1710201600000)/",
                UpdatedAt: "/Date(1710288000000)/"
            },
            {
                RequestId: "REQ006",
                EmployeeId: "EMP004",
                EmployeeName: "Carol Developer",
                TravelType: "Domestic",
                StartDate: "/Date(1713139200000)/",
                EndDate: "/Date(1713225600000)/",
                Destination: "Hyderabad",
                EstimatedAmount: 12000,
                Currency: "INR",
                Purpose: "SAP UI5 training and certification",
                Status: "Submitted",
                Remarks: "",
                CreatedAt: "/Date(1710374400000)/",
                UpdatedAt: "/Date(1710374400000)/"
            },
            {
                RequestId: "REQ007",
                EmployeeId: "EMP005",
                EmployeeName: "David HR",
                TravelType: "Domestic",
                StartDate: "/Date(1713312000000)/",
                EndDate: "/Date(1713571200000)/",
                Destination: "Chennai",
                EstimatedAmount: 30000,
                Currency: "INR",
                Purpose: "HR Policy rollout and employee onboarding sessions",
                Status: "Approved",
                Remarks: "Approved. Please submit receipts within 7 days of return.",
                CreatedAt: "/Date(1710460800000)/",
                UpdatedAt: "/Date(1710547200000)/"
            }
        ]
    };

    var MockDataService = {

        init: function () {
            this._loadFromStorage();
        },

        _loadFromStorage: function () {
            try {
                var sStored = localStorage.getItem("travelExpenseData");
                if (sStored) {
                    _oData = JSON.parse(sStored);
                }
            } catch (e) {
                // Use default data
            }
        },

        _saveToStorage: function () {
            try {
                localStorage.setItem("travelExpenseData", JSON.stringify(_oData));
            } catch (e) {
                // Ignore storage errors
            }
        },

        _generateId: function () {
            var iMax = _oData.TravelRequests.reduce(function (acc, req) {
                var iNum = parseInt(req.RequestId.replace("REQ", ""), 10);
                return iNum > acc ? iNum : acc;
            }, 0);
            return "REQ" + String(iMax + 1).padStart(3, "0");
        },

        _dateToOData: function (oDate) {
            if (!oDate) { return null; }
            return "/Date(" + oDate.getTime() + ")/";
        },

        _odataToDate: function (sODataDate) {
            if (!sODataDate) { return null; }
            var match = /\/Date\((\d+)\)\//.exec(sODataDate);
            return match ? new Date(parseInt(match[1], 10)) : null;
        },

        getAllRequests: function () {
            return _oData.TravelRequests.map(function (req) {
                return Object.assign({}, req);
            });
        },

        getRequestById: function (sId) {
            var oReq = _oData.TravelRequests.find(function (r) { return r.RequestId === sId; });
            return oReq ? Object.assign({}, oReq) : null;
        },

        getRequestsByEmployee: function (sEmployeeId) {
            return _oData.TravelRequests
                .filter(function (r) { return r.EmployeeId === sEmployeeId; })
                .map(function (r) { return Object.assign({}, r); });
        },

        getSubmittedRequests: function () {
            return _oData.TravelRequests
                .filter(function (r) { return r.Status === "Submitted"; })
                .map(function (r) { return Object.assign({}, r); });
        },

        getApprovedRequests: function () {
            return _oData.TravelRequests
                .filter(function (r) { return r.Status === "Approved"; })
                .map(function (r) { return Object.assign({}, r); });
        },

        getDashboardKPIs: function () {
            var aAll = _oData.TravelRequests;
            return {
                totalRequests: aAll.length,
                pendingApproval: aAll.filter(function (r) { return r.Status === "Submitted"; }).length,
                approved: aAll.filter(function (r) { return r.Status === "Approved"; }).length,
                rejected: aAll.filter(function (r) { return r.Status === "Rejected"; }).length
            };
        },

        createRequest: function (oData) {
            var oNew = Object.assign({}, oData, {
                RequestId: this._generateId(),
                Status: "Draft",
                CreatedAt: this._dateToOData(new Date()),
                UpdatedAt: this._dateToOData(new Date())
            });
            _oData.TravelRequests.push(oNew);
            this._saveToStorage();
            return Object.assign({}, oNew);
        },

        updateRequest: function (sId, oData) {
            var iIdx = _oData.TravelRequests.findIndex(function (r) { return r.RequestId === sId; });
            if (iIdx === -1) {
                throw new Error("Request not found: " + sId);
            }
            var oExisting = _oData.TravelRequests[iIdx];
            if (oExisting.Status !== "Draft") {
                throw new Error("Only Draft requests can be edited.");
            }
            _oData.TravelRequests[iIdx] = Object.assign({}, oExisting, oData, {
                UpdatedAt: this._dateToOData(new Date())
            });
            this._saveToStorage();
            return Object.assign({}, _oData.TravelRequests[iIdx]);
        },

        submitRequest: function (sId) {
            var iIdx = _oData.TravelRequests.findIndex(function (r) { return r.RequestId === sId; });
            if (iIdx === -1) { throw new Error("Request not found."); }
            if (_oData.TravelRequests[iIdx].Status !== "Draft") {
                throw new Error("Only Draft requests can be submitted.");
            }
            _oData.TravelRequests[iIdx].Status = "Submitted";
            _oData.TravelRequests[iIdx].UpdatedAt = this._dateToOData(new Date());
            this._saveToStorage();
            return Object.assign({}, _oData.TravelRequests[iIdx]);
        },

        approveRequest: function (sId, sRemarks) {
            var iIdx = _oData.TravelRequests.findIndex(function (r) { return r.RequestId === sId; });
            if (iIdx === -1) { throw new Error("Request not found."); }
            _oData.TravelRequests[iIdx].Status = "Approved";
            _oData.TravelRequests[iIdx].Remarks = sRemarks || "";
            _oData.TravelRequests[iIdx].UpdatedAt = this._dateToOData(new Date());
            this._saveToStorage();
            return Object.assign({}, _oData.TravelRequests[iIdx]);
        },

        rejectRequest: function (sId, sRemarks) {
            var iIdx = _oData.TravelRequests.findIndex(function (r) { return r.RequestId === sId; });
            if (iIdx === -1) { throw new Error("Request not found."); }
            if (!sRemarks || sRemarks.trim() === "") {
                throw new Error("Remarks are mandatory for rejection.");
            }
            _oData.TravelRequests[iIdx].Status = "Rejected";
            _oData.TravelRequests[iIdx].Remarks = sRemarks;
            _oData.TravelRequests[iIdx].UpdatedAt = this._dateToOData(new Date());
            this._saveToStorage();
            return Object.assign({}, _oData.TravelRequests[iIdx]);
        },

        bulkApprove: function (aIds, sRemarks) {
            var that = this;
            var aResults = [];
            aIds.forEach(function (sId) {
                try {
                    aResults.push(that.approveRequest(sId, sRemarks));
                } catch (e) {
                    aResults.push({ RequestId: sId, error: e.message });
                }
            });
            return aResults;
        },

        resetData: function () {
            localStorage.removeItem("travelExpenseData");
            this._loadFromStorage();
        }
    };

    return MockDataService;
});
