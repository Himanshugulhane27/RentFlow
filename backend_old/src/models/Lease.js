class Lease {
  constructor(data) {
    this.leaseId = data.leaseId;
    this.propertyId = data.propertyId;
    this.tenantId = data.tenantId;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.monthlyRent = Number(data.monthlyRent) || 0;
    this.securityDeposit = Number(data.securityDeposit) || 0;
    this.status = data.status || 'active';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    if (!this.propertyId || !this.tenantId || !this.startDate) {
      throw new Error('Property, tenant, and start date are required');
    }
    return true;
  }

  /**
   * Checks if the lease is expiring within the given number of days.
   * Useful for dashboard warnings and notification triggers.
   */
  isExpiringSoon(days = 30) {
    if (this.status !== 'active' || !this.endDate) return false;
    const now = new Date();
    const end = new Date(this.endDate);
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= days;
  }

  toJSON() {
    return {
      leaseId: this.leaseId,
      propertyId: this.propertyId,
      tenantId: this.tenantId,
      startDate: this.startDate,
      endDate: this.endDate,
      monthlyRent: this.monthlyRent,
      securityDeposit: this.securityDeposit,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Lease;