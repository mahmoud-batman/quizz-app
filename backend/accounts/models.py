from django.db import models
import uuid
from django.utils import timezone
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from core.utils.unique_slug import unique_integer_generator
from django.core.validators import MaxValueValidator, MinValueValidator, MinLengthValidator, MaxLengthValidator
from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save


# class CustomUserManager(BaseUserManager):
#    """ create user with email"""
#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError('Users must have an email address')
#         user = self.model(email=self.normalize_email(email), **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password, **extra_fields):
#         user = self.create_user(email, password)
#         user.is_superuser = True
#         user.is_staff = True
#         user.save(using=self._db)
#         return user

class CustomUserManager(BaseUserManager):

    """ create user with unique id"""

    def create_user(self, user_id, first_name, last_name,
                    password=None, **extra_fields):
        if not first_name:
            raise ValueError('Users must have a Valid name')
        user = self.model(
            user_id=user_id,
            first_name=first_name,
            last_name=last_name,
            ** extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_id, first_name,
                         last_name,  password, **extra_fields):
        user = self.create_user(
            user_id=user_id,
            first_name=first_name,
            last_name=last_name,
            password=password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    # id = models.UUIDField(default=uuid.uuid4, editable=False)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # email = models.EmailField(_("email address"), max_length=254, unique=True)
    user_id = models.IntegerField(
        validators=[
            MaxValueValidator(999999),
            MinValueValidator(100000),
        ],
        blank=True, null=True, unique=True)
    first_name = models.CharField(max_length=256, blank=True, null=True)
    last_name = models.CharField(max_length=256, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    # # USERNAME_FIELD = 'email'
    USERNAME_FIELD = 'user_id'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    @property
    def fullname(self):
        return self.first_name + " " + self.last_name

    def __str__(self):
        return self.fullname

    class Meta:
        ordering = ['-user_id']


@receiver(pre_save, sender=CustomUser)
def user_id_generator(sender, instance, *args, **kwargs):
    if not instance.user_id:
        instance.user_id = unique_integer_generator(instance)
