# Backend API

## Setup
```bash
npm install
```

## Environment Variables
- `PROPERTIES_TABLE`: DynamoDB table for properties
- `TENANTS_TABLE`: DynamoDB table for tenants
- `LEASES_TABLE`: DynamoDB table for leases

## Deploy
```bash
serverless deploy
```

## Local Testing
```bash
serverless invoke local -f properties
```