/**
 * Garante Mestre = conta Google que criou/abriu a campanha sem dono.
 * Funciona mesmo com campanhas.js antigo (CDN) sem hooks.
 */
(function () {
  var KEY = 'escandinavo-campanhas-registro';

  function uid() {
    try {
      var u = window.EscandinavoAuth && window.EscandinavoAuth.user && window.EscandinavoAuth.user();
      return u && u.uid ? u.uid : null;
    } catch (e) { return null; }
  }
  function nome() {
    try {
      return (window.EscandinavoAuth && window.EscandinavoAuth.displayName && window.EscandinavoAuth.displayName()) || '';
    } catch (e) { return ''; }
  }
  function foto() {
    try {
      var u = window.EscandinavoAuth && window.EscandinavoAuth.user && window.EscandinavoAuth.user();
      return (u && u.photoURL) || '';
    } catch (e) { return ''; }
  }
  function ler() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { return []; }
  }
  function salvar(lista) {
    localStorage.setItem(KEY, JSON.stringify(lista));
  }
  function get(id) {
    return ler().find(function (c) { return c && c.id === id; }) || null;
  }
  function atualizar(id, patch) {
    var lista = ler();
    var i = lista.findIndex(function (c) { return c && c.id === id; });
    if (i < 0) return;
    lista[i] = Object.assign({}, lista[i], patch || {});
    salvar(lista);
  }
  function claim(id) {
    var u = uid();
    if (!u || !id) return;
    var c = get(id);
    if (!c || c.ownerUid) return;
    var members = (c.members || []).slice();
    if (!members.some(function (m) { return m.uid === u; })) {
      members.unshift({ uid: u, nome: nome() || 'Mestre', foto: foto(), role: 'mestre', joinedAt: Date.now() });
    }
    atualizar(id, { ownerUid: u, ownerName: nome() || 'Mestre', members: members });
  }

  if (typeof window.__campLerCampanhas !== 'function') window.__campLerCampanhas = ler;
  if (typeof window.__campSalvarCampanhas !== 'function') window.__campSalvarCampanhas = salvar;
  if (typeof window.__campGetCampanha !== 'function') window.__campGetCampanha = get;
  if (typeof window.__campAtualizar !== 'function') window.__campAtualizar = atualizar;
  if (typeof window.__campEscape !== 'function') {
    window.__campEscape = function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
  }

  function onDetailVisible() {
    var detail = document.getElementById('view-camp-detail');
    if (!detail || detail.hidden) return;
    var nomeEl = document.getElementById('camp-detail-nome');
    var title = (nomeEl && (nomeEl.textContent || '')) || '';
    title = title.replace(/\s*✎\s*$/, '').trim();
    var lista = ler();
    var c = null;
    if (window.__campGetAtualId) {
      var id = window.__campGetAtualId();
      if (id) c = get(id);
    }
    if (!c && window.__campAtualId) c = get(window.__campAtualId);
    if (!c && title) {
      c = lista.find(function (x) { return (x.nome || '') === title; }) || null;
    }
    if (!c && lista.length === 1) c = lista[0];
    if (!c) return;
    claim(c.id);
    window.__campAtualId = c.id;
    window.__campGetAtualId = function () { return window.__campAtualId; };
    if (typeof window.__campAbrir !== 'function') {
      window.__campAbrir = function (id) {
        window.__campAtualId = id;
        claim(id);
        if (typeof window.__campEnhanceOpen === 'function') {
          try { window.__campEnhanceOpen(id); } catch (e) {}
        }
      };
    }
    if (typeof window.__campEnhanceOpen === 'function') {
      try { window.__campEnhanceOpen(c.id); } catch (e) {}
    }
    try {
      var metaEl = document.getElementById('camp-detail-meta');
      var cc = get(c.id);
      if (metaEl && cc && uid() && cc.ownerUid === uid()) {
        var txt = metaEl.textContent || '';
        if (txt.indexOf('Mestre') === -1) {
          metaEl.textContent = txt.replace(/\s*·\s*Você é.*$/, '') + ' · Você é o Mestre';
        }
      }
    } catch (e) {}
  }

  var obs = new MutationObserver(function () { setTimeout(onDetailVisible, 50); });
  function startObs() {
    var detail = document.getElementById('view-camp-detail');
    if (detail) obs.observe(detail, { attributes: true, attributeFilter: ['hidden'] });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      startObs();
      setTimeout(onDetailVisible, 500);
    });
  } else {
    startObs();
    setTimeout(onDetailVisible, 500);
  }

  var _set = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    _set(key, value);
    if (key !== KEY) return;
    try {
      var u = uid();
      if (!u) return;
      var lista = JSON.parse(value || '[]') || [];
      var changed = false;
      lista.forEach(function (c, i) {
        if (c && !c.ownerUid) {
          lista[i] = Object.assign({}, c, {
            ownerUid: u,
            ownerName: nome() || 'Mestre',
            members: c.members && c.members.length ? c.members : [{
              uid: u, nome: nome() || 'Mestre', foto: foto(), role: 'mestre', joinedAt: Date.now()
            }]
          });
          changed = true;
        }
      });
      if (changed) _set(KEY, JSON.stringify(lista));
    } catch (e) {}
  };

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest && e.target.closest('#btn-camp-convidar');
    if (!btn) return;
    var detail = document.getElementById('view-camp-detail');
    if (!detail || detail.hidden) return;
    var lista = ler();
    var c = null;
    if (window.__campGetAtualId) c = get(window.__campGetAtualId());
    if (!c && window.__campAtualId) c = get(window.__campAtualId);
    if (!c && lista.length === 1) c = lista[0];
    if (!c) {
      var nomeEl = document.getElementById('camp-detail-nome');
      var title = (nomeEl && nomeEl.textContent || '').replace(/\s*✎\s*$/, '').trim();
      if (title) c = lista.find(function (x) { return (x.nome || '') === title; }) || null;
    }
    if (!c) return;
    if (!uid()) {
      e.preventDefault();
      e.stopPropagation();
      alert('Faça login com o Google para convidar.');
      return;
    }
    claim(c.id);
    c = get(c.id) || c;
    window.__campAtualId = c.id;
    if (c.ownerUid && c.ownerUid !== uid()) {
      e.preventDefault();
      e.stopPropagation();
      alert('Apenas o Mestre pode convidar.');
      return;
    }
    if (!c.inviteCode) {
      var code = '';
      var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      for (var i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
      atualizar(c.id, { inviteCode: code });
    }
  }, true);

  console.log('[campanhas-owner] hooks + claim ativos');
})();
