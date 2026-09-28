(function(){
"use strict";
var state={dark:false,auto:true,fav:{},wrong:{},answered:{},right:{}};
try{var raw=localStorage.getItem("diangong2024_v7");if(raw)state=Object.assign(state,JSON.parse(raw));}catch(e){}
function save(){try{localStorage.setItem("diangong2024_v7",JSON.stringify(state));}catch(e){}}
function current(){var s=DATA.find(function(x){return x.id===setId});return s&&s.questions[order[idx]];}
function esc(x){return String(x==null?"":x).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
function panel(html){var card=document.querySelector("#app .card");if(!card)return;var p=document.getElementById("xpanel");if(!p){p=document.createElement("div");p.id="xpanel";card.appendChild(p);}p.innerHTML=html;}
function explain(){var z=current();if(!z)return;var h="<h3 style='margin:0 0 8px'>📖 详细解析</h3><p><b>正确答案：</b>"+esc(z.answer.join("、"))+"</p><p><b>题目：</b>"+esc(z.stem)+"</p>";if(z.options&&z.options.length){z.options.forEach(function(o){h+="<div style='margin:7px 0'><b>"+esc(o.key)+"：</b>"+esc(o.text)+(z.answer.indexOf(o.key)>=0?" <span style='color:#16a34a'>✅ 正确</span>":" <span style='color:#dc2626'>❌ 错误</span>")+"</div>";});}else{h+="<p>判断题：正确答案为 <b>"+esc(z.answer.join("、"))+"</b></p>";}panel(h);}
function addToolbar(){
 var w=document.querySelector(".wrap");if(!w)return;
 var old=document.getElementById("xbar");if(old)old.remove();
 var b=document.createElement("div");b.id="xbar";
 b.style="display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px;position:relative;z-index:4";
 b.innerHTML="<button id=xexp>📖 详细解析</button><button id=xfav>⭐ 收藏</button><button id=xwrong>📕 错题本</button><button id=xstat>📊 学习统计</button><button id=xdark>🌙 夜间模式</button>";
 w.insertBefore(b,w.querySelector(".mode")||w.firstChild);
 Array.from(b.querySelectorAll("button")).forEach(function(btn){btn.style="border:1px solid #d8dee8;border-radius:10px;padding:9px 12px;background:#fff;color:#25324a;font-weight:700;cursor:pointer";});
 document.getElementById("xexp").onclick=explain;
 document.getElementById("xfav").onclick=function(){var z=current();if(!z)return;var k="第"+setId+"套第"+z.n+"题";if(state.fav[k]){delete state.fav[k];panel("<h3>收藏</h3>已取消收藏："+k);}else{state.fav[k]=1;panel("<h3>收藏</h3>已收藏："+k);}save();};
 document.getElementById("xwrong").onclick=function(){var a=Object.keys(state.wrong);panel("<h3>📕 错题本</h3>"+(a.length?a.join("、"):"暂无错题；答错题目后会自动记录。"));};
 document.getElementById("xstat").onclick=function(){var a=Object.keys(state.answered).length,r=Object.keys(state.right).length;panel("<h3>📊 学习统计</h3>已答："+a+"题　答对："+r+"题　正确率："+(a?Math.round(r/a*100):0)+"%");};
 document.getElementById("xdark").onclick=function(){state.dark=!state.dark;document.body.style.background=state.dark?"#111827":"";document.body.style.color=state.dark?"#fff":"";save();};
}
try{addToolbar();new MutationObserver(function(){addToolbar();}).observe(document.body,{childList:true,subtree:true});}catch(e){}
})();