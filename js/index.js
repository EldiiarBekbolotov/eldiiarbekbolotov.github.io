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

    setTimeout(() => {
      span.style.opacity = 0.9;
      span.style.left = `${finalX}px`;
      span.style.top = `${finalY}px`;
      span.style.color =
        i % 2 === 0 ? "rgba(213, 163, 89, 1)" : "rgba(122, 104, 75, 1)";
    }, i * 150 + index * 100);

    setTimeout(() => {
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
    }, 4000 + i * 150 + index * 100);
  }
}

function animateText(text) {
  for (let i = 0; i < text.length; i++) {
    letterchunk(text[i], i, text.length);
  }
}

var canvas = document.getElementById("pondCanvas");
var ctx = canvas.getContext("2d");
var brightnessRadius = 100;

function initCanvas() {
  var dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}

initCanvas();
window.addEventListener("resize", initCanvas);

function MurkyPond() {
  this.particles = [];
  this.numParticles = 140;
  this.mouseX = null;
  this.mouseY = null;
  this.mouseRadius = 100;
  this.mouseInfluence = 1;
  // palette including primary theme color
  this.baseColors = [
    { r: 208, g: 136, b: 77 },   // Primary theme color (orange/peach)
    { r: 254, g: 176, b: 112 },  // Primary hover (lighter orange)
    { r: 255, g: 86, b: 80 },    // Accent red (colora)
    { r: 109, g: 220, b: 64 },   // Accent green (colorb)
    { r: 0, g: 183, b: 255 },    // Accent blue (colorc)
    { r: 138, g: 43, b: 226 },   // Purple
    { r: 255, g: 20, b: 147 },   // Deep pink
    { r: 64, g: 224, b: 208 },   // Turquoise
    { r: 255, g: 215, b: 0 },    // Gold
     
    { r: 147, g: 112, b: 219 },  // Medium slate blue

     
    ];
  this.sediments = [];
  this.numSediments = 0; // Stars removed
  this.initParticles();
  this.initSediments();
}

MurkyPond.prototype.initParticles = function () {
  this.particles = [];
  for (var i = 0; i < this.numParticles; i++) {
    var colorIndex = Math.floor(Math.random() * this.baseColors.length);
    var color = this.baseColors[colorIndex];
    // More sophisticated color variation with wider range
    var variation = 35;
    var r = Math.max(0, Math.min(255, color.r + Math.floor(Math.random() * variation * 2) - variation));
    var g = Math.max(0, Math.min(255, color.g + Math.floor(Math.random() * variation * 2) - variation));
    var b = Math.max(0, Math.min(255, color.b + Math.floor(Math.random() * variation * 2) - variation));
    
    // Add color transition properties for dynamic color changes
    var targetColorIndex = Math.floor(Math.random() * this.baseColors.length);
    var targetColor = this.baseColors[targetColorIndex];
    
    this.particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 90 + 90,
      opacity: Math.random() * 0.05 + 0.025,
      speedX: (Math.random() - 0.0) * 0.0,
      speedY: (Math.random() - 0.0) * 0.0,
      color: "rgba(" + r + ", " + g + ", " + b + ", ",
      baseR: r,
      baseG: g,
      baseB: b,
      targetR: targetColor.r,
      targetG: targetColor.g,
      targetB: targetColor.b,
      colorProgress: Math.random(), // Random starting point in color transition
      colorSpeed: (Math.random() * 0.003 + 0.001), // Slow color transition speed
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.002,
    });
  }
};

MurkyPond.prototype.initSediments = function () {
  this.sediments = [];
  for (var i = 0; i < this.numSediments; i++) {
    var size = Math.random() * 0.3 + 0.1;
    var opacity = Math.random() * 0.1 + 0.3;
    var brownShade = Math.floor(Math.random() * 50) + 50;
    var greenShade = Math.floor(Math.random() * 20) + brownShade - 15;
    this.sediments.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: size,
      opacity: opacity,
      //color: 'rgba(' + brownShade + ', ' + greenShade + ', ' + brownShade * 0.5 + ', ' + opacity + ')',
      color: `rgba(255,255, 255, ${(Math.random() + 2) * 1})`,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1,
      angle: Math.random() * Math.PI * 2,
    });
  }
};

MurkyPond.prototype.update = function () {
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    
    // Update color transition
    p.colorProgress += p.colorSpeed;
    if (p.colorProgress >= 1) {
      p.colorProgress = 0;
      // Pick new target color
      var newTargetIndex = Math.floor(Math.random() * this.baseColors.length);
      var newTarget = this.baseColors[newTargetIndex];
      p.baseR = p.targetR;
      p.baseG = p.targetG;
      p.baseB = p.targetB;
      p.targetR = newTarget.r;
      p.targetG = newTarget.g;
      p.targetB = newTarget.b;
    }
    
    // Interpolate between base and target color using smooth easing
    var easeProgress = 0.5 - 0.5 * Math.cos(p.colorProgress * Math.PI); // Smooth sine wave transition
    var currentR = Math.floor(p.baseR + (p.targetR - p.baseR) * easeProgress);
    var currentG = Math.floor(p.baseG + (p.targetG - p.baseG) * easeProgress);
    var currentB = Math.floor(p.baseB + (p.targetB - p.baseB) * easeProgress);
    p.color = "rgba(" + currentR + ", " + currentG + ", " + currentB + ", ";
    
    // Update position
    p.angle += p.angleSpeed;
    p.x += Math.cos(p.angle) * 0.45;
    p.y += Math.sin(p.angle) * 1.45;
    if (p.x < -p.size) p.x = window.innerWidth + p.size;
    if (p.x > window.innerWidth + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = window.innerHeight + p.size;
    if (p.y > window.innerHeight + p.size) p.y = -p.size;
    
    // Mouse interaction
    if (this.mouseX !== null && this.mouseY !== null) {
      var dx = this.mouseX - p.x;
      var dy = this.mouseY - p.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.mouseRadius) {
        var influenceFactor =
          (1 - distance / this.mouseRadius) * this.mouseInfluence;
        p.x += dx * influenceFactor * 0.05;
        p.y += dy * influenceFactor * 0.05;
      }
    }
  }
};

MurkyPond.prototype.draw = function () {
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(
    0,
    0,
    canvas.width / (window.devicePixelRatio || 1),
    canvas.height / (window.devicePixelRatio || 1)
  );
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    var brightnessFactor = 1;
    
    // Enhanced mouse interaction with color intensity
    if (this.mouseX !== null && this.mouseY !== null) {
      var dx = p.x - this.mouseX;
      var dy = p.y - this.mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < brightnessRadius) {
        brightnessFactor = 2.5 - (dist / brightnessRadius) * 0.4;
        // Add slight color shift near mouse for more sophistication
        var colorIntensity = 1 + (1 - dist / brightnessRadius) * 0.3;
        brightnessFactor *= colorIntensity;
      }
    }
    
    // Create more sophisticated gradient with multiple color stops
    var centerOpacity = p.opacity * brightnessFactor;
    var midOpacity = centerOpacity * 0.6;
    gradient.addColorStop(0, p.color + centerOpacity + ")");
    gradient.addColorStop(0.4, p.color + midOpacity + ")");
    gradient.addColorStop(0.7, p.color + (midOpacity * 0.3) + ")");
    gradient.addColorStop(1, p.color + "0)");
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, -Math.PI, Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  // Stars/sediments removed
  // for (var j = 0; j < this.sediments.length; j++) {
  //   var s = this.sediments[j];
  //   ctx.beginPath();
  //   ctx.arc(s.x, s.y, s.size, -Math.PI, Math.PI);
  //   ctx.fillStyle = s.color;
  //   ctx.fill();
  // }
};

MurkyPond.prototype.setMousePosition = function (x, y) {
  this.mouseX = x;
  this.mouseY = y;
};

MurkyPond.prototype.clearMousePosition = function () {
  this.mouseX = null;
  this.mouseY = null;
};
var pond = new MurkyPond();
// Attach mouse events to document instead of canvas so they work even when canvas has low z-index
document.addEventListener("mousemove", function (e) {
  pond.setMousePosition(e.clientX, e.clientY);
});
document.addEventListener("mouseout", function (e) {
  // Only clear if mouse actually left the window
  if (!e.relatedTarget && e.target === document.documentElement) {
    pond.clearMousePosition();
  }
});
// Also clear when mouse leaves the window
document.addEventListener("mouseleave", function () {
  pond.clearMousePosition();
});
if (window.pondAnimationFrame) {
  cancelAnimationFrame(window.pondAnimationFrame);
}
const buttons = document.querySelectorAll(".rp-button");

buttons.forEach((button) => {
  const rp = document.createElement("div");
  rp.classList.add("rp");
  button.appendChild(rp);

  button.addEventListener("mousemove", (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    rp.style.left = `${x}px`;
    rp.style.top = `${y}px`;
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
