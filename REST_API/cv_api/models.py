from django.db import models

# Create your models here.


class Administrador(models.Model):
    idAministrador = models.AutoField(primary_key=True)

    class Meta:
        db_table = 'administrador'


class ConfiguracionCv(models.Model):
    id = models.AutoField(primary_key=True)
    administrador = models.ForeignKey(
        Administrador, related_name='Administrador', on_delete=models.CASCADE)
    bloque = models.CharField(max_length=150)
    atributo = models.CharField(max_length=100)
    orden = models.IntegerField()
    visible_cv_resumido = models.BooleanField(default=True)
    visible_cv_completo = models.BooleanField(default=True)
    mapeo = models.CharField(max_length=150)

    class Meta:
        db_table = 'configuracionCV'
        

class Docente(models.Model):

    idDocente = models.AutoField(primary_key=True)
    

    class Meta:
        db_table = 'docente'


class ConfiguracionCv_Personalizado(models.Model):
    id = models.AutoField(primary_key=True)
    idDocente = models.ForeignKey(Docente, related_name='Docente',  on_delete=models.CASCADE)
    bloque = models.CharField(max_length=150)
    atributo = models.CharField(max_length=100)
    visible_cv_personalizado = models.BooleanField(default=True)
    mapeo = models.CharField(max_length=150)
    cv = models.IntegerField(default=None)
    nombre_cv = models.CharField(max_length=100)
    fecha_registro = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    class Meta:
        db_table = 'configuracioncvPersonalizado'

