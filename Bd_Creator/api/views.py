from rest_framework.viewsets import ModelViewSet

from .models import CustomUser, Project, Category
from .serializers import CustomUserSerializer, ProjectSerializer, CategorySerializer
from .permissions import IsOwnerOrReadOnly, IsOwner
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import RegistrationForm
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView
from .forms import CustomRegistrationForm

from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.middleware.csrf import get_token


import json

from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

import requests

from .forms import CustomAuthenticationForm


from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def delete_category(request, category_id):
    if request.method == 'DELETE':
        category = get_object_or_404(Category, id=category_id)
        category.delete()
        
        # Проверка, действительно ли категория удалена
        if not Category.objects.filter(id=category_id).exists():
            return JsonResponse({'message': 'Категория успешно удалена.'}, status=200)
        else:
            return JsonResponse({'error': 'Ошибка при удалении категории.'}, status=500)

    return JsonResponse({'error': 'Метод не разрешен.'}, status=405)

def edit_category(request, category_id):
    if request.method == 'POST':
        try:
            category = get_object_or_404(Category, id=category_id)
            data = json.loads(request.body)

            # Обновляем поля категории
            category.button_name = data.get('button_name', category.button_name)
            category.message = data.get('message', category.message)

            # Сохраняем изменения
            category.save()

            return JsonResponse({'success': True, 'message': 'Категория обновлена успешно.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Неверный метод запроса'}, status=405)



def delete_category(request, project_id):
    try:
        data = json.loads(request.body)
        category_id = data.get('category_id')
        category = Category.objects.get(id=category_id, project_id=project_id)

        category.delete()
        return JsonResponse({'success': 'Category deleted successfully'})

    except Category.DoesNotExist:
        return JsonResponse({'error': 'Category does not exist'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)




def get_user_category(request, project_id):
    # Получаем текущего пользователя
    user = request.idusers

    # Получаем все категории, которые принадлежат текущему пользователю и проекту
    categories = Category.objects.filter(owner=user, project_id=project_id)

    # Создаем словарь для хранения категорий по их ID
    category_dict = {category.id: {
        'id': category.id,
        'button_name': category.button_name,
        'parent': category.parent.id if category.parent else None,
        'project_id': category.project_id.id,
        'message': category.message,
        'owner': category.owner.id,
        'children': list(category.children.values('id', 'button_name', 'message')),  # Получаем подкатегории
    } for category in categories}

    # Получаем список категорий
    category_list = list(category_dict.values())

    return JsonResponse({'categorys': category_list}, safe=False)




def create_category(request, project_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            button_name = data.get('button_name')
            parent_id = data.get('parent')
            message = data.get('message')  # Получаем сообщение из запроса

            if button_name and message:  # Проверяем, что оба значения присутствуют
                
                parent = Category.objects.get(id=parent_id) if parent_id else None
                project = Project.objects.get(id=project_id)
                
                category = Category.objects.create(
                    button_name=button_name,
                    parent=parent,
                    project_id=project,
                    owner_id=request.idusers,  # Используем request.user.id для владельца или (idusers)
                    message=message  # Сохраняем сообщение
                )
                print(category)
                category.save()
                
                return JsonResponse({'success': 'Category created successfully', 'category_id': category.id})

            return JsonResponse({'error': 'Missing data'}, status=400)

        except Category.DoesNotExist:
            return JsonResponse({'error': 'Parent category does not exist'}, status=404)

        except Project.DoesNotExist:
            return JsonResponse({'error': 'Project does not exist'}, status=404)

        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)



def add_category(request, project_id):
    if request.method == 'POST':
        # Проверяем, аутентифицирован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({"error": "User not authenticated"}, status=401)

        # Получаем проект, к которому добавляется категория
        project = get_object_or_404(Project, id=project_id)

        # Получаем данные из запроса
        try:
            data = json.loads(request.body)  # Загружаем данные JSON из тела запроса
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        # Создаем новый словарь с необходимыми данными
        new_data = {
            'button_name': data.get('button_name'),
            'parent': data.get('parent'),  # если это ID родительской категории
            'message': data.get('message'),
            'project_id': project.id,  # Добавляем project_id
            'owner': request.user  # Устанавливаем владельца
        }

        # Создание категории
        serializer = CategorySerializer(data=new_data)
        if serializer.is_valid():
            category = serializer.save()  # Сохраняем категорию
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
def register(request):
    if request.method == 'POST':
        form = CustomRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = CustomRegistrationForm()
    return render(request, 'register.html', {'form': form})
    
def home_view(request):
    return render(request, 'test.html')

def projects(request):
    return render(request, 'projects.html')

class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsOwnerOrReadOnly]

class ProjectViewSet(ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        # Возвращать только те проекты, где текущий пользователь является владельцем
        return Project.objects.filter(owners=self.request.user)

    def get_serializer_context(self):
        context = super(ProjectViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Возвращать только те проекты, где текущий пользователь является владельцем
        return Category.objects.filter(owner=self.request.user)
    


class CustomLoginView(TokenObtainPairView):
    def get(self, request, *args, **kwargs):
        form = CustomAuthenticationForm()  # Используем пользовательскую форму
        return render(request, 'login.html', {'form': form})

    def post(self, request, *args, **kwargs):
        form = CustomAuthenticationForm(request, data=request.POST)  # Используем пользовательскую форму

        if form.is_valid():
            # Получаем токен через стандартное поведение TokenObtainPairView
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                token = response.data['access']
                
                # Создаем новый ответ и сохраняем токен в куки
                res = HttpResponseRedirect('projects/')
                res.set_cookie(
                    key='access_token',
                    value=f'Bearer {token}',
                    httponly=True,
                    samesite='Strict',
                )
                res['X-CSRFToken'] = get_token(request)

                # Перенаправляем на test.html
                return res
            else:
                return JsonResponse({'message': 'Invalid credentials'}, status=400)
        else:
            return render(request, 'login.html', {'form': form})  # Возвращаем форму с ошибками
        

def logout_view(request):
    response = HttpResponseRedirect('projects/')
    response.delete_cookie('access_token')  # Удаляем токен из куков
    return response

def is_valid_telegram_token(token):
    """Проверка валидности токена Telegram."""
    response = requests.get(f'https://api.telegram.org/bot{token}/getMe')
    return response.status_code == 200

def create_project(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        name = data.get('name')
        tg_token = data.get('tg_token')
        print(data)
        if name and tg_token:
            # Проверка валидности токена Telegram
            if not is_valid_telegram_token(tg_token):
                return JsonResponse({'error': 'Invalid Telegram token'}, status=400)

            # Проверка, существует ли токен в базе данных
            if Project.objects.filter(tg_token=tg_token).exists():
                return JsonResponse({'error': 'This Telegram token already exists'}, status=400)

            try:
                project = Project.objects.create(name=name, tg_token=tg_token)
                project.owners.add(request.idusers)  # Добавляем текущего пользователя как владельца
                return JsonResponse({'id': project.id, 'name': project.name}, status=201)
            except ValidationError as e:
                return JsonResponse({'error': str(e)}, status=400)

        return JsonResponse({'error': 'Missing data'}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)
def get_projects(request):
    # Получаем текущего пользователя
    user = request.idusers

    projects = Project.objects.filter(owners=user)
    
    project_list = [{'id': project.id, 'name': project.name} for project in projects]
    return JsonResponse({'projects': project_list}, safe=False)


def get_projects_for_bot(request):
    # Получаем все проекты
    projects = Project.objects.all()
    
    project_list = [{'id': project.id, 'name': project.name} for project in projects]
    return JsonResponse({'projects': project_list}, safe=False)


def delete_project(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    if request.method == 'POST':
        project.delete()
        return redirect('/')  # Перенаправляем на главную или страницу проектов
    
    # Если запрос не является POST (например, GET), возвращаем ошибку 405
    return HttpResponse(status=405)  # Метод не разрешен

def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    print(request.path)
    context = {
        'project': project
    }
    return render(request, 'project_detail.html', context)