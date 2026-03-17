import React, { useState, useEffect } from 'react';
import PropertyList from '../components/PropertyList';
import PropertyForm from '../components/PropertyForm';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

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

  const filtered = properties.filter(p =>
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Properties</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Property'}
        </button>
      </div>
      {showForm && <PropertyForm onSubmit={handleAdd} />}
      <input
        placeholder="Search by address..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <PropertyList properties={filtered} onDelete={handleDelete} />
    </div>
  );
};

export default PropertiesPage;