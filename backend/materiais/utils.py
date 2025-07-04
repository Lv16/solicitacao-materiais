from django.core.mail import send_mail
from django.conf import settings

def enviar_email_confirmacao(solicitacao):
    assunto = 'Confirmação de Solicitação de Material'
    
    mensagem = (
        f"Olá {solicitacao.solicitante},\n\n"
        f"Sua solicitação de {solicitacao.quantidade} unidade(s) do material '{solicitacao.material.nome}' foi registrada com sucesso.\n\n"
        f"Detalhes:\n"
        f"- Embarcação: {solicitacao.embarcacao or 'Não informado'}\n"
        f"- Supervisor: {solicitacao.supervisor or 'Não informado'}\n"
        f"- Data de embarque: {solicitacao.data or 'Não informada'}\n\n"
        "Atenciosamente,\n"
        "Sistema de Controle de Materiais"
    )

    destinatarios = [
        solicitacao.user.email,
        'aprendiz.controles@ambipar.com'
    ]

    send_mail(
        subject=assunto,
        message=mensagem,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=destinatarios,
        fail_silently=False
    )
