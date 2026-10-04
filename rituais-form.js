/* rituais-form.js — modal Novo/Editar Ritual + lista do personagem com descrição
   Substitui o formulário raso e o renderRituais que só mostrava o nome. */
(function () {
  if (window.__rituaisFormV1) return;
  window.__rituaisFormV1 = true;

  var editIdx = null;

  var EXECUCOES = ['Padrão', 'Movimento', 'Completa', 'Reação', 'Livre'];
  var ALCANCES = ['Pessoal', 'Toque', 'Curto', 'Médio', 'Longo', 'Extremo', 'Ilimitado'];
  var ELEMENTOS = ['Conhecimento', 'Energia', 'Morte', 'Sangue', 'Medo', 'Varia', 'Outro'];

  function S() {
    return (typeof state !== 'undefined') ? state : null;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function ensureStyles() {
    if (document.getElementById('rituais-form-css')) return;
    var st = document.createElement('style');
    st.id = 'rituais-form-css';
    st.textContent = [
      '#modal-ritual .modal{max-width:720px!important;width:min(720px,96vw)!important;}',
      '#modal-ritual .modal-body{display:flex;flex-direction:column;gap:12px;max-height:70vh;overflow-y:auto;}',
      '#modal-ritual .rit-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;}',
      '#modal-ritual .rit-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px 12px;}',
      '#modal-ritual .rit-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px 12px;}',
      '@media(max-width:640px){',
      '  #modal-ritual .rit-grid,#modal-ritual .rit-grid-3,#modal-ritual .rit-grid-4{grid-template-columns:1fr 1fr;}',
      '}',
      '#modal-ritual .field{margin:0;}',
      '#modal-ritual .field label{display:block;font-size:.72rem;font-weight:600;color:#9a9ab0;margin-bottom:4px;letter-spacing:.03em;text-transform:uppercase;}',
      '#modal-ritual .field input,#modal-ritual .field select,#modal-ritual .field textarea{',
      '  width:100%;box-sizing:border-box;background:#121218;border:1px solid #2a2a38;color:#e8e8ef;',
      '  border-radius:8px;padding:9px 11px;font-size:.9rem;font-family:inherit;',
      '}',
      '#modal-ritual .field textarea{min-height:120px;resize:vertical;line-height:1.45;}',
      '#modal-ritual .field input:focus,#modal-ritual .field select:focus,#modal-ritual .field textarea:focus{',
      '  outline:none;border-color:rgba(124,92,255,.55);box-shadow:0 0 0 2px rgba(124,92,255,.15);',
      '}',
      '#modal-ritual .rit-full{grid-column:1/-1;}',
      '#modal-ritual .img-upload{width:72px;height:72px;border:1px dashed #3a3a48;border-radius:10px;',
      '  display:flex;align-items:center;justify-content:center;cursor:pointer;background:#101018;overflow:hidden;}',
      '#modal-ritual .img-upload img{width:100%;height:100%;object-fit:cover;}',
      '#modal-ritual .img-placeholder{font-size:1.4rem;opacity:.5;}',
      '#rituais-list .rit-mine{background:#14141c;border:1px solid #2a2a35;border-radius:10px;margin-bottom:8px;overflow:hidden;}',
      '#rituais-list .rit-mine.open{border-color:rgba(124,92,255,.4);}',
      '#rituais-list .rit-mine-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:12px 14px;cursor:pointer;}',
      '#rituais-list .rit-mine-name{font-weight:600;color:#f0f0f5;font-size:.92rem;margin:0 0 6px;}',
      '#rituais-list .rit-mine-tags{display:flex;flex-wrap:wrap;gap:6px;}',
      '#rituais-list .rit-mine-tag{font-size:.68rem;font-weight:600;padding:2px 8px;border-radius:999px;',
      '  border:1px solid #3a3a48;color:#c8c8d8;background:rgba(255,255,255,.03);}',
      '#rituais-list .rit-mine-tag.el-Conhecimento{color:#a78bfa;border-color:rgba(167,139,250,.4);background:rgba(167,139,250,.12);}',
      '#rituais-list .rit-mine-tag.el-Energia{color:#67e8f9;border-color:rgba(103,232,249,.4);background:rgba(103,232,249,.12);}',
      '#rituais-list .rit-mine-tag.el-Morte{color:#a0a0a0;border-color:rgba(160,160,160,.4);background:rgba(160,160,160,.12);}',
      '#rituais-list .rit-mine-tag.el-Sangue{color:#ff8a8a;border-color:rgba(255,122,122,.4);background:rgba(255,122,122,.12);}',
      '#rituais-list .rit-mine-tag.el-Medo{color:#ffe08a;border-color:rgba(255,224,138,.4);background:rgba(255,224,138,.12);}',
      '#rituais-list .rit-mine-actions{display:flex;gap:6px;flex-shrink:0;}',
      '#rituais-list .rit-mine-actions button{font-size:.75rem;padding:6px 10px;border-radius:7px;cursor:pointer;border:1px solid #3a3a48;background:#1a1a24;color:#d0d0dc;}',
      '#rituais-list .rit-mine-actions .rit-edit{border-color:rgba(124,92,255,.35);color:#c4b5fd;}',
      '#rituais-list .rit-mine-actions .rit-del{border-color:rgba(239,68,68,.35);color:#fca5a5;}',
      '#rituais-list .rit-mine-body{display:none;padding:0 14px 14px;border-top:1px solid #2a2a35;margin-top:0;}',
      '#rituais-list .rit-mine.open .rit-mine-body{display:block;padding-top:12px;}',
      '#rituais-list .rit-mine-meta{font-size:.78rem;color:#9a9ab0;line-height:1.5;margin-bottom:8px;}',
      '#rituais-list .rit-mine-meta strong{color:#c4b5fd;}',
      '#rituais-list .rit-mine-desc{font-size:.84rem;color:#c8c8d8;line-height:1.55;white-space:pre-wrap;}',
      '#rituais-list .rit-mine-empty{color:#8a8a9a;font-size:.85rem;padding:8px 0;}'
    ].join('');
    document.head.appendChild(st);
  }

  function opts(list, selected) {
    return list.map(function (v) {
      return '<option value="' + esc(v) + '"' + (v === selected ? ' selected' : '') + '>' + esc(v) + '</option>';
    }).join('');
  }

  function rebuildModal() {
    var overlay = document.getElementById('modal-ritual');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modal-ritual';
      overlay.className = 'modal-overlay';
      overlay.hidden = true;
      document.body.appendChild(overlay);
    }
    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true">' +
      '  <div class="modal-header">' +
      '    <h2 id="modal-ritual-title">Novo Ritual</h2>' +
      '    <button type="button" class="modal-close" data-close="modal-ritual" aria-label="Fechar">×</button>' +
      '  </div>' +
      '  <div class="modal-body">' +
      '    <div class="field rit-full"><label>Nome *</label><input type="text" id="rit-nome" placeholder="Nome do ritual" /></div>' +
      '    <div class="rit-grid-4">' +
      '      <div class="field"><label>Elemento</label><select id="rit-elemento">' + opts(ELEMENTOS, 'Conhecimento') + '</select></div>' +
      '      <div class="field"><label>Círculo</label><select id="rit-circulo">' +
      '        <option value="1">1º</option><option value="2">2º</option><option value="3">3º</option><option value="4">4º</option>' +
      '      </select></div>' +
      '      <div class="field"><label>Execução</label><select id="rit-execucao">' + opts(EXECUCOES, 'Padrão') + '</select></div>' +
      '      <div class="field"><label>Alcance</label><select id="rit-alcance">' + opts(ALCANCES, 'Pessoal') + '</select></div>' +
      '    </div>' +
      '    <div class="rit-grid-3">' +
      '      <div class="field"><label>Área</label><input type="text" id="rit-area" placeholder="Ex: 6m" /></div>' +
      '      <div class="field"><label>Alvo</label><input type="text" id="rit-alvo" placeholder="Ex: 1 criatura" /></div>' +
      '      <div class="field"><label>Duração</label><input type="text" id="rit-duracao" placeholder="Ex: cena / sustentada" /></div>' +
      '    </div>' +
      '    <div class="rit-grid">' +
      '      <div class="field"><label>Efeito (resumo)</label><input type="text" id="rit-efeito" placeholder="Resumo curto do efeito" /></div>' +
      '      <div class="field"><label>Resistência</label><input type="text" id="rit-resistencia" placeholder="Ex: Vontade / Fortitude" /></div>' +
      '    </div>' +
      '    <div class="rit-grid-3">' +
      '      <div class="field"><label>Dados / Normal</label><input type="text" id="rit-dados" placeholder="Efeito normal" /></div>' +
      '      <div class="field"><label>Discente</label><input type="text" id="rit-dados-discente" placeholder="+PE e efeito" /></div>' +
      '      <div class="field"><label>Verdadeiro</label><input type="text" id="rit-dados-verdadeiro" placeholder="+PE e efeito" /></div>' +
      '    </div>' +
      '    <div class="field rit-full">' +
      '      <label>Descrição completa (Normal / Discente / Verdadeiro)</label>' +
      '      <textarea id="rit-desc" rows="7" placeholder="• Normal: ...\n• Discente (+X PE): ...\n• Verdadeiro (+Y PE): ..."></textarea>' +
      '    </div>' +
      '    <div class="field">' +
      '      <label>Imagem (opcional)</label>' +
      '      <div class="img-upload" id="rit-img-box">' +
      '        <input type="file" id="rit-imagem" accept="image/*" hidden />' +
      '        <img id="rit-img-preview" alt="" hidden />' +
      '        <div class="img-placeholder" id="rit-img-placeholder">🖼</div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="modal-footer">' +
      '    <button type="button" class="btn secondary" data-close="modal-ritual">Cancelar</button>' +
      '    <button type="button" class="btn primary" id="btn-salvar-ritual">Adicionar</button>' +
      '  </div>' +
      '</div>';

    overlay.querySelectorAll('[data-close="modal-ritual"]').forEach(function (btn) {
      btn.addEventListener('click', closeRitualModal);
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeRitualModal();
    });

    var saveBtn = document.getElementById('btn-salvar-ritual');
    if (saveBtn) saveBtn.addEventListener('click', saveRitual);

    var box = document.getElementById('rit-img-box');
    var file = document.getElementById('rit-imagem');
    if (box && file) {
      box.addEventListener('click', function () { file.click(); });
      file.addEventListener('change', function () {
        var f = file.files && file.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          var img = document.getElementById('rit-img-preview');
          var ph = document.getElementById('rit-img-placeholder');
          if (img) {
            img.src = reader.result;
            img.hidden = false;
            img.dataset.dataUrl = reader.result;
          }
          if (ph) ph.hidden = true;
        };
        reader.readAsDataURL(f);
      });
    }
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? String(el.value || '').trim() : '';
  }

  function setVal(id, v) {
    var el = document.getElementById(id);
    if (el) el.value = v == null ? '' : v;
  }

  function clearForm() {
    setVal('rit-nome', '');
    setVal('rit-elemento', 'Conhecimento');
    setVal('rit-circulo', '1');
    setVal('rit-execucao', 'Padrão');
    setVal('rit-alcance', 'Pessoal');
    setVal('rit-area', '');
    setVal('rit-alvo', '');
    setVal('rit-duracao', '');
    setVal('rit-efeito', '');
    setVal('rit-resistencia', '');
    setVal('rit-dados', '');
    setVal('rit-dados-discente', '');
    setVal('rit-dados-verdadeiro', '');
    setVal('rit-desc', '');
    var img = document.getElementById('rit-img-preview');
    var ph = document.getElementById('rit-img-placeholder');
    if (img) { img.hidden = true; img.removeAttribute('src'); delete img.dataset.dataUrl; }
    if (ph) ph.hidden = false;
  }

  function fillForm(r) {
    r = r || {};
    setVal('rit-nome', r.nome || '');
    setVal('rit-elemento', r.elemento || 'Conhecimento');
    setVal('rit-circulo', String(r.circulo || '1'));
    setVal('rit-execucao', r.execucao || 'Padrão');
    setVal('rit-alcance', r.alcance || 'Pessoal');
    setVal('rit-area', r.area || '');
    setVal('rit-alvo', r.alvo || '');
    setVal('rit-duracao', r.duracao || '');
    setVal('rit-efeito', r.efeito || '');
    setVal('rit-resistencia', r.resistencia || '');
    setVal('rit-dados', r.dados || '');
    setVal('rit-dados-discente', r.dadosDiscente || '');
    setVal('rit-dados-verdadeiro', r.dadosVerdadeiro || '');
    setVal('rit-desc', r.desc || '');
    var img = document.getElementById('rit-img-preview');
    var ph = document.getElementById('rit-img-placeholder');
    if (r.imagem && img) {
      img.src = r.imagem;
      img.dataset.dataUrl = r.imagem;
      img.hidden = false;
      if (ph) ph.hidden = true;
    } else {
      if (img) { img.hidden = true; img.removeAttribute('src'); delete img.dataset.dataUrl; }
      if (ph) ph.hidden = false;
    }
  }

  function readForm() {
    var img = document.getElementById('rit-img-preview');
    return {
      nome: val('rit-nome') || 'Ritual sem nome',
      elemento: val('rit-elemento') || 'Conhecimento',
      circulo: val('rit-circulo') || '1',
      execucao: val('rit-execucao') || 'Padrão',
      alcance: val('rit-alcance') || 'Pessoal',
      area: val('rit-area'),
      alvo: val('rit-alvo'),
      duracao: val('rit-duracao'),
      efeito: val('rit-efeito'),
      resistencia: val('rit-resistencia'),
      dados: val('rit-dados'),
      dadosDiscente: val('rit-dados-discente'),
      dadosVerdadeiro: val('rit-dados-verdadeiro'),
      desc: val('rit-desc'),
      imagem: (img && img.dataset.dataUrl) || ''
    };
  }

  function openRitualModal(idx) {
    ensureStyles();
    rebuildModal();
    editIdx = (idx == null || idx === undefined) ? null : idx;
    var title = document.getElementById('modal-ritual-title');
    var saveBtn = document.getElementById('btn-salvar-ritual');
    var st = S();
    if (editIdx != null && st && st.rituais && st.rituais[editIdx]) {
      if (title) title.textContent = 'Editar Ritual';
      if (saveBtn) saveBtn.textContent = 'Salvar';
      fillForm(st.rituais[editIdx]);
    } else {
      if (title) title.textContent = 'Novo Ritual';
      if (saveBtn) saveBtn.textContent = 'Adicionar';
      clearForm();
    }
    var overlay = document.getElementById('modal-ritual');
    if (overlay) {
      overlay.hidden = false;
      overlay.removeAttribute('hidden');
      overlay.style.display = 'flex';
    }
    setTimeout(function () {
      var n = document.getElementById('rit-nome');
      if (n) n.focus();
    }, 50);
  }

  function closeRitualModal() {
    var overlay = document.getElementById('modal-ritual');
    if (overlay) {
      overlay.hidden = true;
      overlay.setAttribute('hidden', '');
      overlay.style.display = 'none';
    }
    editIdx = null;
  }

  function saveRitual() {
    var st = S();
    if (!st) return;
    if (!Array.isArray(st.rituais)) st.rituais = [];
    var data = readForm();
    if (!val('rit-nome')) {
      alert('Informe o nome do ritual.');
      var n = document.getElementById('rit-nome');
      if (n) n.focus();
      return;
    }
    if (editIdx != null && st.rituais[editIdx]) {
      st.rituais[editIdx] = data;
    } else {
      st.rituais.push(data);
    }
    if (typeof scheduleSave === 'function') scheduleSave();
    else if (typeof saveState === 'function') saveState();
    renderRituaisMine();
    closeRitualModal();
  }

  function buildBodyText(r) {
    var parts = [];
    if (r.efeito) parts.push(r.efeito);
    if (r.dados) parts.push('Normal: ' + r.dados);
    if (r.dadosDiscente) parts.push('Discente: ' + r.dadosDiscente);
    if (r.dadosVerdadeiro) parts.push('Verdadeiro: ' + r.dadosVerdadeiro);
    if (r.desc) parts.push(r.desc);
    return parts.join('\n\n');
  }

  function renderRituaisMine() {
    ensureStyles();
    var list = document.getElementById('rituais-list');
    if (!list) return;
    var st = S();
    list.innerHTML = '';
    if (!st || !Array.isArray(st.rituais) || !st.rituais.length) {
      list.innerHTML = '<p class="empty-msg">Você ainda não possui rituais. Use o catálogo ou “+ Novo Ritual”.</p>';
      return;
    }
    st.rituais.forEach(function (r, i) {
      var card = document.createElement('div');
      card.className = 'rit-mine';
      var elClass = 'el-' + String(r.elemento || '').split(/[\/\s]/)[0];
      var tags = [];
      if (r.elemento) tags.push('<span class="rit-mine-tag ' + esc(elClass) + '">' + esc(r.elemento) + '</span>');
      if (r.circulo) tags.push('<span class="rit-mine-tag">' + esc(r.circulo) + 'º círculo</span>');
      if (r.execucao) tags.push('<span class="rit-mine-tag">' + esc(r.execucao) + '</span>');
      if (r.alcance) tags.push('<span class="rit-mine-tag">' + esc(r.alcance) + '</span>');

      var meta = [];
      if (r.alvo) meta.push('<strong>Alvo:</strong> ' + esc(r.alvo));
      if (r.area) meta.push('<strong>Área:</strong> ' + esc(r.area));
      if (r.duracao) meta.push('<strong>Duração:</strong> ' + esc(r.duracao));
      if (r.resistencia) meta.push('<strong>Resistência:</strong> ' + esc(r.resistencia));

      var body = buildBodyText(r);

      card.innerHTML =
        '<div class="rit-mine-head">' +
        '  <div>' +
        '    <div class="rit-mine-name">' + esc(r.nome || 'Ritual') + '</div>' +
        '    <div class="rit-mine-tags">' + tags.join('') + '</div>' +
        '  </div>' +
        '  <div class="rit-mine-actions">' +
        '    <button type="button" class="rit-edit" data-edit="' + i + '">Editar</button>' +
        '    <button type="button" class="rit-del" data-del="' + i + '">Remover</button>' +
        '  </div>' +
        '</div>' +
        '<div class="rit-mine-body">' +
        (meta.length ? '<div class="rit-mine-meta">' + meta.join(' · ') + '</div>' : '') +
        (body
          ? '<div class="rit-mine-desc">' + esc(body) + '</div>'
          : '<div class="rit-mine-empty">Sem descrição. Clique em Editar para completar.</div>') +
        '</div>';

      card.querySelector('.rit-mine-head').addEventListener('click', function (ev) {
        if (ev.target.closest && (ev.target.closest('.rit-edit') || ev.target.closest('.rit-del'))) return;
        card.classList.toggle('open');
      });
      card.querySelector('.rit-edit').addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        openRitualModal(i);
      });
      card.querySelector('.rit-del').addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (!confirm('Remover este ritual?')) return;
        st.rituais.splice(i, 1);
        if (typeof scheduleSave === 'function') scheduleSave();
        else if (typeof saveState === 'function') saveState();
        renderRituaisMine();
      });

      list.appendChild(card);
    });
  }

  window.renderRituais = renderRituaisMine;
  window.openRitualModal = openRitualModal;
  window.closeRitualModal = closeRitualModal;

  function bindAddButton() {
    var btn = document.getElementById('btn-add-ritual');
    if (!btn || btn.dataset.ritFormBound) return;
    btn.dataset.ritFormBound = '1';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openRitualModal(null);
    }, true);
  }

  function boot() {
    ensureStyles();
    bindAddButton();
    if (document.getElementById('rituais-list')) renderRituaisMine();
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    boot();
    if (n > 40) clearInterval(t);
  }, 200);
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
})();
