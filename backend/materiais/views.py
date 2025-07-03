from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Material, Solicitacao

@login_required
def lista_materiais(request):
    materiais = Material.objects.all()
    return render(request, 'materiais/lista_materiais.html', {'materiais': materiais})

@login_required
def cria_material(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        descricao = request.POST.get('descricao')
        quantidade = request.POST.get('quantidade', 0)
        Material.objects.create(nome=nome, descricao=descricao, quantidade=quantidade)
        return redirect('lista_materiais')
    return render(request, 'materiais/cria_material.html')

@login_required
def lista_solicitacoes(request):
    solicitacoes = Solicitacao.objects.filter(user=request.user)
    return render(request, 'materiais/lista_solicitacoes.html', {'solicitacoes': solicitacoes})

@login_required
def cria_solicitacao(request):
    materiais = Material.objects.all()
    if request.method == 'POST':
        material_id = request.POST.get('material')
        quantidade = request.POST.get('quantidade')
        solicitante = request.POST.get('solicitante')
        Solicitacao.objects.create(
            material_id=material_id,
            quantidade=quantidade,
            solicitante=solicitante,
            user=request.user
        )
        return redirect('lista_solicitacoes')
    return render(request, 'materiais/cria_solicitacao.html', {'materiais': materiais})