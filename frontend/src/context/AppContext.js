import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activity, setActivity] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rms_activity')) || []; } catch { return []; }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const log = (message) => {
    const entry = { id: Date.now(), message, time: new Date().toLocaleTimeString() };
    setActivity(prev => {
      const next = [entry, ...prev].slice(0, 10);
      localStorage.setItem('rms_activity', JSON.stringify(next));
      return next;
    });
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, t, l, pay] = await Promise.all([
        api.properties.getAll(),
        api.tenants.getAll(),
        api.leases.getAll(),
        api.payments.getAll()
      ]);
      setProperties(p);
      setTenants(t);
      setLeases(l);
      setPayments(pay);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Properties
  const addProperty = async (data) => {
    const created = await api.properties.create(data);
    setProperties(prev => [...prev, created]);
    log(`Property "${created.address}" added`);
  };
  const editProperty = async (id, data) => {
    const updated = await api.properties.update(id, data);
    setProperties(prev => prev.map(p => p.propertyId === id ? updated : p));
  };
  const deleteProperty = async (id) => {
    const found = properties.find(p => p.propertyId === id);
    await api.properties.remove(id);
    setProperties(prev => prev.filter(p => p.propertyId !== id));
    if (found) log(`Property "${found.address}" deleted`);
  };
  const toggleAvailability = async (id) => {
    const prop = properties.find(p => p.propertyId === id);
    if (!prop) return;
    const updated = await api.properties.update(id, { ...prop, available: !prop.available });
    setProperties(prev => prev.map(p => p.propertyId === id ? updated : p));
  };

  // Tenants
  const addTenant = async (data) => {
    const created = await api.tenants.create(data);
    setTenants(prev => [...prev, created]);
    log(`Tenant "${created.name}" added`);
  };
  const editTenant = async (id, data) => {
    const updated = await api.tenants.update(id, data);
    setTenants(prev => prev.map(t => t.tenantId === id ? updated : t));
  };
  const deleteTenant = async (id) => {
    const found = tenants.find(t => t.tenantId === id);
    await api.tenants.remove(id);
    setTenants(prev => prev.filter(t => t.tenantId !== id));
    if (found) log(`Tenant "${found.name}" removed`);
  };

  // Leases
  const addLease = async (data) => {
    const created = await api.leases.create({ ...data, status: 'active' });
    setLeases(prev => [...prev, created]);
    log(`Lease created for "${created.propertyAddress}"`);
  };
  const terminateLease = async (id) => {
    const found = leases.find(l => l.leaseId === id);
    const updated = await api.leases.update(id, { status: 'terminated' });
    setLeases(prev => prev.map(l => l.leaseId === id ? updated : l));
    if (found) log(`Lease for "${found.propertyAddress}" terminated`);
  };
  const renewLease = async (id, newEndDate) => {
    const found = leases.find(l => l.leaseId === id);
    const updated = await api.leases.update(id, { status: 'active', endDate: newEndDate });
    setLeases(prev => prev.map(l => l.leaseId === id ? updated : l));
    if (found) log(`Lease for "${found.propertyAddress}" renewed until ${newEndDate}`);
  };

  // Payments
  const addPayment = async (data) => {
    const created = await api.payments.create({ ...data, status: 'pending' });
    setPayments(prev => [...prev, created]);
  };
  const markPaymentPaid = async (id) => {
    const updated = await api.payments.markPaid(id);
    const found = payments.find(p => p.paymentId === id);
    setPayments(prev => prev.map(p => p.paymentId === id ? updated : p));
    if (found) log(`Payment of $${found.amount} by "${found.tenantName}" marked paid`);
  };
  const deletePayment = async (id) => {
    await api.payments.remove(id);
    setPayments(prev => prev.filter(p => p.paymentId !== id));
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
      loading, error, refetch: fetchAll
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
