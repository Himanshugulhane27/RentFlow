import React, { useState } from 'react';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([
    { paymentId: '1', tenantName: 'John Doe', amount: 1200, dueDate: '2024-02-01', status: 'paid' },
    { paymentId: '2', tenantName: 'Jane Smith', amount: 1500, dueDate: '2024-02-01', status: 'pending' },
    { paymentId: '3', tenantName: 'John Doe', amount: 1200, dueDate: '2024-03-01', status: 'pending' }
  ]);

  const markPaid = (paymentId) => {
    setPayments(payments.map(p =>
      p.paymentId === paymentId ? { ...p, status: 'paid' } : p
    ));
  };

  const totalCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Payments</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#e8f5e9', padding: '15px 25px', borderRadius: '8px', flex: 1 }}>
          <p style={{ margin: 0, color: '#555' }}>Collected</p>
          <h3 style={{ margin: '5px 0 0', color: '#2e7d32' }}>${totalCollected}</h3>
        </div>
        <div style={{ backgroundColor: '#fff3e0', padding: '15px 25px', borderRadius: '8px', flex: 1 }}>
          <p style={{ margin: 0, color: '#555' }}>Pending</p>
          <h3 style={{ margin: '5px 0 0', color: '#e65100' }}>${totalPending}</h3>
        </div>
      </div>

      {payments.map(payment => (
        <div key={payment.paymentId} style={{
          border: '1px solid #ddd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '10px',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: '0 0 5px' }}>{payment.tenantName}</h3>
            <p style={{ margin: 0, color: '#555' }}>Due: {payment.dueDate} &nbsp;|&nbsp; Amount: ${payment.amount}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              backgroundColor: payment.status === 'paid' ? '#e8f5e9' : '#fff3e0',
              color: payment.status === 'paid' ? '#2e7d32' : '#e65100'
            }}>
              {payment.status}
            </span>
            {payment.status === 'pending' && (
              <button
                onClick={() => markPaid(payment.paymentId)}
                style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
              >
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