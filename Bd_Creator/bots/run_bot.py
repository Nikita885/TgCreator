# bots/run_bot.py

import os
import django
import asyncio
from asgiref.sync import sync_to_async
from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.fsm.storage.memory import MemoryStorage

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Bd_Creator.settings")
django.setup()

from api.models import Project, Category


@sync_to_async
def get_project_by_token(token: str):
    return Project.objects.filter(tg_token=token, condition=True).first()

@sync_to_async
def get_head_category(project: Project):
    return project.head_category

@sync_to_async
def get_children(category: Category):
    return list(category.children.all())

def build_keyboard_from_categories(categories, include_back=False):
    buttons = [
        [InlineKeyboardButton(text=cat.button_name, callback_data=f"cat_{cat.id}")]
        for cat in categories
    ]
    if include_back:
        buttons.append([InlineKeyboardButton(text="🔙 Вернуться в начало", callback_data="to_head")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

async def run_single_bot(token: str, project_id: int):
    bot = Bot(token=token)
    dp = Dispatcher(storage=MemoryStorage())

    project_cache = await get_project_by_token(token)
    if not project_cache:
        print(f"[!] Проект {project_id} не найден по токену")
        return

    @dp.message(CommandStart())
    async def handle_start(message: types.Message):
        chat_id = message.chat.id

        # Удалим последние 10 сообщений (опционально — можно сделать больше)
        for i in range(message.message_id - 1, message.message_id - 11, -1):
            try:
                await bot.delete_message(chat_id=chat_id, message_id=i)
            except:
                pass  # Пропускаем, если не удалось удалить

        # Отправляем корень
        head_cat = await get_head_category(project_cache)
        children = await get_children(head_cat)

        keyboard = build_keyboard_from_categories(children)
        await message.answer(head_cat.message or "Выберите категорию:", reply_markup=keyboard)



    @dp.callback_query(F.data == "to_head")
    async def handle_back_to_head(callback: types.CallbackQuery):
        head_cat = await get_head_category(project_cache)
        children = await get_children(head_cat)

        keyboard = build_keyboard_from_categories(children)
        await callback.message.edit_text(head_cat.message or "Выберите категорию:", reply_markup=keyboard)
        await callback.answer()

    @dp.callback_query(F.data.startswith("cat_"))
    async def handle_category_click(callback: types.CallbackQuery):
        cat_id = int(callback.data.split("_")[1])
        category = await sync_to_async(Category.objects.get)(id=cat_id)
        children = await get_children(category)

        include_back = category != await get_head_category(project_cache)
        keyboard = build_keyboard_from_categories(children, include_back=include_back)

        await callback.message.edit_text(category.message or "Выберите:", reply_markup=keyboard)
        await callback.answer()

    print(f"[INFO] Бот проекта {project_id} запущен")
    await dp.start_polling(bot)
