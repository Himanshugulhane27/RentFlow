# AWS Infrastructure Setup
<!-- Updated on April 12, 2026 -->

## Required AWS Services

### DynamoDB Tables
1. **Properties**
   - Partition Key: propertyId
   - Attributes: address, rent, bedrooms, bathrooms, available

2. **Tenants**
   - Partition Key: tenantId
   - Attributes: name, email, phone, currentProperty

3. **Leases**
   - Partition Key: leaseId
   - Attributes: propertyId, tenantId, startDate, endDate, monthlyRent

### Lambda Functions
- `properties-api`: CRUD operations for properties
- `tenants-api`: Tenant management
- `leases-api`: Lease operations

### S3 Buckets
- `rental-system-images`: Property photos
- `rental-system-documents`: Lease documents

### API Gateway
- REST API with CORS enabled
- Routes: /properties, /tenants, /leases

## Deployment Commands
```bash
# Install Serverless Framework
npm install -g serverless

# Deploy infrastructure
serverless deploy
```