import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['Procurement Officer', 'Compliance Auditor'] },
  department: { type: String, required: true },
  avatarInitials: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
