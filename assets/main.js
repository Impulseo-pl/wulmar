/* Wulmar - zachowanie strony. Każdy blok w try/catch: awaria jednego nie zatrzymuje reszty. */
document.documentElement.classList.add('js');

/* --- odsłanianie sekcji (z bezpiecznikiem: po 2,5 s wszystko widoczne) --- */
(function(){try{
  var els=[].slice.call(document.querySelectorAll('.rv'));
  var show=function(e){e.classList.add('in')};
  if(!('IntersectionObserver' in window)){els.forEach(show);return}
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){show(x.target);io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e){io.observe(e)});
  setTimeout(function(){els.forEach(show)},2500);
}catch(e){document.querySelectorAll('.rv').forEach(function(x){x.classList.add('in')})}})();

/* --- przyklejony pasek po zjechaniu z hero --- */
(function(){try{
  var st=document.querySelector('.stick'),hero=document.querySelector('.hero');
  if(!st||!hero)return;
  var on=function(){st.classList.toggle('show',window.scrollY>hero.offsetHeight*.55)};
  window.addEventListener('scroll',on,{passive:true});on();
}catch(e){}})();

/* --- pasek telefonu na komórce: pokazuje się dopiero po zjechaniu z pierwszego ekranu --- */
(function(){try{
  var top=document.querySelector('.hero')||document.querySelector('.pagehead'),d=document.documentElement;
  var on=function(){var h=top?top.offsetHeight*.55:240;d.classList.toggle('sc-on',window.scrollY>h)};
  window.addEventListener('scroll',on,{passive:true});on();
}catch(e){}})();

/* --- menu mobilne --- */
(function(){try{
  var m=document.querySelector('.mnav');if(!m)return;
  var open=function(){m.classList.add('open');document.body.style.overflow='hidden'};
  var close=function(){m.classList.remove('open');document.body.style.overflow=''};
  document.querySelectorAll('.burger').forEach(function(b){b.addEventListener('click',open)});
  m.querySelector('.mnav-close').addEventListener('click',close);
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
}catch(e){}})();

/* --- przeglądarka zleceń --- */
(function(){try{
  var box=document.querySelector('[data-jobs]');if(!box)return;
  var data=JSON.parse(box.getAttribute('data-jobs'));
  var imgs=box.querySelectorAll('.stage img'),th=box.querySelectorAll('.thumb');
  var f=function(s){return box.querySelector('[data-f="'+s+'"]')};
  var cur=0,timer=null;
  var go=function(i){
    cur=(i+data.length)%data.length;var d=data[cur];
    imgs.forEach(function(im,k){im.classList.toggle('on',k===cur)});
    th.forEach(function(t,k){t.classList.toggle('on',k===cur);t.setAttribute('aria-pressed',k===cur?'true':'false')});
    f('tag').textContent='Usługa /0'+(cur+1);
    f('title').textContent='Usługa /0'+(cur+1)+' · '+d.t;
    f('obiekt').textContent=d.o;f('technika').textContent=d.k;f('zakres').textContent=d.z;
    f('cap').textContent=d.t;f('num').textContent='0'+(cur+1)+' / 0'+data.length;
  };
  th.forEach(function(t,k){t.addEventListener('click',function(){go(k);stop()})});
  var stop=function(){if(timer){clearInterval(timer);timer=null}};
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    timer=setInterval(function(){go(cur+1)},6000);
    box.addEventListener('mouseenter',stop);
  }
  go(0);
}catch(e){}})();

/* --- wstęga realizacji: łuk 3D, przeciąganie i powolny dryf --- */
(function(){try{
  var rb=document.querySelector('.ribbon');if(!rb)return;
  var items=[].slice.call(rb.querySelectorAll('.r-item'));var n=items.length;if(!n)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pos=0,vel=0,drag=false,lastX=0,auto=reduce?0:0.0016;
  var layout=function(){
    var w=rb.clientWidth,iw=items[0].offsetWidth||200,gap=iw*1.08;
    items.forEach(function(el,k){
      var x=((k-pos)%n+n)%n; if(x>n/2)x-=n;          // -n/2..n/2
      var px=x*gap, a=Math.max(-1,Math.min(1,px/(w/2)));
      var ry=-a*38, tz=-Math.abs(a)*120, sc=1+Math.abs(a)*.22;
      el.style.transform='translate(-50%,-50%) translateX('+px*(1+Math.abs(a)*.12)+'px) translateZ('+tz+'px) rotateY('+ry+'deg) scale('+sc+')';
      el.style.zIndex=String(100-Math.round(Math.abs(x)*10));
      el.style.opacity=Math.abs(px)>w*.62?'0':'1';
    });
  };
  var tick=function(){ if(!drag){pos+=auto+vel;vel*=.94} layout(); requestAnimationFrame(tick)};
  rb.addEventListener('pointerdown',function(e){drag=true;lastX=e.clientX;vel=0;rb.setPointerCapture(e.pointerId)});
  rb.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-lastX;lastX=e.clientX;var g=(items[0].offsetWidth||200)*1.08;pos-=dx/g;vel=-dx/g*.6});
  var up=function(){drag=false};
  rb.addEventListener('pointerup',up);rb.addEventListener('pointercancel',up);
  rb.setAttribute('tabindex','0');
  rb.addEventListener('keydown',function(e){if(e.key==='ArrowRight')vel=.12;if(e.key==='ArrowLeft')vel=-.12});
  window.addEventListener('resize',layout);
  layout();requestAnimationFrame(tick);
}catch(e){}})();

/* === licznik otwarć demo (buy-signal) v3 - geo po stronie serwera === */
(function(){try{if(String(location.protocol).indexOf('http')!==0)return;try{if(/[?&#]team=1/.test(location.search+location.hash)){localStorage.setItem('nb_team','1');}}catch(e){}try{if(localStorage.getItem('nb_team')==='1')return;}catch(e){}if(/crm-newbeginning|crm\.impulseo\.pl/.test(document.referrer||''))return;try{if(navigator.webdriver)return;}catch(e){}try{if(/^https?:\/\/(kris20032|impulseo-pl)\.github\.io\/?$/i.test(document.referrer||''))return;}catch(e){}if(sessionStorage.getItem('_dv'))return;sessionStorage.setItem('_dv','1');var seg=(location.pathname.split('/').filter(Boolean)[0])||'';var base=location.origin+(seg?('/'+seg):'');var ua='';try{ua=(navigator.userAgent||'').slice(0,300);}catch(e){}var EP='https://zngfubfinbojfgaxdrbf.supabase.co/functions/v1/demo-view';try{fetch(EP,{method:'POST',keepalive:true,headers:{'Content-Type':'text/plain'},body:JSON.stringify({demo_url:base,page:location.pathname,referrer:(document.referrer||null),user_agent:(ua||null)})}).catch(function(){});}catch(e){}}catch(e){}})();
