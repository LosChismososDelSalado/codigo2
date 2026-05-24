
// ==========================================
// LINKS POR ZONA — solo edita esta sección
// tipo: 'video' | 'audio' | 'imagen' | 'creditos' | 'url' | 'carrusel'
// ==========================================
const zonaData = {
    'zona-historia':    { tipo: 'video',   src: 'assets/historia.webm' },
    'zona-jugadoras':   {
        tipo: 'carrusel',
        videos: [
            {
                src:       'assets/jugadora-1.webm',
                titulo:    'Nombre Jugadora 1',
                subtitulo: 'Posición · Años activa',
                thumb:     'assets/jugadora-1-thumb.jpg'
            },
            {
                src:       'assets/jugadora-2.webm',
                titulo:    'Nombre Jugadora 2',
                subtitulo: 'Posición · Años activa',
                thumb:     'assets/jugadora-2-thumb.jpg'
            },
            {
                src:       'assets/jugadora-3.webm',
                titulo:    'Nombre Jugadora 3',
                subtitulo: 'Posición · Años activa',
                thumb:     'assets/jugadora-3-thumb.jpg'
            },
        ]
    },
    'zona-azteca':      { tipo: 'video',   src: 'assets/azteca.webm' },
    'zona-futbolista':  { tipo: 'video',   src: 'assets/futbolista.webm' },
    'zona-doctora':     { tipo: 'video',   src: 'assets/doctora.webm' },
    'zona-ingeniera':   { tipo: 'imagen',  src: 'assets/ingeniera.jpg' },
    'zona-maestra':     { tipo: 'audio',   src: 'assets/maestra.mp3' },
    'zona-bombera':     { tipo: 'video',   src: 'assets/bombera.webm' },
    'zona-repartidora': { tipo: 'video',   src: 'assets/repartidora.webm' },
    'zona-nosotras':    { tipo: 'galaxia' },
    'zona-nina':        { tipo: 'nina' },
    'zona-creditos':    { tipo: 'creditos' },
};

// --- ELEMENTOS ---
const balon          = document.getElementById('balon-loader');
const grietaVerde    = document.getElementById('grieta-verde');
const modalMedia     = document.getElementById('modal-media');
const mediaContenido = document.getElementById('media-contenido');
const btnCerrarMedia = document.getElementById('cerrar-media');
const modalCreditos  = document.getElementById('modal-creditos');
const btnCerrar      = document.getElementById('cerrar-creditos');

// --- ESTADOS INICIALES ---
balon.classList.remove('girando');
modalCreditos.style.display    = 'none';
modalCreditos.style.visibility = 'hidden';
modalMedia.style.display       = 'none';
modalMedia.style.visibility    = 'hidden';
grietaVerde.style.clipPath     = 'inset(50% 0% 50% 0%)';
grietaVerde.style.opacity      = '0';

// --- AUDIO AMBIENTE ---
const audioAmbiente = new Audio('assets/ambiente.mp3');
audioAmbiente.loop   = true;
audioAmbiente.volume = 0.5;

let ambienteIniciado = false;

function iniciarAmbiente() {
    if (ambienteIniciado) return;
    audioAmbiente.play().then(() => {
        ambienteIniciado = true;
    }).catch(() => {});
}

function pausarAmbiente()   { audioAmbiente.pause(); }
function reanudarAmbiente() { if (ambienteIniciado) audioAmbiente.play().catch(() => {}); }

// Intentar autoplay al cargar
window.addEventListener('load', () => {
    audioAmbiente.play().then(() => {
        ambienteIniciado = true;
    }).catch(() => {
        // Navegador bloqueó autoplay — esperar primer clic o toque
        document.addEventListener('click',      iniciarAmbiente, { once: true });
        document.addEventListener('touchstart', iniciarAmbiente, { once: true });
    });
});


document.querySelectorAll('.zona').forEach(zona => {
    const targetId = zona.dataset.target;
    const targetEl = targetId ? document.getElementById(targetId) : null;

    function encender() {
        if (targetEl) {
            targetEl.style.animation = 'none';
            targetEl.classList.add('elemento-hover');
        }
    }
    function apagar() {
        if (targetEl) {
            targetEl.classList.remove('elemento-hover');
            targetEl.style.animation = '';
        }
    }

    zona.addEventListener('mouseenter', encender);
    zona.addEventListener('mouseleave', apagar);
    zona.addEventListener('touchstart', encender, { passive: true });
    zona.addEventListener('touchend',   apagar);
    zona.addEventListener('touchcancel',apagar);
});

// --- BALÓN Y GRIETA ---
function iniciarCarga(duracionEstimada = 3) {
    balon.classList.add('girando');
    grietaVerde.style.setProperty('--duracion-carga', duracionEstimada + 's');
    grietaVerde.classList.remove('ocultar', 'cargando');
    void grietaVerde.offsetWidth;
    grietaVerde.classList.add('cargando');
    // Brillo blanco sobre el mural sincronizado con la grieta
    const mc = document.getElementById('mural-container');
    if (mc) {
        mc.style.setProperty('--duracion-carga', duracionEstimada + 's');
        mc.classList.remove('brillo-carga');
        void mc.offsetWidth;
        mc.classList.add('brillo-carga');
    }
}

function terminarCarga() {
    balon.classList.remove('girando');
    grietaVerde.classList.remove('cargando');
    grietaVerde.classList.add('ocultar');
    const mc = document.getElementById('mural-container');
    if (mc) mc.classList.remove('brillo-carga');
    setTimeout(() => {
        grietaVerde.classList.remove('ocultar');
        grietaVerde.style.clipPath = 'inset(50% 0% 50% 0%)';
        grietaVerde.style.opacity  = '0';
    }, 400);
}


// --- ABRIR SEGÚN TIPO ---
function abrirContenido(data) {
    mediaContenido.innerHTML = '';

    if (data.tipo === 'creditos') {
        abrirCreditos();
        return;
    }

    if (data.tipo === 'url') {
        window.open(data.src, '_blank');
        return;
    }

    if (data.tipo === 'carrusel') {
        iniciarCarga(4);
        abrirCarrusel(data.videos);
        return;
    }

    if (data.tipo === 'imagen') {
        iniciarCarga(1);
        const img = document.createElement('img');
        img.src = data.src;
        img.addEventListener('load', () => {
            terminarCarga();
            pausarAmbiente();
            modalMedia.style.display    = 'flex';
            modalMedia.style.visibility = 'visible';
        });
        img.addEventListener('error', () => terminarCarga());
        mediaContenido.appendChild(img);
        return;
    }

    if (data.tipo === 'video') {
        iniciarCarga(4);
        const video    = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.style.cssText = 'max-width:90%; max-height:80vh;';
        const fuente   = document.createElement('source');
        fuente.src     = data.src;
        fuente.type    = 'video/webm';
        video.appendChild(fuente);
        const inicio   = Date.now();
        video.addEventListener('canplay', () => {
            grietaVerde.style.setProperty('--duracion-carga', Math.max((Date.now() - inicio) / 1000, 0.5) + 's');
            terminarCarga();
            pausarAmbiente();
            modalMedia.style.display    = 'flex';
            modalMedia.style.visibility = 'visible';
        });
        video.addEventListener('error', () => terminarCarga());
        mediaContenido.appendChild(video);
        return;
    }

    if (data.tipo === 'galaxia') {
        GalaxiaCorazones.activar();
        return;
    }

    if (data.tipo === 'video-alpha') {
        // Video WebM con canal alpha — se reproduce SOBRE el mural sin modal oscuro
        abrirVideoAlpha(data.src);
        return;
    }

    if (data.tipo === 'nina') {
        activarModoNina();
        return;
    }

    if (data.tipo === 'audio') {
        iniciarCarga(2);
        const audio    = document.createElement('audio');
        audio.controls = true;
        audio.autoplay = true;
        const fuente   = document.createElement('source');
        fuente.src     = data.src;
        fuente.type    = 'audio/mpeg';
        audio.appendChild(fuente);
        const inicio   = Date.now();
        audio.addEventListener('canplay', () => {
            grietaVerde.style.setProperty('--duracion-carga', Math.max((Date.now() - inicio) / 1000, 0.5) + 's');
            terminarCarga();
            pausarAmbiente();
            modalMedia.style.display    = 'flex';
            modalMedia.style.visibility = 'visible';
        });
        audio.addEventListener('error', () => terminarCarga());
        mediaContenido.appendChild(audio);
        return;
    }
}

// ==========================================
// --- VIDEO CON ALPHA (WebM transparente) ---
// ==========================================
let videoAlphaActivo = false;

function abrirVideoAlpha(src) {
    if (videoAlphaActivo) return;
    videoAlphaActivo = true;

    iniciarCarga(3);

    const container = document.getElementById('mural-container');

    // Crear elemento video superpuesto
    const video         = document.createElement('video');
    video.id            = 'video-alpha-overlay';
    video.autoplay      = true;
    video.playsInline   = true;
    video.style.cssText = `
        position:absolute; top:0; left:0; width:100%; height:100%;
        object-fit:contain; z-index:60; pointer-events:none;
        opacity:0; transition:opacity 0.4s ease;
    `;

    const fuente  = document.createElement('source');
    fuente.src    = src;
    fuente.type   = 'video/webm';
    video.appendChild(fuente);

    // Botón cerrar alpha
    const btnAlpha         = document.createElement('button');
    btnAlpha.id            = 'cerrar-alpha';
    btnAlpha.textContent   = 'CERRAR';
    btnAlpha.style.cssText = `
        position:absolute; top:20px; right:20px; z-index:70;
        background:red; color:#fff; border:none; padding:10px;
        cursor:pointer; font-size:0.9rem; border-radius:4px;
        display:none;
    `;

    function cerrarAlpha() {
        video.pause();
        video.remove();
        btnAlpha.remove();
        videoAlphaActivo = false;
        reanudarAmbiente();
    }

    btnAlpha.addEventListener('click', cerrarAlpha);

    video.addEventListener('canplay', () => {
        terminarCarga();
        pausarAmbiente();
        video.style.opacity = '1';
        btnAlpha.style.display = 'block';
    }, { once: true });

    video.addEventListener('ended', () => {
        video.style.opacity = '0';
        setTimeout(cerrarAlpha, 400);
    });

    video.addEventListener('error', () => {
        terminarCarga();
        videoAlphaActivo = false;
    });

    container.appendChild(video);
    container.appendChild(btnAlpha);
}


// ==========================================
// --- MODO NIÑA — NAVEGACIÓN MANUAL + EFECTOS ---
// ==========================================
const ninaSrcs = [
    'assets/nina-1.png','assets/nina-2.png','assets/nina-3.png','assets/nina-4.png',
    'assets/nina-5.png','assets/nina-6.png','assets/nina-7.png','assets/nina-8.png',
];

let ninaIndex        = 0;
let ninaModoActivo   = false;
let ninaEfectoActivo = null;

// CAMBIO: profesionistas con brillo suave + respiracion, sin glow intenso
const elementosBrillantes = [
    'glow-doctora','glow-ingeniera','glow-maestra','glow-bombera',
    'glow-repartidora','glow-jugadoras','glow-futbolista'
];
const todasLasCapas = [
    'glow-jugadoras','glow-historia','glow-azteca','grieta-verde',
    'glow-bombera','glow-doctora','glow-futbolista','glow-ingeniera',
    'glow-maestra','glow-repartidora','glow-nosotras','glow-nina','img-creditos-btn'
];

function limpiarEfectoNina() {
    // Primero cleanup (cancela RAF, intervalos, restaura estilos de capas)
    // LUEGO vaciar el DOM — así los elementos todavía existen cuando cleanup los busca
    if (ninaEfectoActivo && ninaEfectoActivo.cleanup) {
        try { ninaEfectoActivo.cleanup(); } catch(e) {}
    }
    ninaEfectoActivo = null;
    const vfx = document.getElementById('nina-vfx');
    if (vfx) vfx.innerHTML = '';
}

// ─── 1. FUTBOLISTA — colores vivos, onda expansiva, rebote elástico ─
function efectoFutbolista(vfx) {
    // ── CAPAS AL FRENTE ─────────────────────────────────────────
    const elFutbolista = document.getElementById('glow-futbolista');
    const elNina       = document.getElementById('glow-nina');
    if(elFutbolista){elFutbolista.style.zIndex='62';elFutbolista.style.position='absolute';}
    if(elNina)      {elNina.style.zIndex='63';      elNina.style.position='absolute';}

    // ── KEYFRAMES (una vez) ──────────────────────────────────────
    if(!document.getElementById('ft-keyframes')){
        const st=document.createElement('style');st.id='ft-keyframes';
        st.textContent=`
        @keyframes ftLights{from{transform:translateX(-40px) translateY(-10px);}to{transform:translateX(40px) translateY(10px);}}
        @keyframes ftField{from{background-position:0 0;}to{background-position:160px 0;}}
        @keyframes ftGlow{from{box-shadow:0 0 10px rgba(255,255,255,.15);}to{box-shadow:0 0 25px rgba(0,255,255,.35);}}
        `;
        document.head.appendChild(st);
    }

    // ── FONDO ESTADIO SEMITRANSPARENTE ──────────────────────────
    const stadiumDiv=document.createElement('div');
    stadiumDiv.style.cssText=`position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:56;
        background:radial-gradient(circle at center,rgba(31,61,43,0.75) 0%,rgba(11,23,36,0.82) 65%);`;

    const lights=document.createElement('div');
    lights.style.cssText=`position:absolute;inset:-20%;
        background:radial-gradient(circle at top,rgba(255,255,255,.2),transparent 30%),
        radial-gradient(circle at left,rgba(0,255,255,.07),transparent 40%),
        radial-gradient(circle at right,rgba(255,255,255,.07),transparent 40%);
        filter:blur(20px);animation:ftLights 8s linear infinite alternate;`;
    stadiumDiv.appendChild(lights);

    const field=document.createElement('div');
    field.style.cssText=`position:absolute;width:200%;height:60%;left:-50%;bottom:0%;
        transform:rotateX(75deg) translateZ(-80px);
        background:repeating-linear-gradient(90deg,rgba(31,106,55,0.62) 0px,rgba(31,106,55,0.62) 80px,rgba(44,138,73,0.62) 80px,rgba(44,138,73,0.62) 160px);
        box-shadow:0 0 80px rgba(0,255,120,.18);animation:ftField 6s linear infinite;`;
    const fl=document.createElement('div');
    fl.style.cssText=`position:absolute;inset:0;
        background:linear-gradient(white,white) center/3px 100% no-repeat,
        radial-gradient(circle,transparent 0 55px,rgba(255,255,255,.7) 57px,transparent 59px) center/100% 100% no-repeat;
        opacity:.80;`;
    field.appendChild(fl);stadiumDiv.appendChild(field);

    const label=document.createElement('div');
    label.style.cssText=`position:absolute;top:clamp(4px,1.5%,12px);left:50%;transform:translateX(-50%);
        z-index:62;color:white;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.2);
        backdrop-filter:blur(8px);padding:clamp(2px,0.8%,7px) clamp(6px,2%,18px);border-radius:20px;
        font-size:clamp(7px,1.6vw,13px);letter-spacing:2px;white-space:nowrap;font-family:Arial,sans-serif;
        pointer-events:none;animation:ftGlow 2s infinite alternate;`;
    label.textContent='⚽ ¡Patea los balones! ⚽';
    stadiumDiv.appendChild(label);
    vfx.appendChild(stadiumDiv);

    // ── CANVAS ──────────────────────────────────────────────────
    const canvas=document.createElement('canvas');
    canvas.style.cssText=`position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:auto;z-index:57;will-change:transform;`;
    vfx.appendChild(canvas);
    let W=canvas.width=vfx.offsetWidth, H=canvas.height=vfx.offsetHeight;
    const ctx=canvas.getContext('2d');
    let balls=[],parts=[],raf,lastCol=0;

    // ── AUDIO ────────────────────────────────────────────────────
    const _fac=window.AudioContext?new (window.AudioContext||window.webkitAudioContext)():null;
    function fbeep(freq,dur,type,vol,rampTo){
        if(!_fac)return;
        try{
            if(_fac.state==='suspended')_fac.resume();
            const o=_fac.createOscillator(),g=_fac.createGain();
            o.type=type||'sine';
            o.frequency.setValueAtTime(freq,_fac.currentTime);
            if(rampTo)o.frequency.exponentialRampToValueAtTime(rampTo,_fac.currentTime+dur);
            g.gain.setValueAtTime(vol||0.15,_fac.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001,_fac.currentTime+dur);
            o.connect(g);g.connect(_fac.destination);o.start();o.stop(_fac.currentTime+dur+0.05);
        }catch(e){}
    }
    // Onda expansiva: tono ascendente en capas
    function playWaveSound(){[280,420,560,700].forEach((f,i)=>setTimeout(()=>fbeep(f,0.22,'triangle',0.06,f*1.6),i*28));}
    // Patada: golpe seco grave
    function playKick(){fbeep(160,0.13,'sine',0.20,50);}
    // Colisión suave
    function playBump(){fbeep(320,0.08,'triangle',0.05,200);}

    // ── PALETA DE COLORES VIVOS — 24 tonos bien distribuidos ────
    const VIVID_HUES=[0,15,30,45,60,80,100,130,160,180,200,220,240,260,280,300,315,330,345,
                      50,170,210,270,350];
    let _hueIdx=Math.floor(Math.random()*VIVID_HUES.length);
    function nextVividColor(){
        const h=VIVID_HUES[_hueIdx];
        _hueIdx=(_hueIdx+Math.floor(VIVID_HUES.length/3)+1)%VIVID_HUES.length;
        const s=85+Math.floor(Math.random()*15);
        const l=50+Math.floor(Math.random()*10);
        return{hue:h, main:`hsl(${h},${s}%,${l}%)`, glow:`hsl(${h},100%,70%)`, dark:`hsl(${h},80%,25%)`};
    }

    // ── IMAGEN BALÓN ─────────────────────────────────────────────
    const balonImg=new Image(); balonImg.src='assets/centro-balon-loader.png';

    // ── TAMAÑOS Y CONTEO ADAPTATIVO (móvil / escritorio) ─────────
    function bSizes(){
        const min=Math.min(W,H);
        // Más pequeños en pantallas estrechas (portrait móvil)
        const base= W<500 ? [.055,.07,.085] : [.045,.06,.075];
        return base.map(f=>Math.max(12,Math.round(min*f)));
    }
    function bCount(){
        const a=W*H;
        return a<80000?9 : a<200000?14 : a<400000?18 : 22;
    }

    // ── SPAWN ────────────────────────────────────────────────────
    function spawn(){
        balls=[];parts=[];
        const sizes=bSizes(),n=bCount();
        for(let i=0;i<n;i++){
            const r=sizes[Math.floor(Math.random()*sizes.length)];
            let x,y,ok,t=0;
            do{
                x=r+Math.random()*(W-r*2);
                y=r+Math.random()*(H-r*2);
                ok=balls.every(b=>Math.hypot(b.x-x,b.y-y)>r+b.r+6);
                t++;
            }while(!ok&&t<120);
            const sp=1.0+Math.random()*1.6, ang=Math.random()*Math.PI*2;
            balls.push({
                x,y,
                vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp,
                r, rot:0, rsp:(Math.random()-.5)*.06,
                color:nextVividColor(),
                alive:true
            });
        }
    }

    // ── EXPLOSIÓN CON ONDA EXPANSIVA ─────────────────────────────
    function explodeBall(b){
        playWaveSound();
        // Onda expansiva que empuja físicamente los demás balones
        parts.push({
            type:'wave', x:b.x, y:b.y,
            r:b.r*0.3, maxRadius:Math.max(W,H)*0.20,
            color:b.color, life:3.0, dec:0.07
        });
        // Chispas neón que vuelan con gravedad
        const _mp=window.innerWidth<768?8:14;for(let i=0;i<_mp;i++){
            const ang=Math.random()*Math.PI*2, sp=3+Math.random()*5.5;
            parts.push({
                type:'spark', x:b.x, y:b.y,
                vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp-1,
                size:Math.max(2,b.r*0.09+Math.random()*4),
                color:b.color, life:1.0, dec:0.016+Math.random()*0.025
            });
        }
        // Anillo de luz secundario con color complementario
        const compHue=(b.color.hue+180)%360;
        parts.push({
            type:'wave', x:b.x, y:b.y,
            r:b.r*0.1, maxRadius:Math.max(W,H)*0.3,
            color:{hue:compHue,main:`hsl(${compHue},100%,60%)`,glow:`hsl(${compHue},100%,75%)`},
            life:2.0, dec:0.10
        });
        b.alive=false;
        if(balls.every(x=>!x.alive)) setTimeout(spawn,1400);
    }

    // ── FÍSICA: rebote, fricción, velocidad mínima, colisión elástica
    function physics(){
        const alive=balls.filter(b=>b.alive);

        alive.forEach(b=>{
            b.x+=b.vx; b.y+=b.vy; b.rot+=b.rsp;
            // Fricción suave — frena tras ser empujados
            b.vx*=0.986; b.vy*=0.986;
            // Velocidad mínima para que no queden estáticos
            const sp=Math.hypot(b.vx,b.vy);
            if(sp<0.5){
                const a=Math.random()*Math.PI*2;
                b.vx=Math.cos(a)*0.7; b.vy=Math.sin(a)*0.7;
            }
            // Rebote con bordes
            if(b.x-b.r<0){b.x=b.r; b.vx=Math.abs(b.vx);}
            if(b.x+b.r>W){b.x=W-b.r; b.vx=-Math.abs(b.vx);}
            if(b.y-b.r<0){b.y=b.r; b.vy=Math.abs(b.vy);}
            if(b.y+b.r>H){b.y=H-b.r; b.vy=-Math.abs(b.vy);}
        });

        // Colisiones elásticas entre balones
        const now=performance.now();
        for(let i=0;i<alive.length;i++){
            for(let j=i+1;j<alive.length;j++){
                const a=alive[i],b=alive[j];
                const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),md=a.r+b.r;
                if(d<md&&d>0.01){
                    const nx=dx/d,ny=dy/d,ov=(md-d)/2+0.5;
                    a.x-=nx*ov; a.y-=ny*ov; b.x+=nx*ov; b.y+=ny*ov;
                    const ad=a.vx*nx+a.vy*ny, bd=b.vx*nx+b.vy*ny;
                    if(ad-bd>0){
                        a.vx+=(bd-ad)*nx; a.vy+=(bd-ad)*ny;
                        b.vx+=(ad-bd)*nx; b.vy+=(ad-bd)*ny;
                        if(now-lastCol>80){lastCol=now; playBump();}
                    }
                }
            }
        }

        // Procesar partículas + DETECTAR IMPACTO DE ONDA CONTRA BALONES
        for(let i=parts.length-1;i>=0;i--){
            const p=parts[i];
            p.life-=p.dec;

            if(p.type==='wave'){
                // Crecimiento progresivo — onda se expande hacia afuera
                p.r+=(p.maxRadius-p.r)*0.09;

                // Empuje físico: el contorno dinámico de la onda impacta a los balones
                alive.forEach(b=>{
                    const dx=b.x-p.x, dy=b.y-p.y, dist=Math.hypot(dx,dy);
                    // Solo si el balón está en el borde frontal de la onda expansiva
                    if(dist>p.r-20 && dist<p.r+b.r+5){
                        const angle=Math.atan2(dy,dx);
                        // Fuerza inversamente proporcional a qué tan expandida está la onda
                        const force=(1.0-(p.r/p.maxRadius))*14;
                        if(force>0.4){
                            b.vx+=Math.cos(angle)*force;
                            b.vy+=Math.sin(angle)*force;
                            // Cap de velocidad máxima tras onda
                            const bsp=Math.hypot(b.vx,b.vy);
                            if(bsp>9){b.vx=(b.vx/bsp)*9; b.vy=(b.vy/bsp)*9;}
                        }
                    }
                });

            } else if(p.type==='spark'){
                p.x+=p.vx; p.y+=p.vy;
                p.vy+=0.10; // gravedad suave
            }

            if(p.life<=0) parts.splice(i,1);
        }
    }

    // ── INTERACCIÓN: patear o onda de fuerza ─────────────────────
    function getXY(e){
        const rect=canvas.getBoundingClientRect();
        const src=e.touches?e.touches[0]:e;
        return{x:(src.clientX-rect.left)*(W/rect.width), y:(src.clientY-rect.top)*(H/rect.height)};
    }
    function tap(e){
        e.preventDefault();
        const{x,y}=getXY(e); let hit=false;
        for(const b of balls){
            if(!b.alive)continue;
            if(Math.hypot(b.x-x,b.y-y)<b.r+12){
                explodeBall(b); hit=true; break;
            }
        }
        // Si no hay hit directo: onda de fuerza que empuja balones cercanos
        if(!hit){
            balls.forEach(b=>{
                if(!b.alive)return;
                const dx=b.x-x,dy=b.y-y,d=Math.hypot(dx,dy)||1;
                if(d<b.r*5){
                    const f=(b.r*5-d)/(b.r*5);
                    b.vx+=(dx/d)*f*12; b.vy+=(dy/d)*f*12;
                    const sp=Math.hypot(b.vx,b.vy); if(sp>8){b.vx=(b.vx/sp)*8; b.vy=(b.vy/sp)*8;}
                    playKick();
                }
            });
        }
    }
    canvas.addEventListener('mousedown',tap);
    canvas.addEventListener('touchstart',e=>{e.preventDefault();tap(e);},{passive:false});

    // ── RENDER ───────────────────────────────────────────────────
    function loop(){
        ctx.clearRect(0,0,W,H);
        physics();

                // Dibujar balones: Imagen original con brillo exterior
        balls.filter(b => b.alive).forEach(b => {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(b.rot);

            // Glow exterior (mantiene la estética neón del juego)
            ctx.shadowColor = b.color.glow;
            ctx.shadowBlur = b.r * 0.55;

            // Dibujado directo de la imagen
            if (balonImg.complete && balonImg.naturalWidth) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(balonImg, -b.r, -b.r, b.r * 2, b.r * 2);
            } else {
                // Fallback de seguridad por si la imagen no carga
                ctx.beginPath();
                ctx.arc(0, 0, b.r, 0, Math.PI * 2);
                ctx.fillStyle = b.color.main;
                ctx.fill();
            }

            ctx.shadowBlur = 0;
            ctx.restore();
        });

 // Dibujar partículas: ondas y chispas
        ctx.save();
        ctx.globalCompositeOperation='screen';
        parts.forEach(p=>{
            ctx.save();
            if(p.type==='wave'){
                // Gradiente radial: contorno luminoso difuminado y limpio
                const grad=ctx.createRadialGradient(p.x,p.y,p.r*0.72,p.x,p.y,p.r);
                grad.addColorStop(0,`hsla(${p.color.hue},100%,50%,0.05)`);
                grad.addColorStop(0.65,`hsla(${p.color.hue},100%,60%,${(p.life*0.85).toFixed(2)})`);
                grad.addColorStop(0.88,`rgba(255,255,255,${Math.min(1,p.life).toFixed(2)})`);
                grad.addColorStop(1,`hsla(${p.color.hue},100%,55%,0)`);
                ctx.fillStyle=grad;
                ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
            } else if(p.type==='spark'){
                ctx.shadowBlur=12; ctx.shadowColor=p.color.glow;
                ctx.fillStyle=p.color.main;
                ctx.globalAlpha=Math.max(0,p.life);
                ctx.beginPath();ctx.arc(p.x,p.y,Math.max(0.5,p.size*p.life),0,Math.PI*2);ctx.fill();
            }
            ctx.restore();
        });
        ctx.restore();

        // Throttle a 30 fps — reduce carga CPU/GPU en móvil
        const _now = performance.now();
        if (_now - (loop._last||0) < 33) { raf=requestAnimationFrame(loop); return; }
        loop._last = _now;
        raf=requestAnimationFrame(loop);
    }

    // ── RESIZE ADAPTATIVO (portrait/landscape en móvil) ─────────
    let _resizeTimer;
    function onResize(){
        clearTimeout(_resizeTimer);
        _resizeTimer=setTimeout(()=>{
            const nW=vfx.offsetWidth, nH=vfx.offsetHeight;
            if(!nW||!nH) return;
            W=canvas.width=nW; H=canvas.height=nH;
            spawn();
        },120);
    }
    const _ro=new ResizeObserver(onResize);
    _ro.observe(vfx);

    spawn(); loop();

    return{cleanup:()=>{
        cancelAnimationFrame(raf); raf=null;
        _ro.disconnect();
        canvas.remove(); stadiumDiv.remove();
        if(elFutbolista){elFutbolista.style.zIndex='';elFutbolista.style.position='';}
        if(elNina){elNina.style.zIndex='';elNina.style.position='';}
    }};
}


// ─── 2. ASTRONAUTA — sistema solar 3D con campo de estrellas profundo ──────
function efectoAstronauta(vfx) {
    // ── CAPAS AL FRENTE (Esto es lo que agregaste y está bien) ──
    const elNina = document.getElementById('glow-nina');
    if(elNina) {
        elNina.style.zIndex = '63'; 
        elNina.style.position = 'absolute';
    }
    var GOLD = 97000;
    // Texturas locales con fallback a URLs externas
    var P = [
        {n:"Sol",      isSun:true,  img:"assets/sol.jpg",       fb:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/332937/sun.jpg",      g:27.9, s:"40s", tilt:"0°",     day:"~600 h",  year:"—",           d:"La estrella de nuestro sistema. Un plasma ardiente de hidrógeno y helio que ilumina todo a su alrededor."},
        {n:"Mercurio",              img:"assets/mercurio.jpg",   fb:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/332937/mercury2.jpg", g:.38,  s:"18s", tilt:"0.034°", day:"1,407 h", year:"88 días",     d:"El más cercano al Sol, cubierto de cráteres. Sin atmósfera real, temperaturas entre -180 y 430 °C."},
        {n:"Venus",                 img:"assets/venus.jpg",      fb:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/332937/venus2.jpg",   g:.91,  s:"28s", tilt:"177.3°", day:"5,832 h", year:"224.7 días",  d:"Un infierno de nubes tóxicas de ácido sulfúrico. El planeta más caliente, con 465 °C en promedio."},
        {n:"Tierra",                img:"assets/tierra.jpg",     fb:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/332937/earth.jpg",    g:1,    s:"12s", tilt:"23.26°", day:"23.9 h",  year:"365.2 días",  d:"El oasis azul flotando en el vacío cósmico. Único planeta con vida conocida, agua líquida y luna estabilizadora."},
        {n:"Marte",                 img:"assets/marte.jpg",      fb:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/332937/mars.jpg",     g:.38,  s:"15s", tilt:"25.2°",  day:"24.6 h",  year:"687 días",    d:"Desiertos rojos, tormentas globales y el Olimpo: volcán de 22 km de altura, el más alto del sistema solar."},
        {n:"Júpiter",               img:"assets/jupiter.jpg",    fb:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/332937/jupiter.jpg",  g:2.34, s:"8s",  tilt:"3.1°",   day:"9.9 h",   year:"4,331 días",  d:"El monstruo gaseoso. Su Gran Mancha Roja es una tormenta activa desde hace siglos, más grande que la Tierra."},
        {n:"Saturno",  ring:1,      img:"assets/saturno.jpg",    fb:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/332937/saturn.jpg",   g:1.06, s:"10s", tilt:"26.7°",  day:"10.7 h",  year:"10,747 días", d:"Sus anillos de hielo y roca se extienden 282,000 km. Si lo pusiéramos en agua, flotaría."},
        {n:"Urano",                 img:"assets/urano.jpg",      fb:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/332937/uranus2.jpg",  g:.92,  s:"20s", tilt:"97.8°",  day:"17.2 h",  year:"30,589 días", d:"El gigante helado que rota de lado, inclinación de 98°. Sus vientos alcanzan 900 km/h."},
        {n:"Neptuno",               img:"assets/neptuno.jpg",    fb:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/332937/neptune.jpg",  g:1.19, s:"16s", tilt:"28.3°",  day:"16.1 h",  year:"59,800 días", d:"El más lejano y ventoso. Tormentas de 2,100 km/h. Un azul profundo de metano helado."},
        {n:"Plutón",                img:"assets/pluton.jpg",     fb:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/332937/pluto.jpg",    g:.063, s:"35s", tilt:"122.5°", day:"153.3 h", year:"90,560 días", d:"El planeta enano al borde del sistema solar. En 2006 perdió su título de planeta oficial."},
        {n:"Balón", isFootball:true, img:"assets/balon-tierra.png", fb:"", g:null, s:null, tilt:"—", day:"—", year:"—", d:"El planeta más popular de la Tierra. Redondo, blanco y negro, viaja a 120 km/h al patear. Once contra once."}
    ];
    var cur=0, isSpeaking=false;
 
    // ── OCULTAR PROFESIONISTAS COMPLETAMENTE (solo nina-2 visible) ──
    var _profOcultas = ['glow-doctora','glow-ingeniera','glow-maestra','glow-bombera','glow-repartidora','glow-futbolista'];
    _profOcultas.forEach(function(id){
        var el=document.getElementById(id);
        if(el){el.style.transition='opacity 0.4s ease';el.style.opacity='0';}
    });
 
    // ── CONTENEDOR ─────────────────────────────────────────────────
    vfx.innerHTML='';
    vfx.style.pointerEvents='auto';
    // Fondo negro sólido para el modo astronauta (campo de estrellas 3D real)
    vfx.style.background='#000010';
 
    // ── KEYFRAMES (una sola vez) ─────────────────────────────────
    if(!document.getElementById('as2-kf')){
        var sk=document.createElement('style');sk.id='as2-kf';
        sk.textContent=`
        @keyframes as2FadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes as2Spin{from{background-position:0% center}to{background-position:-200% center}}
        @keyframes as2SunGlow{0%,100%{box-shadow:inset -25px -12px 45px rgba(255,140,0,.3),0 0 55px 15px rgba(255,160,0,.45)}50%{box-shadow:inset -25px -12px 45px rgba(255,160,0,.4),0 0 75px 25px rgba(255,200,0,.6)}}
        @keyframes as2Ring{to{transform:rotateZ(360deg)}}
        @keyframes as2Float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        `;
        document.head.appendChild(sk);
    }
 
    // ── WRAP PRINCIPAL ──────────────────────────────────────────
    var wrap=document.createElement('div');
    wrap.style.cssText='position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(2px,0.8vh,7px);overflow:hidden;';
 
    wrap.innerHTML=`
    <!-- ★ CANVAS CAMPO DE ESTRELLAS 3D ★ -->
    <canvas id="as2-stars" style="position:absolute;inset:0;pointer-events:none;z-index:0;"></canvas>
 
    <!-- Botón TTS -->
    <button id="as2-tts" title="Leer descripción" style="position:absolute;top:clamp(6px,2%,12px);left:clamp(6px,2%,12px);z-index:20;
        width:clamp(26px,5.5vw,38px);height:clamp(26px,5.5vw,38px);border-radius:50%;
        border:1.5px solid rgba(255,255,255,.35);background:rgba(0,0,0,.65);
        backdrop-filter:blur(6px);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;
        transition:background .2s;touch-action:manipulation;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            style="width:clamp(11px,2.8vw,16px);height:clamp(11px,2.8vw,16px);">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
    </button>
 
    <!-- Dots indicadores -->
    <div id="as2-dots" style="display:flex;gap:clamp(3px,1vw,6px);flex-wrap:wrap;justify-content:center;
        max-width:min(320px,88vw);z-index:3;position:relative;padding:0 6px;"></div>
 
    <!-- Row: prev · planeta · next -->
    <div style="display:flex;align-items:center;justify-content:center;gap:clamp(8px,2.5vw,20px);position:relative;z-index:3;">
        <button id="as2-prev" style="width:clamp(30px,7.5vw,44px);height:clamp(30px,7.5vw,44px);border-radius:50%;
            border:1.5px solid rgba(255,255,255,.4);background:rgba(0,0,0,.55);color:#fff;cursor:pointer;
            display:flex;align-items:center;justify-content:center;touch-action:manipulation;transition:background .2s;backdrop-filter:blur(4px);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:15px;height:15px;"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
 
        <!-- Planeta 3D con órbita de referencia -->
        <div id="as2-pw" style="position:relative;flex-shrink:0;width:clamp(90px,22vw,155px);height:clamp(90px,22vw,155px);">
            <!-- Elipse de órbita de fondo (decorativa) -->
            <div id="as2-orbit" style="position:absolute;top:50%;left:50%;
                width:180%;height:40%;border-radius:50%;
                border:1px solid rgba(255,255,255,.12);
                transform:translate(-50%,-50%) rotateX(75deg);
                pointer-events:none;z-index:0;"></div>
            <!-- Planeta girando -->
            <div id="as2-pl" style="border-radius:50%;background-size:200% 100%;background-repeat:repeat-x;
                width:100%;height:100%;
                animation:as2Spin 12s linear infinite;
                box-shadow:inset -25px -12px 45px rgba(0,0,0,.85),inset 8px 6px 18px rgba(255,255,255,.08);
                position:relative;z-index:1;"></div>
            <!-- Balón (planeta fútbol) — misma técnica de background deslizante que los planetas -->
            <div id="as2-fw" style="width:100%;height:100%;border-radius:50%;display:none;
                position:absolute;inset:0;z-index:1;
                background-size:200% 100%;background-repeat:repeat-x;
                animation:as2Spin 2.2s linear infinite;
                box-shadow:inset -25px -12px 45px rgba(0,0,0,.75),inset 8px 6px 18px rgba(255,255,255,.15),0 0 22px 4px rgba(255,255,255,.12);"></div>
            <!-- Anillo Saturno 3D -->
            <div id="as2-rw" style="position:absolute;top:50%;left:50%;width:170%;height:38%;
                transform:translate(-50%,-50%) rotateX(74deg);opacity:0;transition:.35s;pointer-events:none;z-index:2;">
                <div style="width:100%;height:100%;border-radius:50%;
                    border:clamp(4px,1.2vw,10px) solid rgba(214,192,145,.55);
                    box-shadow:0 0 12px rgba(214,192,145,.25);
                    animation:as2Ring 22s linear infinite;"></div>
            </div>
        </div>
 
        <button id="as2-next" style="width:clamp(30px,7.5vw,44px);height:clamp(30px,7.5vw,44px);border-radius:50%;
            border:1.5px solid rgba(255,255,255,.4);background:rgba(0,0,0,.55);color:#fff;cursor:pointer;
            display:flex;align-items:center;justify-content:center;touch-action:manipulation;transition:background .2s;backdrop-filter:blur(4px);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:15px;height:15px;"><path d="M9 18l6-6-6-6"/></svg>
        </button>
    </div>
 
    <!-- ★ INFO con RECUADRO / BACKDROP para legibilidad ★ -->
    <div id="as2-info" style="text-align:center;z-index:3;position:relative;
        padding:clamp(6px,1.2vh,10px) clamp(10px,3vw,18px);
        max-width:min(400px,88vw);
        background:rgba(0,0,10,.72);
        border:1px solid rgba(255,255,255,.14);
        border-radius:12px;
        backdrop-filter:blur(8px);
        box-shadow:0 0 20px rgba(0,0,0,.6);">
        <h2 id="as2-pn" style="font-size:clamp(.85rem,3.2vw,1.2rem);font-weight:700;margin:0 0 3px;
            font-family:Georgia,serif;letter-spacing:.04em;color:#fff;
            text-shadow:0 0 12px rgba(150,200,255,.6);"></h2>
        <p id="as2-pd" style="font-size:clamp(.55rem,1.9vw,.72rem);opacity:.92;line-height:1.55;
            font-family:Georgia,serif;margin:0 0 4px;color:#dde8ff;"></p>
        <div id="as2-stats" style="display:flex;gap:clamp(6px,2.5vw,14px);justify-content:center;
            font-size:clamp(.48rem,1.5vw,.62rem);opacity:.8;font-family:Arial,sans-serif;
            color:#b0c8ff;flex-wrap:wrap;"></div>
    </div>
 
    <!-- Calculadora de peso -->
    <div style="background:rgba(0,0,20,.75);border:1px solid rgba(255,255,255,.18);
        padding:clamp(4px,1vh,8px) clamp(8px,2.5vw,14px);border-radius:12px;
        font-size:clamp(.58rem,1.9vw,.72rem);z-index:3;position:relative;text-align:center;
        min-width:min(170px,54vw);font-family:Arial,sans-serif;backdrop-filter:blur(6px);
        box-shadow:0 0 12px rgba(0,0,0,.5);">
        <div id="as2-wbl" style="color:#9fd4ff;margin-bottom:3px;">Tu peso en otros mundos</div>
        <input type="number" id="as2-kg" value="70" placeholder="kg"
            style="width:clamp(76px,20vw,115px);padding:clamp(3px,.8vh,5px);border:1px solid rgba(255,255,255,.2);
            border-radius:8px;background:rgba(255,255,255,.1);color:#fff;text-align:center;
            font-size:clamp(.62rem,1.9vw,.73rem);margin:0 auto;display:block;">
        <div id="as2-res" style="margin-top:4px;font-size:clamp(.62rem,1.9vw,.73rem);font-weight:700;color:#9fd4ff;min-height:15px;"></div>
    </div>`;
 
    vfx.appendChild(wrap);
 
    // ── CAMPO DE ESTRELLAS 3D CON PROFUNDIDAD REAL ──────────────
    var cv = document.getElementById('as2-stars');
    var sctx = cv.getContext('2d');
    var stars = [];
    var raf2;
 
    function rsz() {
        cv.width  = wrap.clientWidth  || wrap.offsetWidth  || 800;
        cv.height = wrap.clientHeight || wrap.offsetHeight || 300;
        initStars();
    }
 
    function initStars() {
        var W2 = cv.width, H2 = cv.height;
        var num = W2 < 600 ? 140 : 220;
        stars = [];
        for (var i = 0; i < num; i++) {
            stars.push({
                x:  (Math.random() - 0.5) * W2 * 2,
                y:  (Math.random() - 0.5) * H2 * 2,
                z:  Math.random() * W2,
                sz: Math.random() * 2.4 + 0.4
            });
        }
    }
 
    function animateStars() {
        var W2 = cv.width, H2 = cv.height;
        var cx = W2 / 2, cy = H2 / 2;
        // Rastro suave — da el efecto de velocidad
        sctx.fillStyle = 'rgba(0,0,10,0.22)';
        sctx.fillRect(0, 0, W2, H2);
 
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.z -= 1.8;
            if (s.z <= 0) {
                s.z = W2;
                s.x = (Math.random() - 0.5) * W2 * 2;
                s.y = (Math.random() - 0.5) * H2 * 2;
                continue;
            }
            var px = (s.x / s.z) * cx + cx;
            var py = (s.y / s.z) * cy + cy;
            if (px < 0 || px > W2 || py < 0 || py > H2) {
                s.z = W2; s.x = (Math.random()-0.5)*W2*2; s.y = (Math.random()-0.5)*H2*2;
                continue;
            }
            var prog = 1 - s.z / W2;
            var r    = Math.max(0.1, prog * s.sz * 2.2);
            var al   = prog * 0.9;
            sctx.beginPath();
            sctx.fillStyle = 'rgba(255,255,255,' + al.toFixed(2) + ')';
            sctx.arc(px, py, r, 0, Math.PI * 2);
            sctx.fill();
        }
        // Throttle 24fps
        const _t2 = performance.now();
        if (_t2 - (animateStars._last||0) < 42) { raf2=requestAnimationFrame(animateStars); return; }
        animateStars._last = _t2;
        raf2 = requestAnimationFrame(animateStars);
    }

    rsz();
    window.addEventListener('resize', rsz);
    animateStars();
 
    // ── DOTS ───────────────────────────────────────────────────
    var dotsEl = document.getElementById('as2-dots');
    P.forEach(function(_, i) {
        var d = document.createElement('div');
        d.style.cssText = 'width:clamp(5px,1.3vw,8px);height:clamp(5px,1.3vw,8px);border-radius:50%;background:rgba(255,255,255,.28);cursor:pointer;transition:.2s;flex-shrink:0;';
        d.addEventListener('click', function() { go(i); });
        dotsEl.appendChild(d);
    });
 
    // ── TTS ────────────────────────────────────────────────────
    function speak(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text); u.lang='es-MX'; u.rate=0.95; u.pitch=1;
        var voices = window.speechSynthesis.getVoices();
        var v = voices.find(function(x) { return x.lang.startsWith('es'); }); if (v) u.voice = v;
        var btn = document.getElementById('as2-tts');
        u.onstart = function() { isSpeaking=true;  if(btn) btn.style.background='rgba(100,160,255,.35)'; };
        u.onend   = function() { isSpeaking=false; if(btn) btn.style.background=''; };
        u.onerror = function() { isSpeaking=false; if(btn) btn.style.background=''; };
        window.speechSynthesis.speak(u);
    }
    var ttsBtn = document.getElementById('as2-tts');
    if (ttsBtn) ttsBtn.addEventListener('click', function() {
        if (isSpeaking) { window.speechSynthesis.cancel(); isSpeaking=false; this.style.background=''; }
        else { speak(P[cur].n + '. ' + P[cur].d); }
    });
 
    // ── CALCULADORA DE PESO ────────────────────────────────────
    function wt() {
        var v   = parseFloat(document.getElementById('as2-kg').value) || 0;
        var p   = P[cur];
        var wbl = document.getElementById('as2-wbl');
        var res = document.getElementById('as2-res');
        if (p.isFootball) {
            wbl.textContent='Tu precio en oro'; wbl.style.color='#ffd700';
            res.innerHTML='<b>$' + (v*GOLD).toLocaleString('es-MX') + ' USD</b>';
        } else {
            wbl.textContent='Tu peso en otros mundos'; wbl.style.color='#9fd4ff';
            res.innerHTML='En <b>'+p.n+'</b>: <b>'+(v*p.g).toFixed(1)+' kg</b>';
        }
    }
    var kgEl = document.getElementById('as2-kg'); if (kgEl) kgEl.oninput = wt;
 
    // ── HELPER: cargar textura con fallback ───────────────────
    function resolveImg(p, callback) {
        var img1 = new Image();
        img1.onload  = function() { callback(p.img); };
        img1.onerror = function() {
            if (p.fb) { callback(p.fb); }
            else { callback(''); }
        };
        img1.src = p.img;
    }
 
    // ── RENDER PLANETA ─────────────────────────────────────────
    function renderPlanet(i, texUrl) {
        var p  = P[i];
        var pl = document.getElementById('as2-pl');
        var fw = document.getElementById('as2-fw');
        var rw = document.getElementById('as2-rw');
        if (!pl) return;
 
        if (p.isFootball) {
            // Balón: misma técnica esférica que los planetas
            pl.style.display = 'none';
            fw.style.display = 'block';
            fw.style.backgroundImage    = 'url(assets/balon-tierra.png)';
            fw.style.backgroundSize     = '200% 100%';
            fw.style.backgroundRepeat   = 'repeat-x';
            fw.style.animationName      = 'as2Spin';
            fw.style.animationDuration  = '16s';
            fw.style.animationTimingFunction = 'linear';
            fw.style.animationIterationCount = 'infinite';
            fw.style.boxShadow = 'inset -35px -15px 60px rgba(0,0,0,.9),inset 12px 10px 30px rgba(255,255,255,.25),inset 0px -8px 20px rgba(0,0,0,.6),0 0 30px 6px rgba(255,255,255,.08)';
            fw.style.overflow = 'hidden';
        } else {
            pl.style.display = '';  fw.style.display = 'none';
            pl.style.backgroundImage  = 'url(' + texUrl + ')';
            pl.style.backgroundSize   = '200% 100%';
            pl.style.backgroundRepeat = 'repeat-x';
            pl.style.animationName    = 'as2Spin';
            pl.style.animationDuration= p.s;
            if (p.isSun) {
                pl.style.boxShadow = 'inset -25px -12px 45px rgba(255,140,0,.3),0 0 60px 18px rgba(255,170,0,.5)';
                pl.style.animationName = 'as2Spin, as2SunGlow';
                pl.style.animationDuration = p.s + ', 3s';
                pl.style.animationTimingFunction = 'linear, ease-in-out';
                pl.style.animationIterationCount = 'infinite, infinite';
            } else {
                pl.style.boxShadow = 'inset -25px -12px 45px rgba(0,0,0,.85),inset 8px 6px 18px rgba(255,255,255,.08)';
            }
        }
        // Saturno ring
        rw.style.opacity = p.ring ? '1' : '0';
 
        // Info panel con animación de entrada
        var info = document.getElementById('as2-info');
        info.style.animation = 'none'; void info.offsetWidth; info.style.animation = 'as2FadeUp .4s ease';
        document.getElementById('as2-pn').textContent = p.n;
        document.getElementById('as2-pd').textContent = p.d;
        var st = document.getElementById('as2-stats');
        if (!p.isFootball) {
            st.innerHTML = '<span>Inclinación<br><b>'+p.tilt+'</b></span><span>Día<br><b>'+p.day+'</b></span><span>Año<br><b>'+p.year+'</b></span>';
        } else { st.innerHTML=''; }
 
        dotsEl.querySelectorAll('div').forEach(function(d, j) {
            d.style.background = j===i ? '#fff' : 'rgba(255,255,255,.28)';
            d.style.boxShadow  = j===i ? '0 0 7px #fff' : '';
        });
        wt();
        setTimeout(function() { speak(p.n + '. ' + p.d); }, 300);
    }
 
    function go(i) {
        cur = (i + P.length) % P.length;
        resolveImg(P[cur], function(url) { renderPlanet(cur, url); });
    }
 
    var prevBtn = document.getElementById('as2-prev');
    var nextBtn = document.getElementById('as2-next');
    if (prevBtn) prevBtn.addEventListener('click', function() { go(cur-1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { go(cur+1); });
 
    // Swipe táctil
    var tx2 = 0;
    wrap.addEventListener('touchstart', function(e) { tx2=e.touches[0].clientX; }, {passive:true});
    wrap.addEventListener('touchend',   function(e) { var dx=e.changedTouches[0].clientX-tx2; if(Math.abs(dx)>40) go(cur+(dx<0?1:-1)); }, {passive:true});
 
    // Inicio
    resolveImg(P[0], function(url) { renderPlanet(0, url); });
 
    return { cleanup: function() {
        cancelAnimationFrame(raf2); raf2=null;
        window.removeEventListener('resize', rsz);
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        // Restaurar visibilidad de profesionistas
        _profOcultas.forEach(function(id) {
            var el=document.getElementById(id);
            if(el){el.style.opacity='';}
        });
        vfx.style.background='';
        vfx.innerHTML='';
    }};
}


function efectoDoctora(vfx) {
    const DOCTORA_Z_INDEX = 65;
    const elDoctora = document.getElementById('glow-doctora');
    const elNina    = document.getElementById('glow-nina');
    if (elDoctora) {
        elDoctora.style.zIndex   = String(DOCTORA_Z_INDEX);
        elDoctora.style.position = 'absolute';
        elDoctora.style.filter   = 'brightness(0.55)';
        elDoctora.style.animation= 'none';
    }
    if (elNina) {
        elNina.style.zIndex    = String(DOCTORA_Z_INDEX + 1);
        elNina.style.position  = 'absolute';
        elNina.style.filter    = 'brightness(1.6) drop-shadow(0 0 20px rgba(255,255,255,1))';
        elNina.style.animation = 'nina-pulso 1.8s ease-in-out infinite';
    }

    // ── AUDIO: burbuja ─────────────────────────────────────────────
    let drAudioCtx = null;
    function playBubble() {
        try {
            if (!drAudioCtx) drAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (drAudioCtx.state === 'suspended') drAudioCtx.resume();
            const ctx = drAudioCtx, now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gn  = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
            gn.gain.setValueAtTime(0.22, now);
            gn.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc.connect(gn).connect(ctx.destination);
            osc.start(now); osc.stop(now + 0.25);
        } catch(e) {}
    }

    // ── CONTENEDOR RAÍZ ────────────────────────────────────────────
    const cont = document.createElement('div');
    cont.style.cssText = 'position:absolute;inset:0;overflow:hidden;font-family:sans-serif;';
    vfx.appendChild(cont);

    // ── FONDO CUADRÍCULA MÉDICA ────────────────────────────────────
    const grid = document.createElement('div');
    grid.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;'
        + 'background-image:linear-gradient(rgba(255,0,0,.06) 1px,transparent 1px),'
        + 'linear-gradient(90deg,rgba(255,0,0,.06) 1px,transparent 1px);'
        + 'background-size:44px 44px;';
    cont.appendChild(grid);

    // ── VIRUS FLOTANTES (fuera de la caja, en el fondo del vfx) ───
    const virusLayer = document.createElement('div');
    virusLayer.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:auto;overflow:hidden;';
    cont.appendChild(virusLayer);

    const EM = ['🦠','🧫','💊','🩺','❤️‍🩹'];
    const viruses = [];
    let vafRaf;

    class Virus {
        constructor(x, y, size, small = false) {
            this.x=x; this.y=y; this.size=size; this.small=small;
            const sp = small ? 2.8 : 1.1;
            this.dx=(Math.random()-.5)*sp*2; this.dy=(Math.random()-.5)*sp*2;
            this.el=document.createElement('div');
            this.el.textContent=EM[Math.floor(Math.random()*EM.length)];
            this.el.style.cssText=`position:absolute;font-size:${size}px;cursor:pointer;`
                +`user-select:none;touch-action:manipulation;`
                +`filter:drop-shadow(0 0 5px #ff0044);z-index:1;`;
            virusLayer.appendChild(this.el);
            if (!small) {
                const explode = () => { this.explotar(); playBubble(); };
                this.el.addEventListener('click', explode);
                this.el.addEventListener('touchstart', e=>{ e.preventDefault(); explode(); },{passive:false});
            }
        }
        explotar() {
            // sólo 3 pequeños para no sobrecargar móvil
            for(let i=0;i<3;i++) viruses.push(new Virus(this.x,this.y,this.size*.4,true));
            this.el.remove();
            const idx=viruses.indexOf(this); if(idx>-1) viruses.splice(idx,1);
        }
        update(w,h) {
            this.x+=this.dx; this.y+=this.dy;
            if(this.x<0||this.x>w-this.size) this.dx*=-1;
            if(this.y<0||this.y>h-this.size) this.dy*=-1;
            this.el.style.left=this.x+'px'; this.el.style.top=this.y+'px';
            // si es pequeño y sale del área de la caja RCP, desaparece
            if(this.small){
                this.ttl=(this.ttl||0)+1;
                if(this.ttl>90){ this.el.remove(); viruses.splice(viruses.indexOf(this),1); }
            }
        }
    }

    function spawnViruses() {
        const vw=vfx.offsetWidth, vh=vfx.offsetHeight;
        // solo en la mitad derecha (fuera del área del juego)
        const count = window.innerWidth < 500 ? 4 : 6;
        for(let i=0;i<count;i++){
            const x=vw*0.55+Math.random()*vw*0.4;
            const y=Math.random()*(vh-60);
            viruses.push(new Virus(x,y,28+Math.random()*16));
        }
    }

    function virusLoop() {
        const vw=vfx.offsetWidth, vh=vfx.offsetHeight;
        // clonar para iterar (explotar modifica el array)
        [...viruses].forEach(v=>v.update(vw,vh));
        // mantener al menos 3 virus grandes
        const big=viruses.filter(v=>!v.small);
        if(big.length<3){
            const vw2=vfx.offsetWidth, vh2=vfx.offsetHeight;
            const x=vw2*0.58+Math.random()*vw2*0.38;
            const y=Math.random()*(vh2-60);
            viruses.push(new Virus(x,y,28+Math.random()*14));
        }
        vafRaf=requestAnimationFrame(virusLoop);
    }

    spawnViruses();
    vafRaf=requestAnimationFrame(virusLoop);

    // ── EKG SVG: recorre el vfx y "termina en el pecho de la nina" ─
    // El path sale de la izquierda, cruza el mural y sale por el borde derecho
    // hacia donde está la nina (esquina derecha del vfx)
    const ekgSvg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    ekgSvg.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;overflow:visible;';
    // Path adaptable: empieza en izquierda, hace la onda EKG en el centro, termina en el borde derecho a media altura (pecho de nina)
    ekgSvg.innerHTML=`<defs>
      <filter id="drGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="drGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ff0044;stop-opacity:0.2"/>
        <stop offset="60%" style="stop-color:#ff0044;stop-opacity:1"/>
        <stop offset="100%" style="stop-color:#ff6688;stop-opacity:0.5"/>
      </linearGradient>
    </defs>
    <path id="dr-ekg-path" fill="none" stroke="url(#drGrad)" stroke-width="3"
      stroke-linecap="round" filter="url(#drGlow)"
      stroke-dasharray="900" stroke-dashoffset="900"
      d="M0,55% L18%,55% L22%,55% L25%,42% L28%,72% L30%,18% L32%,80% L34%,60% L36%,55% L42%,55% L100%,38%">
      <animate attributeName="stroke-dashoffset" from="900" to="0" dur="2.2s" repeatCount="indefinite"/>
    </path>`;
    cont.appendChild(ekgSvg);

    // Ajustar el path al tamaño real del vfx con porcentajes → coordenadas px
    function recalcEkg() {
        const vw=vfx.offsetWidth, vh=vfx.offsetHeight;
        const cy=Math.round(vh*0.52), chest=Math.round(vh*0.36);
        const path=ekgSvg.querySelector('#dr-ekg-path');
        if(!path) return;
        const d=[
            `M0,${cy}`,
            `L${Math.round(vw*.18)},${cy}`,
            `L${Math.round(vw*.22)},${cy}`,
            `L${Math.round(vw*.25)},${Math.round(vh*.38)}`,
            `L${Math.round(vw*.28)},${Math.round(vh*.72)}`,
            `L${Math.round(vw*.30)},${Math.round(vh*.14)}`,
            `L${Math.round(vw*.32)},${Math.round(vh*.82)}`,
            `L${Math.round(vw*.35)},${Math.round(vh*.58)}`,
            `L${Math.round(vw*.38)},${cy}`,
            `L${Math.round(vw*.46)},${cy}`,
            `L${vw},${chest}`,  // termina en el borde derecho a la altura del pecho de la nina
        ].join(' ');
        path.setAttribute('d',d);
    }
    recalcEkg();
    window.addEventListener('resize', recalcEkg);

    // ── CAJA DEL JUEGO RCP (izquierda, ~52% de ancho) ─────────────
    const wrapper = document.createElement('div');
    // En vertical ocupa más ancho, en horizontal queda a la izquierda
    const isMobile = window.innerWidth < 600;
    wrapper.style.cssText = `position:absolute;top:0;left:0;bottom:0;`
        + `width:${isMobile?'100%':'52%'};`
        + `z-index:10;overflow:hidden;`;
    cont.appendChild(wrapper);

    wrapper.innerHTML = `
<style>
.rcp-root{position:absolute;inset:0;font-family:sans-serif;
  background:radial-gradient(ellipse at 50% 110%,rgba(46,204,113,.12) 0%,transparent 55%),
    repeating-linear-gradient(0deg,transparent,transparent 34px,rgba(255,255,255,.03) 34px,rgba(255,255,255,.03) 35px),
    repeating-linear-gradient(90deg,#163024 0px,#163024 38px,#1a3a2a 38px,#1a3a2a 76px);
  display:flex;flex-direction:column;align-items:center;justify-content:space-between;
  overflow:hidden;user-select:none;touch-action:manipulation;}
.rcp-screen{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:rgba(0,0,0,.84);backdrop-filter:blur(8px);z-index:50;padding:10px 12px;text-align:center;overflow-y:auto;}
.rcp-hidden{display:none!important;}
.rcp-title{font-size:clamp(1.1rem,4.5vw,2rem);font-weight:900;color:#fff;letter-spacing:1px;line-height:1.1;margin-bottom:4px;text-transform:uppercase;}
.rcp-sub{font-size:clamp(.62rem,2vw,.82rem);color:rgba(255,255,255,.75);margin:4px 0 10px;max-width:300px;line-height:1.4;}
.rcp-ibox{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.2);border-radius:10px;
  padding:8px 11px;max-width:300px;margin-bottom:10px;text-align:left;width:100%;}
.rcp-ibox h3{font-size:.72rem;font-weight:900;color:#f1c40f;letter-spacing:1px;margin-bottom:6px;text-transform:uppercase;}
.rcp-ibox li{font-size:.68rem;color:rgba(255,255,255,.85);padding:3px 0;border-bottom:1px solid rgba(255,255,255,.07);
  display:flex;align-items:center;gap:6px;list-style:none;}
.rcp-ibox li:last-child{border-bottom:none;}
.rcp-btn{background:#27ae60;color:#fff;border:2px solid #fff;padding:8px 20px;font-weight:900;
  font-size:clamp(.78rem,2.5vw,1rem);letter-spacing:1px;border-radius:40px;cursor:pointer;
  box-shadow:0 3px 12px rgba(0,0,0,.5);transition:transform .1s;text-transform:uppercase;margin-top:4px;}
.rcp-btn:active{transform:scale(.95);}
.rcp-btn.rcp-red{background:#e74c3c;}
.rcp-cd-num{font-size:clamp(4rem,18vw,8rem);font-weight:900;color:#fff;
  text-shadow:0 0 50px rgba(255,255,255,.5);animation:rcpBlast .9s ease forwards;}
@keyframes rcpBlast{0%{transform:scale(2.2);opacity:0;}60%{transform:scale(.92);opacity:1;}100%{transform:scale(1);opacity:1;}}
.rcp-hud{position:absolute;top:5px;left:50%;transform:translateX(-50%);width:93%;
  display:flex;align-items:center;justify-content:space-between;
  background:rgba(0,0,0,.85);border:1px solid rgba(255,255,255,.15);border-radius:24px;
  padding:4px 12px;z-index:30;color:#fff;}
.rcp-lives{font-size:.82rem;letter-spacing:2px;}
.rcp-score{font-weight:900;font-size:.65rem;letter-spacing:1px;color:#f1c40f;}
.rcp-bpm{font-weight:900;font-size:.7rem;letter-spacing:1px;}
.rcp-rl{position:absolute;top:42px;left:50%;transform:translateX(-50%);
  font-weight:900;font-size:clamp(.8rem,3.2vw,1.2rem);letter-spacing:1px;
  background:rgba(0,0,0,.85);color:#fff;border:2px solid #f1c40f;
  padding:2px 12px;border-radius:8px;z-index:30;pointer-events:none;display:none;white-space:nowrap;}
.rcp-hz{position:absolute;bottom:21%;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:4px;z-index:20;pointer-events:none;}
.rcp-heart{font-size:clamp(2rem,7vw,3.2rem);filter:drop-shadow(0 0 12px rgba(231,76,60,.9));transition:transform .08s;}
.rcp-heart.beat{transform:scale(1.4);filter:drop-shadow(0 0 22px rgba(231,76,60,1));}
.rcp-ecg{width:clamp(120px,46vw,240px);height:38px;border-radius:5px;background:rgba(0,0,0,.7);border:1px solid rgba(46,204,113,.4);}
.rcp-patient{position:absolute;bottom:28%;left:50%;transform:translateX(-50%);z-index:18;pointer-events:none;}
.rcp-svg{width:clamp(50px,14vw,90px);height:auto;transition:transform .08s;transform-origin:center bottom;}
.rcp-svg.rcp-compress{transform:scaleY(.91) translateY(4px);}
.rcp-bar-wrap{position:absolute;bottom:14%;left:50%;transform:translateX(-50%);
  width:clamp(130px,50vw,250px);z-index:30;pointer-events:none;}
.rcp-bar-bg{width:100%;height:11px;background:rgba(255,255,255,.15);border-radius:6px;overflow:hidden;border:1px solid rgba(255,255,255,.2);}
.rcp-bar-fill{height:100%;background:linear-gradient(90deg,#2ecc71,#f1c40f);border-radius:6px;width:0%;transition:width .06s linear;}
.rcp-bar-hint{font-size:.6rem;color:rgba(255,255,255,.6);text-align:center;margin-top:3px;font-weight:600;letter-spacing:.4px;}
.rcp-ball{position:absolute;bottom:2%;left:50%;transform:translateX(-50%);
  width:clamp(56px,14vw,90px);height:clamp(56px,14vw,90px);border-radius:50%;cursor:pointer;z-index:35;
  border:3px solid rgba(255,255,255,.6);
  box-shadow:inset -8px -8px 16px rgba(0,0,0,.45),inset 4px 4px 10px rgba(255,255,255,.15),0 5px 16px rgba(0,0,0,.6);
  background:radial-gradient(circle at 38% 35%,#fff 0%,#ddd 50%,#aaa 100%);
  transition:transform .07s,box-shadow .12s;overflow:hidden;}
.rcp-ball::before{content:'';position:absolute;inset:0;border-radius:50%;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpolygon points='50,28 65,40 60,58 40,58 35,40' fill='%23111' opacity='0.85'/%3E%3Cline x1='50' y1='28' x2='50' y2='8' stroke='%23111' stroke-width='3.5' opacity='0.7'/%3E%3Cline x1='65' y1='40' x2='84' y2='32' stroke='%23111' stroke-width='3.5' opacity='0.7'/%3E%3Cline x1='60' y1='58' x2='72' y2='76' stroke='%23111' stroke-width='3.5' opacity='0.7'/%3E%3Cline x1='40' y1='58' x2='28' y2='76' stroke='%23111' stroke-width='3.5' opacity='0.7'/%3E%3Cline x1='35' y1='40' x2='16' y2='32' stroke='%23111' stroke-width='3.5' opacity='0.7'/%3E%3C/svg%3E");
  background-size:cover;}
.rcp-ball.rcp-glow{border-color:#f1c40f;box-shadow:inset -8px -8px 16px rgba(0,0,0,.45),0 0 20px #f1c40f,0 0 40px rgba(241,196,15,.4);}
.rcp-ball.rcp-pressing{transform:translateX(-50%) scale(.86) translateY(4px)!important;}
.rcp-flash{position:absolute;inset:0;z-index:40;pointer-events:none;opacity:0;transition:opacity .15s;}
.rcp-flash.bad{background:rgba(231,76,60,.4);opacity:1;}
.rcp-flash.good{background:rgba(46,204,113,.2);opacity:1;}
.rcp-qwrap{display:flex;flex-direction:column;align-items:center;gap:7px;width:100%;max-width:320px;}
.rcp-qq{font-weight:900;font-size:clamp(.82rem,3.2vw,1.15rem);color:#fff;letter-spacing:.5px;text-align:center;margin-bottom:3px;}
.rcp-qopt{width:100%;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.25);color:#fff;
  padding:7px 11px;border-radius:9px;font-weight:600;font-size:.8rem;cursor:pointer;text-align:left;transition:background .15s,border-color .15s;}
.rcp-qopt.rcp-correct{background:rgba(46,204,113,.4);border-color:#2ecc71;}
.rcp-qopt.rcp-wrong{background:rgba(231,76,60,.4);border-color:#e74c3c;}
.rcp-qfb{font-size:.74rem;font-weight:600;color:#fff;background:rgba(0,0,0,.5);padding:5px 10px;border-radius:8px;display:none;text-align:center;}
.rcp-step{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:6px 10px;width:100%;max-width:280px;font-size:.7rem;color:rgba(255,255,255,.9);}
.rcp-snum{font-weight:900;font-size:1rem;color:#f1c40f;min-width:18px;}
.rcp-badges{display:flex;gap:7px;justify-content:center;margin:7px 0;flex-wrap:wrap;}
.rcp-badge{background:rgba(241,196,15,.2);border:2px solid #f1c40f;border-radius:7px;padding:4px 9px;font-weight:900;font-size:.75rem;color:#f1c40f;letter-spacing:1px;}
.rcp-frag{position:absolute;pointer-events:none;border-radius:50%;animation:rcpFrag .8s ease-out forwards;}
@keyframes rcpFrag{0%{transform:translate(0,0) scale(1);opacity:1;}100%{transform:translate(var(--dx),var(--dy)) scale(.2);opacity:0;}}
</style>
<div class="rcp-root" id="rcp-root">
  <div class="rcp-screen" id="rcp-start">
    <div style="font-size:2rem;margin-bottom:3px">⚽</div>
    <div class="rcp-title">RCP: Salva a tu<br>Compañera</div>
    <p class="rcp-sub">Tu compañera se desmayó en el campo. Mantén su corazón latiendo.</p>
    <div class="rcp-ibox"><h3>📋 Cómo Jugar</h3><ul>
      <li>⚽ Golpea el balón cuando parpadee en <b>dorado</b></li>
      <li>💓 Ritmo: <b>100–120/min</b></li>
      <li>❤️ 3 vidas — no te desritmices</li>
      <li>🏆 30 compresiones → quiz</li>
    </ul></div>
    <button class="rcp-btn" id="rcp-btn-start">INICIAR</button>
  </div>
  <div class="rcp-screen rcp-hidden" id="rcp-countdown">
    <div style="font-size:.8rem;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,.6);margin-bottom:6px;">PREPARÁNDOTE EN...</div>
    <div class="rcp-cd-num" id="rcp-cd-num">3</div>
    <div style="font-size:.72rem;color:rgba(255,255,255,.5);margin-top:8px;" id="rcp-cd-hint">Coloca tus manos sobre el esternón</div>
  </div>
  <div class="rcp-screen rcp-hidden" id="rcp-gameover">
    <div style="font-size:2rem;margin-bottom:3px">🟥</div>
    <div class="rcp-title" style="color:#e74c3c">TARJETA ROJA</div>
    <p class="rcp-sub">¡Perdiste el ritmo! Inténtalo de nuevo.</p>
    <div class="rcp-ibox"><h3>💡 Recuerda</h3><ul>
      <li>🎵 Ritmo: como "Stayin' Alive"</li>
      <li>👊 Presiona cuando el balón brille en dorado</li>
    </ul></div>
    <button class="rcp-btn rcp-red" id="rcp-btn-retry">REINTENTAR</button>
  </div>
  <div class="rcp-screen rcp-hidden" id="rcp-lvl2intro">
    <div style="font-size:2rem;margin-bottom:3px">🥇</div>
    <div class="rcp-title" style="color:#f1c40f">¡30 Compresiones!</div>
    <p class="rcp-sub">Aprende la <b>Posición Lateral de Seguridad</b> mientras llega la ambulancia.</p>
    <div style="display:flex;flex-direction:column;align-items:center;gap:5px;margin-bottom:10px;width:100%;">
      <div class="rcp-step"><div class="rcp-snum">1</div><div>Arrodíllate al lado de la persona</div></div>
      <div class="rcp-step"><div class="rcp-snum">2</div><div>Dobla el brazo más cercano en ángulo recto</div></div>
      <div class="rcp-step"><div class="rcp-snum">3</div><div>Lleva el otro brazo cruzado sobre el pecho</div></div>
      <div class="rcp-step"><div class="rcp-snum">4</div><div>Dobla la rodilla lejana y gira suavemente</div></div>
      <div class="rcp-step"><div class="rcp-snum">5</div><div>Ajusta la cabeza para la vía aérea</div></div>
    </div>
    <button class="rcp-btn" id="rcp-btn-quiz">SIGUIENTE: QUIZ ▶</button>
  </div>
  <div class="rcp-screen rcp-hidden" id="rcp-quiz">
    <div style="font-size:1.3rem;margin-bottom:3px">🧠</div>
    <div class="rcp-title" style="font-size:clamp(.9rem,4vw,1.5rem)">Primeros Auxilios</div>
    <div class="rcp-qwrap" id="rcp-qwrap"></div>
    <div class="rcp-qfb" id="rcp-qfb"></div>
    <button class="rcp-btn" id="rcp-btn-next" style="display:none;margin-top:8px">SIGUIENTE ▶</button>
  </div>
  <div class="rcp-screen rcp-hidden" id="rcp-win">
    <div style="font-size:2.4rem;margin-bottom:3px">🏆</div>
    <div class="rcp-title" style="color:#f1c40f">¡Héroe del Campo!</div>
    <p class="rcp-sub" id="rcp-win-sub">Completaste el entrenamiento de RCP.</p>
    <div class="rcp-badges"><div class="rcp-badge">⚽ RCP NIVEL 1</div><div class="rcp-badge">🧠 QUIZ</div></div>
    <div class="rcp-ibox"><h3>📞 Emergencia Real</h3><ul>
      <li>📱 Llama al <b>911</b> inmediatamente</li>
      <li>👊 30 compresiones, 2 ventilaciones</li>
      <li>⚡ Busca un <b>DEA</b> si está disponible</li>
    </ul></div>
    <button class="rcp-btn" id="rcp-btn-replay">JUGAR DE NUEVO</button>
  </div>
  <div class="rcp-hud rcp-hidden" id="rcp-hud">
    <div class="rcp-lives" id="rcp-lives">❤️❤️❤️</div>
    <div class="rcp-score">COMP: <span id="rcp-comp">0</span>/30</div>
    <div class="rcp-bpm" id="rcp-bpm">BPM: --</div>
  </div>
  <div class="rcp-rl" id="rcp-rl">⚽ ¡PRESIONA!</div>
  <div class="rcp-hz rcp-hidden" id="rcp-hz">
    <div class="rcp-heart" id="rcp-heart">🫀</div>
    <canvas class="rcp-ecg" id="rcp-ecg"></canvas>
  </div>
  <div class="rcp-patient rcp-hidden" id="rcp-patient">
    <svg class="rcp-svg" id="rcp-svg" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-80,60,100)">
        <rect x="35" y="130" width="18" height="55" rx="9" fill="#e74c3c"/>
        <rect x="67" y="130" width="18" height="55" rx="9" fill="#e74c3c"/>
        <rect x="35" y="160" width="18" height="25" rx="8" fill="#ecf0f1"/>
        <rect x="67" y="160" width="18" height="25" rx="8" fill="#ecf0f1"/>
        <ellipse cx="44" cy="186" rx="13" ry="7" fill="#2c3e50"/>
        <ellipse cx="76" cy="186" rx="13" ry="7" fill="#2c3e50"/>
        <rect x="28" y="75" width="64" height="60" rx="14" fill="#c0392b"/>
        <text x="60" y="113" text-anchor="middle" font-family="sans-serif" font-size="22" fill="rgba(255,255,255,0.7)">9</text>
        <rect x="8" y="82" width="20" height="42" rx="10" fill="#fca97a"/>
        <rect x="92" y="82" width="20" height="42" rx="10" fill="#fca97a"/>
        <rect x="50" y="60" width="20" height="20" rx="8" fill="#fca97a"/>
        <ellipse cx="60" cy="46" rx="26" ry="28" fill="#fca97a"/>
        <ellipse cx="60" cy="22" rx="26" ry="14" fill="#4a2a10"/>
        <rect x="34" y="20" width="52" height="18" rx="5" fill="#4a2a10"/>
      </g>
    </svg>
  </div>
  <div class="rcp-bar-wrap rcp-hidden" id="rcp-bar">
    <div class="rcp-bar-bg"><div class="rcp-bar-fill" id="rcp-fill"></div></div>
    <div class="rcp-bar-hint">Presiona en el momento preciso</div>
  </div>
  <div class="rcp-ball rcp-hidden" id="rcp-ball"></div>
  <div class="rcp-flash" id="rcp-flash"></div>
</div>`;

    // ── LÓGICA RCP ─────────────────────────────────────────────────
    (function() {
        const $ = id => wrapper.querySelector('#' + id);
        const CYCLE_MS=545, WINDOW_MS=220;
        let lives,compressions,gameActive,windowOpen,windowTimer;
        let rhythmIv,lastPress=0,bpmVals=[],ecgCtx,ecgW,ecgH,ecgX=0;
        let quizIdx=0,quizScore=0;

        const quizData=[
            {q:'¿Cuántas compresiones por minuto en RCP adulto?',opts:['60–80/min','100–120/min','150–180/min','40–60/min'],c:1,ex:'El ritmo recomendado es 100–120/min, como "Stayin\'Alive" de los Bee Gees.'},
            {q:'¿Dónde se colocan las manos para RCP?',opts:['Sobre el estómago','Centro del pecho (esternón)','Costillas laterales','Corazón izquierdo'],c:1,ex:'En el centro del pecho, mitad inferior del esternón, brazos extendidos.'},
            {q:'¿Cuánto debe hundirse el pecho en cada compresión?',opts:['1–2 cm','5–6 cm','8–10 cm','No debe hundirse'],c:1,ex:'Entre 5 y 6 cm. Poco = no bombea sangre; demasiado = lesiones.'},
            {q:'¿Qué significa OVACE?',opts:['Obstrucción de Vía Aérea por Cuerpo Extraño','Oxigenación Vital Artificial','Operación Vascular Aórtica','Obstrucción Venosa Arterial'],c:0,ex:'OVACE = atragantamiento. Se trata con la Maniobra de Heimlich.'},
            {q:'¿Cuándo NO debes mover a una persona lesionada?',opts:['Cuando está consciente','Sospechas lesión en columna','Siempre que sea posible','Solo si está mojada'],c:1,ex:'Sospecha de lesión en columna → no muevas; puede causar parálisis.'},
        ];

        function showOnly(id){
            ['rcp-start','rcp-countdown','rcp-gameover','rcp-lvl2intro','rcp-quiz','rcp-win']
                .forEach(s=>{const el=$(s);if(el)el.classList.add('rcp-hidden');});
            if(id){const el=$(id);if(el)el.classList.remove('rcp-hidden');}
        }
        function hudShow(v){
            [['rcp-hud','flex'],['rcp-rl','block'],['rcp-hz','flex'],['rcp-patient','block'],['rcp-ball','block'],['rcp-bar','block']]
                .forEach(([id,d])=>{const el=$(id);if(!el)return;if(v){el.classList.remove('rcp-hidden');el.style.display=d;}else{el.classList.add('rcp-hidden');el.style.display='none';}});
        }
        function startCountdown(){
            showOnly('rcp-countdown');
            const hints=['Coloca tus manos sobre el esternón','Entrelaza dedos, codos extendidos','¡Empieza a comprimir con fuerza!'];
            let n=3;
            const numEl=$('rcp-cd-num'),hintEl=$('rcp-cd-hint');
            function tick(){
                if(numEl){numEl.textContent=n>0?n:'¡YA!';numEl.style.animation='none';void numEl.offsetWidth;numEl.style.animation='rcpBlast .9s ease forwards';}
                if(hintEl)hintEl.textContent=hints[3-Math.max(n,1)]||'';
                n--;
                if(n>=-1)setTimeout(tick,1000);else{showOnly(null);startLevel1();}
            }
            tick();
        }
        function startLevel1(){
            lives=3;compressions=0;gameActive=true;ecgX=0;windowOpen=false;lastPress=0;bpmVals=[];
            updateLives();updateComp();hudShow(true);
            const fill=$('rcp-fill');if(fill)fill.style.width='0%';
            const rl=$('rcp-rl');if(rl)rl.textContent='⚽ ¡PRESIONA!';
            const bpm=$('rcp-bpm');if(bpm)bpm.textContent='BPM: --';
            const sv=$('rcp-svg');if(sv)sv.style.opacity='1';
            initECG();scheduleNext();drawBaseline();
        }
        function scheduleNext(){
            if(!gameActive)return;
            const delay=CYCLE_MS-WINDOW_MS;let elapsed=0;
            clearInterval(rhythmIv);
            const fill=$('rcp-fill');
            rhythmIv=setInterval(()=>{
                if(!gameActive){clearInterval(rhythmIv);return;}
                elapsed+=20;
                if(fill)fill.style.width=Math.min(elapsed/delay*100,100)+'%';
                if(elapsed>=delay){clearInterval(rhythmIv);openWindow();}
            },20);
        }
        function openWindow(){
            if(!gameActive)return;
            windowOpen=true;
            const ball=$('rcp-ball');if(ball)ball.classList.add('rcp-glow');
            const rl=$('rcp-rl');if(rl)rl.textContent='⚽ ¡AHORA!';
            const fill=$('rcp-fill');if(fill){fill.style.width='100%';fill.style.background='linear-gradient(90deg,#f1c40f,#e67e22)';}
            windowTimer=setTimeout(()=>{if(windowOpen){windowOpen=false;const b=$('rcp-ball');if(b)b.classList.remove('rcp-glow');resetFill();missedPress();}},WINDOW_MS);
        }
        function resetFill(){const fill=$('rcp-fill');if(fill)fill.style.background='linear-gradient(90deg,#2ecc71,#f1c40f)';}
        function doPressball(){
            if(!gameActive)return;
            const ball=$('rcp-ball');if(!ball)return;
            ball.classList.add('rcp-pressing');setTimeout(()=>ball.classList.remove('rcp-pressing'),90);
            if(windowOpen){
                clearTimeout(windowTimer);windowOpen=false;ball.classList.remove('rcp-glow');
                const fill=$('rcp-fill');if(fill)fill.style.width='0%';resetFill();
                compressions++;updateComp();goodPress();
                if(compressions>=30){setTimeout(()=>levelComplete(),400);return;}
                scheduleNext();
            }else{missedPress();}
        }
        function goodPress(){
            playBubble(); // sonido burbuja en compresión correcta
            const h=$('rcp-heart');if(h){h.classList.add('beat');setTimeout(()=>h.classList.remove('beat'),120);}
            const sv=$('rcp-svg');if(sv){sv.classList.add('rcp-compress');setTimeout(()=>sv.classList.remove('rcp-compress'),90);}
            drawSpike(true);doFlash('good');
            const now=Date.now();
            if(lastPress){const bpm=Math.round(60000/(now-lastPress));bpmVals.push(bpm);if(bpmVals.length>4)bpmVals.shift();const avg=Math.round(bpmVals.reduce((a,b)=>a+b,0)/bpmVals.length);const bpmEl=$('rcp-bpm');if(bpmEl)bpmEl.textContent='BPM: '+avg;}
            lastPress=now;
        }
        function missedPress(){drawSpike(false);doFlash('bad');loseLife();}
        function loseLife(){
            lives--;updateLives();
            if(lives<=0){gameActive=false;clearInterval(rhythmIv);clearTimeout(windowTimer);explodePatient();setTimeout(()=>{hudShow(false);showOnly('rcp-gameover');},1000);}
            else{if(!windowOpen){const fill=$('rcp-fill');if(fill)fill.style.width='0%';scheduleNext();}}
        }
        function updateLives(){const el=$('rcp-lives');if(!el)return;let h='';for(let i=0;i<3;i++)h+=i<lives?'❤️':'🖤';el.textContent=h;}
        function updateComp(){const el=$('rcp-comp');if(el)el.textContent=compressions;}
        function levelComplete(){gameActive=false;clearInterval(rhythmIv);clearTimeout(windowTimer);hudShow(false);showOnly('rcp-lvl2intro');}
        function doFlash(type){const f=$('rcp-flash');if(!f)return;f.className='rcp-flash '+type;setTimeout(()=>{f.className='rcp-flash';},type==='bad'?180:160);}
        function explodePatient(){
            const sv=$('rcp-svg');if(sv)sv.style.opacity='0';
            const root=$('rcp-root');
            for(let i=0;i<12;i++){  // menos fragmentos en móvil
                const fr=document.createElement('div');fr.className='rcp-frag';
                const size=7+Math.random()*13,ang=Math.random()*360,dist=40+Math.random()*100;
                fr.style.cssText=`width:${size}px;height:${size}px;background:hsl(${350+Math.random()*20},80%,${40+Math.random()*20}%);left:50%;top:40%;--dx:${Math.cos(ang*Math.PI/180)*dist}px;--dy:${Math.sin(ang*Math.PI/180)*dist-Math.random()*60}px;animation-duration:${.6+Math.random()*.4}s;`;
                if(root)root.appendChild(fr);setTimeout(()=>fr.remove(),1100);
            }
        }
        function initECG(){const c=$('rcp-ecg');if(!c)return;ecgW=c.offsetWidth||220;ecgH=c.offsetHeight||38;c.width=ecgW;c.height=ecgH;ecgCtx=c.getContext('2d');ecgX=0;}
        function drawBaseline(){
            if(!ecgCtx||!gameActive)return;
            const mid=ecgH/2,step=4;let x=ecgX;
            ecgCtx.strokeStyle='rgba(46,204,113,.5)';ecgCtx.lineWidth=1.5;
            const draw=()=>{if(!gameActive)return;ecgCtx.clearRect(x,0,step+1,ecgH);ecgCtx.beginPath();ecgCtx.moveTo(x,mid);ecgCtx.lineTo(x+step,mid);ecgCtx.stroke();x+=step;if(x>ecgW){ecgCtx.clearRect(0,0,ecgW,ecgH);x=0;}ecgX=x;requestAnimationFrame(draw);};
            draw();
        }
        function drawSpike(good){
            if(!ecgCtx)return;
            const mid=ecgH/2,x=ecgX,c=good?'#2ecc71':'#e74c3c';
            ecgCtx.strokeStyle=c;ecgCtx.lineWidth=2;ecgCtx.shadowColor=c;ecgCtx.shadowBlur=6;
            ecgCtx.beginPath();ecgCtx.moveTo(x,mid);ecgCtx.lineTo(x+3,mid+3);ecgCtx.lineTo(x+6,mid-16);ecgCtx.lineTo(x+9,mid+10);ecgCtx.lineTo(x+12,mid-5);ecgCtx.lineTo(x+15,mid);ecgCtx.stroke();ecgCtx.shadowBlur=0;
        }
        function renderQ(){
            const d=quizData[quizIdx];
            const fb=$('rcp-qfb');if(fb)fb.style.display='none';
            const nb=$('rcp-btn-next');if(nb)nb.style.display='none';
            const w=$('rcp-qwrap');if(!w)return;
            w.innerHTML=`<div class="rcp-qq">${quizIdx+1}/${quizData.length}: ${d.q}</div>`+d.opts.map((o,i)=>`<button class="rcp-qopt" data-i="${i}">${o}</button>`).join('');
            w.querySelectorAll('.rcp-qopt').forEach(b=>{
                b.addEventListener('click',function(){
                    const idx=parseInt(this.dataset.i);
                    w.querySelectorAll('.rcp-qopt').forEach((x,j)=>{x.onclick=null;if(j===d.c)x.classList.add('rcp-correct');else if(j===idx)x.classList.add('rcp-wrong');});
                    const fb2=$('rcp-qfb');if(fb2){fb2.style.display='block';fb2.style.color=idx===d.c?'#2ecc71':'#e74c3c';fb2.textContent=(idx===d.c?'✅ ':'❌ ')+d.ex;if(idx===d.c)quizScore++;}
                    const nb2=$('rcp-btn-next');if(nb2){nb2.style.display='block';nb2.textContent=quizIdx<quizData.length-1?'SIGUIENTE ▶':'VER RESULTADO ▶';}
                });
            });
        }
        function nextQ(){quizIdx++;if(quizIdx<quizData.length){renderQ();}else{showOnly('rcp-win');const sub=$('rcp-win-sub');if(sub)sub.textContent=`Respondiste ${quizScore}/${quizData.length} correctamente. ¡Ahora sabes actuar en emergencias!`;}}
        function restartFull(){lives=3;compressions=0;bpmVals=[];lastPress=0;quizIdx=0;quizScore=0;const b=$('rcp-bpm');if(b)b.textContent='BPM: --';showOnly('rcp-start');}

        const bs=$('rcp-btn-start');   if(bs)  bs.addEventListener('click',startCountdown);
        const br=$('rcp-btn-retry');   if(br)  br.addEventListener('click',()=>{const sv=$('rcp-svg');if(sv)sv.style.opacity='1';startCountdown();});
        const bq=$('rcp-btn-quiz');    if(bq)  bq.addEventListener('click',()=>{quizIdx=0;quizScore=0;showOnly('rcp-quiz');renderQ();});
        const bn=$('rcp-btn-next');    if(bn)  bn.addEventListener('click',nextQ);
        const brp=$('rcp-btn-replay'); if(brp) brp.addEventListener('click',restartFull);

        const ball=$('rcp-ball');
        if(ball){
            ball.addEventListener('mousedown',e=>{e.preventDefault();doPressball();});
            ball.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();doPressball();},{passive:false});
        }
        showOnly('rcp-start');
    })();

    return {
        cleanup: () => {
            cancelAnimationFrame(vafRaf);
            viruses.forEach(v=>v.el.remove()); viruses.length=0;
            window.removeEventListener('resize', recalcEkg);
            if(drAudioCtx){try{drAudioCtx.close();}catch(e){} drAudioCtx=null;}
            const elD=document.getElementById('glow-doctora');
            const elN=document.getElementById('glow-nina');
            if(elD){elD.style.zIndex='';elD.style.position='';elD.style.filter='';elD.style.animation='';}
            if(elN){elN.style.zIndex='';elN.style.position='';elN.style.filter='';elN.style.animation='';}
            cont.remove();
        }
    };
}

// ─── 4. ARQUITECTA — cuadrícula con paleta de colores + deshacer ─
function efectoArquitecta(vfx) {
    // ── JUEGO: Engineering Soccer Command (Ingeniería) ──────────────
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:absolute;inset:0;overflow:hidden;font-family:Segoe UI,Roboto,sans-serif;color:#fff;';
    vfx.appendChild(wrapper);

    const triviaPool = [
        { q: "¿Qué desigualdad viven muchas mujeres ingenieras?", a: ["Menor salario","Machismo","Poco respeto","Menos oportunidades","Comentarios sexistas"] },
        { q: "¿Qué deben demostrar constantemente muchas ingenieras?", a: ["Capacidad","Inteligencia","Liderazgo","Experiencia","Fuerza"] },
        { q: "¿Qué deberían recibir igual hombres y mujeres?", a: ["Sueldo","Oportunidades","Respeto","Puestos","Reconocimiento"] },
        { q: "¿Qué actitud ayuda a romper el machismo en ingeniería?", a: ["Seguridad","Valentia","Preparacion","Union","Confianza"] },
        { q: "¿Qué necesitan más las niñas para entrar a ingeniería?", a: ["Inspiracion","Apoyo","Confianza","Educacion","Ejemplos femeninos"] },
        { q: "¿Qué cualidad hace poderosa a una ingeniera?", a: ["Inteligencia","Liderazgo","Creatividad","Disciplina","Valentia"] },
        { q: "¿Qué invento cambió el mundo gracias a la ingeniería?", a: ["Internet","Celular","Avion","Electricidad","Computadora"] },
        { q: "¿Qué herramienta relacionas con ingeniería?", a: ["Llave inglesa","Taladro","Computadora","Multimetro","Regla"] },
        { q: "¿Qué superpoder tendría una ingeniera?", a: ["Resolver problemas","Construir rapido","Inventar cosas","Arreglar todo","Innovar"] },
        { q: "¿Qué aportan las ingenieras a México?", a: ["Innovacion","Tecnologia","Desarrollo","Soluciones","Liderazgo"] },
    ];
    const factPool = [
        "Ada Lovelace fue la primera programadora de la historia en 1843.",
        "Gwynne Shotwell es la ingeniera que lidera SpaceX hoy en día.",
        "Hedy Lamarr inventó la base del WiFi y Bluetooth actuales.",
        "Katie Bouman creó el algoritmo de la primera foto de un agujero negro.",
        "Margaret Hamilton escribió el código del Apolo 11 para la NASA.",
        "En México, solo el 30% de los estudiantes de ingeniería son mujeres.",
        "Citlali García fue la primera mexicana en trabajar en el telescopio James Webb.",
        "Las ingenieras mexicanas en la industria aeroespacial han crecido un 40% en la última década.",
    ];

    function shuffle(arr) { return arr.map((_,i)=>i).sort(()=>Math.random()-.5); }
    let tOrd=shuffle(triviaPool), tPos=0, fOrd=shuffle(factPool), fPos=0;
    function nextTrivia() { if(tPos>=tOrd.length){tOrd=shuffle(triviaPool);tPos=0;} return triviaPool[tOrd[tPos++]]; }
    function nextFact()   { if(fPos>=fOrd.length){fOrd=shuffle(factPool);fPos=0;}  return factPool[fOrd[fPos++]]; }

    let lvl=0, oil=100, activeQ={}, canShoot=false;

    function getHint(w) { return w.split(' ').map(s=>s.length<=1?s:s[0]+'.'.repeat(Math.max(s.length-2,0))+s.slice(-1)).join(' '); }
    function norm(t)    { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,''); }

    // ── HTML del juego (column layout, todo en una columna para celular) ──
    wrapper.innerHTML = `<div class="ing-root">
        <div class="ing-fact"><b>SABÍAS QUE…</b> <span id="ig-fact">La ingeniería transforma el mundo.</span></div>
        <div class="ing-q" id="ig-q">ESCRIBE UNA RESPUESTA</div>
        <div class="ing-field" id="ig-field">
            <div class="ing-diploma" id="ig-diploma">
                <div style="font-size:2.5rem">🎓🏆</div>
                <h2>DIPLOMA DE EXCELENCIA</h2>
                <p style="font-size:.8rem;border-bottom:1px solid #ccc;width:80%;padding-bottom:6px;">Ingeniera Destacada</p>
                <p><b style="color:#d4af37">¡FELICIDADES, TE GRADUASTE DE INGENIERA!</b></p>
                <p>Por demostrar maestría en soluciones técnicas.</p>
                <button id="ig-restart" style="margin-top:10px;cursor:pointer;padding:8px 16px;border-radius:4px;border:none;background:#1b5e20;color:#fff;font-weight:bold;">REINICIAR</button>
            </div>
            <div class="ing-goal"></div>
            <div id="ig-barriers"></div>
            <div class="ing-ball" id="ig-ball" title="Toca el balón">⚽</div>
            <div class="ing-alert" id="ig-alert"><div style="font-size:2rem">🖐️🔴</div><div style="background:#ff4b2b;padding:2px 8px;font-size:.65rem;font-weight:bold;">ERROR</div></div>
        </div>
        <div class="ing-board" id="ig-board">
            <div class="ing-slot" id="ig-s0">?.....?</div>
            <div class="ing-slot" id="ig-s1">?.....?</div>
            <div class="ing-slot" id="ig-s2">?.....?</div>
            <div class="ing-slot" id="ig-s3">?.....?</div>
            <div class="ing-slot ing-slot-5" id="ig-s4">?........?</div>
        </div>
        <div class="ing-input">
            <input type="text" id="ig-inp" placeholder="Tu respuesta..." autocomplete="off" autocorrect="off" autocapitalize="off">
            <button id="ig-send">OK</button>
        </div>
        <div class="ing-hud">
            <span>ACEITE: <b id="ig-oilval">100%</b></span>
            <div class="ing-oilbar"><div class="ing-oilinner" id="ig-oilbar"></div></div>
            <span>NIVEL <b id="ig-lvl">1/5</b></span>
        </div>
    </div>`;

    // Barreras
    const barBox = wrapper.querySelector('#ig-barriers');
    for(let i=0;i<5;i++){
        const b=document.createElement('div'); b.className='ing-barrier'; b.id=`ig-b${i}`;
        b.style.left=`${18+(i*15)}%`; barBox.appendChild(b);
    }

    function loadQ() {
        if(lvl>=5) return showDiploma();
        activeQ=nextTrivia();
        wrapper.querySelector('#ig-q').textContent=activeQ.q;
        wrapper.querySelector('#ig-q').style.borderColor='#00f2ff';
        wrapper.querySelector('#ig-lvl').textContent=`${lvl+1}/5`;
        for(let i=0;i<5;i++){
            const s=wrapper.querySelector(`#ig-s${i}`);
            s.classList.remove('rev'); s.textContent=getHint(activeQ.a[i]);
        }
    }
    function loadFact() { wrapper.querySelector('#ig-fact').textContent=nextFact(); }

    function success(idx) {
        const s=wrapper.querySelector(`#ig-s${idx}`);
        s.textContent=activeQ.a[idx]; s.classList.add('rev');
        setTimeout(()=>{
            canShoot=true;
            wrapper.querySelector('#ig-ball').classList.add('glow');
            wrapper.querySelector('#ig-q').textContent='¡LISTO! Toca el balón ⚽';
        },400);
    }
    function failure() {
        oil=Math.max(0,oil-20);
        wrapper.querySelector('#ig-oilbar').style.width=oil+'%';
        wrapper.querySelector('#ig-oilval').textContent=oil+'%';
        wrapper.querySelector('#ig-q').style.borderColor='#ff4b2b';
        const al=wrapper.querySelector('#ig-alert'); al.classList.add('on');
        loadFact();
        setTimeout(()=>{
            al.classList.remove('on');
            if(lvl>0){ lvl--; wrapper.querySelector(`#ig-b${lvl}`)?.classList.remove('broken'); }
            const ball=wrapper.querySelector('#ig-ball');
            const field=wrapper.querySelector('#ig-field');
            const fw=field.offsetWidth;
            ball.style.left=Math.max(20,16+(lvl*13))+'%';
            if(oil<=0){ wrapper.remove(); return; }
            loadQ();
        },1100);
    }
    function kick() {
        if(!canShoot) return;
        canShoot=false;
        const ball=wrapper.querySelector('#ig-ball');
        ball.classList.remove('glow');
        ball.style.left=`${18+(lvl*15)}%`;
        setTimeout(()=>{
            wrapper.querySelector(`#ig-b${lvl}`)?.classList.add('broken');
            lvl++; loadFact();
            setTimeout(()=>{ ball.style.left=`${16+(lvl*13)}%`; loadQ(); },700);
        },450);
    }
    function showDiploma() {
        wrapper.querySelector('#ig-diploma').style.display='flex';
        wrapper.querySelector('#ig-ball').style.display='none';
    }

    function submitAnswer() {
        if(canShoot) return;
        const inp=wrapper.querySelector('#ig-inp');
        const val=norm(inp.value); inp.value='';
        if(!val) return;
        const idx=activeQ.a.findIndex(a=>norm(a)===val);
        if(idx!==-1) success(idx); else failure();
    }

    wrapper.querySelector('#ig-ball').addEventListener('click', kick);
    wrapper.querySelector('#ig-ball').addEventListener('touchstart', e=>{ e.stopPropagation(); kick(); }, {passive:true});
    wrapper.querySelector('#ig-send').addEventListener('click', submitAnswer);
    wrapper.querySelector('#ig-inp').addEventListener('keydown', e=>{ if(e.key==='Enter') submitAnswer(); });
    wrapper.querySelector('#ig-restart')?.addEventListener('click', ()=>{ wrapper.remove(); efectoArquitecta(vfx); });

    loadQ(); loadFact();
    return { cleanup: ()=>wrapper.remove() };
}

// ─── 5. BOMBERA — Juego Sismo en el Azteca ──────────────────────
function efectoBombera(vfx) {
    // ── KEYFRAMES (una sola vez) ──────────────────────────────────
    if (!document.getElementById('bom-kf')) {
        const st = document.createElement('style'); st.id = 'bom-kf';
        st.textContent = `
        @keyframes bomShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        @keyframes bomPulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes bomFadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bomFloat{0%,100%{transform:translateX(-50%) translateY(0)}100%{transform:translateX(-50%) translateY(-6px)}}
        `;
        document.head.appendChild(st);
    }

    // ── LIMPIAR Y MONTAR CONTENEDOR ───────────────────────────────
    vfx.innerHTML = '';
    vfx.style.pointerEvents = 'auto';
    vfx.style.overflow = 'hidden';   // ← TODO queda dentro del mural

    // ── FONDO: estadio.png ocupa exactamente el vfx ──────────────
    const bgImg = document.createElement('div');
    bgImg.style.cssText = `
        position:absolute;inset:0;z-index:0;
        background-image:url('assets/estadio.png');
        background-size:cover;background-position:center;
        filter:brightness(0.45) blur(2px);
        pointer-events:none;
    `;
    vfx.appendChild(bgImg);

    // Overlay oscuro
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;z-index:1;background:rgba(0,8,0,0.42);pointer-events:none;';
    vfx.appendChild(overlay);

    // ══════════════════════════════════════════════════════════════
    // CAPAS Z-INDEX (de atrás → adelante), TODAS dentro del vfx:
    //  2   llamas traseras  (lentas, tenues)
    //  4   llamas delanteras (rápidas, brillantes)
    //  6   recuadro del juego  (bom-wrap)
    //  glow-bombera y glow-nina gestionados externamente
    // ══════════════════════════════════════════════════════════════

    // ── GLOW BLANCO: nina y bombera al frente ─────────────────────
    const glowNina    = document.getElementById('glow-nina');
    const glowBombera = document.getElementById('glow-bombera');
    if (glowNina) {
        glowNina.style.zIndex  = '9988';
        glowNina.style.position= 'relative';
        glowNina.style.filter  = 'brightness(1.8) drop-shadow(0 0 18px #fff) drop-shadow(0 0 36px rgba(255,255,255,0.6))';
    }
    if (glowBombera) {
        glowBombera.style.zIndex  = '9986';
        glowBombera.style.position= 'relative';
        glowBombera.style.filter  = 'brightness(1.8) drop-shadow(0 0 18px #fff) drop-shadow(0 0 36px rgba(255,255,255,0.6))';
    }

    // ── LLUVIA DE FUEGO — capas absolutas dentro del vfx ─────────
    const smokeColors = ['#ff4500','#ffaa00','#9d00ff','#ff6600','#ffcc00'];
    let bomAudioCtx = null;
    let fireInterval  = null;
    let fireInterval2 = null;

    if (!document.getElementById('bom-fire-kf')) {
        const fkf = document.createElement('style'); fkf.id = 'bom-fire-kf';
        fkf.textContent = `
        @keyframes bomFlicker{
            0%  {opacity:.3;filter:drop-shadow(0 0 2px #ff4500);}
            15% {opacity:1; filter:drop-shadow(0 0 14px #ffaa00) drop-shadow(0 0 6px #fff);}
            30% {opacity:.5;filter:drop-shadow(0 0 4px #ff6600);}
            50% {opacity:1; filter:drop-shadow(0 0 20px #ffcc00) drop-shadow(0 0 8px #fff);}
            70% {opacity:.4;filter:drop-shadow(0 0 3px #ff4500);}
            85% {opacity:.9;filter:drop-shadow(0 0 12px #ffaa00);}
            100%{opacity:.3;filter:drop-shadow(0 0 2px #ff4500);}
        }
        @keyframes bomFlickerFast{
            0%  {opacity:.6;filter:drop-shadow(0 0 8px #ffcc00) drop-shadow(0 0 4px #fff);}
            25% {opacity:1; filter:drop-shadow(0 0 28px #fff)    drop-shadow(0 0 14px #ffaa00);}
            50% {opacity:.7;filter:drop-shadow(0 0 10px #ff6600);}
            75% {opacity:1; filter:drop-shadow(0 0 24px #ffcc00) drop-shadow(0 0 10px #fff);}
            100%{opacity:.6;filter:drop-shadow(0 0 8px #ffcc00)  drop-shadow(0 0 4px #fff);}
        }
        `;
        document.head.appendChild(fkf);
    }

    // Capa trasera — llamas lentas, dentro del vfx
    const fireLayerBack = document.createElement('div');
    fireLayerBack.id = 'bom-fire-back';
    fireLayerBack.style.cssText = 'position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden;';
    vfx.appendChild(fireLayerBack);

    // Capa delantera — llamas rápidas, dentro del vfx, detrás del wrap
    const fireLayerFront = document.createElement('div');
    fireLayerFront.id = 'bom-fire-front';
    fireLayerFront.style.cssText = 'position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden;';
    vfx.appendChild(fireLayerFront);

    function bomPlayFire() {
        try {
            if (!bomAudioCtx) bomAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (bomAudioCtx.state === 'suspended') bomAudioCtx.resume();
            const now = bomAudioCtx.currentTime;
            for (let i = 0; i < 15; i++) {
                const delay = Math.random() * 0.1;
                const dur   = 0.03 + Math.random() * 0.02;
                const buf   = bomAudioCtx.createBuffer(1, Math.ceil(bomAudioCtx.sampleRate * dur), bomAudioCtx.sampleRate);
                const d     = buf.getChannelData(0);
                for (let j = 0; j < d.length; j++) d[j] = Math.random() * 2 - 1;
                const src = bomAudioCtx.createBufferSource(); src.buffer = buf;
                const flt = bomAudioCtx.createBiquadFilter(); flt.type = 'highpass'; flt.frequency.value = 4500 + Math.random() * 1500;
                const gn  = bomAudioCtx.createGain();
                gn.gain.setValueAtTime(0.1, now + delay);
                gn.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
                src.connect(flt).connect(gn).connect(bomAudioCtx.destination);
                src.start(now + delay);
            }
        } catch(e) {}
    }

    // Humo: absoluto dentro del vfx para no salir del mural
    function bomCreateSmoke(x, y) {
        for (let i = 0; i < 10; i++) {
            const p   = document.createElement('div');
            const col = smokeColors[Math.floor(Math.random() * smokeColors.length)];
            p.style.cssText = `position:absolute;width:14px;height:14px;border-radius:50%;
                pointer-events:none;z-index:5;opacity:.9;
                left:${x-7}px;top:${y-7}px;background:${col};
                filter:blur(4px) drop-shadow(0 0 6px ${col});
                transition:transform 1.8s cubic-bezier(.1,.8,.3,1),opacity 1.8s ease-out,filter 1.8s ease-out;`;
            vfx.appendChild(p);
            const angle = Math.random() * Math.PI * 2;
            const dist  = Math.random() * 70 + 25;
            const sc    = Math.random() * 3 + 2;
            setTimeout(() => {
                p.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(${sc})`;
                p.style.opacity   = '0';
                p.style.filter    = 'blur(14px)';
            }, 10);
            setTimeout(() => p.remove(), 1900);
        }
    }

    // Llama trasera: lenta (8–12s), pequeña, tenue — posición relativa al vfx
    function bomCreateFlameBack() {
        if (fireLayerBack.querySelectorAll('.bom-fb').length >= 18) return;
        const fl  = document.createElement('div');
        fl.className = 'bom-fb';
        const sz  = Math.random() * 10 + 10;
        const dur = Math.random() * 4 + 8;
        const flickDur = (Math.random() * 1.5 + 1.2).toFixed(2);
        fl.style.cssText = `
            position:absolute;top:-50px;left:${Math.random()*96}%;
            font-size:${sz}px;user-select:none;pointer-events:none;opacity:.45;
            animation:bomFlicker ${flickDur}s ease-in-out infinite;
            transition:top ${dur}s linear;
        `;
        fl.textContent = '🔥';
        fireLayerBack.appendChild(fl);
        requestAnimationFrame(() => requestAnimationFrame(() => { fl.style.top = '115%'; }));
        setTimeout(() => { if (fl.parentNode) fl.remove(); }, dur * 1000 + 400);
    }

    // Llama delantera: más rápida (4–6s), grande, brillante, tocable
    function bomCreateFlameFront() {
        if (fireLayerFront.querySelectorAll('.bom-ff').length >= 14) return;
        const fl  = document.createElement('div');
        fl.className = 'bom-ff';
        const sz  = Math.random() * 14 + 18;
        const dur = Math.random() * 2 + 4;
        const flickDur = (Math.random() * 0.5 + 0.4).toFixed(2);
        fl.style.cssText = `
            position:absolute;top:-50px;left:${Math.random()*94}%;
            font-size:${sz}px;user-select:none;
            pointer-events:auto;cursor:pointer;
            animation:bomFlickerFast ${flickDur}s ease-in-out infinite;
            transition:top ${dur}s linear;
        `;
        fl.textContent = '🔥';
        fl.addEventListener('pointerdown', e => {
            e.stopPropagation();
            bomPlayFire();
            const rf  = fl.getBoundingClientRect();
            const rv  = vfx.getBoundingClientRect();
            bomCreateSmoke(rf.left - rv.left + rf.width/2, rf.top - rv.top + rf.height/2);
            fl.remove();
        });
        fireLayerFront.appendChild(fl);
        requestAnimationFrame(() => requestAnimationFrame(() => { fl.style.top = '115%'; }));
        setTimeout(() => { if (fl.parentNode) fl.remove(); }, dur * 1000 + 400);
    }

    fireInterval  = setInterval(() => bomCreateFlameBack(),  220);
    fireInterval2 = setInterval(() => bomCreateFlameFront(), 280);

    // ── ESTADO DEL JUEGO ─────────────────────────────────────────
    let score = 0, lives = 3, currentScreen = 0;

    // ── WRAP — fijo en esquina inferior-izquierda, draggable dentro del vfx ──
    const wrap = document.createElement('div');
    wrap.id = 'bom-wrap';
    wrap.style.cssText = `
        position:absolute;
        bottom:0;left:2%;
        width:clamp(220px,44%,370px);
        max-height:96%;
        z-index:6;
        overflow-y:auto;overflow-x:hidden;
        display:flex;flex-direction:column;align-items:stretch;
        padding:clamp(5px,1.5%,10px);
        gap:5px;
        font-family:'Segoe UI',sans-serif;
        scroll-behavior:smooth;
        cursor:grab;
        border-radius:12px 12px 0 0;
        box-shadow:0 0 0 1px rgba(255,255,255,0.08);
    `;
    vfx.appendChild(wrap);

    // drag limitado al interior del vfx
    (function makeDraggable(el) {
        let ox=0,oy=0,sx=0,sy=0,dragging=false;
        function onDown(e) {
            if (e.target.tagName==='BUTTON'||e.target.tagName==='INPUT'||e.target.tagName==='SELECT') return;
            dragging=true; el.style.cursor='grabbing';
            const pt = e.touches ? e.touches[0] : e;
            sx=pt.clientX; sy=pt.clientY;
            // convertir left/bottom a top para poder moverlo libremente
            const par=el.parentElement;
            const parR=par.getBoundingClientRect();
            const elR=el.getBoundingClientRect();
            // cambiar a top/left para el drag
            el.style.bottom='';
            el.style.top  = (elR.top  - parR.top)  + 'px';
            el.style.left = (elR.left - parR.left) + 'px';
            ox=elR.left - parR.left;
            oy=elR.top  - parR.top;
            e.preventDefault();
        }
        function onMove(e) {
            if (!dragging) return;
            const pt = e.touches ? e.touches[0] : e;
            const dx=pt.clientX-sx, dy=pt.clientY-sy;
            const par=el.parentElement;
            const nx=Math.max(0, Math.min(par.offsetWidth  - el.offsetWidth,  ox+dx));
            const ny=Math.max(0, Math.min(par.offsetHeight - el.offsetHeight, oy+dy));
            el.style.left=nx+'px'; el.style.top=ny+'px';
        }
        function onUp() { dragging=false; el.style.cursor='grab'; }
        el.addEventListener('mousedown',  onDown, {passive:false});
        el.addEventListener('touchstart', onDown, {passive:false});
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, {passive:true});
        window.addEventListener('mouseup',  onUp);
        window.addEventListener('touchend', onUp);
    })(wrap);

    // ── ESTILOS LOCALES ──────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
    #bom-wrap .bom-header{
        width:100%;
        background:linear-gradient(135deg,rgba(180,40,0,0.88),rgba(100,20,0,0.92));
        border:1px solid rgba(255,120,60,0.35);border-radius:8px;
        padding:clamp(6px,2%,10px) clamp(8px,2%,12px);
        text-align:center;color:#fff;
        box-shadow:0 2px 16px rgba(200,60,0,0.4);
    }
    #bom-wrap .bom-header h2{font-size:clamp(11px,2.5vw,14px);font-weight:700;margin:0 0 2px;}
    #bom-wrap .bom-header p{font-size:clamp(8px,1.6vw,10px);opacity:.82;margin:0;}
    #bom-wrap .bom-header .bom-icon{font-size:clamp(18px,3.5vw,26px);margin-bottom:3px;}

    #bom-wrap .bom-scorebar{
        width:100%;
        display:flex;justify-content:space-between;align-items:center;
        background:rgba(0,0,0,0.55);border:1px solid rgba(255,255,255,0.1);
        border-radius:7px;padding:4px 10px;font-size:clamp(9px,1.8vw,11px);color:#cfc;
    }
    #bom-wrap .bom-score-val{font-size:clamp(13px,2.5vw,16px);font-weight:700;color:#7df;}
    #bom-wrap .bom-lives{font-size:clamp(12px,2.5vw,15px);letter-spacing:2px;}

    #bom-wrap .bom-panel{
        width:100%;
        background:rgba(5,18,5,0.82);
        border:1px solid rgba(100,255,100,0.18);
        border-radius:10px;padding:clamp(8px,2%,12px);
        backdrop-filter:blur(12px);
        box-shadow:0 4px 24px rgba(0,0,0,0.6);
        color:#e8ffe8;
        animation:bomFadeUp .3s ease;
    }

    #bom-wrap .bom-scene{
        background:rgba(0,0,0,0.42);
        border:1px solid rgba(255,255,255,0.1);
        border-radius:10px;padding:clamp(8px,2%,14px);
        margin-bottom:8px;text-align:center;
    }
    #bom-wrap .bom-emoji{font-size:clamp(28px,6vw,44px);display:block;margin-bottom:6px;}
    #bom-wrap .bom-title{font-size:clamp(12px,2.8vw,15px);font-weight:600;color:#afffaf;margin-bottom:4px;}
    #bom-wrap .bom-desc{font-size:clamp(10px,2vw,12px);color:#b0c8b0;line-height:1.55;}

    #bom-wrap .bom-btn-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;}
    #bom-wrap .bom-btn-grid.single{grid-template-columns:1fr;}

    #bom-wrap .bom-choice{
        background:rgba(10,35,10,0.82);
        border:1px solid rgba(100,200,100,0.28);
        border-radius:8px;padding:clamp(8px,2%,12px) 7px;
        font-size:clamp(9px,1.9vw,11px);color:#cfc;
        cursor:pointer;text-align:center;line-height:1.4;
        transition:background .15s,transform .1s;
    }
    #bom-wrap .bom-choice:hover{background:rgba(20,70,20,0.9);}
    #bom-wrap .bom-choice:active{transform:scale(.97);}
    #bom-wrap .bom-choice.correct{background:rgba(30,100,30,0.9);border-color:#4c4;color:#afffaf;}
    #bom-wrap .bom-choice.wrong{background:rgba(100,20,20,0.9);border-color:#c44;color:#ffafaf;}
    #bom-wrap .bom-choice.disabled{pointer-events:none;opacity:.5;}

    #bom-wrap .bom-main-btn{
        width:100%;
        background:linear-gradient(135deg,#8B1A00,#5c1000);
        color:white;border:none;border-radius:8px;
        padding:clamp(9px,2%,13px);font-size:clamp(11px,2.4vw,14px);font-weight:600;
        cursor:pointer;margin-top:6px;
        transition:opacity .15s,transform .1s;
        box-shadow:0 2px 12px rgba(200,50,0,0.4);
    }
    #bom-wrap .bom-main-btn:hover{opacity:.88;}
    #bom-wrap .bom-main-btn:active{transform:scale(.98);}
    #bom-wrap .bom-main-btn.green{background:linear-gradient(135deg,#3B6D11,#27500A);}

    #bom-wrap .bom-feedback{
        border-radius:8px;padding:8px 11px;
        font-size:clamp(9px,1.9vw,11px);line-height:1.55;
        margin-top:6px;display:none;
    }
    #bom-wrap .bom-feedback.show{display:block;}
    #bom-wrap .bom-feedback.good{background:rgba(30,80,10,0.82);color:#afffaf;border:1px solid #4c4;}
    #bom-wrap .bom-feedback.bad{background:rgba(80,10,10,0.82);color:#ffafaf;border:1px solid #c44;}
    #bom-wrap .bom-feedback.info{background:rgba(10,35,75,0.82);color:#adf;border:1px solid #48f;}

    #bom-wrap .bom-drag-zone{
        min-height:54px;border:1.5px dashed rgba(100,200,100,0.38);
        border-radius:8px;padding:6px;
        display:flex;flex-wrap:wrap;gap:5px;align-items:center;
        background:rgba(0,0,0,0.3);transition:background .2s;
    }
    #bom-wrap .bom-drag-zone.over{background:rgba(24,95,165,0.3);}
    #bom-wrap .bom-drag-item{
        background:rgba(20,60,20,0.88);border:1px solid rgba(100,200,100,0.3);
        border-radius:6px;padding:5px 8px;font-size:clamp(8px,1.8vw,10px);color:#cfc;
        cursor:grab;user-select:none;transition:transform .1s;
    }
    #bom-wrap .bom-drag-item:active{cursor:grabbing;transform:scale(1.05);}
    #bom-wrap .bom-drag-item.placed{background:rgba(30,100,30,0.9);border-color:#4c4;color:#afffaf;}
    #bom-wrap .bom-drag-item.bad-place{background:rgba(100,20,20,0.9);border-color:#c44;color:#ffafaf;}

    #bom-wrap .bom-result-circle{
        width:70px;height:70px;border-radius:50%;
        background:rgba(30,100,30,0.85);border:2px solid #4c4;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        margin:0 auto 10px;font-size:10px;color:#afffaf;font-weight:600;
    }
    #bom-wrap .bom-result-circle .big{font-size:22px;font-weight:700;}

    .bom-shake{animation:bomShake .5s ease-in-out;}
    .bom-pulse{animation:bomPulse 1s infinite;}
    `;
    document.head.appendChild(style);

    // ── HELPERS ──────────────────────────────────────────────────
    function addScore(n){ score+=n; updateBars(); }
    function loseLife(){ if(lives>0){lives--;updateBars();} }
    function updateBars(){
        wrap.querySelectorAll('.bom-score-val').forEach(el=>el.textContent=score);
        wrap.querySelectorAll('.bom-lives').forEach(el=>{
            el.textContent='❤️'.repeat(lives)+(lives<3?'🖤'.repeat(3-lives):'');
        });
    }

    function showScreen(n){
        currentScreen = n;
        wrap.innerHTML = '';
        wrap.style.justifyContent = 'flex-start';
        switch(n){
            case 0: buildS0(); break;
            case 1: buildS1(); break;
            case 2: buildS2(); break;
            case 3: buildS3(); break;
            case 4: buildS4(); break;
            case 5: buildFinal(); break;
        }
        wrap.scrollTop = 0;
    }

    function scorebar(){
        const sb = document.createElement('div');
        sb.className = 'bom-scorebar';
        sb.innerHTML = `<span>Puntaje</span><span class="bom-score-val">${score}</span><span class="bom-lives">${'❤️'.repeat(lives)+'🖤'.repeat(3-lives)}</span>`;
        wrap.appendChild(sb);
    }
    function header(icon, title, sub){
        const h = document.createElement('div');
        h.className = 'bom-header';
        h.innerHTML = `<div class="bom-icon">${icon}</div><h2>${title}</h2><p>${sub}</p>`;
        wrap.appendChild(h);
        return h;
    }
    function panel(){
        const p = document.createElement('div');
        p.className = 'bom-panel';
        wrap.appendChild(p);
        return p;
    }
    function scene(p, emoji, title, desc){
        const s = document.createElement('div');
        s.className = 'bom-scene';
        s.innerHTML = `<span class="bom-emoji">${emoji}</span><div class="bom-title">${title}</div><div class="bom-desc">${desc}</div>`;
        p.appendChild(s);
        return s;
    }
    function mainBtn(p, label, green, onclick){
        const b = document.createElement('button');
        b.className = 'bom-main-btn' + (green?' green':'');
        b.textContent = label;
        b.style.display = 'block';
        b.onclick = onclick;
        p.appendChild(b);
        return b;
    }
    function feedback(p, id){
        const f = document.createElement('div');
        f.className = 'bom-feedback'; f.id = id;
        p.appendChild(f);
        return f;
    }
    function showFeedback(id, type, html){
        const f = document.getElementById(id);
        if(f){ f.className='bom-feedback show '+type; f.innerHTML=html; }
    }

    // ── PANTALLA 0: INTRO ─────────────────────────────────────────
    function buildS0(){
        header('🏟️','Sismo en el Azteca 2026','México vs. Argentina · 80,000 espectadores');
        const p = panel();
        scene(p,'⚽','¡Estás en el partido del siglo!',
            'El marcador está 1-1. Minuto 88. La cancha está electrizada.<br><br>De repente… el suelo empieza a temblar.<br>¿Sabes qué hacer?');
        mainBtn(p,'¡Entrar al estadio! ⚽',false,()=>showScreen(1));
    }

    // ── PANTALLA 1: REACCIÓN INMEDIATA ────────────────────────────
    function buildS1(){
        header('🚨','¡SISMO EN EL AZTECA!','Magnitud estimada: 6.5 · ~45 segundos');
        scorebar();
        const p = panel();
        const scEl = scene(p,'😱','¡El piso se mueve! ¿Cuál es tu primer instinto?',
            'Estás en la gradería sur, sección 14, fila 30. Las luces parpadean.');
        // agitar header
        setTimeout(()=>{ scEl.classList.add('bom-shake'); setTimeout(()=>scEl.classList.remove('bom-shake'),600); },200);

        const grid = document.createElement('div'); grid.className='bom-btn-grid'; p.appendChild(grid);
        const opts = [
            {t:'🏃 Correr hacia la salida más cercana',ok:false},
            {t:'🛡️ Cubrirme, agacharme y sujetarme al asiento',ok:true},
            {t:'📱 Sacar el celular y grabar el sismo',ok:false},
            {t:'🙈 Quedarme parado viendo a todos lados',ok:false},
        ];
        const fb = feedback(p,'bom-s1-fb');
        const nextBtn = mainBtn(p,'Siguiente situación →',false,()=>showScreen(2));
        nextBtn.style.display='none';
        let answered=false;
        opts.forEach(opt=>{
            const b = document.createElement('button');
            b.className='bom-choice'; b.innerHTML=opt.t;
            b.onclick=()=>{
                if(answered)return; answered=true;
                grid.querySelectorAll('.bom-choice').forEach(x=>x.classList.add('disabled'));
                if(opt.ok){
                    b.classList.add('correct');
                    showFeedback('bom-s1-fb','good','✅ ¡Correcto! La posición de protección (agacharse, cubrirse, sujetarse) es clave. Los sismos suelen durar menos de 1 minuto. +100 pts');
                    addScore(100);
                } else {
                    b.classList.add('wrong');
                    grid.querySelectorAll('.bom-choice')[1].classList.add('correct');
                    showFeedback('bom-s1-fb','bad','❌ Incorrecto. Correr durante el sismo provoca caídas. La regla es: AGÁCHATE, CÚBRETE y SUJÉTATE hasta que pase.');
                    loseLife();
                }
                nextBtn.style.display='block';
            };
            grid.appendChild(b);
        });
    }

    // ── PANTALLA 2: EVACUACIÓN ────────────────────────────────────
    function buildS2(){
        header('🏃','Evacuación del Estadio','El sismo terminó — ahora toca salir');
        scorebar();
        const p = panel();
        scene(p,'🚪','El sismo pasó. La gente empieza a moverse. ¿Qué haces?',
            'Hay 80,000 personas. Las luces de emergencia están encendidas. Hay humo en una de las salidas.');

        const grid = document.createElement('div'); grid.className='bom-btn-grid'; p.appendChild(grid);
        const opts = [
            {t:'🔥 Salir por la salida más cercana aunque haya humo',ok:false},
            {t:'📢 Esperar instrucciones del personal de seguridad y evacuar con calma',ok:true},
            {t:'📸 Quedarme a tomar fotos para redes sociales',ok:false},
            {t:'🔙 Regresar por mis cosas antes de salir',ok:false},
        ];
        const fb = feedback(p,'bom-s2-fb');
        const nextBtn = mainBtn(p,'Siguiente situación →',false,()=>showScreen(3));
        nextBtn.style.display='none';
        let answered=false;
        opts.forEach(opt=>{
            const b = document.createElement('button');
            b.className='bom-choice'; b.innerHTML=opt.t;
            b.onclick=()=>{
                if(answered)return; answered=true;
                grid.querySelectorAll('.bom-choice').forEach(x=>x.classList.add('disabled'));
                if(opt.ok){
                    b.classList.add('correct');
                    showFeedback('bom-s2-fb','good','✅ ¡Bien! Seguir instrucciones y evacuación ordenada evita aplastamientos. Nunca regreses por objetos. +100 pts');
                    addScore(100);
                } else {
                    b.classList.add('wrong');
                    grid.querySelectorAll('.bom-choice')[1].classList.add('correct');
                    showFeedback('bom-s2-fb','bad','❌ En una evacuación masiva, el pánico es el mayor peligro. Sigue siempre al personal de seguridad y evacúa por rutas libres de humo.');
                    loseLife();
                }
                nextBtn.style.display='block';
            };
            grid.appendChild(b);
        });
    }

    // ── PANTALLA 3: ZONA SEGURA (drag) ────────────────────────────
    function buildS3(){
        header('🛡️','¿Dónde refugiarse?','Durante el sismo — identifica zonas seguras');
        scorebar();
        const p = panel();
        scene(p,'🏟️','Arrastra las ZONAS SEGURAS al recuadro verde',
            'Selecciona los lugares donde debes refugiarte durante el temblor.');

        const zonas = [
            {id:'z1',text:'🏛️ Bajo una columna estructural',safe:true},
            {id:'z2',text:'🪟 Cerca de ventanales de vidrio',safe:false},
            {id:'z3',text:'🌳 Campo abierto (cancha)',safe:true},
            {id:'z4',text:'🎭 Bajo un telón colgante',safe:false},
            {id:'z5',text:'🚪 Marco de puerta resistente',safe:true},
            {id:'z6',text:'💡 Bajo el marcador electrónico',safe:false},
            {id:'z7',text:'🛤️ Pasillo central alejado de paredes',safe:true},
        ];
        let dropped=[];

        const srcLabel = document.createElement('div');
        srcLabel.style.cssText='font-size:clamp(9px,1.8vw,11px);color:rgba(255,255,255,.6);margin-bottom:4px;';
        srcLabel.textContent='Zonas disponibles:'; p.appendChild(srcLabel);

        const src = document.createElement('div'); src.className='bom-drag-zone'; src.id='bom-zsrc'; p.appendChild(src);

        const tgtLabel = document.createElement('div');
        tgtLabel.style.cssText='font-size:clamp(9px,1.8vw,11px);color:#afffaf;margin:6px 0 4px;';
        tgtLabel.innerHTML='✅ Zonas SEGURAS → soltar aquí:'; p.appendChild(tgtLabel);

        const tgt = document.createElement('div'); tgt.className='bom-drag-zone'; tgt.id='bom-ztgt'; p.appendChild(tgt);
        tgt.ondragover=e=>{e.preventDefault();tgt.classList.add('over');};
        tgt.ondragleave=()=>tgt.classList.remove('over');
        tgt.ondrop=e=>{
            e.preventDefault(); tgt.classList.remove('over');
            const id=e.dataTransfer.getData('text/plain');
            tgt.appendChild(document.getElementById(id));
            if(!dropped.includes(id))dropped.push(id);
        };

        zonas.forEach(z=>{
            const el=document.createElement('div');
            el.className='bom-drag-item'; el.draggable=true; el.id=z.id; el.textContent=z.text;
            el.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',z.id));
            el.addEventListener('click',()=>{
                if(tgt.querySelector('#'+z.id)){ src.appendChild(el); dropped=dropped.filter(x=>x!==z.id); }
                else{ tgt.appendChild(el); if(!dropped.includes(z.id))dropped.push(z.id); }
            });
            src.appendChild(el);
        });

        const fb = feedback(p,'bom-s3-fb');
        const checkBtn = mainBtn(p,'Verificar →',false,()=>{
            let correct=0,wrong=0;
            dropped.forEach(id=>{
                const z=zonas.find(x=>x.id===id);
                const el=document.getElementById(id);
                if(z.safe){el.classList.add('placed');correct++;}else{el.classList.add('bad-place');wrong++;}
            });
            const missed=zonas.filter(x=>x.safe&&!dropped.includes(x.id)).length;
            checkBtn.style.display='none'; nextBtn.style.display='block';
            if(wrong===0&&missed===0){ showFeedback('bom-s3-fb','good','✅ ¡Perfecto! Columnas, campo abierto, marcos de puertas y pasillos centrales son tus mejores opciones. +150 pts'); addScore(150); }
            else if(correct>=2){ showFeedback('bom-s3-fb','info',`ℹ️ Bien, pero ${wrong} zona(s) son peligrosas. Evita vidrios y objetos colgantes. +${correct*20} pts`); addScore(correct*20); if(wrong>0)loseLife(); }
            else{ showFeedback('bom-s3-fb','bad','❌ Recuerda: columnas, campo abierto, marcos de puertas resistentes y pasillos centrales. Nunca cerca de vidrios o cosas que puedan caer.'); loseLife(); }
        });
        const nextBtn = mainBtn(p,'Siguiente situación →',false,()=>showScreen(4));
        nextBtn.style.display='none';
    }

    // ── PANTALLA 4: KIT DE EMERGENCIA ─────────────────────────────
    function buildS4(){
        header('🎒','Kit de Emergencia','¿Qué llevar en tu mochila de sismos?');
        scorebar();
        const p = panel();
        scene(p,'🧳','Selecciona los 5 artículos ESENCIALES para tu mochila de emergencia','Elige exactamente 5 — los más importantes para sobrevivir.');

        const kits = [
            {id:'k1',text:'💧 Agua (1.5L)',ok:true},{id:'k2',text:'🔦 Linterna',ok:true},
            {id:'k3',text:'🩹 Botiquín básico',ok:true},{id:'k4',text:'📻 Radio de baterías',ok:true},
            {id:'k5',text:'📄 Copia de documentos',ok:true},{id:'k6',text:'🎮 Videojuego portátil',ok:false},
            {id:'k7',text:'💼 Traje formal',ok:false},{id:'k8',text:'☕ Cafetera eléctrica',ok:false},
            {id:'k9',text:'🪞 Espejo grande',ok:false},
        ];
        let selected=[];

        const countEl=document.createElement('div');
        countEl.style.cssText='font-size:clamp(9px,1.8vw,11px);color:rgba(255,255,255,.7);margin-bottom:6px;';
        countEl.innerHTML='Seleccionados: <span id="bom-kitcount">0</span>/5'; p.appendChild(countEl);

        const grid=document.createElement('div');
        grid.style.cssText='display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:8px;';
        p.appendChild(grid);

        kits.forEach(k=>{
            const b=document.createElement('button');
            b.className='bom-choice'; b.id='bom-'+k.id;
            b.style.cssText='padding:8px 5px;font-size:clamp(8px,1.7vw,10px);';
            b.textContent=k.text;
            b.onclick=()=>{
                if(selected.includes(k.id)){ selected=selected.filter(x=>x!==k.id); b.style.background=''; }
                else{ if(selected.length>=5)return; selected.push(k.id); b.style.background='rgba(24,95,165,0.5)'; }
                document.getElementById('bom-kitcount').textContent=selected.length;
            };
            grid.appendChild(b);
        });

        const fb=feedback(p,'bom-s4-fb');
        const checkBtn=mainBtn(p,'Verificar mochila →',false,()=>{
            if(selected.length!==5){ showFeedback('bom-s4-fb','bad','❌ Debes seleccionar exactamente 5 artículos.'); return; }
            let correct=0,wrong=0;
            selected.forEach(id=>{
                const k=kits.find(x=>x.id===id);
                const b=document.getElementById('bom-'+id);
                if(k.ok){b.classList.add('correct');correct++;}else{b.classList.add('wrong');wrong++;}
            });
            checkBtn.style.display='none'; nextBtn.style.display='block';
            if(correct===5){ showFeedback('bom-s4-fb','good','🎒 ¡Mochila perfecta! Agua, linterna, botiquín, radio y documentos. ¡Eres un experto! +200 pts'); addScore(200); }
            else if(correct>=3){ showFeedback('bom-s4-fb','info',`ℹ️ Buena mochila, pero ${wrong} artículo(s) no son prioritarios. +${correct*20} pts`); addScore(correct*20); loseLife(); }
            else{ showFeedback('bom-s4-fb','bad','❌ Los 5 esenciales: agua, linterna, botiquín, radio de baterías y documentos.'); loseLife(); }
        });
        const nextBtn=mainBtn(p,'Ver resultado final →',false,()=>showScreen(5));
        nextBtn.style.display='none';
    }

    // ── PANTALLA FINAL ────────────────────────────────────────────
    function buildFinal(){
        header('🏆','Resultado Final','¿Qué tan preparada estás para un sismo?');
        const p=panel();
        const circle=document.createElement('div'); circle.className='bom-result-circle';
        circle.innerHTML=`<span class="big">${score}</span><span>pts</span>`;
        p.appendChild(circle);

        const title=document.createElement('div');
        title.style.cssText='font-size:clamp(12px,2.8vw,16px);font-weight:700;color:#afffaf;text-align:center;margin-bottom:6px;';
        const desc=document.createElement('div');
        desc.style.cssText='font-size:clamp(10px,2vw,12px);color:#b0c8b0;text-align:center;line-height:1.5;margin-bottom:10px;';
        if(score>=450){ title.textContent='⭐ Brigadista Azteca de Oro'; desc.textContent='¡Increíble! Estás más preparada que la mayoría. Tu conocimiento puede salvar vidas en el Azteca y en cualquier lugar.'; }
        else if(score>=250){ title.textContent='🛡️ Superviviente Intermedia'; desc.textContent='Buenas bases, pero hay cosas por reforzar. ¡Practica el simulacro con tu familia!'; }
        else{ title.textContent='📚 Aprendiz en Emergencias'; desc.textContent='¡Para eso está el juego! Ahora ya sabes qué hacer. ¡Compártelo con alguien más!'; }
        p.appendChild(title); p.appendChild(desc);

        const tips=[
            '🔔 Registra la app SASMEX para alertas sísmicas.',
            '🏠 Identifica las zonas seguras de tu hogar y trabajo.',
            '🎒 Prepara tu mochila de emergencia antes del próximo sismo.',
            '👨‍👩‍👧 Practica el simulacro del 19 de septiembre con tu familia.',
        ];
        tips.forEach(t=>{
            const tc=document.createElement('div');
            tc.style.cssText='background:rgba(0,0,0,0.4);border-radius:7px;padding:7px 10px;font-size:clamp(9px,1.8vw,11px);color:#b0c8b0;border-left:3px solid #c0392b;margin:4px 0;line-height:1.4;';
            tc.textContent=t; p.appendChild(tc);
        });
        mainBtn(p,'🔁 Jugar de nuevo',true,()=>{ score=0; lives=3; showScreen(0); });
    }

    // ── ARRANCAR ──────────────────────────────────────────────────
    showScreen(0);

    return {
        cleanup: () => {
            if (fireInterval)  clearInterval(fireInterval);
            if (fireInterval2) clearInterval(fireInterval2);
            if (bomAudioCtx) { try { bomAudioCtx.close(); } catch(e){} bomAudioCtx = null; }
            // humo absoluto dentro del vfx se elimina con innerHTML=''
            // restaurar z-index / filter de nina y bombera
            const gn = document.getElementById('glow-nina');
            const gb = document.getElementById('glow-bombera');
            if(gn){ gn.style.zIndex=''; gn.style.position=''; gn.style.filter=''; }
            if(gb){ gb.style.zIndex=''; gb.style.position=''; gb.style.filter=''; }
            const kf =document.getElementById('bom-kf');      if(kf)  kf.remove();
            const fkf=document.getElementById('bom-fire-kf'); if(fkf) fkf.remove();
            document.querySelectorAll('style').forEach(s=>{ if(s.textContent.includes('bom-header'))s.remove(); });
            vfx.innerHTML='';
            vfx.style.overflow='';
        }
    };
}


// ─── 6. POLICÍA — barra de luces con botones ────────────────────
function efectoPolicia(vfx) {

    // ── CAPAS DEL MURAL ────────────────────────────────────────────
    const NINA_Z = 65;
    const elNina = document.getElementById('glow-nina');
    if (elNina) {
        elNina.style.zIndex    = String(NINA_Z);
        elNina.style.position  = 'absolute';
        elNina.style.filter    = 'brightness(1.6) drop-shadow(0 0 20px rgba(255,255,255,1))';
        elNina.style.animation = 'nina-pulso 1.8s ease-in-out infinite';
    }
    const PROF = ['glow-doctora','glow-ingeniera','glow-maestra','glow-bombera','glow-repartidora','glow-futbolista'];
    PROF.forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        el.style.animation = 'none'; el.style.filter = 'brightness(0.7)'; el.style.opacity = '0.7';
    });
    const FONDO = ['glow-jugadoras','glow-azteca','glow-historia','glow-nosotras'];
    FONDO.forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        el.style.animation = 'none'; el.style.filter = 'brightness(0.6)'; el.style.opacity = '0.6';
    });

    // ── WRAPPER ────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:absolute;inset:0;z-index:60;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(6px,1.5vh,14px);padding:clamp(6px,2vw,16px);box-sizing:border-box;';
    vfx.appendChild(wrapper);

    wrapper.innerHTML = `<style>
/* ── Luces barra ── */
.np-bar{display:flex;gap:clamp(3px,1vw,6px);padding:clamp(5px,1.2vw,10px);
  background:rgba(0,0,0,.45);border-radius:10px;border:1px solid rgba(255,255,255,.08);
  backdrop-filter:blur(6px);justify-content:center;width:100%;box-sizing:border-box;}
.np-l{flex:1;max-width:clamp(28px,7vw,52px);height:clamp(38px,8vh,80px);
  border-radius:6px;background:#1a1a1a;position:relative;overflow:hidden;transition:background .15s;}
.np-l .np-i{position:absolute;inset:3px;border-radius:4px;background:rgba(255,255,255,.04);}

.np-l.blue  {animation:npB1 .5s step-end infinite;}
.np-l.blue2 {animation:npB1 .5s step-end infinite;animation-delay:.25s;}
.np-l.blue3 {animation:npB1 .5s step-end infinite;animation-delay:.12s;}
.np-l.red   {animation:npR1 .5s step-end infinite;}
.np-l.red2  {animation:npR1 .5s step-end infinite;animation-delay:.25s;}
.np-l.red3  {animation:npR1 .5s step-end infinite;animation-delay:.12s;}
.np-l.spot  {background:#ffffcc!important;box-shadow:0 0 28px #ffff88,0 0 60px rgba(255,255,180,.4);animation:none;}
.np-l.off   {background:#1a1a1a!important;box-shadow:none!important;animation:none!important;}
.np-l.caution  {animation:npC1 .55s step-end infinite;}
.np-l.caution2 {animation:npC1 .55s step-end infinite;animation-delay:.27s;}
.np-l.caution3 {animation:npC1 .55s step-end infinite;animation-delay:.14s;}
.np-l.sos   {animation:npSOS .18s step-end infinite;}

@keyframes npB1{0%,49%{background:#0044ff;box-shadow:0 0 18px #0044ff,0 0 35px rgba(0,68,255,.5);}50%,100%{background:#0a0a22;box-shadow:none;}}
@keyframes npR1{0%,49%{background:#ff1100;box-shadow:0 0 18px #ff1100,0 0 35px rgba(255,17,0,.5);}50%,100%{background:#220a0a;box-shadow:none;}}
@keyframes npC1{0%,49%{background:#ffaa00;box-shadow:0 0 18px #ffaa00,0 0 30px rgba(255,170,0,.4);}50%,100%{background:#1a1200;box-shadow:none;}}
@keyframes npSOS{0%,49%{background:#fff;box-shadow:0 0 28px #fff,0 0 60px rgba(255,255,255,.6);}50%,100%{background:#111;box-shadow:none;}}

/* ── Paneles fondo ── */
.np-bg{position:absolute;inset:0;display:grid;
  grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);
  gap:clamp(3px,0.8vw,8px);padding:clamp(3px,0.8vw,8px);
  pointer-events:none;z-index:0;}
.np-bp{border-radius:8px;background:transparent;transition:background .15s;}
.np-bp.blue   {animation:bpB .5s step-end infinite;}
.np-bp.blue2  {animation:bpB .5s step-end infinite;animation-delay:.25s;}
.np-bp.blue3  {animation:bpB .5s step-end infinite;animation-delay:.12s;}
.np-bp.red    {animation:bpR .5s step-end infinite;}
.np-bp.red2   {animation:bpR .5s step-end infinite;animation-delay:.25s;}
.np-bp.red3   {animation:bpR .5s step-end infinite;animation-delay:.12s;}
.np-bp.spot   {animation:bpS .2s step-end infinite;}
.np-bp.caution  {animation:bpCA .55s step-end infinite;}
.np-bp.caution2 {animation:bpCA .55s step-end infinite;animation-delay:.27s;}
.np-bp.caution3 {animation:bpCA .55s step-end infinite;animation-delay:.14s;}
.np-bp.sos    {animation:bpSOS .18s step-end infinite;}
.np-bp.off    {background:transparent!important;animation:none!important;}

@keyframes bpB  {0%,49%{background:rgba(0,68,255,.35);}  50%,100%{background:transparent;}}
@keyframes bpR  {0%,49%{background:rgba(255,17,0,.35);}   50%,100%{background:transparent;}}
@keyframes bpS  {0%,49%{background:rgba(255,255,200,.4);} 50%,100%{background:transparent;}}
@keyframes bpCA {0%,49%{background:rgba(255,170,0,.35);}  50%,100%{background:transparent;}}
@keyframes bpSOS{0%,49%{background:rgba(255,255,255,.45);}50%,100%{background:transparent;}}

/* ── Controles ── */
.np-ctrl{position:relative;z-index:2;background:rgba(0,0,0,.55);
  border:1px solid rgba(255,255,255,.1);border-radius:12px;
  padding:clamp(7px,1.5vw,12px);backdrop-filter:blur(8px);
  width:100%;max-width:clamp(260px,90vw,500px);box-sizing:border-box;}
.np-btns{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(4px,1vw,8px);}
.np-btn{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.18);
  color:#fff;padding:clamp(6px,1.2vh,11px) 2px;border-radius:7px;cursor:pointer;
  font-size:clamp(.58rem,1.4vw,.75rem);font-weight:600;letter-spacing:.3px;
  transition:background .15s,border-color .15s;touch-action:manipulation;white-space:nowrap;}
.np-btn:hover{background:rgba(255,255,255,.16);}
.np-btn.active{border-color:#00f2ff;color:#00f2ff;background:rgba(0,242,255,.08);}
.np-btn.sos-on{border-color:#ff3366;color:#ff3366;background:rgba(255,51,102,.12);}

/* ── Slider ── */
.np-slider-row{display:flex;align-items:center;gap:7px;margin-top:clamp(4px,0.8vh,9px);}
.np-slider-row label{color:rgba(255,255,255,.6);font-size:clamp(.52rem,1.2vw,.68rem);white-space:nowrap;}
.np-slider-row input[type=range]{flex:1;accent-color:#00f2ff;cursor:pointer;}
</style>

<div class="np-bg">
  <div class="np-bp off" id="nbp1"></div><div class="np-bp off" id="nbp2"></div><div class="np-bp off" id="nbp3"></div>
  <div class="np-bp off" id="nbp4"></div><div class="np-bp off" id="nbp5"></div><div class="np-bp off" id="nbp6"></div>
</div>

<div class="np-bar" style="position:relative;z-index:2;max-width:clamp(260px,90vw,500px);">
  <div class="np-l blue"  id="nl1"><div class="np-i"></div></div>
  <div class="np-l blue2" id="nl2"><div class="np-i"></div></div>
  <div class="np-l blue3" id="nl3"><div class="np-i"></div></div>
  <div class="np-l red"   id="nl4"><div class="np-i"></div></div>
  <div class="np-l red2"  id="nl5"><div class="np-i"></div></div>
  <div class="np-l red3"  id="nl6"><div class="np-i"></div></div>
</div>

<div class="np-ctrl">
  <div class="np-btns">
    <button class="np-btn active" id="np1">Secuencia 1</button>
    <button class="np-btn"        id="np2">Secuencia 2</button>
    <button class="np-btn"        id="np3">Spotlight</button>
    <button class="np-btn"        id="np4">Precaución</button>
    <button class="np-btn"        id="np5">Apagar</button>
    <button class="np-btn"        id="np6">🆘 SOS</button>
  </div>
  <div class="np-slider-row">
    <label>Brillo exterior</label>
    <input type="range" id="np-slider" min="0" max="1" step="0.05" value="0.6">
  </div>
</div>`;

    // ── HELPERS ────────────────────────────────────────────────────
    const $ = id => wrapper.querySelector('#' + id);

    function luces(map) {
        Object.entries(map).forEach(([id, cls]) => { const el=$(id); if(el) el.className='np-l '+cls; });
    }
    function fondo(map) {
        Object.entries(map).forEach(([id, cls]) => { const el=$(id); if(el) el.className='np-bp '+cls; });
    }
    function allLuces(cls) { ['nl1','nl2','nl3','nl4','nl5','nl6'].forEach(id=>{ const el=$(id); if(el) el.className='np-l '+cls; }); }
    function allFondo(cls) { ['nbp1','nbp2','nbp3','nbp4','nbp5','nbp6'].forEach(id=>{ const el=$(id); if(el) el.className='np-bp '+cls; }); }
    function act(btn) { wrapper.querySelectorAll('.np-btn').forEach(b=>b.classList.remove('active','sos-on')); btn.classList.add('active'); }
    function apagarTodo() { allLuces('off'); allFondo('off'); sosActivo=false; }

    // ── SOS ────────────────────────────────────────────────────────
    let sosActivo = false;
    async function flashSOS(onMs, offMs) {
        if (!sosActivo) return;
        allLuces('sos'); allFondo('sos');
        await new Promise(r=>setTimeout(r,onMs));
        if (!sosActivo) return;
        allLuces('off'); allFondo('off');
        await new Promise(r=>setTimeout(r,offMs));
    }
    async function cicloSOS() {
        while (sosActivo) {
            await flashSOS(160,100); await flashSOS(160,100); await flashSOS(160,220);
            await flashSOS(580,160); await flashSOS(580,160); await flashSOS(580,220);
            await flashSOS(160,100); await flashSOS(160,100); await flashSOS(160,700);
        }
    }

    // ── SLIDER ─────────────────────────────────────────────────────
    const slider = $('np-slider');
    if (slider) slider.addEventListener('input', function() {
        wrapper.style.setProperty('--np-bg-alpha', parseFloat(this.value));
    });

    // ── BOTONES ────────────────────────────────────────────────────
    const b1=$('np1'); if(b1) b1.onclick=function(){ sosActivo=false; act(this);
        luces({nl1:'blue',nl2:'blue2',nl3:'blue3',nl4:'red',nl5:'red2',nl6:'red3'});
        fondo({nbp1:'blue',nbp2:'blue2',nbp3:'blue3',nbp4:'red',nbp5:'red2',nbp6:'red3'}); };

    const b2=$('np2'); if(b2) b2.onclick=function(){ sosActivo=false; act(this);
        luces({nl1:'blue',nl2:'red2',nl3:'blue3',nl4:'red',nl5:'blue2',nl6:'red3'});
        fondo({nbp1:'blue',nbp2:'red2',nbp3:'blue3',nbp4:'red',nbp5:'blue2',nbp6:'red3'}); };

    const b3=$('np3'); if(b3) b3.onclick=function(){ sosActivo=false; act(this);
        luces({nl1:'off',nl2:'off',nl3:'spot',nl4:'spot',nl5:'off',nl6:'off'});
        fondo({nbp1:'off',nbp2:'off',nbp3:'spot',nbp4:'spot',nbp5:'off',nbp6:'off'}); };

    const b4=$('np4'); if(b4) b4.onclick=function(){ sosActivo=false; act(this);
        luces({nl1:'caution',nl2:'caution3',nl3:'caution2',nl4:'caution2',nl5:'caution',nl6:'caution3'});
        fondo({nbp1:'caution',nbp2:'caution3',nbp3:'caution2',nbp4:'caution2',nbp5:'caution',nbp6:'caution3'}); };

    const b5=$('np5'); if(b5) b5.onclick=function(){ act(this); apagarTodo(); };

    const b6=$('np6'); if(b6) b6.onclick=function(){
        sosActivo=!sosActivo;
        if (sosActivo) {
            wrapper.querySelectorAll('.np-btn').forEach(b=>b.classList.remove('active','sos-on'));
            this.classList.add('sos-on'); cicloSOS();
        } else { act(this); apagarTodo(); this.classList.remove('sos-on'); }
    };

    if (b1) b1.click();

    return {
        cleanup: () => {
            sosActivo = false;
            [...PROF, ...FONDO].forEach(id => {
                const el=document.getElementById(id); if(!el) return;
                el.style.animation=''; el.style.filter=''; el.style.opacity='';
            });
            if (elNina) { elNina.style.zIndex=''; elNina.style.position=''; elNina.style.filter=''; elNina.style.animation=''; }
            wrapper.remove();
        }
    };
}



// ─── 7. MAESTRA — tabla periódica con palabras en espacios vacios ─
function efectoMaestra(vfx) {
    // Palabras que aparecen en la tabla
    const palabrasMaestra=['HISTORIA','CIENCIA','ARTE','FUERZA','SUEÑOS','LOGRO','SABER','VOZ','LUZ','PODER','CREAR','LIDERAR','INNOVAR','SOÑAR','CONSTRUIR','INSPIRAR','SOÑAR','VOLAR'];

    const elementos=[
        {s:'H', n:'Hidrógeno',num:1},{s:'He',n:'Helio',num:2},{s:'Li',n:'Litio',num:3},{s:'Be',n:'Berilio',num:4},
        {s:'B', n:'Boro',num:5},{s:'C', n:'Carbono',num:6},{s:'N', n:'Nitrógeno',num:7},{s:'O', n:'Oxígeno',num:8},
        {s:'F', n:'Flúor',num:9},{s:'Ne',n:'Neón',num:10},{s:'Na',n:'Sodio',num:11},{s:'Mg',n:'Magnesio',num:12},
        {s:'Al',n:'Aluminio',num:13},{s:'Si',n:'Silicio',num:14},{s:'P', n:'Fósforo',num:15},{s:'S', n:'Azufre',num:16},
        {s:'Cl',n:'Cloro',num:17},{s:'Ar',n:'Argón',num:18},
    ];
    const colors2=['#ff6600','#00ccff','#ff3399','#00ff99','#ffdd00','#aa88ff','#ff4466','#66ffff'];

    let wi=0;
    vfx.innerHTML=`<div class="pt-wrap">
        <div class="pt-grid" id="pt-grid"></div>
        <div class="pt-tip">Toca un elemento para escucharlo · Toca una palabra para leerla</div>
    </div>`;

    const grid=document.getElementById('pt-grid');
    elementos.forEach((el,i)=>{
        const cell=document.createElement('div');
        if(i%3===2 && i>0 && Math.random()>.4){
            // Palabra en lugar de elemento
            const w=palabrasMaestra[wi%palabrasMaestra.length];
            const c=colors2[wi%colors2.length];
            wi++;
            cell.className='pt-cell word';
            cell.style.border=`1px solid ${c}44`;
            cell.style.background=`${c}22`;
            cell.innerHTML=`<div class="wrd" style="color:${c};text-shadow:0 0 8px ${c};">${w}</div>`;
            cell.addEventListener('click',()=>{
                cell.style.transform='scale(1.2)';setTimeout(()=>cell.style.transform='',400);
                if(window.speechSynthesis){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(w);u.lang='es-MX';u.rate=0.85;u.pitch=1.1;const v=window.speechSynthesis.getVoices().find(x=>x.lang.startsWith('es'));if(v)u.voice=v;window.speechSynthesis.speak(u);}
            });
        } else {
            cell.className='pt-cell elem';
            cell.innerHTML=`<div class="num">${el.num}</div><div class="sym">${el.s}</div><div class="nm">${el.n}</div>`;
            cell.addEventListener('click',()=>{
                cell.style.transform='scale(1.1)';setTimeout(()=>cell.style.transform='',300);
                if(window.speechSynthesis){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(el.n);u.lang='es-MX';u.rate=0.85;const v=window.speechSynthesis.getVoices().find(x=>x.lang.startsWith('es'));if(v)u.voice=v;window.speechSynthesis.speak(u);}
            });
        }
        grid.appendChild(cell);
    });
    return {cleanup:()=>{window.speechSynthesis&&window.speechSynthesis.cancel();vfx.innerHTML='';}};
}

// ─── 8. PAQUETERÍA — moto grande brillante + portería + start ───
function efectoPaqueteria(vfx) {
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;cursor:crosshair;touch-action:none;';
    vfx.appendChild(svg);
    const W=vfx.offsetWidth,H=vfx.offsetHeight;
    const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
    defs.innerHTML=`<pattern id="pkd2" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="rgba(255,255,255,.1)"/></pattern>
    <filter id="moto-glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    svg.appendChild(defs);
    const bg2=document.createElementNS('http://www.w3.org/2000/svg','rect');bg2.setAttribute('width','100%');bg2.setAttribute('height','100%');bg2.setAttribute('fill','url(#pkd2)');svg.appendChild(bg2);

    // START marker
    const startG=document.createElementNS('http://www.w3.org/2000/svg','g');
    startG.setAttribute('transform',`translate(60,${H/2})`);
    startG.innerHTML=`<circle r="18" fill="rgba(0,255,100,.2)" stroke="#00ff66" stroke-width="2"/>
    <text y="5" text-anchor="middle" font-size="10" fill="#00ff66" font-family="sans-serif" font-weight="bold">START</text>`;
    svg.appendChild(startG);

    // Portería (objetivo)
    const goalG=document.createElementNS('http://www.w3.org/2000/svg','g');
    goalG.setAttribute('transform',`translate(${W-50},${H/2})`);
    goalG.innerHTML=`<rect x="-8" y="-35" width="40" height="70" fill="rgba(255,255,255,.05)" stroke="#fff" stroke-width="2.5"/>
    <line x1="-8" y1="-35" x2="-8" y2="35" stroke="#fff" stroke-width="3"/>
    <text y="50" x="12" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.7)" font-family="sans-serif">META 🏁</text>
    <text y="5" x="12" text-anchor="middle" font-size="18">🥅</text>`;
    svg.appendChild(goalG);

    const pl=document.createElementNS('http://www.w3.org/2000/svg','g');
    const mg=document.createElementNS('http://www.w3.org/2000/svg','g');
    // Moto 50% más grande (fue 32px → ahora 48px)
    const mt=document.createElementNS('http://www.w3.org/2000/svg','text');
    mt.setAttribute('font-size','48');mt.setAttribute('x','-24');mt.setAttribute('y','20');
    mt.setAttribute('filter','url(#moto-glow)');mt.textContent='🏍️';
    mg.appendChild(mt);svg.appendChild(pl);svg.appendChild(mg);

    let moto={x:60,y:H/2},line={x:60,y:H/2},target={x:60,y:H/2},hue=0,raf;
    let goalReached=false;

    function hi(e){const r=svg.getBoundingClientRect();const cx=(e.touches?e.touches[0].clientX:e.clientX)-r.left;const cy=(e.touches?e.touches[0].clientY:e.clientY)-r.top;target={x:cx,y:cy};const b=document.createElementNS('http://www.w3.org/2000/svg','text');b.setAttribute('x',cx-8);b.setAttribute('y',cy+8);b.setAttribute('font-size','16');b.textContent='📦';pl.appendChild(b);setTimeout(()=>b.remove(),2500);}
    svg.addEventListener('mousedown',hi);
    svg.addEventListener('touchstart',e=>{e.preventDefault();hi(e);},{passive:false});

    function loop(){
        const dlx=target.x-line.x,dly=target.y-line.y,dl=Math.hypot(dlx,dly);
        if(dl>2){const o={...line};line.x+=dlx/dl*6;line.y+=dly/dl*6;const s=document.createElementNS('http://www.w3.org/2000/svg','line');s.setAttribute('x1',o.x);s.setAttribute('y1',o.y);s.setAttribute('x2',line.x);s.setAttribute('y2',line.y);s.setAttribute('stroke',`hsl(${hue},100%,60%)`);s.setAttribute('stroke-width','6');s.setAttribute('stroke-linecap','round');hue=(hue+3)%360;pl.appendChild(s);}
        const dmx=line.x-moto.x,dmy=line.y-moto.y,dm=Math.hypot(dmx,dmy);
        if(dm>4){const a=Math.atan2(dmy,dmx)*180/Math.PI;moto.x+=dmx/dm*5;moto.y+=dmy/dm*5;mg.setAttribute('transform',`translate(${moto.x},${moto.y}) rotate(${a})`);}
        // Detectar llegada a portería
        if(!goalReached && Math.hypot(moto.x-(W-50),moto.y-H/2)<40){
            goalReached=true;
            const gol=document.createElementNS('http://www.w3.org/2000/svg','text');
            gol.setAttribute('x',W/2);gol.setAttribute('y',H/2);
            gol.setAttribute('text-anchor','middle');gol.setAttribute('font-size','32');
            gol.setAttribute('fill','#ffdd00');gol.setAttribute('filter','url(#moto-glow)');
            gol.textContent='🎉 ¡ENTREGA EXITOSA!';svg.appendChild(gol);
            setTimeout(()=>{gol.remove();goalReached=false;},2500);
        }
        raf=requestAnimationFrame(loop);
    }
    mg.setAttribute('transform',`translate(${moto.x},${moto.y})`);loop();
    return {cleanup:()=>{cancelAnimationFrame(raf);svg.remove();}};
}

// ─── MAPA DE EFECTOS ────────────────────────────────────────────
const ninaEfectos=[efectoFutbolista,efectoAstronauta,efectoDoctora,efectoArquitecta,efectoBombera,efectoPolicia,efectoMaestra,efectoPaqueteria];

// ══════════════════════════════════════════════════════════════
// VARIABLES AJUSTABLES DE BRILLO — edita estos valores
// ══════════════════════════════════════════════════════════════
const NINA_BRILLO = {
    fondo:          0.06,   // brillo del fondo general (capas sin ID)
    jugadoras:      0.06,   // brillo de jugadoras y balón (igual al fondo)
    profesionistas: 0.06,   // brillo base de las 6 profesionistas (oscuras, igual fondo)
    conectada:      1.30,   // brillo de la profesionista que conecta con la niña (+15% sobre 1.15 base)
    glowSize:       '5%',   // tamaño del glow en contorno de la conectada (% del contenedor)
};

// Conexión niña → profesionista(s)
const ninaConexion = {
    0: ['glow-futbolista'],                                                                  // nina-1
    1: ['glow-doctora','glow-ingeniera','glow-maestra','glow-bombera','glow-repartidora','glow-futbolista'], // nina-2 todas
    2: ['glow-doctora'],                                                                     // nina-3
    3: ['glow-ingeniera'],                                                                   // nina-4
    4: ['glow-bombera'],                                                                     // nina-5
    5: ['glow-doctora','glow-ingeniera','glow-maestra','glow-bombera','glow-repartidora','glow-futbolista'], // nina-6 todas
    6: ['glow-maestra'],                                                                     // nina-7
    7: ['glow-repartidora'],                                                                 // nina-8
};

// IDs de las 6 profesionistas
const profesionistas = ['glow-doctora','glow-ingeniera','glow-maestra','glow-bombera','glow-repartidora','glow-futbolista'];

// IDs de jugadoras + balón (oscuros igual que fondo)
const jugadorasIds   = ['glow-jugadoras'];
const balonId        = 'balon-loader';

// IDs que van oscuros como el fondo (historia, azteca, grietas, nosotras, creditos)
const fondoIds       = ['glow-historia','glow-azteca','grieta-verde','glow-nosotras','img-creditos-btn'];

// ─── APLICAR OSCURIDAD BASE AL INICIAR MODO NIÑA ─────────────
function aplicarOscuridadBase() {
    // Capas sin ID (fondo, publicos, grieta negra)
    document.querySelectorAll('.layer:not([id])').forEach(el => {
        el.style.transition = 'filter 0.5s ease, opacity 0.5s ease';
        el.style.filter     = `brightness(${NINA_BRILLO.fondo})`;
        el.style.opacity    = '1';
        el.style.animation  = 'none';
    });
    // Fondo IDs
    fondoIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.transition = 'filter 0.5s ease, opacity 0.5s ease';
        el.style.filter     = `brightness(${NINA_BRILLO.fondo})`;
        el.style.opacity    = '1';
        el.style.animation  = 'none';
    });
    // Jugadoras — mismo nivel que fondo, sin glow, sin movimiento, sin clicks
    jugadorasIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.transition = 'filter 0.5s ease, opacity 0.5s ease';
        el.style.filter     = `brightness(${NINA_BRILLO.jugadoras})`;
        el.style.opacity    = '1';
        el.style.animation  = 'none';
    });
    // Balón — apagado sin luz
    const balonEl = document.getElementById(balonId);
    if (balonEl) {
        balonEl.style.filter  = `brightness(${NINA_BRILLO.jugadoras})`;
        balonEl.style.opacity = '0.2';
    }
    // Profesionistas — oscuras igual que fondo, estáticas
    profesionistas.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.transition = 'filter 0.6s ease, opacity 0.5s ease';
        el.style.filter     = `brightness(${NINA_BRILLO.profesionistas})`;
        el.style.opacity    = '1';
        el.style.animation  = 'none';
    });
    // Niña base — siempre brillante
    const ninaEl = document.getElementById('glow-nina');
    if (ninaEl) {
        ninaEl.style.transition = 'filter 0.5s ease';
        ninaEl.style.filter     = 'brightness(1.6) drop-shadow(0 0 20px rgba(255,255,255,1))';
        ninaEl.style.opacity    = '1';
        ninaEl.style.animation  = 'nina-pulso 1.8s ease-in-out infinite';
    }
    // Zona nina sigue activa siempre — el CSS body.nina-activa lo gestiona


// ─── APLICAR CONEXIÓN DE PROFESIONISTA ───────────────────────
function aplicarConexion(idx) {
    // Nina-2 (astronauta, idx=1): profesionistas totalmente invisibles
    const esAstronauta = (idx === 1);
    const conectadas   = ninaConexion[idx] || [];

    profesionistas.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.animation = 'none';
        if (esAstronauta) {
            el.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
            el.style.opacity    = '0';
            el.style.filter     = 'brightness(0)';
        } else if (conectadas.includes(id)) {
            const glowPx = Math.round(vfxGlowPx());
            el.style.opacity    = '1';
            el.style.transition = 'filter 0.6s ease, opacity 0.5s ease';
            el.style.filter     = `brightness(${NINA_BRILLO.conectada}) drop-shadow(0 0 ${glowPx}px rgba(255,255,255,0.9)) drop-shadow(0 0 ${Math.round(glowPx*0.5)}px rgba(255,220,180,0.6))`;
        } else {
            el.style.opacity    = '1';
            el.style.transition = 'filter 0.6s ease, opacity 0.5s ease';
            el.style.filter     = `brightness(${NINA_BRILLO.profesionistas})`;
        }
    });
}

// Calcula tamaño de glow en px basado en el contenedor
function vfxGlowPx() {
    const cont = document.getElementById('mural-container');
    if (!cont) return 18;
    return Math.round(cont.offsetWidth * 0.018); // ~1.8% del ancho
}

// ─── ACTIVAR MODO NIÑA ───────────────────────────────────────
function activarModoNina() {
    if (ninaModoActivo) return;
    ninaModoActivo = true;
    ninaIndex      = 0;
    pausarAmbiente();
    document.body.classList.add('nina-activa');

    aplicarOscuridadBase();
    document.getElementById('nina-controles').style.display = 'flex';
    mostrarNina(0);

    document.getElementById('nina-back').onclick    = () => desactivarModoNina();
    document.getElementById('nina-prev').onclick    = () => { ninaIndex=(ninaIndex-1+ninaSrcs.length)%ninaSrcs.length; mostrarNina(ninaIndex); };
    document.getElementById('nina-next').onclick    = () => { ninaIndex=(ninaIndex+1)%ninaSrcs.length; mostrarNina(ninaIndex); };
    document.getElementById('nina-cerrar').onclick  = () => desactivarModoNina();
}

function mostrarNina(idx) {
    limpiarEfectoNina();

    // Aplicar conexión de profesionista para esta niña
    aplicarConexion(idx);

    const ninaEl  = document.getElementById('glow-nina');
    const testImg = new Image();

    function lanzarEfecto() {
        ninaEl.style.filter    = 'brightness(1.6) drop-shadow(0 0 20px rgba(255,255,255,1))';
        ninaEl.style.animation = 'nina-pulso 1.8s ease-in-out infinite';
        const vfx = document.getElementById('nina-vfx');
        if (vfx && ninaEfectos[idx]) ninaEfectoActivo = ninaEfectos[idx](vfx);
    }

    testImg.onload  = () => { ninaEl.src = ninaSrcs[idx]; lanzarEfecto(); };
    testImg.onerror = () => lanzarEfecto();
    testImg.src     = ninaSrcs[idx];

    const cont = document.getElementById('nina-contador');
    if (cont) cont.textContent = `${idx+1} / ${ninaSrcs.length}`;
}

function desactivarModoNina() {
    if (!ninaModoActivo) return;
    ninaModoActivo = false;
    limpiarEfectoNina();
    document.body.classList.remove('nina-activa');

    // Restaurar TODAS las capas — limpiar filter, opacity, animation,
    // zIndex y position que efectos individuales pudieron alterar
    document.querySelectorAll('.layer').forEach(el => {
        el.style.transition = 'filter 0.6s ease, opacity 0.6s ease';
        el.style.filter     = '';
        el.style.opacity    = '';
        el.style.animation  = '';
        el.style.zIndex     = '';
        el.style.position   = '';
    });

    // Restaurar balón
    const balonEl = document.getElementById(balonId);
    if (balonEl) {
        balonEl.style.filter   = '';
        balonEl.style.opacity  = '';
        balonEl.style.zIndex   = '';
        balonEl.style.position = '';
    }

    // Restaurar niña base
    const ninaEl = document.getElementById('glow-nina');
    if (ninaEl) {
        ninaEl.src           = 'assets/nina-base.png';
        ninaEl.style.zIndex  = '';
        ninaEl.style.position= '';
    }

    // CSS body.nina-activa ya no aplica → zonas recuperan z-index:50 y pointer-events automáticamente

    document.getElementById('nina-controles').style.display = 'none';
    reanudarAmbiente();
}

// ==========================================
let carruselIndex  = 0;
let carruselVideos = [];
let touchStartX    = 0;

function abrirCarrusel(videos) {
    carruselVideos = videos;
    carruselIndex  = 0;
    cargarVideoCarrusel(0);
}

function cargarVideoCarrusel(index) {
    mediaContenido.innerHTML = '';

    const total = carruselVideos.length;
    const datos = carruselVideos[index];

    // ── Wrapper principal ──────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.className = 'carrusel-wrapper';

    // ── Encabezado: título + subtítulo ─────────────────
    const header = document.createElement('div');
    header.className = 'carrusel-header';

    const titulo = document.createElement('h2');
    titulo.className   = 'carrusel-titulo';
    titulo.textContent = datos.titulo || '';

    const subtitulo = document.createElement('p');
    subtitulo.className   = 'carrusel-subtitulo';
    subtitulo.textContent = datos.subtitulo || '';

    header.appendChild(titulo);
    header.appendChild(subtitulo);

    // ── Área de video ──────────────────────────────────
    const videoArea = document.createElement('div');
    videoArea.className = 'carrusel-video-area';

    // Thumbnail (se muestra hasta que el video puede reproducirse)
    const thumbContainer = document.createElement('div');
    thumbContainer.className = 'carrusel-thumb-container';

    if (datos.thumb) {
        const thumb = document.createElement('img');
        thumb.src       = datos.thumb;
        thumb.className = 'carrusel-thumb';
        thumb.alt       = datos.titulo || 'Jugadora';
        thumbContainer.appendChild(thumb);
    }

    // Ícono de play sobre el thumb
    const playIcon = document.createElement('div');
    playIcon.className   = 'carrusel-play-icon';
    playIcon.innerHTML   = '▶';
    thumbContainer.appendChild(playIcon);

    // Video
    const video    = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.className = 'carrusel-video';
    video.style.opacity = '0'; // oculto hasta canplay

    const fuente   = document.createElement('source');
    fuente.src     = datos.src;
    fuente.type    = 'video/webm';
    video.appendChild(fuente);

    // Al poder reproducir: ocultar thumb, mostrar video
    video.addEventListener('canplay', () => {
        terminarCarga();
        pausarAmbiente();
        thumbContainer.style.display = 'none';
        video.style.opacity          = '1';
        modalMedia.style.display     = 'flex';
        modalMedia.style.visibility  = 'visible';
    }, { once: true });

    // Al terminar: siguiente automático
    video.addEventListener('ended', () => {
        const siguiente = (index + 1) % total;
        carruselIndex   = siguiente;
        cargarVideoCarrusel(siguiente);
    });

    video.addEventListener('error', () => terminarCarga());

    videoArea.appendChild(thumbContainer);
    videoArea.appendChild(video);

    // ── Navegación: flechas + contador ────────────────
    const nav = document.createElement('div');
    nav.className = 'carrusel-nav';

    const btnPrev = document.createElement('button');
    btnPrev.className   = 'carrusel-btn';
    btnPrev.innerHTML   = '&#9664;';
    btnPrev.title       = 'Anterior';
    btnPrev.addEventListener('click', () => {
        const anterior  = (index - 1 + total) % total;
        carruselIndex   = anterior;
        cargarVideoCarrusel(anterior);
    });

    const contador = document.createElement('span');
    contador.className   = 'carrusel-contador';
    contador.textContent = `${index + 1} / ${total}`;

    const btnNext = document.createElement('button');
    btnNext.className   = 'carrusel-btn';
    btnNext.innerHTML   = '&#9654;';
    btnNext.title       = 'Siguiente';
    btnNext.addEventListener('click', () => {
        const siguiente = (index + 1) % total;
        carruselIndex   = siguiente;
        cargarVideoCarrusel(siguiente);
    });

    nav.appendChild(btnPrev);
    nav.appendChild(contador);
    nav.appendChild(btnNext);

    // ── Miniaturas de jugadoras (strip inferior) ───────
    const strip = document.createElement('div');
    strip.className = 'carrusel-strip';

    carruselVideos.forEach((v, i) => {
        const item = document.createElement('div');
        item.className = 'carrusel-strip-item' + (i === index ? ' activo' : '');
        item.title     = v.titulo || `Jugadora ${i + 1}`;

        if (v.thumb) {
            const img   = document.createElement('img');
            img.src     = v.thumb;
            img.alt     = v.titulo || '';
            item.appendChild(img);
        }

        const nombre = document.createElement('span');
        nombre.textContent = v.titulo ? v.titulo.split(' ')[0] : `#${i + 1}`;
        item.appendChild(nombre);

        item.addEventListener('click', () => {
            carruselIndex = i;
            cargarVideoCarrusel(i);
        });

        strip.appendChild(item);
    });

    // ── Dots indicadores ───────────────────────────────
    const dots = document.createElement('div');
    dots.className = 'carrusel-dots';

    for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        dot.className = 'carrusel-dot' + (i === index ? ' activo' : '');
        dot.addEventListener('click', () => {
            carruselIndex = i;
            cargarVideoCarrusel(i);
        });
        dots.appendChild(dot);
    }

    // ── Ensamblar ──────────────────────────────────────
    wrapper.appendChild(header);
    wrapper.appendChild(videoArea);
    wrapper.appendChild(nav);
    wrapper.appendChild(strip);
    wrapper.appendChild(dots);

    mediaContenido.appendChild(wrapper);
}

// ── Swipe en móvil ────────────────────────────────────
modalMedia.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

modalMedia.addEventListener('touchend', e => {
    const diff  = touchStartX - e.changedTouches[0].clientX;
    const total = carruselVideos.length;
    if (Math.abs(diff) < 40 || !total) return;

    if (diff > 0) {
        carruselIndex = (carruselIndex + 1) % total;
    } else {
        carruselIndex = (carruselIndex - 1 + total) % total;
    }
    cargarVideoCarrusel(carruselIndex);
});

// --- AUDIO CRÉDITOS ---
let audioCreditos = null;

// --- ABRIR CRÉDITOS ---
function abrirCreditos() {
    iniciarCarga(2);
    const img = document.getElementById('img-creditos-panel');

    function mostrarCreditos() {
        terminarCarga();
        pausarAmbiente();

        // Crear y reproducir el audio aquí, dentro del evento de usuario
        if (audioCreditos) {
            audioCreditos.pause();
            audioCreditos.currentTime = 0;
        } else {
            audioCreditos = new Audio('assets/creditos.mp3');
            audioCreditos.loop = false;
        }
        audioCreditos.play().catch(() => {});

        modalCreditos.style.display    = 'flex';
        modalCreditos.style.visibility = 'visible';
    }

    if (img.complete) {
        mostrarCreditos();
    } else {
        img.addEventListener('load', mostrarCreditos, { once: true });
    }
}

// --- CERRAR ---
function cerrarMedia() {
    const media = mediaContenido.querySelector('video, audio');
    if (media) media.pause();
    mediaContenido.innerHTML    = '';
    carruselVideos              = [];
    carruselIndex               = 0;
    modalMedia.style.display    = 'none';
    modalMedia.style.visibility = 'hidden';
    reanudarAmbiente();
}

btnCerrarMedia.addEventListener('click', cerrarMedia);
btnCerrar.addEventListener('click', () => {
    if (audioCreditos) { audioCreditos.pause(); audioCreditos.currentTime = 0; }
    modalCreditos.style.display    = 'none';
    modalCreditos.style.visibility = 'hidden';
    reanudarAmbiente();
});

// --- CONECTAR ZONAS ---
Object.keys(zonaData).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => abrirContenido(zonaData[id]));
});

// ==========================================
// --- EFECTO CORAZONES (zona-nosotras) ---
// ==========================================
const GalaxiaCorazones = (() => {

    // ══════════════════════════════════════
    // CONFIGURACIÓN — edita estos valores
    // ══════════════════════════════════════
    const CFG = {
        velocidadMin:  0.8,   // velocidad mínima de los corazones flotantes
        velocidadMax:  2.0,   // velocidad máxima de los corazones flotantes
        gravedad:      0.012, // atracción suave hacia el centro (0 = sin gravedad)
        tamañoPct:     0.085, // tamaño de cada corazón flotante (% del ancho del mural)
        tamañoBasePct: 0.11,  // tamaño del corazón base central (% del ancho)
        particulas:    36,    // nº de partículas al explotar un corazón
    };

    // --- FRASES (imagen siempre 'assets/corazon.png' para las 15, 'assets/corazon-base.png' para la base) ---
    const FRASES = [
        { t: "DEL OLVIDO A LA HISTORIA",                              s: "El rescate de la identidad de las pioneras de 1971",     c: "#00ffcc", f: "'Bebas Neue'",       mp3: "assets/del-olvido.mp3"    },
        { t: "SI LLEGA UNA, LLEGAMOS TODAS",                          s: "La fuerza de la sororidad que nos une",                  c: "#ff6600", f: "'Permanent Marker'", mp3: "assets/si-llega-una.mp3"  },
        { t: "TU FUERZA INSPIRA A LA NIÑA QUE HOY TE MIRA",          s: "Conexión entre la niña y las mujeres del mural",         c: "#ff3399", f: "'Caveat'",           mp3: "assets/tu-fuerza.mp3"     },
        { t: "AYER REBELDES, HOY EJEMPLO",                            s: "Del estigma de 1971 al reconocimiento del 2026",         c: "#cc33ff", f: "'Playfair Display'", mp3: "assets/ayer-rebeldes.mp3" },
        { t: "HOY NUESTRA VOZ NO TIENE SILENCIO",                     s: "El fin del anonimato histórico",                        c: "#ffff00", f: "'Montserrat'",       mp3: "assets/hoy-nuestra.mp3"   },
        { t: "EL CAMPO DE JUEGO HOY ES NUESTRO",                      s: "Reclamo de los espacios profesionales",                 c: "#00ff99", f: "'Bebas Neue'",       mp3: "assets/el-campo.mp3"      },
        { t: "CAMINAMOS SOBRE LOS PASOS DE LAS QUE NO SE RINDIERON",  s: "Homenaje a las pioneras de 1971",                      c: "#ff9900", f: "'Permanent Marker'", mp3: "assets/caminamos.mp3"     },
        { t: "SOMOS EL GRITO DE LAS QUE NO PUDIERON ALZAR LA VOZ",    s: "Justicia histórica para las borradas",                  c: "#66ffff", f: "'Caveat'",           mp3: "assets/somos-el.mp3"      },
        { t: "ROMPE EL TECHO DE CRISTAL CON LA FUERZA DE TUS SUEÑOS", s: "Superación de barreras laborales",                     c: "#ff66cc", f: "'Montserrat'",       mp3: "assets/rompe-el.mp3"      },
        { t: "HEREDERAS DE UN SUEÑO QUE NUNCA DEJÓ DE LATIR",         s: "La continuidad que une ambas épocas",                   c: "#ffcc00", f: "'Playfair Display'", mp3: "assets/herederas.mp3"     },
        { t: "MIS SUEÑOS SON VÁLIDOS, Y MEREZCO LUCHAR POR ELLOS",    s: "Empoderamiento frente a los prejuicios",               c: "#ff3333", f: "'Bebas Neue'",       mp3: "assets/mis-suenos.mp3"    },
        { t: "NACISTE PARA HACER HISTORIA, NO PARA VERLA PASAR",      s: "Invitación a ser parte activa del cambio",              c: "#33ffcc", f: "'Permanent Marker'", mp3: "assets/naciste.mp3"       },
        { t: "TU TRIUNFO ES EL DE TODAS",                             s: "El éxito de una como victoria compartida",              c: "#ff99cc", f: "'Caveat'",           mp3: "assets/tu-triunfo.mp3"    },
        { t: "TRANSFORMAMOS LA RESISTENCIA EN LIBERTAD",               s: "El resultado de décadas de lucha por la equidad",      c: "#99ff33", f: "'Montserrat'",       mp3: "assets/transformamos.mp3" },
        { t: "EL FUTURO TIENE NOMBRE DE MUJER Y FUERZA DE GUERRERA",  s: "Visión de esperanza y liderazgo",                      c: "#ffaa00", f: "'Playfair Display'", mp3: "assets/el-futuro.mp3"     },
    ];
    const BASE_FRASE = { t: "MUJERES DE LA PAZ, EJEMPLO DE LUCHA Y GRANDEZA", s: "Trabajadoras, valientes y dueñas de su propio destino", c: "#ff6699", f: "'Permanent Marker'", mp3: "assets/historia-1.mp3" };

    // --- ESTADO ---
    let activo         = false;
    let rafFisica      = null;
    let rafFondo       = null;
    let audioActual    = null;
    let modoPantalla   = 'corazones'; // 'corazones' | 'frase'
    let hueFondo       = 0;

    // --- AUDIO CONTEXT ---
    let _actx = null;
    function getActx() {
        if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
        return _actx;
    }

    // --- SONIDO COLISIÓN (ping suave) ---
    function sonarColision() {
        try {
            const ctx = getActx();
            if (ctx.state === 'suspended') ctx.resume();
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(900, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
            g.gain.setValueAtTime(0.04, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
            o.connect(g); g.connect(ctx.destination);
            o.start(); o.stop(ctx.currentTime + 0.18);
        } catch(e) {}
    }

    // --- SONIDO BURBUJA (explosión del corazón) ---
    function sonarBurbuja() {
        try {
            const ctx = getActx();
            if (ctx.state === 'suspended') ctx.resume();
            // Capa 1: pop ascendente
            const o1 = ctx.createOscillator(), g1 = ctx.createGain();
            o1.type = 'sine';
            o1.frequency.setValueAtTime(300, ctx.currentTime);
            o1.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.06);
            g1.gain.setValueAtTime(0.3, ctx.currentTime);
            g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
            o1.connect(g1); g1.connect(ctx.destination);
            o1.start(); o1.stop(ctx.currentTime + 0.09);
            // Capa 2: burbuja alta
            const o2 = ctx.createOscillator(), g2 = ctx.createGain();
            o2.type = 'triangle';
            o2.frequency.setValueAtTime(1200, ctx.currentTime + 0.04);
            o2.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.09);
            g2.gain.setValueAtTime(0.12, ctx.currentTime + 0.04);
            g2.exponentialRampToValueAtTime = undefined;
            g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            o2.connect(g2); g2.connect(ctx.destination);
            o2.start(ctx.currentTime + 0.04); o2.stop(ctx.currentTime + 0.14);
        } catch(e) {}
    }

    // --- INYECTAR ESTILOS CSS (una sola vez) ---
    function inyectarEstilos() {
        if (document.getElementById('gc-estilos')) return;
        const st = document.createElement('style');
        st.id = 'gc-estilos';
        st.textContent = `
            @keyframes gc-gradiente-hue {
                0%   { filter: hue-rotate(0deg)   brightness(1.05); }
                50%  { filter: hue-rotate(180deg) brightness(1.12); }
                100% { filter: hue-rotate(360deg) brightness(1.05); }
            }
            @keyframes gc-latido-base {
                0%,100% { transform: translate(-50%,-50%) scale(1); }
                15%     { transform: translate(-50%,-50%) scale(1.10); }
                30%     { transform: translate(-50%,-50%) scale(1.02); }
                45%     { transform: translate(-50%,-50%) scale(1.07); }
                60%     { transform: translate(-50%,-50%) scale(1); }
            }
            @keyframes gc-latido-frase {
                0%,100% { transform: translate(-50%,-50%) scale(1); }
                20%     { transform: translate(-50%,-50%) scale(1.13); }
                40%     { transform: translate(-50%,-50%) scale(0.97); }
                55%     { transform: translate(-50%,-50%) scale(1.05); }
                70%     { transform: translate(-50%,-50%) scale(1); }
            }
            @keyframes gc-particula {
                0%   { opacity:1; transform:translate(var(--px),var(--py)) scale(var(--ps)); }
                80%  { opacity:0.6; }
                100% { opacity:0; transform:translate(calc(var(--px)*2.5),calc(var(--py)*2.5)) scale(0); }
            }
            @keyframes gc-frase-in {
                0%   { opacity:0; transform:translateX(-50%) translateY(18px); }
                100% { opacity:1; transform:translateX(-50%) translateY(0); }
            }
            @keyframes gc-respira-base {
                0%,100% { filter: brightness(1.0) drop-shadow(0 0 12px rgba(176,0,255,0.7)); }
                50%     { filter: brightness(1.35) drop-shadow(0 0 28px rgba(176,0,255,1)) drop-shadow(0 0 50px rgba(176,0,255,0.5)); }
            }
            .gc-corazon-flotante {
                position:absolute;
                cursor:pointer;
                pointer-events:auto;
                user-select:none;
                transform:translate(-50%,-50%);
                z-index:121;
                touch-action:manipulation;
                -webkit-tap-highlight-color:transparent;
            }
            .gc-corazon-flotante img {
                width:100%; height:100%;
                object-fit:contain;
                pointer-events:none;
                display:block;
            }
            .gc-particula-exp {
                position:absolute;
                border-radius:50%;
                pointer-events:none;
                z-index:150;
                animation: gc-particula 1s cubic-bezier(0.2,0.8,0.4,1) forwards;
            }
        `;
        document.head.appendChild(st);
    }

    // --- CANVAS DEGRADADO FLOTANTE EN EL CORAZÓN ---
    // Cada corazón flotante es un canvas que mezcla corazon.png
    // con un degradado hue-rotado animado usando composite 'source-atop'
    function crearCanvasCorazon(size, hueOffset) {
        const wrap = document.createElement('div');
        wrap.className = 'gc-corazon-flotante';
        wrap.style.width  = size + 'px';
        wrap.style.height = size + 'px';

        const canvas = document.createElement('canvas');
        canvas.width  = size;
        canvas.height = size;
        canvas.style.cssText = 'width:100%;height:100%;display:block;pointer-events:none;';

        const img = new Image();
        img.src = 'assets/corazon.png';

        let hue    = hueOffset;
        let rafId  = null;
        let vivo   = true;

        function dibujar() {
            if (!vivo) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, size, size);

            // Degradado animado base
            hue = (hue + 0.8) % 360;
            const hue2 = (hue + 120) % 360;
            const hue3 = (hue + 240) % 360;
            const grad = ctx.createLinearGradient(0, 0, size, size);
            grad.addColorStop(0,   `hsl(${hue},100%,60%)`);
            grad.addColorStop(0.5, `hsl(${hue2},100%,55%)`);
            grad.addColorStop(1,   `hsl(${hue3},100%,60%)`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, size, size);

            // Aplicar la máscara del corazón PNG
            if (img.complete && img.naturalWidth > 0) {
                ctx.globalCompositeOperation = 'destination-in';
                ctx.drawImage(img, 0, 0, size, size);
                ctx.globalCompositeOperation = 'source-over';
                // Brillo interior suave
                const glow = ctx.createRadialGradient(size*0.5, size*0.38, 0, size*0.5, size*0.5, size*0.5);
                glow.addColorStop(0,   'rgba(255,255,255,0.35)');
                glow.addColorStop(0.5, 'rgba(255,255,255,0.08)');
                glow.addColorStop(1,   'rgba(255,255,255,0)');
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = glow;
                ctx.fillRect(0, 0, size, size);
                ctx.globalCompositeOperation = 'source-over';
            }

            rafId = requestAnimationFrame(dibujar);
        }

        img.onload  = () => dibujar();
        img.onerror = () => {
            // Fallback: corazón emoji coloreado
            const ctx = canvas.getContext('2d');
            ctx.font = `${size*0.85}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `hsl(${hueOffset},100%,60%)`;
            ctx.fillText('♥', size/2, size/2);
        };

        wrap._stopCanvas = () => { vivo = false; if (rafId) cancelAnimationFrame(rafId); };
        wrap.appendChild(canvas);
        return wrap;
    }

    // --- EXPLOSIÓN DE PARTÍCULAS 3D (esferas de distintos tamaños) ---
    function explosionParticulas(cx, cy, cont) {
        const colores = [
            '#38bdf8','#a78bfa','#f472b6','#34d399','#fbbf24',
            '#ff71ce','#ff4d4d','#4dffb4','#ffe94d','#b44dff',
            '#ff944d','#4db4ff',
        ];
        const n = CFG.particulas;
        for (let i = 0; i < n; i++) {
            const ang    = (Math.PI * 2 * i / n) + Math.random() * 0.4;
            const dist   = 30 + Math.random() * 80;
            const size   = 5 + Math.random() * 14; // variedad de tamaños
            const dur    = 0.7 + Math.random() * 0.3;
            const color  = colores[Math.floor(Math.random() * colores.length)];
            const pct    = Math.random(); // profundidad simulada
            const bright = 60 + pct * 30;

            const p = document.createElement('div');
            p.className = 'gc-particula-exp';
            p.style.setProperty('--px', Math.cos(ang) * dist + 'px');
            p.style.setProperty('--py', Math.sin(ang) * dist + 'px');
            p.style.setProperty('--ps', (0.5 + pct).toFixed(2));
            p.style.width           = size + 'px';
            p.style.height          = size + 'px';
            p.style.left            = cx + 'px';
            p.style.top             = cy + 'px';
            p.style.marginLeft      = -size/2 + 'px';
            p.style.marginTop       = -size/2 + 'px';
            p.style.background      = `radial-gradient(circle at 35% 35%, hsl(${Math.floor(Math.random()*360)},100%,${bright}%), ${color})`;
            p.style.boxShadow       = `0 0 ${Math.round(size*0.6)}px ${color}`;
            p.style.animationDuration = dur + 's';
            cont.appendChild(p);
            setTimeout(() => p.remove(), dur * 1000 + 100);
        }
    }

    // --- FONDO DEGRADADO DINÁMICO (canvas sobre el overlay) ---
    let bgCanvas = null;
    let bgHue    = 0;
    let bgRaf    = null;

    function iniciarFondo(overlay) {
        bgCanvas = document.createElement('canvas');
        bgCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
        overlay.insertBefore(bgCanvas, overlay.firstChild);

        function resize() {
            const rect = overlay.getBoundingClientRect();
            bgCanvas.width  = rect.width  || overlay.offsetWidth;
            bgCanvas.height = rect.height || overlay.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function drawBg() {
            if (!activo) return;
            bgHue = (bgHue + 0.15) % 360;
            const W = bgCanvas.width, H = bgCanvas.height;
            const ctx = bgCanvas.getContext('2d');
            const h1 = bgHue, h2 = (bgHue + 80) % 360, h3 = (bgHue + 160) % 360;
            const g = ctx.createLinearGradient(0, 0, W, H);
            g.addColorStop(0,    `hsl(${h1},70%,12%)`);
            g.addColorStop(0.45, `hsl(${h2},65%,10%)`);
            g.addColorStop(1,    `hsl(${h3},75%,14%)`);
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
            bgRaf = requestAnimationFrame(drawBg);
        }
        drawBg();

        return () => {
            window.removeEventListener('resize', resize);
            if (bgRaf) { cancelAnimationFrame(bgRaf); bgRaf = null; }
        };
    }

    // --- MOSTRAR PANTALLA FRASE ---
    function mostrarFrase(data, contFr, W, H, sizeBase) {
        modoPantalla = 'frase';
        if (rafFisica) { cancelAnimationFrame(rafFisica); rafFisica = null; }

        // Pausa audio previo
        if (audioActual) { audioActual.pause(); audioActual.currentTime = 0; }

        // Ocultar corazones flotantes
        contFr.querySelectorAll('.gc-corazon-flotante').forEach(el => {
            el.style.transition = 'opacity 0.25s ease';
            el.style.opacity    = '0';
            el.style.pointerEvents = 'none';
        });

        // Panel de frase — aparece sobre el corazón base pero sin taparlo
        const panel = document.createElement('div');
        panel.id = 'gc-frase-panel';
        panel.style.cssText = `
            position:absolute;
            left:50%; top:8%;
            transform:translateX(-50%);
            z-index:135;
            text-align:center;
            width:88%;
            max-width:520px;
            pointer-events:none;
            animation: gc-frase-in 0.5s cubic-bezier(0.25,0.9,0.4,1) forwards;
            padding-bottom: ${sizeBase * 1.4}px;
        `;

        const titulo = document.createElement('p');
        titulo.style.cssText = `
            margin:0 0 clamp(4px,1.2vh,10px);
            font-family:${data.f},sans-serif;
            font-size:clamp(0.85rem,3vw,1.6rem);
            color:${data.c};
            text-shadow:0 0 18px ${data.c}, 0 0 36px ${data.c}88;
            letter-spacing:0.05em;
            line-height:1.25;
            filter:brightness(1.15);
        `;
        titulo.textContent = data.t;

        const sub = document.createElement('p');
        sub.style.cssText = `
            margin:0;
            font-family:'Montserrat','Arial',sans-serif;
            font-size:clamp(0.55rem,1.8vw,0.9rem);
            color:rgba(255,255,255,0.82);
            letter-spacing:0.08em;
            text-transform:uppercase;
            text-shadow:0 0 8px rgba(255,255,255,0.4);
            line-height:1.4;
        `;
        sub.textContent = data.s;

        panel.appendChild(titulo);
        panel.appendChild(sub);
        contFr.appendChild(panel);

        // Corazón base — en modo frase: escala más intensa + glow morado
        const baseEl = document.getElementById('gc-base-el');
        if (baseEl) {
            baseEl.style.animation = 'gc-latido-frase 1.4s ease-in-out infinite, gc-respira-base 1.4s ease-in-out infinite';
        }

        // Toque en cualquier parte → regresa a corazones
        setTimeout(() => {
            contFr.style.cursor = 'pointer';
            const volver = (e) => {
                e.stopPropagation();
                contFr.style.cursor = '';
                contFr.removeEventListener('click',      volver);
                contFr.removeEventListener('touchstart', volver);
                volverACorazones(contFr, W, H, sizeBase);
            };
            contFr.addEventListener('click',      volver, { passive: false });
            contFr.addEventListener('touchstart', volver, { passive: false });
        }, 400);

        // Reproducir audio de la frase — al terminar regresa automáticamente
        try {
            const aud = new Audio(data.mp3);
            aud.volume = 0.9;
            audioActual = aud;
            aud.addEventListener('ended', () => {
                // Esperar 0.8s y volver al menú de corazones automáticamente
                setTimeout(() => {
                    if (modoPantalla === 'frase') {
                        volverACorazones(contFr, W, H, sizeBase);
                    }
                }, 800);
            });
            aud.play().catch(() => {});
        } catch(e) {}
    }

    // --- VOLVER AL MENÚ DE CORAZONES ---
    function volverACorazones(contFr, W, H, sizeBase) {
        if (audioActual) { audioActual.pause(); audioActual.currentTime = 0; audioActual = null; }
        modoPantalla = 'corazones';

        // Eliminar panel de frase
        const panel = document.getElementById('gc-frase-panel');
        if (panel) panel.remove();

        // Restaurar corazón base a latido normal con glow
        const baseEl = document.getElementById('gc-base-el');
        if (baseEl) {
            baseEl.style.animation = 'gc-latido-base 2s ease-in-out infinite, gc-respira-base 2s ease-in-out infinite';
        }

        // Mostrar corazones flotantes no explotados
        contFr.querySelectorAll('.gc-corazon-flotante').forEach(el => {
            if (!el._explotado) {
                el.style.transition  = 'opacity 0.3s ease';
                el.style.opacity     = '1';
                el.style.pointerEvents = 'auto';
            }
        });

        // Reanudar física
        iniciarFisica(contFr, W, H, sizeBase);
    }

    // --- FÍSICA DE REBOTES + GRAVEDAD ---
    let _objs = [];

    function iniciarFisica(contFr, W, H, sizeBase) {
        if (rafFisica) cancelAnimationFrame(rafFisica);

        function update() {
            if (!activo || modoPantalla !== 'corazones') return;

            const CX = W / 2, CY = H / 2;
            const minDistBase = sizeBase * 0.55;

            for (let i = 0; i < _objs.length; i++) {
                const o = _objs[i];
                if (o.explotado) continue;

                // Gravedad suave hacia el centro
                const dxG = CX - o.x, dyG = CY - o.y;
                const dG  = Math.sqrt(dxG*dxG + dyG*dyG) || 1;
                o.vx += (dxG / dG) * CFG.gravedad;
                o.vy += (dyG / dG) * CFG.gravedad;

                // Límite de velocidad
                const sp = Math.sqrt(o.vx*o.vx + o.vy*o.vy);
                if (sp > CFG.velocidadMax) { o.vx = (o.vx/sp)*CFG.velocidadMax; o.vy = (o.vy/sp)*CFG.velocidadMax; }
                if (sp < CFG.velocidadMin) { const a=Math.atan2(o.vy,o.vx); o.vx=Math.cos(a)*CFG.velocidadMin; o.vy=Math.sin(a)*CFG.velocidadMin; }

                o.x += o.vx; o.y += o.vy;

                // Rebote bordes
                if (o.x - o.r < 0)    { o.x = o.r;     o.vx = Math.abs(o.vx);  sonarColision(); }
                if (o.x + o.r > W)    { o.x = W - o.r; o.vx = -Math.abs(o.vx); sonarColision(); }
                if (o.y - o.r < 0)    { o.y = o.r;     o.vy = Math.abs(o.vy);  sonarColision(); }
                if (o.y + o.r > H)    { o.y = H - o.r; o.vy = -Math.abs(o.vy); sonarColision(); }

                // Rebote contra corazón base central
                const dx0 = o.x - CX, dy0 = o.y - CY;
                const d0  = Math.sqrt(dx0*dx0 + dy0*dy0) || 1;
                if (d0 < minDistBase + o.r) {
                    const nx = dx0/d0, ny = dy0/d0;
                    o.x = CX + nx * (minDistBase + o.r + 1);
                    const dot = o.vx*nx + o.vy*ny;
                    o.vx -= 2*dot*nx; o.vy -= 2*dot*ny;
                    sonarColision();
                }

                // Rebote entre corazones
                for (let j = i+1; j < _objs.length; j++) {
                    const o2 = _objs[j];
                    if (o2.explotado) continue;
                    const dx = o2.x - o.x, dy = o2.y - o.y;
                    const d  = Math.sqrt(dx*dx + dy*dy) || 1;
                    const md = o.r + o2.r;
                    if (d < md) {
                        const nx = dx/d, ny = dy/d;
                        const sep = (md - d) / 2;
                        o.x  -= nx*sep; o.y  -= ny*sep;
                        o2.x += nx*sep; o2.y += ny*sep;
                        const kx = o.vx - o2.vx, ky = o.vy - o2.vy;
                        const p  = nx*kx + ny*ky;
                        if (p > 0) {
                            o.vx  -= p*nx; o.vy  -= p*ny;
                            o2.vx += p*nx; o2.vy += p*ny;
                            sonarColision();
                        }
                    }
                }

                o.el.style.left = o.x + 'px';
                o.el.style.top  = o.y + 'px';
            }

            rafFisica = requestAnimationFrame(update);
        }

        rafFisica = requestAnimationFrame(update);
    }

    // --- ACTIVAR ---
    function activarGalaxia() {
        if (activo) return;
        activo       = true;
        modoPantalla = 'corazones';
        _objs        = [];
        pausarAmbiente();
        inyectarEstilos();

        // ── CAPAS DEL MURAL: mostrar solo las 3 capas de fondo, oscurecer el resto ──
        // Assets visibles: mural-fondo-base.webp, f2026-profesionistas.png, p1971-jugadoras.png
        const LAYERS_VISIBLES = ['mural-fondo-base', 'f2026-profesionistas', 'p1971-jugadoras'];
        document.querySelectorAll('.layer').forEach(l => {
            l.dataset.filtroAnterior   = l.style.filter   || '';
            l.dataset.opacidadAnterior = l.style.opacity  || '';
            l.style.transition         = 'filter 0.6s ease, opacity 0.6s ease';
            // Verificar si el src coincide con alguno de los assets visibles
            const src = (l.src || l.currentSrc || '');
            const esVisible = LAYERS_VISIBLES.some(n => src.includes(n));
            if (esVisible) {
                l.style.filter  = 'brightness(0.55)';
                l.style.opacity = '1';
            } else {
                l.style.filter  = 'blur(3px) brightness(0.08)';
                l.style.opacity = '0.6';
            }
        });
        document.querySelectorAll('.zona').forEach(z => z.style.pointerEvents = 'none');

        const overlay = document.getElementById('galaxia-overlay');
        const contFr  = document.getElementById('frases-container');
        const btnX    = document.getElementById('cerrar-galaxia');

        // Iniciar fondo degradado animado dentro del overlay
        const stopFondo = iniciarFondo(overlay);
        overlay._stopFondo = stopFondo;

        overlay.style.display = 'block';
        overlay.style.background = 'transparent'; // el canvas lo pinta
        setTimeout(() => overlay.style.opacity = '1', 10);

        btnX.style.display = 'flex';
        btnX.onclick        = cerrarGalaxia;

        const cont = document.getElementById('mural-container');
        const W    = cont.offsetWidth;
        const H    = cont.offsetHeight;
        const SIZE = Math.round(W * CFG.tamañoPct);
        const SBASE= Math.round(W * CFG.tamañoBasePct);

        contFr.innerHTML        = '';
        contFr.style.pointerEvents = 'auto';

        // ── CORAZÓN BASE CENTRAL ──────────────────────────────
        const baseEl = document.createElement('div');
        baseEl.id = 'gc-base-el';
        // Corazón-base: siempre con efecto respiración (glow morado pulsante)
        baseEl.style.cssText = `
            position:absolute;
            left:${W/2}px; top:${H/2}px;
            width:${SBASE}px; height:${SBASE}px;
            transform:translate(-50%,-50%);
            z-index:122;
            pointer-events:none;
            animation: gc-latido-base 2s ease-in-out infinite, gc-respira-base 2s ease-in-out infinite;
        `;
        const imgBase = document.createElement('img');
        imgBase.src = 'assets/corazon-base.png';
        imgBase.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
        imgBase.onerror = function() {
            this.style.display = 'none';
            baseEl.style.fontSize = SBASE * 0.85 + 'px';
            baseEl.style.lineHeight = '1';
            baseEl.style.textAlign = 'center';
            baseEl.textContent = '💜';
        };
        baseEl.appendChild(imgBase);
        contFr.appendChild(baseEl);

        // ── CORAZONES FLOTANTES (canvas degradado) ────────────
        let hueOffset = 0;
        FRASES.forEach((data) => {
            hueOffset += 24;
            const wrap = crearCanvasCorazon(SIZE, hueOffset);
            contFr.appendChild(wrap);

            // Posición inicial: esparcidos alrededor del centro
            const ang = Math.random() * Math.PI * 2;
            const rad = (Math.min(W, H) * 0.15) + Math.random() * (Math.min(W, H) * 0.28);
            const px  = Math.max(SIZE, Math.min(W - SIZE, W/2 + Math.cos(ang) * rad));
            const py  = Math.max(SIZE, Math.min(H - SIZE, H/2 + Math.sin(ang) * rad));
            wrap.style.left = px + 'px';
            wrap.style.top  = py + 'px';

            const vAng = Math.random() * Math.PI * 2;
            const vel  = CFG.velocidadMin + Math.random() * (CFG.velocidadMax - CFG.velocidadMin);

            const o = {
                el: wrap, data: data,
                x: px, y: py,
                vx: Math.cos(vAng) * vel,
                vy: Math.sin(vAng) * vel,
                r: SIZE / 2,
                explotado: false,
            };
            wrap._explotado = false;

            const disparar = (e) => {
                e.stopPropagation();
                if (o.explotado || modoPantalla !== 'corazones') return;
                o.explotado      = true;
                wrap._explotado  = true;

                sonarBurbuja();
                explosionParticulas(o.x, o.y, contFr);

                wrap.style.transition    = 'opacity 0.15s ease';
                wrap.style.opacity       = '0';
                wrap.style.pointerEvents = 'none';
                if (wrap._stopCanvas) wrap._stopCanvas();

                setTimeout(() => {
                    mostrarFrase(data, contFr, W, H, SBASE);
                }, 220);
            };

            wrap.addEventListener('click',      disparar, { passive: false });
            wrap.addEventListener('touchstart', disparar, { passive: false });

            _objs.push(o);
        });

        // Iniciar física
        iniciarFisica(contFr, W, H, SBASE);
    }

    // --- CERRAR ---
    function cerrarGalaxia() {
        if (!activo) return;
        activo = false;
        if (rafFisica) { cancelAnimationFrame(rafFisica); rafFisica = null; }
        if (audioActual) { audioActual.pause(); audioActual = null; }

        const overlay = document.getElementById('galaxia-overlay');
        const contFr  = document.getElementById('frases-container');
        const btnX    = document.getElementById('cerrar-galaxia');

        // Detener fondo animado
        if (overlay._stopFondo) { overlay._stopFondo(); delete overlay._stopFondo; }

        // Detener canvas de corazones flotantes
        contFr.querySelectorAll('.gc-corazon-flotante').forEach(el => {
            if (el._stopCanvas) el._stopCanvas();
        });

        // Restaurar capas del mural
        document.querySelectorAll('.layer').forEach(l => {
            l.style.filter  = l.dataset.filtroAnterior   || '';
            l.style.opacity = l.dataset.opacidadAnterior || '';
            delete l.dataset.filtroAnterior;
            delete l.dataset.opacidadAnterior;
        });

        contFr.style.cursor      = '';
        contFr.onclick           = null;
        contFr.ontouchstart      = null;
        overlay.style.opacity    = '0';

        setTimeout(() => {
            overlay.style.display      = 'none';
            overlay.style.background   = '';
            contFr.innerHTML           = '';
            contFr.style.pointerEvents = 'none';
            if (bgCanvas) { bgCanvas = null; }
        }, 600);

        btnX.style.display = 'none';
        document.querySelectorAll('.zona').forEach(z => z.style.pointerEvents = '');
        reanudarAmbiente();
    }

    // --- API PÚBLICA ---
    return { activar: activarGalaxia, cerrar: cerrarGalaxia };

})();

// ==========================================
// --- FILTRO DE ORIENTACIÓN (portrait → girar pantalla) ---
// ==========================================
(function() {
    // ── AJUSTES FÁCILES ──────────────────────────────────────────
    // Cambia estos valores para personalizar el letrero
    const ORI_BG_COLOR    = 'rgba(0,0,0,0.97)';   // fondo del letrero
    const ORI_ICON        = '📱';                   // icono principal
    const ORI_TITULO      = 'Gira tu pantalla';     // título
    const ORI_SUBTITULO   = 'Este mural está diseñado para verse en horizontal.\nGira tu dispositivo para continuar.';
    const ORI_COLOR_TITULO = '#ffffff';             // color del título
    const ORI_COLOR_SUB   = 'rgba(255,255,255,0.7)'; // color subtítulo
    const ORI_ANIM_COLOR  = '#00f2ff';              // color del ícono animado

    let bloqueador = null;
    let ambienteArrancoDesdeOri = false;

    // Inyectar estilos ori-* una sola vez
    if (!document.getElementById('ori-styles')) {
        const oriSt = document.createElement('style');
        oriSt.id = 'ori-styles';
        oriSt.textContent =
            '@keyframes oriBounce{0%,100%{transform:rotate(-15deg) scale(1);}50%{transform:rotate(15deg) scale(1.18);}}' +
            '@keyframes oriPulse{0%,100%{opacity:1;}50%{opacity:.55;}}' +
            '@keyframes oriTapPulse{0%,100%{transform:translateX(-50%) scale(1);opacity:1;}50%{transform:translateX(-50%) scale(1.08);opacity:.75;}}' +
            '.ori-icon{font-size:clamp(3.5rem,15vw,6rem);animation:oriBounce 1.4s ease-in-out infinite;display:inline-block;margin-bottom:12px;}' +
            '.ori-arrow{font-size:clamp(2rem,8vw,3.5rem);color:' + ORI_ANIM_COLOR + ';animation:oriPulse 1s ease-in-out infinite;display:block;margin-bottom:16px;}' +
            '.ori-titulo{font-family:sans-serif;font-size:clamp(1.4rem,6vw,2.2rem);font-weight:900;color:' + ORI_COLOR_TITULO + ';letter-spacing:2px;margin:0 0 10px;text-transform:uppercase;}' +
            '.ori-sub{font-family:sans-serif;font-size:clamp(.8rem,3.5vw,1.1rem);color:' + ORI_COLOR_SUB + ';white-space:pre-line;line-height:1.55;margin:0 0 20px;}' +
            '.ori-tap{position:absolute;bottom:clamp(24px,6vh,48px);left:50%;transform:translateX(-50%);' +
            'font-family:sans-serif;font-size:clamp(.75rem,3.2vw,1rem);color:' + ORI_ANIM_COLOR + ';' +
            'border:2px solid ' + ORI_ANIM_COLOR + ';border-radius:30px;padding:clamp(6px,1.5vh,12px) clamp(16px,5vw,32px);' +
            'white-space:nowrap;letter-spacing:1px;animation:oriTapPulse 1.2s ease-in-out infinite;' +
            'pointer-events:none;text-transform:uppercase;font-weight:700;}';
        document.head.appendChild(oriSt);
    }

    function crearBloqueador() {
        if (bloqueador) return;
        bloqueador = document.createElement('div');
        bloqueador.id = 'ori-bloqueador';
        bloqueador.style.cssText = [
            'position:fixed',
            'inset:0',
            'z-index:99999',
            'display:flex',
            'flex-direction:column',
            'align-items:center',
            'justify-content:center',
            'background:' + ORI_BG_COLOR,
            'text-align:center',
            'padding:24px',
            'box-sizing:border-box',
            'user-select:none',
            '-webkit-user-select:none',
        ].join(';');

        bloqueador.innerHTML = '' +
            '<div class="ori-icon">' + ORI_ICON + '</div>' +
            '<div class="ori-arrow">↻</div>' +
            '<p class="ori-titulo">' + ORI_TITULO + '</p>' +
            '<p class="ori-sub">' + ORI_SUBTITULO + '</p>' +
            '<div class="ori-tap">👆 Toca para girar</div>';

        bloqueador.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // Activar audio ambiente si aún no ha iniciado
            if (!ambienteArrancoDesdeOri) {
                ambienteArrancoDesdeOri = true;
                iniciarAmbiente();
            }
            // Intentar ocultar barra de navegación del navegador
            intentarPantallaCompleta();
        }, { passive: false });

        // También en click (desktop / algunos tablets)
        bloqueador.addEventListener('click', function(e) {
            e.preventDefault();
            if (!ambienteArrancoDesdeOri) {
                ambienteArrancoDesdeOri = true;
                iniciarAmbiente();
            }
            intentarPantallaCompleta();
        });

        document.body.appendChild(bloqueador);
    }

    function quitarBloqueador() {
        if (!bloqueador) return;
        bloqueador.remove();
        bloqueador = null;
    }

    function intentarPantallaCompleta() {
        window.scrollTo(0, 1);
        setTimeout(function() { window.scrollTo(0, 0); }, 50);

        var el = document.documentElement;
        var fn = el.requestFullscreen
              || el.webkitRequestFullscreen
              || el.mozRequestFullScreen
              || el.msRequestFullscreen;
        if (fn) {
            fn.call(el).catch(function() {
                // Silenciar error si el navegador rechaza
            });
        }

        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(function() {});
        }
    }

    function esMovil() {
        // Detectar si es dispositivo táctil o pantalla pequeña
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);
    }

    function esPortrait() {
        if (window.screen && typeof window.screen.orientation !== 'undefined') {
            return window.screen.orientation.type.startsWith('portrait');
        }
        return window.innerHeight > window.innerWidth;
    }

    function verificarOrientacion() {
        if (!esMovil()) { quitarBloqueador(); return; }
        if (esPortrait()) {
            crearBloqueador();
        } else {
            quitarBloqueador();
            // Al girar a landscape: también intentar ocultar barra
            intentarPantallaCompleta();
            if (ambienteArrancoDesdeOri) {
                reanudarAmbiente();
            }
        }
    }

    // Verificar al cargar
    window.addEventListener('load', verificarOrientacion);

    // Verificar al cambiar orientación
    if (screen.orientation) {
        screen.orientation.addEventListener('change', function() {
            setTimeout(verificarOrientacion, 350);
        });
    }
    window.addEventListener('orientationchange', function() {
        setTimeout(verificarOrientacion, 350);
    });
    window.addEventListener('resize', function() {
        if (esMovil()) setTimeout(verificarOrientacion, 200);
    });

})();

// ==========================================
// --- SOPORTE MÓVIL COMPLETO ---
// ==========================================
document.addEventListener('touchstart', e => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
}, { passive: false });
// Recalcular dimensiones del mural-container al rotar o redimensionar
// Esto asegura que los corazones y efectos usen el tamaño correcto
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Si el modo niña está activo, no interrumpir
        // Si los corazones están activos y hay física corriendo,
        // los tamaños W/H se leen dinámicamente dentro de fisicaLoop
        // así que solo necesitamos forzar re-render del layout
        const cont = document.getElementById('mural-container');
        if (cont) {
            // Touch: en portrait en móvil, ajustar altura
            const isPortrait = window.innerHeight > window.innerWidth;
            const isMobile   = window.innerWidth <= 1024;
            if (isMobile) {
                if (isPortrait) {
                    // En portrait: el mural es 16:9 pero la pantalla es vertical.
                    // Usamos el ancho real para calcular la altura proporcional,
                    // pero la acotamos a un máximo del 56% de la altura de pantalla
                    // para que los PNG aparezcan completos sin recortar.
                    const w = window.innerWidth;
                    const ratioH = w * 9 / 16;  // proporción real del mural (16:9)
                    const maxH   = window.innerHeight * 0.56;
                    cont.style.width  = '100vw';
                    cont.style.height = Math.min(ratioH, maxH) + 'px';
                } else {
                    cont.style.width  = '100vw';
                    const maxH   = window.innerHeight;
                    const ratioH = window.innerWidth * 9 / 16;
                    cont.style.height = Math.min(maxH, ratioH) + 'px';
                }
                cont.style.maxWidth    = '100vw';
                cont.style.aspectRatio = 'unset';
            } else {
                // Escritorio: volver a los valores por defecto
                cont.style.width       = '';
                cont.style.height      = '';
                cont.style.maxWidth    = '';
                cont.style.aspectRatio = '';
            }
        }
    }, 150);
});

// Disparar al cargar para que esté correcto desde el inicio
window.dispatchEvent(new Event('resize'));

screen.orientation?.addEventListener('change', () => {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
});
window.addEventListener('orientationchange', () => {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
});
