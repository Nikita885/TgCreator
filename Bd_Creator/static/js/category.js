document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-category-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        const buttonName = document.getElementById('button_name').value; // Получаем значение button_name
        const parentId = document.getElementById('parent').value; // Получаем значение родительской категории

        const data = {
            button_name: buttonName,
            parent: parentId ? parentId : null  // Отправляем null, если parentId пуст
        };

        console.log("Данные для отправки:", JSON.stringify(data)); // Отладка перед отправкой

        fetch(form.action, {
            method: 'POST',
            body: JSON.stringify(data),  // Преобразуем объект в JSON-строку
            headers: {
                'Content-Type': 'application/json',  // Устанавливаем заголовок Content-Type на JSON

            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || 'Ошибка сети');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(data.success); // Показываем сообщение об успехе
                const newOption = document.createElement('option');
                newOption.value = data.category_id;
                newOption.textContent = buttonName;
                document.getElementById('parent').appendChild(newOption);
                form.reset(); // Очищаем форму
            } else {
                alert(`Ошибка: ${data.error}`); // Показываем сообщение об ошибке
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.');
        });
    });


});
