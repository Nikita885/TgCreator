from rest_framework import serializers
from .models import CustomUser, Project, Category



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
    

class ProjectSerializer(serializers.ModelSerializer):
    owners = serializers.PrimaryKeyRelatedField(many=True, queryset=CustomUser.objects.all())

    class Meta:
        model = Project
        fields = ['id', 'head_category', 'name', 'owners', 'tg_token']



class CategoryIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id']


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), allow_null=True)

    class Meta:
        model = Category
        fields = ['id', 'button_name', 'parent', 'children', 'project_id', 'message']

    def get_children(self, obj):
        # Возвращаем список ID дочерних категорий
        return list(obj.children.values_list('id', flat=True))
