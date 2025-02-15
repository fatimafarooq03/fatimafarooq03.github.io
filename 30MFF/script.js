function showText() {
    let number = document.getElementById("numberInput").value;
    let output = document.getElementById("outputText");

    if (number === "") {
        output.innerText = "Please enter a number!";
    } else if (number == 1) {
        output.innerText = "1. Asini checks her morning schedule for tomorrow and sets her alarms accordingly";
    } else if (number == 2) {
        output.innerText = "2. Asini goes to bed and tries to sleep but struggles to bc of her anxiety for the next day";
    } else if (number == 3) {
        output.innerText = "3. Asini wakes up, but she is behind schedule again because she was not able to sleep early the night before";
    }
    else if(number==4){
        output.innerText = "4. Asini gets dressed up but is not happy with her look for today, again";
    }
    else if(number==5){
        output.innerText = "5. Asini heads out and runs into Matriam (what an nyuad thing!)";
    }
    else if(number==6){
        output.innerText = "6. Asini and Mariam both grab breakfast together and enjoy a good conversation ";
    }
    else if(number==7){
        output.innerText = "7. Asini and Mariam then head to Comms Lab together (their first class of the day!) and start their day"; 

    }
    
}

function changeToSmiley() {
    let yesButton = document.getElementById("yesButton");
    yesButton.innerText = "😊";

    // Scroll to the morning routine section
    document.querySelector(".morning-routine").scrollIntoView({ behavior: "smooth" });

    // Change back to "YES" after 3 seconds
    setTimeout(() => {
        yesButton.innerText = "YES";
    }, 3000);
}

function changeToSadFace() {
    let noButton = document.getElementById("noButton");
    noButton.innerText = "😢";

    // Scroll to the top of the page
    document.body.scrollIntoView({ behavior: "smooth" });

    // Change back to "NO" after 3 seconds
    setTimeout(() => {
        noButton.innerText = "NO";
    }, 3000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

window.onscroll = function () {
    let button = document.getElementById("backToTop");
    if (document.documentElement.scrollTop > 300) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

window.onscroll = function () {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
};

function showFeedback(emoji) {
    let message = document.getElementById("feedback-message");
    if (emoji === "😊") {
        message.innerText = "Glad you love it!";
    } else if (emoji === "😐") {
        message.innerText = "Thanks for your feedback!";
    } else {
        message.innerText = "We'll work on making it better!";
    }
}
