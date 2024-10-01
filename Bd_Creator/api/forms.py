from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from .models import CustomUser
from .models import Project, Category
from .models import Category

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['button_name', 'parent']

class CustomAuthenticationForm(AuthenticationForm):
   
    pass

class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True, help_text="Введите ваш адрес электронной почты")

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user
    
class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['name', 'tg_token', 'head_categories']

    # Переопределяем поле head_categories для корректного отображения в форме
    head_categories = forms.ModelMultipleChoiceField(
        queryset=Category.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=True
    )


class CustomAuthenticationForm(AuthenticationForm):
    # Добавление нового поля, например, "remember me"
    remember_me = forms.BooleanField(required=False, label='Запомнить меня')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Добавление класса CSS к полям формы
        self.fields['username'].widget.attrs.update({'class': 'form-control'})
        self.fields['password'].widget.attrs.update({'class': 'form-control'})