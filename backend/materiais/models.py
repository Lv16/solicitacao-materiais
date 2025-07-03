from django.db import models
from django.contrib.auth.models import User

class Material(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    quantidade = models.PositiveIntegerField(default=0)
    embarcado = models.BooleanField(default=False)  # Adicione este campo

    def __str__(self):
        return self.nome

class Solicitacao(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='solicitacoes')
    quantidade = models.PositiveIntegerField()
    solicitante = models.CharField(max_length=100)
    data_solicitacao = models.DateTimeField(auto_now_add=True)
    atendida = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='solicitacoes')

    def __str__(self):
        return f"{self.solicitante} - {self.material.nome} ({self.quantidade})"