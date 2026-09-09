import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  role: 'Procurement Officer' | 'Compliance Auditor';
  department: string;
  avatarInitials: string;
  email: string;
  passwordHash: string;
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['Procurement Officer', 'Compliance Auditor'] },
  department: { type: String, required: true },
  avatarInitials: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
