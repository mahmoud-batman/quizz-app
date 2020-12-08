from rest_framework import serializers
from ...models import Subject


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"
    #     fields = ['id', 'text', 'is_correct']
    #     read_only_field = ['id', ]

    # def update(self, instance, validated_data):
    #     instance.text = validated_data.get("text", instance.text)
    #     instance.save()
    #     return instance
