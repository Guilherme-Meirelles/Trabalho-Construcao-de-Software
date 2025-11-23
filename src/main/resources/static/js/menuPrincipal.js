// Mapeamento dos nomes das listas
const nomesListas = {
    'faculdade': 'Faculdade',
    'casa': 'Casa',
    'remomeada': 'Remomeada'
};

// Array para armazenar as tarefas
let tarefas = [];
let tarefaSelecionada = null;
let listaAtual = 'para-hoje';

// Script para abrir/fechar modal de Adicionar Tarefa
document.addEventListener('DOMContentLoaded', function() {
    const btnAddTarefa = document.getElementById('btnAddTarefa');
    const modalAddTarefa = document.getElementById('modalAddTarefa');
    const btnCancelarTarefa = document.getElementById('btnCancelarTarefa');
    const btnOkTarefa = document.getElementById('btnOkTarefa');
    const containerTarefas = document.getElementById('containerTarefas');
    const menuContextoTarefa = document.getElementById('menuContextoTarefa');
    const btnEditarTarefa = document.getElementById('btnEditarTarefa');
    const tituloModalTarefa = document.querySelector('.titulo-modal-tarefa');
    const modalConfirmarRemocao = document.getElementById('modalConfirmarRemocao');
    const btnCancelarRemocao = document.getElementById('btnCancelarRemocao');
    const btnConfirmarRemocao = document.getElementById('btnConfirmarRemocao');
    let tarefaParaRemover = null;

    const btnFiltro = document.getElementById('btnFiltro');
    const btnOrdenar = document.getElementById('btnOrdenar');
    const menuFiltro = document.getElementById('menuFiltro');
    const menuOrdenar = document.getElementById('menuOrdenar');
    let filtroAtivo = 'todas';
    let ordenacaoAtiva = null;

    // Abrir/fechar menus de filtro e ordenação
    btnFiltro.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = menuFiltro.style.display === 'block';
        menuFiltro.style.display = isVisible ? 'none' : 'block';
        menuOrdenar.style.display = 'none';

        if (!isVisible) {
            const rect = btnFiltro.getBoundingClientRect();
            menuFiltro.style.left = (rect.right - 220) + 'px';
            menuFiltro.style.top = (rect.bottom + 5) + 'px';
        }
    });

    btnOrdenar.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = menuOrdenar.style.display === 'block';
        menuOrdenar.style.display = isVisible ? 'none' : 'block';
        menuFiltro.style.display = 'none';

        if (!isVisible) {
            const rect = btnOrdenar.getBoundingClientRect();
            menuOrdenar.style.left = (rect.right - 220) + 'px';
            menuOrdenar.style.top = (rect.bottom + 5) + 'px';
        }
    });

    // Fechar menus ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.menu-filtro') && !e.target.closest('.btn-filtro') && !e.target.closest('.btn-ordenar')) {
            menuFiltro.style.display = 'none';
            menuOrdenar.style.display = 'none';
        }
        menuContextoTarefa.style.display = 'none';
    });

    // Aplicar filtros
    document.querySelectorAll('#menuFiltro .menu-filtro-item').forEach(item => {
        item.addEventListener('click', function() {
            filtroAtivo = this.dataset.filtro;
            document.querySelectorAll('#menuFiltro .menu-filtro-item').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            renderizarTarefas(listaAtual);
            menuFiltro.style.display = 'none';
            lucide.createIcons();
        });
    });

    // Aplicar ordenação
    document.querySelectorAll('#menuOrdenar .menu-filtro-item').forEach(item => {
        item.addEventListener('click', function() {
            ordenacaoAtiva = this.dataset.ordem;
            document.querySelectorAll('#menuOrdenar .menu-filtro-item').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            renderizarTarefas(listaAtual);
            menuOrdenar.style.display = 'none';
            lucide.createIcons();
        });
    });

    // Evitar que o menu feche ao clicar nele
    menuContextoTarefa.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Modal de confirmação de remoção
    btnCancelarRemocao.addEventListener('click', function() {
        modalConfirmarRemocao.style.display = 'none';
        tarefaParaRemover = null;
    });

    btnConfirmarRemocao.addEventListener('click', function() {
        if (tarefaParaRemover) {
            tarefas = tarefas.filter(t => t.id !== tarefaParaRemover.id);
            renderizarTarefas(tarefaParaRemover.lista);
            modalConfirmarRemocao.style.display = 'none';
            tarefaParaRemover = null;
        }
    });

    // Fechar modal de confirmação ao clicar no overlay
    modalConfirmarRemocao.addEventListener('click', function(e) {
        if (e.target === modalConfirmarRemocao) {
            modalConfirmarRemocao.style.display = 'none';
            tarefaParaRemover = null;
        }
    });

    // Abrir modal
    btnAddTarefa.addEventListener('click', function() {
        modalAddTarefa.style.display = 'flex';
    });

    // Fechar modal ao clicar no overlay
    modalAddTarefa.addEventListener('click', function(e) {
        if (e.target === modalAddTarefa) {
            modalAddTarefa.style.display = 'none';
            limparFormulario();
        }
    });

    // Fechar modal ao clicar em Cancelar
    btnCancelarTarefa.addEventListener('click', function() {
        modalAddTarefa.style.display = 'none';
        limparFormulario();
    });

    // Ação do botão OK - Adicionar ou Editar tarefa
    btnOkTarefa.addEventListener('click', function() {
        const lista = document.getElementById('tarefaLista').value;
        const titulo = document.getElementById('tarefaTitulo').value.trim();
        const descricao = document.getElementById('tarefaDescricao').value.trim();
        const dataFim = document.getElementById('tarefaDataFim').value;
        const responsavel = document.getElementById('tarefaResponsavel').value;
        const notificacoes = document.getElementById('tarefaNotificacoes').checked;

        if (!lista || !titulo) {
            alert('Por favor, preencha os campos obrigatórios (Lista e Título)');
            return;
        }

        if (tarefaSelecionada) {
            tarefaSelecionada.lista = lista;
            tarefaSelecionada.titulo = titulo;
            tarefaSelecionada.descricao = descricao;
            tarefaSelecionada.dataFim = dataFim;
            tarefaSelecionada.responsavel = responsavel;
            tarefaSelecionada.notificacoes = notificacoes;
            console.log('Tarefa editada!', tarefaSelecionada);
        } else {
            const tarefa = {
                id: Date.now(),
                lista: lista,
                titulo: titulo,
                descricao: descricao,
                dataFim: dataFim,
                responsavel: responsavel,
                notificacoes: notificacoes,
                concluida: false,
                checklistId: checklistSelecionadoTarefa
            };
            tarefas.push(tarefa);
            console.log('Tarefa adicionada!', tarefa);
        }

        listaAtual = lista;
        atualizarTituloPagina(lista);
        renderizarTarefas(lista);
        modalAddTarefa.style.display = 'none';
        limparFormulario();
        tarefaSelecionada = null;
        checklistSelecionadoTarefa = null;
        tituloModalTarefa.textContent = 'Adicionar Tarefa';
    });

    function limparFormulario() {
        document.getElementById('tarefaLista').value = '';
        document.getElementById('tarefaTitulo').value = '';
        document.getElementById('tarefaDescricao').value = '';
        document.getElementById('tarefaDataFim').value = '';
        document.getElementById('tarefaResponsavel').value = '';
        document.getElementById('tarefaNotificacoes').checked = false;
        checklistSelecionadoTarefa = null;
    }

    function preencherFormulario(tarefa) {
        document.getElementById('tarefaLista').value = tarefa.lista;
        document.getElementById('tarefaTitulo').value = tarefa.titulo;
        document.getElementById('tarefaDescricao').value = tarefa.descricao;
        document.getElementById('tarefaDataFim').value = tarefa.dataFim;
        document.getElementById('tarefaResponsavel').value = tarefa.responsavel;
        document.getElementById('tarefaNotificacoes').checked = tarefa.notificacoes;
        checklistSelecionadoTarefa = tarefa.checklistId || null;
    }

    btnEditarTarefa.addEventListener('click', function() {
        if (tarefaSelecionada) {
            tituloModalTarefa.textContent = 'Editar Tarefa';
            preencherFormulario(tarefaSelecionada);
            modalAddTarefa.style.display = 'flex';
            menuContextoTarefa.style.display = 'none';
        }
    });

    function atualizarTituloPagina(listaId) {
        const tituloPrincipal = document.getElementById('titulo-principal');
        tituloPrincipal.textContent = nomesListas[listaId] || 'Para Hoje';
    }

    function renderizarTarefas(listaFiltro) {
        containerTarefas.innerHTML = '';
        let tarefasFiltradas = tarefas.filter(t => t.lista === listaFiltro);

        if (filtroAtivo === 'andamento') {
            tarefasFiltradas = tarefasFiltradas.filter(t => !t.concluida);
        } else if (filtroAtivo === 'concluidas') {
            tarefasFiltradas = tarefasFiltradas.filter(t => t.concluida);
        } else if (filtroAtivo === 'atrasadas') {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            tarefasFiltradas = tarefasFiltradas.filter(t => {
                if (!t.dataFim) return false;
                const dataFim = new Date(t.dataFim + 'T00:00:00');
                return dataFim < hoje && !t.concluida;
            });
        }

        if (ordenacaoAtiva === 'data-inicio') {
            tarefasFiltradas.sort((a, b) => a.id - b.id);
        } else if (ordenacaoAtiva === 'data-fim') {
            tarefasFiltradas.sort((a, b) => {
                if (!a.dataFim) return 1;
                if (!b.dataFim) return -1;
                return new Date(a.dataFim) - new Date(b.dataFim);
            });
        } else if (ordenacaoAtiva === 'data-adicao') {
            tarefasFiltradas.sort((a, b) => b.id - a.id);
        } else if (ordenacaoAtiva === 'notificacao') {
            tarefasFiltradas.sort((a, b) => b.notificacoes - a.notificacoes);
        } else if (ordenacaoAtiva === 'status') {
            tarefasFiltradas.sort((a, b) => a.concluida - b.concluida);
        }

        if (tarefasFiltradas.length === 0) return;

        tarefasFiltradas.forEach(tarefa => {
            const tarefaEl = document.createElement('div');
            tarefaEl.className = 'tarefa-item';
            tarefaEl.dataset.id = tarefa.id;

            // Barra de cor do checklist
            let corBarra = '';
            if (tarefa.checklistId) {
                const checklist = checklists.find(c => c.id === tarefa.checklistId);
                if (checklist) {
                    corBarra = `<div class="tarefa-checklist-barra" style="background-color: ${checklist.cor};"></div>`;
                }
            }

            tarefaEl.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                tarefaSelecionada = tarefa;
                menuContextoTarefa.style.left = e.pageX + 'px';
                menuContextoTarefa.style.top = e.pageY + 'px';
                menuContextoTarefa.style.display = 'block';
            });

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'tarefa-checkbox';
            checkbox.checked = tarefa.concluida;
            checkbox.addEventListener('change', function() {
                toggleTarefaConcluida(tarefa.id);
            });

            const conteudo = document.createElement('div');
            conteudo.className = 'tarefa-conteudo';

            const titulo = document.createElement('div');
            titulo.className = 'tarefa-titulo';
            titulo.textContent = tarefa.titulo;
            if (tarefa.concluida) titulo.classList.add('concluida');
            conteudo.appendChild(titulo);

            if (tarefa.descricao) {
                const descricao = document.createElement('div');
                descricao.className = 'tarefa-descricao';
                descricao.textContent = tarefa.descricao;
                conteudo.appendChild(descricao);
            }

            if (tarefa.dataFim || tarefa.responsavel || tarefa.checklistId) {
                const info = document.createElement('div');
                info.className = 'tarefa-info';

                if (tarefa.checklistId) {
                    const checklist = checklists.find(c => c.id === tarefa.checklistId);
                    if (checklist) {
                        const badge = document.createElement('span');
                        badge.className = 'tarefa-checklist-badge';
                        badge.style.borderLeftColor = checklist.cor;
                        badge.innerHTML = `<i data-lucide="list"></i> ${checklist.nome}`;
                        info.appendChild(badge);
                    }
                }

                if (tarefa.dataFim) {
                    const data = document.createElement('span');
                    data.className = 'tarefa-data';
                    data.innerHTML = `<i data-lucide="calendar"></i> ${formatarData(tarefa.dataFim)}`;
                    info.appendChild(data);
                }

                if (tarefa.responsavel) {
                    const resp = document.createElement('span');
                    resp.className = 'tarefa-responsavel';
                    resp.innerHTML = `<i data-lucide="user"></i> ${tarefa.responsavel}`;
                    info.appendChild(resp);
                }

                conteudo.appendChild(info);
            }

            const btnExcluir = document.createElement('button');
            btnExcluir.className = 'tarefa-btn-excluir';
            btnExcluir.innerHTML = '<i data-lucide="trash-2"></i>';
            btnExcluir.addEventListener('click', function() {
                excluirTarefa(tarefa.id, listaFiltro);
            });

            if (corBarra) {
                tarefaEl.innerHTML = corBarra;
            }
            tarefaEl.appendChild(checkbox);
            tarefaEl.appendChild(conteudo);
            tarefaEl.appendChild(btnExcluir);
            containerTarefas.appendChild(tarefaEl);
        });

        lucide.createIcons();
    }

    function toggleTarefaConcluida(tarefaId) {
        const tarefa = tarefas.find(t => t.id === tarefaId);
        if (tarefa) {
            tarefa.concluida = !tarefa.concluida;
            renderizarTarefas(tarefa.lista);
        }
    }

    function excluirTarefa(tarefaId, listaAtual) {
        const tarefa = tarefas.find(t => t.id === tarefaId);
        if (tarefa) {
            tarefaParaRemover = tarefa;
            modalConfirmarRemocao.style.display = 'flex';
        }
    }

    function formatarData(dataString) {
        const data = new Date(dataString + 'T00:00:00');
        return data.toLocaleDateString('pt-BR');
    }

    // ===== SISTEMA DE CHECKLISTS =====
    let checklists = [];
    let checklistSelecionado = null;
    let checklistSelecionadoTarefa = null;
    let corSelecionada = '#4caf50';

    // Elementos do DOM
    const btnChecklist = document.getElementById('btnChecklist');
    const modalGerenciarChecklist = document.getElementById('modalGerenciarChecklist');
    const modalAddChecklist = document.getElementById('modalAddChecklist');
    const modalRemoverChecklist = document.getElementById('modalRemoverChecklist');
    const listaChecklistsEl = document.getElementById('listaChecklists');
    const btnFecharGerenciar = document.getElementById('btnFecharGerenciar');
    const btnNovoChecklist = document.getElementById('btnNovoChecklist');
    const btnCancelarChecklist = document.getElementById('btnCancelarChecklist');
    const btnSalvarChecklist = document.getElementById('btnSalvarChecklist');
    const btnAbrirPaleta = document.getElementById('btnAbrirPaleta');
    const paletaCores = document.getElementById('paletaCores');
    const corPreview = document.getElementById('corPreview');
    const checklistNomeInput = document.getElementById('checklistNome');
    const tituloModalChecklist = document.getElementById('tituloModalChecklist');
    const btnCancelarRemoverChecklist = document.getElementById('btnCancelarRemoverChecklist');
    const btnConfirmarRemoverChecklist = document.getElementById('btnConfirmarRemoverChecklist');
    let checklistParaRemover = null;

    // Abrir modal de gerenciar checklists
    btnChecklist.addEventListener('click', function() {
        modalGerenciarChecklist.style.display = 'flex';
        renderizarChecklists();
        setTimeout(() => lucide.createIcons(), 10);
    });

    // Fechar modal de gerenciar
    btnFecharGerenciar.addEventListener('click', function() {
        modalGerenciarChecklist.style.display = 'none';
    });

    // Abrir modal de novo checklist
    btnNovoChecklist.addEventListener('click', function() {
        checklistSelecionado = null;
        corSelecionada = '#4caf50';
        tituloModalChecklist.textContent = 'Novo Checklist';
        checklistNomeInput.value = '';
        corPreview.style.backgroundColor = corSelecionada;
        modalAddChecklist.style.display = 'flex';
    });

    // Cancelar adicionar/editar checklist
    btnCancelarChecklist.addEventListener('click', function() {
        modalAddChecklist.style.display = 'none';
        checklistNomeInput.value = '';
    });

    // Salvar checklist
    btnSalvarChecklist.addEventListener('click', function() {
        const nome = checklistNomeInput.value.trim();

        if (!nome) {
            alert('Por favor, digite um nome para o checklist');
            return;
        }

        if (checklistSelecionado) {
            // Editando
            checklistSelecionado.nome = nome;
            checklistSelecionado.cor = corSelecionada;
        } else {
            // Criando novo
            const novoChecklist = {
                id: Date.now(),
                nome: nome,
                cor: corSelecionada
            };
            checklists.push(novoChecklist);
        }

        modalAddChecklist.style.display = 'none';
        renderizarChecklists();
        checklistNomeInput.value = '';
    });

    // Abrir/Fechar paleta de cores
    btnAbrirPaleta.addEventListener('click', function(e) {
        e.stopPropagation();
        paletaCores.style.display = paletaCores.style.display === 'none' ? 'grid' : 'none';
    });

    // Selecionar cor
    document.querySelectorAll('.cor-opcao').forEach(btn => {
        btn.addEventListener('click', function() {
            corSelecionada = this.dataset.cor;
            corPreview.style.backgroundColor = corSelecionada;

            // Remove classe selecionada de todos
            document.querySelectorAll('.cor-opcao').forEach(b => b.classList.remove('selecionada'));
            this.classList.add('selecionada');

            paletaCores.style.display = 'none';
        });
    });

    // Fechar paleta ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.seletor-cor')) {
            paletaCores.style.display = 'none';
        }
    });

    // Fechar modais ao clicar no overlay
    modalGerenciarChecklist.addEventListener('click', function(e) {
        if (e.target === modalGerenciarChecklist) {
            modalGerenciarChecklist.style.display = 'none';
        }
    });

    modalAddChecklist.addEventListener('click', function(e) {
        if (e.target === modalAddChecklist) {
            modalAddChecklist.style.display = 'none';
            checklistNomeInput.value = '';
        }
    });

    modalRemoverChecklist.addEventListener('click', function(e) {
        if (e.target === modalRemoverChecklist) {
            modalRemoverChecklist.style.display = 'none';
            checklistParaRemover = null;
        }
    });

    // Cancelar remoção
    btnCancelarRemoverChecklist.addEventListener('click', function() {
        modalRemoverChecklist.style.display = 'none';
        checklistParaRemover = null;
    });

    // Confirmar remoção
    btnConfirmarRemoverChecklist.addEventListener('click', function() {
        if (checklistParaRemover) {
            checklists = checklists.filter(c => c.id !== checklistParaRemover.id);
            modalRemoverChecklist.style.display = 'none';
            renderizarChecklists();
            checklistParaRemover = null;
        }
    });

    // Renderizar lista de checklists
    function renderizarChecklists() {
        listaChecklistsEl.innerHTML = '';

        if (checklists.length === 0) {
            listaChecklistsEl.innerHTML = `
                <div class="lista-checklists-vazia">
                    <i data-lucide="list"></i>
                    <p>Nenhum checklist criado</p>
                    <span>Clique em "Novo Checklist" para começar</span>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 10);
            return;
        }

        checklists.forEach(checklist => {
            const item = document.createElement('div');
            item.className = 'checklist-item';
            item.innerHTML = `
                <div class="checklist-cor" style="background-color: ${checklist.cor};"></div>
                <div class="checklist-info">
                    <div class="checklist-nome">${checklist.nome}</div>
                </div>
                <div class="checklist-acoes">
                    <button class="btn-editar-checklist" data-id="${checklist.id}">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="btn-excluir-checklist" data-id="${checklist.id}">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `;

            // Editar checklist
            item.querySelector('.btn-editar-checklist').addEventListener('click', function() {
                checklistSelecionado = checklist;
                tituloModalChecklist.textContent = 'Editar Checklist';
                checklistNomeInput.value = checklist.nome;
                corSelecionada = checklist.cor;
                corPreview.style.backgroundColor = corSelecionada;
                modalAddChecklist.style.display = 'flex';
            });

            // Remover checklist
            item.querySelector('.btn-excluir-checklist').addEventListener('click', function() {
                checklistParaRemover = checklist;
                modalRemoverChecklist.style.display = 'flex';
            });

            // Selecionar checklist para tarefa (clique no item)
            item.addEventListener('click', function(e) {
                if (!e.target.closest('.btn-editar-checklist') && !e.target.closest('.btn-excluir-checklist')) {
                    checklistSelecionadoTarefa = checklist.id;
                    modalGerenciarChecklist.style.display = 'none';

                    // Atualiza visual do botão de checklist
                    btnChecklist.style.borderColor = checklist.cor;
                    btnChecklist.style.backgroundColor = checklist.cor + '33';
                }
            });

            listaChecklistsEl.appendChild(item);
        });

        setTimeout(() => lucide.createIcons(), 10);
    }

    lucide.createIcons();
});