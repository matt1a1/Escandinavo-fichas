/* logo-mark-patch.js — troca ◈ pelo logo oficial */
(function () {
  if (window.__logoMarkPatch) return;
  window.__logoMarkPatch = true;

  var LOGO = 'logo-white.svg';

  function ensureCss() {
    if (document.getElementById('logo-mark-css')) return;
    var s = document.createElement('style');
    s.id = 'logo-mark-css';
    s.textContent = [
      '.avatar.avatar-logo, .ag-card .avatar:not(.has-foto){background-image:url("' + LOGO + '")!important;background-size:62% 62%!important;background-position:center!important;background-repeat:no-repeat!important;color:transparent!important;font-size:0!important;}',
      '.brand .logo, span.logo, .logo-mark{display:inline-block;width:1.15em;height:1.15em;vertical-align:-0.15em;background:url("' + LOGO + '") center/contain no-repeat;font-size:0!important;color:transparent!important;}',
      '.brand > .logo-mark, .brand .logo-mark{margin-right:0.35em;}',
      '.camp-avatar.camp-avatar-fallback:not([style*="background-image"]){background-image:url("' + LOGO + '")!important;background-size:55% 55%!important;background-position:center!important;background-repeat:no-repeat!important;color:transparent!important;font-size:0!important;}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function replaceGlyph(el) {
    if (!el || el.dataset.logoDone) return;
    var txt = (el.textContent || '').trim();
    if (txt === '\u25C8' || txt === '\u25C7' || txt === '\u25C6') {
      el.dataset.logoDone = '1';
      el.classList.add('logo-mark');
      el.textContent = '';
    }
  }

  function scan() {
    ensureCss();
    document.querySelectorAll('.brand').forEach(function (b) {
      if (b.dataset.logoDone) return;
      var t = b.childNodes[0];
      if (t && t.nodeType === 3 && /^\s*[\u25C8\u25C7\u25C6]/.test(t.textContent || '')) {
        b.dataset.logoDone = '1';
        var mark = document.createElement('span');
        mark.className = 'logo-mark';
        t.textContent = (t.textContent || '').replace(/^[\u25C8\u25C7\u25C6]\s*/, ' ');
        b.insertBefore(mark, t);
      }
      b.querySelectorAll('.logo').forEach(replaceGlyph);
    });
    document.querySelectorAll('.logo, .avatar').forEach(function (el) {
      if (el.classList.contains('has-foto')) return;
      var only = (el.textContent || '').trim();
      if (only === '\u25C8' || only === '\u25C7' || only === '\u25C6') {
        el.textContent = '';
        el.classList.add('avatar-logo');
      }
    });
    document.querySelectorAll('#camp-detail-cover').forEach(function (el) {
      if ((el.textContent || '').trim() === '\u25C8') {
        el.textContent = '';
        el.style.backgroundImage = 'url("' + LOGO + '")';
        el.style.backgroundSize = '50%';
        el.style.backgroundPosition = 'center';
        el.style.backgroundRepeat = 'no-repeat';
      }
    });
  }

  var n = 0;
  var iv = setInterval(function () {
    scan();
    if (++n > 40) clearInterval(iv);
  }, 250);
  setInterval(scan, 2000);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
  try {
    new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  } catch (e) {}
  console.log('[logo-mark] active');
})();
