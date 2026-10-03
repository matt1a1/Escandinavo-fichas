/* ficha-mascaras.js — UI da máscara agora é INLINE no ficha.html.
 * Este arquivo só garante sem-limites + patches de PV/PE/Defesa.
 * NÃO remove nem cria #msk-box (para não competir com o inline).
 */
(function () {
  var PV = 20, PE = 10, DEF = 10;

  function isMask() {
    return !!(window.state && state.tipoFicha === 'mascaras');
  }
  function on() {
    return !!(window.state && state.mascaraAtiva);
  }

  function unlock() {
    if (!isMask()) return;
    window.isFichaCustom = function () {
      return !!(window.state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
    };
  }

  function patch() {
    if (typeof calcularRecursos === 'function' && !calcularRecursos.__msk) {
      var o = calcularRecursos;
      window.calcularRecursos = function () {
        var r = o.apply(this, arguments);
        if (on()) { r.pvMax = (r.pvMax || 1) + PV; r.peMax = (r.peMax || 1) + PE; }
        return r;
      };
      window.calcularRecursos.__msk = true;
    }
    if (typeof calcularDefesa === 'function' && !calcularDefesa.__msk) {
      var d = calcularDefesa;
      window.calcularDefesa = function () {
        var v = d.apply(this, arguments);
        return on() ? v + DEF : v;
      };
      window.calcularDefesa.__msk = true;
    }
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (typeof state === 'undefined') return;
    if (state.mascaraAtiva == null) state.mascaraAtiva = false;
    unlock();
    patch();
    if (n > 30) clearInterval(t);
  }, 200);
})();
