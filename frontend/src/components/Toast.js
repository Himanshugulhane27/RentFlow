import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'success' ? '#2e7d32' : type === 'error' ? '#c62828' : '#1565c0';

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      backgroundColor: bg, color: 'white',
      padding: '14px 22px', borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      fontSize: '14px', zIndex: 9999,
      animation: 'fadeIn 0.3s ease'
    }}>
      {message}
    </div>
  );
};

export default Toast;