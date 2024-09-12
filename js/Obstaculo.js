class Obstacle {
  constructor(positionX, positionY, type) {
    this.x = positionX;     // gameBoxNode.offsetWidth;
    this.y = positionY;
    this.w = 40;
    this.h = 40;
    this.speed = speedObstacle; // Variable modificada en el main
    this.isCollided = false;    // Para saber si ha colisionado y no quitar todas las vidas de golpe

    this.obstacle = document.createElement("img");

    let randomImg = Math.floor(Math.random() * 4) + 1; 

    // -- Dependiendo del parámetro crea uno u otro
    if(type === "box") {
      this.obstacle.src = `./images/obstacles/${randomImg}.png`;
    } else if(type === "missile") {
      this.obstacle.src = `./images/obstacles/5.png`;
      this.speed = speedObstacle * 2;
    } else if(type === "robot") {
      this.obstacle.src = `./images/obstacles/robot-tnt.png`;
      this.speed = speedObstacle * 2;
    }

    gameBoxNode.append(this.obstacle);

    if(this.obstacle.src.includes("3.png") || this.obstacle.src.includes("robot-tnt.png")) {
      this.w = 45;
      this.h = 55;
    } else if(this.obstacle.src.includes("5.png")) {
      this.w = 60;
    }

    // Ajustamos sus dimensiones y posición para el DOM:
    this.obstacle.style.width = `${this.w}px`;
    this.obstacle.style.height = `${this.h}px`;
    this.obstacle.style.position = "absolute";
    this.obstacle.style.top = `${this.y}px`;
    this.obstacle.style.left = `${this.x}px`; 
  }

  obstacleMovement() {
    this.x -= this.speed;
    this.obstacle.style.left = `${this.x}px`;
  }

}