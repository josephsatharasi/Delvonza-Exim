const sgMail = require('@sendgrid/mail');

const getCredentials = () => {
  const apiKey = String(process.env.SENDGRID_API_KEY || '').trim();
  const from = String(process.env.EMAIL_FROM || process.env.EMAIL_USER || '').trim();
  if (!apiKey || !from) return null;
  return { apiKey, from };
};

const isMailConfigured = () => Boolean(getCredentials());

const sendAdminPasswordResetEmail = async (toEmail, otp) => {
  const c = getCredentials();
  if (!c) {
    const err = new Error('MAIL_NOT_CONFIGURED');
    err.code = 'MAIL_NOT_CONFIGURED';
    throw err;
  }

  sgMail.setApiKey(c.apiKey);

  const msg = {
    to: toEmail,
    from: c.from,
    subject: 'Delvonza Exim Admin — Password Reset Code',
    text: `Your Delvonza Exim admin password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `
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
    `
  };

  try {
    await sgMail.send(msg);
    console.log('[adminMail] Email sent successfully to:', toEmail);
  } catch (error) {
    console.error('[adminMail] SendGrid error:', error.message);
    if (error.response) {
      console.error('[adminMail] SendGrid response:', JSON.stringify(error.response.body));
    }
    throw error;
  }
};

module.exports = { sendAdminPasswordResetEmail, isMailConfigured };
