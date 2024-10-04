document.addEventListener("DOMContentLoaded", () => {
    const categoryForm = document.getElementById('add-category-form');
    const categoryList = document.getElementById('category-list');

    // Загрузка категорий при инициализации страницы
    async function loadCategories() {
        const projectInfo = document.getElementById('project-info');
        const projectId = projectInfo.getAttribute('data-project-id'); // Получаем project_id из атрибута data

        try {
            const response = await fetch(`/projects/${projectId}/get_category/`);
            const data = await response.json();

            if (response.ok) {
                categoryList.innerHTML = ''; // Очищаем список перед добавлением новых категорий

                // Создаем иерархию категорий
                data.categorys.forEach(category => {
                    addCategoryToList(category.id, category.button_name, category.parent, category.message);
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
        event.preventDefault(); // Предотвращаем стандартное поведение формы

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
                // Добавляем категорию в список
                addCategoryToList(result.category_id, data.button_name, data.parent, data.message);
                categoryForm.reset(); // Сброс формы
            } else {
                alert(result.error || 'Произошла ошибка при добавлении категории.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении категории.');
        }
    });

    // Функция для добавления категории в список
    function addCategoryToList(id, name, parentId, message) {
        const categoryList = parentId
            ? document.getElementById(`children-${parentId}`)  // Если есть родитель, ищем дочерний список
            : document.getElementById('category-list');  // Иначе добавляем на основной уровень

        if (!categoryList) {
            console.error(`Список для родителя ${parentId} не найден.`);
            return; // Если родительского списка нет, ничего не делаем
        }

        // Проверяем, нет ли уже элемента с таким ID
        if (document.getElementById(`category-${id}`)) {
            console.error(`Категория с ID ${id} уже существует.`);
            return;
        }

        // Создаем элемент категории
        const li = document.createElement('li');
        li.id = `category-${id}`;

        // Ссылка на категорию
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = name;
        link.classList.add('category-link');
        link.dataset.categoryId = id;

        // Обработчик для сворачивания и разворачивания
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const childUl = document.getElementById(`children-${id}`);
            if (childUl) {
                childUl.classList.toggle('hidden'); // Переключаем видимость
            }
        });

        li.appendChild(link);

        // Создаем дочерний ul для подкатегорий
        const childrenUl = document.createElement('ul');
        childrenUl.id = `children-${id}`;
        childrenUl.classList.add('category-children', 'hidden'); // По умолчанию подкатегории скрыты

        li.appendChild(childrenUl);
        categoryList.appendChild(li);
    }

    // Загружаем категории при загрузке страницы
    loadCategories();
});
