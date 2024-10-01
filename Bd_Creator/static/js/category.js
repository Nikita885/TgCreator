document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-category-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const buttonName = document.getElementById('button_name').value; // Get button_name from input
        const parentId = document.getElementById('parent').value; // Get parent from select

        const data = {
            button_name: buttonName,
            parent: parentId ? parentId : null  // Send null if parentId is an empty string
        };

        console.log("Data to be sent:", JSON.stringify(data)); // Отладка перед отправкой

        fetch(form.action, {
            method: 'POST',
            body: JSON.stringify(data),  // Convert to JSON string
            headers: {
                'Content-Type': 'application/json',  // Set content type to JSON
                'X-CSRFToken': getCookie('csrftoken') // Include the CSRF token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(data.success); // Show success message
                const newOption = document.createElement('option');
                newOption.value = data.category_id;
                newOption.textContent = buttonName;
                document.getElementById('parent').appendChild(newOption);
                form.reset(); // Clear the form
            } else {
                alert(`Error: ${data.error}`); // Show error message
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        });
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
