# bot_launcher.py

import os
import time
import django
import asyncio
from multiprocessing import Process
from threading import Thread

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Bd_Creator.settings")
django.setup()

from api.models import Project

# Глобальное хранилище запущенных ботов
running_bots: dict[int, Process] = {}

def run_bot(token, project_id):
    from bots.run_bot import run_single_bot
    asyncio.run(run_single_bot(token, project_id))

def monitor_loop(poll_interval=5):
    global running_bots

    while True:
        projects = list(Project.objects.all())

        for proj in projects:
            pid = proj.id
            if proj.condition:
                # если проект должен быть активен, но бот еще не запущен — запускаем
                if pid not in running_bots or not running_bots[pid].is_alive():
                    print(f"[INFO] Запуск бота {pid}")
                    p = Process(target=run_bot, args=(proj.tg_token, proj.id))
                    p.start()
                    running_bots[pid] = p
            else:
                # если проект выключен, а бот запущен — останавливаем
                if pid in running_bots and running_bots[pid].is_alive():
                    print(f"[INFO] Остановка бота {pid}")
                    running_bots[pid].terminate()
                    running_bots[pid].join()
                    del running_bots[pid]

        # проверяем каждые 30 секунд (можно изменить)
        time.sleep(poll_interval)

def main():
    print("[INFO] Монитор запущен. Ожидаем активности...")
    monitor_thread = Thread(target=monitor_loop)
    monitor_thread.start()
    monitor_thread.join()  # основной поток ждет завершения фонового

if __name__ == "__main__":
    main()
