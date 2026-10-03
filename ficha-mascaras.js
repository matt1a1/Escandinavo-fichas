/* ficha-mascaras.js — Forma Suprema (As Máscaras) */
(function () {
  var BONUS_PV = 20;
  var BONUS_PE = 10;
  var BONUS_DEF = 10;
  var CUSTO_FICAR_SAN = 2;

  function resolveTipoMascaras() {
    if (!window.state) return false;
    if (state.tipoFicha === 'mascaras') return true;
    try {
      var id = (typeof AGENTE_ID !== 'undefined' && AGENTE_ID) ||
        (new URLSearchParams(location.search).get('id')) || '';
      var reg = JSON.parse(localStorage.getItem('escandinavo-agentes-registro') || '[]');
      var entry = reg.find(function (a) { return a && a.id === id; });
      if (entry && entry.tipoFicha === 'mascaras') {
        state.tipoFicha = 'mascaras';
        return true;
      }
    } catch (e) {}
    try {
      if (new URLSearchParams(location.search).get('mascara') === '1') {
        state.tipoFicha = 'mascaras';
        return true;
      }
    } catch (e) {}
    return false;
  }

  function isMascaras() {
    return resolveTipoMascaras();
  }

  function ativa() {
    return !!(window.state && state.mascaraAtiva);
  }

  function ensureStyles() {
    if (document.getElementById('ficha-mascaras-style')) return;
    var s = document.createElement('style');
    s.id = 'ficha-mascaras-style';
    s.textContent = [
      'body.mascara-ativa{--accent:#ef4444;--accent-2:#b91c1c;}',
      'body.mascara-ativa .brand h1,body.mascara-ativa .brand{color:#fca5a5 !important;}',
      'body.mascara-ativa .panel,body.mascara-ativa .stat-box,body.mascara-ativa .card,body.mascara-ativa .hab-mine-card{border-color:rgba(239,68,68,.4) !important;}',
      'body.mascara-ativa .tab.active{border-bottom-color:#ef4444 !important;color:#fca5a5 !important;}',
      'body.mascara-ativa .attr-value{color:#fca5a5 !important;}',
      '#mascara-wrap{display:none;margin:8px 0;padding:12px;border-radius:10px;border:1px solid rgba(239,68,68,.55);background:rgba(127,29,29,.25);position:relative;z-index:20;}',
      '#mascara-wrap.mascara-visible{display:block !important;}',
      '#mascara-wrap .mascara-title{margin:0 0 8px;font-size:0.9rem;font-weight:700;color:#fca5a5;}',
      '#mascara-wrap .mascara-actions{display:flex;flex-wrap:wrap;gap:8px;}',
      '#btn-colocar-mascara,#btn-ficar-mascara,#btn-tirar-mascara{font-weight:700;cursor:pointer;padding:8px 14px;border-radius:8px;}',
      '#btn-colocar-mascara{background:linear-gradient(135deg,#7f1d1d,#b91c1c);border:1px solid #ef4444;color:#fff;}',
      '#btn-ficar-mascara{background:linear-gradient(135deg,#991b1b,#dc2626);border:1px solid #f87171;color:#fff;}',
      '#btn-tirar-mascara{background:#1c1917;border:1px solid #78716c;color:#e7e5e4;}',
      '#btn-ficar-mascara[hidden],#btn-tirar-mascara[hidden],#btn-colocar-mascara[hidden]{display:none !important;}',
      'body.mascara-ativa #mascara-wrap{border-color:rgba(239,68,68,.85);box-shadow:0 0 22px rgba(239,68,68,.3);}',
      '#mascara-status{font-size:0.8rem;margin-top:8px;color:#fecaca;}',
      'body.mascara-ativa #mascara-status{color:#fca5a5;font-weight:600;}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function placeWrap(wrap) {
    var resources = document.querySelector('section.card.resources') || document.querySelector('.resources');
    if (resources && resources.parentElement) {
      resources.parentElement.insertBefore(wrap, resources);
      return true;
    }
    var attrs = document.querySelector('section.card.attributes') || document.querySelector('.attr-wheel') || document.querySelector('.attributes');
    if (attrs && attrs.parentElement) {
      if (attrs.nextSibling) attrs.parentElement.insertBefore(wrap, attrs.nextSibling);
      else attrs.parentElement.appendChild(wrap);
      return true;
    }
    var left = document.querySelector('.left-panel') || document.querySelector('.center-panel');
    if (left) {
      left.appendChild(wrap);
      return true;
    }
    document.body.insertBefore(wrap, document.body.firstChild);
    return true;
  }

  function injectUI() {
    var existing = document.getElementById('mascara-wrap');
    if (existing) {
      var resources = document.querySelector('section.card.resources') || document.querySelector('.resources');
      if (resources && existing.nextElementSibling !== resources && existing.parentElement !== resources.parentElement) {
        try { resources.parentElement.insertBefore(existing, resources); } catch (e) {}
      }
      return true;
    }

    if (!document.body) return false;

    var wrap = document.createElement('div');
    wrap.id = 'mascara-wrap';
    wrap.innerHTML =
      '<p class="mascara-title">Forma Suprema — Máscara</p>' +
      '<div class="mascara-actions">' +
      '  <button type="button" id="btn-colocar-mascara">Colocar Máscara</button>' +
      '  <button type="button" id="btn-ficar-mascara" hidden>Ficar com a máscara (−2 SAN)</button>' +
      '  <button type="button" id="btn-tirar-mascara" hidden>Tirar máscara</button>' +
      '</div>' +
      '<div id="mascara-status"></div>';

    placeWrap(wrap);

    var btnColocar = document.getElementById('btn-colocar-mascara');
    var btnFicar = document.getElementById('btn-ficar-mascara');
    var btnTirar = document.getElementById('btn-tirar-mascara');

    if (btnColocar) btnColocar.addEventListener('click', function () {
      if (!isMascaras()) {
        if (window.state && confirm('Esta ficha não é do tipo Máscaras. Converter agora?')) {
          state.tipoFicha = 'mascaras';
          if (typeof scheduleSave === 'function') scheduleSave();
        } else return;
      }
      btnColocar.hidden = true;
      if (btnFicar) btnFicar.hidden = false;
      if (btnTirar) btnTirar.hidden = false;
      setStatus('Escolha: ficar com a máscara (−2 SAN) ou tirar.');
      updateUI();
    });

    if (btnFicar) btnFicar.addEventListener('click', function () {
      if (!isMascaras()) state.tipoFicha = 'mascaras';
      ativarOuManterMascara();
    });

    if (btnTirar) btnTirar.addEventListener('click', function () {
      if (!ativa()) {
        resetChoiceButtons();
        setStatus('Máscara não estava ativa.');
        return;
      }
      if (!confirm('Tirar a máscara? Perde +20 PV / +10 PE / +10 Defesa. Se tiver menos de 20 PV atuais, fica com 0 PV (morrendo).')) return;
      desativarMascara();
    });

    return true;
  }

  function resetChoiceButtons() {
    var colocar = document.getElementById('btn-colocar-mascara');
    var ficar = document.getElementById('btn-ficar-mascara');
    var tirar = document.getElementById('btn-tirar-mascara');
    if (!colocar) return;
    if (ativa()) {
      colocar.hidden = true;
      if (ficar) { ficar.hidden = false; ficar.textContent = 'Manter máscara (−2 SAN)'; }
      if (tirar) tirar.hidden = false;
    } else {
      colocar.hidden = false;
      if (ficar) { ficar.hidden = true; ficar.textContent = 'Ficar com a máscara (−2 SAN)'; }
      if (tirar) tirar.hidden = true;
    }
  }

  function setStatus(msg) {
    var el = document.getElementById('mascara-status');
    if (el) el.textContent = msg || '';
  }

  function updateUI() {
    var mask = isMascaras();
    document.body.classList.toggle('ficha-mascaras', mask);
    document.body.classList.toggle('mascara-ativa', mask && ativa());

    var wrap = document.getElementById('mascara-wrap');
    if (wrap) {
      if (mask || ativa()) wrap.classList.add('mascara-visible');
      else wrap.classList.remove('mascara-visible');
    }

    resetChoiceButtons();
    if (mask && ativa()) setStatus('Forma Suprema ATIVA · +20 PV · +10 PE · +10 Defesa');
    else if (mask) setStatus('Máscara inativa. Clique em Colocar Máscara.');
  }

  function getSanAtual() {
    if (state.sanAtual != null) return Number(state.sanAtual);
    var r = typeof calcularRecursos === 'function' ? calcularRecursos() : { sanMax: 0 };
    return Number(r.sanMax) || 0;
  }

  function ativarOuManterMascara() {
    var san = getSanAtual();
    if (san < CUSTO_FICAR_SAN) {
      if (!confirm('Você tem menos de ' + CUSTO_FICAR_SAN + ' SAN. Continuar?')) return;
    }
    state.sanAtual = Math.max(0, san - CUSTO_FICAR_SAN);

    if (!ativa()) {
      state.mascaraAtiva = true;
      var r = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 1, peMax: 1 };
      var curPv = state.vidaAtual == null ? Math.max(1, (r.pvMax || 1) - BONUS_PV) : Number(state.vidaAtual);
      var curPe = state.peAtual == null ? Math.max(0, (r.peMax || 0) - BONUS_PE) : Number(state.peAtual);
      state.vidaAtual = Math.max(0, curPv) + BONUS_PV;
      state.peAtual = Math.max(0, curPe) + BONUS_PE;
      setStatus('Máscara colocada. −' + CUSTO_FICAR_SAN + ' SAN. +20 PV, +10 PE, +10 Defesa.');
    } else {
      setStatus('Permanece na Forma Suprema. −' + CUSTO_FICAR_SAN + ' SAN.');
    }
    persistAndRefresh();
  }

  function desativarMascara() {
    if (!ativa()) { resetChoiceButtons(); return; }
    var r = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 1, peMax: 1 };
    var curPv = state.vidaAtual == null ? r.pvMax : Number(state.vidaAtual);
    var curPe = state.peAtual == null ? r.peMax : Number(state.peAtual);
    state.mascaraAtiva = false;
    var novoPv = curPv - BONUS_PV;
    if (novoPv < 0) novoPv = 0;
    state.vidaAtual = novoPv;
    state.peAtual = Math.max(0, curPe - BONUS_PE);
    if (novoPv === 0) {
      alert('Ao tirar a máscara você ficou com 0 PV e está morrendo.');
      setStatus('Máscara removida. 0 PV — morrendo.');
    } else {
      setStatus('Máscara removida. Bônus perdidos.');
    }
    persistAndRefresh();
  }

  function persistAndRefresh() {
    if (typeof saveState === 'function') saveState();
    else if (typeof scheduleSave === 'function') scheduleSave();
    if (typeof renderRecursos === 'function') renderRecursos();
    if (typeof renderAll === 'function') renderAll();
    updateUI();
  }

  function patchCalcularRecursos() {
    if (typeof calcularRecursos !== 'function' || calcularRecursos.__mascaraPatched) return;
    var orig = calcularRecursos;
    window.calcularRecursos = function () {
      var r = orig.apply(this, arguments);
      if (ativa()) {
        r.pvMax = Math.max(1, (r.pvMax || 1) + BONUS_PV);
        r.peMax = Math.max(1, (r.peMax || 1) + BONUS_PE);
      }
      return r;
    };
    window.calcularRecursos.__mascaraPatched = true;
  }

  function patchCalcularDefesa() {
    if (typeof calcularDefesa !== 'function' || calcularDefesa.__mascaraPatched) return;
    var orig = calcularDefesa;
    window.calcularDefesa = function () {
      var def = orig.apply(this, arguments);
      if (ativa()) def += BONUS_DEF;
      return def;
    };
    window.calcularDefesa.__mascaraPatched = true;
  }

  function install() {
    if (typeof state === 'undefined') return false;
    if (state.mascaraAtiva == null) state.mascaraAtiva = false;
    resolveTipoMascaras();
    ensureStyles();
    injectUI();
    patchCalcularRecursos();
    patchCalcularDefesa();
    updateUI();
    return !!(document.getElementById('mascara-wrap'));
  }

  window.ativarMascara = function () { if (!ativa()) ativarOuManterMascara(); };
  window.desativarMascara = desativarMascara;

  var n = 0;
  var t = setInterval(function () {
    n++;
    var ok = install();
    if ((ok && n > 5) || n > 100) clearInterval(t);
  }, 150);
})();
