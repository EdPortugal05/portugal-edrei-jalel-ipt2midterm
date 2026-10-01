// MODEL: describes what ONE delivery record looks like in the database.
// To add a new field later, add one line inside the object below.
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    customer:   { type: String, required: [true, 'Customer name is required'], trim: true },
    address:    { type: String, required: [true, 'Address is required'], trim: true },
    containers: {
      type: Number,
      required: [true, 'Number of containers is required'],
      min: [1, 'Containers must be at least 1'],
      validate: { validator: Number.isInteger, message: 'Containers must be a whole number' },
    },
    date:       { type: Date, required: [true, 'Delivery date is required'] },
    paid:       { type: Boolean, default: false }, // false = unpaid, true = paid
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Delivery', deliverySchema);
