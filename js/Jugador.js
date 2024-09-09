class Jugador {
  constructor() {
    //. Todos los pollitos se crean con estos valores (si fueran dinámicos... usaríamos los parámetros)
    this.x = 60;
    this.y = 220;
    this.h = 75;
    this.w = 75;
    this.speed = 10;

    // Añadir jugador al DOM
    this.player = document.createElement("img");
    this.player.src = "./images/crash.png";
    gameBoxNode.append(this.player);

    // Dimensiones y posición:
    this.player.style.width = `${this.w}px`;
    this.player.style.height = `${this.h}px`;
    this.player.style.position = "absolute";  // Para ajustar el top y el left en su padre (que es relative)
    this.player.style.top = `${this.y}px`;
    this.player.style.left = `${this.x}px`;
  }

  playerMovement(direction) {
    const gameBoxHeight = 500;  // Altura del área de juego -- En variable para poder modificarlo

    if (direction === "top" && this.y - this.speed >= 0) {    // En la 2ª condición compruebo que no salga del límite
      this.y -= this.speed;
      this.player.style.top = `${this.y}px`;
    } else if (direction === "down" && this.y + this.speed + this.h <= gameBoxHeight) {
      this.y += this.speed;
      this.player.style.top = `${this.y}px`;
    }
  }

}