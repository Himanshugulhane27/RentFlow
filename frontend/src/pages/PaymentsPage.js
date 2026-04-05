import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import ConfirmDialog from '../components/ConfirmDialog';

const PaymentsPage = () => {
  const { payments, addPayment, markPaymentPaid, deletePayment, tenants } = useApp();
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ tenantId: '', amount: '', dueDate: '', note: '' });
  const [formError, setFormError] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [selected, setSelected] = useState([]);
  const { toast, showToast, hideToast } = useToast();

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleBulkPaid = async () => {
    await Promise.all(selected.map(id => markPaymentPaid(id)));
    setSelected([]);
    showToast(`${selected.length} payment${selected.length > 1 ? 's' : ''} marked as paid`);
  };

  const totalCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'pending' && new Date() > new Date(p.dueDate)).reduce((sum, p) => sum + p.amount, 0);
  const filtered = payments
    .filter(p => filter === 'all' ? true : p.status === filter)
    .filter(p => p.tenantName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortOrder === 'asc'
      ? new Date(a.dueDate) - new Date(b.dueDate)
      : new Date(b.dueDate) - new Date(a.dueDate)
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.amount) <= 0) { setFormError('Amount must be greater than 0'); return; }
    if (!formData.dueDate) { setFormError('Due date is required'); return; }
    setFormError('');
    const tenant = tenants.find(t => t.tenantId === formData.tenantId);
    try {
      await addPayment({ ...formData, amount: Number(formData.amount), tenantName: tenant?.name || '' });
      setFormData({ tenantId: '', amount: '', dueDate: '', note: '' });
      setShowForm(false);
      showToast('Payment record added');
    } catch { showToast('Failed to add payment', 'error'); }
  };

  const handleMarkPaid = async (id) => {
    try {
      await markPaymentPaid(id);
      showToast('Payment marked as paid');
    } catch { showToast('Failed to mark payment', 'error'); }
  };

  const handleDelete = (id) => setConfirmId(id);

  const confirmDelete = async () => {
    try {
      await deletePayment(confirmId);
      setConfirmId(null);
      showToast('Payment deleted', 'error');
    } catch { showToast('Failed to delete payment', 'error'); }
  };

  const getDaysOverdue = (dueDate) => {
    const diff = new Date() - new Date(dueDate);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const isDueToday = (dueDate) => {
    const today = new Date().toISOString().slice(0, 10);
    return dueDate === today;
  };

  return (
    <div style={{ padding: '20px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      {confirmId && <ConfirmDialog message="Delete this payment record?" onConfirm={confirmDelete} onCancel={() => setConfirmId(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Payments</h2>
        <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Payment'}</button>
      </div>

      <input
        placeholder="Search by tenant name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '16px' }}
      />

      {selected.length > 0 && (
        <div style={{ backgroundColor: '#e3f2fd', padding: '10px 16px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#1565c0' }}>{selected.length} payment{selected.length > 1 ? 's' : ''} selected</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleBulkPaid} style={{ backgroundColor: '#2e7d32', padding: '6px 14px', fontSize: '13px' }}>Mark All Paid</button>
            <button onClick={() => setSelected([])} style={{ backgroundColor: '#757575', padding: '6px 14px', fontSize: '13px' }}>Clear</button>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <select value={formData.tenantId} onChange={e => setFormData({ ...formData, tenantId: e.target.value })} required>
            <option value="">Select Tenant</option>
            {tenants.map(t => <option key={t.tenantId} value={t.tenantId}>{t.name}</option>)}
          </select>
          <input type="number" placeholder="Amount ($)" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
          <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} required />
          <input placeholder="Note (optional)" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} />
          <button type="submit">Add Payment</button>
          {formError && <p style={{ color: '#e53935', fontSize: '13px', marginTop: '8px' }}>{formError}</p>}
        </form>
      )}

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#e8f5e9', padding: '15px 25px', borderRadius: '8px', flex: 1 }}>
          <p style={{ margin: 0, color: '#555' }}>Collected</p>
          <h3 style={{ margin: '5px 0 0', color: '#2e7d32' }}>${totalCollected.toLocaleString()}</h3>
        </div>
        <div style={{ backgroundColor: '#fff3e0', padding: '15px 25px', borderRadius: '8px', flex: 1 }}>
          <p style={{ margin: 0, color: '#555' }}>Pending</p>
          <h3 style={{ margin: '5px 0 0', color: '#e65100' }}>${totalPending.toLocaleString()}</h3>
        </div>
        <div style={{ backgroundColor: '#ffebee', padding: '15px 25px', borderRadius: '8px', flex: 1 }}>
          <p style={{ margin: 0, color: '#555' }}>Overdue</p>
          <h3 style={{ margin: '5px 0 0', color: '#c62828' }}>${totalOverdue.toLocaleString()}</h3>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        {['all', 'paid', 'pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            backgroundColor: filter === f ? '#1a237e' : '#e0e0e0',
            color: filter === f ? 'white' : '#333',
            padding: '6px 16px', borderRadius: '20px'
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ width: 'auto', marginLeft: 'auto' }}>
          <option value="asc">Due Date: Oldest First</option>
          <option value="desc">Due Date: Newest First</option>
        </select>
      </div>

      {filtered.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>No payments found.</p>}

      {filtered.map(payment => {
        const overdue = payment.status === 'pending' && getDaysOverdue(payment.dueDate) > 0;
        const daysOverdue = getDaysOverdue(payment.dueDate);
        const dueToday = payment.status === 'pending' && isDueToday(payment.dueDate);
        return (
        <div key={payment.paymentId} style={{
          border: `1px solid ${overdue ? '#e53935' : dueToday ? '#f9a825' : '#ddd'}`, padding: '15px', borderRadius: '8px',
          marginBottom: '10px', backgroundColor: overdue ? '#fff5f5' : dueToday ? '#fffde7' : 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            {payment.status === 'pending' && (
              <input type="checkbox" checked={selected.includes(payment.paymentId)} onChange={() => toggleSelect(payment.paymentId)} style={{ marginTop: '4px', width: '16px', height: '16px', cursor: 'pointer' }} />
            )}
            <div>
            <h3 style={{ margin: '0 0 5px' }}>{payment.tenantName}</h3>
            <p style={{ margin: 0, color: '#555' }}>Due: {payment.dueDate} &nbsp;|&nbsp; Amount: ${payment.amount}</p>
            {payment.note && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#777' }}>📝 {payment.note}</p>}
            {dueToday && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#f9a825', fontWeight: 'bold' }}>📅 Due Today</p>}
            {overdue && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#e53935', fontWeight: 'bold' }}>🔴 {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue</p>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
              backgroundColor: payment.status === 'paid' ? '#e8f5e9' : overdue ? '#ffebee' : '#fff3e0',
              color: payment.status === 'paid' ? '#2e7d32' : overdue ? '#e53935' : '#e65100'
            }}>
              {payment.status}
            </span>
            {payment.status === 'pending' && (
              <button onClick={() => handleMarkPaid(payment.paymentId)} style={{ backgroundColor: '#2e7d32', padding: '6px 12px' }}>
                Mark Paid
              </button>
            )}
            <button onClick={() => handleDelete(payment.paymentId)} style={{ backgroundColor: '#757575', padding: '6px 12px' }}>
              Delete
            </button>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default PaymentsPage;