// ═══════════════════════════════════════════
//  AUTH MODULE v2 — 对接真实后端
//  注册 / 登录 / 访客 / 自动刷新Token
// ═══════════════════════════════════════════

// ── 后端地址（部署时改为真实域名）──
const API_BASE = 'https://你的域名.com';  // ← 部署后修改这里

// ── Token 本地管理 ──
const TokenStore = {
  getAccess()  { return localStorage.getItem('lf_token'); },
  getRefresh() { return localStorage.getItem('lf_refresh'); },
  set(access, refresh) {
    localStorage.setItem('lf_token', access);
    if (refresh) localStorage.setItem('lf_refresh', refresh);
  },
  clear() {
    localStorage.removeItem('lf_token');
    localStorage.removeItem('lf_refresh');
    localStorage.removeItem('lf_user');
  },
};

// ── 通用请求（带自动刷新Token）──
async function apiRequest(method, path, body = null, _retried = false) {
  const headers = { 'Content-Type': 'application/json' };
  const token   = TokenStore.getAccess();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(API_BASE + path, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    // Token 过期 → 自动用 refreshToken 换新的
    if (res.status === 401 && !_retried) {
      const rf = TokenStore.getRefresh();
      if (rf) {
        const rfRes = await fetch(API_BASE + '/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: rf }),
        });
        if (rfRes.ok) {
          const d = await rfRes.json();
          TokenStore.set(d.data.token, d.data.refreshToken);
          return apiRequest(method, path, body, true); // 重试一次
        }
      }
      // 刷新也失败 → 清除登录态
      TokenStore.clear();
      AUTH.current = null;
    }

    const data = await res.json().catch(() => ({ success: false, msg: '响应解析失败' }));
    return { ok: res.ok, status: res.status, ...data };
  } catch (err) {
    // 网络不通 → 返回离线标记
    return { ok: false, status: 0, msg: '网络连接失败，请检查网络', offline: true };
  }
}

// 简便方法
const api = {
  get:  (path)       => apiRequest('GET',  path),
  post: (path, body) => apiRequest('POST', path, body),
  put:  (path, body) => apiRequest('PUT',  path, body),
};

// ═══════════════════════════════════════════
//  AUTH 对象（覆盖原本地版本）
// ═══════════════════════════════════════════
const AUTH = {
  current: null,

  // 启动时检查已有 Token
  async init() {
    const token = TokenStore.getAccess();
    if (!token) return false;
    const res = await api.get('/api/auth/me');
    if (res.ok) {
      this.current = { ...res.data, mode: 'user' };
      this._applyPrefs(res.data);
      return true;
    }
    if (res.status === 0) {
      // 离线时用本地缓存的用户信息保持登录状态
      const cached = localStorage.getItem('lf_user');
      if (cached) {
        try { this.current = { ...JSON.parse(cached), mode: 'user' }; return true; }
        catch {}
      }
    }
    TokenStore.clear();
    return false;
  },

  // 注册
  async register(username, password) {
    const uname = username?.trim();
    if (!uname || uname.length < 2) return { ok: false, err: 'username_short' };
    if (!password || password.length < 6) return { ok: false, err: 'password_short' };

    const res = await api.post('/api/auth/register', {
      username: uname.toLowerCase(),
      password,
      displayName: uname,
    });
    if (res.ok) {
      TokenStore.set(res.data.token, res.data.refreshToken);
      this.current = { ...res.data.user, mode: 'user' };
      localStorage.setItem('lf_user', JSON.stringify(res.data.user));
      return { ok: true, user: this.current };
    }
    return { ok: false, err: this._mapErr(res.msg) };
  },

  // 登录
  async login(username, password) {
    const uname = username?.trim();
    if (!uname) return { ok: false, err: 'username_short' };
    if (!password) return { ok: false, err: 'password_short' };

    const res = await api.post('/api/auth/login', {
      username: uname.toLowerCase(),
      password,
    });
    if (res.ok) {
      TokenStore.set(res.data.token, res.data.refreshToken);
      this.current = { ...res.data.user, mode: 'user' };
      localStorage.setItem('lf_user', JSON.stringify(res.data.user));
      this._applyPrefs(res.data.user);
      return { ok: true, user: this.current };
    }
    if (res.offline) return { ok: false, err: '网络连接失败，请检查网络后重试' };
    return { ok: false, err: this._mapErr(res.msg) };
  },

  // 访客
  enterAsGuest() {
    this.current = { uid: 'guest_' + Date.now(), displayName: '访客', mode: 'guest' };
    return { ok: true, user: this.current };
  },

  // 退出
  async logout() {
    try { await api.post('/api/auth/logout', {}); } catch {}
    TokenStore.clear();
    localStorage.removeItem('lf_user');
    this.current = null;
  },

  isLoggedIn() { return !!this.current; },
  isGuest()    { return this.current?.mode === 'guest'; },
  isVip()      { return !!this.current?.isVip; },
  displayName(){ return this.current?.displayName || '用户'; },

  // 同步用户偏好到APP状态
  _applyPrefs(user) {
    if (user.lang     && typeof setLang     === 'function') setLang(user.lang);
    if (user.theme    && typeof applyTheme  === 'function') applyTheme(user.theme);
    if (user.fontSize && typeof setFontSize === 'function') setFontSize(user.fontSize);
    if (user.totalDays != null && typeof appState !== 'undefined') {
      appState.totalDays = user.totalDays;
    }
  },

  // 后端错误信息 → 前端错误码
  _mapErr(msg = '') {
    if (msg.includes('用户名已被')) return 'username_taken';
    if (msg.includes('用户名或密码')) return 'wrong_password';
    if (msg.includes('不存在')) return 'user_not_found';
    if (msg.includes('封禁')) return 'account_banned';
    return msg;
  },
};

// ── AuthUI 错误文案 ──
const AuthUI = {
  errMsg(code) {
    const L = typeof currentLang !== 'undefined' ? currentLang : 'zh';
    const map = {
      zh: {
        username_short: '用户名至少2个字符',
        password_short: '密码至少6位',
        username_taken: '用户名已被使用',
        user_not_found: '用户名不存在',
        wrong_password: '用户名或密码错误',
        account_banned: '账号已被封禁，请联系客服',
        passwords_mismatch: '两次密码不一致',
      },
      en: {
        username_short: 'Username too short (min 2)',
        password_short: 'Password too short (min 6)',
        username_taken: 'Username already taken',
        user_not_found: 'User not found',
        wrong_password: 'Wrong username or password',
        account_banned: 'Account banned, contact support',
        passwords_mismatch: 'Passwords do not match',
      },
      ru: {
        username_short: 'Имя слишком короткое',
        password_short: 'Пароль минимум 6 символов',
        username_taken: 'Имя занято',
        user_not_found: 'Пользователь не найден',
        wrong_password: 'Неверный логин или пароль',
        account_banned: 'Аккаунт заблокирован',
        passwords_mismatch: 'Пароли не совпадают',
      },
      kk: {
        username_short: 'Пайдаланушы аты тым қысқа',
        password_short: 'Кем дегенде 6 таңба',
        username_taken: 'Пайдаланушы аты бос емес',
        user_not_found: 'Пайдаланушы табылмады',
        wrong_password: 'Логин немесе құпия сөз қате',
        account_banned: 'Аккаунт бұғатталған',
        passwords_mismatch: 'Құпия сөздер сәйкес емес',
      },
    };
    return (map[L] || map.zh)[code] || code;
  },
  showError(id, code) {
    const el = document.getElementById(id);
    if (el) { el.textContent = this.errMsg(code); el.style.display = 'block'; }
  },
  clearError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  },
};
