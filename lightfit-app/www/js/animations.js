// ═══════════════════════════════════════════════════════
//  EXERCISE ANIMATION ENGINE
//  每个运动包含：SVG人体姿势关键帧 + 步骤文字说明
// ═══════════════════════════════════════════════════════

// ── 通用SVG人体部件生成器 ──
// 坐标系：200x280，中心x=100
// ── LAYOUT CONSTANTS ──
// viewBox = "0 0 200 240"
// Safe zone: x∈[8,192], y∈[8,215]
// Label zone: y∈[218,232] — never overlaps figure
// Background rect: "0 0 200 240" rx=16

const BODY = {
  // 站立人体 — 完整适配 viewBox 200×240
  // 默认: 头顶 y=20, 脚底 y=210 (安全边距各10px)
  standing(opts={}) {
    const {
      headX=100, headY=30,
      neckY=48,
      shoulderLX=72, shoulderRX=128, shoulderY=62,
      elbowLX=60,  elbowRX=140,  elbowY=92,
      wristLX=56,  wristRX=144,  wristY=118,
      hipLX=82,    hipRX=118,    hipY=130,
      kneeLX=82,   kneeRX=118,   kneeY=170,
      ankleLX=82,  ankleRX=118,  ankleY=200,
      footLX=74,   footRX=126,   footY=210,
      torsoColor='#3ECFA8', limbColor='#2BAD8A', skinColor='#FBBF7C',
      strokeW=7
    } = opts;
    return `
      <circle cx="${headX}" cy="${headY}" r="18" fill="${skinColor}" stroke="${torsoColor}" stroke-width="2.5"/>
      <line x1="${headX}" y1="${headY+18}" x2="${headX}" y2="${neckY}" stroke="${skinColor}" stroke-width="${strokeW}"/>
      <line x1="${headX}" y1="${neckY}" x2="${headX}" y2="${hipY}" stroke="${torsoColor}" stroke-width="${strokeW+1}" stroke-linecap="round"/>
      <line x1="${shoulderLX}" y1="${shoulderY}" x2="${shoulderRX}" y2="${shoulderY}" stroke="${torsoColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${shoulderLX}" y1="${shoulderY}" x2="${elbowLX}" y2="${elbowY}" stroke="${limbColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${elbowLX}" y1="${elbowY}" x2="${wristLX}" y2="${wristY}" stroke="${limbColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${shoulderRX}" y1="${shoulderY}" x2="${elbowRX}" y2="${elbowY}" stroke="${limbColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${elbowRX}" y1="${elbowY}" x2="${wristRX}" y2="${wristY}" stroke="${limbColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${hipLX}" y1="${hipY}" x2="${hipRX}" y2="${hipY}" stroke="${torsoColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${hipLX}" y1="${hipY}" x2="${kneeLX}" y2="${kneeY}" stroke="${limbColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${kneeLX}" y1="${kneeY}" x2="${ankleLX}" y2="${ankleY}" stroke="${limbColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${ankleLX}" y1="${ankleY}" x2="${footLX}" y2="${footY}" stroke="${limbColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${hipRX}" y1="${hipY}" x2="${kneeRX}" y2="${kneeY}" stroke="${limbColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${kneeRX}" y1="${kneeY}" x2="${ankleRX}" y2="${ankleY}" stroke="${limbColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
      <line x1="${ankleRX}" y1="${ankleY}" x2="${footRX}" y2="${footY}" stroke="${limbColor}" stroke-width="${strokeW}" stroke-linecap="round"/>
    `;
  },

  // 坐姿 — seatY 默认145，脚落在 seatY+55 ≤ 200
  seated(opts={}) {
    const { seatY=145, torsoColor='#3ECFA8', limbColor='#2BAD8A', skinColor='#FBBF7C', strokeW=7, ...rest } = opts;
    const o = {
      torsoColor, limbColor, skinColor, strokeW,
      hipLX:74, hipRX:126, hipY:seatY,
      kneeLX:62, kneeRX:138, kneeY:seatY,
      ankleLX:62, ankleRX:138, ankleY:seatY+50,
      footLX:54, footRX:146, footY:seatY+58,
      ...rest,
    };
    return BODY.standing(o) +
      `<rect x="42" y="${seatY+2}" width="116" height="9" rx="4" fill="#CBD5E1" opacity="0.4"/>`;
  },

  // 文字标签辅助 — 固定在安全区底部，深色背景防止重叠
  label(text, color='#C9A96E') {
    return `
      <rect x="20" y="217" width="160" height="18" rx="6" fill="rgba(0,0,0,0.55)"/>
      <text x="100" y="230" text-anchor="middle" fill="${color}" font-size="11" font-weight="600">${text}</text>
    `;
  }
};

// ── 动画帧定义：每个运动2-4个姿势关键帧 + 提示文字 ──
const EXERCISE_ANIMATIONS = {

  // ─── 颈椎系列 ───

  1: { // 猫牛式颈椎拉伸
    name:'猫牛式颈椎拉伸', bg:'#0e1a14',
    steps:[
      { label:{zh:'起始：头部中立', en:'Start: neutral head', ru:'Начало: нейтральная голова', kk:'Бастапқы: бейтарап бас'},
        svg: `<g>${BODY.standing({headY:30, shoulderY:62})}</g>
        <text x="100" y="228" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="12">准备姿势</text>` },
      { label:{zh:'低头：下颌贴胸', en:'Tuck chin to chest', ru:'Опустите подбородок к груди', kk:'Иекті кеудеге тақаңыз'},
        svg: `<g>${BODY.standing({headX:100, headY:46, neckY:58,
          shoulderY:72, shoulderLX:70, shoulderRX:130})}</g>
        <path d="M100 36 Q95 50 100 56" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">↓ 慢慢低头</text>` },
      { label:{zh:'抬头：下颌上扬', en:'Lift chin up', ru:'Поднимите подбородок вверх', kk:'Иекті жоғары көтеріңіз'},
        svg: `<g>${BODY.standing({headX:102, headY:26, neckY:50,
          shoulderY:62, shoulderLX:72, shoulderRX:128})}</g>
        <path d="M100 46 Q105 32 102 26" fill="none" stroke="#F5C842" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">↑ 慢慢抬头</text>` },
    ]
  },

  2: { // 肩颈耸肩放松
    name:'肩颈耸肩放松', bg:'#0e1a14',
    steps:[
      { label:{zh:'放松：肩膀自然下垂', en:'Relax shoulders down', ru:'Расслабьте плечи вниз', kk:'Иықты төмен жіберіңіз'},
        svg: `<g>${BODY.standing()}</g>` },
      { label:{zh:'耸肩：用力向上', en:'Shrug shoulders UP', ru:'Поднимите плечи ВВЕРХ', kk:'Иықты ЖОҒАРЫ көтеріңіз'},
        svg: `<g>${BODY.standing({shoulderY:56, shoulderLX:68, shoulderRX:132,
          elbowLX:58, elbowRX:142, elbowY:88, wristLX:54, wristRX:146, wristY:116})}</g>
        <text x="72" y="52" fill="#3ECFA8" font-size="18">↑</text>
        <text x="120" y="52" fill="#3ECFA8" font-size="18">↑</text>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">保持2秒</text>` },
      { label:{zh:'放下：慢慢落回', en:'Release — slowly drop', ru:'Медленно опустите', kk:'Баяу түсіріңіз'},
        svg: `<g>${BODY.standing({shoulderY:74, shoulderLX:72, shoulderRX:128})}</g>
        <text x="72" y="78" fill="#F5C842" font-size="18">↓</text>
        <text x="120" y="78" fill="#F5C842" font-size="18">↓</text>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">慢慢放下</text>` },
    ]
  },

  3: { // 胸椎旋转拉伸
    name:'胸椎旋转拉伸', bg:'#0e1a14',
    steps:[
      { label:{zh:'起始：双臂展开平举', en:'Arms open wide', ru:'Раскройте руки в стороны', kk:'Қолдарды жайыңыз'},
        svg: `<g>${BODY.standing({
          elbowLX:48, elbowRX:152, elbowY:78,
          wristLX:28, wristRX:172, wristY:82})}</g>
        <text x="100" y="228" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="12">双臂平举</text>` },
      { label:{zh:'向左旋转', en:'Rotate left', ru:'Повернитесь влево', kk:'Солға бұрылыңыз'},
        svg: `<g>${BODY.standing({
          headX:96, headY:30,
          shoulderLX:62, shoulderRX:124, shoulderY:62,
          elbowLX:36, elbowRX:144, elbowY:76,
          wristLX:18, wristRX:160, wristY:80,
          hipLX:82, hipRX:118})}</g>
        <path d="M60 78 A50 50 0 0 0 36 76" fill="none" stroke="#3ECFA8" stroke-width="3" stroke-dasharray="5,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">← 向左转</text>` },
      { label:{zh:'向右旋转', en:'Rotate right', ru:'Повернитесь вправо', kk:'Оңға бұрылыңыз'},
        svg: `<g>${BODY.standing({
          headX:104, headY:30,
          shoulderLX:76, shoulderRX:138, shoulderY:62,
          elbowLX:56, elbowRX:164, elbowY:76,
          wristLX:40, wristRX:182, wristY:80,
          hipLX:82, hipRX:118})}</g>
        <path d="M140 78 A50 50 0 0 1 164 76" fill="none" stroke="#F5C842" stroke-width="3" stroke-dasharray="5,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">→ 向右转</text>` },
    ]
  },

  4: { // 颈部侧屈拉伸
    name:'颈部侧屈拉伸', bg:'#0e1a14',
    steps:[
      { label:{zh:'头部中立位', en:'Neutral head position', ru:'Нейтральное положение', kk:'Бейтарап қалып'},
        svg: `<g>${BODY.standing()}</g>` },
      { label:{zh:'向左侧倒头', en:'Tilt head left', ru:'Наклоните голову влево', kk:'Басты солға еңкейтіңіз'},
        svg: `<g>${BODY.standing({headX:88, headY:38,
          neckY:55, shoulderY:62})}</g>
        <path d="M100 18 Q90 28 88 38" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <!-- Right neck stretch indicator -->
        <path d="M118 52 Q110 46 104 42" fill="none" stroke="#FF7D54" stroke-width="2" opacity="0.7"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">← 保持15秒</text>` },
      { label:{zh:'向右侧倒头', en:'Tilt head right', ru:'Наклоните голову вправо', kk:'Басты оңға еңкейтіңіз'},
        svg: `<g>${BODY.standing({headX:112, headY:38,
          neckY:55, shoulderY:62})}</g>
        <path d="M100 18 Q110 28 112 38" fill="none" stroke="#F5C842" stroke-width="2" stroke-dasharray="4,3"/>
        <path d="M82 52 Q90 46 96 42" fill="none" stroke="#FF7D54" stroke-width="2" opacity="0.7"/>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">→ 保持15秒</text>` },
    ]
  },

  5: { // 坐姿颈椎牵引
    name:'坐姿颈椎牵引', bg:'#0e1a14',
    steps:[
      { label:{zh:'坐直，双手置于后脑', en:'Sit tall, hands behind head', ru:'Сядьте прямо, руки за голову', kk:'Тік отырыңыз, қолдарды желкеге'},
        svg: `<g>${BODY.seated({
          elbowLX:74, elbowRX:126, elbowY:38,
          wristLX:88, wristRX:112, wristY:26})}</g>
        <text x="100" y="228" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="12">双手托住后脑</text>` },
      { label:{zh:'轻轻向上牵引', en:'Gently lift upward', ru:'Мягко потяните вверх', kk:'Жоғары баяу тартыңыз'},
        svg: `<g>${BODY.seated({
          headY:20, neckY:42,
          elbowLX:74, elbowRX:126, elbowY:34,
          wristLX:88, wristRX:112, wristY:22})}</g>
        <text x="100" y="8" text-anchor="middle" fill="#3ECFA8" font-size="18">↑</text>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">感受颈椎延展</text>` },
    ]
  },

  // ─── 体态矫正 ───

  10: { // 驼背矫正训练
    name:'驼背矫正训练', bg:'#0e1a14',
    steps:[
      { label:{zh:'起始：肩胛骨向后收', en:'Retract shoulder blades', ru:'Сведите лопатки назад', kk:'Жауырынды артқа тартыңыз'},
        svg: `<g>${BODY.standing({
          shoulderLX:68, shoulderRX:132, shoulderY:62,
          elbowLX:62, elbowRX:138, elbowY:90})}</g>
        <path d="M80 75 L72 80" stroke="#3ECFA8" stroke-width="2" marker-end="url(#arr)"/>
        <path d="M120 75 L128 80" stroke="#3ECFA8" stroke-width="2"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">肩胛骨向后夹</text>` },
      { label:{zh:'扩胸：胸腔打开', en:'Open chest, expand', ru:'Откройте грудь', kk:'Кеуде ашыңыз'},
        svg: `<g>${BODY.standing({
          shoulderLX:64, shoulderRX:136, shoulderY:64,
          elbowLX:50, elbowRX:150, elbowY:90,
          wristLX:42, wristRX:158, wristY:114})}</g>
        <!-- chest open indicator -->
        <ellipse cx="100" cy="92" rx="28" ry="18" fill="none" stroke="#3ECFA8" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">扩胸 保持5秒</text>` },
      { label:{zh:'还原放松', en:'Return and relax', ru:'Вернитесь и расслабьтесь', kk:'Қайтыңыз және демалыңыз'},
        svg: `<g>${BODY.standing()}</g>
        <text x="100" y="228" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="12">放松还原</text>` },
    ]
  },

  11: { // 骨盆前倾矫正
    name:'骨盆前倾矫正', bg:'#0e1a14',
    steps:[
      { label:{zh:'腹部收紧，骨盆后倾', en:'Tuck pelvis, engage core', ru:'Втяните живот, подверните таз', kk:'Жамбасты артқа қайырыңыз'},
        svg: `<g>${BODY.standing({hipLX:80, hipRX:120, hipY:138})}</g>
        <path d="M100 120 Q98 135 100 140" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">收腹，骨盆后倾</text>` },
      { label:{zh:'臀部收紧激活', en:'Squeeze glutes', ru:'Напрягите ягодицы', kk:'Бөксені қысыңыз'},
        svg: `<g>${BODY.standing({hipLX:78, hipRX:122, hipY:142,
          kneeLX:84, kneeRX:116})}</g>
        <ellipse cx="100" cy="145" rx="22" ry="10" fill="#3ECFA8" opacity="0.15"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">夹紧臀部 保持3秒</text>` },
      { label:{zh:'站立伸展，保持对齐', en:'Stand tall, maintain alignment', ru:'Встаньте прямо', kk:'Тік тұрыңыз'},
        svg: `<g>${BODY.standing()}</g>
        <line x1="100" y1="10" x2="100" y2="258" stroke="#3ECFA8" stroke-width="1" stroke-dasharray="6,4" opacity="0.4"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">脊柱中立对齐</text>` },
    ]
  },

  12: { // 高低肩矫正
    name:'高低肩矫正', bg:'#0e1a14',
    steps:[
      { label:{zh:'观察：找出高侧肩膀', en:'Identify the higher shoulder', ru:'Определите высокое плечо', kk:'Жоғары иықты анықтаңыз'},
        svg: `<g>${BODY.standing({shoulderLX:70, shoulderRX:128, shoulderY:64, elbowLX:58, elbowRX:136})}</g>
        <text x="68" y="58" fill="#FF7D54" font-size="10">高↑</text>
        <text x="124" y="70" fill="rgba(255,255,255,0.5)" font-size="10">低</text>` },
      { label:{zh:'高侧肩向下沉', en:'Press high shoulder DOWN', ru:'Опустите высокое плечо вниз', kk:'Жоғары иықты ТӨМЕН басыңыз'},
        svg: `<g>${BODY.standing({shoulderLX:72, shoulderRX:128, shoulderY:62})}</g>
        <text x="66" y="78" fill="#3ECFA8" font-size="18">↓</text>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">高侧向下压，保持10秒</text>` },
      { label:{zh:'低侧侧屈拉伸', en:'Stretch the low side', ru:'Растяните низкую сторону', kk:'Төмен жақты созыңыз'},
        svg: `<g>${BODY.standing({headX:108, headY:38,
          shoulderLX:72, shoulderRX:132, shoulderY:62,
          elbowRX:148, elbowY:96, wristRX:158, wristY:118})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">低侧伸展，保持15秒</text>` },
    ]
  },

  13: { // 足弓激活训练
    name:'足弓激活训练', bg:'#0e1a14',
    steps:[
      { label:{zh:'站立，脚趾张开', en:'Stand, spread toes wide', ru:'Встаньте, раздвиньте пальцы', kk:'Саусақтарды жайыңыз'},
        svg: `<g>${BODY.standing()}</g>
        <ellipse cx="82" cy="252" rx="14" ry="6" fill="none" stroke="#3ECFA8" stroke-width="2"/>
        <ellipse cx="118" cy="252" rx="14" ry="6" fill="none" stroke="#3ECFA8" stroke-width="2"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">脚趾抓地</text>` },
      { label:{zh:'踮起脚尖', en:'Rise up on tiptoes', ru:'Встаньте на носки', kk:'Саусақ ұшына тұрыңыз'},
        svg: `<g>${BODY.standing({
          ankleLX:86, ankleRX:114, ankleY:232,
          footLX:82, footRX:118, footY:240})}</g>
        <text x="82" y="248" fill="#3ECFA8" font-size="14">↑</text>
        <text x="112" y="248" fill="#3ECFA8" font-size="14">↑</text>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">踮脚 保持3秒</text>` },
    ]
  },

  // ─── 减脂系列 ───

  20: { // 卧室HIIT减脂
    name:'卧室HIIT', bg:'#0e1a14',
    steps:[
      { label:{zh:'开合跳预备', en:'Jumping jacks — ready', ru:'Прыжки — готовы', kk:'Секіру — дайын'},
        svg: `<g>${BODY.standing()}</g>
        <text x="100" y="228" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="12">预备站立</text>` },
      { label:{zh:'跳起：手脚张开', en:'Jump — arms and legs open', ru:'Прыжок — руки и ноги в стороны', kk:'Секіру — қол мен аяқты жайыңыз'},
        svg: `<g>${BODY.standing({
          headY:28,
          shoulderLX:60, shoulderRX:140, shoulderY:60,
          elbowLX:36, elbowRX:164, elbowY:48,
          wristLX:22, wristRX:178, wristY:38,
          hipLX:78, hipRX:122, hipY:132,
          kneeLX:64, kneeRX:136, kneeY:182,
          ankleLX:56, ankleRX:144, ankleY:226,
          footLX:48, footRX:152, footY:236})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">手脚张开跳起</text>` },
      { label:{zh:'落地：手脚并拢', en:'Land — feet together', ru:'Приземлитесь — ноги вместе', kk:'Аяқтарды біріктіріп қонуңыз'},
        svg: `<g>${BODY.standing()}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">落地屈膝缓冲</text>` },
    ]
  },

  21: { // 原地踏步减脂
    name:'原地踏步', bg:'#0e1a14',
    steps:[
      { label:{zh:'左脚抬起', en:'Lift left knee', ru:'Поднимите левое колено', kk:'Сол тізені көтеріңіз'},
        svg: `<g>${BODY.standing({
          kneeLX:88, kneeY:162,
          ankleLX:94, ankleY:196,
          footLX:88, footY:206,
          elbowLX:64, elbowY:92, wristLX:72, wristY:118,
          elbowRX:136, elbowY:108, wristRX:128, wristY:134})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">左膝抬至腰部</text>` },
      { label:{zh:'右脚抬起（交替）', en:'Lift right knee (alternate)', ru:'Поднимите правое колено', kk:'Оң тізені көтеріңіз'},
        svg: `<g>${BODY.standing({
          kneeRX:112, kneeY:162,
          ankleRX:106, ankleY:196,
          footRX:112, footY:206,
          elbowRX:136, elbowY:92, wristRX:128, wristY:118,
          elbowLX:64, elbowY:108, wristLX:72, wristY:134})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">右膝抬至腰部</text>` },
    ]
  },

  22: { // 椅上有氧操
    name:'椅上有氧操', bg:'#0e1a14',
    steps:[
      { label:{zh:'坐直，双脚踩地', en:'Sit tall, feet flat', ru:'Сядьте прямо, ноги на полу', kk:'Тік отырыңыз, аяқты жерге'},
        svg: `<g>${BODY.seated()}</g>
        <text x="100" y="228" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="12">坐稳起始</text>` },
      { label:{zh:'双臂上举', en:'Raise both arms up', ru:'Поднимите руки вверх', kk:'Екі қолды жоғары көтеріңіз'},
        svg: `<g>${BODY.seated({
          elbowLX:78, elbowRX:122, elbowY:40,
          wristLX:84, wristRX:116, wristY:18})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">双臂举起</text>` },
      { label:{zh:'踮脚 + 双臂下拉', en:'Tiptoe + pull arms down', ru:'На носки + опустите руки', kk:'Саусақ ұшы + қолдарды төмен'},
        svg: `<g>${BODY.seated({
          elbowLX:66, elbowRX:134, elbowY:88,
          wristLX:76, wristRX:124, wristY:110,
          ankleLX:62, ankleRX:138, ankleY:212,
          footLX:58, footRX:142, footY:220})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">踮脚拉臂 同时做</text>` },
    ]
  },

  23: { // 站立游泳操
    name:'站立游泳操', bg:'#0e1a14',
    steps:[
      { label:{zh:'模拟蛙泳手臂', en:'Breaststroke arm motion', ru:'Движения руками брассом', kk:'Қолмен брасс қозғалысы'},
        svg: `<g>${BODY.standing({
          elbowLX:50, elbowRX:150, elbowY:78,
          wristLX:74, wristRX:126, wristY:96})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">向前推水</text>` },
      { label:{zh:'展开向两侧划', en:'Open arms to sides', ru:'Раскройте руки в стороны', kk:'Қолдарды екі жаққа ашыңыз'},
        svg: `<g>${BODY.standing({
          elbowLX:46, elbowRX:154, elbowY:86,
          wristLX:26, wristRX:174, wristY:90})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">向两侧展开</text>` },
      { label:{zh:'手臂收回准备', en:'Bring arms back', ru:'Верните руки назад', kk:'Қолдарды қайтарыңыз'},
        svg: `<g>${BODY.standing({
          elbowLX:76, elbowRX:124, elbowY:80,
          wristLX:84, wristRX:116, wristY:98})}</g>
        <text x="100" y="228" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="12">收回重复</text>` },
    ]
  },

  // ─── 情绪解压 ───

  30: { // 腹式呼吸放松
    name:'腹式呼吸放松', bg:'#0a1628',
    steps:[
      { label:{zh:'吸气4秒：腹部鼓起', en:'Inhale 4s: belly expands', ru:'Вдох 4с: живот расширяется', kk:'Дем алу 4с: іш кеңейеді'},
        svg: `<g>${BODY.standing({
          hipLX:78, hipRX:122,
          elbowLX:70, elbowRX:130, elbowY:90,
          wristLX:74, wristRX:126, wristY:120})}</g>
        <ellipse cx="100" cy="108" rx="26" ry="18" fill="#7B9FE8" opacity="0.25"/>
        <rect x="20" y="217" width="160" height="18" rx="6" fill="rgba(0,0,0,0.55)"/><text x="100" y="230" text-anchor="middle" fill="#7B9FE8" font-size="11" font-weight="600">吸气</text>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">鼻子慢慢吸气 4秒</text>` },
      { label:{zh:'屏息2秒', en:'Hold 2s', ru:'Задержите 2с', kk:'Ұстаңыз 2с'},
        svg: `<g>${BODY.standing({
          hipLX:78, hipRX:122,
          elbowLX:70, elbowRX:130, elbowY:90,
          wristLX:74, wristRX:126, wristY:120})}</g>
        <ellipse cx="100" cy="108" rx="26" ry="18" fill="#7B9FE8" opacity="0.35"/>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">屏住呼吸 2秒</text>` },
      { label:{zh:'呼气6秒：腹部收缩', en:'Exhale 6s: belly contracts', ru:'Выдох 6с: живот сокращается', kk:'Шығару 6с: іш жиырылады'},
        svg: `<g>${BODY.standing({
          hipLX:82, hipRX:118,
          elbowLX:70, elbowRX:130, elbowY:90,
          wristLX:74, wristRX:126, wristY:120})}</g>
        <ellipse cx="100" cy="108" rx="18" ry="12" fill="#3ECFA8" opacity="0.2"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">嘴巴慢慢呼气 6秒</text>` },
    ]
  },

  31: { // 睡前助眠序列
    name:'睡前助眠序列', bg:'#0a1628',
    steps:[
      { label:{zh:'仰卧放松全身', en:'Lie flat, relax completely', ru:'Лягте, расслабьтесь', kk:'Жатыңыз, демалыңыз'},
        svg: `<!-- lying down pose -->
        <circle cx="100" cy="100" r="20" fill="#FBBF7C" stroke="#7B9FE8" stroke-width="3"/>
        <line x1="100" y1="120" x2="100" y2="170" stroke="#7B9FE8" stroke-width="7" stroke-linecap="round"/>
        <line x1="60" y1="130" x2="140" y2="130" stroke="#7B9FE8" stroke-width="6" stroke-linecap="round"/>
        <line x1="60" y1="130" x2="30" y2="145" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <line x1="140" y1="130" x2="170" y2="145" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <line x1="80" y1="170" x2="72" y2="210" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <line x1="120" y1="170" x2="128" y2="210" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <rect x="20" y="205" width="160" height="8" rx="4" fill="#CBD5E1" opacity="0.3"/>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">躺平放松</text>` },
      { label:{zh:'腿部上举拉伸', en:'Legs up stretch', ru:'Поднимите ноги', kk:'Аяқтарды жоғары көтеріңіз'},
        svg: `<circle cx="100" cy="140" r="20" fill="#FBBF7C" stroke="#7B9FE8" stroke-width="3"/>
        <line x1="100" y1="160" x2="100" y2="190" stroke="#7B9FE8" stroke-width="7" stroke-linecap="round"/>
        <line x1="60" y1="168" x2="140" y2="168" stroke="#7B9FE8" stroke-width="6" stroke-linecap="round"/>
        <line x1="60" y1="168" x2="36" y2="152" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <line x1="140" y1="168" x2="164" y2="152" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <line x1="84" y1="190" x2="76" y2="152" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <line x1="116" y1="190" x2="124" y2="152" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <rect x="20" y="210" width="160" height="8" rx="4" fill="#CBD5E1" opacity="0.3"/>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">双腿上抬30秒</text>` },
    ]
  },

  32: { // 正念冥想引导
    name:'正念冥想引导', bg:'#0a1628',
    steps:[
      { label:{zh:'盘腿坐，脊柱挺直', en:'Sit cross-legged, spine tall', ru:'Сядьте скрестив ноги', kk:'Аяқты айқастырып отырыңыз'},
        svg: `<circle cx="100" cy="54" r="20" fill="#FBBF7C" stroke="#7B9FE8" stroke-width="3"/>
        <line x1="100" y1="74" x2="100" y2="138" stroke="#7B9FE8" stroke-width="7" stroke-linecap="round"/>
        <line x1="68" y1="86" x2="132" y2="86" stroke="#7B9FE8" stroke-width="6" stroke-linecap="round"/>
        <line x1="68" y1="86" x2="48" y2="108" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <line x1="132" y1="86" x2="152" y2="108" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <path d="M100 138 Q72 148 60 165 Q80 172 100 168 Q120 172 140 165 Q128 148 100 138Z" fill="#5a7dd0" opacity="0.6"/>
        <!-- breath circle -->
        <circle cx="100" cy="180" r="30" fill="none" stroke="#7B9FE8" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.5"/>
        <circle cx="100" cy="180" r="20" fill="#7B9FE8" opacity="0.12"/>
        <rect x="20" y="217" width="160" height="18" rx="6" fill="rgba(0,0,0,0.55)"/><text x="100" y="230" text-anchor="middle" fill="#7B9FE8" font-size="11" font-weight="600">呼吸</text>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">专注当下，放空思绪</text>` },
    ]
  },

  // ─── 老年人系列 ───

  40: { // 平衡训练防跌倒
    name:'平衡训练防跌倒', bg:'#0e1a14',
    steps:[
      { label:{zh:'双脚站立，找到重心', en:'Stand steady, find balance', ru:'Встаньте устойчиво', kk:'Тұрақты тұрыңыз'},
        svg: `<g>${BODY.standing()}</g>
        <line x1="100" y1="250" x2="100" y2="10" stroke="#3ECFA8" stroke-width="1" stroke-dasharray="5,4" opacity="0.3"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="12">重心居中</text>` },
      { label:{zh:'单腿站立（扶墙可选）', en:'Single leg (wall optional)', ru:'На одной ноге (стена рядом)', kk:'Бір аяқта (қабырға жанында)'},
        svg: `<g>${BODY.standing({
          kneeLX:92, kneeY:168,
          ankleLX:96, ankleY:210,
          footLX:90, footY:222,
          elbowLX:50, elbowY:76,
          wristLX:30, wristY:82})}</g>
        <!-- wall suggestion -->
        <rect x="10" y="60" width="8" height="200" rx="2" fill="#CBD5E1" opacity="0.3"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">保持10秒</text>` },
    ]
  },

  41: { // 关节温和活动
    name:'关节温和活动', bg:'#0e1a14',
    steps:[
      { label:{zh:'手腕画圈', en:'Wrist circles', ru:'Вращение запястий', kk:'Білекті айналдыру'},
        svg: `<g>${BODY.standing({
          elbowLX:66, elbowRX:134, elbowY:90,
          wristLX:58, wristRX:142, wristY:122})}</g>
        <circle cx="58" cy="130" r="12" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <circle cx="142" cy="130" r="12" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">手腕慢慢画圈 10次</text>` },
      { label:{zh:'肩部画圈', en:'Shoulder circles', ru:'Вращение плечами', kk:'Иықты айналдыру'},
        svg: `<g>${BODY.standing()}</g>
        <circle cx="72" cy="68" r="16" fill="none" stroke="#F5C842" stroke-width="2" stroke-dasharray="4,3"/>
        <circle cx="128" cy="68" r="16" fill="none" stroke="#F5C842" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">肩膀画圈 各10次</text>` },
      { label:{zh:'膝盖弯曲伸直', en:'Knee bend and extend', ru:'Сгибание и разгибание колен', kk:'Тізені иіп жазыңыз'},
        svg: `<g>${BODY.standing({
          kneeLX:86, kneeRX:114, kneeY:196,
          ankleLX:88, ankleRX:112, ankleY:230,
          footLX:82, footRX:118, footY:240,
          hipLX:84, hipRX:116, hipY:138})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">膝盖缓慢弯曲伸直</text>` },
    ]
  },

  42: { // 坐式力量训练
    name:'坐式力量训练', bg:'#0e1a14',
    steps:[
      { label:{zh:'坐姿举臂', en:'Seated arm raise', ru:'Подъём рук сидя', kk:'Отырып қол көтеру'},
        svg: `<g>${BODY.seated({
          elbowLX:70, elbowRX:130, elbowY:36,
          wristLX:76, wristRX:124, wristY:14})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">手臂缓慢举起放下</text>` },
      { label:{zh:'坐姿腿伸展', en:'Seated leg extension', ru:'Разгибание ног сидя', kk:'Отырып аяқты созу'},
        svg: `<g>${BODY.seated({
          kneeLX:60, kneeY:152,
          ankleLX:40, ankleY:152,
          footLX:32, footY:160})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">一腿伸直 保持5秒</text>` },
    ]
  },

  43: { // 太极基础动作
    name:'太极基础动作', bg:'#0a1628',
    steps:[
      { label:{zh:'起势：双臂缓缓上升', en:'Opening: arms rise slowly', ru:'Начало: руки медленно поднимаются', kk:'Бастама: қолдар баяу көтеріледі'},
        svg: `<g>${BODY.standing({
          elbowLX:62, elbowRX:138, elbowY:90,
          wristLX:56, wristRX:144, wristY:72})}</g>
        <path d="M62 100 Q58 86 56 72" fill="none" stroke="#7B9FE8" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7"/>
        <path d="M138 100 Q142 86 144 72" fill="none" stroke="#7B9FE8" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7"/>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">呼气，双臂缓缓上升</text>` },
      { label:{zh:'下按势：双掌向下', en:'Press down: palms down', ru:'Нажатие вниз: ладони вниз', kk:'Төмен басу: алақандар төмен'},
        svg: `<g>${BODY.standing({
          elbowLX:66, elbowRX:134, elbowY:96,
          wristLX:62, wristRX:138, wristY:116})}</g>
        <text x="66" y="124" fill="#7B9FE8" font-size="14">↓</text>
        <text x="130" y="124" fill="#7B9FE8" font-size="14">↓</text>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">吸气，双掌缓缓下按</text>` },
    ]
  },

  44: { // 低强度有氧步行操
    name:'低强度步行操', bg:'#0e1a14',
    steps:[
      { label:{zh:'原地大步走', en:'March in place (big steps)', ru:'Маршировка на месте', kk:'Орнында үлкен қадаммен жүру'},
        svg: `<g>${BODY.standing({
          kneeLX:88, kneeY:166,
          ankleLX:92, ankleY:204,
          elbowLX:60, elbowY:94,
          elbowRX:136, elbowY:108})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">左右交替抬腿</text>` },
      { label:{zh:'手臂配合摆动', en:'Swing arms naturally', ru:'Руки естественно качаются', kk:'Қолдар табиғи теңселеді'},
        svg: `<g>${BODY.standing({
          kneeLX:92, kneeY:166,
          elbowLX:62, elbowY:88,  wristLX:68, wristY:112,
          elbowRX:140, elbowY:90, wristRX:132, wristY:126})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">手臂自然摆动</text>` },
    ]
  },

  // ─── 孕期运动 ───

  50: { // 孕期骨盆底肌训练
    name:'孕期骨盆底肌训练', bg:'#1a0a28',
    steps:[
      { label:{zh:'坐姿放松，感受盆底', en:'Seated, feel pelvic floor', ru:'Сидя, почувствуйте тазовое дно', kk:'Отырып, жамбас түбін сезіңіз'},
        svg: `<g>${BODY.seated({torsoColor:'#c084fc', limbColor:'#a855f7'})}</g>
        <ellipse cx="100" cy="162" rx="24" ry="10" fill="#c084fc" opacity="0.2"/>
        <text x="100" y="228" text-anchor="middle" fill="#c084fc" font-size="12">感受骨盆底肌</text>` },
      { label:{zh:'收紧：像止尿一样', en:'Contract — like stopping urination', ru:'Сожмите — как задержку мочеиспускания', kk:'Қысыңыз — зәрді ұстаудай'},
        svg: `<g>${BODY.seated({torsoColor:'#c084fc', limbColor:'#a855f7'})}</g>
        <ellipse cx="100" cy="162" rx="18" ry="7" fill="#c084fc" opacity="0.4"/>
        <text x="100" y="228" text-anchor="middle" fill="#c084fc" font-size="12">收紧 保持5秒</text>` },
      { label:{zh:'放松：完全释放', en:'Relax — fully release', ru:'Расслабьтесь — полностью', kk:'Толық демалыңыз'},
        svg: `<g>${BODY.seated({torsoColor:'#c084fc', limbColor:'#a855f7'})}</g>
        <ellipse cx="100" cy="162" rx="26" ry="12" fill="#c084fc" opacity="0.15"/>
        <text x="100" y="228" text-anchor="middle" fill="#c084fc" font-size="12">完全放松 5秒</text>` },
    ]
  },

  51: { // 孕期瑜伽拉伸
    name:'孕期瑜伽拉伸', bg:'#1a0a28',
    steps:[
      { label:{zh:'猫式：弓背', en:"Cat pose: round back", ru:'Поза кошки: округлите спину', kk:'Мысық қалпы: арқаны дөңгелетіңіз'},
        svg: `<!-- kneeling cat pose -->
        <circle cx="100" cy="78" r="18" fill="#FBBF7C" stroke="#c084fc" stroke-width="3"/>
        <line x1="100" y1="96" x2="100" y2="126" stroke="#c084fc" stroke-width="6" stroke-linecap="round"/>
        <path d="M70 110 Q100 126 130 110" fill="none" stroke="#c084fc" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="110" x2="62" y2="148" stroke="#a855f7" stroke-width="6" stroke-linecap="round"/>
        <line x1="130" y1="110" x2="138" y2="148" stroke="#a855f7" stroke-width="6" stroke-linecap="round"/>
        <line x1="62" y1="148" x2="58" y2="166" stroke="#a855f7" stroke-width="5" stroke-linecap="round"/>
        <line x1="138" y1="148" x2="142" y2="166" stroke="#a855f7" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="#c084fc" font-size="12">弓背呼气</text>` },
      { label:{zh:'牛式：塌腰', en:'Cow pose: arch back', ru:'Поза коровы: прогнитесь', kk:'Сиыр қалпы: арқаны ойыңыз'},
        svg: `<circle cx="100" cy="68" r="18" fill="#FBBF7C" stroke="#c084fc" stroke-width="3"/>
        <line x1="100" y1="86" x2="100" y2="116" stroke="#c084fc" stroke-width="6" stroke-linecap="round"/>
        <path d="M70 104 Q100 116 130 104" fill="none" stroke="#c084fc" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="104" x2="62" y2="144" stroke="#a855f7" stroke-width="6" stroke-linecap="round"/>
        <line x1="130" y1="104" x2="138" y2="144" stroke="#a855f7" stroke-width="6" stroke-linecap="round"/>
        <line x1="62" y1="144" x2="58" y2="162" stroke="#a855f7" stroke-width="5" stroke-linecap="round"/>
        <line x1="138" y1="144" x2="142" y2="162" stroke="#a855f7" stroke-width="5" stroke-linecap="round"/>
        <!-- belly bump -->
        <path d="M86 108 Q100 130 114 108" fill="none" stroke="#F5C842" stroke-width="3" stroke-dasharray="4,3" opacity="0.6"/>
        <text x="100" y="228" text-anchor="middle" fill="#c084fc" font-size="12">塌腰吸气</text>` },
    ]
  },

  52: { // 孕期呼吸与放松
    name:'孕期呼吸放松', bg:'#1a0a28',
    steps:[
      { label:{zh:'深呼吸：手放腹部', en:'Deep breath: hands on belly', ru:'Глубокое дыхание: руки на живот', kk:'Терең тыныс: қолдарды іш үстіне'},
        svg: `<g>${BODY.seated({
          torsoColor:'#c084fc', limbColor:'#a855f7',
          elbowLX:76, elbowRX:124, elbowY:110,
          wristLX:84, wristRX:116, wristY:116})}</g>
        <circle cx="100" cy="130" r="22" fill="#c084fc" opacity="0.2"/>
        <text x="100" y="228" text-anchor="middle" fill="#c084fc" font-size="12">手感受腹部起伏</text>` },
    ]
  },

  53: { // 孕期散步+手臂操
    name:'孕期散步手臂操', bg:'#1a0a28',
    steps:[
      { label:{zh:'轻柔原地踏步', en:'Gentle march in place', ru:'Лёгкая маршировка', kk:'Жеңіл орнында жүру'},
        svg: `<g>${BODY.standing({torsoColor:'#c084fc', limbColor:'#a855f7',
          kneeLX:90, kneeY:172,
          ankleLX:93, ankleY:210})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#c084fc" font-size="12">轻柔踏步</text>` },
      { label:{zh:'手臂画圈', en:'Arm circles', ru:'Круги руками', kk:'Қолмен шеңбер'},
        svg: `<g>${BODY.standing({torsoColor:'#c084fc', limbColor:'#a855f7',
          elbowLX:56, elbowRX:144, elbowY:78,
          wristLX:46, wristRX:154, wristY:66})}</g>
        <circle cx="50" cy="74" r="18" fill="none" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="4,3"/>
        <circle cx="150" cy="74" r="18" fill="none" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#c084fc" font-size="12">手臂轻柔画圈</text>` },
    ]
  },

  // ─── 无障碍运动 ───

  60: { // 轮椅上肢力量
    name:'轮椅上肢力量', bg:'#0e1a14',
    steps:[
      { label:{zh:'轮椅坐姿，手臂前推', en:'Wheelchair — push forward', ru:'В кресле — толкайте вперёд', kk:'Арбада — алға итеріңіз'},
        svg: `<g>${BODY.seated({seatY:162,
          elbowLX:62, elbowRX:138, elbowY:102,
          wristLX:52, wristRX:148, wristY:102})}</g>
        <!-- wheelchair wheels -->
        <circle cx="56" cy="200" r="28" fill="none" stroke="#3ECFA8" stroke-width="3" opacity="0.5"/>
        <circle cx="144" cy="200" r="28" fill="none" stroke="#3ECFA8" stroke-width="3" opacity="0.5"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">双臂向前推 10次</text>` },
      { label:{zh:'手臂侧平举', en:'Lateral arm raise', ru:'Подъём рук в стороны', kk:'Қолдарды бүйірге көтеру'},
        svg: `<g>${BODY.seated({seatY:162,
          elbowLX:46, elbowRX:154, elbowY:90,
          wristLX:28, wristRX:172, wristY:102})}</g>
        <circle cx="56" cy="200" r="28" fill="none" stroke="#3ECFA8" stroke-width="3" opacity="0.5"/>
        <circle cx="144" cy="200" r="28" fill="none" stroke="#3ECFA8" stroke-width="3" opacity="0.5"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">双臂侧平举 保持3秒</text>` },
    ]
  },

  61: { // 坐姿核心稳定
    name:'坐姿核心稳定', bg:'#0e1a14',
    steps:[
      { label:{zh:'坐直收腹', en:'Sit tall, engage core', ru:'Сядьте прямо, напрягите кор', kk:'Тік отырып, ішті тартыңыз'},
        svg: `<g>${BODY.seated()}</g>
        <ellipse cx="100" cy="118" rx="22" ry="14" fill="#3ECFA8" opacity="0.15"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">收腹 保持呼吸</text>` },
      { label:{zh:'躯干侧弯', en:'Lateral trunk bend', ru:'Боковой наклон туловища', kk:'Денені бүйірге иіңіз'},
        svg: `<g>${BODY.seated({
          headX:108, headY:44,
          shoulderLX:76, shoulderRX:136, shoulderY:62,
          elbowRX:158, elbowY:82, wristRX:174, wristY:68})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">侧弯 保持10秒</text>` },
    ]
  },

  62: { // 单侧肢体代偿训练
    name:'单侧代偿训练', bg:'#0e1a14',
    steps:[
      { label:{zh:'健侧手臂画圈', en:'Healthy arm circles', ru:'Круги здоровой рукой', kk:'Сау қолмен шеңбер'},
        svg: `<g>${BODY.standing({
          elbowRX:148, elbowY:82, wristRX:162, wristY:68})}</g>
        <circle cx="158" cy="74" r="20" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">健侧做主导动作</text>` },
    ]
  },

  63: { // 视障友好听觉引导
    name:'听觉引导训练', bg:'#0a1628',
    steps:[
      { label:{zh:'闭眼，专注呼吸声音', en:'Eyes closed — follow breath sounds', ru:'Закройте глаза — слушайте дыхание', kk:'Көзді жұмып — тыныс дыбысына назар аударыңыз'},
        svg: `<g>${BODY.standing()}</g>
        <!-- sound waves -->
        <path d="M130 60 Q145 68 145 78 Q145 88 130 96" fill="none" stroke="#7B9FE8" stroke-width="2" opacity="0.6"/>
        <path d="M135 55 Q155 66 155 78 Q155 90 135 101" fill="none" stroke="#7B9FE8" stroke-width="1.5" opacity="0.4"/>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">听音跟随，闭眼感受</text>` },
    ]
  },

  64: { // 听障手语节奏操
    name:'视觉节奏操', bg:'#0e1a14',
    steps:[
      { label:{zh:'看节拍指示，跟节奏动', en:'Follow visual beat — move with rhythm', ru:'Следите за визуальным ритмом', kk:'Визуалды ырғаққа қараңыз'},
        svg: `<g>${BODY.standing({
          elbowLX:58, elbowRX:142, elbowY:84,
          wristLX:50, wristRX:150, wristY:72})}</g>
        <!-- visual beat indicators -->
        <circle cx="30" cy="140" r="14" fill="#3ECFA8" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="170" cy="140" r="14" fill="#3ECFA8" opacity="0.2">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1s" repeatCount="indefinite"/>
        </circle>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">跟随视觉节拍律动</text>` },
    ]
  },

  // ─── 职业病康复 ───

  70: { // 程序员手腕腱鞘炎康复
    name:'手腕腱鞘炎康复', bg:'#0e1a14',
    steps:[
      { label:{zh:'手腕向上弯曲', en:'Wrist flexion upward', ru:'Сгибание запястья вверх', kk:'Білекті жоғары иіңіз'},
        svg: `<g>${BODY.standing({
          elbowLX:66, elbowRX:134, elbowY:90,
          wristLX:60, wristRX:140, wristY:124})}</g>
        <path d="M60 124 Q55 114 60 108" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">向上弯曲 保持10秒</text>` },
      { label:{zh:'手腕向下弯曲', en:'Wrist flexion downward', ru:'Сгибание запястья вниз', kk:'Білекті төмен иіңіз'},
        svg: `<g>${BODY.standing({
          elbowLX:66, elbowRX:134, elbowY:90,
          wristLX:60, wristRX:140, wristY:124})}</g>
        <path d="M60 124 Q55 134 60 140" fill="none" stroke="#F5C842" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">向下弯曲 保持10秒</text>` },
      { label:{zh:'手腕画圈放松', en:'Wrist circles to relax', ru:'Круги запястьями', kk:'Білекті айналдыру'},
        svg: `<g>${BODY.standing({
          elbowLX:66, elbowRX:134, elbowY:90,
          wristLX:60, wristRX:140, wristY:124})}</g>
        <circle cx="60" cy="132" r="14" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <circle cx="140" cy="132" r="14" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">顺逆时针画圈各5次</text>` },
    ]
  },

  71: { // 音乐家手指放松
    name:'手指放松', bg:'#0e1a14',
    steps:[
      { label:{zh:'手指张开收拢', en:'Spread and close fingers', ru:'Раздвиньте и сожмите пальцы', kk:'Саусақтарды жайып жыйыңыз'},
        svg: `<g>${BODY.standing({
          elbowLX:66, elbowRX:134, elbowY:90,
          wristLX:60, wristRX:140, wristY:124})}</g>
        <!-- finger spread indicator -->
        <line x1="46" y1="126" x2="38" y2="122" stroke="#3ECFA8" stroke-width="2"/>
        <line x1="50" y1="130" x2="44" y2="136" stroke="#3ECFA8" stroke-width="2"/>
        <line x1="56" y1="134" x2="52" y2="142" stroke="#3ECFA8" stroke-width="2"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">张开 收拢 各10次</text>` },
    ]
  },

  72: { // 建筑工人腰背康复
    name:'腰背康复', bg:'#0e1a14',
    steps:[
      { label:{zh:'前屈拉伸腰背', en:'Forward fold — stretch back', ru:'Наклон вперёд', kk:'Алға иілу'},
        svg: `<g>${BODY.standing({
          headX:100, headY:120,
          neckY:118,
          shoulderLX:72, shoulderRX:128, shoulderY:110,
          elbowLX:68, elbowRX:132, elbowY:132,
          wristLX:66, wristRX:134, wristY:150,
          hipLX:82, hipRX:118, hipY:112,
          kneeLX:82, kneeRX:118, kneeY:168})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">慢慢前屈 保持20秒</text>` },
      { label:{zh:'猫式拱背放松', en:'Cat arch to relax', ru:'Поза кошки для расслабления', kk:'Мысық қалпы демалуға'},
        svg: `<circle cx="100" cy="88" r="18" fill="#FBBF7C" stroke="#3ECFA8" stroke-width="3"/>
        <path d="M68 108 Q100 130 132 108" fill="none" stroke="#3ECFA8" stroke-width="6" stroke-linecap="round"/>
        <line x1="68" y1="108" x2="58" y2="148" stroke="#2BAD8A" stroke-width="6" stroke-linecap="round"/>
        <line x1="132" y1="108" x2="142" y2="148" stroke="#2BAD8A" stroke-width="6" stroke-linecap="round"/>
        <line x1="58" y1="148" x2="54" y2="166" stroke="#2BAD8A" stroke-width="5" stroke-linecap="round"/>
        <line x1="142" y1="148" x2="146" y2="166" stroke="#2BAD8A" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">猫式拱背 深呼吸</text>` },
    ]
  },

  73: { // 厨师肩颈职业病康复
    name:'厨师肩颈康复', bg:'#0e1a14',
    steps:[
      { label:{zh:'肩部画圈放松', en:'Shoulder rolls to release', ru:'Вращение плечами для расслабления', kk:'Иықты айналдыру'},
        svg: `<g>${BODY.standing()}</g>
        <circle cx="72" cy="68" r="18" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <circle cx="128" cy="68" r="18" fill="none" stroke="#3ECFA8" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">前后画圈各10次</text>` },
      { label:{zh:'颈部侧屈拉伸', en:'Neck lateral stretch', ru:'Боковой наклон шеи', kk:'Мойынды бүйірге созу'},
        svg: `<g>${BODY.standing({headX:88, headY:38})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">各侧保持15秒</text>` },
    ]
  },

  74: { // 司机腰椎康复操
    name:'司机腰椎康复', bg:'#0e1a14',
    steps:[
      { label:{zh:'坐姿腰部旋转', en:'Seated lumbar rotation', ru:'Вращение поясницы сидя', kk:'Отырып бел айналдыру'},
        svg: `<g>${BODY.seated({
          headX:106, headY:44,
          shoulderLX:74, shoulderRX:134, shoulderY:62})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">轻柔旋转 各10次</text>` },
      { label:{zh:'坐姿前屈拉伸', en:'Seated forward fold', ru:'Наклон вперёд сидя', kk:'Отырып алға иілу'},
        svg: `<g>${BODY.seated({
          headX:100, headY:118,
          neckY:116,
          shoulderLX:74, shoulderRX:126, shoulderY:108,
          elbowLX:70, elbowRX:130, elbowY:126,
          wristLX:68, wristRX:132, wristY:144})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">前屈 保持20秒</text>` },
    ]
  },

  75: { // 教师声带保护操
    name:'声带保护操', bg:'#0a1628',
    steps:[
      { label:{zh:'颈部放松转动', en:'Neck relaxation rolls', ru:'Расслабление шеи', kk:'Мойынды босату'},
        svg: `<g>${BODY.standing()}</g>
        <circle cx="100" cy="36" r="26" fill="none" stroke="#7B9FE8" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.5"/>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">头部缓慢画圈</text>` },
      { label:{zh:'哼鸣放松声带', en:'Gentle hum to relax vocal cords', ru:'Лёгкое мычание для расслабления', kk:'Жұмсақ гудок дауыс шымылдықтарына'},
        svg: `<g>${BODY.standing()}</g>
        <!-- sound waves from mouth -->
        <path d="M116 40 Q126 38 130 40" fill="none" stroke="#7B9FE8" stroke-width="2" opacity="0.7"/>
        <path d="M116 40 Q132 36 138 40" fill="none" stroke="#7B9FE8" stroke-width="1.5" opacity="0.5"/>
        <path d="M116 40 Q138 34 146 40" fill="none" stroke="#7B9FE8" stroke-width="1" opacity="0.3"/>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">轻声哼鸣 放松喉部</text>` },
    ]
  },

  76: { // 电脑眼疲劳恢复
    name:'眼疲劳恢复', bg:'#0a1628',
    steps:[
      { label:{zh:'远眺：看6米以外', en:'Look 20 feet away', ru:'Смотрите вдаль 6 метров', kk:'6 метр алысқа қараңыз'},
        svg: `<g>${BODY.standing()}</g>
        <!-- distance lines -->
        <line x1="112" y1="34" x2="188" y2="30" stroke="#7B9FE8" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.6"/>
        <circle cx="190" cy="30" r="5" fill="#7B9FE8" opacity="0.5"/>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">看远处 20秒</text>` },
      { label:{zh:'眼球画圈运动', en:'Eye circles', ru:'Круговые движения глазами', kk:'Көзді айналдыру'},
        svg: `<g>${BODY.standing()}</g>
        <circle cx="100" cy="34" r="26" fill="none" stroke="#7B9FE8" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.6"/>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">眼球慢慢画圈</text>` },
      { label:{zh:'掌心捂眼热敷', en:'Palm eyes for warmth', ru:'Прикройте глаза ладонями', kk:'Алақанмен көзді жабыңыз'},
        svg: `<g>${BODY.standing({
          elbowLX:72, elbowRX:128, elbowY:58,
          wristLX:82, wristRX:118, wristY:36})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">掌心捂眼 30秒</text>` },
    ]
  },

  // ─── 学生专区 ───

  80: { // 备考学生护眼操
    name:'学生护眼操', bg:'#0a1628',
    steps:[
      { label:{zh:'上下转动眼球', en:'Roll eyes up and down', ru:'Двигайте глазами вверх-вниз', kk:'Көзді жоғары-төмен жылжытыңыз'},
        svg: `<g>${BODY.standing()}</g>
        <line x1="100" y1="18" x2="100" y2="8" stroke="#7B9FE8" stroke-width="2" marker-end="url(#arr)"/>
        <line x1="100" y1="50" x2="100" y2="58" stroke="#7B9FE8" stroke-width="2"/>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">上下各5次</text>` },
      { label:{zh:'左右转动眼球', en:'Roll eyes left and right', ru:'Двигайте глазами влево-вправо', kk:'Көзді солға-оңға жылжытыңыз'},
        svg: `<g>${BODY.standing()}</g>
        <line x1="82" y1="34" x2="72" y2="34" stroke="#3ECFA8" stroke-width="2"/>
        <line x1="118" y1="34" x2="128" y2="34" stroke="#3ECFA8" stroke-width="2"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">左右各5次</text>` },
    ]
  },

  81: { // 书包背负姿势矫正
    name:'书包姿势矫正', bg:'#0e1a14',
    steps:[
      { label:{zh:'错误姿势：单肩背包', en:'Wrong: one-shoulder bag', ru:'Неправильно: сумка на одном плече', kk:'Дұрыс емес: бір иықта сөмке'},
        svg: `<g>${BODY.standing({shoulderLX:70, shoulderRX:128, shoulderY:64, headX:96})}</g>
        <rect x="50" y="68" width="22" height="36" rx="4" fill="#FF7D54" opacity="0.4"/>
        <line x1="60" y1="68" x2="66" y2="100" stroke="#FF7D54" stroke-width="2"/>
        <rect x="20" y="217" width="160" height="18" rx="6" fill="rgba(0,0,0,0.55)"/><text x="100" y="230" text-anchor="middle" fill="#FF7D54" font-size="11" font-weight="600">❌错误</text>
        <text x="100" y="228" text-anchor="middle" fill="#FF7D54" font-size="12">单肩包易脊柱侧弯</text>` },
      { label:{zh:'正确姿势：双肩背包', en:'Right: both shoulders', ru:'Правильно: на двух плечах', kk:'Дұрыс: екі иықта'},
        svg: `<g>${BODY.standing()}</g>
        <rect x="78" y="72" width="44" height="50" rx="6" fill="#3ECFA8" opacity="0.25"/>
        <line x1="84" y1="72" x2="80" y2="122" stroke="#3ECFA8" stroke-width="2"/>
        <line x1="116" y1="72" x2="120" y2="122" stroke="#3ECFA8" stroke-width="2"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">双肩背 肩带调适中</text>` },
    ]
  },

  82: { // 专注力提升冥想
    name:'专注力冥想', bg:'#0a1628',
    steps:[
      { label:{zh:'坐正，双手置膝', en:'Sit tall, hands on knees', ru:'Сядьте прямо, руки на коленях', kk:'Тік отырыңыз, қолдарды тізеге'},
        svg: `<circle cx="100" cy="54" r="20" fill="#FBBF7C" stroke="#7B9FE8" stroke-width="3"/>
        <line x1="100" y1="74" x2="100" y2="140" stroke="#7B9FE8" stroke-width="7" stroke-linecap="round"/>
        <line x1="68" y1="88" x2="132" y2="88" stroke="#7B9FE8" stroke-width="6" stroke-linecap="round"/>
        <line x1="68" y1="88" x2="52" y2="106" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <line x1="132" y1="88" x2="148" y2="106" stroke="#5a7dd0" stroke-width="6" stroke-linecap="round"/>
        <line x1="52" y1="106" x2="56" y2="128" stroke="#5a7dd0" stroke-width="5" stroke-linecap="round"/>
        <line x1="148" y1="106" x2="144" y2="128" stroke="#5a7dd0" stroke-width="5" stroke-linecap="round"/>
        <path d="M100 140 Q72 150 60 168 Q80 175 100 172 Q120 175 140 168 Q128 150 100 140Z" fill="#5a7dd0" opacity="0.6"/>
        <!-- focus dot -->
        <circle cx="100" cy="186" r="8" fill="#7B9FE8" opacity="0.8">
          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text x="100" y="228" text-anchor="middle" fill="#7B9FE8" font-size="12">专注于呼吸的感觉</text>` },
    ]
  },

  83: { // 宿舍无器械减脂操
    name:'宿舍无器械减脂', bg:'#0e1a14',
    steps:[
      { label:{zh:'深蹲', en:'Squat', ru:'Приседание', kk:'Отырып тұру'},
        svg: `<g>${BODY.standing({
          hipLX:76, hipRX:124, hipY:168,
          kneeLX:68, kneeRX:132, kneeY:200,
          ankleLX:72, ankleRX:128, ankleY:234,
          footLX:62, footRX:138, footY:244,
          elbowLX:62, elbowRX:138, elbowY:110,
          wristLX:68, wristRX:132, wristY:98})}</g>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">下蹲到大腿平行地面</text>` },
      { label:{zh:'俯卧撑（跪式可选）', en:'Push-up (kneel optional)', ru:'Отжимание (на коленях)', kk:'Отжимание (тізелеп)'},
        svg: `<!-- pushup position -->
        <circle cx="60" cy="112" r="16" fill="#FBBF7C" stroke="#3ECFA8" stroke-width="3"/>
        <line x1="60" y1="128" x2="100" y2="138" stroke="#3ECFA8" stroke-width="6" stroke-linecap="round"/>
        <line x1="100" y1="138" x2="148" y2="128" stroke="#3ECFA8" stroke-width="6" stroke-linecap="round"/>
        <line x1="78" y1="134" x2="70" y2="162" stroke="#2BAD8A" stroke-width="5" stroke-linecap="round"/>
        <line x1="122" y1="134" x2="130" y2="162" stroke="#2BAD8A" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="162" x2="66" y2="190" stroke="#2BAD8A" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="162" x2="134" y2="190" stroke="#2BAD8A" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="#3ECFA8" font-size="12">撑起放下 10次</text>` },
      { label:{zh:'平板支撑', en:'Plank hold', ru:'Планка', kk:'Планка'},
        svg: `<!-- plank position -->
        <circle cx="50" cy="108" r="15" fill="#FBBF7C" stroke="#3ECFA8" stroke-width="3"/>
        <line x1="50" y1="123" x2="100" y2="130" stroke="#3ECFA8" stroke-width="6" stroke-linecap="round"/>
        <line x1="100" y1="130" x2="154" y2="124" stroke="#3ECFA8" stroke-width="6" stroke-linecap="round"/>
        <line x1="68" y1="127" x2="64" y2="158" stroke="#2BAD8A" stroke-width="5" stroke-linecap="round"/>
        <line x1="136" y1="125" x2="140" y2="156" stroke="#2BAD8A" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="#F5C842" font-size="12">保持30-60秒</text>` },
    ]
  },
  // ─── 健身房动画 ───

  102: { // 哑铃飞鸟
    bg:'#0E0C0A', steps:[
      { label:{zh:'起始：双臂上举，微屈肘',en:'Start: arms up, slight bend',ru:'Старт: руки вверх, локти слегка согнуты',kk:'Бастапқы: қолдар жоғары, шынтақ аздап'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="130" width="160" height="10" rx="5" fill="#2A2520"/>
        <circle cx="40" cy="80" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="40" y1="96" x2="130" y2="102" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="50" y1="98" x2="50" y2="122" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="116" y1="101" x2="116" y2="125" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="102" x2="140" y2="125" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="50" y1="98" x2="32" y2="74" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="32" y1="74" x2="16" y2="66" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="116" y1="101" x2="134" y2="75" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="134" y1="75" x2="152" y2="64" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <rect x="8" y="62" width="12" height="6" rx="2" fill="#6B7280"/>
        <rect x="148" y="60" width="12" height="6" rx="2" fill="#6B7280"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">双臂展开</text>` },
      { label:{zh:'夹胸：感受胸肌收缩',en:'Fly: squeeze chest together',ru:'Сводите: сжимайте грудь',kk:'Жиыңыз: кеудені сезіңіз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="130" width="160" height="10" rx="5" fill="#2A2520"/>
        <circle cx="40" cy="80" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="40" y1="96" x2="130" y2="102" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="50" y1="98" x2="50" y2="122" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="50" y1="98" x2="38" y2="82" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="38" y1="82" x2="54" y2="76" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="116" y1="101" x2="128" y2="84" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="84" x2="112" y2="76" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <rect x="46" y="72" width="12" height="6" rx="2" fill="#6B7280"/>
        <rect x="108" y="72" width="12" height="6" rx="2" fill="#6B7280"/>
        <path d="M54 78 Q83 68 112 78" fill="none" stroke="#C9A96E" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.6"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">↔ 夹紧胸肌</text>` },
    ]},

  103: { // 上斜卧推
    bg:'#0E0C0A', steps:[
      { label:{zh:'斜面卧推起始位',en:'Incline start position',ru:'Начальная позиция наклона',kk:'Еңкейген бастапқы позиция'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="10" y="160" width="150" height="10" rx="5" fill="#2A2520" transform="rotate(-25 10 160)"/>
        <circle cx="38" cy="80" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="38" y1="96" x2="120" y2="130" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="54" y1="106" x2="46" y2="130" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="106" y1="124" x2="116" y2="148" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="120" y1="130" x2="134" y2="155" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="54" y1="106" x2="36" y2="88" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="36" y1="88" x2="22" y2="74" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="106" y1="124" x2="124" y2="108" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="124" y1="108" x2="140" y2="92" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="14" y1="72" x2="150" y2="72" stroke="#6B7280" stroke-width="5"/>
        <circle cx="14" cy="72" r="8" fill="#4B5563"/><circle cx="150" cy="72" r="8" fill="#4B5563"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">上斜30-45°</text>` },
    ]},

  111: { // 杠铃划船
    bg:'#0E0C0A', steps:[
      { label:{zh:'前屈45°，背部中立',en:'45° hinge, neutral back',ru:'Наклон 45°, нейтральная спина',kk:'45° иілу, бейтарап арқа'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="210" x2="190" y2="210" stroke="#2A2520" stroke-width="3"/>
        <circle cx="70" cy="72" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="70" y1="88" x2="110" y2="132" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="82" y1="104" x2="62" y2="126" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="62" y1="126" x2="50" y2="158" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="98" y1="122" x2="130" y2="118" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="118" x2="152" y2="146" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="96" y1="132" x2="88" y2="180" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="124" y1="132" x2="132" y2="178" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="40" y1="188" x2="170" y2="188" stroke="#6B7280" stroke-width="5"/>
        <circle cx="40" cy="188" r="9" fill="#4B5563"/><circle cx="170" cy="188" r="9" fill="#4B5563"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">背部中立准备</text>` },
      { label:{zh:'划向腰部，肘夹紧',en:'Row to waist, elbows tight',ru:'Тяните к поясу, локти прижаты',kk:'Белге тартыңыз, шынтақ жабысқан'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="210" x2="190" y2="210" stroke="#2A2520" stroke-width="3"/>
        <circle cx="70" cy="72" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="70" y1="88" x2="110" y2="132" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="82" y1="104" x2="58" y2="118" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="58" y1="118" x2="48" y2="100" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="98" y1="122" x2="130" y2="114" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="114" x2="142" y2="96" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="96" y1="132" x2="88" y2="180" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="124" y1="132" x2="132" y2="178" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="40" y1="98" x2="152" y2="98" stroke="#6B7280" stroke-width="5"/>
        <circle cx="40" cy="98" r="9" fill="#4B5563"/><circle cx="152" cy="98" r="9" fill="#4B5563"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">划向腰部</text>` },
    ]},

  113: { // 高位下拉
    bg:'#0E0C0A', steps:[
      { label:{zh:'握距略宽于肩，肩胛下压',en:'Grip wider than shoulders, depress scapula',ru:'Хват шире плеч, лопатки вниз',kk:'Иықтан кең ұстамтас, жауырын төмен'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="20" width="160" height="8" rx="4" fill="#4B5563"/>
        <line x1="60" y1="28" x2="52" y2="44" stroke="#6B7280" stroke-width="4" stroke-linecap="round"/>
        <line x1="140" y1="28" x2="148" y2="44" stroke="#6B7280" stroke-width="4" stroke-linecap="round"/>
        <line x1="44" y1="42" x2="156" y2="42" stroke="#6B7280" stroke-width="5" stroke-linecap="round"/>
        <circle cx="100" cy="78" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="94" x2="100" y2="160" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="68" y1="108" x2="132" y2="108" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="68" y1="108" x2="52" y2="44" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="132" y1="108" x2="148" y2="44" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="160" x2="80" y2="202" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="160" x2="120" y2="202" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">准备拉下</text>` },
      { label:{zh:'下拉至锁骨，夹背阔',en:'Pull to clavicle, squeeze lats',ru:'Тяните к ключице, сжимайте лат',kk:'Бұғанаға тартып, арқа бұлшықетін қысыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="20" width="160" height="8" rx="4" fill="#4B5563"/>
        <line x1="60" y1="28" x2="52" y2="44" stroke="#6B7280" stroke-width="4" stroke-linecap="round"/>
        <line x1="140" y1="28" x2="148" y2="44" stroke="#6B7280" stroke-width="4" stroke-linecap="round"/>
        <line x1="44" y1="42" x2="156" y2="42" stroke="#6B7280" stroke-width="5" stroke-linecap="round"/>
        <circle cx="100" cy="88" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="104" x2="100" y2="170" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="64" y1="112" x2="136" y2="112" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="64" y1="112" x2="52" y2="44" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="136" y1="112" x2="148" y2="44" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="170" x2="80" y2="210" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="170" x2="120" y2="210" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="60" y1="100" x2="140" y2="100" stroke="#C9A96E" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.5"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">下拉至锁骨</text>` },
    ]},

  120: { // 哑铃肩推
    bg:'#0E0C0A', steps:[
      { label:{zh:'肘部90°，哑铃与耳齐',en:'Elbows 90°, dumbbells at ear level',ru:'Локти 90°, гантели у ушей',kk:'Шынтақ 90°, гантельдер құлақ деңгейінде'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <circle cx="100" cy="54" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="70" x2="100" y2="150" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="84" x2="130" y2="84" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="84" x2="52" y2="104" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="52" y1="104" x2="48" y2="84" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="84" x2="148" y2="104" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="148" y1="104" x2="152" y2="84" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <rect x="38" y="80" width="14" height="7" rx="3" fill="#6B7280"/>
        <rect x="148" y="80" width="14" height="7" rx="3" fill="#6B7280"/>
        <line x1="86" y1="150" x2="80" y2="202" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="150" x2="120" y2="202" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">起始位</text>` },
      { label:{zh:'向上推起，不要锁肘',en:'Press up, don\'t lock elbows',ru:'Жмите вверх, не блокируйте локти',kk:'Жоғарыға итеріңіз, шынтақты бекітпеңіз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <circle cx="100" cy="54" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="70" x2="100" y2="150" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="84" x2="130" y2="84" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="84" x2="56" y2="62" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="56" y1="62" x2="58" y2="40" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="84" x2="144" y2="62" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="144" y1="62" x2="142" y2="40" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <rect x="48" y="34" width="14" height="7" rx="3" fill="#6B7280"/>
        <rect x="138" y="34" width="14" height="7" rx="3" fill="#6B7280"/>
        <line x1="86" y1="150" x2="80" y2="202" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="150" x2="120" y2="202" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="58" y="28" fill="#C9A96E" font-size="14">↑</text>
        <text x="136" y="28" fill="#C9A96E" font-size="14">↑</text>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">推起</text>` },
    ]},

  122: { // 面拉
    bg:'#0E0C0A', steps:[
      { label:{zh:'绳索在面部高度',en:'Cable at face height',ru:'Трос на уровне лица',kk:'Кабель бет деңгейінде'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="0" y="80" width="8" height="90" rx="2" fill="#4B5563"/>
        <line x1="8" y1="125" x2="56" y2="125" stroke="#6B7280" stroke-width="3"/>
        <circle cx="100" cy="72" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="88" x2="100" y2="158" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="102" x2="130" y2="102" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="102" x2="56" y2="120" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="56" y1="120" x2="40" y2="126" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="102" x2="144" y2="118" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="144" y1="118" x2="158" y2="124" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="158" x2="80" y2="205" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="158" x2="120" y2="205" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">绳索准备</text>` },
      { label:{zh:'拉至脸侧，外旋肩关节',en:'Pull to cheeks, externally rotate',ru:'Тяните к щёкам, вращайте плечи наружу',kk:'Бетке тартып, сыртқа бұрыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="0" y="80" width="8" height="90" rx="2" fill="#4B5563"/>
        <line x1="8" y1="125" x2="56" y2="80" stroke="#6B7280" stroke-width="3"/>
        <circle cx="100" cy="72" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="88" x2="100" y2="158" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="102" x2="130" y2="102" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="102" x2="44" y2="82" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="44" y1="82" x2="54" y2="64" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="102" x2="154" y2="82" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="154" y1="82" x2="166" y2="64" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="158" x2="80" y2="205" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="158" x2="120" y2="205" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">拉至面侧 外旋</text>` },
    ]},

  131: { // 腿举
    bg:'#0E0C0A', steps:[
      { label:{zh:'脚踩踏板中高位',en:'Feet mid-high on platform',ru:'Ноги посередине-высоко',kk:'Аяқтар орта-жоғары позицияда'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="10" y="220" width="180" height="8" rx="4" fill="#2A2520"/>
        <rect x="50" y="40" width="100" height="60" rx="8" fill="#1A1614" stroke="#2A2520" stroke-width="2"/>
        <circle cx="100" cy="58" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="72" x2="100" y2="96" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="74" y1="82" x2="126" y2="82" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="74" y1="82" x2="64" y2="104" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="64" y1="104" x2="72" y2="130" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="72" y1="130" x2="76" y2="162" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="126" y1="82" x2="136" y2="104" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="136" y1="104" x2="128" y2="130" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="130" x2="124" y2="162" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <rect x="58" y="158" width="28" height="10" rx="4" fill="#4B5563"/>
        <rect x="114" y="158" width="28" height="10" rx="4" fill="#4B5563"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">腿举准备</text>` },
      { label:{zh:'蹬伸，不要完全锁膝',en:'Press, don\'t fully lock knees',ru:'Жмите, не блокируйте колени',kk:'Итеріңіз, тізелерді бекітпеңіз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="10" y="220" width="180" height="8" rx="4" fill="#2A2520"/>
        <rect x="50" y="40" width="100" height="60" rx="8" fill="#1A1614" stroke="#2A2520" stroke-width="2"/>
        <circle cx="100" cy="58" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="72" x2="100" y2="96" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="74" y1="82" x2="126" y2="82" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="74" y1="82" x2="62" y2="104" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="62" y1="104" x2="60" y2="148" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="60" y1="148" x2="62" y2="185" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="126" y1="82" x2="138" y2="104" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="138" y1="104" x2="140" y2="148" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="140" y1="148" x2="138" y2="185" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <rect x="48" y="181" width="28" height="10" rx="4" fill="#4B5563"/>
        <rect x="124" y="181" width="28" height="10" rx="4" fill="#4B5563"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">蹬伸</text>` },
    ]},

  132: { // 弓步蹲
    bg:'#0E0C0A', steps:[
      { label:{zh:'迈步，前脚着地',en:'Step forward, heel first',ru:'Шагните вперёд, пятка первая',kk:'Алға қадам басыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="210" x2="190" y2="210" stroke="#2A2520" stroke-width="3"/>
        <circle cx="90" cy="54" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="90" y1="70" x2="100" y2="136" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="62" y1="88" x2="118" y2="88" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="62" y1="88" x2="52" y2="114" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="118" y1="88" x2="132" y2="112" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="90" y1="136" x2="60" y2="170" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="60" y1="170" x2="44" y2="208" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="110" y1="136" x2="140" y2="170" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="140" y1="170" x2="156" y2="208" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">迈步准备</text>` },
      { label:{zh:'下蹲：前腿小腿垂直',en:'Lower: front shin stays vertical',ru:'Опускайтесь: голень вертикально',kk:'Төмен: алдыңғы балтыр тігінен'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="210" x2="190" y2="210" stroke="#2A2520" stroke-width="3"/>
        <circle cx="86" cy="66" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="86" y1="82" x2="96" y2="132" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="60" y1="96" x2="116" y2="96" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="60" y1="96" x2="46" y2="118" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="116" y1="96" x2="130" y2="118" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="80" y1="132" x2="56" y2="168" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="56" y1="168" x2="48" y2="208" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="112" y1="132" x2="148" y2="162" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="148" y1="162" x2="148" y2="208" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="48" y1="168" x2="48" y2="210" stroke="#C9A96E" stroke-width="1" stroke-dasharray="3,2" opacity="0.4"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">小腿垂直</text>` },
    ]},

  133: { // 腿弯举
    bg:'#0E0C0A', steps:[
      { label:{zh:'俯卧，脚跟钩住转轴',en:'Prone, hook ankles under pad',ru:'Лёжа, зацепите лодыжки',kk:'Жатыңыз, тобықты ілініп алыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="130" width="160" height="10" rx="5" fill="#2A2520"/>
        <circle cx="38" cy="100" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="38" y1="114" x2="140" y2="124" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="52" y1="116" x2="52" y2="132" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="126" y1="122" x2="126" y2="132" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="140" y1="124" x2="150" y2="135" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="52" y1="116" x2="34" y2="108" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="52" y1="116" x2="70" y2="106" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="126" y1="122" x2="144" y2="120" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="126" y1="122" x2="158" y2="138" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <rect x="154" y="136" width="14" height="8" rx="3" fill="#4B5563"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">俯卧准备</text>` },
      { label:{zh:'弯举：顶点夹紧腘绳肌',en:'Curl up: squeeze hamstrings at top',ru:'Сгибайте: сожмите бицепс бедра',kk:'Иіңіз: жоғарыда буынды қысыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="130" width="160" height="10" rx="5" fill="#2A2520"/>
        <circle cx="38" cy="100" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="38" y1="114" x2="140" y2="124" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="52" y1="116" x2="52" y2="132" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="126" y1="122" x2="126" y2="132" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="140" y1="124" x2="150" y2="135" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="126" y1="122" x2="154" y2="100" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="154" y1="100" x2="168" y2="80" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <rect x="164" y="74" width="14" height="8" rx="3" fill="#4B5563"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">↑ 弯举夹紧</text>` },
    ]},

  134: { // 提踵
    bg:'#0E0C0A', steps:[
      { label:{zh:'站在台阶边缘，跟腱放松',en:'Stand on edge, heels below',ru:'Стоите на краю, пятки ниже',kk:'Жиек бойында тұрыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="40" y="178" width="120" height="14" rx="4" fill="#2A2520"/>
        <line x1="10" y1="192" x2="190" y2="192" stroke="#1A1614" stroke-width="3"/>
        <circle cx="100" cy="52" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="68" x2="100" y2="148" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="84" x2="130" y2="84" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="84" x2="56" y2="110" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="84" x2="144" y2="110" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="148" x2="82" y2="178" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="148" x2="118" y2="178" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="74" y1="178" x2="70" y2="196" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="126" y1="178" x2="130" y2="196" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">脚后跟放松</text>` },
      { label:{zh:'踮起：顶部停顿1秒',en:'Rise up: pause 1s at top',ru:'Поднимитесь: пауза 1с',kk:'Жоғарыға: 1 секунд тоқтаңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="40" y="178" width="120" height="14" rx="4" fill="#2A2520"/>
        <line x1="10" y1="192" x2="190" y2="192" stroke="#1A1614" stroke-width="3"/>
        <circle cx="100" cy="44" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="60" x2="100" y2="140" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="76" x2="130" y2="76" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="76" x2="56" y2="102" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="76" x2="144" y2="102" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="140" x2="80" y2="170" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="140" x2="120" y2="170" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="80" y1="170" x2="78" y2="180" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="120" y1="170" x2="122" y2="180" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <text x="80" y="170" fill="#C9A96E" font-size="14">↑</text>
        <text x="112" y="170" fill="#C9A96E" font-size="14">↑</text>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">踮起顶端</text>` },
    ]},

  141: { // 绳索下压
    bg:'#0E0C0A', steps:[
      { label:{zh:'肘部贴体侧，起始位',en:'Elbows at sides, start position',ru:'Локти прижаты к телу',kk:'Шынтақтар денеге жабысқан'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="86" y="10" width="28" height="8" rx="3" fill="#4B5563"/>
        <line x1="100" y1="18" x2="100" y2="60" stroke="#6B7280" stroke-width="3"/>
        <line x1="84" y1="60" x2="116" y2="60" stroke="#6B7280" stroke-width="4" stroke-linecap="round"/>
        <circle cx="100" cy="68" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="84" x2="100" y2="158" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="98" x2="130" y2="98" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="98" x2="66" y2="124" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="66" y1="124" x2="68" y2="102" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="98" x2="134" y2="124" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="134" y1="124" x2="132" y2="102" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="158" x2="80" y2="205" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="158" x2="120" y2="205" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">肘部贴紧</text>` },
      { label:{zh:'下压至手臂伸直，夹三头',en:'Press down, squeeze triceps',ru:'Жмите вниз, сожмите трицепс',kk:'Төмен итеріп, трицепсті қысыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="86" y="10" width="28" height="8" rx="3" fill="#4B5563"/>
        <line x1="100" y1="18" x2="100" y2="60" stroke="#6B7280" stroke-width="3"/>
        <line x1="84" y1="60" x2="116" y2="60" stroke="#6B7280" stroke-width="4" stroke-linecap="round"/>
        <circle cx="100" cy="68" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="84" x2="100" y2="158" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="98" x2="130" y2="98" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="98" x2="66" y2="122" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="66" y1="122" x2="62" y2="152" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="130" y1="98" x2="134" y2="122" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="134" y1="122" x2="138" y2="152" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="158" x2="80" y2="205" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="158" x2="120" y2="205" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">↓ 下压夹紧</text>` },
    ]},

  142: { // 臂屈伸
    bg:'#0E0C0A', steps:[
      { label:{zh:'支撑在双杠上',en:'Support on parallel bars',ru:'Опора на брусьях',kk:'Арқалықта тіреніңіз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="110" width="12" height="100" rx="4" fill="#2A2520"/>
        <rect x="168" y="110" width="12" height="100" rx="4" fill="#2A2520"/>
        <rect x="20" y="104" width="12" height="12" rx="4" fill="#4B5563"/>
        <rect x="168" y="104" width="12" height="12" rx="4" fill="#4B5563"/>
        <circle cx="100" cy="56" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="72" x2="100" y2="130" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="64" y1="86" x2="136" y2="86" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="64" y1="86" x2="32" y2="108" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="136" y1="86" x2="168" y2="108" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="130" x2="82" y2="168" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="130" x2="118" y2="168" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">支撑位</text>` },
      { label:{zh:'下沉：弯肘至90度',en:'Dip: bend elbows to 90°',ru:'Опускайтесь: локти 90°',kk:'Түсіңіз: шынтақ 90°'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="110" width="12" height="100" rx="4" fill="#2A2520"/>
        <rect x="168" y="110" width="12" height="100" rx="4" fill="#2A2520"/>
        <rect x="20" y="104" width="12" height="12" rx="4" fill="#4B5563"/>
        <rect x="168" y="104" width="12" height="12" rx="4" fill="#4B5563"/>
        <circle cx="100" cy="80" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="96" x2="100" y2="148" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="64" y1="108" x2="136" y2="108" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="64" y1="108" x2="32" y2="108" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="136" y1="108" x2="168" y2="108" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="148" x2="82" y2="190" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="148" x2="118" y2="190" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">↓ 弯肘下沉</text>` },
    ]},

  150: { // 仰卧起坐
    bg:'#0E0C0A', steps:[
      { label:{zh:'仰卧，双脚固定',en:'Lie back, feet anchored',ru:'Лёжа, ноги зафиксированы',kk:'Жатыңыз, аяқтар бекіген'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="170" x2="190" y2="170" stroke="#2A2520" stroke-width="3"/>
        <circle cx="38" cy="130" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="38" y1="144" x2="130" y2="164" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="52" y1="148" x2="42" y2="132" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="52" y1="148" x2="60" y2="132" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="114" y1="162" x2="106" y2="148" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="106" y1="148" x2="100" y2="170" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="120" y1="164" x2="152" y2="162" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="152" y1="162" x2="164" y2="170" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">仰卧准备</text>` },
      { label:{zh:'卷腹起身，腹肌发力',en:'Crunch up with abs, not neck',ru:'Скрутитесь животом, не шеей',kk:'Іш бұлшықетімен, мойынмен емес'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="200" x2="190" y2="200" stroke="#2A2520" stroke-width="3"/>
        <circle cx="56" cy="80" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="56" y1="94" x2="110" y2="148" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="66" y1="108" x2="48" y2="112" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="66" y1="108" x2="76" y2="114" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="94" y1="138" x2="80" y2="160" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="80" y1="160" x2="72" y2="198" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="126" y1="148" x2="150" y2="148" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="150" y1="148" x2="162" y2="198" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">腹肌发力卷起</text>` },
    ]},

  151: { // 俄罗斯转体
    bg:'#0E0C0A', steps:[
      { label:{zh:'V字坐姿，双脚离地',en:'V-sit, feet off ground',ru:'Сидите V-образно, ноги оторваны',kk:'V-отырыс, аяқтар жерден'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="200" x2="190" y2="200" stroke="#2A2520" stroke-width="3"/>
        <circle cx="100" cy="86" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="100" x2="100" y2="154" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="74" y1="112" x2="126" y2="112" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="74" y1="112" x2="58" y2="136" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="126" y1="112" x2="142" y2="136" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="154" x2="66" y2="176" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="66" y1="176" x2="52" y2="192" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="154" x2="134" y2="176" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="134" y1="176" x2="148" y2="192" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">V字平衡</text>` },
      { label:{zh:'向左转，再向右转',en:'Twist left, then right',ru:'Повернитесь влево, затем вправо',kk:'Солға, сонан кейін оңға'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="200" x2="190" y2="200" stroke="#2A2520" stroke-width="3"/>
        <circle cx="96" cy="86" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="96" y1="100" x2="100" y2="154" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="64" y1="110" x2="128" y2="116" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="64" y1="110" x2="40" y2="118" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="116" x2="150" y2="128" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="154" x2="66" y2="176" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="154" x2="134" y2="176" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <text x="38" y="112" fill="#C9A96E" font-size="14">←</text>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">腰腹旋转</text>` },
    ]},

  152: { // 悬挂举腿
    bg:'#0E0C0A', steps:[
      { label:{zh:'悬挂，核心收紧',en:'Hang, engage core',ru:'Вис, напрягите кор',kk:'Ілініңіз, өзекті тартыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="40" y="20" width="120" height="8" rx="4" fill="#4B5563"/>
        <line x1="86" y1="28" x2="80" y2="44" stroke="#C9A96E" stroke-width="4" stroke-linecap="round"/>
        <line x1="114" y1="28" x2="120" y2="44" stroke="#C9A96E" stroke-width="4" stroke-linecap="round"/>
        <circle cx="100" cy="70" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="86" x2="100" y2="156" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="100" x2="80" y2="44" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="100" x2="120" y2="44" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="72" y1="100" x2="128" y2="100" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="86" y1="156" x2="80" y2="205" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="156" x2="120" y2="205" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">悬挂准备</text>` },
      { label:{zh:'举腿至90°，控制下放',en:'Raise legs to 90°, slow lower',ru:'Поднимите ноги до 90°',kk:'Аяқтарды 90°-қа дейін'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="40" y="20" width="120" height="8" rx="4" fill="#4B5563"/>
        <line x1="86" y1="28" x2="80" y2="44" stroke="#C9A96E" stroke-width="4" stroke-linecap="round"/>
        <line x1="114" y1="28" x2="120" y2="44" stroke="#C9A96E" stroke-width="4" stroke-linecap="round"/>
        <circle cx="100" cy="70" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="86" x2="100" y2="156" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="100" x2="80" y2="44" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="100" x2="120" y2="44" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="72" y1="100" x2="128" y2="100" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="86" y1="156" x2="56" y2="156" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="156" x2="144" y2="156" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="56" y1="156" x2="44" y2="175" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="144" y1="156" x2="156" y2="175" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">举腿90°</text>` },
    ]},

  160: { // 跑步机
    bg:'#0E0C0A', steps:[
      { label:{zh:'上机，双手轻扶扶手',en:'Step on, lightly hold handles',ru:'Встаньте, слегка держите поручни',kk:'Жаяу машинаға шығыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="170" width="160" height="12" rx="4" fill="#1A1614" stroke="#2A2520" stroke-width="2"/>
        <rect x="15" y="60" width="8" height="116" rx="3" fill="#2A2520"/>
        <rect x="177" y="60" width="8" height="116" rx="3" fill="#2A2520"/>
        <line x1="23" y1="72" x2="68" y2="108" stroke="#2A2520" stroke-width="3"/>
        <line x1="177" y1="72" x2="132" y2="108" stroke="#2A2520" stroke-width="3"/>
        <circle cx="100" cy="72" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="88" x2="100" y2="158" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="102" x2="68" y2="108" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="102" x2="132" y2="108" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="72" y1="102" x2="128" y2="102" stroke="#C9A96E" stroke-width="4" stroke-linecap="round"/>
        <line x1="86" y1="158" x2="80" y2="168" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="114" y1="158" x2="120" y2="168" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">跑步机有氧</text>` },
      { label:{zh:'维持心率65-75%最大值',en:'Keep HR at 65-75% max',ru:'Пульс 65-75% от максимума',kk:'Жүрек соғысы 65-75% максималды'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="170" width="160" height="12" rx="4" fill="#1A1614" stroke="#2A2520" stroke-width="2"/>
        <rect x="15" y="60" width="8" height="116" rx="3" fill="#2A2520"/>
        <rect x="177" y="60" width="8" height="116" rx="3" fill="#2A2520"/>
        <circle cx="100" cy="68" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="84" x2="100" y2="154" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="98" x2="128" y2="98" stroke="#C9A96E" stroke-width="4" stroke-linecap="round"/>
        <line x1="86" y1="154" x2="72" y2="168" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="154" x2="128" y2="168" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <!-- heart rate display -->
        <rect x="60" y="40" width="80" height="22" rx="6" fill="#1A1614" stroke="rgba(201,169,110,0.3)" stroke-width="1"/>
        <rect x="20" y="217" width="160" height="18" rx="6" fill="rgba(0,0,0,0.55)"/><text x="100" y="230" text-anchor="middle" fill="#C9A96E" font-size="11" font-weight="600">♥ 135 bpm</text>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">稳态有氧</text>` },
    ]},

  161: { // 动感单车
    bg:'#0E0C0A', steps:[
      { label:{zh:'调座椅高度，踩踏圆润',en:'Adjust seat, smooth pedal stroke',ru:'Регулируйте сиденье, плавное педалирование',kk:'Отырғышты реттеп, бірқалыпты айналдыру'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <!-- bike frame -->
        <ellipse cx="100" cy="168" rx="32" ry="32" fill="none" stroke="#2A2520" stroke-width="6"/>
        <line x1="100" y1="136" x2="100" y2="100" stroke="#2A2520" stroke-width="5" stroke-linecap="round"/>
        <line x1="100" y1="100" x2="70" y2="90" stroke="#2A2520" stroke-width="4" stroke-linecap="round"/>
        <line x1="70" y1="90" x2="70" y2="72" stroke="#2A2520" stroke-width="4" stroke-linecap="round"/>
        <line x1="62" y1="72" x2="78" y2="72" stroke="#4B5563" stroke-width="5" stroke-linecap="round"/>
        <!-- rider -->
        <circle cx="80" cy="50" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="80" y1="64" x2="90" y2="100" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="62" y1="76" x2="80" y2="72" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="80" y1="72" x2="100" y2="100" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="86" y1="96" x2="80" y2="130" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="80" y1="130" x2="110" y2="152" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">调整坐高</text>` },
    ]},

  162: { // 划船机
    bg:'#0E0C0A', steps:[
      { label:{zh:'腿→腰→臂 顺序发力',en:'Legs→hip→arms sequence',ru:'Ноги→таз→руки',kk:'Аяқ→жамбас→қол'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="190" width="160" height="8" rx="4" fill="#2A2520"/>
        <line x1="20" y1="194" x2="180" y2="194" stroke="#2A2520" stroke-width="2"/>
        <circle cx="54" cy="110" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="54" y1="124" x2="80" y2="160" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="42" y1="132" x2="30" y2="116" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="30" y1="116" x2="20" y2="104" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="66" y1="132" x2="72" y2="116" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="72" y1="116" x2="82" y2="102" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="72" y1="160" x2="60" y2="190" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="88" y1="160" x2="104" y2="186" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="20" y1="104" x2="82" y2="104" stroke="#6B7280" stroke-width="3" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">蜷缩起始</text>` },
      { label:{zh:'蹬腿→展髋→拉手柄',en:'Drive legs→open hips→pull handle',ru:'Толчок ногами→таз→тяга',kk:'Аяқпен→жамбас→тартыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="190" width="160" height="8" rx="4" fill="#2A2520"/>
        <circle cx="60" cy="130" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="60" y1="144" x2="70" y2="172" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="42" y1="152" x2="20" y2="142" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="20" y1="142" x2="14" y2="128" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="74" y1="150" x2="90" y2="142" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="90" y1="142" x2="100" y2="130" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="58" y1="172" x2="38" y2="188" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="82" y1="172" x2="110" y2="186" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="14" y1="130" x2="100" y2="132" stroke="#6B7280" stroke-width="3" stroke-dasharray="4,3"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">蹬伸展髋拉柄</text>` },
    ]},

  170: { // 泡沫轴放松
    bg:'#0E0C0A', steps:[
      { label:{zh:'俯卧：泡沫轴置于大腿下',en:'Prone: foam roller under thighs',ru:'Лёжа: валик под бёдрами',kk:'Жатыңыз: валик жамбас астында'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="190" x2="190" y2="190" stroke="#2A2520" stroke-width="3"/>
        <ellipse cx="110" cy="178" rx="40" ry="14" fill="#2A2520" stroke="#4B5563" stroke-width="2"/>
        <circle cx="36" cy="146" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="36" y1="160" x2="140" y2="172" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="50" y1="162" x2="44" y2="148" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="44" y1="148" x2="30" y2="142" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="50" y1="162" x2="58" y2="148" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="120" y1="170" x2="148" y2="162" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="148" y1="162" x2="166" y2="188" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">泡沫轴滚动</text>` },
      { label:{zh:'在痛点停留30秒',en:'Pause on sore spot 30s',ru:'Стоп на болезненной точке 30с',kk:'Ауырсыну нүктесінде 30 секунд'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="190" x2="190" y2="190" stroke="#2A2520" stroke-width="3"/>
        <ellipse cx="100" cy="176" rx="40" ry="14" fill="#2A2520" stroke="#4B5563" stroke-width="2"/>
        <circle cx="36" cy="146" r="14" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="36" y1="160" x2="140" y2="170" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="50" y1="162" x2="30" y2="140" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="50" y1="162" x2="68" y2="150" stroke="#A07840" stroke-width="4" stroke-linecap="round"/>
        <line x1="112" y1="168" x2="148" y2="162" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="148" y1="162" x2="164" y2="186" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <circle cx="100" cy="163" r="8" fill="none" stroke="#C9A96E" stroke-width="2" stroke-dasharray="3,2">
          <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">痛点停留30秒</text>` },
    ]},

  171: { // 全身拉伸
    bg:'#0E0C0A', steps:[
      { label:{zh:'上身前屈，拉伸腘绳肌',en:'Forward fold, stretch hamstrings',ru:'Наклон вперёд, растяжка',kk:'Алға иіліп, буын созыңыз'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="200" x2="190" y2="200" stroke="#2A2520" stroke-width="3"/>
        <circle cx="100" cy="90" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="106" x2="100" y2="148" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="120" x2="128" y2="120" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="72" y1="120" x2="56" y2="150" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="120" x2="144" y2="148" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="148" x2="80" y2="198" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="148" x2="120" y2="198" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <text x="100" y="228" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="10">前屈拉伸</text>` },
      { label:{zh:'侧身拉伸，保持30秒',en:'Side stretch, hold 30s',ru:'Боковая растяжка, 30с',kk:'Бүйір созылу, 30 секунд'},
        svg:`<rect width="200" height="240" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="210" x2="190" y2="210" stroke="#2A2520" stroke-width="3"/>
        <circle cx="100" cy="60" r="16" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="76" x2="100" y2="158" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="68" y1="92" x2="132" y2="92" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="68" y1="92" x2="44" y2="70" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="44" y1="70" x2="34" y2="50" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="132" y1="92" x2="150" y2="110" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="158" x2="80" y2="208" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="158" x2="120" y2="208" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <path d="M106 60 Q90 52 84 44" fill="none" stroke="#C9A96E" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.5"/>
        <text x="100" y="228" text-anchor="middle" fill="#C9A96E" font-size="10">侧身30秒</text>` },
    ]},

};

// ── 动画播放器逻辑 ──
let animFrameIdx = 0;
let animInterval = null;
let animPaused = false;

function getAnimForExercise(exId) {
  return EXERCISE_ANIMATIONS[exId] || null;
}

function renderAnimationFrame(exId, frameIdx) {
  const anim = getAnimForExercise(exId);
  if (!anim) return null;
  const steps = anim.steps;
  const step  = steps[frameIdx % steps.length];
  const total = steps.length;
  const label = step.label[currentLang] || step.label.zh || '';
  const dotColor = (typeof currentTheme !== 'undefined' && currentTheme === 'fresh') ? '#3ECFA8' : '#C9A96E';

  // ── Step indicator: thin line segments OUTSIDE the SVG, below the label
  const segIndicator = total > 1 ? `
    <div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-top:6px">
      ${steps.map((_,i) => {
        const active = i === frameIdx % total;
        return `<div style="
          height:3px;
          width:${active ? 22 : 10}px;
          border-radius:100px;
          background:${active ? dotColor : 'rgba(255,255,255,0.18)'};
          transition:width 0.3s ease, background 0.3s ease;
        "></div>`;
      }).join('')}
    </div>` : '';

  // SVG fills available space — NO dots inside, NO reserved bottom space
  return `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;height:100%;display:block;flex:1;min-height:0;">
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="${dotColor}"/>
        </marker>
      </defs>
      <rect width="200" height="240" rx="16" fill="${anim.bg}"/>
      ${step.svg}
    </svg>
    <div class="anim-step-label">
      <p>${label}</p>
      ${segIndicator}
    </div>`;
}

function startAnimLoop(exId) {
  stopAnimLoop();
  const anim = getAnimForExercise(exId);
  if (!anim) return;
  animFrameIdx = 0;
  animPaused = false;
  updateAnimDisplay(exId);
  const dur = anim.steps[0].dur || 2200;
  animInterval = setInterval(() => {
    if (animPaused) return;
    animFrameIdx = (animFrameIdx + 1) % anim.steps.length;
    updateAnimDisplay(exId);
  }, dur);
}

function stopAnimLoop() {
  if (animInterval) { clearInterval(animInterval); animInterval = null; }
}

function updateAnimDisplay(exId) {
  const container = document.getElementById('anim-display');
  if (!container) return;
  const html = renderAnimationFrame(exId, animFrameIdx);
  if (html) container.innerHTML = html;
}

function toggleAnimPause() {
  animPaused = !animPaused;
  const btn = document.getElementById('anim-pause-btn');
  if (btn) btn.textContent = animPaused ? '▶' : '⏸';
}

function animPrevFrame(exId) {
  const anim = getAnimForExercise(exId);
  if (!anim) return;
  animFrameIdx = (animFrameIdx - 1 + anim.steps.length) % anim.steps.length;
  updateAnimDisplay(exId);
}

function animNextFrame(exId) {
  const anim = getAnimForExercise(exId);
  if (!anim) return;
  animFrameIdx = (animFrameIdx + 1) % anim.steps.length;
  updateAnimDisplay(exId);
}
