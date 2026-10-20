/* logo-mark-patch.js v22 — Logo_branca original; tamanho em px fixo */
(function () {
  if (window.__logoMarkPatchV22) return;
  window.__logoMarkPatchV22 = true;
  var LOGO = 'Logo_branca?v=22';
  var scanning = false;
  function logoUrl() {
    if (window.EscandinavoLogos && window.EscandinavoLogos.white) return window.EscandinavoLogos.white;
    return LOGO;
  }
  function ensureCss() {
    var url = logoUrl();
    var s = document.getElementById('logo-mark-css');
    if (!s) {
      s = document.createElement('style');
      s.id = 'logo-mark-css';
      document.head.appendChild(s);
    }
    s.textContent = [
      '.avatar.avatar-logo, .ag-card .avatar:not(.has-foto){background-image:url("'+url+'")!important;background-size:62% 62%!important;background-position:center!important;background-repeat:no-repeat!important;color:transparent!important;font-size:0!important;image-rendering:-webkit-optimize-contrast;}',
      /* IMPORTANT: width/height em px — em com font-size:0 vira 0px */
      '.brand .logo, span.logo, .logo-mark{display:inline-block!important;width:22px!important;height:22px!important;min-width:22px!important;min-height:22px!important;vertical-align:middle!important;background:url("'+url+'") center/contain no-repeat!important;font-size:0!important;color:transparent!important;overflow:hidden!important;image-rendering:-webkit-optimize-contrast;}',
      '.brand > .logo-mark, .brand .logo-mark{margin-right:8px!important;}',
      '.camp-avatar.camp-avatar-fallback:not([style*="background-image"]){background-image:url("'+url+'")!important;background-size:55% 55%!important;background-position:center!important;background-repeat:no-repeat!important;color:transparent!important;font-size:0!important;image-rendering:-webkit-optimize-contrast;}',
      'img.logo-img, .logo-img{image-rendering:-webkit-optimize-contrast;}'
    ].join('\n');
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
    if (scanning) return;
    scanning = true;
    try {
      ensureCss();
      document.querySelectorAll('.brand').forEach(function (b) {
        // Always ensure a logo-mark exists in brand
        if (!b.querySelector('.logo-mark')) {
          var mark = document.createElement('span');
          mark.className = 'logo-mark';
          mark.dataset.logoDone = '1';
          b.insertBefore(mark, b.firstChild);
        }
        b.querySelectorAll('.logo').forEach(replaceGlyph);
      });
      document.querySelectorAll('.logo, .avatar').forEach(function (el) {
        if (el.classList.contains('has-foto') || el.dataset.logoDone) return;
        var only = (el.textContent || '').trim();
        if (only === '\u25C8' || only === '\u25C7' || only === '\u25C6' || only === '') {
          if (el.classList.contains('logo') || only === '\u25C8' || only === '\u25C7' || only === '\u25C6') {
            el.dataset.logoDone = '1';
            el.textContent = '';
            el.classList.add('avatar-logo');
          }
        }
      });
    } finally { scanning = false; }
  }
  var n = 0;
  var iv = setInterval(function () { scan(); if (++n > 30) clearInterval(iv); }, 300);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
  try {
    var obs = new MutationObserver(function () { if (!scanning) scan(); });
    obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  } catch (e) {}
  console.log('[logo-mark] v22 Logo_branca 22px');
})();
