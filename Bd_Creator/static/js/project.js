function addProjectButton(id, name) {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item'; // Контейнер для кнопки и переключателя

    const toggleSwitch = document.createElement('label');
    toggleSwitch.className = 'toggle-switch';
    toggleSwitch.innerHTML = `
        <input type="checkbox">
        <span class="slider"></span>
    `;

    // Кнопка для перехода на проект
    const projectButton = document.createElement('button');
    projectButton.textContent = name.length > 10 ? name.slice(0, 10) + '...' : name;
    projectButton.onclick = function() {
        window.location.href = `/projects/${id}`;
    };
    projectButton.className = 'button';

    projectItem.appendChild(toggleSwitch); // Добавляем переключатель
    projectItem.appendChild(projectButton); // Добавляем кнопку проекта

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


let isFormVisible = false;

document.getElementById('add-project-svg').addEventListener('click', function() {
    const projectForm = document.getElementById('project-form');
    const plusIcon = document.querySelector('.plus-icon');
    const minusIcon = document.querySelector('.minus-icon');

    // Меняем состояние видимости формы
    if (isFormVisible) {
        projectForm.style.display = 'none';
        plusIcon.style.display = 'block';  // Показываем иконку плюса
        minusIcon.style.display = 'none';  // Скрываем иконку минуса
    } else {
        projectForm.style.display = 'block';
        plusIcon.style.display = 'none';  // Скрываем иконку плюса
        minusIcon.style.display = 'block';  // Показываем иконку минуса
    }

    // Инвертируем состояние
    isFormVisible = !isFormVisible;
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

