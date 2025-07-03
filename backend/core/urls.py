from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

urlpatterns = [
    path('', lambda request: redirect('lista_materiais'), name='root'),  # Redireciona / para lista_materiais
    path('admin/', admin.site.urls),
    path('materiais/', include('materiais.urls')),
    path('solicitacoes/', include('materiais.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
]