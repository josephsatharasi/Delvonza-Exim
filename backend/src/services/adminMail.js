const nodemailer = require('nodemailer');

const getCredentials = () => {
  const user = String(process.env.EMAIL_USER || '').trim();
  const passRaw = process.env.EMAIL_PASS;
  if (!user || passRaw == null || String(passRaw).trim() === '') return null;
  const pass = String(passRaw).replace(/\s/g, '');
  const from = String(process.env.MAIL_FROM || user).trim();
  return { user, pass, from };
};

const isMailConfigured = () => Boolean(getCredentials());

const sendAdminPasswordResetEmail = async (toEmail, otp) => {
  const c = getCredentials();
  if (!c) {
    const err = new Error('MAIL_NOT_CONFIGURED');
    err.code = 'MAIL_NOT_CONFIGURED';
    throw err;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: c.user, pass: c.pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  const subject = 'Delvonza Exim Admin — Password Reset Code';
  const text = `Your Delvonza Exim admin password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .code { font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your Delvonza Exim admin password.</p>
        <p>Your verification code is:</p>
        <div class="code">${otp}</div>
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Delvonza Exim. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: `"Delvonza Exim" <${c.from}>`,
    to: toEmail,
    subject,
    text,
    html
  });
  
  console.log('[adminMail] Email sent successfully to:', toEmail);
  return info;
};

module.exports = { sendAdminPasswordResetEmail, isMailConfigured };
