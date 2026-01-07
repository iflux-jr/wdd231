// Store the selcted elements that we are going to use
const navbutton = document.querySelector('#ham-btn');
const navlinks = document.querySelectorAll('#nav-bar');

// toggle the 'show' class on the navbutton when clicked
navbutton.addEventListener('click', () => {
    navbutton.classList.toggle('show');
    navlinks.classList.toggle('show');
});