from rest_framework.viewsets import ModelViewSet
from .models import CustomUser, Project, Category
from .serializers import CustomUserSerializer, ProjectSerializer, CategorySerializer
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
class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    #permission_classes = [IsOwnerOrReadOnly]

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer