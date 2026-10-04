/* mascara-fix.js v10 — Forma Suprema
   Colocar some → Manter + Tirar aparecem no lugar (nunca os 3 juntos).
   Colocar: −6 SAN, +20 PV, +10 PE, +10 DEF
   Manter: −2 SAN
   Tirar: remove bônus */
(function () {
  if (window.__mascaraFixV10) return;
  window.__mascaraFixV10 = true;

  var PV = 20, PE = 10, DEF = 10;
  var patched = false;
  var busy = false;

  function freeLimits() {
    if (typeof state === 'undefined' || !state) return;
    window.isFichaCustom = function () {
      return !!(state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
    };
    window.isFichaLivre = function () {
      return !!(state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
    };
  }

  function detectMask() {
    if (typeof state === 'undefined' || !state) return false;
    if (state.tipoFicha === 'mascaras') return true;
    var id = '';
    try {
      id = (typeof AGENTE_ID !== 'undefined' && AGENTE_ID) ||
           new URLSearchParams(location.search).get('id') || '';
    } catch (e) {}
    if (!id) return false;
    try {
      var reg = JSON.parse(localStorage.getItem('escandinavo-agentes-registro') || '[]');
      for (var i = 0; i < reg.length; i++) {
        if (reg[i] && reg[i].id === id && reg[i].tipoFicha === 'mascaras') {
          state.tipoFicha = 'mascaras';
          return true;
        }
      }
    } catch (e) {}
    try {
      var raw = localStorage.getItem('escandinavo-ficha-' + id);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.tipoFicha === 'mascaras') {
          state.tipoFicha = 'mascaras';
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function isOn() {
    return !!(window.state && state.mascaraAtiva);
  }

  function css() {
    if (document.getElementById('msk-css')) return;
    var st = document.createElement('style');
    st.id = 'msk-css';
    st.textContent = [
      '#msk-box{display:block!important;margin:10px 0 12px;padding:14px;border-radius:12px;',
      'border:1px solid rgba(239,68,68,.45);background:linear-gradient(180deg,rgba(127,29,29,.28),rgba(20,10,12,.55));',
      'box-shadow:0 8px 24px rgba(0,0,0,.25);position:relative;z-index:50;}',
      '#msk-box .msk-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;}',
      '#msk-box .msk-title{margin:0;font-size:.92rem;font-weight:700;color:#fca5a5;}',
      '#msk-box .msk-badge{font-size:.68rem;font-weight:700;padding:3px 8px;border-radius:999px;',
      'border:1px solid rgba(239,68,68,.4);color:#fca5a5;background:rgba(239,68,68,.12);}',
      '#msk-box .msk-badge.on{background:rgba(239,68,68,.4);color:#fff;}',
      '#msk-box .msk-help{margin:0 0 10px;font-size:.78rem;color:#e7e5e4;line-height:1.45;}',
      '#msk-box .msk-actions{display:flex!important;flex-wrap:wrap;gap:8px;align-items:center;min-height:42px;}',
      '#msk-on,#msk-stay,#msk-off{cursor:pointer;border-radius:8px;padding:10px 14px;font-weight:700;font-size:.85rem;border:none;line-height:1.2;}',
      '#msk-on{background:linear-gradient(135deg,#9f1239,#e11d48);color:#fff;}',
      '#msk-stay{background:linear-gradient(135deg,#b91c1c,#dc2626);color:#fff;}',
      '#msk-off{background:#1c1917;color:#e7e5e4;border:1px solid #57534e!important;}',
      '#msk-msg{margin-top:8px;font-size:.75rem;color:#fecaca;min-height:1.1em;}',
      'body.msk-red{--accent:#ef4444;--accent-2:#b91c1c;}',
      'body.msk-red .brand h1{color:#fca5a5!important;}',
      'body.msk-red .tab.active{border-bottom-color:#ef4444!important;color:#fca5a5!important;}'
    ].join('');
    document.head.appendChild(st);
  }

  function patch() {
    if (patched) return;
    if (typeof calcularRecursos !== 'function') return;
    freeLimits();

    if (!calcularRecursos.__mskOuter) {
      var _cr = calcularRecursos;
      window.calcularRecursos = function () {
        var r = _cr.apply(this, arguments);
        if (window.state && state.mascaraAtiva) {
          r.pvMax = (Number(r.pvMax) || 0) + PV;
          r.peMax = (Number(r.peMax) || 0) + PE;
        }
        return r;
      };
      window.calcularRecursos.__mskOuter = true;
    }

    if (typeof calcularDefesa === 'function' && !calcularDefesa.__mskOuter) {
      var _cd = calcularDefesa;
      window.calcularDefesa = function () {
        var v = Number(_cd.apply(this, arguments)) || 0;
        if (window.state && state.mascaraAtiva) v += DEF;
        return v;
      };
      window.calcularDefesa.__mskOuter = true;
    }
    patched = true;
  }

  function setMsg(t) {
    var e = document.getElementById('msk-msg');
    if (e) e.textContent = t || '';
  }

  function setBadge(on) {
    var b = document.getElementById('msk-badge');
    if (!b) return;
    if (on) {
      b.textContent = 'ATIVA';
      b.classList.add('on');
      document.body.classList.add('msk-red');
    } else {
      b.textContent = 'INATIVA';
      b.classList.remove('on');
      document.body.classList.remove('msk-red');
    }
  }

  function showEl(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.setProperty('display', 'inline-block', 'important');
    el.removeAttribute('hidden');
  }

  function hideEl(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.setProperty('display', 'none', 'important');
  }

  function syncButtons() {
    var on = isOn();
    setBadge(on);
    if (on) {
      hideEl('msk-on');
      showEl('msk-stay');
      showEl('msk-off');
    } else {
      showEl('msk-on');
      hideEl('msk-stay');
      hideEl('msk-off');
    }
  }

  function refreshNumbers() {
    if (typeof calcularRecursos !== 'function') return;
    var r = calcularRecursos();
    var def = typeof calcularDefesa === 'function' ? calcularDefesa() : 15;
    function set(id, v) {
      var el = document.getElementById(id);
      if (el) el.textContent = String(v);
    }
    if (state.vidaAtual != null) set('vida-atual', state.vidaAtual);
    set('vida-max', r.pvMax);
    if (state.sanAtual != null) set('san-atual', state.sanAtual);
    set('san-max', r.sanMax);
    if (state.peAtual != null) set('pe-atual', state.peAtual);
    set('pe-max', r.peMax);
    set('defesa', def);
  }

  function persist() {
    try {
      if (typeof lastResourceMax !== 'undefined' && lastResourceMax) {
        var r = calcularRecursos();
        lastResourceMax.pv = r.pvMax;
        lastResourceMax.pe = r.peMax;
        lastResourceMax.san = r.sanMax;
      }
    } catch (e) {}
    if (typeof saveState === 'function') saveState();
    else if (typeof scheduleSave === 'function') scheduleSave();
    if (typeof renderRecursos === 'function') {
      try { renderRecursos(); } catch (e) {}
    }
    if (typeof renderCombate === 'function') {
      try { renderCombate(); } catch (e) {}
    }
    refreshNumbers();
    syncButtons();
  }

  function getSan() {
    if (state.sanAtual != null && state.sanAtual !== undefined) return Number(state.sanAtual) || 0;
    if (typeof calcularRecursos === 'function') return Number(calcularRecursos().sanMax) || 0;
    return 0;
  }

  function doColocar() {
    if (busy) return;
    if (isOn()) {
      syncButtons();
      return;
    }
    busy = true;

    var custo = 6;
    var san = getSan();
    if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) {
      busy = false;
      return;
    }

    state.mascaraAtiva = false;
    patch();
    var r0 = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 0, peMax: 0 };
    var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : (Number(r0.pvMax) || 0);
    var curPe = state.peAtual != null ? Number(state.peAtual) : (Number(r0.peMax) || 0);

    state.sanAtual = Math.max(0, san - custo);
    state.mascaraAtiva = true;
    state.vidaAtual = curPv + PV;
    state.peAtual = curPe + PE;

    hideEl('msk-on');
    showEl('msk-stay');
    showEl('msk-off');
    setBadge(true);
    setMsg('ATIVA: +20 Vida · +10 Esforço · +10 Defesa · −6 Sanidade');

    persist();
    busy = false;
  }

  function doManter() {
    if (busy) return;
    if (!isOn()) {
      syncButtons();
      return;
    }
    busy = true;

    var custo = 2;
    var san = getSan();
    if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) {
      busy = false;
      return;
    }
    state.sanAtual = Math.max(0, san - custo);
    setMsg('Mantida: −2 Sanidade');
    persist();
    busy = false;
  }

  function doTirar() {
    if (busy) return;
    if (!isOn()) {
      syncButtons();
      return;
    }
    if (!confirm('Tirar a máscara? Perde +20 Vida / +10 Esforço / +10 Defesa.')) return;
    busy = true;

    var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : 0;
    var curPe = state.peAtual != null ? Number(state.peAtual) : 0;

    state.mascaraAtiva = false;
    var npv = Math.max(0, curPv - PV);
    state.vidaAtual = npv;
    state.peAtual = Math.max(0, curPe - PE);

    showEl('msk-on');
    hideEl('msk-stay');
    hideEl('msk-off');
    setBadge(false);

    if (npv === 0) {
      alert('0 Vida — morrendo.');
      setMsg('Removida. 0 Vida — morrendo.');
    } else {
      setMsg('Removida. Bônus perdidos.');
    }

    persist();
    busy = false;
  }

  function onBoxClick(e) {
    var t = e.target;
    while (t && t !== e.currentTarget && (!t.id || (t.id !== 'msk-on' && t.id !== 'msk-stay' && t.id !== 'msk-off'))) {
      t = t.parentNode;
    }
    if (!t || !t.id) return;
    if (t.id === 'msk-on') {
      e.preventDefault();
      e.stopPropagation();
      doColocar();
    } else if (t.id === 'msk-stay') {
      e.preventDefault();
      e.stopPropagation();
      doManter();
    } else if (t.id === 'msk-off') {
      e.preventDefault();
      e.stopPropagation();
      doTirar();
    }
  }

  function ensureBox() {
    var box = document.getElementById('msk-box');
    if (box) {
      if (!box.dataset.mskDeleg) {
        box.dataset.mskDeleg = '1';
        box.addEventListener('click', onBoxClick);
      }
      return;
    }

    box = document.createElement('div');
    box.id = 'msk-box';
    box.dataset.mskDeleg = '1';
    box.innerHTML =
      '<div class="msk-head">' +
      '<p class="msk-title">Forma Suprema</p>' +
      '<span class="msk-badge" id="msk-badge">INATIVA</span>' +
      '</div>' +
      '<p class="msk-help">' +
      '<b>Colocar</b>: +20 Vida, +10 Esforço, +10 Defesa, −6 Sanidade.<br>' +
      '<b>Manter</b>: −2 Sanidade · <b>Tirar</b>: remove os bônus.' +
      '</p>' +
      '<div class="msk-actions">' +
      '<button type="button" id="msk-on" style="display:inline-block">Colocar Máscara</button>' +
      '<button type="button" id="msk-stay" style="display:none">Manter máscara (−2 Sanidade)</button>' +
      '<button type="button" id="msk-off" style="display:none">Tirar máscara</button>' +
      '</div>' +
      '<div id="msk-msg"></div>';

    var res = document.querySelector('section.card.resources') || document.querySelector('.resources');
    if (res && res.parentNode) {
      res.parentNode.insertBefore(box, res);
    } else {
      var at = document.querySelector('section.card.attributes') || document.querySelector('.attributes');
      if (at && at.parentNode) at.parentNode.insertBefore(box, at.nextSibling);
      else {
        var root = document.querySelector('#app') || document.body;
        root.insertBefore(box, root.firstChild);
      }
    }

    box.addEventListener('click', onBoxClick);
  }

  function tick() {
    if (typeof state === 'undefined') return;
    if (state.mascaraAtiva == null) state.mascaraAtiva = false;
    if (!detectMask()) return;

    freeLimits();
    document.body.classList.add('ficha-mascaras-sheet');
    css();
    patch();
    ensureBox();
    if (!busy) syncButtons();
  }

  var n = 0;
  var timer = setInterval(function () {
    n++;
    tick();
    if (n >= 40) {
      clearInterval(timer);
      setInterval(function () { if (!busy) tick(); }, 2000);
    }
  }, 150);

  setTimeout(tick, 200);
  setTimeout(tick, 800);
  setTimeout(tick, 2000);
})();
