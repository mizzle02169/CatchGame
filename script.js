const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = false;
let score = 0;
const gloves = [];
let activeGlove = null;
let offsetX = 0;
let offsetY = 0;

// Resize canvas properly for all screens
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
  
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Game loop
function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

// Update game logic
function update() {
  score++;
  document.getElementById("score").textContent = `Score: ${score}`;
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // ✅ DRAW ALL GLOVES HERE
    for (const glove of gloves) {
      glove.draw(ctx);
    }
}

// Start button
document.getElementById("startBtn").addEventListener("click", () => {
  if (!gameRunning) {
    score = 0;
    gameRunning = true;
    gameLoop();
  }
});

// Keyboard input
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    gameRunning = !gameRunning;
    if (gameRunning) gameLoop();
  }
});

// Touch input
canvas.addEventListener("touchstart", () => {
  gameRunning = !gameRunning;
  if (gameRunning) gameLoop();
});

document.addEventListener("touchmove", (e) => {
    e.preventDefault();
  }, { passive: false });

  class Glove {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 30;
    }
  
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
  
      // glove body
      ctx.fillStyle = "#7c3f1d"; // brown leather
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, Math.PI * 0.2, Math.PI * 1.8);
      ctx.lineTo(this.radius * 0.8, this.radius * 0.8);
      ctx.lineTo(this.radius * 0.6, this.radius * -0.8);
      ctx.closePath();
      ctx.fill();
  
      // glove pocket
      ctx.fillStyle = "#5a2e14";
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.6, Math.PI * 0.3, Math.PI * 1.7);
      ctx.fill();
  
      // stitching
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.75, Math.PI * 0.3, Math.PI * 1.7);
      ctx.stroke();
  
      ctx.restore();
    }
  
    contains(px, py) {
      const dx = px - this.x;
      const dy = py - this.y;
      return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }
  }

const spawnBtn = document.getElementById("glove-spawn");

spawnBtn.addEventListener("click", () => {
    const rect = canvas.getBoundingClientRect();
    const glove = new Glove(rect.width / 2, rect.height / 2);
    gloves.push(glove);
  
    // ✅ ensure rendering starts
    if (!gameRunning) {
      gameRunning = true;
      gameLoop();
    }
  });

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
  
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

function startDrag(e) {
  const pos = getPos(e);

  for (let i = gloves.length - 1; i >= 0; i--) {
    if (gloves[i].contains(pos.x, pos.y)) {
      activeGlove = gloves[i];
      offsetX = pos.x - activeGlove.x;
      offsetY = pos.y - activeGlove.y;
      break;
    }
  }
}

function drag(e) {
  if (!activeGlove) return;
  e.preventDefault();

  const pos = getPos(e);
  activeGlove.x = pos.x - offsetX;
  activeGlove.y = pos.y - offsetY;
}

function endDrag() {
  activeGlove = null;
}
  
function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}

canvas.addEventListener("pointerdown", (e) => {
    const pos = getCanvasPos(e);
  
    for (let i = gloves.length - 1; i >= 0; i--) {
      if (gloves[i].contains(pos.x, pos.y)) {
        activeGlove = gloves[i];
        offsetX = pos.x - activeGlove.x;
        offsetY = pos.y - activeGlove.y;
        canvas.setPointerCapture(e.pointerId);
        break;
      }
    }
  });

canvas.addEventListener("pointermove", (e) => {
    if (!activeGlove) return;

    const pos = getCanvasPos(e);
    activeGlove.x = pos.x - offsetX;
    activeGlove.y = pos.y - offsetY;
    });

canvas.addEventListener("pointerup", () => {
    activeGlove = null;
    });
    
    canvas.addEventListener("pointercancel", () => {
    activeGlove = null;
    });