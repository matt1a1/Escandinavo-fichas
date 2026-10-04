/* mascara-fix.js — botão Máscara SEMPRE que tipoFicha=mascaras (robusto) */
(function () {
  var PV = 20, PE = 10, DEF = 10;
  var injected = false;

  function freeLimits() {
    if (typeof state === 'undefined') return;
    if (state.tipoFicha !== 'mascaras' && state.tipoFicha !== 'custom') return;
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
        var data = JSON.parse(raw);
        if (data && data.tipoFicha === 'mascaras') {
          state.tipoFicha = 'mascaras';
          return true;
        }
      }
    } catch (e) {}

    return false;
  }

  function on() { return !!(window.state && state.mascaraAtiva); }

  function css() {
    if (document.getElementById('msk-css')) return;
    var st = document.createElement('style');
    st.id = 'msk-css';
    st.textContent = [
      '#msk-box{display:block !important;visibility:visible !important;opacity:1 !important;',
      'margin:12px 0 !important;padding:14px !important;border-radius:12px !important;',
      'border:2px solid #ef4444 !important;background:linear-gradient(180deg,#7f1d1d,#1c1917) !important;',
      'box-shadow:0 8px 24px rgba(0,0,0,.4) !important;z-index:50 !important;position:relative !important;}',
      '#msk-box .msk-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;}',
      '#msk-box .msk-title{margin:0;font-size:1rem;font-weight:800;color:#fecaca;}',
      '#msk-box .msk-badge{font-size:.7rem;font-weight:800;padding:4px 10px;border-radius:999px;',
      'border:1px solid #f87171;color:#fecaca;background:rgba(239,68,68,.25);}',
      '#msk-box .msk-badge.on{background:#ef4444;color:#fff;}',
      '#msk-box .msk-help{margin:0 0 12px;font-size:.8rem;color:#f5f5f4;line-height:1.45;}',
      '#msk-box .msk-actions{display:flex !important;flex-wrap:wrap;gap:8px;}',
      '#msk-on,#msk-stay,#msk-off{display:inline-block !important;cursor:pointer !important;',
      'border-radius:8px !important;padding:12px 16px !important;font-weight:800 !important;font-size:.9rem !important;',
      'border:none !important;min-height:44px;}',
      '#msk-on{background:#e11d48 !important;color:#fff !important;}',
      '#msk-stay{background:#dc2626 !important;color:#fff !important;}',
      '#msk-off{background:#292524 !important;color:#e7e5e4 !important;border:1px solid #78716c !important;}',
      '#msk-msg{margin-top:8px;font-size:.8rem;color:#fecaca;min-height:1.2em;font-weight:600;}',
      'body.msk-red .tab.active{border-bottom-color:#ef4444 !important;color:#fca5a5 !important;}'
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
      calcularRecursos.__mskOuter = true;
    }
    if (typeof calcularDefesa === 'function' && !calcularDefesa.__mskOuter) {
      var _cd = calcularDefesa;
      window.calcularDefesa = function () {
        var v = _cd.apply(this, arguments);
        if (window.state && state.mascaraAtiva) v = (Number(v) || 0) + DEF;
        return v;
      };
      calcularDefesa.__mskOuter = true;
    }
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
    if (s) s.style.display = 'inline-block';
    if (f) f.style.display = 'inline-block';
  }
  function showIdle() {
    var o = document.getElementById('msk-on');
    var s = document.getElementById('msk-stay');
    var f = document.getElementById('msk-off');
    if (o) o.style.display = 'inline-block';
    if (s) s.style.display = 'none';
    if (f) f.style.display = 'none';
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
    if (typeof scheduleSave === 'function') scheduleSave();
    else if (typeof saveState === 'function') saveState();
    if (typeof renderRecursos === 'function') {
      try { renderRecursos(); } catch (e) {}
    }
    forceUI();
  }

  function placeBox(box) {
    var targets = [
      document.querySelector('section.card.resources'),
      document.querySelector('.resources'),
      document.querySelector('#resources'),
      document.querySelector('section.card.attributes'),
      document.querySelector('.attributes'),
      document.querySelector('.attr-wheel'),
      document.querySelector('main'),
      document.querySelector('#app'),
      document.body
    ];
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      if (!t) continue;
      if (t === document.body || t.id === 'app' || t.tagName === 'MAIN') {
        t.insertBefore(box, t.firstChild);
        return;
      }
      if (t.parentNode) {
        if (t.classList && (t.classList.contains('resources') || t.id === 'resources')) {
          t.parentNode.insertBefore(box, t);
        } else {
          t.parentNode.insertBefore(box, t.nextSibling);
        }
        return;
      }
    }
    document.body.appendChild(box);
  }

  function bindOnce() {
    var btnOn = document.getElementById('msk-on');
    if (!btnOn) return;
    if (btnOn.dataset.mskBound === '1') {
      if (on()) { setBadge(true); showChoice(); } else { setBadge(false); showIdle(); }
      return;
    }

    function rebind(id, handler) {
      var btn = document.getElementById(id);
      if (!btn || !btn.parentNode) return;
      var neo = btn.cloneNode(true);
      neo.dataset.mskBound = '1';
      btn.parentNode.replaceChild(neo, btn);
      neo.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        handler();
      });
    }

    rebind('msk-on', function () {
      if (on()) { showChoice(); msg('Máscara já ativa.'); return; }
      var custo = 6;
      var san = state.sanAtual;
      if (san == null || san === undefined) {
        san = (typeof calcularRecursos === 'function' ? calcularRecursos().sanMax : 0) || 0;
      }
      san = Number(san) || 0;
      if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) return;
      state.sanAtual = Math.max(0, san - custo);

      state.mascaraAtiva = false;
      var r0 = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 0, peMax: 0 };
      var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : (r0.pvMax || 0);
      var curPe = state.peAtual != null ? Number(state.peAtual) : (r0.peMax || 0);

      state.mascaraAtiva = true;
      state.vidaAtual = curPv + PV;
      state.peAtual = curPe + PE;
      state.pvMaxOverride = (r0.pvMax || 0) + PV;
      state.peMaxOverride = (r0.peMax || 0) + PE;

      setBadge(true);
      showChoice();
      msg('ATIVA: +20 Vida · +10 Esforço · +10 Defesa · −6 Sanidade');
      persist();
    });

    rebind('msk-stay', function () {
      if (!on()) {
        var b = document.getElementById('msk-on');
        if (b) b.click();
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
      msg('Mantida: −2 Sanidade');
      persist();
    });

    rebind('msk-off', function () {
      if (!on()) { showIdle(); msg('Cancelado.'); return; }
      if (!confirm('Tirar a máscara? Perde +20 Vida / +10 Esforço / +10 Defesa.')) return;
      var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : 0;
      var curPe = state.peAtual != null ? Number(state.peAtual) : 0;
      if (state.pvMaxOverride != null && state.pvMaxOverride !== '') {
        state.pvMaxOverride = Math.max(1, Number(state.pvMaxOverride) - PV);
      }
      if (state.peMaxOverride != null && state.peMaxOverride !== '') {
        state.peMaxOverride = Math.max(1, Number(state.peMaxOverride) - PE);
      }
      state.mascaraAtiva = false;
      var npv = Math.max(0, curPv - PV);
      state.vidaAtual = npv;
      state.peAtual = Math.max(0, curPe - PE);
      setBadge(false);
      showIdle();
      if (npv === 0) {
        alert('0 Vida — morrendo.');
        msg('Removida. 0 Vida — morrendo.');
      } else {
        msg('Removida. Bônus perdidos.');
      }
      persist();
    });
  }

  function inject() {
    if (!detectMask()) return false;
    freeLimits();
    document.body.classList.add('ficha-mascaras-sheet');
    css();
    patch();

    if (!document.getElementById('msk-box')) {
      var box = document.createElement('div');
      box.id = 'msk-box';
      box.innerHTML =
        '<div class="msk-head">' +
        '<p class="msk-title">Forma Suprema (Máscara)</p>' +
        '<span class="msk-badge" id="msk-badge">INATIVA</span>' +
        '</div>' +
        '<p class="msk-help"><b>Colocar Máscara:</b> +20 Vida, +10 Esforço, +10 Defesa, −6 Sanidade.<br>' +
        '<b>Manter:</b> −2 Sanidade &nbsp;·&nbsp; <b>Tirar:</b> remove os bônus.</p>' +
        '<div class="msk-actions">' +
        '<button type="button" id="msk-on">Colocar Máscara</button>' +
        '<button type="button" id="msk-stay" style="display:none">Manter máscara (−2 Sanidade)</button>' +
        '<button type="button" id="msk-off" style="display:none">Tirar máscara</button>' +
        '</div>' +
        '<div id="msk-msg"></div>';
      placeBox(box);
      injected = true;
    }

    bindOnce();
    if (on()) {
      setBadge(true);
      showChoice();
    } else {
      setBadge(false);
      showIdle();
    }
    return true;
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (typeof state === 'undefined') return;
    if (state.mascaraAtiva == null) state.mascaraAtiva = false;
    freeLimits();
    var ok = inject();
    if (ok && document.getElementById('msk-box') && document.getElementById('msk-on')) {
      if (tries > 15) {
        clearInterval(timer);
        setInterval(function () {
          if (detectMask() && !document.getElementById('msk-box')) inject();
          else if (detectMask()) {
            freeLimits();
            bindOnce();
          }
        }, 2000);
      }
    }
  }, 250);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(inject, 300); });
  } else {
    setTimeout(inject, 300);
  }
})();
