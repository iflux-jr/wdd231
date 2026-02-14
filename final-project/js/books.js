// books.js - Book catalog functionality
import { 
    showLoading, 
    showError, 
    savePreferences, 
    loadPreferences, 
    showNotification,
    getAgeGroupFromBook 
} from './utils.js';

// State
let allBooks = [];
let filteredBooks = [];
let currentFilters = loadPreferences();

// DOM Elements
const booksContainer = document.getElementById('books-container');
const bookCountSpan = document.getElementById('book-count');
const ageFilter = document.getElementById('age-filter');
const genreFilter = document.getElementById('genre-filter');
const sortFilter = document.getElementById('sort-filter');
const resetFiltersBtn = document.getElementById('reset-filters');
const clearPrefsBtn = document.getElementById('clear-preferences');
const modal = document.getElementById('book-modal');
const modalBody = document.getElementById('modal-body');

// ===== Data Fetching =====
async function fetchBooks() {
    if (!booksContainer) return;
    
    showLoading(booksContainer, 'Loading books...');
    
    try {
        // Using Open Library API - search for children's books
        const response = await fetch('https://openlibrary.org/search.json?q=children%27s+books&limit=30');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to our format
        allBooks = data.docs.map(book => ({
            id: book.key,
            title: book.title || 'Untitled',
            author: book.author_name ? book.author_name[0] : 'Unknown Author',
            authorFull: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
            year: book.first_publish_year || 'Unknown',
            subjects: book.subject ? book.subject.slice(0, 5) : ['Children\'s Literature'],
            isbn: book.isbn ? book.isbn[0] : null,
            publisher: book.publisher ? book.publisher[0] : 'Unknown Publisher',
            ageGroup: getAgeGroupFromBook(book)
        }));
        
        // Apply initial filters
        applyFilters();
        
    } catch (error) {
        console.error('Error fetching books:', error);
        showError(booksContainer, 'Failed to load books. Please refresh the page.');
        
        // Fallback to local data
        loadFallbackBooks();
    }
}

// Fallback books if API fails
function loadFallbackBooks() {
    allBooks = [
        {
            id: 1,
            title: "The Very Hungry Caterpillar",
            author: "Eric Carle",
            year: 1969,
            subjects: ["Picture Book", "Animals", "Counting"],
            ageGroup: "0-3"
        },
        {
            id: 2,
            title: "Where the Wild Things Are",
            author: "Maurice Sendak",
            year: 1963,
            subjects: ["Picture Book", "Fantasy", "Adventure"],
            ageGroup: "4-6"
        },
        {
            id: 3,
            title: "Charlotte's Web",
            author: "E.B. White",
            year: 1952,
            subjects: ["Chapter Book", "Animals", "Friendship"],
            ageGroup: "7-9"
        },
        {
            id: 4,
            title: "Harry Potter and the Sorcerer's Stone",
            author: "J.K. Rowling",
            year: 1997,
            subjects: ["Fantasy", "Magic", "Adventure"],
            ageGroup: "10-12"
        },
        {
            id: 5,
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            year: 1937,
            subjects: ["Fantasy", "Adventure", "Classic"],
            ageGroup: "13+"
        },
        {
            id: 6,
            title: "Goodnight Moon",
            author: "Margaret Wise Brown",
            year: 1947,
            subjects: ["Board Book", "Bedtime", "Classic"],
            ageGroup: "0-3"
        },
        {
            id: 7,
            title: "The Cat in the Hat",
            author: "Dr. Seuss",
            year: 1957,
            subjects: ["Picture Book", "Rhyming", "Beginner Reader"],
            ageGroup: "4-6"
        },
        {
            id: 8,
            title: "Matilda",
            author: "Roald Dahl",
            year: 1988,
            subjects: ["Chapter Book", "Humor", "School"],
            ageGroup: "7-9"
        },
        {
            id: 9,
            title: "Percy Jackson & The Olympians",
            author: "Rick Riordan",
            year: 2005,
            subjects: ["Fantasy", "Mythology", "Adventure"],
            ageGroup: "10-12"
        },
        {
            id: 10,
            title: "The Hunger Games",
            author: "Suzanne Collins",
            year: 2008,
            subjects: ["Dystopian", "Adventure", "Sci-Fi"],
            ageGroup: "13+"
        },
        {
            id: 11,
            title: "Brown Bear, Brown Bear, What Do You See?",
            author: "Bill Martin Jr.",
            year: 1967,
            subjects: ["Board Book", "Animals", "Colors"],
            ageGroup: "0-3"
        },
        {
            id: 12,
            title: "The Giving Tree",
            author: "Shel Silverstein",
            year: 1964,
            subjects: ["Picture Book", "Philosophical", "Classic"],
            ageGroup: "4-6"
        },
        {
            id: 13,
            title: "James and the Giant Peach",
            author: "Roald Dahl",
            year: 1961,
            subjects: ["Fantasy", "Adventure", "Humor"],
            ageGroup: "7-9"
        },
        {
            id: 14,
            title: "The Lightning Thief",
            author: "Rick Riordan",
            year: 2005,
            subjects: ["Fantasy", "Mythology", "Adventure"],
            ageGroup: "10-12"
        },
        {
            id: 15,
            title: "The Giver",
            author: "Lois Lowry",
            year: 1993,
            subjects: ["Dystopian", "Sci-Fi", "Classic"],
            ageGroup: "13+"
        },
        {
            id: 16,
            title: "Guess How Much I Love You",
            author: "Sam McBratney",
            year: 1994,
            subjects: ["Board Book", "Bedtime", "Love"],
            ageGroup: "0-3"
        }
    ];
    
    applyFilters();
}

// ===== Filter Functions =====
function applyFilters() {
    // Start with all books
    let filtered = [...allBooks];
    
    // Apply age filter
    if (currentFilters.ageFilter && currentFilters.ageFilter !== 'all') {
        filtered = filtered.filter(book => book.ageGroup === currentFilters.ageFilter);
    }
    
    // Apply genre filter
    if (currentFilters.genreFilter && currentFilters.genreFilter !== 'all') {
        filtered = filtered.filter(book => 
            book.subjects.some(s => 
                s.toLowerCase().includes(currentFilters.genreFilter.toLowerCase())
            )
        );
    }
    
    // Apply sorting
    applySorting(filtered);
    
    filteredBooks = filtered;
    displayBooks();
    updateBookCount();
    saveCurrentFilters();
}

function applySorting(books) {
    const sortBy = currentFilters.sortBy || 'title';
    
    switch(sortBy) {
        case 'title':
            books.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            books.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'year':
            books.sort((a, b) => b.year - a.year);
            break;
        case 'year-desc':
            books.sort((a, b) => a.year - b.year);
            break;
    }
}

function saveCurrentFilters() {
    savePreferences(currentFilters);
    
    // Show preferences note
    const note = document.getElementById('preferences-note');
    if (note) {
        note.style.display = 'block';
    }
}

// ===== Display Functions =====
function displayBooks() {
    if (!booksContainer) return;
    
    if (filteredBooks.length === 0) {
        booksContainer.innerHTML = '<p class="no-results">No books found. Try adjusting your filters.</p>';
        return;
    }
    
    // Using map to generate HTML (array method requirement)
    const booksHTML = filteredBooks.map(book => {
        // Template literal requirement
        return `
            <article class="book-card" data-book-id="${book.id}">
                <h3>${book.title}</h3>
                <p class="book-author">By ${book.author}</p>
                <p class="book-year">Published: ${book.year}</p>
                <p class="book-subjects">${book.subjects.slice(0, 3).join(' • ')}</p>
                <span class="book-age">Ages ${book.ageGroup}</span>
            </article>
        `;
    }).join('');
    
    booksContainer.innerHTML = booksHTML;
    
    // Add click event to each book card (DOM manipulation)
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.dataset.bookId;
            const book = filteredBooks.find(b => b.id == bookId);
            if (book) {
                openBookModal(book);
            }
        });
    });
}

function updateBookCount() {
    if (bookCountSpan) {
        bookCountSpan.textContent = filteredBooks.length;
    }
}

// ===== Modal Functions =====
function openBookModal(book) {
    if (!modal || !modalBody) return;
    
    // Template literal for modal content
    modalBody.innerHTML = `
        <h2 id="modal-title">${book.title}</h2>
        <p class="modal-author"><strong>By:</strong> ${book.authorFull || book.author}</p>
        <p class="modal-year"><strong>Published:</strong> ${book.year}</p>
        <p class="modal-publisher"><strong>Publisher:</strong> ${book.publisher || 'Unknown'}</p>
        <p class="modal-isbn"><strong>ISBN:</strong> ${book.isbn || 'N/A'}</p>
        <div class="modal-subjects">
            <strong>Subjects:</strong>
            <ul>
                ${book.subjects.map(subject => `<li>${subject}</li>`).join('')}
            </ul>
        </div>
        <p class="modal-age"><strong>Recommended for ages:</strong> ${book.ageGroup}</p>
    `;
    
    modal.setAttribute('aria-hidden', 'false');
    
    // Add event listeners for closing
    const closeButtons = modal.querySelectorAll('[data-modal-close]');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close on Escape key
    document.addEventListener('keydown', handleEscapeKey);
}

function closeModal() {
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
    }
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Age filter
    if (ageFilter) {
        ageFilter.addEventListener('change', (e) => {
            currentFilters.ageFilter = e.target.value;
            applyFilters();
        });
    }
    
    // Genre filter
    if (genreFilter) {
        genreFilter.addEventListener('change', (e) => {
            currentFilters.genreFilter = e.target.value;
            applyFilters();
        });
    }
    
    // Sort filter
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            currentFilters.sortBy = e.target.value;
            applyFilters();
        });
    }
    
    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            currentFilters = {
                ageFilter: 'all',
                genreFilter: 'all',
                sortBy: 'title'
            };
            
            // Reset select elements
            if (ageFilter) ageFilter.value = 'all';
            if (genreFilter) genreFilter.value = 'all';
            if (sortFilter) sortFilter.value = 'title';
            
            applyFilters();
            showNotification('Filters reset!', 'success');
        });
    }
    
    // Clear preferences button
    if (clearPrefsBtn) {
        clearPrefsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('thumpersLibrary_preferences');
            showNotification('Saved preferences cleared!', 'info');
        });
    }
    
    // Initialize filter values from saved preferences
    if (ageFilter) ageFilter.value = currentFilters.ageFilter || 'all';
    if (genreFilter) genreFilter.value = currentFilters.genreFilter || 'all';
    if (sortFilter) sortFilter.value = currentFilters.sortBy || 'title';
}

// ===== Initialize Page =====
function init() {
    if (!booksContainer) return;
    
    setupEventListeners();
    fetchBooks();
    
    // Hide preferences note initially if no preferences saved
    const note = document.getElementById('preferences-note');
    if (note) {
        const savedPrefs = localStorage.getItem('thumpersLibrary_preferences');
        note.style.display = savedPrefs ? 'block' : 'none';
    }
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);