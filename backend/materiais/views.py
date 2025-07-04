from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Material, Solicitacao
from django.http import JsonResponse

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
        observacao = request.POST.get('observacao', '')
        try:
            material = Material.objects.get(id=material_id)
        except Material.DoesNotExist:
            return JsonResponse({'error': 'Material não encontrado'}, status=404)
        Solicitacao.objects.create(
            material=material,
            quantidade=quantidade,
            solicitante=request.user.get_full_name() or request.user.email,
            user=request.user,
            # Adicione outros campos se necessário
        )
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Método não permitido'}, status=400)