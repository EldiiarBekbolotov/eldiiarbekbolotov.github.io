function letterchunk(letter, index, totalLetters, nChunks = 5) {
  let container = document.getElementsByClassName("network")[0];
  let totalDuration =
    4000 + (nChunks - 1) * 150 + (totalLetters - 1) * 100 + 1500;

  for (let i = 0; i < nChunks; i++) {
    let span = document.createElement("span");
    span.classList.add("chunk");
    span.innerText = letter;
    container.appendChild(span);

    let startX = Math.random() * window.innerWidth;
    let startY = Math.random() * window.innerHeight;
    let finalX = (index - totalLetters / 2) * 30 + window.innerWidth / 2;
    if (window.innerWidth < 600) {
      finalX = (index - totalLetters / 2) * 20 + window.innerWidth / 2;
    }
    if (window.innerWidth < 400) {
      finalX = (index - totalLetters / 2) * 15 + window.innerWidth / 2;
    }
    let finalY = window.innerHeight / 2;

    span.style.left = `${startX}px`;
    span.style.top = `${startY}px`;

    setTimeout(
      () => {
        span.style.opacity = 0.9;
        span.style.left = `${finalX}px`;
        span.style.top = `${finalY}px`;
        span.style.color =
          i % 2 === 0 ? "rgb(255, 255, 255, 0.5)" : "rgb(255, 255, 255,0.5)";
      },
      i * 150 + index * 100,
    );

    setTimeout(
      () => {
        let scatterX = finalX + (Math.random() - 0.5) * 1000;
        let scatterY = finalY + (Math.random() - 0.5) * 1000;

        span.style.transition = "all 1.5s ease-out";
        span.style.left = `${scatterX}px`;
        span.style.top = `${scatterY}px`;
        span.style.opacity = 0;
        span.style.transform = `rotate(${
          (Math.random() - 0.5) * 360
        }deg) scale(0)`;

        setTimeout(() => {
          span.remove();
          if (container.children.length === 1) {
            setTimeout(() => {
              document.getElementById("logo-scene").style.opacity = 0;
              document.getElementById("web-content").style.display = "block";
              setTimeout(() => {
                document.getElementById("web-content").style.opacity = 1;
                setTimeout(() => {
                  document.getElementById("logo-scene").style.display = "none";
                }, 100);
              }, 50);
            }, 50);
          }
        }, 1500);
      },
      4000 + i * 150 + index * 100,
    );
  }
}

function animateText(text) {
  for (let i = 0; i < text.length; i++) {
    letterchunk(text[i], i, text.length);
  }
}

// Pixelated Murky Pond - drop this into your page
// Requires a <canvas id="pondCanvas"> element

const PIXEL = 6; // pixel block size — increase for chunkier, decrease for finer

const canvas = document.getElementById("pondCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Low-res offscreen canvas — everything is drawn here then scaled up
const lo = document.createElement("canvas");
const loCtx = lo.getContext("2d");
loCtx.imageSmoothingEnabled = false;

// Grain texture canvas (128x128, regenerated every frame)
const gCanvas = document.createElement("canvas");
gCanvas.width = gCanvas.height = 128;
const gCtx = gCanvas.getContext("2d");
let gData = gCtx.createImageData(128, 128);

let W = 0,
  H = 0,
  LW = 0,
  LH = 0;
let mouseX = null,
  mouseY = null;

function initCanvas() {
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = false;

  LW = Math.ceil(W / PIXEL);
  LH = Math.ceil(H / PIXEL);
  lo.width = LW;
  lo.height = LH;
  loCtx.imageSmoothingEnabled = false;
}

initCanvas();
window.addEventListener("resize", initCanvas);

// Colour palette — matches your original
const palette = [
  [208, 136, 77], // orange/peach (primary)
  [254, 176, 112], // lighter orange (hover)
  [138, 43, 226], // purple
  [64, 224, 208], // turquoise
];

// Particles
const NUM = 140;
const parts = [];
for (let i = 0; i < NUM; i++) {
  const ci = (Math.random() * palette.length) | 0;
  const [r, g, b] = palette[ci];
  const vr = 35;
  const pr = Math.max(
    0,
    Math.min(255, r + ((Math.random() * vr * 2 - vr) | 0)),
  );
  const pg = Math.max(
    0,
    Math.min(255, g + ((Math.random() * vr * 2 - vr) | 0)),
  );
  const pb = Math.max(
    0,
    Math.min(255, b + ((Math.random() * vr * 2 - vr) | 0)),
  );
  const ti = (Math.random() * palette.length) | 0;
  const [tr, tg, tb] = palette[ti];
  parts.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 90 + 90,
    opacity: Math.random() * 0.05 + 0.025,
    baseR: pr,
    baseG: pg,
    baseB: pb,
    targetR: tr,
    targetG: tg,
    targetB: tb,
    colorProgress: Math.random(),
    colorSpeed: Math.random() * 0.003 + 0.001,
    angle: Math.random() * Math.PI * 2,
    angleSpeed: (Math.random() - 0.5) * 0.002,
    r: pr,
    g: pg,
    b: pb,
  });
}

// Regenerate film grain texture every frame
function updateGrain() {
  const d = gData.data;
  for (let i = 0; i < d.length; i += 4) {
    if (Math.random() > 0.55) {
      const bright = Math.random();
      if (bright > 0.85) {
        // Warm-tinted bright grain
        d[i] = 220 + Math.random() * 35;
        d[i + 1] = 180 + Math.random() * 40;
        d[i + 2] = 100 + Math.random() * 80;
        d[i + 3] = Math.random() * 28 + 6;
      } else if (bright > 0.6) {
        // Neutral grain
        const v = Math.random() * 180;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = Math.random() * 18 + 4;
      } else {
        // Dark grain
        d[i] = 0;
        d[i + 1] = 0;
        d[i + 2] = 0;
        d[i + 3] = Math.random() * 22 + 5;
      }
    } else {
      d[i + 3] = 0;
    }
  }
  gCtx.putImageData(gData, 0, 0);
}

function update() {
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];

    // Smooth colour transition between palette entries
    p.colorProgress += p.colorSpeed;
    if (p.colorProgress >= 1) {
      p.colorProgress = 0;
      const ni = (Math.random() * palette.length) | 0;
      p.baseR = p.targetR;
      p.baseG = p.targetG;
      p.baseB = p.targetB;
      p.targetR = palette[ni][0];
      p.targetG = palette[ni][1];
      p.targetB = palette[ni][2];
    }
    const t = 0.5 - 0.5 * Math.cos(p.colorProgress * Math.PI);
    p.r = (p.baseR + (p.targetR - p.baseR) * t) | 0;
    p.g = (p.baseG + (p.targetG - p.baseG) * t) | 0;
    p.b = (p.baseB + (p.targetB - p.baseB) * t) | 0;

    // Movement
    p.angle += p.angleSpeed;
    p.x += Math.cos(p.angle) * 0.45;
    p.y += Math.sin(p.angle) * 1.45;
    if (p.x < -p.size) p.x = W + p.size;
    if (p.x > W + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = H + p.size;
    if (p.y > H + p.size) p.y = -p.size;

    // Mouse attraction
    if (mouseX !== null) {
      const dx = mouseX - p.x,
        dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mRad = 100;
      if (dist < mRad) {
        const f = 1 - dist / mRad;
        p.x += dx * f * 0.05;
        p.y += dy * f * 0.05;
      }
    }
  }
}

function draw() {
  // 1. Draw blobs onto the low-res canvas
  loCtx.fillStyle = "rgb(0,0,0)";
  loCtx.fillRect(0, 0, LW, LH);

  const scaleX = LW / W;
  const scaleY = LH / H;
  const brightnessR = 100;

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const px = p.x * scaleX;
    const py = p.y * scaleY;
    const ps = p.size * Math.min(scaleX, scaleY);

    let bf = 1;
    if (mouseX !== null) {
      const dx = p.x - mouseX,
        dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < brightnessR) {
        bf = 2.5 - (dist / brightnessR) * 0.4;
        bf *= 1 + (1 - dist / brightnessR) * 0.3;
      }
    }

    const co = p.opacity * bf;
    const col = `rgba(${p.r},${p.g},${p.b},`;
    const grad = loCtx.createRadialGradient(px, py, 0, px, py, ps);
    grad.addColorStop(0, col + co + ")");
    grad.addColorStop(0.4, col + co * 0.6 + ")");
    grad.addColorStop(0.7, col + co * 0.18 + ")");
    grad.addColorStop(1, col + "0)");

    loCtx.beginPath();
    loCtx.arc(px, py, ps, 0, Math.PI * 2);
    loCtx.fillStyle = grad;
    loCtx.fill();
  }

  // 2. Scale low-res canvas up to full size (no smoothing = hard pixel blocks)
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(lo, 0, 0, LW, LH, 0, 0, W, H);

  // 3. Tile film grain over the top
  updateGrain();
  for (let gx = 0; gx < W; gx += 128) {
    for (let gy = 0; gy < H; gy += 128) {
      ctx.drawImage(gCanvas, gx, gy);
    }
  }

  // 4. Scanlines — darkens every other pixel-row band for CRT feel
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  for (let sy = 0; sy < H; sy += PIXEL * 2) {
    ctx.fillRect(0, sy, W, PIXEL);
  }
}

// Mouse events
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
document.addEventListener("mouseout", (e) => {
  if (!e.relatedTarget && e.target === document.documentElement) {
    mouseX = null;
    mouseY = null;
  }
});
document.addEventListener("mouseleave", () => {
  mouseX = null;
  mouseY = null;
});

// Button ripple effect (your original code, untouched)
const buttons = document.querySelectorAll(".rp-button");
buttons.forEach((button) => {
  const rp = document.createElement("div");
  rp.classList.add("rp");
  button.appendChild(rp);
  button.addEventListener("mousemove", (e) => {
    const rect = button.getBoundingClientRect();
    rp.style.left = `${e.clientX - rect.left}px`;
    rp.style.top = `${e.clientY - rect.top}px`;
    rp.style.transform = "translate(-50%, -50%) scale(1)";
    rp.style.opacity = "1";
    rp.style.borderRadius = "20%";
    button.style.color = "#000";
  });
  button.addEventListener("mouseleave", () => {
    rp.style.transform = "translate(-50%, -50%) scale(0)";
    rp.style.opacity = "1";
    rp.style.borderRadius = "50%";
    button.style.color = "#FFF";
  });
});

// Animation loop
if (window.pondAnimationFrame) cancelAnimationFrame(window.pondAnimationFrame);
function loop() {
  update();
  draw();
  window.pondAnimationFrame = requestAnimationFrame(loop);
}
loop();

var theme = 1;
function toggleTheme() {
  const root = document.body;
  if (theme === 0) {
    theme=1;
    document.body.className = "theme0";
  } else if (theme === 1) {
    theme=2;
    document.body.className = "theme1";
  }else if (theme === 2) {
    theme=3;
    document.body.className = "theme2";
  }else if (theme === 3) {
    theme=0;
    document.body.className = "theme3";
  }else {
    theme = 0;
    document.body.className = "theme4";
  }
}
toggleTheme();