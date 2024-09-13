class Bonus {
  constructor(positionX, positionY, type) {
    this.x = positionX;
    this.y = positionY;
    this.w = 30;
    this.h = 30;
    this.speed = 2;
    this.isCollided = false;  // Bandera para saber si ha colisionado

    this.bonus = document.createElement("img");
    this.bonus.style.width = `${this.w}px`;
    this.bonus.style.height = `${this.h}px`;
    
    if(type === "points") {
      this.bonus.src = `./images/point.png`;
      
    } else if(type === "extra") {
      this.bonus.src = `./images/extra.png`;
      this.bonus.style.width = `50px`;
      this.bonus.style.height = `50px`;
    } else if(type === "life") {
      this.bonus.src = `./images/oro.webp`;
      this.bonus.style.width = `50px`;
      this.bonus.style.height = `50px`;
    } else if(type === "missile") {
      this.bonus.src = `./images/misil-box.png`;
    } else if(type === "winner") {
      this.bonus.src = `./images/cristal.png`;
      this.bonus.style.width = `20px`;
      this.bonus.style.height = `70px`;
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

  winnerMovement() {
    if (this.x > 80) { // Si aún no ha alcanzado la posición del jugador, sigue moviéndose
      this.x -= this.speed;
      this.bonus.style.left = `${this.x}px`;
    } else {
      this.x = 80;
      this.bonus.style.left = `${this.x}px`;
    }
  }
}