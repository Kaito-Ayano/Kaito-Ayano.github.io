/* data.js — Huawei 2015–2025 annual report dataset (RMB million, IFRS)
   Author: Лю Цзицзянь (Kaito Ayano) */
var YRS=['FY2015','FY2016','FY2017','FY2018','FY2019','FY2020','FY2021','FY2022','FY2023','FY2024','FY2025'];

var D={
 fin:{
  revenue:[395009,521574,603621,721202,858833,891368,636807,642338,704174,862072,880941],
  gross_profit:[164697,210129,238142,278171,322689,327132,307442,281925,325364,382571,408298],
  operating_profit:[45786,47515,56384,73287,77835,72501,121412,42216,104401,79361,96937],
  profit_before_tax:[41987,44058,56128,73646,78023,72304,121945,43946,97596,70869,81401],
  income_tax:[-5077,-7006,-8673,-14301,-15367,-7655,-8227,-8384,-10646,-8295,-13365],
  profit_for_year:[36910,37052,47455,59345,62656,64649,113718,35562,86950,62574,68036],
  operating_margin:[11.6,9.1,9.3,10.2,9.1,8.1,19.1,6.6,14.8,9.2,11.0],
  total_assets:[372155,443634,505225,665792,858661,876854,982971,1063804,1263597,1290149,1334930],
  total_liabilities:[253086,303501,329609,432727,563124,546446,568319,626728,756029,745530,734810],
  total_equity:[119069,140133,175616,233065,295537,330408,414652,437076,507568,544619,600120],
  net_cash_operating:[49315,49218,96336,74659,91384,35218,59670,17797,69807,88417,127384],
  net_cash_investing:[2244,-28524,-24657,-93880,-145001,-30793,-100575,6270,-98759,-49757,-74794],
  net_cash_financing:[-19763,-10851,-16936,26926,37744,1653,871,-8622,73193,-83917,-49235],
  cash_ending:[110561,123047,175347,184106,171070,173050,128395,147269,192903,146265,150364],
  rd_expense:[59607,76391,89690,101509,131659,141893,142666,161494,164721,179687,192310],
  rd_ratio:[15.1,14.6,14.9,14.1,15.3,15.9,22.4,25.1,23.4,20.8,21.8],
  ppe_additions:[13896,22260,17368,30526,41118,47917,34284,35668,47006,52476,46386],
  intangible_additions:[813,2924,1888,4668,3725,4667,1645,1620,2246,1859,2405]
 },
 oldseg:{
  carrier:[232307,290561,297838,294012,296689,302621,281469,null,null,null,null],
  enterprise:[27609,40666,54948,74409,89710,100339,102444,null,null,null,null],
  consumer:[129128,179808,237249,348852,467304,482916,243431,null,null,null,null]
 },
 newseg:{
  ict:[null,null,null,null,null,null,null,353978,361997,369903,375014],
  terminal:[null,null,null,null,null,null,null,214463,251496,339006,344473],
  cloud:[null,null,null,null,null,null,null,45342,55287,38523,32161],
  dp:[null,null,null,null,null,null,null,50806,52607,68678,77312],
  auto:[null,null,null,null,null,null,null,2077,4737,26353,45018],
  others:[null,null,null,null,null,null,null,3978,8624,19609,6963]
 },
 regions:{
  china:[167690,236512,305092,372162,506733,584910,413299,403999,471303,615264,616249],
  emea:[128016,156509,163854,204536,206007,180849,131467,149206,145343,148355,161356],
  apac:[50527,67500,74427,81918,70533,64369,53675,48048,41041,43306,50113],
  americas:[38976,44082,39285,47885,52478,39638,29225,31898,35362,36301,37184],
  other:[9800,16971,20963,14701,23082,21602,9141,9187,11125,18846,16039]
 },
 nonfin:{
  employees:[170000,180000,180000,188000,194000,197000,195000,207000,207000,208000,213000],
  rdhead:[79000,80000,80000,80000,96000,105000,107000,114000,114000,113000,114000],
  rdratio:[45,45,45,45,49,53.4,54.8,55.4,55,54.1,53.7],
  patents:[50377,62519,74307,87805,85000,100000,110000,120000,140000,150000,165000],
  shareplan:[79563,81144,80818,96768,104572,121269,131507,142315,151796,161749,169054],
  ren:[1.4,1.4,1.4,1.14,1.04,0.90,0.84,0.73,0.73,0.65,0.59],
  training:[null,null,null,null,null,null,47,66,63,65.5,null]
 },
 esg:{
  protect:[9240,11200,12000,13500,13900,11900,15000,17000,18600,null,20990],
  co2:[null,null,null,null,null,null,null,3.4,4.95,7.1,10.6],
  esaved:[null,null,null,null,null,null,null,195,461,818,1500],
  gpower:[null,null,null,null,null,null,null,6951,9979,14113,20000],
  eff:[null,null,null,null,null,null,null,null,2.6,3.0,3.4],
  recycled:[null,null,null,null,null,null,null,600000,780000,1000000,null],
  ict:[null,null,null,null,null,null,null,null,null,1300000,1800000],
  t4all:[null,null,null,null,null,null,null,600,630,null,1790],
  seed:[null,null,null,null,null,null,null,null,3400000,null,null]
 },
 other:{
  usdrate:[6.4927,6.9448,6.5222,6.8561,6.984,6.5198,6.3753,6.9533,7.0808,7.2957,6.9906],
  usdrevenue:[60839,75103,92549,105191,122972,136717,99887,92379,99448,118162,126018],
  usd_op:[7052,6842,8645,10689,11145,11120,19044,6071,14744,10878,13867],
  usd_pft:[5685,5335,7276,8656,8971,9916,17837,5114,12280,8577,9732],
  usd_cfo:[7595,7087,14770,10889,13085,5402,9360,2560,9859,12119,18222],
  usd_cash:[19284,20973,30656,38777,53127,54812,65304,53709,67128,51021,51702],
  usd_assets:[57319,63880,77462,97109,122947,134491,154184,152993,178454,176837,190961],
  usd_borrow:[4464,6451,6121,10201,16060,21751,27465,28353,43556,36305,34229],
  usd_equity:[18339,20178,26926,33994,42316,50678,65040,62859,71682,74649,85847]
 },
 events:[
  {y:'2016',cn:'2015 年现金流量表追溯重述：经营活动现金流 49,315→52,300；投资活动净额 2,244→(741)。',ru:'Пересчёт отчёта о движении денежных средств за 2015 г.: ODC 49 315→52 300.',en:'FY2015 cash flow restated (CFO 49,315→52,300; CFI 2,244→(741)).'},
  {y:'2018',cn:'首次采用 IFRS 15 收入准则与 IFRS 9 金融工具准则（累计影响法，比较数未重述）。',ru:'Первое применение МСФО 15 (выручка) и МСФО 9 (финансовые инструменты).',en:'First-time adoption of IFRS 15 Revenue and IFRS 9 Financial Instruments (cumulative catch-up).'},
  {y:'2019',cn:'首次采用 IFRS 16 租赁准则（修订追溯法，比较数未重述）。',ru:'Первое применение МСФО 16 (аренда).',en:'First-time adoption of IFRS 16 Leases (modified retrospective).'},
  {y:'2021',cn:'出售荣耀业务，确认处置净收益 57,431 百万元（计入其他业务收支净额）。',ru:'Продажа бизнеса Honor; прибыль от выбытия 57 431 млн.',en:'Honour business divested; net gain on disposal of RMB 57,431m.'},
  {y:'2022',cn:'业务分部由三个重组为五个可报告分部（ICT基础设施/终端/云计算/数字能源/智能汽车）。',ru:'Сегменты реорганизованы с трёх до пяти (ICT, терминалы, облако, цифровая энергетика, авто).',en:'Reportable segments reorganised from three to five.'},
  {y:'2024',cn:'调整经营分部管理及集团内资源结算规则，比较数已按相同基础调整。',ru:'Изменены правила сегментного управления и расчётов внутри группы.',en:'Segment management and inter-segment settlement rules changed; comparatives restated.'},
  {y:'2025',cn:'重分类部分产品经营分部；采用 IAS 21；处置智能汽车子公司各 10% 股权，对价 2,500 百万元。',ru:'Реклассификация сегментов; принят МСФО 21; продано по 10% дочерних авто-компаний.',en:'Segment reclassification; IAS 21 adopted; 10% equity of each automotive subsidiary disposed for RMB 2,500m.'}
 ],
 esgNa:[
  ['Scope 1 GHG emissions / Выбросы Scope 1 / 范围一温室气体排放','2015–2025','Absolute emissions are published in the standalone Sustainability Report, not the Annual Report. / Абсолютные выбросы — в отдельном отчёте об устойчивом развитии.'],
  ['Scope 2 GHG emissions / Выбросы Scope 2 / 范围二温室气体排放','2015–2025','As above. / Аналогично.'],
  ['Total energy consumption / Общее энергопотребление / 能源消耗总量','2015–2025','As above. / Аналогично.'],
  ['Water withdrawal / Водозабор / 取水量','2015–2025','As above. / Аналогично.'],
  ['Total waste / Общие отходы / 废弃物总量','2015–2025','As above. / Аналогично.'],
  ['Female employees ratio / Доля женщин / 女性员工占比','2015–2025','Not disclosed in the Annual Report. / Не раскрывается.'],
  ['Workplace fatalities / Несчастные случаи со смертельным исходом / 工伤死亡人数','2015–2025','Not disclosed. / Не раскрывается.'],
  ['Total training hours / Общие часы обучения / 培训总学时','2015–2025','Only per-employee hours disclosed in selected years. /only per-employee hours in selected years.'],
  ['Total dividends distributed / Дивиденды / 分配股利总额','2015–2025','No dividends line in the condensed cash flow statement; amount not disclosed. / Нет строки дивидендов; сумма не раскрыта.']
 ]
};

/* ======= derived ratios ======= */
function arr(f){return YRS.map(function(_,i){var v=f(i);return v==null?null:Math.round(v*100)/100;});}
var grossMargin=arr(function(i){return D.fin.gross_profit[i]/D.fin.revenue[i]*100;});
var netMargin=arr(function(i){return D.fin.profit_for_year[i]/D.fin.revenue[i]*100;});
var etr=arr(function(i){return -D.fin.income_tax[i]/D.fin.profit_before_tax[i]*100;});
var capex=arr(function(i){return D.fin.ppe_additions[i]+D.fin.intangible_additions[i];});
var capexRatio=arr(function(i){return capex[i]/D.fin.revenue[i]*100;});
var roe=arr(function(i){return D.fin.profit_for_year[i]/D.fin.total_equity[i]*100;});
var roa=arr(function(i){return D.fin.profit_for_year[i]/D.fin.total_assets[i]*100;});
var unionShare=arr(function(i){return +(100-D.nonfin.ren[i]).toFixed(2);});

/* ======= ratio_expected.json inlined (%, percentage numbers) ======= */
var R={
 gross:[41.7,40.3,39.5,38.6,37.6,36.7,48.3,43.9,46.2,44.4,46.3],
 op:[11.6,9.1,9.3,10.2,9.1,8.1,19.1,6.6,14.8,9.2,11.0],
 net:[9.3,7.1,7.9,8.2,7.3,7.3,17.9,5.5,12.3,7.3,7.7],
 roeEnd:[31.0,26.4,27.0,25.5,21.2,19.6,27.4,8.1,17.1,11.5,11.3],
 roeAvg:[31.0,28.6,30.1,29.0,23.7,20.7,30.5,8.4,18.4,11.9,11.9],
 roa:[9.9,8.4,9.4,8.9,7.3,7.4,11.6,3.3,6.9,4.9,5.1],
 roic:[30.9,25.7,26.2,24.2,19.1,15.4,20.6,6.7,12.8,9.8,11.5],
 current:[1.42,1.49,1.51,1.48,1.58,1.76,1.96,1.80,1.93,1.64,1.61],
 quick:[1.13,1.18,1.24,1.21,1.20,1.33,1.55,1.42,1.59,1.28,1.22],
 debtRatio:[68.0,68.4,65.2,65.0,65.6,62.3,57.8,58.9,59.8,57.8,55.0],
 gearing:[19.6,24.2,18.5,23.1,27.5,30.0,29.7,31.1,37.8,32.7,28.5],
 de:[2.13,2.17,1.88,1.86,1.91,1.65,1.37,1.43,1.49,1.37,1.22],
 cfoNi:[133.6,132.8,203.0,125.8,145.9,54.5,52.5,50.0,80.3,141.3,187.2],
 cfoRev:[12.5,9.4,16.0,10.4,10.6,4.0,9.4,2.8,9.9,10.3,14.5],
 fcf:[34606,24034,77080,39465,46541,-17366,23741,-19491,20555,34082,78593],
 fcfMargin:[8.8,4.6,12.8,5.5,5.4,-1.9,3.7,-3.0,2.9,4.0,8.9],
 revPerEmp:[232.4,289.8,335.3,383.6,442.7,452.5,326.6,310.3,340.2,414.5,413.6],
 niPerEmp:[21.7,20.6,26.4,31.6,32.3,32.8,58.3,17.2,42.0,30.1,31.9]
};
var patentsPerRd=arr(function(i){return D.nonfin.patents[i]/D.nonfin.rdhead[i];});
