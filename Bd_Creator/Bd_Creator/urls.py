from django.contrib import admin
from django.urls import path, include
from api.views import register, CustomLoginView, logout_view, home_view, projects, create_project, get_projects, delete_project, project_detail
from api.views import create_category, edit_category, delete_category_with_children, get_user_category, edit_project
from django.shortcuts import redirect

urlpatterns = [
    path('', lambda request: redirect('login'), name='home'), 
    path('admin/', admin.site.urls),
    path('register/', register, name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('api/', include('api.urls')),
    path('projects/', projects, name='projects'),
    path('create_project/', create_project, name='create_project'),
    path('get_projects/', get_projects, name='get_projects'),  
    path('delete_project/<int:project_id>/', delete_project, name='delete_project'),  
    path('projects/<int:project_id>/', project_detail, name='project_detail'),  
    path('projects/<int:project_id>/add_category/', create_category, name='add_category'),
    path('projects/<int:project_id>/edit_project/', edit_project, name='edit_project'),
    path('categories/<int:category_id>/edit/', edit_category, name='edit_category'),
    path('categories/<int:category_id>/delete_category_with_children/', delete_category_with_children, name='delete_category_with_children'),

    path('projects/<int:project_id>/get_category/', get_user_category, name='get_category'),
]
