# Generated by Django 3.1.2 on 2020-10-27 17:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0007_auto_20201027_1710'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quiz',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
    ]