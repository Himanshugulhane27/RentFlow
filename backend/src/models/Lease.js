class Lease {
  constructor(data) {
    this.leaseId = data.leaseId;
    this.propertyId = data.propertyId;
    this.tenantId = data.tenantId;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.monthlyRent = data.monthlyRent;
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  validate() {
    if (!this.propertyId || !this.tenantId || !this.startDate) {
      throw new Error('Property, tenant, and start date are required');
    }
    return true;
  }
}

module.exports = Lease;