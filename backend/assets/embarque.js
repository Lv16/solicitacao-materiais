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
const btnCancelar = document.querySelector('.btn-cancelar');
const formSolicitacao = document.getElementById('form-solicitacao');
const inputMaterialId = document.getElementById('input-material-id');

// Abrir modal e preencher dados
document.querySelectorAll('.btn-solicitar').forEach(btn => {
    btn.addEventListener('click', function () {
        modal.style.display = 'block';
        modalEquipamento.textContent = this.dataset.nome;
        inputMaterialId.value = this.dataset.id;
    });
});

function fecharModal() {
    modal.style.display = 'none';
    formSolicitacao.reset();
}

if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);
if (btnCancelar) btnCancelar.addEventListener('click', fecharModal);

window.addEventListener('click', function (e) {
    if (e.target === modal) {
        fecharModal();
    }
});

// Envio AJAX do formulário - atualizei para incluir os campos data, supervisor e embarcacao
if (formSolicitacao) {
    formSolicitacao.addEventListener('submit', function(e) {
        e.preventDefault();

        const material_id = inputMaterialId.value;
        const quantidade = document.getElementById('input-quantidade').value;
        const observacao = document.getElementById('input-observacao').value;
        const data = document.getElementById('input-data').value;
        const supervisor = document.getElementById('input-supervisor').value;
        const embarcacao = document.getElementById('input-embarcacao').value;
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // Monta o corpo da requisição com encodeURIComponent para evitar erros com caracteres especiais
        const body = 
            `material_id=${encodeURIComponent(material_id)}&` +
            `quantidade=${encodeURIComponent(quantidade)}&` +
            `observacao=${encodeURIComponent(observacao)}&` +
            `data=${encodeURIComponent(data)}&` +
            `supervisor=${encodeURIComponent(supervisor)}&` +
            `embarcacao=${encodeURIComponent(embarcacao)}`;

        fetch('/solicitacoes/nova/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: body
        })
        .then(response => {
            if (response.ok) {
                fecharModal();
                alert('Solicitação enviada com sucesso!');
                window.location.reload();
            } else {
                alert('Erro ao enviar solicitação.');
            }
        })
        .catch(err => {
            console.error('Erro no fetch:', err);
            alert('Erro ao enviar solicitação.');
        });
    });
}

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
