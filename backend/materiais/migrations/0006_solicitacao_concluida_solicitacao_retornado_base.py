# Generated by Django 5.2.4 on 2025-07-04 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('materiais', '0005_solicitacao_data_solicitacao_embarcacao_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='solicitacao',
            name='concluida',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='solicitacao',
            name='retornado_base',
            field=models.BooleanField(default=False),
        ),
    ]
