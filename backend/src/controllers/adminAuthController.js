const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const AdminPasswordReset = require('../models/AdminPasswordReset');
const { signAdminAccessToken } = require('../utils/adminToken');
const { normalizeAdminPhone10 } = require('../utils/phone');
const { sendAdminPasswordResetEmail, isMailConfigured } = require('../services/adminMail');

const sanitizeAdmin = (admin) => ({
  id: admin._id,
  username: admin.username,
  email: admin.email,
  phone: admin.phone
});

const generateOtp4 = () => String(crypto.randomInt(0, 10000)).padStart(4, '0');

const hashOtp = (email, otp) => {
  const pepper = process.env.ADMIN_OTP_SECRET || process.env.ADMIN_JWT_SECRET || 'change-admin-otp-secret';
  return crypto.createHmac('sha256', pepper).update(`${email.toLowerCase().trim()}:${otp}`).digest('hex');
};

const verifyOtpHash = (email, otp, storedHash) => {
  const next = hashOtp(email, otp);
  try {
    const a = Buffer.from(next, 'hex');
    const b = Buffer.from(storedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
};

const register = async (req, res) => {
  try {
    const { username, email, phone, password, confirmPassword } = req.body;
    const u = String(username || '').trim();
    const e = String(email || '').trim();
    const p = String(phone || '').trim();
    const pw = String(password || '');
    const cpw = String(confirmPassword || '');

    if (!u || !e || !p || !pw || !cpw) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (pw !== cpw) {
      return res.status(400).json({ message: 'Password and confirm password do not match.' });
    }
    if (pw.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const phoneNorm = normalizeAdminPhone10(p);
    if (!phoneNorm) {
      return res.status(400).json({ message: 'Mobile number must be exactly 10 digits.' });
    }

    const emailLower = e.toLowerCase();
    const dup = await Admin.findOne({ $or: [{ email: emailLower }, { phone: phoneNorm }] });
    if (dup) {
      return res.status(409).json({ message: 'An account with this email or phone already exists.' });
    }

    const hashedPassword = await bcrypt.hash(pw, 10);
    const admin = await Admin.create({
      username: u,
      email: emailLower,
      phone: phoneNorm,
      password: hashedPassword
    });

    const accessToken = signAdminAccessToken(admin._id);
    return res.status(201).json({
      message: 'Admin account created.',
      admin: sanitizeAdmin(admin),
      accessToken
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email or phone already registered.' });
    }
    return res.status(500).json({ message: 'Registration failed.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const em = String(email || '').trim();
    const pw = String(password || '');
    if (!em || !pw) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const admin = await Admin.findOne({ email: em.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const ok = await bcrypt.compare(pw, admin.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const accessToken = signAdminAccessToken(admin._id);
    return res.json({
      message: 'Signed in.',
      admin: sanitizeAdmin(admin),
      accessToken
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.' });
  }
};

const me = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    return res.json({ admin: sanitizeAdmin(admin) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load profile.' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const emailRaw = String(req.body?.email || '').trim();
    if (!emailRaw) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    const emailLower = emailRaw.toLowerCase();
    const admin = await Admin.findOne({ email: emailLower });

    const generic =
      'If an account exists for this email, a 4-digit code was sent to that email address.';

    if (!admin) {
      return res.json({ message: generic });
    }

    if (!isMailConfigured()) {
      return res.status(503).json({
        message:
          'Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM on the server.'
      });
    }

    const otp = generateOtp4();
    const otpHash = hashOtp(emailLower, otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await AdminPasswordReset.findOneAndUpdate(
      { email: emailLower },
      { $set: { otpHash, expiresAt, attempts: 0 } },
      { upsert: true, new: true }
    );

    try {
      await sendAdminPasswordResetEmail(admin.email, otp);
    } catch (e) {
      await AdminPasswordReset.deleteOne({ email: emailLower });
      if (e.code === 'MAIL_NOT_CONFIGURED') {
        return res.status(503).json({
          message:
            'Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM on the server.'
        });
      }
      return res.status(502).json({
        message: 'Failed to send email. Check SMTP settings and the sender account (e.g. Gmail app password).'
      });
    }

    if (process.env.NODE_ENV !== 'production' && process.env.ADMIN_OTP_LOG === 'true') {
      // eslint-disable-next-line no-console
      console.log(`[ADMIN_OTP_LOG] ${emailLower} -> ${otp}`);
    }

    return res.json({ message: generic });
  } catch (error) {
    return res.status(500).json({ message: 'Could not process password reset request.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    const em = String(email || '').trim().toLowerCase();
    const ot = String(otp || '').trim();
    const np = String(newPassword || '');
    const cp = String(confirmPassword || '');

    if (!em || !ot || !np || !cp) {
      return res.status(400).json({ message: 'Email, OTP, new password, and confirm password are required.' });
    }
    if (np !== cp) {
      return res.status(400).json({ message: 'New password and confirm password do not match.' });
    }
    if (np.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
    if (!/^\d{4}$/.test(ot)) {
      return res.status(400).json({ message: 'Enter the 4-digit code from your email.' });
    }

    const record = await AdminPasswordReset.findOne({ email: em });
    if (!record || new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired code. Request a new code from Forgot password.' });
    }
    if (record.attempts >= 5) {
      await AdminPasswordReset.deleteOne({ _id: record._id });
      return res.status(429).json({ message: 'Too many attempts. Request a new code.' });
    }

    const valid = verifyOtpHash(em, ot, record.otpHash);
    if (!valid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: 'Invalid code.' });
    }

    const admin = await Admin.findOne({ email: em });
    if (!admin) {
      await AdminPasswordReset.deleteOne({ _id: record._id });
      return res.status(404).json({ message: 'Account not found.' });
    }

    admin.password = await bcrypt.hash(np, 10);
    await admin.save();
    await AdminPasswordReset.deleteOne({ _id: record._id });

    return res.json({ message: 'Password updated. You can sign in with your new password.' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not reset password.' });
  }
};

module.exports = { register, login, me, forgotPassword, resetPassword };
