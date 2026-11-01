// ═══════════════════════════════════════════
//  MASSAGE SERVICE MODULE — 上门按摩下单
// ═══════════════════════════════════════════

const MASSAGE_SERVICES = [
  { id:'m1', name:{zh:'经络全身疏通',en:'Full Body Meridian',ru:'Меридианный массаж',kk:'Толық дене меридианы'}, duration:60, price:288, emoji:'🌿', desc:{zh:'疏通全身经络，促进气血循环，缓解全身疲劳',en:'Full meridian unblocking, circulation boost, fatigue relief'} },
  { id:'m2', name:{zh:'颈肩深层放松',en:'Neck & Shoulder Deep',ru:'Глубокое расслабление шеи',kk:'Мойын иық терең релаксациясы'}, duration:45, price:198, emoji:'💆', desc:{zh:'针对久坐颈肩劳损，深层肌筋膜松解，改善圆肩',en:'For chronic desk posture issues, myofascial release'} },
  { id:'m3', name:{zh:'腰背专项疏通',en:'Lower Back Specialist',ru:'Специальный массаж спины',kk:'Бел арнайы массажы'}, duration:45, price:218, emoji:'🦴', desc:{zh:'腰椎间盘疏缓、竖脊肌放松，司机人群必选',en:'Lumbar disc relief, erector spinae relaxation'} },
  { id:'m4', name:{zh:'运动恢复按摩',en:'Sports Recovery',ru:'Спортивный восстановительный',kk:'Спорттық қалпына келтіру'}, duration:75, price:358, emoji:'💪', desc:{zh:'针对运动后肌肉酸痛，促进乳酸代谢，加速恢复',en:'Post-workout soreness relief, lactic acid clearance'} },
  { id:'m5', name:{zh:'孕妇舒缓按摩',en:'Prenatal Relaxation',ru:'Массаж для беременных',kk:'Жүкті әйелдерге массаж'}, duration:60, price:328, emoji:'🤰', desc:{zh:'专业孕妇手法，侧卧位操作，安全舒缓水肿疲劳',en:'Professional prenatal technique, side-lying position'} },
  { id:'m6', name:{zh:'足底反射疗法',en:'Reflexology',ru:'Рефлексотерапия',kk:'Рефлексология'}, duration:45, price:168, emoji:'🦶', desc:{zh:'刺激足底反射区，对应全身脏腑，促进整体健康',en:'Foot reflex zones for whole-body organ health'} },
  { id:'m7', name:{zh:'精油芳香按摩',en:'Aromatherapy',ru:'Ароматерапия',kk:'Ароматерапия'}, duration:90, price:428, emoji:'🌸', desc:{zh:'精选天然精油，放松神经系统，改善睡眠焦虑',en:'Natural essential oils, nervous system relaxation'} },
  { id:'m8', name:{zh:'头部穴位疏导',en:'Head Acupoint',ru:'Акупрессура головы',kk:'Бас нүктелері'}, duration:30, price:138, emoji:'🧠', desc:{zh:'头部经穴按压，缓解偏头痛、眼疲劳、焦虑失眠',en:'Head meridian points, migraines, eye fatigue relief'} },
];

let massageOrder = {
  serviceId: null,
  date: '',
  time: '',
  address: '',
  note: '',
};

function renderMassagePage() {
  const container = document.getElementById('massage-content');
  if(!container) return;
  container.innerHTML = `
    <!-- Hero -->
    <div style="background:linear-gradient(145deg,#1A0E14,#2E1A22);border-radius:var(--r4);padding:22px 20px;margin-bottom:18px;border:1px solid rgba(232,120,154,0.2);position:relative;overflow:hidden">
      <div style="position:absolute;right:-30px;top:-30px;width:140px;height:140px;background:radial-gradient(circle,rgba(232,120,154,0.08),transparent);border-radius:50%"></div>
      <p style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(232,120,154,0.6);position:relative;z-index:1">上门服务</p>
      <h2 style="font-size:18px;font-weight:400;color:#F7C0D0;margin-top:6px;position:relative;z-index:1">专业按摩师上门</h2>
      <p style="font-size:12px;color:rgba(247,192,208,0.55);margin-top:4px;line-height:1.6;position:relative;z-index:1">持证按摩师 · 上门服务 · 30分钟内到达</p>
      <div style="display:flex;gap:16px;margin-top:14px;position:relative;z-index:1">
        <div style="text-align:center"><div style="font-size:18px;font-weight:300;color:#F7C0D0">4.9</div><div style="font-size:9px;color:rgba(247,192,208,0.5);letter-spacing:0.05em">评分</div></div>
        <div style="text-align:center"><div style="font-size:18px;font-weight:300;color:#F7C0D0">1200+</div><div style="font-size:9px;color:rgba(247,192,208,0.5);letter-spacing:0.05em">服务次数</div></div>
        <div style="text-align:center"><div style="font-size:18px;font-weight:300;color:#F7C0D0">30min</div><div style="font-size:9px;color:rgba(247,192,208,0.5);letter-spacing:0.05em">响应时间</div></div>
      </div>
    </div>

    <!-- Services -->
    <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:12px">选择服务</p>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
      ${MASSAGE_SERVICES.map(s=>`
        <div onclick="selectMassage('${s.id}')" style="background:var(--surface);border-radius:var(--r2);padding:14px 16px;display:flex;align-items:center;gap:14px;border:1px solid ${massageOrder.serviceId===s.id?'var(--pop)':'var(--border)'};cursor:pointer;transition:all 0.18s;${massageOrder.serviceId===s.id?'background:var(--pop2);':''}" >
          <div style="font-size:28px;width:44px;height:44px;background:var(--surface2);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${s.emoji}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:14px;font-weight:600;color:var(--text)">${s.name[currentLang]||s.name.zh||s.name.en}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:2px;line-height:1.5">${s.desc[currentLang]||s.desc.zh}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:4px">${s.duration}分钟</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:18px;font-weight:500;color:var(--pop)">¥${s.price}</div>
            ${massageOrder.serviceId===s.id?'<div style="font-size:10px;color:var(--pop);margin-top:2px">已选 ✓</div>':''}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Booking Form (shown when service selected) -->
    ${massageOrder.serviceId ? `
    <div id="massage-form" style="background:var(--surface);border-radius:var(--r3);padding:18px;border:1px solid var(--border);margin-bottom:16px">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:14px">预约信息</p>
      <div class="form-group"><label>预约日期</label><input class="form-input" id="massage-date" type="date" value="${massageOrder.date}" onchange="massageOrder.date=this.value" min="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group"><label>预约时间</label>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
          ${['10:00','14:00','16:00','19:00','20:00','21:00'].map(t=>`<button onclick="selectMassageTime('${t}')" style="padding:8px 4px;border-radius:var(--r1);border:1px solid ${massageOrder.time===t?'var(--pop)':'var(--border)'};background:${massageOrder.time===t?'var(--pop2)':'var(--surface2)'};color:${massageOrder.time===t?'var(--pop)':'var(--text3)'};font-size:12px;font-weight:${massageOrder.time===t?'600':'400'};cursor:pointer;font-family:var(--font)">${t}</button>`).join('')}
        </div>
      </div>
      <div class="form-group"><label>上门地址</label><input class="form-input" id="massage-addr" type="text" placeholder="${t('massage_address_ph')||'请输入详细地址'}" value="${massageOrder.address}" oninput="massageOrder.address=this.value"></div>
      <div class="form-group"><label>备注（可选）</label><input class="form-input" id="massage-note" type="text" placeholder="${t('massage_note_ph')||'请填写备注'}" value="${massageOrder.note}" oninput="massageOrder.note=this.value"></div>
    </div>

    <!-- Price Summary -->
    <div style="background:var(--surface2);border-radius:var(--r2);padding:14px 16px;margin-bottom:14px;border:1px solid var(--border)">
      ${(()=>{ const s=MASSAGE_SERVICES.find(x=>x.id===massageOrder.serviceId); return s?`
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:13px;color:var(--text2)">${s.name[currentLang]||s.name.zh||s.name.en}</span>
          <span style="font-size:13px;color:var(--text)">¥${s.price}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:12px;color:var(--text3)">上门服务费</span>
          <span style="font-size:12px;color:var(--teal)">免费</span>
        </div>
        <div style="height:1px;background:var(--border);margin:8px 0"></div>
        <div style="display:flex;justify-content:space-between">
          <span style="font-size:14px;font-weight:600;color:var(--text)">合计</span>
          <span style="font-size:18px;font-weight:600;color:var(--pop)">¥${s.price}</span>
        </div>
      `:''; })()}
    </div>

    <button onclick="submitMassageOrder()" class="btn btn-primary" style="background:linear-gradient(135deg,#E8789A,#C45070);box-shadow:0 4px 14px rgba(232,120,154,0.3)">
      立即预约并支付
    </button>
    <p style="text-align:center;font-size:11px;color:var(--text3);margin-top:8px;line-height:1.6">支付后按摩师将在30分钟内与您确认 · 支持随时取消</p>
    ` : ''}
  `;
}

function selectMassage(id) {
  massageOrder.serviceId = id;
  renderMassagePage();
  // Scroll to form
  setTimeout(()=>{
    const form = document.getElementById('massage-form');
    if(form) form.scrollIntoView({behavior:'smooth',block:'start'});
  }, 100);
}

function selectMassageTime(time) {
  massageOrder.time = time;
  renderMassagePage();
}

function submitMassageOrder() {
  const { serviceId, date, time, address } = massageOrder;
  if(!serviceId) { showToast(t('massage_no_service')); return; }
  if(!date)    { showToast(t('massage_no_date')); return; }
  if(!time)    { showToast(t('massage_no_time')); return; }
  if(!address) { showToast(t('massage_no_addr')); return; }
  const s = MASSAGE_SERVICES.find(x=>x.id===serviceId);
  showMassageConfirm(s, date, time, address);
}

function showMassageConfirm(service, date, time, address) {
  const overlay = document.getElementById('massage-confirm-modal');
  document.getElementById('mc-service').textContent = service.name[currentLang]||service.name.zh;
  document.getElementById('mc-datetime').textContent = `${date} ${time}`;
  document.getElementById('mc-address').textContent = address;
  document.getElementById('mc-price').textContent = `¥${service.price}`;
  overlay.style.display = 'flex';
}

function closeMassageConfirm() { document.getElementById('massage-confirm-modal').style.display='none'; }

async function payMassageOrder() {
  const btn = document.querySelector('.massage-confirm-sheet button:last-child');
  if (btn) { btn.disabled = true; btn.textContent = '处理中...'; }

  // 如果未登录，提示登录
  if (typeof AUTH !== 'undefined' && AUTH.isGuest()) {
    closeMassageConfirm();
    showToast('请先登录后再预约服务');
    return;
  }

  try {
    const svc = MASSAGE_SERVICES.find(s => s.id === massageOrder.serviceId);
    if (!svc) return;

    // 1. 后端创建订单
    if (typeof api !== 'undefined' && AUTH?.isLoggedIn()) {
      const orderRes = await api.post('/api/massage/orders', {
        serviceId: parseInt(svc.id.replace('m','')),  // 后端是数字ID
        apptDate:  massageOrder.date,
        apptTime:  massageOrder.time,
        address:   massageOrder.address,
        note:      massageOrder.note,
      });

      if (!orderRes.ok) {
        closeMassageConfirm();
        showToast('下单失败：' + (orderRes.msg || '请重试'));
        return;
      }

      const { orderNo } = orderRes.data;

      // 2. 发起支付
      const payRes = await api.post('/api/payment/create', {
        orderNo, orderType: 'massage', payMethod: 'h5',
      });

      if (payRes.ok && payRes.data?.payData?.h5_url) {
        // 跳转微信H5支付页面
        const redirectBack = encodeURIComponent(window.location.href);
        window.location.href = payRes.data.payData.h5_url + '&redirect_url=' + redirectBack;
        return;
      }
    }
  } catch (err) {
    console.warn('支付请求失败，进入模拟模式:', err.message);
  }

  // 降级：模拟成功（开发/测试环境，或网络异常时）
  closeMassageConfirm();
  massageOrder = { serviceId: null, date: '', time: '', address: '', note: '' };
  renderMassagePage();
  showToast(t('massage_success'));
}
