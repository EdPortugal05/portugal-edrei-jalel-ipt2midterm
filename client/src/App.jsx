// APP: the main component. It owns the data (state) and the functions that change it.
// State:
//   deliveries : the list from the database
//   loading    : true while the first fetch is running
//   error      : message shown when a request fails
//   editing    : the delivery being edited (null = adding a new one)
import { useEffect, useState } from 'react';
import { getDeliveries, createDelivery, updateDelivery, deleteDelivery } from './api';
import DeliveryForm from './components/DeliveryForm';
import DeliveryList from './components/DeliveryList';

export default function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  // Load all deliveries once when the page opens
  useEffect(() => {
    getDeliveries()
      .then(setDeliveries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ADD or UPDATE (the form calls this). The screen updates without a refresh.
  async function handleSave(data) {
    setError('');
    try {
      if (editing) {
        const updated = await updateDelivery(editing._id, data);
        setDeliveries(deliveries.map((d) => (d._id === updated._id ? updated : d)));
        setEditing(null);
      } else {
        const created = await createDelivery(data);
        setDeliveries([created, ...deliveries]);
      }
      return true; // tells the form it can reset
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  // DELETE
  async function handleDelete(id) {
    if (!window.confirm('Delete this delivery?')) return;
    setError('');
    try {
      await deleteDelivery(id);
      setDeliveries(deliveries.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Quick button: flip paid / unpaid (uses the same UPDATE route)
  async function handleTogglePaid(delivery) {
    setError('');
    try {
      const updated = await updateDelivery(delivery._id, {
        customer: delivery.customer,
        address: delivery.address,
        containers: delivery.containers,
        date: delivery.date,
        paid: !delivery.paid,
      });
      setDeliveries(deliveries.map((d) => (d._id === updated._id ? updated : d)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>💧 Water Refilling Delivery Log</h1>
        <p className="subtitle">Track who ordered, how many containers, and who has paid.</p>
      </header>

      {error && <div className="message error">{error}</div>}

      <DeliveryForm
        editing={editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />

      {loading ? (
        <p className="message">Loading deliveries...</p>
      ) : (
        <DeliveryList
          deliveries={deliveries}
          onEdit={setEditing}
          onDelete={handleDelete}
          onTogglePaid={handleTogglePaid}
        />
      )}
    </div>
  );
}
