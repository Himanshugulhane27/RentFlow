import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p>{message}</p>
    </div>
  );
};

export default Loading;