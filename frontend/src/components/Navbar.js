import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navStyle = {
    backgroundColor: '#1a237e',
    padding: '15px 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#ffeb3b' : 'white',
    textDecoration: 'none',
    marginLeft: '20px',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    fontSize: '16px'
  });

  return (
    <nav style={navStyle}>
      <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
        🏠 Rental Manager
      </span>
      <div>
        <Link to="/" style={linkStyle('/')}>Dashboard</Link>
        <Link to="/properties" style={linkStyle('/properties')}>Properties</Link>
        <Link to="/tenants" style={linkStyle('/tenants')}>Tenants</Link>
        <Link to="/leases" style={linkStyle('/leases')}>Leases</Link>
      </div>
    </nav>
  );
};

export default Navbar;