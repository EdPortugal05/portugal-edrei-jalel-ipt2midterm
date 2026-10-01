// ROUTES: the 4 operations (CRUD) for deliveries.
// All routes start with /api/deliveries (set in server.js).
const express = require('express');
const mongoose = require('mongoose');
const Delivery = require('../models/Delivery');

const router = express.Router();

// Helper: turns a validation error into a clean 400 response (no crash).
function handleError(res, err) {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') {
    // e.g. a date or number that cannot be understood
    return res.status(400).json({ message: `Invalid value for ${err.path}` });
  }
  console.error(err);
  return res.status(500).json({ message: 'Server error' });
}

// Helper: checks that an id looks like a real MongoDB id.
function isBadId(id) {
  return !mongoose.isValidObjectId(id);
}

// CREATE: POST /api/deliveries -> 201 Created
router.post('/', async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);
    res.status(201).json(delivery);
  } catch (err) {
    handleError(res, err);
  }
});

// READ ALL: GET /api/deliveries -> 200 OK (newest date first)
router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find().sort({ date: -1 });
    res.json(deliveries);
  } catch (err) {
    handleError(res, err);
  }
});

// UPDATE: PUT /api/deliveries/:id -> 200 OK, or 404 if not found
router.put('/:id', async (req, res) => {
  try {
    if (isBadId(req.params.id)) return res.status(400).json({ message: 'Invalid delivery id' });

    const updated = await Delivery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,           // return the updated record
      runValidators: true, // apply the schema rules on update too
    });
    if (!updated) return res.status(404).json({ message: 'Delivery not found' });
    res.json(updated);
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE: DELETE /api/deliveries/:id -> 200 OK, or 404 if not found
router.delete('/:id', async (req, res) => {
  try {
    if (isBadId(req.params.id)) return res.status(400).json({ message: 'Invalid delivery id' });

    const deleted = await Delivery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Delivery not found' });
    res.json({ message: 'Delivery deleted' });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
