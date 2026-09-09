import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  actionType: { 
    type: String, 
    required: true, 
    enum: ['OFFICER_DECISION', 'TENDER_INGESTION', 'COMPLIANCE_EVALUATION', 'SYSTEM_ALERT', 'GATEWAY_CHECK'] 
  },
  entityType: { type: String, required: true, enum: ['FINDING', 'TENDER', 'BIDDER', 'ADAPTER'] },
  entityId: { type: String, required: true },
  detail: { type: String, required: true },
  previousState: { type: String },
  newState: { type: String }
}, { timestamps: true });

export default mongoose.model('AuditLog', AuditLogSchema);
