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
  /*this.baseColors = [
    {
      r: 255,
      g: 0,
      b: 0,
    },
    {
      r: 0,
      g: 255,
      b: 0,
    },

    {
      r: 0,
      g: 0,
      b: 255,
    },
    {
      r: 0,
      g: 255,
      b: 255,
    },
    {
      r: 255,
      g: 255,
      b: 0,
    },
    {
      r: 255,
      g: 255,
      b: 255,
    },
  ];*/
  this.baseColors = [
    {
      r: 105,
      g: 155,
      b: 255,
    },
  ];
  this.sediments = [];
  this.numSediments = 300; // 300
  this.initParticles();
  this.initSediments();
}

MurkyPond.prototype.initParticles = function () {
  this.particles = [];
  for (var i = 0; i < this.numParticles; i++) {
    var colorIndex = Math.floor(Math.random() * this.baseColors.length);
    var color = this.baseColors[colorIndex];
    var r = color.r + Math.floor(Math.random() * 40) - 5;
    var g = color.g + Math.floor(Math.random() * 10) - 5;
    var b = color.b + Math.floor(Math.random() * 10) - 5;
    this.particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 90 + 90,
      opacity: Math.random() * 0.05 + 0.025,
      speedX: (Math.random() - 0.0) * 0.0,
      speedY: (Math.random() - 0.0) * 0.0,
      color: "rgba(" + r + ", " + g + ", " + b + ", ",
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
    p.angle += p.angleSpeed;
    p.x += Math.cos(p.angle) * 0.45;
    p.y += Math.sin(p.angle) * 1.45;
    if (p.x < -p.size) p.x = window.innerWidth + p.size;
    if (p.x > window.innerWidth + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = window.innerHeight + p.size;
    if (p.y > window.innerHeight + p.size) p.y = -p.size;
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
    if (this.mouseX !== null && this.mouseY !== null) {
      var dx = p.x - this.mouseX;
      var dy = p.y - this.mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < brightnessRadius) {
        brightnessFactor = 2.3 - (dist / brightnessRadius) * 0.32;
      }
    }
    gradient.addColorStop(0, p.color + p.opacity * brightnessFactor + ")");
    gradient.addColorStop(1, p.color + "0)");
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, -Math.PI, Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  for (var j = 0; j < this.sediments.length; j++) {
    var s = this.sediments[j];
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, -Math.PI, Math.PI);
    ctx.fillStyle = s.color;
    ctx.fill();
  }
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
canvas.addEventListener("mousemove", function (e) {
  pond.setMousePosition(e.clientX, e.clientY);
});
canvas.addEventListener("mouseout", function () {
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
