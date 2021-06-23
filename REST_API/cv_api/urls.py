from django.urls import path, include
from django.urls.conf import re_path
from django.views.generic import base
from rest_framework import routers
from . import views
# from  import LoginView

router = routers.DefaultRouter()
router.register(r'configuracioncv', views.ConfiguracionCvView)
router.register(r'configuracioncv_personalizado', views.ConfiguracionCv_PersonalizadoView)
router.register(r'usuario', views.DocenteView)
router.register(r'administrador', views.AdministradorView)
router.register(r'bloque', views.BloqueView)
# router.register(r'vistapdf', views.data, basename='mymodel')


urlpatterns = [
  path('', include(router.urls)),
  path('login/', views.LoginView.as_view()),
  path('pdf-completo/', views.PdfCompleto),
  path('pdf-resumido/<int:id>', views.PdfResumido), 
  path('pdf-personalizado/<int:id>', views.PdfPersonalizado),
  re_path('^datausuario/(?P<id_user>.+)/$', views.getdata),

  re_path('^personalizacion_usuario/(?P<id_user>.+)/$', views.PersonalizacionUsuario.as_view()),
]