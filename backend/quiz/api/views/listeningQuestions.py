from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from ...models import Quiz
from ..serializers.listeningQuestions import ListeningQuestionSerializer
from rest_framework.reverse import reverse

from rest_framework.parsers import MultiPartParser, FormParser


class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_teacher


class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        slug = view.kwargs['slug']
        quiz = user.quizes.filter(slug=slug).first()
        if quiz:
            return quiz.owner == request.user


class ListCreateListeningQuestions(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    parser_classes = (MultiPartParser, FormParser)
    """
    The parser_class is used because we are dealing with request data that comes in as FormData.
    """
    def get(self,request, *args, **kwargs):
        user = request.user
        slug = kwargs.get("slug")

        qs = user.quizes.filter(slug=slug).first().listening_questions.all()
        serializer = ListeningQuestionSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = request.user
        slug = kwargs.get("slug")
        quiz = user.quizes.filter(slug=slug).first()
        print(request.data)
        # print(quiz)
        serializer = ListeningQuestionSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(quiz=quiz)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


