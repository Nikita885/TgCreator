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
    let activeID = [];
    window.childrenID = [];

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
            addToScene(category);
        }
        addCommunications(childrenID);

        for (const id in categories) {
            const category = categories[id];
            const element = document.getElementById(category.id + 'element');
            if (element) {
                element.style.backgroundColor = category.color || "#ffffff";
            }
        }
    }
    function drawLineWithHorizontalLegsPxCoordsInContainer(container, x1, y1, x2, y2, startLegDir, endLegDir) {
        const rect = container.getBoundingClientRect();

        const legLengthPercent = 15;
        const legLengthPx = (rect.width * legLengthPercent) / 100;

        const sx = x1 + legLengthPx * startLegDir;
        const sy = y1;

        const ex = x2 + legLengthPx * endLegDir;
        const ey = y2;

        const percent = (val, axis) =>
            axis === 'x'
                ? ((val - rect.left) / rect.width) * 100
                : ((val - rect.top) / rect.height) * 100;

        const addLine = (x1, y1, x2, y2, dop) => {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            const line = document.createElement('div');
            line.style.position = 'absolute';
            line.style.left = percent(x1, 'x') + '%';
            line.style.top = percent(y1, 'y') + '%';
            line.style.width = (length / rect.width) * 100 + '%';
            line.style.height = '2px';
            line.style.backgroundColor = 'white';
            line.style.transform = `rotate(${angle}deg)`;
            line.style.transformOrigin = '0 0';
            line.style.zIndex = dop ? '100' : '-100';
            line.style.pointerEvents = 'none';

            container.appendChild(line);

            // Стрелку рисуем только на конце правой ножки (dop === true и x2,y2 === ex,ey)
                const arrow = document.createElement('div');
                arrow.style.position = 'absolute';
                arrow.style.width = '0';
                arrow.style.height = '0';
                arrow.style.borderTop = '6px solid transparent';
                arrow.style.borderBottom = '6px solid transparent';

                if (endLegDir > 0) {
                    // стрелка налево
                    arrow.style.borderLeft = '10px solid white';
                    
                } else {
                    // стрелка направо
                    arrow.style.borderRight = '10px solid white';
                }

                arrow.style.left = percent(x2+1, 'x') + '%';
                arrow.style.top = percent(y2+1, 'y') + '%';
                arrow.style.marginTop = '-6px'; // центрируем по вертикали
                arrow.style.marginLeft = endLegDir > 0 ? '-10px' : '0';
                arrow.style.zIndex = '110';
                arrow.style.pointerEvents = 'none';

                container.appendChild(arrow);

        };

        addLine(x1, y1, sx, sy, true);  // левая ножка
        addLine(x2, y2, ex, ey, true);  // правая ножка с стрелкой
        addLine(sx, sy, ex, ey, false); // горизонтальная линия
    }






    function addCommunications(childrenIDs) {
        for (const childId of childrenIDs) {
            const layersContainer = document.getElementById(childId[0]+'element');
            const oldLayer = document.getElementById(`line_layer_${childId[0]}_${childId[1]}`);
            if (oldLayer) oldLayer.remove();

            const layerElement = document.createElement("div");
            layerElement.id = `line_layer_${childId[0]}_${childId[1]}`;
            layerElement.style.position = "absolute";
            layerElement.style.left = "0";
            layerElement.style.top = "0";
            layerElement.style.width = "100%";
            layerElement.style.height = "100%";
            layerElement.style.pointerEvents = "none";
            layersContainer.appendChild(layerElement);
            
            const startPoints = [
                document.getElementById(`connection_start_${childId[0]}_${childId[1]}_1`),
                document.getElementById(`connection_start_${childId[0]}_${childId[1]}_2`)
            ];
            const endPoints = [
                document.getElementById(`connection_end_${childId[0]}_${childId[1]}_1`),
                document.getElementById(`connection_end_${childId[0]}_${childId[1]}_2`)
            ];

            let bestPair = null;
            let minDistance = Infinity;
            let startLegDir = 0;
            let endLegDir = 0;

            for (const startEl of startPoints) {

                
                for (const endEl of endPoints) {
                    if (!startEl || !endEl) continue;

                    const startRect = startEl.getBoundingClientRect();
                    const endRect = endEl.getBoundingClientRect();

                    const x1 = startRect.left + startRect.width / 2;
                    const y1 = startRect.top + startRect.height / 2;
                    const x2 = endRect.left + endRect.width / 2;
                    const y2 = endRect.top + endRect.height / 2;

                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < minDistance) {
                        minDistance = distance;
                        bestPair = { x1, y1, x2, y2 };

                        // Определяем направление ножек по суффиксу id
                        startLegDir = startEl.id.endsWith('_1') ? -1 : 1;
                        endLegDir = endEl.id.endsWith('_1') ? -1 : 1;
                    }
                }
            }

            if (bestPair) {

                drawLineWithHorizontalLegsPxCoordsInContainer(
                    layerElement,
                    bestPair.x1,
                    bestPair.y1,
                    bestPair.x2,
                    bestPair.y2,
                    startLegDir,
                    endLegDir
                );
            }
        }
    }

    window.addEventListener('mousemove', () => {
        // вызов функции обновления линий
        addCommunications(childrenID);
    });

    window.addEventListener('resize', () => {
        addCommunications(childrenID);
    });








    
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

        let html = `
            <div class="element_name_to_scene_container">
                <div class="element_block_to_scene">
                    <div class="element_to_scene_label_title">Название:</div>
                    <div class="element_name_to_scene">${category.button_name}</div>
                </div>
        

                <div class="element_block_communications" id="${category.id}elementchildblock"> >
                    <div class="element_block_to_scene">
                        <div class="element_to_scene_label_title">Связи:</div>
                    </div>`;

        for (const childId of category.children) {
            html += `
                <div class="element_block_to_scene">
                    <div class="element_name_to_scene_connection_1" id="connection_start_${category.id}_${childId}_1" ></div>
                    <div class="element_name_to_scene" style="text-align: left;">${categories[childId].button_name}</div>
                    <div class="element_name_to_scene_connection_2" id="connection_start_${category.id}_${childId}_2"></div>
                </div>`;
            childrenID.push([category.id,childId])
        }
        for (const parentId of category.parent) {
            html += `
                <div class="element_block_to_scene">
                    <div class="element_name_to_scene_connection_1" id="connection_end_${parentId}_${category.id}_1"></div>
                    <div class="element_name_to_scene" style="text-align: left;">${categories[parentId].button_name}</div>
                    <div class="element_name_to_scene_connection_2" id="connection_end_${parentId}_${category.id}_2"></div>
                </div>`;
        }
        
        html += `
                </div>
            </div>
            <button class="add_connection_button" onclick="сreatingСonnection(${category.id})"></button>`;
        
        layerElement.innerHTML = html;
            
        SceneContainer.appendChild(layerElement);
        const element = document.getElementById(category.id + 'elementchildblock');   
        if (category.children.length == 0 && category.parent.length == 0) {
            element.style.display = 'none';
        }

    }


    
    function ListItems(data) {

        
        for (const id in categories) {
            const category = categories[id];
            if (category['id'] == data){
                document.querySelectorAll(".selected_category").forEach((elem) => {
                    elem.className = elem.className.replace("selected_category", "");
                });
                const element = document.getElementById(data + "element");
                element.className = "element_to_scene selected_category"; 
                
                
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
    

    

    function createCategory(buttonName, message, parent, changes, created, conditionsX, conditionsY, colors, childrens) {
        const newCategoryId = Date.now();
        const newCategory = {
            id: newCategoryId,
            button_name: buttonName,
            message: message,
            parent: parent,
            change: changes,
            created: created,
            conditionX: conditionsX,
            conditionY: conditionsY,
            color: colors,
            children: childrens,
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
                        children: category.children
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
            createCategory(buttonName, "123", [], false, true, "50%", "50%", "rgb(0, 0, 0)", []);
            buttonNameInput.value = '';
            isDataSaved = false;
        } else {
            alert("Пожалуйста, введите название кнопки!");
        }
    });

    sendCategoriesButton.addEventListener("click", sendCreatedCategories);



    function сreatingСonnection(ID) {
        if (activeID['start']) {
            if (activeID['start'] != ID) {
                if (!categories[ID].parent.includes(activeID['start']) && !categories[activeID['start']].children.includes(ID)) {
                    categories[ID].parent.push(activeID['start']);
                    categories[activeID['start']].children.push(ID);
                    categories[ID].change = true;
                    categories[activeID['start']].change = true;
                    isDataSaved = false;

                    const elementchildblock1 = document.getElementById(ID + 'elementchildblock');
                    const elementchildblock2 = document.getElementById(activeID['start'] + 'elementchildblock');
                    if (elementchildblock1 && elementchildblock2) {
                        elementchildblock1.innerHTML += `
                            <div class="element_block_to_scene">
                                <div class="element_name_to_scene_connection_1" id="connection_start_${activeID['start']}_${ID}_1"></div>
                                <div class="element_name_to_scene" style="text-align: left;">${categories[activeID['start']].button_name}</div>
                                <div class="element_name_to_scene_connection_2" id="connection_start_${activeID['start']}_${ID}_2"></div>
                            </div>`;
                        
                        elementchildblock2.innerHTML += `
                            <div class="element_block_to_scene">
                                <div class="element_name_to_scene_connection_1" id="connection_end_${activeID['start']}_${ID}_1"></div>
                                <div class="element_name_to_scene" style="text-align: left;">${categories[ID].button_name}</div>
                                <div class="element_name_to_scene_connection_2" id="connection_end_${activeID['start']}_${ID}_2"></div>
                            </div>`;
                        childrenID.push([activeID['start'],ID]);
                        addCommunications(childrenID);
                    }
                    if (elementchildblock1.style.display === 'none') {
                        elementchildblock1.style.display = 'block';
                    }
                    if (elementchildblock2.style.display === 'none') {
                        elementchildblock2.style.display = 'block';
                    }
                    
                }
                
                
                
            }
            const animConnectionElement = document.getElementById(`anim_connection_to_scene${activeID['start']}`);
            if (animConnectionElement) {
                animConnectionElement.remove();
            }
            activeID['end'] = '';
            activeID['start'] = '';
        } else {
            const element = document.getElementById(ID + 'element');


            if (element) {
                element.innerHTML += `
                    <div class="anim_connection_to_scene" id="anim_connection_to_scene${ID}">
                        <div id="line${ID}" style="position:absolute; height:2px; background:white;"></div>
                        <div id="mobile_line${ID}" style="position:absolute; height:2px; background:white; pointer-events: none;"></div>
                    </div>
                `;

                const x0 = element.offsetWidth / 2;
                const y0 = element.offsetHeight;

                const x1 = x0;
                const y1 = y0 + 20;

                const dx = x1 - x0;
                const dy = y1 - y0;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                const line = document.getElementById("line" + ID);
                line.style.width = `${length}px`;
                line.style.left = `${x0}px`;
                line.style.top = `${y0}px`;
                line.style.transform = `rotate(${angle}deg)`;
                line.style.transformOrigin = '0 0';
                line.style.zIndex = '-1'; // Ensure it appears above other elements


                let mobile_line = document.getElementById("mobile_line" + ID);


                function updateMobileLine(event) {
                    const x0Mobile = x1;
                    const y0Mobile = y1;
                    const x1Mobile = (event.clientX-element.getBoundingClientRect().left)/scale;
                    const y1Mobile = (event.clientY-element.getBoundingClientRect().top)/scale;

                    console.log();
                    
                    const dxMobile = x1Mobile - x0Mobile;
                    const dyMobile = y1Mobile - y0Mobile;
                    const lengthMobile = Math.sqrt(dxMobile * dxMobile + dyMobile * dyMobile);
                    const angleMobile = Math.atan2(dyMobile, dxMobile) * (180 / Math.PI);

                    mobile_line.style.width = `${lengthMobile}px`;
                    mobile_line.style.left = `${x0Mobile}px`;
                    mobile_line.style.top = `${y0Mobile}px`;
                    mobile_line.style.transform = `rotate(${angleMobile}deg)`;
                    mobile_line.style.transformOrigin = '0 0';

                    

                }

                document.addEventListener('mousemove', updateMobileLine);

                document.addEventListener('mouseup', () => {
                    document.removeEventListener('mousemove', updateMobileLine);
                }, { once: true });
            }

            activeID['start'] = ID;
        }
    }
    window.сreatingСonnection = сreatingСonnection;


    document.addEventListener('click', function(event) {
        if (!event.target.closest('.add_connection_button')) {
            const animConnectionElement = document.getElementById(`anim_connection_to_scene${activeID['start']}`);
            if (animConnectionElement) {
                animConnectionElement.remove();
            }
            activeID['end'] = '';
            activeID['start'] = '';
        }
    });
    
    
    

    loadCategories();
});
