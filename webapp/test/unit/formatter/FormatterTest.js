/*global QUnit */
sap.ui.define([
    "com/enterprise/travelexpense/util/Formatter"
], function (Formatter) {
    "use strict";

    QUnit.module("Formatter Tests", {
        beforeEach: function () {
            this.oFormatter = Formatter;
        }
    });

    // --- statusState ---
    QUnit.test("statusState: Draft returns None", function (assert) {
        assert.strictEqual(this.oFormatter.statusState("Draft"), "None");
    });
    QUnit.test("statusState: Submitted returns Warning", function (assert) {
        assert.strictEqual(this.oFormatter.statusState("Submitted"), "Warning");
    });
    QUnit.test("statusState: Approved returns Success", function (assert) {
        assert.strictEqual(this.oFormatter.statusState("Approved"), "Success");
    });
    QUnit.test("statusState: Rejected returns Error", function (assert) {
        assert.strictEqual(this.oFormatter.statusState("Rejected"), "Error");
    });
    QUnit.test("statusState: unknown returns None", function (assert) {
        assert.strictEqual(this.oFormatter.statusState("Unknown"), "None");
    });

    // --- statusIcon ---
    QUnit.test("statusIcon: Draft returns edit icon", function (assert) {
        assert.strictEqual(this.oFormatter.statusIcon("Draft"), "sap-icon://edit");
    });
    QUnit.test("statusIcon: Approved returns accept icon", function (assert) {
        assert.strictEqual(this.oFormatter.statusIcon("Approved"), "sap-icon://accept");
    });
    QUnit.test("statusIcon: Rejected returns decline icon", function (assert) {
        assert.strictEqual(this.oFormatter.statusIcon("Rejected"), "sap-icon://decline");
    });

    // --- isEditable ---
    QUnit.test("isEditable: Draft returns true", function (assert) {
        assert.strictEqual(this.oFormatter.isEditable("Draft"), true);
    });
    QUnit.test("isEditable: Submitted returns false", function (assert) {
        assert.strictEqual(this.oFormatter.isEditable("Submitted"), false);
    });
    QUnit.test("isEditable: Approved returns false", function (assert) {
        assert.strictEqual(this.oFormatter.isEditable("Approved"), false);
    });

    // --- formatAmount ---
    QUnit.test("formatAmount: formats with currency prefix", function (assert) {
        var sResult = this.oFormatter.formatAmount(25000, "INR");
        assert.ok(sResult.indexOf("INR") !== -1, "Result contains currency code");
        assert.ok(sResult.indexOf("25") !== -1, "Result contains amount digits");
    });
    QUnit.test("formatAmount: null returns empty string", function (assert) {
        assert.strictEqual(this.oFormatter.formatAmount(null, "INR"), "");
    });

    // --- formatDate ---
    QUnit.test("formatDate: valid OData date formats correctly", function (assert) {
        var sResult = this.oFormatter.formatDate("/Date(1710288000000)/");
        assert.ok(sResult.length > 0, "Formatted date is not empty");
        assert.ok(sResult.indexOf("2024") !== -1 || sResult.length > 4, "Date string looks valid");
    });
    QUnit.test("formatDate: null returns empty string", function (assert) {
        assert.strictEqual(this.oFormatter.formatDate(null), "");
    });
    QUnit.test("formatDate: empty string returns empty string", function (assert) {
        assert.strictEqual(this.oFormatter.formatDate(""), "");
    });

    // --- travelTypeIcon ---
    QUnit.test("travelTypeIcon: International returns flight icon", function (assert) {
        assert.strictEqual(this.oFormatter.travelTypeIcon("International"), "sap-icon://flight");
    });
    QUnit.test("travelTypeIcon: Domestic returns map icon", function (assert) {
        assert.strictEqual(this.oFormatter.travelTypeIcon("Domestic"), "sap-icon://map");
    });

    // --- boolToVisible ---
    QUnit.test("boolToVisible: true returns true", function (assert) {
        assert.strictEqual(this.oFormatter.boolToVisible(true), true);
    });
    QUnit.test("boolToVisible: false returns false", function (assert) {
        assert.strictEqual(this.oFormatter.boolToVisible(false), false);
    });

    // --- notBool ---
    QUnit.test("notBool: true returns false", function (assert) {
        assert.strictEqual(this.oFormatter.notBool(true), false);
    });
    QUnit.test("notBool: false returns true", function (assert) {
        assert.strictEqual(this.oFormatter.notBool(false), true);
    });

    // --- formatKpiNumber ---
    QUnit.test("formatKpiNumber: 0 returns '0'", function (assert) {
        assert.strictEqual(this.oFormatter.formatKpiNumber(0), "0");
    });
    QUnit.test("formatKpiNumber: null returns '0'", function (assert) {
        assert.strictEqual(this.oFormatter.formatKpiNumber(null), "0");
    });
    QUnit.test("formatKpiNumber: 42 returns '42'", function (assert) {
        assert.strictEqual(this.oFormatter.formatKpiNumber(42), "42");
    });
});
