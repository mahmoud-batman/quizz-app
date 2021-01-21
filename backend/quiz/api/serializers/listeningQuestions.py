from rest_framework import serializers
from ...models import ListeningQuestion


class ListeningQuestionSerializer(serializers.ModelSerializer):
    # file = serializers.FileField(max_length=None, allow_empty_file=False)

    class Meta:
        model = ListeningQuestion
        # fields = "__all__"
        fields = ['id', 'file']
        read_only_field = ['id']

    def create(self, validated_data, *args, **kwargs):
        # answers_data = validated_data.pop("answers")
        listening_question = ListeningQuestion.objects.create(**validated_data)
        # for answer in answers_data:
        #     answer = Answer.objects.create(question=question, **answer)
        return listening_question
