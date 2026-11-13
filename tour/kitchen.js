/* Nosso Arquitetura · passeio 3D da Cozinha Total White.
   Uso: startKitchen(elemento, { onClose }) → { pause(), resume() } */
window.startKitchen = function (host, opts) {
opts = opts || {};
const TOUCH = matchMedia("(pointer: coarse)").matches;
const SMALL = Math.min(innerWidth, innerHeight) < 600;

/* ---------- Interface ---------- */
if (!document.getElementById("k-style")) {
  const st = document.createElement("style"); st.id = "k-style";
  st.textContent = `
.k-root { position: absolute; inset: 0; overflow: hidden; background: #121010; color: #F3EEE8; font-family: "Inter", system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.4; -webkit-font-smoothing: antialiased; user-select: none; -webkit-user-select: none; }
.k-root * { box-sizing: border-box; }
.k-root [hidden] { display: none !important; }
.k-root button, .k-root label { font: inherit; color: inherit; -webkit-tap-highlight-color: transparent; }
.k-root :focus-visible { outline: 2px solid #C99059; outline-offset: 2px; }
.k-root canvas { display: block; width: 100%; height: 100%; touch-action: none; cursor: grab; }
.k-root canvas:active { cursor: grabbing; }
.k-glass { background: rgba(22,18,16,.74); border: 1px solid rgba(255,255,255,.12); backdrop-filter: blur(16px) saturate(1.2); -webkit-backdrop-filter: blur(16px) saturate(1.2); border-radius: 14px; }
.k-top { position: absolute; z-index: 5; top: calc(env(safe-area-inset-top, 0px) + 12px); left: max(12px, env(safe-area-inset-left, 0px)); right: max(12px, env(safe-area-inset-right, 0px)); display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; pointer-events: none; }
.k-brand { pointer-events: auto; padding: 10px 14px; min-width: 0; }
.k-brand h2 { margin: 0; font-family: "Archivo", "Helvetica Neue", sans-serif; font-stretch: 112%; font-weight: 500; font-size: 16px; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.k-brand small { display: block; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 10.5px; color: #B3A89D; margin-top: 2px; white-space: nowrap; }
.k-actions { display: flex; gap: 8px; pointer-events: auto; flex-shrink: 0; }
.k-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 42px; padding: 0 14px; border-radius: 100px; cursor: pointer; white-space: nowrap; font-size: 13.5px; font-weight: 500; background: rgba(22,18,16,.74); border: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.k-btn[aria-pressed="true"] { background: #F3EEE8; color: #1a1512; border-color: #F3EEE8; }
.k-btn.k-icon { width: 42px; padding: 0; font-size: 20px; }
.k-btn svg { width: 17px; height: 17px; }
.k-dock { position: absolute; z-index: 5; left: max(12px, env(safe-area-inset-left, 0px)); bottom: calc(env(safe-area-inset-bottom, 0px) + 12px); width: 340px; max-height: calc(100% - 110px); overflow-y: auto; padding: 14px; display: grid; gap: 14px; overscroll-behavior: contain; }
.k-dock h3 { margin: 0 0 8px; font-family: "JetBrains Mono", ui-monospace, monospace; font-weight: 500; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: #B3A89D; }
.k-row { display: flex; flex-wrap: wrap; gap: 6px; }
.k-chip { min-height: 36px; padding: 0 13px; border-radius: 100px; font-size: 13px; cursor: pointer; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.13); white-space: nowrap; }
.k-chip[aria-pressed="true"] { background: #F3EEE8; color: #1a1512; border-color: #F3EEE8; }
.k-sw { display: inline-flex; align-items: center; gap: 8px; min-height: 36px; padding: 0 12px 0 5px; border-radius: 100px; font-size: 13px; cursor: pointer; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.13); white-space: nowrap; }
.k-sw i { width: 24px; height: 24px; border-radius: 50%; display: block; border: 1px solid rgba(255,255,255,.35); flex: none; }
.k-sw[aria-pressed="true"] { border-color: #F3EEE8; box-shadow: inset 0 0 0 1px #F3EEE8; }
.k-spec { margin: 0; padding: 0; list-style: none; display: grid; gap: 5px; font-size: 12.5px; }
.k-spec li { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px dashed rgba(255,255,255,.12); padding-bottom: 5px; }
.k-spec li span:first-child { color: #B3A89D; }
.k-spec li span:last-child { text-align: right; }
.k-tabs { display: none; }
.k-hint { position: absolute; z-index: 4; left: 50%; transform: translateX(-50%); bottom: calc(env(safe-area-inset-bottom, 0px) + 16px); padding: 9px 14px; font-size: 12.5px; transition: opacity .8s; pointer-events: none; white-space: nowrap; }
.k-hint kbd { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11px; padding: 1px 5px; border: 1px solid rgba(255,255,255,.2); border-radius: 4px; }
.k-joy { position: absolute; z-index: 6; width: 112px; height: 112px; border-radius: 50%; left: max(22px, env(safe-area-inset-left, 0px)); bottom: calc(env(safe-area-inset-bottom, 0px) + 96px); background: rgba(22,18,16,.38); border: 1px solid rgba(255,255,255,.28); touch-action: none; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.k-joy b { position: absolute; left: 50%; top: 50%; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; background: rgba(243,238,232,.9); box-shadow: 0 4px 14px rgba(0,0,0,.3); }
.k-joy span { position: absolute; top: -22px; left: 0; right: 0; text-align: center; font-size: 11px; color: rgba(243,238,232,.85); text-shadow: 0 1px 3px rgba(0,0,0,.6); }
.k-loading { position: absolute; inset: 0; z-index: 8; display: grid; place-items: center; background: #121010; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 13px; color: #B3A89D; }
.k-toast { position: absolute; z-index: 9; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 14px 18px; font-size: 14px; max-width: min(420px, calc(100% - 32px)); text-align: center; }
/* Celular: painel vira folha inferior com abas */
.k-root.k-mobile .k-dock { left: max(8px, env(safe-area-inset-left, 0px)); right: max(8px, env(safe-area-inset-right, 0px)); width: auto; bottom: calc(env(safe-area-inset-bottom, 0px) + 8px); padding: 8px; gap: 8px; max-height: 50%; border-radius: 18px; }
.k-root.k-mobile .k-tabs { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
.k-root.k-mobile .k-tabs::-webkit-scrollbar { display: none; }
.k-root.k-mobile .k-tabs .k-chip { flex: 1 0 auto; min-height: 40px; }
.k-root.k-mobile .k-dock section { display: none; padding: 4px 4px 2px; }
.k-root.k-mobile .k-dock section.k-on { display: block; }
.k-root.k-mobile .k-dock h3 { display: none; }
.k-root.k-mobile .k-row { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; }
.k-root.k-mobile .k-row::-webkit-scrollbar { display: none; }
.k-root.k-mobile .k-chip, .k-root.k-mobile .k-sw { min-height: 42px; flex: none; }
.k-root.k-mobile .k-hint { display: none; }
.k-root.k-mobile .k-brand small { display: none; }
.k-root.k-mobile .k-btn .k-lbl { display: none; }
.k-root.k-mobile .k-btn { padding: 0 12px; }
@media (orientation: landscape) and (max-height: 520px) {
  .k-root.k-mobile .k-dock { left: auto; width: min(360px, 46%); max-height: calc(100% - 76px); }
  .k-root.k-mobile .k-joy { bottom: calc(env(safe-area-inset-bottom, 0px) + 22px); }
}
`;
  document.head.appendChild(st);
}

const ICON_SUN = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8Z" stroke="currentColor" stroke-width="1.5"/></svg>';
const ICON_OPEN = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3v10M6 9l4 4 4-4M4 16h12" stroke="currentColor" stroke-width="1.5"/></svg>';
host.innerHTML = `
<div class="k-root${TOUCH || innerWidth < 760 ? " k-mobile" : ""}">
  <div class="k-loading" data-k="loading">Montando a cozinha…</div>
  <div class="k-top">
    <div class="k-brand k-glass"><h2 data-k="name">Cozinha Total White</h2><small data-k="sub">Aracaju, SE · passeio em 3D</small></div>
    <div class="k-actions">
      <button class="k-btn" data-k="night" type="button" aria-pressed="false" aria-label="Modo noite">${ICON_SUN}<span class="k-lbl">Noite</span></button>
      <label class="k-btn" title="Abrir um projeto em .glb">${ICON_OPEN}<span class="k-lbl">Abrir .glb</span><input type="file" data-k="file" accept=".glb" hidden></label>
      <button class="k-btn" data-k="back" type="button" hidden>Voltar à cozinha</button>
      ${opts.onClose ? '<button class="k-btn k-icon" data-k="close" type="button" aria-label="Fechar passeio">×</button>' : ""}
    </div>
  </div>
  <div class="k-dock k-glass" data-k="dock">
    <div class="k-tabs" role="tablist">
      <button class="k-chip" type="button" data-tab="views" aria-pressed="true">Ir para</button>
      <button class="k-chip" type="button" data-tab="cab" aria-pressed="false">Marcenaria</button>
      <button class="k-chip" type="button" data-tab="top" aria-pressed="false">Bancada</button>
      <button class="k-chip" type="button" data-tab="floor" aria-pressed="false">Piso</button>
      <button class="k-chip" type="button" data-tab="spec" aria-pressed="false">Ficha</button>
    </div>
    <section data-sec="views" class="k-on"><h3>Ir para</h3><div class="k-row" data-k="views"></div></section>
    <section data-sec="cab"><h3>Marcenaria</h3><div class="k-row" data-k="sw-cab"></div></section>
    <section data-sec="top"><h3>Bancadas</h3><div class="k-row" data-k="sw-top"></div></section>
    <section data-sec="floor"><h3>Piso</h3><div class="k-row" data-k="sw-floor"></div></section>
    <section data-sec="spec"><h3>Especificação</h3><ul class="k-spec" data-k="spec"></ul></section>
  </div>
  <div class="k-hint k-glass" data-k="hint">Arraste para olhar · <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> ou setas para andar</div>
  <div class="k-joy" data-k="joy" aria-label="Controle para andar" ${TOUCH ? "" : "hidden"}><span>andar</span><b data-k="knob"></b></div>
</div>`;
const $ = (k) => host.querySelector(`[data-k="${k}"]`);
const app = host.querySelector(".k-root");
const loadingEl = $("loading");
if (!window.THREE) { loadingEl.textContent = "Não foi possível carregar o 3D neste navegador."; return { pause() {}, resume() {} }; }

/* ---------- Renderizador ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio, SMALL ? 1.6 : 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.prepend(renderer.domElement);
THREE.RectAreaLightUniformsLib.init();
const MAX_ANISO = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
const root = new THREE.Group(); scene.add(root);
const pmrem = new THREE.PMREMGenerator(renderer);
const studioEnv = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
scene.environment = studioEnv;
scene.background = new THREE.Color("#dfe6ec");

const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 200);
camera.rotation.order = "YXZ";

/* ---------- Texturas procedurais ---------- */
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function tex(w, h, draw, color = true) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = MAX_ANISO;
  if (color) t.encoding = THREE.sRGBEncoding;
  return t;
}
function rep(t, x, y) { const c = t.clone(); c.needsUpdate = true; c.repeat.set(x, y); return c; }

function veins(g, x, y, w, h, r, opt) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  // nuvens suaves
  for (let i = 0; i < opt.clouds; i++) {
    const cx = x + r() * w, cy = y + r() * h, rad = (0.15 + r() * 0.5) * w;
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
    gr.addColorStop(0, opt.cloud); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(x, y, w, h);
  }
  // veios
  for (let k = 0; k < opt.n; k++) {
    let px = x + r() * w, py = y + r() * h, a = opt.angle + (r() - .5) * 1.2;
    const steps = 60 + r() * 140, lw = opt.minW + r() * opt.maxW;
    g.filter = `blur(${opt.blur}px)`;
    g.strokeStyle = opt.vein(r()); g.lineWidth = lw; g.lineCap = "round";
    g.beginPath(); g.moveTo(px, py);
    for (let s = 0; s < steps; s++) {
      a += (r() - .5) * .5; px += Math.cos(a) * w * .012; py += Math.sin(a) * w * .012;
      g.lineTo(px, py);
      if (r() < .03) { // ramificação
        g.stroke(); g.lineWidth = Math.max(.6, g.lineWidth * .6); g.beginPath(); g.moveTo(px, py); a += (r() - .5) * 1.5;
      }
    }
    g.stroke();
  }
  g.filter = "none"; g.restore();
}

// Mármore branco em placas 90x90 cm. Uma textura = 2x2 placas (1,8 m).
function marbleFloor(seed, base, veinFn, grout) {
  const S = 2048, T = S / 2;
  return tex(S, S, (g) => {
    const r = rng(seed);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      g.fillStyle = base; g.fillRect(i * T, j * T, T, T);
      veins(g, i * T, j * T, T, T, r, { clouds: 10, cloud: "rgba(150,150,158,.10)", n: 9, angle: r() * Math.PI, minW: .6, maxW: 4, blur: 1.2, vein: veinFn });
    }
    g.strokeStyle = grout; g.lineWidth = 3;
    for (let k = 0; k <= 2; k++) { g.beginPath(); g.moveTo(k * T, 0); g.lineTo(k * T, S); g.stroke(); g.beginPath(); g.moveTo(0, k * T); g.lineTo(S, k * T); g.stroke(); }
  });
}
const groutBump = tex(512, 512, (g, w) => {
  g.fillStyle = "#fff"; g.fillRect(0, 0, w, w); g.strokeStyle = "#000"; g.lineWidth = 2;
  [0, w / 2, w].forEach(p => { g.beginPath(); g.moveTo(p, 0); g.lineTo(p, w); g.stroke(); g.beginPath(); g.moveTo(0, p); g.lineTo(w, p); g.stroke(); });
}, false);

const TX = {};
TX.marbleWhite = marbleFloor(7, "#f3f3f1", v => `rgba(${95 + v * 40},${95 + v * 40},${105 + v * 40},${.35 + v * .5})`, "#cfcfcf");
TX.porcelain = tex(1024, 1024, (g, w) => {
  const r = rng(3); g.fillStyle = "#a9a7a3"; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${r() < .5 ? "255,255,255" : "40,40,40"},${r() * .06})`; g.fillRect(r() * w, r() * w, 2 + r() * 6, 2 + r() * 6); }
  veins(g, 0, 0, w, w, r, { clouds: 18, cloud: "rgba(80,80,80,.12)", n: 0, angle: 0, minW: 0, maxW: 0, blur: 0, vein: () => "" });
  g.strokeStyle = "#8d8b88"; g.lineWidth = 3;
  [0, w / 2, w].forEach(p => { g.beginPath(); g.moveTo(p, 0); g.lineTo(p, w); g.stroke(); g.beginPath(); g.moveTo(0, p); g.lineTo(w, p); g.stroke(); });
});
function woodTex(seed, base, dark, planks) {
  return tex(1024, 1024, (g, w) => {
    const r = rng(seed); const n = planks || 1, pw = w / n;
    for (let p = 0; p < n; p++) {
      g.fillStyle = base; g.fillRect(p * pw, 0, pw, w);
      const off = r() * 1000;
      for (let i = 0; i < 70; i++) {
        const x = p * pw + r() * pw; g.strokeStyle = dark.replace("A", (.05 + r() * .18).toFixed(2)); g.lineWidth = .6 + r() * 2.5;
        g.beginPath(); g.moveTo(x, 0);
        for (let y = 0; y <= w; y += 16) g.lineTo(x + Math.sin((y + off) / (90 + r() * 10)) * 6, y);
        g.stroke();
      }
      if (n > 1) { g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(p * pw, 0, 2, w); }
    }
  });
}
TX.freijo = woodTex(11, "#a87547", "rgba(70,40,18,A)");
TX.woodFloor = woodTex(5, "#b8875a", "rgba(80,48,22,A)", 6);
TX.quartz = tex(1024, 1024, (g, w) => {
  const r = rng(21); g.fillStyle = "#f6f6f4"; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 14000; i++) { g.fillStyle = `rgba(150,150,155,${r() * .18})`; g.fillRect(r() * w, r() * w, 1 + r() * 2, 1 + r() * 2); }
  veins(g, 0, 0, w, w, r, { clouds: 6, cloud: "rgba(170,170,178,.07)", n: 3, angle: .3, minW: .4, maxW: 1.2, blur: 1.5, vein: () => "rgba(150,150,160,.25)" });
});
TX.calacatta = tex(1024, 1024, (g, w) => {
  const r = rng(33); g.fillStyle = "#f5f3ef"; g.fillRect(0, 0, w, w);
  veins(g, 0, 0, w, w, r, { clouds: 12, cloud: "rgba(160,150,135,.12)", n: 7, angle: .5, minW: 1, maxW: 7, blur: 1.6, vein: v => `rgba(${110 + v * 30},${100 + v * 25},${90 + v * 20},${.4 + v * .4})` });
});
TX.saoGabriel = tex(1024, 1024, (g, w) => {
  const r = rng(44); g.fillStyle = "#151515"; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 26000; i++) { const v = 40 + r() * 70; g.fillStyle = `rgba(${v},${v},${v + 5},${r() * .5})`; g.fillRect(r() * w, r() * w, 1 + r() * 3, 1 + r() * 3); }
});
// Azulejo metrô 15x7,5 cm. Uma textura = 1,2 x 1,2 m.
function subway(color) {
  return tex(1024, 1024, (g, w) => {
    const r = rng(9), tw = 128, th = 64;
    g.fillStyle = color ? "#d6d6d4" : "#000"; g.fillRect(0, 0, w, w);
    for (let row = 0; row < 16; row++) for (let col = -1; col < 9; col++) {
      const x = col * tw + (row % 2 ? tw / 2 : 0) + 2, y = row * th + 2, ww = tw - 4, hh = th - 4;
      if (color) {
        const v = 248 - r() * 6;
        const gr = g.createLinearGradient(x, y, x, y + hh);
        gr.addColorStop(0, `rgb(${v},${v},${v})`); gr.addColorStop(.5, `rgb(${v - 4},${v - 4},${v - 3})`); gr.addColorStop(1, `rgb(${v - 12},${v - 12},${v - 11})`);
        g.fillStyle = gr;
      } else {
        const gr = g.createLinearGradient(x, y, x, y + hh);
        gr.addColorStop(0, "#999"); gr.addColorStop(.12, "#fff"); gr.addColorStop(.88, "#fff"); gr.addColorStop(1, "#999");
        g.fillStyle = gr;
      }
      g.beginPath(); g.roundRect ? g.roundRect(x, y, ww, hh, 6) : g.rect(x, y, ww, hh); g.fill();
    }
  }, !!color);
}
TX.subway = subway(true); TX.subwayBump = subway(false);
TX.brick = tex(512, 512, (g, w) => {
  const r = rng(2); g.fillStyle = "#d8c4b2"; g.fillRect(0, 0, w, w);
  for (let row = 0; row < 16; row++) for (let col = -1; col < 5; col++) {
    const v = r(); g.fillStyle = `rgb(${178 + v * 40},${110 + v * 30},${82 + v * 20})`;
    g.fillRect(col * 128 + (row % 2 ? 64 : 0) + 3, row * 32 + 3, 122, 26);
  }
});
TX.sea = tex(512, 512, (g, w) => {
  const sky = g.createLinearGradient(0, 0, 0, w * .56); sky.addColorStop(0, "#7d98b3"); sky.addColorStop(1, "#dfe5ea");
  g.fillStyle = sky; g.fillRect(0, 0, w, w * .56);
  const sea = g.createLinearGradient(0, w * .56, 0, w); sea.addColorStop(0, "#41566a"); sea.addColorStop(1, "#16222e");
  g.fillStyle = sea; g.fillRect(0, w * .56, w, w);
  const r = rng(4); for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(255,255,255,${r() * .35})`; g.fillRect(r() * w, w * .56 + r() * w * .44, 3 + r() * 14, 1); }
  for (let i = 0; i < 30; i++) { g.fillStyle = "rgba(255,255,255,.25)"; g.beginPath(); g.ellipse(r() * w, r() * w * .45, 40 + r() * 60, 8 + r() * 10, 0, 0, 7); g.fill(); }
});
TX.cooktop = tex(512, 512, (g, w) => {
  g.fillStyle = "#0b0b0c"; g.fillRect(0, 0, w, w);
  g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2;
  [[.3, .3, .17], [.72, .3, .13], [.3, .72, .13], [.72, .72, .17]].forEach(([x, y, rr]) => { g.beginPath(); g.arc(x * w, y * w, rr * w, 0, 7); g.stroke(); });
  g.fillStyle = "rgba(255,255,255,.4)"; for (let i = 0; i < 6; i++) g.fillRect(w * .32 + i * 34, w * .93, 18, 3);
}, true);
TX.shadow = tex(256, 256, (g, w) => {
  g.filter = "blur(26px)"; g.fillStyle = "rgba(0,0,0,1)"; g.fillRect(44, 44, w - 88, w - 88); g.filter = "none";
});
TX.round = tex(256, 256, (g, w) => {
  const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, "rgba(0,0,0,.9)"); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, w, w);
});

/* ---------- Materiais ---------- */
const M = {
  lacquer: new THREE.MeshPhysicalMaterial({ color: 0xf4f4f2, roughness: .32, clearcoat: .35, clearcoatRoughness: .3 }),
  carcass: new THREE.MeshStandardMaterial({ color: 0xf1f1ef, roughness: .6 }),
  top: new THREE.MeshPhysicalMaterial({ map: rep(TX.quartz, 1.2, 1.2), roughness: .14, clearcoat: .6, clearcoatRoughness: .08 }),
  floor: new THREE.MeshPhysicalMaterial({ map: rep(TX.marbleWhite, 4.6 / 1.8, 6.4 / 1.8), bumpMap: rep(groutBump, 4.6 / 1.8, 6.4 / 1.8), bumpScale: .002, roughness: .1, clearcoat: .8, clearcoatRoughness: .06 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xd9d7d3, roughness: .92 }),
  ceiling: new THREE.MeshStandardMaterial({ color: 0xf6f6f6, roughness: .95 }),
  tile: new THREE.MeshPhysicalMaterial({ map: rep(TX.subway, 2.1 / 1.2, .7 / 1.2), bumpMap: rep(TX.subwayBump, 2.1 / 1.2, .7 / 1.2), bumpScale: .004, roughness: .08, clearcoat: 1, clearcoatRoughness: .05 }),
  steel: new THREE.MeshStandardMaterial({ color: 0xe4e6e8, metalness: 1, roughness: .26 }),
  steelDark: new THREE.MeshStandardMaterial({ color: 0x8d9093, metalness: 1, roughness: .35 }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: .06 }),
  blackGlass: new THREE.MeshPhysicalMaterial({ color: 0x0a0a0b, roughness: .05, clearcoat: 1, clearcoatRoughness: .02 }),
  blackLac: new THREE.MeshPhysicalMaterial({ color: 0x1b1b1c, roughness: .25, clearcoat: .8 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0xdfe8ea, roughness: .02, transparent: true, opacity: .22, metalness: .1, clearcoat: 1, envMapIntensity: 1.5 }),
  glassware: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .05, transparent: true, opacity: .28, clearcoat: 1 }),
  roseGold: new THREE.MeshStandardMaterial({ color: 0xd2a98f, metalness: 1, roughness: .3 }),
  wood: new THREE.MeshStandardMaterial({ map: rep(TX.freijo, .5, .5), roughness: .5, color: 0xd28a52 }),
  fabric: new THREE.MeshStandardMaterial({ color: 0xf0ede8, roughness: .95 }),
  apple: new THREE.MeshPhysicalMaterial({ color: 0x8fbf3a, roughness: .35, clearcoat: .6 }),
  ceramic: new THREE.MeshPhysicalMaterial({ color: 0xb4602c, roughness: .4, clearcoat: .5 }),
  white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .5 }),
  frame: new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: .4, metalness: .2 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: .7 }),
  kick: new THREE.MeshStandardMaterial({ color: 0xcfcfcf, roughness: .6 }),
  sea: new THREE.MeshStandardMaterial({ map: TX.sea, emissiveMap: TX.sea, emissive: 0xffffff, emissiveIntensity: .35, roughness: .2 }),
  cooktop: new THREE.MeshPhysicalMaterial({ map: TX.cooktop, roughness: .05, clearcoat: 1 }),
  led: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe6c4, emissiveIntensity: 0 }),
  downlight: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff3e0, emissiveIntensity: 6 }),
  brick: new THREE.MeshStandardMaterial({ map: rep(TX.brick, 3, 2.6), roughness: .95 }),
  outFloor: new THREE.MeshStandardMaterial({ map: rep(TX.porcelain, 2, 3), roughness: .6 }),
  shadow: new THREE.MeshBasicMaterial({ map: TX.shadow, transparent: true, opacity: .35, depthWrite: false }),
  shadowRound: new THREE.MeshBasicMaterial({ map: TX.round, transparent: true, opacity: .3, depthWrite: false }),
  green: new THREE.MeshStandardMaterial({ color: 0x4f7a3a, roughness: .9 }),
  book: new THREE.MeshStandardMaterial({ color: 0xc9b9a3, roughness: .9 }),
  paper: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .7 })
};

/* ---------- Geometria ---------- */
const world = new THREE.Group(); root.add(world);
function B(mat, x0, y0, z0, x1, y1, z1, parent = world, r = 0, cast = true) {
  const w = x1 - x0, h = y1 - y0, d = z1 - z0;
  const geo = r > 0 ? new THREE.RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)) : new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(geo, mat); m.position.set(x0 + w / 2, y0 + h / 2, z0 + d / 2);
  m.castShadow = cast; m.receiveShadow = true; parent.add(m); return m;
}
function plane(mat, w, h, x, y, z, ry = 0, rx = 0, parent = world) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.receiveShadow = true; parent.add(m); return m;
}
function cyl(mat, r0, r1, h, x, y, z, parent = world, seg = 32) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}
// Porta estilo shaker (requadro), voltada para +z ou para +x
function shaker(x0, y0, x1, y1, z, opts = {}) {
  const g = 0.003, f = 0.055, t = .018;
  const mat = opts.mat || M.lacquer;
  B(mat, x0 + g, y0 + g, z, x1 - g, y1 - g, z + t, world, .003);
  const fw = Math.min(f, (y1 - y0) / 5);
  B(mat, x0 + g, y0 + g, z + t, x1 - g, y0 + g + fw, z + t + .008);
  B(mat, x0 + g, y1 - g - fw, z + t, x1 - g, y1 - g, z + t + .008);
  B(mat, x0 + g, y0 + g + fw, z + t, x0 + g + fw, y1 - g - fw, z + t + .008);
  B(mat, x1 - g - fw, y0 + g + fw, z + t, x1 - g, y1 - g - fw, z + t + .008);
  if (opts.handle) {
    const cx = (x0 + x1) / 2, hy = opts.handle === "top" ? y1 - .05 : opts.handle === "bottom" ? y0 + .06 : (y0 + y1) / 2;
    if (opts.vertical) B(M.steel, opts.hx - .006, hy - .09, z + t + .02, opts.hx + .006, hy + .09, z + t + .032, world, .004);
    else B(M.steel, cx - .07, hy - .006, z + t + .02, cx + .07, hy + .006, z + t + .032, world, .004);
  }
}

const RW = 4.6, RD = 6.4, RH = 2.7; // largura, profundidade, pé-direito

// Piso, teto e paredes
const floor = plane(M.floor, RW, RD, RW / 2, 0, RD / 2, 0, -Math.PI / 2);
const ceiling = plane(M.ceiling, RW, RD, RW / 2, RH, RD / 2, 0, Math.PI / 2);
plane(M.wall, RD, RH, 0, RH / 2, RD / 2, Math.PI / 2);                 // esquerda
plane(M.wall, RW, RH, RW / 2, RH / 2, 0);                               // fundo
plane(M.wall, RW, RH, RW / 2, RH / 2, RD, Math.PI);                     // frente
// parede direita com vão da porta de correr (z 1.2–3.4, h 2.3)
plane(M.wall, 1.2, RH, RW, RH / 2, .6, -Math.PI / 2);
plane(M.wall, RD - 3.4, RH, RW, RH / 2, (3.4 + RD) / 2, -Math.PI / 2);
plane(M.wall, 2.2, RH - 2.3, RW, 2.3 + (RH - 2.3) / 2, 2.3, -Math.PI / 2);
// rodapé
B(M.white, 0, 0, .6, .012, .07, RD, world, 0, false);
B(M.white, 0, 0, RD - .012, RW, .07, RD, world, 0, false);
B(M.white, RW - .012, 0, 3.4, RW, .07, RD, world, 0, false);

// Geladeira inox (x .03–.93)
B(M.steel, .03, 0, .02, .93, 1.95, .72, world, .02);
B(M.dark, .479, .72, .715, .481, 1.95, .725, world, 0, false);
B(M.dark, .03, .705, .715, .93, .715, .725, world, 0, false);
B(M.steelDark, .43, .95, .74, .45, 1.75, .76, world, .008);
B(M.steelDark, .51, .95, .74, .53, 1.75, .76, world, .008);
B(M.steelDark, .25, .58, .74, .71, .6, .76, world, .008);
B(M.carcass, .02, 1.97, 0, .94, 2.48, .6);
shaker(.02, 1.97, .94, 2.48, .6, { handle: "bottom" });

// Bancada da pia (x .95–3.05)
B(M.carcass, .95, .1, 0, 3.05, .88, .58);
B(M.kick, .95, 0, 0, 3.05, .1, .52, world, 0, false);
[[.1, .33], [.335, .6], [.605, .88]].forEach(([a, b]) => { shaker(.95, a, 1.55, b, .58, { handle: "top" }); shaker(2.45, a, 3.05, b, .58, { handle: "top" }); });
shaker(1.55, .1, 2.0, .88, .58, { handle: "top", vertical: true, hx: 1.97 });
shaker(2.0, .1, 2.45, .88, .58, { handle: "top", vertical: true, hx: 2.03 });
const topMeshes = [];
topMeshes.push(B(M.top, .93, .88, 0, 3.07, .92, .62, world, .006));
// cuba e torneira gourmet
B(M.steelDark, 1.78, .9205, .12, 2.28, .9215, .5, world, 0, false);
B(M.dark, 2.0, .9216, .29, 2.04, .9218, .33, world, 0, false);
(function faucet() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.03, .92, .07), new THREE.Vector3(2.03, 1.2, .07), new THREE.Vector3(2.03, 1.36, .12),
    new THREE.Vector3(2.03, 1.34, .24), new THREE.Vector3(2.03, 1.22, .3), new THREE.Vector3(2.03, 1.12, .3)
  ]);
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, .013, 16), M.chrome); m.castShadow = true; world.add(m);
  cyl(M.chrome, .028, .028, .06, 2.03, .95, .07);
  B(M.chrome, 2.09, .97, .06, 2.15, .98, .08, world, .004);
})();
// azulejo metrô
const tileWall = plane(M.tile, 2.1, .7, 2.0, .92 + .35, .002);
// prateleira com mãos-francesas
B(M.lacquer, .95, 1.4, 0, 3.05, 1.43, .26, world, .004);
[1.15, 2.0, 2.85].forEach(x => { B(M.lacquer, x - .01, 1.26, 0, x + .01, 1.4, .2, world, .002); });
B(M.led, .97, 1.398, .2, 3.03, 1.4, .215, world, 0, false);
// objetos na prateleira
[[1.3, .1], [1.38, .13], [2.35, .1], [2.43, .14], [2.5, .12]].forEach(([x, h], i) => cyl(i % 2 ? M.glassware : M.ceramic, .028, .03, h * 1.3, x, 1.43 + h * .65, .12, world, 20));
B(M.white, 1.6, 1.43, .06, 1.9, 1.62, .2, world, .02);

// Armários superiores com vidro (x .95–3.05, y 1.62–2.38)
B(M.carcass, .95, 1.62, 0, 3.05, 2.38, .35);
B(M.carcass, .97, 1.63, .01, 3.03, 2.37, .02, world, 0, false); M.cabInside = true;
B(M.glass, .97, 1.95, .02, 3.03, 1.965, .32, world, 0, false);
for (let i = 0; i < 4; i++) {
  const x0 = .95 + i * .525, x1 = x0 + .525, z = .35, f = .05, t = .02;
  B(M.lacquer, x0 + .003, 1.62, z, x1 - .003, 1.62 + f, z + t, world, .003);
  B(M.lacquer, x0 + .003, 2.38 - f, z, x1 - .003, 2.38, z + t, world, .003);
  B(M.lacquer, x0 + .003, 1.62, z, x0 + .003 + f, 2.38, z + t, world, .003);
  B(M.lacquer, x1 - .003 - f, 1.62, z, x1 - .003, 2.38, z + t, world, .003);
  B(M.lacquer, x0 + .003, 1.995, z + .005, x1 - .003, 2.005, z + t - .004);
  B(M.lacquer, (x0 + x1) / 2 - .005, 1.62, z + .005, (x0 + x1) / 2 + .005, 2.38, z + t - .004);
  plane(M.glass, .525 - 2 * f, .76 - 2 * f, (x0 + x1) / 2, 2.0, z + .01).castShadow = false;
  // taças e copos
  for (let k = 0; k < 4; k++) {
    cyl(M.glassware, .03, .025, .12, x0 + .1 + k * .1, 1.965 + .06, .18, world, 16).castShadow = false;
    cyl(M.glassware, .035, .035, .1, x0 + .1 + k * .1, 1.63 + .05, .16, world, 16).castShadow = false;
  }
}
B(M.lacquer, .93, 2.38, 0, 3.72, 2.43, .38, world, .004);
B(M.lacquer, .93, 2.43, 0, 3.72, 2.47, .4, world, .004);

// Torre quente (x 3.05–3.70): micro-ondas e forno
B(M.carcass, 3.05, .1, 0, 3.70, 2.38, .58);
B(M.kick, 3.05, 0, 0, 3.70, .1, .52, world, 0, false);
shaker(3.05, .1, 3.70, .72, .58, { handle: "top" });
shaker(3.05, 1.76, 3.70, 2.38, .58, { handle: "bottom" });
B(M.steel, 3.07, .72, .58, 3.68, 1.34, .6, world, .006);
B(M.blackGlass, 3.09, .76, .6, 3.66, 1.22, .605, world, .004);
B(M.steelDark, 3.12, 1.25, .6, 3.63, 1.27, .62, world, .006);
B(M.steel, 3.07, 1.36, .58, 3.68, 1.74, .6, world, .006);
B(M.blackGlass, 3.09, 1.38, .6, 3.5, 1.72, .605, world, .004);
B(M.blackGlass, 3.52, 1.38, .6, 3.66, 1.72, .605, world, .004);

// Painel preto com escotilha (x 3.70–4.58)
B(M.blackLac, 3.70, .1, 0, 4.58, .88, .58);
B(M.kick, 3.70, 0, 0, 4.58, .1, .52, world, 0, false);
topMeshes.push(B(M.top, 3.70, .88, 0, 4.6, .92, .62, world, .006));
B(M.blackGlass, 3.70, .92, 0, 4.6, 2.48, .03);
const port = new THREE.Mesh(new THREE.CircleGeometry(.37, 64), M.sea); port.position.set(4.15, 1.62, .034); world.add(port);
const ring = new THREE.Mesh(new THREE.TorusGeometry(.4, .035, 20, 80), M.steelDark); ring.position.set(4.15, 1.62, .04); ring.castShadow = true; world.add(ring);
B(M.white, 4.2, .92, .1, 4.42, 1.18, .3, world, .02);   // torradeira
// máquina de café na bancada
B(M.steel, .98, .92, .12, 1.3, 1.3, .5, world, .02);
B(M.steelDark, 1.03, 1.0, .5, 1.25, 1.05, .52, world, .01);

// Ilha (x 1.875–2.825, z 1.35–3.45)
const IX0 = 1.875, IX1 = 2.825, IZ0 = 1.35, IZ1 = 3.45;
const islandBody = B(M.lacquer, IX0, 0, IZ0, IX1, .88, IZ1 - .45, world, .01);
// nichos abertos na cabeceira
B(M.lacquer, IX0, 0, IZ1 - .45, IX0 + .025, .88, IZ1, world, .004);
B(M.lacquer, IX1 - .025, 0, IZ1 - .45, IX1, .88, IZ1, world, .004);
B(M.lacquer, IX0, 0, IZ1 - .45, IX1, .03, IZ1, world, .004);
B(M.lacquer, IX0, .44, IZ1 - .45, IX1, .465, IZ1 - .01, world, .004);
// lateral das banquetas fechada
topMeshes.push(B(M.top, IX0 - .02, .88, IZ0 - .02, IX1 + .3, .92, IZ1 + .02, world, .008));
const cook = plane(M.cooktop, .58, .52, (IX0 + IX1) / 2, .9212, 1.85, 0, -Math.PI / 2);
// decoração nos nichos
cyl(M.ceramic, .045, .055, .2, 2.1, .13, 3.2); cyl(M.ceramic, .03, .04, .15, 2.25, .105, 3.2);
B(M.book, 2.35, .03, 3.05, 2.7, .08, 3.35, world, .004); B(M.paper, 2.38, .08, 3.07, 2.66, .1, 3.33, world, .004);
cyl(M.ceramic, .04, .05, .16, 2.55, .545, 3.2);
// bandeja com maçãs
B(M.dark, 2.15, .92, 2.4, 2.55, .945, 2.62, world, .008);
[[2.21, 2.47], [2.3, 2.52], [2.39, 2.47], [2.48, 2.53], [2.26, 2.57], [2.42, 2.57], [2.34, 2.49]].forEach(([x, z], i) => {
  const a = new THREE.Mesh(new THREE.SphereGeometry(.042, 24, 18), M.apple); a.position.set(x, .99 + (i > 4 ? .03 : 0), z); a.castShadow = true; world.add(a);
});
// coifa cilíndrica de ilha
cyl(M.steel, .2, .2, 1.0, (IX0 + IX1) / 2, 2.2, 1.85, world, 64);
cyl(M.steelDark, .19, .19, .005, (IX0 + IX1) / 2, 1.698, 1.85, world, 64);

// Banquetas: assento estofado, encosto redondo em madeira, estrutura rosé
function stool(x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); world.add(g);
  const prof = [[0, 0], [.17, 0], [.2, .02], [.205, .05], [.19, .075], [.12, .09], [0, .092]].map(p => new THREE.Vector2(p[0], p[1]));
  const seat = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), M.fabric); seat.position.y = .6; seat.castShadow = true; g.add(seat);
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz]) => {
    const p0 = new THREE.Vector3(sx * .19, 0, sz * .19), p1 = new THREE.Vector3(sx * .12, .6, sz * .12);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, p0.distanceTo(p1), 10), M.roseGold);
    leg.position.copy(p0).lerp(p1, .5);
    leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize());
    leg.castShadow = true; g.add(leg);
  });
  const foot = new THREE.Mesh(new THREE.TorusGeometry(.165, .007, 8, 48), M.roseGold); foot.rotation.x = Math.PI / 2; foot.position.y = .24; g.add(foot);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, .32, 10), M.roseGold); rod.position.set(.15, .82, 0); rod.rotation.z = -.15; g.add(rod);
  const back = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .025, 48), M.wood); back.rotation.z = Math.PI / 2; back.position.set(.18, .93, 0); back.castShadow = true; g.add(back);
  const strap = new THREE.Mesh(new THREE.TorusGeometry(.05, .006, 8, 24, Math.PI), M.fabric); strap.position.set(.2, .98, 0); strap.rotation.y = Math.PI / 2; g.add(strap);
  plane(M.shadowRound, .6, .6, x, .002, z, 0, -Math.PI / 2).receiveShadow = false;
}
[1.95, 2.55, 3.15].forEach(z => stool(3.35, z));

// sombras de contato
plane(M.shadow, 1.4, 2.5, (IX0 + IX1) / 2, .0015, (IZ0 + IZ1) / 2, 0, -Math.PI / 2).receiveShadow = false;
plane(M.shadow, 4.8, 1.0, 2.3, .0015, .32, 0, -Math.PI / 2).receiveShadow = false;

// Spots embutidos
const spots = [], fixtures = [];
[[1.0, .9], [2.0, .9], [2.35, 2.9], [1.0, 3.0], [3.7, 1.0], [1.2, 5.0], [3.3, 5.0]].forEach(([x, z], i) => {
  const ring0 = cyl(M.dark, .045, .045, .01, x, RH - .005, z, world, 24); ring0.castShadow = false;
  const d = cyl(M.downlight, .035, .035, .012, x, RH - .007, z, world, 24); d.castShadow = false; fixtures.push(ring0, d);
  const s = new THREE.SpotLight(0xfff0dc, 0, 0, .8, .9, 2);
  s.position.set(x, RH - .03, z); s.target.position.set(x, 0, z);
  if (i < 3) { s.castShadow = true; s.shadow.mapSize.set(1024, 1024); s.shadow.bias = -.0004; s.shadow.radius = 4; }
  root.add(s, s.target); spots.push(s);
});

// Porta de correr e varanda
(function door() {
  const z0 = 1.2, z1 = 3.4, h = 2.3, x = RW;
  B(M.frame, x - .06, 0, z0, x + .06, .02, z1, world, 0, false);
  B(M.frame, x - .06, h - .04, z0, x + .06, h, z1);
  B(M.frame, x - .06, 0, z0, x + .06, h, z0 + .04); B(M.frame, x - .06, 0, z1 - .04, x + .06, h, z1);
  B(M.frame, x - .05, 0, 2.27, x + .05, h, 2.33);
  const g1 = plane(M.glass, 1.07, h - .06, x + .02, h / 2, 1.735, -Math.PI / 2); g1.castShadow = false;
  // varanda gourmet
  plane(M.outFloor, 3, 6.4, RW + 1.5, 0, 3.2, 0, -Math.PI / 2);
  plane(M.brick, 6.4, 2.7, RW + 3, 1.35, 3.2, -Math.PI / 2);
  plane(M.wall, 3, 2.7, RW + 1.5, 1.35, 0);
  B(M.lacquer, RW + 2.4, 0, .6, RW + 3, .9, 3.6, world, .01);
  B(M.top, RW + 2.38, .9, .58, RW + 3, .94, 3.62, world, .006);
  const pot = cyl(M.ceramic, .16, .12, .4, RW + .6, .2, 5.6);
  const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(.35, 1), M.green); leaf.position.set(RW + .6, .7, 5.6); leaf.castShadow = true; world.add(leaf);
  // planta interna
  cyl(M.ceramic, .17, .13, .45, .35, .225, 5.9);
  const l2 = new THREE.Mesh(new THREE.IcosahedronGeometry(.32, 1), M.green); l2.position.set(.35, .8, 5.9); l2.scale.y = 1.4; l2.castShadow = true; world.add(l2);
})();

/* ---------- Realismo: oclusão de cantos ---------- */
const aoGrad = (function () {
  const c = document.createElement("canvas"); c.width = 8; c.height = 256; const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, "#fff"); gr.addColorStop(.35, "#7a7a7a"); gr.addColorStop(1, "#000");
  g.fillStyle = gr; g.fillRect(0, 0, 8, 256);
  return new THREE.CanvasTexture(c);
})();
const aoMat = (o) => new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: o, alphaMap: aoGrad, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
const AO_SOFT = aoMat(.22), AO_MED = aoMat(.32), AO_HARD = aoMat(.45);
function ao(mat, c, w, h, normal, up) {
  const n = new THREE.Vector3(...normal), u = new THREE.Vector3(...up), x = new THREE.Vector3().crossVectors(u, n);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, u, n));
  m.position.set(...c); m.renderOrder = -1; world.add(m); return m;
}
// encontro piso/parede
ao(AO_MED, [.16, .002, 3.6], 5.6, .32, [0, 1, 0], [-1, 0, 0]);
ao(AO_MED, [2.3, .002, RD - .16], 4.6, .32, [0, 1, 0], [0, 0, 1]);
ao(AO_MED, [RW - .16, .002, 4.9], 3.0, .32, [0, 1, 0], [1, 0, 0]);
ao(AO_SOFT, [.002, .16, 3.6], 5.6, .32, [1, 0, 0], [0, -1, 0]);
ao(AO_SOFT, [2.3, .16, RD - .002], 4.6, .32, [0, 0, -1], [0, -1, 0]);
// encontro teto/parede
ao(AO_SOFT, [.2, RH - .002, 3.2], RD, .4, [0, -1, 0], [-1, 0, 0]);
ao(AO_SOFT, [2.3, RH - .002, .2], RW, .4, [0, -1, 0], [0, 0, -1]);
ao(AO_SOFT, [2.3, RH - .002, RD - .2], RW, .4, [0, -1, 0], [0, 0, 1]);
ao(AO_SOFT, [RW - .2, RH - .002, 3.2], RD, .4, [0, -1, 0], [1, 0, 0]);
ao(AO_SOFT, [.002, RH - .2, 3.2], RD, .4, [1, 0, 0], [0, 1, 0]);
ao(AO_SOFT, [2.3, RH - .2, RD - .002], RW, .4, [0, 0, -1], [0, 1, 0]);
// cantos verticais
ao(AO_SOFT, [.002, RH / 2, RD - .15], RH, .3, [1, 0, 0], [0, 0, 1]);
ao(AO_SOFT, [.15, RH / 2, RD - .002], RH, .3, [0, 0, -1], [-1, 0, 0]);
ao(AO_SOFT, [RW - .002, RH / 2, RD - .15], RH, .3, [-1, 0, 0], [0, 0, 1]);
ao(AO_SOFT, [RW - .15, RH / 2, RD - .002], RH, .3, [0, 0, -1], [1, 0, 0]);
// azulejo: sob armários, sob prateleira e junto à bancada
ao(AO_HARD, [2.0, 1.56, .004], 2.1, .12, [0, 0, 1], [0, 1, 0]);
ao(AO_MED, [2.0, 1.33, .004], 2.1, .14, [0, 0, 1], [0, 1, 0]);
ao(AO_MED, [2.0, .955, .004], 2.1, .07, [0, 0, 1], [0, -1, 0]);
// frentes de gaveta sob a bancada e laterais da ilha
ao(AO_SOFT, [2.0, .85, .609], 2.1, .06, [0, 0, 1], [0, 1, 0]);
ao(AO_SOFT, [IX0 - .002, .84, (IZ0 + IZ1 - .45) / 2], IZ1 - IZ0 - .45, .08, [-1, 0, 0], [0, 1, 0]);
ao(AO_MED, [IX1 + .002, .8, (IZ0 + IZ1) / 2], IZ1 - IZ0, .16, [1, 0, 0], [0, 1, 0]);

/* ---------- Realismo: reflexo no piso polido ---------- */
let reflector = null;
const FLOOR_OPACITY = { marmore: .84, porcelanato: .93, madeira: .9 };
if (!SMALL && THREE.Reflector) {
  reflector = new THREE.Reflector(new THREE.PlaneGeometry(RW, RD), {
    clipBias: .003, color: 0x8c8c8c,
    textureWidth: Math.round(innerWidth * Math.min(devicePixelRatio, 2) * .5),
    textureHeight: Math.round(innerHeight * Math.min(devicePixelRatio, 2) * .5)
  });
  reflector.rotation.x = -Math.PI / 2; reflector.position.set(RW / 2, -.001, RD / 2); world.add(reflector);
  M.floor.transparent = true; M.floor.opacity = FLOOR_OPACITY.marmore; floor.renderOrder = -2;
}
world.traverse(o => { if (o.material === M.shadow || o.material === M.shadowRound) o.renderOrder = -1; });

/* ---------- Luzes ---------- */
const hemi = new THREE.HemisphereLight(0xffffff, 0xd8d2cb, .2); root.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0dc, 3.2);
sun.position.set(RW + 6, 5, 4.5); sun.target.position.set(2, 0, 2.2);
sun.castShadow = true; sun.shadow.mapSize.set(SMALL ? 1024 : 2048, SMALL ? 1024 : 2048); sun.shadow.bias = -.0003; sun.shadow.normalBias = .02;
Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: .5, far: 20 });
root.add(sun, sun.target);
const windowLight = new THREE.RectAreaLight(0xe8f0ff, 6, 2.2, 2.3);
windowLight.position.set(RW - .02, 1.15, 2.3); windowLight.lookAt(0, 1.15, 2.3); root.add(windowLight);
const ledLight = new THREE.RectAreaLight(0xffdcae, 0, 2.06, .05);
ledLight.position.set(2.0, 1.395, .2); ledLight.lookAt(2.0, 0, .2); root.add(ledLight);
const ceilingFill = new THREE.RectAreaLight(0xfff5ea, .55, 4, 5.5);
ceilingFill.position.set(RW / 2, RH - .01, RD / 2); ceilingFill.lookAt(RW / 2, 0, RD / 2); root.add(ceilingFill);
const bounce = new THREE.RectAreaLight(0xf2eee8, 1.4, 4.2, 6); // luz rebatida do piso claro no teto
bounce.position.set(RW / 2, .03, RD / 2); bounce.lookAt(RW / 2, RH, RD / 2); root.add(bounce);
if (SMALL) spots.forEach((s, i) => { if (i > 0) s.castShadow = false; else s.shadow.mapSize.set(512, 512); });

/* Ambiente de reflexo gerado a partir da própria cozinha */
let roomEnv = null, bakeTimer = null;
function bakeEnv() {
  if (!world.visible) return;
  root.position.set(-2.3, -1.45, -3.0); root.updateMatrixWorld(true);
  if (reflector) reflector.visible = false;
  fixtures.forEach(f => f.visible = false); M.led.emissiveIntensity = 0;
  const prev = scene.environment; scene.environment = roomEnv ? roomEnv.texture : studioEnv;
  const rt = pmrem.fromScene(scene, .03, .05, 40);
  root.position.set(0, 0, 0); root.updateMatrixWorld(true);
  if (reflector) reflector.visible = true;
  fixtures.forEach(f => f.visible = !topMode); M.led.emissiveIntensity = night ? 3 : 0;
  if (roomEnv) roomEnv.dispose(); roomEnv = rt; scene.environment = rt.texture;
  world.traverse(o => { const m = o.material; if (m && m.envMapIntensity !== undefined) m.envMapIntensity = ENV_I; });
}
const ENV_I = .3;
function rebake() { clearTimeout(bakeTimer); bakeTimer = setTimeout(bakeEnv, 60); }

let night = false;
function setNight(on) {
  night = on;
  scene.background.set(on ? "#0b1018" : "#dfe6ec");
  sun.intensity = on ? 0 : 3.2;
  windowLight.intensity = on ? .15 : 6;
  windowLight.color.set(on ? 0x6a7fa8 : 0xe8f0ff);
  hemi.intensity = on ? .02 : .1;
  ceilingFill.intensity = on ? .06 : .35;
  bounce.intensity = on ? .1 : .35;
  spots.forEach(s => s.intensity = on ? 9 : 4);
  ledLight.intensity = on ? 14 : 0;
  M.led.emissiveIntensity = on ? 3 : 0;
  renderer.toneMappingExposure = on ? .95 : .75;
  rebake();
}

/* ---------- Acabamentos ---------- */
const FIN = {
  cab: [
    { id: "branco", label: "Laca branca", sw: "#f4f4f2", apply: () => { M.lacquer.map = null; M.lacquer.color.set(0xf4f4f2); M.lacquer.roughness = .32; } },
    { id: "salvia", label: "Verde sálvia", sw: "#9aa892", apply: () => { M.lacquer.map = null; M.lacquer.color.set(0x8f9d86); M.lacquer.roughness = .45; } },
    { id: "petroleo", label: "Azul petróleo", sw: "#2f4a57", apply: () => { M.lacquer.map = null; M.lacquer.color.set(0x2c4652); M.lacquer.roughness = .4; } },
    { id: "freijo", label: "Freijó", sw: "#a87547", apply: () => { M.lacquer.map = rep(TX.freijo, 1, 1); M.lacquer.color.set(0xffffff); M.lacquer.roughness = .55; } }
  ],
  top: [
    { id: "quartzo", label: "Quartzo branco", sw: "#f6f6f4", tex: () => TX.quartz, rough: .14 },
    { id: "calacatta", label: "Calacatta", sw: "#e9e2d8", tex: () => TX.calacatta, rough: .12 },
    { id: "saogabriel", label: "São Gabriel", sw: "#222", tex: () => TX.saoGabriel, rough: .1 }
  ],
  floor: [
    { id: "marmore", label: "Mármore 90×90", sw: "#eeeeec", tex: () => TX.marbleWhite, rough: .1, rx: RW / 1.8, ry: RD / 1.8 },
    { id: "porcelanato", label: "Porcelanato cimentício", sw: "#a9a7a3", tex: () => TX.porcelain, rough: .55, rx: RW / 1.8, ry: RD / 1.8 },
    { id: "madeira", label: "Madeira", sw: "#b8875a", tex: () => TX.woodFloor, rough: .45, rx: 3, ry: 3.2 }
  ]
};
FIN.cab.forEach(o => { const f = o.apply; o.apply = () => { f(); M.lacquer.needsUpdate = true; }; });
FIN.top.forEach(o => o.apply = () => { M.top.map = rep(o.tex(), 1.2, 1.2); M.top.roughness = o.rough; M.top.needsUpdate = true; });
FIN.floor.forEach(o => o.apply = () => {
  M.floor.map = rep(o.tex(), o.rx, o.ry); M.floor.roughness = o.rough;
  M.floor.clearcoat = o.id === "marmore" ? .8 : o.id === "madeira" ? .3 : 0;
  M.floor.bumpMap = o.id === "madeira" ? null : rep(groutBump, o.rx, o.ry);
  if (reflector) M.floor.opacity = FLOOR_OPACITY[o.id];
  M.floor.needsUpdate = true;
});
const chosen = { cab: "branco", top: "quartzo", floor: "marmore" };
function renderSpec() {
  const name = (k) => FIN[k].find(o => o.id === chosen[k]).label;
  $("spec").innerHTML = [
    ["Marcenaria", name("cab") + ", portas com requadro"],
    ["Bancadas", name("top") + ", 4 cm"],
    ["Piso", name("floor")],
    ["Revestimento", "Azulejo metrô 7,5×15 cm"],
    ["Coifa", "Cilíndrica de ilha, inox"],
    ["Metais", "Torneira gourmet cromada"]
  ].map(([a, b]) => `<li><span>${a}</span><span>${b}</span></li>`).join("");
}
function swatches(key) {
  const el = $("sw-" + key);
  FIN[key].forEach(o => {
    const b = document.createElement("button"); b.type = "button"; b.className = "k-sw";
    b.setAttribute("aria-pressed", String(chosen[key] === o.id));
    b.innerHTML = `<i style="background:${o.sw}"></i>${o.label}`;
    b.addEventListener("click", () => {
      chosen[key] = o.id; o.apply(); renderSpec(); rebake();
      el.querySelectorAll(".k-sw").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    });
    el.appendChild(b);
  });
}
["cab", "top", "floor"].forEach(swatches);
renderSpec();

// abas do painel no celular
host.querySelectorAll("[data-tab]").forEach(t => t.addEventListener("click", () => {
  host.querySelectorAll("[data-tab]").forEach(x => x.setAttribute("aria-pressed", String(x === t)));
  host.querySelectorAll("[data-sec]").forEach(s => s.classList.toggle("k-on", s.dataset.sec === t.dataset.tab));
  placeJoy();
}));

/* ---------- Caminhar ---------- */
const EYE = 1.62;
const player = { x: 1.25, z: 5.75, yaw: 0, pitch: 0 };
const VIEWS = [
  { id: "entrada", label: "Entrada", x: 1.25, z: 5.75, look: [2.9, 1.0, 1.0] },
  { id: "ilha", label: "Ilha", x: 1.3, z: 4.1, look: [2.4, 1.0, 1.7] },
  { id: "pia", label: "Pia", x: 2.0, z: 1.05, look: [2.0, 1.1, 0] },
  { id: "banquetas", label: "Banquetas", x: 4.05, z: 4.7, look: [2.1, 0.9, 1.4] },
  { id: "planta", label: "Vista de cima", top: true }
];
function lookAngles(px, py, pz, t) {
  const dx = t[0] - px, dy = t[1] - py, dz = t[2] - pz;
  return { yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) };
}
let topMode = false, topYaw = -.5, anim = null, walkTo = null;
const viewsEl = $("views");
VIEWS.forEach(v => {
  const b = document.createElement("button"); b.type = "button"; b.className = "k-chip"; b.textContent = v.label; b.dataset.v = v.id;
  b.setAttribute("aria-pressed", String(v.id === "entrada"));
  b.addEventListener("click", () => goTo(v));
  viewsEl.appendChild(b);
});
function markView(id) { viewsEl.querySelectorAll(".k-chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.v === id))); }
function wrap(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
function goTo(v, instant) {
  markView(v.id); walkTo = null;
  if (v.top) { topMode = true; ceiling.visible = false; fixtures.forEach(f => f.visible = false); return; }
  topMode = false; ceiling.visible = true; fixtures.forEach(f => f.visible = true);
  const a = lookAngles(v.x, EYE, v.z, v.look);
  const from = { ...player }, to = { x: v.x, z: v.z, yaw: from.yaw + wrap(a.yaw - from.yaw), pitch: a.pitch };
  if (instant || matchMedia("(prefers-reduced-motion: reduce)").matches) { Object.assign(player, to); anim = null; return; }
  anim = { from, to, t: 0 };
}

let bounds = { x0: .28, x1: RW - .28, z0: .28, z1: RD - .28 };
let obstacles = [[0, 0, RW, .62], [IX0 - .02, IZ0 - .02, IX1 + .3, IZ1 + .02], [3.15, 1.75, 3.6, 3.35], [.1, 5.6, .6, 6.2]];
const saved = { bounds, obstacles };
const R = .22;
function blocked(x, z) {
  if (x < bounds.x0 || x > bounds.x1 || z < bounds.z0 || z > bounds.z1) return true;
  return obstacles.some(([a, b, c, d]) => x > a - R && x < c + R && z > b - R && z < d + R);
}

let active = true;
const keys = {};
function onKeyDown(e) {
  if (!active || e.target.tagName === "INPUT") return;
  if (e.code === "Escape" && opts.onClose) { opts.onClose(); return; }
  keys[e.code] = true; if (e.code.startsWith("Arrow") || e.code === "Space") e.preventDefault(); hideHint();
}
function onKeyUp(e) { keys[e.code] = false; }
function onBlur() { for (const k in keys) keys[k] = false; }
addEventListener("keydown", onKeyDown); addEventListener("keyup", onKeyUp); addEventListener("blur", onBlur);

// Olhar arrastando; toque/clique curto no piso anda até o ponto
const cv = renderer.domElement; const pointers = new Map(); let drag = null, pinch = null;
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
cv.addEventListener("pointerdown", e => {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  cv.setPointerCapture(e.pointerId); hideHint(); anim = null;
  if (pointers.size === 1) drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), id: e.pointerId };
  if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), fov: camera.fov }; drag = null; }
});
cv.addEventListener("pointermove", e => {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && pointers.size === 2) {
    const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
    camera.fov = Math.max(35, Math.min(80, pinch.fov * pinch.d / d)); camera.updateProjectionMatrix(); return;
  }
  if (!drag || drag.id !== e.pointerId) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
  const k = e.pointerType === "touch" ? .0055 : .0035;
  if (topMode) { topYaw -= dx * k; return; }
  player.yaw += dx * k; player.pitch = Math.max(-1.2, Math.min(1.2, player.pitch + dy * k));
  if (Math.abs(dx) + Math.abs(dy) > 2) walkTo = null;
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinch = null;
  if (drag && drag.id === e.pointerId) {
    const moved = Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy), dt = performance.now() - drag.t;
    if (e.type === "pointerup" && moved < 8 && dt < 350 && !topMode) {
      const r = cv.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(floorPlane, hit) && hit.distanceTo(camera.position) < 12) {
        const tx = Math.max(bounds.x0, Math.min(bounds.x1, hit.x)), tz = Math.max(bounds.z0, Math.min(bounds.z1, hit.z));
        walkTo = { x: tx, z: tz }; markView("");
      }
    }
    drag = null;
  }
}
cv.addEventListener("pointerup", endPointer); cv.addEventListener("pointercancel", endPointer);
cv.addEventListener("wheel", e => { e.preventDefault(); camera.fov = Math.max(35, Math.min(80, camera.fov + e.deltaY * .03)); camera.updateProjectionMatrix(); }, { passive: false });

// Joystick
const joy = $("joy"), knob = $("knob"); const stick = { x: 0, y: 0, id: null };
joy.addEventListener("pointerdown", e => { e.stopPropagation(); stick.id = e.pointerId; joy.setPointerCapture(e.pointerId); moveStick(e); hideHint(); walkTo = null; });
joy.addEventListener("pointermove", e => { if (stick.id === e.pointerId) moveStick(e); });
function endStick() { stick.id = null; stick.x = stick.y = 0; knob.style.transform = ""; }
joy.addEventListener("pointerup", endStick); joy.addEventListener("pointercancel", endStick);
function moveStick(e) {
  const r = joy.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
  const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; }
  stick.x = x; stick.y = y; knob.style.transform = `translate(${x * 34}px, ${y * 34}px)`;
}
const dock = $("dock");
function placeJoy() {
  if (!app.classList.contains("k-mobile")) return;
  const land = innerWidth > innerHeight && innerHeight <= 520;
  joy.style.bottom = land ? "" : `calc(env(safe-area-inset-bottom, 0px) + ${dock.offsetHeight + 26}px)`;
}

const hint = $("hint"); let hinted = false;
if (app.classList.contains("k-mobile")) {
  hint.textContent = "Arraste para olhar · toque no chão para ir até lá";
  Object.assign(hint.style, { top: "calc(env(safe-area-inset-top, 0px) + 76px)", bottom: "auto", whiteSpace: "normal", textAlign: "center", width: "max-content", maxWidth: "calc(100% - 32px)", display: "block" });
} else {
  hint.innerHTML = "Arraste para olhar · clique no chão para andar · <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>";
}
function hideHint() { if (!hinted) { hinted = true; hint.style.opacity = "0"; } }
setTimeout(hideHint, 7000);

$("night").addEventListener("click", e => {
  const on = e.currentTarget.getAttribute("aria-pressed") !== "true"; e.currentTarget.setAttribute("aria-pressed", String(on)); setNight(on);
});
if (opts.onClose) $("close").addEventListener("click", () => opts.onClose());

/* ---------- Abrir projeto .glb ---------- */
let imported = null;
const fileIn = $("file"), backBtn = $("back");
function toast(msg) {
  const t = document.createElement("div"); t.className = "k-toast k-glass"; t.textContent = msg; app.appendChild(t);
  setTimeout(() => t.remove(), 3800);
}
const SECS = () => host.querySelectorAll(".k-dock section, .k-tabs");
fileIn.addEventListener("change", () => {
  const f = fileIn.files[0]; if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    new THREE.GLTFLoader().parse(reader.result, "", gltf => {
      if (imported) scene.remove(imported);
      imported = gltf.scene;
      const box0 = new THREE.Box3().setFromObject(imported), size0 = box0.getSize(new THREE.Vector3());
      const maxD = Math.max(size0.x, size0.y, size0.z);
      imported.scale.setScalar(maxD > 300 ? .001 : maxD > 60 ? .01 : 1);
      imported.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      scene.add(imported); world.visible = false; scene.environment = studioEnv;
      const box = new THREE.Box3().setFromObject(imported), c = box.getCenter(new THREE.Vector3());
      imported.position.y -= box.min.y; imported.position.x -= c.x; imported.position.z -= c.z; box.setFromObject(imported);
      bounds = { x0: box.min.x, x1: box.max.x, z0: box.min.z, z1: box.max.z }; obstacles = [];
      Object.assign(player, { x: 0, z: Math.min(box.max.z - .5, 2), yaw: 0, pitch: -.05 }); anim = null; walkTo = null;
      topMode = false;
      $("name").textContent = f.name.replace(/\.glb$/i, "");
      $("sub").textContent = "Projeto importado · passeio em 3D";
      SECS().forEach(s => s.hidden = true); dock.hidden = true;
      backBtn.hidden = false; fileIn.value = ""; placeJoy();
    }, () => { toast("Não consegui abrir este arquivo. Exporte o projeto como .glb e tente de novo."); fileIn.value = ""; });
  };
  reader.readAsArrayBuffer(f);
});
backBtn.addEventListener("click", () => {
  if (imported) { scene.remove(imported); imported = null; }
  world.visible = true; bounds = saved.bounds; obstacles = saved.obstacles; backBtn.hidden = true;
  $("name").textContent = "Cozinha Total White"; $("sub").textContent = "Aracaju, SE · passeio em 3D";
  SECS().forEach(s => s.hidden = false); dock.hidden = false;
  goTo(VIEWS[0], true); bakeEnv(); placeJoy();
});

/* ---------- Loop ---------- */
function resize() {
  const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.fov = w < h ? 74 : 62; camera.updateProjectionMatrix();
  app.classList.toggle("k-mobile", TOUCH || w < 760);
  placeJoy();
}
const ro = new ResizeObserver(resize); ro.observe(host); resize();
setNight(false); bakeEnv();
goTo(VIEWS[0], true);
loadingEl.remove();

const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(clock.getDelta(), .05);
  if (anim) {
    anim.t = Math.min(1, anim.t + dt / 1.1); const e = anim.t < .5 ? 2 * anim.t * anim.t : 1 - Math.pow(-2 * anim.t + 2, 2) / 2;
    ["x", "z", "yaw", "pitch"].forEach(k => player[k] = anim.from[k] + (anim.to[k] - anim.from[k]) * e);
    if (anim.t >= 1) anim = null;
  }
  if (topMode) {
    const cx = imported ? 0 : RW / 2, cz = imported ? 0 : RD / 2 - .4, r = imported ? 12 : 6.2;
    camera.position.set(cx + Math.sin(topYaw) * r * .55, imported ? 10 : 6.4, cz + Math.cos(topYaw) * r * .55);
    camera.lookAt(cx, 0, cz);
  } else {
    let f = 0, s = 0;
    if (keys.KeyW || keys.ArrowUp) f += 1; if (keys.KeyS || keys.ArrowDown) f -= 1;
    if (keys.KeyD) s += 1; if (keys.KeyA) s -= 1;
    if (keys.ArrowLeft) player.yaw += 1.6 * dt; if (keys.ArrowRight) player.yaw -= 1.6 * dt;
    f -= stick.y; s += stick.x;
    const sp = (keys.ShiftLeft || keys.ShiftRight ? 2.4 : 1.3) * dt;
    if (f || s) {
      anim = null; walkTo = null;
      const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
      const dx = (-sin * f + cos * s) * sp, dz = (-cos * f - sin * s) * sp;
      if (!blocked(player.x + dx, player.z)) player.x += dx;
      if (!blocked(player.x, player.z + dz)) player.z += dz;
      markView("");
    } else if (walkTo) {
      const dx = walkTo.x - player.x, dz = walkTo.z - player.z, d = Math.hypot(dx, dz);
      if (d < .05) walkTo = null;
      else {
        const st = Math.min(d, sp * 1.1), mx = dx / d * st, mz = dz / d * st; let moved = false;
        if (!blocked(player.x + mx, player.z)) { player.x += mx; moved = true; }
        if (!blocked(player.x, player.z + mz)) { player.z += mz; moved = true; }
        if (!moved) walkTo = null;
      }
    }
    camera.position.set(player.x, EYE, player.z);
    camera.rotation.set(player.pitch, player.yaw, 0);
  }
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(frame);

return {
  pause() { active = false; onBlur(); renderer.setAnimationLoop(null); },
  resume() { active = true; clock.getDelta(); resize(); renderer.setAnimationLoop(frame); }
};
};
