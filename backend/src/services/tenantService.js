const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const Tenant = require('../models/Tenant');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TENANTS_TABLE = process.env.TENANTS_TABLE;

class TenantService {
  async createTenant(data) {
    const tenant = new Tenant({ ...data, tenantId: uuidv4() });
    tenant.validate();
    await dynamodb.put({ TableName: TENANTS_TABLE, Item: tenant }).promise();
    return tenant;
  }

  async getTenant(tenantId) {
    const result = await dynamodb.get({ TableName: TENANTS_TABLE, Key: { tenantId } }).promise();
    if (!result.Item) throw new Error('Tenant not found');
    return result.Item;
  }

  async getAllTenants() {
    const result = await dynamodb.scan({ TableName: TENANTS_TABLE }).promise();
    return result.Items;
  }

  async updateTenant(tenantId, data) {
    const params = {
      TableName: TENANTS_TABLE,
      Key: { tenantId },
      UpdateExpression: 'SET #n = :name, email = :email, phone = :phone',
      ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues: {
        ':name': data.name,
        ':email': data.email,
        ':phone': data.phone
      },
      ReturnValues: 'ALL_NEW'
    };
    const result = await dynamodb.update(params).promise();
    return result.Attributes;
  }

  async deleteTenant(tenantId) {
    await dynamodb.delete({ TableName: TENANTS_TABLE, Key: { tenantId } }).promise();
  }
}

module.exports = new TenantService();