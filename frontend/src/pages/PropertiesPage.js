import React, { useState, useEffect } from 'react';
import PropertyList from '../components/PropertyList';
import PropertyForm from '../components/PropertyForm';
import api from '../services/api';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setProperties([
      { propertyId: '1', address: '123 Main St', rent: 1200, bedrooms: 2, bathrooms: 1, available: true },
      { propertyId: '2', address: '456 Oak Ave', rent: 1500, bedrooms: 3, bathrooms: 2, available: false },
      { propertyId: '3', address: '789 Pine Rd', rent: 900, bedrooms: 1, bathrooms: 1, available: true }
    ]);
  }, []);

  const handleAdd = (formData) => {
    const newProperty = { ...formData, propertyId: Date.now().toString(), available: true };
    setProperties([...properties, newProperty]);
    setShowForm(false);
  };

  const handleDelete = (propertyId) => {
    setProperties(properties.filter(p => p.propertyId !== propertyId));
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Properties</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Property'}
        </button>
      </div>
      {showForm && <PropertyForm onSubmit={handleAdd} />}
      <PropertyList properties={properties} onDelete={handleDelete} />
    </div>
  );
};

export default PropertiesPage;