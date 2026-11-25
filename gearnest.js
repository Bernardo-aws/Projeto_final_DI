const TIERS=["Comum","Raro","Épico","Lendário"];
const FUELS={
 comb:{n:"Combustão",d:"Do popular ao hipercarro, do mais comum ao mais raro.",cls:[
  ["Popular","Carros do dia a dia, produzidos em grande escala."],
  ["Esportivo","Foco em desempenho e prazer ao dirigir."],
  ["Supercarro","Alto desempenho, design exótico e tiragem limitada."],
  ["Hipercarro","O topo da engenharia, com tiragem mínima e desempenho extremo."]]},
 ele:{n:"Elétricos",d:"Do elétrico popular ao hiperelétrico, do mais comum ao mais raro.",cls:[
  ["Elétrico popular","Acessível, pensado para o uso diário e urbano."],
  ["Elétrico esportivo","Aceleração forte e foco em dirigir."],
  ["Superesportivo elétrico","Desempenho de supercarro com tração elétrica."],
  ["Hiperelétrico","O topo da categoria, com potência extrema e tiragem limitada."]]}
};
const BLANK={n:"Nome do carro",a:"Ano",p:"País",
 h:["A história do carro será contada aqui.","Origem, projeto, lançamento e o que o torna especial."],
 f:[["Motor","—"],["Potência","—"],["Torque","—"],["Câmbio","—"],["Velocidade máxima","—"],["Unidades produzidas","—"]],
 k:["Primeira curiosidade","Segunda curiosidade","Terceira curiosidade"]};
/* Cada classe ocupa suas próprias linhas (4 por linha, quebrando para baixo). As classes descem do mais comum ao mais raro. */
const CARS=[];
for(const f of ["comb","ele"]) for(let t=0;t<4;t++) for(let r=0;r<8;r++) CARS.push({...BLANK,f,t,id:CARS.length,img:""});

let sel={f:"all",t:-1},term="";
const open={all:true,comb:true,ele:true};
const $=s=>document.querySelector(s);
const LOGO_SVG=`<svg viewBox="0 0 320 132" fill="none" stroke="var(--ink)" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Gear Nest">
    <defs>
      <linearGradient id="metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#e3e6ea"/>
        <stop offset="48%" stop-color="#aeb4bc"/>
        <stop offset="54%" stop-color="#7c828b"/>
        <stop offset="100%" stop-color="#cdd2d9"/>
      </linearGradient>
      <linearGradient id="metal-gear" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d5d9df"/>
        <stop offset="50%" stop-color="#9ca2ab"/>
        <stop offset="100%" stop-color="#767c85"/>
      </linearGradient>
    </defs>
    <!-- Chama / fluxo aerodinâmico de fundo -->
    <path d="M78 26 C112 8, 138 36, 174 20 C202 8, 224 24, 256 19 C232 34, 212 31, 188 43 C158 58, 128 38, 82 56 Z" fill="var(--accent)" fill-opacity=".22" stroke="var(--accent)" stroke-width="1.8"/>
    <path d="M84 36 C122 20, 150 48, 192 28 C218 16, 238 28, 266 24 C238 40, 214 39, 186 52 C152 67, 122 46, 84 60 Z" fill="var(--t3)" fill-opacity=".26" stroke="var(--t3)" stroke-width="1.6"/>
    <!-- Engrenagem superior maior -->
    <g transform="translate(56,38)" stroke-width="2">
      <path d="M-6,-28 L6,-28 L8,-21 L15,-18 L21,-22 L28,-14 L23,-8 L25,-1 L32,2 L30,13 L23,14 L19,20 L23,27 L14,33 L8,28 L1,30 L-2,37 L-13,35 L-14,28 L-20,24 L-27,28 L-33,19 L-28,13 L-30,6 L-37,3 L-35,-8 L-28,-9 L-24,-15 L-28,-22 L-19,-28 L-13,-23 L-6,-25 Z" fill="url(#metal-gear)"/>
      <circle cx="-2" cy="4" r="13" fill="var(--panel)"/>
      <circle cx="-2" cy="4" r="9" stroke-width="1.3" opacity=".6"/>
    </g>
    <!-- Engrenagem inferior menor -->
    <g transform="translate(36,84)" stroke-width="2">
      <path d="M-4,-20 L4,-20 L6,-15 L11,-13 L15,-16 L20,-10 L16,-5 L18,0 L23,2 L21,10 L16,11 L13,15 L16,20 L10,24 L5,20 L0,22 L-2,27 L-10,25 L-11,20 L-15,17 L-20,20 L-24,14 L-20,9 L-22,4 L-27,2 L-25,-6 L-20,-7 L-17,-11 L-20,-16 L-14,-20 L-9,-16 L-4,-18 Z" fill="url(#metal-gear)"/>
      <circle cx="-2" cy="3" r="9" fill="var(--panel)"/>
      <circle cx="-2" cy="3" r="6" stroke-width="1.2" opacity=".6"/>
    </g>
    <!-- Pequenos rastros de fogo saindo das letras (destoando do fogo de trás) -->
    <g stroke-linecap="round">
      <path d="M114 31 L93 29 C100 32, 106 33, 114 33 Z" fill="#ff5a1f" stroke="#ff5a1f" stroke-width="1"/>
      <path d="M136 42 L112 41 C120 44, 128 45, 136 44 Z" fill="#ff3b1f" stroke="#ff3b1f" stroke-width="1"/>
      <path d="M168 33 L147 31 C154 34, 161 35, 168 35 Z" fill="#ff5a1f" stroke="#ff5a1f" stroke-width="1"/>
      <path d="M206 31 L184 29 C191 32, 199 33, 206 33 Z" fill="#ff3b1f" stroke="#ff3b1f" stroke-width="1"/>
      <path d="M238 44 L214 43 C222 46, 230 47, 238 46 Z" fill="#ff5a1f" stroke="#ff5a1f" stroke-width="1"/>
      <path d="M266 35 L245 33 C252 36, 259 37, 266 37 Z" fill="#ff3b1f" stroke="#ff3b1f" stroke-width="1"/>
    </g>
    <!-- Tipografia Gear Nest em cinza metálico -->
    <text x="102" y="48" font-family="'Freezer', 'Chakra Petch', var(--sans)" font-size="25" font-weight="800" letter-spacing="1.5" fill="url(#metal-grad)" stroke="#232220" stroke-width="3.2" paint-order="stroke">GEAR <tspan fill="url(#metal-grad)">NEST</tspan></text>
    <!-- Pista sinuosa saindo da base -->
    <path d="M36 86 H112 C142 86 142 98 106 102 L44 109 C16 112 22 124 62 123 L272 114" stroke-width="1.7"/>
    <path d="M36 91 H106 C128 91 128 96 100 99 L52 105 C34 107 38 116 68 115 L272 106" stroke-width="1.3" opacity=".75"/>
    <!-- Silhueta de carro esportivo na curva -->
    <g transform="translate(36,108)" stroke-width="1.5">
      <path d="M2 9 C8 4 17 3 25 5 L34 8 C37 9 38 11 36 12 L4 12 C1 12 0 10 2 9 Z" fill="url(#metal-gear)"/>
      <path d="M11 5 C15 3 21 3 25 6" stroke-width="1.2"/>
      <circle cx="10" cy="12" r="2.6" fill="var(--panel)"/>
      <circle cx="29" cy="12" r="2.6" fill="var(--panel)"/>
      <line x1="-5" y1="9" x2="1" y2="9" stroke="var(--accent)" stroke-width="1.2"/>
      <line x1="-3" y1="11.5" x2="2" y2="11.5" stroke="var(--accent)" stroke-width="1.1"/>
    </g>
  </svg>`;
$("#top-logo").innerHTML=LOGO_SVG;

function side(){
  const cnt=(f,t)=>CARS.filter(c=>(f==="all"||c.f===f)&&(t<0||c.t===t)).length;
  const flt=(f,t,label,dot,cls="")=>`<button type="button" class="flt ${cls}" data-f="${f}" data-t="${t}" aria-pressed="${sel.f===f&&sel.t===t}"><span class="dot" style="background:${dot}"></span>${label}<span class="count">${cnt(f,t)}</span></button>`;
  const chev=(k,label)=>`<button type="button" class="chev" data-k="${k}" aria-expanded="${open[k]}" aria-label="Recolher ou expandir ${label}">▾</button>`;
  let h=`<div class="brand">Garagem<small>Coleção de cartas de carros</small></div>`+
    `<div class="row">${chev("all","Cartas colecionáveis")}${flt("all",-1,"Cartas colecionáveis","var(--muted)")}</div><div class="kids" ${open.all?"":"hidden"}>`;
  for(const [k,F] of Object.entries(FUELS)){
    h+=`<div class="row">${chev(k,F.n)}${flt(k,-1,F.n,"var(--ink)")}</div><div class="kids" ${open[k]?"":"hidden"}>`+
      F.cls.map(([c],i)=>flt(k,i,c,`var(--t${i})`,"sub")).join("")+"</div>";
  }
  h+="</div>";
  $("#side").innerHTML=h;
  document.querySelectorAll("#side .flt").forEach(b=>b.onclick=()=>{
    const f=b.dataset.f,t=+b.dataset.t;
    if(t<0) open[f]=!open[f];
    sel={f,t};
    side();draw();
    requestAnimationFrame(()=>{
      const target=f==="all"?$("#main"):(t>=0?$(`#grp-${f}-${t}`):$(`#sec-${f}`));
      if(target) target.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
  document.querySelectorAll("#side .chev").forEach(b=>b.onclick=()=>{open[b.dataset.k]=!open[b.dataset.k];side();});
}

function artInner(c){
  return `<span class="year">${c.a}</span><span class="rar">${TIERS[c.t]} <i>${"●".repeat(c.t+1)}${"○".repeat(3-c.t)}</i></span>
    ${c.img?`<img src="${c.img}" alt="${c.n}">`:`<label class="up" data-up="${c.id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Upload imagem<input type="file" accept="image/*" data-file="${c.id}"></label>`}
    <span class="fuel">${FUELS[c.f].n}</span>`;
}

function bindUploads(root=document){
  root.querySelectorAll(".up").forEach(el=>el.onclick=e=>e.stopPropagation());
  root.querySelectorAll("input[data-file]").forEach(inp=>{
    inp.onclick=e=>e.stopPropagation();
    inp.onchange=e=>{
      const file=e.target.files&&e.target.files[0];
      if(!file) return;
      const id=+inp.dataset.file;
      CARS[id].img=URL.createObjectURL(file);
      draw();
      if(!$("#ov").hidden) openCard(id,opener);
    };
  });
}

function cardHTML(c){
  const [cls]=FUELS[c.f].cls[c.t];
  return `<article class="card" tabindex="0" role="button" aria-label="Abrir carta: ${cls}" style="--tone:var(--t${c.t})" data-i="${c.id}">
    <div class="art">${artInner(c)}</div>
    <div class="body"><span class="tag">${cls}</span><h3>${c.n}</h3><div class="meta">${c.p}, ${c.a}</div>
      <p class="hist">${c.h[0]}</p><div class="spec">Motor: —</div></div></article>`;
}

function draw(){
  const t=term.trim().toLowerCase();
  let out="";
  for(const [k,F] of Object.entries(FUELS)){
    const list=CARS.filter(c=>c.f===k&&(!t||[c.n,c.p,c.a,F.n,F.cls[c.t][0],TIERS[c.t]].join(" ").toLowerCase().includes(t)));
    if(!list.length) continue;
    let body="";
    F.cls.forEach(([c,d],i)=>{
      const g=list.filter(x=>x.t===i);
      if(!g.length) return;
      body+=`<div class="grp" id="grp-${k}-${i}" style="--tone:var(--t${i})"><div class="ch"><b>${c}</b><span>${TIERS[i]} <i>${"●".repeat(i+1)}${"○".repeat(3-i)}</i></span><small>${d}</small></div><div class="grid">${g.map(cardHTML).join("")}</div></div>`;
    });
    out+=`<section class="sec" id="sec-${k}"><h2 class="st">${F.n}</h2><p class="sd">${F.d}</p>${body}</section>`;
  }
  $("#main").innerHTML=out||'<div class="empty">Nenhuma carta encontrada. Tente outro termo ou classe.</div>';
  bindUploads($("#main"));
  document.querySelectorAll(".card").forEach(el=>{
    el.onclick=()=>openCard(+el.dataset.i,el);
    el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openCard(+el.dataset.i,el);}};
  });
}

let opener=null;
function openCard(i,from){
  const c=CARS[i],[cls,desc]=FUELS[c.f].cls[c.t];opener=from;
  $("#mc").innerHTML=`
    <div class="m-art" style="--tone:var(--t${c.t})">${artInner(c)}</div>
    <div class="m-info" style="--tone:var(--t${c.t})">
      <span class="tag">${cls}</span>
      <h2 id="mt">${c.n}</h2><div class="meta">${c.p}, ${c.a}</div>
      <h4>Sobre a classe</h4><p>${desc}</p>
      <h4>História</h4>${c.h.map(x=>`<p>${x}</p>`).join("")}
      <h4>Ficha técnica</h4><dl class="fs">${BLANK.f.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      <h4>Curiosidades</h4><ul>${c.k.map(x=>`<li>${x}</li>`).join("")}</ul>
    </div>`;
  bindUploads($("#mc"));
  $("#ov").hidden=false;document.body.classList.add("lock");$("#close").focus();
}
function closeCard(){$("#ov").hidden=true;document.body.classList.remove("lock");if(opener)opener.focus();}
$("#close").onclick=closeCard;
$("#ov").onclick=e=>{if(e.target.id==="ov")closeCard();};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#ov").hidden)closeCard();});
$("#q").oninput=e=>{term=e.target.value;draw();};
$("#theme").onclick=()=>{
  const r=document.documentElement;
  const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
  r.dataset.theme=dark?"light":"dark";
};
side();draw();