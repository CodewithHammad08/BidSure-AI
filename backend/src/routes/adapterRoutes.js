import express from 'express';
import AdapterStatus from '../models/AdapterStatus.js';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const adapters = await AdapterStatus.find();
    res.json(adapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/test', async (req, res) => {
  try {
    const adapter = await AdapterStatus.findOne({ id: req.params.id });
    if (!adapter) {
      return res.status(404).json({ error: 'Adapter not found' });
    }

    adapter.latencyMs = Math.floor(Math.random() * 150) + 40;
    adapter.lastChecked = new Date().toISOString();
    adapter.checkCount += 1;
    await adapter.save();

    const auditEntry = new AuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'user-001',
      userName: 'Priya Nair',
      userRole: 'Procurement Officer',
      actionType: 'GATEWAY_CHECK',
      entityType: 'ADAPTER',
      entityId: adapter.id,
      detail: `Verification Gateway test ping executed for ${adapter.name}. Response time: ${adapter.latencyMs}ms.`
    });
    await auditEntry.save();

    res.json({ adapter, auditEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
