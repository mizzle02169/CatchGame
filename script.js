const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const lanes = [canvas.width / 6, canvas.width / 2, (canvas.width * 5) / 6];
let currentLane = 1; // middle lane

const player = {
  width: 40,
  height: 60,
  x: lanes[currentLane],
  y: canvas.height - 100,
};

let speed = 4;

// --- GAME LOOP ---
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// --- UPDATE ---
function update() {
  player.x = lanes[currentLane];
}

// --- DRAW ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // lanes
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 2;
  for (let x of lanes) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // player
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(
    player.x - player.width / 2,
    player.y,
    player.width,
    player.height
  );
}

// --- MOVE LANES ---
function moveLeft() {
  if (currentLane > 0) currentLane--;
}

function moveRight() {
  if (currentLane < 2) currentLane++;
}

// --- KEYBOARD INPUT ---
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
});

// --- MOUSE INPUT ---
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;

  if (x < canvas.width / 2) {
    moveLeft();
  } else {
    moveRight();
  }
});

// --- TOUCH / SWIPE INPUT ---
let touchStartX = 0;

canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

canvas.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchEndX - touchStartX;

  if (Math.abs(diff) > 40) {
    if (diff > 0) moveRight();
    else moveLeft();
  }
});

// START GAME
gameLoop();
