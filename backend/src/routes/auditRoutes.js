import express from 'express';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { actionType, entityType } = req.query;
    const filter = {};
    if (actionType) filter.actionType = actionType;
    if (entityType) filter.entityType = entityType;

    const logs = await AuditLog.find(filter).sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const log = new AuditLog({
      ...req.body,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
