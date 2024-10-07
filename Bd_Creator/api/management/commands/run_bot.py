import asyncio
from django.core.management.base import BaseCommand
from aiogram import Bot, types
from aiogram import Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from asgiref.sync import sync_to_async
from api.models import Project

async def echo_bot(token):
    print(f"Создаем бота с токеном: {token}")
    bot = Bot(token=token)
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)

    await register_handlers(dp)
    await dp.start_polling(bot)

async def echo(message: types.Message):
    await message.answer(message.text)

async def register_handlers(dp: Dispatcher):
    dp.message.register(echo)

async def run_bots():
    projects = await sync_to_async(list)(Project.objects.all())
    tasks = []

    for project in projects:
        token = project.tg_token
        print(f"Токен проекта '{project.name}': {token}")
        if token:
            tasks.append(asyncio.create_task(echo_bot(token)))
        else:
            print(f"Проект '{project.name}' не имеет токена.")

    if not tasks:
        print("Нет доступных токенов для запуска ботов.")
        return

    await asyncio.gather(*tasks)

class Command(BaseCommand):
    help = 'Запускает ботов для каждого проекта'

    def handle(self, *args, **kwargs):
        print("Запуск ботов...")
        asyncio.run(run_bots())
