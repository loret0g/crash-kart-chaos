class Misil {
  constructor(positionY) {
    this.x = 60;
    this.y = positionY;
    this.w = 100;
    this.h = 75;
    this.speed = 10;
    this.isCollided = false;

    this.misil = document.createElement("img");
    this.misil.src = "./images/misil.png";
    gameBoxNode.append(this.misil);

    this.misil.style.width = `${this.w}px`;
    this.misil.style.height = `${this.h}px`;
    this.misil.style.position = "absolute";
    this.misil.style.top = `${this.y}px`;
    this.misil.style.left = `${this.x}px`;
  }

  moveMissile() {
    this.x += this.speed;
    this.misil.style.left = `${this.x}px`;
  }
}