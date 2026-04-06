# SendGrid Setup Guide for Delvonza Exim

## Why SendGrid?
- ✅ Works on Render's free tier (no SMTP port restrictions)
- ✅ 100 free emails per day
- ✅ More reliable delivery than Gmail SMTP
- ✅ Better email tracking and analytics

## Step 1: Create SendGrid Account

1. Go to https://signup.sendgrid.com/
2. Sign up with your email (use: satharasijosephthimothi@gmail.com)
3. Verify your email address
4. Complete the account setup

## Step 2: Create API Key

1. Log in to SendGrid dashboard: https://app.sendgrid.com/
2. Go to **Settings** → **API Keys** (left sidebar)
3. Click **Create API Key** button
4. Name it: `Delvonza Exim Backend`
5. Select **Full Access** (or at minimum: Mail Send permissions)
6. Click **Create & View**
7. **COPY THE API KEY** - you'll only see it once!
   - It looks like: `SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`

## Step 3: Verify Sender Email

SendGrid requires you to verify the email address you'll send from:

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in the form:
   - **From Name**: Delvonza Exim
   - **From Email Address**: satharasijosephthimothi@gmail.com
   - **Reply To**: satharasijosephthimothi@gmail.com
   - **Company Address**: Your company address
   - **City, State, Zip**: Your location
   - **Country**: India
4. Click **Create**
5. Check your email (satharasijosephthimothi@gmail.com) for verification link
6. Click the verification link
7. Wait for "Verified" status in SendGrid dashboard

## Step 4: Update Local .env File

Open `backend/.env` and update:

```env
SENDGRID_API_KEY=SG.your_actual_api_key_here
EMAIL_FROM=satharasijosephthimothi@gmail.com
```

## Step 5: Update Render Environment Variables

1. Go to Render Dashboard: https://dashboard.render.com
2. Select your backend service: `delvonza-exim-backend`
3. Click **Environment** in left sidebar
4. **Remove old variables** (if they exist):
   - Delete `EMAIL_USER`
   - Delete `EMAIL_PASS`
5. **Add new variables**:
   - Key: `SENDGRID_API_KEY`
   - Value: `SG.your_actual_api_key_here` (paste the key from Step 2)
   
   - Key: `EMAIL_FROM`
   - Value: `satharasijosephthimothi@gmail.com`

6. Click **Save Changes**
7. Wait 2-3 minutes for automatic redeploy

## Step 6: Test Email

### Test Locally:
```bash
cd backend
node src/utils/testEmail.js
```

Should see: ✅ Email sent successfully!

### Test on Render:
1. Check health: https://delvonza-exim-backend.onrender.com/api/health/email
2. Should return: `{"status":"ok","message":"Email service is configured"}`

### Test from Admin Panel:
1. Go to admin login page
2. Click "Forgot Password"
3. Enter: satharasijosephthimothi@gmail.com
4. Check inbox for OTP code
5. Email should arrive within 5-10 seconds

## Troubleshooting

### "Email service not configured"
- Check that SENDGRID_API_KEY is set in Render
- Check that EMAIL_FROM is set in Render
- Verify the API key is correct (no extra spaces)

### "Sender email not verified"
- Go to SendGrid → Settings → Sender Authentication
- Make sure your email shows "Verified" status
- If not verified, check your email for verification link

### "403 Forbidden" error
- Your API key doesn't have Mail Send permissions
- Create a new API key with Full Access

### Email not arriving
- Check spam/junk folder
- Verify sender email in SendGrid dashboard
- Check SendGrid Activity Feed for delivery status

## SendGrid Dashboard Links

- Dashboard: https://app.sendgrid.com/
- API Keys: https://app.sendgrid.com/settings/api_keys
- Sender Authentication: https://app.sendgrid.com/settings/sender_auth
- Activity Feed: https://app.sendgrid.com/email_activity

## Free Tier Limits

- 100 emails per day
- Perfect for password resets and notifications
- If you need more, upgrade to paid plan ($19.95/month for 50K emails)

## Security Notes

- Never commit SENDGRID_API_KEY to Git
- Keep it in .env file (already in .gitignore)
- Rotate API key if compromised
- Use environment variables on Render
