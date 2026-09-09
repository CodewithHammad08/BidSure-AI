import express from 'express';
import Tender from '../models/Tender.js';
import Bidder from '../models/Bidder.js';
import Finding from '../models/Finding.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const activeTendersCount = await Tender.countDocuments({ status: 'ACTIVE' });
    const bidders = await Bidder.find();
    const totalBidders = bidders.length;
    
    let totalDocs = 0;
    bidders.forEach(b => { totalDocs += b.documents.length; });

    const openFindingsCount = await Finding.countDocuments({ status: 'OPEN' });

    // Risk distribution calculation
    const lowRiskCount = bidders.filter(b => b.riskLevel === 'LOW').length;
    const mediumRiskCount = bidders.filter(b => b.riskLevel === 'MEDIUM').length;
    const highRiskCount = bidders.filter(b => b.riskLevel === 'HIGH').length;

    res.json({
      kpis: {
        activeTenders: activeTendersCount,
        biddersUnderReview: totalBidders,
        documentsProcessed: totalDocs,
        issuesRequiringReview: openFindingsCount
      },
      riskDistribution: [
        { name: 'Low Risk (Score >= 90)', count: lowRiskCount, color: '#10b981' },
        { name: 'Medium Risk (65-89)', count: mediumRiskCount, color: '#f59e0b' },
        { name: 'High Risk (<65)', count: highRiskCount, color: '#ef4444' }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
