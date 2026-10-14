/* mascara-ui-dialog-patch.js — troca confirm/alert nativos da máscara por modal custom */
(function () {
  if (window.__mskUiDlgPatch) return;
  window.__mskUiDlgPatch = true;

  function rebind() {
    var box = document.getElementById('msk-box');
    if (!box || box.dataset.uiDlgBound) return !!box;
    box.dataset.uiDlgBound = '1';

    box.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== box && (!t.id || (t.id !== 'msk-on' && t.id !== 'msk-stay' && t.id !== 'msk-off'))) {
        t = t.parentNode;
      }
      if (!t || !t.id) return;
      if (typeof uiConfirm !== 'function') return;

      var realConfirm = window.confirm;
      var realAlert = window.alert;
      var pending = null;

      window.confirm = function (msg) {
        pending = { msg: String(msg || ''), type: 'confirm' };
        return false;
      };
      window.alert = function (msg) {
        pending = { msg: String(msg || ''), type: 'alert' };
      };

      setTimeout(function () {
        window.confirm = realConfirm;
        window.alert = realAlert;
        if (!pending) return;
        if (pending.type === 'alert') {
          uiAlert(pending.msg, { title: 'Aviso', warn: true });
          return;
        }
        var msg = pending.msg;
        var opts = { title: 'Confirmar', okText: 'Continuar', cancelText: 'Cancelar' };
        if (/Sanidade insuficiente/i.test(msg)) {
          opts.title = 'Sanidade insuficiente';
          opts.warn = true;
          opts.okText = 'Continuar';
        } else if (/Tirar a m[aá]scara/i.test(msg)) {
          opts.title = 'Tirar a máscara?';
          opts.danger = true;
          opts.okText = 'Tirar máscara';
        }
        uiConfirm(msg, opts).then(function (ok) {
          if (!ok) return;
          var pass = window.confirm;
          window.confirm = function () { return true; };
          window.alert = function (m) {
            if (typeof uiAlert === 'function') uiAlert(String(m || ''), { title: 'Aviso', warn: true });
          };
          try {
            t.click();
          } finally {
            setTimeout(function () {
              window.confirm = pass;
              window.alert = realAlert;
            }, 50);
          }
        });
      }, 0);
    }, true);

    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (rebind() || n > 60) clearInterval(t);
  }, 200);
})();
