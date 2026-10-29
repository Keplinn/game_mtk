/**
 * ===================================================================
 * RELIC HUNTER: THE ANCIENT TEMPLE (game.js)
 * 2D Canvas Temple Engine, Player Movement, Doors, Math Cryptography
 * ===================================================================
 */

// --- 1. ROSETTA STONE & CHAR ENCODING UTILITIES ---
// Standard Temple Quantification: Space = 0, A-Z = 1 s/d 26, a-z = -1 s/d -26
function charToNum(ch) {
  if (!ch || typeof ch !== 'string' || ch === ' ') return 0;
  const code = ch.charCodeAt(0);
  if (code >= 65 && code <= 90) { // A-Z (1 s/d 26)
    return code - 65 + 1;
  }
  if (code >= 97 && code <= 122) { // a-z (-1 s/d -26)
    return -(code - 97 + 1);
  }
  return 0;
}

function numToChar(n) {
  if (n === 0) return ' ';
  if (n >= 1 && n <= 26) {
    return String.fromCharCode(65 + n - 1);
  }
  if (n <= -1 && n >= -26) {
    return String.fromCharCode(97 + (-n) - 1);
  }
  return '?';
}

function encodeText(text, encryptFn) {
  const nums = [];
  for (let i = 0; i < text.length; i++) {
    const x = charToNum(text[i]);
    nums.push(encryptFn(x));
  }
  return nums;
}

function cleanString(str) {
  return (str || '').toString().trim().replace(/\s+/g, ' ');
}

// --- 2. WEB AUDIO API SYNTHESIZER ---
class AncientAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }


  playStep() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80 + Math.random() * 20, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.06);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playStoneDoor() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.9);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.9);
  }

  playTorchExtinguish() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.5);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playTrapCrumble() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(85, now);
    osc.frequency.linearRampToValueAtTime(25, now + 1.2);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.2);
  }

  playSuccessChime() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.6);
    });
  }

  playVictoryFanfare() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const fanfare = [
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.4 },
      { f: 783.99, d: 0.4 },
      { f: 1046.50, d: 0.9 }
    ];
    let offset = 0;
    fanfare.forEach(item => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, now + offset);
      gain.gain.setValueAtTime(0.3, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + item.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + item.d);
      offset += item.d;
    });
  }

  playPlayerHurt() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playDartShoot() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.1);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playSpikeTrigger() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  playGemCollect() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    [784, 1174].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }
}

const sound = new AncientAudioEngine();

// --- 3. QUESTION BANKS & AUTO-GENERATOR POOLS ---
const AUTO_BANK = {
  door1: [
    { text: "Kunci", b: 5 },
    { text: "Pintu", b: 7 },
    { text: "Emas", b: 4 },
    { text: "Relik", b: 6 },
    { text: "Kuil", b: 8 },
    { text: "Batu", b: 3 },
    { text: "Suci", b: 9 },
    { text: "Obor", b: 5 },
    { text: "kunci", b: 4 },
    { text: "pintu", b: 6 },
    { text: "KUNCI", b: 5 },
    { text: "PINTU", b: 7 }
  ],
  door2: [
    { text: "Obor Emas Kuil", a: 2, b: 3 },
    { text: "Jejak Langkah Kuno", a: 2, b: 5 },
    { text: "Cahaya Dalam Gelap", a: 3, b: 2 },
    { text: "Gerbang Rahasia Kuil", a: 2, b: 7 },
    { text: "Kotak Perhiasan Kuno", a: 3, b: 4 },
    { text: "Lorong Bawah Tanah", a: 2, b: 1 },
    { text: "Matahari Terbit", a: 4, b: 3 },
    { text: "OBOR EMAS KUIL", a: 2, b: 3 }
  ],
  door3: [
    {
      text: "Buka Peti Di Bawah Altar",
      f: { a: 2, b: 1 },
      g: { c: 3, d: 2 }
    },
    {
      text: "Air Suci Mengalir Ke Taman",
      f: { a: 2, b: 3 },
      g: { c: 2, d: 1 }
    },
    {
      text: "Rahasia Kuno Tersimpan Di Sini",
      f: { a: 3, b: 1 },
      g: { c: 2, d: 5 }
    },
    {
      text: "Temukan Kunci Di Balik Patung",
      f: { a: 2, b: 4 },
      g: { c: 3, d: 1 }
    },
    {
      text: "Cahaya Bulan Menerangi Batu Suci",
      f: { a: 2, b: 2 },
      g: { c: 4, d: 3 }
    }
  ],
  door4: [
    {
      text: "Siapa Yang Menjaga Kesucian Kuil Akan Mendapatkan Berkah Emas Abadi",
      f: { a: 2, b: 3 },
      g: { c: 4, d: 1 }
    },
    {
      text: "Temukan Mahkota Raja Di Ruang Rahasia Dibalik Patung Anubis Besar",
      f: { a: 3, b: 2 },
      g: { c: 3, d: 4 }
    },
    {
      text: "Pengetahuan Adalah Kunci Utama Membuka Gerbang Kebenaran Sejati Kuil Ini",
      f: { a: 2, b: 5 },
      g: { c: 3, d: 2 }
    },
    {
      text: "Hanya Mereka Yang Bijak Sanggup Menguasai Rahasia Pengetahuan Relik Kuno",
      f: { a: 4, b: 1 },
      g: { c: 2, d: 3 }
    }
  ]
};

// Generate 4 Door configs
function generateAutoDoors() {
  const d1 = AUTO_BANK.door1[Math.floor(Math.random() * AUTO_BANK.door1.length)];
  const d2 = AUTO_BANK.door2[Math.floor(Math.random() * AUTO_BANK.door2.length)];
  const d3 = AUTO_BANK.door3[Math.floor(Math.random() * AUTO_BANK.door3.length)];
  const d4 = AUTO_BANK.door4[Math.floor(Math.random() * AUTO_BANK.door4.length)];

  return [
    {
      doorNum: 1,
      name: "Gerbang Luar Kuil",
      difficulty: "Mudah",
      text: d1.text,
      type: "linear_simple",
      b: d1.b,
      encryptFn: (x) => x + d1.b,
      formulaDisplay: `f(x) = x + ${d1.b}`,
      inverseDisplay: `f⁻¹(y) = y - ${d1.b}`,
      explanation: `Kurangkan setiap angka sandi dengan ${d1.b} untuk mendapatkan nilai huruf asli.`
    },
    {
      doorNum: 2,
      name: "Lorong Katakomba",
      difficulty: "Sedang",
      text: d2.text,
      type: "linear_standard",
      a: d2.a,
      b: d2.b,
      encryptFn: (x) => d2.a * x + d2.b,
      formulaDisplay: `f(x) = ${d2.a}x + ${d2.b}`,
      inverseDisplay: `f⁻¹(y) = (y - ${d2.b}) / ${d2.a}`,
      explanation: `Kurangkan setiap angka dengan ${d2.b}, lalu bagi hasilnya dengan ${d2.a}.`
    },
    {
      doorNum: 3,
      name: "Ruang Altar Kuno",
      difficulty: "Sulit",
      text: d3.text,
      type: "composition",
      f: { a: d3.f.a, b: d3.f.b },
      g: { c: d3.g.c, d: d3.g.d },
      encryptFn: (x) => d3.g.c * (d3.f.a * x + d3.f.b) + d3.g.d,
      formulaDisplay: `(g ∘ f)(x) dengan f(x) = ${d3.f.a}x + ${d3.f.b} dan g(x) = ${d3.g.c}x + ${d3.g.d}`,
      compSimplified: `(g ∘ f)(x) = ${d3.g.c * d3.f.a}x + ${d3.g.c * d3.f.b + d3.g.d}`,
      inverseDisplay: `(g ∘ f)⁻¹(y) = (y - ${d3.g.c * d3.f.b + d3.g.d}) / ${d3.g.c * d3.f.a}`,
      explanation: `Bentuk fungsi gabungan: ${d3.g.c}(${d3.f.a}x + ${d3.f.b}) + ${d3.g.d} = ${d3.g.c * d3.f.a}x + ${d3.g.c * d3.f.b + d3.g.d}. Invers: kurangkan ${d3.g.c * d3.f.b + d3.g.d} lalu bagi ${d3.g.c * d3.f.a}.`
    },
    {
      doorNum: 4,
      name: "Ruang Relik Suci (Boss Level)",
      difficulty: "Boss Level",
      text: d4.text,
      type: "composition_boss",
      f: { a: d4.f.a, b: d4.f.b },
      g: { c: d4.g.c, d: d4.g.d },
      encryptFn: (x) => d4.g.c * (d4.f.a * x + d4.f.b) + d4.g.d,
      formulaDisplay: `(g ∘ f)(x) dengan f(x) = ${d4.f.a}x + ${d4.f.b} dan g(x) = ${d4.g.c}x + ${d4.g.d}`,
      compSimplified: `(g ∘ f)(x) = ${d4.g.c * d4.f.a}x + ${d4.g.c * d4.f.b + d4.g.d}`,
      inverseDisplay: `(g ∘ f)⁻¹(y) = (y - ${d4.g.c * d4.f.b + d4.g.d}) / ${d4.g.c * d4.f.a}`,
      explanation: `Komposisi g(f(x)) = ${d4.g.c * d4.f.a}x + ${d4.g.c * d4.f.b + d4.g.d}. Invers: kurangkan ${d4.g.c * d4.f.b + d4.g.d} lalu bagi ${d4.g.c * d4.f.a}.`
    }
  ];
}

// --- 4. GAME STATE & MODAL HELPERS ---
const gameState = {
  mode: 'auto', // 'auto' or 'custom'
  teamName: 'Tim Ekspedisi A',
  challengerTeam: 'Tim Ekspedisi A',
  solverTeam: 'Tim Ekspedisi B',
  currentDoor: 1, // 1 to 4
  doorOpen: false, // Is active door unlocked and open?
  torches: 2, // 2 chances per door
  playerHp: 3,
  maxHp: 3,
  hintUsed: false,
  trapResetsCount: 0,
  startTime: null,
  timerInterval: null,
  elapsedMs: 0,
  doorsData: generateAutoDoors(), // Safely pre-initialized
  solutionLogs: [],
  isDecryptionModalOpen: false,
  isFinished: false
};

function isAnyModalOpen() {
  const modalIds = [
    'modalDecryption',
    'modalRosetta',
    'modalScratchpad',
    'modalMathGuide',
    'modalTrapReset',
    'modalDuelLocked'
  ];
  return modalIds.some(id => {
    const el = document.getElementById(id);
    return el && !el.classList.contains('hidden');
  });
}

function resetKeys() {
  for (const k in keys) {
    keys[k] = false;
  }
  player.isMoving = false;
}

function closeActiveModalOnEscape() {
  const decModal = document.getElementById('modalDecryption');
  if (decModal && !decModal.classList.contains('hidden')) {
    closeDecryptionModal();
    return true;
  }
  const rosetta = document.getElementById('modalRosetta');
  if (rosetta && !rosetta.classList.contains('hidden')) {
    rosetta.classList.add('hidden');
    resetKeys();
    return true;
  }
  const scratch = document.getElementById('modalScratchpad');
  if (scratch && !scratch.classList.contains('hidden')) {
    scratch.classList.add('hidden');
    resetKeys();
    return true;
  }
  const guide = document.getElementById('modalMathGuide');
  if (guide && !guide.classList.contains('hidden')) {
    guide.classList.add('hidden');
    resetKeys();
    return true;
  }
  return false;
}

// --- 5. 2D ENGINE (PLAYER, MAP, PARTICLES, TRAPS & LIGHTING) ---
const VIRTUAL_WIDTH = 960;
const VIRTUAL_HEIGHT = 540;
let canvas = document.getElementById('gameCanvas');
let ctx = canvas ? canvas.getContext('2d') : null;

function ensureCanvas() {
  if (!canvas) {
    canvas = document.getElementById('gameCanvas');
  }
  if (canvas && (!ctx || canvas.width !== VIRTUAL_WIDTH)) {
    ctx = canvas.getContext('2d');
    canvas.width = VIRTUAL_WIDTH;
    canvas.height = VIRTUAL_HEIGHT;
  }
}
ensureCanvas();

// --- 5.1 PIXEL ART ASSET LOADER ---
const characterImg = new Image();
characterImg.src = 'assets/character.png';
let characterImgLoaded = false;
characterImg.onload = () => { characterImgLoaded = true; };

const propsImg = new Image();
propsImg.src = 'assets/props.png';
let propsImgLoaded = false;
propsImg.onload = () => { propsImgLoaded = true; };

const tilesetImg = new Image();
tilesetImg.src = 'assets/tileset.png';
let tilesetImgLoaded = false;
tilesetImg.onload = () => { tilesetImgLoaded = true; };

// Trap System & FX State
let screenShake = 0;
let redDamageFlash = 0;
let trapClock = 0;
let activeDarts = [];
let floatingNotices = [];

function addFloatingNotice(text, x, y, color = '#ef4444') {
  floatingNotices.push({
    text: text,
    x: x,
    y: y,
    vy: -1.2,
    life: 1.0,
    color: color
  });
}

function updateHUDHealth() {
  const container = document.getElementById('heartsContainer');
  if (!container) return;
  let html = '';
  for (let i = 1; i <= gameState.maxHp; i++) {
    if (i <= gameState.playerHp) {
      html += '<span class="inline-block transform hover:scale-125 transition-transform text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]">❤️</span>';
    } else {
      html += '<span class="inline-block text-slate-600 opacity-40 scale-90">🖤</span>';
    }
  }
  container.innerHTML = html;
}

// Archaeologist 2D Player Character
const player = {
  x: 480,
  y: 430,
  width: 26,
  height: 34,
  speed: 3.8,
  vx: 0,
  vy: 0,
  direction: 'up', // 'up', 'down', 'left', 'right'
  animStep: 0,
  idleTimer: 0,
  isMoving: false,
  invulnerableTimer: 0,
  shieldTimer: 0,
  hasShield: false,
  torchFlicker: 1,
  color: '#d4b483'
};

// Input Keys Tracking
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  s: false,
  a: false,
  d: false,
  e: false,
  ' ': false
};

// Particles for Dust, Sparks and Collapse
let particles = [];
function addParticles(x, y, count, color, speedMultiplier = 1) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 2 + 1) * speedMultiplier;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: Math.random() * 0.03 + 0.015,
      size: Math.random() * 4 + 2,
      color: color
    });
  }
}

// Chamber Layout Definitions
// Each chamber has dimensions 960x540 with walls, pillars, torches, traps, and the door
const chamberMaps = {
  1: {
    title: "Chamber 1: Gerbang Luar Kuil",
    themeColor: '#eab308',
    doorX: 430,
    doorY: 70,
    doorW: 100,
    doorH: 45,
    pedestalX: 480,
    pedestalY: 175,
    relicX: null,
    relicY: null,
    pillars: [
      { x: 200, y: 180, r: 24 },
      { x: 760, y: 180, r: 24 },
      { x: 200, y: 360, r: 24 },
      { x: 760, y: 360, r: 24 }
    ],
    wallTorches: [
      { x: 120, y: 100 },
      { x: 840, y: 100 },
      { x: 380, y: 70 },
      { x: 580, y: 70 }
    ],
    traps: [
      { type: 'spike', x: 340, y: 280, w: 38, h: 38, period: 180, offset: 0 },
      { type: 'spike', x: 620, y: 280, w: 38, h: 38, period: 180, offset: 90 },
      { type: 'gem', x: 480, y: 330, collected: false }
    ]
  },
  2: {
    title: "Chamber 2: Lorong Katakomba",
    themeColor: '#38bdf8',
    doorX: 430,
    doorY: 70,
    doorW: 100,
    doorH: 45,
    pedestalX: 480,
    pedestalY: 175,
    relicX: null,
    relicY: null,
    pillars: [
      { x: 260, y: 220, r: 22 },
      { x: 700, y: 220, r: 22 },
      { x: 260, y: 360, r: 22 },
      { x: 700, y: 360, r: 22 },
      { x: 480, y: 300, r: 20 }
    ],
    wallTorches: [
      { x: 100, y: 140 },
      { x: 860, y: 140 },
      { x: 100, y: 380 },
      { x: 860, y: 380 },
      { x: 380, y: 70 },
      { x: 580, y: 70 }
    ],
    traps: [
      { type: 'spike', x: 370, y: 220, w: 38, h: 38, period: 160, offset: 0 },
      { type: 'spike', x: 590, y: 220, w: 38, h: 38, period: 160, offset: 80 },
      { type: 'spike', x: 480, y: 390, w: 38, h: 38, period: 160, offset: 40 },
      { type: 'dartShooter', wall: 'left', x: 70, y: 320, dir: 1, interval: 140, timer: 70 },
      { type: 'gem', x: 160, y: 260, collected: false }
    ]
  },
  3: {
    title: "Chamber 3: Ruang Altar Kuno",
    themeColor: '#a855f7',
    doorX: 430,
    doorY: 70,
    doorW: 100,
    doorH: 45,
    pedestalX: 480,
    pedestalY: 175,
    relicX: null,
    relicY: null,
    pillars: [
      { x: 180, y: 160, r: 26 },
      { x: 780, y: 160, r: 26 },
      { x: 180, y: 340, r: 26 },
      { x: 780, y: 340, r: 26 },
      { x: 330, y: 260, r: 22 },
      { x: 630, y: 260, r: 22 }
    ],
    wallTorches: [
      { x: 110, y: 100 },
      { x: 850, y: 100 },
      { x: 380, y: 70 },
      { x: 580, y: 70 }
    ],
    traps: [
      { type: 'runeShock', x: 330, y: 380, runeCol: 1, radius: 36, period: 160, offset: 0 },
      { type: 'runeShock', x: 630, y: 380, runeCol: 4, radius: 36, period: 160, offset: 80 },
      { type: 'spike', x: 480, y: 235, w: 38, h: 38, period: 140, offset: 30 },
      { type: 'spike', x: 480, y: 340, w: 38, h: 38, period: 140, offset: 100 },
      { type: 'dartShooter', wall: 'left', x: 70, y: 200, dir: 1, interval: 150, timer: 20 },
      { type: 'dartShooter', wall: 'right', x: 890, y: 300, dir: -1, interval: 150, timer: 95 },
      { type: 'gem', x: 480, y: 440, collected: false }
    ]
  },
  4: {
    title: "Chamber 4: Ruang Relik Suci (Boss Level)",
    themeColor: '#f59e0b',
    doorX: 430,
    doorY: 150,
    doorW: 100,
    doorH: 45,
    pedestalX: 480,
    pedestalY: 260,
    relicX: 480, // Beyond the door!
    relicY: 85,
    pillars: [
      { x: 180, y: 180, r: 28 },
      { x: 780, y: 180, r: 28 },
      { x: 220, y: 360, r: 28 },
      { x: 740, y: 360, r: 28 },
      { x: 340, y: 240, r: 20 },
      { x: 620, y: 240, r: 20 }
    ],
    wallTorches: [
      { x: 80, y: 100 },
      { x: 880, y: 100 },
      { x: 360, y: 150 },
      { x: 600, y: 150 },
      { x: 410, y: 70 },
      { x: 550, y: 70 }
    ],
    traps: [
      { type: 'patrolOrb', x: 280, y: 340, minX: 230, maxX: 730, speed: 2.5, dir: 1, radius: 18 },
      { type: 'patrolOrb', x: 680, y: 410, minX: 200, maxX: 760, speed: -2.8, dir: -1, radius: 18 },
      { type: 'spike', x: 400, y: 260, w: 38, h: 38, period: 130, offset: 0 },
      { type: 'spike', x: 560, y: 260, w: 38, h: 38, period: 130, offset: 65 },
      { type: 'spike', x: 480, y: 360, w: 38, h: 38, period: 130, offset: 35 },
      { type: 'dartShooter', wall: 'left', x: 70, y: 210, dir: 1, interval: 130, timer: 30 },
      { type: 'dartShooter', wall: 'right', x: 890, y: 210, dir: -1, interval: 130, timer: 95 },
      { type: 'runeShock', x: 380, y: 105, runeCol: 5, radius: 28, period: 120, offset: 0 },
      { type: 'runeShock', x: 580, y: 105, runeCol: 2, radius: 28, period: 120, offset: 60 },
      { type: 'gem', x: 150, y: 280, collected: false }
    ]
  }
};

// Door sliding animation offset (0 to 45 px)
let doorSlideOffset = 0;

// Setup Level & Reset Player
function setChamber(doorIndex, resetPlayerPos = true) {
  gameState.currentDoor = doorIndex;
  gameState.doorOpen = false;
  doorSlideOffset = 0;
  gameState.torches = 2;
  updateTorchUI();

  gameState.playerHp = gameState.maxHp;
  updateHUDHealth();
  activeDarts = [];
  floatingNotices = [];

  // Reset trap items in target chamber
  const map = chamberMaps[doorIndex];
  if (map && map.traps) {
    map.traps.forEach(t => {
      if (t.type === 'gem') t.collected = false;
      if (t.type === 'dartShooter') t.timer = 0;
    });
  }

  if (resetPlayerPos) {
    player.x = 480;
    player.y = 440;
    player.vx = 0;
    player.vy = 0;
    player.direction = 'up';
    player.invulnerableTimer = 0;
    player.hasShield = false;
    player.shieldTimer = 0;
  }

  // Update HUD
  updateHUDDoorIndicators(doorIndex);
  document.getElementById('hudChamberTitle').textContent = `PINTU ${doorIndex} : ${gameState.doorsData[doorIndex - 1].name}`;
  sound.playStoneDoor();
}

// Check Collision with Pillars & Boundaries
function checkCollision(nextX, nextY) {
  const map = chamberMaps[gameState.currentDoor];
  if (!map) return false;
  const halfW = player.width / 2;
  const halfH = player.height / 2;

  // Chamber Outer Walls (Room bounds)
  const minX = 70 + halfW;
  const maxX = 890 - halfW;
  const maxY = 475 - halfH;
  let minY = 85 + halfH; // Default top boundary (104)

  // In Chambers 1, 2, 3:
  // If the door is open, allow player to enter the doorway threshold
  if (gameState.currentDoor < 4) {
    if (gameState.doorOpen && nextX >= map.doorX + 10 && nextX <= map.doorX + map.doorW - 10) {
      minY = map.doorY + 5; // Allow stepping into doorway (y = 70..104)
    }
  } else if (gameState.currentDoor === 4) {
    // In Chamber 4 (Boss Level):
    // Partition wall across y = 145..195 to the left and right of the central door
    const inPartitionY = nextY >= 140 && nextY <= 195;
    if (inPartitionY) {
      const inLeftWall = nextX < map.doorX + halfW - 2;
      const inRightWall = nextX > map.doorX + map.doorW - halfW + 2;
      if (inLeftWall || inRightWall) {
        return true; // Solid stone partition wall!
      }
      if (!gameState.doorOpen) {
        return true; // Door is locked!
      }
    }
    // In inner relic sanctum (y < 150):
    if (nextY < 150) {
      if (!gameState.doorOpen) {
        return true; // Cannot enter sanctum if door is closed
      }
      minY = 65 + halfH; // Allow reaching relic at y = 85
    }
  }

  if (nextX < minX || nextX > maxX) return true;
  if (nextY < minY || nextY > maxY) return true;

  // Pillars Collision
  for (const pillar of map.pillars) {
    const dist = Math.hypot(nextX - pillar.x, nextY - pillar.y);
    if (dist < pillar.r + halfW - 2) {
      return true;
    }
  }

  // Monolith/Pedestal Collision
  const pDist = Math.hypot(nextX - map.pedestalX, nextY - map.pedestalY);
  if (pDist < 26) {
    return true;
  }

  // Closed door collision for Chambers 1, 2, 3
  if (!gameState.doorOpen && gameState.currentDoor < 4) {
    const dLeft = map.doorX - 5;
    const dRight = map.doorX + map.doorW + 5;
    const dTop = map.doorY - 10;
    const dBottom = map.doorY + map.doorH + 15;

    if (nextX > dLeft && nextX < dRight && nextY > dTop && nextY < dBottom) {
      return true;
    }
  }

  return false;
}

// Update Player Physics
function updatePlayer() {
  const gameStage = document.getElementById('viewGameStage');
  if (!gameStage || gameStage.classList.contains('hidden') || gameState.isFinished || isAnyModalOpen()) {
    player.isMoving = false;
    return;
  }

  // Knockback physics
  if (Math.abs(player.vx) > 0.05 || Math.abs(player.vy) > 0.05) {
    const nextX = player.x + player.vx;
    const nextY = player.y + player.vy;
    if (!checkCollision(nextX, player.y)) player.x = nextX;
    if (!checkCollision(player.x, nextY)) player.y = nextY;
    player.vx *= 0.82;
    player.vy *= 0.82;
  }

  if (player.invulnerableTimer > 0) {
    player.invulnerableTimer--;
  }

  if (player.shieldTimer > 0) {
    player.shieldTimer--;
    if (player.shieldTimer <= 0) {
      player.hasShield = false;
    }
  }

  let moveX = 0;
  let moveY = 0;

  if (keys.ArrowUp || keys.w) moveY -= 1;
  if (keys.ArrowDown || keys.s) moveY += 1;
  if (keys.ArrowLeft || keys.a) moveX -= 1;
  if (keys.ArrowRight || keys.d) moveX += 1;

  if (moveX !== 0 || moveY !== 0) {
    player.isMoving = true;
    player.idleTimer = 0;
    // Normalize diagonal
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.7071;
      moveY *= 0.7071;
    }

    if (Math.abs(moveX) > Math.abs(moveY)) {
      player.direction = moveX > 0 ? 'right' : 'left';
    } else {
      player.direction = moveY > 0 ? 'down' : 'up';
    }

    const curSpeed = player.speed * (player.hasShield ? 1.25 : 1.0);
    const nextX = player.x + moveX * curSpeed;
    const nextY = player.y + moveY * curSpeed;

    if (!checkCollision(nextX, player.y)) {
      player.x = nextX;
    }
    if (!checkCollision(player.x, nextY)) {
      player.y = nextY;
    }

    player.animStep += 0.16;
    if (Math.floor(player.animStep) % 3 === 0) {
      sound.playStep();
    }
    // Subtle dust particles while running
    if (Math.random() < 0.2) {
      particles.push({
        x: player.x + (Math.random() - 0.5) * 8,
        y: player.y + 14,
        vx: -moveX * 0.4 + (Math.random() - 0.5) * 0.4,
        vy: -moveY * 0.4 + (Math.random() - 0.5) * 0.4,
        life: 0.5,
        decay: 0.04,
        size: Math.random() * 2 + 1,
        color: 'rgba(212, 180, 131, 0.35)'
      });
    }
  } else {
    player.isMoving = false;
    player.idleTimer = (player.idleTimer || 0) + 1;
  }

  // Door Slide Animation
  if (gameState.doorOpen && doorSlideOffset < 44) {
    doorSlideOffset += 1.5;
  }

  // Check Door Passage (Next Level Transition)
  const map = chamberMaps[gameState.currentDoor];
  if (!map) return;

  if (gameState.doorOpen && gameState.currentDoor < 4) {
    // If player walks into the opened door opening
    if (player.y <= map.doorY + 32 && player.x >= map.doorX + 10 && player.x <= map.doorX + map.doorW - 10) {
      // Transition to next chamber!
      sound.playSuccessChime();
      addParticles(player.x, player.y, 40, '#eab308', 2.5);
      setChamber(gameState.currentDoor + 1, true);
    }
  }

  // Check Golden Relic Interaction (in Chamber 4)
  if (gameState.currentDoor === 4 && gameState.doorOpen && map.relicX && !gameState.isFinished) {
    const relicDist = Math.hypot(player.x - map.relicX, player.y - map.relicY);
    if (relicDist < 38) {
      // VICTORY REACHED!
      finishGame();
    }
  }
}

// Trap Damage & Penalty Handler
function hitPlayerByTrap(type, knockbackAngle) {
  if (gameState.isFinished || isAnyModalOpen()) return;

  if (player.hasShield) {
    player.hasShield = false;
    player.shieldTimer = 0;
    player.invulnerableTimer = 35;
    sound.playStoneDoor();
    addParticles(player.x, player.y, 20, '#38bdf8', 2.5);
    addFloatingNotice('🛡️ PERISAI MENANGKIS!', player.x, player.y - 25, '#38bdf8');
    screenShake = 6;
    return;
  }

  if (player.invulnerableTimer > 0) return;

  sound.playPlayerHurt();
  screenShake = 14;
  redDamageFlash = 0.45;
  player.invulnerableTimer = 75; // 1.25 detik invulnerability
  gameState.playerHp = Math.max(0, gameState.playerHp - 1);
  updateHUDHealth();

  // Apply knockback away from trap
  player.vx = Math.cos(knockbackAngle) * 6;
  player.vy = Math.sin(knockbackAngle) * 6;

  // Add 10 seconds penalty to expedition time
  gameState.elapsedMs += 10000;
  gameState.startTime -= 10000;
  updateStopwatchDisplay();

  gameState.trapResetsCount++;
  const statResets = document.getElementById('statTrapResets');
  if (statResets) statResets.textContent = `${gameState.trapResetsCount} Kali`;

  addParticles(player.x, player.y, 20, '#ef4444', 2.2);
  addFloatingNotice('⚠️ -1 ❤️ (+10s PENALTI)', player.x, player.y - 25, '#ef4444');

  if (gameState.playerHp <= 0) {
    // Player knocked out by traps!
    sound.playTrapCrumble();
    screenShake = 22;
    redDamageFlash = 0.7;
    addParticles(player.x, player.y, 45, '#f97316', 3.0);
    addFloatingNotice('KEMBALI KE PINTU MASUK!', 480, 240, '#fde047');

    // Respawn safely at chamber entrance
    player.x = 480;
    player.y = 440;
    player.vx = 0;
    player.vy = 0;
    player.direction = 'up';
    gameState.playerHp = gameState.maxHp;
    updateHUDHealth();
  }
}

// Update and Draw Traps, Hazards & Collectibles
function updateAndDrawTraps(ctx) {
  const map = chamberMaps[gameState.currentDoor];
  if (!map || !map.traps) return;

  trapClock++;

  // Update & Render Traps
  map.traps.forEach(trap => {
    if (trap.type === 'spike') {
      const t = (trapClock + trap.offset) % trap.period;
      const isWarning = t >= trap.period - 70 && t < trap.period - 35;
      const isActive = t >= trap.period - 35;

      ctx.save();
      let shakeX = 0;
      let shakeY = 0;
      if (isWarning) {
        shakeX = Math.sin(trapClock * 1.5) * 1.5;
        shakeY = Math.cos(trapClock * 1.5) * 1.5;
        if (trapClock % 12 === 0) {
          addParticles(trap.x, trap.y, 2, '#f59e0b', 0.8);
        }
      }

      const px = trap.x + shakeX;
      const py = trap.y + shakeY;

      // Floor Plate Frame
      if (propsImgLoaded) {
        ctx.imageSmoothingEnabled = false;
        const frameSx = isActive ? 0 : (isWarning ? 32 : 96);
        ctx.drawImage(propsImg, frameSx, 64, 32, 32, px - 19, py - 19, 38, 38);
      } else {
        ctx.fillStyle = isActive ? '#450a0a' : (isWarning ? '#78350f' : '#1e263d');
        ctx.fillRect(px - 19, py - 19, 38, 38);
        ctx.strokeStyle = isActive ? '#ef4444' : (isWarning ? '#f59e0b' : '#475569');
        ctx.lineWidth = 2;
        ctx.strokeRect(px - 19, py - 19, 38, 38);
      }

      // Safe state perforations
      if (!isActive && !isWarning) {
        ctx.fillStyle = '#0a0d14';
        const holeOffsets = [[-8, -8], [8, -8], [-8, 8], [8, 8], [0, 0]];
        holeOffsets.forEach(([ox, oy]) => {
          ctx.fillRect(px + ox - 2, py + oy - 2, 4, 4);
        });
      }

      // Warning state indicator
      if (isWarning) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.fillRect(px - 17, py - 17, 34, 34);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('!', px, py + 4);
      }

      // Active state: Sharp iron spikes extended
      if (isActive) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fillRect(px - 18, py - 18, 36, 36);

        const spikeOffsets = [[-9, -9], [9, -9], [-9, 9], [9, 9], [0, 0]];
        spikeOffsets.forEach(([ox, oy]) => {
          const sx = px + ox;
          const sy = py + oy;
          ctx.beginPath();
          ctx.moveTo(sx - 4, sy + 6);
          ctx.lineTo(sx, sy - 11);
          ctx.lineTo(sx + 4, sy + 6);
          ctx.closePath();
          const spikeGrad = ctx.createLinearGradient(sx - 4, sy, sx + 4, sy);
          spikeGrad.addColorStop(0, '#94a3b8');
          spikeGrad.addColorStop(0.5, '#f8fafc');
          spikeGrad.addColorStop(1, '#475569');
          ctx.fillStyle = spikeGrad;
          ctx.fill();
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Glint
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(sx - 1, sy - 11, 2, 3);
        });

        // Collision check with player
        const dist = Math.hypot(player.x - trap.x, player.y - trap.y);
        if (dist < 26) {
          hitPlayerByTrap('spike', Math.atan2(player.y - trap.y, player.x - trap.x));
        }
      }

      ctx.restore();

    } else if (trap.type === 'dartShooter') {
      trap.timer = (trap.timer || 0) + 1;
      if (trap.timer >= trap.interval) {
        trap.timer = 0;
        sound.playDartShoot();
        addParticles(trap.x, trap.y, 6, '#38bdf8', 1.5);
        activeDarts.push({
          x: trap.x,
          y: trap.y,
          vx: trap.dir * 5.5,
          vy: 0,
          life: 180
        });
      }

      // Draw Wall Dispenser Aperture
      ctx.save();
      ctx.fillStyle = '#1e263d';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      const dispX = trap.dir > 0 ? trap.x - 14 : trap.x - 6;
      ctx.fillRect(dispX, trap.y - 10, 20, 20);
      ctx.strokeRect(dispX, trap.y - 10, 20, 20);

      // Glowing nozzle hole
      ctx.fillStyle = (trap.timer > trap.interval - 25) ? '#f43f5e' : '#0284c7';
      ctx.beginPath();
      ctx.arc(trap.dir > 0 ? trap.x + 2 : trap.x - 2, trap.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else if (trap.type === 'runeShock') {
      const t = (trapClock + trap.offset) % trap.period;
      const isCharging = t >= trap.period - 55 && t < trap.period - 20;
      const isBurst = t >= trap.period - 20;

      ctx.save();
      const runeCol = trap.runeCol || 0;
      if (propsImgLoaded) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(propsImg, runeCol * 32, 32, 32, 32, trap.x - 18, trap.y - 18, 36, 36);
      } else {
        ctx.fillStyle = '#1e263d';
        ctx.fillRect(trap.x - 18, trap.y - 18, 36, 36);
        ctx.strokeStyle = '#a855f7';
        ctx.strokeRect(trap.x - 18, trap.y - 18, 36, 36);
      }

      if (isCharging) {
        const chargeRatio = (t - (trap.period - 55)) / 35;
        ctx.strokeStyle = `rgba(168, 85, 247, ${chargeRatio})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(trap.x, trap.y, trap.radius * chargeRatio, 0, Math.PI * 2);
        ctx.stroke();

        if (Math.random() < 0.4) {
          addParticles(trap.x + (Math.random() - 0.5) * 20, trap.y + (Math.random() - 0.5) * 20, 2, '#c084fc', 1.2);
        }
      }

      if (isBurst) {
        ctx.strokeStyle = '#ec4899';
        ctx.shadowColor = '#d946ef';
        ctx.shadowBlur = 16;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(trap.x, trap.y, trap.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
        ctx.beginPath();
        ctx.arc(trap.x, trap.y, trap.radius, 0, Math.PI * 2);
        ctx.fill();

        if (Math.hypot(player.x - trap.x, player.y - trap.y) < trap.radius + 12) {
          hitPlayerByTrap('runeShock', Math.atan2(player.y - trap.y, player.x - trap.x));
        }
      }
      ctx.restore();

    } else if (trap.type === 'patrolOrb') {
      trap.x += trap.speed;
      if (trap.x <= trap.minX) {
        trap.x = trap.minX;
        trap.speed = Math.abs(trap.speed);
      } else if (trap.x >= trap.maxX) {
        trap.x = trap.maxX;
        trap.speed = -Math.abs(trap.speed);
      }

      ctx.save();
      const orbPulse = Math.sin(trapClock * 0.1) * 2;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(trap.x, trap.y, trap.radius + orbPulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(trap.x, trap.y, trap.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      const satAngle = trapClock * 0.08;
      for (let s = 0; s < 3; s++) {
        const a = satAngle + (s * Math.PI * 2 / 3);
        const sx = trap.x + Math.cos(a) * (trap.radius + 10);
        const sy = trap.y + Math.sin(a) * (trap.radius + 10);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (Math.hypot(player.x - trap.x, player.y - trap.y) < trap.radius + 14) {
        hitPlayerByTrap('patrolOrb', Math.atan2(player.y - trap.y, player.x - trap.x));
      }

    } else if (trap.type === 'gem') {
      if (!trap.collected) {
        ctx.save();
        const bobY = Math.sin(trapClock * 0.08) * 4;
        const gx = trap.x;
        const gy = trap.y + bobY;

        const gGrad = ctx.createRadialGradient(gx, gy, 2, gx, gy, 24);
        gGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        gGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = gGrad;
        ctx.beginPath();
        ctx.arc(gx, gy, 24, 0, Math.PI * 2);
        ctx.fill();

        if (propsImgLoaded) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(propsImg, 64, 64, 32, 32, gx - 14, gy - 14, 28, 28);
        } else {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(gx, gy, 10, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#7dd3fc';
        ctx.font = 'bold 9px "Cinzel", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('KRISTAL KUIL', gx, gy - 16);
        ctx.restore();

        if (Math.hypot(player.x - gx, player.y - gy) < 24) {
          trap.collected = true;
          sound.playGemCollect();
          gameState.playerHp = Math.min(gameState.maxHp, gameState.playerHp + 1);
          updateHUDHealth();
          player.hasShield = true;
          player.shieldTimer = 240;
          addParticles(gx, gy, 25, '#38bdf8', 2.5);
          addFloatingNotice('+1 ❤️ PERISAI KUIL!', player.x, player.y - 25, '#38bdf8');
        }
      }
    }
  });

  // Update & Draw Active Darts
  for (let d = activeDarts.length - 1; d >= 0; d--) {
    const dart = activeDarts[d];
    dart.x += dart.vx;
    dart.life--;

    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(dart.x - dart.vx * 2, dart.y);
    ctx.lineTo(dart.x, dart.y);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(dart.x, dart.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (Math.random() < 0.4) {
      particles.push({
        x: dart.x,
        y: dart.y,
        vx: -dart.vx * 0.1,
        vy: (Math.random() - 0.5) * 0.5,
        life: 0.4,
        decay: 0.05,
        size: 2,
        color: '#38bdf8'
      });
    }

    if (Math.hypot(player.x - dart.x, player.y - dart.y) < 20) {
      activeDarts.splice(d, 1);
      addParticles(dart.x, dart.y, 14, '#38bdf8', 2);
      hitPlayerByTrap('dart', dart.vx > 0 ? 0 : Math.PI);
      continue;
    }

    if (dart.x < 70 || dart.x > 890 || dart.life <= 0) {
      activeDarts.splice(d, 1);
      addParticles(dart.x, dart.y, 8, '#94a3b8', 1.2);
    }
  }
}

// Render 2D World
function renderGame() {
  ensureCanvas();
  if (!ctx) return;

  ctx.save();
  // Screen Shake FX on trap hit
  if (screenShake > 0) {
    const shakeX = (Math.random() - 0.5) * screenShake;
    const shakeY = (Math.random() - 0.5) * screenShake;
    ctx.translate(shakeX, shakeY);
    screenShake *= 0.86;
    if (screenShake < 0.4) screenShake = 0;
  }

  ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  const map = chamberMaps[gameState.currentDoor];

  // 1. Draw Ancient Stone Floor Tiles
  ctx.fillStyle = '#0f1422';
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  const tileSize = 48;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.lineWidth = 1;
  for (let x = 60; x < 900; x += tileSize) {
    for (let y = 70; y < 490; y += tileSize) {
      ctx.strokeRect(x, y, tileSize, tileSize);
      // Subtle hieroglyph detail on random tiles
      if ((x + y) % 144 === 0) {
        ctx.fillStyle = 'rgba(234, 179, 8, 0.03)';
        ctx.fillRect(x + 12, y + 12, tileSize - 24, tileSize - 24);
      }
    }
  }

  // 2. Chamber Outer Walls
  ctx.fillStyle = '#182033';
  ctx.strokeStyle = '#364468';
  ctx.lineWidth = 3;

  // Top Wall
  ctx.fillRect(40, 30, 880, 50);
  ctx.strokeRect(40, 30, 880, 50);

  // Left Wall
  ctx.fillRect(40, 30, 30, 470);
  ctx.strokeRect(40, 30, 30, 470);

  // Right Wall
  ctx.fillRect(890, 30, 30, 470);
  ctx.strokeRect(890, 30, 30, 470);

  // Bottom Wall
  ctx.fillRect(40, 480, 880, 40);
  ctx.strokeRect(40, 480, 880, 40);

  // 3. Ancient Temple Pillars
  map.pillars.forEach(pillar => {
    // Pillar Base Shadow
    ctx.beginPath();
    ctx.ellipse(pillar.x, pillar.y + 16, pillar.r, pillar.r * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fill();

    // Pillar Column Body
    const grad = ctx.createLinearGradient(pillar.x - pillar.r, pillar.y, pillar.x + pillar.r, pillar.y);
    grad.addColorStop(0, '#101524');
    grad.addColorStop(0.5, '#2b3654');
    grad.addColorStop(1, '#0b0e17');

    ctx.beginPath();
    ctx.arc(pillar.x, pillar.y, pillar.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#3b4b75';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Carved hieroglyph on pillar cap
    ctx.fillStyle = map.themeColor;
    ctx.globalAlpha = 0.6;
    ctx.font = '10px "Cinzel"';
    ctx.textAlign = 'center';
    ctx.fillText('Ω', pillar.x, pillar.y + 4);
    ctx.globalAlpha = 1.0;
  });

  // 4. Draw Massive Stone Temple Door & Chamber 4 Sanctum Partition
  if (gameState.currentDoor === 4) {
    ctx.fillStyle = '#182033';
    ctx.strokeStyle = '#364468';
    ctx.lineWidth = 3;
    // Left partition wall from x: 40 to doorX: 430
    ctx.fillRect(40, 150, map.doorX - 40, 36);
    ctx.strokeRect(40, 150, map.doorX - 40, 36);
    // Right partition wall from doorX + doorW: 530 to 890
    ctx.fillRect(map.doorX + map.doorW, 150, 890 - (map.doorX + map.doorW), 36);
    ctx.strokeRect(map.doorX + map.doorW, 150, 890 - (map.doorX + map.doorW), 36);

    // Carved Golden Hieroglyphic Inscriptions along partition wall
    ctx.fillStyle = 'rgba(234, 179, 8, 0.5)';
    ctx.font = '10px "Cinzel"';
    ctx.textAlign = 'center';
    ctx.fillText('◈ RUANG SUCI ◈', 235, 172);
    ctx.fillText('◈ RELIK SUCI ◈', 710, 172);
  }

  // Doorway recess
  ctx.fillStyle = '#06080e';
  ctx.fillRect(map.doorX - 4, map.doorY - 6, map.doorW + 8, map.doorH + 12);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(map.doorX - 4, map.doorY - 6, map.doorW + 8, map.doorH + 12);

  if (gameState.doorOpen) {
    // Glowing opened portal/passage
    const portalGrad = ctx.createLinearGradient(map.doorX, map.doorY, map.doorX, map.doorY + map.doorH);
    portalGrad.addColorStop(0, '#fde047');
    portalGrad.addColorStop(1, 'rgba(234, 179, 8, 0.15)');
    ctx.fillStyle = portalGrad;
    ctx.fillRect(map.doorX, map.doorY, map.doorW, map.doorH);

    // Left Sliding Door Slab
    ctx.fillStyle = '#1e263d';
    ctx.fillRect(map.doorX - doorSlideOffset, map.doorY, map.doorW / 2, map.doorH);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(map.doorX - doorSlideOffset, map.doorY, map.doorW / 2, map.doorH);

    // Right Sliding Door Slab
    ctx.fillRect(map.doorX + map.doorW / 2 + doorSlideOffset, map.doorY, map.doorW / 2, map.doorH);
    ctx.strokeRect(map.doorX + map.doorW / 2 + doorSlideOffset, map.doorY, map.doorW / 2, map.doorH);

    // Indicator Arrow: Walk into doorway!
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 11px "Cinzel"';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.currentDoor === 4 ? '▲ SENTUH RELIK SUCI ▲' : '▲ MASUK LORONG ▲', map.doorX + map.doorW / 2, map.doorY + map.doorH / 2 + 4);

  } else {
    // Closed Stone Door with Carved Reliefs
    ctx.fillStyle = '#1e263d';
    ctx.fillRect(map.doorX, map.doorY, map.doorW, map.doorH);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(map.doorX, map.doorY, map.doorW, map.doorH);

    // Carved center seam
    ctx.beginPath();
    ctx.moveTo(map.doorX + map.doorW / 2, map.doorY);
    ctx.lineTo(map.doorX + map.doorW / 2, map.doorY + map.doorH);
    ctx.strokeStyle = '#0f1422';
    ctx.stroke();

    // Ancient Lock Rune
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 14px "Cinzel"';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.currentDoor === 4 ? '🔒 PINTU RELIK SUCI' : '🔒 SANDI KUIL', map.doorX + map.doorW / 2, map.doorY + map.doorH / 2 + 5);
  }

  // 5. Chamber Traps, Hazards & Collectibles
  updateAndDrawTraps(ctx);

  // 6. Inscription Pedestal / Monolith
  // Shadow
  ctx.beginPath();
  ctx.ellipse(map.pedestalX, map.pedestalY + 14, 28, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fill();

  // Pedestal Stone Base
  ctx.fillStyle = '#1a2238';
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2;
  ctx.fillRect(map.pedestalX - 24, map.pedestalY - 14, 48, 28);
  ctx.strokeRect(map.pedestalX - 24, map.pedestalY - 14, 48, 28);

  // Chest from propsImg on Pedestal
  if (propsImgLoaded) {
    ctx.imageSmoothingEnabled = false;
    if (gameState.doorOpen) {
      // Open chest with glowing key above it
      ctx.drawImage(propsImg, 128, 0, 32, 32, map.pedestalX - 16, map.pedestalY - 26, 32, 32);
      const keyBob = Math.sin(Date.now() * 0.006) * 4;
      ctx.drawImage(propsImg, 160, 0, 32, 32, map.pedestalX - 16, map.pedestalY - 48 + keyBob, 32, 32);
    } else {
      // Closed chest
      ctx.drawImage(propsImg, 96, 0, 32, 32, map.pedestalX - 16, map.pedestalY - 26, 32, 32);
    }
  }

  // Glowing Inscription Plate
  ctx.fillStyle = gameState.doorOpen ? '#10b981' : '#f59e0b';
  ctx.font = 'bold 9px "JetBrains Mono"';
  ctx.textAlign = 'center';
  ctx.fillText(gameState.doorOpen ? 'TERBUKA' : 'PRASASTI', map.pedestalX, map.pedestalY + 8);

  // 7. Sacred Relic (in Chamber 4 beyond door)
  if (gameState.currentDoor === 4 && map.relicX) {
    ctx.save();
    // Relic Pedestal
    ctx.fillStyle = '#eab308';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(map.relicX, map.relicY, 16, 0, Math.PI * 2);
    ctx.fill();

    // Relic Symbol (Ankh / Sun Crown)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px "Cinzel"';
    ctx.textAlign = 'center';
    ctx.fillText('☀️', map.relicX, map.relicY + 5);
    ctx.restore();
  }

  // 8. Wall Torches with Animated Flames
  map.wallTorches.forEach((torch, index) => {
    if (propsImgLoaded) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(propsImg, 128, 64, 32, 32, torch.x - 16, torch.y - 18, 32, 32);
    } else {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(torch.x - 3, torch.y - 4, 6, 12);
    }

    // Flickering Flame
    const flicker = Math.sin(Date.now() * 0.008 + index) * 2;
    ctx.beginPath();
    ctx.arc(torch.x, torch.y - 8 + flicker * 0.4, 6 + flicker * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#f97316';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(torch.x, torch.y - 9 + flicker * 0.3, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();
  });

  // 9. Draw Player Archaeologist Character
  drawPlayer(ctx);

  // 10. Torchlight Illumination & Darkness Fog of War
  drawTorchLighting(ctx);

  // 11. Floating Damage & Item Notices
  for (let i = floatingNotices.length - 1; i >= 0; i--) {
    const fn = floatingNotices[i];
    fn.y += fn.vy;
    fn.life -= 0.02;
    if (fn.life <= 0) {
      floatingNotices.splice(i, 1);
    } else {
      ctx.save();
      ctx.globalAlpha = Math.min(1, fn.life * 1.5);
      ctx.font = 'bold 12px "Cinzel", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0a0d14';
      ctx.fillText(fn.text, fn.x + 1, fn.y + 1);
      ctx.fillStyle = fn.color;
      ctx.fillText(fn.text, fn.x, fn.y);
      ctx.restore();
    }
  }

  // 12. Update & Render Particles
  updateAndDrawParticles(ctx);

  // 13. Interaction Floating Prompt
  const distToPedestal = Math.hypot(player.x - map.pedestalX, player.y - map.pedestalY);
  if (distToPedestal < 65 && !gameState.doorOpen && !gameState.isDecryptionModalOpen) {
    ctx.save();
    ctx.fillStyle = '#0f1422';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;

    const promptText = '[TEKAN E / SPASI / KETUK UNTUK MEMECAHKAN SANDI]';
    ctx.font = 'bold 11px "Cinzel"';
    ctx.textAlign = 'center';
    const textW = ctx.measureText(promptText).width + 18;

    ctx.fillRect(map.pedestalX - textW / 2, map.pedestalY - 38, textW, 22);
    ctx.strokeRect(map.pedestalX - textW / 2, map.pedestalY - 38, textW, 22);

    ctx.fillStyle = '#fde047';
    ctx.fillText(promptText, map.pedestalX, map.pedestalY - 23);
    ctx.restore();
  }

  // 14. Red Damage Flash Vignette FX
  if (redDamageFlash > 0) {
    ctx.fillStyle = `rgba(239, 68, 68, ${redDamageFlash})`;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    redDamageFlash -= 0.025;
    if (redDamageFlash < 0) redDamageFlash = 0;
  }

  ctx.restore();
}

// Draw Player Character using Authentic Pixel Art Spritesheet
function drawPlayer(ctx) {
  ctx.save();
  const px = player.x;
  const py = player.y;

  // Player Shadow
  ctx.beginPath();
  ctx.ellipse(px, py + 16, 14, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();

  // Shield Bubble Aura if active
  if (player.hasShield) {
    ctx.save();
    const shieldPulse = Math.sin(Date.now() * 0.01) * 3;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(px, py - 4, 25 + shieldPulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fill();
    ctx.restore();
  }

  // Invulnerability Blinking
  if (player.invulnerableTimer > 0) {
    if (Math.floor(player.invulnerableTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }
  }

  if (characterImgLoaded) {
    let animRow = 0;
    let animCol = 0;
    let maxFrames = 4;

    if (gameState.doorOpen || gameState.isFinished) {
      // Celebrating / Holding Relic (Rows 16-19)
      maxFrames = 6;
      if (player.direction === 'down') animRow = 16;
      else if (player.direction === 'up') animRow = 17;
      else if (player.direction === 'left') animRow = 18;
      else if (player.direction === 'right') animRow = 19;
      animCol = Math.floor(player.animStep) % maxFrames;
    } else if (player.isMoving) {
      // Walking animation (Rows 4-7)
      maxFrames = 6;
      if (player.direction === 'down') animRow = 4;
      else if (player.direction === 'up') animRow = 5;
      else if (player.direction === 'left') animRow = 6;
      else if (player.direction === 'right') animRow = 7;
      animCol = Math.floor(player.animStep) % maxFrames;
    } else {
      // Idle breathing animation (Rows 0-3)
      maxFrames = 4;
      if (player.direction === 'down') animRow = 0;
      else if (player.direction === 'up') animRow = 1;
      else if (player.direction === 'left') animRow = 2;
      else if (player.direction === 'right') animRow = 3;
      animCol = Math.floor((player.idleTimer || 0) / 16) % maxFrames;
    }

    const drawW = 46;
    const drawH = 46;
    const destX = Math.round(px - drawW / 2);
    const destY = Math.round(py - drawH / 2 - 4);

    ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
    ctx.drawImage(
      characterImg,
      animCol * 32, animRow * 32, 32, 32,
      destX, destY, drawW, drawH
    );
  } else {
    drawFallbackPlayer(ctx, px, py);
  }

  ctx.restore();
}

// Procedural Fallback Character (used if asset image is still downloading)
function drawFallbackPlayer(ctx, px, py) {
  const sway = player.isMoving ? Math.sin(player.animStep) * 2.5 : 0;
  const legCycle = player.isMoving ? Math.sin(player.animStep) * 4 : 0;

  // Legs / Trousers
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px - 7, py + 8 + legCycle, 5, 8);
  ctx.fillRect(px + 2, py + 8 - legCycle, 5, 8);

  // Body / Explorer Jacket
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px - 9, py - 4 + sway * 0.3, 18, 14);

  // Backpack on back
  ctx.fillStyle = '#292524';
  if (player.direction === 'up') {
    ctx.fillRect(px - 6, py - 3, 12, 10);
  } else if (player.direction === 'left') {
    ctx.fillRect(px + 4, py - 3, 6, 10);
  } else if (player.direction === 'right') {
    ctx.fillRect(px - 10, py - 3, 6, 10);
  }

  // Head / Face
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(px, py - 8, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Explorer Fedora Hat
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.ellipse(px, py - 11, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(px - 6, py - 18, 12, 8);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(px - 6, py - 12, 12, 2.5);
}

// Atmospheric Torchlight Radial Vignette
function drawTorchLighting(ctx) {
  const map = chamberMaps[gameState.currentDoor];
  ctx.save();

  // Darkness overlay
  const ambientLight = ctx.createRadialGradient(
    player.x, player.y, 30,
    player.x, player.y, 240
  );
  ambientLight.addColorStop(0, 'rgba(253, 224, 71, 0.08)');
  ambientLight.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
  ambientLight.addColorStop(1, 'rgba(0, 0, 0, 0.7)');

  ctx.fillStyle = ambientLight;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Pedestal Beacon Glow
  const pedGlow = ctx.createRadialGradient(
    map.pedestalX, map.pedestalY, 5,
    map.pedestalX, map.pedestalY, 70
  );
  pedGlow.addColorStop(0, gameState.doorOpen ? 'rgba(16, 185, 129, 0.25)' : 'rgba(234, 179, 8, 0.2)');
  pedGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = pedGlow;
  ctx.fillRect(map.pedestalX - 70, map.pedestalY - 70, 140, 140);

  ctx.restore();
}

// Update & Draw Particle Systems
function updateAndDrawParticles(ctx) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;

    if (p.life <= 0) {
      particles.splice(i, 1);
    } else {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

// 2D Main Game Loop
function gameLoop() {
  const gameStage = document.getElementById('viewGameStage');
  if (gameStage && !gameStage.classList.contains('hidden') && !gameState.isFinished) {
    updatePlayer();
    renderGame();
  }
  requestAnimationFrame(gameLoop);
}


// --- 6. STOPWATCH CONTROLLER ---
function startStopwatch() {
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  gameState.startTime = Date.now() - gameState.elapsedMs;
  gameState.timerInterval = setInterval(() => {
    gameState.elapsedMs = Date.now() - gameState.startTime;
    updateStopwatchDisplay();
  }, 90);
}

function pauseStopwatch() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
}

function resetStopwatch() {
  pauseStopwatch();
  gameState.elapsedMs = 0;
  updateStopwatchDisplay();
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${tenths}`;
}

function updateStopwatchDisplay() {
  const display = document.getElementById('stopwatchDisplay');
  if (display) {
    display.textContent = formatTime(gameState.elapsedMs);
  }
}

// --- 7. TORCH MANAGEMENT (2 OBOR SYSTEM) ---
function updateTorchUI() {
  const flame1 = document.getElementById('flame1');
  const smoke1 = document.getElementById('smoke1');
  const flame2 = document.getElementById('flame2');
  const smoke2 = document.getElementById('smoke2');

  if (gameState.torches === 2) {
    flame1.classList.remove('hidden');
    smoke1.classList.add('hidden');
    flame2.classList.remove('hidden');
    smoke2.classList.add('hidden');
  } else if (gameState.torches === 1) {
    flame1.classList.add('hidden');
    smoke1.classList.remove('hidden');
    flame2.classList.remove('hidden');
    smoke2.classList.add('hidden');
  } else {
    flame1.classList.add('hidden');
    smoke1.classList.remove('hidden');
    flame2.classList.add('hidden');
    smoke2.classList.remove('hidden');
  }
}

// Update Step Indicators in Top Bar
function updateHUDDoorIndicators(doorIndex) {
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`stepDoor${i}`);
    if (i < doorIndex) {
      stepEl.className = 'p-1.5 sm:p-2 rounded-lg border text-center transition-all bg-emerald-950/60 border-emerald-600/80 text-emerald-300';
    } else if (i === doorIndex) {
      stepEl.className = 'p-1.5 sm:p-2 rounded-lg border text-center transition-all bg-amber-500/10 border-amber-500 text-amber-300 shadow-gold-glow font-bold';
    } else {
      stepEl.className = 'p-1.5 sm:p-2 rounded-lg border text-center transition-all bg-temple-900 border-slate-700 text-slate-500 opacity-60';
    }
  }
}

// --- 8. DECRYPTION PRASASTI MODAL (PUZZLE SOLVER) ---
function openDecryptionModal() {
  const door = gameState.doorsData && gameState.doorsData[gameState.currentDoor - 1];
  if (!door) return;

  sound.init();
  resetKeys();
  gameState.isDecryptionModalOpen = true;

  const ciphertext = encodeText(door.text, door.encryptFn);

  document.getElementById('modalDoorTitle').textContent = `PINTU ${gameState.currentDoor}: ${door.name}`;
  document.getElementById('modalDoorDiff').textContent = door.difficulty;
  document.getElementById('modalCipherCount').textContent = `Total: ${door.text.length} Huruf / Simbol (${ciphertext.length} Angka Sandi)`;

  // Render Ciphertext Rune Pills
  const container = document.getElementById('modalCipherContainer');
  container.innerHTML = '';
  ciphertext.forEach((num, idx) => {
    const isSpace = (door.text[idx] === ' ');
    const pill = document.createElement('div');
    pill.className = `flex flex-col items-center justify-center min-w-[36px] sm:min-w-[42px] h-11 px-2 rounded-lg border font-mono font-bold select-none ${
      isSpace 
        ? 'bg-amber-950/40 border-amber-600/60 text-amber-300 shadow-stone-inset' 
        : 'bg-temple-850 border-amber-500/50 text-amber-300 shadow-stone-inset hover:border-amber-400'
    }`;
    pill.innerHTML = `
      <span class="text-sm sm:text-base font-extrabold ${isSpace ? 'text-amber-300' : 'text-amber-200'} tracking-wider">${num}</span>
      <span class="text-[9px] ${isSpace ? 'text-amber-400 font-bold' : 'text-slate-500 font-normal'}">${isSpace ? 'SPASI' : '#' + (idx + 1)}</span>
    `;
    container.appendChild(pill);
  });

  // Display Formula
  const formulaEl = document.getElementById('modalFormulaRule');
  if (door.compSimplified) {
    formulaEl.innerHTML = `${door.formulaDisplay} <br><span class="text-xs text-amber-400/90 font-normal">Bentuk Gabungan: <strong class="text-amber-300">${door.compSimplified}</strong></span>`;
  } else {
    formulaEl.textContent = door.formulaDisplay;
  }

  // Clear Input & Alert
  document.getElementById('inputPlaintextAnswer').value = '';
  hideFeedback();

  // Compass Hint Trigger State
  const compassBtn = document.getElementById('btnAncientCompass');
  if ((gameState.currentDoor === 3 || gameState.currentDoor === 4) && !gameState.hintUsed) {
    compassBtn.disabled = false;
    compassBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    compassBtn.classList.add('hover:border-amber-400', 'shadow-gold-glow');
  } else {
    compassBtn.disabled = true;
    compassBtn.classList.add('opacity-50', 'cursor-not-allowed');
    compassBtn.classList.remove('hover:border-amber-400', 'shadow-gold-glow');
  }

  // Show Modal
  document.getElementById('modalDecryption').classList.remove('hidden');
  document.getElementById('inputPlaintextAnswer').focus();
}

function closeDecryptionModal() {
  document.getElementById('modalDecryption').classList.add('hidden');
  gameState.isDecryptionModalOpen = false;
  resetKeys();
}


// Feedback alerts inside Decryption Modal
function showFeedback(type, title, desc) {
  const alertBox = document.getElementById('doorFeedbackAlert');
  const icon = document.getElementById('feedbackIcon');
  const titleEl = document.getElementById('feedbackTitle');
  const descEl = document.getElementById('feedbackDesc');

  alertBox.classList.remove('hidden');
  if (type === 'success') {
    alertBox.className = 'p-3.5 rounded-xl border text-sm font-semibold flex items-center gap-3 bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg';
    icon.textContent = '✨';
  } else if (type === 'warning') {
    alertBox.className = 'p-3.5 rounded-xl border text-sm font-semibold flex items-center gap-3 bg-amber-950/80 border-amber-500 text-amber-200 shadow-lg animate-pulse';
    icon.textContent = '🔥';
  } else {
    alertBox.className = 'p-3.5 rounded-xl border text-sm font-semibold flex items-center gap-3 bg-rose-950/80 border-rose-500 text-rose-200 shadow-ruby-glow animate-shake';
    icon.textContent = '⚠️';
  }

  titleEl.textContent = title;
  descEl.textContent = desc;
}

function hideFeedback() {
  document.getElementById('doorFeedbackAlert').classList.add('hidden');
}

// --- 9. SUBMIT ANSWER VALIDATION & TRAP RESET ---
function checkAnswer() {
  sound.init();
  const inputEl = document.getElementById('inputPlaintextAnswer');
  const rawUserAns = inputEl.value;
  const userAnsClean = cleanString(rawUserAns);

  const door = gameState.doorsData[gameState.currentDoor - 1];
  const targetAnsClean = cleanString(door.text);

  if (!userAnsClean) {
    showFeedback('warning', 'Peringatan!', 'Ketikkan terjemahan teks prasasti sebelum menguji sandi.');
    return;
  }

  // Mendukung huruf kapital maupun huruf kecil (bisa diketik kapital, kecil, atau kombinasi)
  const isMatch = (userAnsClean === targetAnsClean) || 
                  (userAnsClean.toLowerCase() === targetAnsClean.toLowerCase());

  if (isMatch) {
    // CORRECT!
    sound.playSuccessChime();
    gameState.doorOpen = true;

    // Log solution for victory screen
    gameState.solutionLogs.push({
      doorNum: gameState.currentDoor,
      name: door.name,
      text: door.text,
      formula: door.formulaDisplay,
      inverse: door.inverseDisplay,
      explanation: door.explanation
    });

    const map = chamberMaps[gameState.currentDoor];
    addParticles(map.doorX + map.doorW / 2, map.doorY + map.doorH / 2, 45, '#eab308', 2.5);

    showFeedback('success', 'Sandi Terbuka!', `Jawaban benar: "${door.text}"! Pintu batu kuno sedang bergeser membuka. Tutup jendela ini dan jalankan karaktermu menembus lorong pintu!`);

    setTimeout(() => {
      closeDecryptionModal();
    }, 1200);

  } else {
    // WRONG ANSWER
    gameState.torches--;
    updateTorchUI();

    if (gameState.torches === 1) {
      sound.playTorchExtinguish();
      showFeedback(
        'warning',
        'Obor Pertama Padam!',
        'Periksa kembali hitungan inversmu! Sisa 1 obor tersisa sebelum jebakan runtuh aktif!'
      );
    } else if (gameState.torches <= 0) {
      // 2nd Mistake: TRAP COLLAPSE!
      sound.playTrapCrumble();
      closeDecryptionModal();
      triggerTrapReset();
    }
  }
}

// Trigger Ancient Temple Trap Reset
function triggerTrapReset() {
  gameState.trapResetsCount++;
  const container = document.getElementById('canvasContainer');
  container.classList.add('screen-collapse');

  // Spawn crumble dust around player
  addParticles(player.x, player.y, 60, '#ef4444', 3);

  const modal = document.getElementById('modalTrapReset');
  modal.classList.remove('hidden');

  setTimeout(() => {
    container.classList.remove('screen-collapse');
  }, 1500);
}

function confirmTrapReset() {
  document.getElementById('modalTrapReset').classList.add('hidden');
  resetKeys();
  gameState.isFinished = false;
  gameState.hintUsed = false;
  const compassBadge = document.getElementById('compassUsageBadge');
  if (compassBadge) compassBadge.textContent = '1x';

  // Anti-memorization: randomize questions in auto mode, preserve custom formulas in custom mode
  if (gameState.mode === 'auto') {
    gameState.doorsData = generateAutoDoors();
  }


  gameState.solutionLogs = [];
  setChamber(1, true);
}

// Ancient Compass Hint Trigger
function useAncientCompass() {
  if (gameState.hintUsed) return;
  if (gameState.currentDoor < 3) {
    alert("Kompas Kuno hanya dapat digunakan pada Pintu 3 atau Pintu Utama!");
    return;
  }

  const door = gameState.doorsData[gameState.currentDoor - 1];
  const words = cleanString(door.text).split(' ');
  const firstWord = words[0];

  if (confirm(`Gunakan 1x kesempatan Kompas Kuno untuk membuka terjemahan kata pertama secara gratis?`)) {
    gameState.hintUsed = true;
    sound.playSuccessChime();

    const compassBtn = document.getElementById('btnAncientCompass');
    compassBtn.disabled = true;
    compassBtn.classList.add('opacity-50', 'cursor-not-allowed');
    document.getElementById('compassUsageBadge').textContent = 'Habis';

    showFeedback(
      'success',
      'Kompas Kuno Berpendar!',
      `Petunjuk Dewa Kuil: Kata pertama prasasti adalah "${firstWord}". Teruskan perhitungan invers untuk kata selanjutnya!`
    );

    const input = document.getElementById('inputPlaintextAnswer');
    if (!input.value.trim()) {
      input.value = firstWord + ' ';
    }
  }
}

// --- 10. VICTORY HANDLER ---
function finishGame() {
  if (gameState.isFinished) return;
  gameState.isFinished = true;
  player.isMoving = false;
  resetKeys();
  pauseStopwatch();
  sound.playVictoryFanfare();


  if (typeof confetti === 'function') {
    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#fde047', '#f97316', '#ef4444', '#10b981', '#38bdf8']
    });
    setTimeout(() => {
      confetti({ particleCount: 90, angle: 60, spread: 60, origin: { x: 0 } });
      confetti({ particleCount: 90, angle: 120, spread: 60, origin: { x: 1 } });
    }, 400);
  }

  document.getElementById('viewGameStage').classList.add('hidden');
  document.getElementById('viewVictory').classList.remove('hidden');

  document.getElementById('victoryTeamSubtext').textContent = 
    `Selamat, ${gameState.teamName} berhasil mencapai Ruang Relik Suci dan menembus seluruh 4 Pintu Kuil!`;
  document.getElementById('statTotalTime').textContent = formatTime(gameState.elapsedMs);
  document.getElementById('statRemainingTorches').textContent = `${gameState.torches} Obor`;
  document.getElementById('statHintUsed').textContent = gameState.hintUsed ? 'Dipakai (1x)' : 'Tidak Dipakai (Murni!)';
  document.getElementById('statTrapResets').textContent = `${gameState.trapResetsCount} Kali`;

  const reviewContainer = document.getElementById('victoryReviewList');
  reviewContainer.innerHTML = '';

  gameState.solutionLogs.forEach((log) => {
    const item = document.createElement('div');
    item.className = 'p-4 rounded-xl bg-temple-900 border border-slate-700/80 space-y-2';
    item.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-cinzel font-bold text-amber-300 text-sm">PINTU ${log.doorNum}: ${log.name}</span>
        <span class="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700">TERPECAHKAN</span>
      </div>
      <div class="text-xs font-mono text-slate-300 bg-temple-850 p-2.5 rounded border border-slate-800 space-y-1">
        <div><strong class="text-slate-400">Teks Prasasti:</strong> <span class="text-amber-200">"${log.text}"</span></div>
        <div><strong class="text-slate-400">Fungsi Enkripsi:</strong> <span class="text-amber-400">${log.formula}</span></div>
        <div><strong class="text-slate-400">Fungsi Invers:</strong> <span class="text-emerald-300 font-bold">${log.inverse}</span></div>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">${log.explanation}</p>
    `;
    reviewContainer.appendChild(item);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 11. ROSETTA STONE INITIALIZATION ---
function initRosettaStone() {
  const upperGrid = document.getElementById('rosettaGridUpper');
  const lowerGrid = document.getElementById('rosettaGridLower');

  upperGrid.innerHTML = '';
  lowerGrid.innerHTML = '';

  // Space = 0
  const spaceTile = document.createElement('div');
  spaceTile.className = 'rosetta-tile p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex flex-col items-center justify-center cursor-pointer hover:border-amber-300 transition-colors';
  spaceTile.dataset.search = 'spasi space 0';
  spaceTile.title = 'Klik untuk uji Spasi';
  spaceTile.innerHTML = `
    <span class="text-[11px] font-bold">SPASI</span>
    <span class="text-xs font-bold text-amber-400 mt-0.5">0</span>
  `;
  spaceTile.addEventListener('click', () => {
    const qInput = document.getElementById('rosettaQuickTest');
    const qVal = document.getElementById('rosettaQuickVal');
    if (qInput && qVal) {
      qInput.value = ' ';
      qVal.textContent = '0 (Spasi)';
    }
  });
  upperGrid.appendChild(spaceTile);

  // A-Z = 1-26
  for (let i = 1; i <= 26; i++) {
    const char = String.fromCharCode(64 + i);
    const tile = document.createElement('div');
    tile.className = 'rosetta-tile p-1.5 rounded-lg bg-temple-850 border border-slate-700 hover:border-amber-400 text-slate-200 flex flex-col items-center justify-center transition-colors cursor-pointer';
    tile.dataset.search = `${char.toLowerCase()} ${char} ${i}`;
    tile.title = `Klik untuk uji huruf kapital '${char}'`;
    tile.innerHTML = `
      <span class="text-sm font-bold text-white">${char}</span>
      <span class="text-xs text-amber-400 font-semibold mt-0.5">${i}</span>
    `;
    tile.addEventListener('click', () => {
      const qInput = document.getElementById('rosettaQuickTest');
      const qVal = document.getElementById('rosettaQuickVal');
      if (qInput && qVal) {
        qInput.value = char;
        qVal.textContent = `${i} (Kapital)`;
      }
    });
    upperGrid.appendChild(tile);
  }

  // a-z = -1 s/d -26
  for (let i = 1; i <= 26; i++) {
    const char = String.fromCharCode(96 + i); // 'a' to 'z'
    const val = -i; // -1 to -26
    const tile = document.createElement('div');
    tile.className = 'rosetta-tile p-1.5 rounded-lg bg-temple-850 border border-slate-700 hover:border-sky-400 text-slate-200 flex flex-col items-center justify-center transition-colors cursor-pointer';
    tile.dataset.search = `${char} ${char.toUpperCase()} ${val} ${i}`;
    tile.title = `Klik untuk uji huruf kecil '${char}'`;
    tile.innerHTML = `
      <span class="text-sm font-bold text-sky-300">${char}</span>
      <span class="text-xs text-sky-400 font-semibold mt-0.5">${val}</span>
    `;
    tile.addEventListener('click', () => {
      const qInput = document.getElementById('rosettaQuickTest');
      const qVal = document.getElementById('rosettaQuickVal');
      if (qInput && qVal) {
        qInput.value = char;
        qVal.textContent = `${val} (Kecil)`;
      }
    });
    lowerGrid.appendChild(tile);
  }

  // Search filter
  const searchInput = document.getElementById('rosettaSearchInput');
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const allTiles = document.querySelectorAll('.rosetta-tile');
    allTiles.forEach(tile => {
      if (!q || tile.dataset.search.includes(q)) {
        tile.style.display = 'flex';
      } else {
        tile.style.display = 'none';
      }
    });
  });

  // Quick Letter Tester
  const quickInput = document.getElementById('rosettaQuickTest');
  const quickVal = document.getElementById('rosettaQuickVal');
  quickInput.addEventListener('input', (e) => {
    const char = e.target.value;
    if (!char) {
      quickVal.textContent = '-';
      return;
    }
    const val = charToNum(char);
    if (val === 0 && char === ' ') {
      quickVal.textContent = '0 (Spasi)';
    } else if (val >= 1 && val <= 26) {
      quickVal.textContent = `${val} (Kapital)`;
    } else if (val <= -1 && val >= -26) {
      quickVal.textContent = `${val} (Kecil)`;
    } else {
      quickVal.textContent = `${val} (?)`;
    }
  });
}

// --- 12. SCRATCHPAD CANVAS & INVERSE SANDBOX ---
function initScratchpadCanvas() {
  const sCanvas = document.getElementById('scratchCanvas');
  const sCtx = sCanvas.getContext('2d');
  let isDrawing = false;
  let currentColor = '#fde047';
  let currentSize = 4;
  let isEraser = false;

  function resizeScratchCanvas() {
    const rect = sCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = window.devicePixelRatio || 1;
    const newWidth = Math.round(rect.width * dpr);
    const newHeight = Math.round(rect.height * dpr);
    if (sCanvas.width === newWidth && sCanvas.height === newHeight) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sCanvas.width;
    tempCanvas.height = sCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (sCanvas.width > 0 && sCanvas.height > 0) {
      tempCtx.drawImage(sCanvas, 0, 0);
    }

    sCanvas.width = newWidth;
    sCanvas.height = newHeight;
    sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sCtx.lineCap = 'round';
    sCtx.lineJoin = 'round';

    if (tempCanvas.width > 0 && tempCanvas.height > 0) {
      sCtx.drawImage(tempCanvas, 0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
    }
  }

  document.querySelectorAll('.color-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      isEraser = false;
      currentColor = btn.dataset.color;
      document.querySelectorAll('.color-picker-btn').forEach(b => b.classList.remove('ring-2', 'ring-white'));
      btn.classList.add('ring-2', 'ring-white');
    });
  });

  document.getElementById('brushSize').addEventListener('input', (e) => {
    currentSize = parseInt(e.target.value);
  });

  document.getElementById('btnCanvasEraser').addEventListener('click', () => {
    isEraser = true;
    document.querySelectorAll('.color-picker-btn').forEach(b => b.classList.remove('ring-2', 'ring-white'));
  });

  document.getElementById('btnCanvasClear').addEventListener('click', () => {
    sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
  });

  function getCoords(e) {
    const rect = sCanvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function startDraw(e) {
    isDrawing = true;
    const c = getCoords(e);
    sCtx.beginPath();
    sCtx.moveTo(c.x, c.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    const c = getCoords(e);
    sCtx.strokeStyle = isEraser ? '#0f1420' : currentColor;
    sCtx.lineWidth = isEraser ? currentSize * 3 : currentSize;
    sCtx.lineTo(c.x, c.y);
    sCtx.stroke();
  }

  function stopDraw() {
    isDrawing = false;
  }

  sCanvas.addEventListener('mousedown', startDraw);
  sCanvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  sCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDraw(e);
  }, { passive: false });
  sCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
  }, { passive: false });
  window.addEventListener('touchend', stopDraw);
  window.addEventListener('touchcancel', stopDraw);

  // Tab switcher
  const tabBtnCanvas = document.getElementById('tabBtnCanvas');
  const tabBtnCalc = document.getElementById('tabBtnCalc');
  const panelCanvas = document.getElementById('panelCanvas');
  const panelCalc = document.getElementById('panelCalc');

  tabBtnCanvas.addEventListener('click', () => {
    tabBtnCanvas.className = 'px-3 py-1.5 rounded-lg bg-amber-500 text-black font-semibold text-xs transition-all';
    tabBtnCalc.className = 'px-3 py-1.5 rounded-lg bg-temple-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-all';
    panelCanvas.classList.remove('hidden');
    panelCalc.classList.add('hidden');
    resizeScratchCanvas();
  });

  tabBtnCalc.addEventListener('click', () => {
    tabBtnCalc.className = 'px-3 py-1.5 rounded-lg bg-amber-500 text-black font-semibold text-xs transition-all';
    tabBtnCanvas.className = 'px-3 py-1.5 rounded-lg bg-temple-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-all';
    panelCalc.classList.remove('hidden');
    panelCanvas.classList.add('hidden');
  });

  // Inverse calculators with live formula parsing
  const sbLinearFormula = document.getElementById('sandboxLinearFormula');
  sbLinearFormula?.addEventListener('input', () => {
    const parsed = parseLinearExpression(sbLinearFormula.value);
    if (parsed) {
      document.getElementById('sandboxA').value = parsed.a;
      document.getElementById('sandboxB').value = parsed.b;
    }
  });

  document.getElementById('btnCalcLinear')?.addEventListener('click', () => {
    const a = parseFloat(document.getElementById('sandboxA').value) || 1;
    const b = parseFloat(document.getElementById('sandboxB').value) || 0;
    const y = parseFloat(document.getElementById('sandboxYLinear').value) || 0;
    if (a === 0) {
      document.getElementById('resultLinear').innerHTML = '<span class="text-rose-400 font-bold">⚠️ Koefisien a tidak boleh 0!</span>';
      return;
    }
    const x = (y - b) / a;
    const roundedX = Math.round(x);
    const char = (roundedX === 0) ? '[SPASI]' : numToChar(roundedX);
    let typeLabel = '';
    if (roundedX >= 1 && roundedX <= 26) typeLabel = ' <span class="text-xs text-amber-300">(Kapital)</span>';
    else if (roundedX <= -1 && roundedX >= -26) typeLabel = ' <span class="text-xs text-sky-300">(Kecil)</span>';
    else if (roundedX === 0) typeLabel = ' <span class="text-xs text-amber-400">(Spasi)</span>';

    document.getElementById('resultLinear').innerHTML = 
      `Hasil: x = (${y} - ${b}) / ${a} = <strong>${x.toFixed(2)}</strong> (Bulat: ${roundedX}) ➔ Huruf: <strong class="text-amber-400 font-bold">${char}</strong>${typeLabel}`;
  });

  const sbCompFormula = document.getElementById('sandboxCompFormula');
  sbCompFormula?.addEventListener('input', () => {
    const parsed = parseLinearExpression(sbCompFormula.value);
    if (parsed) {
      if (parsed.isComposition) {
        document.getElementById('compA').value = parsed.innerA;
        document.getElementById('compB').value = parsed.innerB;
        document.getElementById('compC').value = parsed.cVal;
        document.getElementById('compD').value = parsed.dVal;
      } else {
        document.getElementById('compC').value = 1;
        document.getElementById('compD').value = 0;
        document.getElementById('compA').value = parsed.a;
        document.getElementById('compB').value = parsed.b;
      }
    }
  });

  document.getElementById('btnCalcComp')?.addEventListener('click', () => {
    const a = parseFloat(document.getElementById('compA').value) || 1;
    const b = parseFloat(document.getElementById('compB').value) || 0;
    const c = parseFloat(document.getElementById('compC').value) || 1;
    const d = parseFloat(document.getElementById('compD').value) || 0;
    const y = parseFloat(document.getElementById('sandboxYComp').value) || 0;

    const ca = c * a;
    const cbPlusD = c * b + d;
    if (ca === 0) {
      document.getElementById('resultComp').innerHTML = '<span class="text-rose-400 font-bold">⚠️ Koefisien gabungan x tidak boleh 0!</span>';
      return;
    }
    const x = (y - cbPlusD) / ca;
    const roundedX = Math.round(x);
    const char = (roundedX === 0) ? '[SPASI]' : numToChar(roundedX);
    let typeLabel = '';
    if (roundedX >= 1 && roundedX <= 26) typeLabel = ' <span class="text-xs text-amber-300">(Kapital)</span>';
    else if (roundedX <= -1 && roundedX >= -26) typeLabel = ' <span class="text-xs text-sky-300">(Kecil)</span>';
    else if (roundedX === 0) typeLabel = ' <span class="text-xs text-amber-400">(Spasi)</span>';

    document.getElementById('resultComp').innerHTML = 
      `Bentuk: (g ∘ f)(x) = ${ca}x + ${cbPlusD}<br>Invers: x = (${y} - ${cbPlusD}) / ${ca} = <strong>${x.toFixed(2)}</strong> ➔ Huruf: <strong class="text-amber-400 font-bold">${char}</strong>${typeLabel}`;
  });

  window.addEventListener('resize', resizeScratchCanvas);
  setTimeout(resizeScratchCanvas, 300);
}

// --- 13. FREE FORMULA PARSER & DYNAMIC LIVE PREVIEWS ---

/**
 * Robust Linear & Composite Expression Parser
 * Supports:
 * - Simple linear: "x + 5", "x - 4", "2x + 3", "-3x + 7", "4x", "-x", "5"
 * - Functions with prefix: "f(x) = 2x - 3", "g(x) = x + 7", "(g ∘ f)(x) = 6x + 5"
 * - Composite format: "3(2x + 1) + 2", "4(2x + 3) + 1"
 */
function parseLinearExpression(str) {
  if (!str || typeof str !== 'string') return null;
  let clean = str.trim();
  // Strip function header e.g. "f(x) =", "g(x) =", "(g o f)(x) =", "(g ∘ f)(x) =", "y ="
  clean = clean.replace(/^[a-zA-Z\s\(\)\∘\o\.\*\-]+\s*=\s*/, '').trim();
  clean = clean.replace(/\s+/g, ''); // remove internal whitespace
  clean = clean.replace(/\*x/gi, 'x'); // convert *x -> x

  if (!clean) return null;

  // Composite pattern: c(ax + b) + d or c(ax - b) - d
  const compMatch = clean.match(/^([+-]?\d*(?:\.\d+)?)[*]?\(([+-]?\d*(?:\.\d+)?)[xX]([+-]\d+(?:\.\d+)?)?\)(?:([+-]\d+(?:\.\d+)?))?$/i);
  if (compMatch) {
    let cStr = compMatch[1];
    let aStr = compMatch[2];
    let bStr = compMatch[3];
    let dStr = compMatch[4];

    let c = 1;
    if (cStr === '-' || cStr === '-1') c = -1;
    else if (cStr && cStr !== '+') c = parseFloat(cStr);

    let a = 1;
    if (aStr === '' || aStr === '+') a = 1;
    else if (aStr === '-') a = -1;
    else a = parseFloat(aStr);

    let b = bStr ? parseFloat(bStr) : 0;
    let d = dStr ? parseFloat(dStr) : 0;

    if (!isNaN(c) && !isNaN(a) && !isNaN(b) && !isNaN(d)) {
      return {
        a: c * a,
        b: c * b + d,
        cVal: c,
        dVal: d,
        innerA: a,
        innerB: b,
        isComposition: true
      };
    }
  }

  // Standard case 1: ax + b or ax - b
  const m1 = clean.match(/^([+-]?\d*(?:\.\d+)?)[xX]([+-]\d+(?:\.\d+)?)?$/i);
  if (m1) {
    let aStr = m1[1];
    let bStr = m1[2];
    let a = 1;
    if (aStr === '' || aStr === '+') a = 1;
    else if (aStr === '-') a = -1;
    else a = parseFloat(aStr);

    let b = bStr ? parseFloat(bStr) : 0;
    if (!isNaN(a) && !isNaN(b)) {
      return { a, b };
    }
  }

  // Standard case 2: b + ax or b - ax
  const m2 = clean.match(/^([+-]?\d+(?:\.\d+)?)([+-]\d*(?:\.\d+)?)[xX]$/i);
  if (m2) {
    let b = parseFloat(m2[1]);
    let aStr = m2[2];
    let a = 1;
    if (aStr === '+' || aStr === '') a = 1;
    else if (aStr === '-') a = -1;
    else a = parseFloat(aStr);

    if (!isNaN(a) && !isNaN(b)) {
      return { a, b };
    }
  }

  // Constant only
  const m3 = clean.match(/^([+-]?\d+(?:\.\d+)?)$/);
  if (m3) {
    return { a: 0, b: parseFloat(m3[1]) };
  }

  return null;
}

function formatLinearExpr(a, b, varName = 'x') {
  let expr = '';
  if (a === 1) expr = varName;
  else if (a === -1) expr = `-${varName}`;
  else expr = `${a}${varName}`;

  if (b > 0) expr += ` + ${b}`;
  else if (b < 0) expr += ` - ${Math.abs(b)}`;
  return expr;
}

function formatLinearFormula(a, b, varName = 'x', funcName = 'f') {
  return `${funcName}(${varName}) = ${formatLinearExpr(a, b, varName)}`;
}

function formatLinearInverse(a, b, varName = 'y', funcName = 'f') {
  if (a === 0) return 'Tidak memiliki invers (a = 0)';
  
  if (a === 1) {
    if (b > 0) return `${funcName}⁻¹(${varName}) = ${varName} - ${b}`;
    if (b < 0) return `${funcName}⁻¹(${varName}) = ${varName} + ${Math.abs(b)}`;
    return `${funcName}⁻¹(${varName}) = ${varName}`;
  }
  if (a === -1) {
    if (b > 0) return `${funcName}⁻¹(${varName}) = -${varName} + ${b}`;
    if (b < 0) return `${funcName}⁻¹(${varName}) = -${varName} - ${Math.abs(b)}`;
    return `${funcName}⁻¹(${varName}) = -${varName}`;
  }

  let top = '';
  if (b > 0) top = `${varName} - ${b}`;
  else if (b < 0) top = `${varName} + ${Math.abs(b)}`;
  else top = `${varName}`;

  return `${funcName}⁻¹(${varName}) = (${top}) / ${a}`;
}

function formatLinearExplanation(a, b, funcName = 'f') {
  if (a === 0) return 'Perhatian: koefisien x bernilai 0 sehingga tidak memiliki nilai invers satu-satu!';
  if (a === 1) {
    if (b > 0) return `Kurangkan setiap angka sandi dengan ${b} untuk mendapatkan nilai huruf asli.`;
    if (b < 0) return `Tambahkan setiap angka sandi dengan ${Math.abs(b)} untuk mendapatkan nilai huruf asli.`;
    return `Nilai angka sandi sama persis dengan kode huruf asli.`;
  }
  let step1 = b > 0 ? `Kurangkan setiap angka dengan ${b}` : (b < 0 ? `Tambahkan setiap angka dengan ${Math.abs(b)}` : `Ambil angka sandi`);
  return `${step1}, lalu bagi hasilnya dengan ${a}.`;
}

function updateCustomPreviews() {
  // --- PINTU 1 ---
  const t1 = document.getElementById('customDoor1Text')?.value || '';
  const a1 = parseFloat(document.getElementById('customDoor1A')?.value) || 1;
  const b1 = parseFloat(document.getElementById('customDoor1B')?.value) || 0;
  const formula1Str = formatLinearFormula(a1, b1, 'x', 'f');
  const inv1Str = formatLinearInverse(a1, b1, 'y', 'f');
  const expl1Str = formatLinearExplanation(a1, b1, 'f');
  
  const badgeF1 = document.getElementById('badgeFormula1');
  if (badgeF1) badgeF1.textContent = formula1Str;
  const invF1 = document.getElementById('previewInverse1');
  if (invF1) invF1.textContent = inv1Str;
  const explF1 = document.getElementById('previewExpl1');
  if (explF1) explF1.textContent = expl1Str;
  
  const valid1 = document.getElementById('badgeValid1');
  if (valid1) {
    if (a1 === 0) {
      valid1.className = 'text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-700/60';
      valid1.textContent = '⚠️ a tidak boleh 0';
    } else {
      valid1.className = 'text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/60';
      valid1.textContent = '✓ Valid';
    }
  }
  const c1 = encodeText(t1, x => a1 * x + b1);
  const prevC1 = document.getElementById('previewCipher1');
  if (prevC1) prevC1.textContent = `[ ${c1.join(', ')} ]`;

  // --- PINTU 2 ---
  const t2 = document.getElementById('customDoor2Text')?.value || '';
  const a2 = parseFloat(document.getElementById('customDoor2A')?.value) || 1;
  const b2 = parseFloat(document.getElementById('customDoor2B')?.value) || 0;
  const formula2Str = formatLinearFormula(a2, b2, 'x', 'f');
  const inv2Str = formatLinearInverse(a2, b2, 'y', 'f');
  const expl2Str = formatLinearExplanation(a2, b2, 'f');
  
  const badgeF2 = document.getElementById('badgeFormula2');
  if (badgeF2) badgeF2.textContent = formula2Str;
  const invF2 = document.getElementById('previewInverse2');
  if (invF2) invF2.textContent = inv2Str;
  const explF2 = document.getElementById('previewExpl2');
  if (explF2) explF2.textContent = expl2Str;

  const valid2 = document.getElementById('badgeValid2');
  if (valid2) {
    if (a2 === 0) {
      valid2.className = 'text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-700/60';
      valid2.textContent = '⚠️ a tidak boleh 0';
    } else {
      valid2.className = 'text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/60';
      valid2.textContent = '✓ Valid';
    }
  }
  const c2 = encodeText(t2, x => a2 * x + b2);
  const prevC2 = document.getElementById('previewCipher2');
  if (prevC2) prevC2.textContent = `[ ${c2.join(', ')} ]`;

  // --- PINTU 3 ---
  const t3 = document.getElementById('customDoor3Text')?.value || '';
  const a3 = parseFloat(document.getElementById('customDoor3A')?.value) || 1;
  const b3 = parseFloat(document.getElementById('customDoor3B')?.value) || 0;
  const c3 = parseFloat(document.getElementById('customDoor3C')?.value) || 1;
  const d3 = parseFloat(document.getElementById('customDoor3D')?.value) || 0;
  const A3 = c3 * a3;
  const B3 = c3 * b3 + d3;

  const comp3Str = `(g ∘ f)(x) = ${formatLinearExpr(A3, B3, 'x')}`;
  const inv3Str = formatLinearInverse(A3, B3, 'y', '(g ∘ f)');
  const expl3Str = `Gabungan fungsi: ${c3}(${formatLinearExpr(a3, b3)}) ${d3 >= 0 ? '+ ' + d3 : '- ' + Math.abs(d3)} = ${formatLinearExpr(A3, B3)}. Invers: ${formatLinearExplanation(A3, B3, '(g ∘ f)')}`;

  const badgeF3 = document.getElementById('badgeFormula3');
  if (badgeF3) badgeF3.textContent = comp3Str;
  const prevComp3 = document.getElementById('previewComp3');
  if (prevComp3) prevComp3.textContent = comp3Str;
  const invF3 = document.getElementById('previewInverse3');
  if (invF3) invF3.textContent = inv3Str;
  const explF3 = document.getElementById('previewExpl3');
  if (explF3) explF3.textContent = expl3Str;

  const valid3 = document.getElementById('badgeValid3');
  if (valid3) {
    if (A3 === 0) {
      valid3.className = 'text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-700/60';
      valid3.textContent = '⚠️ Koefisien x bernilai 0';
    } else {
      valid3.className = 'text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/60';
      valid3.textContent = '✓ Valid';
    }
  }
  const cip3 = encodeText(t3, x => A3 * x + B3);
  const prevC3 = document.getElementById('previewCipher3');
  if (prevC3) prevC3.textContent = `[ ${cip3.join(', ')} ]`;

  // --- PINTU 4 (BOSS LEVEL) ---
  const t4 = document.getElementById('customDoor4Text')?.value || '';
  const a4 = parseFloat(document.getElementById('customDoor4A')?.value) || 1;
  const b4 = parseFloat(document.getElementById('customDoor4B')?.value) || 0;
  const c4 = parseFloat(document.getElementById('customDoor4C')?.value) || 1;
  const d4 = parseFloat(document.getElementById('customDoor4D')?.value) || 0;
  const A4 = c4 * a4;
  const B4 = c4 * b4 + d4;

  const comp4Str = `(g ∘ f)(x) = ${formatLinearExpr(A4, B4, 'x')}`;
  const inv4Str = formatLinearInverse(A4, B4, 'y', '(g ∘ f)');
  const expl4Str = `Komposisi boss: ${c4}(${formatLinearExpr(a4, b4)}) ${d4 >= 0 ? '+ ' + d4 : '- ' + Math.abs(d4)} = ${formatLinearExpr(A4, B4)}. Invers: ${formatLinearExplanation(A4, B4, '(g ∘ f)')}`;

  const badgeF4 = document.getElementById('badgeFormula4');
  if (badgeF4) badgeF4.textContent = comp4Str;
  const prevComp4 = document.getElementById('previewComp4');
  if (prevComp4) prevComp4.textContent = comp4Str;
  const invF4 = document.getElementById('previewInverse4');
  if (invF4) invF4.textContent = inv4Str;
  const explF4 = document.getElementById('previewExpl4');
  if (explF4) explF4.textContent = expl4Str;

  const valid4 = document.getElementById('badgeValid4');
  if (valid4) {
    if (A4 === 0) {
      valid4.className = 'text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-700/60';
      valid4.textContent = '⚠️ Koefisien x bernilai 0';
    } else {
      valid4.className = 'text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/60';
      valid4.textContent = '✓ Valid';
    }
  }
  const cip4 = encodeText(t4, x => A4 * x + B4);
  const prevC4 = document.getElementById('previewCipher4');
  if (prevC4) prevC4.textContent = `[ ${cip4.join(', ')} ]`;
}

function initCustomDuelListeners() {
  // Synchronization for Door 1
  const formula1Input = document.getElementById('customDoor1Formula');
  formula1Input?.addEventListener('input', () => {
    const parsed = parseLinearExpression(formula1Input.value);
    if (parsed) {
      document.getElementById('customDoor1A').value = parsed.a;
      document.getElementById('customDoor1B').value = parsed.b;
      updateCustomPreviews();
    }
  });

  ['customDoor1A', 'customDoor1B'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      const a = parseFloat(document.getElementById('customDoor1A').value) || 1;
      const b = parseFloat(document.getElementById('customDoor1B').value) || 0;
      if (document.activeElement !== formula1Input && formula1Input) {
        formula1Input.value = formatLinearFormula(a, b, 'x', 'f');
      }
      updateCustomPreviews();
    });
  });

  // Synchronization for Door 2
  const formula2Input = document.getElementById('customDoor2Formula');
  formula2Input?.addEventListener('input', () => {
    const parsed = parseLinearExpression(formula2Input.value);
    if (parsed) {
      document.getElementById('customDoor2A').value = parsed.a;
      document.getElementById('customDoor2B').value = parsed.b;
      updateCustomPreviews();
    }
  });

  ['customDoor2A', 'customDoor2B'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      const a = parseFloat(document.getElementById('customDoor2A').value) || 1;
      const b = parseFloat(document.getElementById('customDoor2B').value) || 0;
      if (document.activeElement !== formula2Input && formula2Input) {
        formula2Input.value = formatLinearFormula(a, b, 'x', 'f');
      }
      updateCustomPreviews();
    });
  });

  // Synchronization for Door 3
  const formula3Input = document.getElementById('customDoor3Formula');
  formula3Input?.addEventListener('input', () => {
    const parsed = parseLinearExpression(formula3Input.value);
    if (parsed) {
      if (parsed.isComposition) {
        document.getElementById('customDoor3A').value = parsed.innerA;
        document.getElementById('customDoor3B').value = parsed.innerB;
        document.getElementById('customDoor3C').value = parsed.cVal;
        document.getElementById('customDoor3D').value = parsed.dVal;
      } else {
        document.getElementById('customDoor3C').value = 1;
        document.getElementById('customDoor3D').value = 0;
        document.getElementById('customDoor3A').value = parsed.a;
        document.getElementById('customDoor3B').value = parsed.b;
      }
      updateCustomPreviews();
    }
  });

  ['customDoor3A', 'customDoor3B', 'customDoor3C', 'customDoor3D'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      const a = parseFloat(document.getElementById('customDoor3A').value) || 1;
      const b = parseFloat(document.getElementById('customDoor3B').value) || 0;
      const c = parseFloat(document.getElementById('customDoor3C').value) || 1;
      const d = parseFloat(document.getElementById('customDoor3D').value) || 0;
      const A = c * a;
      const B = c * b + d;
      if (document.activeElement !== formula3Input && formula3Input) {
        formula3Input.value = `(g ∘ f)(x) = ${formatLinearExpr(A, B)}`;
      }
      updateCustomPreviews();
    });
  });

  // Synchronization for Door 4
  const formula4Input = document.getElementById('customDoor4Formula');
  formula4Input?.addEventListener('input', () => {
    const parsed = parseLinearExpression(formula4Input.value);
    if (parsed) {
      if (parsed.isComposition) {
        document.getElementById('customDoor4A').value = parsed.innerA;
        document.getElementById('customDoor4B').value = parsed.innerB;
        document.getElementById('customDoor4C').value = parsed.cVal;
        document.getElementById('customDoor4D').value = parsed.dVal;
      } else {
        document.getElementById('customDoor4C').value = 1;
        document.getElementById('customDoor4D').value = 0;
        document.getElementById('customDoor4A').value = parsed.a;
        document.getElementById('customDoor4B').value = parsed.b;
      }
      updateCustomPreviews();
    }
  });

  ['customDoor4A', 'customDoor4B', 'customDoor4C', 'customDoor4D'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      const a = parseFloat(document.getElementById('customDoor4A').value) || 1;
      const b = parseFloat(document.getElementById('customDoor4B').value) || 0;
      const c = parseFloat(document.getElementById('customDoor4C').value) || 1;
      const d = parseFloat(document.getElementById('customDoor4D').value) || 0;
      const A = c * a;
      const B = c * b + d;
      if (document.activeElement !== formula4Input && formula4Input) {
        formula4Input.value = `(g ∘ f)(x) = ${formatLinearExpr(A, B)}`;
      }
      updateCustomPreviews();
    });
  });

  // Text inputs listener
  ['customDoor1Text', 'customDoor2Text', 'customDoor3Text', 'customDoor4Text'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateCustomPreviews);
      el.addEventListener('change', updateCustomPreviews);
    }
  });

  // Preset chips click listeners
  document.querySelectorAll('.formula-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const door = chip.dataset.door;
      const formula = chip.dataset.formula;
      if (door === '1' || door === '2') {
        const formulaInput = document.getElementById(`customDoor${door}Formula`);
        if (formulaInput) formulaInput.value = formula;
        const parsed = parseLinearExpression(formula);
        if (parsed) {
          document.getElementById(`customDoor${door}A`).value = parsed.a;
          document.getElementById(`customDoor${door}B`).value = parsed.b;
        }
      } else if (door === '3' || door === '4') {
        const formulaInput = document.getElementById(`customDoor${door}Formula`);
        if (formulaInput) formulaInput.value = formula;
        if (chip.dataset.a !== undefined) {
          document.getElementById(`customDoor${door}A`).value = chip.dataset.a;
          document.getElementById(`customDoor${door}B`).value = chip.dataset.b;
          document.getElementById(`customDoor${door}C`).value = chip.dataset.c;
          document.getElementById(`customDoor${door}D`).value = chip.dataset.d;
        } else {
          const parsed = parseLinearExpression(formula);
          if (parsed) {
            document.getElementById(`customDoor${door}C`).value = 1;
            document.getElementById(`customDoor${door}D`).value = 0;
            document.getElementById(`customDoor${door}A`).value = parsed.a;
            document.getElementById(`customDoor${door}B`).value = parsed.b;
          }
        }
      }
      updateCustomPreviews();
    });
  });

  updateCustomPreviews();
}


// --- 14. MOBILE TOUCH CONTROLS & VIRTUAL D-PAD ---
function setupTouchControls() {
  const bindTouch = (btnId, keyName) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const startHandler = (e) => {
      e.preventDefault();
      keys[keyName] = true;
      btn.classList.add('pressed');
    };
    const endHandler = (e) => {
      keys[keyName] = false;
      btn.classList.remove('pressed');
    };

    btn.addEventListener('mousedown', startHandler);
    btn.addEventListener('mouseleave', endHandler);
    btn.addEventListener('touchstart', startHandler, { passive: false });
    btn.addEventListener('touchend', endHandler, { passive: false });
    btn.addEventListener('touchcancel', endHandler, { passive: false });
  };

  bindTouch('btnTouchUp', 'ArrowUp');
  bindTouch('btnTouchDown', 'ArrowDown');
  bindTouch('btnTouchLeft', 'ArrowLeft');
  bindTouch('btnTouchRight', 'ArrowRight');

  const releaseAllTouch = () => {
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(k => { keys[k] = false; });
    document.querySelectorAll('.touch-btn').forEach(b => b.classList.remove('pressed'));
  };

  window.addEventListener('mouseup', releaseAllTouch);
  window.addEventListener('touchend', releaseAllTouch);
  window.addEventListener('touchcancel', releaseAllTouch);

  // Touch Action Button (Interacting with Pedestal / Door)
  const actionBtn = document.getElementById('btnTouchInteract');
  if (actionBtn) {
    actionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleInteractAction();
    });
  }
}

// Interact Action (Triggered by E, Space, or Action Button)
function handleInteractAction() {
  const gameStage = document.getElementById('viewGameStage');
  if (!gameStage || gameStage.classList.contains('hidden') || gameState.isFinished) return;
  if (!gameState.doorsData || !gameState.doorsData[gameState.currentDoor - 1]) return;
  if (isAnyModalOpen()) return;

  const map = chamberMaps[gameState.currentDoor];
  if (!map) return;
  const dist = Math.hypot(player.x - map.pedestalX, player.y - map.pedestalY);
  if (dist < 75 && !gameState.doorOpen && !gameState.isDecryptionModalOpen) {
    openDecryptionModal();
  }
}


// --- 15. GLOBAL EVENT LISTENERS & INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initRosettaStone();
  initScratchpadCanvas();
  initCustomDuelListeners();
  setupTouchControls();
  updateHUDHealth();

  // Keyboard Event Listeners for 2D Movement
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeActiveModalOnEscape();
      return;
    }

    // If typing in any input, textarea, or select, don't hijack keys!
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;
    
    // Only capture movement keys if actively playing in viewGameStage
    const gameStage = document.getElementById('viewGameStage');
    if (!gameStage || gameStage.classList.contains('hidden') || gameState.isFinished || isAnyModalOpen()) return;

    if (e.key in keys) {
      keys[e.key] = true;
      e.preventDefault();
    }
    if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
      handleInteractAction();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key in keys) {
      keys[e.key] = false;
    }
  });

  window.addEventListener('blur', () => {
    resetKeys();
  });

  // Team Selector
  const teamSelect = document.getElementById('selectTeamPreset');
  const customTeamInput = document.getElementById('inputCustomTeamName');
  teamSelect.addEventListener('change', (e) => {
    if (e.target.value === 'Kustom') {
      customTeamInput.classList.remove('hidden');
      customTeamInput.focus();
    } else {
      customTeamInput.classList.add('hidden');
    }
  });

  // Start Auto Mode
  document.getElementById('btnStartAutoMode').addEventListener('click', () => {
    sound.init();
    resetKeys();
    let team = teamSelect.value;
    if (team === 'Kustom') {
      team = customTeamInput.value.trim() || 'Tim Ekspedisi C';
    }
    gameState.mode = 'auto';
    gameState.teamName = team;
    gameState.doorsData = generateAutoDoors();
    gameState.hintUsed = false;
    gameState.isFinished = false;
    gameState.trapResetsCount = 0;
    gameState.solutionLogs = [];
    const compassBadge = document.getElementById('compassUsageBadge');
    if (compassBadge) compassBadge.textContent = '1x';

    document.getElementById('viewHome').classList.add('hidden');
    document.getElementById('viewGameStage').classList.remove('hidden');
    document.getElementById('topGameBar').classList.remove('hidden');
    document.getElementById('activeTeamName').textContent = team;
    document.getElementById('badgeMode').textContent = 'Ekspedisi Langsung';

    resetStopwatch();
    startStopwatch();
    setChamber(1, true);
  });

  // Open Custom Setup
  const openCustomSetup = () => {
    sound.init();
    resetKeys();
    document.getElementById('viewHome').classList.add('hidden');
    document.getElementById('viewCustomSetup').classList.remove('hidden');
    updateCustomPreviews();
  };

  document.getElementById('btnOpenCustomSetup')?.addEventListener('click', openCustomSetup);
  document.getElementById('btnHomeCustomize')?.addEventListener('click', openCustomSetup);

  document.getElementById('btnCancelCustomSetup')?.addEventListener('click', () => {
    resetKeys();
    document.getElementById('viewCustomSetup').classList.add('hidden');
    document.getElementById('viewHome').classList.remove('hidden');
  });

  // Helper to build validated custom doors data
  function buildCustomDoorsData() {
    const w1 = cleanString(document.getElementById('customDoor1Text')?.value || '');
    const w2 = cleanString(document.getElementById('customDoor2Text')?.value || '');
    const w3 = cleanString(document.getElementById('customDoor3Text')?.value || '');
    const w4 = cleanString(document.getElementById('customDoor4Text')?.value || '');

    if (!w1) {
      alert("Teks untuk Pintu 1 tidak boleh kosong!");
      document.getElementById('customDoor1Text')?.focus();
      return null;
    }
    if (!w2) {
      alert("Teks untuk Pintu 2 tidak boleh kosong!");
      document.getElementById('customDoor2Text')?.focus();
      return null;
    }
    if (!w3) {
      alert("Teks untuk Pintu 3 tidak boleh kosong!");
      document.getElementById('customDoor3Text')?.focus();
      return null;
    }
    if (!w4) {
      alert("Teks untuk Pintu Utama (Boss Level) tidak boleh kosong!");
      document.getElementById('customDoor4Text')?.focus();
      return null;
    }

    const a1 = parseFloat(document.getElementById('customDoor1A')?.value) || 1;
    const b1 = parseFloat(document.getElementById('customDoor1B')?.value) || 0;
    if (a1 === 0) {
      alert("Koefisien a untuk Pintu 1 tidak boleh 0 agar fungsi memiliki invers!");
      document.getElementById('customDoor1A')?.focus();
      return null;
    }

    const a2 = parseFloat(document.getElementById('customDoor2A')?.value) || 1;
    const b2 = parseFloat(document.getElementById('customDoor2B')?.value) || 0;
    if (a2 === 0) {
      alert("Koefisien a untuk Pintu 2 tidak boleh 0 agar fungsi memiliki invers!");
      document.getElementById('customDoor2A')?.focus();
      return null;
    }

    const a3 = parseFloat(document.getElementById('customDoor3A')?.value) || 1;
    const b3 = parseFloat(document.getElementById('customDoor3B')?.value) || 0;
    const c3 = parseFloat(document.getElementById('customDoor3C')?.value) || 1;
    const d3 = parseFloat(document.getElementById('customDoor3D')?.value) || 0;
    const A3 = c3 * a3;
    const B3 = c3 * b3 + d3;
    if (A3 === 0) {
      alert("Koefisien gabungan x untuk Pintu 3 tidak boleh 0 agar fungsi memiliki invers!");
      document.getElementById('customDoor3A')?.focus();
      return null;
    }

    const a4 = parseFloat(document.getElementById('customDoor4A')?.value) || 1;
    const b4 = parseFloat(document.getElementById('customDoor4B')?.value) || 0;
    const c4 = parseFloat(document.getElementById('customDoor4C')?.value) || 1;
    const d4 = parseFloat(document.getElementById('customDoor4D')?.value) || 0;
    const A4 = c4 * a4;
    const B4 = c4 * b4 + d4;
    if (A4 === 0) {
      alert("Koefisien gabungan x untuk Pintu 4 tidak boleh 0 agar fungsi memiliki invers!");
      document.getElementById('customDoor4A')?.focus();
      return null;
    }

    const formula1 = formatLinearFormula(a1, b1, 'x', 'f');
    const inv1 = formatLinearInverse(a1, b1, 'y', 'f');
    const expl1 = formatLinearExplanation(a1, b1, 'f');

    const formula2 = formatLinearFormula(a2, b2, 'x', 'f');
    const inv2 = formatLinearInverse(a2, b2, 'y', 'f');
    const expl2 = formatLinearExplanation(a2, b2, 'f');

    const formula3 = `(g ∘ f)(x) dengan f(x) = ${formatLinearExpr(a3, b3)} dan g(x) = ${formatLinearExpr(c3, d3)}`;
    const comp3 = `(g ∘ f)(x) = ${formatLinearExpr(A3, B3)}`;
    const inv3 = formatLinearInverse(A3, B3, 'y', '(g ∘ f)');
    const expl3 = `Gabungan fungsi: ${c3}(${formatLinearExpr(a3, b3)}) ${d3 >= 0 ? '+ ' + d3 : '- ' + Math.abs(d3)} = ${formatLinearExpr(A3, B3)}. Invers: ${formatLinearExplanation(A3, B3, '(g ∘ f)')}`;

    const formula4 = `(g ∘ f)(x) dengan f(x) = ${formatLinearExpr(a4, b4)} dan g(x) = ${formatLinearExpr(c4, d4)}`;
    const comp4 = `(g ∘ f)(x) = ${formatLinearExpr(A4, B4)}`;
    const inv4 = formatLinearInverse(A4, B4, 'y', '(g ∘ f)');
    const expl4 = `Komposisi boss: ${c4}(${formatLinearExpr(a4, b4)}) ${d4 >= 0 ? '+ ' + d4 : '- ' + Math.abs(d4)} = ${formatLinearExpr(A4, B4)}. Invers: ${formatLinearExplanation(A4, B4, '(g ∘ f)')}`;

    return [
      {
        doorNum: 1,
        name: "Gerbang Luar Kuil (Kustom)",
        difficulty: "Mudah",
        text: w1,
        type: "linear_simple",
        a: a1,
        b: b1,
        encryptFn: (x) => a1 * x + b1,
        formulaDisplay: formula1,
        inverseDisplay: inv1,
        explanation: expl1
      },
      {
        doorNum: 2,
        name: "Lorong Katakomba (Kustom)",
        difficulty: "Sedang",
        text: w2,
        type: "linear_standard",
        a: a2,
        b: b2,
        encryptFn: (x) => a2 * x + b2,
        formulaDisplay: formula2,
        inverseDisplay: inv2,
        explanation: expl2
      },
      {
        doorNum: 3,
        name: "Ruang Altar Kuno (Kustom)",
        difficulty: "Sulit",
        text: w3,
        type: "composition",
        f: { a: a3, b: b3 },
        g: { c: c3, d: d3 },
        encryptFn: (x) => A3 * x + B3,
        formulaDisplay: formula3,
        compSimplified: comp3,
        inverseDisplay: inv3,
        explanation: expl3
      },
      {
        doorNum: 4,
        name: "Ruang Relik Suci (Kustom Boss)",
        difficulty: "Boss Level",
        text: w4,
        type: "composition_boss",
        f: { a: a4, b: b4 },
        g: { c: c4, d: d4 },
        encryptFn: (x) => A4 * x + B4,
        formulaDisplay: formula4,
        compSimplified: comp4,
        inverseDisplay: inv4,
        explanation: expl4
      }
    ];
  }

  // Start Custom Solo Play (Direct 2D Play with Custom Formulas)
  document.getElementById('btnStartCustomSolo')?.addEventListener('click', () => {
    sound.init();
    resetKeys();
    const customDoors = buildCustomDoorsData();
    if (!customDoors) return;

    const challenger = document.getElementById('customChallengerTeam').value.trim() || 'Tim Ekspedisi';
    gameState.mode = 'custom';
    gameState.teamName = challenger;
    gameState.doorsData = customDoors;
    gameState.hintUsed = false;
    gameState.isFinished = false;
    gameState.trapResetsCount = 0;
    gameState.solutionLogs = [];
    const compassBadge = document.getElementById('compassUsageBadge');
    if (compassBadge) compassBadge.textContent = '1x';

    document.getElementById('viewCustomSetup').classList.add('hidden');
    document.getElementById('viewGameStage').classList.remove('hidden');
    document.getElementById('topGameBar').classList.remove('hidden');
    document.getElementById('activeTeamName').textContent = challenger;
    document.getElementById('badgeMode').textContent = 'Rumus Kustom 2D';

    resetStopwatch();
    startStopwatch();
    setChamber(1, true);
  });

  // Lock and Start Duel
  document.getElementById('btnLockAndStartDuel')?.addEventListener('click', () => {
    sound.init();
    resetKeys();
    const customDoors = buildCustomDoorsData();
    if (!customDoors) return;

    const challenger = document.getElementById('customChallengerTeam').value.trim() || 'Tim Ekspedisi A';
    const solver = document.getElementById('customSolverTeam').value.trim() || 'Tim Ekspedisi B';
    gameState.challengerTeam = challenger;
    gameState.solverTeam = solver;
    gameState.teamName = solver;
    gameState.doorsData = customDoors;

    document.getElementById('duelTargetTeamName').textContent = solver;
    document.getElementById('modalDuelLocked').classList.remove('hidden');
  });

  // Start Duel Phase 2
  document.getElementById('btnStartDuelPhase2')?.addEventListener('click', () => {
    resetKeys();
    document.getElementById('modalDuelLocked').classList.add('hidden');
    document.getElementById('viewCustomSetup').classList.add('hidden');
    document.getElementById('viewGameStage').classList.remove('hidden');
    document.getElementById('topGameBar').classList.remove('hidden');
    document.getElementById('activeTeamName').textContent = gameState.solverTeam;
    document.getElementById('badgeMode').textContent = 'Duel Kelas';

    gameState.mode = 'custom';
    gameState.hintUsed = false;
    gameState.isFinished = false;
    gameState.trapResetsCount = 0;
    gameState.solutionLogs = [];
    const compassBadge = document.getElementById('compassUsageBadge');
    if (compassBadge) compassBadge.textContent = '1x';

    resetStopwatch();
    startStopwatch();
    setChamber(1, true);
  });



  // Submit Answer
  document.getElementById('btnSubmitAnswer').addEventListener('click', checkAnswer);
  document.getElementById('inputPlaintextAnswer').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  });

  // Clear input
  document.getElementById('btnClearInput').addEventListener('click', () => {
    document.getElementById('inputPlaintextAnswer').value = '';
    document.getElementById('inputPlaintextAnswer').focus();
  });

  // Compass Hint
  document.getElementById('btnAncientCompass').addEventListener('click', useAncientCompass);

  // Close Decryption Modal
  document.getElementById('btnCloseDecryption').addEventListener('click', closeDecryptionModal);

  // Trap Reset Modal Confirm
  document.getElementById('btnConfirmTrapReset').addEventListener('click', confirmTrapReset);

  // Rosetta Stone Modal
  const rosettaModal = document.getElementById('modalRosetta');
  document.getElementById('btnOpenRosetta')?.addEventListener('click', () => rosettaModal?.classList.remove('hidden'));
  document.getElementById('btnCloseRosetta')?.addEventListener('click', () => rosettaModal?.classList.add('hidden'));
  document.getElementById('btnDismissRosetta')?.addEventListener('click', () => rosettaModal?.classList.add('hidden'));

  // Scratchpad Modal
  const scratchModal = document.getElementById('modalScratchpad');
  const openScratchpad = () => {
    scratchModal?.classList.remove('hidden');
    setTimeout(resizeScratchCanvas, 50);
  };
  document.getElementById('btnOpenScratchpad')?.addEventListener('click', openScratchpad);
  document.getElementById('btnOpenScratchpadInline')?.addEventListener('click', openScratchpad);
  document.getElementById('btnCloseScratchpad')?.addEventListener('click', () => scratchModal?.classList.add('hidden'));

  // Math Guide Modal
  const mathGuideModal = document.getElementById('modalMathGuide');
  document.getElementById('btnLearnConcepts')?.addEventListener('click', () => mathGuideModal?.classList.remove('hidden'));
  document.getElementById('btnQuickMathHelp')?.addEventListener('click', () => mathGuideModal?.classList.remove('hidden'));
  document.getElementById('btnCloseMathGuide')?.addEventListener('click', () => mathGuideModal?.classList.add('hidden'));

  // Audio Toggle
  const btnAudio = document.getElementById('btnAudioToggle');
  const iconOn = document.getElementById('iconAudioOn');
  const iconOff = document.getElementById('iconAudioOff');
  btnAudio?.addEventListener('click', () => {
    sound.init();
    sound.muted = !sound.muted;
    if (sound.muted) {
      iconOn?.classList.add('hidden');
      iconOff?.classList.remove('hidden');
    } else {
      iconOn?.classList.remove('hidden');
      iconOff?.classList.add('hidden');
    }
  });

  // Nav Home
  document.getElementById('btnNavHome')?.addEventListener('click', () => {
    if (confirm("Kembali ke Beranda? Progres ekspedisi saat ini akan terhenti.")) {
      pauseStopwatch();
      resetKeys();
      gameState.isFinished = false;
      document.getElementById('viewGameStage')?.classList.add('hidden');
      document.getElementById('viewCustomSetup')?.classList.add('hidden');
      document.getElementById('viewVictory')?.classList.add('hidden');
      document.getElementById('topGameBar')?.classList.add('hidden');
      document.getElementById('viewHome')?.classList.remove('hidden');
    }
  });

  // Play Again
  document.getElementById('btnPlayAgain')?.addEventListener('click', () => {
    sound.init();
    resetKeys();
    gameState.isFinished = false;
    document.getElementById('viewVictory')?.classList.add('hidden');
    if (gameState.mode === 'auto') {
      gameState.doorsData = generateAutoDoors();
    }
    gameState.hintUsed = false;
    gameState.trapResetsCount = 0;
    gameState.solutionLogs = [];
    const compassBadge = document.getElementById('compassUsageBadge');
    if (compassBadge) compassBadge.textContent = '1x';
    document.getElementById('viewGameStage')?.classList.remove('hidden');
    resetStopwatch();
    startStopwatch();
    setChamber(1, true);
  });

  document.getElementById('btnSwitchToDuel')?.addEventListener('click', () => {
    sound.init();
    resetKeys();
    gameState.isFinished = false;
    document.getElementById('viewVictory')?.classList.add('hidden');
    document.getElementById('topGameBar')?.classList.add('hidden');
    document.getElementById('viewCustomSetup')?.classList.remove('hidden');
    updateCustomPreviews();
  });

  // Toggle Touch D-Pad on Large Screens / Tablets
  const btnToggleTouch = document.getElementById('btnToggleTouchControls');
  const touchContainer = document.getElementById('touchControlsContainer');
  btnToggleTouch?.addEventListener('click', () => {
    if (touchContainer) {
      touchContainer.classList.toggle('force-show');
    }
  });

  // Canvas Click-to-Interact with Pedestal
  if (canvas) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const scaleX = VIRTUAL_WIDTH / rect.width;
      const scaleY = VIRTUAL_HEIGHT / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;
      const map = chamberMaps[gameState.currentDoor];
      const distToPedestal = Math.hypot(clickX - map.pedestalX, clickY - map.pedestalY);
      const distPlayerToPedestal = Math.hypot(player.x - map.pedestalX, player.y - map.pedestalY);
      if (distToPedestal < 60 && distPlayerToPedestal < 90 && !gameState.doorOpen && !gameState.isDecryptionModalOpen) {
        openDecryptionModal();
      }
    });
  }

  // Start 2D Animation Loop
  requestAnimationFrame(gameLoop);
});
