from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Material, Solicitacao
from django.http import JsonResponse
from django.views.decorators.http import require_POST

@login_required
def lista_materiais(request):
    materiais = Material.objects.all()
    return render(request, 'materiais/lista_materiais.html', {'materiais': materiais})

@login_required
def lista_solicitacoes(request):
    solicitacoes = Solicitacao.objects.filter(user=request.user)
    return render(request, 'materiais/lista_solicitacoes.html', {'solicitacoes': solicitacoes})

@login_required
def cria_solicitacao(request):
    if request.method == 'POST':
        material_id = request.POST.get('material_id')
        quantidade = request.POST.get('quantidade')
        observacao = request.POST.get('observacao', '')  # você pode usar esse campo se quiser salvar depois
        data_embarque = request.POST.get('data')
        supervisor = request.POST.get('supervisor', '')
        embarcacao = request.POST.get('embarcacao', '')

        try:
            material = Material.objects.get(id=material_id)
        except Material.DoesNotExist:
            return JsonResponse({'error': 'Material não encontrado'}, status=404)

        Solicitacao.objects.create(
            material=material,
            quantidade=quantidade,
            solicitante=request.user.get_full_name() or request.user.email,
            user=request.user,
            status='andamento',
            data=data_embarque if data_embarque else None,
            supervisor=supervisor,
            embarcacao=embarcacao,
        )
        return JsonResponse({'success': True})

    return JsonResponse({'error': 'Método não permitido'}, status=400)

@login_required
@require_POST
def atualizar_status_solicitacao(request):
    solicitacao_id = request.POST.get('id')
    novo_status = request.POST.get('status')

    try:
        solicitacao = Solicitacao.objects.get(id=solicitacao_id, user=request.user)
        if novo_status in dict(Solicitacao.STATUS_CHOICES):
            solicitacao.status = novo_status
            solicitacao.save()
            return JsonResponse({'success': True, 'status': novo_status})
        else:
            return JsonResponse({'error': 'Status inválido'}, status=400)
    except Solicitacao.DoesNotExist:
        return JsonResponse({'error': 'Solicitação não encontrada'}, status=404)
