const Payment = require('../src/models/Payment');

describe('Payment Model', () => {
  test('creates payment with valid data', () => {
    const p = new Payment({ paymentId: '1', leaseId: 'l1', tenantId: 't1', amount: 1200, dueDate: '2025-02-01' });
    expect(p.amount).toBe(1200);
    expect(p.status).toBe('pending');
    expect(p.paidDate).toBeNull();
  });

  test('validate passes with required fields', () => {
    const p = new Payment({ paymentId: '1', leaseId: 'l1', tenantId: 't1', amount: 1200 });
    expect(p.validate()).toBe(true);
  });

  test('validate throws when amount is missing', () => {
    const p = new Payment({ paymentId: '1', leaseId: 'l1', tenantId: 't1' });
    expect(() => p.validate()).toThrow('Lease, tenant, and amount are required');
  });

  test('validate throws when amount is zero', () => {
    const p = new Payment({ paymentId: '1', leaseId: 'l1', tenantId: 't1', amount: 0 });
    // amount=0 is falsy, so it triggers the required-fields check first
    expect(() => p.validate()).toThrow();
  });

  test('validate throws when amount is negative', () => {
    const p = new Payment({ paymentId: '1', leaseId: 'l1', tenantId: 't1', amount: -50 });
    expect(() => p.validate()).toThrow('Amount must be positive');
  });

  test('markPaid sets status and paidDate', () => {
    const p = new Payment({ paymentId: '1', leaseId: 'l1', tenantId: 't1', amount: 1200 });
    p.markPaid();
    expect(p.status).toBe('paid');
    expect(p.paidDate).not.toBeNull();
  });

  test('validate throws when leaseId is missing', () => {
    const p = new Payment({ paymentId: '1', tenantId: 't1', amount: 1200 });
    expect(() => p.validate()).toThrow('Lease, tenant, and amount are required');
  });
});