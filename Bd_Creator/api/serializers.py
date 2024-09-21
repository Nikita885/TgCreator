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
        fields = ['id', 'head_categories', 'name', 'owners', 'tg_token']

    def create(self, validated_data):
        # Удаляем поле owners из validated_data
        validated_data.pop('owners', None)
        project = Project.objects.create(**validated_data)
        # Добавляем текущего пользователя в поле owners
        project.owners.add(self.context['request'].user)
        return project



class CategoryIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id']


class CategorySerializer(serializers.ModelSerializer):
    
    children = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), allow_null=True)
    owner = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)

    class Meta:
        model = Category
        fields = ['id', 'button_name', 'parent', 'children', 'project_id', 'message', 'owner']  # Используем owner

    def get_children(self, obj):
        # Возвращаем список ID дочерних категорий
        return list(obj.children.values_list('id', flat=True))
    
    def create(self, validated_data):
        # Удаляем поле owner из validated_data, если нужно (если оно не нужно)
        owner = validated_data.pop('owner', None)
        category = Category.objects.create(**validated_data, owner=owner)  # Указываем owner при создании
        return category