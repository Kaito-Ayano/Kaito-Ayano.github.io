const EXERCISE_DB = [
  // ── 颈椎修复 / Neck & Spine ──
  { id:1, cat:'neck', emoji:'🐱', nameZh:'猫牛式颈椎拉伸', nameEn:'Cat-Cow Neck Stretch', nameRu:'Растяжка шеи кошка-корова', nameKk:'Мысық-сиыр мойын созылуы', duration:5, level:'easy', groups:['office','general','student'], tipZh:'缓慢前后摆动，感受颈椎延展', tipEn:'Slowly move head forward and back', tipRu:'Медленно двигайте головой вперёд-назад', tipKk:'Басты баяу алға-артқа жылжытыңыз' },
  { id:2, cat:'neck', emoji:'🙆', nameZh:'肩颈耸肩放松', nameEn:'Shoulder Shrug Release', nameRu:'Поднятие плеч для расслабления', nameKk:'Иық көтеру релаксациясы', duration:3, level:'easy', groups:['office','elderly','general'], tipZh:'肩膀向上耸起保持2秒，缓慢放下', tipEn:'Shrug up for 2s, slowly release', tipRu:'Поднимите плечи на 2с, медленно опустите', tipKk:'Иықты 2 секунд көтеріп, баяу түсіріңіз' },
  { id:3, cat:'neck', emoji:'🔄', nameZh:'胸椎旋转拉伸', nameEn:'Thoracic Rotation', nameRu:'Ротация грудного отдела', nameKk:'Кеуде омыртқасын айналдыру', duration:5, level:'easy', groups:['office','general','rehab'], tipZh:'双臂展开，感受胸椎扭转拉伸', tipEn:'Arms open, feel the thoracic twist', tipRu:'Раскройте руки, почувствуйте скручивание', tipKk:'Қолдарды ашып, бұралуды сезініңіз' },
  { id:4, cat:'neck', emoji:'💆', nameZh:'颈部侧屈拉伸', nameEn:'Lateral Neck Stretch', nameRu:'Боковое сгибание шеи', nameKk:'Мойынды бүйірге созу', duration:4, level:'easy', groups:['office','elderly','student','general'], tipZh:'头慢慢倒向一侧，保持15秒', tipEn:'Tilt head to side, hold 15s', tipRu:'Наклоните голову в сторону, держите 15с', tipKk:'Басты бүйірге еңкейтіп, 15 секунд ұстаңыз' },
  { id:5, cat:'neck', emoji:'🧘', nameZh:'坐姿颈椎牵引', nameEn:'Seated Cervical Traction', nameRu:'Шейное вытяжение сидя', nameKk:'Отырып мойын созу', duration:8, level:'easy', groups:['office','rehab','disabled'], tipZh:'双手交叉托住后脑，轻轻向上牵引', tipEn:'Hands behind head, gently lift', tipRu:'Руки за головой, мягко тяните вверх', tipKk:'Қолдарды желкеге қойып, жоғары тартыңыз' },

  // ── 体态矫正 / Posture ──
  { id:10, cat:'posture', emoji:'🧍', nameZh:'驼背矫正训练', nameEn:'Rounded Shoulder Fix', nameRu:'Коррекция сутулости', nameKk:'Қисықтықты түзету', duration:10, level:'med', groups:['office','student','general'], tipZh:'激活背部肌群，对抗圆肩', tipEn:'Activate back muscles to counter rounding', tipRu:'Активируйте мышцы спины', tipKk:'Арқа бұлшықеттерін белсендіріңіз' },
  { id:11, cat:'posture', emoji:'🦴', nameZh:'骨盆前倾矫正', nameEn:'Anterior Pelvic Tilt Fix', nameRu:'Коррекция наклона таза', nameKk:'Жамбас алға ауытқуын түзету', duration:10, level:'med', groups:['office','general','rehab'], tipZh:'收紧核心，拉伸髂腰肌', tipEn:'Engage core, stretch hip flexors', tipRu:'Напрягите кор, растяните сгибатели бедра', tipKk:'Өзек бұлшықеттерін тартып, жамбас созыңыз' },
  { id:12, cat:'posture', emoji:'⚖️', nameZh:'高低肩矫正', nameEn:'Shoulder Imbalance Fix', nameRu:'Коррекция разных плеч', nameKk:'Иық теңсіздігін түзету', duration:8, level:'med', groups:['general','rehab'], tipZh:'单侧斜方肌拉伸+对侧激活', tipEn:'Stretch one side, activate the other', tipRu:'Растяните одну сторону, активируйте другую', tipKk:'Бір жақты созып, екінші жақты белсендіріңіз' },
  { id:13, cat:'posture', emoji:'🦶', nameZh:'足弓激活训练', nameEn:'Arch Activation', nameRu:'Активация свода стопы', nameKk:'Табан доғасын белсендіру', duration:6, level:'easy', groups:['elderly','general','rehab'], tipZh:'脚趾抓地，感受足弓激活', tipEn:'Grip floor with toes, feel arch lift', tipRu:'Захватите пол пальцами, ощутите подъём', tipKk:'Саусақтарыңызбен еденді ұстаңыз' },

  // ── 懒人减脂 / Fat Burn ──
  { id:20, cat:'slim', emoji:'🔥', nameZh:'卧室HIIT减脂', nameEn:'Bedroom HIIT', nameRu:'ВИИТ в спальне', nameKk:'Жатын бөлмедегі ВИИТ', duration:15, level:'med', groups:['general','student'], tipZh:'15分钟高效燃脂，无需器械', tipEn:'15-min efficient fat burn, no equipment', tipRu:'15 минут жиросжигания без инвентаря', tipKk:'15 минуттық майды жағу, жабдықсыз' },
  { id:21, cat:'slim', emoji:'🚶', nameZh:'原地踏步减脂', nameEn:'March in Place', nameRu:'Ходьба на месте', nameKk:'Орнында жүру', duration:10, level:'easy', groups:['elderly','pregnant','disabled','general'], tipZh:'适合所有人的低冲击有氧', tipEn:'Low-impact cardio for everyone', tipRu:'Кардио с низкой нагрузкой для всех', tipKk:'Барлыққа арналған аз соқпалы кардио' },
  { id:22, cat:'slim', emoji:'💃', nameZh:'椅上有氧操', nameEn:'Chair Aerobics', nameRu:'Аэробика на стуле', nameKk:'Орындықтағы аэробика', duration:12, level:'easy', groups:['elderly','disabled','office','rehab'], tipZh:'坐在椅子上完成，安全有效', tipEn:'Done seated, safe and effective', tipRu:'Выполняется сидя, безопасно и эффективно', tipKk:'Отырып орындалады, қауіпсіз және тиімді' },
  { id:23, cat:'slim', emoji:'🏊', nameZh:'站立游泳操', nameEn:'Standing Swim Moves', nameRu:'Стоячие плавательные движения', nameKk:'Тұрып жүзу қозғалыстары', duration:8, level:'easy', groups:['pregnant','elderly','general'], tipZh:'模拟游泳动作，低冲击全身运动', tipEn:'Simulate swimming, full-body low-impact', tipRu:'Имитация плавания, всё тело', tipKk:'Жүзуді еліктеу, барлық дене' },

  // ── 情绪解压 / Stress Relief ──
  { id:30, cat:'relax', emoji:'💨', nameZh:'腹式呼吸放松', nameEn:'Diaphragmatic Breathing', nameRu:'Диафрагмальное дыхание', nameKk:'Диафрагмалық тыныс алу', duration:8, level:'easy', groups:['general','office','student','pregnant','elderly','disabled'], tipZh:'鼻吸4秒，屏息2秒，口呼6秒', tipEn:'In 4s, hold 2s, out 6s', tipRu:'Вдох 4с, задержка 2с, выдох 6с', tipKk:'Дем алу 4с, ұстау 2с, шығару 6с' },
  { id:31, cat:'relax', emoji:'🌙', nameZh:'睡前助眠序列', nameEn:'Bedtime Wind-Down', nameRu:'Расслабление перед сном', nameKk:'Ұйқы алдындағы релаксация', duration:10, level:'easy', groups:['general','office','student','elderly'], tipZh:'降低皮质醇，促进褪黑素分泌', tipEn:'Lower cortisol, promote melatonin', tipRu:'Снизьте кортизол, стимулируйте мелатонин', tipKk:'Кортизолды азайтып, мелатонинді ынталандырыңыз' },
  { id:32, cat:'relax', emoji:'🧠', nameZh:'正念冥想引导', nameEn:'Mindfulness Meditation', nameRu:'Медитация осознанности', nameKk:'Зейін медитациясы', duration:10, level:'easy', groups:['general','student','office','pregnant'], tipZh:'专注当下，释放焦虑', tipEn:'Focus on the present, release anxiety', tipRu:'Сосредоточьтесь на настоящем', tipKk:'Қазіргі сәтке назар аударыңыз' },

  // ── 老年人健康 / Senior Health ──
  { id:40, cat:'elderly', emoji:'👴', nameZh:'平衡训练防跌倒', nameEn:'Balance & Fall Prevention', nameRu:'Тренировка баланса', nameKk:'Тепе-теңдік жаттығуы', duration:10, level:'easy', groups:['elderly'], tipZh:'单腿站立，提升本体感觉', tipEn:'Single-leg stance, improve proprioception', tipRu:'Стояние на одной ноге', tipKk:'Бір аяқта тұру, дене сезімін жақсарту' },
  { id:41, cat:'elderly', emoji:'🦷', nameZh:'关节温和活动', nameEn:'Gentle Joint Mobility', nameRu:'Мягкая суставная гимнастика', nameKk:'Буындарды жұмсақ жаттықтыру', duration:12, level:'easy', groups:['elderly','rehab'], tipZh:'缓慢画圈，润滑关节软骨', tipEn:'Slow circles, lubricate joint cartilage', tipRu:'Медленные круги, смазывают хрящи', tipKk:'Баяу шеңберлер, буын шеміршектерін майлайды' },
  { id:42, cat:'elderly', emoji:'💪', nameZh:'坐式力量训练', nameEn:'Seated Strength', nameRu:'Силовые упражнения сидя', nameKk:'Отырып күш жаттығуы', duration:15, level:'easy', groups:['elderly','disabled'], tipZh:'抵抗肌肉萎缩，维持日常功能', tipEn:'Resist muscle loss, maintain daily function', tipRu:'Противостоять атрофии мышц', tipKk:'Бұлшықет атрофиясына қарсы тұру' },
  { id:43, cat:'elderly', emoji:'🌿', nameZh:'太极基础动作', nameEn:'Basic Tai Chi Moves', nameRu:'Базовые движения тайцзи', nameKk:'Тайцзи негізгі қозғалыстары', duration:15, level:'easy', groups:['elderly'], tipZh:'流畅缓慢，改善气血循环', tipEn:'Smooth and slow, improve circulation', tipRu:'Плавно и медленно, улучшает кровообращение', tipKk:'Жылдам және баяу, қан айналымын жақсарту' },
  { id:44, cat:'elderly', emoji:'🫀', nameZh:'低强度有氧步行操', nameEn:'Low-Intensity Walk Exercise', nameRu:'Ходьба с упражнениями', nameKk:'Аз қарқынды жаяу жүру жаттығуы', duration:20, level:'easy', groups:['elderly','general'], tipZh:'室内原地模拟走路，心肺健康', tipEn:'Indoor walk simulation, heart health', tipRu:'Имитация ходьбы в помещении', tipKk:'Үйде жаяу жүруді еліктеу' },

  // ── 孕期运动 / Prenatal ──
  { id:50, cat:'pregnant', emoji:'🤰', nameZh:'孕期骨盆底肌训练', nameEn:'Prenatal Kegel Exercises', nameRu:'Упражнения Кегеля при беременности', nameKk:'Жүктілік кезіндегі Кегель жаттығулары', duration:8, level:'easy', groups:['pregnant'], tipZh:'增强骨盆底，预防产后漏尿', tipEn:'Strengthen pelvic floor, prevent incontinence', tipRu:'Укрепите тазовое дно', tipKk:'Жамбас түбін нығайтыңыз' },
  { id:51, cat:'pregnant', emoji:'🧘', nameZh:'孕期瑜伽拉伸', nameEn:'Prenatal Yoga Stretches', nameRu:'Пренатальная йога', nameKk:'Жүктілік йогасы', duration:15, level:'easy', groups:['pregnant'], tipZh:'缓解孕期腰背痛，促进心情舒缓', tipEn:'Relieve back pain, improve mood', tipRu:'Снимите боль в спине, улучшите настроение', tipKk:'Арқа ауруын жойып, көңілді жақсартыңыз' },
  { id:52, cat:'pregnant', emoji:'💆', nameZh:'孕期呼吸与放松', nameEn:'Prenatal Breathing & Relaxation', nameRu:'Дыхание и расслабление при беременности', nameKk:'Жүктілік тынысы мен релаксациясы', duration:10, level:'easy', groups:['pregnant'], tipZh:'分娩准备呼吸法，缓解孕期焦虑', tipEn:'Birth prep breathing, reduce anxiety', tipRu:'Дыхание для родов, снижает тревогу', tipKk:'Туу үшін тыныс алу, алаңдаушылықты азайту' },
  { id:53, cat:'pregnant', emoji:'🚶', nameZh:'孕期散步+手臂操', nameEn:'Prenatal Walk & Arm Workout', nameRu:'Ходьба и упражнения для рук при беременности', nameKk:'Жүктілік кезінде жаяу жүру + қол жаттығуы', duration:20, level:'easy', groups:['pregnant'], tipZh:'保持体重，改善下肢水肿', tipEn:'Control weight, reduce leg swelling', tipRu:'Контроль веса, уменьшение отёков', tipKk:'Салмақты бақылау, ісінуді азайту' },

  // ── 无障碍运动 / Adaptive Fitness ──
  { id:60, cat:'disabled', emoji:'♿', nameZh:'轮椅上肢力量', nameEn:'Wheelchair Upper Body Strength', nameRu:'Сила верхней части тела в кресле', nameKk:'Арбадан жоғарғы дене күші', duration:12, level:'med', groups:['disabled'], tipZh:'增强轮椅使用者上肢力量', tipEn:'Strengthen arms for wheelchair users', tipRu:'Укрепите руки для пользователей кресел', tipKk:'Арба пайдаланушылардың қол күшін нығайту' },
  { id:61, cat:'disabled', emoji:'🙌', nameZh:'坐姿核心稳定', nameEn:'Seated Core Stability', nameRu:'Устойчивость кора сидя', nameKk:'Отырып өзек тұрақтылығы', duration:10, level:'easy', groups:['disabled','elderly','rehab'], tipZh:'不依赖双腿，有效锻炼核心肌群', tipEn:'Core workout without using legs', tipRu:'Кор без использования ног', tipKk:'Аяқтарсыз өзек жаттығуы' },
  { id:62, cat:'disabled', emoji:'🦾', nameZh:'单侧肢体代偿训练', nameEn:'Unilateral Compensation Training', nameRu:'Тренировка с компенсацией', nameKk:'Бір жақты өтемақы жаттығуы', duration:15, level:'med', groups:['disabled','rehab'], tipZh:'针对单侧肢体障碍设计', tipEn:'Designed for one-sided limb differences', tipRu:'Разработан для односторонних нарушений', tipKk:'Бір жақты мүшелер айырмашылықтарына арналған' },
  { id:63, cat:'disabled', emoji:'👁️', nameZh:'视障友好听觉引导', nameEn:'Audio-Guided for Visual Impairment', nameRu:'Аудиоруководство для слабовидящих', nameKk:'Нашар көрушілерге арналған аудио нұсқаулық', duration:10, level:'easy', groups:['disabled'], tipZh:'纯语音引导，无需观看屏幕', tipEn:'Voice-only guidance, no screen needed', tipRu:'Только голосовое руководство', tipKk:'Тек дауысты нұсқаулық, экрансыз' },
  { id:64, cat:'disabled', emoji:'🦻', nameZh:'听障手语节奏操', nameEn:'Deaf-Friendly Rhythm Exercise', nameRu:'Ритмика для слабослышащих', nameKk:'Нашар еститіндерге арналған ырғақ жаттығуы', duration:12, level:'easy', groups:['disabled'], tipZh:'视觉节奏引导，无需听觉', tipEn:'Visual rhythm, no hearing required', tipRu:'Визуальный ритм, не нужен слух', tipKk:'Визуалды ырғақ, есту қажет емес' },

  // ── 职业病康复 / Occupational Rehab ──
  { id:70, cat:'rehab', emoji:'💻', nameZh:'程序员手腕腱鞘炎康复', nameEn:'Programmer Wrist Tendonitis Rehab', nameRu:'Реабилитация запястий программиста', nameKk:'Бағдарламашы білек сіне қабынуын қалпына келтіру', duration:8, level:'easy', groups:['office','rehab'], tipZh:'缓慢旋转腕关节，放松屈肌', tipEn:'Slowly rotate wrist, relax flexors', tipRu:'Медленно вращайте запястье', tipKk:'Білекті баяу айналдырыңыз' },
  { id:71, cat:'rehab', emoji:'🎻', nameZh:'音乐家手指放松', nameEn:'Musician Finger Relaxation', nameRu:'Расслабление пальцев для музыкантов', nameKk:'Музыканттарға арналған саусақ релаксациясы', duration:6, level:'easy', groups:['rehab','general'], tipZh:'预防腱鞘炎，拉伸屈伸肌群', tipEn:'Prevent tendonitis, stretch finger muscles', tipRu:'Профилактика тендинита', tipKk:'Тендинитті алдын алу' },
  { id:72, cat:'rehab', emoji:'🏗️', nameZh:'建筑工人腰背康复', nameEn:'Construction Worker Back Rehab', nameRu:'Реабилитация спины строителя', nameKk:'Құрылысшы арқасын қалпына келтіру', duration:15, level:'med', groups:['rehab'], tipZh:'强化腰背肌，预防腰椎间盘突出', tipEn:'Strengthen back, prevent disc herniation', tipRu:'Укрепите спину, предотвратите грыжу', tipKk:'Арқаны нығайтып, дискінің шығуын болдырмаңыз' },
  { id:73, cat:'rehab', emoji:'🍳', nameZh:'厨师肩颈职业病康复', nameEn:'Chef Shoulder & Neck Rehab', nameRu:'Реабилитация шеи повара', nameKk:'Аспазшы иық-мойын қалпына келтіру', duration:10, level:'easy', groups:['rehab'], tipZh:'缓解长时间站立导致的肩颈疲劳', tipEn:'Relieve neck fatigue from prolonged standing', tipRu:'Снимите усталость шеи от долгого стояния', tipKk:'Ұзақ тұрудан мойын шаршауын жою' },
  { id:74, cat:'rehab', emoji:'🚗', nameZh:'司机腰椎康复操', nameEn:'Driver Lower Back Rehab', nameRu:'Реабилитация поясницы водителя', nameKk:'Жүргізуші бел омыртқасын қалпына келтіру', duration:10, level:'easy', groups:['rehab','office'], tipZh:'缓解长途驾驶腰椎压力', tipEn:'Relieve lumbar pressure from driving', tipRu:'Снимите давление на поясницу от вождения', tipKk:'Жүргізуден бел қысымын жою' },
  { id:75, cat:'rehab', emoji:'📚', nameZh:'教师声带保护操', nameEn:'Teacher Vocal Cord Protection', nameRu:'Защита голосовых связок учителя', nameKk:'Мұғалім дауыс шымылдықтарын қорғау', duration:5, level:'easy', groups:['rehab','general'], tipZh:'放松喉部肌肉，保护声带', tipEn:'Relax throat muscles, protect vocal cords', tipRu:'Расслабьте горло, защитите голосовые связки', tipKk:'Тамақ бұлшықеттерін босатыңыз' },
  { id:76, cat:'rehab', emoji:'👀', nameZh:'电脑眼疲劳恢复', nameEn:'Eye Fatigue Recovery', nameRu:'Восстановление усталости глаз', nameKk:'Көз шаршауын қалпына келтіру', duration:5, level:'easy', groups:['office','student','rehab'], tipZh:'20-20-20法则，转移视线放松', tipEn:'20-20-20 rule, shift focus to relax', tipRu:'Правило 20-20-20, переведите взгляд', tipKk:'20-20-20 ережесі, көзді алыстатыңыз' },

  // ── 学生专区 / Student Zone ──
  { id:80, cat:'student', emoji:'📖', nameZh:'备考学生护眼操', nameEn:'Student Eye Care Routine', nameRu:'Гимнастика для глаз студента', nameKk:'Студент көзін қорғау жаттығуы', duration:5, level:'easy', groups:['student'], tipZh:'学习间隙眼部放松，预防近视加深', tipEn:'Eye break during study, prevent myopia', tipRu:'Перерыв для глаз, предотвратите близорукость', tipKk:'Оқу кезінде көз үзілісі' },
  { id:81, cat:'student', emoji:'🎒', nameZh:'书包背负姿势矫正', nameEn:'Backpack Posture Correction', nameRu:'Коррекция осанки с рюкзаком', nameKk:'Арқа сөмкесімен қалыпты түзету', duration:6, level:'easy', groups:['student'], tipZh:'纠正单肩背包导致的脊柱侧弯', tipEn:'Fix scoliosis from uneven bag carrying', tipRu:'Исправьте сколиоз от неравномерного ношения', tipKk:'Теңсіз сөмке алып жүруден сколиозды түзету' },
  { id:82, cat:'student', emoji:'🧠', nameZh:'专注力提升冥想', nameEn:'Focus Enhancement Meditation', nameRu:'Медитация для концентрации', nameKk:'Шоғырланды арттыру медитациясы', duration:8, level:'easy', groups:['student','general'], tipZh:'5分钟正念，提升学习效率', tipEn:'5-min mindfulness, boost study efficiency', tipRu:'5 минут осознанности, улучшите концентрацию', tipKk:'5 минут зейін, оқу тиімділігін арттыру' },
  { id:83, cat:'student', emoji:'💻', nameZh:'宿舍无器械减脂操', nameEn:'Dorm Room No-Equipment Workout', nameRu:'Тренировка в общежитии без инвентаря', nameKk:'Жатақханадағы жабдықсыз жаттығу', duration:12, level:'med', groups:['student'], tipZh:'小空间高效燃脂，不打扰室友', tipEn:'Small space fat burn, no noise for roommates', tipRu:'Эффективное сжигание в маленьком пространстве', tipKk:'Кіші кеңістікте тиімді май жағу' },
];

function getExerciseName(ex) {
  switch(currentLang) {
    case 'en': return ex.nameEn;
    case 'ru': return ex.nameRu;
    case 'kk': return ex.nameKk;
    default:   return ex.nameZh;
  }
}

function getExerciseTip(ex) {
  switch(currentLang) {
    case 'en': return ex.tipEn;
    case 'ru': return ex.tipRu;
    case 'kk': return ex.tipKk;
    default:   return ex.tipZh;
  }
}

function getLevelLabel(level) {
  const map = { easy: t('level_easy'), med: t('level_med'), hard: t('level_hard') };
  return map[level] || level;
}

function getGroupLabels(groups) {
  const map = {
    office: t('filter_office'), elderly: t('filter_elderly'), pregnant: t('filter_pregnant'),
    disabled: t('filter_disabled'), rehab: t('filter_rehab'), student: t('filter_student'), general: t('filter_general')
  };
  return groups.map(g => map[g] || g).join('、');
}
