/* origem-classe-reset.js
 * Ao mudar ORIGEM ou CLASSE:
 * - apaga perícias antigas e aplica só as da origem + fixas da classe
 * - apaga habilidades/poderes antigos e aplica só: habilidades iniciais da classe + poder da origem
 */
(function () {
  var busy = false;

  function habDescFromCatalog(nome) {
    if (!nome || typeof HABILIDADES_CATALOG === 'undefined') return '';
    var found = HABILIDADES_CATALOG.find(function (h) {
      return String(h.nome || '').toLowerCase() === String(nome).toLowerCase();
    });
    return found ? (found.desc || '') : '';
  }

  function resetPericiasFromOrigemClasse() {
    if (typeof state === 'undefined') return;
    state.pericias = {};
    var o = (typeof ORIGENS !== 'undefined' && ORIGENS[state.origem]) ? ORIGENS[state.origem] : null;
    if (o && Array.isArray(o.pericias)) {
      o.pericias.forEach(function (id) {
        if (typeof setPericiaRank === 'function') setPericiaRank(id, 5);
        else state.pericias[id] = { rank: 5, other: 0 };
      });
    }
    var cls = (typeof CLASSES !== 'undefined' && CLASSES[state.classe]) ? CLASSES[state.classe] : null;
    var fixas = (cls && cls.periciasFixas) || [];
    fixas.forEach(function (id) {
      if (typeof setPericiaRank === 'function') setPericiaRank(id, 5);
      else state.pericias[id] = { rank: 5, other: 0 };
    });
  }

  function resetHabilidadesFromOrigemClasse() {
    if (typeof state === 'undefined') return;
    var cls = (typeof CLASSES !== 'undefined' && CLASSES[state.classe]) ? CLASSES[state.classe] : null;
    var iniciais = ((cls && cls.habilidadesIniciais) || []).map(function (n) {
      return { nome: n, desc: habDescFromCatalog(n), pe: '' };
    });
    var poderNome = (typeof ORIGENS !== 'undefined' && ORIGENS[state.origem] && ORIGENS[state.origem].poder)
      ? ORIGENS[state.origem].poder
      : '';
    var lista = iniciais.slice();
    if (poderNome) {
      lista.push({ nome: poderNome, desc: habDescFromCatalog(poderNome), pe: '' });
    }
    // substitui por completo (some trilhas/poderes antigos)
    state.habilidades = lista;
  }

  function applyChange(kind, value) {
    if (typeof state === 'undefined' || busy) return;
    busy = true;
    try {
      if (kind === 'classe') {
        state.classe = value;
        state.vidaAtual = null;
        state.sanAtual = null;
        state.peAtual = null;
        if (typeof lastResourceMax !== 'undefined') {
          lastResourceMax = { pv: null, san: null, pe: null };
        }
      } else if (kind === 'origem') {
        state.origem = value;
      }
      resetPericiasFromOrigemClasse();
      resetHabilidadesFromOrigemClasse();
      if (typeof scheduleSave === 'function') scheduleSave();
      else if (typeof saveState === 'function') saveState();
      if (typeof renderAll === 'function') renderAll();
      else {
        if (typeof renderPericias === 'function') renderPericias();
        if (typeof renderHabilidades === 'function') renderHabilidades();
        if (typeof renderRecursos === 'function') renderRecursos();
      }
    } finally {
      busy = false;
    }
  }

  // Captura no document: roda ANTES dos listeners do app.js e impede o handler antigo
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (!t || !t.id) return;
    if (t.id !== 'classe' && t.id !== 'origem') return;
    e.stopImmediatePropagation();
    applyChange(t.id === 'classe' ? 'classe' : 'origem', t.value);
  }, true);

  window.__resetOrigemClasse = function () {
    resetPericiasFromOrigemClasse();
    resetHabilidadesFromOrigemClasse();
    if (typeof renderAll === 'function') renderAll();
  };
})();
