const nodemailer = require('nodemailer');

const getMailConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const passRaw = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;
  if (!host || !port || !user || !passRaw || !from) {
    return null;
  }
  const portNum = Number(String(port).trim());
  if (!Number.isFinite(portNum) || portNum <= 0) {
    return null;
  }
  // Gmail app passwords are 16 chars; spaces in .env are ignored for auth.
  const pass = String(passRaw).replace(/\s/g, '');
  return {
    host: String(host).trim(),
    port: portNum,
    user: String(user).trim(),
    pass,
    from: String(from).trim()
  };
};

const isMailConfigured = () => Boolean(getMailConfig());

const createTransport = () => {
  const cfg = getMailConfig();
  if (!cfg) return null;
  const secure = cfg.port === 465 || String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
  const opts = {
    host: cfg.host,
    port: cfg.port,
    secure,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 25_000,
    greetingTimeout: 25_000,
    socketTimeout: 25_000
  };
  // Port 587 uses STARTTLS; required for Gmail and most hosts behind Render/cloud.
  if (!secure && cfg.port === 587) {
    opts.requireTLS = true;
  }
  return nodemailer.createTransport(opts);
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
