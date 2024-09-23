from django.contrib import admin
from django.urls import path, include
from api.views import register, CustomLoginView, logout_view, home_view
from django.conf.urls import handler404
from django.shortcuts import redirect

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('register/', register, name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('api/', include('api.urls')),

]
def handler404(request, exception):
    return redirect('home')
handler404 = handler404