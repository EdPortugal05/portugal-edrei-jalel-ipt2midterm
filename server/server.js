// SERVER ENTRY POINT: connects to the database, then starts Express.
require('dotenv').config(); // loads values from the .env file
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // use public DNS so the Atlas link can be looked up
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const deliveryRoutes = require('./routes/deliveryRoutes');

const app = express();

// Middleware
app.use(cors());         // lets the React app (another port) call this server
app.use(express.json()); // lets us read JSON sent in request bodies

// Routes
app.use('/api/deliveries', deliveryRoutes);

// Unknown route -> JSON 404 instead of a crash
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Catch-all error handler (also covers broken JSON in a request)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ message: 'Bad request' });
});

// DATABASE CONNECTION: the server starts listening only after the DB connects.
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });
