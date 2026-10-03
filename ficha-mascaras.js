/* ficha-mascaras.js — Forma Suprema ("As Máscaras") da Ficha das Máscaras
 * Regras (Hexatombe):
 * - Ativar: ação de movimento + 6 SAN (+2 SAN por rodada extra)
 * - Benefícios: +20 PV atuais/máx, +10 PE atuais/máx, +10 Defesa
 * - Também: +5 testes, +5 DT, +2 dados de dano (marcados na UI; mesa aplica)
 * - Desativar: ação livre; perde benefícios; se PV atuais < 20 → 0 PV (morrendo)
 */
(function () {
  var BONUS_PV = 20;
  var BONUS_PE = 10;
  var BONUS_DEF = 10;
  var CUSTO_SAN = 6;

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
      'body.mascara-ativa .panel,body.mascara-ativa .stat-box,body.mascara-ativa .card{border-color:rgba(239,68,68,.35) !important;}',
      'body.mascara-ativa .res-bar,body.mascara-ativa .vida-bar{filter:saturate(1.2);}',
      'body.mascara-ativa #btn-mascara.mascara-on{background:linear-gradient(135deg,#7f1d1d,#b91c1c);border-color:#ef4444;color:#fff;box-shadow:0 0 18px rgba(239,68,68,.35);}',
      '#btn-mascara{display:none;margin-left:10px;font-weight:700;letter-spacing:.02em;}',
      'body.ficha-mascaras #btn-mascara{display:inline-flex;align-items:center;gap:6px;}',
      '.mascara-banner{display:none;margin:8px 0 0;padding:10px 12px;border-radius:8px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.4);color:#fecaca;font-size:0.8rem;line-height:1.45;}',
      'body.mascara-ativa .mascara-banner{display:block;}',
      '.mascara-banner strong{color:#fca5a5;}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function injectButton() {
    if (document.getElementById('btn-mascara')) return;
    var brand = document.querySelector('.brand h1') || document.querySelector('.brand');
    if (!brand) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btn-mascara';
    btn.className = 'btn secondary';
    btn.textContent = 'Colocar Máscara';
    if (brand.parentElement) brand.parentElement.insertBefore(btn, brand.nextSibling);
    else brand.appendChild(btn);
    btn.addEventListener('click', function () {
      if (!isMascaras()) return;
      if (ativa()) desativarMascara();
      else ativarMascara();
    });
  }

  function injectBanner() {
    if (document.getElementById('mascara-banner')) return;
    var b = document.createElement('div');
    b.id = 'mascara-banner';
    b.className = 'mascara-banner';
    b.innerHTML =
      '<strong>Forma Suprema ativa.</strong> ' +
      '+20 PV · +10 PE · +10 Defesa · +5 em testes · +5 na DT · +2 dados no dano. ' +
      'Custo: 6 SAN na ativação (+2 SAN por rodada extra). ' +
      'Desativar é ação livre — se tiver menos de 20 PV atuais, fica com 0 PV (morrendo).';
    var anchor = document.getElementById('vida-max') || document.getElementById('attr-points');
    if (anchor) {
      var panel = anchor.closest('.panel') || anchor.closest('section') || anchor.parentElement;
      if (panel && panel.parentElement) panel.parentElement.insertBefore(b, panel);
      else document.body.insertBefore(b, document.body.firstChild);
    } else {
      document.body.insertBefore(b, document.body.firstChild);
    }
  }

  function updateUI() {
    var on = isMascaras() && ativa();
    document.body.classList.toggle('ficha-mascaras', isMascaras());
    document.body.classList.toggle('mascara-ativa', on);

    var btn = document.getElementById('btn-mascara');
    if (btn) {
      btn.style.display = isMascaras() ? '' : 'none';
      btn.textContent = on ? 'Remover Máscara' : 'Colocar Máscara';
      btn.classList.toggle('mascara-on', on);
      btn.title = on
        ? 'Desativa a Forma Suprema (ação livre). Perde +20 PV / +10 PE / +10 Defesa.'
        : 'Ativa a Forma Suprema: ação de movimento + 6 SAN. +20 PV, +10 PE, +10 Defesa.';
    }

    var badge = document.getElementById('ficha-tipo-badge');
    if (badge && state.tipoFicha === 'mascaras') {
      badge.style.display = '';
      badge.className = 'ficha-tipo-badge tipo-mascaras';
      badge.textContent = on ? 'Máscaras · ATIVA' : 'Máscaras';
    }
  }

  function ativarMascara() {
    if (!isMascaras() || ativa()) return;

    var sanAtual = state.sanAtual;
    if (sanAtual == null) {
      var r0 = typeof calcularRecursos === 'function' ? calcularRecursos() : { sanMax: 1 };
      sanAtual = r0.sanMax;
    }
    if (sanAtual < CUSTO_SAN) {
      if (!confirm('Você tem menos de ' + CUSTO_SAN + ' SAN. Ativar a máscara mesmo assim? (custa ' + CUSTO_SAN + ' SAN)')) {
        return;
      }
    }

    state.mascaraAtiva = true;
    state.sanAtual = Math.max(0, (sanAtual || 0) - CUSTO_SAN);

    var r = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 1, peMax: 1 };
    var basePvMax = Math.max(1, (r.pvMax || 1) - BONUS_PV);
    var basePeMax = Math.max(1, (r.peMax || 1) - BONUS_PE);
    var curPv = state.vidaAtual == null ? basePvMax : Number(state.vidaAtual);
    var curPe = state.peAtual == null ? basePeMax : Number(state.peAtual);
    state.vidaAtual = curPv + BONUS_PV;
    state.peAtual = curPe + BONUS_PE;

    if (typeof saveState === 'function') saveState();
    else if (typeof scheduleSave === 'function') scheduleSave();
    if (typeof renderRecursos === 'function') renderRecursos();
    if (typeof renderAll === 'function') renderAll();
    updateUI();
  }

  function desativarMascara() {
    if (!isMascaras() || !ativa()) return;

    var r = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 1 };
    var curPv = state.vidaAtual == null ? r.pvMax : Number(state.vidaAtual);

    state.mascaraAtiva = false;

    var novoPv = curPv - BONUS_PV;
    if (novoPv < 0) novoPv = 0;
    state.vidaAtual = novoPv;

    var curPe = state.peAtual == null ? 0 : Number(state.peAtual);
    state.peAtual = Math.max(0, curPe - BONUS_PE);

    if (novoPv === 0) {
      alert('Ao remover a máscara você ficou com 0 PV e está morrendo (regra da Forma Suprema).');
    }

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
    injectButton();
    injectBanner();
    patchCalcularRecursos();
    patchCalcularDefesa();
    patchRenderRecursos();
    updateUI();
    if (typeof renderRecursos === 'function') renderRecursos();
    return true;
  }

  window.ativarMascara = ativarMascara;
  window.desativarMascara = desativarMascara;

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (install() || n > 80) clearInterval(t);
  }, 120);
})();
