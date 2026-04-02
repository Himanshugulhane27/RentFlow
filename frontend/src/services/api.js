const BASE = process.env.REACT_APP_API_URL;

if (!BASE) {
  console.warn('REACT_APP_API_URL is not set. API calls will fail. Copy .env.example to .env and set the value.');
}

const ALLOWED_BASE = BASE || '';

const request = async (path, method = 'GET', body = null) => {
  if (!ALLOWED_BASE) throw new Error('API URL is not configured. Set REACT_APP_API_URL in your .env file.');
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${ALLOWED_BASE}${path}`, options);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

const api = {
  properties: {
    getAll: () => request('/properties'),
    getById: (id) => request(`/properties/${id}`),
    create: (data) => request('/properties', 'POST', data),
    update: (id, data) => request(`/properties/${id}`, 'PUT', data),
    remove: (id) => request(`/properties/${id}`, 'DELETE')
  },
  tenants: {
    getAll: () => request('/tenants'),
    getById: (id) => request(`/tenants/${id}`),
    create: (data) => request('/tenants', 'POST', data),
    update: (id, data) => request(`/tenants/${id}`, 'PUT', data),
    remove: (id) => request(`/tenants/${id}`, 'DELETE')
  },
  leases: {
    getAll: () => request('/leases'),
    getById: (id) => request(`/leases/${id}`),
    create: (data) => request('/leases', 'POST', data),
    update: (id, data) => request(`/leases/${id}`, 'PUT', data),
    remove: (id) => request(`/leases/${id}`, 'DELETE')
  },
  payments: {
    getAll: () => request('/payments'),
    getById: (id) => request(`/payments/${id}`),
    create: (data) => request('/payments', 'POST', data),
    markPaid: (id) => request(`/payments/${id}`, 'PUT'),
    remove: (id) => request(`/payments/${id}`, 'DELETE')
  }
};

export default api;