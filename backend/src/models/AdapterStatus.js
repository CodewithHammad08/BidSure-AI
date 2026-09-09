import mongoose from 'mongoose';

const AdapterStatusSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  service: { type: String, required: true },
  endpoint: { type: String, required: true },
  status: { type: String, required: true, enum: ['HEALTHY', 'DEGRADED', 'MOCK_ACTIVE'] },
  latencyMs: { type: Number, required: true },
  lastChecked: { type: String, required: true },
  checkCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('AdapterStatus', AdapterStatusSchema);
