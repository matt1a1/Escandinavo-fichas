/* origem-classe-reset.js — ao mudar origem/classe, troca perícias e habilidades */
(function () {
  function habDescFromCatalog(nome) {
    if (!nome || typeof HABILIDADES_CATALOG === 'undefined') return '';
    var found = HABILIDADES_CATALOG.find(function (h) { return h.nome === nome; });
    return found ? (found.desc || '') : '';
  }

  function resetPericiasFromOrigemClasse() {
    if (typeof state === 'undefined') return;
    state.pericias = {};
    var o = typeof ORIGENS !== 'undefined' ? ORIGENS[state.origem] : null;
    if (o && o.pericias) {
      o.pericias.forEach(function (id) {
        if (typeof setPericiaRank === 'function') setPericiaRank(id, 5);
        else state.pericias[id] = { rank: 5, other: 0 };
      });
    }
    var cls = typeof CLASSES !== 'undefined' ? CLASSES[state.classe] : null;
    var fixas = (cls && cls.periciasFixas) || [];
    fixas.forEach(function (id) {
      if (typeof setPericiaRank === 'function') setPericiaRank(id, 5);
      else state.pericias[id] = { rank: 5, other: 0 };
    });
  }

  function resetHabilidadesFromOrigemClasse() {
    if (typeof state === 'undefined') return;
    var cls = typeof CLASSES !== 'undefined' ? CLASSES[state.classe] : null;
    var iniciais = ((cls && cls.habilidadesIniciais) || []).map(function (n) {
      return { nome: n, desc: habDescFromCatalog(n) };
    });
    var poderNome = (typeof ORIGENS !== 'undefined' && ORIGENS[state.origem] && ORIGENS[state.origem].poder) || '';
    var poder = poderNome ? [{ nome: poderNome, desc: habDescFromCatalog(poderNome) }] : [];
    state.habilidades = iniciais.concat(poder);
  }

  function onOrigemOrClasseChange() {
    resetPericiasFromOrigemClasse();
    resetHabilidadesFromOrigemClasse();
    if (typeof scheduleSave === 'function') scheduleSave();
    if (typeof renderAll === 'function') renderAll();
    else {
      if (typeof renderPericias === 'function') renderPericias();
      if (typeof renderHabilidades === 'function') renderHabilidades();
      if (typeof renderRecursos === 'function') renderRecursos();
    }
  }

  function bindSelect(id) {
    var el = document.getElementById(id);
    if (!el || el._ocrBound) return;
    el._ocrBound = true;
    var clone = el.cloneNode(true);
    clone._ocrBound = true;
    el.parentNode.replaceChild(clone, el);
    clone.addEventListener('change', function () {
      if (typeof state === 'undefined') return;
      if (id === 'classe') {
        state.classe = clone.value;
        state.vidaAtual = null;
        state.sanAtual = null;
        state.peAtual = null;
        if (typeof lastResourceMax !== 'undefined') {
          lastResourceMax = { pv: null, san: null, pe: null };
        }
      } else {
        state.origem = clone.value;
      }
      onOrigemOrClasseChange();
    });
  }

  function tryBind() {
    if (typeof state === 'undefined') return false;
    if (!document.getElementById('classe') || !document.getElementById('origem')) return false;
    bindSelect('classe');
    bindSelect('origem');
    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (tryBind() || n > 80) clearInterval(t);
  }, 100);
})();
