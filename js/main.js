//* ELEMENTOS PRINCIPALES DEL DOM

// 3 pantallas
const splashScreenNode = document.querySelector("#splash-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");

// Elementos pantalla final
let finalPoints = document.querySelector("#game-over-screen h2");

// Botones de Iniciar y reiniciar
const startBtnNode = document.querySelector("#start-btn")
const restartBtnNode = document.querySelector("#restart-btn")

// Game box
const gameBoxNode = document.querySelector("#game-box");

// Puntos y vida
let pointsNode = document.querySelector("#points");
let lifeNode = document.querySelector("#life");

// 
let player = null;
let obstacles = [];
let applePoints = [];

let maskBonusInvulnerable = null;  // Objeto para el bonus (máscara)

let speedAppearanceObstacles = 1000;   //* Cambia este valor! Está modo rápido para ver bien las pruebas
let speedPoints = 1000;      //* Cambia este valor! Está modo rápido para ver bien las pruebas

let gameIntervalId = null;
let obstacleIntervalId = null;
let pointsIntervalId = null;
let obstacleMissileIntervalId = null;

// Variable global para modificar la velocidad del objeto Obstaculo y que haga efecto al subir de nivel a los nuevos objetos que se creen
let speedObstacle = 2;

//



// Funciones:
function startGame() {
  // 1. Cambiar las pantallas, ocultar la de inicio y mostrar la de juego:
  splashScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";

  // 2. Añadir todos los elementos iniciales del juego:
  player = new Jugador();

  // 3. Iniciar el intervalo del juego:
  gameIntervalId = setInterval(() => {
    gameLoop();
  }, Math.round(1000 / 60));  // 60fps

  // 4. Intervalo de aparición de obstáculos, en los que poder cambiar la frecuencia para subir el nivel
  obstacleIntervalId = setInterval(() => {
    addObstacle();
  }, speedAppearanceObstacles);

  pointsIntervalId = setInterval(() => {
    addPoints();
  }, speedPoints);

  //! Intervalo de misiles    -- O lo añado aquí o en la línea 161
  obstacleMissileIntervalId = setInterval(() => {
    addObstacleMissile();
  }, 1000);
}

function gameLoop() {
  // Obstáculos
  obstacles.forEach((eachObstacle) => {
    eachObstacle.obstacleMovement();
  });

  obstacleLeaveScreen();
  detectColissionObstacle();

  // Bonus
  applePoints.forEach((eachItem) => {
    eachItem.itemMovement();
  });
  itemLeaveScreen();

  detectColissionBonusApplePoints();
  detectColissionBonusMaskInvulnerability();

  

}

// Funciones del bonus (puntos)
function addPoints() {
  let randomPositionX = Math.floor(Math.random() * (870 - 400) + 400);  // Valor aleatorio entre 400px y 870px
  let randomPositionY = Math.floor( Math.random() * (470));  // Número aleatorio entre 0 y 470 (casi lo que mide el game-box)

  // Variable local para añadir al array global:
  let newItem = new Bonus(randomPositionX, randomPositionY, "points");    // Posición Y en 0 (desde arriba)
  applePoints.push(newItem);
}

function addExtraBonus() {
  let randomPositionY = Math.floor( Math.random() * (470));  // Número aleatorio en el eje Y
  maskBonusInvulnerable = new Bonus(80, randomPositionY, "extra");    // Eje X a 80 (altura del player)
}

function itemLeaveScreen() {
  if(applePoints.length === 0) {
    return;
  }

  if((applePoints[0].x) <= 0) {         // Si el primer obstáculo sale de la pantalla (eje X)
    applePoints[0].bonus.remove();      // Lo elimino del DOM
    applePoints.shift();                // Y lo elimino de JS, eliminando el primer elemento del array
  } 
}

function detectColissionBonusApplePoints() {
  applePoints.forEach((eachItem, index) => {
    if (
      player.x < eachItem.x + eachItem.w &&
      player.x + player.w > eachItem.x &&
      player.y < eachItem.y + eachItem.h &&
      player.y + player.h > eachItem.y
    ) {
        eachItem.bonus.remove();        // Lo elimino del DOM
        applePoints.splice(index, 1);   // Lo elimino del array

        addScore();
    }
  });
}

function detectColissionBonusMaskInvulnerability() {
  if(maskBonusInvulnerable === null) {
    return;
  }

  if (
    player.x < maskBonusInvulnerable.x + maskBonusInvulnerable.w &&
    player.x + player.w > maskBonusInvulnerable.x &&
    player.y < maskBonusInvulnerable.y + maskBonusInvulnerable.h &&
    player.y + player.h > maskBonusInvulnerable.y
  ) {
    maskBonusInvulnerable.bonus.remove();
    invulnerablePlayer(3000);
  }
}

function addScore() {   //! Añado aquí los misiles en puntos múltiples de 7
  pointsNode.innerText ++;

  // Subir dificultad cada 5 puntos
  let currentPoints = parseInt(pointsNode.innerText);
  if (currentPoints % 5 === 0) {
    console.log("%5 - Puntos: ", currentPoints);
    addDifficult();
  }
  if (currentPoints % 7 === 0) {
    console.log("%7 - Puntos: ", currentPoints);
    // addObstacleMissile();
  }

  // Cada 10 puntos, bonus extra de invulnerabilidad, durante 3 segundos. 
  if (currentPoints % 10 === 0) {
    addExtraBonus();
  }
}

// Funciones de obstáculos
function addObstacle() {
  // Genero las posiciones fuera de la zona de exclusión (donde se encuentra el jugador) (mayor que 400px) 
  let randomPositionX = Math.floor(Math.random() * (870 - 400) + 400);  // Valor aleatorio entre 400px y 870px
  let randomPositionY = Math.floor( Math.random() * (470));  // Número aleatorio entre 0 y 470 (casi lo que mide el game-box)

  // Variable local para añadir al array global:
  let newObstacle = new Obstacle(randomPositionX, randomPositionY, "box");
  obstacles.push(newObstacle);
}

function obstacleLeaveScreen() {
  if(obstacles.length === 0) {
    return;
  }

  if((obstacles[0].x) <= 0) {         // Si el primer obstáculo sale de la pantalla (eje X)
    obstacles[0].obstacle.remove();   // Lo elimino del DOM
    obstacles.shift();                // Y lo elimino de JS, eliminando el primer elemento del array
  } 
}

function detectColissionObstacle() {
  obstacles.forEach((eachObstacle) => {
    if (
      player.x < eachObstacle.x + eachObstacle.w &&
      player.x + player.w > eachObstacle.x &&
      player.y < eachObstacle.y + eachObstacle.h &&
      player.y + player.h > eachObstacle.y
    ) {
      if (lifeNode.innerText === "0") {
        gameOver();
      }

      if(!player.isVulnerable) {  // Que no le afecten las colisiones si se acaba de chocar (2 segundos)
        return;
      }

      // Si ha colisionado, que no reste más vidas:
      if (eachObstacle.isCollided === false) {   
        console.log("BOOM");
        lifeNode.innerText --;
        eachObstacle.isCollided = true;  // Este obstáculo ya colisionó

        // Efecto para saber que ha colisionado:  //todo Me gustaría mejorar el efecto
        console.log("Colisiono")
        invulnerablePlayer(2000);   // 2 segundos de invulnerabilidad
      }
    }
  });
}

function addObstacleMissile() {
  let randomPositionX = gameBoxNode.offsetWidth;
  let randomPositionY = Math.floor( Math.random() * (470));

  let newObstacleMissile = new Obstacle(randomPositionX, randomPositionY, "missile");
  obstacles.push(newObstacleMissile);
}

function invulnerablePlayer(timeForInvulnerability) {   //todo Podría hacer un efecto diferente según si choca o tiene bonus
  if (!player.isVulnerable) {
    return;
  }

  player.player.style.opacity = "0.3";
  player.isVulnerable = false;    // 
  console.log("Soy transparente")

  setTimeout(() => {
    player.player.style.opacity = "1";
    player.isVulnerable = true;
    console.log("Ya no lo soy", timeForInvulnerability)
    maskBonusInvulnerable = null;
  }, timeForInvulnerability);
}

function addDifficult() {   // Se activa de 5 en 5 puntos
  speedAppearanceObstacles -= 100;          

  // Nuevo intervalo de aparición de obstáculos:
  clearInterval(obstacleIntervalId);
  obstacleIntervalId = setInterval(() => {
    addObstacle();
  }, speedAppearanceObstacles);

  // Más velocidad a los obstáculos
  speedObstacle += 0.5;
}

// Fin del juego
function gameOver() {
  clearInterval(gameIntervalId);
  clearInterval(obstacleIntervalId);
  clearInterval(pointsIntervalId);
  clearInterval(obstacleMissileIntervalId);

  finalPoints.innerText = pointsNode.innerText;

  gameScreenNode.style.display = "none";
  gameOverScreenNode.style.display = "flex";
}


//* Eventos:
startBtnNode.addEventListener("click", startGame);
restartBtnNode.addEventListener("click", () => {

  clearInterval(gameIntervalId);
  clearInterval(obstacleIntervalId);
  clearInterval(pointsIntervalId);
  clearInterval(obstacleMissileIntervalId);

  gameBoxNode.innerHTML = "";   // Desaparece todo
  gameBoxNode.innerText = ""; 

  player = null;
  obstacles = [];
  applePoints = [];

  pointsNode.innerText = "0";
  currentPoints = 0;
  lifeNode.innerText = "3";
  speedObstacle = 2;

  speedAppearanceObstacles = 1000;

  gameScreenNode.style.display = "flex";
  gameOverScreenNode.style.display = "none";

  startGame();

});

// Movimiento del jugador
window.addEventListener("keydown", (event) => {
  if(event.key === "ArrowUp") {
    player.playerMovement("top");
  } else if(event.key === "ArrowDown") {
    player.playerMovement("down");
  }
});