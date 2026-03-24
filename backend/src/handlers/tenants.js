const { success, error } = require('../utils/response');
const tenantService = require('../services/tenantService');
const { validateRequired, validateEmail } = require('../utils/validation');

exports.handler = async (event) => {
  try {
    const { httpMethod, pathParameters, body } = event;
    const tenantId = pathParameters?.id;

    switch (httpMethod) {
      case 'GET':
        if (tenantId) return success(await tenantService.getTenant(tenantId));
        return success(await tenantService.getAllTenants());
      case 'POST': {
        const data = JSON.parse(body);
        validateRequired(['name', 'email'], data);
        if (!validateEmail(data.email)) throw new Error('Invalid email address');
        return success(await tenantService.createTenant(data));
      }
      case 'PUT': {
        const data = JSON.parse(body);
        validateRequired(['name', 'email'], data);
        if (!validateEmail(data.email)) throw new Error('Invalid email address');
        return success(await tenantService.updateTenant(tenantId, data));
      }
      case 'DELETE':
        await tenantService.deleteTenant(tenantId);
        return success({ message: 'Tenant deleted' });
      default:
        return error('Method not allowed');
    }
  } catch (err) {
    return error(err.message);
  }
};