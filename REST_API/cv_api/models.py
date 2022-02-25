from django.db import models
from django.contrib.auth.models import AbstractBaseUser, AbstractUser


class Usuario(AbstractUser):

    id_user = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100, default="testname")
    last_name = models.CharField(max_length=100, default="test_lastname")
    username = models.CharField(max_length=100, unique=True, default="username")

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = ['id_user', 'first_name', 'last_name']
    class Meta:
        db_table = 'usuario'


class ConfiguracionCv(models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        Usuario, related_name='Usuario', on_delete=models.CASCADE)
    bloque = models.CharField(max_length=150)
    bloqueService = models.CharField(max_length=150, default="articulos")
    atributo = models.CharField(max_length=100)
    ordenCompleto = models.IntegerField(default=1)
    ordenResumido = models.IntegerField(default=1)
    visible_cv_resumido = models.BooleanField(default=True)
    visible_cv_completo = models.BooleanField(default=True)
    mapeo = models.CharField(max_length=150, null=True, blank=True)
    

    class Meta:
        
        unique_together = ["bloque", "atributo"] 
        db_table = 'configuracionCV'

        

class ConfiguracionCv_Personalizado(models.Model):
    id = models.AutoField(primary_key=True)
    id_user = models.CharField(max_length=11)  
    bloque = models.CharField(max_length=150)
    atributo = models.CharField(max_length=100)
    orden = models.IntegerField(default=1)
    visible_cv_personalizado = models.BooleanField(default=True)
    mapeo = models.CharField(max_length=150, blank=True)
    cv = models.CharField(max_length=20)
    nombre_cv = models.CharField(max_length=100, default="personalizado_cv")
    fecha_registro = models.DateTimeField(null=True, blank=True)
    cedula = models.CharField(max_length=11)
    ordenPersonalizable = models.IntegerField(default=1)
    visible_cv_bloque = models.BooleanField(default=True)
    class Meta:
        # unique_together = [''] 
        db_table = 'configuracioncvPersonalizado'

        
                
class Bloque(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nombreService = models.CharField(max_length=100, default="")
    ordenCompleto = models.IntegerField(default=1 )
    ordenResumido = models.IntegerField(default=0)
    ordenPersonalizable = models.IntegerField(default=0)
    visible_cv_bloqueCompleto = models.BooleanField(default=True)
    visible_cv_bloqueResumido = models.BooleanField(default=True)
    class Meta:
        db_table = 'bloque'



class Servicio(models.Model):
    id = models.AutoField(primary_key=True)
    bloqueNombre = models.CharField(max_length=150)
    url = models.URLField(max_length=300)

    class Meta:
        unique_together = ["bloqueNombre", "url"] 
        db_table = 'servicio'