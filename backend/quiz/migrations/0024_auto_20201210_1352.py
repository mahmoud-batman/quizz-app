# Generated by Django 3.1.4 on 2020-12-10 13:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0023_listeningquestion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listeningquestion',
            name='quiz',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listening_questions', to='quiz.quiz'),
        ),
    ]
