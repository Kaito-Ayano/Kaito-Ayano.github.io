/* charts.js — miHoYo dashboard options, KPI, routing. Author: Лю Цзицзянь (). */

/* 5-blue palette: deep header, primary, mid, light, pale; grey for comparison */
var C=['#2E7CB8','#40A0D0','#5AB8D8','#70D0E0','#A8E4EE','#BFBFBF','#1F5E8A','#2E7CB8'];

function money(n){return n==null?'—（未披露 / N/A）':Math.round(n).toLocaleString('en-US');}
var TT={trigger:'axis',triggerOn:'mousemove|click',renderMode:'richText',confine:true,textStyle:{fontSize:11},valueFormatter:function(v){return v==null?'—（未披露 / N/A）':Number(v).toLocaleString('en-US');}};
var AXIS={axisLine:{lineStyle:{color:'#BFBFBF'}},axisLabel:{color:'#595959',fontSize:10.5},splitLine:{lineStyle:{color:'#E8EEF2'}},nameTextStyle:{color:'#595959',fontSize:10.5}};
function baseGrid(){return {left:12,right:16,top:56,bottom:28,containLabel:true};}
function leg(){return {type:'scroll',top:6,textStyle:{fontSize:10.5,color:'#595959'},itemWidth:14,itemHeight:9};}
function lineSer(name,data,color,w,extra){var o={name:name,type:'line',data:data,smooth:false,symbol:'circle',symbolSize:6,lineStyle:{width:w||2,color:color},itemStyle:{color:color}};if(extra)for(var k in extra)o[k]=extra[k];return o;}
function barSer(name,data,color,extra){var o={name:name,type:'bar',data:data,itemStyle:{color:color}};if(extra)for(var k in extra)o[k]=extra[k];return o;}

/* ======= KPI cards: English main > Chinese secondary ======= */
function kpiHtml(item){
  var v=item.val;
  var valTxt=v==null?'—（未披露 / N/A）':(item.fmt?item.fmt(v):money(v))+(item.unit?'<span class="unit">'+item.unit+'</span>':'');
  var yoy='';
  if(item.prev!=null&&v!=null){var d=v-item.prev;var txt=item.pct?(d>=0?'▲':'▼')+' '+Math.abs(d).toFixed(1)+' pp':(d>=0?'▲':'▼')+' '+Math.abs(d).toFixed(1)+'%';yoy='<div class="yoy">'+txt+' vs prior</div>';}
  return '<div class="kpi"><div class="lab"><span class="en">'+item.en+'</span><span class="zh">'+item.cn+'</span></div><div class="val">'+valTxt+'</div>'+yoy+'</div>';
}
function renderKPI(id,items){var el=document.getElementById(id);if(el)el.innerHTML=items.map(kpiHtml).join('');}

/* latest disclosed revenue = FY2025 78000; prior = FY2024 34000 */
renderKPI('kpi-overview',[
 {cn:'最新营业收入',en:'Latest revenue (FY2025)',unit:'RMB mn',val:REVENUE[11],prev:REVENUE[10]},
 {cn:'员工总数',en:'Headcount (FY2025)',unit:'persons',val:5000,prev:4000},
 {cn:'上线游戏数',en:'Shipped titles',unit:'games',val:PRODUCTS.length},
 {cn:'原神移动端累计收入',en:'Genshin cumulative mobile revenue',unit:'USD bn',fmt:function(v){return v.toFixed(1);},val:G_CUM_MOBILE_USD/1000}
]);

/* ======= options ======= */
var O={};

/* ---- financial ---- */
O['fin-revprofit']={tooltip:TT,legend:leg(),grid:{left:12,right:56,top:56,bottom:28,containLabel:true},xAxis:{type:'category',data:YRS},yAxis:[
 Object.assign({type:'value',name:'Revenue RMB mn'},AXIS),
 Object.assign({type:'value',name:'Net profit RMB mn',splitLine:{show:false}},AXIS)],series:[
 barSer('Revenue / 营业收入',REVENUE,C[1]),
 lineSer('Net profit / 净利润',NPROFIT,C[0],2.5,{yAxisIndex:1}),
 {type:'line',markPoint:{symbol:'pin',symbolSize:44,itemStyle:{color:C[6]},label:{fontSize:10,color:'#fff',formatter:'NA 37,402'}},data:[{coord:['FY2022',27340]}],data:[]}
]};
O['fin-genshin']={tooltip:Object.assign({},TT,{valueFormatter:function(v,i){return v==null?'—':'USD '+Number(v).toLocaleString()+' m';}}),legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:G_YEARS},yAxis:Object.assign({type:'value',name:'USD mn'},AXIS),series:[barSer('Genshin mobile revenue / 原神移动端收入',G_REV,C[2]),lineSer('Peak 2022 / 2022峰值',G_REV,C[0],2.5)]};

/* ---- non-financial ---- */
O['nf-employees']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:EMP_YEARS},yAxis:Object.assign({type:'value',name:'persons'},AXIS),series:[barSer('Headcount / 员工数',EMP_COUNT,C[1])]};

/* ---- ratio (computable only) ---- */
/* net margin where both disclosed: 2014-2016, 2021, 2022 */
function nm(i){return (REVENUE[i]&&NPROFIT[i])?+(NPROFIT[i]/REVENUE[i]*100).toFixed(1):null;}
var NETMARGIN=[nm(0),nm(1),nm(2),null,null,null,null,nm(7),nm(8),null,null,null];
O['ra-netmargin']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(1)+'%';}}),legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'%',axisLabel:{formatter:'{value}%'}},AXIS),series:[lineSer('Net margin / 净利率',NETMARGIN,C[0],2.5)]};
/* revenue per employee at FY2022 (27340 / 4000) and FY2025 (78000/5000) */
O['ra-perhead']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:['FY2022','FY2025']},yAxis:Object.assign({type:'value',name:'RMB mn per employee'},AXIS),series:[barSer('Revenue per employee / 人均营收',[+(27340/4000).toFixed(2),+(78000/5000).toFixed(2)],C[2])]};

/* ---- overview ---- */
O['ov-rev']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'Revenue RMB mn'},AXIS),series:[barSer('Revenue / 营业收入',REVENUE,C[1])]};
O['ov-genshin']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':'USD '+Number(v).toLocaleString()+' m';}}),legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:G_YEARS},yAxis:Object.assign({type:'value',name:'USD mn'},AXIS),series:[lineSer('Genshin mobile / 原神移动端',G_REV,C[0],2.5)]};

/* ======= static tables & strategy canvas ======= */
(function(){
 var pt=document.getElementById('nf-products-body');
 if(pt)pt.innerHTML=PRODUCTS.map(function(p){return '<tr><td>'+p.en+'<div class="zh">'+p.cn+'</div></td><td>'+p.launch+'</td><td>'+p.genre_en+'<div class="zh">'+p.genre_cn+'</div></td><td>'+(p.global?'Global 全球':'China-only 仅国内')+'</td></tr>';}).join('');
 var gl=document.getElementById('strategy-globe');
 if(gl)gl.innerHTML=CO.offices.map(function(o){return '<span class="chip">'+o+'</span>';}).join('');
 var tl=document.getElementById('strategy-timeline');
 if(tl)tl.innerHTML=PRODUCTS.map(function(p){return '<div class="tl-item"><span class="yr">'+p.launch.slice(0,4)+'</span><div class="en">'+p.en+'</div><div class="zh">'+p.cn+' · '+p.genre_cn+'</div></div>';}).join('');
 var src=document.getElementById('sources-body');
 if(src)src.innerHTML=SOURCES.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>';}).join('');
})();

/* ======= tab routing & charts ======= */
var chartInst={};
function initTab(tabId){
 var sec=document.getElementById('tab-'+tabId);if(!sec)return;
 sec.querySelectorAll('.chart').forEach(function(el){
   if(!chartInst[el.id]&&O[el.id]){var c=echarts.init(el);c.setOption(O[el.id]);chartInst[el.id]=c;}
 });
}
function resizeTab(tabId){
 var sec=document.getElementById('tab-'+tabId);if(!sec)return;
 sec.querySelectorAll('.chart').forEach(function(el){if(chartInst[el.id])chartInst[el.id].resize();});
}
function showTab(tabId){
 if(!document.getElementById('tab-'+tabId))tabId='strategy';
 document.querySelectorAll('section.tab').forEach(function(s){s.classList.remove('active');});
 document.getElementById('tab-'+tabId).classList.add('active');
 document.querySelectorAll('#nav button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-tab')===tabId);});
 initTab(tabId);
 requestAnimationFrame(function(){resizeTab(tabId);});
}
document.querySelectorAll('#nav button').forEach(function(b){
 b.addEventListener('click',function(){location.hash='/'+b.getAttribute('data-tab');});
});
window.addEventListener('hashchange',function(){showTab((location.hash||'').replace('#/','').replace('#','')||'strategy');});
window.addEventListener('resize',function(){var act=document.querySelector('section.tab.active');if(act)resizeTab(act.id.replace('tab-',''));});
showTab((location.hash||'').replace('#/','').replace('#','')||'strategy');
O['fin-revtrend']=O['ov-rev'];
O['nf-genshin']=O['ov-genshin'];
