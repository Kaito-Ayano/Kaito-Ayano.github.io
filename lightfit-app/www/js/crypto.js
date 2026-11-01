// ═══════════════════════════════════════════
//  LOCAL CRYPTO ENGINE  —  AES-GCM + PBKDF2
//  所有用户数据本地加密，密钥由密码派生
//  绝不上传原始数据或密钥
// ═══════════════════════════════════════════

const CRYPTO = {
  // 从密码 + salt 派生 AES-GCM 密钥
  async deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name:'PBKDF2', salt, iterations:210000, hash:'SHA-256' },
      keyMaterial,
      { name:'AES-GCM', length:256 },
      false, ['encrypt','decrypt']
    );
  },

  // 加密字符串 → base64 密文
  async encrypt(plaintext, password, saltB64) {
    const salt = saltB64
      ? Uint8Array.from(atob(saltB64), c=>c.charCodeAt(0))
      : crypto.getRandomValues(new Uint8Array(16));
    const iv   = crypto.getRandomValues(new Uint8Array(12));
    const key  = await this.deriveKey(password, salt);
    const enc  = new TextEncoder();
    const buf  = await crypto.subtle.encrypt(
      { name:'AES-GCM', iv }, key, enc.encode(plaintext)
    );
    // Pack: salt(16) + iv(12) + ciphertext → base64
    const combined = new Uint8Array(salt.length + iv.length + buf.byteLength);
    combined.set(salt, 0);
    combined.set(iv, 16);
    combined.set(new Uint8Array(buf), 28);
    return btoa(String.fromCharCode(...combined));
  },

  // 解密 base64 密文 → 字符串
  async decrypt(b64, password) {
    try {
      const combined = Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
      const salt = combined.slice(0, 16);
      const iv   = combined.slice(16, 28);
      const data = combined.slice(28);
      const key  = await this.deriveKey(password, salt);
      const buf  = await crypto.subtle.decrypt({ name:'AES-GCM', iv }, key, data);
      return new TextDecoder().decode(buf);
    } catch { return null; }
  },

  // 哈希密码用于验证（不存明文）
  async hashPassword(password, saltB64) {
    const enc  = new TextEncoder();
    const salt = saltB64
      ? Uint8Array.from(atob(saltB64), c=>c.charCodeAt(0))
      : crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      { name:'PBKDF2', salt, iterations:210000, hash:'SHA-256' }, keyMaterial, 256
    );
    const hash    = btoa(String.fromCharCode(...new Uint8Array(bits)));
    const saltB64out = btoa(String.fromCharCode(...salt));
    return { hash, salt: saltB64out };
  },

  randB64(n=16) {
    return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(n))));
  }
};

// ═══════════════════════════════════════════
//  SECURE STORE  —  加密的本地存储封装
// ═══════════════════════════════════════════
const SecureStore = {
  _key: null,  // 当前会话密码，内存中，不持久化

  setSessionKey(password) { this._key = password; },
  clearSession()          { this._key = null; },

  async save(nsKey, data) {
    if (!this._key) { localStorage.setItem(nsKey, JSON.stringify(data)); return; }
    try {
      const cipher = await CRYPTO.encrypt(JSON.stringify(data), this._key);
      localStorage.setItem(nsKey, cipher);
    } catch(e) { console.warn('SecureStore.save error', e); }
  },

  async load(nsKey) {
    const raw = localStorage.getItem(nsKey);
    if (!raw) return null;
    if (!this._key) {
      try { return JSON.parse(raw); } catch { return null; }
    }
    try {
      // try decrypt first
      const plain = await CRYPTO.decrypt(raw, this._key);
      if (plain) return JSON.parse(plain);
      // fallback: plain JSON (migration / guest)
      return JSON.parse(raw);
    } catch { return null; }
  },

  remove(nsKey) { localStorage.removeItem(nsKey); }
};
