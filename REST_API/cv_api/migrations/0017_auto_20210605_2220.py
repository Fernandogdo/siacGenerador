# Generated by Django 3.1.7 on 2021-06-05 22:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cv_api', '0016_auto_20210524_2257'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bloque',
            old_name='orden',
            new_name='ordenCompleto',
        ),
    ]