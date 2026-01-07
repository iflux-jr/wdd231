// Course data - modify based on your progress
const courses = [
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 3, completed: true },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 3, completed: true },
    { subject: 'WDD', number: 231, title: 'Web Frontend Development I', credits: 3, completed: false },
    { subject: 'CSE', number: 110, title: 'Programming Building Blocks', credits: 3, completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 3, completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 3, completed: true }
];

function displayCourses(filter = 'all') {
    const container = document.getElementById('coursesContainer');
    const filteredCourses = filter === 'all' 
        ? courses 
        : courses.filter(course => course.subject === filter);
    
    container.innerHTML = '';
    
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = `course-card ${course.completed ? 'completed' : 'incomplete'}`;
        card.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            <p>${course.title}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <span class="course-status">${course.completed ? '✓ Completed' : '○ In Progress'}</span>
        `;
        container.appendChild(card);
    });
    
    // Calculate total credits
    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('totalCredits').textContent = totalCredits;
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Filter and display courses
        const filter = e.target.dataset.filter;
        displayCourses(filter);
    });
});

// Initialize
displayCourses();