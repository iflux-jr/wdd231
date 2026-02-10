// scripts/discover.js
document.addEventListener('DOMContentLoaded', function() {
    trackVisits();
    displayCurrentDate();
    setupMessageClose();
});

function trackVisits() {
    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');
    const messageElement = document.getElementById('visitMessage');
    const counterElement = document.getElementById('visitCounter');
    
    if (!messageElement) return;
    
    if (!lastVisit) {
        // First visit
        messageElement.textContent = "Welcome! Let us know if you have any questions.";
        counterElement.textContent = "First time visitor";
    } else {
        const lastVisitTime = parseInt(lastVisit);
        const daysBetween = Math.floor((now - lastVisitTime) / (1000 * 60 * 60 * 24));
        
        if (daysBetween === 0) {
            // Same day visit
            messageElement.textContent = "Back so soon! Awesome!";
            counterElement.textContent = "Visited earlier today";
        } else {
            // Different day visit
            const dayText = daysBetween === 1 ? "day" : "days";
            messageElement.textContent = `You last visited ${daysBetween} ${dayText} ago.`;
            counterElement.textContent = `Last visit: ${daysBetween} ${dayText} ago`;
        }
    }
    
    // Store current visit time
    localStorage.setItem('lastVisit', now.toString());
    
    // Store visit count
    let visitCount = parseInt(localStorage.getItem('visitCount')) || 0;
    visitCount++;
    localStorage.setItem('visitCount', visitCount);
}

function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

function setupMessageClose() {
    const closeButton = document.querySelector('.close-message');
    const messageContainer = document.querySelector('.visitor-message');
    
    if (closeButton && messageContainer) {
        closeButton.addEventListener('click', function() {
            messageContainer.style.display = 'none';
        });
    }
}