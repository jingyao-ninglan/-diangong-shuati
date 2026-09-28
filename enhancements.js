(function(){
var s=localStorage.getItem("diangong2024_v6");
var state=s?JSON.parse(s):{dark:false,auto:true,fav:{},wrong:{},answered:{},right:{}};
function save(){localStorage.setItem("diangong2024_v6",JSON.stringify(state))}
function q(){var s=DATA.find(function(x){return x.id===setId});return s&&s.questions[order[idx]]}
var chr=String.fromCharCode(34);
function esc(x){return String(x==null?"":x).split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split(chr).join("&quot;")}
function panel(h){var p=document.getElementById("xpanel");if(!p){p=document.createElement("div");p.id="xpanel";p.style="margin-top:12px;padding:14px;border:1px solid #ccc;border-radius:12px";document.getElementById("app").firstElementChild.appendChild(p)}p.innerHTML=h}
function exp(){var z=q();if(!z)return;var h="<h3>详细解析</h3><p><b>正确答案：</b>"+esc(z.answer.join("、"))+"</p><p><b>题目：</b>"+esc(z.stem)+"</p>";if(z.options){z.options.forEach(function(o){h+="<p><b>"+o.key+"：</b>"+esc(o.text)+(z.answer.indexOf(o.key)>=0?" ✅ 正确选项":" ❌ 不是正确答案")+"</p>"})}else h+="<p>判断题正确答案："+esc(z.answer.join("、"))+"</p>";if((z.stem||"").indexOf("P700")>=0||(z.stem||"").indexOf("P1000")>=0)h+="<p>资料：<a target=_blank href=https://support.industry.siemens.com/cs/attachments/9296615/MM420_OPI_1201_en.pdf>西门子 MICROMASTER 420 官方操作说明</a></p>";panel(h)}
function add(){if(document.getElementById("xbar"))return;var w=document.querySelector(".wrap");if(!w)return;var b=document.createElement("div");b.id="xbar";b.style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px";b.innerHTML="<button id=xexp>详细解析</button><button id=xfav>收藏</button><button id=xwrong>错题本</button><button id=xstat>学习统计</button><button id=xdark>夜间模式</button>";w.insertBefore(b,w.firstChild);
document.getElementById("xexp").onclick=exp;
document.getElementById("xfav").onclick=function(){var z=q(),k="第"+setId+"套第"+z.n+"题";if(state.fav[k])delete state.fav[k];else state.fav[k]=1;save();panel("<h3>收藏</h3>"+(state.fav[k]?"已收藏":"已取消收藏"))};
document.getElementById("xwrong").onclick=function(){var a=Object.keys(state.wrong);panel("<h3>错题本</h3>"+(a.length?a.join("、"):"暂无错题"))};
document.getElementById("xstat").onclick=function(){var a=Object.keys(state.answered).length,r=Object.keys(state.right).length;panel("<h3>学习统计</h3>已答："+a+"题　答对："+r+"题　正确率："+(a?Math.round(r/a*100):0)+"%")};
document.getElementById("xdark").onclick=function(){state.dark=!state.dark;document.body.style.background=state.dark?"#111827":"";document.body.style.color=state.dark?"#fff":"";save()}
}
add();
new MutationObserver(add).observe(document.body,{childList:true,subtree:true});
})();