import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: '/', label: 'Dashboard' },
    { path: '/properties', label: 'Properties' },
    { path: '/tenants', label: 'Tenants' },
    { path: '/leases', label: 'Leases' },
    { path: '/payments', label: 'Payments' }
  ];

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#ffeb3b' : 'white',
    textDecoration: 'none',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    fontSize: '15px',
    padding: '6px 10px',
    borderRadius: '4px',
    display: 'block'
  });

  return (
    <nav style={{ backgroundColor: '#1a237e', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>🏠 Rental Manager</span>

        <div style={{ display: 'flex', gap: '4px' }} className="nav-links">
          {links.map(l => <Link key={l.path} to={l.path} style={linkStyle(l.path)}>{l.label}</Link>)}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', backgroundColor: 'transparent', color: 'white', fontSize: '22px', padding: '4px 8px' }}
          className="hamburger"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div style={{ paddingBottom: '12px' }} className="mobile-menu">
          {links.map(l => (
            <Link key={l.path} to={l.path} style={{ ...linkStyle(l.path), padding: '10px 4px' }} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;