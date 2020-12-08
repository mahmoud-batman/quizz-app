from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from ...models import Quiz
from ..serializers.questions import QuestionSerializer
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


class ListCreateQuestions(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        user = self.request.user
        slug = self.kwargs["slug"]
        quiz = user.quizes.filter(slug=slug).first()
        return quiz

    def get(self, request, *args, **kwargs):
        quiz = self.get_queryset()
        questions = quiz.questions.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        quiz = self.get_queryset()
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(quiz=quiz)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class DetailQuestion(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_quiz_queryset(self):
        user = self.request.user
        slug = self.kwargs["slug"]
        quiz = user.quizes.filter(slug=slug).first()
        return quiz

    def get_queryset(self):
        id = self.kwargs["pk"]
        quiz = self.get_quiz_queryset()
        question = quiz.questions.filter(id=id).first()
        return question

    def get(self, request, *args, **kwargs):
        question = self.get_queryset()
        if question:
            serializer = QuestionSerializer(question)
            return Response(serializer.data,  status=status.HTTP_200_OK)
        return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        question = self.get_queryset()
        if question:
            serializer = QuestionSerializer(
                question, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                # serializer.save(quiz=self.get_quiz_queryset())
                return Response(serializer.data,  status=status.HTTP_200_OK)
            return Response(serializer.error, status=status.HTTP_404_NOT_FOUND)


class DeleteQuestion(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        user = self.request.user
        id = self.kwargs["pk"]
        slug = self.kwargs["slug"]
        question = user.quizes.filter(
            slug=slug).first().questions.filter(id=id).first()
        return question

    def post(self, request, *args, **kwargs):
        question = self.get_queryset()
        if question:
            serializer = QuestionSerializer(question)
            question = question.delete()
            return Response(serializer.data,  status=status.HTTP_200_OK)
        return Response("you can't delete it ")


class ListQuizQuestions(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        slug = self.kwargs["slug"]
        quiz = Quiz.objects.filter(slug=slug).first()
        return quiz

    def get(self, request, *args, **kwargs):
        quiz = self.get_queryset()
        questions = quiz.questions.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)
