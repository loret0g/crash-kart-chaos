class Obstacle {
  constructor(positionX, positionY, type) {  // type: tipo de obstáculo
    this.x = positionX;     // gameBoxNode.offsetWidth;
    this.y = positionY;     //* Valor dinámico, se asigna al crear el objeto
    this.w = 40;            //* Valor estático, siempre es igual
    this.h = 40;
    this.speed = speedObstacle; // Variable modificada en el main
    this.isCollided = false;   // Para saber si ha colisionado y no quitar todas las vidas de golpe

    // Al crear un obstáculo - Añadirlo al DOM 
    this.obstacle = document.createElement("img");

    let randomImg = Math.floor(Math.random() * 3) + 1; 

    // -- Dependiendo del parámetro crea una u otra
    if(type === "box") {
      this.obstacle.src = `./images/obstacles/${randomImg}.png`;
      this.obstacle.style.width = `${this.w}px`;
      this.obstacle.style.height = `${this.h}px`;
    } else if(type === "missile") {
      this.obstacle.src = `./images/obstacles/4.png`;
      this.obstacle.style.width = `190px`;
      this.obstacle.style.height = `155px`;
      this.speed = speedObstacle * 2;
    }

    gameBoxNode.append(this.obstacle);

    if(this.obstacle.src.includes("3.png")) {
      this.w = 45;
      this.h = 55;
    }

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