import express from 'express';
import Finding from '../models/Finding.js';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

// Get all findings
router.get('/', async (req, res) => {
  try {
    const { tenderId, bidderId, status, category } = req.query;
    const filter: any = {};

    if (tenderId) filter.tenderId = tenderId;
    if (bidderId) filter.bidderId = bidderId;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const findings = await Finding.find(filter).sort({ createdAt: -1 });
    res.json(findings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get finding by ID
router.get('/:id', async (req, res) => {
  try {
    const finding = await Finding.findOne({ id: req.params.id });
    if (!finding) {
      return res.status(404).json({ error: 'Finding not found' });
    }
    res.json(finding);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Officer Decision Update
router.patch('/:id/decision', async (req, res) => {
  try {
    const { status, officerNote, reviewedBy } = req.body;
    
    if (!['ACCEPTED', 'DISMISSED', 'CLARIFICATION_REQUESTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid decision status' });
    }

    const finding = await Finding.findOne({ id: req.params.id });
    if (!finding) {
      return res.status(404).json({ error: 'Finding not found' });
    }

    const prevStatus = finding.status;
    finding.status = status;
    finding.officerNote = officerNote || '';
    finding.reviewedBy = reviewedBy || 'Priya Nair (PO-001)';
    finding.reviewedAt = new Date().toISOString();

    await finding.save();

    // Create immutable Audit Trail record
    const auditEntry = new AuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'user-001',
      userName: reviewedBy || 'Priya Nair',
      userRole: 'Procurement Officer',
      actionType: 'OFFICER_DECISION',
      entityType: 'FINDING',
      entityId: finding.id,
      detail: `Officer decision recorded: ${status} for finding "${finding.title}". Note: ${officerNote || 'N/A'}`,
      previousState: prevStatus,
      newState: status
    });
    await auditEntry.save();

    res.json({ finding, auditEntry });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
