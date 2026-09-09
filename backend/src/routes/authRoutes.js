import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bidsure_secret_key_sih_2026';

// ────────────────────────────────────────────────────────────────────────────
// Helper: sign token
// ────────────────────────────────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
      department: user.department,
      status: user.status,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function userPublic(user) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    department: user.department,
    avatarInitials: user.avatarInitials,
    email: user.email,
    status: user.status,
    requestNote: user.requestNote,
    approvedBy: user.approvedBy,
    approvedAt: user.approvedAt,
    createdAt: user.createdAt,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// POST /api/auth/signup
// Registers a new user.
// • Compliance Auditor   → immediately ACTIVE
// • Procurement Officer  → status PENDING_APPROVAL (admin must approve)
// • Admin                → immediately ACTIVE (only allowed if no admin exists yet)
// ────────────────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, department, requestNote } = req.body;

    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const allowedRoles = ['Compliance Auditor', 'Procurement Officer'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Choose Compliance Auditor or Procurement Officer.' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const status = role === 'Procurement Officer' ? 'PENDING_APPROVAL' : 'ACTIVE';

    const user = new User({
      id: `usr-${uuidv4().slice(0, 8)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      department,
      avatarInitials: initials,
      status,
      requestNote: requestNote || '',
    });

    await user.save();

    if (status === 'ACTIVE') {
      const token = signToken(user);
      return res.status(201).json({ token, user: userPublic(user) });
    }

    // Officer pending approval – no token yet
    return res.status(201).json({
      message: 'Your Procurement Officer account request has been submitted. An Admin will review and approve it.',
      pending: true,
      user: userPublic(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ────────────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'PENDING_APPROVAL') {
      return res.status(403).json({
        error: 'Your Procurement Officer account is pending admin approval. You will be notified once approved.',
        pending: true,
      });
    }

    if (user.status === 'REJECTED') {
      return res.status(403).json({ error: 'Your account request was rejected. Contact the system administrator.' });
    }

    const token = signToken(user);
    res.json({ token, user: userPublic(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me  (token required)
// ────────────────────────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided.' });
    }
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = await User.findOne({ id: decoded.id });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(userPublic(user));
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /api/auth/officer-requests
// Admin only – list all PENDING_APPROVAL Procurement Officer accounts
// ────────────────────────────────────────────────────────────────────────────
router.get('/officer-requests', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token.' });

    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'Admin') return res.status(403).json({ error: 'Admin access required.' });

    const pending = await User.find({ role: 'Procurement Officer', status: 'PENDING_APPROVAL' });
    res.json(pending.map(userPublic));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /api/auth/users
// Admin only – list ALL users
// ────────────────────────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token.' });

    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'Admin') return res.status(403).json({ error: 'Admin access required.' });

    const users = await User.find({});
    res.json(users.map(userPublic));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// PATCH /api/auth/officer-requests/:id/approve
// Admin approves a pending Procurement Officer
// ────────────────────────────────────────────────────────────────────────────
router.patch('/officer-requests/:id/approve', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token.' });

    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'Admin') return res.status(403).json({ error: 'Admin access required.' });

    const user = await User.findOneAndUpdate(
      { id: req.params.id, role: 'Procurement Officer' },
      { status: 'ACTIVE', approvedBy: decoded.name, approvedAt: new Date() },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'Officer request not found.' });
    res.json({ message: 'Officer account approved.', user: userPublic(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// PATCH /api/auth/officer-requests/:id/reject
// Admin rejects a pending Procurement Officer
// ────────────────────────────────────────────────────────────────────────────
router.patch('/officer-requests/:id/reject', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token.' });

    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'Admin') return res.status(403).json({ error: 'Admin access required.' });

    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { status: 'REJECTED' },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'Officer request rejected.', user: userPublic(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// POST /api/auth/admin/add-officer
// Admin manually creates a Procurement Officer account (already ACTIVE)
// ────────────────────────────────────────────────────────────────────────────
router.post('/admin/add-officer', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token.' });

    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'Admin') return res.status(403).json({ error: 'Admin access required.' });

    const { name, email, password, department } = req.body;
    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: 'name, email, password, and department are required.' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already in use.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

    const user = new User({
      id: `usr-${uuidv4().slice(0, 8)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'Procurement Officer',
      department,
      avatarInitials: initials,
      status: 'ACTIVE',
      approvedBy: decoded.name,
      approvedAt: new Date(),
    });

    await user.save();
    res.status(201).json({ message: 'Procurement Officer created successfully.', user: userPublic(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
