document.addEventListener("DOMContentLoaded", () => {
	const workspace = document.getElementById("workspace");
	const scene = document.getElementById("scene");

	// Запрет на выделение текста
	workspace.style.userSelect = "none";

	// Переменные для управления состоянием
	let isPanning = false;
	let startX = 0, startY = 0;
	let offsetX = 0, offsetY = 0;
	let scale = 1; // Текущий масштаб сцены
	let activeElement = true;
	let elementSelected = null;
	let categoriesCoordinat = {};

	// Новые переменные для смещения при перетаскивании элемента
	let elementDragOffsetX = 0, elementDragOffsetY = 0;
	
	// Начало панорамирования или перетаскивания элемента
	workspace.addEventListener("mousedown", (e) => {
		// Если клик вне элемента и активен режим панорамирования
		if (!e.target.closest('.element_to_scene') && activeElement) {
			if (e.button === 0) { // Левая кнопка мыши
				document.querySelectorAll(".selected_category").forEach((elem) => {
					elem.className = elem.className.replace(" selected_category", "");
				});
				
				isPanning = true;
				startX = e.clientX;
				startY = e.clientY;
				workspace.style.cursor = "grabbing";
				e.preventDefault(); // Запрет на выделение текста
			}
		} else {
			// Если клик по элементу
			document.querySelectorAll(".selected_category").forEach((elem) => {
				elem.className = elem.className.replace(" selected_category", "");
			});
			
			const element = e.target.closest('.element_to_scene');
			elementSelected = element.id;
			element.className = "element_to_scene selected_category"; 
			activeElement = false;
			
			
			// Сохраняем смещение между точкой клика и левым верхним углом элемента
			const elementRect = element.getBoundingClientRect();
			elementDragOffsetX = e.clientX - elementRect.left;
			elementDragOffsetY = e.clientY - elementRect.top;
			e.preventDefault(); 
		}
	});

	// Перемещение сцены или элемента
	workspace.addEventListener("mousemove", (e) => {
		if (isPanning) {
			const dx = e.clientX - startX;
			const dy = e.clientY - startY;
			offsetX += dx;
			offsetY += dy;

			startX = e.clientX;
			startY = e.clientY;

			scene.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
		} else if (!activeElement) {
			// Перетаскивание элемента
			const element = document.getElementById(elementSelected);
			const elementRect = element.getBoundingClientRect();
			const elementWidth = elementRect.width;
			const elementHeight = elementRect.height;
			const sceneRect = scene.getBoundingClientRect();
			const sceneX = sceneRect.left;
			const sceneY = sceneRect.top;
			const sceneWidth = sceneRect.width;
			const sceneHeight = sceneRect.height;

			// Вычисляем новые координаты с учетом смещения от точки клика
			const newLeft = e.clientX - sceneX - elementDragOffsetX + elementWidth / 2;
			const newTop  = e.clientY - sceneY - elementDragOffsetY + elementHeight / 2;


			element.style.left = ((newLeft / sceneWidth) * 100) + "%";
			element.style.top  = ((newTop  / sceneHeight) * 100) + "%";
			window.categories[element.id.match(/\d+/)[0]].conditionX = element.style.left;
			window.categories[element.id.match(/\d+/)[0]].conditionY = element.style.top;
			if (window.categories[element.id.match(/\d+/)[0]].change === false) {
				window.categories[element.id.match(/\d+/)[0]].change = true;
			}
			console.log(window.categories);
			
			
		}
	});

	// Завершение панорамирования или перетаскивания элемента
	workspace.addEventListener("mouseup", () => {
		activeElement = true;
		if (isPanning) {
			isPanning = false;
			workspace.style.cursor = "grab";
		}
	});

	workspace.addEventListener("mouseleave", () => {
		activeElement = true;
		if (isPanning) {
			isPanning = false;
			workspace.style.cursor = "grab";
		}
	});

	// Сброс сцены при двойном клике
	workspace.addEventListener("dblclick", () => {
		offsetX = 0;
		offsetY = 0;
		scale = 1; // Сбрасываем масштаб
		scene.style.transform = `translate(0px, 0px) scale(1)`;
	});

	// Масштабирование колесом мыши с расчетом от центра сцены
	workspace.addEventListener("wheel", (e) => {
		e.preventDefault(); // Отключаем стандартную прокрутку страницы

		const zoomSpeed = 0.2; // Скорость масштабирования
		const oldScale = scale;

		// Определяем, увеличиваем или уменьшаем масштаб
		if (e.deltaY < 0) {
			scale *= (1 + zoomSpeed);
		} else {
			scale /= (1 + zoomSpeed);
		}

		// Ограничение масштаба (от 0.7 до 4)
		scale = Math.min(Math.max(scale, 0.4), 4);

		// Получаем размеры сцены и координаты центра
		const rect = scene.getBoundingClientRect();
		const sceneCenterX = rect.left + rect.width / 2;
		const sceneCenterY = rect.top + rect.height / 2;

		// Получаем координаты мыши относительно центра сцены
		const mouseX = e.clientX - sceneCenterX;
		const mouseY = e.clientY - sceneCenterY;

		// Коррекция смещения для сохранения позиции под курсором
		offsetX -= (mouseX) * (scale / oldScale - 1);
		offsetY -= (mouseY) * (scale / oldScale - 1);

		// Применяем трансформации
		scene.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
	});
	
});
