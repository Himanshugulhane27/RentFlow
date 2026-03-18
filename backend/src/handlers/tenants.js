const { success, error } = require('../utils/response');
const tenantService = require('../services/tenantService');

exports.handler = async (event) => {
  try {
    const { httpMethod, pathParameters, body } = event;
    const tenantId = pathParameters?.id;

    switch (httpMethod) {
      case 'GET':
        if (tenantId) {
          return success(await tenantService.getTenant(tenantId));
        }
        return success(await tenantService.getAllTenants());
      case 'POST':
        return success(await tenantService.createTenant(JSON.parse(body)));
      case 'PUT':
        return success(await tenantService.updateTenant(tenantId, JSON.parse(body)));
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