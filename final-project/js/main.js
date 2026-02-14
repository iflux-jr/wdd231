// main.js - Main entry point for homepage
import { initCommon } from './utils.js';
import { loadFeaturedBook, loadNextEvent } from './events.js';

// Initialize homepage features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize common utilities (navigation, footer, etc.)
    initCommon();
    
    // Load homepage-specific content
    console.log('Thumper\'s Library - Loading homepage content...');
    
    // Load featured book
    loadFeaturedBook();
    
    // Load next storytime event
    loadNextEvent();
});