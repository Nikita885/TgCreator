from rest_framework.viewsets import ModelViewSet
from .models import CustomUser
from .serializers import CustomUserSerializer
from .permissions import IsOwnerOrReadOnly



class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        # Возвращаем только свою модель для авторизованного пользователя
        if self.request.user.is_authenticated:
            return CustomUser.objects.filter(id=self.request.user.id)
        return CustomUser.objects.none()  # Если пользователь не аутентифицирован
