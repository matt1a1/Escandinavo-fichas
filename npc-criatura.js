// shim: carrega npc-criatura do commit estável
(function () {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/matt1a1/Escandinavo-fichas@e6204034a368b95cb1b16b83ed9928093c2aa53a/npc-criatura.js';
  s.onload = function () { console.log('[npc] loaded from stable commit'); };
  s.onerror = function () { console.error('[npc] fail load'); };
  document.head.appendChild(s);
})();
