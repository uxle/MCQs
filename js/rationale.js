(function () {
    // Feedback card shown after every answer: verdict (word + icon + colour),
    // then the explanation if the author wrote one.
    function showFeedback(cardEl, { verdict, answerKey, rationale }) {
        const I = window.MCQ.icon;
        const titleEl = cardEl.querySelector(".rationale-title");
        const textEl = cardEl.querySelector(".rationale-text");
        const label = verdict === "correct" ? "Correct" : verdict === "skipped" ? "Skipped" : "Not quite";
        titleEl.innerHTML = `${verdict === "correct" ? I("check") : I("bulb")}<span>${label}</span>`;
        if (verdict !== "correct" && answerKey) {
            const line = document.createElement("span");
            line.className = "answer-line";
            line.textContent = `Answer: ${answerKey}`;
            titleEl.appendChild(line);
        }
        if (rationale) window.MCQ.renderZolto(textEl, rationale);
        else textEl.replaceChildren();

        cardEl.dataset.verdict = verdict;
        // Re-trigger the entrance animation each time it is revealed
        cardEl.hidden = true;
        void cardEl.offsetWidth;
        cardEl.hidden = false;
    }

    function hideFeedback(cardEl) {
        cardEl.hidden = true;
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.showFeedback = showFeedback;
    window.MCQ.hideFeedback = hideFeedback;
})();
