const { isMailConfigured } = require('../services/adminMail');

const checkEmailHealth = async (req, res) => {
  try {
    const configured = isMailConfigured();
    
    if (!configured) {
      return res.status(503).json({
        status: 'error',
        message: 'Email service not configured',
        details: {
          EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
          EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set'
        }
      });
    }

    return res.json({
      status: 'ok',
      message: 'Email service is configured',
      details: {
        EMAIL_USER: process.env.EMAIL_USER || 'Not set',
        EMAIL_PASS: process.env.EMAIL_PASS ? '****' + String(process.env.EMAIL_PASS).slice(-4) : 'Not set'
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
