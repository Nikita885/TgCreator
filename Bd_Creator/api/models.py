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
    parents = models.ManyToManyField('self', symmetrical=False, related_name='children', blank=True)
    parentMas = models.ManyToManyField('self', symmetrical=False, related_name='childrenMas', blank=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='categories', verbose_name="Проект")  # Связь с проектом
    message = models.TextField(blank=True, default='')
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='owned_categories', verbose_name="Владелец")
    conditionX = models.CharField(max_length=255, default='50%')
    conditionY = models.CharField(max_length=255, default='50%')
    color = models.CharField(max_length=255, default='rgb(0, 0, 0)')
    
    def save(self, *args, **kwargs):
        # Save the category first to ensure it has an ID
        super().save(*args, **kwargs)
        
        # If the category has no parents, it is a head category
        if not self.parents.exists():
            # If the category has no project_id, create a new project
            if self.project_id is None:
                self.project_id = self.generate_project_id()
                super().save(*args, **kwargs)  # Save again to update project_id

            # Add the category to the project's head categories
            self.project_id.head_categories.add(self)
        else:
            # If the category has parents, inherit the project_id from the first parent
            self.project_id = self.parents.first().project_id
            super().save(*args, **kwargs)  # Save again to update project_id

        # If the category has children, update their project_id
        if not self.parents.exists():
            for child in self.children.all():
                child.project_id = self.project_id
                child.save()

    def generate_project_id(self):
        # Создаём новый проект и возвращаем его
        return Project.objects.create(name=f"Project for {self.button_name}")

    def __str__(self):
        return self.button_name
