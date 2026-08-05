(function () {
function renderQuizView(rootEl) {
    rootEl.innerHTML = `
        <div class="progress">
            <div class="progress-track">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
            <span class="progress-label" id="progress-label">1 / 1</span>
        </div>

        <h1 class="question-text" id="question-text" tabindex="-1"></h1>
        <div class="options-stack" id="options-stack"></div>
        <div class="rationale-card" id="rationale-card" hidden>
            <p class="rationale-title">Why</p>
            <p id="rationale-text"></p>
        </div>
        <div class="card-footer">
            <button type="button" class="btn-primary" id="next-btn">Skip</button>
        </div>
    `;

    return {
        progressFill: rootEl.querySelector("#progress-fill"),
        progressLabel: rootEl.querySelector("#progress-label"),
        questionText: rootEl.querySelector("#question-text"),
        optionsStack: rootEl.querySelector("#options-stack"),
        rationaleCard: rootEl.querySelector("#rationale-card"),
        rationaleText: rootEl.querySelector("#rationale-text"),
        nextBtn: rootEl.querySelector("#next-btn")
    };
}

window.MCQ = window.MCQ || {};
window.MCQ.renderQuizView = renderQuizView;
})();
