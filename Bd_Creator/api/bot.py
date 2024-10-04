from django.http import JsonResponse, HttpRequest
from .models import Project

def get_projects_for_bot(request):
    # Получаем все проекты
    projects = Project.objects.all()
    
    project_list = [{'id': project.id, 'name': project.name} for project in projects]
    return JsonResponse({'projects': project_list}, safe=False)

# Создайте новый объект запроса
request = HttpRequest()

# Вызовите функцию и получите ответ
response = get_projects_for_bot(request)

# Выводим статус и данные ответа
print("Status Code:", response.status_code)  # Печатает статус-код ответа
print("Response Content:", response.content.decode())  # Печатает текст ответа
