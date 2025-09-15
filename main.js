// Utilidad para quitar tildes
function quitarTildes(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const form = document.getElementById('name-form');
const input = document.getElementById('name-input');
const formContainer = document.getElementById('form-container');
const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d');
const birthdayCard = document.getElementById('birthday-card');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let nombre = input.value.trim();
    if (!nombre) return;
    nombre = quitarTildes(nombre).toUpperCase();
    formContainer.style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('credits').style.display = 'block'; // Mostrar créditos de animación
    resizeCanvas();
    iniciarAnimacionBlockMensaje(nombre);
});

// --- Animación de la avioneta dibujando mensaje tipo block con humo nube y rotación ---

function drawPlane(x, y, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Hacer el avioncito más pequeño en móviles
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    let scale = 1;
    
    if (isSmallMobile) {
      scale = 0.6; // Móvil pequeño - avioncito más pequeño
    } else if (isMobile) {
      scale = 0.75; // Móvil - avioncito mediano
    }
    
    ctx.scale(scale, scale);
    
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(-19, -5, 38, 10); // cuerpo
    ctx.fillStyle = '#b22222';
    ctx.fillRect(14, -3, 11, 6); // nariz
    ctx.fillStyle = '#888';
    ctx.fillRect(-22, -2, 6, 4); // cola
    ctx.fillStyle = '#4682b4';
    ctx.fillRect(-8, -8, 16, 6); // cabina
    ctx.beginPath();
    ctx.arc(-2, -5, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#fcd299';
    ctx.fill();
    ctx.fillStyle = '#b22222';
    ctx.fillRect(-6, 2, 25, 5);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(25, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
    ctx.restore();
}

function drawCloudSmoke(x, y) {
    for (let i = 0; i < 5; i++) { // Reducido de 7 a 5
      const dx = (Math.random() - 0.5) * 8; // Reducido de 10 a 8
      const dy = (Math.random() - 0.5) * 8;
      const r = 4 + Math.random() * 4; // Reducido de 5.5+5.5 a 4+4
      ctx.save();
      ctx.globalAlpha = 0.15 + Math.random() * 0.2; // Reducido transparencia
      ctx.beginPath();
      ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#e0e0e0';
      ctx.shadowBlur = 6; // Reducido de 8 a 6
      ctx.fill();
      ctx.restore();
    }
}

// Paths tipo block para letras mayúsculas y corazón
const blockLetters = {
    'A': [
      [[0,80],[14,0],[28,80]],
      [[6,40],[22,40]]
    ],
    'B': [
      [[0,0],[0,80]],
      [[0,0],[32,0],[38,8],[38,32],[32,40],[0,40]],
      [[0,40],[32,40],[38,48],[38,72],[32,80],[0,80]]
    ],
    'C': [
      [[38,8],[32,0],[6,0],[0,8],[0,72],[6,80],[32,80],[38,72]]
    ],
    'D': [
      [[0,0],[0,80]],
      [[0,0],[28,0],[38,12],[38,68],[28,80],[0,80]]
    ],
    'E': [
      [[38,0],[0,0],[0,80],[38,80]],
      [[0,40],[28,40]]
    ],
    'F': [
      [[0,0],[0,80]],
      [[0,0],[38,0]],
      [[0,40],[28,40]]
    ],
    'G': [
      [[38,8],[32,0],[6,0],[0,8],[0,72],[6,80],[32,80],[38,72],[38,48],[22,48]]
    ],
    'H': [
      [[0,0],[0,80]],
      [[38,0],[38,80]],
      [[0,40],[38,40]]
    ],
    'I': [
      [[0,0],[38,0]],
      [[19,0],[19,80]],
      [[0,80],[38,80]]
    ],
    'J': [
      [[38,0],[38,64],[32,80],[6,80],[0,72]]
    ],
    'K': [
      [[0,0],[0,80]],
      [[0,40],[38,0]],
      [[0,40],[38,80]]
    ],
    'L': [
      [[0,0],[0,80],[38,80]]
    ],
    'M': [
      [[0,80],[0,0],[19,40],[38,0],[38,80]]
    ],
    'N': [
      [[0,80],[0,0],[38,80],[38,0]]
    ],
    'O': [
      [[6,0],[32,0],[38,8],[38,72],[32,80],[6,80],[0,72],[0,8],[6,0]]
    ],
    'P': [
      [[0,80],[0,0],[32,0],[38,8],[38,32],[32,40],[0,40]]
    ],
    'Q': [
      [[6,0],[32,0],[38,8],[38,72],[32,80],[6,80],[0,72],[0,8],[6,0]],
      [[24,56],[38,80]]
    ],
    'R': [
      [[0,80],[0,0],[32,0],[38,8],[38,32],[32,40],[0,40]],
      [[0,40],[38,80]]
    ],
    'S': [
      [[38,8],[32,0],[6,0],[0,8],[0,32],[6,40],[32,40],[38,48],[38,72],[32,80],[6,80],[0,72]]
    ],
    'T': [
      [[0,0],[38,0]],
      [[19,0],[19,80]]
    ],
    'U': [
      [[0,0],[0,64],[6,80],[32,80],[38,64],[38,0]]
    ],
    'V': [
      [[0,0],[19,80],[38,0]]
    ],
    'W': [
      [[0,0],[9,80],[19,40],[29,80],[38,0]]
    ],
    'X': [
      [[0,0],[38,80]],
      [[38,0],[0,80]]
    ],
    'Y': [
      [[0,0],[19,40],[38,0]],
      [[19,40],[19,80]]
    ],
    'Z': [
      [[0,0],[38,0],[0,80],[38,80]]
    ],
    ' ': [],
    '♥': [
      // Corazón clásico, simétrico, siguiendo la referencia
      [
        [32,80], // punta inferior
        [8,56],  // curva izquierda baja
        [4,36],  // curva izquierda media
        [12,20], // lóbulo izquierdo
        [28,16], // parte superior izquierda
        [32,24], // centro superior
        [36,16], // parte superior derecha
        [52,20], // lóbulo derecho
        [60,36], // curva derecha media
        [56,56], // curva derecha baja
        [32,80]  // cerrar
      ]
    ]
};
  
function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

// --- Nubes pixel art y skyline ---
const cloudSprites = [
    [
      [0,1,1,1,0],
      [1,1,1,1,1],
      [0,1,1,1,0]
    ],
    [
      [0,0,1,1,0,0],
      [0,1,1,1,1,0],
      [1,1,1,1,1,1],
      [0,1,1,1,1,0],
      [0,0,1,1,0,0]
    ],
    [
      [0,1,1,0],
      [1,1,1,1],
      [0,1,1,0]
    ]
];
  
let clouds = [];
function initClouds() {
    clouds = [];
    const n = 7;
    for(let i=0;i<n;i++){
      let y;
      do {
        y = 40 + Math.random() * (canvas.height-200);
      } while (y > canvas.height/2-90 && y < canvas.height/2+90);
      clouds.push({
        x: Math.random()*canvas.width,
        y,
        speed: 0.1 + Math.random()*0.15,
        sprite: cloudSprites[Math.floor(Math.random()*cloudSprites.length)],
        scale: 2 + Math.random()*2
      });
    }
}
  
function drawCloudSprite(cloud) {
    const {x, y, sprite, scale} = cloud;
    for(let i=0;i<sprite.length;i++){
      for(let j=0;j<sprite[i].length;j++){
        if(sprite[i][j]){
          ctx.save();
          ctx.globalAlpha = 0.7;
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#e0e0e0';
          ctx.shadowBlur = 4;
          ctx.fillRect(x+j*scale, y+i*scale, scale, scale);
          ctx.restore();
        }
      }
    }
}
  
function updateClouds() {
    for(const cloud of clouds){
      cloud.x += cloud.speed;
      if(cloud.x > canvas.width+40) cloud.x = -40;
    }
}
  
function drawSkyline() {
    const baseY = canvas.height-60;
    const buildings = [
      {x:40,w:22,h:90,c:'#b0b8c1'},
      {x:120,w:18,h:110,c:'#a0a8b8'},
      {x:200,w:16,h:70,c:'#b8b8c8'},
      {x:70,w:18,h:60,c:'#a8b0b8'},
      {x:170,w:14,h:50,c:'#b0b0b0'},
      {x:260,w:10,h:40,c:'#7ec0b8'},
      {x:300,w:60,h:20,c:'#b89c7c'},
      {x:370,w:18,h:60,c:'#b0b8c1'},
      {x:400,w:14,h:40,c:'#a0a8b8'},
      {x:430,w:22,h:80,c:'#b8b8c8'}
    ];
    ctx.save();
    ctx.fillStyle = '#6a7ba2';
    ctx.fillRect(0,baseY,canvas.width,60);
    for(const b of buildings){
      ctx.fillStyle = b.c;
      ctx.fillRect(b.x, baseY-b.h, b.w, b.h);
      if(b.h>80){
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(b.x+b.w/2-2, baseY-b.h-12, 4, 12);
      }
      if(b.h===40 && b.w===10){
        ctx.fillStyle = '#b2dfdb';
        ctx.fillRect(b.x+3, baseY-b.h-10, 4, 10);
        ctx.beginPath();
        ctx.arc(b.x+5, baseY-b.h-12, 3, 0, Math.PI*2);
        ctx.fill();
      }
      if(b.h===20 && b.w===60){
        ctx.fillStyle = '#b89c7c';
        ctx.fillRect(b.x+10, baseY-10, 40, 4);
        ctx.fillRect(b.x+10, baseY-6, 40, 4);
        ctx.fillStyle = '#a67c52';
        ctx.fillRect(b.x, baseY-20, 6, 20);
        ctx.fillRect(b.x+54, baseY-20, 6, 20);
      }
    }
    ctx.restore();
}
  
let bgImg = new window.Image();
bgImg.src = 'assets/fondo1.jpg';
let bgLoaded = false;
bgImg.onload = () => { bgLoaded = true; };

function drawBackground() {
    if (bgLoaded) {
      const isMobile = window.innerWidth <= 768;
      let iw = bgImg.width, ih = bgImg.height, cw = canvas.width, ch = canvas.height;
      let scale, nw, nh, nx, ny;
      
      if (isMobile) {
        scale = ch / ih;
        nw = iw * scale;
        nh = ih * scale;
        nx = (cw - nw) / 2;
        ny = 0;
        
        if (nw < cw) {
          scale = cw / iw;
          nw = iw * scale;
          nh = ih * scale;
          nx = 0;
          ny = (ch - nh) / 2;
        }
      } else {
        scale = Math.max(cw/iw, ch/ih);
        nw = iw*scale, nh = ih*scale;
        nx = (cw-nw)/2, ny = (ch-nh)/2;
      }
      
      ctx.drawImage(bgImg, nx, ny, nw, nh);
    } else {
      ctx.fillStyle = '#7ec0ee';
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }
}

// --- Fuegos artificiales pixel art ---
let fireworks = [];
function launchFirework() {
    const x = 100 + Math.random()*(canvas.width-200);
    const y = 100 + Math.random()*(canvas.height/2-100);
    const color = `hsl(${Math.floor(Math.random()*360)},90%,70%)`;
    const particles = [];
    for(let i=0;i<18;i++){
      const angle = (i/18)*2*Math.PI;
      const speed = 2+Math.random()*2;
      particles.push({
        x, y, angle, speed,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        alpha: 1
      });
    }
    fireworks.push({particles, color});
}
function updateFireworks() {
    for(const fw of fireworks){
      for(const p of fw.particles){
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= 0.018;
      }
    }
    fireworks = fireworks.filter(fw => fw.particles.some(p => p.alpha > 0));
}
function drawFireworks() {
    for(const fw of fireworks){
      for(const p of fw.particles){
        if(p.alpha>0){
          ctx.save();
          ctx.globalAlpha = Math.max(0,p.alpha);
          ctx.fillStyle = fw.color;
          ctx.shadowColor = fw.color;
          ctx.shadowBlur = 8;
          ctx.fillRect(p.x, p.y, 4, 4);
          ctx.restore();
        }
      }
    }
}
  
function iniciarAnimacionBlockMensaje(nombre) {
    // Parámetros de tamaño responsivos
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    let letraW, letraH, esp, espPalabra, corazonScale;
    
    if (isSmallMobile) {
      letraW = 10*0.8;
      letraH = 20*0.8;
      esp = 55*0.8;
      espPalabra = 65*0.8;
      corazonScale = 0.6;
    } else if (isMobile) {
      letraW = 14*0.8;
      letraH = 28*0.8;
      esp = 60*0.8;
      espPalabra = 70*0.8;
      corazonScale = 0.7;
    } else {
      letraW = 38*0.8;
      letraH = 80*0.8;
      esp = 35*0.8;
      espPalabra = 48*0.8;
      corazonScale = 1.1;
    }
    
    let mensaje, segundaLinea;
    if (isMobile) {
      mensaje = 'HBD';
      segundaLinea = nombre;
    } else {
      mensaje = ('HBD ' + nombre).toUpperCase();
      segundaLinea = null;
    }
    
    let paths = [];
    let letraIndices = [];
    let x = 0;
    let y = 0;
    let maxY = 0, minY = Infinity;
    
    function getLetterWidth(ch) {
      if (ch === ' ') return espPalabra;
      const letter = blockLetters[ch] || blockLetters[' '];
      let maxX = 0;
      for (const seg of letter) {
        const segMaxX = Math.max(...seg.map(([px, _]) => px));
        if (segMaxX > maxX) maxX = segMaxX;
      }
      return maxX * 0.8;
    }
    
    let totalWidth = 0;
    let letterCount = 0;
    
    for (let i = 0; i < mensaje.length; i++) {
      const ch = mensaje[i];
      if (ch === ' ') {
        totalWidth += espPalabra;
        continue;
      }
      totalWidth += getLetterWidth(ch);
      letterCount++;
    }
    
    totalWidth += (letterCount - 1) * esp;
    
    const corazonWidth = 60 * corazonScale;
    totalWidth += 15 + corazonWidth;
    
    if (segundaLinea) {
      let segundaLineaWidth = 0;
      let segundaLineaLetterCount = 0;
      for (let i = 0; i < segundaLinea.length; i++) {
        const ch = segundaLinea[i];
        segundaLineaWidth += getLetterWidth(ch);
        segundaLineaLetterCount++;
      }
      segundaLineaWidth += (segundaLineaLetterCount - 1) * esp;
      segundaLineaWidth += 15 + corazonWidth;
      totalWidth = Math.max(totalWidth, segundaLineaWidth);
    }
    
    x = (canvas.width - totalWidth) / 2;
    
    if (isMobile) {
      let hbdWidth = 0;
      let hbdLetterCount = 0;
      for (let i = 0; i < mensaje.length; i++) {
        const ch = mensaje[i];
        hbdWidth += getLetterWidth(ch);
        hbdLetterCount++;
      }
      hbdWidth += (hbdLetterCount - 1) * esp;
      x = (canvas.width - hbdWidth) / 2;
    }
    
    for (let i = 0; i < mensaje.length; i++) { 
      const ch = mensaje[i];
      if (ch === ' ') {
        x += espPalabra;
        continue;
      }
      const letter = blockLetters[ch] || blockLetters[' '];
      for (const seg of letter) {
        const segAbs = seg.map(([px, py]) => [x + px*0.8, y + py*0.8]);
        paths.push(segAbs);
        letraIndices.push(i);
        for (const [_, py] of seg) {
          if (py > maxY) maxY = py;
          if (py < minY) minY = py;
        }
      }
      x += letraW + esp;
    }
    
    if (segundaLinea) {
      let nombreWidth = 0;
      let nombreLetterCount = 0;
      for (let i = 0; i < segundaLinea.length; i++) {
        const ch = segundaLinea[i];
        nombreWidth += getLetterWidth(ch);
        nombreLetterCount++;
      }
      nombreWidth += (nombreLetterCount - 1) * esp;
      nombreWidth += 15 + corazonWidth;
      x = (canvas.width - nombreWidth) / 2;
      y = letraH + 80;
      
      for (let i = 0; i < segundaLinea.length; i++) {
        const ch = segundaLinea[i];
        const letter = blockLetters[ch] || blockLetters[' '];
        for (const seg of letter) {
          const segAbs = seg.map(([px, py]) => [x + px*0.8, y + py*0.8]);
          paths.push(segAbs);
          letraIndices.push(mensaje.length + i);
          for (const [_, py] of seg) {
            if (y + py > maxY) maxY = y + py;
            if (y + py < minY) minY = y + py;
          }
        }
        x += letraW + esp;
      }
    }
    
    const corazonYOffset = (letraH - 80*corazonScale) / 2;
    const corazonXOffset = x + 15;
    const corazonY = segundaLinea ? y + 25 : 0;
    const corazon = blockLetters['♥'][0].map(([px, py]) => [corazonXOffset + px*corazonScale, corazonY + py*corazonScale + corazonYOffset]);
    paths.push(corazon);
    letraIndices.push(mensaje.length + (segundaLinea ? segundaLinea.length : 0));

    const totalH = segundaLinea ? y + letraH + 80 : letraH;
    const offsetY = canvas.height/2 - totalH/2;

    let pathIdx = 0, puntoIdx = 0, t = 0;
    let estado = 'dibuja';
    let lastPoint = null, moveFrom = null, moveTo = null;
    let drawnSmoke = [];
    let pausaFrames = isMobile ? 15 : 20;
    let showFireworks = false;
    let fireworkTimer = 0;

    function animar() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawBackground();
        updateClouds();
        for(const cloud of clouds) drawCloudSprite(cloud);

        // Agrega este bloque para manejar el final de la animación
        if(pathIdx >= paths.length) {
            showFireworks = true;
            fireworkTimer = 0;
            // Después de ~2.1 segundos de fuegos, sale la carta
            setTimeout(function() {
                canvas.style.display = 'none';
                birthdayCard.style.display = 'block';
            }, 2100);
            return;
        }

        if(showFireworks){
            updateFireworks();
            drawFireworks();
            if(fireworkTimer%20===0 && fireworkTimer<100) launchFirework();
            fireworkTimer++;
        }
        
        // Dibuja el humo ya trazado
        for(const dot of drawnSmoke) drawCloudSmoke(dot[0], dot[1]);

        const seg = paths[pathIdx];
        const start = seg[puntoIdx];
        const end = seg[puntoIdx+1];
        let px, py, angle;
        
        if(estado==='dibuja') {
            const dx = end[0]-start[0], dy = end[1]-start[1];
            const dist = Math.sqrt(dx*dx+dy*dy);
            const speed = isMobile ? 5.5 : 4.5;
            t += speed/dist;
            px = start[0] + (end[0]-start[0])*t;
            py = offsetY + start[1] + (end[1]-start[1])*t;
            angle = getAngle(
              start[0],
              offsetY + start[1],
              end[0],
              offsetY + end[1]
            );
            drawPlane(px, py, angle);
            drawCloudSmoke(px, py);
            drawnSmoke.push([px, py]);
            if(t>=1) {
              t=0;
              puntoIdx++;
              if(puntoIdx>=seg.length-1) {
                puntoIdx=0;
                let prevLetter = letraIndices[pathIdx];
                pathIdx++;
                let nextLetter = letraIndices[pathIdx];
                lastPoint = end;
                if(nextLetter !== prevLetter) {
                  estado='pausa';
                } else {
                  estado='mueve';
                  moveFrom = [lastPoint[0], offsetY + lastPoint[1]];
                  moveTo = [paths[pathIdx][0][0], offsetY + paths[pathIdx][0][1]];
                  t = 0;
                }
              }
            }
        } else if(estado==='pausa') {
            px = lastPoint[0];
            py = offsetY + lastPoint[1];
            angle = 0;
            drawPlane(px, py, angle);
            pausaFrames--;
            if(pausaFrames<=0) {
              pausaFrames = isMobile ? 15 : 20;
              estado='mueve';
              if(pathIdx<paths.length) {
                moveFrom = [lastPoint[0], offsetY + lastPoint[1]];
                moveTo = [paths[pathIdx][0][0], offsetY + paths[pathIdx][0][1]];
              }
              t = 0;
            }
        } else if(estado==='mueve') {
            const from = moveFrom;
            const to = moveTo;
            const dx = to[0]-from[0], dy = to[1]-from[1];
            const dist = Math.sqrt(dx*dx+dy*dy);
            const speed = isMobile ? 7.0 : 6.0;
            t += speed/dist;
            px = from[0] + (to[0]-from[0])*t;
            py = from[1] + (to[1]-from[1])*t;
            angle = getAngle(from[0], from[1], to[0], to[1]);
            drawPlane(px, py, angle);
            if(t>=1) {
              t=0;
              estado='dibuja';
            }
        }
        requestAnimationFrame(animar);
    }
    animar();
}