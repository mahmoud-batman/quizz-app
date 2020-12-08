from django.db import models
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from core.utils.unique_slug import unique_slug_generator
import uuid


class Subject(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=70, null=True, blank=True)

    def __str__(self):
        return self.name


class Quiz(models.Model):
    owner = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="quizes"
    )
    subject = models.ForeignKey(
        'Subject', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    questions_count = models.IntegerField(default=0)
    description = models.CharField(max_length=70, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)
    roll_out = models.BooleanField(default=False)
    training = models.BooleanField(default=False)
    time = models.IntegerField(default=1)

    class Meta:
        ordering = ['created', ]
        verbose_name_plural = 'Quizzes'

    def __str__(self):
        return self.name


@receiver(pre_save, sender=Quiz)
def slugify_title(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = unique_slug_generator(instance)


class Question(models.Model):
    quiz = models.ForeignKey(
        'Quiz', on_delete=models.CASCADE, related_name='questions')
    text = models.CharField('Question', max_length=255)
    # slug = models.SlugField(unique=True, null=True, blank=True)

#   order = models.IntegerField(default=0) # auto increment

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(
        'Question', on_delete=models.CASCADE, related_name="answers")
    text = models.CharField('Answer', max_length=255)
    is_correct = models.BooleanField('Correct answer', default=False)
    # slug = models.SlugField(unique=True, null=True, blank=True)

    def __str__(self):
        return self.text


class QuizTakers(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    quiz = models.ForeignKey(
        'Quiz', related_name="quiz_takers", on_delete=models.CASCADE)
    correct_answers = models.IntegerField(default=0)
    online = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.fullname

    class Meta:
        unique_together = ['user', 'quiz']


class Response(models.Model):
    quiztaker = models.ForeignKey(
        'QuizTakers', related_name="responses", on_delete=models.CASCADE)
    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    answer = models.ForeignKey(
        Answer, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.question.text


@receiver(post_save, sender=Quiz)
def set_default_quiz(sender, instance, created, **kwargs):
    quiz = Quiz.objects.filter(id=instance.id)
    quiz.update(questions_count=instance.questions.filter(
        quiz=instance.pk).count())


@receiver(post_save, sender=Question)
def set_default(sender, instance, created, **kwargs):
    quiz = Quiz.objects.filter(id=instance.quiz.id)
    quiz.update(questions_count=instance.quiz.questions.filter(
        quiz=instance.quiz.pk).count())
