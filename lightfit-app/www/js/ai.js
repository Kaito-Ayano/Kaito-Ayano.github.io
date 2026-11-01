// ═══════════════════════════════════════════
//  AI MODULE v3
//  支持：① 后端代理模式（服务端Key）
//         ② 用户自配置第三方 AI（本地加密存储）
// ═══════════════════════════════════════════

const AI = {
  _cfg: null,   // { mode:'server'|'custom', apiKey, baseURL, model }

  // ── 加载配置（启动时调用）──
  async loadKey() {
    try {
      const saved = await SecureStore.load('ai_config_v3');
      this._cfg = saved || { mode: 'server' };
    } catch { this._cfg = { mode: 'server' }; }
  },

  // ── 是否有可用 AI ──
  hasKey() {
    if (this._cfg?.mode === 'custom' && this._cfg?.apiKey) return true;
    // 服务端模式：登录用户可用
    return !!(typeof AUTH !== 'undefined' && AUTH.isLoggedIn?.() && !AUTH.isGuest?.());
  },

  // ── 获取配置 ──
  getConfig() { return this._cfg || { mode: 'server' }; },

  // ── 保存自定义配置 ──
  async saveCustom(apiKey, baseURL, model) {
    this._cfg = { mode: 'custom', apiKey, baseURL: baseURL || 'https://api.openai.com/v1', model: model || 'gpt-3.5-turbo' };
    await SecureStore.save('ai_config_v3', this._cfg);
  },

  // ── 切换到服务端模式 ──
  async useServer() {
    this._cfg = { mode: 'server' };
    await SecureStore.save('ai_config_v3', this._cfg);
  },

  // ── 健康顾问对话 ──
  async coachReply(userMsg, history = []) {
    if (!this.hasKey()) return null;
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';

    if (this._cfg?.mode === 'custom') {
      return this._customChat(userMsg, history, lang);
    }
    // 服务端代理
    const res = await api.post('/api/ai/chat', {
      message: userMsg, history: (history||[]).slice(-12), lang,
    });
    if (res.ok) return res.data.reply;
    if (res.status === 429) throw new Error(t('err_ai_limit') || '今日对话次数已达上限');
    if (res.status === 503) throw new Error(t('err_ai_unavail') || 'AI服务暂未开放');
    if (res.offline)        throw new Error(t('err_network') || '网络连接失败');
    throw new Error(res.msg || 'AI异常');
  },

  // ── 体态分析 ──
  async postureAnalysis(description) {
    if (!this.hasKey()) return null;
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';

    if (this._cfg?.mode === 'custom') {
      const prompt = {
        zh: `你是专业体态评估师。用户：${description}\n请给出：1)可能问题 2)分析 3)建议动作 4)注意事项。300字以内。`,
        en: `You are a posture specialist. User: ${description}\nProvide: 1)Issues 2)Analysis 3)Exercises 4)Cautions. Under 300 words.`,
        ru: `Вы специалист по осанке. Пользователь: ${description}\nДайте: 1)Проблемы 2)Анализ 3)Упражнения 4)Предупреждения. До 300 слов.`,
        kk: `Сіз қалып маманысыз. Пайдаланушы: ${description}\nБеріңіз: 1)Мәселелер 2)Талдау 3)Жаттығулар 4)Ескертулер. 300 сөзден аз.`,
        ko: `당신은 자세 전문가입니다. 사용자: ${description}\n다음을 제공하세요: 1)문제 2)분석 3)운동 4)주의사항. 300자 이내.`,
      }[lang] || `You are a posture specialist. User: ${description}\nProvide brief analysis and exercises.`;
      return this._customChat(prompt, [], lang, true);
    }
    const res = await api.post('/api/ai/posture', { description, lang });
    if (res.ok) return res.data.analysis;
    if (res.status === 429) throw new Error(t('err_ai_limit') || '每日AI分析次数已达上限');
    throw new Error(res.msg || 'AI分析异常');
  },

  // ── 直接调用第三方 API ──
  async _customChat(message, history, lang, singleTurn = false) {
    const { apiKey, baseURL, model } = this._cfg;
    const systemPrompts = {
      zh: '你是专业健康顾问，回答简洁温暖，不超过200字。遇到心理危机立即提供援助热线400-161-9995。',
      en: 'You are a compassionate health coach. Keep answers concise and warm, under 200 words.',
      ru: 'Вы профессиональный консультант по здоровью. Отвечайте кратко, до 200 слов.',
      kk: 'Сіз кәсіби денсаулық кеңесшісісіз. Жауаптарыңыз қысқа болсын, 200 сөзден аз.',
      ko: '당신은 전문 건강 코치입니다. 200자 이내로 간결하게 답변하세요.',
    };
    const messages = [
      { role: 'system', content: systemPrompts[lang] || systemPrompts.en },
      ...(singleTurn ? [] : (history||[]).slice(-10).map(h=>({ role:h.role, content:h.content }))),
      { role: 'user', content: String(message).slice(0, 2000) },
    ];
    const resp = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${apiKey}` },
      body: JSON.stringify({ model: model || 'gpt-3.5-turbo', messages, max_tokens: 500, temperature: 0.7 }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(()=>({}));
      throw new Error(err.error?.message || `HTTP ${resp.status}`);
    }
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || '';
  },

  // ── 测试连接 ──
  async testConnection() {
    const testMsg = { zh:'你好，请用一句话介绍自己', en:'Hello, introduce yourself briefly.', ru:'Здравствуйте, представьтесь кратко.', kk:'Сәлем, өзіңізді қысқаша таныстырыңыз.', ko:'안녕하세요, 간단히 자기소개해 주세요.' };
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';
    try {
      const reply = await this.coachReply(testMsg[lang] || testMsg.en, []);
      return { ok: true, reply };
    } catch(e) { return { ok: false, msg: e.message }; }
  },
};

// ── AI 回复历史 ──
let chatHistory = [];

// ── 发消息主函数 ──
async function sendChatWithAI(msg) {
  if (!msg.trim() || appState.aiTyping) return;
  document.getElementById('chat-input').value = '';
  appendMessage(msg, 'user');
  chatHistory.push({ role: 'user', content: msg });

  const emotion = detectMessageEmotion(msg);
  if (emotion === 'crisis') {
    showTypingIndicator();
    setTimeout(() => { removeTypingIndicator(); appendMessage(getAiReply(msg),'ai'); showCrisisModal(true); }, 700);
    return;
  }

  showTypingIndicator();
  if (AI.hasKey()) {
    try {
      const reply = await AI.coachReply(msg, chatHistory);
      removeTypingIndicator();
      if (reply) {
        appendMessage(reply, 'ai');
        chatHistory.push({ role:'assistant', content:reply });
      } else {
        appendMessage(getAiReply(msg), 'ai');
      }
      if (emotion === 'stress') setTimeout(()=>showCrisisModal(false), 800);
    } catch(err) {
      removeTypingIndicator();
      appendMessage(getAiReply(msg) + (err.message ? `\n\n(${err.message})` : ''), 'ai');
    }
  } else {
    setTimeout(()=>{ removeTypingIndicator(); appendMessage(getAiReply(msg),'ai'); if(emotion==='stress')setTimeout(()=>showCrisisModal(false),800); }, 800+Math.random()*600);
  }
}

// ── AI 设置页渲染 ──
function renderAISettingsPage() {
  const container = document.getElementById('ai-settings-content');
  if (!container) return;

  const cfg = AI.getConfig();
  const isCustom = cfg.mode === 'custom';
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';

  const PROVIDERS = [
    { label:'豆包（火山引擎）', url:'https://ark.cn-beijing.volces.com/api/v3', placeholder:'ep-xxxxxxxx（Endpoint ID）' },
    { label:'DeepSeek', url:'https://api.deepseek.com/v1', placeholder:'deepseek-chat' },
    { label:'通义千问', url:'https://dashscope.aliyuncs.com/compatible-mode/v1', placeholder:'qwen-turbo' },
    { label:'ChatGPT', url:'https://api.openai.com/v1', placeholder:'gpt-3.5-turbo' },
    { label:'本地 Ollama', url:'http://localhost:11434/v1', placeholder:'llama3' },
    { label:'其他 OpenAI 兼容 API', url:'', placeholder:'模型名称' },
  ];

  const providerOpts = PROVIDERS.map((p,i) => `<option value="${i}" ${cfg.baseURL===p.url?'selected':''}>${p.label}</option>`).join('');

  container.innerHTML = `
    <!-- 模式切换 -->
    <div style="display:flex;gap:8px;margin-bottom:16px">
      <button onclick="switchAIMode('server')" style="
        flex:1;padding:10px;border-radius:var(--r2);border:2px solid ${!isCustom?'var(--accent)':'var(--border)'};
        background:${!isCustom?'var(--accent3)':'var(--surface2)'};
        color:${!isCustom?'var(--accent2)':'var(--text3)'};
        font-family:var(--font);font-size:0.82rem;font-weight:${!isCustom?'700':'500'};cursor:pointer;transition:all 0.2s">
        🌐 ${lang==='zh'?'服务端 AI':lang==='en'?'Server AI':lang==='ru'?'Серверный ИИ':lang==='kk'?'Сервер ЖИ':'서버 AI'}
      </button>
      <button onclick="switchAIMode('custom')" style="
        flex:1;padding:10px;border-radius:var(--r2);border:2px solid ${isCustom?'var(--accent)':'var(--border)'};
        background:${isCustom?'var(--accent3)':'var(--surface2)'};
        color:${isCustom?'var(--accent2)':'var(--text3)'};
        font-family:var(--font);font-size:0.82rem;font-weight:${isCustom?'700':'500'};cursor:pointer;transition:all 0.2s">
        🔑 ${lang==='zh'?'自定义 API':lang==='en'?'Custom API':lang==='ru'?'Свой API':lang==='kk'?'Жеке API':'커스텀 API'}
      </button>
    </div>

    ${!isCustom ? `
    <!-- 服务端模式说明 -->
    <div class="ai-box">
      <h3 data-i18n="ai_service_status" style="font-size:0.85rem;font-weight:700;color:var(--accent2);margin-bottom:8px">✦ AI 服务状态</h3>
      <p style="font-size:0.78rem;color:var(--text2);line-height:1.65" data-i18n="ai_server_managed">AI 功能由服务端统一管理</p>
      <p style="margin-top:8px;font-size:0.72rem;color:var(--text3);line-height:1.7">
        <span data-i18n="ai_bullet_1">• 登录用户可直接使用 AI 体态分析和健康顾问</span><br>
        <span data-i18n="ai_bullet_2">• 免费用户每日 10 次对话，VIP 无限制</span><br>
        <span data-i18n="ai_bullet_3">• 访客模式使用本地知识库（无需网络）</span>
      </p>
      <button class="btn btn-primary btn-sm" onclick="testAIConnection()" style="margin-top:11px;width:auto" data-i18n="ai_test_btn">✦ 测试 AI 连接</button>
    </div>` : `
    <!-- 自定义 API 配置 -->
    <div class="card" style="padding:16px">
      <div class="field">
        <label class="input-label">${lang==='zh'?'服务商':lang==='en'?'Provider':lang==='ru'?'Провайдер':lang==='kk'?'Провайдер':'서비스 제공자'}</label>
        <select id="ai-provider-sel" class="input" onchange="onProviderChange(this.value)" style="font-family:var(--font)">
          ${providerOpts}
        </select>
      </div>
      <div class="field">
        <label class="input-label">API Key</label>
        <input class="input" id="ai-key-input" type="password"
          placeholder="${lang==='zh'?'粘贴您的 API Key':'Paste your API Key'}"
          value="${cfg.apiKey ? '••••••••' : ''}"
          onfocus="if(this.value==='••••••••')this.value=''"
          onblur="if(this.value==='')this.value='${cfg.apiKey?'••••••••':''}'"
        >
      </div>
      <div class="field">
        <label class="input-label">Base URL</label>
        <input class="input" id="ai-url-input" type="url"
          placeholder="https://api.openai.com/v1"
          value="${cfg.baseURL || ''}">
      </div>
      <div class="field">
        <label class="input-label">${lang==='zh'?'模型名称':'Model Name'}</label>
        <input class="input" id="ai-model-input" type="text"
          placeholder="${lang==='zh'?'例：gpt-3.5-turbo / ep-xxxxxxxx':'e.g. gpt-3.5-turbo'}"
          value="${cfg.model || ''}">
      </div>
      <button class="btn btn-primary" onclick="saveCustomAIKey()" style="margin-top:4px" data-i18n="ai_connect_btn">✦ 保存并连接</button>
    </div>

    <div class="card-flat" style="border-style:dashed;margin-top:10px">
      <p style="font-size:0.7rem;color:var(--text3);line-height:1.75">
        ${lang==='zh'?'🔒 API Key 使用 AES-256-GCM 加密后仅存储在本设备，绝不上传服务器。':'🔒 API Key is AES-256-GCM encrypted and stored on this device only — never uploaded.'}
      </p>
    </div>`}

    <div id="ai-test-result" style="margin-top:10px"></div>

    <div class="card-flat" style="border-style:dashed;margin-top:10px">
      <p style="font-size:0.72rem;color:var(--text3);line-height:1.75">
        <strong style="color:var(--text2)" data-i18n="ai_privacy_title">隐私说明：</strong>
        <span data-i18n="ai_privacy_body">对话内容仅用于回答，不用于训练模型。</span><br><br>
        <strong style="color:var(--text2)" data-i18n="ai_vip_title">VIP 特权：</strong>
        <span data-i18n="ai_vip_body">无限 AI 对话 · 深度体态分析 · 专属健康方案</span>
      </p>
    </div>
    <button class="btn btn-ghost" onclick="showPage('profile')" style="margin-top:8px" data-i18n="back">← 返回</button>
  `;
  applyTranslations();
}

async function switchAIMode(mode) {
  if (mode === 'server') await AI.useServer();
  else AI._cfg = { mode: 'custom', apiKey: '', baseURL: '', model: '' };
  renderAISettingsPage();
  updateAIStatus(AI.hasKey());
}

function onProviderChange(idx) {
  const PROVIDERS = [
    { url:'https://ark.cn-beijing.volces.com/api/v3', model:'ep-' },
    { url:'https://api.deepseek.com/v1', model:'deepseek-chat' },
    { url:'https://dashscope.aliyuncs.com/compatible-mode/v1', model:'qwen-turbo' },
    { url:'https://api.openai.com/v1', model:'gpt-3.5-turbo' },
    { url:'http://localhost:11434/v1', model:'llama3' },
    { url:'', model:'' },
  ];
  const p = PROVIDERS[parseInt(idx)];
  const urlInput = document.getElementById('ai-url-input');
  const modInput = document.getElementById('ai-model-input');
  if (urlInput && p.url) urlInput.value = p.url;
  if (modInput && p.model && !modInput.value) modInput.value = p.model;
}

async function saveCustomAIKey() {
  const keyEl  = document.getElementById('ai-key-input');
  const urlEl  = document.getElementById('ai-url-input');
  const modEl  = document.getElementById('ai-model-input');
  const key    = keyEl?.value?.trim();
  const url    = urlEl?.value?.trim();
  const model  = modEl?.value?.trim();

  if (!key || key === '••••••••') { showToast(t('ai_input_key') || '请输入 API Key'); return; }
  if (!url) { showToast('请输入 Base URL'); return; }

  const btn = document.querySelector('#ai-settings-content .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = t('ai_connecting') || '连接中...'; }

  await AI.saveCustom(key, url, model);
  const result = await AI.testConnection();
  const out = document.getElementById('ai-test-result');

  if (out) {
    out.innerHTML = result.ok
      ? `<div class="ai-box"><p style="font-size:0.8rem;color:var(--teal)">${t('ai_connect_ok') || '✓ 连接成功！AI 回复：'}${result.reply}</p></div>`
      : `<div class="ai-box" style="border-color:var(--pop)"><p style="font-size:0.8rem;color:var(--pop)">${t('ai_connect_fail') || '✗ 连接失败：'}${result.msg}</p></div>`;
  }
  updateAIStatus(result.ok);
  if (btn) { btn.disabled = false; btn.textContent = t('ai_connect_btn') || '✦ 保存并连接'; }
}

async function testAIConnection() {
  const btn = document.querySelector('#ai-settings-content .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = t('ai_connecting') || '连接中...'; }
  const result = await AI.testConnection();
  const out = document.getElementById('ai-test-result');
  if (out) {
    out.innerHTML = result.ok
      ? `<div class="ai-box"><p style="font-size:0.8rem;color:var(--teal)">${t('ai_connect_ok') || '✓ '}${result.reply}</p></div>`
      : `<div class="ai-box" style="border-color:var(--pop)"><p style="font-size:0.8rem;color:var(--pop)">${t('ai_connect_fail') || '✗ '}${result.msg}</p></div>`;
  }
  updateAIStatus(result.ok);
  if (btn) { btn.disabled = false; btn.textContent = t('ai_test_btn') || '✦ 测试 AI 连接'; }
}

function saveAIKey() { testAIConnection(); } // legacy compat
