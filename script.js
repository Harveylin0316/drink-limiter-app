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
    drinkPrice: 8.00,
    enableDrunkEffect: true,
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
// Statistics elements
const statsButton = document.getElementById('statsButton');
const statsModal = document.getElementById('statsModal');
const closeStats = document.getElementById('closeStats');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const clearHistoryBtn = document.getElementById('clearHistory');
const exportHistoryBtn = document.getElementById('exportHistory');
// New feature elements
const drinkPriceInput = document.getElementById('drinkPrice');
const enableDrunkEffectInput = document.getElementById('enableDrunkEffect');
const walletDisplay = document.getElementById('walletDisplay');
const moneySavedToday = document.getElementById('moneySavedToday');
const moneyMessage = document.getElementById('moneyMessage');

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
    settings.drinkPrice = parseFloat(drinkPriceInput.value) || 8.00;
    settings.enableDrunkEffect = enableDrunkEffectInput.checked;
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
    drinkPriceInput.value = settings.drinkPrice.toFixed(2);
    enableDrunkEffectInput.checked = settings.enableDrunkEffect;
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
            drinkPrice: 8.00,
            enableDrunkEffect: true,
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
    
    // Update wallet display
    updateWalletDisplay();
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
    
    // Apply drunk effects based on drink count
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
    button.classList.remove('drunk-button');
    
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
function updateWalletDisplay() {
    if (drinkCount === 0 && !walletDisplay.classList.contains('hidden')) {
        walletDisplay.classList.add('hidden');
        return;
    }
    
    if (drinkCount > 0) {
        walletDisplay.classList.remove('hidden');
        
        // Calculate money spent today
        const moneySpent = drinkCount * settings.drinkPrice;
        moneySavedToday.textContent = `$${moneySpent.toFixed(2)}`;
        
        // Update motivational message
        updateMoneyMessage(moneySpent);
    }
}

function updateMoneyMessage(moneySpent) {
    const messages = [
        { max: 20, text: "Not too bad! You're keeping it reasonable 💪" },
        { max: 50, text: "That's a nice dinner you just drank! 🍽️" },
        { max: 100, text: "Whoa! That could've been a new pair of shoes! 👟" },
        { max: 200, text: "You could've bought groceries for a week! 🛒" },
        { max: 500, text: "That's a weekend getaway you just drank! ✈️" },
        { max: Infinity, text: "You're entering legendary spending territory! 💸" }
    ];
    
    const message = messages.find(m => moneySpent <= m.max);
    moneyMessage.textContent = message.text;
    
    // Add extra encouragement if they're drinking a lot
    if (moneySpent > 100) {
        moneyMessage.style.color = '#f56565';
        moneyMessage.style.fontWeight = 'bold';
    } else {
        moneyMessage.style.color = 'rgba(255,255,255,0.9)';
        moneyMessage.style.fontWeight = 'normal';
    }
}

// Update statistics with money calculations
function updateTodayStatsWithMoney() {
    const moneySpent = drinkCount * settings.drinkPrice;
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
    const moneySpent = weekDrinks.length * settings.drinkPrice;
    
    if (document.getElementById('moneySpentWeek')) {
        document.getElementById('moneySpentWeek').textContent = `$${moneySpent.toFixed(2)}`;
    }
}

function updateMonthStatsWithMoney() {
    const monthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const monthDrinks = drinkHistory.filter(drink => drink.timestamp >= monthAgo);
    const moneySpent = monthDrinks.length * settings.drinkPrice;
    const potentialSavings = moneySpent; // What they could have saved
    
    if (document.getElementById('moneySpentMonth')) {
        document.getElementById('moneySpentMonth').textContent = `$${moneySpent.toFixed(2)}`;
    }
    if (document.getElementById('potentialSavingsMonth')) {
        document.getElementById('potentialSavingsMonth').textContent = `$${potentialSavings.toFixed(2)} saved!`;
    }
} 