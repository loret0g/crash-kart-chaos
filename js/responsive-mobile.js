document.addEventListener("DOMContentLoaded", () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|WPDesktop/i
                    .test(navigator.userAgent);

  if (isMobile) {
    document.body.classList.add("is-mobile");
  }
});