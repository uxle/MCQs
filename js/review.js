import { renderOptions, applyOptionStyles } from './options.js';

export function renderReview(rootEl, state, { onBack }) {
    rootEl.innerHTML = `
        <button type="button" class="link-btn" id="review-back-btn">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to results
        </button>
        <h1 class="results-title" id="review-heading" tabindex="-1">Review your answers</h1>
        <p class="results-subtitle" id="review-subtitle"></p>
        <div id="review-list"></div>
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

    missedEntries.forEach(({ q, response, number }) => {
        const block = document.createElement("div");
        block.className = "review-question-block";

        const label = document.createElement("p");
        label.className = "review-index";
        label.textContent = `Question ${number}`;

        const questionText = document.createElement("p");
        questionText.className = "question-text";
        questionText.textContent = q.question;

        const optionsStack = document.createElement("div");
        optionsStack.className = "options-stack";

        block.append(label, questionText, optionsStack);

        renderOptions(optionsStack, q, () => {});
        applyOptionStyles(optionsStack, response.selectedIdx, response.correctIdx);

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
            title.textContent = "Why";
            const text = document.createElement("p");
            text.textContent = q.rationale;
            rationale.append(title, text);
            block.appendChild(rationale);
        }

        list.appendChild(block);
    });

    return { heading };
}
