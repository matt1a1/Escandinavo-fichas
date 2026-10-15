/* logo-data.js — monta logos HQ a partir das partes */
(function () {
  var lp = window.__lp || {};
  function join(arr) {
    if (!arr) return '';
    var s = '';
    for (var i = 0; i < arr.length; i++) s += (arr[i] || '');
    return s;
  }
  var white = join(lp.w);
  var app = join(lp.a);
  function du(b) { return b ? ('data:image/png;base64,' + b) : ''; }
  window.EscandinavoLogos = { white: du(white), app192: du(app), app180: du(app) };
  try {
    document.querySelectorAll('link[rel="apple-touch-icon"]').forEach(function (l) {
      if (app) l.href = du(app);
    });
  } catch (e) {}
  console.log('[logo-data] HQ', white.length, app.length);
})();
