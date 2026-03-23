const { success, error } = require('../utils/response');
const leaseService = require('../services/leaseService');

exports.handler = async (event) => {
  try {
    const { httpMethod, pathParameters, body } = event;
    const leaseId = pathParameters?.id;

    switch (httpMethod) {
      case 'GET':
        if (leaseId) return success(await leaseService.getLease(leaseId));
        return success(await leaseService.getAllLeases());
      case 'POST':
        return success(await leaseService.createLease(JSON.parse(body)));
      case 'PUT':
        return success(await leaseService.updateLease(leaseId, JSON.parse(body)));
      case 'DELETE':
        await leaseService.deleteLease(leaseId);
        return success({ message: 'Lease deleted' });
      default:
        return error('Method not allowed');
    }
  } catch (err) {
    return error(err.message);
  }
};