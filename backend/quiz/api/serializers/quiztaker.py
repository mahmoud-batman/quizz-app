from rest_framework import serializers
from ...models import QuizTakers
from accounts.api.serializers import UserSerializer
from .quizes import QuizSerializer
from django.contrib.humanize.templatetags import humanize
from datetime import datetime


class QuizTakerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # timestamp = serializers.DateTimeField(format="%Y-%m-%d at %H:%M")
    timestamp = serializers.SerializerMethodField()
    # quiz = QuizSerializer()

    class Meta:
        model = QuizTakers
        fields = ['id',
                  'user',
                  'quiz',
                  'correct_answers',
                  'completed',
                  'timestamp',
                  ]
        read_only_field = ['id']

    def get_timestamp(self, obj):
        return datetime.strftime(obj.timestamp, "%Y-%m-%d at %H:%M")
        # return humanize.naturaltime(obj.timestamp)

    def create(self, validated_data, *args, **kwargs):
        ''' we can override the create method '''
        quizTaker = QuizTakers.objects.create(**validated_data)

        return quizTaker

    def update(self, instance, validated_data):
        ''' update or put the exsiting value '''

    #     instance.name = validated_data.get('name', instance.name)
    #     instance.questions_count = validated_data.get(
    #         'questions_count', instance.questions_count)
    #     instance.roll_out = validated_data.get('roll_out', instance.roll_out)
    #     instance.subject = validated_data.get('subject', instance.subject)
    #     instance.save()
        return instance
