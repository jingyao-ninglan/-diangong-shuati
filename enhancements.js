(function(){
var css='.xbar{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.xbar button{border:1px solid #d8dee8;background:#fff;border-radius:10px;padding:9px 11px;font-weight:700;color:#344054}.xbar button.on{background:#eef4ff;border-color:#2563eb;color:#1d4ed8}.xpanel{background:#f8fafc;border:1px solid #dbe3ef;border-radius:14px;padding:14px;margin-top:14px;line-height:1.7}.xpanel h3{margin:0 0 8px;font-size:16px}.xpanel .tag{display:inline-block;background:#eaf1ff;color:#1d4ed8;border-radius:99px;padding:2px 8px;font-size:12px;font-weight:800;margin-right:6px}.xsource{font-size:12px;color:#667085;margin-top:10px}.xsource a{color:#2563eb;text-decoration:none}.xstat{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.xstat div{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:9px;text-align:center}.xstat b{display:block;font-size:18px}.xhint{color:#667085;font-size:13px}.xwrongitem{padding:8px;border-bottom:1px solid #e5e7eb;cursor:pointer}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var KEY='diangong2024_v2',state=JSON.parse(localStorage.getItem(KEY)||'{"fav":{},"wrong":{},"answered":{},"right":{}}');
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function stem(){return document.querySelector('.q')?.innerText?.trim()||''}
function meta(){return document.querySelector('.meta')?.innerText?.trim()||''}
function key(){return meta().replace(/\s+/g,' ')+'|'+stem()}
function esc(x){return String(x).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]})}
var refs=[
['西门子：MM420/430/440 变频器启停和调速','https://www.ad.siemens.com.cn/productportal/prods/mm4/drv/006speed/control.html'],
['西门子：S7-200 与 S7-300 PROFIBUS 通讯','https://www.ad.siemens.com.cn/download/documentdetail_1360.html'],
['全国标准信息公共服务平台：GB/T 13869-2017 用电安全导则','https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=1C5996A8BAD63FF484CCFE024D98849C&refer=outter'],
['机械工业出版社：电工（高级工）','https://www.cmpedu.com/books/book/5609251.htm']
];
function explanation(q){
if(/电流互感器/.test(q)&&/90A/.test(q))return['电流互感器变比','150/5=30，即一次电流是二次电流的30倍。电流表指示90A时，二次线圈电流=90÷30=3A，因此选D。','计算：I₂=I₁×5/150。'];
if(/P700/.test(q)&&/端子控制/.test(q))return['西门子变频器命令源','P700用于选择命令源；MM4系列中P700=2表示数字输入端子控制启动。','注意区分P700（命令源）和P1000（频率给定源）。'];
if(/S7-300.*S7-200|S7-200.*S7-300/.test(q)&&/Profibus|ProfiBus/.test(q))return['PROFIBUS通信参数','网络站地址必须区分；同一通信网络的通信速率需要匹配，因此“分配不同通信速率”属于错误做法。','西门子资料明确说明两者通信时地址应不同、通信速率应一致。'];
if(/振荡器.*放大器|放大器.*振荡器/.test(q))return['振荡器与放大器','放大器需要外部输入信号并对其进行放大；振荡器依靠正反馈和选频网络，在没有外部周期激励时也能产生周期信号。','记忆：放大器“放大已有信号”，振荡器“自己产生信号”。'];
if(/MICROMASTER|P700|P1000/.test(q))return['变频器命令源与频率源','西门子MM系列把控制命令和频率给定分开设置：P700选择命令源，P1000选择频率给定源。','先判断题干问的是“谁控制启停”还是“频率从哪里来”。'];
if(/UPS/.test(q))return['UPS基本结构','后备式UPS结构简单、成本较低，市电正常时主要由市电供电，停电时才切换到蓄电池逆变供电，因此存在切换时间。','记忆：后备式=有切换时间；在线式=持续逆变。'];
if(/趋肤效应/.test(q))return['趋肤效应','交流电频率升高时，电流更集中在导体表面，有效载流截面积减小，因此交流电阻通常增大。','交流 + 频率升高 → 趋肤效应增强 → 电阻增大。'];
if(/方式2|定时.*计数器/.test(q)&&/单片机/.test(q))return['8051定时/计数器方式2','经典8051的方式2是8位自动重装载方式，溢出后自动装入初值，按8位计数，最大计数状态为256。','方式1为16位，方式2为8位自动重装载。'];
if(/Keil.*HEX|烧录.*文件|HEX/.test(q))return['单片机程序文件','Keil C51编译链接后通常生成HEX文件，HEX是烧录单片机程序的常见文件格式。','C源程序 → 编译/链接 → HEX → 烧录。'];
if(/温度继电器/.test(q)&&/制冷/.test(q))return['制冷设备温度继电器','常见温度控制机构可利用感温元件造成压力变化，再推动触点动作，因此这类题常考压力作用原理。','注意题目问的是“推动触点”的物理量。'];
if(/超声波流量计/.test(q))return['超声波流量测量','利用超声波顺流和逆流传播速度不同，通过传播时间差求流体速度，再结合截面积计算流量。','关键词：传播时间差、速度差法。'];
if(/运算放大.*输出级|输出电阻/.test(q))return['运算放大器输出级','输出级用于降低输出电阻、提高负载驱动能力，使前级信号能够稳定驱动负载。','输出级重点记“低输出电阻、强带载能力”。'];
if(/低电阻故障/.test(q))return['电缆低电阻故障','低电阻故障表现为绝缘电阻降低，但导体连续性仍可能良好，判断时应结合绝缘电阻与导通检查。','重点：低绝缘 + 导通良好。'];
if(/变频器.*散热|环境温度/.test(q))return['变频器环境与散热','功率器件损耗会发热，良好散热有助于控制温升；温度变化较大还可能导致结露。并非所有变频器都必须使用主动散热装置。','注意“必须”等绝对化表述。'];
if(/电机|异步电动机/.test(q)&&/频率|转速/.test(q))return['异步电动机与频率','同步转速满足 n₁=60f/p。改变频率会改变同步转速，实际转子转速略低于同步转速。','公式：n₁=60f/p，p为极对数。'];
if(/三相.*整流|整流电路/.test(q)&&/cos|控制角|α|平均值/.test(q))return['三相可控整流','三相桥式全控整流连续电流条件下常用 Ud≈2.34U₂cosα。控制角α增大，平均直流输出电压降低。','先确认题目中的U₂定义。'];
if(/星.*三角|Y-Δ|星三角/.test(q)&&/启动转矩|启动电流/.test(q))return['星—三角降压启动','星形启动时每相绕组电压降低，启动电流和启动转矩都降低；理想条件下启动转矩约为三角形直接启动的1/3。','记忆：Y启动能降启动电流，也会降低启动转矩。'];
if(/过零控制/.test(q))return['过零控制','过零调功在交流电压过零附近控制通断，通过改变导通周期数与总周期数比例调节平均功率。','关键词：过零、周波通断、平均功率。'];
if(/电容耦合/.test(q))return['电容耦合','电容具有隔直通交特性，可隔离直流分量并传递交流信号；容量过小会使低频响应变差。','记忆：电容“隔直通交”，低频更容易受影响。'];
if(/SPWM|正弦脉宽/.test(q))return['SPWM基本原理','SPWM通过参考正弦波与载波的比较形成脉冲序列；规则采样等方法可由软件计算开关时刻。','关键词：采样、比较、脉宽调制。'];
if(/电气安全|用电安全|验电|接地|安全/.test(q))return['电气安全基本原则','电气检修首先控制危险能量：停电、验电、采取防止误送电措施，并按作业条件实施接地、警示和防护。','具体要求以题目适用标准和现场规程为准。'];
return['本题考点解析','先抓题干中的参数、公式、条件以及“正确/错误”等限定词，再按所属知识点排除选项。','该题暂未匹配专门模板，可继续补充逐题解析。'];
}
function getSetQ(){var m=meta(),a=m.match(/第\s*(\d+)\s*套/),b=m.match(/第\s*(\d+)\s*题/);return{set:a?+a[1]:0,q:b?+b[1]:0}}
function render(){
var wrap=document.querySelector('.wrap');if(!wrap)return;
var bar=document.querySelector('.xbar');if(!bar){bar=document.createElement('div');bar.className='xbar';wrap.insertBefore(bar,document.querySelector('#app'))}
var k=key(),f=!!state.fav[k];
bar.innerHTML='<button id="xfav" class="'+(f?'on':'')+'">'+(f?'★ 已收藏':'☆ 收藏本题')+'</button><button id="xexp">📖 查看解析</button><button id="xwrong">错题本 <b>'+Object.keys(state.wrong).length+'</b></button><button id="xstats">学习统计</button><button id="xsrc">资料依据</button>';
var old=document.querySelector('.xpanel');if(old)old.remove();
document.getElementById('xfav').onclick=function(){state.fav[k]=!state.fav[k];if(!state.fav[k])delete state.fav[k];save();render()};
document.getElementById('xexp').onclick=showExplanation;document.getElementById('xwrong').onclick=showWrong;document.getElementById('xstats').onclick=showStats;document.getElementById('xsrc').onclick=showSources;
}
function panel(html){var old=document.querySelector('.xpanel');if(old)old.remove();var p=document.createElement('div');p.className='xpanel';p.innerHTML=html;document.querySelector('.card')?.appendChild(p)}
function showExplanation(){var e=explanation(stem());panel('<h3>📖 题目解析</h3><div><span class="tag">考点</span>'+esc(e[0])+'</div><p>'+esc(e[1])+'</p><div class="xhint">💡 '+esc(e[2])+'</div><div class="xsource">解析依据：结合公开教材与技术资料整理；具体产品参数以对应型号说明书为准。</div>')}
function showWrong(){var a=Object.entries(state.wrong),h='<h3>📕 错题本</h3>';h+=a.length?a.map(function(x){return'<div class="xwrongitem"><b>'+esc(x[1].set||'')+'</b> '+esc(x[1].q||'')+'</div>'}).join(''):'<div class="xhint">还没有错题。答错题目后会自动加入。</div>';panel(h)}
function showStats(){var a=Object.keys(state.answered).length,r=Object.keys(state.right).length,f=Object.keys(state.fav).length,w=Object.keys(state.wrong).length,rate=a?Math.round(r/a*100):0;panel('<h3>📊 学习统计</h3><div class="xstat"><div><b>'+a+'</b>已答</div><div><b>'+r+'</b>答对</div><div><b>'+rate+'%</b>正确率</div></div><div class="xstat"><div><b>'+w+'</b>错题</div><div><b>'+f+'</b>收藏</div><div><b>'+(a-r)+'</b>答错</div></div><div class="xhint" style="margin-top:10px">数据保存在当前浏览器本地。</div>')}
function showSources(){var h='<h3>🔎 解析资料依据</h3>';refs.forEach(function(x){h+='<div class="xsource"><a href="'+x[1]+'" target="_blank" rel="noopener">'+esc(x[0])+'</a></div>'});h+='<div class="xsource">题库原题可能来自不同版本资料；涉及标准号、具体设备参数时，应以题目适用年份和设备型号的原始资料为准。</div>';panel(h)}
function track(){var k=key();if(!k||!stem())return;var sq=getSetQ();state.answered[k]=1;var txt=document.querySelector('.result')?.innerText||'';var good=/回答正确|答对/.test(txt)&&!/错误|不正确/.test(txt);if(good)state.right[k]=1;else state.wrong[k]={set:'第'+sq.set+'套',q:'第'+sq.q+'题'};save();render()}
var last='',obs=new MutationObserver(function(){var now=key();if(now!==last){last=now;setTimeout(render,0)}if(document.querySelector('.result')&&!document.querySelector('.xtracked')){var m=document.createElement('i');m.className='xtracked';m.style.display='none';document.body.appendChild(m);track();setTimeout(function(){m.remove()},0)}});
obs.observe(document.body,{childList:true,subtree:true,characterData:true});setTimeout(render,100);
})();