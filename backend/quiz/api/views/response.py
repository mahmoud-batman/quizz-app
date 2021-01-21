from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, status
from ..serializers.response import ResponseSerializer
from ...models import Response as StudentResponse, QuizTakers,Question,Answer


class ListCreateResponse(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """return quiz taker answers"""
        # user = request.user
        quizTakerId = kwargs["pk"]
        quizTaker = QuizTakers.objects.filter(id=quizTakerId).first()
        response = StudentResponse.objects.filter(quiztaker=quizTaker)
        serializer = ResponseSerializer(response, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """add quiz taker answers"""
        # user = request.user
        quizTakerId = kwargs["pk"]
        quizTaker = QuizTakers.objects.filter(id=quizTakerId).first()
        data = request.data["questions"]
        # question = Question.objects.first()

        if len(data) == 0:
            data = [{'question': 0 }]

        serializer = ResponseSerializer(data=data, many=True)
        if serializer.is_valid():
            serializer.save(quiztaker=quizTaker)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
