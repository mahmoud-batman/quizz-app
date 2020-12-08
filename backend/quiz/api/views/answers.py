from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from ...models import Question
from ..serializers.answers import AnswerSerializer
from core.utils.unique_slug import unique_slug


class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_teacher


class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        slug = view.kwargs['slug']
        quiz = user.quiz_set.filter(slug=slug).first()
        if quiz:
            return quiz.owner == request.user


# class ListCreateQuestions(APIView):
#     permission_classes = [permissions.IsAuthenticated, IsOwner]

#     def get_queryset(self):
#         user = self.request.user
#         slug = self.kwargs["slug"]
#         quiz = user.quiz_set.filter(slug=slug).first()
#         return quiz

#     def get(self, request, *args, **kwargs):
#         quiz = self.get_queryset()
#         questions = quiz.questions.all()
#         serializer = QuestionSerializer(questions, many=True)
#         return Response(serializer.data)

#     def post(self, request, *args, **kwargs):
#         quiz = self.get_queryset()
#         serializer = QuestionSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(quiz=quiz)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class DetailAnswer(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_quiz_queryset(self):
        user = self.request.user
        slug = self.kwargs["slug"]
        quiz = user.quiz_set.filter(slug=slug).first()
        return quiz

    def get_question_queryset(self):
        pk = self.kwargs["pk"]
        quiz = self.get_quiz_queryset()
        question = quiz.questions.filter(id=pk).first()
        return question

    def get_queryset(self):
        id = self.kwargs["answer_pk"]
        question = self.get_question_queryset()
        answer = question.answers.filter(id=id).first()
        return answer

    def get(self, request, *args, **kwargs):
        answer = self.get_queryset()
        if answer:
            serializer = AnswerSerializer(answer)
            return Response(serializer.data,  status=status.HTTP_200_OK)
        return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        answer = self.get_queryset()
        if answer:
            serializer = AnswerSerializer(
                answer, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(question=self.get_question_queryset())
                return Response(serializer.data,  status=status.HTTP_200_OK)
            return Response(serializer.error, status=status.HTTP_404_NOT_FOUND)
