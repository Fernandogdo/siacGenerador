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
from django.template.loader import get_template
from weasyprint import HTML
import webbrowser

from fpdf import FPDF


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

    # # Draw things on the PDF. Here's where the PDF generation happens.
    # # See the ReportLab documentation for the full list of functionality.
    logo = ImageReader(
        'https://www.utpl.edu.ec/manual_imagen/images/institucional/UTPL-INSTITUCIONAL-color.jpg')

    p.drawString(180, 800, "UNIVERSIDAD TECNICA PARTICULAR DE LOJA")
    p.drawImage(logo, 30, 760, 120, 70)
    y = x = 0
    dy = cm*4/4.0
    dx = cm*5.5/5
    w = h = dy/2
    # rdx = (dx-w)/2
    rdy = h/4.0
    texty = h+4*rdy
    x1 = 40
    y1 = 750
    for k, v in todos.items():
        # data = (todo, ":", todos[todo])
        p.drawString(x1, y1-10, f"{k}: {v}")
        y1 = y1-15
        # x = x+dx
        # y = y + dy
        # x = 0

    # Close the PDF object cleanly, and we're done.
    p.showPage()
    p.save()

    # FileResponse sets the Content-Disposition header so that browsers
    # present the option to save the file.
    buffer.seek(0)

    # open a public URL, in this case, the webbrowser docs
    # url = "http://docs.python.org/library/webbrowser.html"
    # webbrowser.open(url, new=new)

    # open an HTML file on my own (Windows) computer
    # url = "file://X:/MiscDev/language_links.html"
    # filename='hello.pdf'
    # webbrowser.open(filename, new=new)

    # document = FPDF()
    # document.add_page()
    # document.set_font('helvetica', size=12)
    # document.cell(w=0, txt="hello world")
    # document.output()

    return FileResponse(buffer, as_attachment=True, filename='hello.pdf')
# FileResponse(buffer, as_attachment=True, filename='hello.pdf')


# document = FPDF()
# document.add_page()
# document.set_font('helvetica', size=12)
# document.cell(w=0, txt="hello world")
# document.output("hello_world.pdf")
