const nodemailer = require('nodemailer');

/**
 * Gmail + Nodemailer — only needs EMAIL_USER and EMAIL_PASS (Google App Password).
 * Optional: MAIL_FROM (defaults to EMAIL_USER).
 */
const getCredentials = () => {
  const user = String(process.env.EMAIL_USER || process.env.SMTP_USER || '').trim();
  const passRaw = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  if (!user || passRaw == null || String(passRaw).trim() === '') {
    return null;
  }
  const pass = String(passRaw).replace(/\s/g, '');
  const from = String(process.env.MAIL_FROM || user).trim();
  return { user, pass, from };
};

const isMailConfigured = () => Boolean(getCredentials());

const createTransport = () => {
  const c = getCredentials();
  if (!c) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: c.user,
      pass: c.pass
    }
  });
};

/**
 * Send 4-digit OTP to the admin's registered email (password reset).
 */
const sendAdminPasswordResetEmail = async (toEmail, otp) => {
  const c = getCredentials();
  if (!c) {
    const err = new Error('MAIL_NOT_CONFIGURED');
    err.code = 'MAIL_NOT_CONFIGURED';
    throw err;
  }
  const transporter = createTransport();
  const subject = 'Delvonza Exim Admin — Password reset code';
  const text = `Your Delvonza Exim admin password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`;
  const html = `<p>Your Delvonza Exim admin password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not request a reset, you can ignore this email.</p>`;
  await transporter.sendMail({
    from: c.from,
    to: toEmail,
    subject,
    text,
    html
  });
};

module.exports = { sendAdminPasswordResetEmail, isMailConfigured };
