import random
import string

from django.utils.text import slugify
from django.contrib.auth import get_user_model

'''
random_string_generator is located here:
http://joincfe.com/blog/random-string-generator-in-python/
'''

DONT_USE = ['create']


def random_string_generator(size=10, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


# def random_unique_integer_generator(instance, new_user_id=None):
#     if new_user_id is not None:
#         user_id = new_user_id
#     else:
#         user_id = random.randint(10000, 99999)
#     Klass = instance.__class__
#     qs_exists = Klass.objects.filter(user_id=user_id).exists()
#     if qs_exists:
#         new_user_id = random.randint(10000, 99999)
#         return unique_integer_generator(instance, new_user_id=new_user_id)
#     return user_id


def unique_integer_generator(instance, new_user_id=None):
    if new_user_id is not None:
        user_id = new_user_id
    else:
        user_id = get_user_model().objects.last().user_id + 1
    Klass = instance.__class__
    qs_exists = Klass.objects.filter(user_id=user_id).exists()
    if qs_exists:
        new_user_id = user_id + 1
        return unique_integer_generator(instance, new_user_id=new_user_id)
    return user_id


def unique_slug_generator(instance, new_slug=None):
    """
    This is for a Django project and it assumes your instance 
    has a model with a slug field and a title character (char) field.
    """
    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(instance.name)

    if slug in DONT_USE:
        new_slug = "{randstr}".format(
            randstr=random_string_generator(size=5)
        )
        return unique_slug_generator(instance, new_slug=new_slug)
    Klass = instance.__class__
    qs_exists = Klass.objects.filter(slug=slug).exists()
    if qs_exists:
        new_slug = "{randstr}".format(
            randstr=random_string_generator(size=5)
        )
        return unique_slug_generator(instance, new_slug=new_slug)
    return slug


def unique_slug(size):
    return "{randstr}".format(
        randstr=random_string_generator(size=size)
    )
