# Generated by Django 3.1.3 on 2020-12-01 12:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0021_quiz_training'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='time',
            field=models.IntegerField(default=1),
        ),
    ]