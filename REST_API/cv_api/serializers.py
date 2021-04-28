from rest_framework import serializers

from .models import *


class AdministradorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Administrador
        fields = ('__all__')


class ConfiguracionCvSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConfiguracionCv
        fields = '__all__'


class DocenteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Docente()
        fields = ('__all__')


class ConfiguracionCv_PersonalizadoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConfiguracionCv_Personalizado
        fields = ('__all__')
