# Generated by Django 3.1.2 on 2020-11-15 15:31

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='user_id',
            field=models.IntegerField(blank=True, null=True, unique=True, validators=[django.core.validators.MaxValueValidator(99999), django.core.validators.MinValueValidator(10000)]),
        ),
    ]