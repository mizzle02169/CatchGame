const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = false;
let score = 0;

// Resize canvas properly for all screens
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
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

  // Example player rectangle
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(50, canvas.height / 2 - 25, 50, 50);
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
