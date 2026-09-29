/* 电工高级题库稳定修复层 v10 */
(function () {
  "use strict";

  var STORE = "diangong2024_v10";
  var state10 = {dark:false, explain:true, card:{}, answered:{}, right:{}, wrong:{}, fav:{}, position:null};

  try {
    var old = localStorage.getItem(STORE);
    if (old) state10 = Object.assign(state10, JSON.parse(old));
  } catch (_) {}

  function save10() {
    try { localStorage.setItem(STORE, JSON.stringify(state10)); } catch (_) {}
  }

  function esc10(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function(c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }

  function key10(item) { return String(item.set) + "_" + String(item.q.n); }
  function cur10() {
    if (!pool || !order || typeof idx !== "number") return null;
    var item = pool[order[idx]];
    return item || null;
  }

  function persistPosition() {
    if (typeof setId === "undefined" || typeof mode === "undefined" || typeof idx === "undefined") return;
    state10.position = {setId:setId, mode:mode, random:!!random, idx:idx};
    save10();
  }

  function theme10() {
    document.body.classList.toggle("dark", !!state10.dark);
    document.documentElement.classList.toggle("dark", !!state10.dark);
    var b = document.getElementById("xdark");
    if (b) b.textContent = state10.dark ? "☀️ 白天模式" : "🌙 夜间模式";
  }

  function installCss10() {
    if (document.getElementById("dg-fix-css")) return;
    var s = document.createElement("style");
    s.id = "dg-fix-css";
    s.textContent =
      "#xbar.dg-fixed{display:flex!important;flex-wrap:wrap;gap:8px;margin:0 0 14px!important;position:relative;z-index:20}" +
      "#xbar.dg-fixed button{min-height:42px;border:1px solid #cbd5e1;border-radius:10px;padding:8px 12px;background:#fff;color:#25324a;font-weight:700;cursor:pointer}" +
      ".dark #xbar.dg-fixed button{background:#1f2937;color:#e5e7eb;border-color:#475569}" +
      ".dg-explain{margin-top:14px;padding:16px;border:1px solid #cbd5e1;border-radius:14px;background:#f8fafc;color:#172033;line-height:1.75}" +
      ".dark .dg-explain{background:#172033;color:#e5e7eb;border-color:#475569}" +
      ".dg-explain h3{margin:0 0 10px}.dg-explain p{margin:7px 0}.dg-right{color:#15803d;font-weight:700}.dg-wrong{color:#b91c1c}" +
      ".dark .dg-right{color:#86efac}.dark .dg-wrong{color:#fca5a5}" +
      ".dg-pic-error{padding:10px;border:1px dashed #ef4444;border-radius:8px;color:#b91c1c;background:#fff7f7;text-align:center;margin:8px 0}" +
      ".dark .dg-pic-error{background:#3b1111;color:#fecaca;border-color:#ef4444}" +
      ".dg-card-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}" +
      ".dg-card-grid button{border:1px solid #cbd5e1;border-radius:8px;padding:8px;cursor:pointer}" +
      "@media(max-width:520px){#xbar.dg-fixed button{flex:1 1 calc(50% - 8px);font-size:14px}.dg-card-grid{grid-template-columns:repeat(5,1fr)}}";
    document.head.appendChild(s);
  }

  function rebuildBar10() {
    var old = document.getElementById("xbar");
    if (!old) {
      old = document.createElement("div");
      old.id = "xbar";
      var w = document.querySelector(".wrap");
      if (w) w.insertBefore(old, w.querySelector(".mode") || w.firstChild);
    }
    var fresh = old.cloneNode(false);
    fresh.className = "dg-fixed";
    fresh.innerHTML =
      '<button data-act="explain">📖 解析</button>' +
      '<button data-act="mock">📝 模拟考试</button>' +
      '<button data-act="fav">⭐ 收藏</button>' +
      '<button data-act="wrong">📕 错题本</button>' +
      '<button data-act="stat">📊 学习统计</button>' +
      '<button id="xdark" data-act="dark">🌙 夜间模式</button>';
    old.parentNode.replaceChild(fresh, old);

    fresh.addEventListener("click", function(e) {
      var b = e.target.closest("button");
      if (!b) return;
      var a = b.getAttribute("data-act");
      if (a === "explain") explain10(true);
      if (a === "mock") {
        mode = "mock"; random = false;
        syncMode10(); buildPool(); idx = 0; score = 0; answered = 0; render();
      }
      if (a === "fav") toggleFav10();
      if (a === "wrong") showList10("📕 错题本", Object.keys(state10.wrong), "答错题目会自动记录。");
      if (a === "stat") {
        var n = Object.keys(state10.answered).length, r = Object.keys(state10.right).length;
        showList10("📊 学习统计", ["已答：" + n + " 题","答对：" + r + " 题","正确率：" + (n ? Math.round(r/n*100) : 0) + "%"], "");
      }
      if (a === "dark") { state10.dark = !state10.dark; theme10(); save10(); }
    });
    theme10();
  }

  function syncMode10() {
    ["normal","random","mock"].forEach(function(id) {
      var b=document.getElementById(id);
      if(b) b.classList.toggle("on", id===mode);
    });
    var sel=document.getElementById("set");
    if(sel && typeof setId !== "undefined") sel.value=String(setId);
  }

  function showList10(title, arr, empty) {
    var card=document.querySelector("#app .card"); if(!card) return;
    var p=document.getElementById("dgPanel10");
    if(!p){p=document.createElement("div");p.id="dgPanel10";p.className="dg-explain";card.appendChild(p);}
    p.innerHTML="<h3>"+esc10(title)+"</h3>"+(arr.length ? arr.map(esc10).join("<br>") : esc10(empty || "暂无记录。"));
    p.scrollIntoView({behavior:"smooth",block:"nearest"});
  }

  function toggleFav10() {
    var item=cur10(); if(!item) return;
    var k="第"+item.set+"套第"+item.q.n+"题";
    if(state10.fav[k]) delete state10.fav[k]; else state10.fav[k]=1;
    save10(); showList10("⭐ 收藏", Object.keys(state10.fav), "暂无收藏。");
  }

  function makeExplanation10(q) {
    var ans=(q.answer||[]).join("、");
    var stem=String(q.stem||"").trim();
    var body="";
    if (typeof explainText === "function") {
      try { body=explainText(q); } catch (_) {}
    }
    if (!body) {
      body="<b>解题思路：</b>先确定题目的考查对象，再提取题干中的数值、连接方式、控制方式和限定条件，最后逐项核对选项。";
      if(q.type==="multiple") body+=" 多选题必须同时满足所有正确条件。";
      if(q.type==="judge") body+=" 判断题重点检查定义、适用条件和“必须/一定/只能”等限定词。";
    }
    var html="<div class='dg-explain' id='dgExplain10'>" +
      "<h3>📖 详细解析</h3>" +
      "<p><b>正确答案：</b>"+esc10(ans)+"</p>" +
      "<p><b>题目：</b>"+esc10(stem)+"</p>" +
      "<p>"+body+"</p>";
    var opts=q.options || (q.type==="judge" ? [{key:"√",text:"正确"},{key:"×",text:"错误"}] : []);
    if(opts.length){
      html+="<div><b>逐项判断：</b></div>";
      opts.forEach(function(o){
        var ok=(q.answer||[]).indexOf(o.key)>=0;
        html+="<p class='"+(ok?"dg-right":"dg-wrong")+"'><b>"+esc10(o.key)+"：</b>"+esc10(o.text)+(ok?"　✅ 正确":"　❌ 错误")+"</p>";
      });
    }
    return html+"</div>";
  }

  function explain10(scroll) {
    var item=cur10(); if(!item) return;
    var card=document.querySelector("#app .card"); if(!card) return;
    var old=document.getElementById("dgExplain10"); if(old) old.remove();
    card.insertAdjacentHTML("beforeend", makeExplanation10(item.q));
    if(scroll){var p=document.getElementById("dgExplain10");if(p)p.scrollIntoView({behavior:"smooth",block:"start"});}
  }

  function ensureNavigation10() {
    var card=document.querySelector("#app .card"); if(!card) return;
    var foot=card.querySelector(".foot"); if(!foot) return;
    var next=document.getElementById("next"), prev=document.getElementById("prev"), skip=document.getElementById("skip");
    if(!prev){
      prev=document.createElement("button"); prev.id="prev"; prev.className="btn secondary"; prev.textContent="← 上一题";
      foot.insertBefore(prev,foot.firstChild);
    }
    if(!document.getElementById("cardBtn")){
      var cb=document.createElement("button"); cb.id="cardBtn"; cb.className="btn secondary"; cb.textContent="🗂 答题卡"; foot.appendChild(cb);
      cb.onclick=cardOverview10;
    }
    if(!document.getElementById("xinline")){
      var eb=document.createElement("button"); eb.id="xinline"; eb.className="btn secondary"; eb.textContent="📖 查看解析"; foot.appendChild(eb);
      eb.onclick=function(){explain10(true)};
    }
    if(!next){
      next=document.createElement("button"); next.id="next"; next.className="btn"; foot.appendChild(next);
    }
    prev.disabled=(idx<=0);
    prev.onclick=function(){if(idx>0){idx--;persistPosition();render();}};

    var rec=state10.card[key10(cur10())];
    if(rec && rec.status==="right" || rec && rec.status==="wrong"){
      next.textContent=idx<pool.length-1?"下一题":"查看结果";
      next.style.display="block";
      next.onclick=function(){if(idx<pool.length-1){idx++;persistPosition();render();}else{idx=pool.length;render();}};
      if(skip) skip.style.display="none";
    } else if(rec && rec.status==="skip"){
      next.textContent=idx<pool.length-1?"下一题":"查看结果";
      next.style.display="block";
      next.onclick=function(){if(idx<pool.length-1){idx++;persistPosition();render();}else{idx=pool.length;render();}};
      if(skip) skip.style.display="none";
    }
  }

  function repairImages10() {
    document.querySelectorAll(".q, .opt").forEach(function(el){
      var txt=el.textContent.trim();
      if(txt === "[pic]" || txt.indexOf("[pic]")>=0 && !el.querySelector("img")){
        var nodes=Array.from(el.childNodes);
        nodes.forEach(function(n){
          if(n.nodeType===3 && n.nodeValue.indexOf("[pic]")>=0){
            var parts=n.nodeValue.split("[pic]");
            var frag=document.createDocumentFragment();
            parts.forEach(function(part,i){
              if(part) frag.appendChild(document.createTextNode(part));
              if(i<parts.length-1){
                var d=document.createElement("div"); d.className="dg-pic-error";
                d.textContent="⚠️ 原题图片资源缺失：当前网页没有保存这张原图";
                frag.appendChild(d);
              }
            });
            n.parentNode.replaceChild(frag,n);
          }
        });
      }
    });
    document.querySelectorAll(".qpic img").forEach(function(img){
      img.onerror=function(){
        var d=document.createElement("div");d.className="dg-pic-error";d.textContent="⚠️ 图片加载失败，请检查题库资源";
        img.replaceWith(d);
      };
    });
  }

  function cardOverview10() {
    var card=document.querySelector("#app .card"); if(!card) return;
    var old=document.getElementById("dgCard10"); if(old) old.remove();
    var p=document.createElement("div");p.id="dgCard10";p.className="dg-explain";
    var h="<h3>🗂 答题卡总览</h3><div class='dg-card-grid'>";
    for(var i=0;i<pool.length;i++){
      var it=pool[order[i]], rec=state10.card[key10(it)], st=rec?rec.status:"un";
      var bg=st==="right"?"#dcfce7":st==="wrong"?"#fee2e2":st==="skip"?"#fef3c7":i===idx?"#dbeafe":"#f3f4f6";
      h+="<button data-i='"+i+"' style='background:"+bg+"'>"+(i+1)+"</button>";
    }
    h+="</div><p class='small'>🟩正确　🟥错误　🟨跳过　⬜未答　🟦当前</p>";
    p.innerHTML=h;card.appendChild(p);
    p.addEventListener("click",function(e){
      var b=e.target.closest("button");if(!b)return;
      var i=Number(b.getAttribute("data-i"));if(i>=0&&i<pool.length){idx=i;persistPosition();render();}
    });
  }

  function syncAnswered10() {
    var item=cur10(); if(!item) return;
    var k=key10(item), old=state10.card[k];
    if(old){
      var opts=document.querySelectorAll(".opt");
      var chosen=old.chosen||[];
      opts.forEach(function(b){
        if(chosen.indexOf(b.dataset.key)>=0)b.classList.add("selected");
        if((item.q.answer||[]).indexOf(b.dataset.key)>=0)b.classList.add("correct");
        else if(chosen.indexOf(b.dataset.key)>=0)b.classList.add("wrong");
        b.disabled=true;
      });
      var res=document.getElementById("res");
      if(res)res.innerHTML="<div class='result "+(old.status==="right"?"good":"bad")+"'>"+(old.status==="right"?"回答正确 ✓":"回答错误 ✕")+"<br>正确答案：<span class='answer'>"+esc10((item.q.answer||[]).join("、"))+"</span></div>";
    }
  }

  function hookRender10() {
    if(typeof render !== "function") return;
    if(render.__dg10) return;
    var original=render;
    window.render=function(){
      original.apply(this,arguments);
      setTimeout(function(){
        repairImages10();
        ensureNavigation10();
        syncAnswered10();
        theme10();
      },0);
    };
    render.__dg10=true;
  }

  function hookAnswer10() {
    document.addEventListener("click",function(e){
      var b=e.target.closest && e.target.closest(".opt");
      if(!b || b.disabled) return;
      setTimeout(function(){
        var item=cur10(); if(!item)return;
        var selected=Array.from(document.querySelectorAll(".opt.selected")).map(function(x){return x.dataset.key;});
        var q=item.q, k=key10(item);
        var result=document.getElementById("res");
        var correct=false;
        if(q.type==="multiple"){
          var submit=document.getElementById("next");
          if(submit && submit.textContent.indexOf("提交")>=0) return;
        }
        var marked=document.querySelector(".opt.correct,.opt.wrong");
        if(!marked)return;
        var chosen=selected.length?selected:[b.dataset.key];
        correct=(q.answer||[]).length===chosen.length && (q.answer||[]).every(function(x){return chosen.indexOf(x)>=0;});
        state10.card[k]={status:correct?"right":"wrong",chosen:chosen};
        state10.answered[k]=true;state10.right[k]=correct;if(!correct)state10.wrong[k]=true;
        save10();persistPosition();ensureNavigation10();
      },20);
    });
  }

  function boot10() {
    installCss10();
    rebuildBar10();
    hookRender10();
    hookAnswer10();
    theme10();
    setTimeout(function(){ if(typeof render==="function") render(); },50);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot10);
  else boot10();
  window.addEventListener("beforeunload",persistPosition);
  window.addEventListener("pagehide",persistPosition);


  /* 全局按钮接口：原题页面的 inline onclick 会调用这些名称 */
  window.dgPrev = function () {
    try {
      if (typeof idx !== "number") return;
      if (idx > 0) {
        idx--;
        persistPosition();
        if (typeof render === "function") render();
        setTimeout(function(){ repairImages10(); ensureNavigation10(); syncAnswered10(); theme10(); }, 30);
      }
    } catch (_) {}
  };

  window.dgCard = function () {
    try {
      cardOverview10();
    } catch (_) {}
  };

  window.dgExplain = function () {
    try {
      explain10(true);
    } catch (_) {}
  };

  /* 保证动态生成的按钮在原页面 render 后仍然可用 */
  function exposeControls10() {
    window.dgPrev = window.dgPrev || function(){};
    window.dgCard = window.dgCard || cardOverview10;
    window.dgExplain = window.dgExplain || function(){ explain10(true); };
  }
  exposeControls10();

})();
