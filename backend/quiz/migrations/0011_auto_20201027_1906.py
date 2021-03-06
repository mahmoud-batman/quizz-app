# Generated by Django 3.1.2 on 2020-10-27 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0010_auto_20201027_1905'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='question',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
    ]
