from django.contrib import admin
from django.urls import path, include
from api.views import register, CustomLoginView, logout_view, home_view, projects, create_project, get_projects, delete_project, project_detail
from api.views import create_category, edit_category, delete_category, get_user_category

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('register/', register, name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('api/', include('api.urls')),
    path('projects/', projects, name='projects'),
    path('create_project/', create_project, name='create_project'),
    path('get_projects/', get_projects, name='get_projects'),  # URL для получения всех проектов
    path('delete_project/<int:project_id>/', delete_project, name='delete_project'),  # URL для удаления проекта
    path('projects/<int:project_id>/', project_detail, name='project_detail'),  # Новый маршрут для страницы проекта
    path('projects/<int:project_id>/add_category/', create_category, name='add_category'),
    path('projects/<int:project_id>/edit_category', edit_category, name='edit_category'),
    path('projects/<int:project_id>/delete_category', delete_category, name='delete_category'),
    path('projects/<int:project_id>/get_category/', get_user_category, name='get_category'),
]