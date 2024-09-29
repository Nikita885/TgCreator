fetch(`/projects/${project_id}/add_category/`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken // убедитесь, что csrf токен передается корректно
    },
    credentials: 'include',
    body: JSON.stringify({
        button_name: 'Название категории', // Это поле должно быть заполнено
        parent: null, // Или ID родительской категории, если она есть
        message: 'Сообщение для категории' // Это поле тоже должно быть заполнено
    })
})
.then(response => {
    if (!response.ok) {
        return response.json().then(err => {
            throw new Error(JSON.stringify(err));
        });
    }
    return response.json();
})
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});
