class Jugador {
  constructor() {
    this.x = 60;
    this.y = 220;
    this.h = 75;
    this.w = 75;
    this.speed = 15;
    this.isVulnerable = true;

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
      const gameBoxHeight = 500;  // Altura del área de juego
    
      // Movimiento hacia arriba y tope superior
      if (direction === "top" && this.y > 0) {    // Comprobamos que y no sea menor que 0
        this.y -= this.speed;
        if (this.y < 0) {  // Si la velocidad hace que se pase del borde, la ajustamos a 0
          this.y = 0;
        }
        this.player.style.top = `${this.y}px`;
      } 
      // Movimiento hacia abajo y tope inferior
      else if (direction === "down" && this.y + this.h < gameBoxHeight) {   // Comprobamos que no sobrepase el borde inferior
        this.y += this.speed;
        if (this.y + this.h > gameBoxHeight) {  // Si la velocidad hace que se pase, lo ajustamos al borde
          this.y = gameBoxHeight - this.h;
        }
        this.player.style.top = `${this.y}px`;
      }
  }

}