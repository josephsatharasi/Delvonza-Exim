const { isMailConfigured } = require('../services/adminMail');

const checkEmailHealth = async (req, res) => {
  try {
    const configured = isMailConfigured();
    
    if (!configured) {
      return res.status(503).json({
        status: 'error',
        message: 'Email service not configured',
        details: {
          SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'Set' : 'Not set',
          EMAIL_FROM: process.env.EMAIL_FROM || 'Not set'
        }
      });
    }

    return res.json({
      status: 'ok',
      message: 'Email service is configured',
      details: {
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '****' + String(process.env.SENDGRID_API_KEY).slice(-4) : 'Not set',
        EMAIL_FROM: process.env.EMAIL_FROM || 'Not set'
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to check email configuration'
    });
  }
};

module.exports = { checkEmailHealth };
