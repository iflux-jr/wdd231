// URL for the prophet data
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Get the cards container
const cards = document.querySelector('#cards');

// Function to fetch prophet data
async function getProphetData() {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check the data structure in console
        console.table(data.prophets);
        
        // Call display function with prophets array
        displayProphets(data.prophets);
    } catch (error) {
        console.error('Error fetching prophet data:', error);
        cards.innerHTML = `<p style="color: red; text-align: center; padding: 2rem;">Failed to load prophet data. Please try again later.</p>`;
    }
}

// Function to get ordinal suffix
function getOrdinalSuffix(number) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return 'st';
    } else if (number % 10 === 2 && number % 100 !== 12) {
        return 'nd';
    } else if (number % 10 === 3 && number % 100 !== 13) {
        return 'rd';
    } else {
        return 'th';
    }
}

// Function to format death date display
function formatDeathDate(deathDate) {
    if (deathDate === null || deathDate === 'null') {
        return 'Currently Serving';
    }
    return deathDate;
}

// Function to format years served
function formatYearsServed(length) {
    if (length === 0) {
        return 'Currently Serving';
    }
    return `${length} year${length !== 1 ? 's' : ''}`;
}

// Function to display prophets
const displayProphets = (prophets) => {
    // Clear any existing content
    cards.innerHTML = '';
    
    prophets.forEach((prophet) => {
        // Create card elements
        const card = document.createElement('section');
        const fullName = document.createElement('h2');
        const portrait = document.createElement('img');
        
        // Create additional information elements
        const birthDate = document.createElement('p');
        const birthPlace = document.createElement('p');
        const deathDate = document.createElement('p');
        const numChildren = document.createElement('p');
        const yearsServed = document.createElement('p');
        const order = document.createElement('p');
        
        // Set the full name
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        
        // Set the image attributes
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname} - ${prophet.order}${getOrdinalSuffix(prophet.order)} Latter-day President`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '280');
        portrait.setAttribute('height', '340');
        
        // Set the additional information
        birthDate.innerHTML = `<strong>Date of Birth:</strong> ${prophet.birthdate}`;
        birthPlace.innerHTML = `<strong>Place of Birth:</strong> ${prophet.birthplace}`;
        deathDate.innerHTML = `<strong>Date of Death:</strong> ${formatDeathDate(prophet.death)}`;
        numChildren.innerHTML = `<strong>Children:</strong> ${prophet.numofchildren}`;
        yearsServed.innerHTML = `<strong>Years as Prophet:</strong> ${formatYearsServed(prophet.length)}`;
        order.innerHTML = `<strong>Order:</strong> ${prophet.order}${getOrdinalSuffix(prophet.order)} Latter-day President`;
        
        // Add all elements to the card
        card.appendChild(fullName);
        card.appendChild(portrait);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(deathDate);
        card.appendChild(numChildren);
        card.appendChild(yearsServed);
        card.appendChild(order);
        
        // Add the card to the cards container
        cards.appendChild(card);
    });
};

// Call the function to get and display data
getProphetData();