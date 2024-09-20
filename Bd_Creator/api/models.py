from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    pass


class Category(models.Model):
    button_name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    project_id = models.IntegerField(null=True, blank=True)  # Поле для ID проекта
    message = models.TextField(blank=True, default='')

    def save(self, *args, **kwargs):
        # Если у текущего объекта нет родителя, то это "голова" и устанавливаем проект ID
        if self.parent is None and self.project_id is None:
            self.project_id = self.generate_project_id()

        # Если у текущего объекта есть родитель, наследуем проект ID от родителя
        if self.parent is not None:
            self.project_id = self.parent.project_id

        super().save(*args, **kwargs)

        # Если объект имеет дочерние элементы, присваиваем им тот же проект ID
        if self.parent is None:
            for child in self.children.all():
                child.project_id = self.project_id
                child.save()

    def generate_project_id(self):
        return Category.objects.aggregate(max_id=models.Max('project_id'))['max_id'] + 1 if Category.objects.exists() else 1

    def __str__(self):
        return self.button_name



class Project(models.Model):
    id = models.AutoField(primary_key=True)  # Уникальный идентификатор проекта
    head_category = models.ForeignKey(
        'Category', on_delete=models.SET_NULL, null=True, related_name='head_projects', verbose_name="Голова категорий"
    )  # Ссылка на головную категорию проекта
    name = models.CharField(max_length=255, verbose_name="Имя проекта")  # Название проекта
    owners = models.ManyToManyField(CustomUser, related_name='owned_projects', verbose_name="Владельцы")  # Владельцы проекта

    tg_token = models.CharField(max_length=255, verbose_name="Token TG")  # Токен Telegram бота

    def __str__(self):
        return self.name


print(1)