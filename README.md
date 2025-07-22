# 🍺 Drink Limiter App

**Stop me from drinking more!**

A fun web application that helps you monitor your drinking habits and automatically notifies your friends when you've had too many drinks.

## 🚀 Features

- **📊 Drink Counter** - Track how many drinks you've had
- **💬 Dynamic Messages** - Different messages based on drink count
- **📧 Email Notifications** - Automatically notify friends after X drinks
- **⚙️ Customizable Settings** - Configure trigger count, messages, and contacts
- **🎵 Sound Effects** - Optional audio feedback
- **📱 Responsive Design** - Works on mobile and desktop
- **💾 Data Persistence** - Your settings and count are saved locally

## 🔧 Quick Start

1. Open `index.html` in your web browser
2. Click the **⚙️ Settings** button to configure your preferences
3. Start clicking **🍻 I had another drink** and watch the magic happen!

## 📧 Setting Up Real Email Notifications

To enable real email sending (instead of just simulation), you need to set up EmailJS:

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. You get 200 free emails per month

### Step 2: Add Email Service
1. Go to **Email Services** in your dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy the Service ID** (looks like `service_xxxxxxx`)

### Step 3: Create Email Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template content:

```
Subject: 🚨 Emergency Notification - Drinking Alert!

Hello!

{{from_name}} has sent you an emergency notification:

{{message}}

Drink Count: {{drink_count}}
Time: {{timestamp}}

This message was sent automatically by the Drink Limiter app.

Please check on your friend! 🍺❤️
```

4. **Copy the Template ID** (looks like `template_xxxxxxx`)

### Step 4: Get Your Public Key
1. Go to **Account** in your dashboard
2. Find your **Public Key** (User ID)
3. **Copy the Public Key** (looks like a long string of letters and numbers)

### Step 5: Configure the App
1. Open the Drink Limiter app
2. Click **⚙️ Settings**
3. Fill in the **Email Service Configuration** section:
   - **Service ID**: Paste your service ID
   - **Template ID**: Paste your template ID  
   - **Public Key**: Paste your public key
   - **Enable real email sending**: Check this box
4. Enter your friend's email address
5. Click **💾 Save Settings**
6. Click **🧪 Send Test Email** to verify everything works

## ⚙️ Settings Guide

### Basic Settings
- **Friend's Email**: Email address to notify
- **Trigger Count**: Number of drinks before sending notification (1-10)
- **Custom Message**: Personal message to include in notifications
- **Enable Sounds**: Turn sound effects on/off

### Email Configuration
- **Service ID**: Your EmailJS service identifier
- **Template ID**: Your EmailJS template identifier  
- **Public Key**: Your EmailJS public key
- **Enable Real Email**: Toggle between simulation and real sending

## 🎮 Usage Tips

### Keyboard Shortcuts
- **Spacebar**: Add a drink (same as clicking the button)
- **Ctrl+R**: Reset counter

### Features
- **Data Persistence**: Your count and settings are automatically saved
- **Dynamic Messages**: Messages change based on how many drinks you've had
- **Advanced Gags**: Random funny warnings appear at higher counts
- **Visual Effects**: Button animations and color changes based on drink level

## 🛠️ Technical Details

### File Structure
```
Quit drinking reminder/
├── index.html         # Main HTML file
├── style.css          # All styling
├── script.js          # Application logic
└── README.md          # This documentation
```

### Dependencies
- **EmailJS SDK**: For real email sending (loaded from CDN)
- **No other dependencies** - Pure vanilla JavaScript!

## 🔒 Privacy & Security

- **All data stored locally** - Nothing is sent to external servers except emails
- **No tracking** - This app doesn't track your usage
- **Email security** - Uses EmailJS secure service for email delivery
- **Open source** - All code is visible and modifiable

## 🚨 Disclaimer

This app is for entertainment and awareness purposes only. Please:
- **Drink responsibly**
- **Don't drink and drive**
- **Seek professional help** if you have concerns about alcohol consumption
- **Use this app as a fun tool**, not medical advice

## 🤝 Contributing

Feel free to modify the code to suit your needs! Some ideas:
- Add more drink types
- Implement weekly/monthly statistics
- Add more notification methods (SMS, Discord, etc.)
- Create different message themes

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome 60+
- Firefox 55+  
- Safari 11+
- Edge 79+

## 💡 Troubleshooting

### Email Not Sending?
1. Check all EmailJS configuration fields are filled
2. Verify your EmailJS service is active
3. Check browser console for error messages
4. Try sending a test email first
5. Make sure "Enable real email sending" is checked

### Sound Not Working?
- Some browsers require user interaction before playing audio
- Check if sound is enabled in settings
- Try clicking the page first, then the drink button

### Settings Not Saving?
- Make sure localStorage is enabled in your browser
- Check if you're in private/incognito mode
- Try refreshing the page and reconfiguring

---

**Made with ❤️ for responsible fun!** 

Remember: This is a tool for awareness and entertainment. Always drink responsibly and take care of yourself and others. 