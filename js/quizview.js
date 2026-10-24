(function () {
function renderQuizView(rootEl) {
    rootEl.innerHTML = `
        <div class="screen screen-quiz">
            <div class="progress">
                <div class="progress-track" id="progress-track" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuenow="1" aria-valuemax="1"></div>
            </div>

            <div class="quiz-main">
                <div class="quiz-q">
                    <div class="quiz-meta">
                        <span class="progress-label" id="progress-label"><b>1</b> / 1</span>
                        <span class="chip" id="category-chip" hidden></span>
                    </div>
                    <div class="question-text" id="question-text" role="heading" aria-level="1" tabindex="-1"></div>
                </div>
                <div class="quiz-a">
                    <div class="options-stack" id="options-stack"></div>
                    <div class="rationale-card" id="rationale-card" hidden>
                        <p class="rationale-title"></p>
                        <div class="rationale-text" id="rationale-text"></div>
                    </div>
                </div>
            </div>

            <div class="card-footer">
                <span class="kbd-hint" id="kbd-hint"></span>
                <button type="button" class="btn-primary" id="next-btn" data-mode="skip">Skip</button>
            </div>
        </div>
    `;

    return {
        progressTrack: rootEl.querySelector("#progress-track"),
        progressLabel: rootEl.querySelector("#progress-label"),
        categoryChip: rootEl.querySelector("#category-chip"),
        questionText: rootEl.querySelector("#question-text"),
        optionsStack: rootEl.querySelector("#options-stack"),
        rationaleCard: rootEl.querySelector("#rationale-card"),
        kbdHint: rootEl.querySelector("#kbd-hint"),
        nextBtn: rootEl.querySelector("#next-btn")
    };
}

window.MCQ = window.MCQ || {};
window.MCQ.renderQuizView = renderQuizView;
})();
