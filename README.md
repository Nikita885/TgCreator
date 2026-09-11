# TgCreator

Веб-сервис для создания и редактирования Telegram-ботов через сайт, без написания кода.

## Задача

Позволяет пользователю через веб-интерфейс собрать конфигурацию Telegram-бота (команды, сценарии, тексты) и запускать/останавливать его прямо с сайта — без необходимости разворачивать бота вручную на сервере.

## Стек технологий

- **Backend:** Django 5.1, Django REST Framework, Simple JWT (аутентификация)
- **Frontend:** JavaScript, CSS, HTML (шаблоны Django)
- **Запуск ботов:** `bot_launcher.py` — управление процессами создаваемых Telegram-ботов

## Структура проекта

- `Bd_Creator/` — Django-проект (settings, urls, asgi/wsgi)
- `Bd_Creator/api/` — REST API
- `Bd_Creator/bots/` — модели и логика ботов
- `Bd_Creator/templates`, `Bd_Creator/static` — фронтенд

## Как запустить локально

```bash
git clone https://github.com/Nikita885/TgCreator.git
cd TgCreator
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd Bd_Creator
python manage.py migrate
python manage.py runserver
```

Приложение будет доступно на `http://localhost:8000`.
