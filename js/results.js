(function () {
const percentFormatter = new Intl.NumberFormat(undefined, {
    style: "percent",
    maximumFractionDigits: 0
});

function renderResultsView(rootEl) {
    rootEl.innerHTML = `
        <h1 class="results-title" id="results-title" tabindex="-1">Quiz complete</h1>
        <p class="results-subtitle" id="quiz-title-summary"></p>

        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-value stat-right" id="count-right">0</div>
                <div class="stat-label">Correct</div>
            </div>
            <div class="stat-box">
                <div class="stat-value stat-wrong" id="count-wrong">0</div>
                <div class="stat-label">Incorrect</div>
            </div>
            <div class="stat-box">
                <div class="stat-value stat-total" id="accuracy-rate">0%</div>
                <div class="stat-label">Accuracy</div>
            </div>
        </div>

        <p class="skip-note" id="skip-note" hidden></p>
        <p class="perfect-note" id="perfect-note" hidden>Perfect score — every answer was correct.</p>

        <div class="results-footer">
            <button type="button" class="action-btn" id="review-btn" hidden>
                <i class="fa-solid fa-list-check" aria-hidden="true"></i><span>Review answers</span>
            </button>
            <button type="button" class="action-btn" id="export-btn">
                <i class="fa-solid fa-download" aria-hidden="true"></i><span>Export results</span>
            </button>
            <button type="button" class="btn-primary" id="restart-btn">Try again</button>
        </div>
    `;

    return {
        resultsTitle: rootEl.querySelector("#results-title"),
        restartBtn: rootEl.querySelector("#restart-btn"),
        exportBtn: rootEl.querySelector("#export-btn"),
        reviewBtn: rootEl.querySelector("#review-btn")
    };
}

function renderResults(container, state) {
    const total = state.questions.length;
    const fraction = total > 0 ? state.correctCount / total : 0;

    container.querySelector("#quiz-title-summary").textContent = state.title;
    container.querySelector("#count-right").textContent = state.correctCount;
    container.querySelector("#count-wrong").textContent = state.wrongCount;
    container.querySelector("#accuracy-rate").textContent = percentFormatter.format(fraction);

    const skipNote = container.querySelector("#skip-note");
    if (state.skippedCount > 0) {
        skipNote.textContent = `${state.skippedCount} question${state.skippedCount === 1 ? "" : "s"} skipped`;
        skipNote.hidden = false;
    } else {
        skipNote.hidden = true;
    }

    const missedCount = state.responses.filter((r) => !r.isCorrect).length;
    container.querySelector("#perfect-note").hidden = missedCount !== 0;
    container.querySelector("#review-btn").hidden = missedCount === 0;
}

window.MCQ = window.MCQ || {};
window.MCQ.renderResultsView = renderResultsView;
window.MCQ.renderResults = renderResults;
})();
