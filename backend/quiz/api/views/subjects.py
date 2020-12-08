from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from ...models import Quiz, Subject
from ..serializers.subject import SubjectSerializer


class ListCreateSubjects(APIView):

    def get(self, request):
        user = request.user
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)
