# Generated by Django 3.1.2 on 2020-11-05 01:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0016_quiztakers_online'),
    ]

    operations = [
        migrations.AlterField(
            model_name='response',
            name='quiztaker',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='responses', to='quiz.quiztakers'),
        ),
    ]