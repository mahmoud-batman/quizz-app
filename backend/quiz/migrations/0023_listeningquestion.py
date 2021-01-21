# Generated by Django 3.1.4 on 2020-12-10 13:17

from django.db import migrations, models
import django.db.models.deletion
import quiz.models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0022_quiz_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='ListeningQuestion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to=quiz.models.user_directory_path)),
                ('quiz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listining_questions', to='quiz.quiz')),
            ],
        ),
    ]