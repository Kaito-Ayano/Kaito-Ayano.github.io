// ═══════════════════════════════════════════
//  DATA VISUALIZATION — 训练数据图表
// ═══════════════════════════════════════════

// ── 模拟数据生成 ──
function genWeeklyData() {
  const days = (typeof t==='function'&&t('month_day_labels'))||['周一','周二','周三','周四','周五','周六','周日'];
  return days.map((d,i)=>({ day:d, min: [0,28,35,0,42,55,20][i], cal: [0,210,260,0,310,420,150][i] }));
}
function genMonthlyData() {
  return Array.from({length:4},(_,i)=>({ week:(typeof t==='function'?t('week_label')||'第{n}周':'第{n}周').replace('{n}',i+1), min:[85,120,97,140][i], sessions:[3,4,3,5][i] }));
}
function genCatData() {
  const cl = typeof t==='function' ? [t('cat_neck')||'颈椎修复',t('cat_posture')||'体态矫正',t('cat_slim')||'减脂训练',t('cat_relax')||'情绪解压'] : ['颈椎修复','体态矫正','减脂训练','情绪解压'];
  return [
    { label:cl[0], val:32, color:'var(--accent)' },
    { label:cl[1], val:28, color:'var(--pop)' },
    { label:cl[2], val:22, color:'var(--teal)' },
    { label:cl[3], val:18, color:'#7B9FE8' },
  ];
}
function genPostureHistory() {
  return [
    { date:'5/1', score:58 },{ date:'5/8', score:63 },{ date:'5/15', score:67 },
    { date:'5/22', score:70 },{ date:'5/29', score:72 },
  ];
}
function genStrengthData() {
  return [
    { ex:'Bench', current:80, start:60 },
    { ex:'Squat', current:100, start:70 },
    { ex:'Deadlift', current:120, start:80 },
    { ex:'Pull-up', current:12, start:5 },
  ];
}

// ── SVG 工具函数 ──
function svgBarChart({ data, xKey, yKey, color='var(--accent)', h=120, title='' }) {
  const maxV = Math.max(...data.map(d=>d[yKey]), 1);
  const W = 320, barW = Math.floor((W - 40) / data.length - 6);
  const bars = data.map((d,i)=>{
    const bh = Math.round((d[yKey]/maxV)*(h-20));
    const x = 30 + i * ((W-40)/data.length);
    const y = h - bh;
    return `
      <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${d[yKey]>0?color:'var(--border)'}"/>
      <text x="${x+barW/2}" y="${h+14}" text-anchor="middle" fill="var(--text3)" font-size="9">${d[xKey]}</text>
      ${d[yKey]>0?`<text x="${x+barW/2}" y="${y-4}" text-anchor="middle" fill="var(--muted-light)" font-size="9">${d[yKey]}</text>`:''}
    `;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${h+24}" xmlns="http://www.w3.org/2000/svg" style="width:100%;overflow:visible">
    ${bars}
    <line x1="24" y1="${h}" x2="${W}" y2="${h}" stroke="var(--border)" stroke-width="1"/>
  </svg>`;
}

function svgLineChart({ data, xKey, yKey, color='var(--accent)', h=100 }) {
  const W = 300, pad = 30;
  const vals = data.map(d=>d[yKey]);
  const minV = Math.min(...vals) - 5, maxV = Math.max(...vals) + 5;
  const toX = i => pad + i * (W - pad*2) / (data.length - 1);
  const toY = v => h - ((v - minV) / (maxV - minV)) * (h - 20);
  const pts = data.map((d,i)=>`${toX(i)},${toY(d[yKey])}`).join(' ');
  const area = `${toX(0)},${h} ${pts} ${toX(data.length-1)},${h}`;
  return `<svg viewBox="0 0 ${W} ${h+20}" xmlns="http://www.w3.org/2000/svg" style="width:100%;overflow:visible">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    <polygon points="${area}" fill="url(#lg)"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${data.map((d,i)=>`
      <circle cx="${toX(i)}" cy="${toY(d[yKey])}" r="4" fill="${color}" stroke="var(--surface)" stroke-width="2"/>
      <text x="${toX(i)}" y="${h+16}" text-anchor="middle" fill="var(--text3)" font-size="9">${d[xKey]}</text>
    `).join('')}
  </svg>`;
}

function svgDonutChart({ data, size=130 }) {
  const total = data.reduce((s,d)=>s+d.val, 0);
  const r = 46, cx = size/2, cy = size/2, stroke = 14;
  const c = 2*Math.PI*r;
  let offset = 0;
  const slices = data.map(d=>{
    const pct = d.val / total;
    const dash = pct * c;
    const gap  = c - dash;
    const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${stroke}"
      stroke-dasharray="${dash.toFixed(1)} ${gap.toFixed(1)}"
      stroke-dashoffset="${(-offset*c/360).toFixed(1)}"
      transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>`;
    offset += pct * 360;
    return el;
  }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="width:${size}px;height:${size}px">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--surface2)" stroke-width="${stroke}"/>
    ${slices}
    <text x="${cx}" y="${cy-4}" text-anchor="middle" fill="var(--text)" font-size="16" font-weight="500">${total}</text>
    <text x="${cx}" y="${cy+12}" text-anchor="middle" fill="var(--text3)" font-size="9">分钟</text>
  </svg>`;
}

function svgProgressBar({ label, current, start, max, color='var(--accent)' }) {
  const pct = Math.min(current/max*100, 100);
  const startPct = Math.min(start/max*100, 100);
  const gain = current - start;
  return `<div style="margin-bottom:12px">
    <div style="display:flex;justify-content:space-between;margin-bottom:5px">
      <span style="font-size:12px;font-weight:500;color:var(--text2)">${label}</span>
      <span style="font-size:12px;color:var(--text3)">${start} → <strong style="color:${color}">${current}</strong> <small style="color:var(--teal)">+${gain}</small></span>
    </div>
    <div style="height:7px;background:var(--surface2);border-radius:100px;overflow:hidden;position:relative">
      <div style="position:absolute;left:0;top:0;height:100%;width:${startPct}%;background:var(--border);border-radius:100px;transition:width 1s"></div>
      <div style="position:absolute;left:0;top:0;height:100%;width:${pct}%;background:${color};border-radius:100px;transition:width 1.2s ease"></div>
    </div>
  </div>`;
}

// ── 图表页面渲染 ──
let chartsTab = 'week'; // week | month | posture | strength | cats

function renderChartsPage() {
  const container = document.getElementById('charts-content');
  if(!container) return;

  const tabs = [
    { id:'week',     label:{zh:t('tab_week')||'本周',en:'Week',ru:'Неделя',kk:'Апта',ko:'이번 주'} },
    { id:'month',    label:{zh:t('tab_month')||'本月',en:'Month',ru:'Месяц',kk:'Ай',ko:'이번 달'} },
    { id:'posture',  label:{zh:t('tab_posture')||'体态',en:'Posture',ru:'Осанка',kk:'Қалып',ko:'자세'} },
    { id:'strength', label:{zh:t('tab_strength')||'力量',en:'Strength',ru:'Сила',kk:'Күш',ko:'근력'} },
    { id:'cats',     label:{zh:t('tab_cats')||'分类',en:'Types',ru:'Типы',kk:'Түрлер',ko:'유형'} },
  ];

  const tabsHtml = `<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:18px;scrollbar-width:none">
    ${tabs.map(t=>`<button onclick="setChartsTab('${t.id}')" style="flex-shrink:0;padding:6px 14px;border-radius:100px;border:1px solid ${chartsTab===t.id?'var(--accent)':'var(--border)'};background:${chartsTab===t.id?'var(--gold-pale)':'var(--surface)'};color:${chartsTab===t.id?'var(--accent2)':'var(--text3)'};font-family:var(--font);font-size:12px;font-weight:${chartsTab===t.id?'600':'400'};cursor:pointer;letter-spacing:0.03em">${t.label[currentLang]||t.label.zh||t.label[Object.keys(t.label)[0]]}</button>`).join('')}
  </div>`;

  let content = '';

  if(chartsTab === 'week') {
    const data = genWeeklyData();
    const totalMin = data.reduce((s,d)=>s+d.min,0);
    const trainDays = data.filter(d=>d.min>0).length;
    content = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
        <div class="card" style="text-align:center;padding:16px 10px">
          <div style="font-size:28px;font-weight:300;color:var(--accent)">${totalMin}</div>
          <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em;margin-top:3px">总分钟</div>
        </div>
        <div class="card" style="text-align:center;padding:16px 10px">
          <div style="font-size:28px;font-weight:300;color:var(--teal)">${trainDays}</div>
          <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em;margin-top:3px">训练天数</div>
        </div>
      </div>
      <div class="card">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:12px">每日训练分钟</p>
        ${svgBarChart({data,xKey:'day',yKey:'min',h:110})}
      </div>
      <div class="card" style="margin-top:10px">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:12px">每日消耗热量 (kcal)</p>
        ${svgBarChart({data,xKey:'day',yKey:'cal',h:90,color:'#C4857A'})}
      </div>`;
  } else if(chartsTab === 'month') {
    const data = genMonthlyData();
    content = `
      <div class="card">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:12px">每周训练分钟</p>
        ${svgBarChart({data,xKey:'week',yKey:'min',h:120})}
      </div>
      <div class="card" style="margin-top:10px">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:12px">每周训练次数</p>
        ${svgBarChart({data,xKey:'week',yKey:'sessions',h:80,color:'#7B9FE8'})}
      </div>
      <div class="card" style="margin-top:10px">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:12px">月度趋势</p>
        ${svgLineChart({data,xKey:'week',yKey:'min',h:100})}
      </div>`;
  } else if(chartsTab === 'posture') {
    const data = genPostureHistory();
    content = `
      <div class="card">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
          <div style="text-align:center">
            <div style="font-size:36px;font-weight:300;color:var(--accent)">72</div>
            <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em">当前评分</div>
          </div>
          <div style="flex:1">
            <p style="font-size:13px;font-weight:500;color:var(--text)">体态改善中 ↑</p>
            <p style="font-size:12px;color:var(--text3);margin-top:3px">较初测提升 <strong style="color:var(--teal)">+14分</strong></p>
          </div>
        </div>
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:12px">评分趋势</p>
        ${svgLineChart({data,xKey:'date',yKey:'score',h:110,color:'var(--accent)'})}
      </div>
      <div class="card" style="margin-top:10px">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:12px">各部位改善进度</p>
        <div class="posture-zones">
          <div class="posture-item"><label>头前伸</label><strong class="status-warn">轻微改善</strong><div class="posture-bar"><div class="posture-fill fill-warn" style="width:63%"></div></div></div>
          <div class="posture-item"><label>圆肩驼背</label><strong class="status-good">明显改善</strong><div class="posture-bar"><div class="posture-fill fill-good" style="width:78%"></div></div></div>
          <div class="posture-item"><label>骨盆前倾</label><strong class="status-warn">进行中</strong><div class="posture-bar"><div class="posture-fill fill-warn" style="width:58%"></div></div></div>
          <div class="posture-item"><label>高低肩</label><strong class="status-good">已矫正</strong><div class="posture-bar"><div class="posture-fill fill-good" style="width:88%"></div></div></div>
        </div>
      </div>`;
  } else if(chartsTab === 'strength') {
    const data = genStrengthData();
    content = `
      <div class="card">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:14px">力量成长对比</p>
        ${data.map(d=>svgProgressBar({label:d.ex,current:d.current,start:d.start,max:Math.ceil(d.current*1.3)})).join('')}
      </div>
      <div class="card" style="margin-top:10px">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:12px">力量提升率</p>
        ${svgBarChart({data: data.map(d=>({ex:d.ex.substring(0,2), gain: Math.round((d.current-d.start)/d.start*100)})), xKey:'ex', yKey:'gain', h:100, color:'var(--teal)'})}
      </div>`;
  } else if(chartsTab === 'cats') {
    const data = genCatData();
    const total = data.reduce((s,d)=>s+d.val,0);
    content = `
      <div class="card">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:16px">训练类型分布</p>
        <div style="display:flex;align-items:center;gap:20px">
          ${svgDonutChart({data})}
          <div style="flex:1">
            ${data.map(d=>`
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <div style="width:10px;height:10px;border-radius:50%;background:${d.color};flex-shrink:0"></div>
                <span style="font-size:12px;color:var(--text2);flex:1">${d.label}</span>
                <span style="font-size:12px;font-weight:500;color:var(--text3)">${Math.round(d.val/total*100)}%</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card" style="margin-top:10px">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:12px">各类型训练时长（分钟）</p>
        ${svgBarChart({data:data.map(d=>({...d,lbl:d.label.substring(0,3)})),xKey:'lbl',yKey:'val',h:90})}
      </div>`;
  }

  container.innerHTML = tabsHtml + content;
}

function setChartsTab(tab) {
  chartsTab = tab;
  renderChartsPage();
}
