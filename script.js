const bg=document.querySelector("#galaxy"), bctx=bg.getContext("2d");
const hc=document.querySelector("#heartCanvas"), hctx=hc.getContext("2d");
const intro=document.querySelector("#intro"), main=document.querySelector("#main");
const begin=document.querySelector("#begin"), audio=document.querySelector("#audio"), music=document.querySelector("#music");
const loader=document.querySelector("#loader"), orbitWords=document.querySelector("#orbitWords");
let W,H,D,stars=[],nebula=[],particles=[],startTime=0,started=false;
const TAU=Math.PI*2;
function resize(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
[bg,hc].forEach(c=>{c.width=W*D;c.height=H*D;c.style.width=W+"px";c.style.height=H+"px"});
bctx.setTransform(D,0,0,D,0,0);hctx.setTransform(D,0,0,D,0,0);makeBackground();if(started)makeHeart()}
function rnd(a,b){return a+Math.random()*(b-a)}
function makeBackground(){stars=Array.from({length:Math.min(650,Math.floor(W*H/3000))},()=>({x:rnd(0,W),y:rnd(0,H),r:rnd(.25,1.5),a:rnd(.25,.9),p:rnd(0,TAU),s:rnd(.4,1.7)}));
nebula=Array.from({length:Math.min(170,Math.floor(W*H/13000))},()=>({x:rnd(0,W),y:rnd(0,H),r:rnd(25,110),a:rnd(.008,.035),p:rnd(0,TAU)}))}
function bgLoop(t){bctx.clearRect(0,0,W,H);const g=bctx.createRadialGradient(W*.5,H*.43,0,W*.5,H*.43,Math.max(W,H)*.7);
g.addColorStop(0,"rgba(28,31,72,.42)");g.addColorStop(.4,"rgba(8,10,30,.24)");g.addColorStop(1,"rgba(0,0,0,0)");bctx.fillStyle=g;bctx.fillRect(0,0,W,H);
for(const n of nebula){n.p+=.0004;const ng=bctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);ng.addColorStop(0,`rgba(255,214,145,${n.a})`);ng.addColorStop(1,"rgba(255,214,145,0)");bctx.fillStyle=ng;bctx.beginPath();bctx.arc(n.x,n.y,n.r,0,TAU);bctx.fill()}
for(const s of stars){const a=s.a*(.55+.45*Math.sin(t*.001*s.s+s.p));bctx.globalAlpha=a;bctx.fillStyle="#fff";bctx.beginPath();bctx.arc(s.x,s.y,s.r,0,TAU);bctx.fill()}bctx.globalAlpha=1;requestAnimationFrame(bgLoop)}
function heartPoint(t){const x=16*Math.pow(Math.sin(t),3);const y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));const scale=Math.min(W,H)*.0155;return{x:W/2+x*scale,y:H*.39+y*scale}}
function makeHeart(){particles=[];const count=Math.min(1800,Math.max(850,Math.floor(W*H/420)));
for(let i=0;i<count;i++){const t=rnd(0,TAU),edge=heartPoint(t),fill=rnd(0,1),cx=W/2,cy=H*.39;const px=cx+(edge.x-cx)*(0.25+0.75*Math.sqrt(fill)),py=cy+(edge.y-cy)*(0.25+0.75*Math.sqrt(fill));
particles.push({sx:rnd(0,W),sy:rnd(0,H),tx:px+rnd(-2.5,2.5),ty:py+rnd(-2.5,2.5),x:0,y:0,r:rnd(.35,1.45),a:rnd(.35,1),tw:rnd(0,TAU),delay:rnd(0,2.8),edge:fill>.83})}}
function drawHeart(now){hctx.clearRect(0,0,W,H);if(!started){requestAnimationFrame(drawHeart);return}const elapsed=(now-startTime)/1000,ease=x=>1-Math.pow(1-x,4);
for(const p of particles){const q=Math.max(0,Math.min(1,(elapsed-p.delay)/3.4)),e=ease(q);p.x=p.sx+(p.tx-p.sx)*e;p.y=p.sy+(p.ty-p.sy)*e;const tw=.65+.35*Math.sin(now*.002+p.tw);hctx.globalAlpha=p.a*tw*Math.min(1,q*2);hctx.fillStyle=p.edge?"rgba(255,226,157,.98)":"rgba(219,224,255,.78)";hctx.beginPath();hctx.arc(p.x,p.y,p.r,0,TAU);hctx.fill()}
if(elapsed>2){hctx.globalAlpha=.18;hctx.strokeStyle="rgba(255,221,150,.7)";hctx.lineWidth=.45;hctx.beginPath();for(let i=0;i<=180;i++){const p=heartPoint(i/180*TAU);if(i===0)hctx.moveTo(p.x,p.y);else hctx.lineTo(p.x,p.y)}hctx.stroke();hctx.globalAlpha=1}requestAnimationFrame(drawHeart)}
function createOrbit(){orbitWords.innerHTML="";const phrase="TE AMO · IAN · TE AMO · IAN · ";const radius=Math.min(W,H)*.265;
[...phrase].forEach((ch,i)=>{const s=document.createElement("span");s.textContent=ch;Object.assign(s.style,{position:"absolute",left:"50%",top:"39%",fontFamily:"Cormorant Garamond,serif",fontSize:`${Math.max(11,Math.min(17,W*.035))}px`,color:"rgba(255,235,190,.82)",textShadow:"0 0 12px rgba(255,220,145,.75)",opacity:"0",transition:"opacity 1.2s ease"});
const a=i/phrase.length*TAU-Math.PI/2;s.style.transform=`translate(-50%,-50%) translate(${Math.cos(a)*radius}px,${Math.sin(a)*radius*.78}px) rotate(${a+Math.PI/2}rad)`;orbitWords.appendChild(s);setTimeout(()=>s.style.opacity="1",2700+i*35)})}
async function start(){if(started)return;started=true;startTime=performance.now();intro.classList.remove("visible");main.classList.add("visible");makeHeart();createOrbit();try{if(audio.querySelector("source"))await audio.play()}catch(e){}}
begin.addEventListener("click",start);music.addEventListener("click",async()=>{if(audio.paused){try{await audio.play();music.textContent="♫"}catch(e){}}else{audio.pause();music.textContent="Ⅱ"}});addEventListener("resize",resize);resize();requestAnimationFrame(bgLoop);requestAnimationFrame(drawHeart);setTimeout(()=>loader.classList.add("hide"),600);
