class Bonus {
  constructor(positionX, positionY, type) {
    this.x = positionX;
    this.y = positionY;
    this.w = 30;
    this.h = 30;
    this.speed = 2;
    this.isCollided = false;

    this.bonus = document.createElement("img");
    this.bonus.style.width = `${this.w}px`;
    this.bonus.style.height = `${this.h}px`;

    if (type === "points") {
      this.bonus.src = `./images/point.png`;
    } else if (type === "extra") {
      this.bonus.src = `./images/extra.png`;
      this.bonus.style.width = `50px`;
      this.bonus.style.height = `50px`;
      this.w = 50; 
      this.h = 50;
    } else if (type === "life") {
      this.bonus.src = `./images/oro.webp`;
      this.bonus.style.width = `50px`;
      this.bonus.style.height = `50px`;
      this.w = 50;
      this.h = 50;
    } else if (type === "missile") {
      this.bonus.src = `./images/misil-box.png`;
    } else if (type === "winner") {
      this.bonus.src = `./images/cristal.png`;
      this.bonus.style.width = `20px`;
      this.bonus.style.height = `70px`;
      this.w = 20;
      this.h = 70;
    }

    gameBoxNode.append(this.bonus);

    this.bonus.style.position = "absolute";
    this.bonus.style.top = `${this.y}px`;
    this.bonus.style.left = `${this.x}px`;
  }

  itemMovement() {
    this.x -= this.speed;
    this.bonus.style.left = `${this.x}px`;
  }

  winnerMovement() {
    if (this.x > 80) {    // Moverlo hacia la izquierda hasta X=80 (cerca del player)
      this.x -= this.speed;
      this.bonus.style.left = `${this.x}px`;
    }
  }
}