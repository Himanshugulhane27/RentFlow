// Main App component with routing
// Updated on April 12, 2026
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
import LeasesPage from './pages/LeasesPage';
import PaymentsPage from './pages/PaymentsPage';
import NotFound from './pages/NotFound';
import PropertyDetailPage from './pages/PropertyDetailPage';
import TenantDetailPage from './pages/TenantDetailPage';
import { useApp } from './context/AppContext';
import './App.css';

class ErrorBoundary extends React.Component {
  state = { hasError: false, message: '' };
  static getDerivedStateFromError(err) { return { hasError: true, message: err.message }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#c62828' }}>Something went wrong</h2>
        <p style={{ color: '#555' }}>{this.state.message}</p>
        <button onClick={() => this.setState({ hasError: false, message: '' })}>Try Again</button>
      </div>
    );
    return this.props.children;
  }
}

const AppRoutes = () => {
  const { loading, error, refetch } = useApp();
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'Dashboard', '/properties': 'Properties', '/tenants': 'Tenants',
      '/leases': 'Leases', '/payments': 'Payments'
    };
    const match = Object.keys(titles).find(k => k === location.pathname || (k !== '/' && location.pathname.startsWith(k)));
    document.title = match ? `${titles[match]} — Rental Manager` : 'Rental Manager';
  }, [location]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#555' }}>
      <p style={{ fontSize: '18px' }}>Loading...</p>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <p style={{ color: '#c62828', fontSize: '16px' }}>Failed to load data: {error}</p>
      <button onClick={refetch} style={{ marginTop: '16px' }}>Retry</button>
    </div>
  );

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/leases" element={<LeasesPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/tenants/:id" element={<TenantDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
