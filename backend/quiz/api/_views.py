from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, status

from .serializers import QuizSerializer

'''

'''


class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_teacher


class ListCreateQuiz(APIView):
    """List Create Quiz"""
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get(self, request):
        user = request.user
        quizzes = user.quiz_set.all()
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=user)
            json = serializer.data
            return Response(json, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class DetailQuiz(APIView):
    """ Detail Update Quiz"""
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get(self, request, *args, **kwargs):
        user = request.user
        id = kwargs["pk"]
        quizzes = user.quiz_set.filter(id=id)
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)
