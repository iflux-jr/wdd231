// Display form data from URL parameters
        document.addEventListener('DOMContentLoaded', function() {
            const params = new URLSearchParams(window.location.search);
            const formDataDiv = document.getElementById('form-data');
            
            if (params.toString()) {
                let html = '<dl>';
                for (let [key, value] of params) {
                    // Format the key name
                    let formattedKey = key.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                    
                    html += `<dt>${formattedKey}:</dt>`;
                    html += `<dd>${value || '(not provided)'}</dd>`;
                }
                html += '</dl>';
                formDataDiv.innerHTML = html;
            } else {
                formDataDiv.innerHTML = '<p>No form data received.</p>';
            }
        });