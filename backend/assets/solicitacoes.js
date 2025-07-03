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
        const statusCard = card.dataset.status;  // melhor usar dataset
        // Pega o texto do <p> da embarcação, retirando o label "Embarcação:"
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
logoutBtn.addEventListener('click', () => {
    alert('Você saiu!');
    // window.location.href = 'login.html';
});
