// Upload e redimensionamento de foto (personagens, NPCs, criaturas)
(function () {
  var MAX = 512;
  var QUALITY = 0.78;

  function pickAndResize(callback) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;width:1px;height:1px;';
    document.body.appendChild(input);

    var done = false;
    function finish(dataUrl) {
      if (done) return;
      done = true;
      try { input.remove(); } catch (e) {}
      if (dataUrl && typeof callback === 'function') callback(dataUrl);
    }

    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) {
        try { input.remove(); } catch (e) {}
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        alert('Imagem muito grande (máx. 15 MB).');
        try { input.remove(); } catch (e) {}
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
          finish(dataUrl);
        };
        img.onerror = function () {
          alert('Não foi possível ler a imagem.');
          try { input.remove(); } catch (e) {}
        };
        img.src = reader.result;
      };
      reader.onerror = function () {
        alert('Falha ao carregar o arquivo.');
        try { input.remove(); } catch (e) {}
      };
      reader.readAsDataURL(file);
    });

    setTimeout(function () {
      try { input.click(); } catch (e) {
        alert('Não foi possível abrir o seletor de imagens.');
        try { input.remove(); } catch (e2) {}
      }
    }, 10);
  }

  function setRegistroFoto(registroKey, id, dataUrl) {
    var ok = false;
    try {
      var lista = JSON.parse(localStorage.getItem(registroKey) || '[]') || [];
      var i = lista.findIndex(function (x) { return x && x.id === id; });
      if (i >= 0) {
        lista[i].foto = dataUrl || '';
        lista[i].atualizadoEm = Date.now();
        localStorage.setItem(registroKey, JSON.stringify(lista));
        ok = true;
      }
    } catch (e) {}
    try {
      var raw = localStorage.getItem('escandinavo-ficha-' + id);
      if (raw) {
        var ficha = JSON.parse(raw);
        ficha.foto = dataUrl || '';
        localStorage.setItem('escandinavo-ficha-' + id, JSON.stringify(ficha));
        ok = true;
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
        (c.npcs || []).forEach(function (n) {
          if (n && (n.fichaId === id || n.id === id)) {
            n.foto = dataUrl || '';
            changed = true;
          }
        });
      });
      if (changed) localStorage.setItem('escandinavo-campanhas-registro', JSON.stringify(camps));
    } catch (e) {}
    return ok;
  }

  function avatarHtml(foto, fallbackIcon) {
    var icon = fallbackIcon || '◈';
    if (foto) {
      return '<div class="avatar has-foto" style="background-image:url(\'' + String(foto).replace(/'/g, '%27') + '\');background-size:cover;background-position:center" title="Clique para trocar a foto"></div>';
    }
    return '<div class="avatar" title="Clique para adicionar foto">' + icon + '</div>';
  }

  function bindAvatarClicks(grid, registroKey, onDone) {
    if (!grid) return;
    grid.querySelectorAll('.avatar').forEach(function (av) {
      if (av._fotoBound) return;
      av._fotoBound = true;
      av.style.cursor = 'pointer';
      av.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var card = av.closest('.ag-card');
        if (!card) return;
        var idEl = card.querySelector('.ag-menu-btn') || card.querySelector('[data-id]') || card.querySelector('.del');
        var id = idEl && (idEl.dataset.id || idEl.getAttribute('data-id'));
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
  console.log('[foto-util] ok');
})();
