// utils.js - Utility functions and shared functionality

// Configuration
export const CONFIG = {
    API_BASE: 'https://openlibrary.org',
    STORAGE_KEY: 'thumpersLibrary_preferences',
    DEFAULT_PREFERENCES: {
        ageFilter: 'all',
        genreFilter: 'all',
        sortBy: 'title',
        theme: 'light'
    }
};

// ===== Local Storage Functions =====
export function savePreferences(preferences) {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(preferences));
        return true;
    } catch (error) {
        console.error('Error saving preferences:', error);
        return false;
    }
}

export function loadPreferences() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        return saved ? JSON.parse(saved) : CONFIG.DEFAULT_PREFERENCES;
    } catch (error) {
        console.error('Error loading preferences:', error);
        return CONFIG.DEFAULT_PREFERENCES;
    }
}

export function clearPreferences() {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    showNotification('Preferences cleared!', 'info');
}

// ===== DOM Helpers =====
export function showLoading(container, message = 'Loading...') {
    if (!container) return;
    container.innerHTML = `<div class="loading">${message}</div>`;
}

export function showError(container, message = 'Something went wrong. Please try again.') {
    if (!container) return;
    container.innerHTML = `<div class="error-message">❌ ${message}</div>`;
}

export function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Date Formatting =====
export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatTime(timeString) {
    return timeString; // Simple pass-through for now
}

// ===== Age Group Helpers =====
export function getAgeGroupFromBook(book) {
    // Determine age group based on subject or default
    if (book.subject && Array.isArray(book.subject)) {
        const subjects = book.subject.join(' ').toLowerCase();
        if (subjects.includes('juvenile') || subjects.includes('children')) {
            if (subjects.includes('picture book')) return '4-6';
            if (subjects.includes('board book')) return '0-3';
            return '7-12';
        }
    }
    return 'All Ages';
}

// ===== Navigation =====
export function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');
    
    if (!hamburger || !nav) return;
    
    hamburger.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !expanded);
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
    });
    
    // Close navigation when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            nav.classList.remove('open');
        });
    });
    
    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===== Footer Utilities =====
export function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// ===== Initialize Common Features =====
export function initCommon() {
    initNavigation();
    updateFooterYear();
    
    // Reset preferences button
    const resetBtn = document.getElementById('reset-preferences');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearPreferences();
            showNotification('Preferences reset successfully!', 'success');
        });
    }
}

// Run on every page
document.addEventListener('DOMContentLoaded', initCommon);