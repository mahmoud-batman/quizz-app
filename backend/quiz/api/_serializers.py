from rest_framework import serializers
from quiz.models import Quiz, Question, Subject, Answer
from accounts.api.serializers import UserSerializer


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'description']
        read_only_field = ['id', ]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text']
        read_only_field = ['id', ]


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question']
        read_only_field = ['id', ]


class QuizSerializer(serializers.ModelSerializer):
    # related_name=questions, in the Question model is must
    questions = QuestionSerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Quiz
        fields = [
            'id',
            'name',
            'questions_count',
            'roll_out',
            'owner',
            'subject',
            'questions',
        ]
        read_only_field = ['id', 'owner']

    def create(self, validated_data, *args, **kwargs):
        ''' we can override the create method '''
        print(validated_data)
        quiz = Quiz.objects.create(**validated_data)
        return quiz
