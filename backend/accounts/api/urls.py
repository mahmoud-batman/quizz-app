from django.contrib import admin
from django.urls import path, include
from .views import Users, DetailUpdateUser, CreateUser, DeleteUser, LoginUser, SignUp

app_name = 'accounts'

urlpatterns = [
    path('', Users.as_view()),
    path('create-user/', CreateUser.as_view(), name='create'),
    path('signup/', SignUp.as_view(), name='signup'),
    path('login/', LoginUser.as_view(), name='login'),
    path('<uuid:uuid>/', DetailUpdateUser.as_view(), name='detail'),
    path('<uuid:uuid>/delete/', DeleteUser.as_view()),
]
