from .generapdf import PDF
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
import requests
import subprocess
import sys
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas
from rest_framework.decorators import api_view
from reportlab.lib.units import cm
from reportlab.lib.utils import ImageReader
# from config.wsgi import *
# from django.template.loader import get_template
# import webbrowser

# from pyfpdf import FPDF
from fpdf import FPDF
from django.http import HttpResponse


from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from django.template.loader import render_to_string

from rest_framework.renderers import JSONRenderer


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


@api_view()
def hello_world(request):
    r = requests.get('https://sica.utpl.edu.ec/ws/api/docentes/1/',
                     headers={'Authorization': 'Token 54fc0dc20849860f256622e78f6868d7a04fbd30'})

    todos = r.json()
    buffer = io.BytesIO()

    # Create the PDF object, using the buffer as its "file."
    p = canvas.Canvas(buffer)

    logo = ImageReader(
        'https://www.utpl.edu.ec/manual_imagen/images/institucional/UTPL-INSTITUCIONAL-color.jpg')

    p.drawString(180, 800, "UNIVERSIDAD TECNICA PARTICULAR DE LOJA")
    p.drawImage(logo, 30, 760, 120, 70)

    x1 = 40
    y1 = 750
    for k, v in todos.items():
        # data = (todo, ":", todos[todo])
        p.drawString(x1, y1-10, f"{k}: {v}")
        y1 = y1-15

    # Close the PDF object cleanly, and we're done.
    p.showPage()
    p.save()

    buffer.seek(0)

    return FileResponse(buffer, as_attachment=True, filename='hello.pdf')


# def generar_pdf(html, namefile):


#     """
#     Funcion para generar el archivo PDF y devolverlo mediante HttpResponse
#     """
#     result = StringIO.StringIO()
#     print result
#     pdf = pisa.pisaDocument(StringIO.StringIO(html.encode("utf-8")), result)
#     if not pdf.err:
#     response = HttpResponse(result.getvalue(), mimetype='application/pdf')
#     response['Content-Disposition'] = 'attachment; filename=%s' % namefile
#     return response
#     return HttpResponse('Error al generar el PDF: %s' % cgi.escape(html))


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
    
    # stu = models.ConfiguracionCv_Personalizado.objects.filter(id_user=4)
    serializer = ConfiguracionCv_PersonalizadoSerializer(models.ConfiguracionCv_Personalizado.objects.filter(id_user=4), many=True)
    # print(serializer.data)
    json_data = JSONRenderer().render(serializer.data)
    # print(json_data)

    model_dict = models.ConfiguracionCv_Personalizado.objects.all().values()
    print('diccionario', model_dict)

    completos = [   
    {
        "id": 7,
        "configuracionId": 2,
        "bloque": "Articulos",
        "atributo": "titulo",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "titulo",
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
        "id": 12,
        "configuracionId": 3,
        "bloque": "Articulos",
        "atributo": "abstract",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "abstract",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.267238Z",
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
        "mapeo": "link_articulo",
        "cv": "1",
        "nombre_cv": "test",
        "fecha_registro": "2021-05-27T17:50:22.540325Z",
        "cedula": "123",
        "id_user": 3
    },
    {
        "id": 15,
        "configuracionId": 5,
        "bloque": "Articulos",
        "atributo": "link_articulo",
        "orden": 1,
        "visible_cv_personalizado": True,
        "mapeo": "link_articulo",
        "cv": "1",
        "nombre_cv": "data",
        "fecha_registro": "2021-05-27T17:50:22.540325Z",
        "cedula": "123",
        "id_user": 3
    },
 ]

    data = [
 {
            "id": 3472,
    "authors": [
        "http://172.16.80.59/siac/api/docentes/5651/"
    ],
    "titulo": "Berberine, an epiphany against cancer ",
    "abstract": "Alkaloids are used in traditional medicine for the treatment of many diseases",
    "keywords": "Apoptosis; Autophagy; Berberine; Cancer; Traditional medicine",
    "link_articulo": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84906695069&origin=inward",
    "fecha_envio": "2014-08-01",
    "fecha_aceptacion": "2014-08-01",
    "fecha_publicacion": "2014-08-01",
    "fecha_indexacion": "2014-01-01",
    "pais": "Otro",
    "ciudad": "",
    "doi": "10.3390/molecules190812349",
    "indice": "Scopus",
    "year": 2014,
    "issn": "14203049",
    "isbn": "",
    "tipo_documento": "review",
    "nombre_conferencia": "",
    "link_revista": "",
    "quartil_revista": 1,
    "sjr": 0.65,
    "afiliacion_utpl": "si",
    "volume": 19,
    "pages": "12349-12367",
    "issue": 8,
    "revista": "Molecules",
    "eissn": "",
    "idioma": "Inglés",
    "estado": "Indexado"
        },
    {
    "id": 3472,
    "authors": [
        "http://172.16.80.59/siac/api/docentes/5651/"
    ],
    "titulo": "Berberine, an epiphany against cancer ",
    "abstract": "Alkaloids are used in traditional medicine for the treatment of many diseases.",
    "keywords": "Apoptosis; Autophagy; Berberine; Cancer; Traditional medicine",
    "link_articulo": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84906695069&origin=inward",
    "fecha_envio": "2014-08-01",
    "fecha_aceptacion": "2014-08-01",
    "fecha_publicacion": "2014-08-01",
    "fecha_indexacion": "2014-01-01",
    "pais": "Otro",
    "ciudad": "",
    "doi": "10.3390/molecules190812349",
    "indice": "Scopus",
    "year": 2014,
    "issn": "14203049",
    "isbn": "",
    "tipo_documento": "review",
    "nombre_conferencia": "",
    "link_revista": "",
    "quartil_revista": 1,
    "sjr": 0.65,
    "afiliacion_utpl": "si",
    "volume": 19,
    "pages": "12349-12367",
    "issue": 8,
    "revista": "Molecules",
    "eissn": "",
    "idioma": "Inglés",
    "estado": "Indexado"
    }

    
]
    # print(model_dict)
    visibles = [ d["atributo"]  for d in completos 
          if d.get("visible_cv_personalizado") ]
    
    mapeo = [ d["mapeo"] for d in completos if d.get("visible_cv_personalizado") ]
    
    filtrados = [ {atributo: d.get(atributo) for atributo in visibles} for d in data]

    i = []
    contador = 0
    for i in filtrados:
    #   print('i', i)
      i["mapeo"] = [i for i in mapeo] 
      contador +=1
    print('filtrados', filtrados)
    filtrados.reverse()
    # PDF = generapdf.PDF
    pdf = PDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_font('Times', '', 11)

    for filtrado in range(len(filtrados)):
        var = filtrados[filtrado]['mapeo']
        contador = 0
        for key, valor in filtrados[filtrado].items():
            if contador < len(var):
                pdf.cell(0, 10, f"{var[contador]}: {valor}", 0, 1)
            contador += 1
    # pdf.output('tuto2.pdf', 'F')


    # pdf.cell(0, 10, f"{k}: {v}", 0, 1)

    pdf = pdf.output(dest='S').encode('latin-1')
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="mypdf.pdf"'
    return(response)


class Personalizacion(generics.ListAPIView):
    serializer_class = ConfiguracionCv_PersonalizadoSerializer
    # queryset = models.ConfiguracionCv_Personalizado.objects.all()

    def get_queryset(self):
        id_user = self.kwargs['id_user']
        return models.ConfiguracionCv_Personalizado.objects.filter(id_user=id_user)

def getUsuarios(request):
    stu = models.ConfiguracionCv_Personalizado.objects.filter(id_user=4)
    serializer = ConfiguracionCv_PersonalizadoSerializer(stu, many=True)
    print(serializer.data)
    json_data = JSONRenderer().render(serializer.data)
    return HttpResponse(json_data, content_type='application/json')