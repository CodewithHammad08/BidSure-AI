import mongoose from 'mongoose';

const FindingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tenderId: { type: String, required: true },
  bidderId: { type: String, required: true },
  bidderName: { type: String, required: true },
  ruleId: { type: String, required: true },
  requirementTitle: { type: String, required: true },
  category: { type: String, required: true, enum: ['GST', 'MSME', 'OEM', 'EXPIRY', 'DECLARATION', 'MISMATCH'] },
  severity: { type: String, required: true, enum: ['CRITICAL', 'WARNING', 'INFO'] },
  status: { type: String, required: true, enum: ['OPEN', 'ACCEPTED', 'DISMISSED', 'CLARIFICATION_REQUESTED'], default: 'OPEN' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  aiRecommendation: { type: String, required: true },
  evidenceQuote: { type: String, required: true },
  documentName: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  boundingBox: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  officerNote: { type: String },
  reviewedBy: { type: String },
  reviewedAt: { type: String }
}, { timestamps: true });

export default mongoose.model('Finding', FindingSchema);
