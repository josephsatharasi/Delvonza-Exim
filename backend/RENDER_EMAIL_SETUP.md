# IMMEDIATE ACTION REQUIRED - Email Setup on Render

## 🚨 Quick Fix Steps:

### 1. Go to Render Dashboard
https://dashboard.render.com → Select "delvonza-exim-backend"

### 2. Add These Environment Variables:
Click "Environment" → "Add Environment Variable"

```
Key: EMAIL_USER
Value: satharasijosephthimothi@gmail.com

Key: EMAIL_PASS
Value: nyfxsnfgrdvoqcmb
```

⚠️ **CRITICAL**: EMAIL_PASS must have NO SPACES: `nyfxsnfgrdvoqcmb`

### 3. Save & Wait
- Click "Save Changes"
- Wait 2-3 minutes for automatic redeploy
- Service will restart with new variables

### 4. Test Email Health
Visit: https://delvonza-exim-backend.onrender.com/api/health/email

Should see:
```json
{
  "status": "ok",
  "message": "Email service is configured"
}
```

### 5. Test Password Reset
- Go to admin panel
- Click "Forgot Password"
- Enter: satharasijosephthimothi@gmail.com
- Check inbox for OTP

## ✅ Success Indicators:
- Health check returns "ok"
- Email arrives within 30 seconds
- No 502 errors in admin panel

## ❌ If Still Failing:
1. Check Render logs for error messages
2. Verify EMAIL_PASS has no spaces
3. Try manual redeploy
4. Regenerate Gmail App Password if needed

## 📞 Need Help?
Check EMAIL_SETUP_GUIDE.md for detailed troubleshooting
