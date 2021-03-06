from rest_framework import serializers
from ...models import Answer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']
        read_only_field = ['id', ]

    def update(self, instance, validated_data):
        print(validated_data )
        print(instance )
        # print(instance.get("text"))
        instance.text = validated_data.get("text", instance.text)
        instance.save()
        return instance
