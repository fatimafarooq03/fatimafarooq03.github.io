document.addEventListener("scroll", function() {
    let mermaid = document.getElementById("mermaid");
    let speechBubble = document.getElementById("speech-bubble");
    let treasureContainer = document.getElementById("treasure-container");
    let scrollPos = window.scrollY;
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    let movePercentage = scrollPos / maxScroll; // Normalize scroll progress (0 to 1)
    let screenWidth = window.innerWidth - mermaid.offsetWidth;

    // Limit speech bubble movement within screen bounds
    let speechBubbleWidth = speechBubble.offsetWidth;
    let maxSpeechMove = screenWidth - speechBubbleWidth - 20;

    let newMermaidPos = movePercentage * screenWidth;
    let newSpeechBubblePos = movePercentage * maxSpeechMove;

    // Move the mermaid and speech bubble
    mermaid.style.transform = `translateX(${newMermaidPos}px)`;
    speechBubble.style.transform = `translateX(${newSpeechBubblePos}px)`;

    // Change text dynamically based on scroll position
    let story = [
        "Hello, I'm the mermaid!",
        "The ocean is vast and mysterious.",
        "I love swimming through the waves!",
        "Beware of the deep sea creatures...",
        "We're almost at the hidden treasure!",
        "You found the treasure!"
    ];

    let sectionNum = Math.floor(movePercentage * story.length);
    speechBubble.textContent = story[Math.min(sectionNum, story.length - 1)];

    // Show the treasure at the end of scrolling
    if (movePercentage > 0.95) {
        treasureContainer.style.display = "block";
    } else {
        treasureContainer.style.display = "none";
    }
});
