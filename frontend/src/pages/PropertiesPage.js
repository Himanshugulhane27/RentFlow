import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PropertyForm from '../components/PropertyForm';
import PropertyList from '../components/PropertyList';

const PropertiesPage = () => {
  const { properties, addProperty, deleteProperty, toggleAvailability } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

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
      {showForm && <PropertyForm onSubmit={(data) => { addProperty(data); setShowForm(false); }} />}
      <input
        placeholder="Search by address..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <PropertyList properties={filtered} onDelete={deleteProperty} onToggle={toggleAvailability} />
    </div>
  );
};

export default PropertiesPage;