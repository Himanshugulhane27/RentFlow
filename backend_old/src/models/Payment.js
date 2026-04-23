class Payment {
  constructor(data) {
    this.paymentId = data.paymentId;
    this.leaseId = data.leaseId;
    this.tenantId = data.tenantId;
    this.amount = Number(data.amount) || 0;
    this.dueDate = data.dueDate;
    this.paidDate = data.paidDate || null;
    this.status = data.status || 'pending';
    this.paymentMethod = data.paymentMethod || null;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
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
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Check if this payment is past its due date and still unpaid.
   * The dashboard uses this to highlight overdue items in red.
   */
  isOverdue() {
    if (this.status === 'paid' || !this.dueDate) return false;
    return new Date() > new Date(this.dueDate);
  }

  toJSON() {
    return {
      paymentId: this.paymentId,
      leaseId: this.leaseId,
      tenantId: this.tenantId,
      amount: this.amount,
      dueDate: this.dueDate,
      paidDate: this.paidDate,
      status: this.status,
      paymentMethod: this.paymentMethod,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Payment;