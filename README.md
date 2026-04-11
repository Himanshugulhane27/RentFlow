# Rental Management System

A full-stack rental property management app built with React and AWS serverless backend.

Last updated: April 11, 2026

## What it does

- Manage rental properties — add, edit, delete, toggle availability
- Manage tenants — add, edit, delete, view detail modal with lease and payment history
- Track leases — create leases with property/tenant dropdowns, terminate leases, see expiry warnings
- Track payments — add payment records, mark as paid, see overdue highlights
- Dashboard — live stats, occupancy rate bar, revenue breakdown by property

## Tech Stack

- **Frontend**: React 18, React Router v6, Context API
- **Backend**: Node.js, AWS Lambda, DynamoDB
- **Deployment**: Serverless Framework
- **Storage**: AWS S3

## Project Structure

```
rental-management-system/
├── backend/
│   ├── src/
│   │   ├── handlers/       # Lambda functions (properties, tenants, leases, payments)
│   │   ├── models/         # Property, Tenant, Lease, Payment
│   │   ├── services/       # DynamoDB business logic
│   │   ├── utils/          # response, validation, errorHandler, dbHelper
│   │   └── config/
│   ├── tests/              # Unit tests for all models
│   └── serverless.yml
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, PropertyList, TenantList, Toast, ConfirmDialog, TenantModal
│   │   ├── context/        # AppContext — global state
│   │   ├── hooks/          # useToast
│   │   ├── pages/          # Dashboard, Properties, Tenants, Leases, Payments, NotFound
│   │   └── services/       # api.js
│   └── public/
├── docs/
│   ├── api.md
│   ├── deployment.md
│   └── project-overview.md
└── infrastructure/
    └── aws-setup.md
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
serverless deploy
```

### Environment Setup
```bash
cp frontend/.env.example frontend/.env
```
Update `REACT_APP_API_URL` with your deployed API Gateway URL.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | /properties | List or create properties |
| PUT/DELETE | /properties/{id} | Update or delete a property |
| GET/POST | /tenants | List or create tenants |
| PUT/DELETE | /tenants/{id} | Update or delete a tenant |
| GET/POST | /leases | List or create leases |
| PUT/DELETE | /leases/{id} | Update or terminate a lease |
| GET/POST | /payments | List or create payments |
| PUT/DELETE | /payments/{id} | Mark paid or delete a payment |

## Features Completed

- [x] Property CRUD with availability toggle and inline edit
- [x] Tenant CRUD with inline edit and detail modal
- [x] Lease management with expiry warnings and terminate action
- [x] Payment tracking with overdue detection
- [x] Dashboard with live stats, occupancy rate, revenue breakdown
- [x] Toast notifications on all actions
- [x] Confirm dialog before delete
- [x] Search and filter on properties and tenants
- [x] Sort properties by rent
- [x] Responsive navbar with mobile menu
- [x] 404 page
- [x] Full backend CRUD for all 4 entities
- [x] Unit tests for all models
Last updated: April 10, 2026
Version 1.0