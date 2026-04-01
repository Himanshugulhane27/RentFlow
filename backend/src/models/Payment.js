class Payment {
  constructor(data) {
    this.paymentId = data.paymentId;
    this.leaseId = data.leaseId;
    this.tenantId = data.tenantId;
    this.amount = data.amount;
    this.dueDate = data.dueDate;
    this.paidDate = data.paidDate || null;
    this.status = data.status || 'pending';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  validate() {
    if (!this.leaseId || !this.tenantId || !this.amount) {
      throw new Error('Lease, tenant, and amount are required');
    }
    if (this.amount <= 0) {
      throw new Error('Amount must be positive');
    }
    return true;
  }

  markPaid() {
    this.status = 'paid';
    this.paidDate = new Date().toISOString();
  }
}

module.exports = Payment;