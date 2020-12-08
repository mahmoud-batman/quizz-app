
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/accounts/', include('accounts.api.urls', namespace='accounts')),
    path('api/v1/quiz/', include('quiz.api.urls', namespace='quiz')),
]
