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
