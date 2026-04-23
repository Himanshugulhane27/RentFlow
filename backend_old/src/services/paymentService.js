const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const PAYMENTS_TABLE = process.env.PAYMENTS_TABLE;

class PaymentService {
  async createPayment(data) {
    const payment = new Payment({ ...data, paymentId: uuidv4() });
    payment.validate();
    await dynamodb.put({ TableName: PAYMENTS_TABLE, Item: payment }).promise();
    return payment;
  }

  async getPayment(paymentId) {
    const result = await dynamodb.get({ TableName: PAYMENTS_TABLE, Key: { paymentId } }).promise();
    if (!result.Item) throw new Error('Payment not found');
    return result.Item;
  }

  async getAllPayments() {
    const result = await dynamodb.scan({ TableName: PAYMENTS_TABLE }).promise();
    return result.Items;
  }

  async markPaymentPaid(paymentId) {
    const params = {
      TableName: PAYMENTS_TABLE,
      Key: { paymentId },
      UpdateExpression: 'SET #s = :status, paidDate = :paidDate',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: {
        ':status': 'paid',
        ':paidDate': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };
    const result = await dynamodb.update(params).promise();
    return result.Attributes;
  }

  async deletePayment(paymentId) {
    await dynamodb.delete({ TableName: PAYMENTS_TABLE, Key: { paymentId } }).promise();
  }
}

module.exports = new PaymentService();