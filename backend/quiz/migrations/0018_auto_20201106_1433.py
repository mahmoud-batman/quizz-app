# Generated by Django 3.1.2 on 2020-11-06 14:33

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('quiz', '0017_auto_20201105_0104'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='quiztakers',
            unique_together={('user', 'quiz')},
        ),
    ]
