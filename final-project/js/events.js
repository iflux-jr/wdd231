// events.js - Events page functionality
import { showLoading, showError, formatDate, showNotification } from './utils.js';

// State
let allEvents = [];
let filteredEvents = [];

// DOM Elements
const eventsContainer = document.getElementById('events-container');
const filterButtons = document.querySelectorAll('[data-event-filter]');

// ===== Fetch Events from JSON =====
export async function fetchEvents() {
    if (!eventsContainer) {
        console.log('Events container not found on this page');
        return;
    }
    
    console.log('Fetching events for events page...');
    showLoading(eventsContainer, 'Loading events...');
    
    try {
        const response = await fetch('./data/events.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Events loaded:', data);
        
        allEvents = data.events;
        
        // Apply initial filter (show all)
        filterEvents('all');
        
    } catch (error) {
        console.error('Error fetching events:', error);
        showError(eventsContainer, 'Failed to load events. Please refresh the page.');
        
        // Load fallback events if JSON fails
        loadFallbackEvents();
    }
}

// ===== Fallback Events =====
function loadFallbackEvents() {
    allEvents = [
        {
            id: 1,
            title: "Weekly Storytime with Thumper",
            date: "2024-03-02",
            time: "10:00 AM",
            description: "Join Thumper the rabbit for stories, songs, and fun! Perfect for ages 2-5.",
            type: "storytime",
            ageGroup: "2-5",
            registration: false
        },
        {
            id: 2,
            title: "Author Visit: Jane Doe - 'The Lost Kitten'",
            date: "2024-03-15",
            time: "2:00 PM",
            description: "Local author Jane Doe reads her new picture book and leads a drawing activity.",
            type: "author",
            ageGroup: "4-8",
            registration: true
        },
        {
            id: 3,
            title: "Pajama Storytime",
            date: "2024-03-08",
            time: "6:30 PM",
            description: "Wear your pajamas and bring a stuffed animal for an evening of cozy stories.",
            type: "storytime",
            ageGroup: "3-7",
            registration: false
        },
        {
            id: 4,
            title: "Young Writers Workshop",
            date: "2024-03-22",
            time: "4:00 PM",
            description: "A creative writing workshop for ages 10-14. Learn to create characters and stories.",
            type: "workshop",
            ageGroup: "10-14",
            registration: true
        },
        {
            id: 5,
            title: "Baby & Me Lapsit",
            date: "2024-03-04",
            time: "9:30 AM",
            description: "Gentle stories, songs, and rhymes for babies 0-24 months and their caregivers.",
            type: "storytime",
            ageGroup: "0-2",
            registration: false
        },
        {
            id: 6,
            title: "Illustrator Showcase: Tom Smith",
            date: "2024-03-29",
            time: "3:00 PM",
            description: "Learn how picture books are illustrated! Drawing demo and Q&A.",
            type: "workshop",
            ageGroup: "6-12",
            registration: true
        }
    ];
    
    filterEvents('all');
}

// ===== Filter Events =====
export function filterEvents(filterValue) {
    if (filterValue === 'all') {
        filteredEvents = [...allEvents];
    } else {
        // Using filter array method
        filteredEvents = allEvents.filter(event => event.type === filterValue);
    }
    
    displayEvents();
    updateActiveFilter(filterValue);
}

// ===== Display Events =====
function displayEvents() {
    if (!eventsContainer) return;
    
    if (filteredEvents.length === 0) {
        eventsContainer.innerHTML = '<p class="no-results">No events found. Check back soon!</p>';
        return;
    }
    
    // Using map array method and template literals
    const eventsHTML = filteredEvents.map(event => {
        // Determine icon based on event type
        let icon = '📚';
        if (event.type === 'storytime') icon = '📖';
        if (event.type === 'author') icon = '✍️';
        if (event.type === 'workshop') icon = '🎨';
        
        return `
            <article class="event-card ${event.type}">
                <div class="event-date">📅 ${formatDate(event.date)} • ${event.time}</div>
                <h3 class="event-title">${icon} ${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-footer">
                    <span class="event-age">Ages ${event.ageGroup}</span>
                    ${event.registration ? 
                        '<span class="event-registration">✨ Req. Registration</span>' : 
                        '<span class="event-registration">✓ Drop-in Welcome</span>'
                    }
                </div>
            </article>
        `;
    }).join('');
    
    eventsContainer.innerHTML = eventsHTML;
}

// ===== Update Active Filter =====
function updateActiveFilter(activeFilter) {
    filterButtons.forEach(btn => {
        const filterValue = btn.dataset.eventFilter;
        if (filterValue === activeFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ===== Setup Event Listeners =====
export function setupEventListeners() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterValue = e.target.dataset.eventFilter;
            filterEvents(filterValue);
            showNotification(`Showing ${filterValue === 'all' ? 'all events' : filterValue + ' events'}`, 'info');
        });
    });
}

// ===== Featured Book on Homepage =====
export async function loadFeaturedBook() {
    const featuredContainer = document.getElementById('featured-book-container');
    if (!featuredContainer) {
        console.log('Featured book container not found on this page');
        return;
    }
    
    console.log('Loading featured book...');
    featuredContainer.innerHTML = '<div class="loading">Loading featured book...</div>';
    
    try {
        // Using Open Library API - search for popular children's books
        const response = await fetch('https://openlibrary.org/search.json?q=children%27s+books&sort=rating&limit=20');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response received:', data);
        
        if (data.docs && data.docs.length > 0) {
            // Get a random book from the results
            const randomIndex = Math.floor(Math.random() * Math.min(10, data.docs.length));
            const book = data.docs[randomIndex];
            
            // Determine age group based on subjects
            let ageGroup = 'All Ages';
            if (book.subject) {
                const subjects = book.subject.join(' ').toLowerCase();
                if (subjects.includes('juvenile') || subjects.includes('children')) {
                    if (subjects.includes('picture book')) ageGroup = 'Ages 4-6';
                    else if (subjects.includes('board book')) ageGroup = 'Ages 0-3';
                    else ageGroup = 'Ages 7-12';
                }
            }
            
            featuredContainer.innerHTML = `
                <div class="featured-book-card">
                    <h3>${book.title || 'Untitled'}</h3>
                    <p class="author"><strong>By:</strong> ${book.author_name ? book.author_name[0] : 'Unknown Author'}</p>
                    <p class="year"><strong>Published:</strong> ${book.first_publish_year || 'Unknown'}</p>
                    <p class="subjects"><strong>Subjects:</strong> ${book.subject ? book.subject.slice(0, 3).join(' • ') : 'Children\'s Literature'}</p>
                    <p class="book-age">${ageGroup}</p>
                    <a href="browse.html" class="btn btn-secondary">Find More Books</a>
                </div>
            `;
        } else {
            // Fallback if no books found
            featuredContainer.innerHTML = getFallbackFeaturedBook();
        }
    } catch (error) {
        console.error('Error loading featured book:', error);
        featuredContainer.innerHTML = getFallbackFeaturedBook();
    }
}

// Fallback featured book
function getFallbackFeaturedBook() {
    const fallbackBooks = [
        {
            title: "The Very Hungry Caterpillar",
            author: "Eric Carle",
            year: "1969",
            subjects: "Picture Book • Animals • Counting",
            age: "Ages 2-5"
        },
        {
            title: "Where the Wild Things Are",
            author: "Maurice Sendak",
            year: "1963",
            subjects: "Fantasy • Adventure • Classic",
            age: "Ages 4-8"
        },
        {
            title: "Goodnight Moon",
            author: "Margaret Wise Brown",
            year: "1947",
            subjects: "Bedtime • Classic • Rhyming",
            age: "Ages 0-3"
        }
    ];
    
    const randomBook = fallbackBooks[Math.floor(Math.random() * fallbackBooks.length)];
    
    return `
        <div class="featured-book-card">
            <h3>${randomBook.title}</h3>
            <p class="author"><strong>By:</strong> ${randomBook.author}</p>
            <p class="year"><strong>Published:</strong> ${randomBook.year}</p>
            <p class="subjects">${randomBook.subjects}</p>
            <p class="book-age">${randomBook.age}</p>
            <a href="browse.html" class="btn btn-secondary">Find More Books</a>
        </div>
    `;
}

// ===== Load Next Event on Homepage =====
export async function loadNextEvent() {
    const eventContainer = document.getElementById('next-event-container');
    if (!eventContainer) {
        console.log('Event container not found on this page');
        return;
    }
    
    console.log('Loading next event...');
    eventContainer.innerHTML = '<div class="loading">Loading event details...</div>';
    
    try {
        const response = await fetch('./data/events.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Events loaded for homepage:', data);
        
        if (data.events && data.events.length > 0) {
            // Get today's date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Find upcoming events
            const upcomingEvents = data.events
                .filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= today;
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            console.log('Upcoming events:', upcomingEvents);
            
            if (upcomingEvents.length > 0) {
                const next = upcomingEvents[0];
                eventContainer.innerHTML = `
                    <div class="next-event-card">
                        <div class="event-date">📅 ${formatDate(next.date)} at ${next.time}</div>
                        <h3>${next.title}</h3>
                        <p>${next.description}</p>
                        <div class="event-meta">
                            <span class="event-age">Ages ${next.ageGroup}</span>
                            ${next.registration ? 
                                '<span class="event-registration">✨ Registration Required</span>' : 
                                '<span class="event-registration">✓ Drop-in Welcome</span>'
                            }
                        </div>
                        <a href="visit.html#events" class="btn btn-primary">View All Events</a>
                    </div>
                `;
            } else {
                eventContainer.innerHTML = `
                    <div class="next-event-card">
                        <p>Check back soon for upcoming events!</p>
                        <p>Regular storytime every Saturday at 10am.</p>
                        <a href="visit.html#events" class="btn btn-primary">View Events</a>
                    </div>
                `;
            }
        } else {
            eventContainer.innerHTML = `
                <div class="next-event-card">
                    <p>Join us every Saturday at 10am for Storytime!</p>
                    <a href="visit.html#events" class="btn btn-primary">View Events</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading next event:', error);
        eventContainer.innerHTML = `
            <div class="next-event-card">
                <p>Join us every Saturday at 10am for Storytime!</p>
                <p>📖 Weekly stories, songs, and fun for ages 2-5.</p>
                <a href="visit.html#events" class="btn btn-primary">View All Events</a>
            </div>
        `;
    }
}

// ===== Initialize Events Page =====
export function initEventsPage() {
    console.log('Initializing events page...');
    
    if (document.getElementById('events-container')) {
        fetchEvents();
        setupEventListeners();
    }
}

// Don't auto-run anything - let the page scripts call what they need