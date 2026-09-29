/* 电工高级题库稳定修复层 v11
   只负责：主题、图片兜底、解析、答题卡、进度同步。
   不接管原网页的 answer/evaluate/goNext/skip，避免按钮状态互相覆盖。
*/
(function(){
"use strict";

var STORE="diangong2024_v8";

function saveFix(){
  try{
    if(typeof save==="function") save();
    else localStorage.setItem(STORE,JSON.stringify(state));
  }catch(e){}
}

function getState(){
  try{
    if(typeof state!=="undefined") return state;
  }catch(e){}
  try{
    var raw=localStorage.getItem(STORE);
    return raw?JSON.parse(raw):{};
  }catch(e){return {};}
}

function themeFix(){
  var s=getState(), on=!!s.dark;
  document.body.classList.toggle("dark",on);
  document.documentElement.classList.toggle("dark",on);
  var b=document.getElementById("xdark");
  if(b) b.textContent=on?"☀️ 白天模式":"🌙 夜间模式";
}

function installCss(){
  if(document.getElementById("dg-fix-css"))return;
  var s=document.createElement("style");
  s.id="dg-fix-css";
  s.textContent=
    ".dg-explain{margin-top:14px;padding:16px;border:1px solid #cbd5e1;border-radius:14px;background:#f8fafc;color:#172033;line-height:1.8}" +
    ".dark .dg-explain{background:#172033;color:#e5e7eb;border-color:#475569}" +
    ".dg-card-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}" +
    ".dg-card-grid button{border:1px solid #cbd5e1;border-radius:8px;padding:8px;cursor:pointer;font-weight:700}" +
    ".dg-pic-error{padding:10px;border:1px dashed #ef4444;border-radius:8px;color:#b91c1c;background:#fff7f7;text-align:center;margin:8px 0}" +
    ".dark .dg-pic-error{background:#3b1111;color:#fecaca;border-color:#ef4444}" +
    "@media(max-width:520px){.dg-card-grid{grid-template-columns:repeat(5,1fr)}}";
  document.head.appendChild(s);
}

function currentItem(){
  try{return pool[order[idx]]||null;}catch(e){return null;}
}

function currentKey(){
  var it=currentItem();
  return it&&typeof qCardKey==="function"?qCardKey(it):null;
}

function explainFix(){
  var it=currentItem();
  if(!it)return;
  var card=document.querySelector("#app .card");
  if(!card)return;
  var old=document.getElementById("dgExplainFix");
  if(old)old.remove();

  var q=it.q, ans=(q.answer||[]).join("、");
  var body="";
  try{
    if(typeof explainText==="function") body=explainText(q)||"";
  }catch(e){}
  if(!body) body="<b>解题思路：</b>结合题干中的电路、元件、控制方式和限定条件，逐项核对选项；正确答案以题库答案为准。";

  var html="<div class='dg-explain' id='dgExplainFix'><h3>📖 详细解析</h3>" +
    "<p><b>正确答案：</b>"+escFix(ans)+"</p><p>"+body+"</p>";
  var opts=q.options||[];
  if(q.type==="judge")opts=[{key:"√",text:"正确"},{key:"×",text:"错误"}];
  if(opts.length){
    html+="<div><b>选项核对：</b></div>";
    opts.forEach(function(o){
      var ok=(q.answer||[]).indexOf(o.key)>=0;
      html+="<p><b>"+escFix(o.key)+"：</b>"+escFix(o.text)+"　"+(ok?"✅ 正确":"❌ 错误")+"</p>";
    });
  }
  html+="</div>";
  card.insertAdjacentHTML("beforeend",html);
  document.getElementById("dgExplainFix").scrollIntoView({behavior:"smooth",block:"start"});
}

function escFix(v){
  return String(v==null?"":v).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}

function cardFix(){
  var card=document.querySelector("#app .card");
  if(!card)return;
  var old=document.getElementById("dgCardFix");
  if(old)old.remove();

  var s=getState(), store=s.card||{};
  var p=document.createElement("div");
  p.id="dgCardFix";p.className="dg-explain";
  var html="<h3>🗂 答题卡总览</h3><div class='dg-card-grid'>";
  for(var i=0;i<pool.length;i++){
    var it=pool[order[i]], k=qCardKey(it), rec=store[k]||{};
    var st=rec.status||"un";
    var bg=st==="right"?"#dcfce7":st==="wrong"?"#fee2e2":st==="skip"?"#fef3c7":i===idx?"#dbeafe":"#f3f4f6";
    var label=st==="right"?"✓":st==="wrong"?"×":st==="skip"?"—":"";
    html+="<button data-i='"+i+"' style='background:"+bg+"'>"+(i+1)+" "+label+"</button>";
  }
  html+="</div><p style='margin-bottom:0;font-size:13px'>🟩正确　🟥错误　🟨跳过　⬜未答　🟦当前</p>";
  p.innerHTML=html;
  card.appendChild(p);

  p.addEventListener("click",function(e){
    var b=e.target.closest("button");if(!b)return;
    var n=Number(b.getAttribute("data-i"));
    if(n>=0&&n<pool.length){
      idx=n;
      if(typeof rememberProgress==="function")rememberProgress();
      render();
      setTimeout(repairPage,20);
    }
  });
  p.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function repairImages(){
  document.querySelectorAll(".q,.opt").forEach(function(el){
    if(!el.textContent.includes("[pic]"))return;
    var nodes=Array.from(el.childNodes);
    nodes.forEach(function(n){
      if(n.nodeType!==3||!n.nodeValue.includes("[pic]"))return;
      var parts=n.nodeValue.split("[pic]"),frag=document.createDocumentFragment();
      parts.forEach(function(part,i){
        if(part)frag.appendChild(document.createTextNode(part));
        if(i<parts.length-1){
          var d=document.createElement("div");
          d.className="dg-pic-error";
          d.textContent="⚠️ 原题图片资源缺失：当前网页没有保存这张原图";
          frag.appendChild(d);
        }
      });
      n.parentNode.replaceChild(frag,n);
    });
  });
  document.querySelectorAll("img").forEach(function(img){
    if(img.dataset.dgHandled)return;
    img.dataset.dgHandled="1";
    img.addEventListener("error",function(){
      if(!img.parentNode)return;
      var d=document.createElement("div");
      d.className="dg-pic-error";
      d.textContent="⚠️ 图片加载失败，请检查题库资源";
      img.replaceWith(d);
    });
  });
}

function repairPage(){
  try{repairImages();}catch(e){}
  try{themeFix();}catch(e){}
  syncButtonLabels();
}

function syncButtonLabels(){
  var s=getState(), k=currentKey(), rec=(s.card||{})[k];
  var next=document.getElementById("next"), skip=document.getElementById("skip");
  if(!next||!skip)return;

  /* 只在原网页尚未处理当前题时显示正常的“下一题/跳过”组合。
     不覆盖原网页 evaluate() 对 next 的 onclick。 */
  if(rec&&rec.status){
    next.style.display="block";
    next.textContent=idx<pool.length-1?"下一题":"查看结果";
    skip.style.display="none";
  }else{
    next.style.display="block";
    next.textContent="下一题";
    skip.style.display="inline-block";
  }
}

window.dgPrev=function(){
  try{
    if(typeof goPrev==="function")goPrev();
    else if(idx>0){idx--;render();}
    setTimeout(repairPage,30);
  }catch(e){}
};

window.dgCard=cardFix;
window.dgExplain=explainFix;

window.toggleDark=function(){
  try{
    state.dark=!state.dark;
    saveFix();
    themeFix();
  }catch(e){}
};

/* 夜间按钮不再重复绑定多个 click，避免一次点击切换两次 */
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("#xdark");
  if(!b)return;
  e.preventDefault();
  try{
    state.dark=!state.dark;
    saveFix();
    themeFix();
  }catch(err){}
},{capture:true});

/* 监听原网页 render 后的 DOM，自动恢复图片/主题，但不接管答题按钮 */
function boot(){
  installCss();
  repairPage();
  var app=document.getElementById("app");
  if(app&&!app.__dgObserver){
    var ob=new MutationObserver(function(){
      clearTimeout(window.__dgRepairTimer);
      window.__dgRepairTimer=setTimeout(repairPage,0);
    });
    ob.observe(app,{childList:true,subtree:true});
    app.__dgObserver=ob;
  }
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);
else boot();

window.addEventListener("storage",function(e){
  if(e.key===STORE||e.key==="diangong2024_v8")themeFix();
});
})();
