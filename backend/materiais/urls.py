from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista_materiais, name='home'),  # <-- ESSA LINHA É ESSENCIAL!
    path('materiais/', views.lista_materiais, name='lista_materiais'),
    path('materiais/novo/', views.cria_material, name='cria_material'),
    path('solicitacoes/', views.lista_solicitacoes, name='lista_solicitacoes'),
    path('solicitacoes/nova/', views.cria_solicitacao, name='cria_solicitacao'),
]