# Generated by Django 3.1.7 on 2021-06-09 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv_api', '0017_auto_20210605_2220'),
    ]

    operations = [
        migrations.AlterField(
            model_name='configuracioncv',
            name='mapeo',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
    ]