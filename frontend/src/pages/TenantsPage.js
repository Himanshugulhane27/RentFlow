import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TenantList from '../components/TenantList';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import ConfirmDialog from '../components/ConfirmDialog';

const TenantsPage = () => {
  const { tenants, addTenant, deleteTenant, editTenant } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => !phone || /^[\d\s\-\+\(\)]{7,15}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(formData.email)) { setEmailError('Please enter a valid email address'); return; }
    if (!isValidPhone(formData.phone)) { setPhoneError('Please enter a valid phone number'); return; }
    setEmailError(''); setPhoneError('');
    try {
      await addTenant(formData);
      setFormData({ name: '', email: '', phone: '' });
      setShowForm(false);
      showToast('Tenant added successfully');
    } catch { showToast('Failed to add tenant', 'error'); }
  };

  const handleDelete = (id) => setConfirmId(id);

  const confirmDelete = async () => {
    try {
      await deleteTenant(confirmId);
      setConfirmId(null);
      showToast('Tenant removed', 'error');
    } catch { showToast('Failed to delete tenant', 'error'); }
  };

  const filtered = tenants
    .filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ padding: '20px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      {confirmId && <ConfirmDialog message="Delete this tenant?" onConfirm={confirmDelete} onCancel={() => setConfirmId(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Tenants ({filtered.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEmailError(''); }}>
          {showForm ? 'Cancel' : '+ Add Tenant'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            value={formData.email}
            onChange={e => { setFormData({ ...formData, email: e.target.value }); setEmailError(''); }}
          />
          {emailError && <p style={{ color: '#e53935', fontSize: '13px', margin: '0 0 8px' }}>{emailError}</p>}
          <input
            placeholder="Phone"
            value={formData.phone}
            onChange={e => { setFormData({ ...formData, phone: e.target.value }); setPhoneError(''); }}
          />
          {phoneError && <p style={{ color: '#e53935', fontSize: '13px', margin: '0 0 8px' }}>{phoneError}</p>}
          <button type="submit">Add Tenant</button>
        </form>
      )}

      <input
        placeholder="Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '16px' }}
      />

      <TenantList
        tenants={filtered}
        onDelete={handleDelete}
        onEdit={async (id, data) => { try { await editTenant(id, data); showToast('Tenant updated'); } catch { showToast('Failed to update tenant', 'error'); } }}
      />
    </div>
  );
};

export default TenantsPage;