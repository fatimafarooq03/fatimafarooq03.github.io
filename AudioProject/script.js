const subtitleBox = document.getElementById('subtitle-container');
const countryPages = document.querySelectorAll('.country-page');
const audioMap = {
  "uae": document.getElementById("audio-uae"),
  "pakistan": document.getElementById("audio-pakistan"),
  "france": document.getElementById("audio-france"),
  "spain": document.getElementById("audio-spain")
};

// Show selected country page and hide others
document.querySelectorAll('.nav-item').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.getAttribute('data-country');
    countryPages.forEach(page => {
      page.style.display = page.id === `${selected}-page` ? 'block' : 'none';
    });
    subtitleBox.style.display = 'none';
  });
});

// Handle play button functionality
document.querySelectorAll('.play-btn').forEach(button => {
  button.addEventListener('click', () => {
    const audioId = button.getAttribute('data-audio');
    const audio = audioMap[audioId];

    // Reset others
    Object.values(audioMap).forEach(a => {
      if (a !== audio) {
        a.pause();
        a.currentTime = 0;
      }
    });
    document.querySelectorAll('.play-btn').forEach(b => {
      if (b !== button) b.textContent = '▶';
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
