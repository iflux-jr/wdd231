// Current year for copyright
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Last modified date
const lastModifiedSpan = document.getElementById('lastModified');
lastModifiedSpan.textContent = formatDate(document.lastModified);

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(',', '');
}

// Current year for copyright
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Last modified date
const lastModifiedSpan = document.getElementById('lastModified');
if (lastModifiedSpan) {
    lastModifiedSpan.textContent = formatDate(document.lastModified);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(',', '');
}