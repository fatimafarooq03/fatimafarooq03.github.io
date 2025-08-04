document.addEventListener("DOMContentLoaded", () => {
  /* ───────────────────────── 1. Splash / typing ───────────────────────── */
  const text = "fatima.farooq@portfolio.com";
  const typedText = document.getElementById("typed-text");
  const arrow = document.getElementById("arrow-enter");
  let index = 0;

  (function type() {
    if (index < text.length) {
      typedText.textContent += text.charAt(index++);
      setTimeout(type, 80);
    } else {
      arrow.style.display = "inline";
    }
  })();

  arrow.addEventListener("click", () => {
    document.querySelector(".splash-container").style.display = "none";
    document.getElementById("main-page").style.display = "block";
  });

  /* ───────────────────────── 2. About-section reveal ───────────────────── */
  const aboutBubble = document.getElementById("aboutBubble");
  const aboutImage = document.getElementById("aboutImage");
  const aboutSection = document.getElementById("about");

  if (aboutSection && aboutBubble && aboutImage) {
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          aboutBubble.classList.add("visible");
          aboutImage.classList.add("visible");
          aboutObserver.unobserve(aboutSection); // run once
        }
      },
      { threshold: 0.5 }
    );
    aboutObserver.observe(aboutSection);
  }

  /* ───────────────────────── 3. Timeline scroll-reveal ─────────────────── */
  const timelineItems = document.querySelectorAll(".timeline-item");

  if (timelineItems.length) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            timelineObserver.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.2 } // adjust for earlier/later trigger
    );

    timelineItems.forEach((item) => timelineObserver.observe(item));
  }
});
