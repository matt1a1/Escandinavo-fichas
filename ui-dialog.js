/**
 * Diálogos customizados no estilo da ficha (substitui alert/confirm nativos).
 * API:
 *   uiConfirm(msg, { title, okText, cancelText, danger }) -> Promise<boolean>
 *   uiAlert(msg, { title, okText }) -> Promise<void>
 *   uiToast(msg, { ms })
 */
(function () {
  var root = typeof window !== 'undefined' ? window : this;

  function ensureCss() {
    if (document.getElementById('esc-ui-dialog-css')) return;
    var s = document.createElement('style');
    s.id = 'esc-ui-dialog-css';
    s.textContent =
      '#esc-ui-dialog{position:fixed;inset:0;z-index:10050;background:rgba(6,6,12,.72);display:flex;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}' +
      '#esc-ui-dialog[hidden]{display:none!important;}' +
      '#esc-ui-dialog .esc-dlg-box{background:linear-gradient(180deg,#1a1a26 0%,#14141c 100%);border:1px solid #2e2e42;border-radius:16px;padding:22px 22px 18px;max-width:380px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 0 1px rgba(167,139,250,.08);animation:escDlgIn .18s ease-out;}' +
      '@keyframes escDlgIn{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}' +
      '#esc-ui-dialog .esc-dlg-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;margin-bottom:12px;background:rgba(167,139,250,.12);color:#c4b5fd;}' +
      '#esc-ui-dialog .esc-dlg-icon.warn{background:rgba(251,191,36,.12);color:#fbbf24;}' +
      '#esc-ui-dialog .esc-dlg-icon.danger{background:rgba(248,113,113,.12);color:#f87171;}' +
      '#esc-ui-dialog .esc-dlg-icon.info{background:rgba(96,165,250,.12);color:#60a5fa;}' +
      '#esc-ui-dialog h3{margin:0 0 8px;font-size:1.05rem;font-weight:650;color:#f1f1f7;letter-spacing:.01em;}' +
      '#esc-ui-dialog p{margin:0 0 20px;color:#a0a0b4;font-size:.92rem;line-height:1.45;}' +
      '#esc-ui-dialog .esc-dlg-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;}' +
      '#esc-ui-dialog .esc-dlg-btn{border:none;border-radius:10px;padding:10px 16px;font-size:.9rem;font-weight:600;cursor:pointer;transition:background .15s,transform .1s;}' +
      '#esc-ui-dialog .esc-dlg-btn:active{transform:scale(.97);}' +
      '#esc-ui-dialog .esc-dlg-cancel{background:transparent;border:1px solid #3a3a4e;color:#cfcfe0;}' +
      '#esc-ui-dialog .esc-dlg-cancel:hover{background:rgba(255,255,255,.04);border-color:#52526a;}' +
      '#esc-ui-dialog .esc-dlg-ok{background:#7c3aed;color:#fff;}' +
      '#esc-ui-dialog .esc-dlg-ok:hover{background:#8b5cf6;}' +
      '#esc-ui-dialog .esc-dlg-ok.danger{background:#dc2626;}' +
      '#esc-ui-dialog .esc-dlg-ok.danger:hover{background:#ef4444;}' +
      '#esc-ui-dialog .esc-dlg-ok.warn{background:#d97706;}' +
      '#esc-ui-dialog .esc-dlg-ok.warn:hover{background:#f59e0b;}' +
      '#esc-ui-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(12px);background:#1d1d29;border:1px solid #3b3b52;color:#e8e8f0;padding:11px 18px;border-radius:999px;z-index:10060;font-size:.88rem;box-shadow:0 10px 28px rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;max-width:90vw;text-align:center;}' +
      '#esc-ui-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}';
    document.head.appendChild(s);
  }

  function ensureDom() {
    ensureCss();
    if (!document.getElementById('esc-ui-dialog')) {
      var div = document.createElement('div');
      div.id = 'esc-ui-dialog';
      div.hidden = true;
      div.innerHTML =
        '<div class="esc-dlg-box" role="dialog" aria-modal="true" aria-labelledby="esc-dlg-title">' +
          '<div class="esc-dlg-icon" id="esc-dlg-icon">!</div>' +
          '<h3 id="esc-dlg-title">Aviso</h3>' +
          '<p id="esc-dlg-msg"></p>' +
          '<div class="esc-dlg-actions">' +
            '<button type="button" class="esc-dlg-btn esc-dlg-cancel" id="esc-dlg-cancel">Cancelar</button>' +
            '<button type="button" class="esc-dlg-btn esc-dlg-ok" id="esc-dlg-ok">OK</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(div);
      div.addEventListener('click', function (e) {
        if (e.target === div && root.__escDlgResolve) {
          finish(false);
        }
      });
      document.getElementById('esc-dlg-cancel').addEventListener('click', function () {
        finish(false);
      });
      document.getElementById('esc-dlg-ok').addEventListener('click', function () {
        finish(true);
      });
    }
    if (!document.getElementById('esc-ui-toast')) {
      var t = document.createElement('div');
      t.id = 'esc-ui-toast';
      document.body.appendChild(t);
    }
  }

  function finish(ok) {
    var m = document.getElementById('esc-ui-dialog');
    if (m) m.hidden = true;
    var resolve = root.__escDlgResolve;
    root.__escDlgResolve = null;
    if (typeof resolve === 'function') resolve(ok);
  }

  function uiConfirm(message, opts) {
    opts = opts || {};
    ensureDom();
    return new Promise(function (resolve) {
      root.__escDlgResolve = resolve;
      var icon = document.getElementById('esc-dlg-icon');
      var title = document.getElementById('esc-dlg-title');
      var msg = document.getElementById('esc-dlg-msg');
      var okBtn = document.getElementById('esc-dlg-ok');
      var cancelBtn = document.getElementById('esc-dlg-cancel');
      var modal = document.getElementById('esc-ui-dialog');

      title.textContent = opts.title || 'Confirmar';
      msg.textContent = message || '';
      okBtn.textContent = opts.okText || 'Continuar';
      cancelBtn.textContent = opts.cancelText || 'Cancelar';
      cancelBtn.hidden = false;

      icon.className = 'esc-dlg-icon';
      okBtn.className = 'esc-dlg-btn esc-dlg-ok';
      if (opts.danger) {
        icon.classList.add('danger');
        icon.textContent = opts.icon || '\u26a0';
        okBtn.classList.add('danger');
        okBtn.textContent = opts.okText || 'Confirmar';
      } else if (opts.warn) {
        icon.classList.add('warn');
        icon.textContent = opts.icon || '!';
        okBtn.classList.add('warn');
      } else {
        icon.classList.add('info');
        icon.textContent = opts.icon || '?';
      }
      modal.hidden = false;
      setTimeout(function () { try { okBtn.focus(); } catch (e) {} }, 50);
    });
  }

  function uiAlert(message, opts) {
    opts = opts || {};
    ensureDom();
    return new Promise(function (resolve) {
      root.__escDlgResolve = function () { resolve(); };
      var icon = document.getElementById('esc-dlg-icon');
      var title = document.getElementById('esc-dlg-title');
      var msg = document.getElementById('esc-dlg-msg');
      var okBtn = document.getElementById('esc-dlg-ok');
      var cancelBtn = document.getElementById('esc-dlg-cancel');
      var modal = document.getElementById('esc-ui-dialog');

      title.textContent = opts.title || 'Aviso';
      msg.textContent = message || '';
      okBtn.textContent = opts.okText || 'OK';
      cancelBtn.hidden = true;

      icon.className = 'esc-dlg-icon';
      okBtn.className = 'esc-dlg-btn esc-dlg-ok';
      if (opts.danger) {
        icon.classList.add('danger');
        icon.textContent = opts.icon || '\u2715';
        okBtn.classList.add('danger');
      } else if (opts.warn) {
        icon.classList.add('warn');
        icon.textContent = opts.icon || '!';
        okBtn.classList.add('warn');
      } else {
        icon.classList.add('info');
        icon.textContent = opts.icon || '\u2139';
      }
      modal.hidden = false;
      setTimeout(function () { try { okBtn.focus(); } catch (e) {} }, 50);
    });
  }

  function uiToast(message, opts) {
    opts = opts || {};
    ensureDom();
    var t = document.getElementById('esc-ui-toast');
    t.textContent = message || '';
    t.classList.add('show');
    clearTimeout(root.__escToastTimer);
    root.__escToastTimer = setTimeout(function () {
      t.classList.remove('show');
    }, opts.ms || 2800);
  }

  root.uiConfirm = uiConfirm;
  root.uiAlert = uiAlert;
  root.uiToast = uiToast;

  root.escConfirm = function (msg, opts) {
    if (typeof uiConfirm === 'function') return uiConfirm(msg, opts);
    return Promise.resolve(window.confirm(msg));
  };
})();
