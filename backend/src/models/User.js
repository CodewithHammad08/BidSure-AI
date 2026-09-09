import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Procurement Officer', 'Compliance Auditor'],
    default: 'Compliance Auditor',
  },
  department: { type: String, required: true },
  avatarInitials: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  // Status for Procurement Officers – must be approved by Admin
  status: {
    type: String,
    enum: ['ACTIVE', 'PENDING_APPROVAL', 'REJECTED'],
    default: 'ACTIVE',
  },
  // Officer-specific request details (filled during signup request)
  requestNote: { type: String, default: '' },
  approvedBy: { type: String, default: null },
  approvedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
