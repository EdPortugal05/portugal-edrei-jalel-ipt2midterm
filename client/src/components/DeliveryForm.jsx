// FORM COMPONENT: used for both adding and editing a delivery.
// State:
//   form   : what is currently typed in the inputs
//   errors : validation messages shown under the inputs
// To add a new field: add it to emptyForm, validate(), and add one <label> + <input>.
import { useEffect, useState } from 'react';

const emptyForm = { customer: '', address: '', containers: 1, date: '', paid: false };

export default function DeliveryForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // When "Edit" is clicked, fill the form with that delivery. When it ends, clear it.
  useEffect(() => {
    if (editing) {
      setForm({ ...editing, date: editing.date.slice(0, 10) }); // yyyy-mm-dd for the date input
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editing]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  // Check the input BEFORE sending it to the server
  function validate() {
    const newErrors = {};
    if (!form.customer.trim()) newErrors.customer = 'Customer name is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!Number.isInteger(Number(form.containers)) || Number(form.containers) < 1)
      newErrors.containers = 'Containers must be a whole number, at least 1';
    if (!form.date) newErrors.date = 'Date is required';
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // stop if invalid

    // send only the real fields (not _id, createdAt, etc.)
    const ok = await onSave({
      customer: form.customer.trim(),
      address: form.address.trim(),
      containers: Number(form.containers),
      date: form.date,
      paid: form.paid,
    });
    if (ok && !editing) setForm(emptyForm); // clear the form after adding
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>{editing ? 'Edit Delivery' : 'New Delivery'}</h2>

      <label>
        Customer
        <input name="customer" value={form.customer} onChange={handleChange} placeholder="e.g. Maria Santos" />
        {errors.customer && <span className="field-error">{errors.customer}</span>}
      </label>

      <label>
        Address
        <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. 123 Rizal St." />
        {errors.address && <span className="field-error">{errors.address}</span>}
      </label>

      <div className="row">
        <label>
          Containers
          <input name="containers" type="number" min="1" value={form.containers} onChange={handleChange} />
          {errors.containers && <span className="field-error">{errors.containers}</span>}
        </label>

        <label>
          Date
          <input name="date" type="date" value={form.date} onChange={handleChange} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </label>
      </div>

      <label className="checkbox">
        <input name="paid" type="checkbox" checked={form.paid} onChange={handleChange} />
        Already paid
      </label>

      <div className="buttons">
        <button type="submit" className="btn primary">{editing ? 'Save Changes' : 'Add Delivery'}</button>
        {editing && (
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
