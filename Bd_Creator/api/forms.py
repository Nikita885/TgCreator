from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from .models import CustomUser

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