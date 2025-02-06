class Player {
  constructor() {
    this.x = 60;
    this.y = 220;
    this.w = 75;
    this.h = 75;
    this.speed = 15;
    this.isVulnerable = true;
    this.misilArray = [];

    // Añadir jugador al DOM
    this.player = document.createElement("img");
    this.player.src = "./images/crash.png";
    gameBoxNode.append(this.player);

    // Dimensiones y posición:
    this.player.style.width = `${this.w}px`;
    this.player.style.height = `${this.h}px`;
    this.player.style.position = "absolute";  // Posición absoluta para poder moverlo dentro del contenedor
    this.player.style.top = `${this.y}px`;
    this.player.style.left = `${this.x}px`;
  }

  playerMovement(direction) {
    const gameBoxHeight = gameBoxNode.clientHeight;   // Obtener la altura actual del contenedor de juego
    const playerHeight = this.player.clientHeight;    // Altura real del jugador, que puede ser igual a this.h o modificada por CSS

    // Definir márgenes de seguridad (safe margins) para evitar que el jugador se acerque demasiado a los bordes.
    let safeMarginTop = 0;
    let safeMarginBottom = 0;

    // Ajustar los márgenes según el tamaño del viewport
    if (window.innerHeight < 400) {
      safeMarginTop = 40;
      safeMarginBottom = 40;
    } else if (window.innerHeight < 800) {
      safeMarginTop = 60;
      safeMarginBottom = 60;
    } else {
      safeMarginTop = 0;
      safeMarginBottom = 0;
    }

    // Actualizar la posición según la dirección (arriba o abajo)
    if (direction === "top") {
      this.y -= this.speed;
    } else if (direction === "down") {
      this.y += this.speed;
    }

    // Limitar la posición para que el jugador no se salga del área de juego:
    // Se utiliza Math.max y Math.min junto con los safe margins para mantenerlo dentro de los límites.
    this.y = Math.max(safeMarginTop, Math.min(this.y, gameBoxHeight - playerHeight - safeMarginBottom));

    // Actualizar la posición en el DOM
    this.player.style.top = `${this.y}px`;
  }

  createMissile() {
    if (currentMissile > 0) {
      currentMissile--;
      textMissileNode.innerText = currentMissile;

      // Crear un nuevo objeto Misil, se pasa la posición vertical actual (donde se encuentra el jugador)
      let newMissile = new Missille(this.y);
      this.misilArray.push(newMissile);
      newMissile.moveMissile();
    }
  }
}