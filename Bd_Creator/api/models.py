from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    
    pass



class Project(models.Model):
    id = models.AutoField(primary_key=True)  # Уникальный идентификатор проекта
    head_categories = models.ManyToManyField(
        'Category', related_name='head_projects', verbose_name="Головные категории", null=True,
    )  # Ссылка на несколько головных категорий проекта
    name = models.CharField(max_length=255, verbose_name="Имя проекта")  # Название проекта
    owners = models.ManyToManyField(CustomUser, related_name='owned_projects', verbose_name="Владельцы", null=True)  # Владельцы проекта
    tg_token = models.CharField(max_length=255, verbose_name="Token TG")  # Токен Telegram бота
    condition = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    button_name = models.CharField(max_length=255)
    parents = models.ManyToManyField('self', symmetrical=False, related_name='parent', blank=True)
    parentMas = models.ManyToManyField('self', symmetrical=False, related_name='childrenMas', blank=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='categories', verbose_name="Проект")  # Связь с проектом
    message = models.TextField(blank=True, default='')
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='owned_categories', verbose_name="Владелец")
    conditionX = models.CharField(max_length=255, default='50%')
    conditionY = models.CharField(max_length=255, default='50%')
    color = models.CharField(max_length=255, default='rgb(0, 0, 0)')
    children = models.ManyToManyField('self', symmetrical=False, related_name='childrens', blank=True)


    def generate_project_id(self):
        # Создаём новый проект и возвращаем его
        return Project.objects.create(name=f"Project for {self.button_name}")

    def __str__(self):
        return self.button_name
