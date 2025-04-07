const audioMap = {
  "uae": document.getElementById("audio-uae"),
  "pakistan": document.getElementById("audio-pakistan"),
  "france": document.getElementById("audio-france"),
  "spain": document.getElementById("audio-spain")
};

const subtitleBoxes = {
  "uae": document.getElementById("subtitle-uae"),
  "pakistan": document.getElementById("subtitle-pakistan"),
  "france": document.getElementById("subtitle-france"),
  "spain": document.getElementById("subtitle-spain")
};

// Country selection buttons
const countryPages = document.querySelectorAll('.country-page');
document.querySelectorAll('.nav-item').forEach(button => {
  const selected = button.getAttribute('data-country');
  button.addEventListener('click', () => {
    countryPages.forEach(page => {
      page.style.display = page.id === `${selected}-page` ? 'block' : 'none';
    });
    Object.values(subtitleBoxes).forEach(box => {
      box.style.display = 'none';
    });
  });
});

// Play buttons
const playButtons = document.querySelectorAll('.play-btn');
playButtons.forEach(button => {
  button.addEventListener('click', () => {
    const key = button.getAttribute('data-audio');
    const audio = audioMap[key];
    const subtitleBox = subtitleBoxes[key];

    Object.entries(audioMap).forEach(([k, a]) => {
      if (k !== key) {
        a.pause();
        a.currentTime = 0;
        subtitleBoxes[k].style.display = 'none';
      }
    });

    playButtons.forEach(btn => {
      if (btn !== button) btn.textContent = '▶';
    });

    if (audio.paused) {
      button.textContent = '■';
      subtitleBox.style.display = 'block';
      subtitleBox.innerText = '';
      audio.play();

      const track = audio.textTracks[0];
      track.mode = 'showing';
      track.oncuechange = () => {
        const cue = track.activeCues[0];
        subtitleBox.innerHTML = cue ? cue.text.replace(/\n/g, '<br>') : '';
      };

      audio.onended = () => {
        button.textContent = '▶';
        subtitleBox.style.display = 'none';
      };
    } else {
      audio.pause();
      audio.currentTime = 0;
      button.textContent = '▶';
      subtitleBox.style.display = 'none';
    }
  });
});