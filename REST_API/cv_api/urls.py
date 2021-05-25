from django.urls import path, include
from rest_framework import routers
from . import views
# from  import LoginView

router = routers.DefaultRouter()
router.register(r'configuracioncv', views.ConfiguracionCvView)
router.register(r'configuracioncv_personalizado', views.ConfiguracionCv_PersonalizadoView)
router.register(r'docente', views.DocenteView)
router.register(r'administrador', views.AdministradorView)
router.register(r'bloque', views.BloqueView)
router.register(r'personalizacion_usuario', views.PersonalizacionUsuario, basename='mymodel')

urlpatterns = [
  path('', include(router.urls)),
  path('login/', views.LoginView.as_view()),
  # path('configuracioncv/<int:id>/', views.ConfiguracionCvView.as_view()),
]