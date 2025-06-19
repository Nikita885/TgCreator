function getCSRFToken() {
    const csrfCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : '';
}

function addProjectButton(id, name, condition, tg_token) {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';

    const toggleSwitch = document.createElement('label');
    toggleSwitch.className = 'toggle-switch';

    const linkButton = document.createElement('img');
    linkButton.className = 'link_button';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'toggle-bot';
    input.dataset.projectId = id;
    if (condition) input.checked = true;

    input.addEventListener('change', async () => {
        const projectId = input.dataset.projectId;
        const condition = input.checked;

        try {
            const response = await fetch(`/projects/${projectId}/toggle_bot/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ condition })
            });

            if (!response.ok) {
                console.error('Ошибка на сервере при переключении:', await response.text());
            } else {
                console.log('Бот проекта');
            }
        } catch (error) {
            console.error('Сетевой сбой или ошибка запроса:', error);
        }
    });

    const slider = document.createElement('span');
    slider.className = 'slider';

    toggleSwitch.appendChild(input);
    toggleSwitch.appendChild(slider);

    // --- 🔗 Обработчик для перехода к Telegram-боту ---
    linkButton.addEventListener('click', async () => {
        if (!tg_token) {
            alert("TG токен отсутствует");
            return;
        }

        try {
            const response = await fetch(`https://api.telegram.org/bot${tg_token}/getMe`);
            const data = await response.json();

            if (data.ok && data.result.username) {
                const username = data.result.username;
                window.open(`https://t.me/${username}`, '_blank');
            } else {
                alert("Ошибка: токен недействителен или бот не найден.");
            }
        } catch (err) {
            alert("Ошибка запроса к Telegram API");
            console.error(err);
        }
    });

    // Кнопка перехода на страницу проекта
    const projectButton = document.createElement('button');
    projectButton.textContent = name.length > 10 ? name.slice(0, 10) + '...' : name;
    projectButton.onclick = function() {
        window.location.href = `/projects/${id}`;
    };
    projectButton.className = 'button';

    projectItem.appendChild(toggleSwitch);
    projectItem.appendChild(projectButton);
    projectItem.appendChild(linkButton);

    document.getElementById('project-list').appendChild(projectItem);
}



// Подгрузка всех проектов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    fetch("/get_projects/")
    .then(response => response.json())
    .then(data => {
        data.projects.forEach(project => {
            console.log(project);
            
            addProjectButton(project.id, project.name, project.condition, project.tg_token);
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
                console.log(data);
                
                addProjectButton(data.id, data.name, data.condition, data.tg_token);  // Добавляем новую кнопку проекта
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

document.addEventListener('click', function(event) {
    const projectForm = document.getElementById('project-form');
    const addProjectSvg = document.getElementById('add-project-svg');
    const plusIcon = document.querySelector('.plus-icon');
    const minusIcon = document.querySelector('.minus-icon');

    
    if (!addProjectSvg.contains(event.target) && !projectForm.contains(event.target)) {
        projectForm.style.display = 'none';
        plusIcon.style.display = 'block'; 
        minusIcon.style.display = 'none';
        isFormVisible = false;
    }
});


