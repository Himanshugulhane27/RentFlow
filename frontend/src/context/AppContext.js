import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const load = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
};

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

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
  { paymentId: '3', tenantId: '1', tenantName: 'John Doe', amount: 1200, dueDate: new Date().toISOString().slice(0, 10), status: 'pending' }
];

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useState(() => load('rms_properties', defaultProperties));
  const [tenants, setTenants] = useState(() => load('rms_tenants', defaultTenants));
  const [leases, setLeases] = useState(() => load('rms_leases', defaultLeases));
  const [payments, setPayments] = useState(() => load('rms_payments', defaultPayments));
  const [activity, setActivity] = useState(() => load('rms_activity', []));

  const persist = (key, setter) => (val) => {
    setter(val);
    save(key, typeof val === 'function' ? val : val);
  };

  const log = (message) => {
    setActivity(prev => {
      const next = [{ id: Date.now(), message, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10);
      save('rms_activity', next);
      return next;
    });
  };

  const set = (key, setter) => (val) => {
    setter(val);
    // persisted via useEffect alternative — inline save
  };

  // Properties
  const addProperty = (p) => {
    setProperties(prev => {
      const next = [...prev, { ...p, propertyId: Date.now().toString(), available: true }];
      save('rms_properties', next);
      return next;
    });
    log(`Property "${p.address}" added`);
  };
  const editProperty = (id, data) => {
    setProperties(prev => {
      const next = prev.map(p => p.propertyId === id ? { ...p, ...data } : p);
      save('rms_properties', next);
      return next;
    });
  };
  const deleteProperty = (id) => {
    setProperties(prev => {
      const found = prev.find(p => p.propertyId === id);
      const next = prev.filter(p => p.propertyId !== id);
      save('rms_properties', next);
      if (found) log(`Property "${found.address}" deleted`);
      return next;
    });
  };
  const toggleAvailability = (id) => {
    setProperties(prev => {
      const next = prev.map(p => p.propertyId === id ? { ...p, available: !p.available } : p);
      save('rms_properties', next);
      return next;
    });
  };

  // Tenants
  const addTenant = (t) => {
    setTenants(prev => {
      const next = [...prev, { ...t, tenantId: Date.now().toString() }];
      save('rms_tenants', next);
      return next;
    });
    log(`Tenant "${t.name}" added`);
  };
  const editTenant = (id, data) => {
    setTenants(prev => {
      const next = prev.map(t => t.tenantId === id ? { ...t, ...data } : t);
      save('rms_tenants', next);
      return next;
    });
  };
  const deleteTenant = (id) => {
    setTenants(prev => {
      const found = prev.find(t => t.tenantId === id);
      const next = prev.filter(t => t.tenantId !== id);
      save('rms_tenants', next);
      if (found) log(`Tenant "${found.name}" removed`);
      return next;
    });
  };

  // Leases
  const addLease = (l) => {
    setLeases(prev => {
      const next = [...prev, { ...l, leaseId: Date.now().toString(), status: 'active' }];
      save('rms_leases', next);
      return next;
    });
    log(`Lease created for "${l.propertyAddress}"`);
  };
  const terminateLease = (id) => {
    setLeases(prev => {
      const found = prev.find(l => l.leaseId === id);
      const next = prev.map(l => l.leaseId === id ? { ...l, status: 'terminated' } : l);
      save('rms_leases', next);
      if (found) log(`Lease for "${found.propertyAddress}" terminated`);
      return next;
    });
  };
  const renewLease = (id, newEndDate) => {
    setLeases(prev => {
      const found = prev.find(l => l.leaseId === id);
      const next = prev.map(l => l.leaseId === id ? { ...l, status: 'active', endDate: newEndDate } : l);
      save('rms_leases', next);
      if (found) log(`Lease for "${found.propertyAddress}" renewed until ${newEndDate}`);
      return next;
    });
  };

  // Payments
  const addPayment = (p) => {
    setPayments(prev => {
      const next = [...prev, { ...p, paymentId: Date.now().toString(), status: 'pending' }];
      save('rms_payments', next);
      return next;
    });
  };
  const markPaymentPaid = (id) => {
    setPayments(prev => {
      const found = prev.find(p => p.paymentId === id);
      const next = prev.map(p => p.paymentId === id ? { ...p, status: 'paid' } : p);
      save('rms_payments', next);
      if (found) log(`Payment of $${found.amount} by "${found.tenantName}" marked paid`);
      return next;
    });
  };
  const deletePayment = (id) => {
    setPayments(prev => {
      const next = prev.filter(p => p.paymentId !== id);
      save('rms_payments', next);
      return next;
    });
  };
  const clearActivity = () => {
    setActivity([]);
    localStorage.removeItem('rms_activity');
  };

  return (
    <AppContext.Provider value={{
      properties, addProperty, deleteProperty, toggleAvailability, editProperty,
      tenants, addTenant, deleteTenant, editTenant,
      leases, addLease, renewLease, terminateLease,
      payments, addPayment, markPaymentPaid, deletePayment,
      activity, clearActivity,
      loading: false, error: null, refetch: () => {}
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
