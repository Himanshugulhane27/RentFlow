import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h1 style={{ fontSize: '80px', margin: 0, color: '#1a237e' }}>404</h1>
      <h2 style={{ color: '#555' }}>Page Not Found</h2>
      <p style={{ color: '#888' }}>The page you are looking for does not exist.</p>
      <button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;