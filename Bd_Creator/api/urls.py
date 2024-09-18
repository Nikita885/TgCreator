from django.urls import path, include

from .views import UserViewSet

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView


router = DefaultRouter()

router.register('users', UserViewSet, basename='user-list')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]