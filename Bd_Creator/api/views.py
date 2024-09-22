from rest_framework.viewsets import ModelViewSet

from .models import CustomUser, Project, Category
from .serializers import CustomUserSerializer, ProjectSerializer, CategorySerializer
from .permissions import IsOwnerOrReadOnly, IsOwner
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import RegistrationForm
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework_simplejwt.views import TokenObtainPairView


from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponseRedirect
from django.middleware.csrf import get_token
from django.contrib.auth.forms import AuthenticationForm

def register(request):
    #print(1)
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Вход сразу после регистрации
            return redirect('login')  # Перенаправление на страницу входа
    else:
        form = RegistrationForm()
    return render(request, 'register.html', {'form': form})
def home(request, exception):
    return render(request, 'test.html')

    


class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsOwnerOrReadOnly]

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
    
def generate_token(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)




class CustomLoginView(TokenObtainPairView):
    def get(self, request, *args, **kwargs):
        form = AuthenticationForm()
        return render(request, 'login.html', {'form': form})

    def post(self, request, *args, **kwargs):
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            # Получаем токен через стандартное поведение TokenObtainPairView
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                token = response.data['access']
                
                # Создаем новый ответ и сохраняем токен в куки
                res = HttpResponseRedirect('/test/')
                res.set_cookie(
                    key='access_token',
                    value=f'Bearer {token}',
                    httponly=True,
                    samesite='Strict',
                )
                res['X-CSRFToken'] = get_token(request)

                # Перенаправляем на test.html
                return res
            else:
                return JsonResponse({'message': 'Invalid credentials'}, status=400)
        else:
            return render(request, 'login.html', {'form': form})
        

def logout_view(request):
    print(1)
    response = HttpResponseRedirect('/test/')
    response.delete_cookie('access_token')  # Удаляем токен из куков
    return response