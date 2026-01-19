let allMembers = [];

async function fetchMembers() {
    try {
        const response = await fetch('data/members.json');
        allMembers = await response.json();
        showGridView();
    } catch (error) {
        console.error('Error:', error);
    }
}

function showGridView() {
    const container = document.getElementById('member-container');
    container.className = 'grid-view';
    container.innerHTML = '';
    
    allMembers.forEach(member => {
        container.innerHTML += createMemberCard(member);
    });
}

function showListView() {
    const container = document.getElementById('member-container');
    container.className = 'list-view';
    container.innerHTML = '';
    
    allMembers.forEach(member => {
        container.innerHTML += createMemberCard(member);
    });
}

function createMemberCard(member) {
    let membershipText = '';
    let membershipClass = '';
    switch(member.membership) {
        case 3: membershipText = 'Gold'; membershipClass = 'membership-3'; break;
        case 2: membershipText = 'Silver'; membershipClass = 'membership-2'; break;
        case 1: membershipText = 'Bronze'; membershipClass = 'membership-1'; break;
    }
    
    return `
        <article class="member-card">
            <div class="member-image">
                <img src="${member.image}" 
                     alt="${member.name}" 
                     loading="lazy"
                     onload="this.classList.add('loaded')">
            </div>
            <div class="member-info">
                <span class="membership-badge ${membershipClass}">${membershipText} Member</span>
                <h3>${member.name}</h3>
                <p class="member-category">${member.category}</p>
                <p class="member-description">${member.description}</p>
                <div class="member-contact">
                    <p><strong>📍</strong> ${member.address}</p>
                    <p><strong>📞</strong> ${member.phone}</p>
                    <p><strong>🌐</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.website.replace('https://', '')}</a></p>
                </div>
            </div>
        </article>
    `;
}

// Event listeners
document.getElementById('grid-view').addEventListener('click', () => {
    document.getElementById('grid-view').classList.add('active');
    document.getElementById('list-view').classList.remove('active');
    showGridView();
});

document.getElementById('list-view').addEventListener('click', () => {
    document.getElementById('list-view').classList.add('active');
    document.getElementById('grid-view').classList.remove('active');
    showListView();
});

// Initialize
fetchMembers();