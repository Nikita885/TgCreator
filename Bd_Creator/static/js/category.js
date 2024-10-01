document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-category-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        const buttonName = document.getElementById('button_name').value; // Получаем имя категории
        const parentId = document.getElementById('parent').value; // Получаем родителя
        const message = document.getElementById('message').value; // Получаем сообщение

        const data = {
            button_name: buttonName,
            parent: parentId ? parentId : null,  // Отправляем null, если родитель не выбран
            message: message // Добавляем сообщение
        };

        fetch(form.action, {
            method: 'POST',
            body: JSON.stringify(data),  // Преобразуем в JSON строку
            headers: {
                'Content-Type': 'application/json',  // Устанавливаем тип контента
                'X-CSRFToken': getCookie('csrftoken') // Включаем CSRF токен
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
                alert(data.success); // Отображаем сообщение об успешном добавлении

                // Обновляем список категорий
                addCategoryToList(data.category_id, buttonName, message, parentId);
                form.reset(); // Очищаем форму
            } else {
                alert(`Error: ${data.error}`); // Отображаем сообщение об ошибке
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.');
        });
    });

    function addCategoryToList(categoryId, buttonName, message, parentId) {
        const newCategory = document.createElement('li');
        newCategory.id = `category-${categoryId}`;
        newCategory.innerHTML = `
            <a href="#" class="category-link">${buttonName}</a>
            <div class="category-actions" style="display: none;">
                <button onclick="editCategory(${categoryId}, 'name')">Редактировать имя</button>
                <button onclick="editCategory(${categoryId}, 'message')">Редактировать сообщение</button>
                <button onclick="deleteCategory(${categoryId})">Удалить</button>
            </div>
            <div class="category-message">${message}</div>
        `;

        if (parentId) {
            let parentElement = document.getElementById(`category-${parentId}`);
            let childList = parentElement.querySelector('ul');
            if (!childList) {
                childList = document.createElement('ul');
                parentElement.appendChild(childList);
            }
            childList.appendChild(newCategory);
        } else {
            const categoryList = document.getElementById('category-list');
            const parentUl = document.createElement('ul');
            newCategory.appendChild(parentUl);
            categoryList.appendChild(newCategory);
        }
    }

    window.editCategory = function (categoryId, field) {
        const newValue = prompt(`Введите новое значение для ${field === 'name' ? 'имени' : 'сообщения'}`);
        const projectId = document.getElementById('project-id').value;  // Получаем ID проекта

        if (newValue) {
            fetch(`/projects/${projectId}/edit_category`, {
                method: 'PUT',
                body: JSON.stringify({
                    category_id: categoryId,
                    [field]: newValue
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
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
                    alert(data.success);
                    if (field === 'name') {
                        document.querySelector(`#category-${categoryId} .category-link`).textContent = newValue;
                    } else {
                        document.querySelector(`#category-${categoryId} .category-message`).textContent = newValue;
                    }
                } else {
                    alert(`Error: ${data.error}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.');
            });
        }
    }

    window.deleteCategory = function (categoryId) {
        const projectId = document.getElementById('project-id').value;  // Получаем ID проекта

        if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
            fetch(`/projects/${projectId}/delete_category`, {
                method: 'DELETE',
                body: JSON.stringify({
                    category_id: categoryId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
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
                    alert(data.success);
                    const categoryElement = document.getElementById(`category-${categoryId}`);
                    categoryElement.remove();  // Удаляем элемент из DOM
                } else {
                    alert(`Error: ${data.error}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.');
            });
        }
    }
    function toggleActions(categoryId) {
        const actionsDiv = document.getElementById(`actions-${categoryId}`);
        if (actionsDiv) {
            if (actionsDiv.style.display === 'none' || actionsDiv.style.display === '') {
                actionsDiv.style.display = 'block';
            } else {
                actionsDiv.style.display = 'none';
            }
        } else {
            console.error(`Element with ID actions-${categoryId} not found`);
        }
    }
    
    
    
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', toggleActions);
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
