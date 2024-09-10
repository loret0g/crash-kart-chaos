class Bonus {
  constructor(positionX, positionY, type) {
    this.x = positionX;
    this.y = positionY;
    this.w = 30;
    this.h = 30;
    this.speed = 2;

    // Crear item (manzanas) que dan puntos y añadirlo al DOM
    this.bonus = document.createElement("img");
    

    // -- Dependiendo del parámetro crea una u otra
    if(type === "points") {
      this.bonus.src = `./images/point.png`;
      this.bonus.style.width = `${this.w}px`;
      this.bonus.style.height = `${this.h}px`;
    } else if(type === "extra") {
      this.bonus.src = `./images/extra.png`;
      this.bonus.style.width = `50px`;
      this.bonus.style.height = `50px`;
    }

    gameBoxNode.append(this.bonus);

    // Dimensiones estáticas y posición aleatoria:
    
    this.bonus.style.position = "absolute";
    this.bonus.style.top = `${this.y}px`;
    this.bonus.style.left = `${this.x}px`;
  }

  itemMovement() {
    this.x -= this.speed;
    this.bonus.style.left = `${this.x}px`;
  }
}