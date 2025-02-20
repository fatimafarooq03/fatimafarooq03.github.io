document.addEventListener("DOMContentLoaded", function () {
    const svg = document.querySelector("svg");

    if (!svg) {
        console.error("SVG not found!");
        return;
    }

    // Function to generate a random color
    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Select **all** elements inside the SVG (not just paths!)
    const elements = svg.querySelectorAll("*");

    elements.forEach((element) => {
        // Ignore <defs> and <style> elements
        if (element.tagName.toLowerCase() === "defs" || element.tagName.toLowerCase() === "style") {
            return;
        }

        // Click to change to a random color
        element.addEventListener("click", function () {
            const randomColor = getRandomColor();
            element.setAttribute("stroke", randomColor);
            element.setAttribute("fill", randomColor);
        });

        // Hover effect - slightly scales up
        element.addEventListener("mouseover", function () {
            element.style.transition = "transform 0.2s ease-in-out";
            element.style.transform = "scale(1.1)";
        });

        // Remove hover effect
        element.addEventListener("mouseout", function () {
            element.style.transform = "scale(1)";
        });

        // Double-click to reset color
        element.addEventListener("dblclick", function () {
            element.setAttribute("stroke", "black");
            element.setAttribute("fill", "none");
        });
    });
});
