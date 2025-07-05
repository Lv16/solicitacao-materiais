/* Menu dropdown */
function toggleMenu() {
    const menu = document.getElementById('dropdown');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

window.addEventListener('click', function (e) {
    const menu = document.getElementById('dropdown');
    const img = document.querySelector('.user-img');
    if (!img.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = 'none';
    }
});

/* Filtros e Busca */
const botoesFiltro = document.querySelectorAll('.filtro');
const cards = document.querySelectorAll('.card-solicitacao');
const inputPesquisa = document.getElementById('pesquisa');

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        const status = botao.getAttribute('data-status');

        // Destacar botão ativo
        botoesFiltro.forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');

        // Filtrar cards
        filtrarCards(status, inputPesquisa.value.trim().toLowerCase());
    });
});

inputPesquisa.addEventListener('input', () => {
    const statusAtivo = document.querySelector('.filtro.ativo').getAttribute('data-status');
    filtrarCards(statusAtivo, inputPesquisa.value.trim().toLowerCase());
});

function filtrarCards(status, termo) {
    cards.forEach(card => {
        const statusCard = card.dataset.status;
        const embarcacaoP = card.querySelector('p:nth-of-type(1)');
        const embarcacao = embarcacaoP ? embarcacaoP.textContent.replace('Embarcação:', '').trim().toLowerCase() : '';

        const matchStatus = (status === 'todos' || status === statusCard);
        const matchPesquisa = embarcacao.includes(termo);

        if (matchStatus && matchPesquisa) {
            card.classList.remove('escondido');
        } else {
            card.classList.add('escondido');
        }
    });
}

/* Criar modal loading e container de mensagens */
const modalLoading = document.createElement('div');
modalLoading.id = 'modal-loading';
modalLoading.style.position = 'fixed';
modalLoading.style.top = '0';
modalLoading.style.left = '0';
modalLoading.style.width = '100vw';
modalLoading.style.height = '100vh';
modalLoading.style.backgroundColor = 'rgba(0,0,0,0.4)';
modalLoading.style.display = 'flex';
modalLoading.style.justifyContent = 'center';
modalLoading.style.alignItems = 'center';
modalLoading.style.zIndex = '9999';
modalLoading.style.fontSize = '1.5rem';
modalLoading.style.color = 'white';
modalLoading.style.fontWeight = 'bold';
modalLoading.style.display = 'none';
modalLoading.textContent = 'Aguarde...';
document.body.appendChild(modalLoading);

function mostrarLoading() {
    modalLoading.style.display = 'flex';
}

function esconderLoading() {
    modalLoading.style.display = 'none';
}

const mensagemContainer = document.createElement('div');
mensagemContainer.id = 'mensagem-feedback';
mensagemContainer.style.position = 'fixed';
mensagemContainer.style.top = '10px';
mensagemContainer.style.left = '50%';
mensagemContainer.style.transform = 'translateX(-50%)';
mensagemContainer.style.padding = '10px 20px';
mensagemContainer.style.borderRadius = '5px';
mensagemContainer.style.fontWeight = 'bold';
mensagemContainer.style.fontSize = '1.2rem';
mensagemContainer.style.zIndex = '10000';
mensagemContainer.style.display = 'none';
mensagemContainer.style.color = '#fff';
document.body.appendChild(mensagemContainer);

function mostrarMensagem(texto, tipo = 'success') {
    mensagemContainer.textContent = texto;
    mensagemContainer.style.backgroundColor = tipo === 'success' ? '#4caf50' : '#f44336';
    mensagemContainer.style.display = 'block';
    setTimeout(() => {
        mensagemContainer.style.display = 'none';
    }, 3000);
}

/* Logout */
const logoutBtn = document.querySelector('.logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        mostrarMensagem('Você saiu!', 'success');
        // window.location.href = 'login.html';
    });
}

/* Função para pegar o token CSRF do cookie */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/* Função para atualizar o status da solicitação via AJAX */
function atualizarStatus(id, novoStatus) {
    mostrarLoading();

    fetch("/solicitacoes/atualizar-status/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCookie('csrftoken')
        },
        body: `id=${id}&status=${novoStatus}`
    })
    .then(response => response.json())
    .then(data => {
        esconderLoading();

        if (data.success) {
            mostrarMensagem("Status atualizado para: " + data.status, 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            mostrarMensagem("Erro ao atualizar: " + data.error, 'error');
        }
    })
    .catch(error => {
        esconderLoading();
        mostrarMensagem("Erro na requisição", 'error');
        console.error(error);
    });
}

/* Função para marcar o retorno do material */
function marcarComoRetornado(id) {
    mostrarLoading();

    fetch("/solicitacoes/marcar-retorno/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCookie('csrftoken')
        },
        body: `id=${id}`
    })
    .then(response => response.json())
    .then(data => {
        esconderLoading();

        if (data.success) {
            mostrarMensagem(data.message, 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            mostrarMensagem("Erro: " + data.error, 'error');
        }
    })
    .catch(error => {
        esconderLoading();
        mostrarMensagem("Erro na requisição", 'error');
        console.error(error);
    });
}

/* Função para limpar o histórico após confirmação */
function limparHistorico() {
    if (!confirm("Tem certeza que deseja apagar todo o histórico de solicitações?")) {
        return;
    }

    mostrarLoading();

    fetch("/solicitacoes/limpar/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        esconderLoading();

        if (data.success) {
            mostrarMensagem("Histórico limpo com sucesso!", 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            mostrarMensagem("Erro ao limpar histórico: " + data.error, 'error');
        }
    })
    .catch(error => {
        esconderLoading();
        mostrarMensagem("Erro na requisição", 'error');
        console.error(error);
    });
}
