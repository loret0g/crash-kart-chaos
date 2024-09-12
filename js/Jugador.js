class Jugador {
  constructor() {
    this.x = 60;
    this.y = 220;
    this.w = 75;
    this.h = 75;
    this.speed = 15;
    this.isVulnerable = true;

    this.misilArray = [];
    // this.misil = null;  // Objeto misil?

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
    
      if (direction === "top" && this.y > 0) {    // Comprobamos que y no sea menor que 0
        this.y -= this.speed;
        if (this.y < 0) {  // Si la velocidad hace que se pase del borde, la ajustamos a 0
          this.y = 0;
        }
        this.player.style.top = `${this.y}px`;
      } else if (direction === "down" && this.y + this.h < gameBoxHeight) {   // Comprobamos que no sobrepase el borde inferior
        this.y += this.speed;
        if (this.y + this.h > gameBoxHeight) {  // Si la velocidad hace que se pase, lo ajustamos al borde
          this.y = gameBoxHeight - this.h;
        }
        this.player.style.top = `${this.y}px`;
      }
  }

  createMissile() {
    if(currentMissile > 0) {
      console.log(`Tengo ${currentMissile} misiles`)
      currentMissile --;
      textMissileNode.innerText = currentMissile;

      let newMissile = new Misil(this.y);    // Objeto misil que añado al array
      this.misilArray.push(newMissile);

      newMissile.moveMissile();
    }
  }

}