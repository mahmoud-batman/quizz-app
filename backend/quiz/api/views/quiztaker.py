from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from ..serializers.quiztaker import QuizTakerSerializer
from ..serializers.quizes import QuizSerializer
from ...models import QuizTakers, Quiz, Response as QuizTakerResponse, Question


class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        slug = view.kwargs['slug']
        quiz = user.quizes.filter(slug=slug).first()
        if quiz:
            return quiz.owner == request.user


class ListCreateQuizTaker(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        quiztaker = QuizTakers.objects.all()
        serializer = QuizTakerSerializer(quiztaker, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = request.user
        quiz_id = request.data["quiz"]
        quiz = Quiz.objects.filter(id=quiz_id).first()
        alreadyExists = quiz.quiz_takers.filter(user=user).exists()

        if not alreadyExists:
            serializer = QuizTakerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
        return Response({"error": "already take this quiz"}, status=status.HTTP_404_NOT_FOUND)


class GetQuiz(APIView):
    """ Detail Update Quiz"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = self.kwargs["slug"]
        quiz = Quiz.objects.filter(slug=slug).first()
        user = request.user
        if quiz and not quiz.quiz_takers.filter(user=user).exists():
            # if quiz:
            serializer = QuizSerializer(quiz)
            return Response(serializer.data)
        return Response({'error': "Not Found"}, status=status.HTTP_404_NOT_FOUND)


class GetResult(APIView):
    """ Detail Update Quiz"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        result = 0
        pk = self.kwargs["pk"]
        quiztaker = QuizTakers.objects.filter(pk=pk).first()
        quiz = quiztaker.quiz

        quiztaker_responses = quiztaker.responses.all()
        quiz_questions = quiz.questions.all()

        for response, question in zip(quiztaker_responses, quiz_questions):

            if(response.question == question):
                for answer in question.answers.all():
                    if response.answer == answer and answer.is_correct:
                        result += 1

        quiztaker.correct_answers = result
        quiztaker.completed = True
        quiztaker.save()
        return Response({"result": quiztaker.correct_answers})


class DeleteQuizTaker(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def delete(self, request, *args, **kwargs):
        user = request.user
        slug = kwargs.get("slug")
        id = kwargs.get("pk")
        qs = user.quizes.filter(
            slug=slug).first().quiz_takers.filter(id=id)
        if qs.exists():
            quizTaker = qs.get()
            serializer = QuizTakerSerializer(quizTaker)
            quizTaker.delete()
            return Response(serializer.data,  status=status.HTTP_200_OK)
        return Response("you can't delete it ")
