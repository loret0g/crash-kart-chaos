class Obstacle {
  constructor(positionX, positionY) {
    this.x = positionX;
    this.y = positionY;
    this.w = 30;
    this.h = 30;
    this.speed = 2;
    this.isCollided = false;   // Para saber si ha colisionado y no quitar todas las vidas de golpe

    // Al crear un obstáculo - Añadirlo al DOM 
    this.obstacle = document.createElement("img");

    this.obstacle.src = "./images/obstacles/1.png";

    gameBoxNode.append(this.obstacle);

    // Ajustamos sus dimensiones y posición:
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