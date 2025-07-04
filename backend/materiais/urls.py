from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista_materiais, name='home'),
    path('materiais/', views.lista_materiais, name='lista_materiais'),
    path('solicitacoes/', views.lista_solicitacoes, name='lista_solicitacoes'),
    path('solicitacoes/nova/', views.cria_solicitacao, name='cria_solicitacao'),
    path('solicitacoes/atualizar-status/', views.atualizar_status_solicitacao, name='atualizar_status_solicitacao'),
    path('solicitacoes/marcar-retorno/', views.marcar_retorno_material, name='marcar_retorno_material'), 
]
