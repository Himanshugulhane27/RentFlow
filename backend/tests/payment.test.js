const Payment = require('../src/models/Payment');

describe('Payment Model', () => {
  test('should create payment with valid data', () => {
    const payment = new Payment({ paymentId: '1', leaseId: 'l1', tenantId: 't1', amount: 1200, dueDate: '2024-02-01' });
    expect(payment.amount).toBe(1200);
    expect(payment.status).toBe('pending');
  });

  test('should mark payment as paid', () => {
    const payment = new Payment({ paymentId: '1', leaseId: 'l1', tenantId: 't1', amount: 1200 });
    payment.markPaid();
    expect(payment.status).toBe('paid');
    expect(payment.paidDate).not.toBeNull();
  });

  test('should throw error when amount is missing', () => {
    const payment = new Payment({ paymentId: '1', leaseId: 'l1', tenantId: 't1' });
    expect(() => payment.validate()).toThrow('Lease, tenant, and amount are required');
  });

  test('should throw error when amount is zero', () => {
    const payment = new Payment({ paymentId: '1', leaseId: 'l1', tenantId: 't1', amount: 0 });
    expect(() => payment.validate()).toThrow('Amount must be positive');
  });
});