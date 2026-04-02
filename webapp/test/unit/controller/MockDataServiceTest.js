/*global QUnit */
sap.ui.define([
    "com/enterprise/travelexpense/service/MockDataService"
], function (MockDataService) {
    "use strict";

    QUnit.module("MockDataService (Controller Logic) Tests", {
        beforeEach: function () {
            MockDataService.init();
        }
    });

    // --- getAllRequests ---
    QUnit.test("getAllRequests: returns array", function (assert) {
        var aResult = MockDataService.getAllRequests();
        assert.ok(Array.isArray(aResult), "Result is an array");
        assert.ok(aResult.length > 0, "Result has items");
    });

    // --- getRequestById ---
    QUnit.test("getRequestById: returns correct request", function (assert) {
        var oReq = MockDataService.getRequestById("REQ001");
        assert.ok(oReq, "Request found");
        assert.strictEqual(oReq.RequestId, "REQ001", "RequestId matches");
    });
    QUnit.test("getRequestById: unknown ID returns null", function (assert) {
        var oReq = MockDataService.getRequestById("REQ999");
        assert.strictEqual(oReq, null, "Null returned for unknown ID");
    });

    // --- getRequestsByEmployee ---
    QUnit.test("getRequestsByEmployee: filters by employee", function (assert) {
        var aResult = MockDataService.getRequestsByEmployee("EMP001");
        assert.ok(Array.isArray(aResult), "Result is an array");
        aResult.forEach(function (r) {
            assert.strictEqual(r.EmployeeId, "EMP001", "All requests belong to EMP001");
        });
    });

    // --- getSubmittedRequests ---
    QUnit.test("getSubmittedRequests: only returns Submitted status", function (assert) {
        var aResult = MockDataService.getSubmittedRequests();
        aResult.forEach(function (r) {
            assert.strictEqual(r.Status, "Submitted", "Status is Submitted");
        });
    });

    // --- getApprovedRequests ---
    QUnit.test("getApprovedRequests: only returns Approved status", function (assert) {
        var aResult = MockDataService.getApprovedRequests();
        aResult.forEach(function (r) {
            assert.strictEqual(r.Status, "Approved", "Status is Approved");
        });
    });

    // --- getDashboardKPIs ---
    QUnit.test("getDashboardKPIs: returns correct structure", function (assert) {
        var oKPIs = MockDataService.getDashboardKPIs();
        assert.ok(oKPIs.hasOwnProperty("totalRequests"), "Has totalRequests");
        assert.ok(oKPIs.hasOwnProperty("pendingApproval"), "Has pendingApproval");
        assert.ok(oKPIs.hasOwnProperty("approved"), "Has approved");
        assert.ok(oKPIs.hasOwnProperty("rejected"), "Has rejected");
        assert.strictEqual(
            oKPIs.totalRequests,
            oKPIs.pendingApproval + oKPIs.approved + oKPIs.rejected + MockDataService.getAllRequests().filter(function(r){ return r.Status === "Draft"; }).length,
            "KPI counts add up correctly"
        );
    });

    // --- createRequest ---
    QUnit.test("createRequest: creates a new draft request", function (assert) {
        var iCountBefore = MockDataService.getAllRequests().length;
        var oNew = MockDataService.createRequest({
            EmployeeId: "EMP001",
            EmployeeName: "Test User",
            TravelType: "Domestic",
            Destination: "Pune",
            EstimatedAmount: 5000,
            Currency: "INR",
            Purpose: "Unit test travel"
        });
        var iCountAfter = MockDataService.getAllRequests().length;
        assert.ok(oNew.RequestId, "New request has an ID");
        assert.strictEqual(oNew.Status, "Draft", "New request status is Draft");
        assert.strictEqual(iCountAfter, iCountBefore + 1, "Total count increased by 1");
    });

    // --- submitRequest ---
    QUnit.test("submitRequest: changes Draft to Submitted", function (assert) {
        var oCreated = MockDataService.createRequest({
            EmployeeId: "EMP001",
            EmployeeName: "Test User",
            TravelType: "Domestic",
            Destination: "Kolkata",
            EstimatedAmount: 3000,
            Currency: "INR",
            Purpose: "Submit test"
        });
        var oSubmitted = MockDataService.submitRequest(oCreated.RequestId);
        assert.strictEqual(oSubmitted.Status, "Submitted", "Status changed to Submitted");
    });

    QUnit.test("submitRequest: throws on non-Draft request", function (assert) {
        assert.throws(function () {
            MockDataService.submitRequest("REQ002"); // REQ002 is Approved
        }, "Throws for non-Draft request");
    });

    // --- approveRequest ---
    QUnit.test("approveRequest: changes Submitted to Approved", function (assert) {
        var oCreated = MockDataService.createRequest({
            EmployeeId: "EMP001", EmployeeName: "Test", TravelType: "Domestic",
            Destination: "Nagpur", EstimatedAmount: 2000, Currency: "INR", Purpose: "Approve test"
        });
        MockDataService.submitRequest(oCreated.RequestId);
        var oApproved = MockDataService.approveRequest(oCreated.RequestId, "Looks good");
        assert.strictEqual(oApproved.Status, "Approved", "Status changed to Approved");
        assert.strictEqual(oApproved.Remarks, "Looks good", "Remarks saved");
    });

    // --- rejectRequest ---
    QUnit.test("rejectRequest: changes Submitted to Rejected", function (assert) {
        var oCreated = MockDataService.createRequest({
            EmployeeId: "EMP001", EmployeeName: "Test", TravelType: "Domestic",
            Destination: "Jaipur", EstimatedAmount: 1500, Currency: "INR", Purpose: "Reject test"
        });
        MockDataService.submitRequest(oCreated.RequestId);
        var oRejected = MockDataService.rejectRequest(oCreated.RequestId, "Budget exceeded");
        assert.strictEqual(oRejected.Status, "Rejected", "Status changed to Rejected");
    });

    QUnit.test("rejectRequest: throws if remarks are empty", function (assert) {
        var oCreated = MockDataService.createRequest({
            EmployeeId: "EMP001", EmployeeName: "Test", TravelType: "Domestic",
            Destination: "Surat", EstimatedAmount: 1200, Currency: "INR", Purpose: "Remarks test"
        });
        MockDataService.submitRequest(oCreated.RequestId);
        assert.throws(function () {
            MockDataService.rejectRequest(oCreated.RequestId, "");
        }, "Throws when remarks are empty");
    });

    // --- updateRequest ---
    QUnit.test("updateRequest: throws if status is not Draft", function (assert) {
        assert.throws(function () {
            MockDataService.updateRequest("REQ002", { Destination: "New Place" });
        }, "Throws when trying to update non-Draft request");
    });
});
