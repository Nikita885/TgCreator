document.addEventListener("DOMContentLoaded", () => {
    const categoryForm = document.getElementById('add-category-form');
    const categoryList = document.getElementById('category-list');
    const parentSelect = document.getElementById('parent');
    const toggleBotBtn = document.getElementById('toggle-bot-btn');

    // Получаем ID проекта
    const projectInfo = document.getElementById('project-info');
    const projectId = projectInfo.getAttribute('data-project-id');

    // Установка начального текста кнопки на основе атрибута data-bot-active
    toggleBotBtn.textContent = toggleBotBtn.getAttribute('data-bot-active');

    // Обработчик для переключения текста кнопки и изменения состояния
    toggleBotBtn.addEventListener('click', async () => {
        const isBotActive = toggleBotBtn.textContent === 'Выключить бот';

        // Отправляем запрос на сервер для обновления состояния
        try {
            const response = await fetch(`/projects/${projectId}/edit_project/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ condition: !isBotActive }), // Меняем состояние
            });

            const result = await response.json();
            if (response.ok) {
                // Меняем текст кнопки
                toggleBotBtn.textContent = isBotActive ? 'Включить бот' : 'Выключить бот';
            } else {
                alert(result.error || 'Произошла ошибка при изменении состояния.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при изменении состояния.');
        }
    });

    // Загрузка категорий при инициализации страницы
    async function loadCategories() {
        const projectInfo = document.getElementById('project-info');
        const projectId = projectInfo.getAttribute('data-project-id');

        try {
            const response = await fetch(`/projects/${projectId}/get_category/`);
            const data = await response.json();

            if (response.ok) {
                categoryList.innerHTML = '';
                data.categorys.forEach(category => {
                    addCategoryToList(category.id, category.button_name, category.parent, category.message, category.children);
                });
            } else {
                console.error('Ошибка при загрузке категорий:', data.error);
            }
        } catch (error) {
            console.error('Ошибка при запросе категорий:', error);
        }
    }



    // Загрузка категорий при инициализации страницы
    async function loadCategories() {
        const projectInfo = document.getElementById('project-info');
        const projectId = projectInfo.getAttribute('data-project-id');

        try {
            const response = await fetch(`/projects/${projectId}/get_category/`);
            const data = await response.json();

            if (response.ok) {
                categoryList.innerHTML = '';
                data.categorys.forEach(category => {
                    addCategoryToList(category.id, category.button_name, category.parent, category.message, category.children);
                });
            } else {
                console.error('Ошибка при загрузке категорий:', data.error);
            }
        } catch (error) {
            console.error('Ошибка при запросе категорий:', error);
        }
    }

    // Обработчик отправки формы
    categoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(categoryForm);
        const data = {
            button_name: formData.get('button_name'),
            parent: formData.get('parent') || null,
            message: formData.get('message'),
        };

        try {
            const response = await fetch(categoryForm.action, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                addCategoryToList(result.category_id, data.button_name, data.parent, data.message, result.children || []);
                updateParentDropdown(result.category_id, data.button_name);
                categoryForm.reset();
            } else {
                alert(result.error || 'Произошла ошибка при добавлении категории.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении категории.');
        }
    });

    // Функция для добавления категории в список
    function addCategoryToList(id, name, parentId, message, children) {
        const categoryList = parentId
            ? document.getElementById(`children-${parentId}`)
            : document.getElementById('category-list');
    
        if (!categoryList) {
            console.error(`Список для родителя ${parentId} не найден.`);
            return;
        }
    
        const existingCategory = document.getElementById(`category-${id}`);
        if (existingCategory) {
            existingCategory.querySelector('.category-link').textContent = name;
            existingCategory.querySelector('.category-link').dataset.categoryMessage = message; // обновляем данные
            return;
        }
    
        const li = document.createElement('li');
        li.id = `category-${id}`;
    
        const toggleLink = document.createElement('span');
        toggleLink.textContent = children.length > 0 ? `▶ ` : ``;
        toggleLink.classList.add('toggle-link');
        toggleLink.style.cursor = 'pointer';
    
        toggleLink.addEventListener('click', function (event) {
            event.stopPropagation();
            const childUl = document.getElementById(`children-${id}`);
    
            if (childUl) {
                childUl.classList.toggle('hidden');
                const isHidden = childUl.classList.contains('hidden');
                toggleLink.textContent = isHidden ? `▶ ` : `▼ `;
            }
        });
    
        const categoryName = document.createElement('span');
        categoryName.textContent = name;
        categoryName.classList.add('category-link');
        categoryName.dataset.categoryId = id;
        categoryName.dataset.categoryMessage = message; // сохраняем сообщение для динамического обновления
        categoryName.style.cursor = 'pointer';
    
        categoryName.addEventListener('click', function () {
            editButtonName.value = categoryName.textContent;
            editMessage.value = categoryName.dataset.categoryMessage;
            editCategoryId.value = id;
            parentSelect.value = id;
            saveCategoryBtn.style.display = 'block';
            deleteCategoryBtn.style.display = 'block';
        });
    
        li.appendChild(toggleLink);
        li.appendChild(categoryName);
    
        const childrenUl = document.createElement('ul');
        childrenUl.id = `children-${id}`;
        childrenUl.classList.add('category-children', 'hidden');
        li.appendChild(childrenUl);
    
        categoryList.appendChild(li);
    
        if (parentId) {
            const parentToggleLink = document.querySelector(`#category-${parentId} .toggle-link`);
            if (parentToggleLink) {
                parentToggleLink.textContent = `▶ `;
            }
        }
    }
    
    // Функция для обновления выпадающего списка родительских категорий
    function updateParentDropdown(id, name) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        parentSelect.appendChild(option);
    }

    // Удаление категории и дочерних элементов
    async function deleteCategory() {
        const categoryId = editCategoryId.value;

        try {
            const response = await fetch(`/categories/${categoryId}/delete_category_with_children/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok && result.success) {
                removeCategoryAndChildrenFromDOM(categoryId);
                removeCategoryFromDropdown(categoryId);

                // Очистка полей и скрытие кнопок
                editButtonName.value = '';
                editMessage.value = '';
                editCategoryId.value = '';
                saveCategoryBtn.style.display = 'none';
                deleteCategoryBtn.style.display = 'none';

                alert(result.message || 'Категория успешно удалена.');
            } else {
                alert(result.message || 'Ошибка при удалении категории.');
            }
        } catch (error) {
            console.error('Ошибка при удалении категории:', error);
            alert('Произошла ошибка при удалении категории.');
        }
    }

    // Удаление категории и всех дочерних элементов из DOM
    function removeCategoryAndChildrenFromDOM(categoryId) {
        const categoryElement = document.getElementById(`category-${categoryId}`);
        if (categoryElement) {
            const childCategories = categoryElement.querySelectorAll('li[id^="category-"]');
            childCategories.forEach(child => {
                const childId = child.id.replace('category-', '');
                removeCategoryFromDropdown(childId); 
                child.remove();
            });
            
            removeCategoryFromDropdown(categoryId);
            categoryElement.remove();
        }
    }

    // Функция для удаления категории из выпадающего списка
    function removeCategoryFromDropdown(categoryId) {
        const optionToRemove = parentSelect.querySelector(`option[value="${categoryId}"]`);
        if (optionToRemove) {
            optionToRemove.remove();
        }
    }

    deleteCategoryBtn.addEventListener('click', deleteCategory);

    saveCategoryBtn.addEventListener('click', async () => {
        const categoryId = editCategoryId.value;
        const updatedData = {
            button_name: editButtonName.value,
            message: editMessage.value,
        };

        try {
            const response = await fetch(`/categories/${categoryId}/edit/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const parentOption = parentSelect.querySelector(`option[value='${categoryId}']`);
                if (parentOption) {
                    parentOption.textContent = updatedData.button_name;
                }
                const categoryLink = document.querySelector(`#category-${categoryId} .category-link`);
                if (categoryLink) {
                    categoryLink.textContent = updatedData.button_name;
                    categoryLink.dataset.categoryMessage = updatedData.message;
                }
                saveCategoryBtn.style.display = 'none';
                deleteCategoryBtn.style.display = 'none';
            } else {
                alert('Ошибка при сохранении категории.');
            }
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            alert('Произошла ошибка при сохранении изменений.');
        }
    });

    loadCategories();
});
