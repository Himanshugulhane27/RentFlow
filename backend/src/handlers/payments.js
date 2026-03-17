const { success, error } = require('../utils/response');
const paymentService = require('../services/paymentService');

exports.handler = async (event) => {
  try {
    const { httpMethod, body, pathParameters } = event;
    const paymentId = pathParameters?.proxy;

    switch (httpMethod) {
      case 'GET':
        const payments = await paymentService.getAllPayments();
        return success(payments);
      case 'POST':
        const newPayment = await paymentService.createPayment(JSON.parse(body));
        return success(newPayment);
      case 'PUT':
        const updated = await paymentService.markPaymentPaid(paymentId);
        return success(updated);
      default:
        return error('Method not allowed');
    }
  } catch (err) {
    return error(err.message);
  }
};