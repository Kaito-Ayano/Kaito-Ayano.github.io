// ═══════════════════════════════════════════
//  MUSIC PLAYER MODULE
//  内置运动纯音乐 + 本地 MP3 导入
// ═══════════════════════════════════════════

// Built-in tracks — generated via Web Audio API (no external files needed)
// Track titles are locale-neutral (transliteration works cross-language)
const BUILTIN_TRACKS = [
  { id:'b1', title:'Morning Beat',    artist:'LightFit', duration:180, genre:'motivation', bpm:120 },
  { id:'b2', title:'Steady Pulse',    artist:'LightFit', duration:210, genre:'steady',     bpm:100 },
  { id:'b3', title:'Deep Breath',      artist:'LightFit', duration:240, genre:'calm',       bpm:70  },
  { id:'b4', title:'Power Burst',    artist:'LightFit', duration:195, genre:'power',      bpm:135 },
  { id:'b5', title:'Gentle Flow',    artist:'LightFit', duration:300, genre:'relax',      bpm:60  },
  { id:'b6', title:'Run Tempo',    artist:'LightFit', duration:200, genre:'cardio',     bpm:145 },
  { id:'b7', title:'Meditation',    artist:'LightFit', duration:360, genre:'meditation', bpm:55  },
  { id:'b8', title:'HIIT Fire',    artist:'LightFit', duration:185, genre:'hiit',       bpm:155 },
];

const musicState = {
  tracks: [...BUILTIN_TRACKS],
  currentIdx: 0,
  playing: false,
  shuffle: false,
  repeat: 'none',   // 'none' | 'one' | 'all'
  volume: 0.7,
  elapsed: 0,
  ticker: null,
  audioCtx: null,
  gainNode: null,
  oscillator: null,
  currentSource: null,
  localTracks: JSON.parse(localStorage.getItem('localTracks') || '[]'),
};

// ── Web Audio synthetic music engine ──
function getAudioCtx() {
  if (!musicState.audioCtx) {
    musicState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    musicState.gainNode = musicState.audioCtx.createGain();
    musicState.gainNode.gain.value = musicState.volume;
    musicState.gainNode.connect(musicState.audioCtx.destination);
  }
  return musicState.audioCtx;
}

// Generate a simple rhythmic tone pattern for builtin tracks
function playBuiltinTrack(track) {
  stopAudio();
  const ctx = getAudioCtx();
  const bpm = track.bpm || 100;
  const beat = 60 / bpm;
  const patterns = {
    motivation: [440, 0, 440, 550, 0, 440, 0, 660],
    steady:     [330, 0, 330, 0, 440, 0, 330, 0],
    calm:       [264, 0, 0, 330, 0, 0, 396, 0],
    power:      [220, 440, 0, 220, 440, 550, 0, 440],
    relax:      [196, 0, 0, 0, 247, 0, 0, 0],
    cardio:     [330, 330, 0, 440, 330, 0, 440, 550],
    meditation: [174, 0, 0, 0, 0, 0, 0, 0],
    hiit:       [440, 550, 660, 0, 440, 550, 660, 880],
  };
  const freqs = patterns[track.genre] || patterns.steady;

  let time = ctx.currentTime;
  const loop = () => {
    if (!musicState.playing) return;
    freqs.forEach((freq, i) => {
      if (freq === 0) return;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.connect(env); env.connect(musicState.gainNode);
      osc.type = track.genre === 'meditation' || track.genre === 'relax' ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      const t = time + i * beat * 0.5;
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.18, t + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.45);
      osc.start(t); osc.stop(t + beat * 0.48);
    });
    time += freqs.length * beat * 0.5;
    musicState._loopTimer = setTimeout(loop, freqs.length * beat * 500);
  };
  loop();
}

function stopAudio() {
  clearTimeout(musicState._loopTimer);
  if (musicState.currentSource) {
    try { musicState.currentSource.stop(); } catch(e){}
    musicState.currentSource = null;
  }
}

// ── Controls ──
function musicPlay() {
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') ctx.resume();
  musicState.playing = true;
  const track = getAllTracks()[musicState.currentIdx];
  if (track._audio) {
    // Local file
    track._audio.volume = musicState.volume;
    track._audio.play().catch(()=>{});
  } else {
    playBuiltinTrack(track);
  }
  startTicker();
  renderMusicPlayer();
}

function musicPause() {
  musicState.playing = false;
  stopAudio();
  const track = getAllTracks()[musicState.currentIdx];
  if (track?._audio) track._audio.pause();
  stopTicker();
  renderMusicPlayer();
}

function musicToggle() {
  musicState.playing ? musicPause() : musicPlay();
}

function musicNext() {
  const tracks = getAllTracks();
  if (musicState.shuffle) {
    musicState.currentIdx = Math.floor(Math.random() * tracks.length);
  } else {
    musicState.currentIdx = (musicState.currentIdx + 1) % tracks.length;
  }
  musicState.elapsed = 0;
  if (musicState.playing) { stopAudio(); musicPlay(); }
  else renderMusicPlayer();
}

function musicPrev() {
  if (musicState.elapsed > 3) {
    musicState.elapsed = 0;
    renderMusicPlayer(); return;
  }
  const tracks = getAllTracks();
  musicState.currentIdx = (musicState.currentIdx - 1 + tracks.length) % tracks.length;
  musicState.elapsed = 0;
  if (musicState.playing) { stopAudio(); musicPlay(); }
  else renderMusicPlayer();
}

function musicSeekTo(pct) {
  const track = getAllTracks()[musicState.currentIdx];
  musicState.elapsed = Math.round(pct * (track?.duration || 180));
  if (track?._audio) track._audio.currentTime = musicState.elapsed;
  renderMusicPlayer();
}

function setVolume(v) {
  musicState.volume = v;
  if (musicState.gainNode) musicState.gainNode.gain.value = v;
  const track = getAllTracks()[musicState.currentIdx];
  if (track?._audio) track._audio.volume = v;
  renderMusicPlayer();
}

function toggleShuffle() {
  musicState.shuffle = !musicState.shuffle;
  renderMusicPlayer();
}

function cycleRepeat() {
  const modes = ['none', 'all', 'one'];
  const idx = modes.indexOf(musicState.repeat);
  musicState.repeat = modes[(idx + 1) % modes.length];
  renderMusicPlayer();
}

function startTicker() {
  stopTicker();
  musicState.ticker = setInterval(() => {
    const track = getAllTracks()[musicState.currentIdx];
    const dur = track?._audio ? track._audio.duration : (track?.duration || 180);
    if (track?._audio) musicState.elapsed = track._audio.currentTime;
    else musicState.elapsed = (musicState.elapsed + 1) % (dur || 180);
    // Auto-next
    if (musicState.elapsed >= dur - 1) {
      if (musicState.repeat === 'one') {
        musicState.elapsed = 0;
        if (track?._audio) { track._audio.currentTime = 0; track._audio.play(); }
        else { stopAudio(); playBuiltinTrack(track); }
      } else if (musicState.repeat === 'all' || musicState.shuffle) {
        musicNext();
      } else if (musicState.currentIdx < getAllTracks().length - 1) {
        musicNext();
      } else {
        musicPause();
      }
    }
    updateMusicProgress();
  }, 1000);
}

function stopTicker() {
  if (musicState.ticker) { clearInterval(musicState.ticker); musicState.ticker = null; }
}

function getAllTracks() {
  return [...musicState.tracks, ...musicState.localTracks];
}

function updateMusicProgress() {
  const bar = document.getElementById('music-progress-fill');
  const elapsed = document.getElementById('music-elapsed');
  const track = getAllTracks()[musicState.currentIdx];
  const dur = track?._audio ? (track._audio.duration || track.duration) : (track?.duration || 180);
  const pct = Math.min((musicState.elapsed / dur) * 100, 100);
  if (bar) bar.style.width = pct + '%';
  if (elapsed) elapsed.textContent = fmtTime(musicState.elapsed);
}

function fmtTime(s) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2,'0')}`;
}

// ── Local file import ──
function importLocalMusic() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'audio/mp3,audio/mpeg,audio/*'; input.multiple = true;
  input.onchange = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      await new Promise(res => { audio.onloadedmetadata = res; audio.onerror = res; });
      const track = {
        id: 'local_' + Date.now() + '_' + Math.random(),
        title: file.name.replace(/\.[^.]+$/, ''),
        artist: 'Local',
        duration: Math.round(audio.duration) || 180,
        genre: 'local',
        _audio: audio,
        _url: url,
      };
      musicState.localTracks.push(track);
    }
    showToast(`✓ ${files.length} ${typeof t==='function'?t('music_imported')||'首音乐导入':' tracks imported'}`);
    renderMusicPlayer();
  };
  input.click();
}

// ── Genre icons ──
function genreIcon(g) {
  return { motivation:'🔥', steady:'💪', calm:'🌿', power:'⚡', relax:'🌙', cardio:'🏃', meditation:'🧘', hiit:'🎯', local:'🎵' }[g] || '🎵';
}

// ── Render the inline music panel ──
function renderMusicPlayer() {
  const container = document.getElementById('music-player-panel');
  if (!container) return;

  const allTracks = getAllTracks();
  const track = allTracks[musicState.currentIdx] || allTracks[0];
  if (!track) return;

  const dur = track?._audio ? (track._audio.duration || track.duration || 180) : (track.duration || 180);
  const pct = Math.min((musicState.elapsed / dur) * 100, 100);

  const repeatIcon = { none:'🔁', all:'🔁', one:'🔂' }[musicState.repeat];
  const repeatColor = musicState.repeat !== 'none' ? 'var(--gold)' : 'rgba(201,169,110,0.35)';

  container.innerHTML = `
    <!-- Now playing -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
      <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#1A1614,#2A2218);border:1px solid var(--border-gold);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">
        ${genreIcon(track.genre)}
      </div>
      <div style="flex:1;min-width:0">
        <p style="font-size:13px;font-weight:600;color:var(--gold-light);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${track.title}</p>
        <p style="font-size:11px;color:rgba(201,169,110,0.45);margin-top:2px">${track.artist} · ${fmtTime(dur)}</p>
      </div>
      <button onclick="importLocalMusic()" style="background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.2);border-radius:8px;color:rgba(201,169,110,0.6);font-size:11px;padding:5px 8px;cursor:pointer;font-family:var(--font);white-space:nowrap">+ 导入</button>
    </div>

    <!-- Progress bar -->
    <div style="margin-bottom:12px">
      <div id="music-progress-bar" onclick="handleProgressClick(event)" style="height:4px;background:rgba(255,255,255,0.08);border-radius:100px;cursor:pointer;position:relative;margin-bottom:6px">
        <div id="music-progress-fill" style="height:100%;width:${pct}%;background:var(--gold);border-radius:100px;transition:width 0.5s linear;pointer-events:none"></div>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span id="music-elapsed" style="font-size:10px;color:rgba(201,169,110,0.4)">${fmtTime(musicState.elapsed)}</span>
        <span style="font-size:10px;color:rgba(201,169,110,0.4)">${fmtTime(dur)}</span>
      </div>
    </div>

    <!-- Controls -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <button onclick="toggleShuffle()" style="background:none;border:none;cursor:pointer;font-size:16px;color:${musicState.shuffle?'var(--gold)':'rgba(201,169,110,0.35)'}">🔀</button>
      <button onclick="musicPrev()" style="background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.15);border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:16px;color:var(--gold-light)">⏮</button>
      <button onclick="musicToggle()" style="background:linear-gradient(135deg,var(--gold),var(--gold-dark));border:none;border-radius:50%;width:48px;height:48px;cursor:pointer;font-size:20px;box-shadow:0 4px 14px rgba(201,169,110,0.3);color:var(--ink)">${musicState.playing ? '⏸' : '▶'}</button>
      <button onclick="musicNext()" style="background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.15);border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:16px;color:var(--gold-light)">⏭</button>
      <button onclick="cycleRepeat()" style="background:none;border:none;cursor:pointer;font-size:16px;color:${repeatColor}">${repeatIcon}</button>
    </div>

    <!-- Volume -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <span style="font-size:14px;color:rgba(201,169,110,0.4)">🔈</span>
      <div style="flex:1;height:4px;background:rgba(255,255,255,0.08);border-radius:100px;cursor:pointer;position:relative" onclick="handleVolumeClick(event)">
        <div style="height:100%;width:${Math.round(musicState.volume*100)}%;background:var(--gold);border-radius:100px;pointer-events:none"></div>
      </div>
      <span style="font-size:14px;color:rgba(201,169,110,0.4)">🔊</span>
    </div>

    <!-- Track list (compact) -->
    <div style="max-height:140px;overflow-y:auto;scrollbar-width:none">
      ${allTracks.slice(0, 12).map((t, i) => `
        <div onclick="selectTrack(${i})" style="display:flex;align-items:center;gap:10px;padding:7px 6px;border-radius:8px;cursor:pointer;background:${i===musicState.currentIdx?'rgba(201,169,110,0.1)':'transparent'};transition:background 0.15s">
          <span style="font-size:14px;width:20px;text-align:center">${genreIcon(t.genre)}</span>
          <div style="flex:1;min-width:0">
            <p style="font-size:12px;color:${i===musicState.currentIdx?'var(--gold-light)':'rgba(255,255,255,0.6)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:${i===musicState.currentIdx?'600':'400'}">${t.title}</p>
          </div>
          <span style="font-size:10px;color:rgba(201,169,110,0.3)">${fmtTime(t.duration)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function selectTrack(idx) {
  const wasPlaying = musicState.playing;
  if (musicState.playing) stopAudio();
  musicState.currentIdx = idx;
  musicState.elapsed = 0;
  if (wasPlaying) { musicState.playing = false; musicPlay(); }
  else renderMusicPlayer();
}

function handleProgressClick(e) {
  const bar = e.currentTarget;
  const rect = bar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  musicSeekTo(Math.max(0, Math.min(1, pct)));
}

function handleVolumeClick(e) {
  const bar = e.currentTarget;
  const rect = bar.getBoundingClientRect();
  const v = (e.clientX - rect.left) / rect.width;
  setVolume(Math.max(0, Math.min(1, v)));
}

// ── Player panel toggle inside trainer ──
let musicPanelOpen = false;
function toggleMusicPanel() {
  musicPanelOpen = !musicPanelOpen;
  const panel = document.getElementById('music-panel-wrap');
  if (panel) {
    panel.style.display = musicPanelOpen ? 'block' : 'none';
    if (musicPanelOpen) renderMusicPlayer();
  }
  const btn = document.getElementById('music-toggle-btn');
  if (btn) btn.style.color = musicPanelOpen || musicState.playing ? 'var(--gold)' : 'rgba(201,169,110,0.4)';
}
