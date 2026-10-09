// Garante que ao entrar no convite o nome do Google vai para members e sincroniza
(function () {
  function uid() {
    try {
      var u = window.EscandinavoAuth && EscandinavoAuth.user && EscandinavoAuth.user();
      return u && u.uid ? u.uid : null;
    } catch (e) { return null; }
  }
  function nomeUser() {
    try {
      if (window.EscandinavoAuth && EscandinavoAuth.displayName) {
        var n = EscandinavoAuth.displayName();
        if (n) return n;
      }
    } catch (e) {}
    try {
      var u = EscandinavoAuth && EscandinavoAuth.user && EscandinavoAuth.user();
      if (u && (u.displayName || u.email)) return u.displayName || u.email;
    } catch (e) {}
    try {
      var fu = firebase.auth().currentUser;
      if (fu) return fu.displayName || fu.email || 'Jogador';
    } catch (e) {}
    return 'Jogador';
  }
  function fotoUser() {
    try {
      var u = window.EscandinavoAuth && EscandinavoAuth.user && EscandinavoAuth.user();
      if (u && u.photoURL) return u.photoURL;
    } catch (e) {}
    try {
      var fu = firebase.auth().currentUser;
      if (fu && fu.photoURL) return fu.photoURL;
    } catch (e) {}
    return '';
  }
  function wrap() {
    if (!window.CampanhasAPI || !window.CampanhasAPI.processarConvite) return false;
    if (window.CampanhasAPI._joinFix) return true;
    var orig = window.CampanhasAPI.processarConvite;
    window.CampanhasAPI.processarConvite = async function (code) {
      await orig(code);
      try {
        var KEY = 'escandinavo-campanhas-registro';
        var lista = JSON.parse(localStorage.getItem(KEY) || '[]') || [];
        var c = lista.find(function (x) { return x && x.inviteCode === code; });
        if (!c) {
          lista.sort(function (a, b) { return (b.updatedAt || b.criadaEm || 0) - (a.updatedAt || a.criadaEm || 0); });
          c = lista[0];
        }
        if (!c || !uid()) return;
        var members = (c.members || []).slice();
        var idx = members.findIndex(function (m) { return m && m.uid === uid(); });
        var member = { uid: uid(), nome: nomeUser(), foto: fotoUser(), role: c.ownerUid === uid() ? 'mestre' : 'jogador', joinedAt: Date.now() };
        if (idx < 0) members.push(member);
        else {
          members[idx] = Object.assign({}, members[idx], { nome: member.nome, foto: member.foto || members[idx].foto });
        }
        c.members = members;
        var i = lista.findIndex(function (x) { return x.id === c.id; });
        if (i >= 0) { lista[i] = c; localStorage.setItem(KEY, JSON.stringify(lista)); }
        if (typeof window.__campAtualizar === 'function') window.__campAtualizar(c.id, { members: members });
        try {
          if (window.firebase && firebase.apps && firebase.apps.length) {
            await firebase.firestore().collection('campanhas_shared').doc(c.id).set({
              members: members,
              updatedAt: Date.now()
            }, { merge: true });
          }
        } catch (e) { console.warn('[join-fix] firestore', e); }
        if (typeof window.__campRenderJogadores === 'function') window.__campRenderJogadores();
        if (typeof window.__campAbrir === 'function') window.__campAbrir(c.id);
      } catch (e) { console.warn('[join-fix]', e); }
    };
    window.CampanhasAPI._joinFix = true;
    return true;
  }
  function start() {
    if (!wrap()) {
      var t = 0, iv = setInterval(function () {
        if (wrap() || ++t > 40) clearInterval(iv);
      }, 200);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
