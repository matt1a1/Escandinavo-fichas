/* camp-card-fix.js — card inteiro abre a campanha + botão Acessar sempre visível (mobile) */
(function () {
  if (window.__campCardFix) return;
  window.__campCardFix = true;

  function ensureCss() {
    if (document.getElementById('camp-card-fix-css')) return;
    var s = document.createElement('style');
    s.id = 'camp-card-fix-css';
    s.textContent = [
      '.camp-card{cursor:pointer;-webkit-tap-highlight-color:transparent;}',
      '.camp-card:active{opacity:.92;}',
      '.camp-body .btn-acessar{',
      '  display:block!important;visibility:visible!important;opacity:1!important;',
      '  margin-top:12px!important;width:100%!important;text-align:center!important;',
      '  background:var(--ag-accent,#8b5cf6)!important;color:#fff!important;',
      '  border:none!important;border-radius:8px!important;',
      '  padding:12px 16px!important;font-weight:600!important;font-size:.9rem!important;',
      '  min-height:44px!important;line-height:1.2!important;cursor:pointer!important;',
      '  box-sizing:border-box!important;',
      '}',
      '.camp-cover{min-height:100px!important;position:relative!important;}',
      '#view-campanhas .ag-header, #view-campanhas .view-header, .campanhas-header{',
      '  flex-wrap:wrap!important;gap:8px!important;',
      '}',
      '#view-campanhas .btn-primary, #btn-nova-campanha, button.btn-primary{',
      '  white-space:nowrap!important;flex-shrink:0!important;',
      '}',
      '@media(max-width:720px){',
      '  .camp-body{padding:14px 14px 16px!important;}',
      '  .camp-body h3{font-size:1.05rem!important;}',
      '  .camp-grid{grid-template-columns:1fr!important;gap:14px!important;padding-bottom:24px!important;}',
      '  .camp-card{min-height:auto!important;}',
      '}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function bindCards() {
    ensureCss();
    var grid = document.getElementById('camp-grid');
    if (!grid) return;

    grid.querySelectorAll('.camp-card').forEach(function (card) {
      if (card.dataset.cardFix) return;
      card.dataset.cardFix = '1';

      var btn = card.querySelector('.btn-acessar');
      var body = card.querySelector('.camp-body');
      var id = null;
      if (btn) {
        id = btn.getAttribute('data-id');
      } else if (body) {
        var del = card.querySelector('.del-camp');
        id = del ? del.getAttribute('data-id') : null;
        if (id) {
          btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn-acessar';
          btn.setAttribute('data-id', id);
          btn.textContent = 'Acessar';
          body.appendChild(btn);
        }
      }
      if (!id) return;

      function openCamp(e) {
        if (e) {
          var t = e.target;
          if (t && t.closest && t.closest('.del-camp')) return;
          if (t && t.classList && t.classList.contains('del-camp')) return;
        }
        // Prefer original button handler (tem abrirCampanha no closure)
        var b = card.querySelector('.btn-acessar');
        if (b && e && e.currentTarget === card) {
          // card click → aciona botão sem reentrar
          if (typeof window.__campAbrir === 'function') {
            window.__campAbrir(id);
            return;
          }
        }
        if (typeof window.__campAbrir === 'function') {
          window.__campAbrir(id);
          return;
        }
        if (b && e && e.currentTarget === card) {
          b.click();
        }
      }

      card.addEventListener('click', function (e) {
        if (e.target && e.target.closest && e.target.closest('.del-camp')) return;
        if (e.target && e.target.closest && e.target.closest('.btn-acessar')) return;
        var b = card.querySelector('.btn-acessar');
        if (b) b.click();
        else if (typeof window.__campAbrir === 'function') window.__campAbrir(id);
      });
    });
  }

  function hookRender() {
    var orig = window.renderCampanhas;
    if (typeof orig !== 'function' || orig.__cardFixHooked) return;
    var wrapped = function () {
      var r = orig.apply(this, arguments);
      setTimeout(bindCards, 0);
      setTimeout(bindCards, 150);
      setTimeout(bindCards, 500);
      return r;
    };
    wrapped.__cardFixHooked = true;
    window.renderCampanhas = wrapped;
    if (window.__escCampanhasRender) {
      window.__escCampanhasRender = wrapped;
    }
  }

  // Tenta expor abrirCampanha a partir do handler do botão
  function tryExposeOpen() {
    if (window.__campAbrir) return;
    var btn = document.querySelector('.camp-card .btn-acessar');
    if (!btn) return;
    // não há como extrair o closure; o click no botão já funciona
  }

  function boot() {
    ensureCss();
    hookRender();
    bindCards();
    tryExposeOpen();
  }

  var n = 0;
  var iv = setInterval(function () {
    boot();
    if (++n > 40) clearInterval(iv);
  }, 350);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  try {
    var grid = document.getElementById('camp-grid');
    if (grid) {
      new MutationObserver(function () { bindCards(); }).observe(grid, { childList: true, subtree: true });
    }
  } catch (e) {}

  console.log('[camp-card-fix] ativo');
})();
