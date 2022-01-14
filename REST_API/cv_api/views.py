from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from django.contrib.auth import login as django_login
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from . import models
from . import serializers
import requests
from django.http import HttpResponse
import pandas as pd
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from django.conf import settings
import json
from datetime import datetime
import csv
from docxtpl import DocxTemplate, InlineImage
from docx.shared import Mm
from bibtexparser.bwriter import BibTexWriter
from bibtexparser.bibdatabase import BibDatabase
from django.shortcuts import redirect
import urllib.request


class ConfiguracionCvView(viewsets.ModelViewSet):
    queryset = models.ConfiguracionCv.objects.all()
    serializer_class = serializers.ConfiguracionCvSerializer
    # permission_classes = [IsAuthenticated]


class ConfiguracionCv_PersonalizadoView(viewsets.ModelViewSet):
    queryset = models.ConfiguracionCv_Personalizado.objects.all()
    serializer_class = serializers.ConfiguracionCv_PersonalizadoSerializer
    # permission_classes = [IsAuthenticated]


class UsarioView(viewsets.ModelViewSet):
    queryset = models.Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = []
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        test = serializers.UsuarioSerializer(user)
        django_login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": test.data}, status=200)


class BloqueView(viewsets.ModelViewSet):
    queryset = models.Bloque.objects.all()
    serializer_class = serializers.BloqueSerializer
    # permission_classes = [IsAuthenticated]

class ServicioView(viewsets.ModelViewSet):
    queryset = models.Servicio.objects.all()
    serializer_class = serializers.ServicioSerializer
    # permission_classes = [IsAuthenticated]


class PersonalizacionUsuario(generics.ListAPIView):
    serializer_class = serializers.ConfiguracionCv_PersonalizadoSerializer
    def get_queryset(self):
        id_user = self.kwargs['id_user']
        return models.ConfiguracionCv_Personalizado.objects.filter(id_user=id_user)

class getdata(viewsets.ModelViewSet):
    serializer_class = serializers.ConfiguracionCv_PersonalizadoSerializer
    def get_queryset(self):
        id_user = self.kwargs['id_user']
        return models.ConfiguracionCv_Personalizado.objects.filter(id_user=id_user)


# -------------------------------------------------------GENERACION DE INFORMACION-CONFIGURACION COMPLETA----------------------------------------------
'''OBTIENE INFO CONFIGURACION COMPLETA'''
def InformacionConfCompleto(id):

    model_dict = models.ConfiguracionCv.objects.all().values()
    model_bloques = models.Bloque.objects.all().values()
    model_servicios = models.Servicio.objects.all().values()

    print("MODELSERVICIOS", model_servicios)

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    listaId = dict()
    temp_data = []
    bloquesLista = []

    for servicio in model_servicios:   
        bloquesLista.append(servicio['url'])


    bloquesLista.sort()
    # print("LISTA", bloquesLista)


    '''RECORRE BLOQUES'''
    for bloque in bloquesLista: 
        print("ServicioNormal", bloque)
        print("Servicio", bloque.rsplit('/', 2)[-2])

        lista_ids = [items['id'] for items in docente['related'][bloque.rsplit('/', 2)[-2]]]

        for id in lista_ids:
            data_tt = requests.get(bloque + str(id) + "/",
                 headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
               )
            temp_data.append(data_tt.json())
        listaId[bloque.rsplit('/', 2)[-2]] = temp_data
        temp_data = []

    bloquesTodos = []
    for bloque in model_bloques:
      bloquesTodos.append(bloque['nombre'])

    bloquesTodos.sort()

    '''Cambia valores None por cadena ('None') '''
    for claveLista, valorLista in listaId.items():
        for valor in valorLista:
        #   print(valor)
          for key, value in valor.items():
            if value is None:
                value = 'None'
            valor[key] = value


    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloques = sorted(
        model_bloques, key=lambda orden: orden['ordenCompleto'])
    bloqueOrdenApi = [{b['nombre']: b['visible_cv_bloqueCompleto']}
                      for b in ordenadosBloques]

    bloqueOrdenApi = [bloqueOrden for bloqueOrden in bloqueOrdenApi if list(bloqueOrden.values()) != [False]]

    listaBloques = [[x for x, v in i.items()] for i in bloqueOrdenApi]
    listaBloquesOrdenados = [y for x in listaBloques for y in x]

    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in listaBloquesOrdenados:
        visibles = [{'nombre': d['atributo'], 'ordenCompleto': d['ordenCompleto']}
                    for d in model_dict if d.get("visible_cv_completo") and d.get('bloque') == i]
        ordenadosAtributos = sorted(visibles, key=lambda orden: orden['ordenCompleto'])
        listaatrvisibles = [[valor for clave, valor in i.items(
        ) if clave == 'nombre'] for i in ordenadosAtributos]
        listaVisiblesAtr = [y for x in listaatrvisibles for y in x]
        diccionario[i] = listaVisiblesAtr

    bloquesInformacion = dict()
    cont = 0
    for name_bloque, data_bloque in listaId.items():
 
      bloquesInformacion[bloquesTodos[cont]] = data_bloque
      cont+= 1


    print("BLOQUESINFORMACION", bloquesTodos)
  
    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    listadoBloques = dict()
    listaMapeados = dict()
    

    for i in listaBloquesOrdenados:
        mapeo = [{'mapeo': d['mapeo'], 'ordenCompleto': d['ordenCompleto']} for d in model_dict if d.get(
            "visible_cv_completo") and d.get('bloque') == i]
        ordenadosMapeo = sorted(mapeo, key=lambda orden: orden['ordenCompleto'])

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
        tituloBloque['-'] = i.upper()
        listaResultados.append(tituloBloque)
        for bloqueInformacion in bloquesInfoRestante[i]:
            resultados = dict(
                zip(bloqueInformacion['mapeo'], bloqueInformacion.values()))
            listaResultados.append(resultados)

        listaFinal.append(listaResultados)
        listaResultados = []
        tituloBloque = {}

    return docente, listaFinal


'''GENERA PDF COMPLETO'''
def PdfCompleto(request, id):
    docente, listaFinal = InformacionConfCompleto(id)
    # print("listaResultadosPRUEBA", docente, listaFinal )

    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    context = {'logo': logo,
               'docente': docente, 'listaFinal': listaFinal}
    html_string = render_to_string('home_page.html', context)
    html = HTML(string=html_string)
    pdf = html.write_pdf(stylesheets=[CSS(str(settings.BASE_DIR) +
                                          '/cv_api/templates/css/pdf_gen.css')], presentational_hints=True)
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="mypdf.pdf"'

    return response


'''DOCUMENTO WORD COMPLETO'''

def DocCompleto(request, id):
    docente, listaFinal = InformacionConfCompleto(id)
    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    img_template = str(settings.BASE_DIR) + '/cv_api/templates/nieve.jpg'
    response = HttpResponse(content_type='application/msword')
    response['Content-Disposition'] = 'attachment; filename="cv.docx"'

    doc = DocxTemplate(str(settings.BASE_DIR) + '/cv_api/templates/docx_filename.docx')
    f = open(str(settings.BASE_DIR) + '/cv_api/templates/nieve.jpg','wb')
    f.write(urllib.request.urlopen(docente['foto_web_low']).read()) 

    myimage = InlineImage(doc, image_descriptor=logo, width=Mm(15), height=Mm(25))
    docente_img = InlineImage(doc, img_template, width=Mm(60), height=Mm(60))
    context = {'listaFinal': listaFinal, 'docente': docente, 'var': logo, 'myimage': myimage, 'imagen':docente_img}
    doc.render(context)
    doc.save(response)

    return response


'''GENERA JSON COMPLETO'''
def JsonCompleto(request, id):
    docente, listaFinal = InformacionConfCompleto(id)

    listaDocente = []
    del docente['related']
    listaDocente.append('Docente')
    listaDocente.append(docente)
    listaFinal.append(listaDocente)

    jsonString = json.dumps(listaFinal,  ensure_ascii=False).encode('utf8')
    print(jsonString)
    response = HttpResponse(jsonString.decode(), content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename=export.json'
   
    return response


# -------------------------------------------------------GENERACION DE INFORMACION-CONFIGURACION RESUMIDA----------------------------------------------
def InformacionConfResumida(id):
    model_dict = models.ConfiguracionCv.objects.all().values()
    model_bloques = models.Bloque.objects.all().values()
    model_servicios = models.Servicio.objects.all().values()

    print("MODELSERVICIOS", model_servicios)

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    listaId = dict()
    temp_data = []
    bloquesLista = []

    for servicio in model_servicios:   
        bloquesLista.append(servicio['url'])


    bloquesLista.sort()
    # print("LISTA", bloquesLista)


    '''RECORRE BLOQUES'''
    for bloque in bloquesLista: 
        print("ServicioNormal", bloque)
        print("Servicio", bloque.rsplit('/', 2)[-2])

        lista_ids = [items['id'] for items in docente['related'][bloque.rsplit('/', 2)[-2]]]

        for id in lista_ids:
            data_tt = requests.get(bloque + str(id) + "/",
                 headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
               )
            temp_data.append(data_tt.json())
        listaId[bloque.rsplit('/', 2)[-2]] = temp_data
        temp_data = []

    bloquesTodos = []
    for bloque in model_bloques:
      bloquesTodos.append(bloque['nombre'])

    bloquesTodos.sort()


    '''Cambia valores None por cadena ('None') '''
    for claveLista, valorLista in listaId.items():
        for valor in valorLista:
          print(valor)
          for key, value in valor.items():
            if value is None:
                value = 'None'
            valor[key] = value

    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloques = sorted(
        model_bloques, key=lambda orden: orden['ordenResumido'])
    bloqueOrdenApi = [{b['nombre']: b['ordenResumido']}
                      for b in ordenadosBloques]

    bloqueOrdenApi = [bloqueOrden for bloqueOrden in bloqueOrdenApi if list(bloqueOrden.values()) != [0]]

    listaBloques = [[x for x, v in i.items()] for i in bloqueOrdenApi]
    listaBloquesOrdenados = [y for x in listaBloques for y in x]


    '''SACA VISIBLES SI SON TRUE'''
    diccionario = dict()
    for i in listaBloquesOrdenados:
        visibles = [{'nombre': d['atributo'], 'ordenResumido': d['ordenResumido']}
                    for d in model_dict if d.get("visible_cv_resumido") and d.get('bloque') == i]
        ordenadosAtributos = sorted(visibles, key=lambda orden: orden['ordenResumido'])
        listaatrvisibles = [[valor for clave, valor in i.items(
        ) if clave == 'nombre'] for i in ordenadosAtributos]
        listaVisiblesAtr = [y for x in listaatrvisibles for y in x]
        diccionario[i] = listaVisiblesAtr


    bloquesInformacion = dict()
    cont = 0
    for name_bloque, data_bloque in listaId.items():
 
      bloquesInformacion[bloquesTodos[cont]] = data_bloque
      cont+= 1
  

    '''SACA MAPEO SI ATRIBUTO ES TRUE'''
    listadoBloques = dict()
    listaMapeados = dict()
    

    for i in listaBloquesOrdenados:
        mapeo = [{'mapeo': d['mapeo'], 'ordenResumido': d['ordenResumido']} for d in model_dict if d.get(
            "visible_cv_resumido") and d.get('bloque') == i]
        ordenadosMapeo = sorted(mapeo, key=lambda orden: orden['ordenResumido'])

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
        tituloBloque['-'] = i.upper()
        listaResultados.append(tituloBloque)
        for bloqueInformacion in bloquesInfoRestante[i]:
            resultados = dict(
                zip(bloqueInformacion['mapeo'], bloqueInformacion.values()))
            listaResultados.append(resultados)

        listaFinal.append(listaResultados)
        listaResultados = []
        tituloBloque = {}

    return docente, listaFinal


'''GENERA PDF RESUMIDO'''
def PdfResumido(request, id):

    docente, listaFinal = InformacionConfResumida(id)

    '''Generacion de PDF'''
    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    context = {'logo': logo,
               'docente': docente, 'listaFinal': listaFinal}
    html_string = render_to_string('home_page.html', context)
    html = HTML(string=html_string)
    pdf = html.write_pdf(stylesheets=[CSS(str(settings.BASE_DIR) +
                                          '/cv_api/templates/css/pdf_gen.css')], presentational_hints=True)
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="cv_resumido.pdf"'

    return response


'''GENERA DOC RESUMIDO'''
def DocResumido(request, id):

    docente, listaFinal = InformacionConfResumida(id)
    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    img_template = str(settings.BASE_DIR) + '/cv_api/templates/nieve.jpg'
    response = HttpResponse(content_type='application/msword')
    response['Content-Disposition'] = 'attachment; filename="cv_resumido.docx"'

    doc = DocxTemplate(str(settings.BASE_DIR) + '/cv_api/templates/docx_filename.docx')
    f = open(str(settings.BASE_DIR) + '/cv_api/templates/nieve.jpg','wb')
    f.write(urllib.request.urlopen(docente['foto_web_low']).read()) 

    myimage = InlineImage(doc, image_descriptor=logo, width=Mm(15), height=Mm(25))
    docente_img = InlineImage(doc, img_template, width=Mm(60), height=Mm(60))
    context = {'listaFinal': listaFinal, 'docente': docente, 'var': logo, 'myimage': myimage, 'imagen':docente_img}

    doc.render(context)
    doc.save(response) 

    return response


'''GENERA JSON RESUMIDO'''
def JsonResumido(request, id):
    
    docente, listaFinal = InformacionConfResumida(id)
    listaDocente = []
    del docente['related']
    listaDocente.append('Docente')
    listaDocente.append(docente)
    listaFinal.append(listaDocente)

    jsonString = json.dumps(listaFinal,  ensure_ascii=False).encode('utf8')
    print(jsonString)
    response = HttpResponse(jsonString.decode(), content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename=export.json'
   
    return response


# -------------------------------------------------------GENERACION DE INFORMACION-CONFIGURACION PERSONALIZADA----------------------------------------------
def InformacionConfPersonalizada(id, nombre_cv, cvHash):
    
    model_dict = models.ConfiguracionCv_Personalizado.objects.all().values().filter(id_user=id).filter(nombre_cv=nombre_cv).filter(cv=cvHash)
    model_bloques = models.Bloque.objects.all().values()
    model_servicios = models.Servicio.objects.all().values()

    dataPersonalizada = model_dict

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    listaId = dict()
    temp_data = []
    bloquesLista = []

    for servicio in model_servicios:   
        bloquesLista.append(servicio['url'])


    bloquesLista.sort()

    # bloquesLista.sort()

    '''RECORRE BLOQUES'''
    for bloque in bloquesLista: 
        print("ServicioNormal", bloque)
        print("Servicio", bloque.rsplit('/', 2)[-2])

        lista_ids = [items['id'] for items in docente['related'][bloque.rsplit('/', 2)[-2]]]

        for id in lista_ids:
            data_tt = requests.get(bloque + str(id) + "/",
                 headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
               )
            temp_data.append(data_tt.json())
        listaId[bloque.rsplit('/', 2)[-2]] = temp_data
        temp_data = []

    bloquesTodos = []

    for bloque in model_bloques:
      print("bloque", bloque['nombre'])
      bloquesTodos.append(bloque['nombre'])

    bloquesTodos.sort()

    '''Cambia valores None por cadena ('None') '''
    for claveLista, valorLista in listaId.items():
        for valor in valorLista:
        #   print(valor)
          for key, value in valor.items():
            if value is None:
                value = 'None'
            valor[key] = value

    '''BLOQUES DE MODEL BLOQUES ORDENADOS '''
    ordenadosBloquesAPi = sorted(
        dataPersonalizada, key=lambda orden: orden['ordenPersonalizable'])
    bloqueOrdenApi = [{b['nombreBloque']: b['visible_cv_bloque']}
                      for b in ordenadosBloquesAPi]

    seen = set()
    bloquesOrdenados = []
    for d in bloqueOrdenApi:
        t = tuple(d.items())
        if t not in seen:
            seen.add(t)
            bloquesOrdenados.append(d)

    print("BLOQUESORDENADOS", bloquesOrdenados)


    ordenadosBloques = [bloqueOrden for bloqueOrden in bloquesOrdenados if list(bloqueOrden.values()) != [False]]

    listaBloques = [[x for x, v in i.items()] for i in ordenadosBloques]
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

    cont = 0

    for name_bloque, data_bloque in listaId.items():  
    #   print(name_bloque)
      bloquesInformacion[bloquesTodos[cont]] = data_bloque
      cont+= 1
    print("BLOQUEINFORMACION", bloquesInformacion)


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
        listadoBloques[i] = filtrados

    bloqueAtributos = dict()
    for listadoBloque in listadoBloques:
        bloqueAtributos[listadoBloque] = [{atributo: d.get(atributo) for atributo in diccionario[listadoBloque] if d.get(
            atributo) != None} for d in bloquesInformacion[listadoBloque]]

    bloquesInfoRestante = {k: v for k, v in bloqueAtributos.items() if [
        item for item in v if item != {}]}

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

    return docente, listaFinal




'''GENERA PDF PERSONALIZADO'''
def PdfPersonalizado(request, id, nombre_cv, cvHash):

    docente, listaFinal = InformacionConfPersonalizada(id, nombre_cv, cvHash)

    print("LISTAFINAL", listaFinal)

    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    context = {'logo': logo,
               'docente': docente, 'listaFinal': listaFinal}
    html_string = render_to_string('home_page.html', context)
    html = HTML(string=html_string)
    pdf = html.write_pdf(stylesheets=[CSS(str(settings.BASE_DIR) +
                                          '/cv_api/templates/css/pdf_gen.css')], presentational_hints=True)
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="cv_personalizado.pdf"'

    return response



'''DOCUMENTO WORD PERSONALIZADO'''
def DocPersonalizado(request, id, nombre_cv, cvHash):
   
    docente, listaFinal = InformacionConfPersonalizada(id, nombre_cv, cvHash)
    logo = str(settings.BASE_DIR) + '/cv_api/templates/logoutpl.png'
    img_template = str(settings.BASE_DIR) + '/cv_api/templates/nieve.jpg'

    response = HttpResponse(content_type='application/msword')
    response['Content-Disposition'] = 'attachment; filename="cv_personalizado.docx"'

    doc = DocxTemplate(str(settings.BASE_DIR) + '/cv_api/templates/docx_filename.docx')
    f = open(str(settings.BASE_DIR) + '/cv_api/templates/nieve.jpg','wb')
    f.write(urllib.request.urlopen(docente['foto_web_low']).read()) 

    myimage = InlineImage(doc, image_descriptor=logo, width=Mm(15), height=Mm(25))
    docente_img = InlineImage(doc, img_template, width=Mm(60), height=Mm(60))
    context = {'listaFinal': listaFinal, 'docente': docente, 'var': logo, 'myimage': myimage, 'imagen':docente_img}

    doc.render(context)
    doc.save(response) 

    return response



'''GENERACION DE JSON PERSONALIZADO'''
def JsonPersonalizado(request, id, nombre_cv, cvHash):
     
    docente, listaFinal = InformacionConfPersonalizada(id, nombre_cv, cvHash)

    listaDocente = []
    del docente['related']
    listaDocente.append('Docente')
    listaDocente.append(docente)
    listaFinal.append(listaDocente)

    jsonString = json.dumps(listaFinal,  ensure_ascii=False).encode('utf8')
    print(jsonString)
    response = HttpResponse(jsonString.decode(), content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename=export.json'
   
    return response


# -------------------------------------------------------GENERACION DE TXT----------------------------------------------
'''GENERA TXT'''
def InformacionTxtArticulos(request, id):

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
        listaidArticulos.append(infobloque)

    idsArticulos = [fila['id'] for fila in listaidArticulos]

    ''' Saca articulos de docentes por ID'''
    listaArticulosDocente = []
    for id in idsArticulos:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaArticulosDocente.append(todos)

    '''Cambia valores None por cadena ('None') '''
    for i in listaArticulosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    lines = []
    for articulo in listaArticulosDocente:
        try:
            fecha = datetime.now()
            titulo = articulo['titulo']
            revista = articulo['revista']
            link_articulo = articulo['link_articulo']
            doi = articulo['doi']
            tipo_documento = articulo['tipo_documento']
            publication_stage = articulo['estado']
            lines.append(f'SIAC UTPL\nEXPORT DATE:{fecha}\n{titulo}\n{revista}\n{link_articulo}\nDOI:{doi}\nDOCUMENT TYPE:{tipo_documento}\nPUBLICATION STAGE:{publication_stage}\nSOURCE:SIAC UTPL\n\n\n\n\n\n')
        except:
            print("asdsadsa")

    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename=export.txt'
    response.writelines(lines)

    return response


def InformacionTxtLibros(request, id):

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidLibros = []
    for infobloque in docente['related']['libros']:
        listaidLibros.append(infobloque)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca libros de docentes por ID'''
    listaLibrosDocente = []
    for id in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)

    '''Cambia valores None por cadena ('None') '''
    for i in listaLibrosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    lines = []
    for libro in listaLibrosDocente:
        fecha = datetime.now()
        titulo = libro['titulo']
        revista = libro['editorial']
        link_libro = libro['link_descarga_1']
        isbn = libro['isbn']
        tipo_documento = libro['tipo_libro']
        ambito_editorial = libro['ambito_editorial']
        lines.append(f'SIAC UTPL\nEXPORT DATE:{fecha}\n{titulo}\n{revista}\n{link_libro}\nISBN:{isbn}\nDOCUMENT TYPE:{tipo_documento}\nEDITORIAL SCOPE:{ambito_editorial}\nSOURCE:SIAC UTPL\n\n\n\n\n\n')

    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename=export.txt'
    response.writelines(lines)

    return response



def InformacionTxtProyectos(request, id):

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidLibros = []
    for infobloque in docente['related']['proyectos']:
        listaidLibros.append(infobloque)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaLibrosDocente = []
    for id in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/proyectos/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)

    '''Cambia valores None por cadena ('None') '''
    for i in listaLibrosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value


    lines = []
    for pryecto in listaLibrosDocente:
        fecha = datetime.now()
        nombre_proyecto = pryecto['nombre_proyecto']
        fecha_inicio = pryecto['fecha_inicio']
        fecha_cierre = pryecto['fecha_cierre']
        tipo_proyecto = pryecto['tipo_proyecto']
        # tipo_documento = libro['tipo_libro']
        # ambito_editorial = libro['ambito_editorial']
        lines.append(f'SIAC UTPL\nEXPORT DATE:{fecha}\n{nombre_proyecto}\n{fecha_inicio}\n{fecha_cierre}\nTIPO PROYECTO:{tipo_proyecto}\nSOURCE:SIAC UTPL\n\n\n\n\n\n')

    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename=export.txt'
    response.writelines(lines)

    return response


def InformacionTxtCapacitacion(request, id):

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidLibros = []
    for infobloque in docente['related']['capacitacion']:
        listaidLibros.append(infobloque)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaCapacitacionDocente = []
    for id in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/capacitacion/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaCapacitacionDocente.append(todos)

    '''Cambia valores None por cadena ('None') '''
    for i in listaCapacitacionDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    lines = []
    for capacitacion in listaCapacitacionDocente:
        fecha = datetime.now()
        nombre = capacitacion['nombre_proyecto']
        fecha_inicio = capacitacion['fecha_inicio']
        # fecha_fin = capacitacion['fecha_cierre']
        institucion_organizadora = capacitacion['institucion_organizadora']
        # tipo_documento = libro['tipo_libro']
        # ambito_editorial = libro['ambito_editorial']
        lines.append(f'SIAC UTPL\nEXPORT DATE:{fecha}\n{nombre}\n{fecha_inicio}\n{fecha_inicio}\nINSTITUCIÓN:{institucion_organizadora}\nSOURCE:SIAC UTPL\n\n\n\n\n\n')

    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename=export.txt'
    response.writelines(lines)

    return response


def InformacionTxtGradoAcademico(request, id):

    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Articulos '''
    listaidLibros = []
    for infobloque in docente['related']['grado-academico']:
        listaidLibros.append(infobloque)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaLibrosDocente = []
    for id in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/grado-academico/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)

    '''Cambia valores None por cadena ('None') '''
    for i in listaLibrosDocente:
        for key, value in i.items():
            if value is None:
                value = 'None'
            i[key] = value

    lines = []
    for gradoAcademico in listaLibrosDocente:
        fecha = datetime.now()
        nombre = gradoAcademico['denominacion_titulo']
        fecha_inicio = gradoAcademico['fecha_inicio']
        fecha_fin = gradoAcademico['fecha_fin']
        institucion_organizadora = gradoAcademico['universidad_emisora']
        tipo_documento = gradoAcademico['tipo_titulo']
        # ambito_editorial = libro['ambito_editorial']
        lines.append(f'SIAC UTPL\nEXPORT DATE:{fecha}\n{nombre}\n{fecha_inicio}\n{fecha_fin}\nINSTITUCIÓN:{institucion_organizadora}\nTIPO DOCUMENTO:{tipo_documento}\nSOURCE:SIAC UTPL\n\n\n\n\n\n')

    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename=export.txt'
    response.writelines(lines)

    return response


# -------------------------------------------------------GENERACION DE CSV----------------------------------------------
def informacionCsvArticulos(request, id):
    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})

    docente = r.json()

    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
        listaidArticulos.append(infobloque)
        

    idsArticulos = [fila['id'] for fila in listaidArticulos]

    listaArticulosDocente = []
    for id in idsArticulos:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/' + str(id) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaArticulosDocente.append(todos)

    response = HttpResponse(content_type='text/csv')  
    response['Content-Disposition'] = 'attachment; filename="file.csv"'  
    writer = csv.writer(response)  
    
    lines = []
    for lista in listaArticulosDocente:
        try:
            const = {
              'Title ': lista['titulo'],
            #   'comments' : articulo['abstract'],
              'year' : str(lista['year']),
              'volume    ' : str(lista['volume']),
              'issue' : lista['issue'],
              'Pages': lista["pages"],
              'doi': lista['doi'],
              'link': lista['link_articulo'],
              'document_type': lista['tipo_documento'],
              'source': "siac utpl"
            }
            
            lines.append(const)
        except:
            print("asdassa")

    writer.writerow(['Titulo', 'Year', 'Volume', 'Issue', 'Pages', 'DOI', "Link", "Document Type", "Source"])
    for val in lines:
        print("i", val)
        writer.writerow(v for k, v in val.items())

    return response  



'''CSV LIBROS'''
def informacionCsvLibros(request, id):
    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})

    docente = r.json()

    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['libros']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]


    ''' Saca libros de docentes por ID'''
    listaLibrosDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaLibrosDocente.append(todos)
        print('listaLibros------------>>>>>>>>>>>>>>>>>',listaLibrosDocente)

    response = HttpResponse(content_type='text/csv')  
    response['Content-Disposition'] = 'attachment; filename="file.csv"'  
    writer = csv.writer(response)  

    lines = []
    for libro in listaLibrosDocente:
        try:
            const = {
              'Title ': libro['titulo'],
              'year' : str(libro['anio']),
              'isbn' : libro['isbn'],
              'Pages': libro["paginas"],
              'link': libro['link_descarga_1'],
              'link2': libro['link_descarga_2'],
              'tipo_libro': libro['tipo_libro'],
              'source': "siac utpl"
            }
            
            lines.append(const)
        except:
            print("asdassa")

    writer.writerow(['Titulo', 'Year', 'ISBN', 'Pages', "Link", "Link2","Document Type", "Source"])
    for val in lines:
        print("i", val)
        writer.writerow(v for k, v in val.items())

    return response  
    

'''CSV CAPACITACION'''
def informacionCsvProyectos(request, id):
    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})

    docente = r.json()

    '''Saca id Libros '''
    listaidProyectos = []
    for infoLibros in docente['related']['proyectos']:
        listaidProyectos.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidProyectos]


    ''' Saca libros de docentes por ID'''
    listaProyectosDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/proyectos/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaProyectosDocente.append(todos)
        print('listaLibros------------>>>>>>>>>>>>>>>>>',listaProyectosDocente)

    response = HttpResponse(content_type='text/csv')  
    response['Content-Disposition'] = 'attachment; filename="file.csv"'  
    writer = csv.writer(response)  


    lines = []
    for proyecto in listaProyectosDocente:
        try:
            const = {
              'Title ': proyecto['nombre_proyecto'],
              'year' : str(proyecto['fecha_cierre']),
              'programa': proyecto["programa"],
              'tipo_proyecto': proyecto['tipo_proyecto'],
              'estado': proyecto['estado'],
              'source': "siac utpl"
            }
            
            lines.append(const)
        except:
            print("asdassa")

    writer.writerow(['Titulo', 'Year', 'Temática', 'Pages', "Link", "Course Type", "Source"])
    for val in lines:
        print("i", val)
        writer.writerow(v for k, v in val.items())

    return response  


'''CSV CAPACITACION'''
def informacionCsvCapacitacion(request, id):
    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})

    docente = r.json()

    '''Saca id Libros '''
    listaidCapacitaciones = []
    for infoLibros in docente['related']['capacitacion']:
        listaidCapacitaciones.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidCapacitaciones]


    ''' Saca libros de docentes por ID'''
    listaCapacitacionesDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/capacitacion/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaCapacitacionesDocente.append(todos)
        print('listaLibros------------>>>>>>>>>>>>>>>>>',listaCapacitacionesDocente)

    response = HttpResponse(content_type='text/csv')  
    response['Content-Disposition'] = 'attachment; filename="file.csv"'  
    writer = csv.writer(response)  


    lines = []
    for capacitacion in listaCapacitacionesDocente:
        try:
            const = {
              'Title ': capacitacion['nombre'],
              'year' : str(capacitacion['fecha_inicio']),
              'tematica' : capacitacion['tematica'],
              'Pages': capacitacion["paginas"],
              'link': capacitacion['link'],
              'tipo_curso': capacitacion['tipo_curso'],
              'source': "siac utpl"
            }
            
            lines.append(const)
        except:
            print("asdassa")

    writer.writerow(['Titulo', 'Year', 'Temática', 'Pages', "Link", "Course Type", "Source"])
    for val in lines:
        print("i", val)
        writer.writerow(v for k, v in val.items())

    return response  



'''CSV CAPACITACION'''
def informacionCsvGradoAcademico(request, id):
    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})

    docente = r.json()

    '''Saca id Libros '''
    listaidCapacitaciones = []
    for infoLibros in docente['related']['grado-academico']:
        listaidCapacitaciones.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidCapacitaciones]


    ''' Saca libros de docentes por ID'''
    listaCapacitacionesDocente = []
    for idLibro in idsLibros:
        r = requests.get('https://sica.utpl.edu.ec/ws/api/grado-academico/' + str(idLibro) + "/",
                         headers={
                             'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                         )
        todos = r.json()
        listaCapacitacionesDocente.append(todos)
        print('listaLibros------------>>>>>>>>>>>>>>>>>',listaCapacitacionesDocente)

    response = HttpResponse(content_type='text/csv')  
    response['Content-Disposition'] = 'attachment; filename="file.csv"'  
    writer = csv.writer(response)  


    lines = []
    for gradoAcademico in listaCapacitacionesDocente:
        try:
            const = {
              'Title ': gradoAcademico['denominacion_titulo'],
              'year' : str(gradoAcademico['fecha_emision']),
              'pais_u_reconocedora' : gradoAcademico['pais_u_reconocedora'],
            #   'Pages': gradoAcademico["paginas"],
              'universidad_emisora': gradoAcademico['universidad_emisora'],
              'tipo_titulo': gradoAcademico['tipo_titulo'],
              'source': "siac utpl"
            }
            
            lines.append(const)
        except:
            print("asdassa")

    writer.writerow(['Titulo', 'Fecha Emisión', 'País', 'Pages', "Universidad Emisora", "Course Type", "Source"])
    for val in lines:
        print("i", val)
        writer.writerow(v for k, v in val.items())

    return response  


# -------------------------------------------------------GENERACION DE BIBTEX----------------------------------------------
def InformacionBibTexArticulos(request, id):
    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()
    
    '''Saca id Articulos '''
    listaidArticulos = []
    for infobloque in docente['related']['articulos']:
        listaidArticulos.append(infobloque)

    idsArticulos = [fila['id'] for fila in listaidArticulos]

    ''' Saca articulos de docentes por ID'''
    listaArticulosDocente = []
    for id in idsArticulos:
       r = requests.get('https://sica.utpl.edu.ec/ws/api/articulos/' + str(id) + "/",
                        headers={
                            'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                        )
       todos = r.json()
       listaArticulosDocente.append(todos)


    lines = []
    for articulo in listaArticulosDocente:
        try:
            const = {
              'journal ': articulo['revista'],
              'abstract' : articulo['abstract'],
              'title   ' : articulo['titulo'],
              'year    ' : str(articulo['year']),
              'volume  ' : str(articulo['volume']),
              'ID' : docente['primer_apellido'] + str(articulo['year']),
              'keywords': articulo["keywords"],
              'ENTRYTYPE': 'article'
            }
            lines.append(const)
        except:
            print("asdassa")

    print(lines)
    response = BibDatabase()
    response.entries = lines
    writer = BibTexWriter()
    data = writer.write(response)
    
    response = HttpResponse(data, content_type='text/x-bibtex')  
    response['Content-Disposition'] = 'attachment; filename="file.bib"' 

    return response


def InformacionBibTexLibros(request, id):
    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    print("DOCENTEBIBTEX", docente['primer_apellido'])

    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['libros']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaLibrosDocente = []
    for id in idsLibros:
       r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(id) + "/",
                        headers={
                            'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                        )
       todos = r.json()
       listaLibrosDocente.append(todos)

    lines = []
    for libro in listaLibrosDocente:
        const = {
          'editorial ': libro['editorial'],
          'comments' : "asdsa",
          'abstract' : 'description test',
          'title   ' : libro['titulo'],
          'year    ' : str(libro['anio']),
          'volume  ' : '1',
          'ID' : docente['primer_apellido'] + str(libro['anio']),
          'ENTRYTYPE': 'book'
        }
        lines.append(const)

    response = BibDatabase()
    response.entries = lines
    writer = BibTexWriter()
    data = writer.write(response)
    
    response = HttpResponse(data, content_type='text/x-bibtex')  
    response['Content-Disposition'] = 'attachment; filename="file.bib"' 

    return response




def InformacionBibTexProyectos(request, id):
    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()
    
    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['libros']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaProyectosDocente = []
    for id in idsLibros:
       r = requests.get('https://sica.utpl.edu.ec/ws/api/libros/' + str(id) + "/",
                        headers={
                            'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                        )
       todos = r.json()
       listaProyectosDocente.append(todos)

    lines = []
    for proyecto in listaProyectosDocente:
        try:
            const = {
              'journal ': proyecto['descripcion'],
              'comments' : proyecto['descripcion'],
              'abstract' : proyecto['descripcion'],
              'title   ' : proyecto['nombre_proyecto'],
              'year    ' : str(proyecto['fecha_cierre']),
              'volume  ' : '1',
              'ID' : docente['primer_apellido'] + str(proyecto['fecha_cierre']),
              'ENTRYTYPE': 'proyect'
            }
            lines.append(const)
        except:
            print("asdassa")

    response = BibDatabase()
    response.entries = lines
    writer = BibTexWriter()
    data = writer.write(response)    
    response = HttpResponse(data, content_type='text/x-bibtex')  
    response['Content-Disposition'] = 'attachment; filename="file.bib"' 

    return response


def InformacionBibTexCapacitaciones(request, id):
    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()

    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['capacitacion']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaCapacitacionesDocente = []
    for id in idsLibros:
       r = requests.get('https://sica.utpl.edu.ec/ws/api/capacitacion/' + str(id) + "/",
                        headers={
                            'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                        )
       todos = r.json()
       listaCapacitacionesDocente.append(todos)


    lines = []
    for capacitacion in listaCapacitacionesDocente:
        print("CAPACITACION", capacitacion)
        const = {
            'journal ': capacitacion['tematica'],
            'comments' : capacitacion['comite_organizador'],
            'abstract' : capacitacion['comite_organizador'],
            'title   ' : capacitacion['nombre'],
            'date    ' : capacitacion['fecha_fin'],
            'volume  ' : '1',
            'ID' : docente['primer_apellido'] + capacitacion['fecha_fin'],
            'ENTRYTYPE': 'capacitation'
        }
        lines.append(const)

    response = BibDatabase()
    response.entries = lines
    writer = BibTexWriter()
    data = writer.write(response)
    response = HttpResponse(data, content_type='text/x-bibtex')  
    response['Content-Disposition'] = 'attachment; filename="file.bib"' 

    return response


def InformacionBibTexGradoAcademico(request, id):
    r = requests.get(f'https://sica.utpl.edu.ec/ws/api/docentes/{id}/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})
    docente = r.json()
    
    '''Saca id Libros '''
    listaidLibros = []
    for infoLibros in docente['related']['grado-academico']:
        listaidLibros.append(infoLibros)

    idsLibros = [fila['id'] for fila in listaidLibros]

    ''' Saca articulos de docentes por ID'''
    listaGradoAcademicoDocente = []
    for id in idsLibros:
       r = requests.get('https://sica.utpl.edu.ec/ws/api/grado-academico/' + str(id) + "/",
                        headers={
                            'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'}
                        )
       todos = r.json()
       listaGradoAcademicoDocente.append(todos)

    lines = []

    for gradoAcademico in listaGradoAcademicoDocente:
        print("CAPACITACION", gradoAcademico)
        const = {
            'lugar_emision ': gradoAcademico['lugar_emision'],
            'pais_u_reconocedora' : gradoAcademico['pais_u_reconocedora'],
            'universidad_emisora' : gradoAcademico['universidad_emisora'],
            'denominacion_titulo   ' : gradoAcademico['denominacion_titulo'],
            'date    ' : gradoAcademico['fecha_emision'],
            'volume  ' : '1',
            'ID' : docente['primer_apellido'] + gradoAcademico['fecha_emision'],
            'ENTRYTYPE': 'capacitation'
        }
        lines.append(const)

    response = BibDatabase()
    response.entries = lines
    writer = BibTexWriter()
    data = writer.write(response)    
    response = HttpResponse(data, content_type='text/x-bibtex')  
    response['Content-Disposition'] = 'attachment; filename="file.bib"' 

    return response


def eliminaPersonalizados(request, nombre_cv, cv ):
    model_dict = models.ConfiguracionCv_Personalizado.objects.filter(nombre_cv = nombre_cv).filter(cv=cv)
    model_dict.delete()
    return redirect('/api')


def eliminaObjeto(request, bloque, atributo):
    model_dict = models.ConfiguracionCv.objects.filter(bloque = bloque).filter(atributo=atributo)
    print("ELIMINADO", model_dict)

    model_dict.delete()


    return redirect('/api')


def eliminaObjetoBloque(request, bloque):
    model_dict = models.Bloque.objects.filter(nombre = bloque)
    print("ELIMINADO", model_dict)

    model_dict.delete()


    return redirect('/api')



def eliminaObjetoConfiguracionPersonalizada(request, id_user, nombre_cv, cv, bloque, atributo):
    model_dict = models.ConfiguracionCv_Personalizado.objects.filter(id_user = id_user).filter(
        nombre_cv = nombre_cv).filter(cv=cv).filter(bloque=bloque).filter(atributo=atributo)
    # .filter(cv='7t7bxkhiw4y').filter(bloque = 'Articulos').filter(atributo='area_conocimiento_especifica').values()
    print("ELIMINADO", model_dict)


    model_dict.delete()

    eliminado = 'eliminadoServer'


    return redirect('/api')


# # Guarda los objetos que no se encuentran en un cv personalizado con respecto a los servicios de SIAC
# def guardaObjetoConfiguracionPersonalizada(request, id_user, bloque, atributo, orden, 
#     visible_cv_personalizado, mapeo, cv, nombre_cv,fecha_registro, cedula, nombreBloque, 
#     ordenPersonalizable,visible_cv_bloque):
#     # model_dict = models.ConfiguracionCv_Personalizado.objects.filter(id_user = id_user).filter(






# from django.http import JsonResponse

# # Filtrada por usuario, Bloque, nombrecv y cvHash
# def getConfPersonalizada(request, id_user, bloque, nombre_cv, cv):
#     model_dict = models.ConfiguracionCv_Personalizado.objects.filter(id_user = id_user).filter(nombre_cv=nombre_cv).values()
#     # .filter(cv=cv).filter(bloque=bloque)
#     # json_stuff = simplejson.dumps(model_dict)
#     # data = model_dict.json()
#     # data = serializers.serialize('json', model_dict)

#     print(model_dict)



#     return JsonResponse({"models_to_return": list(model_dict)})
