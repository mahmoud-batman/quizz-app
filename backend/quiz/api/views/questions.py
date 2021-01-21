from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from ...models import Quiz
from ..serializers.questions import QuestionSerializer
from core.utils.unique_slug import unique_slug
from rest_framework.parsers import MultiPartParser, FormParser

import json
import os
import core.settings.base as settings

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
    parser_classes = (MultiPartParser, FormParser)

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
        print(request.data)

        final_dictionary = json.loads(request.data["question"])
        data = {}
        if request.data.get("file") != 'null':
            data["file"] = request.data.get("file")
        data["text"] = final_dictionary["text"]
        data["answers"] = final_dictionary["answers"]
        data["time"] = final_dictionary["time"]
        quiz = self.get_queryset()
        serializer = QuestionSerializer(data=data)
        if serializer.is_valid():
            serializer.save(quiz=quiz)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class DetailQuestion(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_question(self):
        user = self.request.user
        slug = self.kwargs["slug"]
        id = self.kwargs["pk"]
        quiz = user.quizes.filter(slug=slug).first()
        question =  quiz.questions.filter(id=id).first()
        return question

    def get(self, request, *args, **kwargs):
        question = self.get_question()

        if question:
            serializer = QuestionSerializer(question)
            json = serializer.data
            json["file"] = question.filename()
            # print(question.filename())
            return Response(json,  status=status.HTTP_200_OK)
        return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    # def post(self, request, *args, **kwargs):
    #     question = self.get_queryset()
    #     print(request.data)
    #     # final_dictionary = json.loads(request.data["question"])
    #     # already in question !!!!!
    #     data = {}
    #     if request.data.get("file") != 'null':
    #         data["file"] = request.data.get("file")
    #     data["text"] = final_dictionary["text"]
    #     data["answers"] = final_dictionary["answers"]
    #     data["time"] = final_dictionary["time"]
    #     if question:
    #         serializer = QuestionSerializer(
    #             question, data=data, partial=True)
    #         if serializer.is_valid():
    #             serializer.save()
    #             # serializer.save(quiz=self.get_quiz_queryset())
    #             return Response(serializer.data,  status=status.HTTP_200_OK)
    #         return Response(serializer.error, status=status.HTTP_404_NOT_FOUND)

    def post(self,request,*args, **kwargs):

        question = self.get_question()
        print(request.data)
        """
        file : file, new file

        file : null, no chosen file

        file : name, not changed
        """
        # file : delete

        final_dictionary = json.loads(request.data["question"])

        if ( final_dictionary.get("text") == "") and \
            (request.data.get("file") == "null"):
            print("question must have a text or file")
            return Response({"error" : "question must have a text or file"}, status=status.HTTP_404_NOT_FOUND)

        if question.file and request.data.get("file") == 'null' :
            print("DELETED")
            os.remove(os.path.join(settings.MEDIA_ROOT, str(question.file)))
            question.file = None
            question.time = 0
            question.save()

        data = {}
        try:
            if request.data.get("file").size > 0 :
                data["file"] = request.data.get("file")
        except:
            pass

        data["text"] = final_dictionary.get("text")
        # data["answers"] = final_dictionary.get("answers")
        data["time"] = final_dictionary["time"]
        answers = final_dictionary.get("answers")
        for answer in answers:
            a = question.answers.get(id=answer.get("id"))
            a.text = answer.get("text")
            a.is_correct = answer.get("is_correct")
            a.save()

        # """
        # id in answers
        # """
        if question:
            serializer = QuestionSerializer(
                question, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,  status=status.HTTP_200_OK)
            return Response(serializer.error, status=status.HTTP_404_NOT_FOUND)
        return Response("Posted")

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
        user = request.user
        id = kwargs["pk"]
        slug = kwargs["slug"]
        quiz =user.quizes.filter(
            slug=slug).first()
        question = quiz.questions.filter(id=id).first()
        if question:
            serializer = QuestionSerializer(question)
            if question.file :
                os.remove(os.path.join(settings.MEDIA_ROOT, str(question.file)))
            question = question.delete()
            quiz.save()
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
