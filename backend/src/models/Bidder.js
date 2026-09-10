import mongoose from 'mongoose';

const DocumentItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  pageCount: { type: Number, required: true, default: 1 },
  extractedFields: { type: Number, required: true, default: 5 },
  confidenceScore: { type: Number, required: true, default: 90 },
  sha256: { type: String, required: true, default: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  filePath: { type: String, default: '' },
  ocrText: { type: String, default: '' },
  ocrStatus: { type: String, enum: ['SUCCESS', 'PENDING', 'PARTIAL', 'FAILED'], default: 'SUCCESS' },
  extractedFieldsMap: { type: Object, default: {} },
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
  bidderUserId: { type: String, default: '' },
  tenderId: { type: String, required: true },
  companyName: { type: String, required: true },
  gstin: { type: String, required: true },
  udyamNo: { type: String, default: '' },
  cin: { type: String, default: '' },
  quotedAmount: { type: String, default: '' },
  score: { type: Number, required: true, default: 85 },
  riskLevel: { type: String, required: true, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
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
