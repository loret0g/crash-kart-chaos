const muteBtn = document.getElementById("mute-btn");
const soundIcon = document.getElementById("sound-icon");
const audioElements = document.querySelectorAll("audio"); // Selecciona todos los elementos de audio

// Cambiar entre mute y unmute
muteBtn.addEventListener("click", () => {
  let isMuted = audioElements[0].muted; // Verifica el estado actual del primer audio (todos tendrán el mismo estado)

  // Alterna el estado de mute para todos los audios
  audioElements.forEach(audio => {
    audio.muted = !isMuted; // Cambia el estado
  });

  // Cambia el icono dependiendo del estado
  if (!isMuted) {
    soundIcon.src = "images/sound-off.png";
  } else {
    soundIcon.src = "images/sound-on.png";
  }
});
