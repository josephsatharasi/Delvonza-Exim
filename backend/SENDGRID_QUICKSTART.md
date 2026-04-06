# 🚀 QUICK START - SendGrid Setup

## ⚡ 5-Minute Setup Checklist

### 1️⃣ Create SendGrid Account (2 min)
- Go to: https://signup.sendgrid.com/
- Sign up with: satharasijosephthimothi@gmail.com
- Verify email

### 2️⃣ Get API Key (1 min)
- Login: https://app.sendgrid.com/
- Go to: Settings → API Keys
- Click: Create API Key
- Name: Delvonza Exim Backend
- Access: Full Access
- **COPY THE KEY** (starts with SG.)

### 3️⃣ Verify Sender Email (1 min)
- Go to: Settings → Sender Authentication
- Click: Verify a Single Sender
- Email: satharasijosephthimothi@gmail.com
- Fill form → Create
- Check email → Click verification link

### 4️⃣ Update Render (1 min)
Go to: https://dashboard.render.com

**Remove:**
- EMAIL_USER
- EMAIL_PASS

**Add:**
```
SENDGRID_API_KEY = SG.your_key_here
EMAIL_FROM = satharasijosephthimothi@gmail.com
```

Save → Wait 2 min for redeploy

### 5️⃣ Test ✅
Visit: https://delvonza-exim-backend.onrender.com/api/health/email

Should see: `"status":"ok"`

---

## 📝 Your SendGrid API Key
After creating, paste it here for reference:
```
SENDGRID_API_KEY=
```

## ✅ Verification Checklist
- [ ] SendGrid account created
- [ ] API key generated and copied
- [ ] Sender email verified (check for "Verified" badge)
- [ ] Render environment variables updated
- [ ] Service redeployed
- [ ] Health check returns "ok"
- [ ] Test email sent successfully

## 🆘 Need Help?
See detailed guide: SENDGRID_SETUP.md
