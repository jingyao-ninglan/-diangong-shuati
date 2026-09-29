/* 电工高级题库稳定修复层 v12
   核心原则：
   1. state.card 是唯一答题状态来源
   2. 不再创建第二套 state
   3. 用事件捕获层接管“下一题/跳过”，避免被旧脚本覆盖
   4. 答题卡打开后实时同步颜色
   5. localStorage 双写 v8/v12，刷新后恢复
*/
(function(){
"use strict";

var OLD_STORE="diangong2024_v8";
var STORE="diangong2024_v12";

function escFix(v){
  return String(v==null?"":v).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;',"'":"&#39;"}[c];
  });
}

function getState(){
  try{
    if(typeof state!=="undefined" && state) return state;
  }catch(e){}
  return {};
}

function persist(){
  try{
    if(typeof state!=="undefined"){
      state.position={setId:setId,mode:mode,random:!!random,idx:idx};
      if(typeof save==="function") save();
      var raw=JSON.stringify(state);
      localStorage.setItem(STORE,raw);
      localStorage.setItem(OLD_STORE,raw);
    }
  }catch(e){}
}

function migrate(){
  try{
    var s=getState();
    var v12=localStorage.getItem(STORE);
    var v8=localStorage.getItem(OLD_STORE);
    if(v12){
      var a=JSON.parse(v12);
      if(a&&typeof a==="object"){
        Object.keys(a).forEach(function(k){s[k]=a[k]});
      }
    }else if(v8){
      var b=JSON.parse(v8);
      if(b&&typeof b==="object"){
        Object.keys(b).forEach(function(k){s[k]=b[k]});
      }
    }
    s.card=s.card&&typeof s.card==="object"?s.card:{};
    s.answered=s.answered&&typeof s.answered==="object"?s.answered:{};
    s.right=s.right&&typeof s.right==="object"?s.right:{};
    s.wrong=s.wrong&&typeof s.wrong==="object"?s.wrong:{};
    s.fav=s.fav&&typeof s.fav==="object"?s.fav:{};
    if(typeof s.explain!=="boolean")s.explain=true;
    if(typeof s.dark!=="boolean")s.dark=false;
  }catch(e){}
}

function currentItem(){
  try{return pool[order[idx]]||null}catch(e){return null}
}
function currentKey(){
  var it=currentItem();
  try{return it?qCardKey(it):null}catch(e){return null}
}

function theme(){
  var s=getState(),on=!!s.dark;
  document.body.classList.toggle("dark",on);
  document.documentElement.classList.toggle("dark",on);
  var b=document.getElementById("xdark");
  if(b)b.textContent=on?"☀️ 白天模式":"🌙 夜间模式";
}

function installCss(){
  if(document.getElementById("dg-v12-css"))return;
  var st=document.createElement("style");
  st.id="dg-v12-css";
  st.textContent=
    ".dg-card-panel{margin-top:14px;padding:14px;border:1px solid #cbd5e1;border-radius:14px;background:#fff}" +
    ".dark .dg-card-panel{background:#111827;border-color:#374151;color:#e5e7eb}" +
    ".dg-card-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}" +
    ".dg-card-grid button{min-height:44px;border:1px solid #cbd5e1;border-radius:9px;font-weight:800;cursor:pointer}" +
    ".dark .dg-card-grid button{border-color:#475569;color:#e5e7eb}" +
    ".dg-explain{margin-top:14px;padding:15px;border:1px solid #cbd5e1;border-radius:14px;background:#f8fafc;line-height:1.8}" +
    ".dark .dg-explain{background:#172033;border-color:#374151;color:#e5e7eb}" +
    ".dg-pic-error{padding:10px;border:1px dashed #ef4444;border-radius:8px;color:#b91c1c;background:#fff7f7;text-align:center;margin:8px 0}" +
    ".dark .dg-pic-error{background:#3b1111;color:#fecaca;border-color:#ef4444}";
  document.head.appendChild(st);
}

function cardHtml(){
  var s=getState(),store=s.card||{},html="";
  for(var i=0;i<pool.length;i++){
    var it=pool[order[i]],rec=store[qCardKey(it)]||{},st=rec.status||"un";
    var bg=st==="right"?"#dcfce7":st==="wrong"?"#fee2e2":st==="skip"?"#fef3c7":i===idx?"#dbeafe":"#f3f4f6";
    var fg=st==="right"?"#166534":st==="wrong"?"#991b1b":st==="skip"?"#92400e":"#334155";
    var mark=st==="right"?"✓":st==="wrong"?"×":st==="skip"?"—":"";
    html+="<button data-dg-index='"+i+"' style='background:"+bg+";color:"+fg+"'>"+(i+1)+" "+mark+"</button>";
  }
  return html;
}

function refreshCardPanel(){
  var p=document.getElementById("dgCardPanel");
  if(!p)return;
  p.querySelector(".dg-card-grid").innerHTML=cardHtml();
}

function cardPanel(){
  var card=document.querySelector("#app .card");
  if(!card)return;
  var old=document.getElementById("dgCardPanel");
  if(old)old.remove();

  var p=document.createElement("div");
  p.id="dgCardPanel";
  p.className="dg-card-panel";
  p.innerHTML="<h3 style='margin:0 0 12px'>🗂 答题卡总览</h3>"+
    "<div class='dg-card-grid'>"+cardHtml()+"</div>"+
    "<div style='margin-top:10px;font-size:13px'>🟩正确　🟥错误　🟨跳过　⬜未答　🟦当前</div>";
  card.appendChild(p);

  p.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("[data-dg-index]");
    if(!b)return;
    var n=Number(b.getAttribute("data-dg-index"));
    if(!Number.isFinite(n)||n<0||n>=pool.length)return;
    idx=n;
    persist();
    render();
    setTimeout(function(){repair();},30);
  });
}

function explanation(){
  var it=currentItem();
  if(!it)return;
  var q=it.q,card=document.querySelector("#app .card");
  if(!card)return;
  var old=document.getElementById("dgExplainV12");
  if(old)old.remove();

  var p=document.createElement("div");
  p.id="dgExplainV12";
  p.className="dg-explain";
  var body="";
  try{
    body=typeof explainText==="function"?explainText(q):"";
  }catch(e){}
  if(!body)body="<b>解题思路：</b>结合题干条件逐项核对选项，并以题库给出的正确答案为准。";

  var opts=q.options||[];
  if(q.type==="judge")opts=[{key:"√",text:"正确"},{key:"×",text:"错误"}];

  var h="<h3 style='margin:0 0 8px'>📖 详细解析</h3>"+
    "<p><b>正确答案：</b>"+escFix((q.answer||[]).join("、"))+"</p>"+
    "<div>"+body+"</div>";

  if(opts.length){
    h+="<div style='margin-top:12px'><b>逐项判断：</b></div>";
    opts.forEach(function(o){
      var ok=(q.answer||[]).indexOf(o.key)>=0;
      h+="<div style='margin-top:7px'><b>"+escFix(o.key)+"：</b>"+escFix(o.text)+"　"+(ok?"✅ 正确":"❌ 错误")+"</div>";
    });
  }
  p.innerHTML=h;
  card.appendChild(p);
}

function repairImages(){
  document.querySelectorAll(".q,.opt").forEach(function(el){
    if(el.textContent.indexOf("[pic]")<0)return;
    Array.from(el.childNodes).forEach(function(n){
      if(n.nodeType!==3||n.nodeValue.indexOf("[pic]")<0)return;
      var parts=n.nodeValue.split("[pic]"),frag=document.createDocumentFragment();
      parts.forEach(function(x,i){
        if(x)frag.appendChild(document.createTextNode(x));
        if(i<parts.length-1){
          var d=document.createElement("div");
          d.className="dg-pic-error";
          d.textContent="⚠️ 原题图片资源缺失";
          frag.appendChild(d);
        }
      });
      n.parentNode.replaceChild(frag,n);
    });
  });
}

function repair(){
  try{theme()}catch(e){}
  try{repairImages()}catch(e){}
  refreshCardPanel();
}

function goForward(){
  if(typeof goNext==="function"){
    goNext();
  }else{
    if(idx<pool.length-1)idx++;
    else idx=pool.length;
    render();
  }
  persist();
  setTimeout(repair,20);
}

function doSkip(){
  var it=currentItem();
  if(!it)return;
  var s=getState(),k=qCardKey(it);
  s.card=s.card||{};
  s.card[k]={status:"skip",chosen:[]};
  s.answered=s.answered||{};
  s.answered[k]=false;
  window.dgStatus=s.card;
  persist();
  goForward();
}

function doNext(){
  var it=currentItem();
  if(!it)return;
  var q=it.q;
  var next=document.getElementById("next");
  var isSubmit=next&&/提交答案/.test(next.textContent||"");

  if(q.type==="multiple" && isSubmit){
    try{evaluate(q)}catch(e){}
    setTimeout(repair,20);
    return;
  }

  goForward();
}

function handleCapture(e){
  var t=e.target&&e.target.closest?e.target.closest("#next,#skip,#dgNextBtn"):null;
  if(!t)return;

  /* 彻底阻断旧脚本/旧固定导航的onclick，避免多个版本互相覆盖 */
  e.preventDefault();
  e.stopImmediatePropagation();

  if(t.id==="skip"){
    doSkip();
  }else{
    doNext();
  }
}

function installNavigation(){
  document.addEventListener("click",handleCapture,true);

  /* 删除上一版会与主按钮竞争的固定底部导航 */
  var old=document.getElementById("dgFixedNav");
  if(old)old.remove();

  /* 下一题按钮不再依赖旧的 rec 判断 */
  repair();
}

function restorePosition(){
  try{
    var s=getState(),p=s.position;
    if(!p)return;
    if(Number(p.setId)>=1&&Number(p.setId)<=10)setId=Number(p.setId);
    if(["normal","random","mock"].indexOf(p.mode)>=0)mode=p.mode;
    random=!!p.random;
    if(typeof buildPool==="function")buildPool();
    idx=Math.max(0,Math.min(Number(p.idx)||0,pool.length-1));
    if(typeof render==="function")render();
  }catch(e){}
}

window.dgPrev=function(){
  try{
    if(idx>0){
      idx--;
      persist();
      render();
      setTimeout(repair,20);
    }
  }catch(e){}
};

window.dgCard=cardPanel;
window.dgExplain=explanation;
window.toggleDark=function(){
  var s=getState();
  s.dark=!s.dark;
  persist();
  theme();
};

document.addEventListener("click",function(e){
  var b=e.target&&e.target.closest?e.target.closest("#xdark"):null;
  if(!b)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  var s=getState();
  s.dark=!s.dark;
  persist();
  theme();
},true);

/* 答题完成后，原 evaluate() 会先执行；事件冒泡到这里时刷新已打开的答题卡 */
document.addEventListener("click",function(e){
  var t=e.target&&e.target.closest?e.target.closest(".opt"):null;
  if(!t)return;
  setTimeout(function(){
    try{persist();repair()}catch(err){}
  },30);
},false);

window.addEventListener("pagehide",persist);
window.addEventListener("beforeunload",persist);

migrate();
installCss();
restorePosition();
installNavigation();
repair();
})();