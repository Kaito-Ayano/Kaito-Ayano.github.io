/* data.js — miHoYo / HoYoverse dataset 2014–2025. 
   Sources: miHoYo prospectus (CSRC), Shanghai Top 100 Enterprises, Guangming Daily
   National Cultural Top 30, 21st Century Business Herald / 36Kr estimates, Sensor Tower. */

var CO={
 name_cn:'米哈游', name_en:'miHoYo / HoYoverse',
 founded:'2012-02-13',
 founders:['蔡浩宇','刘伟','罗宇皓'],
 hq:'上海 Shanghai',
 ipo:'未上市 Unlisted (A-share filed 2017; withdrawn Sep 2020)',
 mission_cn:'技术宅拯救世界', mission_en:'Tech Otakus Save the World',
 offices:['Singapore','United States','Canada','Japan','Korea']
};

/* years 2014..2025 */
var YRS=['FY2014','FY2015','FY2016','FY2017','FY2018','FY2019','FY2020','FY2021','FY2022','FY2023','FY2024','FY2025'];
var YRNUMS=[2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];

/* RMB million; null = not disclosed (broken gap) */
var REVENUE=[103,175,424,null,null,null,10130,32854,27340,44100,34000,78000];
var NPROFIT=[65.6,127,273,null,null,null,null,18540,16145,null,null,null];
var NET_ASSETS={2022:37402};

/* Genshin Impact mobile revenue, USD million (Sensor Tower / media estimates) */
var G_YEARS=['FY2020','FY2021','FY2022','FY2023','FY2024','FY2025'];
var G_REV=[400,1200,1900,1300,700,330];
var G_NOTES=['Launched Sep (Q4 only)','Estimate range 1200–1800','Peak','','','Estimate range 320–345'];
var G_CUM_MOBILE_USD=9000; /* cumulative mobile > USD 9 bn */

/* headcount (selected years only) */
var EMP_YEARS=['FY2014','FY2016','FY2022','FY2025'];
var EMP_COUNT=[50,200,4000,5000];

var PRODUCTS=[
 {cn:'崩坏学园2',en:'Houkai Gakuen 2',launch:'2014-01',genre_cn:'2D射击',genre_en:'2D shooter',global:false},
 {cn:'崩坏3',en:'Honkai Impact 3rd',launch:'2016-10',genre_cn:'3D动作RPG',genre_en:'3D action RPG',global:true},
 {cn:'未定事件簿',en:'Tears of Themis',launch:'2020-07',genre_cn:'恋爱推理',genre_en:'romance / deduction',global:true},
 {cn:'原神',en:'Genshin Impact',launch:'2020-09-28',genre_cn:'开放世界ARPG',genre_en:'open-world ARPG',global:true},
 {cn:'崩坏：星穹铁道',en:'Honkai: Star Rail',launch:'2023-04-26',genre_cn:'回合制RPG',genre_en:'turn-based RPG',global:true},
 {cn:'绝区零',en:'Zenless Zone Zero',launch:'2024-07-04',genre_cn:'都市幻想ARPG',genre_en:'urban fantasy ARPG',global:true}
];

var STRATEGY={
 timeline:'Houkai Gakuen 2 (2014) → Honkai Impact 3rd (2016) → Tears of Themis (2020) → Genshin Impact (2020) → Honkai: Star Rail (2023) → Zenless Zone Zero (2024)',
 globalization:'HoYoverse brand established 2022; HQ Singapore; global publishing in 13+ languages',
 tech:'Cartoon rendering, AI, cloud gaming; Genshin team > 1,400 staff',
 ip:'Animation, comics, music, merchandise, offline themed stores',
 position:'Global leader in anime open-world; Genshin cumulative mobile revenue > USD 9 bn'
};

var SOURCES=[
 ['Revenue 2014–2016','miHoYo prospectus (CSRC disclosure)','Audited prospectus'],
 ['Revenue 2020','Shanghai Top 100 Enterprises 2021','Official ranking'],
 ['Revenue / net profit 2022','Guangming Daily · National Cultural Top 30','Official media'],
 ['Revenue 2021/2023/2024/2025','21st Century Business Herald, 36Kr','Media estimate'],
 ['Genshin mobile revenue','Sensor Tower, Priori Data, GURUGAMER','Third-party estimate'],
 ['Headcount','miHoYo official, Lingang partnership release','Official release']
];
