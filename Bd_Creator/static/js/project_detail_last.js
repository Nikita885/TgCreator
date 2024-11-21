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
            // Теперь правильно вычисляем разницу между курсором и начальной позицией
            const delta = e.clientX - startX; // Разница между текущим и начальным положением мыши
            const newWidthLeft = startWidthLeft + delta ; // Новая ширина для левого крыла
            if (newWidthLeft > 0) {
                const newWidthLeftVW = (newWidthLeft / window.innerWidth) * 100;
                resizableLeft.style.width = `${newWidthLeftVW}vw`; // Применяем новую ширину
            }
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
            const newWidthRight = startWidthRight - delta + offsetStartRight; // Правильное вычисление ширины для правого крыла
            if (newWidthRight > 0) {
                const newWidthRightVW = (newWidthRight / window.innerWidth) * 100;
                resizableRight.style.width = `${newWidthRightVW}vw`; // Применяем новую ширину
            }
        }
    }
    function selectItem(element) {
        // Если у элемента уже есть класс selected, выходим из функции
        if (element.classList.contains("selected")) {
            return;
        }
    
        // Убираем выделение со всех меню
        const menuItems = document.querySelectorAll(".left_menu_block_1, .left_menu_block_2");
        menuItems.forEach(item => item.classList.remove("selected"));
        element.classList.add("selected"); // Добавляем выделение выбранному элементу
    
        // Убираем класс selectes_pop-up у всех поп-апов
        const allLayers = document.querySelectorAll(".left_pop-up_menu_layers, .left_pop-up_menu_add_element");
        allLayers.forEach(layer => layer.classList.remove("selectes_pop-up"));
    
        // Добавляем класс selectes_pop-up нужным элементам
        if (element.classList.contains("left_menu_block_1")) {
            const menuItemsLayers = document.querySelectorAll(".left_pop-up_menu_layers");
            menuItemsLayers.forEach(layer => layer.classList.add("selectes_pop-up"));
        } else {
            const menuItemsLayers = document.querySelectorAll(".left_pop-up_menu_add_element");
            menuItemsLayers.forEach(layer => layer.classList.add("selectes_pop-up"));
        }
    }
    window.selectItem = selectItem;
    
    
    
    async function loadCategories() {
        const projectInfo = document.getElementById('project-info');
        const projectId = projectInfo.getAttribute('data-project-id');
        try {
            // Отправляем GET-запрос к вашему API
            const response = await fetch(`/projects/${projectId}/get_category/`);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки категорий: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log('Загруженные категории:', data.categorys); // Выводим категории в консоль
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    }
    
    loadCategories();
    
});
