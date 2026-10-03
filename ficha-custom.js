/* ficha-custom.js — UI de sobrescrita de PV/SAN/PE e indicadores da ficha customizada */
(function () {
  function isCustom() {
    return typeof isFichaCustom === 'function' ? isFichaCustom() : (window.state && state.tipoFicha === 'custom');
  }

  function ensureStyles() {
    if (document.getElementById('ficha-custom-style')) return;
    var s = document.createElement('style');
    s.id = 'ficha-custom-style';
    s.textContent = [
      '.ficha-tipo-badge{display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:700;padding:4px 10px;border-radius:999px;margin-left:8px;vertical-align:middle;}',
      '.ficha-tipo-badge.tipo-custom{background:rgba(56,189,248,.15);color:#7dd3fc;border:1px solid rgba(56,189,248,.4);}',
      '.ficha-tipo-badge.tipo-mascaras{background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.4);}',
      '.res-max-edit{display:inline-block;min-width:2ch;border-bottom:1px dashed rgba(125,211,252,.5);cursor:pointer;color:#7dd3fc;}',
      '.res-max-edit:hover{color:#bae6fd;}',
      '.res-max-input{width:3.2rem;background:#121218;border:1px solid #38bdf8;color:#e0f2fe;border-radius:4px;padding:1px 4px;font-size:inherit;text-align:center;}',
      'body.ficha-custom #attr-points{opacity:0.35;}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function injectTipoBadge() {
    var title = document.querySelector('.brand h1') || document.querySelector('.brand');
    if (!title || document.getElementById('ficha-tipo-badge')) return;
    var span = document.createElement('span');
    span.id = 'ficha-tipo-badge';
    span.className = 'ficha-tipo-badge';
    title.appendChild(span);
  }

  function updateTipoBadge() {
    var span = document.getElementById('ficha-tipo-badge');
    if (!span || typeof state === 'undefined') return;
    if (state.tipoFicha === 'custom') {
      span.style.display = '';
      span.className = 'ficha-tipo-badge tipo-custom';
      span.textContent = 'Customizada';
      document.body.classList.add('ficha-custom');
    } else if (state.tipoFicha === 'mascaras') {
      span.style.display = '';
      span.className = 'ficha-tipo-badge tipo-mascaras';
      span.textContent = 'M\u00e1scaras';
      document.body.classList.remove('ficha-custom');
    } else {
      span.style.display = 'none';
      document.body.classList.remove('ficha-custom');
    }
  }

  function makeMaxEditable(maxId, overrideKey) {
    var el = document.getElementById(maxId);
    if (!el || el.dataset.customBound) return;
    el.dataset.customBound = '1';

    el.addEventListener('click', function () {
      if (!isCustom()) return;
      if (el.querySelector('input')) return;
      var current = el.textContent.trim();
      var input = document.createElement('input');
      input.type = 'number';
      input.className = 'res-max-input';
      input.min = '1';
      input.value = current;
      el.textContent = '';
      el.appendChild(input);
      input.focus();
      input.select();

      function commit() {
        var v = parseInt(input.value, 10);
        if (!isFinite(v) || v < 1) {
          state[overrideKey] = null;
        } else {
          state[overrideKey] = v;
        }
        if (typeof scheduleSave === 'function') scheduleSave();
        if (typeof renderRecursos === 'function') renderRecursos();
        markEditableMaxes();
      }
      input.addEventListener('blur', commit);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') {
          if (typeof renderRecursos === 'function') renderRecursos();
          markEditableMaxes();
        }
      });
    });
  }

  function markEditableMaxes() {
    if (!isCustom()) {
      ['vida-max', 'san-max', 'pe-max'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.remove('res-max-edit');
      });
      return;
    }
    ['vida-max', 'san-max', 'pe-max'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && !el.querySelector('input')) el.classList.add('res-max-edit');
    });
    var map = { 'vida-max': 'pvMaxOverride', 'san-max': 'sanMaxOverride', 'pe-max': 'peMaxOverride' };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (state[map[id]] != null && state[map[id]] !== '') {
        el.title = 'Valor sobrescrito (custom). Clique para editar. Apague o n\u00famero e saia do campo para voltar ao calculado.';
      } else {
        el.title = 'Clique para sobrescrever o m\u00e1ximo calculado';
      }
    });
  }

  function patchRenderRecursos() {
    if (typeof renderRecursos !== 'function' || renderRecursos.__customPatched) return;
    var orig = renderRecursos;
    window.renderRecursos = function () {
      var r = orig.apply(this, arguments);
      markEditableMaxes();
      updateTipoBadge();
      return r;
    };
    window.renderRecursos.__customPatched = true;
  }

  window.__skipDefesaFloor = function () {
    return isCustom();
  };

  function install() {
    if (typeof state === 'undefined') return false;
    ensureStyles();
    injectTipoBadge();
    updateTipoBadge();
    makeMaxEditable('vida-max', 'pvMaxOverride');
    makeMaxEditable('san-max', 'sanMaxOverride');
    makeMaxEditable('pe-max', 'peMaxOverride');
    patchRenderRecursos();
    markEditableMaxes();
    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (install() || n > 80) clearInterval(t);
  }, 120);
})();
