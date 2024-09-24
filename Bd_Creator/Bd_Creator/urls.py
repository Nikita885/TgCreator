from django.contrib import admin
from django.urls import path, include
from api.views import register, CustomLoginView, logout_view, home_view



urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('register/', register, name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('api/', include('api.urls')),
]

