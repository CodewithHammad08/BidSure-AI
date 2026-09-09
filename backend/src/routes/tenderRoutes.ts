import express from 'express';
import Tender from '../models/Tender.js';

const router = express.Router();

// Get all tenders
router.get('/', async (req, res) => {
  try {
    const tenders = await Tender.find().sort({ createdAt: -1 });
    res.json(tenders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get tender by ID
router.get('/:id', async (req, res) => {
  try {
    const tender = await Tender.findOne({ id: req.params.id });
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    res.json(tender);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new tender
router.post('/', async (req, res) => {
  try {
    const count = await Tender.countDocuments();
    const newTender = new Tender({
      ...req.body,
      id: req.body.id || `tender-00${count + 1}`,
      biddersCount: 0,
      status: 'ACTIVE'
    });
    await newTender.save();
    res.status(201).json(newTender);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
