from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'configuracioncv', views.ConfiguracionCvView)
router.register(r'configuracioncv_personalizado', views.ConfiguracionCv_PersonalizadoView)
router.register(r'docente', views.DocenteView)
router.register(r'administrador', views.AdministradorView)

urlpatterns = [
  path('', include(router.urls))
  # path('configuracioncv/<int:id>/', views.ConfiguracionCvView.as_view()),
]