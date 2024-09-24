from django.contrib import admin
from django.urls import path, include
from api.views import register, CustomLoginView, logout_view, home_view
from django.conf.urls import handler404
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static
from django.core.exceptions import PermissionDenied


def handler404(request, exception):
    if settings.DEBUG:
        # Если в DEBUG, используем стандартный обработчик
        raise PermissionDenied
    return redirect('home')
urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('register/', register, name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('api/', include('api.urls')),

]

if not settings.DEBUG:
    print(settings.DEBUG, 123)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

handler404 = handler404