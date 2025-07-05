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
    Modal de Carregamento
================================ */
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
modalLoading.textContent = 'Enviando solicitação...';
document.body.appendChild(modalLoading);

function mostrarLoading() {
    modalLoading.style.display = 'flex';
}

function esconderLoading() {
    modalLoading.style.display = 'none';
}

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

// Envio AJAX do formulário - atualizado para mostrar loading e mensagens próprias
if (formSolicitacao) {
    formSolicitacao.addEventListener('submit', function(e) {
        e.preventDefault();

        mostrarLoading();

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
        .then(response => response.json())
        .then(data => {
            esconderLoading();

            if (data.success) {
                fecharModal();
                mostrarMensagem('Solicitação enviada com sucesso!', 'success');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                mostrarMensagem('Erro: ' + (data.error || 'Falha ao enviar solicitação.'), 'error');
            }
        })
        .catch(err => {
            esconderLoading();
            console.error('Erro no fetch:', err);
            mostrarMensagem('Erro ao enviar solicitação. Tente novamente.', 'error');
        });
    });
}

/* ================================
    Mensagem personalizada no topo da tela
================================ */
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
document.body.appendChild(mensagemContainer);

function mostrarMensagem(texto, tipo) {
    mensagemContainer.textContent = texto;
    mensagemContainer.style.backgroundColor = tipo === 'success' ? '#4caf50' : '#f44336';
    mensagemContainer.style.color = '#fff';
    mensagemContainer.style.display = 'block';

    setTimeout(() => {
        mensagemContainer.style.display = 'none';
    }, 3000);
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
