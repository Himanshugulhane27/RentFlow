const { success, error } = require('../utils/response');
const propertyService = require('../services/propertyService');
const { validateRequired } = require('../utils/validation');

exports.handler = async (event) => {
  try {
    const { httpMethod, pathParameters, body } = event;
    const propertyId = pathParameters?.id;

    switch (httpMethod) {
      case 'GET':
        if (propertyId) return success(await propertyService.getProperty(propertyId));
        return success(await propertyService.getAllProperties());
      case 'POST': {
        const data = JSON.parse(body);
        validateRequired(['address', 'rent'], data);
        return success(await propertyService.createProperty(data));
      }
      case 'PUT': {
        const data = JSON.parse(body);
        validateRequired(['address', 'rent'], data);
        return success(await propertyService.updateProperty(propertyId, data));
      }
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