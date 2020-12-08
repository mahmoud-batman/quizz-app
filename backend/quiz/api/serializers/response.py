from rest_framework import serializers
from ...models import Response
from .quiztaker import QuizTakerSerializer
from .questions import QuestionSerializer
from .answers import AnswerSerializer


class ResponseSerializer(serializers.ModelSerializer):
    quiztaker = QuizTakerSerializer(read_only=True)
    # question = QuestionSerializer()
    # answer = AnswerSerializer()

    class Meta:
        model = Response
        fields = ['quiztaker',
                  'question',
                  'answer',
                  ]

    def create(self, validated_data, *args, **kwargs):
        response = Response.objects.create(**validated_data)
        return response
