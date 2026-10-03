/* ficha-mascaras.js — Forma Suprema completa */
(function () {
  var PV = 20, PE = 10, DEF = 10;

  function isMask() {
    if (!window.state) return false;
    if (state.tipoFicha === 'mascaras') return true;
    try {
      var id = (typeof AGENTE_ID !== 'undefined' && AGENTE_ID) || new URLSearchParams(location.search).get('id') || '';
      var reg = JSON.parse(localStorage.getItem('escandinavo-agentes-registro') || '[]');
      for (var i = 0; i < reg.length; i++) {
        if (reg[i] && reg[i].id === id && reg[i].tipoFicha === 'mascaras') {
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
      '#msk-box{margin:10px 0 12px;padding:14px;border-radius:12px;border:1px solid rgba(239,68,68,.45);background:linear-gradient(180deg,rgba(127,29,29,.28),rgba(20,10,12,.55));box-shadow:0 8px 24px rgba(0,0,0,.25);}',
      '#msk-box .msk-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;}',
      '#msk-box .msk-title{margin:0;font-size:.92rem;font-weight:700;color:#fca5a5;}',
      '#msk-box .msk-badge{font-size:.68rem;font-weight:700;padding:3px 8px;border-radius:999px;background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.4);color:#fecaca;}',
      '#msk-box .msk-badge.on{background:rgba(239,68,68,.4);color:#fff;border-color:#ef4444;}',
      '#msk-box .msk-help{margin:0 0 10px;font-size:.72rem;line-height:1.4;color:#e7b0b0;}',
      '#msk-box .msk-actions{display:flex;flex-wrap:wrap;gap:8px;}',
      '#msk-box button{border:none;border-radius:8px;padding:9px 14px;font-weight:700;font-size:.82rem;cursor:pointer;}',
      '#msk-on{background:linear-gradient(135deg,#9f1239,#e11d48);color:#fff;}',
      '#msk-stay{background:linear-gradient(135deg,#b91c1c,#dc2626);color:#fff;}',
      '#msk-off{background:#1c1917;color:#e7e5e4;border:1px solid #57534e !important;}',
      '#msk-msg{margin-top:8px;font-size:.75rem;color:#fecaca;min-height:1.1em;}',
      'body.msk-red{--accent:#ef4444;--accent-2:#b91c1c;}',
      'body.msk-red .brand h1{color:#fca5a5 !important;}',
      'body.msk-red .tab.active{border-bottom-color:#ef4444 !important;color:#fca5a5 !important;}',
      'body.msk-red .hab-subtab.active{background:linear-gradient(135deg,#9f1239,#e11d48) !important;color:#fff !important;}',
      'body.msk-red .hab-class-tab.active{color:#fca5a5 !important;border-bottom:2px solid #ef4444 !important;}',
      'body.msk-red .btn-add-hab,body.msk-red .hab-chip.active{background:linear-gradient(135deg,#9f1239,#e11d48) !important;border-color:#ef4444 !important;color:#fff !important;}',
      'body.msk-red .hab-chip{border-color:rgba(239,68,68,.45) !important;}',
      'body.msk-red .hab-nex,body.msk-red .hab-pe{background:rgba(239,68,68,.22) !important;color:#fecaca !important;}'
    ].join('');
    document.head.appendChild(st);
  }

  function patch() {
    if (typeof calcularRecursos === 'function' && !calcularRecursos.__mskOuter) {
      var inner = calcularRecursos;
      window.calcularRecursos = function () {
        var r = inner.apply(this, arguments);
        if (on()) { r.pvMax = (Number(r.pvMax) || 1) + PV; r.peMax = (Number(r.peMax) || 1) + PE; }
        return r;
      };
      window.calcularRecursos.__mskOuter = true;
    }
    if (typeof calcularDefesa === 'function' && !calcularDefesa.__mskOuter) {
      var d = calcularDefesa;
      window.calcularDefesa = function () {
        var v = Number(d.apply(this, arguments)) || 0;
        return on() ? v + DEF : v;
      };
      window.calcularDefesa.__mskOuter = true;
    }
    window.isFichaCustom = function () {
      return !!(window.state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
    };
  }

  function ui() {
    if (!isMask()) {
      var old = document.getElementById('msk-box');
      if (old) old.remove();
      return;
    }
    document.body.classList.add('ficha-mascaras-sheet');
    if (document.getElementById('msk-box')) {
      var badge = document.querySelector('#msk-badge');
      if (badge) {
        if (on()) { badge.textContent = 'ATIVA'; badge.classList.add('on'); document.body.classList.add('msk-red'); }
        else { badge.textContent = 'INATIVA'; badge.classList.remove('on'); document.body.classList.remove('msk-red'); }
      }
      return;
    }

    var box = document.createElement('div');
    box.id = 'msk-box';
    box.innerHTML =
      '<div class="msk-head"><p class="msk-title">Forma Suprema</p><span class="msk-badge" id="msk-badge">INATIVA</span></div>' +
      '<p class="msk-help">Clique em <b>Colocar Máscara</b>: +20 Vida, +10 Esforço, +10 Defesa, −6 Sanidade.<br>' +
      '<b>Manter</b>: −2 Sanidade/rodada · <b>Tirar</b>: remove os bônus.</p>' +
      '<div class="msk-actions">' +
      '<button type="button" id="msk-on">Colocar Máscara</button>' +
      '<button type="button" id="msk-stay" style="display:none">Manter máscara (−2 Sanidade)</button>' +
      '<button type="button" id="msk-off" style="display:none">Tirar máscara</button>' +
      '</div><div id="msk-msg"></div>';

    var res = document.querySelector('section.card.resources') || document.querySelector('.resources');
    if (res && res.parentNode) res.parentNode.insertBefore(box, res);
    else document.body.insertBefore(box, document.body.firstChild);

    function msg(t) { var e = document.getElementById('msk-msg'); if (e) e.textContent = t || ''; }
    function setBadge(a) {
      var b = document.getElementById('msk-badge');
      if (!b) return;
      if (a) { b.textContent = 'ATIVA'; b.classList.add('on'); document.body.classList.add('msk-red'); }
      else { b.textContent = 'INATIVA'; b.classList.remove('on'); document.body.classList.remove('msk-red'); }
    }
    function showChoice() {
      document.getElementById('msk-on').style.display = 'none';
      document.getElementById('msk-stay').style.display = '';
      document.getElementById('msk-off').style.display = '';
    }
    function showIdle() {
      document.getElementById('msk-on').style.display = '';
      document.getElementById('msk-stay').style.display = 'none';
      document.getElementById('msk-off').style.display = 'none';
    }
    function forceUI() {
      patch();
      var r = calcularRecursos();
      var def = typeof calcularDefesa === 'function' ? calcularDefesa() : 15;
      function set(id, v) { var el = document.getElementById(id); if (el) el.textContent = String(v); }
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
          lastResourceMax.pv = r.pvMax; lastResourceMax.pe = r.peMax; lastResourceMax.san = r.sanMax;
        }
      } catch (e) {}
      if (typeof scheduleSave === 'function') scheduleSave();
      if (typeof renderRecursos === 'function') try { renderRecursos(); } catch (e) {}
      if (typeof renderCombate === 'function') try { renderCombate(); } catch (e) {}
      forceUI();
    }

    document.getElementById('msk-on').onclick = function () {
      if (on()) { showChoice(); return; }
      var custo = 6;
      var san = state.sanAtual != null ? Number(state.sanAtual) : (calcularRecursos().sanMax || 0);
      if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) return;
      state.sanAtual = Math.max(0, san - custo);
      state.mascaraAtiva = false;
      patch();
      var r0 = calcularRecursos();
      var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : (r0.pvMax || 0);
      var curPe = state.peAtual != null ? Number(state.peAtual) : (r0.peMax || 0);
      state.mascaraAtiva = true;
      state.vidaAtual = curPv + PV;
      state.peAtual = curPe + PE;
      state.pvMaxOverride = (r0.pvMax || 0) + PV;
      state.peMaxOverride = (r0.peMax || 0) + PE;
      setBadge(true); showChoice();
      msg('ATIVA: +20 Vida · +10 Esforço · +10 Defesa · −6 Sanidade');
      persist();
    };

    document.getElementById('msk-stay').onclick = function () {
      if (!on()) { document.getElementById('msk-on').click(); return; }
      var custo = 2;
      var san = state.sanAtual != null ? Number(state.sanAtual) : 0;
      if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) return;
      state.sanAtual = Math.max(0, san - custo);
      msg('Mantida: −2 Sanidade');
      persist();
    };

    document.getElementById('msk-off').onclick = function () {
      if (!on()) { showIdle(); return; }
      if (!confirm('Tirar a máscara? Perde +20 Vida / +10 Esforço / +10 Defesa. Se Vida < 20, fica 0 (morrendo).')) return;
      var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : 0;
      var curPe = state.peAtual != null ? Number(state.peAtual) : 0;
      if (state.pvMaxOverride != null) state.pvMaxOverride = Math.max(1, Number(state.pvMaxOverride) - PV);
      if (state.peMaxOverride != null) state.peMaxOverride = Math.max(1, Number(state.peMaxOverride) - PE);
      state.mascaraAtiva = false;
      var npv = Math.max(0, curPv - PV);
      state.vidaAtual = npv;
      state.peAtual = Math.max(0, curPe - PE);
      setBadge(false); showIdle();
      if (npv === 0) { alert('0 Vida — morrendo.'); msg('Removida. 0 Vida — morrendo.'); }
      else msg('Removida. Bônus perdidos.');
      persist();
    };

    if (on()) { setBadge(true); showChoice(); msg('ATIVA · +20 Vida · +10 Esforço · +10 Defesa'); }
    else { setBadge(false); showIdle(); }
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (typeof state === 'undefined') return;
    if (state.mascaraAtiva == null) state.mascaraAtiva = false;
    css(); patch(); ui();
    if (n > 40) clearInterval(t);
  }, 200);
})();
