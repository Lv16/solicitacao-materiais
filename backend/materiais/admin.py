from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Material, Solicitacao

admin.site.register(Material)
admin.site.register(Solicitacao)