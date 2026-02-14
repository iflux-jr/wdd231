// visit.js - Visit page specific functionality
import { initCommon } from './utils.js';
import { initEventsPage } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize common utilities
    initCommon();
    
    // Initialize events page
    initEventsPage();
    
    console.log('Visit page initialized');
});