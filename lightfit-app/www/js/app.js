// ── STATE ──
const appState = {
  mood:'happy', timerRunning:false, timerSeconds:30,
  timerInterval:null, currentExerciseIdx:0, playerQueue:[],
  scanning:false, scanDone:false, aiTyping:false,
  surveyStep:0, surveyAnswers:{},
  userPlan: JSON.parse(localStorage.getItem('userPlan')||'[]'),
  libraryFilter:'all', librarySearch:'',
  _editId:null, _pickerSearch:'', _pickerFilter:'all',
  totalDays: parseInt(localStorage.getItem('totalDays')||'23'),
  fontSize: localStorage.getItem('fontSize')||'normal',
  highContrast: localStorage.getItem('highContrast')==='1',
  voiceCue: localStorage.getItem('voiceCue')!=='0',
  medicalShown: JSON.parse(localStorage.getItem('medicalShown')||'{}'),
};

// ── NAVIGATION ──
function showPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const pg = document.getElementById('page-'+id);
  if(pg) pg.classList.add('active');
  document.querySelector(`.nav-btn[data-page="${id}"]`)?.classList.add('active');
  if(id==='library')         renderLibrary();
  if(id==='plan')            renderPlanPage();
  if(id==='charts')          { if(typeof renderChartsPage==='function') renderChartsPage(); }
  if(id==='massage')         { if(typeof renderMassagePage==='function') renderMassagePage(); }
  if(id==='ai-settings')     { if(typeof renderAISettingsPage==='function') renderAISettingsPage(); }
  if(id==='posture-history') { if(typeof renderPostureHistoryPage==='function') renderPostureHistoryPage(); }
  if(id==='massage-history') { if(typeof renderMassageHistoryPage==='function') renderMassageHistoryPage(); }
}

// ── MOOD ──
function selectMood(mood, skipRerender) {
  appState.mood = mood;
  document.querySelectorAll('.mood-chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`.mood-chip[data-mood="${mood}"]`)?.classList.add('active');
  const el = document.getElementById('mood-tip');
  if(el) el.textContent = t('mood_tip_'+mood) || '';

  // If stressed/anxious for awareness
  if(mood==='anxious') {
    setTimeout(()=>{ checkEmotionalState('stress'); }, 800);
  }
}

// ── MEDICAL DISCLAIMER ──
const MEDICAL_GROUPS = {
  pregnant: { key:'pregnant', condIdx:[3] },
  elderly:  { key:'elderly',  condIdx:[4] },
  cardiac:  { key:'cardiac',  condIdx:[6] },
  rehab:    { key:'rehab',    condIdx:[10] },
  disabled: { key:'disabled', condIdx:[5] },
  youth:    { key:'youth',    ageIdx:[0] },
};

function checkMedicalDisclaimer(callback) {
  const age = appState.surveyAnswers[0];
  const cond = appState.surveyAnswers[1];
  let needed = null;
  if(age===0) needed='youth';
  else if(cond===3) needed='pregnant';
  else if(cond===4) needed='elderly';
  else if(cond===5) needed='disabled';
  else if(cond===6) needed='cardiac';
  else if(cond===8||cond===9||cond===10) needed='rehab';

  if(!needed || appState.medicalShown[needed]) { callback(); return; }
  showMedicalModal(needed, callback);
}

function showMedicalModal(type, callback) {
  const titleKey = 'medical_'+type;
  const bodyKey  = 'medical_'+type+'_body';
  document.getElementById('medical-title-text').textContent = t(titleKey);
  document.getElementById('medical-body-text').textContent  = t(bodyKey);
  document.getElementById('medical-confirm-btn').onclick = ()=>{
    appState.medicalShown[type]=true;
    localStorage.setItem('medicalShown',JSON.stringify(appState.medicalShown));
    closeMedicalModal();
    callback();
  };
  document.getElementById('medical-modal').style.display='flex';
}

function closeMedicalModal() { document.getElementById('medical-modal').style.display='none'; }

// Also show for vulnerable groups when they open the library
function checkLibraryMedical(exGroups) {
  const cond = appState.surveyAnswers[1];
  const age  = appState.surveyAnswers[0];
  if(age===0 && exGroups.includes('general') && !appState.medicalShown['youth']) {
    showMedicalModal('youth',()=>{});
  } else if(cond===3 && exGroups.includes('pregnant') && !appState.medicalShown['pregnant']) {
    showMedicalModal('pregnant',()=>{});
  } else if(cond===6 && !appState.medicalShown['cardiac']) {
    showMedicalModal('cardiac',()=>{});
  }
}

// ── EMOTIONAL CRISIS DETECTION ──
const CRISIS_KEYWORDS = {
  zh:['不想活','想死','自杀','崩溃了','活不下去','绝望','没有意义','伤害自己','太难了我撑不住'],
  en:['want to die','kill myself','suicidal','end it','no point','hopeless','hurt myself','can\'t go on','breaking down'],
  ru:['хочу умереть','суицид','нет смысла','безнадёжно','причинить себе вред','не могу больше'],
  kk:['өлгім келеді','өзіме зиян','үмітсіз','шыдай алмаймын'],
  ko:['죽고싶어','자살','더살고싶지않아','삶을끝내고싶어','손목','자해','희망없어','버티기힘들어'],
};
const STRESS_KEYWORDS = {
  zh:['很焦虑','很抑郁','心情很差','情绪很低落','很难受','哭了','一直哭','睡不着','失眠很久'],
  en:['very anxious','depressed','feeling low','really bad','been crying','can\'t sleep','insomnia for weeks','struggling a lot'],
  ru:['очень тревожно','депрессия','очень плохо','плачу','не могу спать','давно бессонница'],
  kk:['өте мазасыз','депрессия','өте жаман','жыладым','ұйықтай алмаймын'],
};

function checkEmotionalState(type) {
  if(type==='crisis') {
    showCrisisModal(true);
  } else if(type==='stress') {
    // gentle check, not full crisis
    showCrisisModal(false);
  }
}

function detectMessageEmotion(msg) {
  const m = msg.toLowerCase();
  const crisis = (CRISIS_KEYWORDS[currentLang]||CRISIS_KEYWORDS.zh).some(k=>m.includes(k));
  if(crisis) return 'crisis';
  const stress = (STRESS_KEYWORDS[currentLang]||STRESS_KEYWORDS.zh).some(k=>m.includes(k));
  if(stress) return 'stress';
  return null;
}

function showCrisisModal(isCrisis) {
  const modal = document.getElementById('crisis-modal');
  document.getElementById('crisis-is-critical').style.display = isCrisis ? 'block' : 'none';
  modal.style.display = 'flex';
}
function closeCrisisModal() { document.getElementById('crisis-modal').style.display='none'; }

// ── EXERCISE LIBRARY ──
function renderLibrary() {
  const grid = document.getElementById('library-grid');
  if(!grid) return;
  const search = appState.librarySearch.toLowerCase();
  const filter = appState.libraryFilter;
  const filtered = EXERCISE_DB.filter(ex=>{
    const matchF = filter==='all'||ex.groups.includes(filter)||ex.cat===filter;
    const matchS = !search||getExerciseName(ex).toLowerCase().includes(search);
    return matchF && matchS;
  });
  const empty = {zh:'没有找到相关运动',en:'No exercises found',ru:'Упражнения не найдены',kk:'Жаттығу табылмады'};
  grid.innerHTML = filtered.length===0
    ? `<div class="empty-state" style="grid-column:1/-1"><div class="icon">🔍</div><p>${empty['_']}</p></div>`
    : filtered.map(ex=>`
      <div class="lib-item" onclick="openExerciseDetail(${ex.id})">
        <div class="lib-em">${ex.emoji}</div>
        <div class="lib-info">
          <h4>${getExerciseName(ex)}</h4>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:5px">
            <span class="chip chip-${ex.level==='easy'?'green':ex.level==='med'?'yellow':'orange'}">${getLevelLabel(ex.level)}</span>
            <span class="chip chip-blue">⏱ ${ex.duration}${t('min_label')}</span>
          </div>
          <p class="lib-info p">${t('suitable_for')}: ${getGroupLabels(ex.groups)}</p>
        </div>
        <button class="lib-start" onclick="event.stopPropagation();startSingleExercise(${ex.id})">${t('start_exercise')}</button>
      </div>`).join('');
}

function setLibraryFilter(filter) {
  appState.libraryFilter = filter;
  document.querySelectorAll('.fc').forEach(c=>c.classList.remove('active'));
  document.querySelector(`.filter-chip[data-filter="${filter}"]`)?.classList.add('active');
  renderLibrary();
}
function searchLibrary(val) { appState.librarySearch=val; renderLibrary(); }

function openExerciseDetail(id) {
  const ex = EXERCISE_DB.find(e=>e.id===id);
  if(!ex) return;
  checkLibraryMedical(ex.groups);
  document.getElementById('modal-emoji').textContent    = ex.emoji;
  document.getElementById('modal-name').textContent     = getExerciseName(ex);
  document.getElementById('modal-tip').textContent      = getExerciseTip(ex);
  document.getElementById('modal-duration').textContent = ex.duration+t('min_label');
  document.getElementById('modal-level').textContent    = getLevelLabel(ex.level);
  document.getElementById('modal-groups').textContent   = getGroupLabels(ex.groups);
  document.getElementById('modal-start-btn').onclick    = ()=>{ closeModal('exercise-modal'); startSingleExercise(id); };
  document.getElementById('exercise-modal').style.display='flex';
}

function startSingleExercise(id) {
  const ex = EXERCISE_DB.find(e=>e.id===id);
  if(!ex) return;
  appState.playerQueue=[ex]; appState.currentExerciseIdx=0;
  openPlayer();
}

// ── WORKOUT PLAYER ──
let currentExId = 0;

function openWorkout(category) {
  const cats={neck:['neck'],posture:['posture'],slim:['slim'],relax:['relax']};
  appState.playerQueue = EXERCISE_DB.filter(e=>(cats[category]||[category]).includes(e.cat)).slice(0,5);
  if(appState.playerQueue.length===0) appState.playerQueue=EXERCISE_DB.slice(0,3);
  appState.currentExerciseIdx=0; openPlayer();
}

function openPlayer() {
  document.getElementById('player').classList.add('open');
  loadPlayerExercise(0);
}

function loadPlayerExercise(idx) {
  const ex = appState.playerQueue[idx];
  if(!ex) return;
  currentExId = ex.id;
  appState.timerSeconds = Math.min(ex.duration*10, 60);
  document.getElementById('ex-name').textContent  = getExerciseName(ex);
  document.getElementById('ex-sub').textContent   = getExerciseTip(ex);
  document.getElementById('ex-num').textContent   = `${idx+1} / ${appState.playerQueue.length}`;
  updateTimerDisplay(); updateTimerRing(1);
  document.getElementById('play-btn').textContent='▶';
  appState.timerRunning=false;
  // Launch animation
  if(typeof startAnimLoop === 'function') startAnimLoop(ex.id);
  if(appState.voiceCue) speak(getExerciseName(ex));
}

function speak(text) {
  if(!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = currentLang==='zh'?'zh-CN':currentLang==='ru'?'ru-RU':currentLang==='kk'?'kk-KZ':'en-US';
  window.speechSynthesis.speak(u);
}

function updateTimerDisplay() { document.getElementById('timer-secs').textContent=appState.timerSeconds; }
function updateTimerRing(p) {
  const el=document.getElementById('timer-path');
  if(!el) return;
  // Get actual r from SVG attribute or default to 28
  const r = parseFloat(el.getAttribute('r')||26);
  const c = 2*Math.PI*r;
  el.setAttribute('stroke-dashoffset',(c*(1-p)).toFixed(1));
  el.setAttribute('stroke-dasharray', c.toFixed(1));
}

function toggleTimer() {
  const btn=document.getElementById('play-btn');
  if(appState.timerRunning) {
    clearInterval(appState.timerInterval); appState.timerRunning=false; btn.textContent='▶';
  } else {
    appState.timerRunning=true; btn.textContent='⏸';
    const total=appState.timerSeconds;
    appState.timerInterval=setInterval(()=>{
      appState.timerSeconds--;
      updateTimerDisplay(); updateTimerRing(appState.timerSeconds/total);
      if(appState.timerSeconds<=0) {
        clearInterval(appState.timerInterval); appState.timerRunning=false;
        nextPlayerExercise();
      }
    },1000);
  }
}

function nextPlayerExercise() {
  clearInterval(appState.timerInterval); appState.timerRunning=false;
  if(appState.currentExerciseIdx<appState.playerQueue.length-1) {
    appState.currentExerciseIdx++;
    loadPlayerExercise(appState.currentExerciseIdx);
    showToast('⏭ '+getExerciseName(appState.playerQueue[appState.currentExerciseIdx]));
  } else { finishWorkout(); }
}

function prevPlayerExercise() {
  clearInterval(appState.timerInterval); appState.timerRunning=false;
  if(appState.currentExerciseIdx>0) { appState.currentExerciseIdx--; loadPlayerExercise(appState.currentExerciseIdx); }
}

function finishWorkout() {
  closePlayer();
  // 本地先加（即时反馈）
  appState.totalDays++;
  localStorage.setItem('totalDays', appState.totalDays);
  const msg = (t('finish_msg')||'🎉 完成 {n}天').replace('{n}', appState.totalDays);
  showToast(typeof msg === 'string' ? msg : (msg[currentLang] || msg.zh));
  updateProfileStats();

  // 后端上报（异步，不阻塞UI）
  const ex = appState.playerQueue[appState.currentExerciseIdx];
  if (ex && typeof api !== 'undefined' && AUTH.isLoggedIn() && !AUTH.isGuest()) {
    api.post('/api/user/training-done', {
      exerciseId:   ex.id,
      exerciseName: ex.nameZh || ex.nameEn || '',
      durationSec:  ex.duration * 60,
      mood:         appState.mood || 'neutral',
    }).then(res => {
      if (res.ok) {
        appState.totalDays = res.data.totalDays;
        localStorage.setItem('totalDays', appState.totalDays);
        updateProfileStats();
      }
    }).catch(() => {});
  }
}

function closePlayer() {
  clearInterval(appState.timerInterval); appState.timerRunning=false;
  document.getElementById('player').classList.remove('open');
  if(typeof stopAnimLoop === 'function') stopAnimLoop();
}

// ── SURVEY ──
const SURVEY_KEYS=['survey_q1','survey_q2','survey_q3','survey_q4','survey_q5','survey_q6'];
const SURVEY_ANS =['survey_a1','survey_a2','survey_a3','survey_a4','survey_a5','survey_a6'];
const MULTI_SELECT=[4];

function showSurvey() {
  appState.surveyStep=0; appState.surveyAnswers={};
  document.getElementById('survey-overlay').style.display='flex';
  renderSurveyStep();
}
function closeSurvey() { document.getElementById('survey-overlay').style.display='none'; }

function renderSurveyStep() {
  const step=appState.surveyStep, total=SURVEY_KEYS.length;
  const isMulti=MULTI_SELECT.includes(step);
  const selected=appState.surveyAnswers[step]||(isMulti?[]:null);
  document.getElementById('survey-progress').style.width=`${(step/total)*100}%`;
  document.getElementById('survey-step-label').textContent=`${step+1} / ${total}`;
  document.getElementById('survey-question').textContent=t(SURVEY_KEYS[step]);
  const answers=t(SURVEY_ANS[step]);
  document.getElementById('sv-opts').innerHTML=answers.map((a,i)=>`
    <div class="sv-opt ${(isMulti?selected.includes(i):selected===i)?'selected':''}" onclick="selectSurveyOption(${i})">${a}</div>
  `).join('');
  document.getElementById('survey-prev-btn').style.visibility=step===0?'hidden':'visible';
  const nb=document.getElementById('survey-next-btn');
  nb.textContent=step===total-1?t('submit_survey'):t('next');
  nb.onclick=step===total-1?submitSurvey:nextSurveyStep;
}

function selectSurveyOption(i) {
  const step=appState.surveyStep, isMulti=MULTI_SELECT.includes(step);
  if(isMulti){ const arr=appState.surveyAnswers[step]||[]; const idx=arr.indexOf(i); idx>-1?arr.splice(idx,1):arr.push(i); appState.surveyAnswers[step]=arr; }
  else appState.surveyAnswers[step]=i;
  renderSurveyStep();
}

function nextSurveyStep() {
  const step=appState.surveyStep, isMulti=MULTI_SELECT.includes(step), ans=appState.surveyAnswers[step];
  if((!isMulti&&(ans===null||ans===undefined))||(isMulti&&(!ans||ans.length===0))){
    showToast(t('select_option'));
    return;
  }
  appState.surveyStep++; renderSurveyStep();
}
function prevSurveyStep() { if(appState.surveyStep>0){appState.surveyStep--;renderSurveyStep();} }

function submitSurvey() {
  closeSurvey();
  // Check medical disclaimer based on answers
  checkMedicalDisclaimer(()=>{
    document.getElementById('plan-content').innerHTML=`<div style="text-align:center;padding:40px 20px"><div style="font-size:48px">⚙️</div><p style="margin-top:12px;color:var(--text-muted)">${t('generating')}</p></div>`;
    setTimeout(()=>{
      appState.userPlan=generatePlanFromSurvey();
      localStorage.setItem('userPlan',JSON.stringify(appState.userPlan));
      renderPlanPage();
      showToast('✨ '+t('plan_generated'));
      if (typeof api !== 'undefined' && AUTH.isLoggedIn() && !AUTH.isGuest()) {
        api.put('/api/plan', { plan: appState.userPlan }).catch(() => {});
      }
    },2000);
  });
}

function generatePlanFromSurvey() {
  const a=appState.surveyAnswers;
  const cond=a[1], goal=a[2], timeSlot=a[3];
  const maxDur=[5,15,25,40][timeSlot]||15;
  let cats=[];
  if(cond===1) cats=['neck','posture'];
  else if(cond===2) cats=['neck','rehab'];
  else if(cond===3) cats=['pregnant'];
  else if(cond===4) cats=['elderly'];
  else if(cond===5) cats=['disabled'];
  else if(cond===6||cond===7) cats=['relax','neck'];
  else if(cond===8||cond===9||cond===10) cats=['rehab'];
  else cats=['posture','slim'];
  if(goal===1) cats.push('slim');
  if(goal===2) cats.push('relax');
  const times=['07:00','12:00','18:00','22:00'];
  const unique=[...new Set(cats)];
  return unique.slice(0,4).map((cat,i)=>{
    const ex=EXERCISE_DB.find(e=>e.cat===cat)||EXERCISE_DB[i];
    return { id:Date.now()+i, exId:ex?ex.id:null, name:ex?ex.nameZh:cat, nameEn:ex?ex.nameEn:cat, nameRu:ex?ex.nameRu:cat, nameKk:ex?ex.nameKk:cat, emoji:ex?ex.emoji:'🏋️', duration:Math.min(ex?ex.duration:10,maxDur), level:ex?ex.level:'easy', time:times[i]||'10:00', note:'' };
  });
}

// ── PLAN PAGE ──
function renderPlanPage() {
  const container=document.getElementById('plan-content');
  if(!container) return;
  const skipLabel={zh:'从运动库自选',en:'Pick from Library',ru:'Выбрать из библиотеки',kk:'Кітапханадан таңдау'};
  const startAll={zh:'▶ 开始全部',en:'▶ Start All',ru:'▶ Начать всё',kk:'▶ Барлығын бастау'};

  if(appState.userPlan.length===0){
    container.innerHTML=`
      <div class="card" style="background:var(--primary-light);box-shadow:none;text-align:center;padding:28px 20px">
        <div style="font-size:40px;margin-bottom:12px">🎯</div>
        <p style="font-weight:700;font-size:15px;color:var(--primary-dark)">${t('fill_survey')}</p>
        <p style="font-size:13px;color:var(--primary-dark);margin-top:6px;opacity:0.8">${t('survey_desc')}</p>
        <button class="btn-primary" style="margin-top:16px" onclick="showSurvey()">${t('start_survey')}</button>
        <button class="btn-outline" style="margin-top:10px" onclick="showAddWorkout()">${skipLabel[currentLang]||skipLabel.zh}</button>
      </div>`;
    return;
  }
  container.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <strong style="font-size:15px">${t('my_plan')}</strong>
      <div style="display:flex;gap:8px">
        <button onclick="showSurvey()" style="background:var(--primary-light);color:var(--primary-dark);border:none;border-radius:100px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer">🔄</button>
        <button onclick="showAddWorkout()" style="background:var(--primary);color:#fff;border:none;border-radius:100px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer">${t('add_workout')}</button>
      </div>
    </div>
    ${appState.userPlan.map(item=>`
      <div class="plan-item">
        <div class="plan-item-left">
          <div style="width:44px;height:44px;border-radius:12px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${item.emoji||'🏋️'}</div>
          <div style="min-width:0">
            <h4 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${getPlanItemName(item)}</h4>
            <p>${item.duration}${t('min_label')} · ${item.time}${item.note?' · '+item.note:''}</p>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0">
          <button onclick="startSingleExercise(${item.exId||0})" class="plan-act" title="start">▶</button>
          <button onclick="editWorkout(${item.id})" class="plan-act">✏️</button>
          <button onclick="deleteWorkout(${item.id})" class="plan-act">🗑️</button>
        </div>
      </div>`).join('')}
    <button class="btn-primary" style="margin-top:8px" onclick="startPlanAll()">${startAll[currentLang]||startAll.zh} (${appState.userPlan.length})</button>`;
}

function startPlanAll() {
  const exList=appState.userPlan.map(item=>item.exId?EXERCISE_DB.find(e=>e.id===item.exId):null).filter(Boolean);
  if(exList.length===0){showToast(t('add_workouts_first'));return;}
  appState.playerQueue=exList; appState.currentExerciseIdx=0; openPlayer();
}

function getPlanItemName(item) {
  return {en:item.nameEn,ru:item.nameRu,kk:item.nameKk}[currentLang]||item.name;
}

// ── PICKER (two-step add) ──
function showAddWorkout(editId=null) {
  appState._editId=editId||null; appState._pickerSearch=''; appState._pickerFilter='all';
  if(editId){ const item=appState.userPlan.find(p=>p.id===editId); if(item){openConfigModal(item.exId,EXERCISE_DB.find(e=>e.id===item.exId),item);return;} }
  renderPickerModal();
  document.getElementById('picker-modal').style.display='flex';
}
function closeAddWorkout() { document.getElementById('picker-modal').style.display='none'; document.getElementById('config-modal').style.display='none'; }

function renderPickerModal() {
  const search=appState._pickerSearch.toLowerCase(), filter=appState._pickerFilter;
  const filtered=EXERCISE_DB.filter(ex=>{
    const mF=filter==='all'||ex.groups.includes(filter)||ex.cat===filter;
    return mF&&(!search||getExerciseName(ex).toLowerCase().includes(search));
  });
  const filters=['all','neck','posture','slim','relax','elderly','pregnant','disabled','rehab','student','office','general'];
  const fLabel={all:t('filter_all'),office:t('filter_office'),elderly:t('filter_elderly'),pregnant:t('filter_pregnant'),disabled:t('filter_disabled'),rehab:t('filter_rehab'),student:t('filter_student'),general:t('filter_general'),neck:t('cat_neck'),posture:t('cat_posture'),slim:t('cat_slim'),relax:t('cat_relax')};
  document.getElementById('picker-filters').innerHTML=filters.map(f=>`<div class="filter-chip ${appState._pickerFilter===f?'active':''}" onclick="setPickerFilter('${f}')">${fLabel[f]||f}</div>`).join('');
  const empty={zh:'没有找到运动',en:'No exercises found',ru:'Не найдено',kk:'Табылмады'};
  document.getElementById('picker-list').innerHTML=filtered.length===0
    ?`<div class="empty-state"><div class="icon">🔍</div><p>${empty[currentLang]}</p></div>`
    :filtered.map(ex=>`
      <div class="picker-item" onclick="selectExerciseForPlan(${ex.id})">
        <div class="lib-em" style="width:44px;height:44px;font-size:28px">${ex.emoji}</div>
        <div style="flex:1;min-width:0">
          <h4 style="font-size:14px;font-weight:700">${getExerciseName(ex)}</h4>
          <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">
            <span class="chip chip-${ex.level==='easy'?'green':ex.level==='med'?'yellow':'orange'}" style="font-size:10px;padding:2px 8px">${getLevelLabel(ex.level)}</span>
            <span class="chip chip-blue" style="font-size:10px;padding:2px 8px">⏱ ${ex.duration}${t('min_label')}</span>
          </div>
          <p style="font-size:11px;color:var(--text-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t('suitable_for')}: ${getGroupLabels(ex.groups)}</p>
        </div>
        <span style="color:var(--primary);font-size:22px;flex-shrink:0">+</span>
      </div>`).join('');
}

function setPickerFilter(f){appState._pickerFilter=f;renderPickerModal();}
function searchPicker(val){appState._pickerSearch=val;renderPickerModal();}

function selectExerciseForPlan(exId) {
  document.getElementById('picker-modal').style.display='none';
  openConfigModal(exId,EXERCISE_DB.find(e=>e.id===exId),null);
}

function openConfigModal(exId,ex,existing) {
  document.getElementById('config-ex-emoji').textContent=ex?ex.emoji:'🏋️';
  document.getElementById('config-ex-name').textContent=ex?getExerciseName(ex):(existing?getPlanItemName(existing):'');
  document.getElementById('config-ex-meta').textContent=ex?`${getLevelLabel(ex.level)} · ${ex.duration}${t('min_label')}`:'';
  document.getElementById('config-time').value=existing?existing.time:'08:00';
  document.getElementById('config-note').value=existing?(existing.note||''):'';  
  document.getElementById('config-save-btn').onclick=()=>saveConfiguredWorkout(exId,ex,existing?existing.id:null);
  document.getElementById('config-modal').style.display='flex';
}
function closeConfigModal(){document.getElementById('config-modal').style.display='none';}

function saveConfiguredWorkout(exId,ex,editId) {
  const time=document.getElementById('config-time').value||'08:00';
  const note=document.getElementById('config-note').value.trim();
  const entry={id:editId||Date.now(),exId,name:ex?ex.nameZh:'',nameEn:ex?ex.nameEn:'',nameRu:ex?ex.nameRu:'',nameKk:ex?ex.nameKk:'',emoji:ex?ex.emoji:'🏋️',duration:ex?ex.duration:10,level:ex?ex.level:'easy',time,note};
  if(editId){const idx=appState.userPlan.findIndex(p=>p.id===editId);if(idx>-1)appState.userPlan[idx]=entry;}
  else appState.userPlan.push(entry);
  localStorage.setItem('userPlan',JSON.stringify(appState.userPlan));
  closeConfigModal(); renderPlanPage();
  showToast(t('plan_added'));
  if(typeof api!=='undefined'&&AUTH.isLoggedIn()&&!AUTH.isGuest()){api.put('/api/plan',{plan:appState.userPlan}).catch(()=>{});}
}

function editWorkout(id){const item=appState.userPlan.find(p=>p.id===id);if(!item)return;openConfigModal(item.exId,EXERCISE_DB.find(e=>e.id===item.exId),item);}
function deleteWorkout(id){
  const msg={zh:'确定删除？',en:'Remove?',ru:'Удалить?',kk:'Жою?'};
  if(!confirm(msg[currentLang]||msg.zh))return;
  appState.userPlan=appState.userPlan.filter(p=>p.id!==id);
  localStorage.setItem('userPlan',JSON.stringify(appState.userPlan));
  renderPlanPage();
}

// ── POSTURE SCAN ──
function startScan() {
  if(appState.scanning)return;
  appState.scanning=true;
  document.getElementById('scan-area').classList.add('scan-active');
  document.getElementById('scan-guide').style.display='none';
  document.getElementById('scan-mock-body').style.display='flex';
  const btn=document.getElementById('scan-btn');
  btn.disabled=true; btn.textContent={zh:'正在分析...',en:'Analyzing...',ru:'Анализирую...',kk:'Талдауда...'}[currentLang];
  setTimeout(()=>{
    appState.scanning=false; appState.scanDone=true;
    document.getElementById('scan-area').classList.remove('scan-active');
    showScanResult(); btn.textContent=t('rescan'); btn.disabled=false;
  },3500);
}

function showScanResult() {
  const sL={zh:{bad:'需改善',warn:'轻微',good:'正常'},en:{bad:'Needs work',warn:'Mild',good:'Good'},ru:{bad:'Требует работы',warn:'Умеренно',good:'Хорошо'},kk:{bad:'Жақсарту керек',warn:'Жеңіл',good:'Қалыпты'}};
  const iL={zh:['头前伸','圆肩驼背','骨盆前倾','高低肩'],en:['Forward Head','Rounded Shoulders','Pelvic Tilt','Shoulder Imbalance'],ru:['Выдвинутая голова','Сутулость','Наклон таза','Разные плечи'],kk:['Бас алға шығуы','Иық қисықтығы','Жамбас ауытқуы','Иық теңсіздігі']};
  const lbs=sL[currentLang]||sL.zh, names=iL[currentLang]||iL.zh;
  const results=[{label:names[0],status:'bad',score:42},{label:names[1],status:'warn',score:63},{label:names[2],status:'warn',score:58},{label:names[3],status:'good',score:88}];
  document.getElementById('scan-results').style.display='block';
  document.getElementById('scan-results').innerHTML=`
    <div style="margin-bottom:16px">
      <div class="section-title" style="margin-top:0">${t('result_title')}</div>
      <p style="font-size:13px;color:var(--text-muted)">${t('result_sub')}</p>
    </div>
    <div class="posture-zones">
      ${results.map(r=>`
        <div class="posture-item">
          <label>${r.label}</label>
          <strong class="status-${r.status}">${lbs[r.status]}</strong>
          <div class="posture-bar"><div class="posture-fill fill-${r.status}" style="width:${r.score}%"></div></div>
          <span style="font-size:11px;color:var(--text-muted)">${r.score} pts</span>
        </div>`).join('')}
    </div>
    <div style="margin-top:16px;padding:14px;background:var(--primary-light);border-radius:var(--radius-md)">
      <p style="font-size:13px;color:var(--primary-dark);font-weight:600">${t('result_suggest')}</p>
      <p style="font-size:13px;color:var(--primary-dark);margin-top:4px;line-height:1.6">${t('result_text')}</p>
    </div>
    <button class="btn-primary" style="margin-top:14px" onclick="openWorkout('posture')">${t('start_correction')}</button>`;
}

// ── AI CHAT ──
const AI_RESP = {
  zh:{ neck:'针对颈椎问题，推荐每天做「猫牛式颈椎拉伸」，动作要缓慢，不要快速旋转。', posture:'改善驼背：① 强化背部肌群 ② 拉伸胸大肌 ③ 激活核心，坚持4周会有明显变化。', slim:'无器械减脂关键是持续性，每天15分钟比偶尔剧烈运动效果更好。', sleep:'睡前腹式呼吸+腿部拉伸能有效降低皮质醇，帮助入睡。如果长期失眠，建议咨询医生。', default:['你好 🌿 我在这里，有什么想聊的？','根据你的情况，建议从颈椎拉伸开始，5分钟就够～','坐久了？现在就起来活动一下 💪','你的感受很重要，慢慢来，不用急。','有什么不舒服随时可以跟我说。'] },
  en:{ neck:'For neck issues, try Cat-Cow stretch daily. Move slowly, no quick rotations.', posture:'Fix rounded shoulders: ① Strengthen back ② Stretch chest ③ Activate core. 4 weeks for visible change.', slim:'Consistency beats intensity. 15 min/day is more effective than occasional hard workouts.', sleep:'Pre-sleep diaphragmatic breathing + leg stretches lower cortisol. If insomnia persists, see a doctor.', default:['Hi 🌿 I\'m here. What would you like to talk about?','Based on your situation, start with a neck stretch — just 5 minutes.','Been sitting long? Time to move 💪','Your feelings matter. Take it at your own pace.','You can always share what\'s bothering you.'] },
  ru:{ neck:'При проблемах с шеей делайте «кошку-корову» ежедневно. Двигайтесь медленно.', posture:'Исправить осанку: ① укрепить спину ② растянуть грудь ③ активировать кор. Результат через 4 недели.', slim:'Регулярность важнее интенсивности. 15 мин/день лучше редких интенсивных тренировок.', sleep:'Диафрагмальное дыхание + растяжка перед сном снижают кортизол. При хронической бессоннице обратитесь к врачу.', default:['Привет 🌿 Я здесь, о чём хотите поговорить?','Начните с растяжки шеи — всего 5 минут.','Долго сидели? Пора подвигаться 💪','Ваши чувства важны. Не торопитесь.','Вы всегда можете поделиться тем, что вас беспокоит.'] },
  kk:{ neck:'Мойын мәселесі үшін мысық-сиыр созылуын күнделікті жасаңыз. Баяу қозғалыңыз.', posture:'Қисықтықты түзету: ① арқаны нығайту ② кеуде созу ③ өзекті белсендіру. 4 аптада нәтиже.', slim:'Тұрақтылық қарқыннан маңызды. Күніне 15 минут сирек қарқынды жаттығудан жақсы.', sleep:'Ұйықтар алдында диафрагмалық тыныс + аяқ созылуы кортизолды азайтады. Ұзақ ұйқысыздықта дәрігерге барыңыз.', default:['Сәлем 🌿 Мен осындамын, не туралы сөйлескіңіз келеді?','Жағдайыңызға қарай мойын созылуынан бастаңыз — 5 минут жеткілікті.','Ұзақ отырдыңыз ба? Қазір қозғалыңыз 💪','Сіздің сезімдеріңіз маңызды. Асықпаңыз.','Не мазалайтынын кез келген уақытта айта аласыз.'] },
};

function sendChat() {
  const input=document.getElementById('chat-input');
  const msg=input.value.trim();
  if(!msg||appState.aiTyping)return;
  input.value='';
  appendMessage(msg,'user');

  // Emotion detection
  const emotion=detectMessageEmotion(msg);
  if(emotion==='crisis') { showTypingIndicator(); setTimeout(()=>{ removeTypingIndicator(); appendMessage(getAiReply(msg),'ai'); setTimeout(()=>showCrisisModal(true),600); },800); return; }
  if(emotion==='stress') { showTypingIndicator(); setTimeout(()=>{ removeTypingIndicator(); appendMessage(getAiReply(msg),'ai'); setTimeout(()=>showCrisisModal(false),600); },800); return; }

  showTypingIndicator();
  setTimeout(()=>{ removeTypingIndicator(); appendMessage(getAiReply(msg),'ai'); },1000+Math.random()*800);
}

function getAiReply(msg) {
  const m=msg.toLowerCase(), r=AI_RESP[currentLang]||AI_RESP.zh;
  if(m.includes('颈')||m.includes('脖')||m.includes('neck')||m.includes('шея')||m.includes('мойын')) return r.neck;
  if(m.includes('驼')||m.includes('背')||m.includes('posture')||m.includes('осанк')||m.includes('қалып')) return r.posture;
  if(m.includes('瘦')||m.includes('减')||m.includes('fat')||m.includes('slim')||m.includes('худ')||m.includes('арық')) return r.slim;
  if(m.includes('睡')||m.includes('sleep')||m.includes('сон')||m.includes('ұйқы')) return r.sleep;
  return r.default[Math.floor(Math.random()*r.default.length)];
}

function appendMessage(text,role) {
  const wrap=document.getElementById('chat-messages');
  const div=document.createElement('div'); div.className=`msg msg-${role}`;
  const now=new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
  div.innerHTML=role==='ai'
    ?`<div class="ai-avatar">🌿</div><div class="msg-bubble">${text}</div><div class="msg-time">${now}</div>`
    :`<div class="msg-bubble">${text}</div><div class="msg-time">${now}</div>`;
  wrap.appendChild(div); wrap.scrollTop=wrap.scrollHeight;
}
function showTypingIndicator(){appState.aiTyping=true;const w=document.getElementById('chat-messages');const d=document.createElement('div');d.className='msg msg-ai';d.id='typing-indicator';d.innerHTML=`<div class="ai-avatar">🌿</div><div class="msg-bubble"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;w.appendChild(d);w.scrollTop=w.scrollHeight;}
function removeTypingIndicator(){appState.aiTyping=false;document.getElementById('typing-indicator')?.remove();}
function quickPrompt(el){document.getElementById('chat-input').value=el.textContent;sendChat();}

// ── ACCESSIBILITY ──
// Language switch on auth page (updates both auth and app lang buttons)
function setLangAndUpdate(lang) {
  setLang(lang);
  document.querySelectorAll('.auth-lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang)
  );
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang)
  );
}

function setFontSize(size) {
  appState.fontSize = size;
  localStorage.setItem('fontSize', size);
  // All CSS uses rem, so changing html font-size scales everything globally
  const map = { small:'12px', normal:'15px', large:'18px', xlarge:'22px' };
  document.documentElement.style.fontSize = map[size] || '15px';
  document.querySelectorAll('.fsz').forEach(b => {
    const active = b.dataset.size === size;
    b.classList.toggle('active', active);
    b.style.borderColor = active ? 'var(--gold)'      : '';
    b.style.background  = active ? 'var(--gold-pale)' : '';
    b.style.color       = active ? 'var(--gold-dark)' : '';
    b.style.fontWeight  = active ? '700'               : '';
  });
}

function toggleHighContrast() {
  appState.highContrast=!appState.highContrast;
  localStorage.setItem('highContrast',appState.highContrast?'1':'0');
  document.body.classList.toggle('high-contrast',appState.highContrast);
  document.getElementById('contrast-toggle').checked=appState.highContrast;
}

function toggleVoiceCue() {
  appState.voiceCue=!appState.voiceCue;
  localStorage.setItem('voiceCue',appState.voiceCue?'1':'0');
  document.getElementById('voice-toggle').checked=appState.voiceCue;
}

// ── MODALS ──
function closeModal(id){document.getElementById(id).style.display='none';}

// ── STATS UPDATE ──
function updateProfileStats() {
  const el=document.getElementById('stat-days');
  if(el) el.textContent=appState.totalDays;
}

// ── TOAST ──
function showToast(msg) {
  let el=document.getElementById('app-toast');
  if(!el){el=document.createElement('div');el.id='app-toast';el.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#1A1614;color:#E8D5B0;padding:11px 20px;border-radius:100px;font-size:13px;font-weight:500;z-index:9999;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,0.4);opacity:0;transition:opacity 0.3s;pointer-events:none;letter-spacing:0.02em;border:1px solid rgba(201,169,110,0.3)';document.body.appendChild(el);}
  el.textContent=msg; el.style.opacity='1';
  clearTimeout(el._t); el._t=setTimeout(()=>{el.style.opacity='0';},2800);
}

// ── WEEK DOTS ──
function renderWeekDots() {
  const el=document.getElementById('week-dots');
  if(!el)return;
  const days=t('week_days')||['一','二','三','四','五','六','日','월','화','수']||['一','二','三','四','五','六','日'];
  const done=[1,1,1,1,1,0,0];
  el.innerHTML=days.map((d,i)=>`
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
      <div style="width:30px;height:30px;border-radius:50%;background:${done[i]?'var(--gold)':'var(--ivory-warm)'};border:1px solid ${done[i]?'var(--gold)':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:12px;color:${done[i]?'var(--ink)':'var(--muted-light)'}">${done[i]?'✓':''}</div>
      <span style="font-size:9px;color:var(--muted-light);letter-spacing:0.04em">${d}</span>
    </div>`).join('');
  const note=document.getElementById('checkin-note');
  if(note) note.textContent=t('checkin_note');
}

// ── AUTH UI ──
function switchAuthTab(tab) {
  document.getElementById('form-login').style.display    = tab==='login'    ? 'flex' : 'none';
  document.getElementById('form-register').style.display = tab==='register' ? 'flex' : 'none';
  document.getElementById('tab-login').classList.toggle('active',    tab==='login');
  document.getElementById('tab-register').classList.toggle('active', tab==='register');
}

async function doLogin() {
  const btn=document.getElementById('login-btn');
  btn.disabled=true; btn.textContent='...';
  AuthUI.clearError('login-error');
  const u=document.getElementById('login-user').value;
  const p=document.getElementById('login-pass').value;
  const res=await AUTH.login(u,p);
  if(res.ok) enterApp();
  else { AuthUI.showError('login-error',res.err); btn.disabled=false; btn.textContent=t('auth_login_btn')||'登录'; }
}

async function doRegister() {
  AuthUI.clearError('reg-error');
  const u=document.getElementById('reg-user').value;
  const p=document.getElementById('reg-pass').value;
  const p2=document.getElementById('reg-pass2').value;
  if(p!==p2){AuthUI.showError('reg-error','passwords_mismatch');return;}
  const res=await AUTH.register(u,p);
  if(res.ok) enterApp();
  else AuthUI.showError('reg-error',res.err);
}

function doGuest() {
  AUTH.enterAsGuest();
  enterApp();
}

function doLogout() {
  const msg={zh:'确定要退出登录吗？',en:'Log out?',ru:'Выйти из аккаунта?',kk:'Шығу?'};
  if(!confirm(msg[currentLang]||msg.zh))return;
  AUTH.logout();
  document.getElementById('app-wrap').style.display='none';
  document.getElementById('auth-page').classList.add('active');
}

function enterApp() {
  document.getElementById('auth-page').classList.remove('active');
  document.getElementById('app-wrap').style.display='block';
  // Update profile name
  const n=document.getElementById('profile-name');
  if(n) n.textContent = AUTH.isGuest()
    ? ({zh:'访客',en:'Guest',ru:'Гость',kk:'Қонақ'}[currentLang]||'访客')
    : AUTH.displayName();
  // Update greeting
  const g=document.getElementById('home-greeting');
  if(g && !AUTH.isGuest()) g.textContent = t('home_subtitle');
  initApp();
}

// ── AI SETTINGS ──
async function saveAIKey() {
  const key   = document.getElementById('ai-key-input').value.trim();
  const model = document.getElementById('ai-model-input').value.trim();
  const url   = document.getElementById('ai-url-input').value.trim();
  if(!key){ showToast(t('ai_input_key')||'请输入 API Key'); return; }
  const btn=document.querySelector('#page-ai-settings .btn-primary');
  btn.disabled=true; btn.textContent=t('ai_connecting')||'连接中...';
  await AI.saveKey(key, url||undefined, model||undefined);
  // Test connection
  const out=document.getElementById('ai-test-result');
  try {
    const testMsg={zh:'你好，请用一句话介绍自己',en:'Hello, please introduce yourself in one sentence.',ru:'Здравствуйте, представьтесь.',kk:'Сәлем, өзіңізді таныстырыңыз.',ko:'안녕하세요, 자기소개를 한 문장으로 해주세요.'};
    const reply=await AI.chat([{role:'user',content:testMsg[currentLang]||testMsg.zh}],{maxTokens:80});
    out.innerHTML=`<div class="ai-key-section"><p style="font-size:0.8rem;color:var(--c5)">${t('ai_connect_ok')}${reply}</p></div>`;
    updateAIStatus(true);
  } catch(e) {
    out.innerHTML=`<div class="ai-key-section"><p style="font-size:0.8rem;color:var(--c4)">${t('ai_connect_fail')}${e.message}</p></div>`;
    updateAIStatus(false);
  }
  btn.disabled=false; btn.textContent=t('ai_connect_btn')||'✦ 保存并连接';
}

function updateAIStatus(connected) {
  const chips=[document.getElementById('ai-status-chip'), document.getElementById('ai-menu-badge')];
  chips.forEach(c=>{ if(!c)return;
    c.className='ai-status '+(connected?'connected':'disconnected');
    c.textContent=connected?(t('ai_status_connected')||'✓ AI 已连接'):(t('ai_status_local')||'⚪ 本地模式');
  });
}

// Override sendChat to use AI module
function sendChat() {
  const input=document.getElementById('chat-input');
  const msg=input.value.trim();
  if(!msg||appState.aiTyping)return;
  sendChatWithAI(msg);
}

// ── MAIN INIT ──
async function initApp() {
  // Merge gym exercises
  if(typeof GYM_EXERCISES !== 'undefined') {
    GYM_EXERCISES.forEach(ex => {
      if(!EXERCISE_DB.find(e=>e.id===ex.id)) EXERCISE_DB.push(ex);
    });
  }
  // Merge gym animations
  if(typeof GYM_ANIMATIONS !== 'undefined' && typeof EXERCISE_ANIMATIONS !== 'undefined') {
    Object.assign(EXERCISE_ANIMATIONS, GYM_ANIMATIONS);
  }
  // Apply saved theme
  if(typeof applyTheme==='function') {
    const savedId   = localStorage.getItem('themeId')   || 'softlight';
    const savedMode = localStorage.getItem('themeMode')  || 'light';
    applyTheme(savedId, savedMode);
  }

  applyTranslations();
  showPage('home');
  renderWeekDots();
  selectMood('happy');
  setFontSize(appState.fontSize);
  if(appState.highContrast) document.body.classList.add('high-contrast');
  if(document.getElementById('contrast-toggle')) document.getElementById('contrast-toggle').checked=appState.highContrast;
  if(document.getElementById('voice-toggle'))    document.getElementById('voice-toggle').checked=appState.voiceCue;

  // Load AI key (v3 - supports custom API)
  await AI.loadKey();
  updateAIStatus(AI.hasKey());

  setTimeout(()=>{ const r=AI_RESP[currentLang]||AI_RESP.zh; appendMessage(r.default[0],'ai'); },400);
  if(typeof renderThemeSelector==='function') renderThemeSelector();
  // Pull plan & stats from backend
  if (typeof api !== 'undefined' && AUTH.isLoggedIn() && !AUTH.isGuest()) {
    api.get('/api/plan').then(res => {
      if (res.ok && res.data.plan?.length) {
        appState.userPlan = res.data.plan;
        localStorage.setItem('userPlan', JSON.stringify(appState.userPlan));
      }
    }).catch(() => {});
  }
  setTimeout(()=>{
    const path=document.getElementById('progress-path');
    if(path){ const c=2*Math.PI*30; path.style.strokeDashoffset=c*(1-0.68); }
  },600);

  document.getElementById('chat-input')?.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}
  });
  document.querySelectorAll('.modal-overlay').forEach(m=>{
    m.addEventListener('click',e=>{if(e.target===m)m.style.display='none';});
  });
  updateProfileStats();
}

// ── BOOTSTRAP ──
document.addEventListener('DOMContentLoaded', async ()=>{
  applyTranslations();
  const loggedIn=await AUTH.init();
  if(loggedIn) enterApp();
  // Auth form enter-key
  document.getElementById('login-pass')?.addEventListener('keydown',e=>{ if(e.key==='Enter')doLogin(); });
  document.getElementById('reg-pass2')?.addEventListener('keydown',e=>{ if(e.key==='Enter')doRegister(); });
});
