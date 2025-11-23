// Inicializa ícones Lucide
lucide.createIcons();

// Variável para guardar qual lista será removida
let listaParaRemover = null;

/**
 * Abre um modal pelo ID
 */
function abrirModalPerfil(nomeModal) {
    document.getElementById(nomeModal).style.display = 'flex';
    setTimeout(() => {
        const modal = document.getElementById(nomeModal);
        if (modal.querySelectorAll('[data-lucide]').length > 0) {
            lucide.createIcons();
        }
    }, 10);
}

/**
 * Fecha um modal pelo ID
 */
function fecharModalPerfil(nomeModal) {
    const modal = document.getElementById(nomeModal);
    modal.style.display = 'none';

    // Remove mensagem de erro ao fechar o modal
    const erroMsg = modal.querySelector('.mensagem-erro');
    if (erroMsg) {
        erroMsg.textContent = '';
    }

    // Limpa o campo de senha, se existir
    const inputSenha = modal.querySelector('input[type="password"]');
    if (inputSenha) {
        inputSenha.value = '';
    }
}

/**
 * Abre o modal de configurações
 */
function abrirModalConfig() {
    document.getElementById('modalConfig').style.display = 'flex';
    setTimeout(() => {
        lucide.createIcons();
    }, 10);
}

/**
 * Fecha o modal de configurações
 */
function fecharModalConfig() {
    document.getElementById('modalConfig').style.display = 'none';
}

/**
 * Mostra o menu de contexto (clique direito)
 */
function mostrarMenuContexto(event, menuId, elemento) {
    event.preventDefault();

    // Guarda o botão da lista clicada
    listaParaRemover = elemento;

    // Esconde todos os menus de contexto
    document.querySelectorAll('.context-menu').forEach(menu => menu.style.display = 'none');

    // Mostra o menu específico na posição do mouse
    const menu = document.getElementById(menuId);
    menu.style.display = 'block';
    menu.style.left = (event.pageX + 5) + 'px';
    menu.style.top = (event.pageY + 5) + 'px';
}

/**
 * Fecha menus de contexto ao clicar fora
 */
window.addEventListener('click', (e) => {
    if (!e.target.closest('.context-menu-item')) {
        document.querySelectorAll('.context-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

/**
 * Fecha menus de contexto ao rolar a página
 */
window.addEventListener('scroll', () => {
    document.querySelectorAll('.context-menu').forEach(menu => {
        menu.style.display = 'none';
    });
}, true);

/**
 * Fecha modais com ESC
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharModalConfig();
        fecharModalPerfil('modalPerfil');
        fecharModalPerfil('modalVerificacao');
        fecharModalPerfil('modalAddLista');
        fecharModalPerfil('modalEditLista');
        fecharModalPerfil('modalRemoveLista');
    }
});

/**
 * Navega para qualquer página e marca como ativo
 */
function navegarPara(elementoClicado, url) {
    const currentPath = window.location.pathname;

    // Se já estiver na página, apenas atualiza o visual
    if (currentPath === url) {
        // Remove classe 'active' de todos os itens
        document.querySelectorAll('.menu-item, .lista').forEach(btn => {
            btn.classList.remove('active');
        });

        // Marca o item clicado como ativo
        elementoClicado.classList.add('active');

        // Se estiver no menu principal, atualiza o título
        if (url === '/menuPrincipal') {
            atualizarTituloMenuPrincipal(elementoClicado);
        }
        return;
    }

    // Remove classe 'active' de todos os itens
    document.querySelectorAll('.menu-item, .lista').forEach(btn => {
        btn.classList.remove('active');
    });

    // Marca o item clicado como ativo
    elementoClicado.classList.add('active');

    // Redireciona
    window.location.href = url;
}

/**
 * Atualiza o título da página principal quando já está nela
 */
function atualizarTituloMenuPrincipal(elementoClicado) {
    const novoTitulo = elementoClicado.innerText.trim();
    const tituloH2 = document.getElementById('titulo-principal');
    const subtituloSpan = document.getElementById('subtitulo-principal');

    // Atualiza o título
    if (tituloH2) {
        tituloH2.innerText = novoTitulo;
    }

    // Atualiza o subtítulo (só mostra data para "Para Hoje")
    if (subtituloSpan) {
        if (novoTitulo === "Para Hoje") {
            subtituloSpan.innerText = "- 21/11/24";
        } else {
            subtituloSpan.innerText = "";
        }
    }
}

/**
 * Muda o título da página principal (para listas)
 */
function mudarTituloPrincipal(elementoClicado) {
    if (window.location.pathname !== "/menuPrincipal") {
        window.location.href = "/menuPrincipal";
        return;
    }

    const novoTitulo = elementoClicado.innerText.trim();
    const tituloH2 = document.getElementById('titulo-principal');
    const subtituloSpan = document.getElementById('subtitulo-principal');

    // Atualiza o título
    if (tituloH2) {
        tituloH2.innerText = novoTitulo;
    }

    // Atualiza o subtítulo (só mostra data para "Para Hoje")
    if (subtituloSpan) {
        if (novoTitulo === "Para Hoje") {
            subtituloSpan.innerText = "- 21/11/24";
        } else {
            subtituloSpan.innerText = "";
        }
    }

    // Remove classe 'active' de todos os itens e adiciona no clicado
    document.querySelectorAll('.menu-item, .lista').forEach(btn => {
        btn.classList.remove('active');
    });
    elementoClicado.classList.add('active');
}

/**
 * Marca o item correto da sidebar como ativo ao carregar a página
 */
function marcarItemAtivoSidebar() {
    const path = window.location.pathname;

    // Remove active de todos os itens
    document.querySelectorAll('.menu-item, .lista').forEach(btn => {
        btn.classList.remove('active');
    });

    // Marca o item correto baseado na URL
    if (path === '/menuPrincipal' || path === '/') {
        const btnParaHoje = document.querySelector('.menu-item');
        if (btnParaHoje) btnParaHoje.classList.add('active');
    } else if (path === '/agendadas') {
        const btnAgendadas = document.querySelectorAll('.menu-item')[1];
        if (btnAgendadas) btnAgendadas.classList.add('active');
    } else if (path === '/todasTarefas') {
        const btnTodasTarefas = document.querySelectorAll('.menu-item')[2];
        if (btnTodasTarefas) btnTodasTarefas.classList.add('active');
    } else if (path.startsWith('/areasTrabalho')) {
        const btnAreasTrabalho = document.querySelectorAll('.menu-item')[3];
        if (btnAreasTrabalho) btnAreasTrabalho.classList.add('active');
    }
}

// Executa ao carregar a página
marcarItemAtivoSidebar();

/**
 * Executa a remoção da lista
 */
function executarRemocaoLista() {
    // Remove o item da lista (se ele estiver guardado)
    if (listaParaRemover) {
        listaParaRemover.remove();
        listaParaRemover = null;
    }

    // Fecha o modal de confirmação
    fecharModalPerfil('modalRemoveLista');

    // Simula um clique em "Para Hoje" para resetar a tela
    const btnParaHoje = document.querySelector('.menu-item');
    if (btnParaHoje) {
        btnParaHoje.click();
    }
}

/**
 * Abre o modal de confirmação e define qual ação o backend vai executar
 * @param {string} tipo - 'editar' ou 'remover'
 */
function abrirModalAcao(tipo) {
    const modal = document.getElementById('modalVerificacao');
    const mensagem = document.getElementById('mensagemVerificacao');
    const form = document.getElementById('formConfirmacao');

    if (tipo === 'editar') {
        mensagem.textContent = 'Deseja realmente editar sua conta?';
        form.action = '/editarConta';
    } else if (tipo === 'remover') {
        mensagem.textContent = 'Deseja realmente remover sua conta?';
        form.action = '/removerConta';
    }

    // Limpa o campo de senha e mostra o modal
    document.getElementById('senhaConfirmacao').value = '';
    modal.style.display = 'flex';
}