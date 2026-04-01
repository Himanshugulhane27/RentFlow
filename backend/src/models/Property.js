class Property {
  constructor(data) {
    this.propertyId = data.propertyId;
    this.address = data.address;
    this.rent = data.rent;
    this.bedrooms = data.bedrooms;
    this.bathrooms = data.bathrooms;
    this.available = data.available !== undefined ? data.available : true;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  validate() {
    if (!this.address || !this.rent) {
      throw new Error('Address and rent are required');
    }
    return true;
  }
}

module.exports = Property;