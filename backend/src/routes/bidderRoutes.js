import express from 'express';
import Bidder from '../models/Bidder.js';
import Tender from '../models/Tender.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const bidders = await Bidder.find().sort({ score: -1 });
    res.json(bidders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tender/:tenderId', async (req, res) => {
  try {
    const bidders = await Bidder.find({ tenderId: req.params.tenderId }).sort({ score: -1 });
    res.json(bidders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const bidder = await Bidder.findOne({ id: req.params.id });
    if (!bidder) {
      return res.status(404).json({ error: 'Bidder not found' });
    }
    res.json(bidder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create / Save Bidder to MongoDB
router.post('/', async (req, res) => {
  try {
    const count = await Bidder.countDocuments();
    const newBidder = new Bidder({
      ...req.body,
      id: req.body.id || `bidder-00${count + 1}`,
      submittedAt: new Date().toISOString(),
      documents: req.body.documents || [],
      crossDocVerification: req.body.crossDocVerification || [],
      categoryScores: req.body.categoryScores || {
        mandatoryDocs: 25,
        validity: 20,
        entityConsistency: 25,
        technicalRequirements: 20,
        verificationChecks: 10
      }
    });
    await newBidder.save();

    // Increment biddersCount on Tender
    if (req.body.tenderId) {
      await Tender.updateOne({ id: req.body.tenderId }, { $inc: { biddersCount: 1 } });
    }

    res.status(201).json(newBidder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
