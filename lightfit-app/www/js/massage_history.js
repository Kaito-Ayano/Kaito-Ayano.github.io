// ═══════════════════════════════════════════
//  MASSAGE HISTORY — 按摩历史本地加密管理
//  AES-256-GCM 加密，数据不上传云端
// ═══════════════════════════════════════════

const MassageHistory = {
  _key: 'massage_records_v1',
  async load()          { try { return (await SecureStore.load(this._key)) || []; } catch { return []; } },
  async save(records)   { await SecureStore.save(this._key, records); },
  async add(record)     { const r = await this.load(); r.unshift({...record, id:Date.now(), createdAt:new Date().toISOString()}); await this.save(r); return r; },
  async update(id, upd) { const r = await this.load(); const i=r.findIndex(x=>x.id===id); if(i!==-1){r[i]={...r[i],...upd};await this.save(r);} return r; },
  async remove(id)      { const r = (await this.load()).filter(x=>x.id!==id); await this.save(r); return r; },
};

// ── 按摩服务分类（本地化名称）──
const MASSAGE_CATS = {
  zh: { meridian:'经络全身疏通', neck:'颈肩深层放松', back:'腰背专项疏通', sports:'运动恢复按摩', prenatal:'孕妇舒缓按摩', reflexology:'足底反射疗法', aroma:'精油芳香按摩', head:'头部穴位疏导', other:'其他' },
  en: { meridian:'Full Body Meridian', neck:'Neck & Shoulder', back:'Lower Back', sports:'Sports Recovery', prenatal:'Prenatal Relaxation', reflexology:'Reflexology', aroma:'Aromatherapy', head:'Head Acupoint', other:'Other' },
  ru: { meridian:'Меридианный массаж', neck:'Шея и плечи', back:'Поясница', sports:'Спортивный', prenatal:'Для беременных', reflexology:'Рефлексология', aroma:'Ароматерапия', head:'Акупрессура головы', other:'Другое' },
  kk: { meridian:'Меридиан массажы', neck:'Мойын иық', back:'Бел', sports:'Спорттық', prenatal:'Жүкті', reflexology:'Рефлексология', aroma:'Ароматерапия', head:'Бас нүктелері', other:'Басқа' },
  ko: { meridian:'전신 경락', neck:'목·어깨', back:'허리', sports:'스포츠 회복', prenatal:'임산부', reflexology:'발 반사', aroma:'아로마', head:'두피 지압', other:'기타' },
};

// ── 渲染按摩历史页 ──
async function renderMassageHistoryPage() {
  const container = document.getElementById('massage-history-content');
  if (!container) return;
  const records = await MassageHistory.load();
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';
  const cats  = MASSAGE_CATS[lang] || MASSAGE_CATS.zh;

  const statusLabel = s => ({
    pending:    { zh:'待预约', en:'Pending',   ru:'Ожидание',  kk:'Күту',      ko:'예약 대기' },
    confirmed:  { zh:'已确认', en:'Confirmed', ru:'Подтверждён', kk:'Расталды', ko:'확인됨' },
    completed:  { zh:'已完成', en:'Completed', ru:'Завершён',  kk:'Аяқталды',  ko:'완료' },
    cancelled:  { zh:'已取消', en:'Cancelled', ru:'Отменён',   kk:'Бас тартылды', ko:'취소됨' },
  }[s])?.[lang] || s;

  const statusColor = s => ({pending:'var(--accent)',confirmed:'var(--teal)',completed:'var(--teal)',cancelled:'var(--text3)'}[s]||'var(--text3)');

  container.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <p style="font-size:0.72rem;color:var(--text3)">${lang==='zh'?'本地加密存储，数据不上传':lang==='en'?'Locally encrypted, never uploaded':lang==='ru'?'Локальное шифрование':'로컬 암호화'} 🔒</p>
      <button class="btn btn-primary btn-sm" onclick="showAddMassageRecord()" style="width:auto">
        + ${lang==='zh'?'新增记录':lang==='en'?'Add Record':lang==='ru'?'Добавить':lang==='kk'?'Қосу':'추가'}
      </button>
    </div>

    ${records.length === 0 ? `
    <div class="empty">
      <div class="ei">🌿</div>
      <p>${lang==='zh'?'暂无按摩记录\n点击「新增记录」记录您的身体养护历史':
          lang==='en'?'No massage records yet\nTap "Add Record" to track your wellness journey':
          lang==='ru'?'Записей нет. Нажмите "Добавить"':
          lang==='kk'?'Жазба жоқ. «Қосу» батырмасын басыңыз':
          '마사지 기록 없음\n"추가" 버튼으로 기록을 시작하세요'}</p>
    </div>` : `
    <div style="display:flex;flex-direction:column;gap:8px">
      ${records.map(r => `
        <div class="card-flat">
          <div style="display:flex;align-items:flex-start;gap:10px">
            <div style="font-size:1.8rem;flex-shrink:0;width:44px;height:44px;background:var(--surface2);border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border)">${r.emoji||'🌿'}</div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap">
                <span style="font-size:0.87rem;font-weight:600;color:var(--text)">${r.service?cats[r.service]||r.service:cats.other}</span>
                <span style="font-size:0.65rem;padding:2px 8px;border-radius:100px;background:color-mix(in srgb,${statusColor(r.status||'completed')} 15%,transparent);color:${statusColor(r.status||'completed')};border:1px solid color-mix(in srgb,${statusColor(r.status||'completed')} 30%,transparent)">${statusLabel(r.status||'completed')}</span>
              </div>
              <div style="font-size:0.68rem;color:var(--text3);margin-top:2px">${formatDate(r.createdAt)}${r.duration?` · ${r.duration}${lang==='zh'?'分钟':lang==='en'?'min':lang==='ru'?'мин':lang==='kk'?'мин':'분'}`:''}</div>
              ${r.therapist?`<div style="font-size:0.72rem;color:var(--text2);margin-top:2px">${lang==='zh'?'按摩师':lang==='en'?'Therapist':lang==='ru'?'Массажист':lang==='kk'?'Массажшы':'마사지사'}: ${r.therapist}</div>`:''}
              ${r.note?`<div style="font-size:0.72rem;color:var(--text2);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.note}</div>`:''}
              ${r.rating?`<div style="margin-top:5px;font-size:0.82rem">${'⭐'.repeat(r.rating)}</div>`:''}
            </div>
            <div style="display:flex;gap:4px;flex-shrink:0">
              <button onclick="editMassageRecord(${r.id})" class="plan-act">✏️</button>
              <button onclick="deleteMassageRecord(${r.id})" class="plan-act" style="color:var(--pop)">🗑</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`}
  `;
}

// ── 新增/编辑弹窗 ──
function showAddMassageRecord(existing) {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';
  const isEdit = !!existing;
  const cats = MASSAGE_CATS[lang] || MASSAGE_CATS.zh;
  const EMOJIS = { meridian:'🌿', neck:'💆', back:'🦴', sports:'💪', prenatal:'🤰', reflexology:'🦶', aroma:'🌸', head:'🧠', other:'🌿' };
  const DURATIONS = [30, 45, 60, 75, 90];
  const STATUSES = ['pending','confirmed','completed','cancelled'];
  const statusNames = { pending:{zh:'待预约',en:'Pending',ru:'Ожидание',kk:'Күту',ko:'대기'}, confirmed:{zh:'已确认',en:'Confirmed',ru:'Подтверждён',kk:'Расталды',ko:'확인'}, completed:{zh:'已完成',en:'Completed',ru:'Завершён',kk:'Аяқталды',ko:'완료'}, cancelled:{zh:'已取消',en:'Cancelled',ru:'Отменён',kk:'Бас тартылды',ko:'취소'} };

  const modal   = document.getElementById('massage-add-modal');
  const content = document.getElementById('massage-add-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="sheet-handle"></div>
    <h2 style="font-size:1rem;font-weight:700;margin-bottom:14px;color:var(--text)">${isEdit?(lang==='zh'?'编辑记录':lang==='en'?'Edit Record':lang==='ru'?'Редактировать':lang==='kk'?'Өзгерту':'편집'):(lang==='zh'?'新增按摩记录':lang==='en'?'Add Massage Record':lang==='ru'?'Добавить запись':lang==='kk'?'Жазба қосу':'마사지 기록 추가')}</h2>

    <div class="field">
      <label class="input-label">${lang==='zh'?'按摩类型':lang==='en'?'Service':lang==='ru'?'Тип массажа':lang==='kk'?'Массаж түрі':'마사지 종류'}</label>
      <select class="input" id="mr-service" style="font-family:var(--font)" onchange="updateMassageEmoji(this.value)">
        ${Object.entries(cats).map(([k,v]) => `<option value="${k}" ${existing?.service===k?'selected':''}>${v}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label class="input-label">${lang==='zh'?'日期':lang==='en'?'Date':lang==='ru'?'Дата':lang==='kk'?'Күн':'날짜'}</label>
      <input class="input" id="mr-date" type="date" value="${existing?.date||new Date().toISOString().slice(0,10)}">
    </div>
    <div class="field">
      <label class="input-label">${lang==='zh'?'时长（分钟）':lang==='en'?'Duration (min)':lang==='ru'?'Длительность':lang==='kk'?'Ұзақтығы (мин)':'시간 (분)'}</label>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${DURATIONS.map(d => `<button onclick="selectMRDuration(${d},this)" data-dur="${d}" style="padding:7px 12px;border-radius:var(--r2);font-family:var(--font);font-size:0.78rem;cursor:pointer;border:1px solid ${existing?.duration==d?'var(--accent)':'var(--border)'};background:${existing?.duration==d?'var(--accent3)':'var(--surface2)'};color:${existing?.duration==d?'var(--accent2)':'var(--text3)'}">${d}${lang==='zh'?'分':lang==='en'?'m':'м'}</button>`).join('')}
      </div>
    </div>
    <div class="field">
      <label class="input-label">${lang==='zh'?'状态':lang==='en'?'Status':lang==='ru'?'Статус':lang==='kk'?'Мәртебесі':'상태'}</label>
      <select class="input" id="mr-status" style="font-family:var(--font)">
        ${STATUSES.map(s => `<option value="${s}" ${(existing?.status||'completed')===s?'selected':''}>${statusNames[s][lang]||statusNames[s].zh}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label class="input-label">${lang==='zh'?'按摩师姓名（可选）':lang==='en'?'Therapist name (optional)':lang==='ru'?'Имя массажиста':lang==='kk'?'Массажшы аты':lang==='ko'?'마사지사 이름':''}</label>
      <input class="input" id="mr-therapist" type="text" value="${existing?.therapist||''}" placeholder="${lang==='zh'?'例：张师傅':'e.g. Zhang'}">
    </div>
    <div class="field">
      <label class="input-label">${lang==='zh'?'评分':lang==='en'?'Rating':lang==='ru'?'Оценка':lang==='kk'?'Бағалау':'평점'}</label>
      <div style="display:flex;gap:6px">
        ${[1,2,3,4,5].map(n => `<button onclick="selectMRRating(${n},this)" data-rating="${n}" style="font-size:1.3rem;background:none;border:none;cursor:pointer;opacity:${existing?.rating>=n?1:0.3}">${'⭐'}</button>`).join('')}
      </div>
    </div>
    <div class="field">
      <label class="input-label">${lang==='zh'?'备注':lang==='en'?'Note':lang==='ru'?'Заметка':lang==='kk'?'Ескертпе':'메모'}</label>
      <input class="input" id="mr-note" type="text" value="${existing?.note||''}" placeholder="${lang==='zh'?'感受、建议、下次预约...':'Feedback, tips, next booking...'}">
    </div>
    <div style="display:flex;gap:8px;margin-top:6px">
      <button class="btn btn-secondary" onclick="closeModal('massage-add-modal')" style="flex:1">${lang==='zh'?'取消':lang==='en'?'Cancel':lang==='ru'?'Отмена':lang==='kk'?'Бас тарту':'취소'}</button>
      <button class="btn btn-primary" onclick="saveMassageRecord(${existing?.id||'null'})" style="flex:2">${lang==='zh'?'保存记录':lang==='en'?'Save Record':lang==='ru'?'Сохранить':lang==='kk'?'Сақтау':'저장'}</button>
    </div>
  `;
  window._mrDuration = existing?.duration || 60;
  window._mrRating   = existing?.rating   || 0;
  modal.style.display = 'flex';
}

function selectMRDuration(d, btn) {
  window._mrDuration = d;
  btn.closest('div').querySelectorAll('button').forEach(b => {
    const sel = parseInt(b.dataset.dur) === d;
    b.style.borderColor = sel ? 'var(--accent)' : 'var(--border)';
    b.style.background  = sel ? 'var(--accent3)' : 'var(--surface2)';
    b.style.color       = sel ? 'var(--accent2)' : 'var(--text3)';
  });
}

function selectMRRating(n, btn) {
  window._mrRating = n;
  btn.closest('div').querySelectorAll('button').forEach((b, i) => {
    b.style.opacity = i < n ? '1' : '0.3';
  });
}

function updateMassageEmoji(service) {
  const EMOJIS = { meridian:'🌿', neck:'💆', back:'🦴', sports:'💪', prenatal:'🤰', reflexology:'🦶', aroma:'🌸', head:'🧠', other:'🌿' };
  window._mrEmoji = EMOJIS[service] || '🌿';
}

async function saveMassageRecord(existingId) {
  const record = {
    service:   document.getElementById('mr-service')?.value || 'other',
    date:      document.getElementById('mr-date')?.value || '',
    duration:  window._mrDuration || 60,
    status:    document.getElementById('mr-status')?.value || 'completed',
    therapist: document.getElementById('mr-therapist')?.value?.trim() || '',
    rating:    window._mrRating || 0,
    note:      document.getElementById('mr-note')?.value?.trim() || '',
    emoji:     window._mrEmoji || '🌿',
  };
  if (existingId) await MassageHistory.update(existingId, record);
  else await MassageHistory.add(record);
  closeModal('massage-add-modal');
  renderMassageHistoryPage();
}

async function deleteMassageRecord(id) {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';
  const msg = { zh:'确认删除此记录？', en:'Delete this record?', ru:'Удалить?', kk:'Жою керек пе?', ko:'삭제할까요?' };
  if (!confirm(msg[lang] || msg.zh)) return;
  await MassageHistory.remove(id);
  renderMassageHistoryPage();
}

async function editMassageRecord(id) {
  const records = await MassageHistory.load();
  const record  = records.find(r => r.id === id);
  if (record) showAddMassageRecord(record);
}
