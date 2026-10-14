/* mascara-btn-fix.js — botões da máscara estáveis + modal custom (sem re-click) */
(function () {
  if (window.__mskBtnFix) return;
  window.__mskBtnFix = true;

  var PV = 20, PE = 10;
  var busy = false;

  function S() {
    return (typeof state !== 'undefined') ? state : null;
  }

  function getSan() {
    var st = S();
    if (!st) return 0;
    if (st.sanAtual != null) return Number(st.sanAtual) || 0;
    if (typeof calcularRecursos === 'function') return Number(calcularRecursos().sanMax) || 0;
    return 0;
  }

  function isOn() {
    var st = S();
    return !!(st && st.mascaraAtiva);
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
  function setMsg(t) {
    var e = document.getElementById('msk-msg');
    if (e) e.textContent = t || '';
  }
  function syncButtons() {
    if (isOn()) {
      hideEl('msk-on'); showEl('msk-stay'); showEl('msk-off'); setBadge(true);
    } else {
      showEl('msk-on'); hideEl('msk-stay'); hideEl('msk-off'); setBadge(false);
    }
  }
  function persist() {
    try {
      if (typeof lastResourceMax !== 'undefined' && lastResourceMax && typeof calcularRecursos === 'function') {
        var r = calcularRecursos();
        lastResourceMax.pv = r.pvMax;
        lastResourceMax.pe = r.peMax;
        lastResourceMax.san = r.sanMax;
      }
    } catch (e) {}
    if (typeof saveState === 'function') saveState();
    else if (typeof scheduleSave === 'function') scheduleSave();
    if (typeof renderRecursos === 'function') { try { renderRecursos(); } catch (e) {} }
    if (typeof renderCombate === 'function') { try { renderCombate(); } catch (e) {} }
    syncButtons();
  }

  function ask(msg, opts) {
    if (typeof uiConfirm === 'function') return uiConfirm(msg, opts || {});
    return Promise.resolve(window.confirm(msg));
  }
  function alertUi(msg, opts) {
    if (typeof uiAlert === 'function') return uiAlert(msg, opts || {});
    window.alert(msg);
    return Promise.resolve();
  }

  function colocar() {
    if (busy) return;
    var st = S();
    if (!st || isOn()) { syncButtons(); return; }
    busy = true;
    var san = getSan();
    var run = function () {
      st = S();
      if (!st) { busy = false; return; }
      san = getSan();
      st.mascaraAtiva = false;
      var r0 = typeof calcularRecursos === 'function' ? calcularRecursos() : { pvMax: 0, peMax: 0 };
      var curPv = st.vidaAtual != null ? Number(st.vidaAtual) : (Number(r0.pvMax) || 0);
      var curPe = st.peAtual != null ? Number(st.peAtual) : (Number(r0.peMax) || 0);
      st.sanAtual = Math.max(0, san - 6);
      st.mascaraAtiva = true;
      st.vidaAtual = curPv + PV;
      st.peAtual = curPe + PE;
      setMsg('ATIVA: +20 Vida \u00b7 +10 Esfor\u00e7o \u00b7 +10 Defesa \u00b7 \u22126 Sanidade');
      persist();
      busy = false;
    };
    if (san < 6) {
      ask('Sanidade insuficiente (' + san + '). Continuar mesmo assim?', {
        title: 'Sanidade insuficiente', okText: 'Continuar', cancelText: 'Cancelar', warn: true
      }).then(function (ok) {
        if (!ok) { busy = false; return; }
        run();
      });
    } else run();
  }

  function manter() {
    if (busy) return;
    var st = S();
    if (!st || !isOn()) { syncButtons(); return; }
    busy = true;
    var san = getSan();
    var run = function () {
      st = S();
      if (!st) { busy = false; return; }
      st.sanAtual = Math.max(0, getSan() - 2);
      setMsg('Mantida: \u22122 Sanidade');
      persist();
      busy = false;
    };
    if (san < 2) {
      ask('Sanidade insuficiente (' + san + '). Continuar mesmo assim?', {
        title: 'Sanidade insuficiente', okText: 'Continuar', cancelText: 'Cancelar', warn: true
      }).then(function (ok) {
        if (!ok) { busy = false; return; }
        run();
      });
    } else run();
  }

  function tirar() {
    if (busy) return;
    var st = S();
    if (!st || !isOn()) { syncButtons(); return; }
    ask('Tirar a m\u00e1scara remove os b\u00f4nus: +20 Vida, +10 Esfor\u00e7o e +10 Defesa.', {
      title: 'Tirar a m\u00e1scara?', okText: 'Tirar m\u00e1scara', cancelText: 'Cancelar', danger: true
    }).then(function (ok) {
      if (!ok) return;
      busy = true;
      st = S();
      if (!st) { busy = false; return; }
      var curPv = st.vidaAtual != null ? Number(st.vidaAtual) : 0;
      var curPe = st.peAtual != null ? Number(st.peAtual) : 0;
      st.mascaraAtiva = false;
      var npv = Math.max(0, curPv - PV);
      st.vidaAtual = npv;
      st.peAtual = Math.max(0, curPe - PE);
      if (npv === 0) {
        setMsg('Removida. 0 Vida \u2014 morrendo.');
        alertUi('Vida chegou a 0 \u2014 estado de morrendo.', { title: 'Aten\u00e7\u00e3o', warn: true, okText: 'Entendi' })
          .then(function () { busy = false; });
      } else {
        setMsg('Removida. B\u00f4nus perdidos.');
        busy = false;
      }
      persist();
    });
  }

  function onClick(e) {
    var t = e.target;
    while (t && t !== e.currentTarget && (!t.id || (t.id !== 'msk-on' && t.id !== 'msk-stay' && t.id !== 'msk-off'))) {
      t = t.parentNode;
    }
    if (!t || !t.id) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    if (busy) return;
    if (t.id === 'msk-on') colocar();
    else if (t.id === 'msk-stay') manter();
    else if (t.id === 'msk-off') tirar();
  }

  function bind() {
    var box = document.getElementById('msk-box');
    if (!box) return false;
    if (box.dataset.btnFixBound) return true;
    box.dataset.btnFixBound = '1';
    box.addEventListener('click', onClick, true);
    syncButtons();
    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (bind() || n > 80) clearInterval(t);
  }, 150);
})();
