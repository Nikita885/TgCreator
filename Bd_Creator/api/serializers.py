from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'password']  # Добавляем 'password' в fields

    def create(self, validated_data):
        # Убираем пароль из валидированных данных для хеширования
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)  # Хешируем пароль перед сохранением
        user.save()
        return user