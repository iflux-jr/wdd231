// scripts/attractions.js
import { attractions } from '../data/attractions.mjs';

document.addEventListener('DOMContentLoaded', function() {
    displayAttractions();
});

function displayAttractions() {
    const grid = document.getElementById('attractionsGrid');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    attractions.forEach(attraction => {
        const card = document.createElement('article');
        card.className = 'attraction-card';
        card.setAttribute('data-category', attraction.category.toLowerCase());
        
        card.innerHTML = `
            <div class="attraction-header">
                <div class="attraction-image">
                    <img src="images/attractions/${attraction.image}" 
                         alt="${attraction.name}" 
                         loading="lazy"
                         width="300" 
                         height="200">
                </div>
                <div class="attraction-badge">${attraction.category}</div>
            </div>
            <div class="attraction-content">
                <h4>${attraction.name}</h4>
                <div class="attraction-meta">
                    <span class="location">📍 ${attraction.address}</span>
                    <span class="hours">🕒 ${attraction.hours}</span>
                </div>
                <p class="attraction-description">${attraction.description}</p>
                <div class="attraction-footer">
                    <span class="price">${attraction.admission}</span>
                    <button class="learn-more-btn" data-id="${attraction.id}">Details</button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Add event listeners
    document.querySelectorAll('.learn-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const attraction = attractions.find(a => a.id == id);
            if (attraction) {
                showAttractionModal(attraction);
            }
        });
    });
}

function showAttractionModal(attraction) {
    const modal = document.createElement('div');
    modal.className = 'attraction-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3>${attraction.name}</h3>
            <img src="images/attractions/${attraction.image}" alt="${attraction.name}" class="modal-image">
            <p><strong>Address:</strong> ${attraction.address}</p>
            <p><strong>Hours:</strong> ${attraction.hours}</p>
            <p><strong>Admission:</strong> ${attraction.admission}</p>
            <p><strong>Category:</strong> ${attraction.category}</p>
            <button class="close-modal-btn">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.close-modal-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}