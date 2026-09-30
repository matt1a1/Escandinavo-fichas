/* attrs-wheel.js — roda de atributos estilo CRIS */
(function () {
  // Ordem visual no círculo (sentido horário, AGI no topo)
  // Ângulo 0 = topo
  const ORDER = [
    { key: 'agi', short: 'AGI', angle: -90 },   // topo
    { key: 'int', short: 'INT', angle: -18 },   // topo-direita
    { key: 'vig', short: 'VIG', angle: 54 },    // baixo-direita
    { key: 'pre', short: 'PRE', angle: 126 },   // baixo-esquerda
    { key: 'for', short: 'FOR', angle: 198 },   // topo-esquerda
  ];

  function injectStyles() {
    if (document.getElementById('attrs-wheel-css')) return;
    const s = document.createElement('style');
    s.id = 'attrs-wheel-css';
    s.textContent = `
      .card.attributes { position: relative; }
      .card.attributes > h2 { display: none; }

      .attr-wheel {
        position: relative;
        width: 100%;
        max-width: 220px;
        aspect-ratio: 1;
        margin: 4px auto 6px;
      }
      .attr-wheel-ring {
        position: absolute;
        inset: 12%;
        border-radius: 50%;
        border: 1px solid rgba(180,180,200,0.18);
        pointer-events: none;
      }
      .attr-wheel-ring::before {
        content: '';
        position: absolute;
        inset: 10%;
        border-radius: 50%;
        border: 1px dashed rgba(180,180,200,0.12);
      }
      .attr-wheel-ring::after {
        content: '';
        position: absolute;
        inset: -8%;
        border-radius: 50%;
        border: 1px solid rgba(180,180,200,0.1);
      }
      .attr-wheel-center {
        position: absolute;
        left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        width: 38%;
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle at 40% 35%, #1c1c28 0%, #0c0c12 70%);
        border: 1px solid rgba(200,200,220,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        pointer-events: none;
        box-shadow: 0 0 20px rgba(124,92,255,0.12), inset 0 0 12px rgba(0,0,0,0.5);
      }
      .attr-wheel-center span {
        font-size: 0.55rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        color: #c8c8d8;
        text-transform: uppercase;
        line-height: 1.15;
      }

      .attr-wheel .attr-item {
        position: absolute;
        width: 56px;
        height: 56px;
        margin: 0;
        padding: 0;
        border-radius: 50%;
        background: radial-gradient(circle at 40% 30%, #1a1a24 0%, #0e0e14 75%);
        border: 1px solid rgba(200,200,220,0.28);
        box-shadow: 0 0 10px rgba(0,0,0,0.45), inset 0 0 8px rgba(0,0,0,0.35);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1px;
        z-index: 2;
      }
      .attr-wheel .attr-item:hover {
        border-color: rgba(124,92,255,0.55);
        box-shadow: 0 0 14px rgba(124,92,255,0.2);
      }
      .attr-wheel .attr-label {
        font-size: 0.58rem;
        letter-spacing: 0.08em;
        color: #a0a0b8;
        font-weight: 700;
        line-height: 1;
      }
      .attr-wheel .attr-controls {
        display: flex;
        align-items: center;
        gap: 2px;
      }
      .attr-wheel .attr-btn {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        font-size: 0.65rem;
        padding: 0;
        line-height: 1;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.1);
        color: #b0b0c0;
      }
      .attr-wheel .attr-btn:hover {
        border-color: var(--accent, #7c5cff);
        color: #fff;
      }
      .attr-wheel .attr-value {
        min-width: 14px;
        font-size: 0.95rem;
        font-weight: 700;
        color: #f0f0f5;
        line-height: 1;
      }

      .card.attributes .points-left {
        text-align: center;
        font-size: 0.65rem;
        margin: 0 0 2px;
      }
      .card.attributes .attr-nex-hint {
        display: block;
        font-size: 0.6rem;
        color: var(--text-dim, #8888a0);
        margin-top: 2px;
      }

      .attr-wheel-svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }
      .attr-wheel-svg line {
        stroke: rgba(180,180,200,0.2);
        stroke-width: 1;
      }
    `;
    document.head.appendChild(s);
  }

  function buildWheel() {
    const grid = document.querySelector('.card.attributes .attr-grid');
    if (!grid || grid.dataset.wheel === '1') return;
    grid.dataset.wheel = '1';

    injectStyles();

    const wheel = document.createElement('div');
    wheel.className = 'attr-wheel';

    const ring = document.createElement('div');
    ring.className = 'attr-wheel-ring';
    wheel.appendChild(ring);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'attr-wheel-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    ORDER.forEach((o) => {
      const rad = (o.angle * Math.PI) / 180;
      const x = 50 + Math.cos(rad) * 32;
      const y = 50 + Math.sin(rad) * 32;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '50');
      line.setAttribute('y1', '50');
      line.setAttribute('x2', String(x));
      line.setAttribute('y2', String(y));
      svg.appendChild(line);
    });
    wheel.appendChild(svg);

    const center = document.createElement('div');
    center.className = 'attr-wheel-center';
    center.innerHTML = '<span>ATRI-<br>BUTOS</span>';
    wheel.appendChild(center);

    const items = {};
    grid.querySelectorAll('.attr-item').forEach((el) => {
      items[el.dataset.attr] = el;
    });

    ORDER.forEach((o) => {
      const el = items[o.key];
      if (!el) return;
      const label = el.querySelector('.attr-label');
      if (label) label.textContent = o.short;

      const rad = (o.angle * Math.PI) / 180;
      const r = 38;
      const x = 50 + Math.cos(rad) * r;
      const y = 50 + Math.sin(rad) * r;
      el.style.left = x + '%';
      el.style.top = y + '%';
      el.style.transform = 'translate(-50%, -50%)';

      wheel.appendChild(el);
    });

    grid.parentNode.insertBefore(wheel, grid);
    grid.style.display = 'none';
  }

  function boot() {
    if (document.querySelector('.card.attributes .attr-grid')) {
      buildWheel();
      return;
    }
    let n = 0;
    const t = setInterval(() => {
      n++;
      if (document.querySelector('.card.attributes .attr-grid') || n > 50) {
        clearInterval(t);
        buildWheel();
      }
    }, 80);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
