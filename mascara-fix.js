/* mascara-fix.js — Ficha das Máscaras: sem limites + botão Forma Suprema */
(function () {
  var PV = 20, PE = 10, DEF = 10;

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
      '#msk-box{margin:10px 0 12px;padding:14px;border-radius:12px;',
      'border:1px solid rgba(239,68,68,.45);background:linear-gradient(180deg,rgba(127,29,29,.28),rgba(20,10,12,.55));',
      'box-shadow:0 8px 24px rgba(0,0,0,.25);}',
      '#msk-box .msk-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;}',
      '#msk-box .msk-title{margin:0;font-size:.92rem;font-weight:700;color:#fca5a5;}',
      '#msk-box .msk-badge{font-size:.68rem;font-weight:700;padding:3px 8px;border-radius:999px;',
      'border:1px solid rgba(239,68,68,.4);color:#fca5a5;background:rgba(239,68,68,.12);}',
      '#msk-box .msk-badge.on{background:rgba(239,68,68,.35);color:#fff;}',
      '#msk-box .msk-help{margin:0 0 10px;font-size:.78rem;color:#e7e5e4;line-height:1.4;}',
      '#msk-box .msk-actions{display:flex;flex-wrap:wrap;gap:8px;}',
      '#msk-on{background:linear-gradient(135deg,#9f1239,#e11d48);color:#fff;border:none;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer;}',
      '#msk-stay{background:linear-gradient(135deg,#b91c1c,#dc2626);color:#fff;border:none;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer;}',
      '#msk-off{background:#1c1917;color:#e7e5e4;border:1px solid #57534e;border-radius:8px;padding:10px 14px;font-weight:600;cursor:pointer;}',
      '#msk-msg{margin-top:8px;font-size:.75rem;color:#fecaca;min-height:1.1em;}',
      'body.msk-red{--accent:#ef4444;--accent-2:#b91c1c;}',
      'body.msk-red .tab.active{border-bottom-color:#ef4444 !important;color:#fca5a5 !important;}',
      'body.ficha-mascaras-sheet .res-max-edit{color:inherit !important;}'
    ].join('');
    document.head.appendChild(st);
  }

  function patch() {
    if (typeof calcularRecursos !== 'function') return;
    if (!calcularRecursos.__mskOuter) {
      var _cr = calcularRecursos;
      window.calcularRecursos = function () {
        var r = _cr.apply(this, arguments);
        if (window.state && state.mascaraAtiva) {
          r.pvMax = (r.pvMax || 0) + PV;
          r.peMax = (r.peMax || 0) + PE;
        }
        return r;
      };
      calcularRecursos.__mskOuter = true;
    }
    if (typeof calcularDefesa === 'function' && !calcularDefesa.__mskOuter) {
      var _cd = calcularDefesa;
      window.calcularDefesa = function () {
        var v = _cd.apply(this, arguments);
        if (window.state && state.mascaraAtiva) v += DEF;
        return v;
      };
      calcularDefesa.__mskOuter = true;
    }
  }

  function msg(t) { var e = document.getElementById('msk-msg'); if (e) e.textContent = t || ''; }
  function setBadge(a) {
    var b = document.getElementById('msk-badge');
    if (!b) return;
    if (a) { b.textContent = 'ATIVA'; b.classList.add('on'); document.body.classList.add('msk-red'); }
    else { b.textContent = 'INATIVA'; b.classList.remove('on'); document.body.classList.remove('msk-red'); }
  }
  function showChoice() {
    var o = document.getElementById('msk-on'), s = document.getElementById('msk-stay'), f = document.getElementById('msk-off');
    if (o) o.style.display = 'none';
    if (s) s.style.display = '';
    if (f) f.style.display = '';
  }
  function showIdle() {
    var o = document.getElementById('msk-on'), s = document.getElementById('msk-stay'), f = document.getElementById('msk-off');
    if (o) o.style.display = '';
    if (s) s.style.display = 'none';
    if (f) f.style.display = 'none';
  }

  function forceUI() {
    if (typeof calcularRecursos !== 'function') return;
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
        lastResourceMax.pv = r.pvMax;
        lastResourceMax.pe = r.peMax;
        lastResourceMax.san = r.sanMax;
      }
    } catch (e) {}
    if (typeof scheduleSave === 'function') scheduleSave();
    else if (typeof saveState === 'function') saveState();
    if (typeof renderRecursos === 'function') { try { renderRecursos(); } catch (e) {} }
    forceUI();
  }

  function bindButtons() {
    var btnOn = document.getElementById('msk-on');
    if (!btnOn || btnOn.dataset.mskBound === '1') {
      if (on()) { setBadge(true); showChoice(); } else { setBadge(false); showIdle(); }
      return;
    }

    function rebind(btn, handler) {
      if (!btn || !btn.parentNode) return null;
      var neo = btn.cloneNode(true);
      neo.dataset.mskBound = '1';
      btn.parentNode.replaceChild(neo, btn);
      neo.addEventListener('click', handler);
      return neo;
    }

    rebind(document.getElementById('msk-on'), function () {
      if (on()) { showChoice(); msg('Máscara já ativa.'); return; }
      var custo = 6;
      var san = state.sanAtual;
      if (san == null || san === undefined) {
        var rr = calcularRecursos();
        san = rr.sanMax || 0;
      }
      san = Number(san) || 0;
      if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) return;
      state.sanAtual = Math.max(0, san - custo);

      state.mascaraAtiva = false;
      var r0 = calcularRecursos();
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

    rebind(document.getElementById('msk-stay'), function () {
      if (!on()) {
        var b = document.getElementById('msk-on');
        if (b) b.click();
        return;
      }
      var custo = 2;
      var san = state.sanAtual;
      if (san == null || san === undefined) {
        var rr = calcularRecursos();
        san = rr.sanMax || 0;
      }
      san = Number(san) || 0;
      if (san < custo && !confirm('Sanidade insuficiente (' + san + '). Continuar?')) return;
      state.sanAtual = Math.max(0, san - custo);
      msg('Mantida: −2 Sanidade');
      persist();
    });

    rebind(document.getElementById('msk-off'), function () {
      if (!on()) { showIdle(); msg('Cancelado.'); return; }
      if (!confirm('Tirar a máscara? Perde +20 Vida / +10 Esforço / +10 Defesa. Se Vida < 20, fica 0 (morrendo).')) return;
      var curPv = state.vidaAtual != null ? Number(state.vidaAtual) : 0;
      var curPe = state.peAtual != null ? Number(state.peAtual) : 0;
      if (state.pvMaxOverride != null && state.pvMaxOverride !== '') {
        state.pvMaxOverride = Math.max(1, Number(state.pvMaxOverride) - PV);
      }
      if (state.peMaxOverride != null && state.peMaxOverride !== '') {
        state.peMaxOverride = Math.max(1, Number(state.peMaxOverride) - PE);
      }
      state.mascaraAtiva = false;
      var npv = curPv - PV;
      if (npv < 0) npv = 0;
      state.vidaAtual = npv;
      state.peAtual = Math.max(0, curPe - PE);
      setBadge(false);
      showIdle();
      if (npv === 0) { alert('0 Vida — morrendo.'); msg('Removida. 0 Vida — morrendo.'); }
      else msg('Removida. Bônus perdidos.');
      persist();
    });
  }

  function ui() {
    if (!isMask()) return;
    freeLimits();
    document.body.classList.add('ficha-mascaras-sheet');
    css();
    patch();

    if (!document.getElementById('msk-box')) {
      var box = document.createElement('div');
      box.id = 'msk-box';
      box.innerHTML =
        '<div class="msk-head"><p class="msk-title">Forma Suprema</p><span class="msk-badge" id="msk-badge">INATIVA</span></div>' +
        '<p class="msk-help">Clique em <b>Colocar Máscara</b>: +20 Vida, +10 Esforço, +10 Defesa, −6 Sanidade.<br>' +
        'Depois: <b>Manter</b> (−2 SAN) ou <b>Tirar</b> (remove bônus).</p>' +
        '<div class="msk-actions">' +
        '<button type="button" id="msk-on">Colocar Máscara</button>' +
        '<button type="button" id="msk-stay" style="display:none">Manter máscara (−2 Sanidade)</button>' +
        '<button type="button" id="msk-off" style="display:none">Tirar máscara</button>' +
        '</div><div id="msk-msg"></div>';
      var res = document.querySelector('section.card.resources') || document.querySelector('.resources');
      if (res && res.parentNode) res.parentNode.insertBefore(box, res);
      else {
        var at = document.querySelector('section.card.attributes') || document.querySelector('.attributes');
        if (at && at.parentNode) at.parentNode.insertBefore(box, at.nextSibling);
        else document.body.insertBefore(box, document.body.firstChild);
      }
    }
    bindButtons();
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (typeof state === 'undefined') return;
    if (state.mascaraAtiva == null) state.mascaraAtiva = false;
    freeLimits();
    if (isMask()) ui();
    if (n > 50) clearInterval(t);
  }, 200);
})();
