from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone
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
        try:
            quantidade = int(request.POST.get('quantidade'))
        except (ValueError, TypeError):
            return JsonResponse({'error': 'Quantidade inválida'}, status=400)

        observacao = request.POST.get('observacao', '')
        data_embarque = request.POST.get('data')
        supervisor = request.POST.get('supervisor', '')
        embarcacao = request.POST.get('embarcacao', '')

        try:
            material = Material.objects.get(id=material_id)
        except Material.DoesNotExist:
            return JsonResponse({'error': 'Material não encontrado'}, status=404)

        # Verifica se há quantidade suficiente em estoque
        if material.quantidade < quantidade:
            return JsonResponse({'error': 'Quantidade indisponível em estoque.'}, status=400)

        # Cria a solicitação
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

        # Atualiza o estoque do material
        material.quantidade -= quantidade
        material.save()

        return JsonResponse({'success': True})

    return JsonResponse({'error': 'Método não permitido'}, status=400)

@login_required
@require_POST
def atualizar_status_solicitacao(request):
    solicitacao_id = request.POST.get('id')
    novo_status = request.POST.get('status')

    try:
        solicitacao = Solicitacao.objects.get(id=solicitacao_id, user=request.user)

        if novo_status not in dict(Solicitacao.STATUS_CHOICES):
            return JsonResponse({'error': 'Status inválido'}, status=400)

        # Se for cancelado e ainda não estava cancelado, devolve ao estoque
        if novo_status == 'cancelado' and solicitacao.status != 'cancelado':
            solicitacao.material.quantidade += solicitacao.quantidade
            solicitacao.material.save()

        # Se for concluído e ainda não estava concluído, devolve ao estoque
        if novo_status == 'concluido' and solicitacao.status != 'concluido':
            solicitacao.material.quantidade += solicitacao.quantidade
            solicitacao.material.save()

        solicitacao.status = novo_status
        solicitacao.save()

        return JsonResponse({'success': True, 'status': novo_status})

    except Solicitacao.DoesNotExist:
        return JsonResponse({'error': 'Solicitação não encontrada'}, status=404)

@login_required
@require_POST
def marcar_retorno_material(request):
    solicitacao_id = request.POST.get('id')

    try:
        solicitacao = Solicitacao.objects.get(id=solicitacao_id, user=request.user)

        # Marca que o material retornou para a base
        solicitacao.retornado_base = True
        solicitacao.save()

        # Atualiza o estoque do material somando a quantidade da solicitação
        solicitacao.material.quantidade += solicitacao.quantidade
        solicitacao.material.save()

        return JsonResponse({'success': True, 'message': 'Material marcado como retornado e estoque atualizado.'})

    except Solicitacao.DoesNotExist:
        return JsonResponse({'error': 'Solicitação não encontrada'}, status=404)
