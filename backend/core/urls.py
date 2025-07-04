from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.contrib.auth import views as auth_views
from materiais.forms import EmailAuthenticationForm

urlpatterns = [
    path('', lambda request: redirect('lista_materiais'), name='root'),
    path('admin/', admin.site.urls),
    path('', include('materiais.urls')),  # Inclui todas as rotas do app materiais sem duplicar prefixo
    path('accounts/', include('django.contrib.auth.urls')),
    path('accounts/login/', auth_views.LoginView.as_view(
        authentication_form=EmailAuthenticationForm
    ), name='login'),
]