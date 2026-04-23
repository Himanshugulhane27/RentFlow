class Tenant {
  constructor(data) {
    this.tenantId = data.tenantId;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone || '';
    this.currentProperty = data.currentProperty || null;
    this.emergencyContact = data.emergencyContact || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    if (!this.name || !this.email) {
      throw new Error('Name and email are required');
    }
    return true;
  }

  toJSON() {
    return {
      tenantId: this.tenantId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      currentProperty: this.currentProperty,
      emergencyContact: this.emergencyContact,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Tenant;