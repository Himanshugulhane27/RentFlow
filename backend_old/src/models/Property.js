class Property {
  constructor(data) {
    this.propertyId = data.propertyId;
    this.address = data.address;
    this.rent = Number(data.rent) || 0;
    this.bedrooms = Number(data.bedrooms) || 0;
    this.bathrooms = Number(data.bathrooms) || 0;
    this.available = data.available !== undefined ? data.available : true;
    this.description = data.description || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    if (!this.address || !this.rent) {
      throw new Error('Address and rent are required');
    }
    if (this.rent <= 0) {
      throw new Error('Rent must be a positive number');
    }
    if (this.bedrooms < 0 || this.bathrooms < 0) {
      throw new Error('Bedrooms and bathrooms cannot be negative');
    }
    return true;
  }

  /**
   * Clean representation for API responses.
   * Keeps the shape predictable for frontend consumers.
   */
  toJSON() {
    return {
      propertyId: this.propertyId,
      address: this.address,
      rent: this.rent,
      bedrooms: this.bedrooms,
      bathrooms: this.bathrooms,
      available: this.available,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Property;