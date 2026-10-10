/* attrs-wheel.js — roda de atributos estilo CRIS (restaurada) */
(function () {
  var ORDER = [
    { key: 'agi', short: 'AGI', angle: -90 },
    { key: 'int', short: 'INT', angle: -18 },
    { key: 'vig', short: 'VIG', angle: 54 },
    { key: 'pre', short: 'PRE', angle: 126 },
    { key: 'for', short: 'FOR', angle: 198 }
  ];

  function injectStyles() {
    if (document.getElementById('attrs-wheel-css')) return;
    var s = document.createElement('style');
    s.id = 'attrs-wheel-css';
    s.textContent = [
      '.card.attributes { position: relative; overflow: visible !important; }',
      '.card.attributes > h2 { display: none !important; }',
      '.card.attributes .attr-grid { display: none !important; }',
      '.card.attributes .attr-wheel { display: block !important; }',
      '.attr-wheel {',
      '  position: relative;',
      '  width: 100%;',
      '  max-width: 220px;',
      '  aspect-ratio: 1;',
      '  margin: 4px auto 6px;',
      '}',
      '.attr-wheel-ring {',
      '  position: absolute;',
      '  inset: 12%;',
      '  border-radius: 50%;',
      '  border: 1px solid rgba(180,180,200,0.18);',
      '  pointer-events: none;',
      '}',
      '.attr-wheel-ring::before {',
      '  content: "";',
      '  position: absolute;',
      '  inset: 10%;',
      '  border-radius: 50%;',
      '  border: 1px dashed rgba(180,180,200,0.12);',
      '}',
      '.attr-wheel-ring::after {',
      '  content: "";',
      '  position: absolute;',
      '  inset: -8%;',
      '  border-radius: 50%;',
      '  border: 1px solid rgba(180,180,200,0.1);',
      '}',
      '.attr-wheel-center {',
      '  position: absolute;',
      '  left: 50%; top: 50%;',
      '  transform: translate(-50%, -50%);',
      '  width: 38%;',
      '  aspect-ratio: 1;',
      '  border-radius: 50%;',
      '  background: radial-gradient(circle at 40% 35%, #1c1c28 0%, #0c0c12 70%);',
      '  border: 1px solid rgba(200,200,220,0.25);',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  text-align: center;',
      '  pointer-events: none;',
      '  box-shadow: 0 0 20px rgba(124,92,255,0.12), inset 0 0 12px rgba(0,0,0,0.5);',
      '  z-index: 1;',
      '}',
      '.attr-wheel-center span {',
      '  font-size: 0.55rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.06em;',
      '  color: #a8a8c0;',
      '  line-height: 1.15;',
      '}',
      '.attr-wheel .attr-item {',
      '  position: absolute !important;',
      '  width: 56px;',
      '  height: 56px;',
      '  margin: 0 !important;',
      '  padding: 0 !important;',
      '  border-radius: 50% !important;',
      '  background: radial-gradient(circle at 40% 30%, #1a1a24 0%, #0e0e14 75%) !important;',
      '  border: 1px solid rgba(200,200,220,0.28) !important;',
      '  box-shadow: 0 0 10px rgba(0,0,0,0.45), inset 0 0 8px rgba(0,0,0,0.35);',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  gap: 1px !important;',
      '  z-index: 2;',
      '  min-width: 0 !important;',
      '  overflow: visible !important;',
      '}',
      '.attr-wheel .attr-item:hover {',
      '  border-color: rgba(124,92,255,0.55) !important;',
      '  box-shadow: 0 0 14px rgba(124,92,255,0.2);',
      '}',
      '.attr-wheel .attr-label {',
      '  font-size: 0.58rem !important;',
      '  letter-spacing: 0.08em;',
      '  color: #a0a0b8 !important;',
      '  font-weight: 700;',
      '  line-height: 1;',
      '  max-width: none !important;',
      '  overflow: visible !important;',
      '  text-overflow: clip !important;',
      '  white-space: nowrap !important;',
      '}',
      '.attr-wheel .attr-controls {',
      '  display: flex !important;',
      '  align-items: center;',
      '  gap: 2px;',
      '  flex-wrap: nowrap !important;',
      '}',
      '.attr-wheel .attr-btn {',
      '  width: 16px !important;',
      '  height: 16px !important;',
      '  border-radius: 4px !important;',
      '  font-size: 0.65rem !important;',
      '  padding: 0 !important;',
      '  line-height: 1 !important;',
      '  background: rgba(255,255,255,0.04);',
      '  border: 1px solid rgba(255,255,255,0.1);',
      '  color: #b0b0c0;',
      '  cursor: pointer;',
      '}',
      '.attr-wheel .attr-btn:hover {',
      '  border-color: var(--accent, #7c5cff);',
      '  color: #fff;',
      '}',
      '.attr-wheel .attr-value {',
      '  min-width: 14px !important;',
      '  font-size: 0.95rem !important;',
      '  font-weight: 700;',
      '  color: #f0f0f5;',
      '  line-height: 1;',
      '}',
      '.card.attributes .points-left {',
      '  text-align: center;',
      '  font-size: 0.65rem;',
      '  margin: 0 0 2px;',
      '}',
      '.card.attributes .attr-nex-hint {',
      '  display: block;',
      '  font-size: 0.6rem;',
      '  color: var(--text-dim, #8888a0);',
      '  margin-top: 2px;',
      '  text-align: center;',
      '}',
      '.attr-wheel-svg {',
      '  position: absolute;',
      '  inset: 0;',
      '  width: 100%;',
      '  height: 100%;',
      '  pointer-events: none;',
      '  z-index: 0;',
      '}',
      '.attr-wheel-svg line {',
      '  stroke: rgba(180,180,200,0.2);',
      '  stroke-width: 1;',
      '}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function buildWheel() {
    var card = document.querySelector('.card.attributes');
    if (!card) return false;
    if (card.querySelector('.attr-wheel') && card.querySelector('.attr-wheel .attr-item')) {
      injectStyles();
      return true;
    }
    var grid = card.querySelector('.attr-grid');
    if (!grid) return false;

    injectStyles();

    var old = card.querySelector('.attr-wheel');
    if (old) old.remove();

    var wheel = document.createElement('div');
    wheel.className = 'attr-wheel';

    var ring = document.createElement('div');
    ring.className = 'attr-wheel-ring';
    wheel.appendChild(ring);

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'attr-wheel-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    ORDER.forEach(function (o) {
      var rad = (o.angle * Math.PI) / 180;
      var x = 50 + Math.cos(rad) * 32;
      var y = 50 + Math.sin(rad) * 32;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '50');
      line.setAttribute('y1', '50');
      line.setAttribute('x2', String(x));
      line.setAttribute('y2', String(y));
      svg.appendChild(line);
    });
    wheel.appendChild(svg);

    var center = document.createElement('div');
    center.className = 'attr-wheel-center';
    center.innerHTML = '<span>ATRI-<br>BUTOS</span>';
    wheel.appendChild(center);

    var items = {};
    grid.querySelectorAll('.attr-item').forEach(function (el) {
      items[el.dataset.attr] = el;
    });

    ORDER.forEach(function (o) {
      var el = items[o.key];
      if (!el) return;
      var label = el.querySelector('.attr-label');
      if (label) label.textContent = o.short;

      var rad = (o.angle * Math.PI) / 180;
      var r = 38;
      var x = 50 + Math.cos(rad) * r;
      var y = 50 + Math.sin(rad) * r;
      el.style.left = x + '%';
      el.style.top = y + '%';
      el.style.transform = 'translate(-50%, -50%)';
      el.style.position = 'absolute';

      wheel.appendChild(el);
    });

    grid.parentNode.insertBefore(wheel, grid);
    grid.style.display = 'none';
    grid.dataset.wheel = '1';
    console.log('[attrs-wheel] rodinha montada');
    return true;
  }

  function boot() {
    injectStyles();
    if (buildWheel()) return;
    var n = 0;
    var t = setInterval(function () {
      n++;
      if (buildWheel() || n > 80) clearInterval(t);
    }, 100);
    try {
      var obs = new MutationObserver(function () {
        var card = document.querySelector('.card.attributes');
        if (card && !card.querySelector('.attr-wheel .attr-item')) buildWheel();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
  setTimeout(boot, 3000);
})();
