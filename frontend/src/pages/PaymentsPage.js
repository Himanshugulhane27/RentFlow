import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import ConfirmDialog from '../components/ConfirmDialog';

const PaymentsPage = () => {
  const { payments, addPayment, markPaymentPaid, deletePayment, tenants } = useApp();
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ tenantId: '', amount: '', dueDate: '' });
  const [formError, setFormError] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const totalCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'pending' && new Date() > new Date(p.dueDate)).reduce((sum, p) => sum + p.amount, 0);
  const filtered = payments
    .filter(p => filter === 'all' ? true : p.status === filter)
    .sort((a, b) => sortOrder === 'asc'
      ? new Date(a.dueDate) - new Date(b.dueDate)
      : new Date(b.dueDate) - new Date(a.dueDate)
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(formData.amount) <= 0) { setFormError('Amount must be greater than 0'); return; }
    if (!formData.dueDate) { setFormError('Due date is required'); return; }
    setFormError('');
    const tenant = tenants.find(t => t.tenantId === formData.tenantId);
    addPayment({ ...formData, amount: Number(formData.amount), tenantName: tenant?.name || '' });
    setFormData({ tenantId: '', amount: '', dueDate: '' });
    setShowForm(false);
    showToast('Payment record added');
  };

  const handleMarkPaid = (id) => {
    markPaymentPaid(id);
    showToast('Payment marked as paid');
  };

  const handleDelete = (id) => setConfirmId(id);

  const confirmDelete = () => {
    deletePayment(confirmId);
    setConfirmId(null);
    showToast('Payment deleted', 'error');
  };

  const getDaysOverdue = (dueDate) => {
    const diff = new Date() - new Date(dueDate);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={{ padding: '20px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      {confirmId && <ConfirmDialog message="Delete this payment record?" onConfirm={confirmDelete} onCancel={() => setConfirmId(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Payments</h2>
        <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Payment'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <select value={formData.tenantId} onChange={e => setFormData({ ...formData, tenantId: e.target.value })} required>
            <option value="">Select Tenant</option>
            {tenants.map(t => <option key={t.tenantId} value={t.tenantId}>{t.name}</option>)}
          </select>
          <input type="number" placeholder="Amount ($)" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
          <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} required />
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
        return (
        <div key={payment.paymentId} style={{
          border: `1px solid ${overdue ? '#e53935' : '#ddd'}`, padding: '15px', borderRadius: '8px',
          marginBottom: '10px', backgroundColor: overdue ? '#fff5f5' : 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: '0 0 5px' }}>{payment.tenantName}</h3>
            <p style={{ margin: 0, color: '#555' }}>Due: {payment.dueDate} &nbsp;|&nbsp; Amount: ${payment.amount}</p>
            {overdue && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#e53935', fontWeight: 'bold' }}>🔴 {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue</p>}
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