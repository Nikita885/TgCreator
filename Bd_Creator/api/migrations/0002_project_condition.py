# Generated by Django 5.1.1 on 2024-11-03 21:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='condition',
            field=models.BooleanField(default=False),
        ),
    ]