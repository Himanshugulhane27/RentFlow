import React, { useEffect } from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px', width: '360px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', marginBottom: '24px', color: '#333' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={onConfirm} style={{ backgroundColor: '#e53935' }}>Yes, Delete</button>
          <button onClick={onCancel} style={{ backgroundColor: '#757575' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
