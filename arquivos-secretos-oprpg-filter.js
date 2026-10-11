/* Garante filtro OPRPG em Arquivos Secretos */
(function () {
  function add() {
    var box = document.getElementById('arq-livros');
    if (!box) return false;
    if (box.querySelector('[data-livro="OPRPG"]')) return true;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'arq-btn';
    btn.dataset.livro = 'OPRPG';
    btn.textContent = 'OPRPG';
    box.appendChild(btn);
    return true;
  }
  var n = 0;
  var iv = setInterval(function () {
    if (add() || ++n > 40) clearInterval(iv);
  }, 250);
})();
