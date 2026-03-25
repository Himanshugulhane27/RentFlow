const { success } = require('../utils/response');
const { handleError, AppError } = require('../utils/errorHandler');
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
        if (!validateEmail(data.email)) throw new AppError('Invalid email address', 400);
        return success(await tenantService.createTenant(data));
      }
      case 'PUT': {
        const data = JSON.parse(body);
        validateRequired(['name', 'email'], data);
        if (!validateEmail(data.email)) throw new AppError('Invalid email address', 400);
        return success(await tenantService.updateTenant(tenantId, data));
      }
      case 'DELETE':
        await tenantService.deleteTenant(tenantId);
        return success({ message: 'Tenant deleted' });
      default:
        throw new AppError('Method not allowed', 405);
    }
  } catch (err) {
    return handleError(err);
  }
};