// Garante CSS do botão × remover da campanha
(function () {
  if (document.getElementById('rm-ag-css')) return;
  var s = document.createElement('style');
  s.id = 'rm-ag-css';
  s.textContent = '.camp-ag-card{position:relative;}.rm-ag{position:absolute;top:8px;right:8px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:transparent!important;border:none!important;color:#9797a8!important;font-size:1.15rem;line-height:1;cursor:pointer;border-radius:6px;padding:0;z-index:2;}.rm-ag:hover{color:#f87171!important;background:rgba(248,113,113,.12)!important;}';
  document.head.appendChild(s);
})();
