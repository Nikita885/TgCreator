import asyncio
from asgiref.sync import sync_to_async
from django.core.management.base import BaseCommand
from api.bots import run_bot  # Импортируйте вашу функцию run_bot
from api.models import Project  # Импортируйте вашу модель Project

class Command(BaseCommand):
    help = 'Запуск всех ботов'

    def handle(self, *args, **options):
        # Создаем новую асинхронную функцию
        async def start_bots():
            projects = await sync_to_async(list)(Project.objects.all())  # Получаем проекты асинхронно
            tasks = [asyncio.create_task(run_bot(project.tg_token)) for project in projects]  # Создаем задачи
            await asyncio.gather(*tasks)  # Запускаем все задачи одновременно

        # Используем asyncio.run() для запуска асинхронной функции
        try:
            asyncio.run(start_bots())  # Запускаем функцию, которая запускает боты
        except RuntimeError as e:
            self.stdout.write(self.style.ERROR(f'Ошибка: {e}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Произошла ошибка: {e}'))
