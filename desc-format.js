/* desc-format.js — formatação legível de descrições oficiais (parágrafos + N/I/S) */
(function (root) {
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDescHtml(raw) {
    if (raw == null || raw === '') return '';
    var s = String(raw);
    if (/<(br|p|b|i|em|strong|u)\b/i.test(s) && !/script/i.test(s)) {
      return s;
    }
    s = escapeHtml(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([^_]+)__/g, '<u>$1</u>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    s = s.replace(
      /(Pré-?requisitos?:|Requer(?:e)?(?:\s+\d+º\s+círculo)?|Custo:|Alcance:|Execução:|Duração:|Alvo:|Resistência:)/gi,
      '<em>$1</em>'
    );
    s = s.replace(
      /(^|<br>|\n)\s*(Normal|Discente|Verdadeiro|Afinidade|Efeito)(\s*[\(:])/gim,
      '$1<strong>$2</strong>$3'
    );
    s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    s = s.replace(/\n{2,}/g, '</p><p class="desc-p">');
    s = s.replace(/\n/g, '<br>');
    if (s.indexOf('</p>') >= 0) {
      s = '<p class="desc-p">' + s + '</p>';
    }
    return s;
  }

  function injectCss() {
    if (document.getElementById('desc-format-css')) return;
    var st = document.createElement('style');
    st.id = 'desc-format-css';
    st.textContent = [
      '.hab-card-desc, .rit-card-desc, .rit-mine-desc, .arq-card-desc, .arq-hab-desc, .item-card-desc, .cat-card-desc {',
      '  white-space: normal !important;',
      '  line-height: 1.55 !important;',
      '  color: #c8c8d4 !important;',
      '  font-size: 0.84rem !important;',
      '  word-break: break-word;',
      '}',
      '.hab-card-desc .desc-p, .rit-card-desc .desc-p, .arq-card-desc .desc-p, .arq-hab-desc .desc-p {',
      '  margin: 0 0 0.65em;',
      '}',
      '.hab-card-desc .desc-p:last-child, .rit-card-desc .desc-p:last-child { margin-bottom: 0; }',
      '.hab-card-desc strong, .rit-card-desc strong, .arq-card-desc strong, .arq-hab-desc strong {',
      '  color: #e8e8f0; font-weight: 700;',
      '}',
      '.hab-card-desc em, .rit-card-desc em, .arq-card-desc em, .arq-hab-desc em {',
      '  color: #b8b0d8; font-style: italic;',
      '}',
      '.hab-card-desc u, .rit-card-desc u, .arq-card-desc u { text-underline-offset: 2px; }'
    ].join('\n');
    document.head.appendChild(st);
  }

  root.formatDescHtml = formatDescHtml;
  root.escapeHtmlDesc = escapeHtml;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCss);
  } else {
    injectCss();
  }
  setTimeout(injectCss, 800);
  setTimeout(injectCss, 2000);
})(typeof window !== 'undefined' ? window : this);
