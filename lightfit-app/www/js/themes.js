// ═══════════════════════════════════════════
//  THEME SYSTEM v3 — 每套主题含亮/暗两模式
//  新增默认主题：微光影（Soft Light）
// ═══════════════════════════════════════════

// ── 主题定义：每套包含 light / dark 两组变量 ──
const THEME_DEFS = {

  // ── 1. 微光影 Soft Light（默认，Glassmorphism & Soft Light）──
  softlight: {
    name: { zh:'微光影', en:'Soft Light', ru:'Мягкий свет', kk:'Жұмсақ жарық', ko:'소프트 라이트' },
    light: {
      '--bg':         '#F2F0ED',
      '--bg2':        '#EAE7E2',
      '--bg3':        '#E0DDD7',
      '--surface':    'rgba(255,255,255,0.72)',
      '--surface2':   'rgba(255,255,255,0.52)',
      '--glass':      'rgba(255,255,255,0.60)',
      '--glass-b':    'rgba(255,255,255,0.85)',
      '--border':     'rgba(0,0,0,0.07)',
      '--border2':    'rgba(0,0,0,0.12)',
      '--text':       '#1C1917',
      '--text2':      '#44403C',
      '--text3':      '#78716C',
      '--accent':     '#C2954A',
      '--accent2':    '#A07840',
      '--accent3':    '#F5EDD8',
      '--accent4':    '#E8D5A8',
      '--pop':        '#D08060',
      '--pop2':       '#F0C090',
      '--teal':       '#0F766E',
      '--teal2':      '#CCFBF1',
      '--blur':       'blur(24px) saturate(1.8)',
      '--blur2':      'blur(12px) saturate(1.4)',
      '--shadow':     '0 2px 16px rgba(0,0,0,0.08)',
      '--shadow2':    '0 8px 32px rgba(0,0,0,0.12)',
      '--nav-bg':     'rgba(242,240,237,0.88)',
      '--header-bg':  'rgba(242,240,237,0.92)',
    },
    dark: {
      '--bg':         '#1A1714',
      '--bg2':        '#231F1B',
      '--bg3':        '#2C2822',
      '--surface':    'rgba(255,255,255,0.06)',
      '--surface2':   'rgba(255,255,255,0.03)',
      '--glass':      'rgba(255,255,255,0.07)',
      '--glass-b':    'rgba(255,255,255,0.12)',
      '--border':     'rgba(255,255,255,0.08)',
      '--border2':    'rgba(255,255,255,0.14)',
      '--text':       '#F5F0E8',
      '--text2':      '#C8BFB0',
      '--text3':      '#7A7068',
      '--accent':     '#C9A96E',
      '--accent2':    '#A07840',
      '--accent3':    'rgba(201,169,110,0.15)',
      '--accent4':    'rgba(201,169,110,0.25)',
      '--pop':        '#C4857A',
      '--pop2':       'rgba(196,133,122,0.2)',
      '--teal':       '#4BA89A',
      '--teal2':      'rgba(75,168,154,0.15)',
      '--blur':       'blur(24px) saturate(1.6)',
      '--blur2':      'blur(12px) saturate(1.4)',
      '--shadow':     '0 2px 16px rgba(0,0,0,0.3)',
      '--shadow2':    '0 8px 40px rgba(0,0,0,0.5)',
      '--nav-bg':     'rgba(16,14,11,0.88)',
      '--header-bg':  'rgba(16,14,11,0.92)',
    },
  },

  // ── 2. 清晨 Dawn ──
  dawn: {
    name: { zh:'清晨', en:'Dawn', ru:'Рассвет', kk:'Таң', ko:'새벽' },
    light: {
      '--bg':         '#F8F6F0',
      '--bg2':        '#F0EDE4',
      '--bg3':        '#E8E3D8',
      '--surface':    'rgba(255,255,255,0.75)',
      '--surface2':   'rgba(255,255,255,0.55)',
      '--glass':      'rgba(255,255,255,0.65)',
      '--glass-b':    'rgba(255,255,255,0.88)',
      '--border':     'rgba(0,0,0,0.06)',
      '--border2':    'rgba(0,0,0,0.10)',
      '--text':       '#1A1A18',
      '--text2':      '#4A4840',
      '--text3':      '#8A8680',
      '--accent':     '#D4956A',
      '--accent2':    '#B07040',
      '--accent3':    '#FDF0E6',
      '--accent4':    '#F5D8C0',
      '--pop':        '#E8708A',
      '--pop2':       'rgba(232,112,138,0.15)',
      '--teal':       '#4A9E90',
      '--teal2':      '#E0F4F0',
      '--blur':       'blur(22px) saturate(1.7)',
      '--blur2':      'blur(11px) saturate(1.4)',
      '--shadow':     '0 2px 14px rgba(0,0,0,0.07)',
      '--shadow2':    '0 8px 30px rgba(0,0,0,0.10)',
      '--nav-bg':     'rgba(248,246,240,0.90)',
      '--header-bg':  'rgba(248,246,240,0.94)',
    },
    dark: {
      '--bg':         '#17120E',
      '--bg2':        '#201810',
      '--bg3':        '#2A2016',
      '--surface':    'rgba(255,255,255,0.06)',
      '--surface2':   'rgba(255,255,255,0.03)',
      '--glass':      'rgba(212,149,106,0.06)',
      '--glass-b':    'rgba(212,149,106,0.12)',
      '--border':     'rgba(212,149,106,0.10)',
      '--border2':    'rgba(212,149,106,0.20)',
      '--text':       '#F4EDE4',
      '--text2':      '#C4B8A8',
      '--text3':      '#786860',
      '--accent':     '#D4956A',
      '--accent2':    '#B07040',
      '--accent3':    'rgba(212,149,106,0.15)',
      '--accent4':    'rgba(212,149,106,0.25)',
      '--pop':        '#E8708A',
      '--pop2':       'rgba(232,112,138,0.2)',
      '--teal':       '#4A9E90',
      '--teal2':      'rgba(74,158,144,0.15)',
      '--blur':       'blur(22px) saturate(1.6)',
      '--blur2':      'blur(11px) saturate(1.3)',
      '--shadow':     '0 2px 16px rgba(0,0,0,0.35)',
      '--shadow2':    '0 8px 40px rgba(0,0,0,0.55)',
      '--nav-bg':     'rgba(14,10,7,0.90)',
      '--header-bg':  'rgba(14,10,7,0.94)',
    },
  },

  // ── 3. 海雾 Mist ──
  mist: {
    name: { zh:'海雾', en:'Mist', ru:'Туман', kk:'Тұман', ko:'안개' },
    light: {
      '--bg':         '#EEF2F4',
      '--bg2':        '#E4EAED',
      '--bg3':        '#D8E2E8',
      '--surface':    'rgba(255,255,255,0.72)',
      '--surface2':   'rgba(255,255,255,0.52)',
      '--glass':      'rgba(255,255,255,0.62)',
      '--glass-b':    'rgba(255,255,255,0.88)',
      '--border':     'rgba(0,0,0,0.07)',
      '--border2':    'rgba(0,0,0,0.11)',
      '--text':       '#162028',
      '--text2':      '#3A4C58',
      '--text3':      '#7890A0',
      '--accent':     '#3B82A0',
      '--accent2':    '#2A6080',
      '--accent3':    '#DDF0F8',
      '--accent4':    '#B8DCEC',
      '--pop':        '#5B8FB0',
      '--pop2':       'rgba(91,143,176,0.15)',
      '--teal':       '#2A9E8A',
      '--teal2':      '#D0F4EC',
      '--blur':       'blur(24px) saturate(1.9)',
      '--blur2':      'blur(12px) saturate(1.5)',
      '--shadow':     '0 2px 14px rgba(0,0,0,0.07)',
      '--shadow2':    '0 8px 30px rgba(0,0,0,0.10)',
      '--nav-bg':     'rgba(238,242,244,0.90)',
      '--header-bg':  'rgba(238,242,244,0.94)',
    },
    dark: {
      '--bg':         '#0C1418',
      '--bg2':        '#121C22',
      '--bg3':        '#18242C',
      '--surface':    'rgba(255,255,255,0.05)',
      '--surface2':   'rgba(255,255,255,0.03)',
      '--glass':      'rgba(59,130,160,0.07)',
      '--glass-b':    'rgba(59,130,160,0.12)',
      '--border':     'rgba(59,130,160,0.10)',
      '--border2':    'rgba(59,130,160,0.20)',
      '--text':       '#E8F4F8',
      '--text2':      '#A8C8D8',
      '--text3':      '#5888A0',
      '--accent':     '#60A8C8',
      '--accent2':    '#3B82A0',
      '--accent3':    'rgba(96,168,200,0.15)',
      '--accent4':    'rgba(96,168,200,0.25)',
      '--pop':        '#70B0D0',
      '--pop2':       'rgba(112,176,208,0.2)',
      '--teal':       '#3ABAA0',
      '--teal2':      'rgba(58,186,160,0.15)',
      '--blur':       'blur(24px) saturate(1.7)',
      '--blur2':      'blur(12px) saturate(1.4)',
      '--shadow':     '0 2px 16px rgba(0,0,0,0.40)',
      '--shadow2':    '0 8px 40px rgba(0,0,0,0.60)',
      '--nav-bg':     'rgba(8,12,16,0.92)',
      '--header-bg':  'rgba(8,12,16,0.95)',
    },
  },

  // ── 4. 莫兰迪 Morandi ──
  morandi: {
    name: { zh:'莫兰迪', en:'Morandi', ru:'Моранди', kk:'Моранди', ko:'모란디' },
    light: {
      '--bg':         '#F4F0EC',
      '--bg2':        '#EBE6E0',
      '--bg3':        '#E0D8D0',
      '--surface':    'rgba(255,255,255,0.70)',
      '--surface2':   'rgba(255,255,255,0.50)',
      '--glass':      'rgba(255,255,255,0.62)',
      '--glass-b':    'rgba(255,255,255,0.86)',
      '--border':     'rgba(0,0,0,0.07)',
      '--border2':    'rgba(0,0,0,0.11)',
      '--text':       '#2C2620',
      '--text2':      '#584E46',
      '--text3':      '#968880',
      '--accent':     '#A08878',
      '--accent2':    '#806858',
      '--accent3':    '#F5EEE8',
      '--accent4':    '#E8DDD5',
      '--pop':        '#B88878',
      '--pop2':       'rgba(184,136,120,0.15)',
      '--teal':       '#6A9E96',
      '--teal2':      '#DCF0EE',
      '--blur':       'blur(22px) saturate(1.6)',
      '--blur2':      'blur(11px) saturate(1.3)',
      '--shadow':     '0 2px 14px rgba(0,0,0,0.07)',
      '--shadow2':    '0 8px 28px rgba(0,0,0,0.09)',
      '--nav-bg':     'rgba(244,240,236,0.90)',
      '--header-bg':  'rgba(244,240,236,0.94)',
    },
    dark: {
      '--bg':         '#1C1814',
      '--bg2':        '#262018',
      '--bg3':        '#302820',
      '--surface':    'rgba(255,255,255,0.05)',
      '--surface2':   'rgba(255,255,255,0.03)',
      '--glass':      'rgba(160,136,120,0.07)',
      '--glass-b':    'rgba(160,136,120,0.12)',
      '--border':     'rgba(160,136,120,0.10)',
      '--border2':    'rgba(160,136,120,0.20)',
      '--text':       '#F0EAE2',
      '--text2':      '#C0B4A8',
      '--text3':      '#806A60',
      '--accent':     '#B09080',
      '--accent2':    '#907060',
      '--accent3':    'rgba(176,144,128,0.15)',
      '--accent4':    'rgba(176,144,128,0.25)',
      '--pop':        '#C09888',
      '--pop2':       'rgba(192,152,136,0.2)',
      '--teal':       '#7AAEA6',
      '--teal2':      'rgba(122,174,166,0.15)',
      '--blur':       'blur(22px) saturate(1.5)',
      '--blur2':      'blur(11px) saturate(1.3)',
      '--shadow':     '0 2px 16px rgba(0,0,0,0.35)',
      '--shadow2':    '0 8px 38px rgba(0,0,0,0.55)',
      '--nav-bg':     'rgba(14,10,8,0.92)',
      '--header-bg':  'rgba(14,10,8,0.95)',
    },
  },

  // ── 5. 深夜 Night ──
  night: {
    name: { zh:'深夜', en:'Night', ru:'Ночь', kk:'Түн', ko:'밤하늘' },
    light: {
      '--bg':         '#F0EEFB',
      '--bg2':        '#E6E2F8',
      '--bg3':        '#DAD4F4',
      '--surface':    'rgba(255,255,255,0.72)',
      '--surface2':   'rgba(255,255,255,0.52)',
      '--glass':      'rgba(255,255,255,0.65)',
      '--glass-b':    'rgba(255,255,255,0.88)',
      '--border':     'rgba(99,102,241,0.08)',
      '--border2':    'rgba(99,102,241,0.15)',
      '--text':       '#1A1830',
      '--text2':      '#3A3860',
      '--text3':      '#7870A0',
      '--accent':     '#6366F1',
      '--accent2':    '#4F46E5',
      '--accent3':    '#EEF0FF',
      '--accent4':    '#D8DAFF',
      '--pop':        '#EC4899',
      '--pop2':       'rgba(236,72,153,0.12)',
      '--teal':       '#10B981',
      '--teal2':      '#D1FAE5',
      '--blur':       'blur(24px) saturate(1.9)',
      '--blur2':      'blur(12px) saturate(1.5)',
      '--shadow':     '0 2px 14px rgba(99,102,241,0.10)',
      '--shadow2':    '0 8px 30px rgba(99,102,241,0.14)',
      '--nav-bg':     'rgba(240,238,251,0.92)',
      '--header-bg':  'rgba(240,238,251,0.95)',
    },
    dark: {
      '--bg':         '#0C0B1A',
      '--bg2':        '#111028',
      '--bg3':        '#181534',
      '--surface':    'rgba(129,140,248,0.07)',
      '--surface2':   'rgba(129,140,248,0.04)',
      '--glass':      'rgba(129,140,248,0.08)',
      '--glass-b':    'rgba(129,140,248,0.14)',
      '--border':     'rgba(129,140,248,0.12)',
      '--border2':    'rgba(129,140,248,0.22)',
      '--text':       '#EEF0FF',
      '--text2':      '#B0B4E8',
      '--text3':      '#5C60A0',
      '--accent':     '#818CF8',
      '--accent2':    '#6366F1',
      '--accent3':    'rgba(129,140,248,0.15)',
      '--accent4':    'rgba(129,140,248,0.25)',
      '--pop':        '#F472B6',
      '--pop2':       'rgba(244,114,182,0.20)',
      '--teal':       '#34D399',
      '--teal2':      'rgba(52,211,153,0.15)',
      '--blur':       'blur(24px) saturate(1.8)',
      '--blur2':      'blur(12px) saturate(1.5)',
      '--shadow':     '0 2px 16px rgba(0,0,0,0.50)',
      '--shadow2':    '0 8px 40px rgba(0,0,0,0.70)',
      '--nav-bg':     'rgba(6,5,14,0.94)',
      '--header-bg':  'rgba(6,5,14,0.96)',
    },
  },

  // ── 6. 樱花 Sakura ──
  sakura: {
    name: { zh:'樱花', en:'Sakura', ru:'Сакура', kk:'Сакура', ko:'벚꽃' },
    light: {
      '--bg':         '#FDF2F5',
      '--bg2':        '#FAE8EE',
      '--bg3':        '#F5DCE5',
      '--surface':    'rgba(255,255,255,0.75)',
      '--surface2':   'rgba(255,255,255,0.55)',
      '--glass':      'rgba(255,255,255,0.68)',
      '--glass-b':    'rgba(255,255,255,0.90)',
      '--border':     'rgba(220,100,130,0.08)',
      '--border2':    'rgba(220,100,130,0.15)',
      '--text':       '#28101A',
      '--text2':      '#5A2840',
      '--text3':      '#A06880',
      '--accent':     '#D84880',
      '--accent2':    '#B83060',
      '--accent3':    '#FFF0F5',
      '--accent4':    '#FFD8E8',
      '--pop':        '#E87090',
      '--pop2':       'rgba(232,112,144,0.15)',
      '--teal':       '#E8789A',
      '--teal2':      '#FFE8F0',
      '--blur':       'blur(22px) saturate(1.8)',
      '--blur2':      'blur(11px) saturate(1.4)',
      '--shadow':     '0 2px 14px rgba(216,72,128,0.08)',
      '--shadow2':    '0 8px 30px rgba(216,72,128,0.12)',
      '--nav-bg':     'rgba(253,242,245,0.92)',
      '--header-bg':  'rgba(253,242,245,0.95)',
    },
    dark: {
      '--bg':         '#180810',
      '--bg2':        '#220E18',
      '--bg3':        '#2E1422',
      '--surface':    'rgba(232,120,154,0.06)',
      '--surface2':   'rgba(232,120,154,0.03)',
      '--glass':      'rgba(232,120,154,0.07)',
      '--glass-b':    'rgba(232,120,154,0.13)',
      '--border':     'rgba(232,120,154,0.10)',
      '--border2':    'rgba(232,120,154,0.20)',
      '--text':       '#FFF0F5',
      '--text2':      '#F0C0D0',
      '--text3':      '#906070',
      '--accent':     '#E8789A',
      '--accent2':    '#C45070',
      '--accent3':    'rgba(232,120,154,0.15)',
      '--accent4':    'rgba(232,120,154,0.25)',
      '--pop':        '#F090A8',
      '--pop2':       'rgba(240,144,168,0.20)',
      '--teal':       '#F090A8',
      '--teal2':      'rgba(240,144,168,0.15)',
      '--blur':       'blur(22px) saturate(1.7)',
      '--blur2':      'blur(11px) saturate(1.4)',
      '--shadow':     '0 2px 16px rgba(0,0,0,0.50)',
      '--shadow2':    '0 8px 40px rgba(0,0,0,0.65)',
      '--nav-bg':     'rgba(12,4,8,0.94)',
      '--header-bg':  'rgba(12,4,8,0.96)',
    },
  },
};

// ── 状态 ──
// 默认：微光影 亮色
let currentThemeId   = localStorage.getItem('themeId')   || 'softlight';
let currentThemeMode = localStorage.getItem('themeMode')  || 'light';

// ── 应用主题 ──
function applyTheme(themeId, mode) {
  if (themeId) currentThemeId   = themeId;
  if (mode)    currentThemeMode = mode;
  // 保存
  localStorage.setItem('themeId',   currentThemeId);
  localStorage.setItem('themeMode', currentThemeMode);

  const def = THEME_DEFS[currentThemeId] || THEME_DEFS.softlight;
  const vars = def[currentThemeMode] || def.light;

  // 应用 CSS 变量
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));

  // data-theme / data-mode 用于 CSS 选择器
  document.body.setAttribute('data-theme', currentThemeId);
  document.body.setAttribute('data-mode',  currentThemeMode);

  // 更新 meta theme-color
  const bgColor = vars['--bg'] || '#F2F0ED';
  const metaTag = document.querySelector('meta[name=theme-color]');
  if (metaTag) metaTag.content = bgColor;

  renderThemeSelector();

  // 同步后端
  if (typeof api !== 'undefined' && typeof AUTH !== 'undefined' && AUTH?.isLoggedIn?.() && !AUTH?.isGuest?.()) {
    api.put('/api/user/profile', { theme: currentThemeId + '_' + currentThemeMode }).catch(() => {});
  }
}

// ── 渲染主题选择器 ──
function renderThemeSelector() {
  const container = document.getElementById('theme-selector');
  if (!container) return;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'zh';

  // 亮/暗模式切换
  const modePicker = `
    <div style="display:flex;gap:6px;margin-bottom:14px">
      <button onclick="applyTheme(null,'light')" style="
        flex:1;padding:9px;border-radius:10px;border:1px solid ${currentThemeMode==='light'?'var(--accent)':'var(--border2)'};
        background:${currentThemeMode==='light'?'var(--accent3)':'var(--surface)'};
        color:${currentThemeMode==='light'?'var(--accent2)':'var(--text3)'};
        font-family:var(--font);font-size:12px;font-weight:${currentThemeMode==='light'?'700':'400'};cursor:pointer;
        display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s">
        ☀️ ${lang==='zh'?'浅色':lang==='en'?'Light':lang==='ru'?'Светлый':lang==='kk'?'Ашық':'라이트'}
      </button>
      <button onclick="applyTheme(null,'dark')" style="
        flex:1;padding:9px;border-radius:10px;border:1px solid ${currentThemeMode==='dark'?'var(--accent)':'var(--border2)'};
        background:${currentThemeMode==='dark'?'var(--accent3)':'var(--surface)'};
        color:${currentThemeMode==='dark'?'var(--accent)':'var(--text3)'};
        font-family:var(--font);font-size:12px;font-weight:${currentThemeMode==='dark'?'700':'400'};cursor:pointer;
        display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s">
        🌙 ${lang==='zh'?'深色':lang==='en'?'Dark':lang==='ru'?'Тёмный':lang==='kk'?'Қою':'다크'}
      </button>
    </div>`;

  // 主题色板 (2列 × 3行)
  const themeGrid = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
      ${Object.entries(THEME_DEFS).map(([id, def]) => {
        const isActive = id === currentThemeId;
        const swatch   = def.light['--accent'] || '#888';
        const swatchBg = def.light['--bg'] || '#F2F0ED';
        return `<button onclick="applyTheme('${id}',null)" style="
          padding:10px 6px 8px;border-radius:12px;
          border:2px solid ${isActive ? 'var(--accent)' : 'var(--border)'};
          background:${isActive ? 'var(--accent3)' : 'var(--surface)'};
          cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;gap:5px">
          <div style="width:32px;height:32px;border-radius:50%;
            background:linear-gradient(135deg,${swatchBg},${swatch});
            border:2px solid ${isActive ? swatch : 'transparent'};
            box-shadow:${isActive ? '0 0 0 2px ' + swatch + '40' : 'none'}"></div>
          <span style="font-size:10px;font-weight:${isActive?'700':'400'};
            color:${isActive?'var(--accent)':'var(--text3)'};letter-spacing:0.03em">
            ${def.name[lang] || def.name.zh}
          </span>
        </button>`;
      }).join('')}
    </div>`;

  container.innerHTML = modePicker + themeGrid;
}
