document.addEventListener("DOMContentLoaded", () => {
    const categoryForm = document.getElementById('add-category-form');
    const categoryList = document.getElementById('category-list');
    const parentSelect = document.getElementById('parent');

    // Поля для редактирования
    const editButtonName = document.getElementById('edit-button-name');
    const editMessage = document.getElementById('edit-message');
    const editCategoryId = document.getElementById('edit-category-id');
    const saveCategoryBtn = document.getElementById('save-category-btn');

    // Загрузка категорий при инициализации страницы
    async function loadCategories() {
        const projectInfo = document.getElementById('project-info');
        const projectId = projectInfo.getAttribute('data-project-id');

        try {
            const response = await fetch(`/projects/${projectId}/get_category/`);
            const data = await response.json();

            if (response.ok) {
                categoryList.innerHTML = '';

                // Создаем иерархию категорий
                data.categorys.forEach(category => {
                    console.log(`Category: ${category.button_name}, Has Children: ${category.children.length > 0}`); // Отладочный вывод
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
    
        if (document.getElementById(`category-${id}`)) {
            console.error(`Категория с ID ${id} уже существует.`);
            return;
        }
    
        const li = document.createElement('li');
        li.id = `category-${id}`;
    
        // Создаем элемент для разворачивания/сворачивания
        const toggleLink = document.createElement('span');
        toggleLink.textContent = children.length > 0 ? `+ ` : `- `; // Знак + или -
        toggleLink.classList.add('toggle-link'); // Добавляем класс для стилей
        toggleLink.style.cursor = 'pointer'; // Устанавливаем указатель курсора
    
        // Обработчик для сворачивания и разворачивания категорий
        toggleLink.addEventListener('click', function (event) {
            event.stopPropagation(); // Останавливаем всплытие события
            const childUl = document.getElementById(`children-${id}`);
    
            if (children.length > 0) { // Проверяем, есть ли дочерние элементы
                if (childUl) {
                    childUl.classList.toggle('hidden');
                    const isHidden = childUl.classList.contains('hidden');
                    toggleLink.textContent = isHidden ? `+ ` : `- `; // Меняем знак
                }
            }
        });
    
        // Создаем текст для категории
        const categoryName = document.createElement('span');
        categoryName.textContent = name;
        categoryName.style.cursor = 'pointer'; // Устанавливаем указатель курсора
    
        // Обработчик для клика по категории
        categoryName.addEventListener('click', function () {
            // Заполняем поля редактирования
            editButtonName.value = name;
            editMessage.value = message;
            editCategoryId.value = id;
    
            saveCategoryBtn.style.display = 'block'; // Показываем кнопку сохранения
        });
    
        // Добавляем элементы в список
        li.appendChild(toggleLink);
        li.appendChild(categoryName);
    
        // Создаем список дочерних категорий
        const childrenUl = document.createElement('ul');
        childrenUl.id = `children-${id}`;
        childrenUl.classList.add('category-children', 'hidden');
    
        // Добавляем дочерние категории, если они есть
        children.forEach(child => {
            addCategoryToList(child.id, child.button_name, id, child.message, child.children);
        });
    
        li.appendChild(childrenUl);
        categoryList.appendChild(li);
    }




    // Функция для обновления выпадающего списка родительских категорий
    function updateParentDropdown(id, name) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        parentSelect.appendChild(option);
    }

    // Показываем кнопку "Сохранить" при изменении данных в полях
    [editButtonName, editMessage].forEach(inputField => {
        inputField.addEventListener('input', () => {
            saveCategoryBtn.style.display = 'block';
        });
    });

    // Обработчик для сохранения изменений категории
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

            const resultText = await response.text();

            if (response.ok) {
                const result = JSON.parse(resultText);
                alert('Категория успешно обновлена.');

                saveCategoryBtn.style.display = 'none';

                const categoryLink = document.querySelector(`a[data-category-id='${categoryId}']`);
                if (categoryLink) {
                    categoryLink.textContent = updatedData.button_name;
                    categoryLink.dataset.message = updatedData.message;
                }
            } else {
                console.error('Ошибка при сохранении данных:', resultText);
                alert('Ошибка при сохранении категории.');
            }
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            alert('Произошла ошибка при сохранении изменений.');
        }
    });

    // Загружаем категории при загрузке страницы
    loadCategories();
});
