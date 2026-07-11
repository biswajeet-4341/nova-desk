const timeDisplay = document.querySelector(".time-display");
const dateDisplay = document.querySelector(".date-display");
const quoteDisplay = document.querySelector("#quote-display");
const authorDisplay = document.querySelector("#author-display");
const refreshQuoteButton = document.querySelector(".refresh-quote");

function restartAnimation(element) {
    element.style.animation = "none";
    void element.offsetHeight;
    element.style.animation = "";
}

function updateQuoteDisplay(quote, author) {
    quoteDisplay.textContent = quote;
    authorDisplay.textContent = author;

    if (!author) return;

    restartAnimation(quoteDisplay);
    restartAnimation(authorDisplay);
}

function updateDateTime() {
    const currDateTime = new Date();
    const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
    };
    const dateOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
    };

    timeDisplay.textContent = currDateTime.toLocaleTimeString([], timeOptions);
    dateDisplay.textContent = currDateTime.toLocaleDateString(
        "en-US",
        dateOptions,
    );
}

updateDateTime();

setInterval(updateDateTime, 1000);

async function fetchQuote() {
    try {
        const response = await fetch(
            "https://api.freeapi.app/api/v1/public/quotes/quote/random",
        );
        const result = await response.json();
        const { content, author, tags } = result.data;

        const isValidQuote =
            content.length <= 150 &&
            (tags.includes("Motivational") || tags.includes("Wisdom"));

        if (!isValidQuote) {
            updateQuoteDisplay("✨ Finding inspiration...", "");
            return fetchQuote();
        }

        updateQuoteDisplay(`"${content}"`, `- ${author}`);
    } catch {
        updateQuoteDisplay(
            "Unable to fetch quote. Please try again later.",
            "",
        );
    }
}

fetchQuote();

refreshQuoteButton.addEventListener("click", fetchQuote);

setInterval(fetchQuote, 3600000);

const blobTRs = document.querySelectorAll(".blob-tr");
const blobBLs = document.querySelectorAll(".blob-bl");
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;

if (blobTRs.length && blobBLs.length && !prefersReducedMotion) {
    const baseTR = { x: 960, y: 0 };
    const baseBL = { x: 0, y: 540 };

    const floatAmp = 8;
    const parallaxAmp = 18;
    const ease = 0.05;

    let targetX = 0;
    let targetY = 0;
    let smoothX = 0;
    let smoothY = 0;

    window.addEventListener("mousemove", (e) => {
        targetX = (e.clientX / window.innerWidth) * 2 - 1;
        targetY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    function animateBlobs(time) {
        smoothX += (targetX - smoothX) * ease;
        smoothY += (targetY - smoothY) * ease;

        const t = time / 1000;
        const floatTRx = Math.sin(t * 0.4) * floatAmp;
        const floatTRy = Math.cos(t * 0.5) * floatAmp;
        const floatBLx = Math.sin(t * 0.45 + 2) * floatAmp;
        const floatBLy = Math.cos(t * 0.35 + 2) * floatAmp;

        const trTransform = `translate(${baseTR.x + floatTRx + smoothX * parallaxAmp} ${baseTR.y + floatTRy + smoothY * parallaxAmp})`;
        const blTransform = `translate(${baseBL.x + floatBLx - smoothX * parallaxAmp} ${baseBL.y + floatBLy - smoothY * parallaxAmp})`;

        blobTRs.forEach((g) => g.setAttribute("transform", trTransform));
        blobBLs.forEach((g) => g.setAttribute("transform", blTransform));

        requestAnimationFrame(animateBlobs);
    }

    requestAnimationFrame(animateBlobs);
}

navigator.geolocation.getCurrentPosition(
    (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        return fetchWeather(lat, lon);
    },
    (error) => {
        console.log(error);
    },
);

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility`,
        );
        const result = await response.json();

        console.log(result);
    } catch (error) {
        console.log(error);
    }
}
