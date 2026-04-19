/* =========================================================
   Trex — shared interactions (v7)
   ========================================================= */
(function(){
  'use strict';

  /* ---------- Scroll progress bar ---------- */
  var bar=document.createElement('div');
  bar.className='scroll-progress';
  document.body.appendChild(bar);
  function updateBar(){
    var h=document.documentElement;
    var total=h.scrollHeight-h.clientHeight;
    var p=total>0?(h.scrollTop/total)*100:0;
    bar.style.width=p+'%';
  }
  window.addEventListener('scroll',updateBar,{passive:true});
  window.addEventListener('resize',updateBar);
  updateBar();

  /* ---------- Custom cursor ---------- */
  if(!matchMedia('(hover:none),(pointer:coarse)').matches){
    var dot=document.createElement('div');dot.className='cursor-dot';
    var ring=document.createElement('div');ring.className='cursor-ring';
    document.body.appendChild(dot);document.body.appendChild(ring);
    var x=0,y=0,rx=0,ry=0;
    document.addEventListener('mousemove',function(e){
      x=e.clientX;y=e.clientY;
      dot.style.transform='translate('+(x)+'px,'+(y)+'px) translate(-50%,-50%)';
      dot.classList.add('active');ring.classList.add('active');
    });
    function animRing(){
      rx+=(x-rx)*.18;ry+=(y-ry)*.18;
      ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';
      requestAnimationFrame(animRing);
    }
    animRing();
    document.addEventListener('mouseleave',function(){dot.classList.remove('active');ring.classList.remove('active');});
    document.querySelectorAll('a,button,input,textarea,select,.cta-btn,.badge').forEach(function(el){
      el.addEventListener('mouseenter',function(){ring.classList.add('grow');});
      el.addEventListener('mouseleave',function(){ring.classList.remove('grow');});
    });
  }

  /* ---------- Nav scroll state ---------- */
  var nav=document.getElementById('nav');
  if(nav){
    window.addEventListener('scroll',function(){
      nav.classList.toggle('scrolled',window.scrollY>60);
    },{passive:true});
  }

  /* ---------- Mobile nav toggle & smooth anchor ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var h=a.getAttribute('href');
      if(h==='#'||h.length<2)return;
      var t=document.querySelector(h);
      if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
      var nl=document.getElementById('navLinks');if(nl)nl.classList.remove('open');
    });
  });

  /* ---------- Parallax big english text ---------- */
  var bigs=document.querySelectorAll('.big-en');
  if(bigs.length){
    var raf;
    function parallax(){
      bigs.forEach(function(el){
        var s=parseFloat(el.dataset.speed)||0.1;
        var r=el.getBoundingClientRect();
        el.style.transform='translateX('+((window.innerHeight/2-r.top)*s)+'px)';
      });
    }
    window.addEventListener('scroll',function(){
      cancelAnimationFrame(raf);raf=requestAnimationFrame(parallax);
    },{passive:true});
    parallax();
  }

  /* ---------- Generic IntersectionObserver reveal ---------- */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});
  },{threshold:.15,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.svc-body,.co-card,.co-x,.val,.fl,.cta-box,.svc-detail,.reveal').forEach(function(el){io.observe(el);});

  var io2=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('anim');});
  },{threshold:.25});
  document.querySelectorAll('.svc-vis').forEach(function(el){io2.observe(el);});

  /* stagger delays */
  document.querySelectorAll('.val').forEach(function(c,i){c.style.transitionDelay=(i*.08)+'s';});
  document.querySelectorAll('.fl').forEach(function(c,i){c.style.transitionDelay=(i*.12)+'s';});
  document.querySelectorAll('.svc-detail').forEach(function(c,i){c.style.transitionDelay=(i*.08)+'s';});

  /* ---------- HERO headline scatter ---------- */
  var el=document.getElementById('headline');
  if(el){
    var lines=el.dataset.lines.split('|');
    el.innerHTML='';
    var all=[];
    lines.forEach(function(line,li){
      var wrap=document.createElement('span');
      wrap.className='line-'+li;wrap.style.display='inline';
      [...line].forEach(function(ch){
        var s=document.createElement('span');
        if(ch===' '||ch==='　'){s.className='ch sp';}
        else{
          s.className='ch';s.textContent=ch;
          s.style.setProperty('--x',(Math.random()-.5)*800+'px');
          s.style.setProperty('--y',(Math.random()-.5)*500+'px');
          s.style.setProperty('--r',(Math.random()-.5)*150+'deg');
        }
        wrap.appendChild(s);all.push(s);
      });
      el.appendChild(wrap);
      if(li<lines.length-1){var br=document.createElement('span');br.className='brk';el.appendChild(br);}
    });
    (function fitLines(){
      var headline=el;var maxW=headline.parentElement.offsetWidth;var minScale=1;
      for(var li=0;li<lines.length;li++){
        var lineEl=headline.querySelector('.line-'+li);if(!lineEl)continue;
        lineEl.style.whiteSpace='nowrap';lineEl.style.display='inline-block';
        var natW=lineEl.scrollWidth;
        if(natW>maxW){var scale=maxW/natW;if(scale<minScale)minScale=scale;}
      }
      for(var li2=0;li2<lines.length;li2++){
        var le=headline.querySelector('.line-'+li2);if(!le)continue;
        le.style.fontSize=(minScale*100)+'%';le.style.display='inline';
      }
    })();
    setTimeout(function(){
      var wm=document.getElementById('heroWatermark');
      if(wm)setTimeout(function(){wm.classList.add('faded');},300);
      all.forEach(function(c,i){setTimeout(function(){c.classList.add('in');},i*55+Math.random()*40);});
      var t=all.length*55+600;
      function lerpColor(a,b,tt){
        var ar=parseInt(a.slice(1,3),16),ag=parseInt(a.slice(3,5),16),ab=parseInt(a.slice(5,7),16);
        var br=parseInt(b.slice(1,3),16),bg=parseInt(b.slice(3,5),16),bb=parseInt(b.slice(5,7),16);
        var r=Math.round(ar+(br-ar)*tt),g=Math.round(ag+(bg-ag)*tt),bl=Math.round(ab+(bb-ab)*tt);
        return'rgb('+r+','+g+','+bl+')';
      }
      function multiLerp(colors,tt){
        if(colors.length===1)return colors[0];
        var seg=(colors.length-1)*tt;
        var i=Math.min(Math.floor(seg),colors.length-2);
        return lerpColor(colors[i],colors[i+1],seg-i);
      }
      var lineGrads=[
        ['#D07820','#F09030','#F5B670','#F0C040','#F09030','#D07820'],
        ['#D07820','#F09030','#F5B670','#4AA4DC','#2F87BD']
      ];
      setTimeout(function(){
        for(var li=0;li<2;li++){
          var lineEl=el.querySelector('.line-'+li);if(!lineEl)continue;
          var chs=lineEl.querySelectorAll('.ch:not(.sp)');
          var n=chs.length;var cols=lineGrads[li]||lineGrads[0];
          chs.forEach(function(c,ci){
            var prog=n>1?ci/(n-1):0;
            c.style.color=multiLerp(cols,prog);
            c.classList.add('grad');
          });
        }
      },t+300);
      setTimeout(function(){
        var hm=document.getElementById('heroMission');
        if(!hm)return;
        hm.classList.add('show');
        var hmLines=hm.querySelectorAll('.hm-line');
        hmLines.forEach(function(ln,i){ln.style.transitionDelay=(i*.18)+'s';});
      },t);
      setTimeout(function(){
        var badges=document.querySelectorAll('#heroBadges .badge');
        badges.forEach(function(b,i){setTimeout(function(){b.classList.add('in');},i*120);});
      },t+600);
    },400);
  }

  /* ---------- MISSION text scatter ---------- */
  var block=document.getElementById('missionBlock');
  if(block){
    var raw=block.innerHTML;
    var paras=raw.split('||');
    var fullHtml='';
    paras.forEach(function(p,pi){
      var paraHtml='<span class="mission-para" data-para="'+pi+'">';
      var txt=p.trim();var inTag=false,emType='';
      for(var i=0;i<txt.length;i++){
        if(txt.substring(i,i+4)==='<em>'){emType='orange';paraHtml+='<em>';i+=3;continue;}
        if(txt.substring(i,i+5)==='</em>'){emType='';paraHtml+='</em>';i+=4;continue;}
        if(txt.substring(i,i+3)==='<b>'){emType='blue';paraHtml+='<b>';i+=2;continue;}
        if(txt.substring(i,i+4)==='</b>'){emType='';paraHtml+='</b>';i+=3;continue;}
        if(txt[i]==='<'){inTag=true;paraHtml+=txt[i];continue;}
        if(txt[i]==='>'){inTag=false;paraHtml+=txt[i];continue;}
        if(inTag){paraHtml+=txt[i];continue;}
        if(txt[i]===' '||txt[i]==='　'){paraHtml+='<span class="mc sp-m"></span>';continue;}
        var cls=emType==='orange'?'mc em-orange':emType==='blue'?'mc em-blue':'mc';
        var mx=(Math.random()-.5)*400+'px';
        var my=(Math.random()-.5)*250+'px';
        var mr=(Math.random()-.5)*120+'deg';
        paraHtml+='<span class="'+cls+'" style="--mx:'+mx+';--my:'+my+';--mr:'+mr+'">'+txt[i]+'</span>';
      }
      paraHtml+='</span>';
      fullHtml+=paraHtml;
    });
    block.innerHTML=fullHtml;
    var parEls=block.querySelectorAll('.mission-para');
    var mio=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var chars=e.target.querySelectorAll('.mc');
          chars.forEach(function(c,i){setTimeout(function(){c.classList.add('lit');},i*30+Math.random()*20);});
          mio.unobserve(e.target);
        }
      });
    },{threshold:0.2,rootMargin:'0px 0px -50px 0px'});
    parEls.forEach(function(p){mio.observe(p);});
  }

  /* ---------- Card tilt (subtle) ---------- */
  document.querySelectorAll('[data-tilt]').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-.5;
      var y=(e.clientY-r.top)/r.height-.5;
      card.style.transform='perspective(900px) rotateY('+(x*4)+'deg) rotateX('+(-y*4)+'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='';
    });
  });

  /* ---------- Set active nav link based on current path ---------- */
  var path=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a,.ft-links a').forEach(function(a){
    var href=a.getAttribute('href');
    if(!href)return;
    var file=href.split('/').pop().split('#')[0];
    if((file===path)||(path==='index.html' && href==='index.html')){
      a.classList.add('active');
    }
  });

  /* ---------- Contact form soft submit ---------- */
  var cf=document.getElementById('contactForm');
  if(cf){
    cf.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=cf.querySelector('button[type=submit]');
      if(btn){btn.textContent='送信しました（デモ）';btn.disabled=true;}
      setTimeout(function(){cf.reset();if(btn){btn.textContent='送信する';btn.disabled=false;}},2400);
    });
  }

})();
