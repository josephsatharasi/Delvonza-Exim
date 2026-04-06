require('dotenv').config();
const { sendAdminPasswordResetEmail, isMailConfigured } = require('../services/adminMail');

const testEmail = async () => {
  console.log('Testing email configuration...\n');
  
  if (!isMailConfigured()) {
    console.error('❌ Email is NOT configured. Check EMAIL_USER and EMAIL_PASS in .env');
    return;
  }
  
  console.log('✓ Email credentials found');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '****' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
  
  const testOtp = '1234';
  const testEmail = process.env.EMAIL_USER;
  
  console.log(`\nSending test email to: ${testEmail}`);
  console.log(`Test OTP: ${testOtp}\n`);
  
  try {
    await sendAdminPasswordResetEmail(testEmail, testOtp);
    console.log('\n✅ Email sent successfully! Check your inbox.');
  } catch (error) {
    console.error('\n❌ Failed to send email:');
    console.error('Error:', error.message);
    if (error.code) console.error('Code:', error.code);
  }
};

testEmail();
