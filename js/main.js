(function () {
    const APP_NAME = "MCQ Practice";
    const KEYS = "ABCDEF";
    const reduceMotion = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

    class MCQEngine {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.state = new window.MCQ.QuizState();
            this.fullQuiz = null;      // the complete question set (so "practise missed" can return to it)
            this.busy = false;         // guards double-taps during a transition
            this.quizEls = null;
            this.init();
        }

        init() {
            this.renderShell();
            this.homeBtn.addEventListener("click", () => this.onHome());
            this.errorDismiss.addEventListener("click", () => this.hideError());
            window.MCQ.initTheme(this.themeToggle);

            // Initial load shouldn't steal focus — it isn't a response to a user action.
            this.showHome({ focus: false });
            document.addEventListener("keydown", (e) => this.onKey(e));
        }

        renderShell() {
            const I = window.MCQ.icon;
            this.container.innerHTML = `
                <div class="quiz-card">
                    <div class="quiz-topline">
                        <div class="brand">
                            ${window.MCQ.logo()}
                            <p class="quiz-eyebrow" id="quiz-eyebrow">${APP_NAME}</p>
                        </div>
                        <div class="topline-actions">
                            <button type="button" class="icon-btn" id="home-btn" aria-label="Home" title="Home">${I("home")}</button>
                            <button type="button" class="icon-btn" id="theme-toggle" aria-label="Switch to dark mode">${I("moon")}</button>
                        </div>
                    </div>

                    <div class="error-banner" id="error-banner" role="alert" hidden>
                        <span id="error-text"></span>
                        <button type="button" class="error-dismiss" id="error-dismiss" aria-label="Dismiss error">${I("x")}</button>
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

        /* ---------------- helpers ---------------- */

        showError(message) {
            this.errorText.textContent = message;
            this.errorBanner.hidden = false;
            // Re-trigger the entrance and make sure it is actually seen, wherever the person has scrolled
            this.errorBanner.style.animation = "none";
            void this.errorBanner.offsetWidth;
            this.errorBanner.style.animation = "";
            this.errorBanner.scrollIntoView({ block: "nearest", behavior: reduceMotion() ? "auto" : "smooth" });
        }

        hideError() { this.errorBanner.hidden = true; }

        setEyebrow(text) {
            this.quizEyebrow.textContent = text;
            this.quizEyebrow.title = text;
        }

        /* Re-trigger the scene-entrance animation on the screen container */
        enter(cls = "screen-enter") {
            const el = this.screenRoot;
            el.classList.remove("screen-enter", "q-enter", "q-leave");
            void el.offsetWidth;
            el.classList.add(cls);
        }

        /* A new screen or question always starts at the top, never mid-scroll */
        resetScroll() {
            if (window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }

        inProgress() {
            return !!this.screenRoot.querySelector(".screen-quiz") &&
                this.state.responses.length > 0 &&
                this.state.responses.length < this.state.questions.length;
        }

        confirmLeave() {
            return new Promise((resolve) => {
                if (typeof HTMLDialogElement === "undefined") { resolve(window.confirm("Leave this quiz? Your progress will be lost.")); return; }
                const d = document.createElement("dialog");
                d.className = "dialog";
                d.setAttribute("aria-labelledby", "leave-title");
                d.innerHTML = `
                    <h2 id="leave-title">Leave this quiz?</h2>
                    <p>You've answered ${this.state.responses.length} of ${this.state.questions.length}. Your progress will be lost.</p>
                    <div class="dialog-actions">
                        <button type="button" class="action-btn" data-r="leave">Leave</button>
                        <button type="button" class="btn-primary" data-r="stay" autofocus>Keep going</button>
                    </div>`;
                d.addEventListener("click", (e) => {
                    const r = e.target.closest("[data-r]");
                    if (r) d.close(r.dataset.r);
                    else if (e.target === d) d.close("stay");
                });
                d.addEventListener("close", () => { const out = d.returnValue === "leave"; d.remove(); resolve(out); });
                document.body.appendChild(d);
                d.showModal();
            });
        }

        async onHome() {
            if (this.busy) return;
            if (this.inProgress() && !(await this.confirmLeave())) return;
            this.showHome();
        }

        /* Keyboard: 1-6 / A-F answers, Enter or Space continues once answered */
        onKey(e) {
            if (!this.quizEls || !this.screenRoot.contains(this.quizEls.questionText)) return;
            if (e.metaKey || e.ctrlKey || e.altKey || document.querySelector("dialog[open]")) return;
            const tag = (e.target.tagName || "").toLowerCase();
            if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;

            if (!this.state.answered) {
                const k = e.key.toLowerCase();
                if (k.length !== 1) return;
                const idx = /^[1-6]$/.test(k) ? Number(k) - 1 : "abcdef".indexOf(k);
                const opt = idx >= 0 ? this.quizEls.optionsStack.querySelectorAll(".option-item")[idx] : null;
                if (opt) { e.preventDefault(); opt.click(); }
            } else if ((e.key === "Enter" || e.key === " ") && tag !== "button") {
                e.preventDefault();
                this.quizEls.nextBtn.click();
            }
        }

        setNext(mode, label) {
            const btn = this.quizEls.nextBtn;
            btn.dataset.mode = mode;
            btn.innerHTML = mode === "skip" ? label : `${label} ${window.MCQ.icon("arrow", "icon-arrow")}`;
        }

        /* ---------------- Screens ---------------- */

        showHome({ focus = true } = {}) {
            this.hideError();
            this.quizEls = null;
            this.setEyebrow(APP_NAME);
            document.title = APP_NAME;
            this.homeBtn.hidden = true;     // already home

            const els = window.MCQ.renderHome(this.screenRoot, {
                onUpload: (data) => this.loadQuiz(data),
                onUploadError: (message) => this.showError(message),
                onMakeQuestions: () => this.showBuilder(),
                onExampleQuestions: () => this.loadQuiz(window.MCQ.sampleQuizData)
            });

            this.enter();
            this.resetScroll();
            if (focus) els.heading.focus({ preventScroll: true });
        }

        showBuilder() {
            this.hideError();
            this.quizEls = null;
            this.homeBtn.hidden = false;
            this.setEyebrow("New quiz");
            document.title = `New quiz · ${APP_NAME}`;

            const els = window.MCQ.renderBuilder(this.screenRoot, {
                onStartQuiz: (data) => this.loadQuiz(data),
                onError: (message) => this.showError(message)
            });

            this.enter();
            this.resetScroll();
            els.heading.focus({ preventScroll: true });
        }

        loadQuiz(data, { practice = false } = {}) {
            if (!practice) this.fullQuiz = data;
            this.state.title = data.title || "Assessment";
            this.state.questions = data.questions;
            this.state.reset();
            this.busy = false;
            this.hideError();
            this.homeBtn.hidden = false;
            this.setEyebrow(this.state.title);
            document.title = `${this.state.title} · ${APP_NAME}`;
            this.quizEls = window.MCQ.renderQuizView(this.screenRoot);
            this.screenRoot.classList.remove("screen-enter", "q-leave");
            this.resetScroll();
            this.displayCurrentQuestion();
        }

        displayCurrentQuestion() {
            this.state.answered = false;
            const els = this.quizEls;
            const q = this.state.questions[this.state.currentIdx];
            const total = this.state.questions.length;
            const isLast = this.state.currentIdx === total - 1;

            window.MCQ.renderQuestion(els.questionText, q);
            els.questionText.classList.remove("q-long", "q-xlong");
            const lc = window.MCQ.lengthClass(q.question);
            if (lc) els.questionText.classList.add(lc);

            window.MCQ.renderProgress(els.progressTrack, els.progressLabel, total, this.state.currentIdx, this.state.responses);
            els.categoryChip.textContent = q.category || "";
            els.categoryChip.hidden = !q.category;
            els.kbdHint.innerHTML = `<kbd>1</kbd>–<kbd>${q.options.length}</kbd> to answer`;
            this.enter("q-enter");
            window.MCQ.hideFeedback(els.rationaleCard);
            this.srStatus.textContent = "";
            this.setNext("skip", "Skip");

            window.MCQ.renderOptions(els.optionsStack, q, (selectedIdx, correctIdx) => {
                if (this.state.answered || this.busy) return;
                const isCorrect = this.state.recordAnswer(q, selectedIdx, correctIdx);
                window.MCQ.applyOptionStyles(els.optionsStack, selectedIdx, correctIdx);
                window.MCQ.showFeedback(els.rationaleCard, {
                    verdict: isCorrect ? "correct" : "wrong",
                    answerKey: KEYS[correctIdx],
                    rationale: q.rationale
                });
                window.MCQ.renderProgress(els.progressTrack, els.progressLabel, total, this.state.currentIdx, this.state.responses);
                this.setNext("advance", isLast ? "Finish" : "Continue");
                els.kbdHint.innerHTML = "<kbd>Enter</kbd> to continue";
                this.srStatus.textContent = isCorrect
                    ? "Correct."
                    : `Incorrect. The correct answer is ${KEYS[correctIdx]}: ${window.MCQ.zoltoPlainText(q.options[correctIdx])}`;

                // Hand the thumb/keyboard the next step, and make sure the explanation
                // is visible above the sticky action bar.
                els.nextBtn.focus({ preventScroll: true });
                setTimeout(() => els.rationaleCard.scrollIntoView({ block: "nearest", behavior: reduceMotion() ? "auto" : "smooth" }), 160);
            });

            els.nextBtn.onclick = () => {
                if (this.busy) return;
                if (els.nextBtn.dataset.mode === "skip") this.state.recordSkip(q);
                this.advance();
            };

            els.questionText.focus({ preventScroll: true });
        }

        advance() {
            if (this.busy) return;
            this.busy = true;
            const go = () => {
                this.busy = false;
                this.resetScroll();
                if (this.state.currentIdx < this.state.questions.length - 1) {
                    this.state.currentIdx++;
                    this.displayCurrentQuestion();
                } else {
                    this.showResultsScreen();
                }
            };
            if (reduceMotion()) { go(); return; }
            // Exit (150ms, ease-in) before the next scene enters (ease-out)
            this.screenRoot.classList.remove("screen-enter", "q-enter");
            this.screenRoot.classList.add("q-leave");
            setTimeout(go, 150);
        }

        practiseMissed() {
            const missed = this.state.questions.filter((q, i) => this.state.responses[i] && !this.state.responses[i].isCorrect);
            if (missed.length === 0) return;
            const base = (this.fullQuiz && this.fullQuiz.title) || this.state.title;
            this.loadQuiz({ title: `${base} · practice`, questions: missed }, { practice: true });
        }

        showResultsScreen() {
            this.hideError();
            this.quizEls = null;
            this.setEyebrow(`${this.state.title} · results`);
            document.title = `Results · ${this.state.title}`;

            const els = window.MCQ.renderResultsView(this.screenRoot);
            const missed = window.MCQ.renderResults(this.screenRoot, this.state);

            els.restartBtn.addEventListener("click", () => {
                if (missed > 0) this.practiseMissed();
                else this.loadQuiz({ title: this.state.title, questions: this.state.questions }, { practice: this.fullQuiz && this.state.questions !== this.fullQuiz.questions });
            });
            els.retakeBtn.addEventListener("click", () => {
                const full = this.fullQuiz || { title: this.state.title, questions: this.state.questions };
                this.loadQuiz(full);
            });
            els.exportBtn.addEventListener("click", () => window.MCQ.downloadResults(this.state));
            els.reviewBtn.addEventListener("click", () => this.showReviewScreen());

            this.enter();
            this.resetScroll();
            els.resultsTitle.focus({ preventScroll: true });
        }

        showReviewScreen() {
            this.hideError();
            this.setEyebrow(`${this.state.title} · review`);
            document.title = `Review · ${this.state.title}`;

            const els = window.MCQ.renderReview(this.screenRoot, this.state, {
                onBack: () => this.showResultsScreen()
            });

            this.enter();
            this.resetScroll();
            els.heading.focus({ preventScroll: true });
        }
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.MCQEngine = MCQEngine;
})();
