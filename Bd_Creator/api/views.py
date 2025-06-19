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

import asyncio
from asgiref.sync import sync_to_async

from api.models import CustomUser  # Добавь, если ещё не добавил

running_bots = {}




def delete_category_with_children(request, category_id):
    if request.method == 'POST':
        
        try:
            
            category = Category.objects.get(id=category_id)
            print(category)
            delete_children(category)  
            category.delete()
            return JsonResponse({"success": True, "message": "Категория и все её подкатегории удалены"}, status=200)
        except Category.DoesNotExist:
            return JsonResponse({"success": False, "message": "Категория не найдена"}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        print(1)
        return JsonResponse({"success": False, "message": "Неподдерживаемый метод запроса"}, status=405)

def delete_children(category):
    for child in category.children.all():
        delete_children(child)
        child.delete()




def get_user_category(request, project_id):
    # Получаем текущего пользователя
    user = request.idusers

    # Получаем все категории, которые принадлежат текущему пользователю и проекту
    categories = Category.objects.filter(owner=user, project_id=project_id)
    print(categories)
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
            return render(request, 'login.html', {'form': form})  
        

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
                # Получаем объект пользователя
                user = CustomUser.objects.get(id=request.idusers)

                # Создаём проект
                project = Project.objects.create(name=name, tg_token=tg_token)
                project.owners.add(user)

                # Создаём головную категорию
                category = Category.objects.create(
                    button_name='/start',
                    message='Пусто',
                    owner=user,
                    conditionX='50%',
                    conditionY='50%',
                    color='rgb(0, 0, 0)',
                    is_head=True,
                    project_id=project
                )

                # Привязываем головную категорию к проекту
                project.head_category = category
                project.save()

                return JsonResponse({'id': project.id, 'name': project.name}, status=201)
            except CustomUser.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
            except ValidationError as e:
                return JsonResponse({'error': str(e)}, status=400)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'error': 'Missing data'}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)
def get_projects(request):
    # Получаем текущего пользователя
    user = request.idusers

    projects = Project.objects.filter(owners=user)
    
    project_list = [{'id': project.id, 'name': project.name, 'condition': project.condition, 'tg_token': project.tg_token} for project in projects]
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


def edit_project(request, project_id):
    if request.method == 'POST':
        try:
            project = get_object_or_404(Project, id=project_id)
            data = json.loads(request.body)

            # Сохраняем текущее состояние condition
            current_condition = project.condition
            
            # Обновляем поле condition
            new_condition = data.get('condition', current_condition)
            project.condition = new_condition

            # Сохраняем изменения
            project.save()


            return JsonResponse({'success': True, 'message': 'Проект обновлен успешно.'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Ошибка в формате JSON.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Неверный метод запроса'}, status=405)





def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    print(request.path)
    context = {
        'project': project
    }
    return render(request, 'project_detail_last.html', context)

def new_get_category(request, project_id):
    user = request.idusers
    categories = Category.objects.filter(owner=user, project_id=project_id)
    category_dict = {category.id: {
        'id': category.id,
        'button_name': category.button_name,
        'parent': list(category.parentMas.values_list('id', flat=True)) if category.parentMas.exists() else [],
        'project_id': category.project_id.id,
        'message': category.message,
        'owner': category.owner.id,
        'children': list(category.children.values_list('id', flat=True)),  # Преобразуем в список ID
        'conditionX': category.conditionX,
        'conditionY': category.conditionY,
        'color': category.color,
        'is_head': category.is_head,
    } for category in categories}

    category_list = list(category_dict.values())

    return JsonResponse({'categorys': category_list}, safe=False)

def create_category(request, project_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            categories_data = data.get('categories', [])

            saved_count = 0
            project = Project.objects.get(id=project_id)

            # Словарь: временный id -> объект Category
            tempid_to_category = {}

            # 1. Сохраняем созданные категории, не устанавливая связи
            for cat_data in categories_data:
                created = cat_data.get('created')
                if created:
                    button_name = cat_data.get('button_name')
                    message = cat_data.get('message')
                    conditionX = cat_data.get('conditionX')
                    conditionY = cat_data.get('conditionY')
                    color = cat_data.get('color')
                    is_head = cat_data.get('is_head')
                    temp_id = cat_data.get('category_id')  # временный id с клиента

                    if button_name and message:
                        category = Category(
                            button_name=button_name,
                            project_id=project,
                            owner_id=request.idusers,
                            message=message,
                            conditionX=conditionX,
                            conditionY=conditionY,
                            color=color,
                            is_head=is_head,
                        )
                        category.save()
                        tempid_to_category[temp_id] = category
                        saved_count += 1

            # 2. Обновляем и устанавливаем связи для всех категорий (created и изменённых)
            for cat_data in categories_data:
                change = cat_data.get('change')
                created = cat_data.get('created')
                category_id = cat_data.get('category_id')

                # Получаем объект Category — для созданных из словаря, для изменённых из БД
                if created:
                    category = tempid_to_category.get(category_id)
                    if not category:
                        continue
                elif change:
                    try:
                        category = get_object_or_404(Category, id=category_id)
                    except:
                        continue
                else:
                    continue

                # Обновляем поля, если это изменение
                if change and not created:
                    category.conditionX = cat_data.get('conditionX', category.conditionX)
                    category.conditionY = cat_data.get('conditionY', category.conditionY)
                    category.button_name = cat_data.get('button_name', category.button_name)
                    category.message = cat_data.get('message', category.message)
                    category.color = cat_data.get('color', category.color)
                    category.is_head = cat_data.get('is_head', category.is_head)

                # Для parentMas и children нужно преобразовать временные id в реальные id
                parent_ids = cat_data.get('parent', [])
                children_ids = cat_data.get('children', [])

                # Функция для преобразования временных id в реальные id
                def map_ids(ids):
                    real_ids = []
                    for i in ids:
                        if i in tempid_to_category:
                            real_ids.append(tempid_to_category[i].id)
                        else:
                            real_ids.append(i)  # Возможно реальный id, оставляем как есть
                    return real_ids

                if parent_ids is not None:
                    real_parent_ids = map_ids(parent_ids)
                    category.parentMas.set(real_parent_ids)

                if children_ids is not None:
                    real_children_ids = map_ids(children_ids)
                    category.children.set(real_children_ids)

                category.save()

            return JsonResponse({'success': True, 'saved_count': saved_count})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)
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

def toggle_bot(request, project_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        condition = data.get('condition', True)

        try:
            project = Project.objects.get(pk=project_id)
            project.condition = condition
            project.save()
            return JsonResponse({'status': 'ok'})
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Project not found'}, status=404)
        

def delete_category_with_links(request, project_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            category_id = data.get("category_id")
            if not category_id:
                return JsonResponse({"success": False, "message": "Не передан category_id"}, status=400)

            category = Category.objects.get(id=category_id, project_id=project_id)

            # Удаляем связи, где категория участвует
            remove_category_links(category)

            # Удаляем саму категорию
            category.delete()

            return JsonResponse({"success": True, "message": "Категория удалена, связи очищены"}, status=200)

        except Category.DoesNotExist:
            return JsonResponse({"success": False, "message": "Категория не найдена"}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Неподдерживаемый метод запроса"}, status=405)


def remove_category_links(category):
    # Удаляем из всех родительских и дочерних ManyToMany связей
    category.parents.clear()
    category.parentMas.clear()
    category.children.clear()
    category.childrens.clear()

    # Также удаляем эту категорию из других, где она упоминалась
    for cat in Category.objects.all():
        cat.parents.remove(category)
        cat.parentMas.remove(category)
        cat.children.remove(category)
        cat.childrens.remove(category)



def delete_children(category):
    children = category.children.all()
    for child in children:
        delete_children(child)
        remove_category_links(child)
        print(f"Удаление подкатегории: {child}")
        child.delete()