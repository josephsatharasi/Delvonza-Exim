const nodemailer = require('nodemailer');

const getMailConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM;
  if (!host || !port || !user || !pass || !from) {
    return null;
  }
  return {
    host: String(host).trim(),
    port: Number(port),
    user: String(user).trim(),
    pass: String(pass),
    from: String(from).trim()
  };
};

const isMailConfigured = () => Boolean(getMailConfig());

const createTransport = () => {
  const cfg = getMailConfig();
  if (!cfg) return null;
  const secure = cfg.port === 465 || String(process.env.SMTP_SECURE).toLowerCase() === 'true';
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure,
    auth: { user: cfg.user, pass: cfg.pass }
  });
};

/**
 * Send 4-digit OTP to the admin's registered email (password reset).
 */
const sendAdminPasswordResetEmail = async (toEmail, otp) => {
  if (!isMailConfigured()) {
    const err = new Error('MAIL_NOT_CONFIGURED');
    err.code = 'MAIL_NOT_CONFIGURED';
    throw err;
  }
  const cfg = getMailConfig();
  const transporter = createTransport();
  const subject = 'Delvonza Exim Admin — Password reset code';
  const text = `Your Delvonza Exim admin password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`;
  const html = `<p>Your Delvonza Exim admin password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not request a reset, you can ignore this email.</p>`;
  await transporter.sendMail({
    from: cfg.from,
    to: toEmail,
    subject,
    text,
    html
  });
};

module.exports = { sendAdminPasswordResetEmail, isMailConfigured };
