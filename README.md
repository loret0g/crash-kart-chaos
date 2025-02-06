# Crash Kart Chaos
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) 
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 

# Descripción

Minijuego inspirado en el universo de Crash Bandicoot, en el que controlas a **Crash** para esquivar obstáculos y recoger objetos bonus que te otorgan puntos, misiles y vidas extras. La dificultad aumenta conforme avanzas, y al llegar a 50 puntos aparece un ítem especial que, si se recoge, te declara ganador.

**¡Ahora es responsive!**  
El juego se adapta a ordenadores, tablets y dispositivos móviles. Además, se han incorporado controles táctiles intuitivos:
- **Joystick virtual** para mover a Crash hacia arriba y abajo.
- **Botón de disparo estilo arcade** para lanzar misiles.

También se incluye un sistema de detección de dispositivos móviles que añade la clase `is-mobile` al `<body>` y muestra un aviso de rotación cuando el dispositivo está en orientación portrait.

## [¡Juega ya!](https://loret0g.github.io/crash-kart-chaos/)

# Funcionalidades

  **Obstáculos**:
  - **Invulnerabilidad tras choque**:
    - Después de colisionar con un obstáculo, el coche es invulnerable durante 2 segundos.
  - **Cajas TNT**: 
     - Aparecen de forma aleatoria en la pantalla.
     - Movimiento hacia el jugador.
     - Se incrementa su velocidad de movimiento y la frecuencia en la que aparecen cada 5 puntos.
  - **Enemigos más rápidos**: 
     - Aparecen de forma aleatoria en la pantalla.
     - Movimiento hacia el jugador.
     - Se incrementa su velocidad de movimiento cada 5 puntos.

  **Objetos bonus**:
  - **Cajas bonus [!]**: 
      - Cajas en movimiento con las que se obtienen 3 misiles.
      - Lanza misiles para destruir el primer obstáculo que encuentren en su camino.
  - **Invulnerabilidad**: 
      - Al llegar a 7 puntos, aparece un item que otorga invulnerabilidad por 3 segundos.
  - **Vida Extra**: 
      - Al alcanzar los 15 puntos, aparece un item que te proporciona una vida extra.
  - **Victoria**: 
      - Al llegar a 50 puntos, un item especial aparece desde la derecha y se queda a la altura del jugador. Si lo recoges, habrás ganado el juego.

   **Dificultad creciente**:
  - **A medida que avanzas en el juego, los obstáculos aparecerán con mayor frecuencia y a mayor velocidad, aumentando la dificultad.**
    
### Responsive y Controles Móviles
- **Diseño Responsive:**  
  La interfaz se adapta a diferentes tamaños de pantalla mediante un diseño flexible.
- **Controles táctiles:**  
  En dispositivos móviles se muestran en pantalla un joystick virtual para el movimiento y un botón de disparo.
- **Detección móvil y aviso de rotación:**  
  Se usa un script para detectar dispositivos móviles y mostrar un aviso si el dispositivo está en orientación portrait.

### Audio
- **Mute/Unmute:**  
  Un botón permite alternar el audio, actualizando el icono según el estado.