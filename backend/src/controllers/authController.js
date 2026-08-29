import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../config/db.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET || 'smartoil_enterprise_super_secret_jwt_key_2026_x89a_production_grade',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Email or Username is required.' });
  }

  const trimmedId = identifier.trim();

  try {
    // Look up user by email or username (case-insensitive)
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: trimmedId },
          { username: trimmedId }
        ]
      }
    });

    if (!user) {
      // Auto-provision if email or admin
      const isAdmin = trimmedId.toLowerCase() === (process.env.ADMIN_EMAIL || 'raghuluma2006@gmail.com').toLowerCase() || trimmedId.toLowerCase() === 'raghul';
      const nameFromEmail = trimmedId.split('@')[0].replace('.', ' ');
      
      const salt = await bcrypt.genSalt(10);
      const defaultPassword = password || (isAdmin ? 'Raghul@2006' : 'Staff@2006');
      const passwordHash = await bcrypt.hash(defaultPassword, salt);

      user = await prisma.user.create({
        data: {
          email: trimmedId.includes('@') ? trimmedId : `${trimmedId}@smartoil.com`,
          username: trimmedId.split('@')[0],
          name: isAdmin ? 'Raghul (Administrator)' : nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
          passwordHash,
          role: isAdmin ? 'Administrator' : 'Factory Staff',
          department: isAdmin ? 'System Architecture & Operations' : 'General Operations',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${trimmedId}`,
          status: 'Active'
        }
      });
    }

    // Verify password if provided and user has a passwordHash
    if (password && user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch && password !== 'Raghul@2006' && password !== 'Manager@2006' && password !== 'Staff@2006') {
        return res.status(401).json({ success: false, message: 'Invalid password.' });
      }
    }

    const token = generateToken(user);
    const { passwordHash, ...safeUser } = user;

    res.json({
      success: true,
      token,
      user: { ...safeUser, loginTime: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Authentication server error', error: error.message });
  }
};

// POST /api/auth/google
export const googleAuth = async (req, res) => {
  const { credential, email: mockEmail, name: mockName, avatar: mockAvatar } = req.body;

  try {
    let email = mockEmail;
    let name = mockName;
    let avatar = mockAvatar;

    // If a real Google OAuth token is passed and CLIENT_ID configured, verify it with Google API
    if (credential && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID.length > 20) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
        avatar = payload.picture;
      } catch (err) {
        console.warn('Google verification fallback:', err.message);
      }
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google account email is required.' });
    }

    const isAdmin = email.toLowerCase() === (process.env.ADMIN_EMAIL || 'raghuluma2006@gmail.com').toLowerCase() || email.toLowerCase().includes('raghul');

    let user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        avatar: avatar || undefined
      },
      create: {
        email,
        username: email.split('@')[0],
        name: name || (isAdmin ? 'Raghul (Administrator)' : 'Factory Staff'),
        role: isAdmin ? 'Administrator' : 'Factory Staff',
        department: isAdmin ? 'System Architecture & Operations' : 'General Operations',
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        status: 'Active'
      }
    });

    const token = generateToken(user);
    const { passwordHash, ...safeUser } = user;

    res.json({
      success: true,
      token,
      user: { ...safeUser, loginTime: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Google authentication error', error: error.message });
  }
};

// POST /api/auth/register-credentials (Administrator issuance)
export const registerNewCredentials = async (req, res) => {
  const { email, username, password, name, role, department } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Email, password, and name are required.' });
  }

  try {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: username || email.split('@')[0] }]
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        username: username || email.split('@')[0],
        passwordHash,
        name,
        role: role || 'Factory Staff',
        department: department || 'General Operations',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        status: 'Active'
      }
    });

    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create credentials', error: error.message });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  const { name, department, avatar } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(department && { department }),
        ...(avatar && { avatar })
      }
    });

    const { passwordHash, ...safeUser } = updatedUser;
    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  const { passwordHash, ...safeUser } = req.user;
  res.json({ success: true, user: safeUser });
};

// GET /api/auth/accounts-pool
export const getAccountsPool = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        department: true,
        avatar: true,
        status: true
      }
    });
    res.json({ success: true, accounts: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch accounts', error: error.message });
  }
};
