// shim: carrega wizard completo do commit estável e aplica patches locais
(function(){
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/matt1a1/Escandinavo-fichas@e6204034a368b95cb1b16b83ed9928093c2aa53a/wizard.js';
  s.onload = function(){ console.log('[wizard] loaded from stable commit'); };
  s.onerror = function(){ console.error('[wizard] fail load'); };
  document.head.appendChild(s);
})();
