require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path'); // ✅ add this
const stockRoutes = require('./routes/stocks');

const app = express();

// Middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: true }));

// Rate limiter (100 requests per 15 min per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// API routes
app.use('/api/stocks', stockRoutes);

// ✅ Serve frontend (index.html, CSS, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ For all other routes, serve the frontend index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
