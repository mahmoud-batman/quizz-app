# Generated by Django 3.1.2 on 2020-11-04 23:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0015_response'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiztakers',
            name='online',
            field=models.BooleanField(default=False),
        ),
    ]
