import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useState([
    { propertyId: '1', address: '123 Main St', rent: 1200, bedrooms: 2, bathrooms: 1, available: true },
    { propertyId: '2', address: '456 Oak Ave', rent: 1500, bedrooms: 3, bathrooms: 2, available: false },
    { propertyId: '3', address: '789 Pine Rd', rent: 900, bedrooms: 1, bathrooms: 1, available: true }
  ]);

  const [tenants, setTenants] = useState([
    { tenantId: '1', name: 'John Doe', email: 'john@email.com', phone: '555-0100' },
    { tenantId: '2', name: 'Jane Smith', email: 'jane@email.com', phone: '555-0200' }
  ]);

  const [leases, setLeases] = useState([
    { leaseId: '1', propertyId: '2', propertyAddress: '456 Oak Ave', tenantId: '1', tenantName: 'John Doe', startDate: '2024-01-01', endDate: '2024-12-31', monthlyRent: 1200, status: 'active' },
    { leaseId: '2', propertyId: '2', propertyAddress: '456 Oak Ave', tenantId: '2', tenantName: 'Jane Smith', startDate: '2024-03-01', endDate: '2025-02-28', monthlyRent: 1500, status: 'active' }
  ]);

  const [payments, setPayments] = useState([
    { paymentId: '1', tenantName: 'John Doe', amount: 1200, dueDate: '2024-02-01', status: 'paid' },
    { paymentId: '2', tenantName: 'Jane Smith', amount: 1500, dueDate: '2024-02-01', status: 'pending' },
    { paymentId: '3', tenantName: 'John Doe', amount: 1200, dueDate: '2024-03-01', status: 'pending' }
  ]);

  const addProperty = (property) => setProperties(prev => [...prev, { ...property, propertyId: Date.now().toString(), available: true }]);
  const deleteProperty = (id) => setProperties(prev => prev.filter(p => p.propertyId !== id));
  const toggleAvailability = (id) => setProperties(prev => prev.map(p => p.propertyId === id ? { ...p, available: !p.available } : p));
  const editProperty = (id, data) => setProperties(prev => prev.map(p => p.propertyId === id ? { ...p, ...data } : p));

  const addTenant = (tenant) => setTenants(prev => [...prev, { ...tenant, tenantId: Date.now().toString() }]);
  const deleteTenant = (id) => setTenants(prev => prev.filter(t => t.tenantId !== id));
  const editTenant = (id, data) => setTenants(prev => prev.map(t => t.tenantId === id ? { ...t, ...data } : t));

  const addLease = (lease) => setLeases(prev => [...prev, { ...lease, leaseId: Date.now().toString(), status: 'active' }]);

  const addPayment = (payment) => setPayments(prev => [...prev, { ...payment, paymentId: Date.now().toString(), status: 'pending' }]);
  const markPaymentPaid = (id) => setPayments(prev => prev.map(p => p.paymentId === id ? { ...p, status: 'paid' } : p));

  return (
    <AppContext.Provider value={{
      properties, addProperty, deleteProperty, toggleAvailability, editProperty,
      tenants, addTenant, deleteTenant, editTenant,
      leases, addLease,
      payments, addPayment, markPaymentPaid
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);