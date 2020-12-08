from django.contrib import admin
from .models import Subject, Quiz, Question, Answer, QuizTakers, Response


admin.site.register(Subject)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(QuizTakers)
admin.site.register(Response)
