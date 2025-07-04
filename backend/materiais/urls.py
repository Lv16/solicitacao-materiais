from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista_materiais, name='home'),
    path('materiais/', views.lista_materiais, name='lista_materiais'),
    path('solicitacoes/', views.lista_solicitacoes, name='lista_solicitacoes'),
    path('solicitacoes/nova/', views.cria_solicitacao, name='cria_solicitacao'),
]