// Функция для создания кнопки проекта с кнопкой удаления
function addProjectButton(id, name) {
    const projectItem = document.createElement('div'); // Контейнер для проекта

    // Кнопка для перехода на проект
    const projectButton = document.createElement('button');
    projectButton.textContent = name;
    projectButton.onclick = function() {
        window.location.href = `/projects/${id}`;  // Переход на страницу проекта
    };

    // Добавляем кнопку проекта в контейнер
    projectItem.appendChild(projectButton);

    // Добавляем проект на страницу
    document.getElementById('project-list').appendChild(projectItem);
}

// Подгрузка всех проектов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    fetch("/get_projects/")
    .then(response => response.json())
    .then(data => {
        data.projects.forEach(project => {
            addProjectButton(project.id, project.name);
        });
    })
    .catch(error => {
        console.error('Error fetching projects:', error);
    });
});

// Показываем/скрываем форму для создания проекта
document.getElementById('add-project-button').addEventListener('click', function() {
    const projectForm = document.getElementById('project-form');
    projectForm.style.display = projectForm.style.display === 'none' ? 'block' : 'none';
});

// Обработка отправки формы для создания проекта
document.getElementById('submit-project').addEventListener('click', function(event) {
    event.preventDefault();

    const name = document.getElementById('project-name').value;
    const tgToken = document.getElementById('tg-token').value;

    // Проверяем, что оба поля заполнены
    if (name && tgToken) {
        fetch("/create_project/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({
                name: name,
                tg_token: tgToken
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                addProjectButton(data.id, data.name);  // Добавляем новую кнопку проекта
                document.getElementById('project-form').style.display = 'none';  // Скрываем форму
                document.getElementById('project-name').value = '';  // Очищаем поля
                document.getElementById('tg-token').value = '';
            } else {
                // Выводим сообщение об ошибке
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Ошибка при создании проекта:', error);
        });
    } else {
        alert('Пожалуйста, заполните оба поля.');
    }
});
