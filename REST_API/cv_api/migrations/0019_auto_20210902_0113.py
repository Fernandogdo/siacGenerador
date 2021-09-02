# Generated by Django 3.1.7 on 2021-09-02 01:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv_api', '0018_auto_20210609_1517'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bloque',
            name='nombre',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterUniqueTogether(
            name='configuracioncv',
            unique_together={('bloque', 'atributo')},
        ),
    ]
