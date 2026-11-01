// ═══════════════════════════════════════════
//  POSTURE HISTORY — 体态历史本地加密管理
//  本地 AES-256-GCM 加密，不上传云端
// ═══════════════════════════════════════════

const PostureHistory = {
  _key: 'posture_records_v1',

  async load() {
    try { return (await SecureStore.load(this._key)) || []; }
    catch { return []; }
  },

  async save(records) {
    await SecureStore.save(this._key, records);
  },

  async add(record) {
    const records = await this.load();
    records.unshift({ ...record, id: Date.now(), createdAt: new Date().toISOString() });
    await this.save(records);
    return records;
  },

  async update(id, updates) {
    const records = await this.load();
    const idx = records.findIndex(r => r.id === id);
    if (idx !== -1) { records[idx] = { ...records[idx], ...updates }; await this.save(records); }
    return records;
  },

  async remove(id) {
    const records = await this.load();
    const filtered = records.filter(r => r.id !== id);
    await this.save(filtered);
    return filtered;
  },
};

// ── 渲染体态历史页 ──
async function renderPostureHistoryPage() {
  const container = document.getElementById('posture-history-content');
  if (!container) return;

  const records = await PostureHistory.load();
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';

  const scoreColor = s => s >= 80 ? 'var(--teal)' : s >= 60 ? 'var(--accent)' : 'var(--pop)';
  const scoreLabel = s => s >= 80
    ? (t('status_good')||'正常')
    : s >= 60 ? (t('status_warn')||'轻微') : (t('status_bad')||'需改善');

  container.innerHTML = `
    <!-- 顶部操作栏 -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <p style="font-size:0.72rem;color:var(--text3)">${
        lang==='zh'?'本地加密存储，数据不上传':
        lang==='en'?'Locally encrypted, never uploaded':
        lang==='ru'?'Локальное шифрование, не загружается':
        lang==='kk'?'Жергілікті шифрлау':
        '로컬 암호화 저장'
      } 🔒</p>
      <button class="btn btn-primary btn-sm" onclick="showAddPostureRecord()" style="width:auto">
        + ${lang==='zh'?'新增记录':lang==='en'?'Add Record':lang==='ru'?'Добавить':lang==='kk'?'Қосу':'추가'}
      </button>
    </div>

    ${records.length === 0 ? `
    <div class="empty">
      <div class="ei">🧍</div>
      <p>${lang==='zh'?'暂无体态记录\n点击「新增记录」开始追踪您的体态变化':
          lang==='en'?'No posture records yet\nTap "Add Record" to start tracking':
          lang==='ru'?'Записей нет\nНажмите "Добавить" для начала':
          lang==='kk'?'Жазба жоқ\n«Қосу» батырмасын басыңыз':
          '자세 기록 없음\n"추가" 버튼을 눌러 시작하세요'}</p>
    </div>` : `

    <!-- 趋势迷你图 -->
    ${records.length >= 2 ? renderPostureTrendMini(records) : ''}

    <!-- 记录列表 -->
    <div style="display:flex;flex-direction:column;gap:8px">
      ${records.map(r => `
        <div class="card-flat" style="position:relative">
          <div style="display:flex;align-items:center;gap:12px">
            <!-- 评分圆 -->
            <div style="width:52px;height:52px;border-radius:50%;flex-shrink:0;
              background:color-mix(in srgb,${scoreColor(r.score||0)} 15%,var(--bg));
              border:2px solid ${scoreColor(r.score||0)};
              display:flex;flex-direction:column;align-items:center;justify-content:center">
              <span style="font-size:1rem;font-weight:700;color:${scoreColor(r.score||0)};line-height:1">${r.score||'?'}</span>
              <span style="font-size:0.55rem;color:var(--text3)">${scoreLabel(r.score||0)}</span>
            </div>
            <div style="flex:1;min-width:0">
              <div style="font-size:0.85rem;font-weight:600;color:var(--text)">${r.title || (lang==='zh'?'体态检测':lang==='en'?'Posture Check':lang==='ru'?'Проверка осанки':lang==='kk'?'Қалып тексеру':'자세 검사')}</div>
              <div style="font-size:0.68rem;color:var(--text3);margin-top:2px">${formatDate(r.createdAt)}</div>
              ${r.note ? `<div style="font-size:0.72rem;color:var(--text2);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.note}</div>` : ''}
              <!-- 四项评分标签 -->
              ${r.items ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:5px">
                ${r.items.map(item => `<span class="chip ${item.status==='good'?'chip-teal':item.status==='warn'?'chip-accent':'chip-pop'}" style="font-size:0.6rem">${item.name}</span>`).join('')}
              </div>` : ''}
            </div>
            <!-- 操作按钮 -->
            <div style="display:flex;gap:4px;flex-shrink:0">
              <button onclick="editPostureRecord(${r.id})" class="plan-act" title="${lang==='zh'?'编辑':'Edit'}">✏️</button>
              <button onclick="deletePostureRecord(${r.id})" class="plan-act" title="${lang==='zh'?'删除':'Delete'}" style="color:var(--pop)">🗑</button>
            </div>
          </div>
          ${r.analysis ? `
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
              <p style="font-size:0.72rem;color:var(--text3);line-height:1.65;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${r.analysis}</p>
              <button onclick="toggleAnalysis(${r.id},this)" style="background:none;border:none;cursor:pointer;font-size:0.68rem;color:var(--accent);margin-top:3px">${lang==='zh'?'展开':lang==='en'?'Expand':'...'}</button>
            </div>` : ''}
        </div>
      `).join('')}
    </div>`}
  `;
}

function renderPostureTrendMini(records) {
  const recent = records.slice(0, 8).reverse();
  const scores = recent.map(r => r.score || 0);
  const maxS = Math.max(...scores, 100), minS = Math.max(0, Math.min(...scores) - 10);
  const W = 280, H = 60, pad = 10;
  const toX = i => pad + i * (W - pad*2) / (scores.length - 1);
  const toY = v => H - pad - ((v - minS) / (maxS - minS)) * (H - pad*2);
  const pts = scores.map((s,i) => `${toX(i)},${toY(s)}`).join(' ');
  const area = `${toX(0)},${H} ${pts} ${toX(scores.length-1)},${H}`;
  const latest = scores[scores.length-1];
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';
  return `
    <div class="card-flat" style="margin-bottom:14px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text3)">${lang==='zh'?'评分趋势':lang==='en'?'Score Trend':'Тренд'}</span>
        <span style="font-size:1.2rem;font-weight:300;color:var(--accent)">${latest}</span>
      </div>
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;overflow:visible">
        <defs>
          <linearGradient id="ptg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="${area}" fill="url(#ptg)"/>
        <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        ${scores.map((s,i) => `<circle cx="${toX(i)}" cy="${toY(s)}" r="3" fill="var(--accent)"/>`).join('')}
      </svg>
    </div>`;
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  } catch { return iso; }
}

// ── 新增记录弹窗 ──
function showAddPostureRecord(existing) {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';
  const isEdit = !!existing;
  const labels = {
    title_lbl:  { zh:'标题（可选）', en:'Title (optional)', ru:'Название', kk:'Атауы', ko:'제목' },
    score_lbl:  { zh:'综合评分（0-100）', en:'Score (0-100)', ru:'Оценка (0-100)', kk:'Ұпай (0-100)', ko:'점수 (0-100)' },
    note_lbl:   { zh:'备注', en:'Note', ru:'Заметка', kk:'Ескертпе', ko:'메모' },
    analysis_lbl:{ zh:'AI 分析摘要（可选）', en:'AI Analysis (optional)', ru:'Анализ ИИ', kk:'ЖИ талдауы', ko:'AI 분석' },
    items_lbl:  { zh:'检测项目', en:'Posture Items', ru:'Показатели', kk:'Көрсеткіштер', ko:'항목' },
    save:       { zh:'保存记录', en:'Save Record', ru:'Сохранить', kk:'Сақтау', ko:'저장' },
    cancel:     { zh:'取消', en:'Cancel', ru:'Отмена', kk:'Бас тарту', ko:'취소' },
    add_title:  { zh: isEdit?'编辑体态记录':'新增体态记录', en:isEdit?'Edit Record':'Add Record', ru:isEdit?'Редактировать':'Добавить', kk:isEdit?'Өзгерту':'Қосу', ko:isEdit?'편집':'추가' },
  };
  const L = o => o[lang] || o.zh;

  const ITEMS = [
    { key:'forward_head',      name:{ zh:'头前伸', en:'Forward Head', ru:'Выдвинутая голова', kk:'Бас алға', ko:'머리 전방' } },
    { key:'rounded_shoulder',  name:{ zh:'圆肩驼背', en:'Rounded Shoulders', ru:'Сутулость', kk:'Иық қисықтығы', ko:'둥근 어깨' } },
    { key:'pelvic_tilt',       name:{ zh:'骨盆前倾', en:'Pelvic Tilt', ru:'Наклон таза', kk:'Жамбас ауытқуы', ko:'골반 전방경사' } },
    { key:'shoulder_diff',     name:{ zh:'高低肩', en:'Shoulder Imbalance', ru:'Разные плечи', kk:'Иық теңсіздігі', ko:'어깨 높이차' } },
  ];

  const existingItems = existing?.items || ITEMS.map(item => ({ key:item.key, name:item.name[lang]||item.name.zh, status:'warn' }));

  const modal = document.getElementById('posture-add-modal');
  const content = document.getElementById('posture-add-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="sheet-handle"></div>
    <h2 style="font-size:1rem;font-weight:700;margin-bottom:16px;color:var(--text)">${L(labels.add_title)}</h2>

    <div class="field">
      <label class="input-label">${L(labels.title_lbl)}</label>
      <input class="input" id="pr-title" type="text" value="${existing?.title || ''}" placeholder="${lang==='zh'?'例：第1次体态检测':'e.g. First posture check'}">
    </div>
    <div class="field">
      <label class="input-label">${L(labels.score_lbl)}</label>
      <input class="input" id="pr-score" type="number" min="0" max="100" value="${existing?.score || ''}" placeholder="0-100">
    </div>

    <div class="field">
      <label class="input-label">${L(labels.items_lbl)}</label>
      ${ITEMS.map((item, i) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:0.82rem;color:var(--text2)">${item.name[lang]||item.name.zh}</span>
          <div style="display:flex;gap:5px">
            ${['good','warn','bad'].map(s => `
              <button onclick="setPRItemStatus('${item.key}','${s}',this)" data-key="${item.key}" data-status="${s}"
                style="padding:3px 9px;border-radius:100px;font-size:0.65rem;cursor:pointer;font-family:var(--font);
                  border:1px solid ${existingItems[i]?.status===s?'var(--accent)':'var(--border)'};
                  background:${existingItems[i]?.status===s?'var(--accent3)':'var(--surface2)'};
                  color:${existingItems[i]?.status===s?'var(--accent2)':'var(--text3)'}">
                ${s==='good'?(lang==='zh'?'正常':lang==='en'?'Good':'OK'):s==='warn'?(lang==='zh'?'轻微':lang==='en'?'Mild':'~'):(lang==='zh'?'需改善':lang==='en'?'Poor':'!')}
              </button>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <div class="field">
      <label class="input-label">${L(labels.note_lbl)}</label>
      <input class="input" id="pr-note" type="text" value="${existing?.note || ''}" placeholder="${lang==='zh'?'例：今天训练后感觉改善':'e.g. Improved after today\'s training'}">
    </div>
    <div class="field">
      <label class="input-label">${L(labels.analysis_lbl)}</label>
      <textarea class="input" id="pr-analysis" rows="3" style="resize:none;line-height:1.6">${existing?.analysis || ''}</textarea>
    </div>

    <div style="display:flex;gap:8px;margin-top:6px">
      <button class="btn btn-secondary" onclick="closeModal('posture-add-modal')" style="flex:1">${L(labels.cancel)}</button>
      <button class="btn btn-primary" onclick="savePostureRecord(${existing?.id || 'null'})" style="flex:2">${L(labels.save)}</button>
    </div>
  `;
  // Store current items state
  window._prItems = ITEMS.map((item, i) => ({
    key: item.key,
    name: item.name[lang] || item.name.zh,
    status: existingItems[i]?.status || 'warn',
  }));
  modal.style.display = 'flex';
}

function setPRItemStatus(key, status, btn) {
  if (!window._prItems) return;
  const item = window._prItems.find(i => i.key === key);
  if (item) item.status = status;
  // Update button styles in that group
  const parent = btn.parentElement;
  parent.querySelectorAll('button').forEach(b => {
    const isActive = b.dataset.status === status;
    b.style.borderColor = isActive ? 'var(--accent)' : 'var(--border)';
    b.style.background  = isActive ? 'var(--accent3)' : 'var(--surface2)';
    b.style.color       = isActive ? 'var(--accent2)' : 'var(--text3)';
  });
}

async function savePostureRecord(existingId) {
  const score = parseInt(document.getElementById('pr-score')?.value || '0');
  if (isNaN(score) || score < 0 || score > 100) {
    showToast(typeof t === 'function' ? (t('err_score_range')||'评分须在 0-100 之间') : '评分须在 0-100 之间');
    return;
  }
  const record = {
    title:    document.getElementById('pr-title')?.value?.trim() || '',
    score,
    note:     document.getElementById('pr-note')?.value?.trim() || '',
    analysis: document.getElementById('pr-analysis')?.value?.trim() || '',
    items:    window._prItems || [],
  };
  if (existingId) await PostureHistory.update(existingId, record);
  else await PostureHistory.add(record);

  closeModal('posture-add-modal');
  renderPostureHistoryPage();
}

async function deletePostureRecord(id) {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';
  const msg = { zh:'确认删除此记录？', en:'Delete this record?', ru:'Удалить запись?', kk:'Жазбаны жою керек пе?', ko:'이 기록을 삭제할까요?' };
  if (!confirm(msg[lang] || msg.zh)) return;
  await PostureHistory.remove(id);
  renderPostureHistoryPage();
}

async function editPostureRecord(id) {
  const records = await PostureHistory.load();
  const record = records.find(r => r.id === id);
  if (record) showAddPostureRecord(record);
}

function toggleAnalysis(id, btn) {
  const box = btn.previousElementSibling;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';
  if (box.style.webkitLineClamp === '3' || !box.style.webkitLineClamp) {
    box.style.webkitLineClamp = 'unset';
    box.style.overflow = 'visible';
    btn.textContent = lang==='zh'?'收起':lang==='en'?'Collapse':'↑';
  } else {
    box.style.webkitLineClamp = '3';
    box.style.overflow = 'hidden';
    btn.textContent = lang==='zh'?'展开':lang==='en'?'Expand':'↓';
  }
}
