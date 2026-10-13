/* desc-ui-patch.js — reaplica formatação legível em todas as descrições renderizadas */
(function () {
  function fmt(s) {
    if (typeof formatDescHtml === 'function') return formatDescHtml(s);
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  function reformatNode(el) {
    if (!el || el.dataset.descFmt === '1') return;
    var raw = el.getAttribute('data-raw-desc');
    if (!raw) {
      raw = el.innerText || el.textContent || '';
      el.setAttribute('data-raw-desc', raw);
    }
    if (!raw.trim()) return;
    el.innerHTML = fmt(raw);
    el.dataset.descFmt = '1';
  }

  function scan() {
    var sels = [
      '.hab-card-desc',
      '.rit-card-desc',
      '.rit-mine-desc',
      '.arq-card-desc',
      '.arq-hab-desc',
      '.catalog-item-desc',
      '.item-card-desc',
      '.cat-card-desc'
    ];
    document.querySelectorAll(sels.join(',')).forEach(reformatNode);
  }

  function observe() {
    var roots = [
      document.getElementById('hab-catalog-list'),
      document.getElementById('ritual-catalog-list'),
      document.getElementById('rituais-list'),
      document.getElementById('itens-catalog-list'),
      document.getElementById('tab-arquivos'),
      document.getElementById('arq-list')
    ].filter(Boolean);
    roots.forEach(function (root) {
      try {
        new MutationObserver(function () { scan(); }).observe(root, { childList: true, subtree: true });
      } catch (e) {}
    });
  }

  function boot() {
    scan();
    observe();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 1500);
  setTimeout(boot, 3000);
  document.addEventListener('click', function () { setTimeout(scan, 50); }, true);
})();
