/* habilidades-bridge.js — garante catálogo + botões de habilidades/trilhas após o loader */
(function () {
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

  function ensureCatalogGlobals() {
    if (typeof window.HABILIDADES_CATALOG === 'undefined') window.HABILIDADES_CATALOG = [];
    if (typeof window.HABILIDADES_CATEGORIAS === 'undefined') {
      window.HABILIDADES_CATEGORIAS = {
        Combatente: ['Poderes de Combatente', 'Aniquilador', 'Comandante de Campo', 'Guerreiro', 'Operações Especiais', 'Tropa de Choque'],
        Especialista: ['Poderes de Especialista', 'Atirador de Elite', 'Infiltrador', 'Médico de Campo', 'Negociador', 'Técnico'],
        Ocultista: ['Poderes de Ocultista', 'Conduíte', 'Flagelador', 'Graduado', 'Intuitivo', 'Lâmina Paranormal'],
        'Poderes Paranormais': ['Conhecimento', 'Energia', 'Morte', 'Sangue', 'Varia'],
        Origens: ['Poder de Origem']
      };
    }
    if (!window.HABILIDADES_CATEGORIAS.Origens) {
      window.HABILIDADES_CATEGORIAS.Origens = ['Poder de Origem'];
    }
  }

  function mergeArquivosSecretosIntoCatalog() {
    if (typeof ARQUIVOS_SECRETOS === 'undefined' || !ARQUIVOS_SECRETOS.length) return 0;
    ensureCatalogGlobals();
    var added = 0;
    ARQUIVOS_SECRETOS.forEach(function (e) {
      if (!e || !e.nome) return;
      if (e.tipo !== 'trilha' && e.tipo !== 'poder') return;

      var cls = e.classe || (e.tipo === 'trilha' ? 'Ocultista' : 'Poderes Paranormais');
      if (cls !== 'Combatente' && cls !== 'Especialista' && cls !== 'Ocultista' && cls !== 'Poderes Paranormais' && cls !== 'Origens') {
        if (/combatente/i.test(cls)) cls = 'Combatente';
        else if (/especialista/i.test(cls)) cls = 'Especialista';
        else if (/ocultista/i.test(cls)) cls = 'Ocultista';
        else cls = 'Poderes Paranormais';
      }

      var categoria;
      if (e.tipo === 'trilha') {
        categoria = e.trilha || e.nome;
      } else if (e.elemento) {
        categoria = e.elemento;
        cls = 'Poderes Paranormais';
      } else if (cls === 'Combatente') {
        categoria = 'Poderes de Combatente';
      } else if (cls === 'Especialista') {
        categoria = 'Poderes de Especialista';
      } else if (cls === 'Ocultista') {
        categoria = 'Poderes de Ocultista';
      } else {
        categoria = 'Varia';
      }

      if (!window.HABILIDADES_CATEGORIAS[cls]) window.HABILIDADES_CATEGORIAS[cls] = [];
      if (window.HABILIDADES_CATEGORIAS[cls].indexOf(categoria) === -1) {
        window.HABILIDADES_CATEGORIAS[cls].push(categoria);
      }

      var exists = HABILIDADES_CATALOG.some(function (h) {
        return h.classe === cls && h.nome === e.nome;
      });
      if (exists) return;

      HABILIDADES_CATALOG.push({
        nome: e.nome,
        classe: cls,
        categoria: categoria,
        nex: e.nex || '',
        pe: '',
        desc: e.desc || ''
      });
      added++;
    });
    return added;
  }

  function addHabToSheet(item) {
    if (typeof state === 'undefined') {
      alert('Ficha ainda não carregou.');
      return false;
    }
    if (!Array.isArray(state.habilidades)) state.habilidades = [];
    var nome = item.nome || '';
    var already = state.habilidades.some(function (h) {
      return String(h.nome || '').toLowerCase() === nome.toLowerCase();
    });
    if (already) return false;

    var meta = [
      item.nex ? 'NEX ' + item.nex : '',
      item.pe && item.pe !== '—' ? 'Custo: ' + item.pe : '',
      item.categoria || ''
    ].filter(Boolean).join(' · ');

    state.habilidades.push({
      nome: nome,
      desc: (item.desc || '') + (meta ? '\n(' + meta + ')' : ''),
      pe: item.pe || '',
      nex: item.nex || ''
    });

    if (typeof scheduleSave === 'function') scheduleSave();
    else if (typeof saveState === 'function') saveState();
    if (typeof renderHabilidades === 'function') renderHabilidades();
    if (typeof renderRecursos === 'function') renderRecursos();
    return true;
  }

  window.addHabToSheet = addHabToSheet;

  function bindCatalogButtons() {
    var list = $('#hab-catalog-list');
    if (!list) return;

    list.querySelectorAll('.btn-add-hab').forEach(function (btn) {
      if (btn._habBound) return;
      btn._habBound = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var nome = btn.getAttribute('data-nome') || btn.dataset.nome || '';
        if (!nome || typeof HABILIDADES_CATALOG === 'undefined') return;
        var item = HABILIDADES_CATALOG.find(function (h) {
          return h.nome === nome;
        });
        if (!item) {
          item = { nome: nome, desc: '', pe: '', nex: '', categoria: '' };
        }
        var ok = addHabToSheet(item);
        if (ok) {
          btn.classList.add('have');
          btn.textContent = '✓';
          btn.title = 'Já adicionada';
        }
      });
    });
  }

  function bindClassTabs() {
    $$('.hab-class-tab').forEach(function (btn) {
      if (btn._habBound) return;
      btn._habBound = true;
      btn.addEventListener('click', function () {
        $$('.hab-class-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        setTimeout(function () {
          if (typeof window.__habRenderList === 'function') window.__habRenderList();
          bindCatalogButtons();
        }, 50);
      });
    });
  }

  function bindPersonalizada() {
    var btn = $('#btn-add-hab');
    if (!btn || btn._habBound) return;
    var clone = btn.cloneNode(true);
    clone._habBound = true;
    btn.parentNode.replaceChild(clone, btn);
    clone.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof state === 'undefined') return;
      if (!Array.isArray(state.habilidades)) state.habilidades = [];
      state.habilidades.push({ nome: '', desc: '', pe: '' });
      if (typeof renderHabilidades === 'function') renderHabilidades();
      if (typeof scheduleSave === 'function') scheduleSave();
      var mineTab = document.querySelector('.hab-subtab[data-hab-view="mine"]');
      if (mineTab) mineTab.click();
    });
  }

  function enhanceHabilidadesUI() {
    var list = $('#hab-catalog-list');
    if (list && !list._habObserver) {
      var obs = new MutationObserver(function () {
        bindCatalogButtons();
      });
      obs.observe(list, { childList: true, subtree: true });
      list._habObserver = obs;
    }
  }

  function tryInitHabilidadesUI() {
    ensureCatalogGlobals();
    mergeArquivosSecretosIntoCatalog();

    if (typeof window.initHabilidadesUI === 'function') {
      try { window.initHabilidadesUI(); } catch (e) {}
    }

    bindClassTabs();
    bindPersonalizada();
    bindCatalogButtons();
    enhanceHabilidadesUI();

    var list = $('#hab-catalog-list');
    if (list && !list.children.length) {
      var tab = document.querySelector('.hab-class-tab[data-hab-class="Combatente"]') ||
                document.querySelector('.hab-class-tab');
      if (tab) tab.click();
    }
  }

  function patchArquivosSecretos() {
    window.addArquivoSecretoToSheet = function (e) {
      if (!e) return;
      if (e.tipo === 'ritual') {
        if (typeof state === 'undefined') return;
        state.rituais = state.rituais || [];
        state.rituais.push({
          nome: e.nome,
          elemento: e.elemento || '',
          circulo: e.circulo || '',
          execucao: '', alcance: '', area: '', alvo: '', duracao: '',
          efeito: e.desc || '', resistencia: '', dados: '',
          dadosDiscente: '', dadosVerdadeiro: '', imagem: '',
          desc: e.desc || ''
        });
        if (typeof renderRituais === 'function') renderRituais();
        if (typeof scheduleSave === 'function') scheduleSave();
        return;
      }
      if (e.tipo === 'item') {
        if (typeof state === 'undefined') return;
        state.itens = state.itens || [];
        state.itens.push({
          nome: e.nome,
          tipo: 'geral',
          categoria: e.categoria || '0',
          espacos: e.espacos || '1',
          desc: e.desc || ''
        });
        if (typeof renderItens === 'function') renderItens();
        if (typeof scheduleSave === 'function') scheduleSave();
        return;
      }
      var categoria = '';
      if (e.tipo === 'trilha' && e.trilha) categoria = e.trilha;
      else if (e.tipo === 'origem') categoria = 'Origem';
      else if (e.tipo === 'regra') categoria = 'Regra';
      else if (e.tipo === 'poder') categoria = 'Poder';
      else categoria = e.tipo || '';
      if (e.classe && categoria) categoria = categoria + ' · ' + e.classe;
      else if (e.classe) categoria = e.classe;
      addHabToSheet({
        nome: e.nome || '',
        desc: e.desc || '',
        pe: e.pe || '',
        nex: e.nex || '',
        categoria: categoria
      });
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
    list.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('change', function (e) {
        var idx = +e.target.dataset.idx;
        var field = e.target.dataset.field;
        if (!state.habilidades[idx]) return;
        state.habilidades[idx][field] = e.target.value;
        if (typeof scheduleSave === 'function') scheduleSave();
      });
    });
    list.querySelectorAll('.btn-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
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
          installRenderOverride();
          if (typeof renderHabilidades === 'function') renderHabilidades();
        }, 800);
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

/* Merge itens dos Arquivos Secretos no catálogo de inventário */
(function () {
  function merge() {
    if (typeof ARQUIVOS_SECRETOS === 'undefined' || !ARQUIVOS_SECRETOS.length) return;
    if (typeof ITENS_CATALOG === 'undefined') return;
    var added = 0;
    ARQUIVOS_SECRETOS.forEach(function (e) {
      if (!e || e.tipo !== 'item') return;
      var exists = ITENS_CATALOG.some(function (i) { return (i.nome || '').toLowerCase() === (e.nome || '').toLowerCase(); });
      if (exists) return;
      ITENS_CATALOG.push({
        nome: e.nome,
        tipo: 'paranormal',
        categoria: e.categoria || 'I',
        espacos: e.espacos || '1',
        desc: e.desc || '',
        livro: e.livro || 'Arquivos Secretos'
      });
      added++;
    });
    if (added && typeof window.refreshItensCatalog === 'function') {
      try { window.refreshItensCatalog(); } catch (err) {}
    }
  }
  var n = 0;
  var t = setInterval(function () {
    n++;
    if ((typeof ARQUIVOS_SECRETOS !== 'undefined' && ARQUIVOS_SECRETOS.length && typeof ITENS_CATALOG !== 'undefined') || n > 60) {
      clearInterval(t);
      merge();
    }
  }, 150);
})();
