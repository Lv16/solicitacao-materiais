from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Cria usuários em lote com senha padrão 12345'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        emails = [
            'ketley.barbosa@ambipar.com',
            'ailton.oliveira@ambipar.com',
            'jorge.lucas@ambipar.com',
            'thales.menezes@ambipar.com',
            'cleyton.ssilva@ambipar.com',
            'ricardo.moura@ambipar.com',
            'alberto.silva@ambipar.com',

            
        ]
        senha_padrao = '12345'
        for email in emails:
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=senha_padrao
                )
                self.stdout.write(self.style.SUCCESS(f'Usuário criado: {email}'))
            else:
                self.stdout.write(self.style.WARNING(f'Usuário já existe: {email}'))