from django.urls import path, include

from .views import UserViewSet

from rest_framework.routers import DefaultRouter


router = DefaultRouter()

router.register('users', UserViewSet, basename='user-list')

urlpatterns = [
    path('', include(router.urls))
]