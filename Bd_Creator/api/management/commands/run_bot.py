import asyncio
from django.core.management.base import BaseCommand
from aiogram import Bot, types
from aiogram import Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from asgiref.sync import sync_to_async
from api.models import Project, Category

async def echo_bot(token, categories):
    print(f"Создаем бота с токеном: {token}")
    bot = Bot(token=token)
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)

    async def send_category_buttons(message: types.Message, parent_id=None, current_id=None, edit_message=False, custom_text=None):
        keyboard = await build_category_keyboard(categories, parent_id, current_id)

        text = custom_text if custom_text else "Выберите категорию:"
        if edit_message:
            if message.text != text or message.reply_markup != keyboard:
                await message.edit_text(text, reply_markup=keyboard)
        else:
            await message.answer(text, reply_markup=keyboard)

    async def handle_start(message: types.Message):
        await send_category_buttons(message)

    async def handle_category_selection(callback_query: types.CallbackQuery):
        data = callback_query.data.split(':')
        category_id = data[1]

        if category_id == "-999":
            try:
                current_category_id = data[2]
                current_category = await sync_to_async(Category.objects.get)(id=current_category_id)
                parent_category = await sync_to_async(lambda: current_category.parent)()
                parent_id = parent_category.id if parent_category else None
                await send_category_buttons(callback_query.message, parent_id=parent_id, current_id=current_category_id, edit_message=True, custom_text=parent_category.message if parent_category else None)
            except IndexError:
                await callback_query.message.answer("Ошибка: текущий ID категории не найден.")
            except Category.DoesNotExist:
                await callback_query.message.answer("Ошибка: категория не найдена.")
            except Exception as e:
                await callback_query.message.answer(f"Ошибка: {str(e)}")
        else:
            try:
                parent_id = int(category_id)
                category = await sync_to_async(Category.objects.get)(id=parent_id)
                await send_category_buttons(callback_query.message, parent_id=parent_id, current_id=parent_id, edit_message=True, custom_text=category.message)
            except ValueError:
                await callback_query.message.answer("Ошибка: неверный ID категории.")
            except Category.DoesNotExist:
                await callback_query.message.answer("Ошибка: категория не найдена.")

    dp.message.register(handle_start, lambda message: message.text == "/start")
    dp.callback_query.register(handle_category_selection, lambda callback_query: callback_query.data.startswith("category:"))

    await dp.start_polling(bot)

async def build_category_keyboard(categories, parent_id=None, current_id=None):
    buttons = []
    filtered_categories = [category for category in categories if category.parent_id == parent_id]

    for category in filtered_categories:
        buttons.append(InlineKeyboardButton(text=category.button_name, callback_data=f"category:{category.id}"))

    if parent_id is not None and current_id is not None:
        buttons.append(InlineKeyboardButton(text="Назад", callback_data=f"category:-999:{parent_id}"))

    return InlineKeyboardMarkup(inline_keyboard=[buttons])

async def run_bots():
    projects = await sync_to_async(list)(Project.objects.all())
    tasks = []

    for project in projects:
        if project.condition:  # Проверка поля condition
            token = project.tg_token
            if token:
                categories = await sync_to_async(list)(project.categories.all())
                tasks.append(asyncio.create_task(echo_bot(token, categories)))
            else:
                print(f"Проект '{project.name}' не имеет токена.")
        else:
            print(f"Проект '{project.name}' отключен, так как поле condition равно False.")

    if not tasks:
        print("Нет доступных токенов для запуска ботов.")
        return

    await asyncio.gather(*tasks)

class Command(BaseCommand):
    help = 'Запускает ботов для каждого проекта'

    def handle(self, *args, **kwargs):
        print("Запуск ботов...")
        asyncio.run(run_bots())