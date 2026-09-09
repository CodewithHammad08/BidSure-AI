import mongoose, { Schema, Document } from 'mongoose';

export interface ITenderRequirement {
  id: string;
  code: string;
  title: string;
  category: 'LEGAL' | 'TECHNICAL' | 'FINANCIAL' | 'DECLARATION';
  description: string;
  mandatory: boolean;
  pageRef: number;
}

export interface ITender extends Document {
  id: string;
  title: string;
  referenceNumber: string;
  department: string;
  estimatedValue: string;
  publishDate: string;
  submissionDeadline: string;
  status: 'ACTIVE' | 'CLOSED' | 'UNDER_REVIEW' | 'ARCHIVED';
  biddersCount: number;
  requirements: ITenderRequirement[];
}

const RequirementSchema = new Schema({
  id: { type: String, required: true },
  code: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  mandatory: { type: Boolean, default: true },
  pageRef: { type: Number, required: true }
});

const TenderSchema: Schema = new Schema({
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

export default mongoose.model<ITender>('Tender', TenderSchema);
