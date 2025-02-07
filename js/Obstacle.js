class Obstacle {
  constructor(positionX, positionY, type) {
    this.x = positionX;
    this.y = positionY;
    // Valor base uniforme para todos los obstáculos
    this.w = 40 * scaleFactor;
    this.h = 40 * scaleFactor;
    this.speed = speedObstacle;
    this.isCollided = false;

    this.obstacle = document.createElement("img");
    let randomImg = Math.floor(Math.random() * 4) + 1;
    
    if (type === "box") {
      this.obstacle.src = `./images/obstacles/${randomImg}.png`;
    } else if (type === "missile") {
      this.obstacle.src = `./images/obstacles/5.png`;
      this.speed = speedObstacle * 2;
    } else if (type === "robot") {
      this.obstacle.src = `./images/obstacles/robot-tnt.png`;
      this.speed = speedObstacle * 2;
    }
    
    gameBoxNode.append(this.obstacle);
    
    // Si deseas conservar ajustes específicos para ciertos obstáculos,
    // asegúrate de multiplicar por scaleFactor en cada caso.
    if (this.obstacle.src.includes("3.png") || this.obstacle.src.includes("robot-tnt.png")) {
      this.w = 45 * scaleFactor;
      this.h = 55 * scaleFactor;
    } else if (this.obstacle.src.includes("5.png")) {
      this.w = 60 * scaleFactor;
    }
    
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