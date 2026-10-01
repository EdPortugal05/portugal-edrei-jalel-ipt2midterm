// LIST COMPONENT: only displays data. It has no state of its own.
// Everything it needs comes from App.jsx through props.
export default function DeliveryList({ deliveries, onEdit, onDelete, onTogglePaid }) {
  // Empty-list message
  if (deliveries.length === 0) {
    return <p className="message">No deliveries yet. Add your first one above!</p>;
  }

  return (
    <div className="list">
      {deliveries.map((d) => (
        <div className="card delivery" key={d._id}>
          <div className="info">
            <h3>{d.customer}</h3>
            <p>📍 {d.address}</p>
            <p>
              🧴 {d.containers} container{d.containers > 1 ? 's' : ''} · 📅{' '}
              {new Date(d.date).toLocaleDateString()}
            </p>
            <span className={`badge ${d.paid ? 'paid' : 'unpaid'}`}>{d.paid ? 'Paid' : 'Unpaid'}</span>
          </div>

          <div className="buttons">
            <button className="btn" onClick={() => onTogglePaid(d)}>
              Mark {d.paid ? 'Unpaid' : 'Paid'}
            </button>
            <button className="btn" onClick={() => onEdit(d)}>Edit</button>
            <button className="btn danger" onClick={() => onDelete(d._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
