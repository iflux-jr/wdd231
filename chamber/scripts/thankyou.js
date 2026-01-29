document.addEventListener('DOMContentLoaded', function() {
    displayApplicationData();
});

function displayApplicationData() {
    const applicationData = JSON.parse(localStorage.getItem('chamberApplication'));
    const container = document.getElementById('applicationData');
    
    if (!applicationData) {
        container.innerHTML = '<p>No application data found. Please submit the form first.</p>';
        return;
    }
    
    // Format membership level for display
    const membershipLevels = {
        'np': 'NP Membership (Non-Profit)',
        'bronze': 'Bronze Membership',
        'silver': 'Silver Membership',
        'gold': 'Gold Membership'
    };
    
    // Format timestamp for display
    const timestamp = new Date(applicationData.timestamp);
    const formattedDate = timestamp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Create display HTML
    container.innerHTML = `
        <div class="data-item">
            <strong>Name:</strong> ${applicationData.firstName} ${applicationData.lastName}
        </div>
        <div class="data-item">
            <strong>Email:</strong> ${applicationData.email}
        </div>
        <div class="data-item">
            <strong>Phone:</strong> ${applicationData.phone}
        </div>
        <div class="data-item">
            <strong>Business:</strong> ${applicationData.businessName}
        </div>
        <div class="data-item">
            <strong>Membership Level:</strong> ${membershipLevels[applicationData.membershipLevel]}
        </div>
        <div class="data-item">
            <strong>Application Submitted:</strong> ${formattedDate}
        </div>
    `;
    
    // Clear localStorage after displaying
    localStorage.removeItem('chamberApplication');
}