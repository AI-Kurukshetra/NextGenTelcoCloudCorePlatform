# SMTP Setup for Forgot Password / Reset Password

Password reset emails are sent by **Supabase Auth**. Configure custom SMTP in the Supabase Dashboard to use Gmail.

## Gmail credentials (App Password)

- **Email:** kothariyash360@gmail.com  
- **App Password:** `kfel ywjh nvid piuc` (enter without spaces: `kfelywjhnvidpiuc`)

> Gmail App Passwords require 2-Step Verification. Create one at: [Google Account → Security → App passwords](https://myaccount.google.com/apppasswords)

## Configure Supabase Dashboard

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project  
2. Go to **Authentication** → **Providers** → **Email**  
3. Scroll to **SMTP Settings**  
4. Enable **Custom SMTP** and fill in:

| Field        | Value                      |
|--------------|----------------------------|
| Host         | `smtp.gmail.com`           |
| Port         | `587`                      |
| Username     | `kothariyash360@gmail.com` |
| Password     | `kfelywjhnvidpiuc`         |
| Sender email | `kothariyash360@gmail.com` |
| Sender name  | `NGCMCP Platform` (or your app name) |

5. Click **Save**

## Optional: Customize email template

1. Go to **Authentication** → **Email Templates**  
2. Select **Reset Password**  
3. Edit the subject/body if needed  
4. Save

## Test

1. Go to `/forgot-password` in your app  
2. Enter an email address  
3. Click **Send Reset Email**  
4. Check the inbox for the reset link
