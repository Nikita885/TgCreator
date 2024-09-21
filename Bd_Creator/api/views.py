from rest_framework.viewsets import ModelViewSet
from .models import CustomUser, Project, Category
from .serializers import CustomUserSerializer, ProjectSerializer, CategorySerializer
from .permissions import IsOwnerOrReadOnly, IsOwner
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import RegistrationForm
from rest_framework.permissions import IsAuthenticated

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Вход сразу после регистрации
            return redirect('login')  # Перенаправление на страницу входа
    else:
        form = RegistrationForm()
    return render(request, 'register.html', {'form': form})

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
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        # Возвращать только те проекты, где текущий пользователь является владельцем
        return Project.objects.filter(owners=self.request.user)

    def get_serializer_context(self):
        context = super(ProjectViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        # Возвращать только те проекты, где текущий пользователь является владельцем
        return Category.objects.filter(owner=self.request.user)
    

class CustomLoginView(LoginView):
    template_name = 'login.html'
    