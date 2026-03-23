import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const PaymentsPage = () => {
  const { payments, addPayment, markPaymentPaid, tenants } = useApp();
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ tenantId: '', amount: '', dueDate: '' });
  const { toast, showToast, hideToast } = useToast();

  const totalCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const filtered = payments.filter(p => filter === 'all' ? true : p.status === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
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

  return (
    <div style={{ padding: '20px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

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
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        {['all', 'paid', 'pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            backgroundColor: filter === f ? '#1a237e' : '#e0e0e0',
            color: filter === f ? 'white' : '#333',
            padding: '6px 16px', borderRadius: '20px'
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>No payments found.</p>}

      {filtered.map(payment => (
        <div key={payment.paymentId} style={{
          border: '1px solid #ddd', padding: '15px', borderRadius: '8px',
          marginBottom: '10px', backgroundColor: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: '0 0 5px' }}>{payment.tenantName}</h3>
            <p style={{ margin: 0, color: '#555' }}>Due: {payment.dueDate} &nbsp;|&nbsp; Amount: ${payment.amount}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
              backgroundColor: payment.status === 'paid' ? '#e8f5e9' : '#fff3e0',
              color: payment.status === 'paid' ? '#2e7d32' : '#e65100'
            }}>
              {payment.status}
            </span>
            {payment.status === 'pending' && (
              <button onClick={() => handleMarkPaid(payment.paymentId)} style={{ backgroundColor: '#2e7d32', padding: '6px 12px' }}>
                Mark Paid
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentsPage;