/** Impede pushMembers/syncShared de apagar agentes do outro jogador */
(function () {
  try {
    if (!window.firebase || !firebase.firestore) return;
    var proto = firebase.firestore.DocumentReference.prototype;
    if (proto.set && !proto.set._agMerge) {
      var orig = proto.set;
      proto.set = function (data, opts) {
        var p = '';
        try { p = this.path || ''; } catch (e) {}
        if (data && data.agentes && Array.isArray(data.agentes) && p.indexOf('campanhas_shared/') === 0) {
          if (data.members && !data.__forceAgentes) {
            data = Object.assign({}, data);
            delete data.agentes;
            delete data.agentesMeta;
            delete data.npcs;
          }
        }
        return orig.call(this, data, opts);
      };
      proto.set._agMerge = true;
      console.log('[no-overwrite] firestore set protegido');
    }
  } catch (e) { console.warn('[no-overwrite]', e); }
})();
