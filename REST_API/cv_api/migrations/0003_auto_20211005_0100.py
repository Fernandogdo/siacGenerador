# Generated by Django 3.1.7 on 2021-10-05 01:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv_api', '0002_auto_20211005_0059'),
    ]

    operations = [
        migrations.AddField(
            model_name='configuracioncv_personalizado',
            name='ordenCompleto',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='configuracioncv_personalizado',
            name='ordenResumido',
            field=models.IntegerField(default=1),
        ),
    ]