const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
