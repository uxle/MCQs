(function () {
function renderReview(rootEl, state, { onBack }) {
    rootEl.innerHTML = `
        <div class="screen">
        <button type="button" class="link-btn" id="review-back-btn">
            ${window.MCQ.icon("back")} Back to results
        </button>
        <h1 class="results-title" id="review-heading" tabindex="-1">Review your answers</h1>
        <p class="results-subtitle" id="review-subtitle"></p>
        <div id="review-list"></div>
        </div>
    `;

    const heading = rootEl.querySelector("#review-heading");
    const subtitle = rootEl.querySelector("#review-subtitle");
    const list = rootEl.querySelector("#review-list");
    const backBtn = rootEl.querySelector("#review-back-btn");

    backBtn.addEventListener("click", onBack);

    const missedEntries = [];
    state.questions.forEach((q, idx) => {
        const response = state.responses[idx];
        if (response && !response.isCorrect) {
            missedEntries.push({ q, response, number: idx + 1 });
        }
    });

    subtitle.textContent = `${missedEntries.length} question${missedEntries.length === 1 ? "" : "s"} to review`;

    if (missedEntries.length === 0) {
        const none = document.createElement("p");
        none.className = "results-subtitle";
        none.textContent = "Nothing to review. Every answer was correct.";
        list.appendChild(none);
    }

    missedEntries.forEach(({ q, response, number }, blockIdx) => {
        const block = document.createElement("div");
        block.className = "review-question-block";
        block.style.setProperty("--i", String(Math.min(blockIdx, 8)));

        const label = document.createElement("p");
        label.className = "review-index";
        label.textContent = response.skipped ? `Question ${number} · skipped` : `Question ${number} · missed`;

        const questionText = document.createElement("div");
        questionText.className = "question-text";
        window.MCQ.renderZolto(questionText, q.question);
        const lc = window.MCQ.lengthClass(q.question);
        if (lc) questionText.classList.add(lc);

        const optionsStack = document.createElement("div");
        optionsStack.className = "options-stack";

        block.append(label, questionText, optionsStack);

        window.MCQ.renderOptions(optionsStack, q, () => {});
        optionsStack.classList.remove("stagger");
        window.MCQ.applyOptionStyles(optionsStack, response.selectedIdx, response.correctIdx);

        if (response.skipped) {
            const note = document.createElement("p");
            note.className = "review-skip-note";
            note.textContent = "You skipped this question.";
            block.appendChild(note);
        }

        if (q.rationale) {
            const rationale = document.createElement("div");
            rationale.className = "rationale-card";
            const title = document.createElement("p");
            title.className = "rationale-title";
            title.innerHTML = window.MCQ.icon("bulb") + "<span>Why</span>";
            const text = document.createElement("div");
            text.className = "rationale-text";
            window.MCQ.renderZolto(text, q.rationale);
            rationale.append(title, text);
            block.appendChild(rationale);
        }

        list.appendChild(block);
    });

    return { heading };
}

window.MCQ = window.MCQ || {};
window.MCQ.renderReview = renderReview;
})();
