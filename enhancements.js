(function(){var CSS_TEXT="\n:root{--bg:#f3f6fa;--card:#fff;--text:#172033;--muted:#667085;--line:#d8dee8;--blue:#2563eb}\nbody.dark{--bg:#0f172a;--card:#172033;--text:#e5e7eb;--muted:#94a3b8;--line:#334155;--blue:#60a5fa;background:#0f172a!important;color:#e5e7eb!important}\nbody.dark .top,body.dark .card,body.dark .opt,body.dark .xpanel,body.dark .xnav,body.dark .exam-card{background:#172033!important;color:#e5e7eb;border-color:#334155}\nbody.dark .opt{background:#172033}.dark .btn.secondary{background:#263247;color:#e5e7eb}.dark .mode button{background:#172033;color:#e5e7eb;border-color:#334155}\n.xbar{display:flex;gap:7px;flex-wrap:wrap;margin:0 0 12px}.xbar button{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:10px;padding:8px 10px;font-weight:700}.xbar button.on{background:#eaf1ff;border-color:#2563eb;color:#1d4ed8}\n.xnav{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;margin:0 0 14px}.xnavhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;font-weight:800}.xnums{display:grid;grid-template-columns:repeat(10,1fr);gap:6px}.xnum{border:1px solid var(--line);background:transparent;color:var(--text);border-radius:8px;padding:7px 0;font-size:12px}.xnum.done{background:#dcfce7;border-color:#86efac;color:#166534}.xnum.cur{outline:2px solid #2563eb}.xnum.wrong{background:#fee2e2;border-color:#fca5a5;color:#991b1b}\n.xpanel{background:#f8fafc;border:1px solid #dbe3ef;border-radius:14px;padding:14px;margin-top:14px;line-height:1.7}.xpanel h3{margin:0 0 8px;font-size:16px}.xpanel .tag{display:inline-block;background:#eaf1ff;color:#1d4ed8;border-radius:99px;padding:2px 8px;font-size:12px;font-weight:800;margin-right:6px}.xsource{font-size:12px;color:var(--muted);margin-top:10px}.xsource a{color:#2563eb}.xstat{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.xstat div{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:9px;text-align:center}.xstat b{display:block;font-size:18px}.xhint{color:var(--muted);font-size:13px}\n.exam-wrap{max-width:760px;margin:auto}.exam-head{position:sticky;top:0;z-index:6;background:var(--card);border-bottom:1px solid var(--line);padding:10px 12px;margin:-18px -14px 14px}.exam-headrow{display:flex;align-items:center;gap:8px}.exam-title{font-weight:900;flex:1}.timer{font-weight:900;color:#dc2626}.exam-progress{height:7px;background:#e5e7eb;border-radius:99px;overflow:hidden;margin-top:8px}.exam-progress i{display:block;height:100%;background:var(--blue)}.exam-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:17px}.exam-q{font-size:19px;line-height:1.7;font-weight:700;white-space:pre-wrap;margin:12px 0}.exam-opt{display:block;width:100%;text-align:left;border:1.5px solid var(--line);background:var(--card);color:var(--text);border-radius:12px;padding:13px;margin:9px 0}.exam-opt.sel{border-color:#2563eb;background:#eef4ff}.exam-nav{display:grid;grid-template-columns:repeat(10,1fr);gap:5px;margin-top:12px}.exam-num{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:7px;padding:6px 0;font-size:11px}.exam-num.done{background:#dcfce7;color:#166534}.exam-num.cur{outline:2px solid #2563eb}.review-item{border:1px solid var(--line);border-radius:12px;padding:13px;margin:10px 0}.review-ok{border-left:4px solid #16a34a}.review-bad{border-left:4px solid #dc2626}.review-exp{background:#f8fafc;padding:10px;border-radius:9px;margin-top:8px}.dark .review-exp{background:#0f172a}\n@media(max-width:520px){.xnums,.exam-nav{grid-template-columns:repeat(10,1fr)}.xnum,.exam-num{font-size:11px;padding:6px 0}.exam-q{font-size:18px}}\n";

var st=document.createElement('style');st.textContent=CSS_TEXT;document.head.appendChild(st);
var KEY='diangong2024_v3',state=JSON.parse(localStorage.getItem(KEY)||'{"fav":{},"wrong":{},"answered":{},"right":{},"dark":false,"auto":true}');
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function esc(x){return String(x).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]})}
function stem(){return document.querySelector('.q')?.innerText?.trim()||''}
function meta(){return document.querySelector('.meta')?.innerText?.trim()||''}
function key(){var q=currentQ();return q?('第'+setId+'套|第'+q.n+'题|'+q.stem):meta().replace(/\s+/g,' ')+'|'+stem()}
var refs=[
['西门子 MICROMASTER 420：P0700/P1000 操作说明','https://support.industry.siemens.com/cs/attachments/9296615/MM420_OPI_1201_en.pdf'],
['西门子 S7-200 系统手册：PROFIBUS、波特率和网络地址','https://cache.industry.siemens.com/dl/files/582/1109582/att_22063/v1/s7200_system_manual_en-US.pdf'],
['国家标准：GB/T 13869-2017《用电安全导则》','https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=1C5996A8BAD63FF484CCFE024D98849C&refer=outter'],
['国家标准：GB/T 13869-2026《用电安全导则》','https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=BE454A97C36FCB5C7DB8EE345EC9A6FF']
];
function explanation(q){
var s=q.stem||'';
if(/电流互感器/.test(s)&&/90A/.test(s))return['电流互感器变比','150/5=30。题目给出的90A为一次侧指示值时，二次线圈电流=90×5/150=3A，因此选D。','计算式：I₂=I₁×5/150。'];
if(/P700/.test(s)&&/端子控制/.test(s))return['西门子变频器命令源','P0700用于选择命令源；MM420资料中P0700=2对应端子/数字输入控制。因此端子控制题应选P700=2。','P0700看“命令”，P1000看“频率给定”。'];
if(/S7-300.*S7-200|S7-200.*S7-300/.test(s)&&/Profibus|ProfiBus/.test(s))return['PROFIBUS通信','同一PROFIBUS网络中的设备需要使用匹配的通信速率，同时站地址要能区分不同设备，因此“设置不同通信速率”是不正确的。','西门子S7-200系统手册明确说明网络设备需使用相同波特率。'];
if(/MICROMASTER|P700|P1000/.test(s))return['变频器参数','P0700选择命令源，P1000选择频率设定源，两者可以独立设置。','做参数题先判断题干问“控制命令”还是“频率给定”。'];
if(/UPS/.test(s))return['UPS结构','后备式UPS在市电正常时通常由市电供电，停电后切换到电池逆变；在线式UPS则持续由逆变器向负载供电。','记忆：后备式有切换时间，在线式持续逆变。'];
if(/趋肤效应/.test(s))return['趋肤效应','交流频率升高时，电流更集中在导体表面，有效载流面积减小，交流电阻随之增大。','交流频率↑ → 趋肤效应↑ → 交流电阻↑。'];
if(/RLC串联.*谐振|串联电路.*谐振/.test(s)&&/频率/.test(s))return['RLC串联谐振','谐振时感抗与容抗相等。频率升高后，XL=2πfL增大，而XC=1/(2πfC)减小，因此电路呈感性。','f>f0：XL>XC，呈感性。'];
if(/0区/.test(s)&&/爆炸危险区域/.test(s))return['爆炸性气体环境分区','0区针对爆炸性气体环境，指爆炸性气体混合物连续出现或长期存在的场所；粉尘环境采用20区、21区、22区的划分体系。','0区关键词：气体 + 连续/长期。'];
if(/独立避雷针/.test(s)&&/接地电阻/.test(s))return['独立避雷针接地','题库此类题通常考独立避雷针接地装置与建筑物接地系统的设置要求。具体允许值应按题目采用的标准、场所类别和工程条件核对，不能脱离标准版本机械记忆。','这类数值题要优先核对适用标准版本。'];
if(/PI|P调节器|稳态误差/.test(s))return['PI调节器与稳态误差','比例环节对阶跃输入通常存在稳态误差；加入积分环节后，积分会持续累积偏差，理想条件下可消除阶跃输入的稳态误差。','P→有静差；PI→消除阶跃稳态误差。'];
if(/步进电机.*控制脉冲|脉冲发生器/.test(s))return['步进电机脉冲控制','脉冲发生器产生控制脉冲，脉冲频率决定步进速度；脉冲数量决定转过的步数/角位移，脉冲分配器负责按相序分配驱动信号。','发生器“出脉冲”，分配器“按相序分配”。'];
if(/晶闸管.*两个引脚|控制极和阴极/.test(s))return['晶闸管引脚识别','晶闸管SCR的三个电极是阳极A、阴极K和门极G。用万用表低阻/二极管档进行静态检测时，门极—阴极之间可表现出PN结特性。','A-K主回路，G-K为触发控制关系。'];
if(/电梯曳引机|交-直-交/.test(s))return['电梯变频调速','交-直-交变频器先整流得到直流环节，再逆变输出可变频、可变压的交流，适合交流电动机调速，并便于实现平滑启动和制动。','交-直-交：整流 → 直流环节 → 逆变。'];
if(/软启动器.*长时间|达不到额定/.test(s))return['软启动器故障分析','软启动器通过调节晶闸管导通角限制启动电流。长期达不到额定转速可能涉及启动参数、控制方式、晶闸管模块或负载异常，需要结合报警和现场机械状态逐项排查。','先分“参数/控制/功率器件/负载”四类。'];
if(/定时器T1中断入口地址|001BH/.test(s))return['8051中断入口地址','标准8051中，定时器/计数器0中断入口地址为000BH，定时器/计数器1中断入口地址为001BH，因此T1为001BH。','T0：000BH；T1：001BH。'];
if(/变频器.*不能启动|速度信号/.test(s))return['变频器启动故障','变频器已经处于启动状态但电机不能启动时，应检查运行命令源、频率给定、控制信号通信、输出状态以及保护/故障信息。题干若明确“速度信号丢失”，应优先考虑给定信号链路。','变频器不启动：先查命令，再查给定，再查保护。'];
if(/临时用电.*负荷计算/.test(s))return['临时用电负荷计算','不同设计阶段和负荷特性可采用不同的计算方法。需要系数法常用于工程负荷计算，二项式法更适用于具有明显设备组特征的负荷计算，单位指标法可用于方案阶段的估算。','关键是判断题干的设计阶段和负荷类型。'];
if(/方式2|定时.*计数器/.test(s)&&/单片机/.test(s))return['8051定时/计数器','经典8051的方式2是8位自动重装载方式，溢出后自动装入初值，因此计数容量为256个状态。','方式1=16位；方式2=8位自动重装载。'];
if(/Keil.*HEX|烧录.*文件|HEX/.test(s))return['单片机程序烧录','Keil C51程序经过编译、链接后常生成HEX文件，用于向单片机程序存储器烧录。','C源程序 → 编译/链接 → HEX → 烧录。'];
if(/超声波流量计/.test(s))return['超声波流量测量','利用超声波顺流、逆流传播速度或传播时间差来计算流体速度，再由管道截面积得到流量。','关键词：时间差/速度差法。'];
if(/运算放大.*输出级|输出电阻/.test(s))return['运算放大器输出级','输出级的重要作用是降低输出电阻、提高带负载能力，使放大器能驱动后级或负载。','输出级记忆：低输出电阻、强驱动。'];
if(/电缆.*低电阻故障|低电阻故障/.test(s))return['电缆故障诊断','低电阻故障表现为绝缘电阻降低，但导线连续性仍可能良好，因此需要结合绝缘电阻与导通检查判断。','低绝缘 + 导通良好。'];
if(/变频器.*散热|环境温度/.test(s))return['变频器散热与环境','变频器功率器件会产生热损耗，需要良好散热；温度波动较大还可能造成结露。具体散热方式应按设备型号和安装条件确定。','注意“必须”等绝对化表述。'];
if(/电机|异步电动机/.test(s)&&/频率|转速/.test(s))return['异步电动机调速','同步转速公式为n₁=60f/p，改变频率会改变同步转速，实际转子转速略低于同步转速。','n₁=60f/p，p为极对数。'];
if(/星.*三角|星三角|Y-Δ/.test(s)&&/启动/.test(s))return['星三角降压启动','星形启动时每相绕组电压降低，启动电流和启动转矩都会降低；理想条件下启动转矩约为三角形直接启动的1/3。','降电流的同时也会降低启动转矩。'];
if(/过零触发|过零控制/.test(s))return['过零控制','在交流电压接近零点时控制通断，通过改变一定周期内的导通周波数比例来调节平均功率。','关键词：过零、周波通断、平均功率。'];
if(/电容耦合/.test(s))return['电容耦合','电容具有隔直通交特性，可以隔离直流分量并传递交流信号；容量过小会使低频响应变差。','记忆：隔直通交。'];
if(/SPWM|正弦脉宽/.test(s))return['SPWM','SPWM通过参考正弦波与载波比较形成脉冲序列，规则采样等数字方法可以由软件计算开关时刻。','关键词：采样、比较、脉宽调制。'];
if(/电气安全|用电安全|验电|接地|安全生产/.test(s))return['电气安全','电气作业的核心是控制危险能量并采取相应防护措施。涉及标准条款时，应以题目适用年份和具体标准版本为准。','GB/T 13869-2017目前仍为现行标准；2026版将于2027-02-01实施。'];
if(/译码/.test(s)&&/编码/.test(s))return['编码与译码','译码是把编码后的信息恢复成原来所表示的信号或状态，通常可理解为编码的逆过程。','记忆：编码“表示”，译码“还原”。'];
if(/缺相/.test(s)&&/三相/.test(s))return['三相电动机缺相','三相电动机运行时失去任意一相都会造成缺相，可能导致电流异常、转矩下降和发热。','三相缺一相即可形成缺相运行。'];
if(q.type==='judge')return['判断题考点','本题判断应结合题干中的定义、条件和绝对化表述。完成后以题库给出的标准答案为准，再查看知识点提示。','遇到“必须、全部、任何、一定”等词，要重点核对条件。'];
if(q.type==='multiple')return['多项选择题考点','多选题需要同时满足题干条件，不能因为某个选项局部正确就直接选择。建议逐项判断其适用条件。','答案必须与标准答案的选项集合完全一致。'];
return['单项选择题考点','根据题干关键词、基本原理和选项之间的条件关系进行排除。','先看题干问的是“正确”还是“错误”，再逐项核对。'];
}
function currentQ(){try{return DATA.find(function(x){return x.id===setId}).questions[order[idx]]}catch(e){return null}}
function renderTools(){
var wrap=document.querySelector('.wrap');if(!wrap||window.__examMode)return;
var bar=document.querySelector('.xbar');if(!bar){bar=document.createElement('div');bar.className='xbar';wrap.insertBefore(bar,document.querySelector('#app'))}
var k=key(),f=!!state.fav[k];
bar.innerHTML='<button id="xfav" class="'+(f?'on':'')+'">'+(f?'★ 已收藏':'☆ 收藏')+'</button><button id="xexp">📖 解析</button><button id="xwrong">📕 错题本 '+Object.keys(state.wrong).length+'</button><button id="xnavbtn">🧭 答题卡</button><button id="xstats">📊 统计</button><button id="xauto" class="'+(state.auto?'on':'')+'">⏭ 自动下一题 '+(state.auto?'开':'关')+'</button><button id="xdark" class="'+(state.dark?'on':'')+'">'+(state.dark?'☀️ 日间':'🌙 黑夜')+'</button><button id="xexam">📝 模拟考试</button>';
document.getElementById('xfav').onclick=function(){state.fav[k]=!state.fav[k];if(!state.fav[k])delete state.fav[k];save();renderTools()};
document.getElementById('xexp').onclick=function(){showExplanation()};
document.getElementById('xwrong').onclick=showWrong;document.getElementById('xnavbtn').onclick=showNav;document.getElementById('xstats').onclick=showStats;
document.getElementById('xauto').onclick=function(){state.auto=!state.auto;save();renderTools()};
document.getElementById('xdark').onclick=function(){state.dark=!state.dark;document.body.classList.toggle('dark',state.dark);save();renderTools()};
document.getElementById('xexam').onclick=startExam;
}
function showNav(){
var old=document.querySelector('.xnav');if(old){old.remove();return}
var nav=document.createElement('div');nav.className='xnav';var s=DATA.find(function(x){return x.id===setId});
var h='<div class="xnavhead"><span>题目导航（第'+setId+'套）</span><span class="xhint">绿=已答 · 红=错题 · 蓝框=当前</span></div><div class="xnums">';
for(var i=0;i<90;i++){var q=s.questions[order[i]],kk=metaKeyFor(q),cls='xnum '+(state.answered[kk]?'done ':'')+(state.wrong[kk]?'wrong ':'')+(i===idx?'cur':'');h+='<button class="'+cls+'" data-i="'+i+'">'+(i+1)+'</button>}
h+='</div>';nav.innerHTML=h;document.querySelector('.wrap').insertBefore(nav,document.querySelector('#app'));nav.querySelectorAll('.xnum').forEach(function(b){b.onclick=function(){idx=+b.dataset.i;render();showNav()}})
}
function metaKeyFor(q){return '第 '+setId+'套 · 第 '+q.n+'题 · '+(q.type==='single'?'单选':q.type==='multiple'?'多选':'判断')+'|'+q.stem}
function sourcesFor(q){
var s=q.stem||'',a=[];
if(/MICROMASTER|P700|P0700|P1000|变频器/.test(s))a.push(refs[0]);
if(/S7-200|S7-300|PROFIBUS|波特率|网络地址/.test(s))a.push(refs[1]);
if(/用电安全|验电|接地|安全生产|漏电|手持电动工具/.test(s))a.push(refs[2]);
if(!a.length)a.push(['电工基础知识参考：题目所涉及的基本电路、电机、电子技术原理','https://baike.baidu.com/']);
return a;
}
function sourceHtml(q){
return sourcesFor(q).map(function(x){return '<a href="'+x[1]+'" target="_blank" rel="noopener">'+esc(x[0])+'</a>'}).join('<br>');
}
function panel(html){var old=document.querySelector('.xpanel');if(old)old.remove();var p=document.createElement('div');p.className='xpanel';p.innerHTML=html;document.querySelector('.card')?.appendChild(p)}
function showExplanation(q){q=q||currentQ();if(!q)return;var e=explanation(q);panel('<h3>📖 题目解析</h3><div><span class="tag">考点</span>'+esc(e[0])+'</div><p>'+esc(e[1])+'</p><div class="xhint">💡 '+esc(e[2])+'</div><div class="xsource">资料核对：西门子设备参数题参考官方手册；电气安全标准参考国家标准平台。具体产品参数以对应型号说明书为准。</div>')}
function showWrong(){var a=Object.entries(state.wrong),h='<h3>📕 错题本</h3>';h+=a.length?a.map(function(x){return'<div class="xwrongitem"><b>'+esc(x[1].set||'')+'</b> '+esc(x[1].q||'')+'</div>').join(''):'<div class="xhint">还没有错题。答错后自动加入。</div>';panel(h)}
function showStats(){var a=Object.keys(state.answered).length,r=Object.keys(state.right).length,f=Object.keys(state.fav).length,w=Object.keys(state.wrong).length,rate=a?Math.round(r/a*100):0;panel('<h3>📊 学习统计</h3><div class="xstat"><div><b>'+a+'</b>已答</div><div><b>'+r+'</b>答对</div><div><b>'+rate+'%</b>正确率</div></div><div class="xstat"><div><b>'+w+'</b>错题</div><div><b>'+f+'</b>收藏</div><div><b>'+(a-r)+'</b>答错</div></div><div class="xhint" style="margin-top:10px">学习数据保存在当前浏览器本地。</div>')}
function autoNext(){if(window.__examMode||!state.auto)return;setTimeout(function(){var b=document.getElementById('next');if(b&&b.style.display!=='none')b.click()},1200)}
var exam=null;
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function allQuestions(){var a=[];DATA.forEach(function(s){s.questions.forEach(function(q){a.push(Object.assign({},q,{setId:s.id,sourceN:q.n}))})});return a}
function startExam(){
window.__examMode=true;var all=allQuestions(),single=shuffle(all.filter(function(q){return q.type==='single'})),multi=shuffle(all.filter(function(q){return q.type==='multiple'})),judge=shuffle(all.filter(function(q){return q.type==='judge'}));
exam={qs:shuffle(single.slice(0,60).concat(multi.slice(0,10),judge.slice(0,20))),answers:{},pos:0,seconds:90*60,done:false};
renderExam();exam.timer=setInterval(function(){exam.seconds--;updateTimer();if(exam.seconds<=0){clearInterval(exam.timer);finishExam(true)}},1000);
}
function updateTimer(){var e=document.getElementById('examTimer');if(e)e.textContent=fmt(exam.seconds)}
function typeName(t){return t==='single'?'单选':t==='multiple'?'多选':'判断'}
function answerLabel(a){return a&&a.length?a.join('、'):'未作答'}
function renderExam(){
var q=exam.qs[exam.pos],sel=exam.answers[exam.pos]||[],app=document.getElementById('app'),pct=Math.round((exam.pos+1)/exam.qs.length*100);
app.innerHTML='<div class="exam-wrap"><div class="exam-head"><div class="exam-headrow"><button class="btn secondary" id="exitExam" style="flex:0 0 auto;padding:8px 10px">退出</button><div class="exam-title">📝 模拟考试 · '+(exam.pos+1)+'/90</div><div class="timer" id="examTimer">'+fmt(exam.seconds)+'</div></div><div class="exam-progress"><i style="width:'+pct+'%"></i></div></div><div class="exam-card"><div class="meta"><span>第'+q.setId+'套 · 原第'+q.sourceN+'题 · <span class="pill">'+typeName(q.type)+'</span></span></div><div class="exam-q">'+esc(q.stem)+'</div><div id="examOpts">'+examOptions(q,sel)+'</div><div class="foot"><button class="btn secondary" id="prevE" '+(exam.pos?'':'disabled')+'>上一题</button><button class="btn" id="nextE">'+(exam.pos===89?'提交试卷':'下一题')+'</button></div><div class="exam-nav">'+exam.qs.map(function(x,i){return'<button class="exam-num '+(exam.answers[i]?.length?'done ':'')+(i===exam.pos?'cur':'')+'" data-e="'+i+'">'+(i+1)+'</button>'}).join('')+'</div></div></div>';
document.getElementById('exitExam').onclick=function(){if(confirm('退出模拟考试？本次考试将不会计入成绩。')){clearInterval(exam.timer);window.__examMode=false;render()}};
document.querySelectorAll('.exam-opt').forEach(function(b){b.onclick=function(){selectExam(q,b.dataset.k)}});
document.getElementById('prevE').onclick=function(){if(exam.pos>0){exam.pos--;renderExam()}};
document.getElementById('nextE').onclick=function(){if(exam.pos===89)finishExam(false);else{exam.pos++;renderExam()}};
document.querySelectorAll('.exam-num').forEach(function(b){b.onclick=function(){exam.pos=+b.dataset.e;renderExam()}});
}
function examOptions(q,sel){var opts=q.type==='judge'?[{key:'√',text:'正确'},{key:'×',text:'错误'}]:q.options;return opts.map(function(o){return'<button class="exam-opt '+(sel.includes(o.key)?'sel':'')+'" data-k="'+o.key+'"><b>'+o.key+'.</b> '+esc(o.text)+'</button>'}).join('')}
function selectExam(q,k){var cur=exam.answers[exam.pos]||[];if(q.type==='multiple'){if(cur.includes(k))cur=cur.filter(function(x){return x!==k});else cur=cur.concat(k);exam.answers[exam.pos]=cur}else exam.answers[exam.pos]=[k];renderExam()}
function fmt(n){var m=Math.floor(n/60),s=n%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
function finishExam(timeout){
if(exam.done)return;exam.done=true;clearInterval(exam.timer);var score=0,counts={single:0,multiple:0,judge:0},rights={single:0,multiple:0,judge:0};
exam.qs.forEach(function(q,i){counts[q.type]++;var a=exam.answers[i]||[],ok=a.length===q.answer.length&&q.answer.every(function(x){return a.includes(x)});if(ok){score++;rights[q.type]++}});
var app=document.getElementById('app'),h='<div class="exam-wrap"><div class="exam-card"><h2>🎓 模拟考试完成</h2><div class="score">'+score+' / 90</div><p>正确率：'+Math.round(score/90*100)+'%'+(timeout?' · 时间到':'')+'</p><div class="xstat"><div><b>'+rights.single+'/'+counts.single+'</b>单选</div><div><b>'+rights.multiple+'/'+counts.multiple+'</b>多选</div><div><b>'+rights.judge+'/'+counts.judge+'</b>判断</div></div><div class="foot"><button class="btn secondary" id="backStudy">返回刷题</button><button class="btn" id="showAllExp">逐题解析</button></div></div><div id="examReview"></div></div>';
app.innerHTML=h;document.getElementById('backStudy').onclick=function(){window.__examMode=false;render()};document.getElementById('showAllExp').onclick=function(){document.getElementById('examReview').innerHTML=examReview()};document.getElementById('examReview').innerHTML=examReview()}
function examReview(){var h='<div class="exam-card" style="margin-top:14px"><h3>📚 逐题解析</h3>';exam.qs.forEach(function(q,i){var a=exam.answers[i]||[],ok=a.length===q.answer.length&&q.answer.every(function(x){return a.includes(x)}),e=explanation(q);h+='<div class="review-item '+(ok?'review-ok':'review-bad')+'"><b>第'+(i+1)+'题 · '+typeName(q.type)+'</b><div style="margin-top:7px;white-space:pre-wrap">'+esc(q.stem)+'</div><p>你的答案：<b>'+esc(answerLabel(a))+'</b><br>正确答案：<b>'+esc(answerLabel(q.answer))+'</b></p><div class="review-exp"><b>解析：'+esc(e[0])+'</b><br>'+esc(e[1])+'<br><span class="xhint">提示：'+esc(e[2])+'</span></div></div>'});h+='</div>';return h}
var lastKey='',autoMark=false;
var obs=new MutationObserver(function(){
if(window.__examMode)return;
var now=key();if(now!==lastKey){lastKey=now;setTimeout(renderTools,0)}
if(document.querySelector('.result')&&!autoMark){autoMark=true;var k=key(),q=currentQ(),txt=document.querySelector('.result')?.innerText||'';state.answered[k]=1;var good=/回答正确|答对/.test(txt)&&!/错误|不正确/.test(txt);if(good)state.right[k]=1;else state.wrong[k]={set:'第'+(q?.setId||setId)+'套',q:'第'+(q?.n||'')+'题'};save();renderTools();autoNext();setTimeout(function(){autoMark=false},1000)}
});
obs.observe(document.body,{childList:true,subtree:true,characterData:true});
document.body.classList.toggle('dark',state.dark);
setTimeout(function(){var top=document.querySelector('.bar');if(top&&!document.getElementById('xexamTop')){var b=document.createElement('button');b.id='xexamTop';b.className='select';b.textContent='📝 模拟考试';b.onclick=startExam;top.appendChild(b)}renderTools()},150);

})();