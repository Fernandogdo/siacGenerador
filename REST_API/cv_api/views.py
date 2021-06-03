from .generapdf import PDF
from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from django.contrib.auth import login as django_login, logout as django_logout
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from .serializers import ConfiguracionCv_PersonalizadoSerializer, LoginSerializer

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import DocenteSerializer
# Create your views here.

from . import models
from . import serializers
import requests

# from config.wsgi import *
# from django.template.loader import get_template
# import webbrowser

# from pyfpdf import FPDF
from fpdf import FPDF
from django.http import HttpResponse

import pandas as pd


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


def some_view(request):
    # Create the HttpResponse object with the appropriate PDF headers.

    pdfreport = FPDF()
    pdfreport.add_page()
    pdfreport.set_font('Arial', 'B', 16)
    pdfreport.cell(40, 10, 'Hola Mundo!')
    pdf = pdfreport.output(dest='S').encode('latin-1')
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="mypdf.pdf"'
    return(response)


# Instantiation of inherited classG

def generaPdf(request):
    
    r = requests.get('https://sica.utpl.edu.ec/ws/api/docentes/1/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
                     
   
    todos = r.json()
    
    # # stu = models.ConfiguracionCv_Personalizado.objects.filter(id_user=4)
    # serializer = ConfiguracionCv_PersonalizadoSerializer(models.ConfiguracionCv_Personalizado.objects.filter(id_user=4), many=True)
    # # print(serializer.data)
    # json_data = JSONRenderer().render(serializer.data)
    # # print(json_data)

    model_dict = models.ConfiguracionCv_Personalizado.objects.all().values()
    print('diccionario----------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', model_dict.filter(id_user=4))

    filtrado_usario = model_dict.filter(id_user=4)
  
    personalizados = [               
    {
        "id": 6,
        "configuracionId": 1,
        "bloque": "Articulos",
        "atributo": "id",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "id",
        "cv": "1",
        "nombre_cv": "data",
        "fecha_registro": "2021-05-27T17:48:00.574681Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 7,
        "configuracionId": 2,
        "bloque": "Articulos",
        "atributo": "titulo",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "Titulo",
        "cv": "1",
        "nombre_cv": "data",
        "fecha_registro": "2021-05-27T17:48:00.598868Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 8,
        "configuracionId": 1,
        "bloque": "Articulos",
        "atributo": "id",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "id",
        "cv": "1",
        "nombre_cv": "data",
        "fecha_registro": "2021-05-27T17:48:00.896109Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 9,
        "configuracionId": 4,
        "bloque": "Articulos",
        "atributo": "keywords",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "keywords",
        "cv": "1",
        "nombre_cv": "data",
        "fecha_registro": "2021-05-27T17:48:00.900139Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 10,
        "configuracionId": 1,
        "bloque": "Articulos",
        "atributo": "id",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "id",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.225864Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 11,
        "configuracionId": 2,
        "bloque": "Articulos",
        "atributo": "titulo",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "Titulo",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.252568Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 12,
        "configuracionId": 3,
        "bloque": "Articulos",
        "atributo": "descripcion",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "Descripcion",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.267238Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 13,
        "configuracionId": 4,       
        "bloque": "Articulos",
        "atributo": "nombre_proyecto",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "Nombre Proyecto",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.460508Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 14,
        "configuracionId": 5,
        "bloque": "Articulos",
        "atributo": "link_articulo",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "Link Articulo",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.540325Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 14,
        "configuracionId": 5,
        "bloque": "Proyectos",
        "atributo": "codigo_proyecto",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "Codigo Proyecto",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.540325Z",
        "cedula": "123",
        "id_user": 3
    },
     {
        "id": 14,
        "configuracionId": 5,
        "bloque": "Proyectos",
        "atributo": "fecha_inicio",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "Fecha Inicio",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.540325Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 14,
        "configuracionId": 5,
        "bloque": "Proyectos",
        "atributo": "porcentaje_avance",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "Porcentaje Avance",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.540325Z",
        "cedula": "123",
        "id_user": 3
    },
     {
        "id": 14,
        "configuracionId": 5,
        "bloque": "Proyectos",
        "atributo": "nombre_proyecto",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "Nombre Proyecto",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.540325Z",
        "cedula": "123",
        "id_user": 3
    },
    ]
    
    proyectos = [
         {
            "id": 1,
            "fecha_inicio": "2005-02-01",
            "fecha_cierre": "2012-01-01",
            "codigo_proyecto": "Codigo Proyecto prueb 00022423",
            "nombre_proyecto": "Diferentes Investigaciones dentro del Marco del Convenio Interinstitucional con la DPS-L, para el Rescate y Validacion del Conocimiento Tradicional del Pueblo Saraguro",
            "descripcion": "",
            "tipo_proyecto": 65,
            "incluye_estudiantes": "si",
            "incluye_financ_externo": "no",
            "cobertura_proyecto": 63,
            "reprogramado": "No",
            "porcentaje_avance": "100.00",
            "fondo_utpl": "0.00",
            "fondo_externo": "0.00",
            "total_general": "0.00",
            "estado": "finalizado",
            "programa": "Biológica",
            "objetivos": "",
            "moneda": "",
            "presupuesto": "0.00",
            "clase_proyecto": "",
            "tipo_investigacion": "",
            "area_unesco": "",
            "participacion_extranjera": "no",
            "smartland": "no",
            "fecha_reprogramacion": "",
            "observaciones": "",
            "fondo_externo_especie": "0.00",
            "fondo_externo_efectivo": "0.00",
            "alumnos": 0,
            "fecha_suspension": "",
            "fecha_activacion": "",
            "porcentaje_esperado": "0.00",
            "especie": "no",
            "linea_investigacion": "",
            "tipo_convocatoria": "",
            "area_conocimiento": "",
            "sub_area_conocimiento": "",
            "area_conocimiento_especifica": "",
            "titulacion": "",
            "observatorio": "",
            "ods": "",
            "organizacion": "",
            "programa_investigacion": ""
        },
        {
            "id": 3,
            "fecha_inicio": "2008-01-01",
            "fecha_cierre": "2012-06-30",
            "codigo_proyecto": "PROY_CBCM_0011",
            "nombre_proyecto": "PROSPECCION DE PRINCIPIOS ACTIVOS ANTICANCEROSOS DE LA FLORA DEL SUR DEL ECUADOR.",
            "descripcion": "El cancer constituye una de las principales causas de muerte, se estima que para el 2020 cerca de 13 millones de personas falleceran por esta enfermedad. Por tanto, el cancer constituye un problema de salud mundial y ocupa un lugar de importancia en lo",
            "tipo_proyecto": 65,
            "incluye_estudiantes": "no",
            "incluye_financ_externo": "no",
            "cobertura_proyecto": 63,
            "reprogramado": "SI",
            "porcentaje_avance": "100.00",
            "fondo_utpl": "93801.78",
            "fondo_externo": "24275.00",
            "total_general": "118076.78",
            "estado": "finalizado",
            "programa": "Ciencias Biomedicas",
            "objetivos": "",
            "moneda": "",
            "presupuesto": "118076.78",
            "clase_proyecto": "",
            "tipo_investigacion": "",
            "area_unesco": "",
            "participacion_extranjera": "no",
            "smartland": "no",
            "fecha_reprogramacion": "",
            "observaciones": "",
            "fondo_externo_especie": "0.00",
            "fondo_externo_efectivo": "0.00",
            "alumnos": 0,
            "fecha_suspension": "",
            "fecha_activacion": "",
            "porcentaje_esperado": "0.00",
            "especie": "no",
            "linea_investigacion": "",
            "tipo_convocatoria": "",
            "area_conocimiento": "",
            "sub_area_conocimiento": "",
            "area_conocimiento_especifica": "",
            "titulacion": "",
            "observatorio": "",
            "ods": "",
            "organizacion": "",
            "programa_investigacion": ""
        },
    ]
     
    bloque = [ d["bloque"] for d in personalizados ]
    bloques = pd.unique(bloque)
    print('bloques--->>>>>', bloques)

    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in bloques:
      visibles = [ d["atributo"]  for d in personalizados if d.get("visible_cv_personalizado") and d.get('bloque') == i]
      visibilizados = pd.unique(visibles)
      diccionario[i] = visibilizados
    print('visiblesArticulos========>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', diccionario)


    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    for i in bloques:
      mapeo = [ d["mapeo"] for d in personalizados if d.get("visible_cv_personalizado") and d.get('bloque') == i]
      mapeados = pd.unique(mapeo)
    print('mapeo--->>>>>', mapeados)

    filtrados = [ { atributo: d.get(atributo) for atributo in diccionario['Proyectos'] if d.get(atributo) != None} for d in proyectos]
    print('filtrados->>>>>>>>>>>>>>>>>>>>>>>', filtrados)
    
    i = []
    contador = 0
    
    for filtrado in filtrados:
      print('filtrado', filtrado)
      filtrado["mapeo"] = [filtrado for filtrado in mapeados] 
    
    filtrados.reverse()
    # PDF = generapdf.PDF
    pdf = PDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_font('Times', '', 11)


    for filtrado in range(len(filtrados)):
        print('filtradoFOR------------------->>>>>>>>>', filtrado)
        Titulo = filtrados[filtrado]['mapeo']
        print('filtradoTITULO------------------->>>>>>>>>', Titulo)
        contador = 0
        for key, valor in filtrados[filtrado].items():
            print("valor===================+++++++++++++++>>>>+>>>>>>", valor)
            if contador < len(Titulo):
                pdf.multi_cell(0, 10, f"{Titulo[contador]}:{valor}", 0, 'J', False)
                # pdf.multi_cell(0.5, 0.5, f"{Titulo[contador]}: {valor}" ,  0, 'J', False)
            contador += 1
        pdf.cell(0, 0, ' ', 1, 1,)

    pdf = pdf.output(dest='S').encode('latin-1')
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="mypdf.pdf"'
    return(response)

class Personalizacion(generics.ListAPIView):
    serializer_class = ConfiguracionCv_PersonalizadoSerializer
   
    def get_queryset(self):
        id_user = self.kwargs['id_user']
        return models.ConfiguracionCv_Personalizado.objects.filter(id_user=id_user)
