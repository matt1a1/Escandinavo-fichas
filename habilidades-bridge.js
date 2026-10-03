/* habilidades-bridge.js — garante catálogo + botões de habilidades/trilhas após o loader */
(function () {
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

  function ensureCatalogGlobals() {
    if (typeof window.HABILIDADES_CATALOG === 'undefined') window.HABILIDADES_CATALOG = [];
    if (typeof window.TRILHAS_CATALOG === 'undefined') window.TRILHAS_CATALOG = [];
  }

  function mergeArquivosSecretosIntoCatalog() {
    if (typeof ARQUIVOS_SECRETOS === 'undefined' || !Array.isArray(ARQUIVOS_SECRETOS)) return;
    ensureCatalogGlobals();
    ARQUIVOS_SECRETOS.forEach(function (e) {
      if (!e || !e.nome) return;
      var tipo = String(e.tipo || '').toLowerCase();
      if (tipo !== 'poder' && tipo !== 'habilidade' && tipo !== 'trilha') return;
      var exists = HABILIDADES_CATALOG.some(function (h) {
        return h && String(h.nome || '').toLowerCase() === String(e.nome).toLowerCase();
      });
      if (exists) return;
      HABILIDADES_CATALOG.push({
        nome: e.nome,
        desc: e.desc || '',
        classe: e.classe || '',
        nex: e.nex || '',
        livro: e.livro || 'Arquivos Secretos',
        origem: e.origem || ''
      });
    });
  }

  function addHabToSheet(item) {
    if (typeof state === 'undefined') return;
    if (!state.habilidades) state.habilidades = [];
    var nome = item.nome || item;
    var desc = item.desc || '';
    var already = state.habilidades.some(function (h) {
      return String(h.nome || '').toLowerCase() === String(nome).toLowerCase();
    });
    if (already) return;
    state.habilidades.push({ nome: nome, desc: desc, nex: item.nex || '' });
    if (typeof scheduleSave === 'function') scheduleSave();
    if (typeof renderHabilidades === 'function') renderHabilidades();
  }

  function bindCatalogButtons() {
    var list = $('#hab-catalog-list');
    if (!list || list.dataset.bridgeBound) return;
    list.dataset.bridgeBound = '1';
    list.querySelectorAll('.btn-add-hab').forEach(function (btn) {
      if (btn.dataset.bridgeBound) return;
      btn.dataset.bridgeBound = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var nome = btn.getAttribute('data-nome') || '';
        var item = (typeof HABILIDADES_CATALOG !== 'undefined' ? HABILIDADES_CATALOG : []).find(function (h) {
          return h && String(h.nome) === nome;
        });
        if (item) addHabToSheet(item);
        else addHabToSheet({ nome: nome, desc: '' });
      });
    });
  }

  function bindClassTabs() {
    $$('.hab-class-tab').forEach(function (btn) {
      if (btn.dataset.bridgeBound) return;
      btn.dataset.bridgeBound = '1';
      btn.addEventListener('click', function () {
        $$('.hab-class-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        setTimeout(function () { bindCatalogButtons(); }, 50);
      });
    });
  }

  function bindPersonalizada() {
    var btn = $('#btn-add-hab');
    if (!btn || btn.dataset.bridgeBound) return;
    var clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
    clone.dataset.bridgeBound = '1';
    clone.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof state === 'undefined') return;
      if (!state.habilidades) state.habilidades = [];
      state.habilidades.push({ nome: '', desc: '' });
      if (typeof scheduleSave === 'function') scheduleSave();
      if (typeof renderHabilidades === 'function') renderHabilidades();
    });
  }

  function tryInitHabilidadesUI() {
    mergeArquivosSecretosIntoCatalog();
    if (typeof window.initHabilidadesUI === 'function') {
      try { window.initHabilidadesUI(); } catch (err) {}
    }
    bindCatalogButtons();
    bindClassTabs();
    bindPersonalizada();
  }

  function patchArquivosSecretos() {
    window.addArquivoSecretoToSheet = function (e) {
      if (!e) return;
      addHabToSheet({ nome: e.nome, desc: e.desc || '', nex: e.nex || '' });
    };
  }

  function renderHabilidadesPadrao() {
    var list = document.getElementById('habilidades-list');
    if (!list || typeof state === 'undefined') return;
    list.innerHTML = '';
    if (!state.habilidades || !state.habilidades.length) {
      list.innerHTML = '<p class="empty-msg">Nenhuma habilidade adicionada ainda.</p>';
      return;
    }
    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&').replace(/</g, '<')
        .replace(/>/g, '>').replace(/"/g, '"');
    }
    function autosize(ta) {
      if (!ta || ta.tagName !== 'TEXTAREA') return;
      ta.style.height = 'auto';
      ta.style.height = Math.max(48, ta.scrollHeight) + 'px';
    }
    state.habilidades.forEach(function (h, i) {
      var nome = String(h.nome || '');
      nome = nome.replace(/^Trilha:\s*/i, '').replace(/^Origem:\s*/i, '').replace(/^Regra:\s*/i, '').replace(/^Poder:\s*/i, '');
      var desc = String(h.desc || '');
      var nex = '';
      var metaTag = '';
      var nexMatch = (h.nex && String(h.nex)) || '';
      if (!nexMatch) {
        var m1 = desc.match(/NEX\s*([\d]+%?)/i);
        if (m1) nexMatch = m1[1];
      }
      if (nexMatch) {
        if (!/%/.test(nexMatch)) nexMatch = nexMatch + '%';
        nex = nexMatch;
      }
      var trilhaMatch = desc.match(/Trilha:\s*([^·\n\)]+)/i);
      if (trilhaMatch) metaTag = trilhaMatch[1].trim();
      desc = desc.replace(/^\[Arquivos Secretos[^\]]*\]\s*/i, '');
      desc = desc.replace(/^\s*NEX\s*[\d%]+\.\s*/i, '');
      desc = desc.replace(/^\s*Classe:\s*[^\.]+\.\s*/i, '');
      desc = desc.replace(/^\s*Trilha:\s*[^\.]+\.\s*/i, '');

      var badges = '';
      if (nex) badges += '<span class="hab-mine-nex">NEX ' + esc(nex) + '</span>';
      if (metaTag) badges += '<span class="hab-mine-meta">' + esc(metaTag) + '</span>';

      var card = document.createElement('div');
      card.className = 'hab-mine-card';
      card.innerHTML =
        '<div class="hab-mine-head">' +
        '  <div class="hab-mine-title-row">' +
        '    <input type="text" class="hab-mine-nome" value="' + esc(nome) + '" data-field="nome" data-idx="' + i + '" placeholder="Nome da habilidade" />' +
        badges +
        '  </div>' +
        '  <button type="button" class="btn-remove" data-idx="' + i + '">Remover</button>' +
        '</div>' +
        '<textarea class="hab-mine-desc" data-field="desc" data-idx="' + i + '" placeholder="Descrição...">' + esc(desc) + '</textarea>';
      list.appendChild(card);
    });
    list.querySelectorAll('.hab-mine-head').forEach(function (head) {
      head.addEventListener('click', function (e) {
        if (e.target.closest('input, button, a, textarea, select')) return;
        var card = head.closest('.hab-mine-card');
        if (!card) return;
        var wasOpen = card.classList.contains('open');
        list.querySelectorAll('.hab-mine-card.open').forEach(function (c) {
          if (c !== card) c.classList.remove('open');
        });
        if (wasOpen) card.classList.remove('open');
        else card.classList.add('open');
        setTimeout(function () {
          if (card.classList.contains('open')) autosize(card.querySelector('.hab-mine-desc'));
        }, 0);
      });
    });
    list.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); });
      if (el.tagName === 'TEXTAREA') {
        autosize(el);
        el.addEventListener('input', function () {
          autosize(el);
          var idx = +el.dataset.idx;
          if (state.habilidades[idx]) state.habilidades[idx].desc = el.value;
          if (typeof scheduleSave === 'function') scheduleSave();
        });
      }
      el.addEventListener('change', function (e) {
        var idx = +e.target.dataset.idx;
        var field = e.target.dataset.field;
        if (!state.habilidades[idx]) return;
        state.habilidades[idx][field] = e.target.value;
        if (typeof scheduleSave === 'function') scheduleSave();
      });
    });
    list.querySelectorAll('.btn-remove').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        state.habilidades.splice(+btn.dataset.idx, 1);
        if (typeof scheduleSave === 'function') scheduleSave();
        renderHabilidadesPadrao();
        if (typeof renderRecursos === 'function') renderRecursos();
      });
    });
  }

  function installRenderOverride() {
    window.renderHabilidades = renderHabilidadesPadrao;
  }

  function boot() {
    ensureCatalogGlobals();
    patchArquivosSecretos();
    installRenderOverride();
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      var hasList = !!$('#hab-catalog-list');
      var hasCat = typeof HABILIDADES_CATALOG !== 'undefined' && HABILIDADES_CATALOG.length > 0;
      var hasState = typeof state !== 'undefined';
      if ((hasList && hasCat && hasState) || tries > 80) {
        clearInterval(t);
        tryInitHabilidadesUI();
        installRenderOverride();
        if (typeof renderHabilidades === 'function') renderHabilidades();
        setTimeout(function () {
          mergeArquivosSecretosIntoCatalog();
          tryInitHabilidadesUI();
          if (typeof renderHabilidades === 'function') renderHabilidades();
        }, 400);
      }
    }, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
