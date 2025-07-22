// Global variables
let drinkCount = 0;
let emailSent = false;
let drinkHistory = []; // Array to store drinking history

// Settings with default values
let settings = {
    friendEmail: '',
    triggerCount: 3,
    customMessage: 'Help! I\'m drinking again and can\'t control myself!',
    enableSounds: true,
    enableDrunkEffect: true,
    yourName: '', // 新增
    // EmailJS configuration (pre-configured)
    emailjsServiceId: 'service_9720w28',
    emailjsTemplateId: 'template_uzgtklk',
    emailjsPublicKey: 'JWyBvXCZOYniVIhjr',
    enableRealEmail: true
};

// Fixed drink price for statistics calculation
const DRINK_PRICE = 5.00;

// DOM elements
const drinkButton = document.getElementById('drinkButton');
const resetButton = document.getElementById('resetButton');
const settingsButton = document.getElementById('settingsButton');
const countDisplay = document.querySelector('.count-number');
const messageArea = document.getElementById('messageArea');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const saveSettings = document.getElementById('saveSettings');
const resetSettingsBtn = document.getElementById('resetSettings');
const friendEmailInput = document.getElementById('friendEmail');
const triggerCountInput = document.getElementById('triggerCount');
const customMessageInput = document.getElementById('customMessage');
const enableSoundsInput = document.getElementById('enableSounds');
// EmailJS inputs are hidden but testEmail button is still visible
const testEmailBtn = document.getElementById('testEmail');
const yourNameInput = document.getElementById('yourName');
// Statistics elements
const statsButton = document.getElementById('statsButton');
const statsModal = document.getElementById('statsModal');
const closeStats = document.getElementById('closeStats');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const clearHistoryBtn = document.getElementById('clearHistory');
const exportHistoryBtn = document.getElementById('exportHistory');
// New feature elements
const enableDrunkEffectInput = document.getElementById('enableDrunkEffect');

// Message array - display different messages based on drink count
const messages = {
    0: {
        text: "You haven't had any drinks today! Keep it up! 💪",
        class: ""
    },
    1: {
        text: "First drink... Welcome to the underworld bar! 🍻😈",
        class: ""
    },
    2: {
        text: "Second drink! The bartender in hell is smiling at you 😏🔥",
        class: "warning"
    },
    3: {
        text: "Third drink!!! You just unlocked the 'Inferno Sipper' badge 🏅🔥",
        class: "danger"
    },
    4: {
        text: "Fourth drink... Your liver is googling 'how to escape' 🫥",
        class: "danger"
    },
    5: {
        text: "Fifth drink! The devil is offering you a VIP seat 😈🍷",
        class: "critical"
    },
    6: {
        text: "Sixth drink... Your wallet just started crying 💸😭",
        class: "critical"
    },
    7: {
        text: "Seventh drink! You are now trending on Hell's Instagram 🔥📸",
        class: "critical"
    },
    8: {
        text: "Eighth drink... The bartender is asking for your autograph 🖊️🍺",
        class: "critical"
    },
    9: {
        text: "Ninth drink! You are now a legend in the underworld 🍻👹",
        class: "critical"
    },
    10: {
        text: "Tenth drink... The gates of hell are wide open for you 🚪🔥",
        class: "critical"
    }
};

// Advanced gag messages (randomly appear)
const advancedGagMessages = [
    "🍕 Your pizza delivery guy is now your drinking buddy!",
    "🦴 Your skeleton is dancing the Macarena!",
    "💀 The devil just sent you a friend request!",
    "🔥 You just earned a free ticket to the underworld party!",
    "🍻 Your drinks are now sponsored by the River Styx!",
    "😈 The bartender says: 'One more and you get a pitchfork!'",
    "👹 You just unlocked the 'Hell's Happy Hour' achievement!",
    "🪦 Your liver is writing its memoirs... in Latin!"
];

// 喪又地獄的按鈕文案
const hellButtonTexts = [
    "🍻 Another step closer to the abyss",
    "🍻 Cheers from the underworld",
    "🍻 My liver just filed a complaint",
    "🍻 Unlocking new levels of regret",
    "🍻 The devil is watching",
    "🍻 This is how legends (and hangovers) are made",
    "🍻 My soul just got a little darker",
    "🍻 One more for the road to hell",
    "🍻 The bartender in hell is proud",
    "🍻 My future self is crying"
];

// Initialize
function init() {
    // Load data from localStorage
    loadData();
    loadSettings();
    
    // Double-check EmailJS configuration after loading settings
    if (!settings.emailjsServiceId || !settings.emailjsTemplateId || !settings.emailjsPublicKey) {
        console.log('⚠️ EmailJS config missing after loadSettings, restoring...');
        settings.emailjsServiceId = 'service_9720w28';
        settings.emailjsTemplateId = 'template_uzgtklk';
        settings.emailjsPublicKey = 'JWyBvXCZOYniVIhjr';
        settings.enableRealEmail = true;
    }
    
    updateDisplay();
    
    // Bind event listeners
    drinkButton.addEventListener('click', handleDrinkClick);
    resetButton.addEventListener('click', handleReset);
    settingsButton.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsModal);
    saveSettings.addEventListener('click', saveSettingsData);
    resetSettingsBtn.addEventListener('click', resetSettingsToDefault);
    testEmailBtn.addEventListener('click', sendTestEmail);
    
    // Statistics event listeners
    statsButton.addEventListener('click', openStatsModal);
    closeStats.addEventListener('click', closeStatsModal);
    clearHistoryBtn.addEventListener('click', clearDrinkHistory);
    exportHistoryBtn.addEventListener('click', exportDrinkHistory);
    
    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Close modal when clicking outside
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });
    
    statsModal.addEventListener('click', function(e) {
        if (e.target === statsModal) {
            closeStatsModal();
        }
    });
}

// Load data from localStorage
function loadData() {
    const savedCount = localStorage.getItem('drinkCount');
    const savedEmailStatus = localStorage.getItem('emailSent');
    const savedHistory = localStorage.getItem('drinkHistory');
    
    if (savedCount !== null) {
        drinkCount = parseInt(savedCount);
    }
    
    if (savedEmailStatus !== null) {
        emailSent = JSON.parse(savedEmailStatus);
    }
    
    if (savedHistory !== null) {
        drinkHistory = JSON.parse(savedHistory);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('drinkCount', drinkCount.toString());
    localStorage.setItem('emailSent', JSON.stringify(emailSent));
    localStorage.setItem('drinkHistory', JSON.stringify(drinkHistory));
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // Preserve EmailJS configuration - never overwrite these
        const emailConfig = {
            emailjsServiceId: settings.emailjsServiceId,
            emailjsTemplateId: settings.emailjsTemplateId,
            emailjsPublicKey: settings.emailjsPublicKey,
            enableRealEmail: settings.enableRealEmail
        };
        
        settings = { ...settings, ...parsed, ...emailConfig };
        console.log('📚 Settings loaded from localStorage, EmailJS config preserved');
    } else {
        console.log('📚 Using default settings (first time load)');
    }
    
    // Debug: Log EmailJS configuration status
    console.log('🔧 EmailJS Config Status:');
    console.log('   Service ID:', settings.emailjsServiceId || 'MISSING');
    console.log('   Template ID:', settings.emailjsTemplateId || 'MISSING');
    console.log('   Public Key:', settings.emailjsPublicKey || 'MISSING');
    
    // Update UI with loaded settings
    updateSettingsUI();
}

// Save settings to localStorage
function saveSettingsData() {
    // Get values from form
    settings.friendEmail = friendEmailInput.value.trim();
    settings.triggerCount = parseInt(triggerCountInput.value);
    settings.customMessage = customMessageInput.value.trim();
    settings.enableSounds = enableSoundsInput.checked;
    settings.enableDrunkEffect = enableDrunkEffectInput.checked;
    settings.yourName = yourNameInput.value.trim();
    // EmailJS settings (pre-configured, no need to update)
    
    // Validation for multiple emails
    if (settings.friendEmail && !areValidEmails(settings.friendEmail)) {
        alert('Please enter valid email addresses');
        return;
    }
    
    if (settings.triggerCount < 1 || settings.triggerCount > 10) {
        alert('Trigger count must be between 1 and 10');
        return;
    }
    
    if (!settings.customMessage) {
        settings.customMessage = 'Help! I\'m drinking again and can\'t control myself!';
    }
    
    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Close modal
    closeSettingsModal();
    
    // Show success message
    showSettingsSaved();
    
    // Reset email sent status when trigger count changes
    emailSent = false;
    saveData();
}

// Update settings UI with current values
function updateSettingsUI() {
    friendEmailInput.value = settings.friendEmail;
    triggerCountInput.value = settings.triggerCount;
    customMessageInput.value = settings.customMessage;
    enableSoundsInput.checked = settings.enableSounds;
    enableDrunkEffectInput.checked = settings.enableDrunkEffect;
    yourNameInput.value = settings.yourName || '';
    // EmailJS settings are pre-configured and hidden
}

// Open settings modal
function openSettings() {
    updateSettingsUI();
    settingsModal.classList.remove('hidden');
}

// Close settings modal
function closeSettingsModal() {
    settingsModal.classList.add('hidden');
}

// Reset settings to default
function resetSettingsToDefault() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        settings = {
            friendEmail: '',
            triggerCount: 3,
            customMessage: 'Help! I\'m drinking again and can\'t control myself!',
            enableSounds: true,
            enableDrunkEffect: true,
            yourName: '', // 新增
            // EmailJS configuration (pre-configured)
            emailjsServiceId: 'service_9720w28',
            emailjsTemplateId: 'template_uzgtklk',
            emailjsPublicKey: 'JWyBvXCZOYniVIhjr',
            enableRealEmail: true
        };
        
        updateSettingsUI();
        localStorage.removeItem('appSettings');
        showSettingsReset();
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Multiple emails validation
function areValidEmails(emailsText) {
    if (!emailsText) return true; // Empty is okay
    
    // Split by comma or newline and clean up
    const emails = emailsText.split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0);
    
    // Validate each email
    return emails.every(email => isValidEmail(email));
}

// Parse multiple emails from text
function parseEmails(emailsText) {
    if (!emailsText) return [];
    
    return emailsText.split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0 && isValidEmail(email));
}

// Show settings saved message
function showSettingsSaved() {
    showMessage('✅ Settings saved successfully!', '#48bb78');
}

// Show settings reset message
function showSettingsReset() {
    showMessage('🔄 Settings reset to default!', '#667eea');
}

// Generic message display function
function showMessage(text, color) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${color};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        font-weight: bold;
    `;
    
    message.innerHTML = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        document.body.removeChild(message);
    }, 3000);
}

// Handle drink button click
function handleDrinkClick() {
    drinkCount++;
    
    // Record drink in history
    const now = new Date();
    const today = now.toDateString();
    const time = now.toLocaleTimeString();
    
    // Add to history
    drinkHistory.push({
        date: today,
        time: time,
        timestamp: now.getTime(),
        count: drinkCount
    });
    
    // Play sound effect if enabled
    if (settings.enableSounds) {
        playDrinkSound();
    }
    
    // Add button click animation effect
    drinkButton.classList.add('shake');
    setTimeout(() => {
        drinkButton.classList.remove('shake');
    }, 820);
    
    // Update display
    updateDisplay();
    
    // Check if email notification is needed (use custom trigger count)
    if (drinkCount >= settings.triggerCount && !emailSent) {
        sendEmailNotification();
        emailSent = true;
    }
    
    // Show advanced gag messages (randomly) - starts after trigger count + 2
    if (drinkCount >= settings.triggerCount + 2 && Math.random() < 0.3) {
        showAdvancedGag();
    }
    
    // Save data
    saveData();
}

// Play drinking sound effect
function playDrinkSound() {
    // Create audio context for sound effects
    if (typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Create a simple beep sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}

// Update display content
function updateDisplay() {
    // Update count display
    countDisplay.textContent = drinkCount;
    
    // Update message
    updateMessage();
    
    // Update button text
    updateButtonText();
    
    // Update drunk effects
    updateDrunkEffects();
}

// Update message area
function updateMessage() {
    let message;
    
    // Custom message for trigger count
    if (drinkCount === settings.triggerCount) {
        message = {
            text: `Drink ${drinkCount}!!! Your friends have been notified 📧😱`,
            class: "danger"
        };
    } else if (drinkCount <= 10) {
        message = messages[drinkCount];
    } else {
        // Special handling for over 10 drinks
        message = {
            text: `Drink ${drinkCount}... you've transcended human limits 🤖👽`,
            class: "critical"
        };
    }
    
    messageArea.innerHTML = `<p>${message.text}</p>`;
    
    // Clear all style classes
    messageArea.className = 'message-area';
    
    // Add new style class
    if (message.class) {
        messageArea.classList.add(message.class);
    }
}

// Update button text
function updateButtonText() {
    if (drinkCount === 0) {
        drinkButton.innerHTML = '🍻 I had a drink';
    } else {
        // 隨機選一個地獄梗
        const idx = Math.floor(Math.random() * hellButtonTexts.length);
        drinkButton.innerHTML = hellButtonTexts[idx];
    }
}

// Send email notification (real or simulated)
function sendEmailNotification() {
    const emails = parseEmails(settings.friendEmail);
    const message = settings.customMessage || 'Help! I\'m drinking again and can\'t control myself!';
    
    console.log('📧 Sending email notification to:', emails.length > 0 ? emails : 'No emails set');
    console.log('📝 Message:', message);
    
    // Show notification animation
    showEmailNotification();
    
    if (settings.enableRealEmail && isEmailJSConfigured() && emails.length > 0) {
        // Send real email to multiple recipients using EmailJS
        sendRealEmailToMultiple(emails, message, drinkCount);
    } else {
        // Just simulation
        setTimeout(() => {
            console.log('✅ Email notification sent (simulated)!');
        }, 2000);
    }
}

// Check if EmailJS is properly configured
function isEmailJSConfigured() {
    console.log('🔍 Checking EmailJS configuration...');
    console.log('📧 Service ID:', settings.emailjsServiceId ? 'SET' : 'MISSING');
    console.log('📧 Template ID:', settings.emailjsTemplateId ? 'SET' : 'MISSING');
    console.log('📧 Public Key:', settings.emailjsPublicKey ? 'SET' : 'MISSING');
    console.log('📧 EmailJS SDK:', typeof emailjs !== 'undefined' ? 'LOADED' : 'NOT LOADED');
    
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS SDK not loaded yet!');
        return false;
    }
    
    return settings.emailjsServiceId && 
           settings.emailjsTemplateId && 
           settings.emailjsPublicKey;
}

// Send real email to multiple recipients using EmailJS
function sendRealEmailToMultiple(emails, customMessage, drinkCount) {
    if (!emails || emails.length === 0) {
        console.error('No valid email addresses');
        showMessage('❌ No valid email addresses!', '#f56565');
        return;
    }

    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS SDK not available!');
        alert('EmailJS SDK not loaded. Please refresh the page and try again.');
        return;
    }

    // EmailJS is already initialized globally
    
    const templateParams = {
        from_name: settings.yourName || 'Your friend',
        subject: 'Emergency Notification - Drinking Alert!',
        message: customMessage,
        drink_count: drinkCount,
        timestamp: new Date().toLocaleString()
    };

    // Send email to each recipient
    let successCount = 0;
    let totalEmails = emails.length;
    
    emails.forEach((email, index) => {
        const emailParams = {
            ...templateParams,
            to_email: email
        };
        
        emailjs.send(settings.emailjsServiceId, settings.emailjsTemplateId, emailParams)
            .then((response) => {
                console.log(`✅ Email sent successfully to ${email}!`, response.status, response.text);
                successCount++;
                
                // Show success message after all emails are processed
                if (index === totalEmails - 1) {
                    if (successCount === totalEmails) {
                        showMessage(`✅ All ${totalEmails} emails sent successfully!`, '#48bb78');
                    } else {
                        showMessage(`⚠️ ${successCount}/${totalEmails} emails sent successfully!`, '#d69e2e');
                    }
                }
            })
            .catch((error) => {
                console.error(`❌ Failed to send email to ${email}:`, error);
                
                // Show error message after all emails are processed
                if (index === totalEmails - 1) {
                    if (successCount === 0) {
                        showMessage('❌ Failed to send all emails!', '#f56565');
                    } else {
                        showMessage(`⚠️ ${successCount}/${totalEmails} emails sent successfully!`, '#d69e2e');
                    }
                }
            });
    });
}

// Legacy function for backward compatibility
function sendRealEmail(toEmail, customMessage, drinkCount) {
    sendRealEmailToMultiple([toEmail], customMessage, drinkCount);
}

// Send test email
function sendTestEmail() {
    console.log('🧪 Test email button clicked');
    
    const emails = parseEmails(settings.friendEmail);
    
    if (emails.length === 0) {
        alert('Please enter at least one email address first!');
        return;
    }
    
    // Check EmailJS availability first
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS SDK not loaded');
        alert('EmailJS is still loading. Please wait a few seconds and try again.');
        return;
    }
    
    if (!isEmailJSConfigured()) {
        alert('EmailJS configuration error! Please check the browser console for details.');
        return;
    }
    
    // Disable button during send
    testEmailBtn.disabled = true;
    testEmailBtn.textContent = '📤 Sending...';
    
    const testMessage = 'This is a test message from your Drink Limiter app. If you receive this, the email configuration is working correctly!';
    
    sendRealEmailToMultiple(emails, testMessage, 0);
    
    // Re-enable button after 5 seconds (more time for multiple emails)
    setTimeout(() => {
        testEmailBtn.disabled = false;
        testEmailBtn.textContent = '🧪 Send Test Email';
    }, 5000);
}

// Show email sending notification
function showEmailNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: bold;
        animation: slideIn 0.5s ease;
        max-width: 350px;
    `;
    
    const emails = parseEmails(settings.friendEmail);
    let emailText;
    
    if (emails.length === 0) {
        emailText = '📧 Emergency notification sent!<br><small>Configure emails in settings</small>';
    } else if (emails.length === 1) {
        emailText = `📧 Emergency notification sent to:<br><small>${emails[0]}</small>`;
    } else if (emails.length <= 3) {
        emailText = `📧 Emergency notification sent to:<br><small>${emails.join('<br>')}</small>`;
    } else {
        emailText = `📧 Emergency notification sent to:<br><small>${emails.slice(0, 2).join('<br>')}<br>...and ${emails.length - 2} more</small>`;
    }
    
    notification.innerHTML = emailText;
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds (longer for multiple emails)
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 4000);
}

// Show advanced gag messages
function showAdvancedGag() {
    const randomGag = advancedGagMessages[Math.floor(Math.random() * advancedGagMessages.length)];
    
    const gagElement = document.createElement('div');
    gagElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1a202c;
        color: #fed7d7;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        z-index: 1001;
        font-size: 1.2em;
        font-weight: bold;
        text-align: center;
        border: 2px solid #e53e3e;
        animation: gagPulse 1s ease infinite;
    `;
    
    gagElement.innerHTML = randomGag;
    document.body.appendChild(gagElement);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        document.body.removeChild(gagElement);
    }, 5000);
}

// Handle reset button
function handleReset() {
    // Confirm reset
    if (confirm('Are you sure you want to reset the counter? This will clear all records!')) {
        drinkCount = 0;
        emailSent = false;
        // Note: We don't clear history here, only today's count
        
        // Clear localStorage for current session
        localStorage.removeItem('drinkCount');
        localStorage.removeItem('emailSent');
        
        // Update display
        updateDisplay();
        
        // Show reset success message
        showResetSuccess();
    }
}

// Show reset success message
function showResetSuccess() {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #48bb78;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: bold;
    `;
    
    successMsg.innerHTML = '✅ Reset successful! Fresh start!';
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        document.body.removeChild(successMsg);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes gagPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.05); }
    }
`;
document.head.appendChild(style);

// Wait for all resources including EmailJS to load
window.addEventListener('load', function() {
    console.log('🚀 Page fully loaded, checking EmailJS...');
    
    // Force ensure EmailJS configuration is set (in case localStorage corrupted it)
    const ensureEmailJSConfig = () => {
        if (!settings.emailjsServiceId || !settings.emailjsTemplateId || !settings.emailjsPublicKey) {
            console.log('🔧 Restoring missing EmailJS configuration...');
            settings.emailjsServiceId = 'service_9720w28';
            settings.emailjsTemplateId = 'template_uzgtklk';
            settings.emailjsPublicKey = 'JWyBvXCZOYniVIhjr';
            settings.enableRealEmail = true;
        }
    };
    
    // Give EmailJS a moment to initialize
    setTimeout(() => {
        if (typeof emailjs !== 'undefined') {
            console.log('✅ EmailJS SDK loaded successfully');
            ensureEmailJSConfig();
            // Initialize EmailJS immediately when available
            emailjs.init(settings.emailjsPublicKey);
        } else {
            console.warn('⚠️ EmailJS SDK not available, email features may not work');
        }
        init();
    }, 1000);
});

// Extra feature: keyboard shortcuts
// Debug feature: Clear localStorage if needed (Ctrl+Shift+C)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        if (confirm('Clear all saved settings and reset to default? (This will fix EmailJS issues)')) {
            localStorage.clear();
            location.reload();
        }
    }
});
document.addEventListener('keydown', function(e) {
    // Press spacebar to increase count
    if (e.code === 'Space') {
        e.preventDefault();
        handleDrinkClick();
    }
    // Press Ctrl+R to reset
    if (e.code === 'KeyR' && e.ctrlKey) {
        e.preventDefault();
        handleReset();
    }
});

// Prevent accidental page leave (when there's a count)
window.addEventListener('beforeunload', function(e) {
    if (drinkCount > 0) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your drinking record will be saved!';
    }
});

// Statistics Functions
function openStatsModal() {
    updateStatistics();
    statsModal.classList.remove('hidden');
}

function closeStatsModal() {
    statsModal.classList.add('hidden');
}

function switchTab(tabName) {
    // Remove active class from all tabs and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Update statistics for the selected tab
    updateTabContent(tabName);
}

function updateStatistics() {
    updateTodayStats();
    updateWeekStats();
    updateMonthStats();
    updateHistoryDisplay();
}

function updateTodayStats() {
    const today = new Date().toDateString();
    const todayDrinks = drinkHistory.filter(drink => drink.date === today);
    const lastDrink = todayDrinks.length > 0 ? todayDrinks[todayDrinks.length - 1].time : 'Never';
    
    document.getElementById('todayCount').textContent = drinkCount;
    document.getElementById('lastDrinkTime').textContent = lastDrink;
    
    let status = 'Good';
    if (drinkCount >= settings.triggerCount * 2) {
        status = 'Critical';
    } else if (drinkCount >= settings.triggerCount) {
        status = 'Warning';
    }
    
    document.getElementById('todayStatus').textContent = status;
    document.getElementById('todayStatus').style.color = 
        status === 'Critical' ? '#e53e3e' : 
        status === 'Warning' ? '#d69e2e' : '#48bb78';
        
    // Update money stats
    updateTodayStatsWithMoney();
}

function updateWeekStats() {
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weekDrinks = drinkHistory.filter(drink => drink.timestamp >= weekAgo);
    
    // Group by date
    const dailyCounts = {};
    weekDrinks.forEach(drink => {
        const date = drink.date;
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    
    const totalDrinks = weekDrinks.length;
    const daysWithDrinks = Object.keys(dailyCounts).length;
    const average = totalDrinks > 0 ? (totalDrinks / 7).toFixed(1) : '0.0';
    
    document.getElementById('weekTotal').textContent = totalDrinks;
    document.getElementById('weekDays').textContent = `${daysWithDrinks}/7`;
    document.getElementById('weekAverage').textContent = average;
    
    // Create weekly bar chart
    createWeeklyChart(dailyCounts);
    
    // Update money stats
    updateWeekStatsWithMoney();
}

function updateMonthStats() {
    const monthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const monthDrinks = drinkHistory.filter(drink => drink.timestamp >= monthAgo);
    
    // Group by date
    const dailyCounts = {};
    monthDrinks.forEach(drink => {
        const date = drink.date;
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    
    const totalDrinks = monthDrinks.length;
    const daysWithDrinks = Object.keys(dailyCounts).length;
    const worstDay = Object.keys(dailyCounts).reduce((worst, date) => {
        return dailyCounts[date] > (dailyCounts[worst] || 0) ? date : worst;
    }, 'None');
    
    document.getElementById('monthTotal').textContent = totalDrinks;
    document.getElementById('monthDays').textContent = `${daysWithDrinks}/30`;
    document.getElementById('monthWorst').textContent = 
        worstDay !== 'None' ? `${worstDay} (${dailyCounts[worstDay]} drinks)` : 'None';
        
    // Update money stats
    updateMonthStatsWithMoney();
}

function createWeeklyChart(dailyCounts) {
    const chartContainer = document.getElementById('weeklyBars');
    chartContainer.innerHTML = '';
    
    // Get last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toDateString());
    }
    
    const maxCount = Math.max(...days.map(date => dailyCounts[date] || 0), 1);
    
    days.forEach((date, index) => {
        const count = dailyCounts[date] || 0;
        const height = (count / maxCount) * 100;
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${height}%`;
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date).getDay()];
        
        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = count;
        
        bar.appendChild(label);
        bar.appendChild(value);
        chartContainer.appendChild(bar);
    });
}

function updateHistoryDisplay() {
    const historyContainer = document.getElementById('historyList');
    
    if (drinkHistory.length === 0) {
        historyContainer.innerHTML = '<p class="no-history">No history available yet. Start tracking!</p>';
        return;
    }
    
    // Group history by date
    const groupedHistory = {};
    drinkHistory.forEach(drink => {
        const date = drink.date;
        if (!groupedHistory[date]) {
            groupedHistory[date] = [];
        }
        groupedHistory[date].push(drink);
    });
    
    // Sort dates in descending order
    const sortedDates = Object.keys(groupedHistory).sort((a, b) => new Date(b) - new Date(a));
    
    historyContainer.innerHTML = '';
    sortedDates.slice(0, 10).forEach(date => { // Show only last 10 days
        const drinks = groupedHistory[date];
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'history-date';
        dateSpan.textContent = new Date(date).toLocaleDateString();
        
        const countSpan = document.createElement('span');
        countSpan.className = 'history-count';
        countSpan.textContent = `${drinks.length} drinks`;
        
        historyItem.appendChild(dateSpan);
        historyItem.appendChild(countSpan);
        historyContainer.appendChild(historyItem);
    });
}

function updateTabContent(tabName) {
    switch(tabName) {
        case 'today':
            updateTodayStats();
            break;
        case 'week':
            updateWeekStats();
            break;
        case 'month':
            updateMonthStats();
            break;
        case 'history':
            updateHistoryDisplay();
            break;
    }
}

function clearDrinkHistory() {
    if (confirm('Are you sure you want to clear all drinking history? This cannot be undone!')) {
        drinkHistory = [];
        localStorage.removeItem('drinkHistory');
        updateStatistics();
        showMessage('🗑️ History cleared successfully!', '#f56565');
    }
}

function exportDrinkHistory() {
    if (drinkHistory.length === 0) {
        alert('No history to export!');
        return;
    }
    
    // Create CSV content
    let csvContent = 'Date,Time,Drink Count,Total for Day\n';
    
    const dailyCounts = {};
    drinkHistory.forEach(drink => {
        const date = drink.date;
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    
    drinkHistory.forEach(drink => {
        csvContent += `"${drink.date}","${drink.time}",${drink.count},${dailyCounts[drink.date]}\n`;
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drink-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showMessage('📋 History exported successfully!', '#38b2ac');
}

// Drunk Effect Functions
function updateDrunkEffects() {
    if (!settings.enableDrunkEffect) {
        removeDrunkEffects();
        return;
    }
    const container = document.querySelector('.container');
    const button = document.querySelector('.drink-button');
    // Remove existing drunk classes
    removeDrunkEffects();
    // 聚焦地獄效果
    if (drinkCount >= 2 && drinkCount <= 3) {
        document.body.classList.add('drunk-bg-blur1');
        button.classList.add('drunk-focus');
    } else if (drinkCount >= 4 && drinkCount <= 5) {
        document.body.classList.add('drunk-bg-blur2');
        button.classList.add('drunk-focus');
    } else if (drinkCount >= 6) {
        document.body.classList.add('drunk-bg-blur3');
        button.classList.add('drunk-focus');
    }
    // 原本的晃動/文字效果
    if (drinkCount >= 2 && drinkCount <= 3) {
        container.classList.add('drunk-level-1');
    } else if (drinkCount >= 4 && drinkCount <= 5) {
        container.classList.add('drunk-level-2');
        button.classList.add('drunk-button');
    } else if (drinkCount >= 6 && drinkCount <= 8) {
        container.classList.add('drunk-level-3');
        button.classList.add('drunk-button');
        addDrunkText();
    } else if (drinkCount >= 9) {
        container.classList.add('drunk-level-4');
        button.classList.add('drunk-button');
        addDrunkText();
    }
}

function removeDrunkEffects() {
    const container = document.querySelector('.container');
    const button = document.querySelector('.drink-button');
    container.classList.remove('drunk-level-1', 'drunk-level-2', 'drunk-level-3', 'drunk-level-4');
    button.classList.remove('drunk-button', 'drunk-focus');
    document.body.classList.remove('drunk-bg-blur1', 'drunk-bg-blur2', 'drunk-bg-blur3');
    // Remove drunk text effects
    const drunkTexts = document.querySelectorAll('.drunk-text');
    drunkTexts.forEach(element => {
        element.classList.remove('drunk-text');
        element.removeAttribute('data-text');
    });
}

function addDrunkText() {
    const textElements = document.querySelectorAll('h1, .subtitle, .message-area p');
    textElements.forEach(element => {
        if (!element.classList.contains('drunk-text')) {
            element.classList.add('drunk-text');
            element.setAttribute('data-text', element.textContent);
        }
    });
}

// Virtual Wallet Functions


// Update statistics with money calculations (assuming $5 per drink)
function updateTodayStatsWithMoney() {
    const moneySpent = drinkCount * DRINK_PRICE;
    const couldHaveSaved = moneySpent; // If they had 0 drinks
    
    if (document.getElementById('moneySpentToday')) {
        document.getElementById('moneySpentToday').textContent = `$${moneySpent.toFixed(2)}`;
    }
    if (document.getElementById('couldHaveSavedToday')) {
        document.getElementById('couldHaveSavedToday').textContent = `$${couldHaveSaved.toFixed(2)}`;
    }
}

function updateWeekStatsWithMoney() {
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weekDrinks = drinkHistory.filter(drink => drink.timestamp >= weekAgo);
    const moneySpent = weekDrinks.length * DRINK_PRICE;
    
    if (document.getElementById('moneySpentWeek')) {
        document.getElementById('moneySpentWeek').textContent = `$${moneySpent.toFixed(2)}`;
    }
}

function updateMonthStatsWithMoney() {
    const monthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const monthDrinks = drinkHistory.filter(drink => drink.timestamp >= monthAgo);
    const moneySpent = monthDrinks.length * DRINK_PRICE;
    const potentialSavings = moneySpent; // What they could have saved
    
    if (document.getElementById('moneySpentMonth')) {
        document.getElementById('moneySpentMonth').textContent = `$${moneySpent.toFixed(2)}`;
    }
    if (document.getElementById('potentialSavingsMonth')) {
        document.getElementById('potentialSavingsMonth').textContent = `$${potentialSavings.toFixed(2)} saved!`;
    }
} 