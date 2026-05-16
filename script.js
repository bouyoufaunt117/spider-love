const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let W = canvas.width;
let H = canvas.height;

/////////////////////////////////////////////////////
// MUSICA
/////////////////////////////////////////////////////

const musicBtn = document.getElementById("musicBtn");
const music = document.getElementById("bgMusic");

musicBtn.addEventListener("click", () => {
  music.play();
  musicBtn.innerHTML = "🎵 Música activada";
});

/////////////////////////////////////////////////////
// ESTRELLAS
/////////////////////////////////////////////////////

const stars = [];

for(let i=0;i<180;i++){
  stars.push({
    x:Math.random()*W,
    y:Math.random()*H,
    r:Math.random()*2,
    a:Math.random()
  });
}

function drawStars(){
  stars.forEach(s=>{
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${s.a})`;
    ctx.fill();
  });
}

/////////////////////////////////////////////////////
// LLUVIA
/////////////////////////////////////////////////////

const rain = [];

for(let i=0;i<250;i++){
  rain.push({
    x:Math.random()*W,
    y:Math.random()*H,
    l:10+Math.random()*20,
    s:4+Math.random()*4
  });
}

function drawRain(){

  ctx.strokeStyle="rgba(180,180,255,0.15)";
  ctx.lineWidth=1;

  rain.forEach(r=>{

    ctx.beginPath();
    ctx.moveTo(r.x,r.y);
    ctx.lineTo(r.x-3,r.y+r.l);
    ctx.stroke();

    r.y += r.s;

    if(r.y > H){
      r.y = -20;
      r.x = Math.random()*W;
    }

  });
}

/////////////////////////////////////////////////////
// LUNA
/////////////////////////////////////////////////////

function drawMoon(){

  const moonX = W-250;
  const moonY = 130;

  const glow = ctx.createRadialGradient(
    moonX,
    moonY,
    20,
    moonX,
    moonY,
    120
  );

  glow.addColorStop(0,"rgba(255,255,255,0.25)");
  glow.addColorStop(1,"rgba(255,255,255,0)");

  ctx.fillStyle = glow;

  ctx.beginPath();
  ctx.arc(moonX,moonY,120,0,Math.PI*2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(moonX,moonY,45,0,Math.PI*2);

  ctx.fillStyle="#f5f3ce";
  ctx.fill();
}

/////////////////////////////////////////////////////
// CIUDAD
/////////////////////////////////////////////////////

const buildings = [];

for(let i=0;i<40;i++){

  const w = 70 + Math.random()*120;
  const h = 180 + Math.random()*450;

  buildings.push({
    x:i*90,
    y:H-h,
    w,
    h,
    redLight:Math.random()>0.7
  });
}

function drawCity(){

  const grad = ctx.createLinearGradient(0,0,0,H);

  grad.addColorStop(0,"#020617");
  grad.addColorStop(0.4,"#030b26");
  grad.addColorStop(1,"#000");

  ctx.fillStyle=grad;
  ctx.fillRect(0,0,W,H);

  buildings.forEach((b,index)=>{

    const depth = index/buildings.length;

    ctx.fillStyle=`
      rgba(
        ${20+depth*30},
        ${20+depth*30},
        ${35+depth*50},
        ${0.95}
      )
    `;

    ctx.fillRect(b.x,b.y,b.w,b.h);

    /////////////////////////////////////////////////////
    // VENTANAS
    /////////////////////////////////////////////////////

    for(let x=10;x<b.w-10;x+=14){

      for(let y=12;y<b.h-10;y+=18){

        if(Math.random()>0.82){

          ctx.fillStyle = Math.random()>0.97
            ? "rgba(255,80,80,0.9)"
            : "rgba(255,248,180,0.65)";

          ctx.fillRect(
            b.x+x,
            b.y+y,
            4,
            6
          );
        }

      }

    }

    /////////////////////////////////////////////////////
    // ANTENAS
    /////////////////////////////////////////////////////

    if(Math.random()>0.75){

      ctx.beginPath();
      ctx.moveTo(b.x+b.w/2,b.y);
      ctx.lineTo(b.x+b.w/2,b.y-30);

      ctx.strokeStyle="rgba(120,120,120,0.8)";
      ctx.stroke();

      if(b.redLight){

        ctx.beginPath();
        ctx.arc(b.x+b.w/2,b.y-30,3,0,Math.PI*2);

        ctx.fillStyle=`
          rgba(
            255,
            40,
            40,
            ${0.4 + Math.sin(Date.now()*0.005)*0.5}
          )
        `;

        ctx.fill();
      }
    }

  });

  /////////////////////////////////////////////////////
  // NIEBLA
  /////////////////////////////////////////////////////

  const fog = ctx.createLinearGradient(0,H-250,0,H);

  fog.addColorStop(0,"rgba(255,255,255,0)");
  fog.addColorStop(1,"rgba(255,255,255,0.08)");

  ctx.fillStyle=fog;
  ctx.fillRect(0,H-250,W,250);
}

/////////////////////////////////////////////////////
// PUENTE
/////////////////////////////////////////////////////

let progress = 0;

const bridge = {
  leftTowerX: W/2 - 300,
  rightTowerX: W/2 + 300,
  towerY: H/2 - 160,
  towerWidth: 40,
  towerHeight: 400,
  baseY: H/2 + 120
};

function cableY(x){

  const midX = (bridge.leftTowerX + bridge.rightTowerX)/2;
  const span = (bridge.rightTowerX - bridge.leftTowerX)/2;
  const sag = 120;

  return bridge.towerY +
    sag * ((x-midX)**2)/(span**2);
}

function drawBridge(){

  /////////////////////////////////////////////////////
  // CABLE
  /////////////////////////////////////////////////////

  ctx.beginPath();

  for(
    let x=bridge.leftTowerX;
    x<bridge.leftTowerX+progress &&
    x<=bridge.rightTowerX;
    x+=2
  ){

    const y = cableY(x);

    if(x===bridge.leftTowerX){
      ctx.moveTo(x,y);
    }else{
      ctx.lineTo(x,y);
    }
  }

  ctx.strokeStyle="white";
  ctx.lineWidth=2;
  ctx.stroke();

  /////////////////////////////////////////////////////
  // VIGAS
  /////////////////////////////////////////////////////

  for(
    let x=bridge.leftTowerX+20;
    x<bridge.leftTowerX+progress &&
    x<=bridge.rightTowerX;
    x+=25
  ){

    const y = cableY(x);

    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x,bridge.baseY);

    ctx.strokeStyle="rgba(255,255,255,0.25)";
    ctx.stroke();
  }

  /////////////////////////////////////////////////////
  // BASE
  /////////////////////////////////////////////////////

  ctx.beginPath();

  ctx.moveTo(bridge.leftTowerX,bridge.baseY);
  ctx.lineTo(bridge.rightTowerX,bridge.baseY);

  ctx.strokeStyle="rgba(255,255,255,0.55)";
  ctx.lineWidth=3;
  ctx.stroke();

  /////////////////////////////////////////////////////
  // TORRES
  /////////////////////////////////////////////////////

  ctx.strokeStyle="rgba(255,255,255,0.9)";

  ctx.strokeRect(
    bridge.leftTowerX-bridge.towerWidth/2,
    bridge.towerY,
    bridge.towerWidth,
    bridge.towerHeight
  );

  ctx.strokeRect(
    bridge.rightTowerX-bridge.towerWidth/2,
    bridge.towerY,
    bridge.towerWidth,
    bridge.towerHeight
  );
}

/////////////////////////////////////////////////////
// FARO
/////////////////////////////////////////////////////

const lampPost = {
  x: W/2,
  y: bridge.towerY - 180,
  h: 140
};

function drawLampPost(){

  ctx.beginPath();
  ctx.moveTo(lampPost.x,lampPost.y);
  ctx.lineTo(lampPost.x,lampPost.y+lampPost.h);

  ctx.strokeStyle="#666";
  ctx.lineWidth=6;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(lampPost.x,lampPost.y);
  ctx.lineTo(lampPost.x+50,lampPost.y);

  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    lampPost.x+50,
    lampPost.y+8,
    10,
    0,
    Math.PI*2
  );

  ctx.fillStyle="#ffe082";
  ctx.fill();

  /////////////////////////////////////////////////////
  // GLOW
  /////////////////////////////////////////////////////

  const glow = ctx.createRadialGradient(
    lampPost.x+50,
    lampPost.y+8,
    0,
    lampPost.x+50,
    lampPost.y+8,
    120
  );

  glow.addColorStop(0,"rgba(255,240,180,0.4)");
  glow.addColorStop(1,"rgba(255,240,180,0)");

  ctx.fillStyle=glow;

  ctx.beginPath();
  ctx.arc(
    lampPost.x+50,
    lampPost.y+8,
    120,
    0,
    Math.PI*2
  );

  ctx.fill();
}

/////////////////////////////////////////////////////
// TEXTO
/////////////////////////////////////////////////////

function drawWebText(){

  if(progress < 150) return;

  const text = "I LOVE YOU";

  ctx.font="bold 82px Arial";

  const textX = W/2 - 220;
  const textY = bridge.baseY - 40;

  ctx.strokeStyle="white";
  ctx.lineWidth=2;

  ctx.strokeText(text,textX,textY);

  /////////////////////////////////////////////////////
  // TELARAÑA
  /////////////////////////////////////////////////////

  for(let r=60;r<300;r+=40){

    ctx.beginPath();

    ctx.arc(
      W/2,
      textY-20,
      r,
      0,
      Math.PI*2
    );

    ctx.strokeStyle="rgba(255,255,255,0.04)";
    ctx.stroke();
  }

  for(let i=0;i<24;i++){

    ctx.beginPath();

    ctx.moveTo(W/2,textY-20);

    ctx.lineTo(
      W/2+Math.cos(i*Math.PI/12)*300,
      textY-20+Math.sin(i*Math.PI/12)*300
    );

    ctx.strokeStyle="rgba(255,255,255,0.05)";
    ctx.stroke();
  }
}

/////////////////////////////////////////////////////
// SPIDERMAN
/////////////////////////////////////////////////////

let swing = 0;

function drawSpiderMan(){

  swing += 0.01;

  /////////////////////////////////////////////////////
  // MOVIMIENTO REALISTA
  /////////////////////////////////////////////////////

  const radius = 110;

  const anchorX = lampPost.x + 50;
  const anchorY = lampPost.y + 8;

  const spiderX =
    anchorX +
    Math.sin(swing) * radius;

  const spiderY =
    anchorY +
    Math.cos(swing) * 70 + 80;

  /////////////////////////////////////////////////////
  // TELARAÑA
  /////////////////////////////////////////////////////

  ctx.beginPath();

  ctx.moveTo(anchorX,anchorY);
  ctx.lineTo(spiderX,spiderY);

  ctx.strokeStyle="rgba(255,255,255,0.9)";
  ctx.lineWidth=2;

  ctx.stroke();

  /////////////////////////////////////////////////////
  // CABEZA
  /////////////////////////////////////////////////////

  ctx.beginPath();
  ctx.arc(spiderX,spiderY,18,0,Math.PI*2);

  ctx.fillStyle="#ff1f57";
  ctx.fill();

  /////////////////////////////////////////////////////
  // OJOS
  /////////////////////////////////////////////////////

  ctx.beginPath();

  ctx.ellipse(
    spiderX-6,
    spiderY-2,
    3,
    6,
    0.4,
    0,
    Math.PI*2
  );

  ctx.ellipse(
    spiderX+6,
    spiderY-2,
    3,
    6,
    -0.4,
    0,
    Math.PI*2
  );

  ctx.fillStyle="white";
  ctx.fill();

  /////////////////////////////////////////////////////
  // CUERPO
  /////////////////////////////////////////////////////

  ctx.beginPath();

  ctx.roundRect(
    spiderX-10,
    spiderY+15,
    20,
    28,
    8
  );

  ctx.fillStyle="#2563eb";
  ctx.fill();

  /////////////////////////////////////////////////////
  // PIERNAS
  /////////////////////////////////////////////////////

  for(let i=0;i<4;i++){

    const move = Math.sin(swing*3+i)*2;

    ctx.beginPath();

    ctx.moveTo(
      spiderX-8,
      spiderY+18+i*4
    );

    ctx.lineTo(
      spiderX-22-move,
      spiderY+18+i*8
    );

    ctx.moveTo(
      spiderX+8,
      spiderY+18+i*4
    );

    ctx.lineTo(
      spiderX+22+move,
      spiderY+18+i*8
    );

    ctx.strokeStyle="#111";
    ctx.stroke();
  }
}

/////////////////////////////////////////////////////
// REFLEJO INFERIOR
/////////////////////////////////////////////////////

function drawReflection(){

  const reflection = ctx.createLinearGradient(
    0,
    H-120,
    0,
    H
  );

  reflection.addColorStop(
    0,
    "rgba(255,255,255,0.03)"
  );

  reflection.addColorStop(
    1,
    "rgba(255,255,255,0)"
  );

  ctx.fillStyle=reflection;
  ctx.fillRect(0,H-120,W,120);
}

/////////////////////////////////////////////////////
// ANIMACION
/////////////////////////////////////////////////////

function animate(){

  ctx.clearRect(0,0,W,H);

  drawCity();
  drawMoon();
  drawStars();
  drawRain();

  drawBridge();
  drawLampPost();

  drawWebText();
  drawSpiderMan();

  drawReflection();

  if(progress < (bridge.rightTowerX-bridge.leftTowerX)){
    progress += 1.2;
  }

  requestAnimationFrame(animate);
}

animate();

/////////////////////////////////////////////////////
// RESPONSIVE
/////////////////////////////////////////////////////

window.addEventListener("resize",()=>{

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  W = canvas.width;
  H = canvas.height;
});