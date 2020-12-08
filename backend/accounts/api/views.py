from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserLoginSerializer
from rest_framework.authtoken.models import Token
from rest_framework import authentication, permissions
from core.utils.unique_slug import unique_integer_generator
from django.db.models import Q
from django.core.paginator import Paginator


class IsAnonymous(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_anonymous


class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff


class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_teacher


class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        uuid = view.kwargs['uuid']
        user = get_user_model().objects.filter(id=uuid).first()
        if user:
            return user.id == request.user.id


class Users(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """if staff return all , if teacher return students"""
        user = self.request.user
        if user.is_staff:
            return get_user_model().objects.all()
        elif user.is_teacher:
            return get_user_model().objects.filter(is_staff=False).filter(is_teacher=False)

    def get(self, request, *args, **kwargs):
        qs = self.get_queryset()
        # page_number = request.query_params.get('page_number', 1)
        # page_size = request.query_params.get('page_size', 1)
        # paginator = Paginator(qs, page_size)

        # serializer = UserSerializer(paginator.page(
        #     page_number), many=True, context={'request': request})
        serializer = UserSerializer(
            qs, many=True, context={'request': request})

        return Response(serializer.data)


class CreateUser(APIView):
    """staff members can add new users"""
    permission_classes = [permissions.IsAuthenticated & IsStaff]
    # permission_classes = [IsAnonymous]

    def post(self, request, *args, **kwargs):
        print("is_staff >>>> ", request.user.is_staff)
        if request.data["user_id"] == "":
            instance = get_user_model().objects.first()
            request.data["user_id"] = unique_integer_generator(instance)
        serializer = UserSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token = Token.objects.create(user=user)
                json = serializer.data
                json['id'] = user.id
                json['user_id'] = user.user_id
                json['full_name'] = user.fullname
                json['token'] = token.key
                json['is_teacher'] = user.is_teacher
                json['is_staff'] = user.is_staff
                return Response(json, status=status.HTTP_201_CREATED)

            # data : return all data # validated_data : return the only fields that validated
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class SignUp(APIView):
    permission_classes = [IsAnonymous]

    def post(self, request, *args, **kwargs):
        if request.data["user_id"] == "":
            instance = get_user_model().objects.first()
            request.data["user_id"] = unique_integer_generator(instance)
        serializer = UserSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token = Token.objects.create(user=user)
                json = serializer.data
                json['id'] = user.id
                json['user_id'] = user.user_id
                json['full_name'] = user.fullname
                json['token'] = token.key
                json['is_teacher'] = user.is_teacher
                json['is_staff'] = user.is_staff
                return Response(json, status=status.HTTP_201_CREATED)

            # data : return all data # validated_data : return the only fields that validated
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class LoginUser(APIView):
    permission_classes = [IsAnonymous]

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'id': user.id,
                'user_id': user.user_id,
                'full_name': user.fullname,
                'is_teacher': user.is_teacher,
                'is_staff': user.is_staff
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetailUpdateUser(APIView):
    permission_classes = [permissions.IsAuthenticated & IsStaff | IsOwner]

    def get_object(self):
        user = self.request.user
        uuid = self.kwargs.get("uuid")
        obj = get_user_model().objects.filter(id=uuid)
        return obj

    def get(self, request, *args, **kwargs):
        ''' only Staff and the user itself can see'''

        qs = self.get_object()
        is_exists = qs.exists()
        user = qs.first()
        if is_exists:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "User Not Found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        ''' only Staff and user itself can update'''

        qs = self.get_object()
        is_exists = qs.exists()
        user = qs.first()
        if is_exists:
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
        return Response({"Not Exists"}, status=status.HTTP_404_NOT_FOUND)


class DeleteUser(APIView):
    """ only super user can delete users """
    permission_classes = [permissions.IsAuthenticated & IsStaff]

    def get_object(self):
        user = self.request.user
        uuid = self.kwargs.get("uuid")
        obj = get_user_model().objects.filter(id=uuid)
        return obj

    def post(self, request, *args, **kwargs):
        qs = self.get_object()
        is_exists = qs.exists()
        user = qs.first()
        if is_exists:
            serializer = UserSerializer(user)
            user.delete()
            return Response(serializer.data)
        else:
            return Response({"error": "you can't delete the user"}, status=status.HTTP_403_FORBIDDEN)
