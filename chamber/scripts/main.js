// Toggle mobile navigation menu
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

menuToggle.addEventListener('click', () => {
    primaryNav.classList.toggle('show');
    menuToggle.textContent = primaryNav.classList.contains('show') ? '✕' : '☰';
});

// Close menu when clicking on a link
document.querySelectorAll('.navigation a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            primaryNav.classList.remove('show');
            menuToggle.textContent = '☰';
        }
    });
});

// Close menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        primaryNav.classList.remove('show');
        menuToggle.textContent = '☰';
    }
});