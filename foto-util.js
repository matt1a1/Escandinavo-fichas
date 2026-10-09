// Upload e redimensionamento de foto (personagens e NPCs)
(function () {
  var MAX = 480;
  var QUALITY = 0.72;

  function pickAndResize(callback) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.onchange = function () {
      var file = input.files && input.files[0];
      input.remove();
      if (!file) return;
      if (file.size > 12 * 1024 * 1024) {
        alert('Imagem muito grande (máx. 12 MB).');
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var w = img.width, h = img.height;
          var scale = Math.min(1, MAX / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * scale));
          var ch = Math.max(1, Math.round(h * scale));
          var canvas = document.createElement('canvas');
          canvas.width = cw;
          canvas.height = ch;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, cw, ch);
          var dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
          callback(dataUrl);
        };
        img.onerror = function () { alert('Não foi possível ler a imagem.'); };
        img.src = reader.result;
      };
      reader.onerror = function () { alert('Falha ao carregar o arquivo.'); };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function setRegistroFoto(registroKey, id, dataUrl) {
    try {
      var lista = JSON.parse(localStorage.getItem(registroKey) || '[]') || [];
      var i = lista.findIndex(function (x) { return x.id === id; });
      if (i < 0) return false;
      lista[i].foto = dataUrl || '';
      lista[i].atualizadoEm = Date.now();
      localStorage.setItem(registroKey, JSON.stringify(lista));
    } catch (e) { return false; }
    try {
      var raw = localStorage.getItem('escandinavo-ficha-' + id);
      if (raw) {
        var ficha = JSON.parse(raw);
        ficha.foto = dataUrl || '';
        localStorage.setItem('escandinavo-ficha-' + id, JSON.stringify(ficha));
      }
    } catch (e) {}
    try {
      var camps = JSON.parse(localStorage.getItem('escandinavo-campanhas-registro') || '[]') || [];
      var changed = false;
      camps.forEach(function (c) {
        if (c.agentesMeta && c.agentesMeta[id]) {
          c.agentesMeta[id].foto = dataUrl || '';
          changed = true;
        }
        if (c.npcs && c.npcs.length) {
          c.npcs.forEach(function (n) {
            if (n.fichaId === id) { n.foto = dataUrl || ''; changed = true; }
          });
        }
      });
      if (changed) localStorage.setItem('escandinavo-campanhas-registro', JSON.stringify(camps));
    } catch (e) {}
    return true;
  }

  function avatarHtml(foto, fallbackIcon) {
    var icon = fallbackIcon || '◈';
    if (foto) {
      return '<div class="avatar has-foto" style="background-image:url(\'' + foto.replace(/'/g, '%27') + '\')" title="Clique para trocar a foto"></div>';
    }
    return '<div class="avatar" title="Clique para adicionar foto">' + icon + '</div>';
  }

  function bindAvatarClicks(grid, registroKey, onDone) {
    if (!grid) return;
    grid.querySelectorAll('.avatar').forEach(function (av) {
      av.style.cursor = 'pointer';
      av.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var card = av.closest('.ag-card');
        if (!card) return;
        var idEl = card.querySelector('.ag-menu-btn') || card.querySelector('[data-act]') || card.querySelector('.del');
        var id = idEl && idEl.dataset.id;
        if (!id) return;
        pickAndResize(function (dataUrl) {
          setRegistroFoto(registroKey, id, dataUrl);
          if (typeof onDone === 'function') onDone();
        });
      });
    });
  }

  window.EscandinavoFoto = {
    pickAndResize: pickAndResize,
    setRegistroFoto: setRegistroFoto,
    avatarHtml: avatarHtml,
    bindAvatarClicks: bindAvatarClicks
  };
})();
