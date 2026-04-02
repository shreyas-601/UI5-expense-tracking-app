# Travel & Expense Management
### Enterprise SAP UI5 Fiori Application

---

## Application Overview

A fully functional, enterprise-grade **SAP UI5 Fiori** application for managing employee travel and expense requests. Built to simulate a real S/4HANA landscape implementation with MVC architecture, role-based access control, mock OData service, and full CRUD workflow.

---

## Architecture

```
com.enterprise.travelexpense
├── Component.js              ← App component (bootstrapping, model init)
├── manifest.json             ← App descriptor (routing, models, data sources)
├── index.html                ← Entry point
├── ui5.yaml                  ← UI5 Tooling / BAS configuration
│
└── webapp/
    ├── controller/
    │   ├── BaseController.js       ← Shared helpers (router, models, i18n)
    │   ├── App.controller.js       ← Root shell controller
    │   ├── Dashboard.controller.js ← KPI tiles, role switching, navigation
    │   ├── RequestList.controller.js   ← List + search + status filter
    │   ├── RequestDetail.controller.js ← Create / Edit / View (full CRUD)
    │   ├── ManagerApproval.controller.js ← Approve / Reject / Bulk actions
    │   └── FinanceView.controller.js     ← Read-only approved expenses + export
    │
    ├── view/
    │   ├── App.view.xml            ← Shell container
    │   ├── Dashboard.view.xml      ← KPI tiles + quick actions
    │   ├── RequestList.view.xml    ← List Report-style screen
    │   ├── RequestDetail.view.xml  ← Object Page (Create/Edit/View)
    │   ├── ManagerApproval.view.xml← Multi-select approval list
    │   └── FinanceView.view.xml    ← Finance read-only + filter bar
    │
    ├── model/
    │   ├── models.js               ← JSONModel factory (device, appState, request)
    │   └── appState.json           ← Initial app state seed
    │
    ├── service/
    │   └── MockDataService.js      ← Complete mock OData backend with localStorage persistence
    │
    ├── util/
    │   ├── Formatter.js            ← All data formatters (date, amount, status, icons)
    │   ├── Validator.js            ← Field-level & form-level validation with ValueState
    │   └── ErrorHandler.js         ← Global MessageBox/MessageToast error handling
    │
    ├── css/
    │   └── style.css               ← Fiori-compliant custom styles
    │
    ├── i18n/
    │   └── i18n.properties         ← All UI text (zero hardcoding)
    │
    ├── localService/
    │   └── metadata.xml            ← OData V2 metadata definition
    │
    └── test/
        └── unit/
            ├── unitTests.qunit.html
            ├── formatter/FormatterTest.js        ← 15 formatter unit tests
            └── controller/MockDataServiceTest.js ← 15 service/controller tests
```

---

## Key Design Decisions

| Concern | Decision |
|---|---|
| Architecture | MVC + BaseController pattern |
| State Management | Centralized `appState` JSONModel |
| Backend | MockDataService with localStorage persistence |
| Routing | Semantic routing via manifest.json |
| Validation | Utility-based with ValueState feedback |
| Error Handling | Global ErrorHandler (MessageBox/MessageToast) |
| Texts | 100% i18n — zero hardcoded strings in XML/JS |
| Logic | Zero logic inside XML views |
| Formatting | All in Formatter.js utility |
| UX | Object Page + List Report Fiori patterns |

---

## Role-Based Behavior

| Role | Dashboard | Create/Edit | Submit | Approve/Reject | Finance View |
|---|---|---|---|---|---|
| **Employee** | ✅ Own KPIs | ✅ | ✅ | ❌ | ❌ |
| **Manager** | ✅ All KPIs | ❌ | ❌ | ✅ | ❌ |
| **Finance** | ✅ All KPIs | ❌ | ❌ | ❌ | ✅ |

Switch roles using the **dropdown in the Dashboard header** (simulates SSO role injection).

---

## Status Workflow

```
[Draft] ──submit──▶ [Submitted] ──approve──▶ [Approved]
                         │
                      reject
                         │
                         ▼
                      [Rejected]
```

- Only **Draft** requests can be edited or submitted
- Only **Submitted** requests can be approved/rejected
- Manager can approve/reject individually or in **bulk**

---

## How to Run in SAP Business Application Studio (BAS)

### Prerequisites
- SAP Business Application Studio with UI5 extension
- Node.js ≥ 18

### Steps

```bash
# 1. Clone or import the project into BAS workspace
# 2. Open a terminal in the project root

# 3. Install dependencies
npm install

# 4. Start the application
npm start
# Opens: http://localhost:8080/index.html

# 5. Run unit tests
npm test
# Opens: http://localhost:8080/test/unit/unitTests.qunit.html
```

### Alternative: Open with BAS built-in preview
1. Right-click `webapp/index.html`
2. Select **"Preview Application"** → **"Start index.html"**

---

## Features Checklist

### ✅ Dashboard
- KPI tiles: Total / Pending / Approved / Rejected
- Tile click navigation
- Role switcher (Employee / Manager / Finance)
- Recent activity list
- Role-specific quick action buttons

### ✅ Employee Flow
- Create travel request with all mandatory fields
- Auto-populated Employee ID & Name
- Domestic / International travel type
- Date range picker with validation
- Amount + Currency selection
- Purpose (mandatory, 500 char limit)
- Edit only if Status = Draft
- Submit with confirmation dialog
- View full request history

### ✅ Manager Approval
- List of all Submitted requests
- Search by name / ID / destination
- Individual approve with remarks
- Individual reject (remarks mandatory)
- **Bulk approve / reject** with remarks dialog
- Selection counter in toolbar
- Refresh capability

### ✅ Finance View
- Read-only list of Approved requests
- Filter by: Employee ID/Name, Date range, Min amount
- Summary panel: Total count, Total amount, Domestic/International split
- **CSV Export** functionality
- Clear filters button

### ✅ Technical
- MVC + BaseController inheritance
- Component-based bootstrapping
- Semantic routing with History
- Reusable Formatter, Validator, ErrorHandler utilities
- i18n for all texts
- QUnit tests (formatter + service)
- Fiori Object Page + List Report UX patterns
- Responsive layout (mobile/tablet/desktop)
- Busy indicators on all async operations
- ValueState validation feedback
- localStorage persistence across page refreshes

---

## OData Entities

### TravelRequest
| Property | Type | Description |
|---|---|---|
| RequestId | String (PK) | Auto-generated (REQ001...) |
| EmployeeId | String | Employee identifier |
| EmployeeName | String | Display name |
| TravelType | String | Domestic / International |
| StartDate | DateTime | Trip start |
| EndDate | DateTime | Trip end |
| Destination | String | City / Country |
| EstimatedAmount | Decimal | Budget estimate |
| Currency | String | INR, USD, EUR, etc. |
| Purpose | String | Mandatory trip purpose |
| Status | String | Draft/Submitted/Approved/Rejected |
| Remarks | String | Manager comments |
| CreatedAt | DateTime | Creation timestamp |
| UpdatedAt | DateTime | Last update timestamp |

---

## Validation Rules

| Field | Rule |
|---|---|
| Destination | Mandatory |
| Purpose | Mandatory |
| Start Date | Mandatory |
| End Date | Mandatory, must be ≥ Start Date |
| Estimated Amount | Mandatory, > 0, ≤ 1,00,00,000 |
| Reject Remarks | Mandatory when rejecting |

---

## Evaluation Criteria Coverage

| Area | Implementation |
|---|---|
| **Architecture & Structure (25%)** | MVC, BaseController, Component, manifest routing, clean folders |
| **UI5 Concepts (25%)** | JSONModel, TwoWay binding, Formatters, Fragments/Dialogs, Routing, i18n, Busy indicators |
| **Business Logic (20%)** | Full status workflow, role-based access, CRUD, bulk approval, validation |
| **Code Quality (20%)** | No logic in XML, utility classes, zero hardcoding, reusable components |
| **UX & Fiori (10%)** | Object Page, List Report, Horizon theme, responsive, MessageBox/Toast |
