//* ELEMENTOS PRINCIPALES DEL DOM

// 3 pantallas
const splashScreenNode = document.querySelector("#splash-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")

// Botón Start
const startBtnNode = document.querySelector("#start-btn")

// Game box
const gameBoxNode = document.querySelector("#game-box")

// Puntos y vida
let points = document.querySelector("#points");
let life = document.querySelector("#life");

// 
let player = null;
let obstacles = [];

let speedObstacles = 1000;   //* Cambia este valor! Está modo rápido para ver bien las pruebas
let speedPoints = 1000;      //* Cambia este valor! Está modo rápido para ver bien las pruebas

let gameIntervalId = null;
let obstacleIntervalId = null;

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
  }, speedObstacles);

  pointsIntervalId = setInterval(() => {
    addPoints();
  }, speedObstacles);
}


function gameLoop() {
  obstacles.forEach((eachObstacle) => {
    eachObstacle.obstacleMovement();
  });
  obstacleLeaveScreen();
  detectColission();
}

function addPoints() {

}

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
      if (life.innerText === "0") {
        gameOver();
      }

      // Si ha colisionado, que no reste más vidas:
      if (eachObstacle.isCollided === false) {   
        console.log("BOOM");
        life.innerText --;
        eachObstacle.isCollided = true;  // Este obstáculo ya colisionó

        //todo Hacer que el jugador parpadee o se ponga de otro color. Para saber que ha colisionado (con una función)
      }
      
    }
  });
}

function gameOver() {
  alert("Fin")
  clearInterval(gameIntervalId);
  clearInterval(obstacleIntervalId);

  gameScreenNode.style.display = "none";
  gameOverScreenNode.style.display = "flex";
}



//* Eventos:
startBtnNode.addEventListener("click", startGame);

// Movimiento del jugador
window.addEventListener("keydown", (event) => {
  if(event.key === "ArrowUp") {
    player.playerMovement("top");
  } else if(event.key === "ArrowDown") {
    player.playerMovement("down");
  }
});