import { defaultQuizData } from './config.js';
import { QuizState } from './state.js';
import { initUploader } from './uploader.js';
import { renderDots } from './dots.js';
import { renderQuestion } from './question.js';
import { renderOptions, applyOptionStyles } from './options.js';
import { showRationale, hideRationale } from './rationale.js';
import { renderResults } from './results.js';
import { toggleNextButton } from './theme.js';

export class MCQEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.state = new QuizState();
        this.init();
    }

    init() {
        this.renderLayout();
        this.bindElements();
        initUploader(this.fileInput, (data) => this.loadQuiz(data));
        this.loadQuiz(defaultQuizData);
    }

    renderLayout() {
        this.container.innerHTML = `
            <div class="mcq-container">
                <div class="top-bar">
                    <span class="step-count" id="step-label">Question 1</span>
                    <label class="upload-btn-label" for="json-file-input">📂 Upload JSON</label>
                    <input type="file" id="json-file-input" class="file-input" accept=".json">
                </div>
                <div class="dots-indicator" id="dots-container"></div>
                <div id="question-view">
                    <div class="question-text" id="question-text"></div>
                    <div class="options-stack" id="options-stack"></div>
                    <div class="rationale-card" id="rationale-card">
                        <div class="rationale-title">UX Principle</div>
                        <div id="rationale-text"></div>
                    </div>
                    <div class="card-footer">
                        <button class="next-btn" id="next-btn">Continue</button>
                    </div>
                </div>
                <div class="results-view" id="results-view" style="display:none;">
                    <h2 style="font-size:1.4rem; font-weight:700;">Quiz Completed</h2>
                    <p id="quiz-title-summary" style="color:var(--text-sub); font-size:0.85rem; margin-top:0.2rem;"></p>
                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="stat-value right" id="count-right">0</div>
                            <div class="stat-label">Right ✓</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value wrong" id="count-wrong">0</div>
                            <div class="stat-label">Wrong ✕</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value total" id="accuracy-rate">0%</div>
                            <div class="stat-label">Accuracy</div>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:center;">
                        <button class="next-btn active" id="restart-btn">Try Again</button>
                    </div>
                </div>
            </div>
        `;
    }

    bindElements() {
        this.stepLabel = this.container.querySelector("#step-label");
        this.dotsContainer = this.container.querySelector("#dots-container");
        this.questionText = this.container.querySelector("#question-text");
        this.optionsStack = this.container.querySelector("#options-stack");
        this.rationaleCard = this.container.querySelector("#rationale-card");
        this.rationaleText = this.container.querySelector("#rationale-text");
        this.nextBtn = this.container.querySelector("#next-btn");
        this.questionView = this.container.querySelector("#question-view");
        this.resultsView = this.container.querySelector("#results-view");
        this.restartBtn = this.container.querySelector("#restart-btn");
        this.fileInput = this.container.querySelector("#json-file-input");

        this.nextBtn.addEventListener("click", () => this.handleNext());
        this.restartBtn.addEventListener("click", () => this.restart());
    }

    loadQuiz(data) {
        this.state.title = data.title || "Assessment";
        this.state.questions = data.questions;
        this.restart();
    }

    displayCurrentQuestion() {
        this.state.answered = false;
        const q = this.state.questions[this.state.currentIdx];

        renderQuestion(this.stepLabel, this.questionText, q, this.state.currentIdx, this.state.questions.length);
        renderDots(this.dotsContainer, this.state.questions.length, this.state.currentIdx);
        hideRationale(this.rationaleCard);
        toggleNextButton(this.nextBtn, false);

        renderOptions(this.optionsStack, q, (selectedIdx, correctIdx) => {
            if (this.state.answered) return;
            this.state.recordAnswer(selectedIdx === correctIdx);
            applyOptionStyles(this.optionsStack, selectedIdx, correctIdx);
            showRationale(this.rationaleCard, this.rationaleText, q.rationale);
            toggleNextButton(this.nextBtn, true);
        });
    }

    handleNext() {
        if (this.state.currentIdx < this.state.questions.length - 1) {
            this.state.currentIdx++;
            this.displayCurrentQuestion();
        } else {
            this.showResultsScreen();
        }
    }

    showResultsScreen() {
        this.questionView.style.display = "none";
        this.resultsView.style.display = "block";
        this.stepLabel.textContent = "Summary";
        renderResults(this.resultsView, this.state);
    }

    restart() {
        this.state.reset();
        this.resultsView.style.display = "none";
        this.questionView.style.display = "block";
        this.displayCurrentQuestion();
    }
}
