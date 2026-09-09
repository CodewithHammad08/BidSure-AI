import mongoose from 'mongoose';

const RequirementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  code: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  mandatory: { type: Boolean, default: true },
  pageRef: { type: Number, required: true }
});

const TenderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  referenceNumber: { type: String, required: true },
  department: { type: String, required: true },
  estimatedValue: { type: String, required: true },
  publishDate: { type: String, required: true },
  submissionDeadline: { type: String, required: true },
  status: { type: String, required: true, enum: ['ACTIVE', 'CLOSED', 'UNDER_REVIEW', 'ARCHIVED'] },
  biddersCount: { type: Number, default: 0 },
  requirements: [RequirementSchema]
}, { timestamps: true });

export default mongoose.model('Tender', TenderSchema);
