class Tenant {
  constructor(data) {
    this.tenantId = data.tenantId;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.currentProperty = data.currentProperty || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  validate() {
    if (!this.name || !this.email) {
      throw new Error('Name and email are required');
    }
    return true;
  }
}

module.exports = Tenant;