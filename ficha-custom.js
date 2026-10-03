/* ficha-custom.js — UI de sobrescrita de PV/SAN/PE e indicadores da ficha customizada */
(function () {
  function isCustom() {
    return typeof isFichaCustom === 'function' ? isFichaCustom() : (window.state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
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
      'body.ficha-mascaras-sheet .res-max-edit{border-bottom-color:rgba(252,165,165,.5);color:inherit;}',
      'body.ficha-mascaras-sheet .res-max-edit:hover{color:inherit;filter:brightness(1.15);}',
      'body.ficha-mascaras-sheet .res-max-input{border-color:#ef4444;color:#fecaca;}',
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
      document.body.classList.remove('ficha-mascaras-sheet');
    } else if (state.tipoFicha === 'mascaras') {
      span.style.display = '';
      span.className = 'ficha-tipo-badge tipo-mascaras';
      span.textContent = 'Máscaras';
      document.body.classList.remove('ficha-custom');
      document.body.classList.add('ficha-mascaras-sheet');
    } else {
      document.body.classList.remove('ficha-mascaras-sheet');
      span.style.display = 'none';
      document.body.classList.remove('ficha-custom');
    }
  }

  function makeMaxEditable(maxId, overrideKey) {
    var el = document.getElementById(maxId);
    if (!el || el.dataset.customBound) return;
    el.dataset.customBound = '1';

    function applyLook() {
      if (!isCustom()) {
        el.classList.remove('res-max-edit');
        el.style.cursor = '';
        return;
      }
      el.classList.add('res-max-edit');
      el.title = 'Clique para editar o máximo';
    }

    el.addEventListener('click', function () {
      if (!isCustom()) return;
      if (el.dataset.editing === '1') return;
      el.dataset.editing = '1';
      var cur = el.textContent.trim();
      var input = document.createElement('input');
      input.type = 'number';
      input.className = 'res-max-input';
      input.value = cur;
      input.min = '1';
      el.textContent = '';
      el.appendChild(input);
      input.focus();
      input.select();

      function commit() {
        var v = parseInt(input.value, 10);
        if (isNaN(v) || v < 1) {
          state[overrideKey] = null;
        } else {
          state[overrideKey] = v;
        }
        el.dataset.editing = '0';
        if (typeof scheduleSave === 'function') scheduleSave();
        if (typeof renderRecursos === 'function') renderRecursos();
      }

      input.addEventListener('blur', commit);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') {
          el.dataset.editing = '0';
          if (typeof renderRecursos === 'function') renderRecursos();
        }
      });
    });

    applyLook();
    setInterval(applyLook, 1000);
  }

  function install() {
    if (typeof state === 'undefined') return false;
    ensureStyles();
    injectTipoBadge();
    updateTipoBadge();
    var map = { 'vida-max': 'pvMaxOverride', 'san-max': 'sanMaxOverride', 'pe-max': 'peMaxOverride' };
    Object.keys(map).forEach(function (id) { makeMaxEditable(id, map[id]); });
    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (install() || n > 40) {
      if (install()) {
        /* keep badge updated */
      }
      if (n > 8) clearInterval(t);
    }
  }, 250);

  setInterval(function () {
    try { updateTipoBadge(); } catch (e) {}
  }, 1000);
})();
