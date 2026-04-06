# Email Configuration Guide for Render Deployment

## Problem
Getting 502 error when trying to send password reset emails from production (Render).

## Solution
You need to set the environment variables on Render.

## Steps to Configure Email on Render:

### 1. Go to Render Dashboard
- Navigate to https://dashboard.render.com
- Select your backend service (delvonza-exim-backend)

### 2. Add Environment Variables
- Click on "Environment" in the left sidebar
- Add the following environment variables:

```
EMAIL_USER=satharasijosephthimothi@gmail.com
EMAIL_PASS=nyfxsnfgrdvoqcmb
```

**IMPORTANT**: Remove ALL spaces from EMAIL_PASS. The value should be: `nyfxsnfgrdvoqcmb` (no spaces)

### 3. Optional Environment Variables
Add these for better debugging:

```
ADMIN_OTP_LOG=false
NODE_ENV=production
```

### 4. Save and Redeploy
- Click "Save Changes"
- Render will automatically redeploy your service
- Wait for the deployment to complete (usually 2-3 minutes)

### 5. Verify Email Configuration
After deployment, check the logs:
- Go to "Logs" tab in Render dashboard
- Look for messages like:
  - `[adminMail] SMTP connection verified` ✅ (Good)
  - `[adminMail] SMTP verification failed` ❌ (Problem)

## Testing the Email Functionality

### Test from Admin Panel:
1. Go to your admin login page
2. Click "Forgot Password"
3. Enter your admin email
4. Check your email inbox for the OTP code
5. Use the OTP to reset your password

### Check Render Logs:
Look for these log messages:
- `[adminAuth] Password reset email sent to: [email]` ✅
- `[adminMail] Email sent successfully to: [email]` ✅
- `[adminMail] Message ID: [id]` ✅

## Common Issues and Solutions

### Issue 1: "Email service authentication failed"
**Cause**: Wrong EMAIL_USER or EMAIL_PASS
**Solution**: 
- Double-check the Gmail address
- Verify the App Password is correct (no spaces)
- Make sure you're using a Gmail App Password, not your regular password

### Issue 2: "Unable to connect to email service"
**Cause**: Network/firewall issues on Render
**Solution**: 
- Check Render status page
- Try redeploying the service
- Contact Render support if issue persists

### Issue 3: Still getting 502 errors
**Cause**: Environment variables not loaded
**Solution**:
1. Verify variables are saved in Render dashboard
2. Manually trigger a redeploy
3. Check logs for any startup errors

## How to Generate Gmail App Password

If you need to create a new App Password:

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification (if not already enabled)
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)"
5. Enter "Delvonza Exim Backend"
6. Click "Generate"
7. Copy the 16-character password (remove spaces)
8. Use this as EMAIL_PASS

## Verification Checklist

- [ ] EMAIL_USER is set on Render
- [ ] EMAIL_PASS is set on Render (no spaces)
- [ ] Service has been redeployed
- [ ] Logs show "SMTP connection verified"
- [ ] Test email sent successfully
- [ ] Email received in inbox

## Support

If you continue to have issues:
1. Check Render logs for specific error messages
2. Verify Gmail account settings
3. Test locally first to ensure credentials work
4. Contact Render support if it's a platform issue
