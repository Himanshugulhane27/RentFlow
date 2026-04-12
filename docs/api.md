# API Documentation

Last updated: April 12, 2026

## Base URL
`https://your-api-gateway-url.amazonaws.com/dev`

## Endpoints

### Properties

**GET /properties**
- Returns all properties
- Response: `{ success: true, data: [...] }`

**POST /properties**
- Create new property
- Body: `{ address, rent, bedrooms, bathrooms }`
- Response: `{ success: true, data: {...} }`

### Tenants

**GET /tenants**
- Returns all tenants
- Response: `{ success: true, data: [...] }`

**POST /tenants**
- Create new tenant
- Body: `{ name, email, phone }`
- Response: `{ success: true, data: {...} }`

## Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```