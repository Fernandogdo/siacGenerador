from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from django.contrib.auth import login as django_login, logout as django_logout
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin, DestroyModelMixin

from .serializers import ConfiguracionCv_PersonalizadoSerializer, LoginSerializer

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import DocenteSerializer
# Create your views here.


from . import models
from . import serializers


class AdministradorView(viewsets.ModelViewSet):
    queryset = models.Administrador.objects.all()
    serializer_class = serializers.AdministradorSerializer


class ConfiguracionCvView(viewsets.ModelViewSet):

    queryset = models.ConfiguracionCv.objects.all()
    serializer_class = serializers.ConfiguracionCvSerializer


class ConfiguracionCv_PersonalizadoView(viewsets.ModelViewSet):

    queryset = models.ConfiguracionCv_Personalizado.objects.all()
    serializer_class = serializers.ConfiguracionCv_PersonalizadoSerializer


class DocenteView(viewsets.ModelViewSet):
    queryset = models.Docente.objects.all()
    serializer_class = serializers.DocenteSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
                permission_classes = []
        else:
                permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        test = DocenteSerializer(user)
        django_login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": test.data}, status=200)

class BloqueView(viewsets.ModelViewSet):
    queryset = models.Bloque.objects.all()
    serializer_class = serializers.BloqueSerializer

class PersonalizacionUsuario(generics.ListAPIView):
    serializer_class = ConfiguracionCv_PersonalizadoSerializer
    # queryset = models.ConfiguracionCv_Personalizado.objects.all()

    def get_queryset(self):
        id_user = self.kwargs['id_user']
        return models.ConfiguracionCv_Personalizado.objects.filter(id_user=id_user)

        # queryset = models.ConfiguracionCv_Personalizado.objects.all()
        # id_user = self.request.query_params.get('id_user', None)
        # if id_user:
        #    return models.ConfiguracionCv_Personalizado.objects.filter(id_user=id_user)
        # return models.ConfiguracionCv_Personalizado.none()