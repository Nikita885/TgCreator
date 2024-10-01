document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-category-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const buttonName = document.getElementById('button_name').value;
        const parentId = document.getElementById('parent').value;

        const data = {
            button_name: buttonName,
            parent: parentId ? parentId : null
        };

        fetch(form.action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.success);
                
                const newOption = document.createElement('option');
                newOption.value = data.category_id;
                newOption.textContent = buttonName;
                document.getElementById('parent').appendChild(newOption);

                const newCategory = document.createElement('li');
                newCategory.id = `category-${data.category_id}`;

                const categoryLink = document.createElement('a');
                categoryLink.href = '#';
                categoryLink.className = 'category-link';
                categoryLink.textContent = buttonName;
                categoryLink.onclick = function () {
                    toggleActions(data.category_id);
                };

                newCategory.appendChild(categoryLink);

                const actionDiv = document.createElement('div');
                actionDiv.className = 'category-actions';
                actionDiv.id = `actions-${data.category_id}`;
                actionDiv.style.display = 'none';

                const editButton = document.createElement('button');
                editButton.textContent = 'Редактировать';
                editButton.onclick = function () {
                    editCategory(data.category_id);
                };

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                deleteButton.onclick = function () {
                    deleteCategory(data.category_id);
                };

                actionDiv.appendChild(editButton);
                actionDiv.appendChild(deleteButton);
                newCategory.appendChild(actionDiv);

                const categoryList = document.getElementById('category-list');
                if (!parentId) {
                    categoryList.appendChild(newCategory);
                } else {
                    let parentElement = document.getElementById(`category-${parentId}`);
                    let childList = parentElement.querySelector('ul');
                    if (!childList) {
                        childList = document.createElement('ul');
                        parentElement.appendChild(childList);
                    }
                    childList.appendChild(newCategory);
                }

                form.reset();
            } else {
                alert(`Error: ${data.error}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка. Попробуйте еще раз.');
        });
    });

    // Toggle visibility of the action menu
    window.toggleActions = function (categoryId) {
        const actionsDiv = document.getElementById(`actions-${categoryId}`);
        if (actionsDiv.style.display === 'none') {
            actionsDiv.style.display = 'block';
        } else {
            actionsDiv.style.display = 'none';
        }
    };

    window.editCategory = function (categoryId) {
        const newName = prompt("Введите новое имя категории:");
        if (newName) {
            document.querySelector(`#category-${categoryId} .category-link`).textContent = newName;
        }
    };

    window.deleteCategory = function (categoryId) {
        if (confirm("Вы уверены, что хотите удалить эту категорию?")) {
            document.getElementById(`category-${categoryId}`).remove();
        }
    };

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
