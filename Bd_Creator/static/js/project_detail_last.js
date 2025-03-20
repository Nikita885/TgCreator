document.addEventListener('DOMContentLoaded', () => {
    const resizableLeft = document.getElementById('resizable'); // Левое крыло
    const resizableRight = document.querySelector('.right_wing'); // Правое крыло
    
    let isResizingLeft = false;
    let isResizingRight = false;
    let startX = 0;
    let startWidthLeft = 0;
    let startWidthRight = 0;
    let offsetStartLeft = 0; // Смещение для левого крыла
    let offsetStartRight = 0; // Смещение для правого крыла
    const minWidth = 250; // Минимальная ширина для левого и правого крыла в пикселях
    const maxWidth = window.innerWidth / 2.02; // Максимальная ширина для левого и правого крыла - половина экрана

    // Обработчик для левого крыла
    if (resizableLeft) {
        resizableLeft.addEventListener('mousemove', (e) => {
            const rect = resizableLeft.getBoundingClientRect();
            const offsetX = e.clientX - rect.right;

            // Проверка курсора в зоне правой границы
            if (Math.abs(offsetX) <= 10) {
                resizableLeft.style.cursor = 'ew-resize';
            } else {
                resizableLeft.style.cursor = 'default';
            }
        });

        resizableLeft.addEventListener('mousedown', (e) => {
            const rect = resizableLeft.getBoundingClientRect();
            const offsetX = e.clientX - rect.right;

            if (Math.abs(offsetX) <= 10) {
                isResizingLeft = true;
                startX = e.clientX; // Начальное положение мыши
                startWidthLeft = rect.width; // Начальная ширина левого крыла
                offsetStartLeft = e.clientX - rect.right; // Смещение курсора относительно правой границы

                // Добавляем события перемещения и отпускания
                document.addEventListener('mousemove', resizeLeft);
                document.addEventListener('mouseup', stopResize);
            }
        });
    }

    // Функция для изменения ширины левого элемента
    function resizeLeft(e) {
        if (isResizingLeft) {
            const delta = e.clientX - startX; // Разница между текущим и начальным положением мыши
            let newWidthLeft = startWidthLeft + delta; // Новая ширина для левого крыла

            newWidthLeft = Math.max(newWidthLeft, minWidth); // Ограничиваем минимальной шириной
            newWidthLeft = Math.min(newWidthLeft, maxWidth); // Ограничиваем максимальной шириной

            const newWidthLeftVW = (newWidthLeft / window.innerWidth) * 100;
            resizableLeft.style.width = `${newWidthLeftVW}vw`; // Применяем новую ширину
        }
    }

    // Функция для остановки изменения ширины
    function stopResize() {
        isResizingLeft = false;
        isResizingRight = false;

        // Удаляем события перемещения и отпускания
        document.removeEventListener('mousemove', resizeLeft);
        document.removeEventListener('mousemove', resizeRight);
        document.removeEventListener('mouseup', stopResize);
    }

    // Обработчик для правого крыла
    if (resizableRight) {
        resizableRight.addEventListener('mousemove', (e) => {
            const rect = resizableRight.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;

            // Проверка курсора в зоне левой границы
            if (Math.abs(offsetX) <= 10) {
                resizableRight.style.cursor = 'ew-resize';
            } else {
                resizableRight.style.cursor = 'default';
            }
        });

        resizableRight.addEventListener('mousedown', (e) => {
            const rect = resizableRight.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;

            if (Math.abs(offsetX) <= 10) {
                isResizingRight = true;
                startX = e.clientX; // Начальное положение мыши
                startWidthRight = rect.width; // Начальная ширина правого крыла
                offsetStartRight = e.clientX - rect.left; // Смещение курсора относительно левой границы

                // Добавляем события перемещения и отпускания
                document.addEventListener('mousemove', resizeRight);
                document.addEventListener('mouseup', stopResize);
            }
        });
    }

    // Функция для изменения ширины правого элемента
    function resizeRight(e) {
        if (isResizingRight) {
            const delta = e.clientX - startX; // Разница между текущим и начальным положением мыши
            let newWidthRight = startWidthRight - delta + offsetStartRight; // Правильное вычисление ширины для правого крыла

            newWidthRight = Math.max(newWidthRight, minWidth); // Ограничиваем минимальной шириной
            newWidthRight = Math.min(newWidthRight, maxWidth); // Ограничиваем максимальной шириной

            const newWidthRightVW = (newWidthRight / window.innerWidth) * 100;
            resizableRight.style.width = `${newWidthRightVW}vw`; // Применяем новую ширину
        }
    }

    // Функция для выделения элемента
    function selectItem(element) {
        if (element.classList.contains("selected")) {
            return;
        }

        const menuItems = document.querySelectorAll(".left_menu_block_1, .left_menu_block_2");
        menuItems.forEach(item => item.classList.remove("selected"));
        element.classList.add("selected");

        const allLayers = document.querySelectorAll(".left_pop-up_menu_layers, .left_pop-up_menu_add_element");
        allLayers.forEach(layer => layer.classList.remove("selectes_pop-up"));

        if (element.classList.contains("left_menu_block_1")) {
            const menuItemsLayers = document.querySelectorAll(".left_pop-up_menu_layers");
            menuItemsLayers.forEach(layer => layer.classList.add("selectes_pop-up"));
        } else {
            const menuItemsLayers = document.querySelectorAll(".left_pop-up_menu_add_element");
            menuItemsLayers.forEach(layer => layer.classList.add("selectes_pop-up"));
        }
    }
    window.selectItem = selectItem;

    function СloseBack(element) {
        const backElement = document.querySelector('.add_element_menu_bac');
        const menuElement = document.querySelector('.add_element_menu');
    
        if (backElement && menuElement) {
            backElement.style.display = 'none';
            menuElement.style.display = 'none';
        }
    }
    
    window.СloseBack = СloseBack;

    function OpenMenu(element) {
        const backElement = document.querySelector('.add_element_menu_bac');
        const menuElement = document.querySelector('.add_element_menu');
        const inputElement = document.querySelector('.add_element_menu_input');
    
        if (backElement && menuElement) {
            backElement.style.display = 'flex';
            menuElement.style.display = 'flex';
        }
        if (inputElement) {
            inputElement.value = ''; 
        }
    }
    
    window.OpenMenu = OpenMenu;

    // Функция для загрузки категорий
    async function loadCategories() {
        const projectInfo = document.getElementById('project-info');
        const projectId = projectInfo.getAttribute('data-project-id');
        try {
            const response = await fetch(`/projects/${projectId}/get_category/`);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки категорий: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Загруженные категории:', data.categorys);
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    }

    loadCategories();



});

document.addEventListener("DOMContentLoaded", async () => {
    const projectInfo = document.getElementById('project-info');
    const projectId = projectInfo.getAttribute('data-project-id');
    const addElementMenuButton = document.querySelector(".add_element_menu_button");
    const buttonNameInput = document.querySelector(".add_element_menu_input");
    const layersContainer = document.querySelector(".left_pop-up_menu_layers");
    const SceneContainer = document.querySelector(".scene");
    const sendCategoriesButton = document.getElementById("send-categories-btn"); // Кнопка для отправки категорий
    const buttonNameInputRight = document.querySelector('.right_settings_button_name_input');
    const buttonTextInputRight = document.querySelector('.right_settings_button_text_input');
    window.categories = {};
    
    let isDataSaved = true;
    let isInputEmpty = false;
    var infoButton = document.querySelector('.information_button');

    window.addEventListener("beforeunload", (event) => {
        if (!isDataSaved) {
            event.preventDefault();
            event.returnValue = "";
        }
    });

    async function loadCategories() {
        try {
            const response = await fetch(`/projects/${projectId}/get_category/`);
            const data = await response.json();
    
            categories = data.categorys.reduce((acc, cat) => {
                acc[cat.id] = { ...cat, change: false, created: false};
                return acc;
            }, {});
    
            renderCategories();
        } catch (error) {
            console.error("Ошибка загрузки категорий:", error);
        }
    }


    function renderCategories() {
        layersContainer.innerHTML = "";
        SceneContainer.innerHTML = "";
        for (const id in categories) {
            const category = categories[id];
            addToLayers(category.button_name, category.id);
            addToScene(category)
        }

        for (const id in categories) {
            const category = categories[id];
            const element = document.getElementById(category.id + 'element');
            if (element) {
                element.style.backgroundColor = category.color || "#ffffff";
            }
        }
    }
    
    function addToLayers(buttonName, buttonID) {
        const layerElement = document.createElement("button");
        layerElement.onclick = () => ListItems(buttonID); // Используем стрелочную функцию
        layerElement.className = "add_element";
        layerElement.id = buttonID;
        layerElement.innerHTML = `
            <div class="add_element_name">${buttonName}</div>
        `;
        layersContainer.appendChild(layerElement);
    }

    function addToScene(category) {
        const layerElement = document.createElement("div");
        layerElement.onmousedown = () => ListItems(layerElement.id.match(/\d+/)[0]);
        layerElement.className = "element_to_scene";
        layerElement.id = category.id +'element';
        
        layerElement.style.left = category.conditionX;
        layerElement.style.top = category.conditionY;
        layerElement.style.backgroundColor = category.color || "#ffffff"; // Цвет по умолчанию
        
        layerElement.onclick = () => selectElement(category.id);
        layerElement.innerHTML = `
            <div class="element_name_to_scene_container">
                <div class="element_to_scene_label_title">Название</div>
                <div class="element_name_to_scene">${category.button_name}</div>
            </div>
            <buttom class="add_connection_button"> </button>
        `;
    
        SceneContainer.appendChild(layerElement);
        
    }


    
    function ListItems(data) {
        
        for (const id in categories) {
            const category = categories[id];
            if (category['id'] == data){
                buttonNameInputRight.value = category['button_name'];
                buttonNameInputRight.id = data;
                buttonTextInputRight.value = category['message'];
                

                buttonTextInputRight.id = data;
                infoButton.style.display = 'block';
                buttonTextInputRight.style.height = 'auto';
                buttonTextInputRight.style.height = (buttonTextInputRight.scrollHeight) + 'px';

            }
        }
    }
    window.ListItems = ListItems;

    

    buttonNameInputRight.addEventListener('input', (event) => {
        for (const id in categories) {
            const category = categories[id];
            if (category['id'] == buttonNameInputRight.id) {
                categories[buttonNameInputRight.id]['button_name'] = event.target.value;
                categories[buttonNameInputRight.id]['change'] = true;

                

                const add_element = document.getElementById(buttonNameInputRight.id);
                add_element.querySelector('div').innerHTML = category['button_name'];

                const add_element_to_scene = document.getElementById(buttonNameInputRight.id + 'element');
                add_element_to_scene.querySelector('.element_name_to_scene').textContent = category['button_name'];

                isDataSaved = false;

            }
        }
        if (event.target.value.trim() !== '') {
            isInputEmpty = false; 
        } else {
            isInputEmpty = true;
        }
    });

    buttonTextInputRight.addEventListener('input', (event) => {
        for (const id in categories) {
            const category = categories[id];
            if (category['id'] == buttonTextInputRight.id) {
                categories[buttonTextInputRight.id]['message'] = event.target.value;
                categories[buttonTextInputRight.id]['change'] = true;
                event.target.style.height = 'auto';
                event.target.style.height = (event.target.scrollHeight) + 'px';
                
                isDataSaved = false;
                console.log(categories);
            }
        }
    });

    let isClickInside = false;

    document.addEventListener('mousedown', function (event) {
        // Проверяем, где произошло начальное нажатие
        if (event.target.closest('#category-list') || event.target.closest('.right_wing')) {
            isClickInside = true;
        } else {
            isClickInside = false;
        }
    });
    
    document.addEventListener('mouseup', function (event) {
        // Если начальное нажатие было вне нужных областей, проверяем отпускание
        if (!isClickInside && !event.target.closest('#category-list') && !event.target.closest('.right_wing') && infoButton.style.display !== 'none' && !event.target.closest('.element_to_scene')) {
            // Если отпускание произошло вне элементов с id 'category-list' и классом 'right_wing', и infoButton видим, скрываем infoButton
            infoButton.style.display = 'none';
        }
    });

    
    


    document.addEventListener('click', (event) => {
        if (isInputEmpty && event.target !== buttonNameInputRight ) {
            event.preventDefault(); 
            event.stopPropagation(); 
            alert('Нельзя оставлять пустое место! Заполните поле ввода.');
            buttonNameInputRight.focus(); 
        }

    }, true); 
    

    

    function createCategory(buttonName, message, None, changes, created, conditionsX, conditionsY, colors) {
        const newCategoryId = Date.now();
        const newCategory = {
            id: newCategoryId,
            button_name: buttonName,
            message: message,
            parent: None,
            change: changes,
            created: created,
            conditionX: conditionsX,
            conditionY: conditionsY,
            color: colors,
        };

        categories[newCategoryId] = newCategory;
        renderCategories();
    }
    function getCSRFToken() {
        const csrfCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='));
        return csrfCookie ? csrfCookie.split('=')[1] : '';
    }
    function selectElement(categoryId) {
        window.selectedElementId = categoryId;
        
        // Получаем категорию
        const category = categories[categoryId]; 
        console.log(categories[categoryId]);
        if (!category) return;
    
        // Обновляем input цвета справа
        const colorInput = document.querySelector(".right_settings_button_color_input");
        if (colorInput) {
            colorInput.value = category.color || "#ffffff";
            
            
        }
    }
    
    function changeElementColor(input) {
        console.log(123123123);
        if (!window.selectedElementId) return;
    
        const category = categories[window.selectedElementId];
        if (!category) return;
    
        const element = document.getElementById(category.id + 'element');
        if (element) {
            element.style.backgroundColor = input.value;
            category.color = input.value; // Сохраняем цвет в объекте
            category.change = true; // Отмечаем изменение
            
            
        }
    }
    window.changeElementColor = changeElementColor;
    
    

    async function sendCreatedCategories() {
        const csrfToken = getCSRFToken();
        const createdCategories = Object.values(categories).filter(cat => cat.created || cat.change);

        
        for (const category of createdCategories) {
            console.log(1232131);
            
            try {
                const response = await fetch(`/projects/${projectId}/add_category/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken,
                    },
                    body: JSON.stringify({
                        category_id: category.id,
                        button_name: category.button_name,
                        parent: category.parent,
                        message: category.message,
                        change: category.change,
                        created: category.created,
                        conditionX: category.conditionX,
                        conditionY: category.conditionY,
                        color: category.color, // Сохраняем цвет
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(`Категория ${result.category_id} успешно сохранена.`);
                    category.created = false; // Обновляем статус на локальной стороне
                    
                    isDataSaved = true;
                } else {
                    const error = await response.json();
                    console.error("Ошибка при сохранении категории:", error);
                }
            } catch (error) {
                console.error("Ошибка соединения с сервером:", error);
            }
        }
    }


    addElementMenuButton.addEventListener("click", () => {
        
        const buttonName = buttonNameInput.value.trim();
        if (buttonName) {
            createCategory(buttonName, "123", "None", false, true, "50%", "50%", "rgb(0, 0, 0)");
            buttonNameInput.value = '';
            isDataSaved = false;
        } else {
            alert("Пожалуйста, введите название кнопки!");
        }
    });

    sendCategoriesButton.addEventListener("click", sendCreatedCategories);

    loadCategories();
});
