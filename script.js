const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let cssWidth = 0;
let cssHeight = 0;
let roadScrollY = 0;
let lastTime = 0;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  cssWidth = rect.width;
  cssHeight = rect.height;

  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

let lanes = [];
function calculateLanes() {
  lanes = [
    cssWidth / 6,
    cssWidth / 2,
    (cssWidth * 5) / 6,
  ];
}
let currentLane = 1; // middle lane

const carImg = new Image();
carImg.src = "Car_Red.png";
const roadImg = new Image();
roadImg.src = "Road_Main1.png";
const nitroImg = new Image();
nitroImg.src = "Nitro.png"; // your sprite path
let carLoaded = false;
let roadLoaded = false;
let nitroLoaded = false;

carImg.onload = () => {
  carLoaded = true;
};
roadImg.onload = () => {
  roadLoaded = true;
};
nitroImg.onload = () => {
  nitroLoaded = true;
};

const BOTTOM_PADDING = 40;
const player = {
  width: 80,
  height: 140,
  x: 0,
  y: 0,
};
const road = {
  width: 150,
  height: 400,
  x: 0,
  y: 0,
};
const carShake = {
  x: 0,              // current shake offset (pixels)
  intensity: 2,      // max pixels to sway
  target: 0          // next random target for smooth movement
};
const nitro = {
  width: 20,           // base width
  height: 50,          // base height
  xOffset: 20,         // horizontal distance from car center
  yOffset: 5,         // vertical distance behind car
  scale: 1,            // current scale multiplier
  scaleSpeed: 0.05,    // how fast the size changes
  scaleDirection: 1    // 1 = growing, -1 = shrinking
};

let speed = 4;

function setup() {
  resizeCanvas();
  calculateLanes();
  player.y = cssHeight - player.height - BOTTOM_PADDING;
  road.height = cssHeight * 1.5;
}
window.addEventListener("resize", setup);

// --- GAME LOOP ---
function gameLoop(time) {
  if (!lastTime) lastTime = time; // first frame
  const delta = (time - lastTime) / 16.67; // ~60FPS normalization
  lastTime = time;

  update(delta);
  draw();
  requestAnimationFrame(gameLoop);
}

// --- UPDATE ---
function update(delta) {
  // normal lane position
  player.x = lanes[currentLane];

  // scroll road downward
  roadScrollY += speed * delta;
  if (roadScrollY >= cssHeight) roadScrollY = 0;

  // --- smooth shake ---
  // pick a new target occasionally
  if (Math.random() < 0.05) { // ~5% chance each frame
    carShake.target = (Math.random() - 0.5) * 2 * carShake.intensity;
  }

  // smoothly move current shake towards target
  carShake.x += (carShake.target - carShake.x) * 0.2; // 0.2 is smoothing factor

  // nitro flicker
  nitro.scale += nitro.scaleSpeed * nitro.scaleDirection * delta;
  // clamp scale
  if (nitro.scale > 1.2) {
    nitro.scale = 1.2;
    nitro.scaleDirection = -1;
  }
  if (nitro.scale < 0.8) {
    nitro.scale = 0.8;
    nitro.scaleDirection = 1;
  }
}

// --- DRAW ---
function draw() {
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  for (let x of lanes) {
    // first tile
    ctx.drawImage(
      roadImg,
      x - road.width / 2,
      -cssHeight + roadScrollY,
      road.width,
      cssHeight
    );

    // second tile stacked below
    ctx.drawImage(
      roadImg,
      x - road.width / 2,
      roadScrollY,
      road.width,
      cssHeight
    );
  }

  if (carLoaded) {
    ctx.drawImage(
      carImg,
      player.x - player.width / 2 + carShake.x, // add shake
      player.y,
      player.width,
      player.height
    );
  } else {
    ctx.fillStyle = "#a16207";
    ctx.fillRect(
      player.x - player.width / 2 + carShake.x,
      player.y,
      player.width,
      player.height
    );
  }

  if (nitroLoaded) {
    // left nitro
    ctx.drawImage(
      nitroImg,
      player.x - nitro.xOffset + carShake.x - (nitro.width * nitro.scale)/2,
      player.y + player.height + nitro.yOffset,
      nitro.width * nitro.scale,
      nitro.height * nitro.scale
    );
  
    // right nitro
    ctx.drawImage(
      nitroImg,
      player.x + nitro.xOffset + carShake.x - (nitro.width * nitro.scale)/2,
      player.y + player.height + nitro.yOffset,
      nitro.width * nitro.scale,
      nitro.height * nitro.scale
    );
  }
}

// --- MOVE LANES ---
function moveLeft() {
  if (currentLane > 0) 
    currentLane--;
}

function moveRight() {
  if (currentLane < 2) 
    currentLane++;
}

// --- KEYBOARD INPUT ---
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
});

// --- MOUSE INPUT ---
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();

  // Scale factor between CSS size and canvas internal size
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // Convert click to canvas coordinates
  const clickX = (e.clientX - rect.left) * scaleX;
  const clickY = (e.clientY - rect.top) * scaleY;

  console.log("Canvas click X:", clickX, "Canvas click Y:", clickY);

  const carX = player.x;

  if (clickX < carX) moveLeft();
  else if (clickX > carX) moveRight();
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
setup();
requestAnimationFrame(gameLoop);
