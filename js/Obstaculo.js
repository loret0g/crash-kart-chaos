class Obstacle {
  constructor(positionX, positionY/*, type*/) {  // type es el tipo de tuberia (desde arriba o desde abajo)
    this.x = positionX;     // gameBoxNode.offsetWidth;
    this.y = positionY;     //* Valor dinámico, se asigna al crear el objeto
    this.w = 30;            //* Valor estático, siempre es igual
    this.h = 30;
    this.speed = speedObstacle;
    this.isCollided = false;   // Para saber si ha colisionado y no quitar todas las vidas de golpe

    // Al crear un obstáculo - Añadirlo al DOM 
    this.obstacle = document.createElement("img");

    let randomImg = Math.floor(Math.random() * 4) + 1;

    this.obstacle.src = `./images/obstacles/${randomImg}.png`;

    // -- Dependiendo del parámetro crea una u otra
    /*if(type === "arriba") {
      this.obstacle.src = "./images/obstacle_top.png";
    } else if(type === "abajo") {
      this.obstacle.src = "./images/obstacle_bottom.png";
    }*/
    gameBoxNode.append(this.obstacle);

    if(this.obstacle.src.includes("3.png")) {
      this.w = 40;
      this.h = 50;
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