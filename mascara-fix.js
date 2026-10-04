/* mascara-fix.js — Forma Suprema (Ficha das Máscaras) estável
   Única fonte da lógica de máscara. ficha-mascaras.js é no-op.
   Bônus: +20 PV, +10 PE, +10 Defesa. Custos: −6 SAN ao colocar, −2 ao manter. */
(function () {
  if (window.__mascaraFixV5) return;
  window.__mascaraFixV5 = true;

  var PV = 20, PE = 10, DEF = 10;
  var locked = false;
  var patched = false;

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

    if (id) {
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
    }
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
      '#msk-box{display:block!important;visibility:visible!important;opacity:1!important;',
      'margin:10px 0 12px;padding:14px;border-radius:12px;',
      'border:1px solid rgba(239,68,68,.45);background:linear-gradient(180deg,rgba(127,29,29,.28),rgba(20,10,12,.55));',
      'box-shadow:0 8px 24px rgba(0,0,0,.25);position:relative;z-index:20;}',
      '#msk-box .msk-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;}',
      '#msk-box .msk-title{margin:0;font-size:.92rem;font-weight:700;color:#fca5a5;}',
      '#msk-box .msk-badge{font-size:.68rem;font-weight:700;padding:3px 8px;border-radius:999px;',
      'border:1px solid rgba(239,68,68,.4);color:#fca5a5;background:rgba(239,68,68,.12);}',
      '#msk-box .msk-badge.on{background:rgba(239,68,68,.35);color:#fff;}',
      '#msk-box .msk-help{margin:0 0 10px;font-size:.78rem;color:#e7e5e4;line-height:1.4;}',
      '#msk-box .msk-actions{display:flex;flex-wrap:wrap;gap:8px;}',
      '#msk-on,#msk-stay,#msk-off{cursor:pointer;border-radius:8px;padding:10px 14px;font-weight:700;font-size:.85rem;border:none;}',
      '#msk-on{background:linear-gradient(135deg,#9f1239,#e11d48);color:#fff;}',
      '#msk-stay{background:linear-gradient(135deg,#b91c1c,#dc2626);color:#fff;}',
      '#msk-off{background:#1c1917;color:#e7e5e4;border:1px solid #57534e!important;}',
      '#msk-msg{margin-top:8px;font-size:.75rem;color:#fecaca;min-height:1.1em;}',
      'body.msk-red{--accent:#ef4444;--accent-2:#b91c1c;}',
      'body.msk-red .brand h1{color:#fca5a5!important;}',
      'body.msk-red .tab.active{border-bottom-color:#ef4444!important;color:#fca5a5!important;}',
      'body.msk-red .hab-subtab.active{background:linear-gradient(135deg,#9f1239,#e11d48)!important;color:#fff!important;}',
      'body.msk-red .hab-class-tab.active{color:#fca5a5!important;border-bottom:2px solid #ef4444!important;}',
      'body.msk-red .btn-add-hab,body.msk-red .hab-chip.active{background:linear-gradient(135deg,#9f1239,#e11d48)!important;border-color:#ef4444!important;color:#fff!important;}',
      'body.msk-red .hab-chip{border-color:rgba(239,68,68,.45)!important;}',
      'body.msk-red .hab-nex,body.msk-red .hab-pe{background:rgba(239,68,68,.22)!important;color:#fecaca!important;}'
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
        var v = _cd.apply(this, arguments);
        if (window.state && state.mascaraAtiva) v = (Number(v) || 0) + DEF;
        return v;
      };
      window.calcularDefesa.__mskOuter = true;
    }

    patched = true;
  }

  function msg(t) {
    var e = document.getElementById('msk-msg');
    if (e) e.textContent = t || '';
  }

  function setBadge(a) {
    var b = document.getElementById('msk-badge');
    if (!b) return;
    if (a) {
      b.textContent = 'ATIVA';
      b.classList.add('on');
      document.body.classList.add('msk-red');
    } else {
      b.textContent = 'INATIVA';
      b.classList.remove('on');
      document.body.classList.remove('msk-red');
    }
  }

  function showChoice() {
    var o = document.getElementById('msk-on');
    var s = document.getElementById('msk-stay');
    var f = document.getElementById('msk-off');
    if (o) o.style.display = 'none';
    if (s) s.style.display = '';
    if (f) f.style.display = '';
  }

  function showIdle() {
    var o = document.getElementById('msk-on');
    var s = document.getElementById('msk-stay');
    var f = document.getElementById('msk-off');
    if (o) o.style.display = '';
    if (s) s.style.display = 'none';
    if (f) f.style.display = 'none';
  }

  function syncUI() {
    if (isOn()) {
      setBadge(true);
      showChoice();
    } else {
      setBadge(false);
      showIdle();
    }
  }

  function forceUI() {
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
    forceUI();
    syncUI();
  }

  function placeBox(box) {
    var res = document.querySelector('section.card.resources') || document.querySelector('.resources');
    if (res && res.parentNode) {
      res.parentNode.insertBefore(box, res);
      return;
    }
    var at = document.querySelector('section.card.attributes') ||
             document.querySelector('.attributes') ||
             document.querySelector('.attr-wheel');
    if (at && at.parentNode) {
      at.parentNode.insertBefore(box, at.nextSibling);
      return;
    }
    var app = document.querySelector('#app') || document.body;
    app.insertBefore(box, app.firstChild);
  }

  function ensureBox() {
    if (document.getElementById('msk-box')) return false;
    var box = document.createElement('div');
    box.id = 'msk-box';
    box.innerHTML =
      '<div class="msk-head">' +
      '<p class="msk-title">Forma Suprema</p>' +
      '<span class="msk-badge" id="msk-badge">INATIVA</span>' +
      '</div>' +
      '<p class="msk-help">Clique em <b>Colocar Máscara</b>: +20 Vida, +10 Esforço, +10 Defesa, −6 Sanidade.<br>' +
      'Depois: <b>Manter</b> (−2 SAN) ou <b>Tirar</b> (remove bônus).</p>' +
      '<div class="msk-actions">' +
      '<button type="button" id="msk-on">Colocar Máscara</button>' +
      '<button type="button" id="msk-stay" style="display:none">Manter máscara (−2 Sanidade)</button>' +
      '<button type="button" id="msk-off" style="display:none">Tirar máscara</button>' +
      '</div>' +
      '<div id="msk-msg"></div>';
    placeBox(box);
    return true;
  }

  function rebind(id, handler) {
    var btn = document.getElementById(id);
    if (!btn || !btn.parentNode) return;
    if (btn.dataset.mskBound === '1') return;
    var neo = btn.cloneNode(true);
    neo.dataset.mskBound = '1';
    btn.parentNode.replaceChild(neo, btn);
    neo.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      handler();
    });
  }

  function bindButtons() {
    if (!document.getElementById('msk-on')) return;

    rebind('msk-on', function () {
      if (isOn()) {
        syncUI();
        msg('Máscara já ativa.');
        return;
      }
      locked = true;
      var custo = 6;
      var san = state.sanAtual;
      if (san == null || san === undefined) {
        san = (typeof calcularRecursos === 'function' ? calcularRecursos().sanMax : 0) || 0;
      }
      san = Number(san) || 0;
      if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) {
        locked = false;
        return;
      }

      // Calcula base com máscara OFF
      state.mascaraAtiva = false;
      patch();
      var r0 = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 0, peMax: 0 };
      var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : (r0.pvMax || 0);
      var curPe = state.peAtual != null ? Number(state.peAtual) : (r0.peMax || 0);

      state.sanAtual = Math.max(0, san - custo);
      state.mascaraAtiva = true;
      state.vidaAtual = curPv + PV;
      state.peAtual = curPe + PE;

      msg('ATIVA: +20 Vida · +10 Esforço · +10 Defesa · −6 Sanidade');
      persist();
      setTimeout(function () { locked = false; }, 600);
    });

    rebind('msk-stay', function () {
      if (!isOn()) {
        var b = document.getElementById('msk-on');
        if (b) b.click();
        return;
      }
      locked = true;
      var custo = 2;
      var san = state.sanAtual;
      if (san == null || san === undefined) {
        san = (typeof calcularRecursos === 'function' ? calcularRecursos().sanMax : 0) || 0;
      }
      san = Number(san) || 0;
      if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) {
        locked = false;
        return;
      }
      state.sanAtual = Math.max(0, san - custo);
      msg('Mantida: −2 Sanidade');
      persist();
      setTimeout(function () { locked = false; }, 400);
    });

    rebind('msk-off', function () {
      if (!isOn()) {
        syncUI();
        msg('Máscara já inativa.');
        return;
      }
      if (!confirm('Tirar a máscara? Perde +20 Vida / +10 Esforço / +10 Defesa.')) return;
      locked = true;
      var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : 0;
      var curPe = state.peAtual != null ? Number(state.peAtual) : 0;

      state.mascaraAtiva = false;
      var npv = Math.max(0, curPv - PV);
      state.vidaAtual = npv;
      state.peAtual = Math.max(0, curPe - PE);

      if (npv === 0) {
        alert('0 Vida — morrendo.');
        msg('Removida. 0 Vida — morrendo.');
      } else {
        msg('Removida. Bônus perdidos.');
      }
      persist();
      setTimeout(function () { locked = false; }, 600);
    });
  }

  function tick() {
    if (typeof state === 'undefined') return;
    if (state.mascaraAtiva == null) state.mascaraAtiva = false;
    if (!detectMask()) return;

    freeLimits();
    document.body.classList.add('ficha-mascaras-sheet');
    css();
    patch();

    var created = ensureBox();
    if (created) {
      var btn = document.getElementById('msk-on');
      if (btn) btn.dataset.mskBound = '';
    }
    bindButtons();

    if (!locked) syncUI();
  }

  var n = 0;
  var timer = setInterval(function () {
    n++;
    tick();
    if (n === 60) {
      clearInterval(timer);
      setInterval(tick, 2500);
    }
  }, 200);

  setTimeout(tick, 300);
  setTimeout(tick, 1200);
})();
