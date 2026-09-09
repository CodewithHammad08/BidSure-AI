import mongoose from 'mongoose';

const DocumentItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  pageCount: { type: Number, required: true },
  extractedFields: { type: Number, required: true },
  confidenceScore: { type: Number, required: true },
  sha256: { type: String, required: true }
});

const RapidFuzzResultSchema = new mongoose.Schema({
  doc1: { type: String, required: true },
  doc2: { type: String, required: true },
  field: { type: String, required: true },
  val1: { type: String, required: true },
  val2: { type: String, required: true },
  similarityPercentage: { type: Number, required: true },
  flagged: { type: Boolean, default: false }
});

const BidderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tenderId: { type: String, required: true },
  companyName: { type: String, required: true },
  gstin: { type: String, required: true },
  udyamNo: { type: String, required: true },
  cin: { type: String, required: true },
  score: { type: Number, required: true },
  riskLevel: { type: String, required: true, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  submittedAt: { type: String, required: true },
  documents: [DocumentItemSchema],
  crossDocVerification: [RapidFuzzResultSchema],
  categoryScores: {
    mandatoryDocs: { type: Number, default: 25 },
    validity: { type: Number, default: 20 },
    entityConsistency: { type: Number, default: 25 },
    technicalRequirements: { type: Number, default: 20 },
    verificationChecks: { type: Number, default: 10 }
  }
}, { timestamps: true });

export default mongoose.model('Bidder', BidderSchema);
