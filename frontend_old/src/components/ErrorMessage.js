import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div style={{ 
      backgroundColor: '#ffebee', 
      color: '#c62828', 
      padding: '15px', 
      borderRadius: '4px',
      margin: '10px 0'
    }}>
      <strong>Error:</strong> {message}
    </div>
  );
};

export default ErrorMessage;