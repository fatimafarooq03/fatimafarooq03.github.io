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

// --- NEW Elements and State Variables ---
const adventureFill = document.getElementById("adventure-fill");
const clueIcons = {
    "desert": document.getElementById("desert-clue"),
    "forest": document.getElementById("forest-clue"),
    "tower": document.getElementById("tower-clue"),
    "bull": document.getElementById("bull-clue")
};
let collectedClues = { desert: false, forest: false, tower: false, bull: false };
const countryClues = { uae: "desert", pakistan: "forest", france: "tower", spain: "bull" };
let visitedCountries = { uae: false, pakistan: false, france: false, spain: false };

// --- Background music setup ---
const backgroundMusic = new Audio("assets/shanty.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3; // Set lower volume for background music
let isAnyAudioPlaying = false;

// --- Coin Rain Variables ---
let coinRainActive = false;
let coins = [];
const coinImg = new Image();
coinImg.src = "assets/coin.png";

// --- VTT Handling Setup ---
// Store cue change listeners to remove them later if necessary
const cueChangeListeners = {};

function setupSubtitleDisplay(audioElement, subtitleBox) {
    if (!audioElement || !subtitleBox || !audioElement.textTracks || audioElement.textTracks.length === 0) {
        console.log("Missing elements for subtitle setup");
        return;
    }
    
    const track = audioElement.textTracks[0];
    track.mode = 'hidden';
    
    // Debug logging
    console.log("Setting up subtitle track:", track);
    
    // Show subtitle container when audio plays
    audioElement.addEventListener('play', () => {
        subtitleBox.style.display = 'block';
        console.log("Audio playing, subtitle container shown");
    });
    
    // Handle cue changes
    track.addEventListener('cuechange', () => {
        const cue = track.activeCues ? track.activeCues[0] : null;
        console.log("Cue change detected:", cue);
        
        if (cue) {
            subtitleBox.innerHTML = `<p>${cue.text.replace(/\n/g, '<br>')}</p>`;
            subtitleBox.style.display = 'block'; // Ensure it's visible when cues are active
        } else {
            subtitleBox.innerHTML = '';
        }
    });
}


function clearSubtitleDisplay(audioElement, subtitleBox) {
    if (subtitleBox) {
        subtitleBox.innerHTML = '';
        subtitleBox.style.display = 'none';
    }
}

// Function to check if any audio is playing
function checkAudioPlayback() {
    isAnyAudioPlaying = Object.values(audioMap).some(audio => audio && !audio.paused);
    
    // Handle background music accordingly
    if (isAnyAudioPlaying) {
        if (!backgroundMusic.paused) {
            backgroundMusic.pause();
        }
    } else {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(e => {
                console.error("Background music play failed:", e);
            });
        }
    }
}

// --- Home button reset (Modified) ---
document.getElementById("home-btn").addEventListener("click", () => {
    document.querySelectorAll('.country-page').forEach(page => page.style.display = "none");
    bgVideo.style.display = "block";
    document.getElementById("background-animation").style.display = "none"; // Hide p5 animation
    titleElement.textContent = "The Treasure Trail Across Borders";
    pirateScene.style.display = "flex";
    landingButtons.style.display = "block";

    Object.entries(audioMap).forEach(([key, audio]) => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.playbackRate = 1;
            // Clear subtitles when going home
            clearSubtitleDisplay(audio, subtitleBoxes[key]);
        }
    });
    Object.values(progressBars).forEach(bar => { if(bar) bar.value = 0; });
    document.querySelectorAll('.play-btn').forEach(btn => btn.textContent = "▶");
    document.querySelectorAll('.speed-btn').forEach(btn => btn.textContent = "Speed: 1x");

    // Reset visited countries and collected clues
    visitedCountries = { uae: false, pakistan: false, france: false, spain: false };
    collectedClues = { desert: false, forest: false, tower: false, bull: false };
    updateAdventureProgress();
    
    if (clueIcons) {
        Object.values(clueIcons).forEach(icon => { if (icon) icon.classList.remove('found'); });
    }
    
    // Stop coin rain if active
    coinRainActive = false;
    coins = [];
    
    // Check and adjust background music
    checkAudioPlayback();
});

// --- Handle all country buttons (Modified) ---
document.querySelectorAll('[data-country]').forEach(button => {
    const selectedCountry = button.getAttribute('data-country');
    if (!selectedCountry || !audioMap[selectedCountry]) return;

    button.addEventListener('click', () => {
        bgVideo.style.display = "none";
        pirateScene.style.display = "none";
        landingButtons.style.display = "none";
        
        // Show p5 animation (water particles)
        document.getElementById("background-animation").style.display = "block";

        const countryName = selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1);
        const titles = { uae: "Scorching Sands of UAE", pakistan: "Flowing Rivers of Pakistan", spain: "Vibrant Streets of Spain", france: "City of Lights - France" };
        titleElement.textContent = titles[selectedCountry] || countryName;

        document.querySelectorAll('.country-page').forEach(page => {
            page.style.display = page.id === `${selectedCountry}-page` ? 'block' : 'none';
        });

        Object.keys(audioMap).forEach(k => {
            if (k !== selectedCountry) {
                const audio = audioMap[k];
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                    // Clear subtitles for non-selected countries
                    clearSubtitleDisplay(audio, subtitleBoxes[k]);
                }
                if (progressBars[k]) progressBars[k].value = 0;
                const otherPlayBtn = document.querySelector(`.play-btn[data-audio="${k}"]`);
                if(otherPlayBtn) otherPlayBtn.textContent = '▶';
            }
        });
        
        const currentAudio = audioMap[selectedCountry];
        const currentPlayBtn = document.querySelector(`.play-btn[data-audio="${selectedCountry}"]`);
        if (currentAudio && currentAudio.paused && currentPlayBtn) {
            currentPlayBtn.textContent = '▶';
            // Also ensure subtitle box is hidden if paused before playing
            clearSubtitleDisplay(currentAudio, subtitleBoxes[selectedCountry]);
        }

        if (visitedCountries && !visitedCountries[selectedCountry]) {
            visitedCountries[selectedCountry] = true;
            updateAdventureProgress();
            const clueType = countryClues[selectedCountry];
            if (clueType) collectClue(clueType);
        } else {
            updateAdventureProgress(selectedCountry);
        }
        
        // Check if all clues are collected and activate coin rain if needed
        checkAllCluesCollected();
        
        // Check and adjust background music
        checkAudioPlayback();
    });
});

// --- Handle play/pause audio logic (Modified for VTT) ---
document.querySelectorAll('.play-btn').forEach(button => {
    const key = button.getAttribute('data-audio');
    const audio = audioMap[key];
    const subtitleBox = subtitleBoxes[key];

    if (!audio) return; // Safety check

    button.addEventListener('click', () => {
        // Pause other audio and clear their subtitles
        Object.entries(audioMap).forEach(([otherKey, otherAudio]) => {
            if (otherKey !== key && otherAudio && !otherAudio.paused) {
                otherAudio.pause();
                const otherPlayBtn = document.querySelector(`.play-btn[data-audio="${otherKey}"]`);
                if(otherPlayBtn) otherPlayBtn.textContent = '▶';
                // Clear subtitles for the one being paused
                clearSubtitleDisplay(otherAudio, subtitleBoxes[otherKey]);
            }
        });

        // Toggle play/pause for the clicked audio
        if (audio.paused) {
            audio.play().catch(e => console.error("Audio play failed:", e));
            button.textContent = '⏸';
            // --- Setup VTT display ---
        } else {
            audio.pause();
            button.textContent = '▶';
            // --- Clear VTT display on pause ---
            clearSubtitleDisplay(audio, subtitleBox);
        }
        
        // Check and adjust background music based on audio playback
        setTimeout(() => checkAudioPlayback(), 100);
    });
});
Object.keys(audioMap).forEach(key => {
    const audio = audioMap[key];
    const subtitleBox = subtitleBoxes[key];
    if (audio) {
        audio.addEventListener('loadedmetadata', () => {
            setupSubtitleDisplay(audio, subtitleBox);
        });
    }
});

// Modify the audio playback logic
Object.keys(audioMap).forEach(country => {
    const audioElement = audioMap[country];

    audioElement.addEventListener('play', () => {
        // Pause the shanty if it's playing
        if (currentShanty && !currentShanty.paused) {
            currentShanty.pause();
        }
        isAnyAudioPlaying = true;
    });

    audioElement.addEventListener('ended', () => {
        isAnyAudioPlaying = false;
        // Resume the shanty if no other audio is playing
        if (!isAnyAudioPlaying && currentShanty) {
            currentShanty.play();
        }
    });
});

// Ensure shanties stop when any audio starts playing
backgroundMusic.addEventListener('play', () => {
    if (currentShanty && !currentShanty.paused) {
        currentShanty.pause();
    }
    isAnyAudioPlaying = true;
});

backgroundMusic.addEventListener('ended', () => {
    isAnyAudioPlaying = false;
    if (!isAnyAudioPlaying && currentShanty) {
        currentShanty.play();
    }
});


// --- Event listeners from original script (Modified for VTT) ---
Object.keys(audioMap).forEach(key => {
    const audio = audioMap[key];
    const progressBar = progressBars[key];
    const subtitleBox = subtitleBoxes[key]; // Get subtitle box for clearing on end

    if (audio && progressBar) {
        audio.addEventListener('timeupdate', () => {
            if (!isNaN(audio.duration)) {
                progressBar.value = (audio.currentTime / audio.duration) * 100;
            }
        });

        progressBar.addEventListener('input', () => {
            if (!isNaN(audio.duration)) {
                audio.currentTime = (progressBar.value / 100) * audio.duration;
                // Manually trigger cue check after seeking, as cuechange might not fire immediately
                if (audio.textTracks && audio.textTracks.length > 0) {
                    const track = audio.textTracks[0];
                    const listener = cueChangeListeners[audio.id];
                    if(listener && typeof listener === 'function') {
                        // Directly call the handler logic after a slight delay
                        // Timeout helps ensure the track's activeCues update after seek
                        setTimeout(() => {
                            const cue = track.activeCues ? track.activeCues[0] : null;
                            if (subtitleBox) {
                                subtitleBox.innerHTML = cue ? `<p>${cue.text.replace(/\n/g, '<br>')}</p>` : '';
                                subtitleBox.style.display = cue ? 'block' : 'none';
                            }
                        }, 50); // Small delay
                    }
                }
            }
        });

        audio.addEventListener('ended', () => {
            const playButton = document.querySelector(`.play-btn[data-audio="${key}"]`);
            if(playButton) playButton.textContent = '▶';
            progressBar.value = 0;
            audio.currentTime = 0;
            // --- Clear VTT display on end ---
            clearSubtitleDisplay(audio, subtitleBox);
            
            // Check and adjust background music after audio ends
            setTimeout(() => checkAudioPlayback(), 100);
        });
        
        // Add play and pause events to track for background music control
        audio.addEventListener('play', checkAudioPlayback);
        audio.addEventListener('pause', checkAudioPlayback);
    }
});

// Handle speed changes (No VTT changes needed here)
document.querySelectorAll('.speed-btn').forEach(button => {
    button.addEventListener('click', () => {
        const key = button.getAttribute('data-audio');
        const audio = audioMap[key];
        if (!audio) return;
        const speeds = [1, 1.25, 1.5, 0.75];
        const currentSpeed = (typeof audio.playbackRate === 'number' && audio.playbackRate > 0) ? audio.playbackRate : 1;
        let currentIndex = speeds.indexOf(currentSpeed);
        if (currentIndex === -1) { currentIndex = speeds.indexOf(1); if (currentIndex === -1) currentIndex = 0; }
        const nextIndex = (currentIndex + 1) % speeds.length;
        audio.playbackRate = speeds[nextIndex];
        button.textContent = `Speed: ${speeds[nextIndex]}x`;
    });
});

// --- NEW Functions ---
function updateAdventureProgress(currentActiveCountry = null) {
    if (!visitedCountries || !adventureFill) return;
    const visitedCount = Object.values(visitedCountries).filter(visited => visited).length;
    const totalCountries = Object.keys(visitedCountries).length;
    const progressPercentage = totalCountries > 0 ? (visitedCount / totalCountries) * 100 : 0;
    adventureFill.style.width = `${progressPercentage}%`;
    let lastVisitedDotId = null;
    Object.keys(visitedCountries).forEach(country => {
        const dot = document.getElementById(`dot-${country}`);
        if (dot) {
            if (visitedCountries[country]) {
                dot.classList.add('visited');
                if (country === currentActiveCountry) lastVisitedDotId = `dot-${country}`;
            } else { dot.classList.remove('visited'); }
            dot.classList.remove('active');
        }
    });
    if (!lastVisitedDotId) {
        const visitedOrder = ["uae", "pakistan", "spain", "france"];
        for (let i = visitedOrder.length - 1; i >= 0; i--) {
            if (visitedCountries[visitedOrder[i]]) { lastVisitedDotId = `dot-${visitedOrder[i]}`; break; }
        }
    }
    if (lastVisitedDotId) {
        const activeDot = document.getElementById(lastVisitedDotId);
        if (activeDot) activeDot.classList.add('active');
    }
}

function collectClue(clueType) {
    if (!collectedClues || !clueIcons || !collectedClues.hasOwnProperty(clueType)) return;
    if (!collectedClues[clueType]) {
        collectedClues[clueType] = true;
        const clueIcon = clueIcons[clueType];
        if (clueIcon) clueIcon.classList.add('found');
        
        // Check if all clues are collected
        checkAllCluesCollected();
    }
}

function checkAllCluesCollected() {
    if (!collectedClues) return false;
    
    const allCollected = Object.values(collectedClues).every(collected => collected === true);
    
    if (allCollected && !coinRainActive) {
        coinRainActive = true;
        startCoinRain();
        return true;
    }
    
    return allCollected;
}

function startCoinRain() {
    // Only set up if not already active
    if (!coinRainActive) return;
    
    // Create coin rain canvas if it doesn't exist
    let coinCanvas = document.getElementById('coin-rain-canvas');
    if (!coinCanvas) {
        coinCanvas = document.createElement('canvas');
        coinCanvas.id = 'coin-rain-canvas';
        coinCanvas.style.position = 'fixed';
        coinCanvas.style.top = '0';
        coinCanvas.style.left = '0';
        coinCanvas.style.width = '100%';
        coinCanvas.style.height = '100%';
        coinCanvas.style.pointerEvents = 'none';
        coinCanvas.style.zIndex = '10';
        document.body.appendChild(coinCanvas);
        
        // Set actual canvas dimensions
        coinCanvas.width = window.innerWidth;
        coinCanvas.height = window.innerHeight;
    }
    
    const ctx = coinCanvas.getContext('2d');
    
    // Function to create a new coin
    function createCoin() {
        if (!coinRainActive) return;
        
        const size = Math.random() * 20 + 15; // Random size between 15-35px
        
        coins.push({
            x: Math.random() * coinCanvas.width,
            y: -size,
            size: size,
            speed: Math.random() * 2 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 5 - 2.5,
            createdAt: Date.now()
        });
        
        // Limit max number of coins for performance
        if (coins.length > 100) {
            coins.shift(); // Remove oldest coin if we have too many
        }
    }
    
    // Animation function for the coins
    function animateCoins() {
        if (!coinRainActive) {
            // Clean up when inactive
            ctx.clearRect(0, 0, coinCanvas.width, coinCanvas.height);
            coinCanvas.remove();
            coins = [];
            return;
        }
        
        ctx.clearRect(0, 0, coinCanvas.width, coinCanvas.height);
        
        const currentTime = Date.now();
        // Filter out coins that are too old (10 seconds lifespan for cleanup)
        coins = coins.filter(coin => currentTime - coin.createdAt < 10000);
        
        coins.forEach(coin => {
            // Move the coin
            coin.y += coin.speed;
            coin.rotation += coin.rotationSpeed;
            
            // Draw the coin with rotation
            ctx.save();
            ctx.translate(coin.x, coin.y);
            ctx.rotate(coin.rotation * Math.PI / 180);
            ctx.drawImage(coinImg, -coin.size/2, -coin.size/2, coin.size, coin.size);
            ctx.restore();
            
            // Remove coins that have fallen off screen
            if (coin.y > coinCanvas.height + coin.size) {
                coin.y = -coin.size;
                coin.x = Math.random() * coinCanvas.width;
            }
        });
        
        requestAnimationFrame(animateCoins);
    }
    
    // Start the animation and create coins at intervals
    animateCoins();
    
    // Create new coins periodically (5 per page as requested)
    const coinInterval = setInterval(() => {
        if (!coinRainActive) {
            clearInterval(coinInterval);
            return;
        }
        
        for (let i = 0; i < 5; i++) {
            createCoin();
        }
    }, 1000); // Create 5 coins every second
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (!coinCanvas) return;
        coinCanvas.width = window.innerWidth;
        coinCanvas.height = window.innerHeight;
    });
}

// --- Window Onload ---
window.onload = () => {
    if (bgVideo) bgVideo.style.display = 'block';
    if (pirateScene) pirateScene.style.display = 'flex';
    if (landingButtons) landingButtons.style.display = 'block';
    if (titleElement) titleElement.textContent = 'The Treasure Trail Across Borders';
    
    // Initialize the adventure progress
    updateAdventureProgress();
    
    // Hide p5 background initially
    const bgAnimation = document.getElementById("background-animation");
    if (bgAnimation) bgAnimation.style.display = 'none';
    
 // Play background music immediately on page load
    backgroundMusic.volume = 0.3;
    backgroundMusic.loop = true;
    backgroundMusic.play().catch(e => {
        console.warn("Background music auto-play failed. User may need to interact first:", e);
        // Add a music enable button if autoplay fails
        createMusicEnableButton();
    });
    
    // --- Start: Typewriter Effect Code ---
    setTimeout(() => {
        const speechBubble = document.querySelector('.speech-bubble');
        const fullText = "Ahoy! Let's go find the treasure that hides somewhere across this globe,<br> but I know I must start from UAE — my home!";
        const typingSpeed = 50;
        let charIndex = 0;

        // Safety checks
        if (!pirateScene) {
            console.error("Pirate scene element not found.");
            return;
        }
        if (!speechBubble) {
            console.error("Speech bubble element not found for typing effect.");
            return;
        }

        // --- MAKE SCENE VISIBLE ---
        pirateScene.style.opacity = 1;

        function typeChar() {
            if (charIndex < fullText.length) {
                if (fullText.substring(charIndex, charIndex + 4) === '<br>') {
                    speechBubble.innerHTML += '<br>';
                    charIndex += 4;
                } else {
                    speechBubble.innerHTML += fullText.charAt(charIndex);
                    charIndex++;
                }
                setTimeout(typeChar, typingSpeed);
            }
        }

        typeChar(); // Start typing

    }, 1000); // 1 second delay
    // --- End: Typewriter Effect Code ---
};

// Add to script.js
document.addEventListener('mousemove', function(e) {
    const compassArrow = document.querySelector('.compass-arrow');
    if (compassArrow) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate angle based on mouse position relative to center
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI + 90;
        compassArrow.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
});

// Add to script.js
// Journal functionality
const journalIcon = document.getElementById('journal-icon');
const journalModal = document.getElementById('journal-modal');
const journalClose = document.getElementById('journal-close');
const journalEntries = document.getElementById('journal-entries');
const journalInput = document.getElementById('journal-input');
const journalSave = document.getElementById('journal-save');

// Auto-generated journal entries based on visited countries
const countryJournalEntries = {
    'uae': 'In the UAE, I found a clue buried in the dunes. The desert whispered ancient secrets as the scorching sun beat down upon my weathered face. I shall head to the rivers',
    'pakistan': 'The flowing rivers of Pakistan led me to a store where a shopkeeper told me I will find my next clue between the clashing of bull horns, is that spain??',
    'france': 'The vibrant streets of France echoed with the sounds of celebration as gold rained upon me! I will buy the Eiffel Tower!',
    'spain': 'I decoded the third clue. I also got charged by a Bull after talking to that old lady, it sent me flying to France.'
};

// Custom journal entries from user
let customEntries = JSON.parse(localStorage.getItem('treasureTrailJournal')) || [];

// Toggle journal modal
journalIcon.addEventListener('click', () => {
    journalModal.classList.remove('hidden');
    updateJournalEntries();
});

journalClose.addEventListener('click', () => {
    journalModal.classList.add('hidden');
});

// Save custom journal entry
journalSave.addEventListener('click', () => {
    if (journalInput.value.trim() !== '') {
        const date = new Date();
        customEntries.push({
            date: date.toLocaleDateString(),
            text: journalInput.value.trim()
        });
        localStorage.setItem('treasureTrailJournal', JSON.stringify(customEntries));
        journalInput.value = '';
        updateJournalEntries();
    }
});

// Update journal with auto entries and custom entries
function updateJournalEntries() {
    journalEntries.innerHTML = '';
    
    // Add auto-generated entries from visited countries
    Object.keys(visitedCountries).forEach(country => {
        if (visitedCountries[country] && countryJournalEntries[country]) {
            const entry = document.createElement('div');
            entry.className = 'journal-entry';
            entry.innerHTML = `<strong>${country.toUpperCase()} - ${new Date().toLocaleDateString()}</strong>
                             <p>${countryJournalEntries[country]}</p>`;
            journalEntries.appendChild(entry);
        }
    });
    
    // Add custom entries
    customEntries.forEach(entry => {
        const entryEl = document.createElement('div');
        entryEl.className = 'journal-entry';
        entryEl.innerHTML = `<strong>Personal Note - ${entry.date}</strong>
                           <p>${entry.text}</p>`;
        journalEntries.appendChild(entryEl);
    });
}

// Optional: Add this function if you want a backup in case autoplay is blocked
function createMusicEnableButton() {
    const musicBtn = document.createElement('button');
    musicBtn.textContent = '🎵 Enable Music';
    musicBtn.style.position = 'fixed';
    musicBtn.style.bottom = '20px';
    musicBtn.style.left = '20px'; // Changed from 'right' to 'left'
    musicBtn.style.zIndex = '100';
    musicBtn.className = 'nav-item';
    musicBtn.addEventListener('click', () => {
        if (musicBtn.textContent === '🎵 Enable Music') {
            playShanty(currentShantyIndex);
            musicBtn.textContent = '🎵 Change Shanty';
        } else {
            changeShanty();
        }
    });
    document.body.appendChild(musicBtn);
}
// Modified p5.js Water Particle Background with fade out effect
document.addEventListener('DOMContentLoaded', function() {
    const backgroundContainer = document.getElementById('background-animation');
        createMusicEnableButton();
    if (!backgroundContainer) {
        const newContainer = document.createElement('div');
        newContainer.id = 'background-animation';
        document.body.appendChild(newContainer);
    }

    // p5 sketch in instance mode
    const backgroundSketch = new p5((p) => {
        let particles = [];
        const particleCount = 150; // Reduced particle count for performance
        let connectionThreshold = 150; // Increased connection distance for more visible connections
        let noiseScale = 0.008; 
        let noiseStrength = 0.2;
        let timeOffset = 0;
        let mouseRepelForce = 15;
        let mouseRepelRadius = 250;

        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('background-animation'); // Attach canvas to our container
            for (let i = 0; i < particleCount; i++) {
                createParticle();
            }
        };

        function createParticle(x = null, y = null, vy = 0) {
            // Blue color palette for particles with increased size
            const blueColor = p.color(
                p.random(0, 50),         // Low Red
                p.random(100, 200),      // Medium-High Green
                p.random(200, 255),      // High Blue
                p.random(100, 180)       // Higher Alpha (less transparency)
            );
            
            // Add creation timestamp for lifespan tracking
            const newParticle = {
                x: x || p.random(p.width),
                y: y || p.random(p.height),
                vx: p.random(-0.4, 0.4), // Increased initial velocity for more movement
                vy: vy || p.random(-0.5, 0.2), // More upward drift bias
                size: p.random(4, 8),    // Increased particle size
                color: blueColor,
                createdAt: Date.now(),   // Track creation time for lifespan
                alpha: p.random(100, 180), // Starting alpha
                dying: false,            // Flag for dying state
                fadeOutStart: 0          // When fade out begins
            };
            
            particles.push(newParticle);
        }

        p.draw = function() {
            p.clear(); // Clear canvas each frame
            timeOffset += 0.003; // Slightly faster time progression
            
            const currentTime = Date.now();
            
            // Create new particles to maintain count
            while (particles.length < particleCount) {
                createParticle();
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                
                // Check if particle should start dying
                if (!particle.dying && currentTime - particle.createdAt > 4500) { // Start dying at 4.5 seconds
                    particle.dying = true;
                    particle.fadeOutStart = currentTime;
                }
                
                // Handle dying particles
                if (particle.dying) {
                    // Calculate fade progress (500ms fade)
                    const fadeProgress = (currentTime - particle.fadeOutStart) / 1000;
                    if (fadeProgress >= 1) {
                        // Remove fully faded particles
                        particles.splice(i, 1);
                        continue;
                    }
                    // Update alpha based on fade progress
                    const startingAlpha = particle.alpha;
                    particle.alpha = startingAlpha * (1 - fadeProgress);
                }

                // --- Mouse Repulsion ---
                let dMouse = p.dist(particle.x, particle.y, p.mouseX, p.mouseY);
                if (dMouse < mouseRepelRadius) {
                    let force = (mouseRepelRadius - dMouse) / mouseRepelRadius;
                    let angle = p.atan2(particle.y - p.mouseY, particle.x - p.mouseX);
                    particle.vx += p.cos(angle) * force * mouseRepelForce * 0.1;
                    particle.vy += p.sin(angle) * force * mouseRepelForce * 0.1;
                }

                // --- Noise-based Movement ---
                const angle = p.noise(particle.x * noiseScale, particle.y * noiseScale, timeOffset) * p.TWO_PI * 2; 
                particle.vx += p.cos(angle) * noiseStrength;
                particle.vy += p.sin(angle) * noiseStrength;

                // --- Gravity/Buoyancy (Optional - subtle upward drift) ---
                particle.vy -= 0.008; // Increased upward force

                // --- Apply Velocity ---
                particle.x += particle.vx;
                particle.y += particle.vy;

                // --- Dampen Velocity ---
                particle.vx *= 0.95; 
                particle.vy *= 0.95;

                // --- Wrap Around Edges ---
                if (particle.x < -particle.size) particle.x = p.width + particle.size;
                if (particle.x > p.width + particle.size) particle.x = -particle.size;
                if (particle.y < -particle.size) particle.y = p.height + particle.size;
                if (particle.y > p.height + particle.size) particle.y = -particle.size;

                // --- Draw Connections ---
                for (let j = i - 1; j >= 0; j--) { // Check only previous particles
                    const other = particles[j];
                    const d = p.dist(particle.x, particle.y, other.x, other.y);

                    if (d < connectionThreshold) {
                        // Calculate alpha based on both particles
                        const connectionAlpha = p.map(d, 0, connectionThreshold, 80, 0) * 
                                               (particle.alpha / 180) * (other.alpha / 180);
                        
                        // Blue stroke color for connections
                        p.stroke(
                            100, // Cyan range
                            180, // Light blue range
                            255, // Max Blue
                            connectionAlpha
                        );
                        p.strokeWeight(0.8); // Slightly thicker lines
                        p.line(particle.x, particle.y, other.x, other.y);
                    }
                }

                // --- Draw Particle with current alpha ---
                p.noStroke();
                const particleColor = p.color(
                    p.red(particle.color),
                    p.green(particle.color),
                    p.blue(particle.color),
                    particle.alpha
                );
                p.fill(particleColor);
                p.ellipse(particle.x, particle.y, particle.size);
            }
        }; // End p.draw

        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };

        // Optional: Click interaction (adds particles flowing down)
        p.mouseClicked = function() {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                for (let i = 0; i < 8; i++) { // Create more particles on click
                    createParticle(p.mouseX + p.random(-20, 20), p.mouseY + p.random(-20, 20), p.random(0.1, 0.8));
                }
            }
        };
    }); // End p5 instance sketch
}); // End DOMContentLoaded listenerz
// Pirate Character Animation with p5.js
document.addEventListener('DOMContentLoaded', function() {
    let pirateSketch = new p5((p) => {
        let pirateImg;
        let x, y;
        let speedX, speedY;
        let direction = 1; // 1 for right, -1 for left
        let isActive = false;
        
        p.preload = function() {
            pirateImg = p.loadImage('assets/pirate.png');
        };
        
        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('pirate-character-container');
            
            // Initialize position and speed
            x = p.random(100, p.width - 100);
            y = p.height - 120; // Position at bottom
            speedX = p.random(1, 3);
            speedY = 0; // No vertical movement initially
            
            // Only show when on country pages
            isActive = document.getElementById('bg-video').style.display === 'none';
        };
        
        p.draw = function() {
            p.clear();
            
            // Check if we should be active (on country pages)
            isActive = document.getElementById('bg-video').style.display === 'none';
            
            if (!isActive) return;
            
            // Update position
            x += speedX * direction;
            
            // Bounce off edges
            if (x > p.width - 50) {
                x = p.width - 50;
                direction = -1; // Change direction to left
            } else if (x < 50) {
                x = 50;
                direction = 1; // Change direction to right
            }
            
            // Draw pirate with correct direction
            p.push();
            if (direction === -1) {
                p.translate(x, y);
                p.scale(-1, 1); // Flip horizontally for left direction
                p.image(pirateImg, -50, -100, 100, 100);
            } else {
                p.image(pirateImg, x - 50, y - 100, 100, 100);
            }
            p.pop();
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
});


let currentShantyIndex = 0;
const shantyCount = 8;
let currentShanty = null;

function playShanty(index) {
    if (currentShanty) {
        currentShanty.pause();
        currentShanty = null;
    }
    
    currentShanty = new Audio(`shanties/shanty${index + 1}.mp3`);
    currentShanty.volume = 0.5;
    currentShanty.addEventListener('ended', changeShanty);
    currentShanty.play().catch(error => {
        console.error("Error playing shanty:", error);
    });
}

function changeShanty() {
    currentShantyIndex = (currentShantyIndex + 1) % shantyCount;
    playShanty(currentShantyIndex);
}
