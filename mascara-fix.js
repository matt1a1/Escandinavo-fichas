/* mascara-fix.js — SIMPLEZ: Colocar -> ATIVA + 2 botões visíveis */
(function () {
  var PV = 20, PE = 10, DEF = 10;

  function isMaskSheet() {
    if (!window.state) return false;
    if (state.tipoFicha === 'mascaras') return true;
    var id = '';
    try {
      id = (typeof AGENTE_ID !== 'undefined' && AGENTE_ID) || new URLSearchParams(location.search).get('id') || '';
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
        var d = JSON.parse(raw);
        if (d && d.tipoFicha === 'mascaras') {
          state.tipoFicha = 'mascaras';
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function freeLimits() {
    if (!window.state) return;
    if (state.tipoFicha !== 'mascaras' && state.tipoFicha !== 'custom') return;
    window.isFichaCustom = function () {
      return !!(state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
    };
    window.isFichaLivre = function () {
      return !!(state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
    };
  }

  function css() {
    if (document.getElementById('msk-css')) return;
    var st = document.createElement('style');
    st.id = 'msk-css';
    st.textContent = [
      '#msk-box{display:block!important;margin:10px 0 12px;padding:14px;border-radius:12px;',
      'border:1px solid rgba(239,68,68,.45);background:linear-gradient(180deg,rgba(127,29,29,.28),rgba(20,10,12,.55));',
      'box-shadow:0 8px 24px rgba(0,0,0,.25);position:relative;z-index:30;}',
      '#msk-box .msk-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;}',
      '#msk-box .msk-title{margin:0;font-size:.92rem;font-weight:700;color:#fca5a5;}',
      '#msk-box .msk-badge{font-size:.68rem;font-weight:700;padding:3px 8px;border-radius:999px;',
      'border:1px solid rgba(239,68,68,.4);color:#fca5a5;background:rgba(239,68,68,.12);}',
      '#msk-box .msk-badge.on{background:rgba(239,68,68,.45);color:#fff;}',
      '#msk-box .msk-help{margin:0 0 10px;font-size:.78rem;color:#e7e5e4;line-height:1.4;}',
      '#msk-box .msk-actions{display:flex!important;flex-wrap:wrap;gap:8px;align-items:center;}',
      '#msk-on,#msk-stay,#msk-off{cursor:pointer;border-radius:8px;padding:10px 14px;font-weight:700;font-size:.85rem;border:none;}',
      '#msk-on{background:linear-gradient(135deg,#9f1239,#e11d48);color:#fff;}',
      '#msk-stay{background:linear-gradient(135deg,#b91c1c,#dc2626);color:#fff;}',
      '#msk-off{background:#1c1917;color:#e7e5e4;border:1px solid #57534e!important;}',
      '#msk-msg{margin-top:8px;font-size:.75rem;color:#fecaca;min-height:1.1em;}',
      'body.msk-red{--accent:#ef4444;--accent-2:#b91c1c;}',
      'body.msk-red .tab.active{border-bottom-color:#ef4444!important;color:#fca5a5!important;}'
    ].join('');
    document.head.appendChild(st);
  }

  function patch() {
    if (typeof calcularRecursos === 'function' && !calcularRecursos.__mskOuter) {
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
  }

  function uiAtiva() {
    var badge = document.getElementById('msk-badge');
    var btnOn = document.getElementById('msk-on');
    var btnStay = document.getElementById('msk-stay');
    var btnOff = document.getElementById('msk-off');
    var msg = document.getElementById('msk-msg');

    if (badge) {
      badge.textContent = 'ATIVA';
      badge.classList.add('on');
    }
    document.body.classList.add('msk-red');

    if (btnOn) btnOn.style.setProperty('display', 'none', 'important');
    if (btnStay) {
      btnStay.style.setProperty('display', 'inline-block', 'important');
      btnStay.style.setProperty('visibility', 'visible', 'important');
      btnStay.style.setProperty('opacity', '1', 'important');
    }
    if (btnOff) {
      btnOff.style.setProperty('display', 'inline-block', 'important');
      btnOff.style.setProperty('visibility', 'visible', 'important');
      btnOff.style.setProperty('opacity', '1', 'important');
    }
    if (msg && !msg.textContent) msg.textContent = 'ATIVA: +20 Vida · +10 Esforço · +10 Defesa · −6 Sanidade';
  }

  function uiInativa() {
    var badge = document.getElementById('msk-badge');
    var btnOn = document.getElementById('msk-on');
    var btnStay = document.getElementById('msk-stay');
    var btnOff = document.getElementById('msk-off');

    if (badge) {
      badge.textContent = 'INATIVA';
      badge.classList.remove('on');
    }
    document.body.classList.remove('msk-red');

    if (btnOn) btnOn.style.setProperty('display', 'inline-block', 'important');
    if (btnStay) btnStay.style.setProperty('display', 'none', 'important');
    if (btnOff) btnOff.style.setProperty('display', 'none', 'important');
  }

  function syncFromState() {
    if (window.state && state.mascaraAtiva) uiAtiva();
    else uiInativa();
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
    if (typeof renderRecursos === 'function') {
      try { renderRecursos(); } catch (e) {}
    }
  }

  function saveNow() {
    if (typeof saveState === 'function') saveState();
    else if (typeof scheduleSave === 'function') scheduleSave();
  }

  function onColocar() {
    if (!window.state) return;
    if (state.mascaraAtiva) {
      uiAtiva();
      return;
    }

    var custo = 6;
    var san = state.sanAtual;
    if (san == null || san === undefined) {
      san = (typeof calcularRecursos === 'function' ? calcularRecursos().sanMax : 0) || 0;
    }
    san = Number(san) || 0;
    if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) return;

    state.mascaraAtiva = false;
    var r0 = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 0, peMax: 0 };
    var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : (r0.pvMax || 0);
    var curPe = state.peAtual != null ? Number(state.peAtual) : (r0.peMax || 0);

    state.sanAtual = Math.max(0, san - custo);
    state.mascaraAtiva = true;
    state.vidaAtual = curPv + PV;
    state.peAtual = curPe + PE;

    uiAtiva();
    var msg = document.getElementById('msk-msg');
    if (msg) msg.textContent = 'ATIVA: +20 Vida · +10 Esforço · +10 Defesa · −6 Sanidade';

    refreshNumbers();
    saveNow();
  }

  function onManter() {
    if (!window.state) return;
    if (!state.mascaraAtiva) {
      onColocar();
      return;
    }
    var custo = 2;
    var san = state.sanAtual;
    if (san == null || san === undefined) {
      san = (typeof calcularRecursos === 'function' ? calcularRecursos().sanMax : 0) || 0;
    }
    san = Number(san) || 0;
    if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) return;
    state.sanAtual = Math.max(0, san - custo);
    var msg = document.getElementById('msk-msg');
    if (msg) msg.textContent = 'Mantida: −2 Sanidade';
    uiAtiva();
    refreshNumbers();
    saveNow();
  }

  function onTirar() {
    if (!window.state) return;
    if (!state.mascaraAtiva) {
      uiInativa();
      return;
    }
    if (!confirm('Tirar a máscara? Perde +20 Vida / +10 Esforço / +10 Defesa.')) return;

    var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : 0;
    var curPe = state.peAtual != null ? Number(state.peAtual) : 0;
    state.mascaraAtiva = false;
    var npv = Math.max(0, curPv - PV);
    state.vidaAtual = npv;
    state.peAtual = Math.max(0, curPe - PE);

    uiInativa();
    var msg = document.getElementById('msk-msg');
    if (msg) {
      msg.textContent = npv === 0 ? 'Removida. 0 Vida — morrendo.' : 'Removida. Bônus perdidos.';
    }
    if (npv === 0) alert('0 Vida — morrendo.');
    refreshNumbers();
    saveNow();
  }

  function bind() {
    var a = document.getElementById('msk-on');
    var b = document.getElementById('msk-stay');
    var c = document.getElementById('msk-off');
    if (!a || a.dataset.ok === '1') return;
    a.dataset.ok = '1';
    if (b) b.dataset.ok = '1';
    if (c) c.dataset.ok = '1';
    a.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); onColocar(); });
    if (b) b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); onManter(); });
    if (c) c.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); onTirar(); });
  }

  function inject() {
    if (!window.state || !isMaskSheet()) return;
    freeLimits();
    css();
    patch();
    document.body.classList.add('ficha-mascaras-sheet');
    if (state.mascaraAtiva == null) state.mascaraAtiva = false;

    if (!document.getElementById('msk-box')) {
      var box = document.createElement('div');
      box.id = 'msk-box';
      box.innerHTML =
        '<div class="msk-head">' +
        '<p class="msk-title">Forma Suprema</p>' +
        '<span class="msk-badge" id="msk-badge">INATIVA</span>' +
        '</div>' +
        '<p class="msk-help">Clique em <b>Colocar Máscara</b>: +20 Vida, +10 Esforço, +10 Defesa, −6 Sanidade.<br>' +
        'Depois aparecem: <b>Manter máscara (−2 SAN)</b> e <b>Tirar máscara</b>.</p>' +
        '<div class="msk-actions">' +
        '<button type="button" id="msk-on">Colocar Máscara</button>' +
        '<button type="button" id="msk-stay">Manter máscara (−2 Sanidade)</button>' +
        '<button type="button" id="msk-off">Tirar máscara</button>' +
        '</div>' +
        '<div id="msk-msg"></div>';

      var res = document.querySelector('section.card.resources') || document.querySelector('.resources');
      if (res && res.parentNode) res.parentNode.insertBefore(box, res);
      else {
        var at = document.querySelector('section.card.attributes') || document.querySelector('.attributes');
        if (at && at.parentNode) at.parentNode.insertBefore(box, at.nextSibling);
        else (document.querySelector('#app') || document.body).appendChild(box);
      }
    }

    bind();
    syncFromState();
  }

  var n = 0;
  var timer = setInterval(function () {
    n++;
    if (typeof state === 'undefined') return;
    inject();
    if (document.getElementById('msk-box')) syncFromState();
    if (n >= 40) {
      clearInterval(timer);
      setInterval(function () {
        if (typeof state === 'undefined') return;
        if (!document.getElementById('msk-box')) inject();
        else syncFromState();
      }, 2000);
    }
  }, 300);

  setTimeout(inject, 500);
})();
