import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const load = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const defaultProperties = [
  { propertyId: '1', address: '123 Main St', rent: 1200, bedrooms: 2, bathrooms: 1, available: true },
  { propertyId: '2', address: '456 Oak Ave', rent: 1500, bedrooms: 3, bathrooms: 2, available: false },
  { propertyId: '3', address: '789 Pine Rd', rent: 900, bedrooms: 1, bathrooms: 1, available: true }
];

const defaultTenants = [
  { tenantId: '1', name: 'John Doe', email: 'john@email.com', phone: '555-0100' },
  { tenantId: '2', name: 'Jane Smith', email: 'jane@email.com', phone: '555-0200' }
];

const defaultLeases = [
  { leaseId: '1', propertyId: '2', propertyAddress: '456 Oak Ave', tenantId: '1', tenantName: 'John Doe', startDate: '2024-01-01', endDate: '2025-12-31', monthlyRent: 1200, status: 'active' },
  { leaseId: '2', propertyId: '3', propertyAddress: '789 Pine Rd', tenantId: '2', tenantName: 'Jane Smith', startDate: '2024-03-01', endDate: '2025-02-28', monthlyRent: 900, status: 'active' }
];

const defaultPayments = [
  { paymentId: '1', tenantId: '1', tenantName: 'John Doe', amount: 1200, dueDate: '2025-02-01', status: 'paid' },
  { paymentId: '2', tenantId: '2', tenantName: 'Jane Smith', amount: 900, dueDate: '2025-02-01', status: 'pending' },
  { paymentId: '3', tenantId: '1', tenantName: 'John Doe', amount: 1200, dueDate: '2025-03-01', status: 'pending' }
];

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useState(() => load('rms_properties', defaultProperties));
  const [tenants, setTenants] = useState(() => load('rms_tenants', defaultTenants));
  const [leases, setLeases] = useState(() => load('rms_leases', defaultLeases));
  const [payments, setPayments] = useState(() => load('rms_payments', defaultPayments));
  const [activity, setActivity] = useState(() => load('rms_activity', []));

  useEffect(() => { localStorage.setItem('rms_properties', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem('rms_tenants', JSON.stringify(tenants)); }, [tenants]);
  useEffect(() => { localStorage.setItem('rms_leases', JSON.stringify(leases)); }, [leases]);
  useEffect(() => { localStorage.setItem('rms_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('rms_activity', JSON.stringify(activity)); }, [activity]);

  const log = (message) => {
    const entry = { id: Date.now(), message, time: new Date().toLocaleTimeString() };
    setActivity(prev => [entry, ...prev].slice(0, 10));
  };

  const addProperty = (p) => {
    setProperties(prev => [...prev, { ...p, propertyId: Date.now().toString(), available: true }]);
    log(`Property "${p.address}" added`);
  };
  const deleteProperty = (id) => {
    setProperties(prev => {
      const found = prev.find(p => p.propertyId === id);
      if (found) log(`Property "${found.address}" deleted`);
      return prev.filter(p => p.propertyId !== id);
    });
  };
  const toggleAvailability = (id) => setProperties(prev => prev.map(p => p.propertyId === id ? { ...p, available: !p.available } : p));
  const editProperty = (id, data) => setProperties(prev => prev.map(p => p.propertyId === id ? { ...p, ...data } : p));

  const addTenant = (t) => {
    setTenants(prev => [...prev, { ...t, tenantId: Date.now().toString() }]);
    log(`Tenant "${t.name}" added`);
  };
  const deleteTenant = (id) => {
    setTenants(prev => {
      const found = prev.find(t => t.tenantId === id);
      if (found) log(`Tenant "${found.name}" removed`);
      return prev.filter(t => t.tenantId !== id);
    });
  };
  const editTenant = (id, data) => setTenants(prev => prev.map(t => t.tenantId === id ? { ...t, ...data } : t));

  const addLease = (l) => {
    setLeases(prev => [...prev, { ...l, leaseId: Date.now().toString(), status: 'active' }]);
    log(`Lease created for "${l.propertyAddress}"`);
  };
  const renewLease = (id, newEndDate) => {
    setLeases(prev => {
      const found = prev.find(l => l.leaseId === id);
      if (found) log(`Lease for "${found.propertyAddress}" renewed until ${newEndDate}`);
      return prev.map(l => l.leaseId === id ? { ...l, status: 'active', endDate: newEndDate } : l);
    });
  };
  const terminateLease = (id) => {
    setLeases(prev => {
      const found = prev.find(l => l.leaseId === id);
      if (found) log(`Lease for "${found.propertyAddress}" terminated`);
      return prev.map(l => l.leaseId === id ? { ...l, status: 'terminated' } : l);
    });
  };

  const addPayment = (p) => setPayments(prev => [...prev, { ...p, paymentId: Date.now().toString(), status: 'pending' }]);
  const markPaymentPaid = (id) => {
    setPayments(prev => {
      const found = prev.find(p => p.paymentId === id);
      if (found) log(`Payment of $${found.amount} by "${found.tenantName}" marked paid`);
      return prev.map(p => p.paymentId === id ? { ...p, status: 'paid' } : p);
    });
  };
  const deletePayment = (id) => setPayments(prev => prev.filter(p => p.paymentId !== id));
  const clearActivity = () => setActivity([]);

  return (
    <AppContext.Provider value={{
      properties, addProperty, deleteProperty, toggleAvailability, editProperty,
      tenants, addTenant, deleteTenant, editTenant,
      leases, addLease, renewLease, terminateLease,
      payments, addPayment, markPaymentPaid, deletePayment,
      activity, clearActivity
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);