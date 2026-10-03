/* ficha-mascaras.js — Forma Suprema (As Máscaras)
 *
 * Fluxo:
 * 1) Botão "Colocar Máscara" (só em tipoFicha === 'mascaras')
 * 2) Abre painel com:
 *    - "Ficar com a máscara" → ativa forma (custa 2 SAN) + tema vermelho + bônus
 *    - "Tirar máscara" → remove bônus (se PV atuais < 20 após perda → 0 PV, morrendo)
 *
 * Bônus ativos:
 *  +20 PV atuais/máx · +10 PE atuais/máx · +10 Defesa
 *  (mesa aplica: +5 testes, +5 DT, +2 dados de dano, rituais avançados sem PE)
 */
(function () {
  var BONUS_PV = 20;
  var BONUS_PE = 10;
  var BONUS_DEF = 10;
  var CUSTO_FICAR_SAN = 2;

  function isMascaras() {
    return !!(window.state && state.tipoFicha === 'mascaras');
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
      '#mascara-wrap{display:none;margin:8px 0 12px;padding:12px;border-radius:10px;border:1px solid rgba(239,68,68,.35);background:rgba(127,29,29,.15);}',
      'body.ficha-mascaras #mascara-wrap{display:block;}',
      '#mascara-wrap .mascara-title{margin:0 0 8px;font-size:0.95rem;font-weight:700;color:#fca5a5;}',
      '#mascara-wrap .mascara-help{margin:0 0 10px;font-size:0.78rem;color:#fecaca;line-height:1.4;opacity:.9;}',
      '#mascara-wrap .mascara-actions{display:flex;flex-wrap:wrap;gap:8px;}',
      '#btn-colocar-mascara,#btn-ficar-mascara,#btn-tirar-mascara{font-weight:700;}',
      '#btn-colocar-mascara{background:linear-gradient(135deg,#7f1d1d,#b91c1c);border:1px solid #ef4444;color:#fff;}',
      '#btn-colocar-mascara:hover{filter:brightness(1.1);}',
      '#btn-ficar-mascara{background:linear-gradient(135deg,#991b1b,#dc2626);border:1px solid #f87171;color:#fff;}',
      '#btn-tirar-mascara{background:#1c1917;border:1px solid #78716c;color:#e7e5e4;}',
      '#btn-ficar-mascara[hidden],#btn-tirar-mascara[hidden],#btn-colocar-mascara[hidden]{display:none !important;}',
      'body.mascara-ativa #mascara-wrap{border-color:rgba(239,68,68,.7);box-shadow:0 0 20px rgba(239,68,68,.2);}',
      '#mascara-status{font-size:0.8rem;margin-top:8px;color:#fecaca;}',
      'body.mascara-ativa #mascara-status{color:#fca5a5;font-weight:600;}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function injectUI() {
    if (document.getElementById('mascara-wrap')) return;

    var wrap = document.createElement('div');
    wrap.id = 'mascara-wrap';
    wrap.innerHTML =
      '<p class="mascara-title">Forma Suprema — Máscara</p>' +
      '<p class="mascara-help">' +
      'A máscara representa a desumanização (não precisa ser literal). ' +
      'Ao ativar: <strong>+20 PV</strong>, <strong>+10 PE</strong>, <strong>+10 Defesa</strong> ' +
      '(+5 testes, +5 DT e +2 dados de dano — a mesa aplica). ' +
      'Custo ao ficar: <strong>2 SAN</strong>. Desativar é ação livre; se ficar com menos de 20 PV atuais ao tirar, vai a 0 PV (morrendo).' +
      '</p>' +
      '<div class="mascara-actions">' +
      '  <button type="button" id="btn-colocar-mascara" class="btn">Colocar Máscara</button>' +
      '  <button type="button" id="btn-ficar-mascara" class="btn" hidden>Ficar com a máscara (−2 SAN)</button>' +
      '  <button type="button" id="btn-tirar-mascara" class="btn" hidden>Tirar máscara</button>' +
      '</div>' +
      '<div id="mascara-status"></div>';

    var anchor =
      document.querySelector('.resources') ||
      document.querySelector('.stat-row') ||
      document.getElementById('vida-max') ||
      document.querySelector('.brand') ||
      document.querySelector('.left-panel') ||
      document.body;

    if (anchor.id === 'vida-max' || (anchor.classList && anchor.classList.contains('stat-row'))) {
      var panel = anchor.closest('.panel') || anchor.closest('section') || anchor.parentElement;
      if (panel && panel.parentElement) panel.parentElement.insertBefore(wrap, panel.nextSibling);
      else if (panel) panel.appendChild(wrap);
      else document.body.insertBefore(wrap, document.body.firstChild);
    } else if (anchor.parentElement) {
      anchor.parentElement.insertBefore(wrap, anchor.nextSibling);
    } else {
      document.body.insertBefore(wrap, document.body.firstChild);
    }

    document.getElementById('btn-colocar-mascara').addEventListener('click', function () {
      if (!isMascaras()) return;
      document.getElementById('btn-colocar-mascara').hidden = true;
      document.getElementById('btn-ficar-mascara').hidden = false;
      document.getElementById('btn-tirar-mascara').hidden = false;
      setStatus('Escolha: ficar com a máscara (−2 SAN) ou tirar (se já estiver ativa).');
    });

    document.getElementById('btn-ficar-mascara').addEventListener('click', function () {
      if (!isMascaras()) return;
      ativarOuManterMascara();
    });

    document.getElementById('btn-tirar-mascara').addEventListener('click', function () {
      if (!isMascaras()) return;
      if (!ativa()) {
        resetChoiceButtons();
        setStatus('Máscara não estava ativa.');
        return;
      }
      if (!confirm('Tirar a máscara? Você perde +20 PV / +10 PE / +10 Defesa. Se tiver menos de 20 PV atuais, fica com 0 PV (morrendo).')) {
        return;
      }
      desativarMascara();
    });
  }

  function resetChoiceButtons() {
    var colocar = document.getElementById('btn-colocar-mascara');
    var ficar = document.getElementById('btn-ficar-mascara');
    var tirar = document.getElementById('btn-tirar-mascara');
    if (!colocar) return;
    if (ativa()) {
      colocar.hidden = true;
      ficar.hidden = false;
      ficar.textContent = 'Manter máscara (−2 SAN)';
      tirar.hidden = false;
    } else {
      colocar.hidden = false;
      ficar.hidden = true;
      ficar.textContent = 'Ficar com a máscara (−2 SAN)';
      tirar.hidden = true;
    }
  }

  function setStatus(msg) {
    var el = document.getElementById('mascara-status');
    if (el) el.textContent = msg || '';
  }

  function updateUI() {
    document.body.classList.toggle('ficha-mascaras', isMascaras());
    document.body.classList.toggle('mascara-ativa', isMascaras() && ativa());
    resetChoiceButtons();
    if (isMascaras() && ativa()) {
      setStatus('Forma Suprema ATIVA · +20 PV · +10 PE · +10 Defesa · tema vermelho');
    } else if (isMascaras()) {
      setStatus('Máscara inativa. Clique em Colocar Máscara.');
    }
  }

  function getSanAtual() {
    if (state.sanAtual != null) return Number(state.sanAtual);
    var r = typeof calcularRecursos === 'function' ? calcularRecursos() : { sanMax: 0 };
    return Number(r.sanMax) || 0;
  }

  function ativarOuManterMascara() {
    var san = getSanAtual();
    if (san < CUSTO_FICAR_SAN) {
      if (!confirm('Você tem menos de ' + CUSTO_FICAR_SAN + ' SAN. Continuar mesmo assim? (SAN pode ir a 0)')) return;
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
      setStatus('Você permanece na Forma Suprema. −' + CUSTO_FICAR_SAN + ' SAN (custo da rodada).');
    }

    persistAndRefresh();
  }

  function desativarMascara() {
    if (!ativa()) {
      resetChoiceButtons();
      return;
    }

    var r = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 1, peMax: 1 };
    var curPv = state.vidaAtual == null ? r.pvMax : Number(state.vidaAtual);
    var curPe = state.peAtual == null ? r.peMax : Number(state.peAtual);

    state.mascaraAtiva = false;

    var novoPv = curPv - BONUS_PV;
    if (novoPv < 0) novoPv = 0;
    state.vidaAtual = novoPv;
    state.peAtual = Math.max(0, curPe - BONUS_PE);

    if (novoPv === 0) {
      alert('Ao tirar a máscara você ficou com 0 PV e está morrendo (regra da Forma Suprema).');
      setStatus('Máscara removida. 0 PV — personagem morrendo.');
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

  function patchRenderRecursos() {
    if (typeof renderRecursos !== 'function' || renderRecursos.__mascaraPatched) return;
    var orig = renderRecursos;
    window.renderRecursos = function () {
      var out = orig.apply(this, arguments);
      updateUI();
      return out;
    };
    window.renderRecursos.__mascaraPatched = true;
  }

  function install() {
    if (typeof state === 'undefined') return false;
    if (state.mascaraAtiva == null) state.mascaraAtiva = false;
    ensureStyles();
    injectUI();
    patchCalcularRecursos();
    patchCalcularDefesa();
    patchRenderRecursos();
    updateUI();
    if (typeof renderRecursos === 'function') renderRecursos();
    return true;
  }

  window.ativarMascara = function () {
    if (!ativa()) ativarOuManterMascara();
  };
  window.desativarMascara = desativarMascara;

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (install() || n > 80) clearInterval(t);
  }, 120);
})();
