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

/* Logout */
const logoutBtn = document.querySelector('.logout-btn');
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        alert('Você saiu!');
        // window.location.href = 'login.html';
    });
}

/* Função para pegar o token CSRF do cookie */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i=0; i < cookies.length; i++) {
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
    fetch("/solicitacoes/atualizar-status/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCookie('csrftoken') 
        },
        body: `id=${id}&status=${novoStatus}`
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Erro HTTP ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Status atualizado para: " + data.status);
            location.reload();
        } else {
            alert("Erro ao atualizar: " + data.error);
        }
    })
    .catch(error => {
        alert("Erro na requisição: " + error.message);
        console.error(error);
    });
}
