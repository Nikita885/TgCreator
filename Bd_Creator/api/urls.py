from django.urls import path, include

from .views import UserViewSet, ProjectViewSet, CategoryViewSet, CustomLoginView, register

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView


router = DefaultRouter()

router.register(r'users', UserViewSet, basename='user'),
router.register('projects', ProjectViewSet, basename='project')
router.register('category', CategoryViewSet, basename='category')
urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]