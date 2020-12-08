from rest_framework import serializers
from ...models import Question, Answer
from .answers import AnswerSerializer


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'answers']
        read_only_field = ['id']

    def create(self, validated_data, *args, **kwargs):

        print(validated_data)
        answers_data = validated_data.pop("answers")
        question = Question.objects.create(**validated_data)
        for answer in answers_data:
            answer = Answer.objects.create(question=question, **answer)
        return question

    def update(self, instance, validated_data):
        instance.text = validated_data.get('text', instance.text)
        # answers_data = validated_data.get("answers")

        # if answers_data:
        #     for answer in answers_data:
        #         #         # instance.answers = validated_data("answers", instance.answers)
        #         print(answer.get("text"))

        instance.save()
        return instance
