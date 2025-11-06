const express = require('express');
const { body, validationResult } = require('express-validator');
const Stock = require('../models/Stock');

const router = express.Router();

// Validation: only 1–5 uppercase letters
const symbolValidators = body('symbol')
  .exists().withMessage('symbol is required')
  .bail()
  .isLength({ min: 1, max: 5 }).withMessage('symbol must be 1–5 letters')
  .bail()
  .matches(/^[A-Z]{1,5}$/).withMessage('symbol must be uppercase A–Z only');

// Add a stock
router.post('/', symbolValidators, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { symbol } = req.body;

    const existing = await Stock.findOne({ symbol }).lean();
    if (existing) return res.status(409).json({ error: 'Symbol already exists' });

    const stock = new Stock({ symbol });
    await stock.save();

    res.status(201).json({ message: 'Added', symbol });
  } catch (err) {
    next(err);
  }
});

// View all stocks
router.get('/', async (req, res, next) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: -1 }).select('symbol -_id').lean();
    res.json({ count: stocks.length, stocks: stocks.map(s => s.symbol) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
