const { success, error } = require('../utils/response');
const propertyService = require('../services/propertyService');

exports.handler = async (event) => {
  try {
    const { httpMethod, pathParameters, body } = event;
    const propertyId = pathParameters?.id;

    switch (httpMethod) {
      case 'GET':
        if (propertyId) {
          return success(await propertyService.getProperty(propertyId));
        }
        return success(await propertyService.getAllProperties());
      case 'POST':
        return success(await propertyService.createProperty(JSON.parse(body)));
      case 'PUT':
        return success(await propertyService.updateProperty(propertyId, JSON.parse(body)));
      case 'DELETE':
        await propertyService.deleteProperty(propertyId);
        return success({ message: 'Property deleted' });
      default:
        return error('Method not allowed');
    }
  } catch (err) {
    return error(err.message);
  }
};