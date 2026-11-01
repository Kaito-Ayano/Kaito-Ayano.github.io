// ═══════════════════════════════════════════
//  健身房训练项目库 + 教学动画
// ═══════════════════════════════════════════

const GYM_EXERCISES = [
  // ── 胸部 ──
  { id:101, cat:'chest', emoji:'💪', nameZh:'卧推', nameEn:'Bench Press', nameRu:'Жим лёжа', nameKk:'Жатып басу',
    duration:12, level:'med', groups:['gym'],
    tipZh:'肩胛骨夹紧，背部微拱，杠铃触胸后推起', tipEn:'Retract scapula, slight arch, touch chest then press', tipRu:'Сведите лопатки, прогните спину, касайтесь груди', tipKk:'Жауырынды жиыңыз, кеудеге тиіп итеріңіз' },
  { id:102, cat:'chest', emoji:'🏋️', nameZh:'哑铃飞鸟', nameEn:'Dumbbell Fly', nameRu:'Разводка гантелей', nameKk:'Гантель жайылуы',
    duration:10, level:'med', groups:['gym'],
    tipZh:'肘关节微弯，感受胸肌拉伸，顶部夹胸', tipEn:'Slight elbow bend, feel chest stretch, squeeze at top', tipRu:'Слегка согните локти, растяните грудь', tipKk:'Шынтақты аздап иіп, кеудені сезіңіз' },
  { id:103, cat:'chest', emoji:'↗️', nameZh:'上斜卧推', nameEn:'Incline Press', nameRu:'Жим на наклонной', nameKk:'Еңкейіп басу',
    duration:12, level:'med', groups:['gym'],
    tipZh:'30-45度斜凳，重点刺激上胸', tipEn:'30-45 degree incline, targets upper chest', tipRu:'Наклон 30-45°, акцент на верх груди', tipKk:'30-45° еңкейту, жоғарғы кеуде' },

  // ── 背部 ──
  { id:110, cat:'back', emoji:'🔙', nameZh:'引体向上', nameEn:'Pull-up', nameRu:'Подтягивание', nameKk:'Тартылу',
    duration:10, level:'hard', groups:['gym'],
    tipZh:'肩胛骨下压，用背发力而非手臂', tipEn:'Depress scapula, pull with back not arms', tipRu:'Опустите лопатки, тяните спиной', tipKk:'Жауырынды төмен басып, арқамен тартыңыз' },
  { id:111, cat:'back', emoji:'🏋️', nameZh:'杠铃划船', nameEn:'Barbell Row', nameRu:'Тяга штанги в наклоне', nameKk:'Штанганы тарту',
    duration:12, level:'med', groups:['gym'],
    tipZh:'上身前倾45度，肘部贴紧躯干划向腰部', tipEn:'45° forward lean, row to waist keeping elbows tight', tipRu:'Наклон 45°, тяните к поясу', tipKk:'45° иілу, белге қарай тартыңыз' },
  { id:112, cat:'back', emoji:'📏', nameZh:'硬拉', nameEn:'Deadlift', nameRu:'Становая тяга', nameKk:'Жерден тарту',
    duration:15, level:'hard', groups:['gym'],
    tipZh:'背部中立，髋关节铰链发力，杠铃贴腿', tipEn:'Neutral spine, hip hinge, bar stays close to legs', tipRu:'Нейтральный позвоночник, тяга тазобедренным суставом', tipKk:'Бейтарап омыртқа, жамбас белдеуімен тартыңыз' },
  { id:113, cat:'back', emoji:'🔽', nameZh:'高位下拉', nameEn:'Lat Pulldown', nameRu:'Тяга верхнего блока', nameKk:'Жоғарыдан тарту',
    duration:12, level:'easy', groups:['gym'],
    tipZh:'肩胛骨下回旋，拉至锁骨，感受背阔肌收缩', tipEn:'Scapular depression, pull to clavicle, feel lats contract', tipRu:'Опустите лопатки, тяните к ключице', tipKk:'Жауырынды төмен, бұғанаға тартыңыз' },

  // ── 肩部 ──
  { id:120, cat:'shoulder', emoji:'🔺', nameZh:'哑铃肩推', nameEn:'Dumbbell Shoulder Press', nameRu:'Жим гантелей сидя', nameKk:'Гантельді иықтан басу',
    duration:12, level:'med', groups:['gym'],
    tipZh:'肘部90度，推至顶端不锁死', tipEn:'Elbows at 90°, press to top without locking out', tipRu:'Локти под 90°, жмите не блокируя', tipKk:'Шынтақ 90°, жоғарыға итеріңіз' },
  { id:121, cat:'shoulder', emoji:'↔️', nameZh:'侧平举', nameEn:'Lateral Raise', nameRu:'Подъём гантелей в стороны', nameKk:'Бүйірге көтеру',
    duration:10, level:'easy', groups:['gym'],
    tipZh:'小拇指略高于大拇指，举至肩膀水平', tipEn:'Pinky slightly higher, raise to shoulder level', tipRu:'Мизинец чуть выше, поднимайте до уровня плеч', tipKk:'Кішкентай саусақ жоғарырақ, иық деңгейіне дейін' },
  { id:122, cat:'shoulder', emoji:'🔄', nameZh:'面拉', nameEn:'Face Pull', nameRu:'Тяга к лицу', nameKk:'Бетке тарту',
    duration:10, level:'easy', groups:['gym'],
    tipZh:'绳索拉至面部，外旋肩关节，改善圆肩', tipEn:'Pull rope to face, externally rotate, fixes rounded shoulders', tipRu:'Тяните к лицу, вращайте плечи наружу', tipKk:'Бетке тартып, иықты сыртқа бұрыңыз' },

  // ── 腿部 ──
  { id:130, cat:'legs', emoji:'🦵', nameZh:'深蹲', nameEn:'Squat', nameRu:'Приседание', nameKk:'Отырып тұру',
    duration:15, level:'hard', groups:['gym'],
    tipZh:'脚尖外展30度，膝盖跟随脚尖方向，蹲至大腿平行', tipEn:'Toes out 30°, knees track toes, squat to parallel', tipRu:'Носки под 30°, колени за носками, до параллели', tipKk:'Саусақтар 30°, тізелер саусақ бағытында' },
  { id:131, cat:'legs', emoji:'🦿', nameZh:'腿举', nameEn:'Leg Press', nameRu:'Жим ногами', nameKk:'Аяқпен басу',
    duration:12, level:'med', groups:['gym'],
    tipZh:'脚位中高，膝盖不内扣，推至接近伸直', tipEn:'Mid-high foot position, no knee cave, press to near extension', tipRu:'Ноги посередине-высоко, колени не внутрь', tipKk:'Орта-жоғары позиция, тізелер ішке емес' },
  { id:132, cat:'legs', emoji:'🏃', nameZh:'弓步蹲', nameEn:'Lunge', nameRu:'Выпад', nameKk:'Аяқты алға қою',
    duration:12, level:'med', groups:['gym'],
    tipZh:'前腿小腿垂直地面，后膝接近但不触地', tipEn:'Front shin vertical, rear knee near but not touching floor', tipRu:'Голень передней ноги вертикально', tipKk:'Алдыңғы балтыр тігінен' },
  { id:133, cat:'legs', emoji:'💡', nameZh:'腿弯举', nameEn:'Leg Curl', nameRu:'Сгибание ног', nameKk:'Аяқты иу',
    duration:10, level:'easy', groups:['gym'],
    tipZh:'顶点夹紧腘绳肌，缓慢离心下放', tipEn:'Squeeze hamstrings at top, slow eccentric', tipRu:'Сожмите бицепс бедра вверху, медленно опускайте', tipKk:'Жоғарыда буынды қысыңыз' },
  { id:134, cat:'legs', emoji:'🏔️', nameZh:'提踵', nameEn:'Calf Raise', nameRu:'Подъём на носки', nameKk:'Саусаққа тұру',
    duration:10, level:'easy', groups:['gym'],
    tipZh:'全程动作，顶部停顿1秒，感受小腿收缩', tipEn:'Full range, 1 second pause at top, feel calf contract', tipRu:'Полная амплитуда, пауза вверху 1 секунду', tipKk:'Толық қозғалыс, жоғарыда 1 секунд' },

  // ── 手臂 ──
  { id:140, cat:'arms', emoji:'💪', nameZh:'哑铃弯举', nameEn:'Dumbbell Curl', nameRu:'Сгибание с гантелями', nameKk:'Гантельмен иу',
    duration:10, level:'easy', groups:['gym'],
    tipZh:'上臂固定，旋腕到顶，缓慢放下', tipEn:'Upper arm fixed, supinate at top, slow descent', tipRu:'Фиксируйте плечо, пронируйте вверху', tipKk:'Жоғарғы қолды бекітіп, баяу түсіріңіз' },
  { id:141, cat:'arms', emoji:'🔻', nameZh:'绳索下压', nameEn:'Tricep Pushdown', nameRu:'Разгибание на блоке', nameKk:'Блокта жазу',
    duration:10, level:'easy', groups:['gym'],
    tipZh:'肘部固定于体侧，全程收缩肱三头', tipEn:'Lock elbows at sides, full tricep contraction', tipRu:'Зафиксируйте локти, полное сокращение трицепса', tipKk:'Шынтақты бекітіп, трицепсті толық қысыңыз' },
  { id:142, cat:'arms', emoji:'🧱', nameZh:'臂屈伸', nameEn:'Dips', nameRu:'Отжимания на брусьях', nameKk:'Арқалықта',
    duration:12, level:'hard', groups:['gym'],
    tipZh:'略前倾针对胸部，直立针对三头', tipEn:'Lean forward for chest, upright for triceps', tipRu:'Наклон вперёд на грудь, прямо на трицепс', tipKk:'Алға иілу — кеуде, тік — трицепс' },

  // ── 核心 ──
  { id:150, cat:'core_gym', emoji:'⚡', nameZh:'仰卧起坐', nameEn:'Sit-up', nameRu:'Скручивания', nameKk:'Жатып тұру',
    duration:10, level:'med', groups:['gym'],
    tipZh:'不要用颈部发力，腹肌主导，上背离地', tipEn:'Lead with abs not neck, upper back lifts', tipRu:'Работа животом, не шеей', tipKk:'Моймен емес, іш бұлшықетімен' },
  { id:151, cat:'core_gym', emoji:'🔀', nameZh:'俄罗斯转体', nameEn:'Russian Twist', nameRu:'Русские скручивания', nameKk:'Орыс бұрылуы',
    duration:10, level:'med', groups:['gym'],
    tipZh:'脚离地增加难度，旋转发力来自腰腹', tipEn:'Feet off floor for harder version, rotate from core', tipRu:'Ноги оторвите для сложнее, вращение от кора', tipKk:'Аяқты жерден алып, өзектен бұрылыңыз' },
  { id:152, cat:'core_gym', emoji:'📐', nameZh:'悬挂举腿', nameEn:'Hanging Leg Raise', nameRu:'Подъём ног в висе', nameKk:'Ілулі аяқ көтеру',
    duration:12, level:'hard', groups:['gym'],
    tipZh:'控制摆动，腰椎不过伸，腹肌收缩发力', tipEn:'Control swing, no lumbar hyperextension, abs engage', tipRu:'Контролируйте качание, не переразгибайте поясницу', tipKk:'Тербелісті бақылаңыз, бел бұлшықеттерін жиыңыз' },

  // ── 有氧 ──
  { id:160, cat:'cardio', emoji:'🏃', nameZh:'跑步机', nameEn:'Treadmill', nameRu:'Беговая дорожка', nameKk:'Жүгіру жолы',
    duration:30, level:'med', groups:['gym'],
    tipZh:'心率维持最大心率65-75%，稳态有氧', tipEn:'Keep heart rate 65-75% max for steady-state cardio', tipRu:'Пульс 65-75% максимума для кардио', tipKk:'Жүрек соғысы максималдың 65-75%' },
  { id:161, cat:'cardio', emoji:'🚴', nameZh:'动感单车', nameEn:'Spin Bike', nameRu:'Велотренажёр', nameKk:'Велотренажер',
    duration:25, level:'med', groups:['gym'],
    tipZh:'调整座位高度，踩踏圆润流畅，间歇冲刺', tipEn:'Adjust seat height, smooth pedal stroke, interval sprints', tipRu:'Отрегулируйте сиденье, плавное педалирование', tipKk:'Отырғышты реттеңіз, бірқалыпты айналу' },
  { id:162, cat:'cardio', emoji:'🌊', nameZh:'划船机', nameEn:'Rowing Machine', nameRu:'Гребной тренажёр', nameKk:'Ескек тренажері',
    duration:20, level:'med', groups:['gym'],
    tipZh:'腿→腰→臂 顺序发力，60%腿力驱动', tipEn:'Legs→hip→arms sequence, 60% power from legs', tipRu:'Ноги→таз→руки, 60% мощность ногами', tipKk:'Аяқ→жамбас→қол тәртібі' },

  // ── 拉伸放松 ──
  { id:170, cat:'stretch', emoji:'🧘', nameZh:'泡沫轴放松', nameEn:'Foam Rolling', nameRu:'Миофасциальный релиз', nameKk:'Foam roller релаксациясы',
    duration:10, level:'easy', groups:['gym'],
    tipZh:'在痛点停留30秒，不要在关节上滚动', tipEn:'Pause on tender spots 30s, avoid rolling on joints', tipRu:'Останавливайтесь на болезненных точках 30с', tipKk:'Ауырсыну нүктелерінде 30 секунд тоқтаңыз' },
  { id:171, cat:'stretch', emoji:'🤸', nameZh:'全身拉伸', nameEn:'Full Body Stretch', nameRu:'Растяжка всего тела', nameKk:'Толық дене созылуы',
    duration:15, level:'easy', groups:['gym'],
    tipZh:'训练后拉伸，每个部位保持30秒', tipEn:'Post-workout stretch, hold each position 30s', tipRu:'Растяжка после тренировки, 30с каждая', tipKk:'Жаттығудан кейін, әр жерде 30 секунд' },
];

// ── 健身房动画 ──
const GYM_ANIMATIONS = {
  101: { // 卧推
    bg:'#0E0C0A', steps:[
      { label:{zh:'仰卧，背部贴紧凳面',en:'Lie back, back flat on bench',ru:'Лягте, спина на скамье',kk:'Жатыңыз, арқа орындықта'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <!-- bench -->
        <rect x="20" y="140" width="160" height="12" rx="6" fill="#2A2520"/>
        <!-- body lying -->
        <circle cx="40" cy="110" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="40" y1="128" x2="140" y2="135" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="58" y1="130" x2="58" y2="155" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="120" y1="133" x2="120" y2="158" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="140" y1="135" x2="150" y2="160" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="150" y1="160" x2="165" y2="178" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <!-- arms up holding bar -->
        <line x1="58" y1="130" x2="42" y2="94" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="42" y1="94" x2="30" y2="78" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="120" y1="133" x2="136" y2="96" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="136" y1="96" x2="148" y2="78" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <!-- barbell -->
        <line x1="18" y1="76" x2="162" y2="76" stroke="#6B7280" stroke-width="6" stroke-linecap="round"/>
        <circle cx="18" cy="76" r="9" fill="#4B5563"/><circle cx="162" cy="76" r="9" fill="#4B5563"/>
        <text x="100" y="260" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="11">准备姿势</text>` },
      { label:{zh:'下放：杠铃缓慢触胸',en:'Lower: bar slowly to chest',ru:'Опускайте штангу к груди',kk:'Кеудеге баяу түсіріңіз'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="140" width="160" height="12" rx="6" fill="#2A2520"/>
        <circle cx="40" cy="110" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="40" y1="128" x2="140" y2="135" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="58" y1="130" x2="58" y2="155" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="120" y1="133" x2="120" y2="158" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="140" y1="135" x2="150" y2="160" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="150" y1="160" x2="165" y2="178" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="58" y1="130" x2="36" y2="112" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="120" y1="133" x2="142" y2="114" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="18" y1="112" x2="162" y2="112" stroke="#6B7280" stroke-width="6" stroke-linecap="round"/>
        <circle cx="18" cy="112" r="9" fill="#4B5563"/><circle cx="162" cy="112" r="9" fill="#4B5563"/>
        <path d="M36 112 L18 112" stroke="#C9A96E" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
        <text x="100" y="260" text-anchor="middle" fill="#C9A96E" font-size="11">↓ 触胸</text>` },
      { label:{zh:'推起：发力推至顶端',en:'Press: drive bar up to top',ru:'Жмите штангу вверх',kk:'Жоғарыға итеріңіз'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <rect x="20" y="140" width="160" height="12" rx="6" fill="#2A2520"/>
        <circle cx="40" cy="110" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="40" y1="128" x2="140" y2="135" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="58" y1="130" x2="58" y2="155" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="120" y1="133" x2="120" y2="158" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="140" y1="135" x2="150" y2="160" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="58" y1="130" x2="44" y2="90" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="44" y1="90" x2="32" y2="72" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="120" y1="133" x2="134" y2="92" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="134" y1="92" x2="146" y2="72" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="18" y1="70" x2="162" y2="70" stroke="#6B7280" stroke-width="6" stroke-linecap="round"/>
        <circle cx="18" cy="70" r="9" fill="#4B5563"/><circle cx="162" cy="70" r="9" fill="#4B5563"/>
        <text x="100" y="260" text-anchor="middle" fill="#C9A96E" font-size="11">↑ 推起发力</text>` },
    ]},

  110: { // 引体向上
    bg:'#0E0C0A', steps:[
      { label:{zh:'悬挂：肩胛下沉激活',en:'Hang: depress scapula',ru:'Вис: опустите лопатки',kk:'Ілу: жауырынды төмен басыңыз'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <rect x="30" y="30" width="140" height="8" rx="4" fill="#4B5563"/>
        <line x1="72" y1="38" x2="72" y2="52" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="38" x2="128" y2="52" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <circle cx="100" cy="90" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="108" x2="100" y2="168" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="72" y1="52" x2="84" y2="120" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="128" y1="52" x2="116" y2="120" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="84" y1="125" x2="112" y2="125" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="86" y1="168" x2="80" y2="210" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="168" x2="120" y2="210" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <text x="100" y="255" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="11">悬挂激活</text>` },
      { label:{zh:'拉起：背阔肌主导',en:'Pull: lats lead the movement',ru:'Подтяните: тяга спиной',kk:'Арқа бастауымен тартыңыз'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <rect x="30" y="30" width="140" height="8" rx="4" fill="#4B5563"/>
        <line x1="72" y1="38" x2="72" y2="52" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="38" x2="128" y2="52" stroke="#C9A96E" stroke-width="5" stroke-linecap="round"/>
        <circle cx="100" cy="68" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="86" x2="100" y2="146" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="72" y1="52" x2="82" y2="96" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="128" y1="52" x2="118" y2="96" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="82" y1="100" x2="118" y2="100" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="86" y1="146" x2="78" y2="190" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="146" x2="122" y2="190" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <text x="72" y="46" fill="#C9A96E" font-size="16">↑</text>
        <text x="122" y="46" fill="#C9A96E" font-size="16">↑</text>
        <text x="100" y="255" text-anchor="middle" fill="#C9A96E" font-size="11">背阔肌发力</text>` },
    ]},

  112: { // 硬拉
    bg:'#0E0C0A', steps:[
      { label:{zh:'起始：背部中立，推地起身',en:'Start: neutral spine, push floor away',ru:'Старт: нейтральный позвоночник',kk:'Бастапқы: бейтарап омыртқа'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <!-- floor -->
        <line x1="10" y1="210" x2="190" y2="210" stroke="#2A2520" stroke-width="4"/>
        <!-- body hinge -->
        <circle cx="68" cy="80" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="68" y1="98" x2="110" y2="150" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="82" y1="114" x2="60" y2="140" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="60" y1="140" x2="46" y2="170" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="100" y1="130" x2="138" y2="140" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="138" y1="140" x2="152" y2="170" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="110" y1="150" x2="100" y2="200" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="110" y1="150" x2="124" y2="200" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <!-- barbell on floor -->
        <line x1="40" y1="200" x2="170" y2="200" stroke="#6B7280" stroke-width="6" stroke-linecap="round"/>
        <circle cx="40" cy="200" r="10" fill="#4B5563"/><circle cx="170" cy="200" r="10" fill="#4B5563"/>
        <text x="100" y="250" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="11">背部中立位</text>` },
      { label:{zh:'直立：充分伸髋锁定',en:'Lockout: full hip extension',ru:'Стоп: полное разгибание таза',kk:'Жамбасты толық жайыңыз'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <line x1="10" y1="220" x2="190" y2="220" stroke="#2A2520" stroke-width="4"/>
        <circle cx="100" cy="60" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="78" x2="100" y2="148" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="72" y1="92" x2="128" y2="92" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="92" x2="54" y2="120" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="128" y1="92" x2="146" y2="120" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="86" y1="148" x2="80" y2="190" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="148" x2="120" y2="190" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="80" y1="190" x2="76" y2="218" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="120" y1="190" x2="124" y2="218" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <!-- bar at thighs -->
        <line x1="54" y1="120" x2="190" y2="120" stroke="#6B7280" stroke-width="6" stroke-linecap="round"/>
        <circle cx="54" cy="120" r="10" fill="#4B5563"/><circle cx="178" cy="120" r="10" fill="#4B5563"/>
        <text x="100" y="255" text-anchor="middle" fill="#C9A96E" font-size="11">锁定 充分伸髋</text>` },
    ]},

  121: { // 侧平举
    bg:'#0E0C0A', steps:[
      { label:{zh:'起始：哑铃自然垂落',en:'Start: dumbbells at sides',ru:'Начало: гантели по бокам',kk:'Бастапқы: гантельдер бүйірде'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <circle cx="100" cy="54" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="72" x2="100" y2="148" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="72" y1="86" x2="128" y2="86" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="86" x2="58" y2="118" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="58" y1="118" x2="50" y2="140" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="86" x2="142" y2="118" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="142" y1="118" x2="150" y2="140" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="148" x2="80" y2="198" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="148" x2="120" y2="198" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <rect x="44" y="138" width="12" height="6" rx="2" fill="#6B7280"/>
        <rect x="144" y="138" width="12" height="6" rx="2" fill="#6B7280"/>
        <text x="100" y="255" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="11">自然垂落</text>` },
      { label:{zh:'举起：至肩膀水平',en:'Raise: to shoulder level',ru:'Поднимайте до уровня плеч',kk:'Иық деңгейіне дейін'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <circle cx="100" cy="54" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="72" x2="100" y2="148" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="72" y1="86" x2="128" y2="86" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="86" x2="34" y2="88" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="34" y1="88" x2="16" y2="88" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="86" x2="166" y2="88" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="166" y1="88" x2="184" y2="88" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="148" x2="80" y2="198" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="148" x2="120" y2="198" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <rect x="8" y="84" width="12" height="6" rx="2" fill="#6B7280"/>
        <rect x="180" y="84" width="12" height="6" rx="2" fill="#6B7280"/>
        <text x="34" y="78" fill="#C9A96E" font-size="12">←</text>
        <text x="156" y="78" fill="#C9A96E" font-size="12">→</text>
        <text x="100" y="255" text-anchor="middle" fill="#C9A96E" font-size="11">↔ 肩膀水平</text>` },
    ]},

  130: { // 深蹲
    bg:'#0E0C0A', steps:[
      { label:{zh:'起始：杠铃置于斜方肌',en:'Start: bar on traps, feet shoulder-width',ru:'Старт: гриф на трапеции',kk:'Бастапқы: штанга трапеция бұлшықетінде'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <circle cx="100" cy="48" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="66" x2="100" y2="148" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="60" y1="80" x2="140" y2="80" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="60" y1="80" x2="46" y2="108" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="140" y1="80" x2="154" y2="108" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="86" y1="148" x2="80" y2="200" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="148" x2="120" y2="200" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="80" y1="200" x2="72" y2="230" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="120" y1="200" x2="128" y2="230" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="30" y1="74" x2="170" y2="74" stroke="#6B7280" stroke-width="5"/>
        <circle cx="30" cy="74" r="8" fill="#4B5563"/><circle cx="170" cy="74" r="8" fill="#4B5563"/>
        <text x="100" y="255" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="11">脚与肩同宽</text>` },
      { label:{zh:'下蹲：至大腿平行地面',en:'Squat: thighs parallel to floor',ru:'Приседайте: бёдра параллельно полу',kk:'Отырыңыз: жамбас жермен параллель'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <circle cx="88" cy="66" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="88" y1="84" x2="110" y2="130" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="56" y1="92" x2="136" y2="92" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="56" y1="92" x2="38" y2="112" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="136" y1="92" x2="154" y2="112" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="96" y1="130" x2="70" y2="165" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="124" y1="130" x2="148" y2="165" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="70" y1="165" x2="58" y2="200" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="148" y1="165" x2="158" y2="200" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="22" y1="88" x2="162" y2="88" stroke="#6B7280" stroke-width="5"/>
        <circle cx="22" cy="88" r="8" fill="#4B5563"/><circle cx="162" cy="88" r="8" fill="#4B5563"/>
        <!-- parallel indicator -->
        <line x1="54" y1="148" x2="180" y2="148" stroke="#C9A96E" stroke-width="1" stroke-dasharray="5,4" opacity="0.5"/>
        <text x="100" y="255" text-anchor="middle" fill="#C9A96E" font-size="11">大腿平行地面</text>` },
      { label:{zh:'起身：蹬地推起',en:'Stand: drive through heels',ru:'Встаньте: толкайте пятками',kk:'Тұрыңыз: өкшемен итеріңіз'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <circle cx="100" cy="48" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="66" x2="100" y2="148" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="60" y1="80" x2="140" y2="80" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="60" y1="80" x2="46" y2="108" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="140" y1="80" x2="154" y2="108" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="86" y1="148" x2="80" y2="200" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="148" x2="120" y2="200" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="80" y1="200" x2="72" y2="228" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="120" y1="200" x2="128" y2="228" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="30" y1="74" x2="170" y2="74" stroke="#6B7280" stroke-width="5"/>
        <circle cx="30" cy="74" r="8" fill="#4B5563"/><circle cx="170" cy="74" r="8" fill="#4B5563"/>
        <text x="72" y="220" fill="#C9A96E" font-size="14">↑</text>
        <text x="114" y="220" fill="#C9A96E" font-size="14">↑</text>
        <text x="100" y="255" text-anchor="middle" fill="#C9A96E" font-size="11">蹬地起身</text>` },
    ]},

  140: { // 哑铃弯举
    bg:'#0E0C0A', steps:[
      { label:{zh:'下放：手臂伸直',en:'Bottom: arms fully extended',ru:'Внизу: руки полностью выпрямлены',kk:'Төменде: қолдар толық жайылған'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <circle cx="100" cy="54" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="72" x2="100" y2="148" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="72" y1="86" x2="128" y2="86" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="86" x2="62" y2="128" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="62" y1="128" x2="56" y2="162" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="86" x2="138" y2="128" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="138" y1="128" x2="144" y2="162" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="148" x2="80" y2="200" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="148" x2="120" y2="200" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <rect x="48" y="158" width="14" height="7" rx="3" fill="#6B7280"/>
        <rect x="138" y="158" width="14" height="7" rx="3" fill="#6B7280"/>
        <text x="100" y="255" text-anchor="middle" fill="rgba(201,169,110,0.5)" font-size="11">手臂伸直</text>` },
      { label:{zh:'弯举：旋腕至顶',en:'Curl: supinate at top',ru:'Сгибайте: пронируйте вверху',kk:'Иіңіз: жоғарыда айналдырыңыз'},
        svg:`<rect width="200" height="280" rx="16" fill="#0E0C0A"/>
        <circle cx="100" cy="54" r="18" fill="#FBBF7C" stroke="#C9A96E" stroke-width="2"/>
        <line x1="100" y1="72" x2="100" y2="148" stroke="#C9A96E" stroke-width="7" stroke-linecap="round"/>
        <line x1="72" y1="86" x2="128" y2="86" stroke="#C9A96E" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="86" x2="54" y2="108" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="54" y1="108" x2="44" y2="84" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="128" y1="86" x2="146" y2="108" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="146" y1="108" x2="156" y2="84" stroke="#A07840" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="148" x2="80" y2="200" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <line x1="114" y1="148" x2="120" y2="200" stroke="#A07840" stroke-width="6" stroke-linecap="round"/>
        <rect x="36" y="78" width="14" height="7" rx="3" fill="#6B7280"/>
        <rect x="150" y="78" width="14" height="7" rx="3" fill="#6B7280"/>
        <text x="100" y="255" text-anchor="middle" fill="#C9A96E" font-size="11">↑ 顶端夹紧</text>` },
    ]},
};

// Animations are now defined directly in animations.js
