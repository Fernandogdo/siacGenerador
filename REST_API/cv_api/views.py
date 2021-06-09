import os
from .generapdf import PDF, PDFCOMPLETO
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

import pandas as pd
from pandas import Series

from fpdf import FPDF
from django.http import HttpResponse

import pandas as pd
from django.template.loader import get_template
from django.template import Context 
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from xhtml2pdf import pisa
# from weasyprint import HTML, CSS
from django.conf import settings

# from cv_api.models import *

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

# def generaPdfPersonalizado(request):
    
#     r = requests.get('https://sica.utpl.edu.ec/ws/api/docentes/1/',
#                      headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
                     
   
#     todos = r.json()
    
#     # # stu = models.ConfiguracionCv_Personalizado.objects.filter(id_user=4)
#     # serializer = ConfiguracionCv_PersonalizadoSerializer(models.ConfiguracionCv_Personalizado.objects.filter(id_user=4), many=True)
#     # # print(serializer.data)
#     # json_data = JSONRenderer().render(serializer.data)
#     # # print(json_data)

#     model_dict = models.ConfiguracionCv_Personalizado.objects.all().values()
#     # print('diccionario----------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', model_dict.filter(id_user=4))

#     filtrado_usario = model_dict.filter(id_user=4)
  
    
#     proyectos = [
#          {
#             "id": 1,
#             "fecha_inicio": "2005-02-01",
#             "fecha_cierre": "2012-01-01",
#             "codigo_proyecto": "Codigo Proyecto prueb 00022423",
#             "nombre_proyecto": "Diferentes Investigaciones dentro del Marco del Convenio Interinstitucional con la DPS-L, para el Rescate y Validacion del Conocimiento Tradicional del Pueblo Saraguro",
#             "descripcion": "",
#             "tipo_proyecto": 65,
#             "incluye_estudiantes": "si",
#             "incluye_financ_externo": "no",
#             "cobertura_proyecto": 63,
#             "reprogramado": "No",
#             "porcentaje_avance": "100.00",
#             "fondo_utpl": "0.00",
#             "fondo_externo": "0.00",
#             "total_general": "0.00",
#             "estado": "finalizado",
#             "programa": "Biológica",
#             "objetivos": "",
#             "moneda": "",
#             "presupuesto": "0.00",
#             "clase_proyecto": "",
#             "tipo_investigacion": "",
#             "area_unesco": "",
#             "participacion_extranjera": "no",
#             "smartland": "no",
#             "fecha_reprogramacion": "",
#             "observaciones": "",
#             "fondo_externo_especie": "0.00",
#             "fondo_externo_efectivo": "0.00",
#             "alumnos": 0,
#             "fecha_suspension": "",
#             "fecha_activacion": "",
#             "porcentaje_esperado": "0.00",
#             "especie": "no",
#             "linea_investigacion": "",
#             "tipo_convocatoria": "",
#             "area_conocimiento": "",
#             "sub_area_conocimiento": "",
#             "area_conocimiento_especifica": "",
#             "titulacion": "",
#             "observatorio": "",
#             "ods": "",
#             "organizacion": "",
#             "programa_investigacion": ""
#         },
#         {
#             "id": 3,
#             "fecha_inicio": "2008-01-01",
#             "fecha_cierre": "2012-06-30",
#             "codigo_proyecto": "PROY_CBCM_0011",
#             "nombre_proyecto": "PROSPECCION DE PRINCIPIOS ACTIVOS ANTICANCEROSOS DE LA FLORA DEL SUR DEL ECUADOR.",
#             "descripcion": "El cancer constituye una de las principales causas de muerte, se estima que para el 2020 cerca de 13 millones de personas falleceran por esta enfermedad. Por tanto, el cancer constituye un problema de salud mundial y ocupa un lugar de importancia en lo",
#             "tipo_proyecto": 65,
#             "incluye_estudiantes": "no",
#             "incluye_financ_externo": "no",
#             "cobertura_proyecto": 63,
#             "reprogramado": "SI",
#             "porcentaje_avance": "100.00",
#             "fondo_utpl": "93801.78",
#             "fondo_externo": "24275.00",
#             "total_general": "118076.78",
#             "estado": "finalizado",
#             "programa": "Ciencias Biomedicas",
#             "objetivos": "",
#             "moneda": "",
#             "presupuesto": "118076.78",
#             "clase_proyecto": "",
#             "tipo_investigacion": "",
#             "area_unesco": "",
#             "participacion_extranjera": "no",
#             "smartland": "no",
#             "fecha_reprogramacion": "",
#             "observaciones": "",
#             "fondo_externo_especie": "0.00",
#             "fondo_externo_efectivo": "0.00",
#             "alumnos": 0,
#             "fecha_suspension": "",
#             "fecha_activacion": "",
#             "porcentaje_esperado": "0.00",
#             "especie": "no",
#             "linea_investigacion": "",
#             "tipo_convocatoria": "",
#             "area_conocimiento": "",
#             "sub_area_conocimiento": "",
#             "area_conocimiento_especifica": "",
#             "titulacion": "",
#             "observatorio": "",
#             "ods": "",
#             "organizacion": "",
#             "programa_investigacion": ""
#         },
#     ]
     
#     bloque = [ d["bloque"] for d in filtrado_usario ]
#     bloques = pd.unique(bloque)
#     # print('bloques--->>>>>', bloques)

#     '''SACA VISIBLES SI SON TRUE'''
#     diccionario = dict()
#     for i in bloques:
#       visibles = [ d["atributo"]  for d in filtrado_usario if d.get("visible_cv_personalizado") and d.get('bloque') == i]
#       visibilizados = pd.unique(visibles)
#       diccionario[i] = visibilizados
#     # print('visiblesArticulos========>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', diccionario)


#     '''SACA MAPEO SI ATRIBUTO ES TRUE'''
#     for i in bloques:
#       mapeo = [ d["mapeo"] for d in filtrado_usario if d.get("visible_cv_personalizado") and d.get('bloque') == i]
#       mapeados = pd.unique(mapeo)
#     # print('mapeo--->>>>>', mapeados)

#     filtrados = [ { atributo: d.get(atributo) for atributo in diccionario['Proyectos'] if d.get(atributo) != None} for d in proyectos]
#     # print('filtrados->>>>>>>>>>>>>>>>>>>>>>>', filtrados)
    
#     i = []
#     contador = 0
    
#     for filtrado in filtrados:
#     #   print('filtrado', filtrado)
#       filtrado["mapeo"] = [filtrado for filtrado in mapeados] 
    
#     filtrados.reverse()
#     # PDF = generapdf.PDF
#     pdf = PDF()
#     pdf.alias_nb_pages()
#     pdf.add_page()
#     pdf.set_font('Times', '', 11)


#     for filtrado in range(len(filtrados)):
#         # print('filtradoFOR------------------->>>>>>>>>', filtrado)
#         Titulo = filtrados[filtrado]['mapeo']
#         # print('filtradoTITULO------------------->>>>>>>>>', Titulo)
#         contador = 0
#         for key, valor in filtrados[filtrado].items():
#             # print("valor===================+++++++++++++++>>>>+>>>>>>", valor)
#             if contador < len(Titulo):
#                 pdf.multi_cell(0, 10, f"{Titulo[contador]}:{valor}", 0, 'J', False)
#                 # pdf.multi_cell(0.5, 0.5, f"{Titulo[contador]}: {valor}" ,  0, 'J', False)
#             contador += 1
#         pdf.cell(0, 0, ' ', 1, 1,)

#     pdf = pdf.output(dest='S').encode('latin-1')
#     response = HttpResponse(pdf, content_type='application/pdf')
#     response['Content-Disposition'] = 'attachment; filename="mypdf.pdf"'
#     return(response)






''' FUNCION PARA GENERAR PDF COMPLETO'''

def generaPdfCompleto(request, id):
    
    r = requests.get('https://sica.utpl.edu.ec/ws/api/docentes/1/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    todos = r.json()
    
    model_dict = models.ConfiguracionCv.objects.all().values()
    print('diccionario----------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', model_dict)

    # model_dict = models.ConfiguracionCv_Personalizado.objects.all().values()
    # print('diccionario----------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', model_dict)

#     filtrado_usario = model_dict.filter(id_user=4)
    # filtrado_usario = model_dict.filter(bloque='Proyectos')

    # print("🚀 ~ file: views.py ~ line 286 ~ filtrado_usario", filtrado_usario)
  
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
        "bloque": "Capacitacion",
        "atributo": "ciudad",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "Ciudad",
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
            "nombre_proyecto": "Dif Pueblo Saraguro",
            "descripcion": "asdsadsadsada sadsa",
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
            "nombre_proyecto": "PROSUR DEL ECUADOR.",
            "descripcion": "El  ocupa un lugar de importancia en lo asdsadsad sadsa dsa dsadsa dsadsa dsad sadsad sadsadsad sadsadsadsa sadsadsadsa sadsadsadsa sadsadsad sadsadsad sadsad sadsad sadsadsa ",
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

          {
            "id": 4,
            "fecha_inicio": "2008-01-01",
            "fecha_cierre": "2012-06-30",
            "codigo_proyecto": "PROY_CBCM_0011",
            "nombre_proyecto": "PROR DEL ECUADOR.",
            "descripcion": "Elasd",
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

    print('filtrados-______________>>>>>>>>>>>>>>>>>>>---->>>>>>>>>>.', filtrados)
    # PDF = generapdf.PDF
    pdf = PDFCOMPLETO()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_font('Times', '', 11)


    for filtrado in range(len(filtrados)):
        print('filtradoFOR------------------->>>>>>>>>', filtrado)
        # pdf.set_font('Arial', 'B', 14)
        Titulo = filtrados[filtrado]['mapeo'] 
        print('filtradoTITULO------------------->>>>>>>>>', Titulo)
        contador = 0
        for key, valor in filtrados[filtrado].items():
            print("valor===================+++++++++++++++>>>>+>>>>>>", key, valor)
            if contador < len(Titulo):
                pdf.set_font('Arial','B',11)  
                pdf.cell(50, 5, f"{Titulo[contador]}:               ", 0, 0, 'L')
                # pdf.cell(0, 5, f"{Titulo[contador]}:", 0, 0, 'J' , False)
                pdf.set_font("")  
                pdf.multi_cell(135, 5, f"{valor}", 0, 'J', False)
                # pdf.multi_cell(0.5, 0.5, f"{Titulo[contador]}: {valor}" ,  0, 'J', False)
            contador += 1
        
        pdf.ln(10)

    pdf = pdf.output(dest='S').encode('latin-1')
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="mypdf.pdf"'
    return(response)



























'''GENERA PDF COMPLETO'''

def PdfCompleto(request):

    model_dict = models.ConfiguracionCv.objects.all().values()
    model_bloques = models.Bloque.objects.all().values()

    r = requests.get('https://sica.utpl.edu.ec/ws/api/docentes/112/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
      # print ("id: {}".format(i['id']))
      listaidArticulos.append(infobloque)

    idsArticulos = [fila['id'] for fila in listaidArticulos ]
   
    ''' Saca articulos de docentes por ID'''
    listaArticulosDocente = []
    for id in idsArticulos:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/'+ str(id) + "/",
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                   )
        todos = r.json()
        listaArticulosDocente.append(todos)
    #   print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaArticulosDocente)


    '''Cambia valores None por cadena ('None') '''
    for i in listaArticulosDocente:
        for key, value in i.items():
            if value is None:
              value = 'None'
            i[key] = value


    proyectos = []
    Capacitacion = []
    ArticulosAutores = []
    Libros = []
    LibrosAutores = []
    GradoAcademico = []
    ProyectosParticipantes = []

    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloques = sorted(model_bloques, key=lambda orden: orden['ordenCompleto'])
    bloqueOrdenApi = [ {b['nombre']: b['ordenCompleto']} for b in ordenadosBloques]
    print(bloqueOrdenApi)

    # bloque = [ d["bloque"] for d in model_dict ]
    # bloques = pd.unique(bloque)
    # print('bloques--->>>>>', bloques)

    listaBloques = [[x for x, v in i.items()] for i in bloqueOrdenApi ]
    listaBloquesOrdenados = [y for x in listaBloques for y in x]
    
    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in listaBloquesOrdenados:
      # visibles = [ d["atributo"]  for d in completos if d.get("visible_cv_completo") and d.get('bloque') == i]
      # atributo = [ a['atributo'] for a in model_dict]  
      visibles = [ {'nombre' : d['atributo'], 'orden' : d['orden']}  for d in model_dict if d.get("visible_cv_completo") and d.get('bloque') == i]
      # print('visibilizados', visibles)
      ordenadosAtributos = sorted(visibles , key=lambda orden: orden['orden'])
      # print(ordenadosAtributos)
      listaatrvisibles = [[valor for clave, valor in i.items() if clave == 'nombre'] for i in ordenadosAtributos ]
      listaVisiblesAtr = [y for x in listaatrvisibles  for y in x]
      print('listaatrvisibles', listaVisiblesAtr, '\n')  
      diccionario[i] = listaVisiblesAtr   

    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    listadoBloques = dict()
    listaMapeados = dict()
    bloquesInformacion = dict()
    
    '''Tendria que recuperar los bloques que estan como visibles'''
    bloquesInformacion['Articulos']= listaArticulosDocente
    bloquesInformacion['Proyectos']=proyectos
    bloquesInformacion['Capacitacion']=Capacitacion
    bloquesInformacion['ProyectosParticipantes']=ProyectosParticipantes
    bloquesInformacion['ArticulosAutores']=ArticulosAutores
    bloquesInformacion['Libros']=Libros
    bloquesInformacion['LibrosAutores']=LibrosAutores
    bloquesInformacion['GradoAcademico']=GradoAcademico  
    
    for i in listaBloquesOrdenados:
        mapeo = [ {'mapeo' : d['mapeo'], 'orden' : d['orden']}  for d in model_dict if d.get("visible_cv_completo") and d.get('bloque') == i]
        ordenadosMapeo = sorted(mapeo , key=lambda orden: orden['orden'])

        listamapeoisibles = [[valor for clave, valor in i.items() if clave == 'mapeo'] for i in ordenadosMapeo ]
        listaVisiblesmapeo = [y for x in listamapeoisibles  for y in x]

        mapeados = pd.unique(listaVisiblesmapeo)
        listaMapeados[i]= mapeados
        filtrados = [ { atributo: d.get(atributo) for atributo in diccionario[i] if d.get(atributo) != None} for d in bloquesInformacion[i]]
        # print('filtrados---___________>>>>>>>>>>>>>>>>>>>',filtrados)
        listadoBloques[i]=filtrados
    print('listaMapeados--->>>>>', listaMapeados)
    print('filtrados->>>>>>>>>>>>>>>>>>>>>>>', listadoBloques) 
    # print('listaMapeados--->>>>>', listaMapeados)
    # print('filtrados->>>>>>>>>>>>>>>>>>>>>>>', listadoBloques)    
            
    
    bloqueAtributos = dict()
    for listadoBloque in listadoBloques:
      bloqueAtributos[listadoBloque] = [ { atributo: d.get(atributo) for atributo in diccionario[listadoBloque] if d.get(atributo) != None} for d in bloquesInformacion[listadoBloque]]
    # print('filtrados->>>>>>>>>>>>>>>>>>>>>>>', bloqueAtributos)

    i = []
    for i in listaBloquesOrdenados:
      for filtrado in bloqueAtributos[i]:
        # print('filtrado', filtrado)
        filtrado["mapeo"] = [fil for fil in listaMapeados[i]]
        # filtrado["orden"] = [filtrado for filtrado in mapeados]
    # print('bloqueAtributos----___>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',bloqueAtributos)
    
    
    listaTitulo = []
    listaResultados = []
    listaClave = []
    listaValor = []

    for i in listadoBloques:
      listaTitulo.append(i)
      for bloqueInformacion in bloqueAtributos[i]:
        resultados = dict(zip(bloqueInformacion['mapeo'], bloqueInformacion.values()))
        listaResultados.append(resultados)
        # print('resultados------->>>>>', resultados)
        for clave in resultados.keys():
            listaClave.append(clave)
            listaValor.append(resultados[clave])
    
            pass

    # print('Bloques',listaTitulo)
    print('Datos---->>>>>>>>>>>>>>', listaResultados)
    # print('CLAVES--->>>>>>>', listaClave)
    # print('VALOR--->>>>>>>',listaValor)
 
    '''Generacion de PDF'''
    # OVERLAY_LAYOUT = '@page {size: A4 portrait; margin: 0;}'
    
    
    # template_path = 'home_page.html'
    # response = HttpResponse(content_type='application/pdf')
    # response['Content-Disposition'] = 'attachment; filename="Report.pdf"'
    # context = {'datos': listaResultados, 'bloques': listaTitulo, 'claves': listaClave, 'valor': listaValor}
    # html = render_to_string(template_path, context)
    # pisaStatus = pisa.CreatePDF(html, dest=response)

    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    context = {'datos': listaResultados, 'logo': logo, 'docente': docente, 'bloquesOrdenados': listaBloquesOrdenados}
    html_string = render_to_string('home_page.html', context)
    html = HTML(string=html_string)
    pdf = html.write_pdf(stylesheets=[CSS(str(settings.BASE_DIR) +  '/cv_api/templates/css/pdf_gen.css')], presentational_hints=True)
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="mypdf.pdf"'

    return response 


def pdf_generation(request):
    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    context = {'studid':"assadsad", 'logo': logo}
    html_string = render_to_string('home_page.html', context)
    html = HTML(string=html_string, base_url=request.build_absolute_uri())
    pdf = html.write_pdf(stylesheets=[CSS(str(settings.BASE_DIR) +  '/cv_api/templates/css/pdf_gen.css')], presentational_hints=True)
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="mypdf.pdf"'
    return response