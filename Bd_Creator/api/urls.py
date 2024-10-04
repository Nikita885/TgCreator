from django.urls import path, include

from .views import UserViewSet, ProjectViewSet, CategoryViewSet, CustomLoginView, register, get_projects_for_bot

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView


router = DefaultRouter()

router.register(r'users', UserViewSet, basename='user'),
router.register('projects', ProjectViewSet, basename='project')
router.register('category', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('get_projects_for_bot/', get_projects_for_bot, name='get_projects_for_bot'),

]