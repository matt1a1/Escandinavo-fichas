/* logo-data.js — logos HQ via hex (sem corrupção de base64) */
(function () {
  var lp = window.__lp || {};
  function join(arr) {
    if (!arr) return '';
    var s = '';
    for (var i = 0; i < arr.length; i++) s += (arr[i] || '');
    return s;
  }
  function hexToDataUrl(hex) {
    if (!hex) return '';
    var bytes = new Uint8Array(hex.length / 2);
    for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    var bin = '';
    for (var j = 0; j < bytes.length; j++) bin += String.fromCharCode(bytes[j]);
    return 'data:image/png;base64,' + btoa(bin);
  }
  var whiteHex = join(lp.w);
  var appHex = join(lp.a);
  window.EscandinavoLogos = {
    white: hexToDataUrl(whiteHex),
    app192: hexToDataUrl(appHex),
    app180: hexToDataUrl(appHex)
  };
  try {
    if (window.EscandinavoLogos.app192) {
      document.querySelectorAll('link[rel="apple-touch-icon"]').forEach(function (l) {
        l.href = window.EscandinavoLogos.app192;
      });
    }
  } catch (e) {}
  console.log('[logo-data] HQ hex', whiteHex.length, appHex.length);
})();
