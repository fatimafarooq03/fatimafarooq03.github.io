document.addEventListener("DOMContentLoaded", () => {
  // Typing animation
  const text = "fatima.farooq@portfolio.com";
  const typedText = document.getElementById("typed-text");
  const arrow = document.getElementById("arrow-enter");
  let index = 0;

  function type() {
    if (index < text.length) {
      typedText.textContent += text.charAt(index);
      index++;
      setTimeout(type, 80);
    } else {
      arrow.style.display = "inline";
    }
  }

  type();

  arrow.addEventListener("click", () => {
    document.querySelector(".splash-container").style.display = "none";
    document.getElementById("main-page").style.display = "block";
  });

  // Animate speech + image on About section visibility
  const aboutBubble = document.getElementById("aboutBubble");
  const aboutImage = document.getElementById("aboutImage");
  const aboutSection = document.getElementById("about");

  if (aboutSection && aboutBubble && aboutImage) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            aboutBubble.classList.add("visible");
            aboutImage.classList.add("visible");
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(aboutSection);
  }
});
