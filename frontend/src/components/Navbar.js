import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('rms_dark') === 'true');
  const { leases, payments } = useApp();

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('rms_dark', dark);
  }, [dark]);

  const expiringLeases = leases.filter(l => {
    const today = new Date().toISOString().slice(0, 10);
    const daysLeft = Math.ceil((new Date(l.endDate) - new Date(today)) / (1000 * 60 * 60 * 24));
    return l.status === 'active' && daysLeft <= 30 && daysLeft > 0;
  }).length;

  const overduePayments = payments.filter(p => p.status === 'pending' && new Date().toISOString().slice(0,10) > p.dueDate).length;

  const badge = (count) => count > 0 ? (
    <span style={{ backgroundColor: '#e53935', color: 'white', borderRadius: '50%', fontSize: '11px', padding: '1px 6px', marginLeft: '4px', fontWeight: 'bold' }}>
      {count}
    </span>
  ) : null;

  const activeLeaseCount = leases.filter(l => l.status === 'active').length;

  const links = [
    { path: '/', label: 'Dashboard' },
    { path: '/properties', label: 'Properties' },
    { path: '/tenants', label: 'Tenants' },
    { path: '/leases', label: 'Leases', badge: expiringLeases || activeLeaseCount },
    { path: '/payments', label: 'Payments', badge: overduePayments }
  ];

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const linkStyle = (path) => ({
    color: isActive(path) ? '#ffeb3b' : 'white',
    textDecoration: 'none',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    fontSize: '15px',
    padding: '6px 10px',
    borderRadius: '4px',
    display: 'block'
  });

  return (
    <nav style={{ backgroundColor: '#1a237e', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>🏠 Rental Manager</span>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="nav-links">
          {links.map(l => <Link key={l.path} to={l.path} style={linkStyle(l.path)}>{l.label}{badge(l.badge)}</Link>)}
          <button onClick={() => setDark(d => !d)} style={{ backgroundColor: 'transparent', fontSize: '18px', padding: '4px 8px', marginLeft: '8px' }} title="Toggle dark mode">
            {dark ? '☀️' : '🌙'}
          </button>
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
              {l.label}{badge(l.badge)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;