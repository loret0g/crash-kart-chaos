// Pantallas
const splashScreenNode = document.querySelector("#splash-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");
const winnerScreenNode = document.querySelector("#winner");

// Botones de Iniciar y reiniciar
const startBtnNode = document.querySelector("#start-btn");
const restartBtnNode = document.querySelector("#restart-btn");

// Game box
const gameBoxNode = document.querySelector("#game-box");
const scoreNode = document.querySelector(".score");
let backgroundPositionX = 0;
let backgroundSpeed = 3;

// Score panel -> Bonus misil, puntos y vida
let textMissileNode = document.querySelector(".score span");
let pointsNode = document.querySelector("#points");
let lifeNode = document.querySelector("#life");

// Puntos pantalla final
let finalPoints = document.querySelector("#game-over-screen h2");

// Objetos del game-box
let player = null;
let obstacles = [];
let applePoints = [];
let bonusInvulnerable = [];
let bonusLife = [];
let bonusBoxMissile = [];

let maskBonusInvulnerable = null; 
let lifeExtraBonus = null;       
let newMissile = null;           
let itemWinner = null;

// Velocidades para intervalos
let speedAppearanceObstacles = 1000;
let speedPoints = 1000;
let speedAppearanceObstaclePlaneMissile = 1000;
let speedAppearanceObstacleRobotBox = 2000;
let speedAppearanceBonusBoxMissile = 3000;

let gameIntervalId = null;
let obstacleIntervalId = null;
let pointsIntervalId = null;
let obstaclePlaneMissileIntervalId = null;
let obstacleRobotBoxIntervalidId = null;
let bonusShotMissileIntervalId = null;

// Variable global para modificar la velocidad del objeto Obstaculo 
let speedObstacle = 2;
let currentMissile = 0;

// Audios
let startAudio = document.querySelector("#game-audio");
let lostLifeAudio = document.querySelector("#life-audio");
let bonusInvulnerableAudio = document.querySelector("#mask-audio");
let winnerAudio = document.querySelector("#winner-audio");

startAudio.volume = 0.3;
lostLifeAudio.volume = 0.4;
bonusInvulnerableAudio.volume = 0.4;
winnerAudio.volume = 0.4;


// ====== INICIO DE JUEGO ======
function startGame() {
  // Oculta pantallas e inicia
  splashScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";
  scoreNode.style.display = "flex";
  controlsContainer.style.display = "flex";

  startAudio.currentTime = 0;
  startAudio.play();

  // Crear jugador
  player = new Player();

  // Intervalo principal (60 fps)
  gameIntervalId = setInterval(gameLoop, 1000 / 60);

  // Intervalos de obstáculos / bonus
  obstacleIntervalId = setInterval(addObstacle, speedAppearanceObstacles);
  obstaclePlaneMissileIntervalId = setInterval(addObstaclePlaneMissile, speedAppearanceObstaclePlaneMissile);
  obstacleRobotBoxIntervalidId = setInterval(addObstacleRobotBox, speedAppearanceObstacleRobotBox);
  pointsIntervalId = setInterval(addPoints, speedPoints);
  bonusShotMissileIntervalId = setInterval(addBonusShotMissile, speedAppearanceBonusBoxMissile);
}

// ====== gameLoop => animación “por frame” ======
function gameLoop() {
  moveBackgroundImage();

  // Obstaculos
  obstacles.forEach(obs => obs.obstacleMovement());
  obstacleLeaveScreen();
  detectColissionObstacle();

  // Bonus
  applePoints.forEach(item => item.itemMovement());
  applePointsLeaveScreen();
  detectColissionBonusApplePoints();

  detectColissionBonusMaskInvulnerability();
  detectColissionBonusLife();

  bonusBoxMissile.forEach(it => it.itemMovement());
  boxMissileLeaveScreen();
  detectColissionBonusBoxMissile();

  // Misiles
  player.misilArray.forEach(m => m.moveMissile());
  missileLeaveScreen();
  detectColissionMissileWithObstacles();

  // Item para ganar (se activa a los 50 puntos)
  if (itemWinner) {
    itemWinner.winnerMovement();
    detectColissionItemWinner();
  }
}

// ====== FONDO ANIMADO ======
function moveBackgroundImage() {
  let boxWidth = gameBoxNode.offsetWidth;

  backgroundPositionX -= backgroundSpeed;
  if (backgroundPositionX <= -boxWidth) {
    backgroundPositionX = 0;
  }
  gameBoxNode.style.backgroundPosition = `${backgroundPositionX}px`;
}

// ====== BONUS (puntos / invulnerabilidad / vidas extra / misiles) ======
function addPoints() {
  let boxW = gameBoxNode.offsetWidth;
  let boxH = gameBoxNode.offsetHeight;

  let randomX = Math.floor(Math.random() * (boxW - 200) + 200);
  let randomY = Math.floor(Math.random() * (boxH - 50)); 
  let newItem = new Bonus(randomX, randomY, "points");
  applePoints.push(newItem);
}

function addExtraBonusInvulnerable() {
  // Para meterlo cerca del player en X=80
  let boxH = gameBoxNode.offsetHeight;
  let randomY = Math.floor(Math.random() * (boxH - 50));
  maskBonusInvulnerable = new Bonus(80, randomY, "extra");
  bonusInvulnerable.push(maskBonusInvulnerable);
}

function addExtraLife() {
  let boxH = gameBoxNode.offsetHeight;
  let randomY = Math.floor(Math.random() * (boxH - 50));
  lifeExtraBonus = new Bonus(80, randomY, "life");
  bonusLife.push(lifeExtraBonus);
}

function addBonusShotMissile() {
  let boxW = gameBoxNode.offsetWidth;
  let boxH = gameBoxNode.offsetHeight;

  let randomX = Math.floor(Math.random() * (boxW - 200) + 200);
  let randomY = Math.floor(Math.random() * (boxH - 50));
  newMissile = new Bonus(randomX, randomY, "missile");
  bonusBoxMissile.push(newMissile);
}

function applePointsLeaveScreen() {
  if (applePoints.length === 0) return;
  if (applePoints[0].x <= 0) {
    applePoints[0].bonus.remove();
    applePoints.shift();
  }
}

function boxMissileLeaveScreen() {
  if (bonusBoxMissile.length === 0) return;
  if (bonusBoxMissile[0].x <= 0) {
    bonusBoxMissile[0].bonus.remove();
    bonusBoxMissile.shift();
  }
}

function missileLeaveScreen() {
  if (player.misilArray.length === 0) return;
  if (player.misilArray[0].x >= gameBoxNode.offsetWidth) {
    player.misilArray[0].misil.remove();
    player.misilArray.shift();
  }
}

function detectColissionBonusApplePoints() {
  applePoints.forEach((item, i) => {
    if ( 
      player.x < item.x + item.w &&
      player.x + player.w > item.x &&
      player.y < item.y + item.h &&
      player.y + player.h > item.y
    ) {
      item.bonus.remove();
      applePoints.splice(i, 1);
      addScore();
    }
  });
}

function detectColissionBonusMaskInvulnerability() {
  bonusInvulnerable.forEach((maskItem, i) => {
    if (
      player.x < maskItem.x + maskItem.w &&
      player.x + player.w > maskItem.x &&
      player.y < maskItem.y + maskItem.h &&
      player.y + player.h > maskItem.y
    ) {
      if (!maskItem.isCollided) {
        maskItem.bonus.remove();
        bonusInvulnerable.splice(i, 1);
        bonusInvulnerableAudio.play();
        invulnerablePlayer(3000, "bonusMask");
        maskItem.isCollided = true;
      }
    }
  });
}

function detectColissionBonusLife() {
  bonusLife.forEach((lifeItem, i) => {
    if (
      player.x < lifeItem.x + lifeItem.w &&
      player.x + player.w > lifeItem.x &&
      player.y < lifeItem.y + lifeItem.h &&
      player.y + player.h > lifeItem.y
    ) {
      if (!lifeItem.isCollided) {
        lifeItem.bonus.remove();
        bonusLife.splice(i, 1);
        let currentLives = parseInt(lifeNode.innerText);
        lifeNode.innerText = currentLives + 1;
        lifeItem.isCollided = true;
      }
    }
  });
}

function detectColissionBonusBoxMissile() {
  bonusBoxMissile.forEach((boxItem, i) => {
    if (
      player.x < boxItem.x + boxItem.w &&
      player.x + player.w > boxItem.x &&
      player.y < boxItem.y + boxItem.h &&
      player.y + player.h > boxItem.y
    ) {
      if (!boxItem.isCollided) {
        boxItem.bonus.remove();
        bonusBoxMissile.splice(i, 1);

        currentMissile += 3;
        textMissileNode.innerText = currentMissile;
        boxItem.isCollided = true;
      }
    }
  });
}

function detectColissionMissileWithObstacles() {
  player.misilArray.forEach((misil, mi) => {
    obstacles.forEach((obs, oi) => {
      if (
        misil.x < obs.x + obs.w &&
        misil.x + misil.w > obs.x &&
        misil.y < obs.y + obs.h &&
        misil.y + misil.h > obs.y
      ) {
        misil.misil.remove();
        obs.obstacle.remove();
        player.misilArray.splice(mi, 1);
        obstacles.splice(oi, 1);
      }
    });
  });
}

function addScore() {
  pointsNode.innerText++;
  let currentPoints = parseInt(pointsNode.innerText);

  // cada 5 => subir dificultad
  if (currentPoints % 5 === 0) {
    addDifficult();
  }
  // cada 7 => bonus invulnerable
  if (currentPoints % 7 === 0) {
    addExtraBonusInvulnerable();
  }
  // cada 15 => bonus vida
  if (currentPoints % 15 === 0) {
    addExtraLife();
  }
  // a 50 => item para ganar
  if (currentPoints === 50) {
    addItemWinner();
  }
}


// ====== ITEM PARA GANAR ======
function addItemWinner() {
  let boxW = gameBoxNode.offsetWidth;
  let boxH = gameBoxNode.offsetHeight;
  let posX = boxW - 100;
  let posY = Math.floor(Math.random() * (boxH - 70));
  itemWinner = new Bonus(posX, posY, "winner");
}

function detectColissionItemWinner() {
  if (
    player.x < itemWinner.x + itemWinner.w &&
    player.x + player.w > itemWinner.x &&
    player.y < itemWinner.y + itemWinner.h &&
    player.y + player.h > itemWinner.y
  ) {
    winner();
  }
}


// ====== OBSTÁCULOS ======
function addObstacle() {
  let boxW = gameBoxNode.offsetWidth;
  let boxH = gameBoxNode.offsetHeight;

  let randomX = Math.floor(Math.random() * (boxW - 400) + 400);
  let randomY = Math.floor(Math.random() * (boxH - 50));
  let newObstacle = new Obstacle(randomX, randomY, "box");
  obstacles.push(newObstacle);
}

function obstacleLeaveScreen() {
  if (obstacles.length === 0) return;
  if (obstacles[0].x <= 0) {
    obstacles[0].obstacle.remove();
    obstacles.shift();
  }
}

function detectColissionObstacle() {
  obstacles.forEach(obs => {
    if (
      player.x < obs.x + obs.w &&
      player.x + player.w > obs.x &&
      player.y < obs.y + obs.h &&
      player.y + player.h > obs.y
    ) {
      // Si ya está en 0 vidas => gameOver
      if (lifeNode.innerText === "0") {
        startAudio.pause();
        startAudio.currentTime = 0;
        gameOver();
      }

      // Evitar colisiones repetidas
      if (!player.isVulnerable) return;
      if (!obs.isCollided) {
        lifeNode.innerText--;
        obs.isCollided = true;
        lostLifeAudio.play();
        invulnerablePlayer(2000, "damaged");
      }
    }
  });
}

function addObstaclePlaneMissile() {
  let boxW = gameBoxNode.offsetWidth;
  let boxH = gameBoxNode.offsetHeight;

  let posX = boxW;
  let posY = Math.floor(Math.random() * (boxH - 50));
  let newObs = new Obstacle(posX, posY, "missile");
  obstacles.push(newObs);
}

function addObstacleRobotBox() {
  let boxW = gameBoxNode.offsetWidth;
  let boxH = gameBoxNode.offsetHeight;

  let posX = boxW;
  let posY = Math.floor(Math.random() * (boxH - 50));
  let newObs = new Obstacle(posX, posY, "robot");
  obstacles.push(newObs);
}


// ====== INVULNERABILIDAD ======
function invulnerablePlayer(time, type) {
  if (!player.isVulnerable) return;
  player.isVulnerable = false;

  let blinkInterval;
  if (type === "damaged") {
    blinkInterval = setInterval(() => {
      if (player.player.style.opacity === "1") {
        player.player.style.opacity = "0.3";
      } else {
        player.player.style.opacity = "1";
      }
    }, 200);
  } else if (type === "bonusMask") {
    player.player.classList.add("mask-invulnerable");
  }

  setTimeout(() => {
    player.player.style.opacity = "1";
    clearInterval(blinkInterval);
    player.player.classList.remove("mask-invulnerable");
    player.isVulnerable = true;
    maskBonusInvulnerable = null;
  }, time);
}

function addDifficult() {
  // Aparecen más rápido
  speedAppearanceObstacles -= 100;
  speedObstacle += 0.5;

  clearInterval(obstacleIntervalId);
  obstacleIntervalId = setInterval(addObstacle, speedAppearanceObstacles);

  speedAppearanceBonusBoxMissile += 1000;
  clearInterval(bonusShotMissileIntervalId);
  bonusShotMissileIntervalId = setInterval(addBonusShotMissile, speedAppearanceBonusBoxMissile);
}


// ====== WINNER Y GAME OVER ======
function winner() {
  clearAllIntervals();
  startAudio.pause();
  winnerAudio.play();
  gameScreenNode.style.display = "none";
  winnerScreenNode.style.display = "flex";
}

function gameOver() {
  clearAllIntervals();
  finalPoints.innerText = pointsNode.innerText;
  gameScreenNode.style.display = "none";
  gameOverScreenNode.style.display = "flex";
}

function clearAllIntervals() {
  clearInterval(gameIntervalId);
  clearInterval(obstacleIntervalId);
  clearInterval(pointsIntervalId);
  clearInterval(obstaclePlaneMissileIntervalId);
  clearInterval(obstacleRobotBoxIntervalidId);
  clearInterval(bonusShotMissileIntervalId);
}

// ====== EVENTOS ======
startBtnNode.addEventListener("click", startGame);
restartBtnNode.addEventListener("click", () => {
  clearAllIntervals();

  // Limpieza
  gameBoxNode.innerHTML = "";
  gameBoxNode.innerText = "";
  player = null;
  obstacles = [];
  applePoints = [];
  bonusInvulnerable = [];
  bonusLife = [];
  bonusBoxMissile = [];
  itemWinner = null;

  pointsNode.innerText = "0";
  lifeNode.innerText = "3";
  currentMissile = 0;
  textMissileNode.innerText = "0";
  speedObstacle = 2;

  speedAppearanceObstacles = 1000;
  speedAppearanceBonusBoxMissile = 3000;

  gameOverScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";
  startGame();
});

// Movimientos del jugador
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    player.playerMovement("top");
  } else if (event.key === "ArrowDown") {
    player.playerMovement("down");
  }
});

// Disparo
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    player.createMissile();
  }
});

//* Movimiento para la versión móvil
const controlsContainer = document.querySelector("#controls-container");
const joystickContainer = document.querySelector("#joystick-container");
const joystick = document.querySelector("#joystick");
const shootBtn = document.querySelector("#shoot-btn");

// Variable para el intervalo que permite mover el jugador de forma continua
let joystickInterval = null;
// Objeto para guardar el centro del contenedor del joystick
let containerCenter = { x: 0, y: 0 };

// Función para reestablecer el joystick (visualmente y deteniendo el movimiento)
function resetJoystick() {
  joystick.style.transform = "translate(-50%, -50%)"; // Vuelve a centrar el elemento
  if (joystickInterval) {
    clearInterval(joystickInterval);
    joystickInterval = null;
  }
}

// Al iniciar el toque, se guarda la posición central del contenedor
joystickContainer.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const rect = joystickContainer.getBoundingClientRect();
  containerCenter = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
});

// Mientras se mueve el toque (drag) sobre el contenedor
joystickContainer.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  let deltaX = touch.clientX - containerCenter.x;
  let deltaY = touch.clientY - containerCenter.y;

  // Limitar el movimiento del joystick a un radio máximo (30px)
  const maxRadius = 30;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  if (distance > maxRadius) {
    const ratio = maxRadius / distance;
    deltaX *= ratio;
    deltaY *= ratio;
  }
  
  // Mueve el joystick visualmente
  joystick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  // Limpia el intervalo previo (si existe)
  if (joystickInterval) {
    clearInterval(joystickInterval);
    joystickInterval = null;
  }

  const threshold = 5; // umbral para iniciar el movimiento
  if (Math.abs(deltaY) > threshold) {
    const direction = deltaY < 0 ? "top" : "down";
    const movementFactor = (Math.abs(deltaY) / maxRadius) + 0.5;

    joystickInterval = setInterval(() => {
      if (player) {
        // Calcula la velocidad ajustada en función del factor y la velocidad base
        const adjustedSpeed = player.speed * movementFactor;
        // Modifica la posición del jugador directamente:
        player.y += (direction === "down" ? adjustedSpeed : -adjustedSpeed);
        // Asegura que el jugador no se salga de los límites del gameBox:
        const gameBoxHeight = gameBoxNode.clientHeight;
        const playerHeight = player.player.clientHeight;
        player.y = Math.max(0, Math.min(player.y, gameBoxHeight - playerHeight));
        player.player.style.top = `${player.y}px`;
      }
    }, 20); //! Intervalo que sigo ajustando para mejor fluidez
  }
});

// Al finalizar o cancelar el toque, se restablece el joystick y se detiene el movimiento
joystickContainer.addEventListener("touchend", (e) => {
  e.preventDefault();
  resetJoystick();
});
joystickContainer.addEventListener("touchcancel", (e) => {
  e.preventDefault();
  resetJoystick();
});

//* Botón de disparo con efecto de pulsación táctil
if (shootBtn) {
  // Cuando se inicia el toque, se añade la clase 'pressed' para el efecto visual
  shootBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    shootBtn.classList.add("pressed");
    if (player) {
      player.createMissile();
    }
  });
  // Al finalizar o cancelar el toque, se elimina la clase para restablecer el estilo
  shootBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    shootBtn.classList.remove("pressed");
  });
  shootBtn.addEventListener("touchcancel", (e) => {
    e.preventDefault();
    shootBtn.classList.remove("pressed");
  });
}