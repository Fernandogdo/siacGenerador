# Generated by Django 3.1.7 on 2021-10-05 00:59

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Docente',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id_user', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(default='testname', max_length=100)),
                ('last_name', models.CharField(default='test_lastname', max_length=100)),
                ('username', models.CharField(default='username', max_length=100, unique=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'db_table': 'docente',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Administrador',
            fields=[
                ('idAministrador', models.AutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'administrador',
            },
        ),
        migrations.CreateModel(
            name='Bloque',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100, unique=True)),
                ('ordenCompleto', models.IntegerField(default=1)),
                ('ordenResumido', models.IntegerField(default=0)),
                ('ordenPersonalizable', models.IntegerField(default=0)),
                ('visible_cv_bloqueCompleto', models.BooleanField(default=True)),
                ('visible_cv_bloqueResumido', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'bloque',
            },
        ),
        migrations.CreateModel(
            name='ConfiguracionCv_Personalizado',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('bloque', models.CharField(max_length=150)),
                ('atributo', models.CharField(max_length=100)),
                ('ordenCompleto', models.IntegerField(default=1)),
                ('ordenResumido', models.IntegerField(default=1)),
                ('visible_cv_personalizado', models.BooleanField(default=True)),
                ('mapeo', models.CharField(max_length=150)),
                ('cv', models.CharField(max_length=20)),
                ('nombre_cv', models.CharField(default='personalizado_cv', max_length=100)),
                ('fecha_registro', models.DateTimeField(auto_now_add=True, null=True)),
                ('cedula', models.TextField(max_length=10)),
                ('nombreBloque', models.CharField(default='Articulos', max_length=20)),
                ('ordenPersonalizable', models.IntegerField(default=1)),
                ('visible_cv_bloque', models.BooleanField(default=True)),
                ('id_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Docente', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'configuracioncvPersonalizado',
                'unique_together': {('bloque', 'atributo', 'nombre_cv', 'cedula')},
            },
        ),
        migrations.CreateModel(
            name='ConfiguracionCv',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('bloque', models.CharField(max_length=150)),
                ('atributo', models.CharField(max_length=100)),
                ('orden', models.IntegerField()),
                ('visible_cv_resumido', models.BooleanField(default=True)),
                ('visible_cv_completo', models.BooleanField(default=True)),
                ('mapeo', models.CharField(blank=True, max_length=150, null=True)),
                ('administrador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Administrador', to='cv_api.administrador')),
            ],
            options={
                'db_table': 'configuracionCV',
                'unique_together': {('bloque', 'atributo')},
            },
        ),
    ]
