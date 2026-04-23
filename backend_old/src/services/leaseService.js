const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const Lease = require('../models/Lease');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const LEASES_TABLE = process.env.LEASES_TABLE;

class LeaseService {
  async createLease(data) {
    const lease = new Lease({ ...data, leaseId: uuidv4() });
    lease.validate();
    await dynamodb.put({ TableName: LEASES_TABLE, Item: lease }).promise();
    return lease;
  }

  async getLease(leaseId) {
    const result = await dynamodb.get({ TableName: LEASES_TABLE, Key: { leaseId } }).promise();
    if (!result.Item) throw new Error('Lease not found');
    return result.Item;
  }

  async getAllLeases() {
    const result = await dynamodb.scan({ TableName: LEASES_TABLE }).promise();
    return result.Items;
  }

  async updateLease(leaseId, data) {
    const params = {
      TableName: LEASES_TABLE,
      Key: { leaseId },
      UpdateExpression: 'SET #s = :status, endDate = :endDate, monthlyRent = :monthlyRent',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: {
        ':status': data.status,
        ':endDate': data.endDate,
        ':monthlyRent': data.monthlyRent
      },
      ReturnValues: 'ALL_NEW'
    };
    const result = await dynamodb.update(params).promise();
    return result.Attributes;
  }

  async deleteLease(leaseId) {
    await dynamodb.delete({ TableName: LEASES_TABLE, Key: { leaseId } }).promise();
  }
}

module.exports = new LeaseService();