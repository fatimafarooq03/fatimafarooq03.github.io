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
