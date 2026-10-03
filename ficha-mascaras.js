/* ficha-mascaras.js — só tipoFicha=mascaras: sem limites + botão entre attrs e vida */
(function () {
  var PV = 20, PE = 10, DEF = 10, SAN_CUSTO = 2;

  function isMask() {
    return !!(window.state && state.tipoFicha === 'mascaras');
  }
  function on() {
    return !!(window.state && state.mascaraAtiva);
  }

  /* ---- sem limites (mesma lógica da custom) ---- */
  function unlockLimits() {
    if (!isMask()) return;
    window.isFichaCustom = function () {
      return !!(window.state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
    };
    if (typeof pontosDisponiveis === 'function') {
      var _p = pontosDisponiveis;
      window.pontosDisponiveis = function () { return isMask() ? 999 : _p(); };
    }
    if (typeof rankMaxNex === 'function') {
      var _r = rankMaxNex;
      window.rankMaxNex = function () { return isMask() ? 15 : _r(); };
    }
    if (typeof periciasMax === 'function') {
      var _m = periciasMax;
      window.periciasMax = function () { return isMask() ? 99 : _m(); };
    }
    if (typeof grauLimite === 'function') {
      var _g = grauLimite;
      window.grauLimite = function () { return isMask() ? 99 : _g(); };
    }
    if (typeof normalizarAtributosNex === 'function') {
      var _n = normalizarAtributosNex;
      window.normalizarAtributosNex = function () { if (!isMask()) _n(); };
    }
  }

  function css() {
    if (document.getElementById('msk-css')) return;
    var s = document.createElement('style');
    s.id = 'msk-css';
    s.textContent =
      '#msk-box{margin:8px 0;padding:10px;border:1px solid #ef4444;border-radius:8px;background:rgba(127,29,29,.25);}' +
      '#msk-box button{margin:4px 6px 4px 0;padding:8px 12px;font-weight:700;border-radius:6px;cursor:pointer;}' +
      '#msk-on{background:#b91c1c;color:#fff;border:1px solid #ef4444;}' +
      '#msk-stay{background:#dc2626;color:#fff;border:1px solid #f87171;}' +
      '#msk-off{background:#292524;color:#e7e5e4;border:1px solid #78716c;}' +
      '#msk-msg{font-size:12px;color:#fecaca;margin-top:6px;}' +
      'body.msk-red{--accent:#ef4444;}' +
      'body.msk-red .brand h1{color:#fca5a5!important;}';
    document.head.appendChild(s);
  }

  function ui() {
    if (!isMask()) {
      var old = document.getElementById('msk-box');
      if (old) old.remove();
      return;
    }
    if (document.getElementById('msk-box')) {
      paint();
      return;
    }
    var box = document.createElement('div');
    box.id = 'msk-box';
    box.innerHTML =
      '<button type="button" id="msk-on">Colocar Máscara</button>' +
      '<button type="button" id="msk-stay" style="display:none">Ficar com a máscara (−2 SAN)</button>' +
      '<button type="button" id="msk-off" style="display:none">Tirar máscara</button>' +
      '<div id="msk-msg"></div>';

    var res = document.querySelector('section.card.resources') || document.querySelector('.resources');
    if (res && res.parentNode) res.parentNode.insertBefore(box, res);
    else {
      var at = document.querySelector('section.card.attributes') || document.querySelector('.attributes');
      if (at && at.parentNode) at.parentNode.insertBefore(box, at.nextSibling);
      else document.body.prepend(box);
    }

    document.getElementById('msk-on').onclick = function () {
      document.getElementById('msk-on').style.display = 'none';
      document.getElementById('msk-stay').style.display = '';
      document.getElementById('msk-off').style.display = '';
      msg('Escolha: ficar (−2 SAN) ou tirar.');
    };
    document.getElementById('msk-stay').onclick = function () { stay(); };
    document.getElementById('msk-off').onclick = function () {
      if (!on()) { paint(); msg('Máscara não estava ativa.'); return; }
      if (!confirm('Tirar máscara? Perde +20 PV / +10 PE / +10 Defesa. Se PV < 20, fica 0 (morrendo).')) return;
      off();
    };
    paint();
  }

  function msg(t) {
    var e = document.getElementById('msk-msg');
    if (e) e.textContent = t || '';
  }

  function paint() {
    var a = on();
    document.body.classList.toggle('msk-red', a);
    var bOn = document.getElementById('msk-on');
    var bStay = document.getElementById('msk-stay');
    var bOff = document.getElementById('msk-off');
    if (!bOn) return;
    if (a) {
      bOn.style.display = 'none';
      bStay.style.display = '';
      bStay.textContent = 'Manter máscara (−2 SAN)';
      bOff.style.display = '';
      msg('ATIVA · +20 PV · +10 PE · +10 Defesa');
    } else {
      bOn.style.display = '';
      bStay.style.display = 'none';
      bStay.textContent = 'Ficar com a máscara (−2 SAN)';
      bOff.style.display = 'none';
      msg('Clique em Colocar Máscara.');
    }
  }

  function stay() {
    var san = state.sanAtual != null ? Number(state.sanAtual) : 0;
    state.sanAtual = Math.max(0, san - SAN_CUSTO);
    if (!on()) {
      state.mascaraAtiva = true;
      var r = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 1, peMax: 1 };
      var curPv = state.vidaAtual == null ? Math.max(1, (r.pvMax || 1) - PV) : Number(state.vidaAtual);
      var curPe = state.peAtual == null ? Math.max(0, (r.peMax || 0) - PE) : Number(state.peAtual);
      state.vidaAtual = curPv + PV;
      state.peAtual = curPe + PE;
      msg('Máscara ON. −2 SAN. +20 PV +10 PE +10 Defesa.');
    } else {
      msg('Mantida. −2 SAN.');
    }
    save();
  }

  function off() {
    var r = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 1, peMax: 1 };
    var curPv = state.vidaAtual == null ? r.pvMax : Number(state.vidaAtual);
    var curPe = state.peAtual == null ? r.peMax : Number(state.peAtual);
    state.mascaraAtiva = false;
    var npv = curPv - PV;
    if (npv < 0) npv = 0;
    state.vidaAtual = npv;
    state.peAtual = Math.max(0, curPe - PE);
    if (npv === 0) alert('0 PV — morrendo.');
    msg('Máscara OFF. Bônus removidos.');
    save();
  }

  function save() {
    if (typeof scheduleSave === 'function') scheduleSave();
    else if (typeof saveState === 'function') saveState();
    if (typeof renderRecursos === 'function') renderRecursos();
    paint();
  }

  function patch() {
    if (typeof calcularRecursos === 'function' && !calcularRecursos.__msk) {
      var o = calcularRecursos;
      window.calcularRecursos = function () {
        var r = o.apply(this, arguments);
        if (on()) { r.pvMax = (r.pvMax || 1) + PV; r.peMax = (r.peMax || 1) + PE; }
        return r;
      };
      window.calcularRecursos.__msk = true;
    }
    if (typeof calcularDefesa === 'function' && !calcularDefesa.__msk) {
      var d = calcularDefesa;
      window.calcularDefesa = function () {
        var v = d.apply(this, arguments);
        return on() ? v + DEF : v;
      };
      window.calcularDefesa.__msk = true;
    }
  }

  function tick() {
    if (typeof state === 'undefined') return false;
    if (state.mascaraAtiva == null) state.mascaraAtiva = false;
    css();
    unlockLimits();
    patch();
    ui();
    return isMask() ? !!document.getElementById('msk-box') : true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (tick() && n > 8) clearInterval(t);
    if (n > 80) clearInterval(t);
  }, 150);
})();
