# Generated by Django 3.1.2 on 2020-10-27 19:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0009_auto_20201027_1903'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='answer',
            name='slug',
        ),
        migrations.RemoveField(
            model_name='question',
            name='slug',
        ),
    ]
