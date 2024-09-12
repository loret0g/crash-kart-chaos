//* ELEMENTOS PRINCIPALES DEL DOM

// 3 pantallas
const splashScreenNode = document.querySelector("#splash-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");

// Botones de Iniciar y reiniciar
const startBtnNode = document.querySelector("#start-btn")
const restartBtnNode = document.querySelector("#restart-btn")

// Game box
const gameBoxNode = document.querySelector("#game-box");

// Score panel - Bonus misil, puntos y vida
let textMissileNode = document.querySelector("#bonus-box p");
let pointsNode = document.querySelector("#points");
let lifeNode = document.querySelector("#life");

// Puntos pantalla final
let finalPoints = document.querySelector("#game-over-screen h2");

// Objetos del game-box
let player = null;
let obstacles = [];
let applePoints = [];
let bonusInvulnerable = []
let bonusLife = [];
let bonusBoxMissile = [];

let maskBonusInvulnerable = null;  // Objeto => Ítem para bonus invulverabilidad (máscara)
let lifeExtraBonus = null;         // Objeto => Ítem para vida extra
let newMissile = null;             // Objeto => Ítem para obtener misiles

// Velocidades para intervalos e intervalos globales
let speedAppearanceObstacles = 1000;
let speedPoints = 1000;
let speedAppearanceObstaclesMissile = 1000;   //! Cambiarle el nombre para que sirva para el robot, o hacer otro
let speedAppearanceBonusBoxMissile = 2000;

let gameIntervalId = null;
let obstacleIntervalId = null;
let pointsIntervalId = null;
let obstaclePlaneMissileIntervalId = null;
let obstacleRobotBoxIntervalidId = null;
let bonusShotMissileIntervalId = null;

// Variable global para modificar la velocidad del objeto Obstaculo y que haga efecto al subir de nivel a los nuevos objetos que se creen
let speedObstacle = 2;
let currentMissile = 0;

// Elementos de audio:
let startAudio = document.querySelector("#game-audio");
let lostLifeAudio = document.querySelector("#life-audio");
let bonusInvulnerableAudio = document.querySelector("#mask-audio");

startAudio.volume = 0.3;
lostLifeAudio.volume = 0.4;
bonusInvulnerableAudio.volume = 0.4;

startAudio.addEventListener("ended", () => {
  // Cuando el audio termina, el siguiente loop inicia en el segundo 10
  startAudio.currentTime = 10;
  startAudio.play();
});


//* Funciones de inicio:
function startGame() {
  startAudio.play();
  // 1. Cambiar las pantallas, ocultar la de inicio y mostrar la de juego:
  splashScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";

  // 2. Añadir jugador al inicio:
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

  obstaclePlaneMissileIntervalId = setInterval(() => {
    addObstaclePlaneMissile();
  }, speedAppearanceObstaclesMissile);

  obstacleRobotBoxIntervalidId = setInterval(() => {    //! IMPLEMENTANDO
    addObstacleRobotBox();
  }, 3000);    //todo le cambio la velocidad a este??

  bonusShotMissileIntervalId = setInterval(() => {
    addBonusShotMissile();
  }, speedAppearanceBonusBoxMissile);
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
  applePointsLeaveScreen();
  detectColissionBonusApplePoints();

  detectColissionBonusMaskInvulnerability();
  detectColissionBonusLife();

  bonusBoxMissile.forEach((eachItem) => {
    eachItem.itemMovement();
  });
  boxMissileLeaveScreen();
  detectColissionBonusBoxMissile();

  player.misilArray.forEach((eachMisille) => {
    eachMisille.moveMissile();
  });
  missileLeaveScreen();
  detectColissionMissileWithObstacles();

}

//* Funciones de bonus (puntos / invulnerabilidad / vidas extra / misiles)
function addPoints() {
  let randomPositionX = Math.floor(Math.random() * (870 - 400) + 400);  // Valor aleatorio entre 400px y 870px
  let randomPositionY = Math.floor( Math.random() * (470));  // Número aleatorio entre 0 y 470 (casi lo que mide el game-box)

  // Variable local para añadir al array global:
  let newItem = new Bonus(randomPositionX, randomPositionY, "points");    // Posición Y en 0 (desde arriba)
  applePoints.push(newItem);
}

function addExtraBonusInvulnerable() {
  let randomPositionY = Math.floor( Math.random() * (470));  // Número aleatorio en el eje Y
  maskBonusInvulnerable = new Bonus(80, randomPositionY, "extra");    // Eje X a 80 (altura del player)
  bonusInvulnerable.push(maskBonusInvulnerable);
}

function addExtraLife() {
  let randomPositionY = Math.floor( Math.random() * (470));          // Número aleatorio en el eje Y
  lifeExtraBonus = new Bonus(80, randomPositionY, "life");    // Eje X a 80 (altura del player)
  bonusLife.push(lifeExtraBonus);
}

function addBonusShotMissile() {
  let randomPositionX = Math.floor(Math.random() * (870 - 400) + 400);
  let randomPositionY = Math.floor( Math.random() * (470));

  newMissile = new Bonus(randomPositionX, randomPositionY, "missile");    // Posición Y en 0 (desde arriba)
  bonusBoxMissile.push(newMissile);
}

function applePointsLeaveScreen() {
  if(applePoints.length === 0) {
    return;
  }

  if((applePoints[0].x) <= 0) {         // Si el primer obstáculo sale de la pantalla (eje X)
    applePoints[0].bonus.remove();      // Lo elimino del DOM
    applePoints.shift();                // Y lo elimino de JS, eliminando el primer elemento del array
  } 
}

function boxMissileLeaveScreen() {
  if(bonusBoxMissile.length === 0) {
    return;
  }

  if((bonusBoxMissile[0].x) <= 0) {         // Si el primer obstáculo sale de la pantalla (eje X)
    bonusBoxMissile[0].bonus.remove();      // Lo elimino del DOM
    bonusBoxMissile.shift();                // Y lo elimino de JS, eliminando el primer elemento del array
  } 
}

function missileLeaveScreen() {
  if(player.misilArray.length === 0) {
    return;
  }
  if((player.misilArray[0].x) >= gameBoxNode.offsetWidth) {
    player.misilArray[0].misil.remove();
    player.misilArray.shift();
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
  bonusInvulnerable.forEach((eachItemBonusMask, index) => {
    if (
      player.x < eachItemBonusMask.x + eachItemBonusMask.w &&
      player.x + player.w > eachItemBonusMask.x &&
      player.y < eachItemBonusMask.y + eachItemBonusMask.h &&
      player.y + player.h > eachItemBonusMask.y
    ) {
      if (eachItemBonusMask.isCollided === false) {
        eachItemBonusMask.bonus.remove();         // Elimino del DOM
        bonusInvulnerable.splice(index, 1);  // Eliminar del array

        bonusInvulnerableAudio.play();
        invulnerablePlayer(3000, "bonusMask");
        eachItemBonusMask.isCollided = true;
      }
    }
  });
}

function detectColissionBonusLife() {
  bonusLife.forEach((eachItemBonusLife, index) => {
    if (
      player.x < eachItemBonusLife.x + eachItemBonusLife.w &&
      player.x + player.w > eachItemBonusLife.x &&
      player.y < eachItemBonusLife.y + eachItemBonusLife.h &&
      player.y + player.h > eachItemBonusLife.y
    ) {
      console.log("Cojo la vida");
      if (eachItemBonusLife.isCollided === false) {
        console.log(lifeNode.innerText);

        eachItemBonusLife.bonus.remove();         // Elimino del DOM
        bonusLife.splice(index, 1);  // Eliminar del array
        
        let currentLives = parseInt(lifeNode.innerText);
        lifeNode.innerText = currentLives + 1;

        console.log(lifeNode.innerText);

        eachItemBonusLife.isCollided = true;    // Colisionado (como se elimina el objeto.. cuando se vuelva a crear estará en false)
      }
    }
  });
}

function detectColissionBonusBoxMissile() {    //todo ¿¿AUDIO PARA CUANDO COJA BONUS??
  bonusBoxMissile.forEach((eachBoxMissile, index) => {
    if (
      player.x < eachBoxMissile.x + eachBoxMissile.w &&
      player.x + player.w > eachBoxMissile.x &&
      player.y < eachBoxMissile.y + eachBoxMissile.h &&
      player.y + player.h > eachBoxMissile.y
    ) {
      if (eachBoxMissile.isCollided === false) {

        eachBoxMissile.bonus.remove();
        bonusBoxMissile.splice(index, 1);

        currentMissile += 3;
        textMissileNode.innerText = currentMissile;

        eachBoxMissile.isCollided = true;

        // lostLifeAudio.play();
      }
    }
  });
}

function detectColissionMissileWithObstacles() {
  player.misilArray.forEach((eachMissile, missileIndex) => {
    obstacles.forEach((eachObstacle, obstacleIndex) => {
      if (
        eachMissile.x < eachObstacle.x + eachObstacle.w &&
        eachMissile.x + eachMissile.w > eachObstacle.x &&
        eachMissile.y < eachObstacle.y + eachObstacle.h &&
        eachMissile.y + eachMissile.h > eachObstacle.y
      ) {
        eachMissile.misil.remove();         // Si colisiona elimino ambos del DOM
        eachObstacle.obstacle.remove();

        player.misilArray.splice(missileIndex, 1);
        obstacles.splice(obstacleIndex, 1);
      }
    });
  });
}

function addScore() {
  pointsNode.innerText ++;

  // Cada 5 puntos, subir dificultad
  let currentPoints = parseInt(pointsNode.innerText);
  if (currentPoints % 5 === 0) {
    addDifficult();
  }

  // Cada 7 puntos, bonus extra de invulnerabilidad, durante 3 segundos. 
  if (currentPoints % 7 === 0) {
    addExtraBonusInvulnerable();
  }

  // Cada 15 puntos, aparece item para una vida extra
  if(currentPoints % 15 === 0) {
    addExtraLife();
  }
}

//* Funciones de obstáculos
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
        startAudio.pause();
        startAudio.currentTime = 0;
        gameOver();
      }

      if(!player.isVulnerable) {  // Que no le afecten las colisiones si se acaba de chocar (2 segundos)
        return;
      }

      // Si ha colisionado, que no reste más vidas:
      if (eachObstacle.isCollided === false) {   
        lifeNode.innerText --;
        eachObstacle.isCollided = true;  // Este obstáculo ya colisionó

        lostLifeAudio.play();

        // Efecto para saber que ha colisionado:
        invulnerablePlayer(2000, "damaged");   // 2 segundos de invulnerabilidad
      }
    }
  });
}

function addObstaclePlaneMissile() {
  let randomPositionX = gameBoxNode.offsetWidth;
  let randomPositionY = Math.floor( Math.random() * (470));

  let newObstacleMissile = new Obstacle(randomPositionX, randomPositionY, "missile");
  obstacles.push(newObstacleMissile);
}

function addObstacleRobotBox() {
  let randomPositionX = gameBoxNode.offsetWidth;
  let randomPositionY = Math.floor( Math.random() * (470));

  let newObstacleRobotBox = new Obstacle(randomPositionX, randomPositionY, "robot");
  obstacles.push(newObstacleRobotBox);
}

function invulnerablePlayer(timeForInvulnerability, type) {
  if (!player.isVulnerable) {
    return;
  }

  player.isVulnerable = false;

  let blinkInterval;

  if(type === "damaged") {
    blinkInterval = setInterval(() => {
      if(player.player.style.opacity === "1") {
        player.player.style.opacity = "0.3";
      } else {
        player.player.style.opacity = "1";
      }
    }, 200);
    
  } else if(type === "bonusMask") {
    player.player.classList.add("mask-invulnerable");
  }  

  setTimeout(() => {
    player.player.style.opacity = "1";
    clearInterval(blinkInterval);
    player.player.classList.remove("mask-invulnerable");

    player.isVulnerable = true;
    maskBonusInvulnerable = null;

    // if(type === "damaged") {
    //   player.player.style.opacity = "1";
    //   clearInterval(blinkInterval);
    // } else if(type === "bonusMask") {
    //   player.player.classList.remove("mask-invulnerable");
    // }    
    
  }, timeForInvulnerability);
}

function addDifficult() {   //* Se activa cada 5 puntos
  // Los obstáculos aparecen cada vez más rápido y la velocidad de movimiento aumenta
  speedAppearanceObstacles -= 100;          
  speedObstacle += 0.5;

  // Nuevo intervalo de aparición de obstáculos:
  clearInterval(obstacleIntervalId);
  obstacleIntervalId = setInterval(() => {
    addObstacle();
  }, speedAppearanceObstacles);

  // Las cajas bonus (de misiles) aparecen más tarde
  speedAppearanceBonusBoxMissile += 1000;

  clearInterval(bonusShotMissileIntervalId);
  bonusShotMissileIntervalId = setInterval(() => {
    addBonusShotMissile();
  }, speedAppearanceBonusBoxMissile);
}

//* Fin del juego
function gameOver() {
  clearInterval(gameIntervalId);
  clearInterval(obstacleIntervalId);
  clearInterval(pointsIntervalId);
  clearInterval(obstaclePlaneMissileIntervalId);
  clearInterval(bonusShotMissileIntervalId);

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
  clearInterval(obstaclePlaneMissileIntervalId);
  clearInterval(bonusShotMissileIntervalId);

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

//* Eventos del jugador
window.addEventListener("keydown", (event) => {
  if(event.key === "ArrowUp") {
    player.playerMovement("top");
  } else if(event.key === "ArrowDown") {
    player.playerMovement("down");
  }
});

window.addEventListener("keydown", (event) => {
  if(event.code === "Space") {
    player.createMissile();    
  }
});