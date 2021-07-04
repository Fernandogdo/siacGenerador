from django.http.response import JsonResponse
from django.shortcuts import render
import docx
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
from django.http import HttpResponse

import pandas as pd
from django.template.loader import get_template
from django.template import Context
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from django.conf import settings
from htmldocx import HtmlToDocx
from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.part import Part
from docx.opc.constants import RELATIONSHIP_TYPE as RT
import json, pypandoc
from pathlib import Path
from django.shortcuts import render

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


def getdata(self):
    id_user = self.kwargs['id_user']
    return models.ConfiguracionCv_Personalizado.objects.filter(id_user=id_user)


'''GENERA PDF COMPLETO'''


def PdfCompleto(request):

    model_dict = models.ConfiguracionCv.objects.all().values()
    model_bloques = models.Bloque.objects.all().values()

    r = requests.get('https://sica.utpl.edu.ec/ws/api/docentes/23/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
        listaidArticulos.append(infobloque)

    idsArticulos = [fila['id'] for fila in listaidArticulos]

    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['libros']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaArticulosDocente = []
    for id in idsArticulos:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaArticulosDocente.append(todos)
    #   print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaArticulosDocente)

    ''' Saca libros de docentes por ID'''
    listaLibrosDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)
        # print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaLibrosDocente)

    '''Cambia valores None por cadena ('None') '''
    for i in listaLibrosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    proyectos = []
    Capacitacion = []
    # ArticulosAutores = []
    # LibrosAutores = []
    GradoAcademico = []
    # ProyectosParticipantes = []

    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloques = sorted(
        model_bloques, key=lambda orden: orden['ordenCompleto'])
    bloqueOrdenApi = [{b['nombre']: b['ordenCompleto']}
                      for b in ordenadosBloques]

    listaBloques = [[x for x, v in i.items()] for i in bloqueOrdenApi]
    listaBloquesOrdenados = [y for x in listaBloques for y in x]

    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in listaBloquesOrdenados:
        visibles = [{'nombre': d['atributo'], 'orden': d['orden']}
                    for d in model_dict if d.get("visible_cv_completo") and d.get('bloque') == i]
        ordenadosAtributos = sorted(visibles, key=lambda orden: orden['orden'])
        listaatrvisibles = [[valor for clave, valor in i.items(
        ) if clave == 'nombre'] for i in ordenadosAtributos]
        listaVisiblesAtr = [y for x in listaatrvisibles for y in x]
        diccionario[i] = listaVisiblesAtr

    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    listadoBloques = dict()
    listaMapeados = dict()
    bloquesInformacion = dict()

    '''Tendria que recuperar los bloques que estan como visibles'''
    bloquesInformacion['Articulos'] = listaArticulosDocente
    bloquesInformacion['Proyectos'] = proyectos
    bloquesInformacion['Capacitacion'] = Capacitacion
    # bloquesInformacion['ProyectosParticipantes']=ProyectosParticipantes
    # bloquesInformacion['ArticulosAutores']=ArticulosAutores
    bloquesInformacion['Libros'] = listaLibrosDocente
    # bloquesInformacion['LibrosAutores']=LibrosAutores
    bloquesInformacion['GradoAcademico'] = GradoAcademico

    for i in listaBloquesOrdenados:
        mapeo = [{'mapeo': d['mapeo'], 'orden': d['orden']} for d in model_dict if d.get(
            "visible_cv_completo") and d.get('bloque') == i]
        ordenadosMapeo = sorted(mapeo, key=lambda orden: orden['orden'])

        listamapeoisibles = [[valor for clave, valor in i.items(
        ) if clave == 'mapeo'] for i in ordenadosMapeo]
        listaVisiblesmapeo = [y for x in listamapeoisibles for y in x]

        mapeados = pd.unique(listaVisiblesmapeo)
        listaMapeados[i] = mapeados
        filtrados = [{atributo: d.get(atributo) for atributo in diccionario[i] if d.get(
            atributo) != None} for d in bloquesInformacion[i]]
        listadoBloques[i] = filtrados
    # print('listaMapeados--->>>>>', listaMapeados)
    # print('filtrados->>>>>>>>>>>>>>>>>>>>>>>', listadoBloques)
    # print('listaMapeados--->>>>>', listaMapeados)
    # print('filtrados->>>>>>>>>>>>>>>>>>>>>>>', listadoBloques)

    bloqueAtributos = dict()
    for listadoBloque in listadoBloques:
        bloqueAtributos[listadoBloque] = [{atributo: d.get(atributo) for atributo in diccionario[listadoBloque] if d.get(
            atributo) != None} for d in bloquesInformacion[listadoBloque]]

    i = []
    for i in listaBloquesOrdenados:
        for filtrado in bloqueAtributos[i]:
            filtrado["mapeo"] = [fil for fil in listaMapeados[i]]
            # filtrado["orden"] = [filtrado for filtrado in mapeados]
    # print('bloqueAtributos----___>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',bloqueAtributos)

    bloquesInfoRestante = {k: v for k, v in bloqueAtributos.items() if v != []}
    # print('loquesquedan---------__>>>>>>>>>>>>', bloquesInfoRestante)

    bloquesRestantes = []

    for bloqueInfRes in bloquesInfoRestante:
        bloquesRestantes.append(bloqueInfRes)
    # print('listadoBloques-----------__>>>>>>>>>>>>>>>>>',listadoBloques)
    # print(bloquesRestantes)

    listaResultados = []
    listaFinal = list()
    tituloBloque = dict()
    for i in bloquesRestantes:
        tituloBloque['-'] = i.upper()
        listaResultados.append(tituloBloque)
        for bloqueInformacion in bloquesInfoRestante[i]:
            resultados = dict(
                zip(bloqueInformacion['mapeo'], bloqueInformacion.values()))
            listaResultados.append(resultados)

        listaFinal.append(listaResultados)
        listaResultados = []
        tituloBloque = {}

    '''Generacion de PDF'''
    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    context = {'datos': listaResultados, 'logo': logo,
               'docente': docente, 'listaFinal': listaFinal}
    html_string = render_to_string('home_page.html', context)
    html = HTML(string=html_string)
    pdf = html.write_pdf(stylesheets=[CSS(str(settings.BASE_DIR) +
                                          '/cv_api/templates/css/pdf_gen.css')], presentational_hints=True)
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="mypdf.pdf"'

    return response


'''GENERA PDF RESUMIDO'''
def PdfResumido(request, id):

    model_dict = models.ConfiguracionCv.objects.all().values()
    # print('model_dict',model_dict)
    model_bloques = models.Bloque.objects.all().values()

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
        listaidArticulos.append(infobloque)

    idsArticulos = [fila['id'] for fila in listaidArticulos]

    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['libros']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaArticulosDocente = []
    for id in idsArticulos:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaArticulosDocente.append(todos)
    #   print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaArticulosDocente)

    ''' Saca libros de docentes por ID'''
    listaLibrosDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)
        # print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaLibrosDocente)

    '''Cambia valores None por cadena ('None') '''
    for i in listaLibrosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    proyectos = []
    Capacitacion = []
    GradoAcademico = []

    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloques = sorted(
        model_bloques, key=lambda orden: orden['ordenResumido'])
    bloqueOrdenApi = [{b['nombre']: b['ordenResumido']}
                      for b in ordenadosBloques]

    listaBloques = [[x for x, v in i.items()] for i in bloqueOrdenApi]
    listaBloquesOrdenados = [y for x in listaBloques for y in x]

    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in listaBloquesOrdenados:
        visibles = [{'nombre': d['atributo'], 'orden': d['orden']}
                    for d in model_dict if d.get("visible_cv_resumido") and d.get('bloque') == i]
        ordenadosAtributos = sorted(visibles, key=lambda orden: orden['orden'])
        listaatrvisibles = [[valor for clave, valor in i.items(
        ) if clave == 'nombre'] for i in ordenadosAtributos]
        listaVisiblesAtr = [y for x in listaatrvisibles for y in x]
        diccionario[i] = listaVisiblesAtr

    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    listadoBloques = dict()
    listaMapeados = dict()
    bloquesInformacion = dict()

    '''Tendria que recuperar los bloques que estan como visibles'''
    bloquesInformacion['Articulos'] = listaArticulosDocente
    bloquesInformacion['Proyectos'] = proyectos
    bloquesInformacion['Capacitacion'] = Capacitacion
    bloquesInformacion['Libros'] = listaLibrosDocente
    bloquesInformacion['GradoAcademico'] = GradoAcademico

    for i in listaBloquesOrdenados:
        mapeo = [{'mapeo': d['mapeo'], 'orden': d['orden']} for d in model_dict if d.get(
            "visible_cv_resumido") and d.get('bloque') == i]
        ordenadosMapeo = sorted(mapeo, key=lambda orden: orden['orden'])

        listamapeoisibles = [[valor for clave, valor in i.items(
        ) if clave == 'mapeo'] for i in ordenadosMapeo]
        listaVisiblesmapeo = [y for x in listamapeoisibles for y in x]

        mapeados = pd.unique(listaVisiblesmapeo)
        listaMapeados[i] = mapeados
        filtrados = [{atributo: d.get(atributo) for atributo in diccionario[i] if d.get(
            atributo) != None} for d in bloquesInformacion[i]]
        # print('filtrados---___________>>>>>>>>>>>>>>>>>>>',filtrados)

        listadoBloques[i] = filtrados

    bloqueAtributos = dict()
    for listadoBloque in listadoBloques:
        bloqueAtributos[listadoBloque] = [{atributo: d.get(atributo) for atributo in diccionario[listadoBloque] if d.get(
            atributo) != None} for d in bloquesInformacion[listadoBloque]]

    i = []
    for i in listaBloquesOrdenados:
        for filtrado in bloqueAtributos[i]:
            filtrado["mapeo"] = [fil for fil in listaMapeados[i]]
            # filtrado["orden"] = [filtrado for filtrado in mapeados]
    # print('bloqueAtributos----___>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',bloqueAtributos)

    bloquesInfoRestante = {k: v for k, v in bloqueAtributos.items() if v != []}
    # print('loquesquedan---------__>>>>>>>>>>>>', bloquesInfoRestante)

    bloquesRestantes = []

    for bloqueInfRes in bloquesInfoRestante:
        bloquesRestantes.append(bloqueInfRes)
    # print('listadoBloques-----------__>>>>>>>>>>>>>>>>>',listadoBloques)
    # print(bloquesRestantes)

    listaResultados = []
    listaFinal = list()
    tituloBloque = dict()
    for i in bloquesRestantes:
        tituloBloque['-'] = i.upper()
        listaResultados.append(tituloBloque)
        for bloqueInformacion in bloquesInfoRestante[i]:
            resultados = dict(
                zip(bloqueInformacion['mapeo'], bloqueInformacion.values()))
            listaResultados.append(resultados)

        listaFinal.append(listaResultados)
        listaResultados = []
        tituloBloque = {}

    '''Generacion de PDF'''
    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    context = {'datos': listaResultados, 'logo': logo,
               'docente': docente, 'listaFinal': listaFinal}
    html_string = render_to_string('home_page.html', context)
    html = HTML(string=html_string)
    pdf = html.write_pdf(stylesheets=[CSS(str(settings.BASE_DIR) +
                                          '/cv_api/templates/css/pdf_gen.css')], presentational_hints=True)
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="cv_resumido.pdf"'

    return response






'''GENERA PDF PERSONALIZADO'''
def PdfPersonalizado(request, id):

    nombre_cv = 'data'
    model_dict = models.ConfiguracionCv_Personalizado.objects.all().values()
    # print('model_dictPersonalizadolala', model_dict.filter(id_user=4).filter(nombre_cv = nombre_cv))
    dataPersonalizada = model_dict.filter(
        id_user=4).filter(nombre_cv=nombre_cv)

    # print('model_ditct--------------____>>>>>>>>>>>>>>>>>>>>>>>', model_dict)
    model_bloques = models.Bloque.objects.all().values()

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
        listaidArticulos.append(infobloque)

    idsArticulos = [fila['id'] for fila in listaidArticulos]

    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['libros']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaArticulosDocente = []
    for id in idsArticulos:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaArticulosDocente.append(todos)
    #   print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaArticulosDocente)

    ''' Saca libros de docentes por ID'''
    listaLibrosDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)
        # print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaLibrosDocente)

    '''Cambia valores None por cadena ('None') '''
    for i in listaLibrosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    proyectos = []
    Capacitacion = []
    GradoAcademico = []

    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloques = sorted(
        model_bloques, key=lambda orden: orden['ordenPersonalizable'])
    bloqueOrdenApi = [{b['nombre']: b['ordenPersonalizable']}
                      for b in ordenadosBloques]

    listaBloques = [[x for x, v in i.items()] for i in bloqueOrdenApi]
    listaBloquesOrdenados = [y for x in listaBloques for y in x]

    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in listaBloquesOrdenados:
        visibles = [{'nombre': d['atributo'], 'orden': d['orden']} for d in dataPersonalizada if d.get(
            "visible_cv_personalizado") and d.get('bloque') == i]
        ordenadosAtributos = sorted(visibles, key=lambda orden: orden['orden'])
        listaatrvisibles = [[valor for clave, valor in i.items(
        ) if clave == 'nombre'] for i in ordenadosAtributos]
        listaVisiblesAtr = [y for x in listaatrvisibles for y in x]

        diccionario[i] = listaVisiblesAtr

    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    listadoBloques = dict()
    listaMapeados = dict()
    bloquesInformacion = dict()

    '''Tendria que recuperar los bloques que estan como visibles'''
    bloquesInformacion['Articulos'] = listaArticulosDocente
    bloquesInformacion['Proyectos'] = proyectos
    bloquesInformacion['Capacitacion'] = Capacitacion
    bloquesInformacion['Libros'] = listaLibrosDocente
    bloquesInformacion['GradoAcademico'] = GradoAcademico

    for i in listaBloquesOrdenados:
        mapeo = [{'mapeo': d['mapeo'], 'orden': d['orden']} for d in dataPersonalizada if d.get(
            "visible_cv_personalizado") and d.get('bloque') == i]
        ordenadosMapeo = sorted(mapeo, key=lambda orden: orden['orden'])

        listamapeoisibles = [[valor for clave, valor in i.items(
        ) if clave == 'mapeo'] for i in ordenadosMapeo]
        listaVisiblesmapeo = [y for x in listamapeoisibles for y in x]

        mapeados = pd.unique(listaVisiblesmapeo)
        listaMapeados[i] = mapeados
        filtrados = [{atributo: d.get(atributo) for atributo in diccionario[i] if d.get(
            atributo) != None} for d in bloquesInformacion[i]]
        # print('filtrados---___________>>>>>>>>>>>>>>>>>>>',i, filtrados)
        listadoBloques[i] = filtrados

    bloqueAtributos = dict()
    for listadoBloque in listadoBloques:
        bloqueAtributos[listadoBloque] = [{atributo: d.get(atributo) for atributo in diccionario[listadoBloque] if d.get(
            atributo) != None} for d in bloquesInformacion[listadoBloque]]
    # print('filtrados->>>>>>>>>>>>>>>>>>>>>>>', bloqueAtributos)

    bloquesInfoRestante = {k: v for k, v in bloqueAtributos.items() if [
        item for item in v if item != {}]}
    # print('bloquesInfoRestante', bloquesInfoRestante)

    i = []
    for i in listaBloquesOrdenados:
        for filtrado in bloqueAtributos[i]:
            filtrado["mapeo"] = [fil for fil in listaMapeados[i]]
       
    bloquesRestantes = []

    for bloqueInfRes in bloquesInfoRestante:
        bloquesRestantes.append(bloqueInfRes)
 

    listaResultados = []
    listaFinal = list()
    tituloBloque = dict()
    for i in bloquesRestantes:
        tituloBloque['-'] = i.upper()
        listaResultados.append(tituloBloque)
        for bloqueInformacion in bloquesInfoRestante[i]:
            resultados = dict(
                zip(bloqueInformacion['mapeo'], bloqueInformacion.values()))
            listaResultados.append(resultados)

        listaFinal.append(listaResultados)
        listaResultados = []
        tituloBloque = {}

    '''Generacion de PDF'''
    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    context = {'datos': listaResultados, 'logo': logo,
               'docente': docente, 'listaFinal': listaFinal}
    html_string = render_to_string('home_page.html', context)
    html = HTML(string=html_string)
    pdf = html.write_pdf(stylesheets=[CSS(str(settings.BASE_DIR) +
                                          '/cv_api/templates/css/pdf_gen.css')], presentational_hints=True)
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="cv_personalizado.pdf"'

    return response





'''GENERACION DE DOCUMENTOS WORD'''

'''DOCUMENTO WORD COMPLETO'''
def DocCompleto(request):
    model_dict = models.ConfiguracionCv.objects.all().values()
    model_bloques = models.Bloque.objects.all().values()

    r = requests.get('https://sica.utpl.edu.ec/ws/api/docentes/378/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
        listaidArticulos.append(infobloque)

    idsArticulos = [fila['id'] for fila in listaidArticulos]

    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['libros']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaArticulosDocente = []
    for id in idsArticulos:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaArticulosDocente.append(todos)
    #   print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaArticulosDocente)

    ''' Saca libros de docentes por ID'''
    listaLibrosDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)
        # print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaLibrosDocente)

    '''Cambia valores None por cadena ('None') '''
    for i in listaLibrosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    proyectos = []
    Capacitacion = []
    # ArticulosAutores = []
    # LibrosAutores = []
    GradoAcademico = []
    # ProyectosParticipantes = []

    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloques = sorted(
        model_bloques, key=lambda orden: orden['ordenCompleto'])
    bloqueOrdenApi = [{b['nombre']: b['ordenCompleto']}
                      for b in ordenadosBloques]

    listaBloques = [[x for x, v in i.items()] for i in bloqueOrdenApi]
    listaBloquesOrdenados = [y for x in listaBloques for y in x]

    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in listaBloquesOrdenados:
        visibles = [{'nombre': d['atributo'], 'orden': d['orden']}
                    for d in model_dict if d.get("visible_cv_completo") and d.get('bloque') == i]
        ordenadosAtributos = sorted(visibles, key=lambda orden: orden['orden'])
        listaatrvisibles = [[valor for clave, valor in i.items(
        ) if clave == 'nombre'] for i in ordenadosAtributos]
        listaVisiblesAtr = [y for x in listaatrvisibles for y in x]
        diccionario[i] = listaVisiblesAtr

    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    listadoBloques = dict()
    listaMapeados = dict()
    bloquesInformacion = dict()

    '''Tendria que recuperar los bloques que estan como visibles'''
    bloquesInformacion['Articulos'] = listaArticulosDocente
    bloquesInformacion['Proyectos'] = proyectos
    bloquesInformacion['Capacitacion'] = Capacitacion
    # bloquesInformacion['ProyectosParticipantes']=ProyectosParticipantes
    # bloquesInformacion['ArticulosAutores']=ArticulosAutores
    bloquesInformacion['Libros'] = listaLibrosDocente
    # bloquesInformacion['LibrosAutores']=LibrosAutores
    bloquesInformacion['GradoAcademico'] = GradoAcademico

    for i in listaBloquesOrdenados:
        mapeo = [{'mapeo': d['mapeo'], 'orden': d['orden']} for d in model_dict if d.get(
            "visible_cv_completo") and d.get('bloque') == i]
        ordenadosMapeo = sorted(mapeo, key=lambda orden: orden['orden'])

        listamapeoisibles = [[valor for clave, valor in i.items(
        ) if clave == 'mapeo'] for i in ordenadosMapeo]
        listaVisiblesmapeo = [y for x in listamapeoisibles for y in x]

        mapeados = pd.unique(listaVisiblesmapeo)
        listaMapeados[i] = mapeados
        filtrados = [{atributo: d.get(atributo) for atributo in diccionario[i] if d.get(
            atributo) != None} for d in bloquesInformacion[i]]
        listadoBloques[i] = filtrados

    bloqueAtributos = dict()
    for listadoBloque in listadoBloques:
        bloqueAtributos[listadoBloque] = [{atributo: d.get(atributo) for atributo in diccionario[listadoBloque] if d.get(
            atributo) != None} for d in bloquesInformacion[listadoBloque]]

    i = []
    for i in listaBloquesOrdenados:
        for filtrado in bloqueAtributos[i]:
            filtrado["mapeo"] = [fil for fil in listaMapeados[i]]
            # filtrado["orden"] = [filtrado for filtrado in mapeados]
    # print('bloqueAtributos----___>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',bloqueAtributos)

    bloquesInfoRestante = {k: v for k, v in bloqueAtributos.items() if v != []}
    # print('loquesquedan---------__>>>>>>>>>>>>', bloquesInfoRestante)

    bloquesRestantes = []

    for bloqueInfRes in bloquesInfoRestante:
        bloquesRestantes.append(bloqueInfRes)
    # print('listadoBloques-----------__>>>>>>>>>>>>>>>>>',listadoBloques)
    # print(bloquesRestantes)

    listaResultados = []
    listaFinal = list()
    tituloBloque = dict()
    for i in bloquesRestantes:
        tituloBloque['-'] = i.upper()
        listaResultados.append(tituloBloque)
        for bloqueInformacion in bloquesInfoRestante[i]:
            resultados = dict(
                zip(bloqueInformacion['mapeo'], bloqueInformacion.values()))
            listaResultados.append(resultados)

        listaFinal.append(listaResultados)
        listaResultados = []
        tituloBloque = {}


    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    context = {'listaFinal': listaFinal, 'docente': docente, 'logo': logo}
    html_string = render_to_string('documento.html', context)
    
    document = Document()
    output = pypandoc.convert(source= html_string, format='html', to='docx', outputfile=str(Path.home() / "documento") + 'cv.docx', extra_args=['--css=/templates/pdf_gen.css'])

    response = HttpResponse(output, content_type='application/msword')
    response['Content-Disposition'] = 'attachment; filename="cv.docx"'

    return response





'''DOCUMENTO WORD RESUMIDO'''
def DocResumido(request, id):
    model_dict = models.ConfiguracionCv.objects.all().values()
    model_bloques = models.Bloque.objects.all().values()

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
        listaidArticulos.append(infobloque)

    idsArticulos = [fila['id'] for fila in listaidArticulos]

    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['libros']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaArticulosDocente = []
    for id in idsArticulos:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaArticulosDocente.append(todos)
    #   print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaArticulosDocente)

    ''' Saca libros de docentes por ID'''
    listaLibrosDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)
        # print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaLibrosDocente)

    '''Cambia valores None por cadena ('None') '''
    for i in listaLibrosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    proyectos = []
    Capacitacion = []
    GradoAcademico = []

    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloques = sorted(
        model_bloques, key=lambda orden: orden['ordenResumido'])
    bloqueOrdenApi = [{b['nombre']: b['ordenResumido']}
                      for b in ordenadosBloques]

    listaBloques = [[x for x, v in i.items()] for i in bloqueOrdenApi]
    listaBloquesOrdenados = [y for x in listaBloques for y in x]

    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in listaBloquesOrdenados:
        visibles = [{'nombre': d['atributo'], 'orden': d['orden']}
                    for d in model_dict if d.get("visible_cv_resumido") and d.get('bloque') == i]
        ordenadosAtributos = sorted(visibles, key=lambda orden: orden['orden'])
        listaatrvisibles = [[valor for clave, valor in i.items(
        ) if clave == 'nombre'] for i in ordenadosAtributos]
        listaVisiblesAtr = [y for x in listaatrvisibles for y in x]
        diccionario[i] = listaVisiblesAtr

    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    listadoBloques = dict()
    listaMapeados = dict()
    bloquesInformacion = dict()

    '''Tendria que recuperar los bloques que estan como visibles'''
    bloquesInformacion['Articulos'] = listaArticulosDocente
    bloquesInformacion['Proyectos'] = proyectos
    bloquesInformacion['Capacitacion'] = Capacitacion
    bloquesInformacion['Libros'] = listaLibrosDocente
    bloquesInformacion['GradoAcademico'] = GradoAcademico

    for i in listaBloquesOrdenados:
        mapeo = [{'mapeo': d['mapeo'], 'orden': d['orden']} for d in model_dict if d.get(
            "visible_cv_resumido") and d.get('bloque') == i]
        ordenadosMapeo = sorted(mapeo, key=lambda orden: orden['orden'])

        listamapeoisibles = [[valor for clave, valor in i.items(
        ) if clave == 'mapeo'] for i in ordenadosMapeo]
        listaVisiblesmapeo = [y for x in listamapeoisibles for y in x]

        mapeados = pd.unique(listaVisiblesmapeo)
        listaMapeados[i] = mapeados
        filtrados = [{atributo: d.get(atributo) for atributo in diccionario[i] if d.get(
            atributo) != None} for d in bloquesInformacion[i]]
        # print('filtrados---___________>>>>>>>>>>>>>>>>>>>',filtrados)

        listadoBloques[i] = filtrados

    bloqueAtributos = dict()
    for listadoBloque in listadoBloques:
        bloqueAtributos[listadoBloque] = [{atributo: d.get(atributo) for atributo in diccionario[listadoBloque] if d.get(
            atributo) != None} for d in bloquesInformacion[listadoBloque]]

    i = []
    for i in listaBloquesOrdenados:
        for filtrado in bloqueAtributos[i]:
            filtrado["mapeo"] = [fil for fil in listaMapeados[i]]
            # filtrado["orden"] = [filtrado for filtrado in mapeados]
    # print('bloqueAtributos----___>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',bloqueAtributos)

    bloquesInfoRestante = {k: v for k, v in bloqueAtributos.items() if v != []}
    # print('loquesquedan---------__>>>>>>>>>>>>', bloquesInfoRestante)

    bloquesRestantes = []

    for bloqueInfRes in bloquesInfoRestante:
        bloquesRestantes.append(bloqueInfRes)
    # print('listadoBloques-----------__>>>>>>>>>>>>>>>>>',listadoBloques)
    # print(bloquesRestantes)

    listaResultados = []
    listaFinal = list()
    tituloBloque = dict()
    for i in bloquesRestantes:
        tituloBloque['-'] = i.upper()
        listaResultados.append(tituloBloque)
        for bloqueInformacion in bloquesInfoRestante[i]:
            resultados = dict(
                zip(bloqueInformacion['mapeo'], bloqueInformacion.values()))
            listaResultados.append(resultados)

        listaFinal.append(listaResultados)
        listaResultados = []
        tituloBloque = {}

    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    context = {'listaFinal': listaFinal, 'docente': docente, 'logo': logo}
    html_string = render_to_string('documento.html', context)
    
    document = Document()
    output = pypandoc.convert(source= html_string, format='html', to='docx', outputfile=str(Path.home() / "documento") + 'cv.docx', extra_args=['--css=/templates/pdf_gen.css'])

    response = HttpResponse(output, content_type='application/msword')
    response['Content-Disposition'] = 'attachment; filename="cv.docx"'

    return response







'''GENERA JSON COMPLETO'''
def JsonCompleto(request):
    model_dict = models.ConfiguracionCv.objects.all().values()
    model_bloques = models.Bloque.objects.all().values()

    r = requests.get('https://sica.utpl.edu.ec/ws/api/docentes/23/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
        listaidArticulos.append(infobloque)

    idsArticulos = [fila['id'] for fila in listaidArticulos]

    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['libros']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaArticulosDocente = []
    for id in idsArticulos:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaArticulosDocente.append(todos)

    ''' Saca libros de docentes por ID'''
    listaLibrosDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)
        # print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaLibrosDocente)

    '''Cambia valores None por cadena ('None') '''
    for i in listaLibrosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    proyectos = []
    Capacitacion = []
    GradoAcademico = []

    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloques = sorted(
        model_bloques, key=lambda orden: orden['ordenCompleto'])
    bloqueOrdenApi = [{b['nombre']: b['ordenCompleto']}
                      for b in ordenadosBloques]

    listaBloques = [[x for x, v in i.items()] for i in bloqueOrdenApi]
    listaBloquesOrdenados = [y for x in listaBloques for y in x]

    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in listaBloquesOrdenados:
        visibles = [{'nombre': d['atributo'], 'orden': d['orden']}
                    for d in model_dict if d.get("visible_cv_completo") and d.get('bloque') == i]
        ordenadosAtributos = sorted(visibles, key=lambda orden: orden['orden'])
        listaatrvisibles = [[valor for clave, valor in i.items(
        ) if clave == 'nombre'] for i in ordenadosAtributos]
        listaVisiblesAtr = [y for x in listaatrvisibles for y in x]
        diccionario[i] = listaVisiblesAtr

    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    listadoBloques = dict()
    listaMapeados = dict()
    bloquesInformacion = dict()

    '''Tendria que recuperar los bloques que estan como visibles'''
    bloquesInformacion['Articulos'] = listaArticulosDocente
    bloquesInformacion['Proyectos'] = proyectos
    bloquesInformacion['Capacitacion'] = Capacitacion
    # bloquesInformacion['ProyectosParticipantes']=ProyectosParticipantes
    # bloquesInformacion['ArticulosAutores']=ArticulosAutores
    bloquesInformacion['Libros'] = listaLibrosDocente
    # bloquesInformacion['LibrosAutores']=LibrosAutores
    bloquesInformacion['GradoAcademico'] = GradoAcademico

    for i in listaBloquesOrdenados:
        mapeo = [{'mapeo': d['mapeo'], 'orden': d['orden']} for d in model_dict if d.get(
            "visible_cv_completo") and d.get('bloque') == i]
        ordenadosMapeo = sorted(mapeo, key=lambda orden: orden['orden'])

        listamapeoisibles = [[valor for clave, valor in i.items(
        ) if clave == 'mapeo'] for i in ordenadosMapeo]
        listaVisiblesmapeo = [y for x in listamapeoisibles for y in x]

        mapeados = pd.unique(listaVisiblesmapeo)
        listaMapeados[i] = mapeados
        filtrados = [{atributo: d.get(atributo) for atributo in diccionario[i] if d.get(
            atributo) != None} for d in bloquesInformacion[i]]
        listadoBloques[i] = filtrados

    bloqueAtributos = dict()
    for listadoBloque in listadoBloques:
        bloqueAtributos[listadoBloque] = [{atributo: d.get(atributo) for atributo in diccionario[listadoBloque] if d.get(
            atributo) != None} for d in bloquesInformacion[listadoBloque]]

    i = []
    for i in listaBloquesOrdenados:
        for filtrado in bloqueAtributos[i]:
            filtrado["mapeo"] = [fil for fil in listaMapeados[i]]
        
    bloquesInfoRestante = {k: v for k, v in bloqueAtributos.items() if v != []}

    bloquesRestantes = []

    for bloqueInfRes in bloquesInfoRestante:
        bloquesRestantes.append(bloqueInfRes)

    listaResultados = []
    listaFinal = list()
    tituloBloque = dict()
    for i in bloquesRestantes:
        tituloBloque = i
        listaResultados.append(tituloBloque)
        for bloqueInformacion in bloquesInfoRestante[i]:
            resultados = dict(
                zip(bloqueInformacion['mapeo'], bloqueInformacion.values()))
            listaResultados.append(resultados)

        listaFinal.append(listaResultados)
        listaResultados = []
        tituloBloque = {}

    response = HttpResponse(listaFinal, content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename=export.json'
   
    return response





'''GENERA PDF RESUMIDO'''
def JsonResumido(request, id):

    model_dict = models.ConfiguracionCv.objects.all().values()
    # print('model_dict',model_dict)
    model_bloques = models.Bloque.objects.all().values()

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
        listaidArticulos.append(infobloque)

    idsArticulos = [fila['id'] for fila in listaidArticulos]

    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['libros']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaArticulosDocente = []
    for id in idsArticulos:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaArticulosDocente.append(todos)
    #   print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaArticulosDocente)

    ''' Saca libros de docentes por ID'''
    listaLibrosDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)
        # print('listaArticulosDocente------------>>>>>>>>>>>>>>>>>',listaLibrosDocente)

    '''Cambia valores None por cadena ('None') '''
    for i in listaLibrosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    proyectos = []
    Capacitacion = []
    GradoAcademico = []

    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloques = sorted(
        model_bloques, key=lambda orden: orden['ordenResumido'])
    bloqueOrdenApi = [{b['nombre']: b['ordenResumido']}
                      for b in ordenadosBloques]

    listaBloques = [[x for x, v in i.items()] for i in bloqueOrdenApi]
    listaBloquesOrdenados = [y for x in listaBloques for y in x]

    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in listaBloquesOrdenados:
        visibles = [{'nombre': d['atributo'], 'orden': d['orden']}
                    for d in model_dict if d.get("visible_cv_resumido") and d.get('bloque') == i]
        ordenadosAtributos = sorted(visibles, key=lambda orden: orden['orden'])
        listaatrvisibles = [[valor for clave, valor in i.items(
        ) if clave == 'nombre'] for i in ordenadosAtributos]
        listaVisiblesAtr = [y for x in listaatrvisibles for y in x]
        diccionario[i] = listaVisiblesAtr

    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    listadoBloques = dict()
    listaMapeados = dict()
    bloquesInformacion = dict()

    '''Tendria que recuperar los bloques que estan como visibles'''
    bloquesInformacion['Articulos'] = listaArticulosDocente
    bloquesInformacion['Proyectos'] = proyectos
    bloquesInformacion['Capacitacion'] = Capacitacion
    bloquesInformacion['Libros'] = listaLibrosDocente
    bloquesInformacion['GradoAcademico'] = GradoAcademico

    for i in listaBloquesOrdenados:
        mapeo = [{'mapeo': d['mapeo'], 'orden': d['orden']} for d in model_dict if d.get(
            "visible_cv_resumido") and d.get('bloque') == i]
        ordenadosMapeo = sorted(mapeo, key=lambda orden: orden['orden'])

        listamapeoisibles = [[valor for clave, valor in i.items(
        ) if clave == 'mapeo'] for i in ordenadosMapeo]
        listaVisiblesmapeo = [y for x in listamapeoisibles for y in x]

        mapeados = pd.unique(listaVisiblesmapeo)
        listaMapeados[i] = mapeados
        filtrados = [{atributo: d.get(atributo) for atributo in diccionario[i] if d.get(
            atributo) != None} for d in bloquesInformacion[i]]
        # print('filtrados---___________>>>>>>>>>>>>>>>>>>>',filtrados)

        listadoBloques[i] = filtrados

    bloqueAtributos = dict()
    for listadoBloque in listadoBloques:
        bloqueAtributos[listadoBloque] = [{atributo: d.get(atributo) for atributo in diccionario[listadoBloque] if d.get(
            atributo) != None} for d in bloquesInformacion[listadoBloque]]

    i = []
    for i in listaBloquesOrdenados:
        for filtrado in bloqueAtributos[i]:
            filtrado["mapeo"] = [fil for fil in listaMapeados[i]]
            # filtrado["orden"] = [filtrado for filtrado in mapeados]
    # print('bloqueAtributos----___>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',bloqueAtributos)

    bloquesInfoRestante = {k: v for k, v in bloqueAtributos.items() if v != []}
    # print('loquesquedan---------__>>>>>>>>>>>>', bloquesInfoRestante)

    bloquesRestantes = []

    for bloqueInfRes in bloquesInfoRestante:
        bloquesRestantes.append(bloqueInfRes)
    # print('listadoBloques-----------__>>>>>>>>>>>>>>>>>',listadoBloques)
    # print(bloquesRestantes)

    listaResultados = []
    listaFinal = list()
    tituloBloque = dict()
    for i in bloquesRestantes:
        tituloBloque['-'] = i.upper()
        listaResultados.append(tituloBloque)
        for bloqueInformacion in bloquesInfoRestante[i]:
            resultados = dict(
                zip(bloqueInformacion['mapeo'], bloqueInformacion.values()))
            listaResultados.append(resultados)

        listaFinal.append(listaResultados)
        listaResultados = []
        tituloBloque = {}

    response = HttpResponse(listaFinal, content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename=export.json'
   
    return response

    return response
