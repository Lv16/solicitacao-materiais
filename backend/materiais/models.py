from django.db import models
from django.contrib.auth.models import User

class Material(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    quantidade = models.PositiveIntegerField(default=0)
    embarcado = models.BooleanField(default=False)  # Indica se o material está embarcado

    def __str__(self):
        return self.nome

class Solicitacao(models.Model):
    STATUS_CHOICES = [
        ('andamento', 'Em andamento'),
        ('concluido', 'Concluído'),
        ('cancelado', 'Cancelado'),
    ]

    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='solicitacoes')
    quantidade = models.PositiveIntegerField()
    solicitante = models.CharField(max_length=100)
    data_solicitacao = models.DateTimeField(auto_now_add=True)
    atendida = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='solicitacoes')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='andamento')

    # Campos extras
    data = models.DateField(null=True, blank=True)
    supervisor = models.CharField(max_length=100, blank=True)
    embarcacao = models.CharField(max_length=100, blank=True)

    # Campos que o coordenador pode marcar
    concluida = models.BooleanField(default=False)        # Marca se a operação foi concluída
    retornado_base = models.BooleanField(default=False)   # Marca se o material retornou para a base

    def __str__(self):
        return f"{self.solicitante} - {self.material.nome} ({self.quantidade})"
