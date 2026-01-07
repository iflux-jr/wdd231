const hamburgerBtn = document.getElementById('hamburgerBtn');
const primaryNav = document.getElementById('primaryNav');

hamburgerBtn.addEventListener('click', () => {
    primaryNav.classList.toggle('show');
    hamburgerBtn.innerHTML = primaryNav.classList.contains('show') ? '✕' : '☰';
});

// Close menu when clicking on a link
document.querySelectorAll('.navigation a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            primaryNav.classList.remove('show');
            hamburgerBtn.innerHTML = '☰';
        }
    });
});

// Close menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        primaryNav.classList.remove('show');
        hamburgerBtn.innerHTML = '☰';
    }
});