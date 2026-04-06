require('dotenv').config();
const { sendAdminPasswordResetEmail, isMailConfigured } = require('../services/adminMail');

const testEmail = async () => {
  console.log('Testing SendGrid email configuration...\n');
  
  if (!isMailConfigured()) {
    console.error('❌ Email is NOT configured.');
    console.error('Required: SENDGRID_API_KEY and EMAIL_FROM in .env');
    console.log('\nCurrent values:');
    console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '****' + process.env.SENDGRID_API_KEY.slice(-4) : 'NOT SET');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET');
    return;
  }
  
  console.log('✓ Email credentials found');
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '****' + process.env.SENDGRID_API_KEY.slice(-4) : 'NOT SET');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
  
  const testOtp = '1234';
  const testEmail = process.env.EMAIL_FROM;
  
  console.log(`\nSending test email to: ${testEmail}`);
  console.log(`Test OTP: ${testOtp}\n`);
  
  try {
    await sendAdminPasswordResetEmail(testEmail, testOtp);
    console.log('\n✅ Email sent successfully! Check your inbox.');
    console.log('\nIf you don\'t see it:');
    console.log('1. Check spam/junk folder');
    console.log('2. Verify sender email in SendGrid dashboard');
    console.log('3. Check SendGrid Activity Feed for delivery status');
  } catch (error) {
    console.error('\n❌ Failed to send email:');
    console.error('Error:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.response) {
      console.error('Response:', error.response.body);
    }
    console.log('\nTroubleshooting:');
    console.log('1. Check SENDGRID_API_KEY is correct');
    console.log('2. Verify sender email in SendGrid dashboard');
    console.log('3. Check API key has Mail Send permissions');
  }
};

testEmail();
