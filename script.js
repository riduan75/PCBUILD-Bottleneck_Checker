// score: relative gaming performance (best part = 100)
const CPUS=[["Ryzen 5 1600",25],["Core i5-9400F",33],["Core i7-8700",35],["Core i3-10100",30],["Ryzen 5 3600",40],["Core i5-10400F",40],["Ryzen 5 5500",45],["Core i3-12100F",45],["Ryzen 5 5600",52],["Core i5-12400F",55],["Core i5-13400F",60],["Ryzen 5 7600",70],["Core i5-13600K",75],["Ryzen 7 5800X3D",75],["Ryzen 7 7700",75],["Core i7-13700K",82],["Ryzen 9 7950X",88],["Core i9-14900K",90],["Ryzen 7 7800X3D",100]].sort((a,b)=>a[1]-b[1]);
const GPUS=[["GTX 1050 Ti",8],["GTX 1650",12],["GTX 1060 6GB",14],["RX 580 8GB",15],["GTX 1660 Super",17],["RTX 3050",18],["RTX 2060",22],["RX 6600",25],["RTX 3060",26],["RTX 4060",30],["RX 7600",29],["RTX 4060 Ti",36],["RX 6700 XT",38],["RTX 3070",40],["RTX 4070",47],["RX 7800 XT",55],["RTX 4070 Super",55],["RTX 5070",58],["RTX 4070 Ti Super",65],["RTX 4080 Super",78],["RTX 5080",88],["RTX 4090",100]].sort((a,b)=>a[1]-b[1]);
// how much GPU a CPU can feed at each resolution (higher res = less CPU strain)
const F={1080:.85,1440:1.1,2160:1.5};
// GPU score needed for a good experience at each resolution
const NEED={1080:20,1440:35,2160:65};
const NAME={1080:"1080p",1440:"1440p",2160:"4K"};
const $=id=>document.getElementById(id);
CPUS.forEach((c,i)=>$("cpu").add(new Option(c[0],i)));
GPUS.forEach((g,i)=>$("gpu").add(new Option(g[0],i)));
$("cpu").value=CPUS.findIndex(c=>c[0]=="Ryzen 5 3600");
$("gpu").value=GPUS.findIndex(g=>g[0]=="RTX 4070");

function status(eff,r,ram){
  let need=NEED[r],ratio=eff/need;
  if(ram<16&&r!=1080)ratio*=.8; else if(ram<16)ratio*=.92;
  if(ratio>=1)return["Great","var(--ok)"];
  if(ratio>=.7)return["Playable","var(--warn)"];
  return["Not recommended","var(--bad)"];
}
function run(){
  const [cn,C]=CPUS[$("cpu").value],[gn,G]=GPUS[$("gpu").value],ram=+$("ram").value,r=+$("res").value;
  const cap=C*F[r], ratio=cap/G;
  let kind,pct,color,msg;
  if(ratio<.9){kind="CPU bottleneck";pct=Math.min(60,Math.round((1-ratio)*100));color=pct>=20?"var(--bad)":"var(--warn)";
    msg=`Your ${cn} can't feed your ${gn} fast enough at ${NAME[r]}. Roughly ${pct}% of your GPU's power goes unused.`;}
  else if(ratio>1.3){kind="GPU-limited (normal)";pct=Math.min(60,Math.round((1-1/ratio)*100));color="var(--ok)";
    msg=`Your ${gn} is the limiting part at ${NAME[r]}. That's the healthy way to be limited in games: the graphics card works at full load.`;}
  else{kind="Well balanced";pct=Math.max(0,Math.round(Math.abs(1-ratio)*100/2));color="var(--ok)";
    msg=`${cn} and ${gn} match well at ${NAME[r]}. Neither part wastes much of the other.`;}
  const tips=[];
  if(ratio<.9){
    const c=CPUS.find(x=>x[1]*F[r]>=G*.95&&x[1]>C);
    tips.push(c?`Upgrade the CPU to something like a <b>${c[0]}</b> to unlock your ${gn}. (Check your motherboard socket first.)`:`Your ${gn} is stronger than any CPU here can feed at ${NAME[r]}. Move up in resolution to use it fully.`);
    if(r==1080)tips.push("Playing at 1440p or higher shifts work to the GPU and shrinks the CPU bottleneck.");
  }
  const target=r==2160?65:35, bestRes=r;
  if(G<NEED[r]){
    const g=GPUS.find(x=>x[1]>=NEED[r]&&C*F[r]/x[1]>=.9);
    tips.push(g?`Your ${gn} is light for ${NAME[r]}. A <b>${g[0]}</b> or better would fit your CPU and this resolution.`:`Your ${gn} is light for ${NAME[r]}. Upgrade the GPU and the CPU together.`);
    if(r>1080)tips.push(`Dropping to ${r==2160?"1440p":"1080p"} would give smoother frame rates with your current card.`);
  }
  if(ram<16)tips.push("Move to at least <b>16 GB</b> of RAM (dual-channel, 2 sticks). 8 GB causes stutter in many modern games.");
  else if(ram==16&&G>=55)tips.push("With a GPU this strong, <b>32 GB</b> RAM helps in demanding games and when running apps in the background.");
  if(!tips.length)tips.push("Nothing to change. Your parts fit your resolution well.");
  const cards=[1080,1440,2160].map(x=>{
    const eff=Math.min(G,C*F[x]),s=status(eff,x,ram);
    return `<div class="box"><b>${NAME[x]}</b><br><span class="tag" style="background:${s[1]}">${s[0]}</span></div>`}).join("");
  const cw=Math.min(100,Math.round(Math.min(cap,G)/Math.max(cap,G)*100));
  $("out").hidden=false;
  $("out").innerHTML=`<div class="box"><div class="hero"><div><div class="big" style="color:${color}">${pct}%</div><small>${kind}</small></div><div><h2>${kind}</h2><p style="margin:0">${msg}</p></div></div>
  <div style="margin-top:18px"><small>What each part can deliver at ${NAME[r]}</small>
  <div class="bar"><i style="width:${Math.max(12,Math.min(100,cap))}%;background:var(--cpu)">CPU ${Math.round(cap)}</i></div>
  <div class="bar"><i style="width:${Math.max(12,Math.min(100,G))}%;background:var(--gpu)">GPU ${G}</i></div></div></div>
  <div class="res">${cards}</div>
  <div class="box" style="margin-top:14px"><h2>What to change</h2><ul>${tips.map(t=>`<li>${t}</li>`).join("")}</ul></div>`;
  $("out").scrollIntoView({behavior:"smooth",block:"nearest"});
}
$("go").addEventListener("click",run);
run();
