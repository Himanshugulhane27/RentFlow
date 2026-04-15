import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PropertyForm from '../components/PropertyForm';
import PropertyList from '../components/PropertyList';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import ConfirmDialog from '../components/ConfirmDialog';
import { exportToCSV } from '../utils/export';

const PropertiesPage = () => {
  const { properties, addProperty, deleteProperty, toggleAvailability, editProperty } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [filterAvail, setFilterAvail] = useState('all');
  const [filterBeds, setFilterBeds] = useState('any');
  const [confirmId, setConfirmId] = useState(null);
  const [selected, setSelected] = useState([]);
  const { toast, showToast, hideToast } = useToast();

  const handleAdd = async (data) => {
    try {
      await addProperty(data);
      setShowForm(false);
      showToast('Property added successfully');
    } catch { showToast('Failed to add property', 'error'); }
  };

  const handleDelete = (id) => setConfirmId(id);

  const confirmDelete = async () => {
    try {
      await deleteProperty(confirmId);
      setConfirmId(null);
      showToast('Property removed', 'error');
    } catch { showToast('Failed to delete property', 'error'); }
  };

  const handleToggle = async (id) => {
    try {
      await toggleAvailability(id);
      showToast('Availability updated', 'info');
    } catch { showToast('Failed to update availability', 'error'); }
  };

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleBulkToggle = async () => {
    try {
      await Promise.all(selected.map(id => toggleAvailability(id)));
      setSelected([]);
      showToast(`${selected.length} propert${selected.length > 1 ? 'ies' : 'y'} availability toggled`);
    } catch { showToast('Failed to update properties', 'error'); }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selected.map(id => deleteProperty(id)));
      setSelected([]);
      showToast(`${selected.length} propert${selected.length > 1 ? 'ies' : 'y'} deleted`, 'error');
    } catch { showToast('Failed to delete properties', 'error'); }
  };

  let filtered = properties
    .filter(p => p.address.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.address.localeCompare(b.address));

  if (filterAvail === 'available') filtered = filtered.filter(p => p.available);
  if (filterAvail === 'occupied') filtered = filtered.filter(p => !p.available);
  if (filterBeds !== 'any') filtered = filtered.filter(p => Number(p.bedrooms) === Number(filterBeds));

  if (sortBy === 'low') filtered = [...filtered].sort((a, b) => a.rent - b.rent);
  if (sortBy === 'high') filtered = [...filtered].sort((a, b) => b.rent - a.rent);

  return (
    <div style={{ padding: '20px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      {confirmId && <ConfirmDialog message="Delete this property?" onConfirm={confirmDelete} onCancel={() => setConfirmId(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Properties ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => exportToCSV(filtered, 'properties.csv')} style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            Export CSV
          </button>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Property'}
          </button>
        </div>
      </div>
      {showForm && <PropertyForm onSubmit={handleAdd} />}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          placeholder="Search by address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '180px', marginBottom: 0 }}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto' }}>
          <option value="none">Sort by Rent</option>
          <option value="low">Rent: Low to High</option>
          <option value="high">Rent: High to Low</option>
        </select>
        <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
        <select value={filterBeds} onChange={e => setFilterBeds(e.target.value)} style={{ width: 'auto' }}>
          <option value="any">Any Beds</option>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Bed{n > 1 ? 's' : ''}</option>)}
        </select>
        {(search || sortBy !== 'none' || filterAvail !== 'all' || filterBeds !== 'any') && (
          <button onClick={() => { setSearch(''); setSortBy('none'); setFilterAvail('all'); setFilterBeds('any'); }} style={{ backgroundColor: '#757575', padding: '8px 14px', fontSize: '13px' }}>Reset</button>
        )}
      </div>

      {selected.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
          <span>{selected.length} selected</span>
          <button onClick={handleBulkToggle} style={{ backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            Toggle Availability
          </button>
          <button onClick={handleBulkDelete} style={{ backgroundColor: '#e53935', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            Delete Selected
          </button>
          <button onClick={() => setSelected([])} style={{ backgroundColor: '#757575', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            Clear Selection
          </button>
        </div>
      )}

      <PropertyList properties={filtered} onDelete={handleDelete} onToggle={handleToggle} onEdit={async (id, data) => { try { await editProperty(id, data); showToast('Property updated'); } catch { showToast('Failed to update property', 'error'); } }} selected={selected} onSelect={toggleSelect} />
    </div>
  );
};

export default PropertiesPage;