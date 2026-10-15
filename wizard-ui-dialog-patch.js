/* wizard-ui-dialog-patch.js — modal custom + renomeia Máscaras → Mascarado */
(function () {
  if (window.__wizUiDlgPatch) return;
  window.__wizUiDlgPatch = true;

  function ask(msg, opts) {
    if (typeof uiConfirm === 'function') return uiConfirm(msg, opts || {});
    return Promise.resolve(window.confirm(msg));
  }

  function rebindWizardClose() {
    var btn = document.getElementById('wizard-close');
    if (!btn || btn.dataset.uiDlgBound) return !!btn;
    btn.dataset.uiDlgBound = '1';
    var neu = btn.cloneNode(true);
    neu.dataset.uiDlgBound = '1';
    btn.parentNode.replaceChild(neu, btn);
    neu.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      ask('Cancelar a criação deste agente?', {
        title: 'Cancelar criação',
        okText: 'Cancelar criação',
        cancelText: 'Continuar',
        danger: true
      }).then(function (ok) {
        if (!ok) return;
        var w = document.getElementById('wizard');
        if (w) w.hidden = true;
        if (typeof fecharWizard === 'function') {
          try { fecharWizard(); } catch (err) {}
        }
      });
    });
    return true;
  }

  var nativeConfirm = window.confirm;
  var nativeAlert = window.alert;

  window.confirm = function (msg) {
    msg = String(msg || '');
    if (/Cancelar a cria/i.test(msg)) {
      ask(msg, {
        title: 'Cancelar criação',
        okText: 'Cancelar criação',
        cancelText: 'Continuar',
        danger: true
      }).then(function (ok) {
        if (ok) {
          var w = document.getElementById('wizard');
          if (w) w.hidden = true;
        }
      });
      return false;
    }
    if (/Excluir este agente/i.test(msg) || /Excluir esta ficha/i.test(msg) || /^Excluir\?/i.test(msg) || /Remover este ritual/i.test(msg)) {
      return false;
    }
    if (/Mundano/i.test(msg)) {
      ask(msg, {
        title: 'Sem classe',
        okText: 'Continuar',
        cancelText: 'Voltar',
        warn: true
      }).then(function (ok) {
        if (!ok) return;
        try {
          if (typeof stepAtual !== 'undefined') {
            if (stepAtual === 3 && typeof criarAgente === 'function') {
              criarAgente();
              return;
            }
            stepAtual++;
            if (typeof renderWizard === 'function') renderWizard();
          }
        } catch (e) {}
      });
      return false;
    }
    return nativeConfirm.call(window, msg);
  };

  window.alert = function (msg) {
    msg = String(msg || '');
    if (typeof uiAlert === 'function') {
      uiAlert(msg, { title: 'Aviso' });
      return;
    }
    return nativeAlert.call(window, msg);
  };

  function rebindDeletes() {
    document.querySelectorAll('.del[data-id]').forEach(function (btn) {
      if (btn.dataset.uiDlgBound) return;
      btn.dataset.uiDlgBound = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id = btn.dataset.id;
        ask('Excluir este agente? Essa ação não pode ser desfeita.', {
          title: 'Excluir agente',
          okText: 'Excluir',
          cancelText: 'Cancelar',
          danger: true
        }).then(function (ok) {
          if (!ok) return;
          try {
            if (typeof lerAgentes === 'function' && typeof salvarAgentes === 'function') {
              salvarAgentes(lerAgentes().filter(function (a) { return a.id !== id; }));
            } else {
              var key = 'escandinavo-agentes-registro';
              var lista = JSON.parse(localStorage.getItem(key) || '[]') || [];
              localStorage.setItem(key, JSON.stringify(lista.filter(function (a) { return a.id !== id; })));
            }
            localStorage.removeItem('escandinavo-ficha-' + id);
            if (typeof renderAgentes === 'function') renderAgentes();
          } catch (err) {
            console.error(err);
          }
        });
      }, true);
    });
  }

  function renameMascarado() {
    try {
      if (typeof TIPOS_FICHA !== 'undefined' && TIPOS_FICHA.mascaras) {
        TIPOS_FICHA.mascaras.nome = 'Ficha Mascarado';
      }
    } catch (e) {}
    document.querySelectorAll('.ag-tipo-badge.tipo-mascaras, .ficha-tipo-badge.tipo-mascaras').forEach(function (el) {
      var txt = el.textContent || '';
      if (/m[aá]scaras|das m[aá]scaras/i.test(txt)) el.textContent = 'Mascarado';
    });
    document.querySelectorAll('.tipo-ficha-card[data-tipo="mascaras"]').forEach(function (card) {
      card.querySelectorAll('h3, .tipo-ficha-nome, .nome, strong, b').forEach(function (el) {
        var t = el.textContent || '';
        if (/m[aá]scaras/i.test(t)) {
          el.textContent = t.replace(/Ficha das M[aá]scaras/gi, 'Ficha Mascarado').replace(/das M[aá]scaras/gi, 'Mascarado').replace(/M[aá]scaras/gi, 'Mascarado');
        }
      });
    });
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    rebindWizardClose();
    rebindDeletes();
    renameMascarado();
    if (n > 60) clearInterval(t);
  }, 200);

  setInterval(renameMascarado, 1000);

  try {
    var obs = new MutationObserver(function () {
      rebindDeletes();
      rebindWizardClose();
      renameMascarado();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
})();
