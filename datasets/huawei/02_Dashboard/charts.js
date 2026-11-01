/* charts.js — ECharts options, KPI cards, routing. Author: Лю Цзицзянь () */
var C=['#DD0022','#780018','#AA0033','#CC0044','#595959','#BFBFBF','#FA8095','#780018'];

/* Trilingual label: English (largest) | Русский (mid) | 中文 (smallest) via ECharts rich text */
function T(en,ru,zh){ return '{en|'+en+'}  {ru|'+ru+'}  {zh|'+zh+'}'; }

function money(n){return n==null?'—（未披露 / N/A）':Math.round(n).toLocaleString('en-US');}
function pct(n,d){if(n==null)return '—（未披露 / N/A）';return n.toFixed(d==null?1:d)+'%';}
var TT={trigger:'axis',triggerOn:'mousemove|click',renderMode:'richText',confine:true,textStyle:{fontSize:11},valueFormatter:function(v){return v==null?'—（未披露 / N/A）':Number(v).toLocaleString('en-US');}};
var AXIS={axisLine:{lineStyle:{color:'#BFBFBF'}},axisLabel:{color:'#595959',fontSize:10.5},splitLine:{lineStyle:{color:'#E8E8E8'}},nameTextStyle:{color:'#595959',fontSize:10.5}};
function baseGrid(){return {left:12,right:16,top:56,bottom:28,containLabel:true};}
function leg(){return {type:'scroll',top:6,textStyle:{fontSize:10.5,color:'#595959',rich:{
 en:{fontSize:11,color:'#262626',fontWeight:'bold'},
 ru:{fontSize:10,color:'#595959'},
 zh:{fontSize:9,color:'#8c8c8c'}
}},itemWidth:14,itemHeight:9};}
function lineSer(name,data,color,w,extra){var o={name:name,type:'line',data:data,smooth:false,symbol:'circle',symbolSize:6,lineStyle:{width:w||2,color:color},itemStyle:{color:color}};if(extra)for(var k in extra)o[k]=extra[k];return o;}
function barSer(name,data,color,extra){var o={name:name,type:'bar',data:data,itemStyle:{color:color}};if(extra)for(var k in extra)o[k]=extra[k];return o;}

/* ======= KPI cards: English main > Russian > Chinese ======= */
function kpiHtml(item){
  var v=item.val;
  var valTxt=v==null?'—（未披露 / N/A）':(item.fmt?item.fmt(v):money(v))+(item.unit?'<span class="unit">'+item.unit+'</span>':'');
  var yoy;
  if(v==null||item.prev==null){yoy='<div class="yoy na">YoY — / N/A</div>';}
  else if(item.pct){var d=+(v-item.prev).toFixed(1);yoy='<div class="yoy '+(d>=0?'up':'dn')+'">'+(d>=0?'▲':'▼')+' '+Math.abs(d).toFixed(1)+' pp vs FY2024</div>';}
  else {var p=(v-item.prev)/Math.abs(item.prev)*100;yoy='<div class="yoy '+(p>=0?'up':'dn')+'">'+(p>=0?'▲':'▼')+' '+Math.abs(p).toFixed(1)+'% vs FY2024</div>';}
  return '<div class="kpi"><div class="lab"><span class="en">'+item.en+'</span><span class="ru">'+item.ru+'</span><span class="zh">'+item.cn+'</span></div><div class="val">'+valTxt+'</div>'+yoy+'</div>';
}
function renderKPI(id,items){document.getElementById(id).innerHTML=items.map(kpiHtml).join('');}

renderKPI('kpi-overview',[
 {cn:'销售收入',ru:'Выручка',en:'Revenue',unit:'RMB mn',val:D.fin.revenue[10],prev:D.fin.revenue[9]},
 {cn:'营业利润',ru:'Операционная прибыль',en:'Operating profit',unit:'RMB mn',val:D.fin.operating_profit[10],prev:D.fin.operating_profit[9]},
 {cn:'净利润',ru:'Прибыль за год',en:'Profit for the year',unit:'RMB mn',val:D.fin.profit_for_year[10],prev:D.fin.profit_for_year[9]},
 {cn:'经营活动现金流',ru:'Денежные средства от операций',en:'Net cash from operating activities',unit:'RMB mn',val:D.fin.net_cash_operating[10],prev:D.fin.net_cash_operating[9]},
 {cn:'资产总计',ru:'Активы',en:'Total assets',unit:'RMB mn',val:D.fin.total_assets[10],prev:D.fin.total_assets[9]},
 {cn:'员工总数',ru:'Численность сотрудников',en:'Number of employees',unit:'persons',val:D.nonfin.employees[10],prev:D.nonfin.employees[9]},
 {cn:'研发费用率',ru:'Расходы на НИОКР, % выручки',en:'R&D as % of revenue',pct:true,unit:'%',fmt:function(v){return v.toFixed(1);},val:D.fin.rd_ratio[10],prev:D.fin.rd_ratio[9]},
 {cn:'全球员工保障投入',ru:'Инвестиции в защиту персонала',en:'Global employee protection investment',unit:'RMB mn',val:D.esg.protect[10],prev:D.esg.protect[9]}
]);
renderKPI('kpi-financial',[
 {cn:'销售收入',ru:'Выручка',en:'Revenue',unit:'RMB mn',val:D.fin.revenue[10],prev:D.fin.revenue[9]},
 {cn:'营业利润',ru:'Операционная прибыль',en:'Operating profit',unit:'RMB mn',val:D.fin.operating_profit[10],prev:D.fin.operating_profit[9]},
 {cn:'净利润',ru:'Прибыль за год',en:'Profit for the year',unit:'RMB mn',val:D.fin.profit_for_year[10],prev:D.fin.profit_for_year[9]},
 {cn:'资产总计',ru:'Активы',en:'Total assets',unit:'RMB mn',val:D.fin.total_assets[10],prev:D.fin.total_assets[9]},
 {cn:'负债合计',ru:'Обязательства',en:'Total liabilities',unit:'RMB mn',val:D.fin.total_liabilities[10],prev:D.fin.total_liabilities[9]},
 {cn:'权益总额',ru:'Собственный капитал',en:'Total equity',unit:'RMB mn',val:D.fin.total_equity[10],prev:D.fin.total_equity[9]},
 {cn:'经营活动现金流',ru:'Денежные средства от операций',en:'Net cash from operating activities',unit:'RMB mn',val:D.fin.net_cash_operating[10],prev:D.fin.net_cash_operating[9]},
 {cn:'研发费用',ru:'Расходы на НИОКР',en:'Research & development expenses',unit:'RMB mn',val:D.fin.rd_expense[10],prev:D.fin.rd_expense[9]}
]);
renderKPI('kpi-nonfin',[
 {cn:'员工总数',ru:'Численность сотрудников',en:'Number of employees',unit:'persons',val:D.nonfin.employees[10],prev:D.nonfin.employees[9]},
 {cn:'研发员工数',ru:'Персонал НИОКР',en:'R&D headcount',unit:'persons',val:D.nonfin.rdhead[10],prev:D.nonfin.rdhead[9]},
 {cn:'研发员工占比',ru:'НИОКР, % персонала',en:'R&D as % of employees',pct:true,val:D.nonfin.rdratio[10],prev:D.nonfin.rdratio[9]},
 {cn:'持股计划参与人数',ru:'Участники программы акций',en:'Employee share plan participants',unit:'persons',val:D.nonfin.shareplan[10],prev:D.nonfin.shareplan[9]},
 {cn:'累计有效专利',ru:'Накопленные патенты',en:'Cumulative active patents',unit:'patents',val:D.nonfin.patents[10],prev:D.nonfin.patents[9]},
 {cn:'人均参训时长',ru:'Часы обучения на сотрудника',en:'Training hours per employee (FY2024)',unit:'hours',val:D.nonfin.training[9],prev:D.nonfin.training[8],fmt:function(v){return v.toFixed(1);}}
]);
renderKPI('kpi-esg',[
 {cn:'员工保障投入',ru:'Инвестиции в защиту персонала',en:'Employee protection investment',unit:'RMB mn',val:D.esg.protect[10],prev:D.esg.protect[9]},
 {cn:'助力客户累计减碳',ru:'Совокупные снижения CO₂ для клиентов',en:'CO₂ reduced for customers',unit:'100m tonnes',val:D.esg.co2[10],prev:D.esg.co2[9],fmt:function(v){return v.toFixed(1);}},
 {cn:'助力客户累计节电',ru:'Совокупная экономия электроэнергии',en:'Electricity saved for customers',unit:'100m kWh',val:D.esg.esaved[10],prev:D.esg.esaved[9]},
 {cn:'助力客户累计绿电',ru:'Зелёная энергия для клиентов',en:'Green power generated for customers',unit:'100m kWh',val:D.esg.gpower[10],prev:D.esg.gpower[9]},
 {cn:'主力产品能效指数',ru:'Индекс энергоэффективности',en:'Energy efficiency index (2019=1)',unit:'x',val:D.esg.eff[10],prev:D.esg.eff[9],fmt:function(v){return v.toFixed(1);}},
 {cn:'以旧换新终端(FY2024)',ru:'Устройства по trade-in',en:'Devices traded in (FY2024)',unit:'units',val:D.esg.recycled[9],prev:D.esg.recycled[8]}
]);
renderKPI('kpi-other',[
 {cn:'销售收入(美元)',ru:'Выручка (USD)',en:'Revenue (USD)',unit:'USD mn',val:D.other.usdrevenue[10],prev:D.other.usdrevenue[9]},
 {cn:'净利润(美元)',ru:'Прибыль за год (USD)',en:'Profit for the year (USD)',unit:'USD mn',val:D.other.usd_pft[10],prev:D.other.usd_pft[9]},
 {cn:'经营现金流(美元)',ru:'ODA (USD)',en:'Net cash from operating (USD)',unit:'USD mn',val:D.other.usd_cfo[10],prev:D.other.usd_cfo[9]},
 {cn:'期末汇率',ru:'Курс USD на конец периода',en:'USD rate (period-end)',unit:'RMB/USD',val:D.other.usdrate[10],prev:D.other.usdrate[9],fmt:function(v){return v.toFixed(4);}},
 {cn:'实际税率',ru:'Эффективная ставка налога',en:'Effective tax rate',pct:true,unit:'%',fmt:function(v){return v.toFixed(1);},val:etr[10],prev:etr[9]},
 {cn:'总资产(美元)',ru:'Активы (USD)',en:'Total assets (USD)',unit:'USD mn',val:D.other.usd_assets[10],prev:D.other.usd_assets[9]}
]);

/* ======= options ======= */
var O={};
O['ov-revprofit']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'RMB mn'},AXIS),series:[barSer(T('Revenue','Выручка','销售收入'),D.fin.revenue,C[0]),lineSer(T('Profit for the year','Прибыль за год','净利润'),D.fin.profit_for_year,C[1],2.5)]};
O['ov-margins']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(1)+'%';}}),legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'%',axisLabel:{formatter:'{value}%'}},AXIS),series:[lineSer(T('Gross margin','Валовая маржа','毛利率'),grossMargin,C[0]),lineSer(T('Operating margin','Операционная маржа','营业利润率'),D.fin.operating_margin,C[1]),lineSer(T('Net margin','Чистая маржа','净利率'),netMargin,C[3])]};
O['ov-seg-pie']={tooltip:{trigger:'item',triggerOn:'mousemove|click',renderMode:'richText',confine:true,textStyle:{fontSize:11},valueFormatter:function(v){return Number(v).toLocaleString('en-US')+' RMB mn';}},legend:{bottom:4,textStyle:{fontSize:10.5},type:'scroll'},series:[{type:'pie',radius:['38%','66%'],center:['50%','46%'],label:{fontSize:10.5,formatter:'{b}\n{d}%'},data:[
 {value:375014,name:'ICT Infrastructure · ICT-инфраструктура · ICT基础设施',itemStyle:{color:C[0]}},
 {value:344473,name:'Terminal · Терминалы · 终端',itemStyle:{color:C[1]}},
 {value:77312,name:'Digital Power · Цифровая энергетика · 数字能源',itemStyle:{color:C[2]}},
 {value:45018,name:'Intelligent Automotive · Автопром · 智能汽车',itemStyle:{color:C[4]}},
 {value:32161,name:'Huawei Cloud · Huawei Cloud · 华为云',itemStyle:{color:C[5]}},
 {value:6963,name:'Others · Прочее · 其他',itemStyle:{color:C[6]}}]}]};
O['ov-reg-pie']={tooltip:{trigger:'item',triggerOn:'mousemove|click',renderMode:'richText',confine:true,textStyle:{fontSize:11},valueFormatter:function(v){return Number(v).toLocaleString('en-US')+' RMB mn';}},legend:{bottom:4,textStyle:{fontSize:10.5},type:'scroll'},series:[{type:'pie',radius:['38%','66%'],center:['50%','46%'],label:{fontSize:10.5,formatter:'{b}\n{d}%'},data:[
 {value:616249,name:'China · Китай · 中国',itemStyle:{color:C[0]}},
 {value:161356,name:'Europe, Middle East & Africa · ЕБВА · 欧洲中东非',itemStyle:{color:C[1]}},
 {value:50113,name:'Asia Pacific · АТР · 亚太',itemStyle:{color:C[2]}},
 {value:37184,name:'Americas · Америка · 美洲',itemStyle:{color:C[4]}},
 {value:16039,name:'Other regions · Прочие · 其他地区',itemStyle:{color:C[5]}}]}]};
O['ov-balance']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'RMB mn'},AXIS),series:[barSer(T('Total assets','Активы','资产总计'),D.fin.total_assets,C[0]),barSer(T('Total liabilities','Обязательства','负债合计'),D.fin.total_liabilities,C[2]),barSer(T('Total equity','Собственный капитал','权益总额'),D.fin.total_equity,C[4])]};
O['ov-employees']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'persons'},AXIS),series:[barSer(T('Number of employees','Численность сотрудников','员工总数'),D.nonfin.employees,C[0])]};

O['fin-is']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'RMB mn'},AXIS),series:[barSer(T('Revenue','Выручка','销售收入'),D.fin.revenue,C[0]),lineSer(T('Operating profit','Операционная прибыль','营业利润'),D.fin.operating_profit,C[1],2),lineSer(T('Profit for the year','Прибыль за год','净利润'),D.fin.profit_for_year,C[3],2)]};
O['fin-margins']=JSON.parse(JSON.stringify(O['ov-margins']));
O['fin-segstack']={tooltip:TT,legend:{type:'scroll',top:4,textStyle:{fontSize:10,rich:{en:{fontSize:10.5,color:'#262626',fontWeight:'bold'},ru:{fontSize:9.5,color:'#595959'},zh:{fontSize:8.5,color:'#8c8c8c'}}},itemWidth:12,itemHeight:9},grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'RMB mn'},AXIS),series:[
 barSer(T('Carrier (legacy)','Операторский (стар.)','运营商(旧)'),D.oldseg.carrier,C[0],{stack:'legacy'}),
 barSer(T('Enterprise (legacy)','Предприятия (стар.)','企业(旧)'),D.oldseg.enterprise,C[1],{stack:'legacy'}),
 barSer(T('Consumer (legacy)','Потребит. (стар.)','消费者(旧)'),D.oldseg.consumer,C[2],{stack:'legacy'}),
 barSer(T('ICT Infrastructure','ICT-инфраструктура','ICT基础设施(新)'),D.newseg.ict,C[3],{stack:'current'}),
 barSer(T('Terminal','Терминалы','终端(新)'),D.newseg.terminal,C[1],{stack:'current'}),
 barSer(T('Digital Power','Цифровая энергетика','数字能源(新)'),D.newseg.dp,C[2],{stack:'current'}),
 barSer(T('Intelligent Automotive','Автопром','智能汽车(新)'),D.newseg.auto,C[4],{stack:'current'}),
 barSer(T('Huawei Cloud','Huawei Cloud','华为云(新)'),D.newseg.cloud,C[5],{stack:'current'}),
 barSer(T('Others','Прочее','其他(新)'),D.newseg.others,C[6],{stack:'current'})
 ].concat([{type:'line',markLine:{silent:true,symbol:'none',lineStyle:{color:'#AA0033',type:'dashed',width:1.5},label:{formatter:'FY2022 分部重组 / Segment reorganisation / Реорг. сегментов',fontSize:10,color:'#AA0033',position:'insideEndTop'},data:[{xAxis:'FY2022'}]},data:[]}])};
O['fin-regstack']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'RMB mn'},AXIS),series:[
 barSer(T('China','Китай','中国'),D.regions.china,C[0],{stack:'reg'}),
 barSer(T('EMEA','Европа, Бл.Восток, Африка','欧洲中东非'),D.regions.emea,C[1],{stack:'reg'}),
 barSer(T('Asia Pacific','АТР','亚太'),D.regions.apac,C[2],{stack:'reg'}),
 barSer(T('Americas','Америка','美洲'),D.regions.americas,C[4],{stack:'reg'}),
 barSer(T('Other','Прочие','其他地区'),D.regions.other,C[5],{stack:'reg'})]};

O['fin-balance']=JSON.parse(JSON.stringify(O['ov-balance']));
O['fin-cashflow']={tooltip:TT,legend:leg(),grid:{left:12,right:56,top:56,bottom:28,containLabel:true},xAxis:{type:'category',data:YRS},yAxis:[
 Object.assign({type:'value',name:'Cash flow RMB mn'},AXIS),
 Object.assign({type:'value',name:'Year-end cash RMB mn',splitLine:{show:false}},AXIS)],series:[
 barSer(T('Operating','Операции','经营活动'),D.fin.net_cash_operating,C[0]),
 barSer(T('Investing','Инвестиции','投资活动'),D.fin.net_cash_investing,C[2]),
 barSer(T('Financing','Финансирование','筹资活动'),D.fin.net_cash_financing,C[6]),
 lineSer(T('Year-end cash','Денежные средства на конец','年末现金'),D.fin.cash_ending,C[3],2.5,{yAxisIndex:1})]};
O['fin-rd']={tooltip:TT,legend:leg(),grid:{left:12,right:56,top:56,bottom:28,containLabel:true},xAxis:{type:'category',data:YRS},yAxis:[
 Object.assign({type:'value',name:'R&D expense RMB mn'},AXIS),
 Object.assign({type:'value',name:'% of revenue',axisLabel:{formatter:'{value}%',color:'#595959',fontSize:10.5},splitLine:{show:false}})],series:[
 barSer(T('R&D expense','Расходы на НИОКР','研发费用'),D.fin.rd_expense,C[0]),
 lineSer(T('R&D % of revenue','НИОКР, % выручки','研发费用率'),D.fin.rd_ratio,C[3],2.5,{yAxisIndex:1})]};
O['fin-capex']={tooltip:TT,legend:leg(),grid:{left:12,right:56,top:56,bottom:28,containLabel:true},xAxis:{type:'category',data:YRS},yAxis:[
 Object.assign({type:'value',name:'Capex RMB mn'},AXIS),
 Object.assign({type:'value',name:'% of revenue',axisLabel:{formatter:'{value}%',color:'#595959',fontSize:10.5},splitLine:{show:false}})],series:[
 barSer(T('Capital expenditure','Капитальные затраты','资本开支'),capex,C[0]),
 lineSer(T('Capex % of revenue','Капзатраты, % выручки','资本开支率'),capexRatio,C[3],2.5,{yAxisIndex:1})]};
O['fin-roe']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(1)+'%';}}),legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'%'},AXIS),series:[lineSer(T('ROE','Рентабельность капитала','净资产收益率'),roe,C[0]),lineSer(T('ROA','Рентабельность активов','总资产收益率'),roa,C[1])]};

O['nf-emp']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'persons'},AXIS),series:[barSer(T('Total employees','Всего сотрудников','员工总数'),D.nonfin.employees,C[0]),lineSer(T('R&D headcount','Персонал НИОКР','研发员工数'),D.nonfin.rdhead,C[1],2)]};
O['nf-rdratio']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(1)+'%';}}),legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'%',max:65},AXIS),series:[lineSer(T('R&D headcount %','НИОКР, % персонала','研发员工占比'),D.nonfin.rdratio,C[0],2.5)]};
O['nf-patents']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'patents held'},AXIS),series:[barSer(T('Cumulative active patents','Накопленные патенты','累计有效专利'),D.nonfin.patents,C[0])]};
O['nf-shareplan']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'persons'},AXIS),series:[barSer(T('Share plan participants','Участники программы акций','员工持股计划参与人数'),D.nonfin.shareplan,C[0])]};
O['nf-sharehold']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(2)+'%';}}),legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'%',max:100},AXIS),series:[lineSer(T('Ren Zhengfei','Жэн Чжэнфэй','任正非持股'),D.nonfin.ren,C[0],2.5),lineSer(T('Union Committee (derived)','Профсоюз (расчёт.)','工会委员会持股(派生)'),unionShare,C[1],2.5)]};
O['nf-training']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'hours/employee'},AXIS),series:[barSer(T('Training hours / employee','Часы обучения на сотрудника','人均参训时长'),D.nonfin.training,C[0])]};

O['esg-protect']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'RMB mn'},AXIS),series:[barSer(T('Employee protection investment','Инвестиции в защиту персонала','全球员工保障投入'),D.esg.protect,C[0])]};
O['esg-co2']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'100m tonnes CO2e'},AXIS),series:[barSer(T('Cumulative CO2 reduced','Совокупное снижение CO₂','累计减少二氧化碳'),D.esg.co2,C[0])]};
O['esg-energy']={tooltip:TT,legend:leg(),grid:{left:12,right:56,top:56,bottom:28,containLabel:true},xAxis:{type:'category',data:YRS},yAxis:[
 Object.assign({type:'value',name:'Saved 100m kWh'},AXIS),
 Object.assign({type:'value',name:'Green 100m kWh',splitLine:{show:false}},AXIS)],series:[
 barSer(T('Electricity saved','Экономия электроэнергии','累计节约用电'),D.esg.esaved,C[0]),
 lineSer(T('Green power generated','Зелёная энергия','累计生产绿电'),D.esg.gpower,C[3],2.5,{yAxisIndex:1})]};
O['esg-eff']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'x (2019=1)',min:0},AXIS),series:[lineSer(T('Energy efficiency index','Индекс энергоэффективности','主力产品平均能效指数'),D.esg.eff,C[0],2.5,{symbolSize:8})]};
O['esg-recycle']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'units'},AXIS),series:[barSer(T('Devices traded in','Устройства по trade-in','以旧换新累计终端设备'),D.esg.recycled,C[0])]};
O['esg-talent']={tooltip:TT,legend:leg(),grid:{left:12,right:56,top:56,bottom:28,containLabel:true},xAxis:{type:'category',data:YRS},yAxis:[
 Object.assign({type:'value',name:'persons'},AXIS),
 Object.assign({type:'value',name:'schools',splitLine:{show:false}},AXIS)],series:[
 barSer(T('ICT Academy students','Студенты ICT-академии','ICT学院累计学生'),D.esg.ict,C[0]),
 barSer(T('Seeds for the Future 2.0','Seeds for the Future 2.0','未来种子2.0受益人数'),D.esg.seed,C[6]),
 lineSer(T('TECH4ALL schools','Школы TECH4ALL','TECH4ALL受益学校'),D.esg.t4all,C[3],2.5,{yAxisIndex:1})]};

O['ot-etr']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(1)+'%';}}),legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'%'},AXIS),series:[lineSer(T('Effective tax rate','Эффективная ставка налога','实际税率'),etr,C[0],2.5)]};
O['ot-usdrate']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(4);}}),legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'RMB per USD',scale:true},AXIS),series:[lineSer(T('Period-end USD rate','Курс USD на конец периода','期末美元折算汇率'),D.other.usdrate,C[0],2.5)]};
O['ot-usdrevenue']={tooltip:TT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'USD mn'},AXIS),series:[barSer(T('Revenue (USD)','Выручка (USD)','销售收入(美元)'),D.other.usdrevenue,C[0])]};

/* ======= static tables & timeline ======= */
document.getElementById('esg-na-body').innerHTML=D.esgNa.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>';}).join('');
document.getElementById('ot-timeline').innerHTML=D.events.map(function(e){return '<div class="tl-item"><span class="yr">FY'+e.y+'</span><span class="cn">'+e.cn+'</span><div class="en">'+e.en+'</div><div class="ru">'+e.ru+'</div></div>';}).join('');
var usdRows=[
 ['Revenue / Выручка / 销售收入',D.other.usdrevenue[10],'USD million'],
 ['Operating profit / Операционная прибыль / 营业利润',D.other.usd_op[10],'USD million'],
 ['Profit for the year / Прибыль за год / 净利润',D.other.usd_pft[10],'USD million'],
 ['Net cash from operating / Ден. средства от операций / 经营活动现金流',D.other.usd_cfo[10],'USD million'],
 ['Cash & short-term investments / Ден. средства и краткосроч. вложения / 现金与短期投资',D.other.usd_cash[10],'USD million'],
 ['Total assets / Активы / 资产总计',D.other.usd_assets[10],'USD million'],
 ['Total borrowings / Кредиты и займы / 总借款',D.other.usd_borrow[10],'USD million'],
 ['Total equity / Собственный капитал / 权益总额',D.other.usd_equity[10],'USD million']];
document.querySelector('#ot-usd-table tbody').innerHTML=usdRows.map(function(r){return '<tr><td>'+r[0]+'</td><td class="num">'+Number(r[1]).toLocaleString('en-US')+'</td><td>'+r[2]+' (period-end rate '+D.other.usdrate[10].toFixed(4)+')</td></tr>';}).join('');

renderKPI('kpi-ratio',[
 {cn:'毛利率',ru:'Валовая маржа',en:'Gross margin',pct:true,unit:'%',fmt:function(v){return v.toFixed(1);},val:R.gross[10],prev:R.gross[9]},
 {cn:'净利率',ru:'Чистая маржа',en:'Net margin',pct:true,unit:'%',fmt:function(v){return v.toFixed(1);},val:R.net[10],prev:R.net[9]},
 {cn:'净资产收益率(期末)',ru:'ROE (на конец года)',en:'ROE (year-end)',pct:true,unit:'%',fmt:function(v){return v.toFixed(1);},val:R.roeEnd[10],prev:R.roeEnd[9]},
 {cn:'流动比率',ru:'Текущая ликвидность',en:'Current ratio',unit:'x',fmt:function(v){return v.toFixed(2);},val:R.current[10],prev:R.current[9]},
 {cn:'盈利现金含量(CFO/净利)',ru:'Денежное покрытие прибыли',en:'CFO / net profit',pct:true,unit:'%',fmt:function(v){return v.toFixed(1);},val:R.cfoNi[10],prev:R.cfoNi[9]},
 {cn:'研发强度',ru:'Интенсивность НИОКР',en:'R&D intensity',pct:true,unit:'%',fmt:function(v){return v.toFixed(1);},val:D.fin.rd_ratio[10],prev:D.fin.rd_ratio[9]}
]);

var PCT={trigger:'axis',triggerOn:'mousemove|click',renderMode:'richText',confine:true,textStyle:{fontSize:11},valueFormatter:function(v){return v==null?'—':Number(v).toFixed(1)+'%';}};
O['ra-margins']={tooltip:PCT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'%',axisLabel:{formatter:'{value}%',color:'#595959',fontSize:10.5}},AXIS),series:[lineSer(T('Gross margin','Валовая маржа','毛利率'),R.gross,C[0]),lineSer(T('Operating margin','Операционная маржа','营业利润率'),R.op,C[1]),lineSer(T('Net margin','Чистая маржа','净利率'),R.net,C[3])]};
O['ra-returns']={tooltip:PCT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'%',axisLabel:{formatter:'{value}%',color:'#595959',fontSize:10.5}},AXIS),series:[lineSer(T('ROE year-end','ROE (на конец)','ROE(期末)'),R.roeEnd,C[0]),lineSer(T('ROE average','ROE (средн.)','ROE(平均)'),R.roeAvg,C[1]),lineSer(T('ROA','Рентабельность активов','总资产收益率'),R.roa,C[4]),lineSer(T('ROIC','ROIC','投入资本回报率'),R.roic,C[6])]};
O['ra-liquidity']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(2)+'x';}}),legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'x',min:0},AXIS),series:[lineSer(T('Current ratio','Текущая ликвидность','流动比率'),R.current,C[0],2.5),lineSer(T('Quick ratio','Быстрая ликвидность','速动比率'),R.quick,C[1],2.5)]};
O['ra-leverage']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(1);}}),legend:leg(),grid:{left:12,right:56,top:56,bottom:28,containLabel:true},xAxis:{type:'category',data:YRS},yAxis:[
 Object.assign({type:'value',name:'%',axisLabel:{formatter:'{value}%',color:'#595959',fontSize:10.5}},AXIS),
 Object.assign({type:'value',name:'D/E x',splitLine:{show:false}},AXIS)],series:[
 lineSer(T('Total liabilities / Total assets','Обязательства / Активы','资产负债率'),R.debtRatio,C[0],2.5),
 lineSer(T('Gearing','Финансовый рычаг','杠杆率'),R.gearing,C[1],2.5),
 lineSer(T('Debt-to-equity','Долг / капитал','债务权益比'),R.de,C[3],2.5,{yAxisIndex:1})]};
O['ra-cfoqual']={tooltip:PCT,legend:leg(),grid:baseGrid(),xAxis:{type:'category',data:YRS},yAxis:Object.assign({type:'value',name:'%',axisLabel:{formatter:'{value}%',color:'#595959',fontSize:10.5}},AXIS),series:[lineSer(T('CFO / net profit','ODA / прибыль','盈利现金含量'),R.cfoNi,C[0],2.5),lineSer(T('CFO / revenue','ODA / выручка','经营现金流率'),R.cfoRev,C[1],2.5)]};
O['ra-fcf']={tooltip:TT,legend:leg(),grid:{left:12,right:56,top:56,bottom:28,containLabel:true},xAxis:{type:'category',data:YRS},yAxis:[
 Object.assign({type:'value',name:'FCF RMB mn'},AXIS),
 Object.assign({type:'value',name:'FCF margin %',axisLabel:{formatter:'{value}%',color:'#595959',fontSize:10.5},splitLine:{show:false}})],series:[
 barSer(T('Free cash flow','Свободный денежный поток','自由现金流'),R.fcf,C[0]),
 lineSer(T('FCF margin','Маржа FCF','自由现金流率'),R.fcfMargin,C[3],2.5,{yAxisIndex:1})]};
O['ra-perhead']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(1);}}),legend:leg(),grid:{left:12,right:56,top:56,bottom:28,containLabel:true},xAxis:{type:'category',data:YRS},yAxis:[
 Object.assign({type:'value',name:'Revenue per employee, 万元'},AXIS),
 Object.assign({type:'value',name:'Profit per employee, 万元',splitLine:{show:false}},AXIS)],series:[
 barSer(T('Revenue per employee','Выручка на сотрудника','人均营业收入'),R.revPerEmp,C[0]),
 lineSer(T('Profit per employee','Прибыль на сотрудника','人均净利润'),R.niPerEmp,C[3],2.5,{yAxisIndex:1})]};
O['ra-rd']={tooltip:Object.assign({},TT,{valueFormatter:function(v){return v==null?'—':Number(v).toFixed(2);}}),legend:leg(),grid:{left:12,right:56,top:56,bottom:28,containLabel:true},xAxis:{type:'category',data:YRS},yAxis:[
 Object.assign({type:'value',name:'R&D intensity %',axisLabel:{formatter:'{value}%',color:'#595959',fontSize:10.5}},AXIS),
 Object.assign({type:'value',name:'patents / R&D head',splitLine:{show:false}},AXIS)],series:[
 lineSer(T('R&D intensity','Интенсивность НИОКР','研发强度'),D.fin.rd_ratio,C[0],2.5),
 lineSer(T('Patents per R&D headcount','Патенты на сотрудника НИОКР','每研发人员专利'),patentsPerRd,C[3],2.5,{yAxisIndex:1})]};

/* ======= tab routing & charts ======= */
var chartInst={};
function initTab(tabId){
 var sec=document.getElementById('tab-'+tabId);
 sec.querySelectorAll('.chart').forEach(function(el){
   if(!chartInst[el.id]){var c=echarts.init(el);c.setOption(O[el.id]);chartInst[el.id]=c;}
 });
}
function resizeTab(tabId){
 var sec=document.getElementById('tab-'+tabId);
 sec.querySelectorAll('.chart').forEach(function(el){if(chartInst[el.id])chartInst[el.id].resize();});
}
function showTab(tabId){
 if(!document.getElementById('tab-'+tabId))tabId='overview';
 document.querySelectorAll('section.tab').forEach(function(s){s.classList.remove('active');});
 document.getElementById('tab-'+tabId).classList.add('active');
 document.querySelectorAll('#nav button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-tab')===tabId);});
 initTab(tabId);
 requestAnimationFrame(function(){resizeTab(tabId);});
}
document.querySelectorAll('#nav button').forEach(function(b){
 b.addEventListener('click',function(){location.hash='/'+b.getAttribute('data-tab');});
});
window.addEventListener('hashchange',function(){showTab((location.hash||'').replace('#/','').replace('#','')||'overview');});
window.addEventListener('resize',function(){var act=document.querySelector('section.tab.active');if(act)resizeTab(act.id.replace('tab-',''));});
showTab((location.hash||'').replace('#/','').replace('#','')||'overview');

