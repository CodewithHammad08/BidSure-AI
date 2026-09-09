import mongoose, { Schema, Document } from 'mongoose';

export interface IAdapterStatus extends Document {
  id: string;
  name: string;
  service: string;
  endpoint: string;
  status: 'HEALTHY' | 'DEGRADED' | 'MOCK_ACTIVE';
  latencyMs: number;
  lastChecked: string;
  checkCount: number;
}

const AdapterStatusSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  service: { type: String, required: true },
  endpoint: { type: String, required: true },
  status: { type: String, required: true, enum: ['HEALTHY', 'DEGRADED', 'MOCK_ACTIVE'] },
  latencyMs: { type: Number, required: true },
  lastChecked: { type: String, required: true },
  checkCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IAdapterStatus>('AdapterStatus', AdapterStatusSchema);
