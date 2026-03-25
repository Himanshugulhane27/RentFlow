const { success } = require('../utils/response');
const { handleError, AppError } = require('../utils/errorHandler');
const leaseService = require('../services/leaseService');
const { validateRequired } = require('../utils/validation');

exports.handler = async (event) => {
  try {
    const { httpMethod, pathParameters, body } = event;
    const leaseId = pathParameters?.id;

    switch (httpMethod) {
      case 'GET':
        if (leaseId) return success(await leaseService.getLease(leaseId));
        return success(await leaseService.getAllLeases());
      case 'POST': {
        const data = JSON.parse(body);
        validateRequired(['propertyId', 'tenantId', 'startDate'], data);
        return success(await leaseService.createLease(data));
      }
      case 'PUT': {
        const data = JSON.parse(body);
        validateRequired(['status'], data);
        return success(await leaseService.updateLease(leaseId, data));
      }
      case 'DELETE':
        await leaseService.deleteLease(leaseId);
        return success({ message: 'Lease deleted' });
      default:
        throw new AppError('Method not allowed', 405);
    }
  } catch (err) {
    return handleError(err);
  }
};