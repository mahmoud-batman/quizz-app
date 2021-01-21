from rest_framework import serializers
from ...models import Question, Answer
from .answers import AnswerSerializer
import json


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text','file','time', 'answers']
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
        instance.file = validated_data.get('file', instance.file)
        instance.time = validated_data.get('time', instance.time)

        # instance.answers.set(validated_data.pop("answers"))
        # answers =validated_data.get('answers')
        # answers = validated_data.pop("answers")

        # print(instance.answers.get(text=answer.text))
        # print(answers)
        # serializer = AnswerSerializer(answers, many=True, partial=True)
        # print(serializer.data)
        # for answer in answers :
            # print(answer.get("text"))
            # id = instance.answers.get(text=answer.get("text")).id
            # a = Answer.objects.filter(id=id).first()
            # print(answer)
            # a.text = "test"
            # a.text = str(answer.get("text"))
            # a.is_correct = answer.get("is_correct")
            # a.save()

        # print("instance.answers" , instance.answers)
        # print("answers" , validated_data.get('answers'))
        # instance.answers.update(validated_data.pop("answers"))
        # answers_data = validated_data.pop("answers")
        # i = 0
        # old_answers = instance.answers.all()
        # for answer in answers_data:
        #     print(answer)
        #     print(old_answers[i].is_correct)
        #     old_answers[i].update(text = answer.get("text"), is_correct = answer.get("is_correct") )
        #     # old_answers[i].is_correct =
        #     old_answers[i].save()
        #     i += 1

        # print(instance.answers.all()[0])
            # print(answer)
        # answers_data = validated_data.pop("answers")
        # for answer in answers_data :
        #     print(instance.answers.filter(answer.id))
        # instance.answers = answers_data

        # question = Question.objects.create(**validated_data)
        # for answer in answers_data:
        #     answer = Answer.objects.create(question=instance, **answer)
        # answers_data = validated_data.get("answers")
        # # print(answers_data)
        # if answers_data:
        #     # for answer in answers_data:
        #     serializer = AnswerSerializer( data = answers_data, partial=True)
        #     if serializer.is_valid():
        #         serializer.save()
                # instance.answers = AnswerSerializer(answer, data = answer)

        instance.save()
        return instance
"""
{
'text': '<p>123123</p>',
'file': <TemporaryUploadedFile: 023.mp3 (audio/mpeg)>,
'time': 4,
'answers': [
    OrderedDict([('text', 'q'), ('is_correct', False)]),
    OrderedDict([('text', 'w'), ('is_correct', False)]),
    OrderedDict([('text', '4'), ('is_correct', False)]),
    OrderedDict([('text', 'r'), ('is_correct', True)])
    ]
}
"""