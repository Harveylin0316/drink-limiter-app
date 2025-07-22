// Global variables
let drinkCount = 0;
let emailSent = false;

// Settings with default values
let settings = {
    friendEmail: '',
    triggerCount: 3,
    customMessage: 'Help! I\'m drinking again and can\'t control myself!',
    enableSounds: true,
    // EmailJS configuration
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: '',
    enableRealEmail: false
};

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
const emailjsServiceIdInput = document.getElementById('emailjsServiceId');
const emailjsTemplateIdInput = document.getElementById('emailjsTemplateId');
const emailjsPublicKeyInput = document.getElementById('emailjsPublicKey');
const enableRealEmailInput = document.getElementById('enableRealEmail');
const testEmailBtn = document.getElementById('testEmail');

// Message array - display different messages based on drink count
const messages = {
    0: {
        text: "You haven't had any drinks today! Keep it up! 💪",
        class: ""
    },
    1: {
        text: "First drink... not too bad, just drink responsibly 🤔",
        class: ""
    },
    2: {
        text: "Second drink! Time to start paying attention 😬",
        class: "warning"
    },
    3: {
        text: "Third drink!!! Your friends have been notified 📧😱",
        class: "danger"
    },
    4: {
        text: "Fourth drink... can't you really stop yourself? 🤯",
        class: "danger"
    },
    5: {
        text: "Fifth drink! You've been reported! Friends are on their way 🚨",
        class: "critical"
    },
    6: {
        text: "Sixth drink... your liver is crying 😭🍾",
        class: "critical"
    },
    7: {
        text: "Seventh drink! Emergency status! Your friends are mobilized 🚑",
        class: "critical"
    },
    8: {
        text: "Eighth drink... you've entered the danger zone ⚠️💀",
        class: "critical"
    },
    9: {
        text: "Ninth drink! Your drinking license is about to be revoked 📜❌",
        class: "critical"
    },
    10: {
        text: "Tenth drink... legendary level, you've become the god of drinking 🍺👑",
        class: "critical"
    }
};

// Advanced gag messages (randomly appear)
const advancedGagMessages = [
    "🔔 Your family has been notified",
    "📱 Calling alcohol hotline...",
    "🚨 Alcohol detector activated",
    "📋 Your drinking record has been uploaded to cloud",
    "👮‍♀️ DUI patrol unit dispatched",
    "🏥 Nearby hospital has received your reservation",
    "📺 You've become today's headline news",
    "🎯 Your GPS location has been shared with all contacts"
];

// Initialize
function init() {
    // Load data from localStorage
    loadData();
    loadSettings();
    updateDisplay();
    
    // Bind event listeners
    drinkButton.addEventListener('click', handleDrinkClick);
    resetButton.addEventListener('click', handleReset);
    settingsButton.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsModal);
    saveSettings.addEventListener('click', saveSettingsData);
    resetSettingsBtn.addEventListener('click', resetSettingsToDefault);
    testEmailBtn.addEventListener('click', sendTestEmail);
    
    // Close modal when clicking outside
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });
}

// Load data from localStorage
function loadData() {
    const savedCount = localStorage.getItem('drinkCount');
    const savedEmailStatus = localStorage.getItem('emailSent');
    
    if (savedCount !== null) {
        drinkCount = parseInt(savedCount);
    }
    
    if (savedEmailStatus !== null) {
        emailSent = JSON.parse(savedEmailStatus);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('drinkCount', drinkCount.toString());
    localStorage.setItem('emailSent', JSON.stringify(emailSent));
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
    }
    
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
    // EmailJS settings
    settings.emailjsServiceId = emailjsServiceIdInput.value.trim();
    settings.emailjsTemplateId = emailjsTemplateIdInput.value.trim();
    settings.emailjsPublicKey = emailjsPublicKeyInput.value.trim();
    settings.enableRealEmail = enableRealEmailInput.checked;
    
    // Validation
    if (settings.friendEmail && !isValidEmail(settings.friendEmail)) {
        alert('Please enter a valid email address');
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
    // EmailJS settings
    emailjsServiceIdInput.value = settings.emailjsServiceId;
    emailjsTemplateIdInput.value = settings.emailjsTemplateId;
    emailjsPublicKeyInput.value = settings.emailjsPublicKey;
    enableRealEmailInput.checked = settings.enableRealEmail;
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
            // EmailJS configuration
            emailjsServiceId: '',
            emailjsTemplateId: '',
            emailjsPublicKey: '',
            enableRealEmail: false
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
    const buttonTexts = [
        '🍻 I had another drink',
        '🍺 One more drink',
        '🥃 Can\'t stop myself',
        '🍷 Already drunk',
        '🍾 Completely out of control',
        '🥂 I am the drink god'
    ];
    
    let textIndex = Math.min(Math.floor(drinkCount / 2), buttonTexts.length - 1);
    drinkButton.textContent = buttonTexts[textIndex];
}

// Send email notification (real or simulated)
function sendEmailNotification() {
    const email = settings.friendEmail || 'No email set';
    const message = settings.customMessage || 'Help! I\'m drinking again and can\'t control myself!';
    
    console.log('📧 Sending email notification to:', email);
    console.log('📝 Message:', message);
    
    // Show notification animation
    showEmailNotification();
    
    if (settings.enableRealEmail && isEmailJSConfigured()) {
        // Send real email using EmailJS
        sendRealEmail(email, message, drinkCount);
    } else {
        // Just simulation
        setTimeout(() => {
            console.log('✅ Email notification sent (simulated)!');
        }, 2000);
    }
}

// Check if EmailJS is properly configured
function isEmailJSConfigured() {
    return settings.emailjsServiceId && 
           settings.emailjsTemplateId && 
           settings.emailjsPublicKey &&
           typeof emailjs !== 'undefined';
}

// Send real email using EmailJS
function sendRealEmail(toEmail, customMessage, drinkCount) {
    if (!toEmail || !isValidEmail(toEmail)) {
        console.error('Invalid email address');
        showMessage('❌ Invalid email address!', '#f56565');
        return;
    }

    // Initialize EmailJS with public key
    emailjs.init(settings.emailjsPublicKey);
    
    const templateParams = {
        to_email: toEmail,
        from_name: 'Drink Limiter App',
        subject: 'Emergency Notification - Drinking Alert!',
        message: customMessage,
        drink_count: drinkCount,
        timestamp: new Date().toLocaleString()
    };

    emailjs.send(settings.emailjsServiceId, settings.emailjsTemplateId, templateParams)
        .then((response) => {
            console.log('✅ Real email sent successfully!', response.status, response.text);
            showMessage('✅ Real email sent successfully!', '#48bb78');
        })
        .catch((error) => {
            console.error('❌ Failed to send real email:', error);
            showMessage('❌ Failed to send email: ' + error.text, '#f56565');
        });
}

// Send test email
function sendTestEmail() {
    if (!settings.friendEmail) {
        alert('Please enter a friend\'s email address first!');
        return;
    }
    
    if (!isEmailJSConfigured()) {
        alert('Please configure EmailJS settings first!');
        return;
    }
    
    // Disable button during send
    testEmailBtn.disabled = true;
    testEmailBtn.textContent = '📤 Sending...';
    
    const testMessage = 'This is a test message from your Drink Limiter app. If you receive this, the email configuration is working correctly!';
    
    sendRealEmail(settings.friendEmail, testMessage, 0);
    
    // Re-enable button after 3 seconds
    setTimeout(() => {
        testEmailBtn.disabled = false;
        testEmailBtn.textContent = '🧪 Send Test Email';
    }, 3000);
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
        max-width: 300px;
    `;
    
    const emailText = settings.friendEmail ? 
        `📧 Emergency notification sent to:<br><small>${settings.friendEmail}</small>` : 
        '📧 Emergency notification sent!<br><small>Configure email in settings</small>';
    
    notification.innerHTML = emailText;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
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
        
        // Clear localStorage
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

// Initialize after page load
document.addEventListener('DOMContentLoaded', init);

// Extra feature: keyboard shortcuts
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