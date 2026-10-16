/* logo-mark-patch.js v18 — logo HQ em todos os pontos */
(function () {
  if (window.__logoMarkPatch) return;
  window.__logoMarkPatch = true;
  var LOGO = 'logo-white.svg?v=18';
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
      '.brand .logo, span.logo, .logo-mark{display:inline-block;width:1.25em;height:1.25em;vertical-align:-0.2em;background:url("'+url+'") center/contain no-repeat;font-size:0!important;color:transparent!important;image-rendering:-webkit-optimize-contrast;}',
      '.brand > .logo-mark, .brand .logo-mark{margin-right:0.35em;}',
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
        if (el.classList.contains('has-foto') || el.dataset.logoDone) return;
        var only = (el.textContent || '').trim();
        if (only === '\u25C8' || only === '\u25C7' || only === '\u25C6') {
          el.dataset.logoDone = '1';
          el.textContent = '';
          el.classList.add('avatar-logo');
        }
      });
    } finally { scanning = false; }
  }
  var n = 0;
  var iv = setInterval(function () { scan(); if (++n > 24) clearInterval(iv); }, 400);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
  try {
    var obs = new MutationObserver(function (mutations) {
      if (scanning) return;
      var relevant = false;
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'childList' && m.target && m.target.id !== 'logo-mark-css') {
          if ((m.addedNodes && m.addedNodes.length) || (m.removedNodes && m.removedNodes.length)) { relevant = true; break; }
        } else if (m.type === 'characterData') { relevant = true; break; }
      }
      if (relevant) scan();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  } catch (e) {}
  console.log('[logo-mark] v18 HQ');
})();
