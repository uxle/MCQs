(function () {
    const APP_NAME = "MCQ Practice";

    class MCQEngine {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.state = new window.MCQ.QuizState();
            this.init();
        }

        init() {
            this.renderShell();
            this.homeBtn.addEventListener("click", () => this.showHome());
            this.errorDismiss.addEventListener("click", () => this.hideError());
            window.MCQ.initTheme(this.themeToggle);

            // Initial load shouldn't steal focus — it isn't a response to a user action.
            this.showHome({ focus: false });
        }

        renderShell() {
            this.container.innerHTML = `
                <div class="quiz-card">
                    <div class="quiz-topline">
                        <button type="button" class="icon-btn" id="home-btn" aria-label="Home">
                            <i class="fa-solid fa-house" aria-hidden="true"></i>
                        </button>
                        <p class="quiz-eyebrow" id="quiz-eyebrow">${APP_NAME}</p>
                        <button type="button" class="icon-btn" id="theme-toggle" aria-label="Switch to dark mode">
                            <i class="fa-solid fa-moon" aria-hidden="true"></i>
                        </button>
                    </div>

                    <div class="error-banner" id="error-banner" hidden>
                        <span id="error-text"></span>
                        <button type="button" class="error-dismiss" id="error-dismiss" aria-label="Dismiss error">
                            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                        </button>
                    </div>

                    <p class="sr-only" id="sr-status" role="status" aria-live="polite"></p>

                    <div id="screen-root"></div>
                </div>
            `;

            this.homeBtn = this.container.querySelector("#home-btn");
            this.quizEyebrow = this.container.querySelector("#quiz-eyebrow");
            this.themeToggle = this.container.querySelector("#theme-toggle");
            this.errorBanner = this.container.querySelector("#error-banner");
            this.errorText = this.container.querySelector("#error-text");
            this.errorDismiss = this.container.querySelector("#error-dismiss");
            this.srStatus = this.container.querySelector("#sr-status");
            this.screenRoot = this.container.querySelector("#screen-root");
        }

        showError(message) {
            this.errorText.textContent = message;
            this.errorBanner.hidden = false;
        }

        hideError() {
            this.errorBanner.hidden = true;
        }

        setEyebrow(text) {
            this.quizEyebrow.textContent = text;
            this.quizEyebrow.title = text;
        }

        /* ---------------- Screens ---------------- */

        showHome({ focus = true } = {}) {
            this.hideError();
            this.setEyebrow(APP_NAME);
            document.title = APP_NAME;

            const els = window.MCQ.renderHome(this.screenRoot, {
                onUpload: (data) => this.loadQuiz(data),
                onUploadError: (message) => this.showError(message),
                onMakeQuestions: () => this.showBuilder(),
                onExampleQuestions: () => this.loadQuiz(window.MCQ.sampleQuizData)
            });

            if (focus) els.heading.focus();
        }

        showBuilder() {
            this.hideError();
            this.setEyebrow("New quiz");
            document.title = `New quiz · ${APP_NAME}`;

            const els = window.MCQ.renderBuilder(this.screenRoot, {
                onStartQuiz: (data) => this.loadQuiz(data),
                onError: (message) => this.showError(message)
            });

            els.heading.focus();
        }

        loadQuiz(data) {
            this.state.title = data.title || "Assessment";
            this.state.questions = data.questions;
            this.state.reset();
            this.hideError();
            this.setEyebrow(this.state.title);
            document.title = `${this.state.title} · ${APP_NAME}`;
            this.quizEls = window.MCQ.renderQuizView(this.screenRoot);
            this.displayCurrentQuestion();
        }

        displayCurrentQuestion() {
            this.state.answered = false;
            const els = this.quizEls;
            const q = this.state.questions[this.state.currentIdx];
            const total = this.state.questions.length;
            const isLast = this.state.currentIdx === total - 1;

            window.MCQ.renderQuestion(els.questionText, q);
            window.MCQ.renderProgress(els.progressFill, els.progressLabel, total, this.state.currentIdx);
            window.MCQ.hideRationale(els.rationaleCard);
            this.srStatus.textContent = "";

            els.nextBtn.textContent = "Skip";
            els.nextBtn.dataset.mode = "skip";

            window.MCQ.renderOptions(els.optionsStack, q, (selectedIdx, correctIdx) => {
                if (this.state.answered) return;
                const isCorrect = this.state.recordAnswer(q, selectedIdx, correctIdx);
                window.MCQ.applyOptionStyles(els.optionsStack, selectedIdx, correctIdx);
                window.MCQ.showRationale(els.rationaleCard, els.rationaleText, q.rationale);
                els.nextBtn.textContent = isLast ? "Finish" : "Continue";
                els.nextBtn.dataset.mode = "advance";
                this.srStatus.textContent = isCorrect
                    ? "Correct."
                    : `Incorrect. The correct answer is: ${q.options[correctIdx]}`;
            });

            els.nextBtn.onclick = () => {
                if (els.nextBtn.dataset.mode === "skip") {
                    this.state.recordSkip(q);
                }
                this.advance();
            };

            els.questionText.focus();
        }

        advance() {
            if (this.state.currentIdx < this.state.questions.length - 1) {
                this.state.currentIdx++;
                this.displayCurrentQuestion();
            } else {
                this.showResultsScreen();
            }
        }

        showResultsScreen() {
            this.hideError();
            this.setEyebrow("Results");
            document.title = `Results · ${this.state.title}`;

            const els = window.MCQ.renderResultsView(this.screenRoot);
            window.MCQ.renderResults(this.screenRoot, this.state);

            els.restartBtn.addEventListener("click", () => {
                this.loadQuiz({ title: this.state.title, questions: this.state.questions });
            });
            els.exportBtn.addEventListener("click", () => window.MCQ.downloadResults(this.state));
            els.reviewBtn.addEventListener("click", () => this.showReviewScreen());

            els.resultsTitle.focus();
        }

        showReviewScreen() {
            this.hideError();
            this.setEyebrow("Review");
            document.title = `Review · ${this.state.title}`;

            const els = window.MCQ.renderReview(this.screenRoot, this.state, {
                onBack: () => this.showResultsScreen()
            });

            els.heading.focus();
        }
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.MCQEngine = MCQEngine;
})();
