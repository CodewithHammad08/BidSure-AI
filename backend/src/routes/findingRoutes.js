import express from 'express';
import Finding from '../models/Finding.js';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { tenderId, bidderId, status, category } = req.query;
    const filter = {};

    if (tenderId) filter.tenderId = tenderId;
    if (bidderId) filter.bidderId = bidderId;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const findings = await Finding.find(filter).sort({ createdAt: -1 });
    res.json(findings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const finding = await Finding.findOne({ id: req.params.id });
    if (!finding) {
      return res.status(404).json({ error: 'Finding not found' });
    }
    res.json(finding);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create / Flag new finding
router.post('/', async (req, res) => {
  try {
    const count = await Finding.countDocuments();
    const newFinding = new Finding({
      ...req.body,
      id: req.body.id || `finding-00${count + 1}`,
      status: 'OPEN'
    });
    await newFinding.save();

    const auditEntry = new AuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'user-001',
      userName: 'Priya Nair',
      userRole: 'Procurement Officer',
      actionType: 'COMPLIANCE_EVALUATION',
      entityType: 'FINDING',
      entityId: newFinding.id,
      detail: `New compliance finding flagged: ${newFinding.title} (${newFinding.bidderName})`
    });
    await auditEntry.save();

    res.status(201).json(newFinding);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
