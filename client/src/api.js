// API HELPER: every call to the backend lives here, so components stay clean.
// The frontend NEVER talks to the database directly, only to this API.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/deliveries';

async function request(path = '', options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed'); // shown to the user
  return data;
}

export const getDeliveries = () => request();
export const createDelivery = (delivery) => request('', { method: 'POST', body: JSON.stringify(delivery) });
export const updateDelivery = (id, delivery) => request(`/${id}`, { method: 'PUT', body: JSON.stringify(delivery) });
export const deleteDelivery = (id) => request(`/${id}`, { method: 'DELETE' });
