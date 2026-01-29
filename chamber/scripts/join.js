// Set timestamp when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set current timestamp in hidden field
    const timestampField = document.getElementById('timestamp');
    const now = new Date();
    timestampField.value = now.toISOString();
    
    // Add animation to membership cards
    animateMembershipCards();
    
    // Setup modal functionality
    setupModals();
    
    // Form validation
    setupFormValidation();
});

// Animate membership cards on page load
function animateMembershipCards() {
    const cards = document.querySelectorAll('.membership-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${(index + 1) * 0.1}s`;
    });
}

// Modal functionality
function setupModals() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    const infoButtons = document.querySelectorAll('.info-btn');
    
    // Open modal when info button is clicked
    infoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.dataset.level;
            const modal = document.getElementById(`${level}Modal`);
            
            modalOverlay.style.display = 'block';
            modal.classList.add('active');
            
            // Trap focus inside modal for accessibility
            trapFocus(modal);
        });
    });
    
    // Close modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', () => {
        closeAllModals();
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    function closeAllModals() {
        modalOverlay.style.display = 'none';
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Focus trap for accessibility
    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        firstFocusable.focus();
        
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }
}

// Form validation
function setupFormValidation() {
    const form = document.getElementById('membershipForm');
    const titleInput = document.getElementById('title');
    
    // Custom validation for job title pattern
    titleInput.addEventListener('input', function() {
        const pattern = /^[A-Za-z\s\-]{7,}$/;
        if (this.value && !pattern.test(this.value)) {
            this.setCustomValidity('Job title must be at least 7 characters and contain only letters, spaces, and hyphens.');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }
        
        this.value = value;
    });
    
    // Store form data in localStorage before submission
    form.addEventListener('submit', function() {
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            businessName: document.getElementById('businessName').value,
            membershipLevel: document.getElementById('membershipLevel').value,
            timestamp: document.getElementById('timestamp').value
        };
        
        localStorage.setItem('chamberApplication', JSON.stringify(formData));
    });
}