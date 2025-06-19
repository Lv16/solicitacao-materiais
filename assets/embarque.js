/* ================================
    Menu de usuário (abrir/fechar)
================================ */
function toggleMenu() {
    const menu = document.getElementById('dropdown');
    menu.classList.toggle('active');
}

window.addEventListener('click', function (e) {
    const menu = document.getElementById('dropdown');
    const img = document.querySelector('.user-img');

    if (menu && img && !img.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('active');
    }
});

/* ================================
    Seletores principais
================================ */
const selectTipo = document.getElementById('tipo');
const inputPesquisa = document.querySelector('.pesquisar');
const btnPesquisa = document.querySelector('.btn-pesquisar');
const btnLimpar = document.querySelector('.btn-limpar');
const materiais = document.querySelectorAll('.lista_materiais > div');

const mensagemNenhum = document.createElement('p');
mensagemNenhum.textContent = "Nenhum material encontrado.";
mensagemNenhum.style.color = "red";
mensagemNenhum.style.fontWeight = "bold";
mensagemNenhum.style.display = "none";
document.querySelector('.lista_materiais').appendChild(mensagemNenhum);

/* ================================
    Modal de Solicitação
================================ */
const modal = document.getElementById('modal-solicitacao');
const modalEquipamento = document.getElementById('modal-equipamento');
const btnFecharModal = document.querySelector('.close-btn');
const btnConfirmar = document.querySelector('.btn-confirmar');
const btnCancelar = document.querySelector('.btn-cancelar');

function abrirModal(equipamentoNome) {
    modalEquipamento.textContent = equipamentoNome;
    modal.style.display = 'block';
}

function fecharModal() {
    modal.style.display = 'none';
}

if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);
if (btnCancelar) btnCancelar.addEventListener('click', fecharModal);

window.addEventListener('click', function (e) {
    if (e.target === modal) {
        fecharModal();
    }
});

/* ================================
    Botões de Solicitação
================================ */
const botoesSolicitar = document.querySelectorAll('.btn-solicitar');

botoesSolicitar.forEach(botao => {
    botao.addEventListener('click', function (e) {
        e.stopPropagation();
        // Pegando o nome do equipamento no elemento <h3> irmão dentro da mesma div pai
        const itemNome = this.closest('div').querySelector('h3').textContent;
        abrirModal(itemNome);
    });
});


/* ================================
    Filtro de busca e tipo
================================ */
function filtrarMateriais(termo) {
    let encontrou = false;

    materiais.forEach(item => {
        const titulo = item.querySelector('h3').textContent.toLowerCase();

        if (titulo.includes(termo)) {
            item.style.display = 'block';
            encontrou = true;
        } else {
            item.style.display = 'none';
        }
    });

    mensagemNenhum.style.display = encontrou ? 'none' : 'block';
}

if (btnPesquisa) {
    btnPesquisa.addEventListener('click', function (e) {
        e.preventDefault();
        const termo = inputPesquisa.value.toLowerCase();
        filtrarMateriais(termo);
    });
}

if (selectTipo) {
    selectTipo.addEventListener('change', function () {
        const textoSelecionado = this.options[this.selectedIndex].text;
        inputPesquisa.value = textoSelecionado;
        filtrarMateriais(textoSelecionado.toLowerCase());
    });
}

if (btnLimpar) {
    btnLimpar.addEventListener('click', function (e) {
        e.preventDefault();
        inputPesquisa.value = '';
        selectTipo.selectedIndex = 0;

        materiais.forEach(item => {
            item.style.display = 'block';
        });

        mensagemNenhum.style.display = 'none';
    });
}

/* ================================
    Logout
================================ */
const logoutBtn = document.querySelector('.logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        alert('Você saiu!');
        // window.location.href = 'login.html'; // Ativar se desejar redirecionar
    });
}
