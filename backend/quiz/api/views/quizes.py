from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from ...models import Quiz, Subject, QuizTakers
from ..serializers.quizes import QuizSerializer
from ..serializers.quiztaker import QuizTakerSerializer
from core.utils.unique_slug import unique_slug


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


class ReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS


class ListCreateQuiz(APIView):
    """List Create Quiz"""
    permission_classes = [permissions.IsAuthenticated, IsTeacher | ReadOnly]

    def get(self, request):
        user = request.user
        quizzes = user.quizes.all()
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = request.user
        request.data["slug"] = unique_slug(5)
        subject_name = request.data["subject"]
        subject = Subject.objects.filter(name=subject_name).first()
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=user, subject=subject)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class DetailQuiz(APIView):
    """ Detail Update Quiz"""
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        user = self.request.user
        slug = self.kwargs["slug"]
        quiz = user.quizes.filter(slug=slug).first()
        return quiz

    def get(self, request, *args, **kwargs):
        # quiz = self.get_queryset()
        # quiz.owner == request.user
        # self.check_object_permissions(self.request, quiz)
        slug = self.kwargs["slug"]
        quiz = Quiz.objects.filter(slug=slug).first()
        if quiz:
            serializer = QuizSerializer(quiz)
            return Response(serializer.data)
        return Response({'error': "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        quiz = self.get_queryset()
        user = self.request.user
        if quiz and quiz.owner == request.user:
            serializer = QuizSerializer(
                quiz, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(owner=user)
                json = serializer.data
                return Response(json, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': "Not Found"}, status=status.HTTP_404_NOT_FOUND)


class ListQuizTakers(APIView):
    def get(self, request, *args, **kwargs):
        slug = kwargs["slug"]

        quiz = Quiz.objects.filter(slug=slug).first()
        quizTakers = quiz.quiz_takers.all()
        serializer = QuizTakerSerializer(quizTakers, many=True)
        json = serializer.data
        # json.quiz = quiz
        return Response(json)


class DeleteQuiz(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def post(self, request, *args, **kwargs):
        user = request.user
        slug = kwargs["slug"]
        quiz = user.quizes.filter(slug=slug).first()
        if quiz:
            serializer = QuizSerializer(quiz)
            quiz = quiz.delete()
            return Response(serializer.data)
        return Response("you can't delete it ")
