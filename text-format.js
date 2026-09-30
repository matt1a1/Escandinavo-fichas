/* text-format.js — corretor + negrito/itálico/sublinhado nos textos da ficha */
(function () {
  const RICH_IDS = ['aparencia', 'personalidade', 'historico', 'objetivo', 'anotacoes'];

  function applySpellcheck(root) {
    (root || document).querySelectorAll('textarea, input[type="text"], input:not([type])').forEach((el) => {
      el.setAttribute('spellcheck', 'true');
      el.setAttribute('lang', 'pt-BR');
    });
  }

  function wrapSelection(cmd) {
    document.execCommand(cmd, false, null);
  }

  function makeToolbar(forId) {
    const bar = document.createElement('div');
    bar.className = 'tf-toolbar';
    bar.innerHTML =
      '<button type="button" class="tf-btn" data-cmd="bold" title="Negrito (Ctrl+B)"><b>N</b></button>' +
      '<button type="button" class="tf-btn" data-cmd="italic" title="Itálico (Ctrl+I)"><i>I</i></button>' +
      '<button type="button" class="tf-btn" data-cmd="underline" title="Sublinhar (Ctrl+U)"><u>S</u></button>' +
      '<span class="tf-hint">selecione o texto e clique</span>';
    bar.querySelectorAll('.tf-btn').forEach((btn) => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const ed = document.getElementById(forId);
        if (ed) ed.focus();
        wrapSelection(btn.dataset.cmd);
        ed && ed.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    return bar;
  }

  function enhanceRichField(id) {
    const ta = document.getElementById(id);
    if (!ta || ta.dataset.tfEnhanced) return;
    ta.dataset.tfEnhanced = '1';

    const wrap = document.createElement('div');
    wrap.className = 'tf-wrap';
    ta.parentNode.insertBefore(wrap, ta);

    const toolbar = makeToolbar(id);
    wrap.appendChild(toolbar);

    const ed = document.createElement('div');
    ed.id = id;
    ed.className = (ta.className || '') + ' tf-editor';
    ed.contentEditable = 'true';
    ed.setAttribute('spellcheck', 'true');
    ed.setAttribute('lang', 'pt-BR');
    ed.setAttribute('role', 'textbox');
    ed.setAttribute('data-rich', '1');
    ed.innerHTML = ta.value ? ta.value.replace(/\n/g, '<br>') : '';

    ta.style.display = 'none';
    ta.removeAttribute('id');
    ta.dataset.tfOriginal = id;

    wrap.appendChild(ed);
    wrap.appendChild(ta);

    Object.defineProperty(ed, 'value', {
      get() { return ed.innerHTML; },
      set(v) {
        const s = v == null ? '' : String(v);
        if (s && !/[<>]/.test(s)) ed.innerHTML = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
        else ed.innerHTML = s;
      }
    });

    ed.addEventListener('input', () => {
      ta.value = ed.innerHTML;
      ed.dispatchEvent(new Event('change', { bubbles: true }));
    });

    ed.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase();
        if (k === 'b') { e.preventDefault(); wrapSelection('bold'); ed.dispatchEvent(new Event('input', { bubbles: true })); }
        if (k === 'i') { e.preventDefault(); wrapSelection('italic'); ed.dispatchEvent(new Event('input', { bubbles: true })); }
        if (k === 'u') { e.preventDefault(); wrapSelection('underline'); ed.dispatchEvent(new Event('input', { bubbles: true })); }
      }
    });
  }

  function injectStyles() {
    if (document.getElementById('tf-styles')) return;
    const s = document.createElement('style');
    s.id = 'tf-styles';
    s.textContent = `
      .tf-wrap { display:flex; flex-direction:column; gap:6px; width:100%; }
      .tf-toolbar {
        display:flex; align-items:center; gap:6px;
        padding:6px 8px; border-radius:8px;
        background:#14141c; border:1px solid #2a2a35;
      }
      .tf-btn {
        min-width:32px; height:28px; padding:0 8px;
        border-radius:6px; border:1px solid #2a2a35;
        background:#1a1a24; color:#e8e8f0; cursor:pointer;
        font-size:.85rem; line-height:1;
      }
      .tf-btn:hover { border-color:#7c5cff; color:#fff; background:#221f30; }
      .tf-btn b { font-weight:700; }
      .tf-btn i { font-style:italic; }
      .tf-btn u { text-decoration:underline; }
      .tf-hint { font-size:.7rem; color:#8888a0; margin-left:4px; }
      .tf-editor {
        min-height:88px; max-height:220px; overflow-y:auto;
        padding:10px 12px; border-radius:8px;
        border:1px solid #2a2a35; background:#12121a;
        color:#e8e8f0; font: inherit; line-height:1.45;
        white-space:pre-wrap; word-break:break-word;
      }
      .tf-editor:focus { outline:none; border-color:#7c5cff; box-shadow:0 0 0 2px rgba(124,92,255,.2); }
      .tf-editor b, .tf-editor strong { font-weight:700; color:#fff; }
      .tf-editor i, .tf-editor em { font-style:italic; color:#d4d4f0; }
      .tf-editor u { text-decoration:underline; text-underline-offset:2px; }
    `;
    document.head.appendChild(s);
  }

  function init() {
    injectStyles();
    applySpellcheck(document);
    RICH_IDS.forEach(enhanceRichField);
  }

  function boot() {
    if (document.getElementById('aparencia') || document.getElementById('anotacoes')) {
      init();
      return;
    }
    let n = 0;
    const t = setInterval(() => {
      n++;
      if (document.getElementById('aparencia') || n > 40) {
        clearInterval(t);
        init();
      }
    }, 100);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.TF = {
    getHtml(id) {
      const el = document.getElementById(id);
      return el ? (el.dataset.rich ? el.innerHTML : el.value) : '';
    },
    setHtml(id, html) {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.dataset.rich) el.value = html || '';
      else el.value = html || '';
    }
  };
})();
