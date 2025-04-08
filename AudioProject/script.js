const titleElement = document.getElementById("page-title");
const bgVideo = document.getElementById("bg-video");
const pirateScene = document.getElementById("pirate-scene");
const landingButtons = document.getElementById("landing-options");

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

const progressBars = {
  "uae": document.getElementById("progress-uae"),
  "pakistan": document.getElementById("progress-pakistan"),
  "france": document.getElementById("progress-france"),
  "spain": document.getElementById("progress-spain")
};

// Home button resets everything
document.getElementById("home-btn").addEventListener("click", () => {
  // Hide country sections
  document.querySelectorAll('.country-page').forEach(page => {
    page.style.display = "none";
  });

  // Show landing elements
  bgVideo.style.display = "block";
  titleElement.textContent = "The Treasure Trail Across Borders";
  pirateScene.style.display = "flex";
  landingButtons.style.display = "block";

  // Reset all audio
  Object.values(audioMap).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
    audio.playbackRate = 1;
  });

  Object.values(subtitleBoxes).forEach(box => box.style.display = "none");
  Object.values(progressBars).forEach(bar => bar.value = 0);
  document.querySelectorAll('.play-btn').forEach(btn => btn.textContent = "▶");
  document.querySelectorAll('.speed-btn').forEach(btn => btn.textContent = "Speed: 1x");
});

// Handle all country buttons
document.querySelectorAll('[data-country]').forEach(button => {
  const selected = button.getAttribute('data-country');
  if (!selected || !audioMap[selected]) return;

  button.addEventListener('click', () => {
    // Hide landing page content
    bgVideo.style.display = "none";
    pirateScene.style.display = "none";
    landingButtons.style.display = "none";

    // Update title
    titleElement.textContent = selected === "uae"
      ? "UAE"
      : selected.charAt(0).toUpperCase() + selected.slice(1);

    // Show the selected country section
    document.querySelectorAll('.country-page').forEach(page => {
      page.style.display = page.id === `${selected}-page` ? 'block' : 'none';
    });

    // Reset audio/subtitles/progress for all countries
    Object.keys(audioMap).forEach(k => {
      const a = audioMap[k];
      a.pause();
      a.currentTime = 0;
      a.playbackRate = 1;
      subtitleBoxes[k].style.display = 'none';
      progressBars[k].value = 0;
      document.querySelector(`.speed-btn[data-audio="${k}"]`).textContent = 'Speed: 1x';
    });

    document.querySelectorAll('.play-btn').forEach(btn => btn.textContent = '▶');
  });
});

// Handle play/pause audio logic
document.querySelectorAll('.play-btn').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.getAttribute('data-audio');
    const audio = audioMap[key];
    const subtitleBox = subtitleBoxes[key];
    const progressBar = progressBars[key];

    Object.entries(audioMap).forEach(([k, a]) => {
      if (k !== key) {
        a.pause();
        a.currentTime = 0;
        subtitleBoxes[k].style.display = 'none';
        progressBars[k].value = 0;
      }
    });

    document.querySelectorAll('.play-btn').forEach(btn => {
      if (btn !== button) btn.textContent = '▶';
    });

    if (audio.paused) {
      audio.play();
      button.textContent = '■';
      subtitleBox.style.display = 'block';
      const track = audio.textTracks[0];
      track.mode = 'showing';
      track.oncuechange = () => {
        const cue = track.activeCues[0];
        subtitleBox.innerHTML = cue ? cue.text.replace(/\n/g, '<br>') : '';
      };
    } else {
      audio.pause();
      button.textContent = '▶';
      subtitleBox.style.display = 'none';
    }

    audio.ontimeupdate = () => {
      if (!isNaN(audio.duration)) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
      }
    };

    progressBar.oninput = () => {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    };

    audio.onended = () => {
      button.textContent = '▶';
      subtitleBox.style.display = 'none';
      progressBar.value = 0;
    };
  });
});

// Handle speed changes
document.querySelectorAll('.speed-btn').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.getAttribute('data-audio');
    const audio = audioMap[key];
    const speeds = [1, 1.25, 1.5, 2];
    let current = speeds.indexOf(audio.playbackRate);
    let next = (current + 1) % speeds.length;
    audio.playbackRate = speeds[next];
    button.textContent = `Speed: ${speeds[next]}x`;
  });
});

// Ensure landing visuals show on first load
window.onload = () => {
  bgVideo.style.display = 'block';
  pirateScene.style.display = 'flex';
  landingButtons.style.display = 'block';
  titleElement.textContent = 'The Treasure Trail Across Borders';
};
