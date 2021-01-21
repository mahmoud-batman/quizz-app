from rest_framework import serializers
from accounts.api.serializers import UserSerializer
from ...models import Quiz, Question, Answer, Subject
from ..serializers.questions import QuestionSerializer
from ..serializers.subject import SubjectSerializer

from django.db.models.signals import pre_save, post_save
from core.utils.unique_slug import unique_slug
from django.dispatch import receiver


class QuizSerializer(serializers.ModelSerializer):
    # related_name=questions, in the Question model is must
    # questions = QuestionSerializer(many=True)
    owner = UserSerializer(read_only=True)
    subject = serializers.StringRelatedField()

    class Meta:
        model = Quiz
        fields = [
            'id',
            'slug',
            'name',
            'description',
            'questions_count',
            'training',
            'time',
            'roll_out',
            'owner',
            'subject',
        ]
        read_only_field = ['id', 'owner', 'slug']

    def create(self, validated_data, *args, **kwargs):
        ''' we can override the create method '''
        # questions_data = validated_data.pop("questions")
        # subject = validated_data.pop("subject")
        print(validated_data)
        quiz = Quiz.objects.create(**validated_data)
        # Subject.objects.create(name=subject)
        return quiz

        """
         answers_data = validated_data.pop("answers")
        question = Question.objects.create(**validated_data)
        for answer in answers_data:
            answer = Answer.objects.create(question=question, **answer)
        return question
        """

    def update(self, instance, validated_data):
        ''' update or put the exsiting value '''

        print(instance)
        instance.name = validated_data.get('name', instance.name)
        instance.questions_count = validated_data.get(
            'questions_count', instance.questions_count)
        instance.roll_out = validated_data.get('roll_out', instance.roll_out)
        instance.training = validated_data.get('training', instance.training)
        instance.time = validated_data.get('time', instance.time)
        instance.subject = validated_data.get('subject', instance.subject)
        instance.save()
        return instance


# @receiver(pre_save, sender=QuizSerializer)
# def slugify_title(sender, instance, *args, **kwargs):
#     # if not instance.slug:
#     instance.slug = unique_slug_generator(instance)
