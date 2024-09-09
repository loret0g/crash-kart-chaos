class Bonus {
  constructor(positionX, positionY) {
    this.x = positionX;
    this.y = positionY;
    this.w = 30;
    this.h = 30;
    this.speed = 2;

    // Crear item (manzanas) que dan puntos y añadirlo al DOM
    this.bonus = document.createElement("img");
    this.bonus.src = `./images/point.png`;

    // -- Dependiendo del parámetro crea una u otra
    /*if(type === "arriba") {
      this.obstacle.src = "./images/obstacle_top.png";
    } else if(type === "abajo") {
      this.obstacle.src = "./images/obstacle_bottom.png";
    }*/
    gameBoxNode.append(this.bonus);

    // Dimensiones estáticas y posición aleatoria:
    this.bonus.style.width = `${this.w}px`;
    this.bonus.style.height = `${this.h}px`;
    this.bonus.style.position = "absolute";
    this.bonus.style.top = `${this.y}px`;
    this.bonus.style.left = `${this.x}px`;
  }

  itemMovement() {
    this.x -= this.speed;
    this.bonus.style.left = `${this.x}px`;
  }
}