
from django.contrib import admin
from django.urls import path, include
from .views.quizes import ListCreateQuiz, DetailQuiz, DeleteQuiz, ListQuizTakers
from .views.questions import ListCreateQuestions, DetailQuestion, ListQuizQuestions, DeleteQuestion
from .views.answers import DetailAnswer
from .views.subjects import ListCreateSubjects
from .views.quiztaker import ListCreateQuizTaker, GetQuiz, GetResult, DeleteQuizTaker
from .views.response import ListCreateResponse
from .views.listeningQuestions import ListCreateListeningQuestions

app_name = "quiz"


urlpatterns = [
    path('', ListCreateQuiz.as_view()),
    path('subjects/', ListCreateSubjects.as_view()),
    ########################### Student #######################################
    path('quiztaker/<int:pk>/result/', GetResult.as_view()),  # pk :quizTakerId

    path('quiztaker/<int:pk>/response/',
         ListCreateResponse.as_view()),  # pk :quizTakerId
    path('quiztaker/<slug:slug>/questions/',  # slug : Quiz slug
         ListQuizQuestions.as_view()),
    path('quiztaker/<slug:slug>/',  # slug : Quiz slug
         GetQuiz.as_view()),
    # create quiz taker with start quiz
    path('quiztaker/', ListCreateQuizTaker.as_view()),


    ############################ Teacher #######################################
    path('<slug:slug>/questions/<int:pk>/answers/<int:answer_pk>/',
         DetailAnswer.as_view()),
    path('<slug:slug>/questions/<int:pk>/delete/', DeleteQuestion.as_view()),
    path('<slug:slug>/questions/<int:pk>/', DetailQuestion.as_view()),
    path('<slug:slug>/questions/', ListCreateQuestions.as_view()),
#     path('<slug:slug>/listening-questions/', ListCreateListeningQuestions.as_view()),
    path('<slug:slug>/delete/', DeleteQuiz.as_view()),
    # path('<slug:slug>/questions/<int:pk>/answers/<int:pk>/', ListCreateQuestions.as_view()),
    path('<slug:slug>/quiztaker/<int:pk>/delete/', DeleteQuizTaker.as_view()),
    path('<slug:slug>/quiztaker/', ListQuizTakers.as_view()),
    path('<slug:slug>/', DetailQuiz.as_view()),
]
