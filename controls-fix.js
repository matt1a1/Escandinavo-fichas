/* controls-fix.js v5 — NEX ±5 e atributos ±1 (todas as fichas)
   Delegação em capture (sem cloneNode periódico — não mata botões).
   NEX: 5…95,99 (99− → 95; 95+ → 99) */
(function () {
  if (window.__controlsFixV5) return;
  window.__controlsFixV5 = true;

  function S() {
    return (typeof state !== 'undefined') ? state : null;
  }

  function stepNex(cur, delta) {
    cur = Number(cur) || 5;
    if (delta > 0) {
      if (cur >= 99) return 99;
      if (cur >= 95) return 99;
      return Math.min(95, cur + 5);
    }
    if (cur <= 5) return 5;
    if (cur === 99) return 95;
    return Math.max(5, cur - 5);
  }
  window.stepNex = stepNex;

  function save() {
    if (typeof scheduleSave === 'function') scheduleSave();
    else if (typeof saveState === 'function') saveState();
  }

  function refreshAfterNex() {
    if (typeof normalizarAtributosNex === 'function') {
      try { normalizarAtributosNex(); } catch (e) {}
    }
    if (typeof renderAtributos === 'function') {
      try { renderAtributos(); } catch (e) {}
    }
    if (typeof renderRecursos === 'function') {
      try { renderRecursos(); } catch (e) {}
    }
    if (typeof renderPericias === 'function') {
      try { renderPericias(); } catch (e) {}
    }
    if (typeof renderCombate === 'function') {
      try { renderCombate(); } catch (e) {}
    }
    save();
  }

  function refreshAfterAttr() {
    if (typeof renderAtributos === 'function') {
      try { renderAtributos(); } catch (e) {}
    }
    if (typeof renderRecursos === 'function') {
      try { renderRecursos(); } catch (e) {}
    }
    if (typeof renderPericias === 'function') {
      try { renderPericias(); } catch (e) {}
    }
    if (typeof renderCombate === 'function') {
      try { renderCombate(); } catch (e) {}
    }
    save();
  }

  function isCustom() {
    var st = S();
    if (!st) return false;
    if (typeof isFichaCustom === 'function' && isFichaCustom()) return true;
    if (typeof isFichaLivre === 'function' && isFichaLivre()) return true;
    return st.tipoFicha === 'custom' || st.tipoFicha === 'mascaras';
  }

  function handleNex(btn) {
    var st = S();
    if (!st) return;
    var delta = Number(btn.dataset.delta);
    if (!delta || Math.abs(delta) !== 5) {
      var txt = String(btn.textContent || '');
      delta = (txt.indexOf('«') >= 0 || txt.indexOf('<') >= 0 || txt.indexOf('‹') >= 0 ||
               txt.indexOf('−') >= 0 || txt.trim() === '-' || delta < 0) ? -5 : 5;
    }
    st.nex = stepNex(st.nex, delta);
    var nd = document.getElementById('nex-display');
    if (nd) nd.textContent = st.nex + '%';
    refreshAfterNex();
  }

  function handleAttr(btn) {
    var st = S();
    if (!st || !st.atributos) return;
    var item = btn.closest('.attr-item');
    if (!item) return;
    var key = item.dataset.attr;
    if (!key) return;

    var delta = Number(btn.dataset.delta);
    if (!delta || Math.abs(delta) !== 1) {
      var txt = String(btn.textContent || '');
      delta = (txt.indexOf('−') >= 0 || txt.indexOf('-') >= 0 || delta < 0) ? -1 : 1;
    }

    var cur = Number(st.atributos[key]) || 0;
    var val = cur + delta;
    var custom = isCustom();

    if (custom) {
      if (val < 0) val = 0;
      if (val > 20) val = 20;
    } else {
      if (val < 0) val = 0;
      if (val > 5) val = 5;
      if (delta > 0) {
        if (typeof pontosDisponiveis === 'function' && pontosDisponiveis() <= 0) return;
        if (typeof pontosAcimaDe3 === 'function' && typeof nexAumentosAtributo === 'function') {
          var acimaDepois = pontosAcimaDe3() - Math.max(0, cur - 3) + Math.max(0, val - 3);
          if (acimaDepois > nexAumentosAtributo()) {
            alert('O máximo inicial de cada atributo é 3. Aumento de Atributo (NEX 20%, 50%, 80% e 95%) permite subir até 5.');
            return;
          }
        }
      }
    }
    if (val === cur) return;
    st.atributos[key] = val;
    refreshAfterAttr();
  }

  function onClick(e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var nex = t.closest('.nex-btn');
    if (nex) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      handleNex(nex);
      return;
    }

    var attr = t.closest('.attr-btn');
    if (attr) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      handleAttr(attr);
      return;
    }
  }

  document.addEventListener('click', onClick, true);

  function normalizeDeltas() {
    document.querySelectorAll('.nex-btn').forEach(function (btn) {
      var d = Number(btn.dataset.delta);
      if (!d || Math.abs(d) !== 5) {
        var txt = String(btn.textContent || '');
        btn.dataset.delta = (d < 0 || txt.indexOf('«') >= 0 || txt.indexOf('<') >= 0 ||
          txt.indexOf('‹') >= 0 || txt.indexOf('−') >= 0 || txt.indexOf('-') >= 0) ? '-5' : '5';
      }
    });
    document.querySelectorAll('.attr-btn').forEach(function (btn) {
      var d = Number(btn.dataset.delta);
      if (!d || Math.abs(d) !== 1) {
        var txt = String(btn.textContent || '');
        btn.dataset.delta = (d < 0 || txt.indexOf('−') >= 0 || txt.indexOf('-') >= 0) ? '-1' : '1';
      }
    });
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    normalizeDeltas();
    if (n > 30) clearInterval(t);
  }, 200);
  setTimeout(normalizeDeltas, 500);
  setTimeout(normalizeDeltas, 1500);
})();
