const { success, error } = require('../utils/response');
const leaseService = require('../services/leaseService');

exports.handler = async (event) => {
  try {
    const { httpMethod, body } = event;

    switch (httpMethod) {
      case 'GET':
        const leases = await leaseService.getAllLeases();
        return success(leases);
      case 'POST':
        const newLease = await leaseService.createLease(JSON.parse(body));
        return success(newLease);
      default:
        return error('Method not allowed');
    }
  } catch (err) {
    return error(err.message);
  }
};