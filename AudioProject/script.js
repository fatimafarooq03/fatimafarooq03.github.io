// Subtitle box
const subtitleBox = document.getElementById('subtitle-container');

// Map of audio elements by country name (match img alt text)
const audioMap = {
  "France": document.getElementById("audio-france"),
  "Pakistan": document.getElementById("audio-pakistan"),
  "UAE": document.getElementById("audio-uae"),
  "Spain": document.getElementById("audio-spain")
};

document.querySelectorAll('.play-btn').forEach(button => {
  button.addEventListener('click', () => {
    const wrapper = button.parentElement;
    const img = wrapper.querySelector('.country-img');
    const country = img.alt;
    const audio = audioMap[country];

    // Reset UI and stop all others
    document.querySelectorAll('.play-btn').forEach(btn => {
      if (btn !== button) {
        btn.textContent = '▶';
        btn.classList.remove('playing');
      }
    });
    document.querySelectorAll('.country-img').forEach(i => {
      if (i !== img) {
        i.classList.remove('playing');
      }
    });
    Object.values(audioMap).forEach(a => {
      a.pause();
      a.currentTime = 0;
    });

    // If already playing, stop it
    if (button.classList.contains('playing')) {
      audio.pause();
      audio.currentTime = 0;
      button.classList.remove('playing');
      button.textContent = '▶';
      img.classList.remove('playing');
      subtitleBox.style.display = 'none';
      return;
    }

    // Play selected audio
    button.classList.add('playing');
    button.textContent = '■';
    img.classList.add('playing');
    subtitleBox.style.display = 'block';
    subtitleBox.innerText = ''; // clear previous text

    audio.play();

    const track = audio.textTracks[0];
    track.mode = 'showing'; // not showing browser default

    // Listen to subtitle cue changes
    track.oncuechange = () => {
      const cue = track.activeCues[0];
      subtitleBox.innerHTML = cue ? cue.text.replace(/\n/g, '<br>') : '';

    };

    // When audio ends
    audio.addEventListener('ended', () => {
      button.classList.remove('playing');
      button.textContent = '▶';
      img.classList.remove('playing');
      subtitleBox.style.display = 'none';
    });
  });
});
