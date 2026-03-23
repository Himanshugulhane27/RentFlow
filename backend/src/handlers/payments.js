const { success, error } = require('../utils/response');
const paymentService = require('../services/paymentService');

exports.handler = async (event) => {
  try {
    const { httpMethod, pathParameters, body } = event;
    const paymentId = pathParameters?.id;

    switch (httpMethod) {
      case 'GET':
        if (paymentId) return success(await paymentService.getPayment(paymentId));
        return success(await paymentService.getAllPayments());
      case 'POST':
        return success(await paymentService.createPayment(JSON.parse(body)));
      case 'PUT':
        return success(await paymentService.markPaymentPaid(paymentId));
      case 'DELETE':
        await paymentService.deletePayment(paymentId);
        return success({ message: 'Payment deleted' });
      default:
        return error('Method not allowed');
    }
  } catch (err) {
    return error(err.message);
  }
};