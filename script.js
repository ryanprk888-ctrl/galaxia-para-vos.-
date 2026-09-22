const intro=document.getElementById('intro');
const envelope=document.getElementById('envelope');
const universe=document.getElementById('universe');
const openLetter=document.getElementById('openLetter');
const audio=document.getElementById('audio');
const musicBtn=document.getElementById('musicBtn');
const canvas=document.getElementById('stars');
const ctx=canvas.getContext('2d');

const MUSIC_FILE='[Lv.04] Yellow - Cold Play  (★★☆☆☆)  Drum Cover, Score, Sheet Music, Lessons, Tutorial  DRUMMATE_1790044583659.mp3';
audio.src=MUSIC_FILE;

function show(el){
  [intro,envelope,universe].forEach(x=>x.classList.remove('active'));
  el.classList.add('active');
}
function startMusic(){
  audio.play().then(()=>musicBtn.classList.add('on')).catch(()=>{});
}
intro.addEventListener('click',()=>{ show(envelope); startMusic(); });
openLetter.addEventListener('click',()=>{ show(universe); startMusic(); });
musicBtn.addEventListener('click',(e)=>{
  e.stopPropagation();
  if(audio.paused){ audio.play().then(()=>musicBtn.classList.add('on')).catch(()=>{}); }
  else { audio.pause(); musicBtn.classList.remove('on'); }
});

// Starfield + luminous heart particles
let W,H,DPR,stars=[],heartParticles=[],t=0;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
  canvas.width=W*DPR; canvas.height=H*DPR; canvas.style.width=W+'px'; canvas.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  stars=Array.from({length:Math.min(240,Math.floor(W*H/6500))},()=>({
    x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.35+.15,a:Math.random()*.75+.15,s:Math.random()*.012+.003
  }));
  heartParticles=Array.from({length:900},(_,i)=>{
    const u=Math.random()*Math.PI*2;
    const fill=Math.pow(Math.random(),.55);
    return {u,fill,phase:Math.random()*6.28,seed:i};
  });
}
addEventListener('resize',resize); resize();

function heartXY(u, scale, fill=1){
  const x=16*Math.pow(Math.sin(u),3);
  const y=-(13*Math.cos(u)-5*Math.cos(2*u)-2*Math.cos(3*u)-Math.cos(4*u));
  return {x:x*scale*fill,y:y*scale*fill};
}
function draw(){
  t+=.012;
  ctx.fillStyle='rgba(3,3,10,.22)'; ctx.fillRect(0,0,W,H);
  for(const s of stars){
    s.a += Math.sin(t+s.x)*s.s;
    const a=.2+.25*(.5+.5*Math.sin(t*2+s.x));
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${a*s.a})`;ctx.fill();
  }
  const cx=W/2, cy=H*.42, scale=Math.min(W,H)/35;
  for(const p of heartParticles){
    const q=heartXY(p.u,scale,p.fill);
    const wobble=Math.sin(t*1.7+p.phase)*.7;
    const x=cx+q.x+wobble, y=cy+q.y;
    const tw=.45+.55*(.5+.5*Math.sin(t*3+p.phase));
    ctx.beginPath();ctx.arc(x,y,p.fill*1.05+.45,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,${190+Math.floor(45*tw)},${110+Math.floor(80*tw)},${.18+.55*tw})`;
    ctx.shadowBlur=7;ctx.shadowColor='rgba(255,210,130,.8)';ctx.fill();ctx.shadowBlur=0;
  }
  requestAnimationFrame(draw);
}
draw();
