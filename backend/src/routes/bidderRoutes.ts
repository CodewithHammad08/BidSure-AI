import express from 'express';
import Bidder from '../models/Bidder.js';

const router = express.Router();

// Get all bidders
router.get('/', async (req, res) => {
  try {
    const bidders = await Bidder.find().sort({ score: -1 });
    res.json(bidders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get bidders by tenderId
router.get('/tender/:tenderId', async (req, res) => {
  try {
    const bidders = await Bidder.find({ tenderId: req.params.tenderId }).sort({ score: -1 });
    res.json(bidders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get bidder by ID
router.get('/:id', async (req, res) => {
  try {
    const bidder = await Bidder.findOne({ id: req.params.id });
    if (!bidder) {
      return res.status(404).json({ error: 'Bidder not found' });
    }
    res.json(bidder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
