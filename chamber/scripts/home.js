// Display random spotlight members (gold/silver only)
async function displaySpotlights() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();
        
        // Filter for gold (3) and silver (2) members only
        const qualifiedMembers = members.filter(member => 
            member.membership === 3 || member.membership === 2
        );
        
        // Randomly select 3 members (or fewer if not enough)
        const selectedMembers = [];
        const shuffled = [...qualifiedMembers].sort(() => 0.5 - Math.random());
        const count = Math.min(3, shuffled.length);
        
        for (let i = 0; i < count; i++) {
            selectedMembers.push(shuffled[i]);
        }
        
        renderSpotlights(selectedMembers);
        
    } catch (error) {
        console.error('Error loading spotlights:', error);
        displayMockSpotlights();
    }
}

function renderSpotlights(members) {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = '';
    
    members.forEach(member => {
        const card = document.createElement('div');
        card.className = `spotlight-card ${member.membership === 3 ? 'gold' : 'silver'}`;
        
        const membershipText = member.membership === 3 ? 'Gold Member' : 'Silver Member';
        const badgeClass = member.membership === 3 ? '' : 'silver';
        
        card.innerHTML = `
            <div class="spotlight-header">
                <img src="images/members/${member.logo || member.image}" 
                     alt="${member.name} Logo" 
                     class="spotlight-logo"
                     loading="lazy">
                <h4>${member.name}</h4>
                <span class="member-badge ${badgeClass}">${membershipText}</span>
            </div>
            <div class="spotlight-info">
                <p><strong>📍</strong> ${member.address}</p>
                <p><strong>📞</strong> ${member.phone}</p>
                <p><strong>🌐</strong> <a href="${member.website}" target="_blank">${member.website.replace('https://', '')}</a></p>
                <p><em>${member.description}</em></p>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Mock data for fallback
function displayMockSpotlights() {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = `
        <div class="spotlight-card">
            <div class="spotlight-header">
                <img src="images/members/textiles.jpg" alt="Sahara Textiles Logo" class="spotlight-logo">
                <h4>Sahara Textiles</h4>
                <span class="member-badge">Gold Member</span>
            </div>
            <div class="spotlight-info">
                <p><strong>📍</strong> 15 Rue du Marché, Timbuktu</p>
                <p><strong>📞</strong> (223) 555-0101</p>
                <p><strong>🌐</strong> sahara-textiles.ml</p>
                <p><em>Traditional Malian fabrics and clothing</em></p>
            </div>
        </div>
        
        <div class="spotlight-card silver">
            <div class="spotlight-header">
                <img src="images/members/tours.jpg" alt="Timbuktu Tours Logo" class="spotlight-logo">
                <h4>Timbuktu Tours</h4>
                <span class="member-badge silver">Silver Member</span>
            </div>
            <div class="spotlight-info">
                <p><strong>📍</strong> 5 Avenue de l'Indépendance, Timbuktu</p>
                <p><strong>📞</strong> (223) 555-0202</p>
                <p><strong>🌐</strong> timbuktutours.ml</p>
                <p><em>Guided tours of historical sites</em></p>
            </div>
        </div>
    `;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', displaySpotlights);