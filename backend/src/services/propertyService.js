const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const Property = require('../models/Property');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const PROPERTIES_TABLE = process.env.PROPERTIES_TABLE;

class PropertyService {
  async createProperty(data) {
    const property = new Property({ ...data, propertyId: uuidv4() });
    property.validate();
    await dynamodb.put({ TableName: PROPERTIES_TABLE, Item: property }).promise();
    return property;
  }

  async getProperty(propertyId) {
    const result = await dynamodb.get({ TableName: PROPERTIES_TABLE, Key: { propertyId } }).promise();
    if (!result.Item) throw new Error('Property not found');
    return result.Item;
  }

  async getAllProperties() {
    const result = await dynamodb.scan({ TableName: PROPERTIES_TABLE }).promise();
    return result.Items;
  }

  async updateProperty(propertyId, data) {
    const params = {
      TableName: PROPERTIES_TABLE,
      Key: { propertyId },
      UpdateExpression: 'SET address = :address, rent = :rent, bedrooms = :bedrooms, bathrooms = :bathrooms, available = :available',
      ExpressionAttributeValues: {
        ':address': data.address,
        ':rent': data.rent,
        ':bedrooms': data.bedrooms,
        ':bathrooms': data.bathrooms,
        ':available': data.available
      },
      ReturnValues: 'ALL_NEW'
    };
    const result = await dynamodb.update(params).promise();
    return result.Attributes;
  }

  async deleteProperty(propertyId) {
    await dynamodb.delete({ TableName: PROPERTIES_TABLE, Key: { propertyId } }).promise();
  }
}

module.exports = new PropertyService();