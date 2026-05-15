/**
 * ════════════════════════════════════════════════════════════
 *  StudyFlow – script.js
 *  Organizador de Estudos
 *
 *  Arquitetura:
 *    • Estado puro (array `tarefas`) separado do DOM
 *    • Funções de lógica sem dependência do DOM (testáveis)
 *    • Funções de renderização que consomem o estado
 * ════════════════════════════════════════════════════════════
 */

/* ── ESTADO DA APLICAÇÃO ─────────────────────────────────── */

/**
 * Array principal de tarefas (armazenamento em memória).
 * @type {Array<{id: string, nome: string, materia: string, concluida: boolean}>}
 */
let tarefas = [];

/** Filtro ativo: 'all' | 'pending' | 'done' */
let filtroAtivo = 'all';

/** Contador para IDs únicos incrementais */
let proximoId = 1;


/* ── FUNÇÕES DE LÓGICA (sem dependência do DOM) ──────────── */

/**
 * Cria um objeto de tarefa.
 * @param {string} nome     - Nome da tarefa (obrigatório)
 * @param {string} materia  - Matéria (opcional)
 * @returns {{id:string, nome:string, materia:string, concluida:boolean}}
 */
function criarTarefa(nome, materia) {
  return {
    id:        'sf-' + (proximoId++),
    nome:      nome.trim(),
    materia:   materia.trim(),
    concluida: false,
  };
}

/**
 * Adiciona uma tarefa ao array de estado.
 * @param {string} nome
 * @param {string} materia
 * @returns {{ok: boolean, tarefa?: object, erro?: string}}
 */
function adicionarTarefa(nome, materia) {
  const nomeLimpo = (nome || '').trim();

  if (!nomeLimpo) {
    return { ok: false, erro: 'Por favor, informe o nome da tarefa.' };
  }

  const tarefa = criarTarefa(nomeLimpo, materia || '');
  tarefas.push(tarefa);
  return { ok: true, tarefa };
}

/**
 * Remove uma tarefa pelo ID.
 * @param {string} id
 * @returns {boolean} - true se removida, false se não encontrada
 */
function removerTarefa(id) {
  const index = tarefas.findIndex(t => t.id === id);
  if (index === -1) return false;
  tarefas.splice(index, 1);
  return true;
}

/**
 * Alterna o status de conclusão de uma tarefa.
 * @param {string} id
 * @returns {object|null} - tarefa atualizada ou null
 */
function alternarConcluida(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return null;
  tarefa.concluida = !tarefa.concluida;
  return tarefa;
}

/**
 * Retorna as tarefas filtradas conforme o filtro ativo.
 * @param {'all'|'pending'|'done'} filtro
 * @returns {Array}
 */
function filtrarTarefas(filtro) {
  switch (filtro) {
    case 'done':    return tarefas.filter(t => t.concluida);
    case 'pending': return tarefas.filter(t => !t.concluida);
    default:        return [...tarefas];
  }
}

/**
 * Calcula as estatísticas do estado atual.
 * @returns {{total: number, concluidas: number, pendentes: number}}
 */
function calcularEstatisticas() {
  const total     = tarefas.length;
  const concluidas = tarefas.filter(t => t.concluida).length;
  return { total, concluidas, pendentes: total - concluidas };
}


/* ── FUNÇÕES DE RENDERIZAÇÃO (DOM) ───────────────────────── */

/** Referências aos elementos do DOM */
const el = {
  taskName:     () => document.getElementById('taskName'),
  taskSubject:  () => document.getElementById('taskSubject'),
  btnAdd:       () => document.getElementById('btnAdd'),
  taskList:     () => document.getElementById('taskList'),
  emptyState:   () => document.getElementById('emptyState'),
  feedback:     () => document.getElementById('feedback'),
  totalCount:   () => document.getElementById('totalCount'),
  doneCount:    () => document.getElementById('doneCount'),
  pendingCount: () => document.getElementById('pendingCount'),
};

/**
 * Atualiza os contadores na barra de estatísticas,
 * aplicando animação de "pulo" quando o valor muda.
 */
function atualizarContadores() {
  const stats = calcularEstatisticas();
  const pares = [
    [el.totalCount(),   stats.total],
    [el.doneCount(),    stats.concluidas],
    [el.pendingCount(), stats.pendentes],
  ];

  pares.forEach(([elemento, valor]) => {
    if (!elemento) return;
    const anterior = parseInt(elemento.textContent, 10);
    if (anterior !== valor) {
      elemento.textContent = valor;
      elemento.classList.remove('bump');
      // força reflow para reiniciar animação
      void elemento.offsetWidth;
      elemento.classList.add('bump');
    }
  });
}

/**
 * Exibe uma mensagem de feedback no formulário.
 * @param {string} mensagem
 * @param {'error'|'success'} tipo
 */
function exibirFeedback(mensagem, tipo) {
  const fb = el.feedback();
  if (!fb) return;
  fb.textContent = mensagem;
  fb.className = `feedback feedback--${tipo}`;

  // Limpa automaticamente após 3 s
  clearTimeout(fb._timer);
  fb._timer = setTimeout(() => { fb.textContent = ''; fb.className = 'feedback'; }, 3000);
}

/**
 * Cria o elemento <li> de uma tarefa.
 * @param {{id, nome, materia, concluida}} tarefa
 * @returns {HTMLLIElement}
 */
function criarElementoTarefa(tarefa) {
  const li = document.createElement('li');
  li.className = `task-item${tarefa.concluida ? ' done' : ''}`;
  li.dataset.id = tarefa.id;

  // --- Checkbox visual ---
  const check = document.createElement('button');
  check.className = `task-check${tarefa.concluida ? ' checked' : ''}`;
  check.setAttribute('aria-label', tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída');
  check.setAttribute('aria-pressed', String(tarefa.concluida));
  check.addEventListener('click', () => handleAlternarConcluida(tarefa.id));

  // --- Info ---
  const info = document.createElement('div');
  info.className = 'task-info';

  const nome = document.createElement('span');
  nome.className = 'task-name';
  nome.textContent = tarefa.nome;
  nome.title = tarefa.nome;

  info.appendChild(nome);

  if (tarefa.materia) {
    const badge = document.createElement('span');
    badge.className = 'task-subject';
    badge.textContent = tarefa.materia;
    badge.title = tarefa.materia;
    info.appendChild(badge);
  }

  // --- Ações ---
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const btnConcluir = document.createElement('button');
  btnConcluir.className = 'btn-action btn-done';
  btnConcluir.title = tarefa.concluida ? 'Retomar tarefa' : 'Concluir tarefa';
  btnConcluir.setAttribute('aria-label', tarefa.concluida ? 'Retomar tarefa' : 'Concluir tarefa');
  btnConcluir.textContent = tarefa.concluida ? '↩' : '✓';
  btnConcluir.addEventListener('click', () => handleAlternarConcluida(tarefa.id));

  const btnRemover = document.createElement('button');
  btnRemover.className = 'btn-action btn-remove';
  btnRemover.title = 'Remover tarefa';
  btnRemover.setAttribute('aria-label', 'Remover tarefa');
  btnRemover.textContent = '✕';
  btnRemover.addEventListener('click', () => handleRemoverTarefa(tarefa.id));

  actions.appendChild(btnConcluir);
  actions.appendChild(btnRemover);

  li.appendChild(check);
  li.appendChild(info);
  li.appendChild(actions);

  return li;
}

/**
 * Renderiza a lista de tarefas com base no filtro ativo.
 * Faz diff simples: remove itens que saíram e adiciona os novos.
 */
function renderizarLista() {
  const lista = el.taskList();
  const vazio = el.emptyState();
  if (!lista || !vazio) return;

  const tarefasFiltradas = filtrarTarefas(filtroAtivo);

  // Limpa lista e re-renderiza (simples e suficiente para a escala)
  lista.innerHTML = '';

  if (tarefasFiltradas.length === 0) {
    vazio.hidden = false;
  } else {
    vazio.hidden = true;
    tarefasFiltradas.forEach(tarefa => {
      lista.appendChild(criarElementoTarefa(tarefa));
    });
  }

  atualizarContadores();
}

/**
 * Atualiza o estado visual dos botões de filtro.
 */
function renderizarFiltros() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filtroAtivo);
  });
}


/* ── HANDLERS DE EVENTOS ─────────────────────────────────── */

/**
 * Handler: Adicionar tarefa via formulário.
 */
function handleAdicionarTarefa() {
  const inputNome    = el.taskName();
  const inputMateria = el.taskSubject();
  if (!inputNome) return;

  const nome    = inputNome.value;
  const materia = inputMateria ? inputMateria.value : '';

  const resultado = adicionarTarefa(nome, materia);

  if (!resultado.ok) {
    // Feedback de erro
    inputNome.classList.add('error');
    exibirFeedback('⚠ ' + resultado.erro, 'error');
    inputNome.focus();

    // Remove classe de erro após animação
    inputNome.addEventListener('animationend', () => {
      inputNome.classList.remove('error');
    }, { once: true });
    return;
  }

  // Sucesso: limpa campos e dá feedback
  inputNome.value = '';
  if (inputMateria) inputMateria.value = '';
  inputNome.focus();

  exibirFeedback('✓ Tarefa adicionada com sucesso!', 'success');
  renderizarLista();
}

/**
 * Handler: Remover tarefa com animação de saída.
 * @param {string} id
 */
function handleRemoverTarefa(id) {
  const lista = el.taskList();
  const itemEl = lista ? lista.querySelector(`[data-id="${id}"]`) : null;

  if (itemEl) {
    // Anima saída antes de remover do DOM e do estado
    itemEl.classList.add('leaving');
    itemEl.addEventListener('animationend', () => {
      removerTarefa(id);
      renderizarLista();
    }, { once: true });
  } else {
    removerTarefa(id);
    renderizarLista();
  }
}

/**
 * Handler: Alternar conclusão de tarefa.
 * @param {string} id
 */
function handleAlternarConcluida(id) {
  const tarefa = alternarConcluida(id);
  if (!tarefa) return;
  renderizarLista();
}

/**
 * Handler: Mudança de filtro.
 * @param {string} filtro
 */
function handleFiltro(filtro) {
  filtroAtivo = filtro;
  renderizarFiltros();
  renderizarLista();
}


/* ── INICIALIZAÇÃO ───────────────────────────────────────── */

/**
 * Registra todos os event listeners e faz a renderização inicial.
 */
function inicializar() {
  // Botão de adicionar
  const btnAdd = el.btnAdd();
  if (btnAdd) {
    btnAdd.addEventListener('click', handleAdicionarTarefa);
  }

  // Enter no campo de nome também adiciona
  const inputNome = el.taskName();
  if (inputNome) {
    inputNome.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAdicionarTarefa();
    });
  }

  // Enter no campo de matéria também adiciona
  const inputMateria = el.taskSubject();
  if (inputMateria) {
    inputMateria.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAdicionarTarefa();
    });
  }

  // Filtros: delegação de eventos no container
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => handleFiltro(btn.dataset.filter));
  });

  // Renderização inicial
  renderizarFiltros();
  renderizarLista();
}

// Aguarda o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}


/* ── EXPORTS PARA TESTES (ambiente Node/Jest) ────────────── */
// Permite importar e testar as funções de lógica isoladamente
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    adicionarTarefa,
    removerTarefa,
    alternarConcluida,
    filtrarTarefas,
    calcularEstatisticas,
    criarTarefa,
    // acesso ao estado para inspeção em testes
    get tarefas() { return tarefas; },
    resetarEstado() { tarefas = []; proximoId = 1; },
  };
}
async function carregarDica() {
  try {
    const resposta = await fetch("https://api.adviceslip.com/advice");
    const dados = await resposta.json();

    document.getElementById("dica").textContent =
      dados.slip.advice;
  } catch (erro) {
    document.getElementById("dica").textContent =
      "Não foi possível carregar a dica.";
  }
}

carregarDica();