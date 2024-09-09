//* ELEMENTOS PRINCIPALES DEL DOM

// 3 pantallas
const splashScreenNode = document.querySelector("#splash-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")

// Botones de Iniciar y reiniciar
const startBtnNode = document.querySelector("#start-btn")
const restartBtnNode = document.querySelector("#restart-btn")

// Game box
const gameBoxNode = document.querySelector("#game-box")

// Puntos y vida
let pointsNode = document.querySelector("#points");
let lifeNode = document.querySelector("#life");

// 
let player = null;
let obstacles = [];
let pointsItem = [];

let speedAppearanceObstacles = 1000;   //* Cambia este valor! Está modo rápido para ver bien las pruebas
let speedPoints = 1000;      //* Cambia este valor! Está modo rápido para ver bien las pruebas

let gameIntervalId = null;
let obstacleIntervalId = null;
let pointsIntervalId = null;

// Variable global para modificar la velocidad del objeto Obstaculo y que haga efecto al subir de nivel a los nuevos objetos que se creen
let speedObstacle = 2; 


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
}

function gameLoop() {
  // Obstáculos
  obstacles.forEach((eachObstacle) => {
    eachObstacle.obstacleMovement();
  });
  obstacleLeaveScreen();
  detectColission();

  // Bonus -- Puntos por manzanas
  pointsItem.forEach((eachItem) => {
    eachItem.itemMovement();
  });
  itemLeaveScreen();
  detectBonus();
}

// Funciones del bonus (puntos)
function addPoints() {
  let randomPositionX = Math.floor(Math.random() * (870 - 400) + 400);  // Valor aleatorio entre 400px y 870px
  let randomPositionY = Math.floor( Math.random() * (470));  // Número aleatorio entre 0 y 470 (casi lo que mide el game-box)

  // Variable local para añadir al array global:
  let newItem = new Bonus(randomPositionX, randomPositionY);    // Posición Y en 0 (desde arriba)
  pointsItem.push(newItem);
}

function itemLeaveScreen() {
  if(pointsItem.length === 0) {
    return;
  }

  if((pointsItem[0].x) <= 0) {         // Si el primer obstáculo sale de la pantalla (eje X)
    pointsItem[0].bonus.remove();   // Lo elimino del DOM
    pointsItem.shift();                // Y lo elimino de JS, eliminando el primer elemento del array
  } 
}

function detectBonus() {
  pointsItem.forEach((eachItem, index) => {
    if (
      player.x < eachItem.x + eachItem.w &&
      player.x + player.w > eachItem.x &&
      player.y < eachItem.y + eachItem.h &&
      player.y + player.h > eachItem.y
    ) {
        eachItem.bonus.remove();        // Lo elimino del DOM
        pointsItem.splice(index, 1);    // Lo elimino del array

        pointsNode.innerText ++;

        // Subir dificultad cada 5 puntos
        let currentPoints = parseInt(pointsNode.innerText);
        if (currentPoints >= 5 && currentPoints % 5 === 0) {  // >= 5 porque sino me cambia la dificultad desde el inicio xD
          console.log("Velocidad", speedObstacle, "Puntos: ", currentPoints);
          addDifficult();
        }
    }
  });
}

// Funciones de obstáculos
function addObstacle() {
  // Genero las posiciones fuera de la zona de exclusión (donde se encuentra el jugador) (mayor que 400px) 
  //* Para la dificultad podría cambiar esto también, haciendo que aparezcan más cerca del jugador
  let randomPositionX = Math.floor(Math.random() * (870 - 400) + 400);  // Valor aleatorio entre 400px y 870px
  let randomPositionY = Math.floor( Math.random() * (470));  // Número aleatorio entre 0 y 470 (casi lo que mide el game-box)

  // Variable local para añadir al array global:
  let newObstacle = new Obstacle(randomPositionX, randomPositionY);    // Posición Y en 0 (desde arriba)
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

function detectColission() {
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

        // Efecto para saber que ha colisionado:
        invulnerablePlayer();
      }
      
    }
  });
}

function invulnerablePlayer() {
  player.player.style.opacity = "0.3";
  player.isVulnerable = false;    // 

  setTimeout(() => {
    player.isVulnerable = true;
    player.player.style.opacity = "1";
  }, 2000);
}

function addDifficult() {
  speedAppearanceObstacles -= 200;          

  // Nuevo intervalo de aparición de obstáculos:
  clearInterval(obstacleIntervalId);
  obstacleIntervalId = setInterval(() => {
    addObstacle();
  }, speedAppearanceObstacles);

  // Añadir velocidad a los obstáculos
  speedObstacle += 1;
}



// Fin del juego
function gameOver() {
  alert("Fin")
  clearInterval(gameIntervalId);
  clearInterval(obstacleIntervalId);
  clearInterval(pointsIntervalId);

  gameScreenNode.style.display = "none";
  gameOverScreenNode.style.display = "flex";
}



//* Eventos:
startBtnNode.addEventListener("click", startGame);
restartBtnNode.addEventListener("click", () => {
  gameBoxNode.innerHTML = "";   // Desaparece todo

  gameScreenNode.style.display = "flex";
  gameOverScreenNode.style.display = "none";


  pointsNode.innerText = 0;
  lifeNode.innerText = 3;

  speedObstacle = 2; 

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