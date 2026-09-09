import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bidsure_secret_key_sih_2026';

router.post('/login', async (req, res) => {
  try {
    const { role } = req.body;
    let user = await User.findOne({ role });

    if (!user) {
      user = await User.findOne({});
    }

    if (!user) {
      return res.status(404).json({ error: 'No user found' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role, department: user.department },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        department: user.department,
        avatarInitials: user.avatarInitials,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const user = await User.findOne({});
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      name: user.name,
      role: user.role,
      department: user.department,
      avatarInitials: user.avatarInitials,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
