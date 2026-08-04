// Default quiz embedded as a fallback
const defaultQuizData = {
    title: "UX/UI Principles — Sample Quiz",
    questions: [
        {
            id: 1,
            question: "Which iOS interaction pattern best prevents accidental deletion of user data?",
            options: [
                "A generic alert asking 'Are you sure?'",
                "A destructive Action Sheet with explicit red confirmation text",
                "Deleting immediately and showing a quick banner notification",
                "Disabling deletion completely on mobile views"
            ],
            correct: 1,
            rationale: "Nielsen's 'Error Prevention' heuristic recommends distinct, high-significance visual confirmation controls (like red Action Sheet buttons) for destructive actions to eliminate muscle-memory slips."
        },
        {
            id: 2,
            question: "According to Fitts's Law, why are mobile tab bars positioned at the bottom of the screen?",
            options: [
                "They reduce screen contrast strain",
                "The screen bottom acts as an infinite boundary within easy thumb reach",
                "It leaves more space for large typography titles",
                "It enforces Miller's Law chunking constraints"
            ],
            correct: 1,
            rationale: "Fitts's Law states target acquisition time depends on distance and size. Placing interactive controls at the bottom screen edge minimizes thumb travel distance and maximizes target depth."
        }
    ]
};

class MCQEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.questions = [];
        this.currentIdx = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.answered = false;

        this.init();
    }

    init() {
        this.renderLayout();
        this.bindElements();
        this.loadQuizData(defaultQuizData);
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

                <div class="results-view" id="results-view">
                    <div class="results-title">Quiz Completed</div>
                    <p style="color: var(--text-sub); font-size: 0.85rem; margin-top: 0.25rem;" id="quiz-title-summary"></p>

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

                    <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem;">
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
        this.fileInput.addEventListener("change", (e) => this.handleFileUpload(e));
    }

    // JSON Upload System using FileReader
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                if (parsedData.questions && Array.isArray(parsedData.questions)) {
                    this.loadQuizData(parsedData);
                } else {
                    alert("Invalid JSON structure. Expected { 'questions': [...] }.");
                }
            } catch (err) {
                alert("Error parsing JSON file. Please ensure syntax is valid.");
            }
        };
        reader.readAsText(file);
    }

    loadQuizData(data) {
        this.quizTitle = data.title || "Assessment";
        this.questions = data.questions;
        this.restart();
    }

    renderDots() {
        this.dotsContainer.innerHTML = "";
        this.questions.forEach((_, idx) => {
            const dot = document.createElement("div");
            dot.className = "dot";
            if (idx === this.currentIdx) dot.classList.add("active");
            if (idx < this.currentIdx) dot.classList.add("completed");
            this.dotsContainer.appendChild(dot);
        });
    }

    renderQuestion() {
        this.answered = false;
        const q = this.questions[this.currentIdx];

        this.stepLabel.textContent = `Question ${this.currentIdx + 1} of ${this.questions.length}`;
        this.questionText.textContent = q.question;
        this.rationaleCard.classList.remove("visible");
        this.nextBtn.classList.remove("active");

        this.renderDots();

        this.optionsStack.innerHTML = "";
        q.options.forEach((optText, index) => {
            const btn = document.createElement("div");
            btn.className = "option-item";
            btn.innerHTML = `
                <span>${optText}</span>
                <span class="status-badge"></span>
            `;

            btn.addEventListener("click", () => this.handleSelect(index, q.correct));
            this.optionsStack.appendChild(btn);
        });
    }

    handleSelect(selectedIndex, correctIndex) {
        if (this.answered) return;
        this.answered = true;

        const options = this.optionsStack.querySelectorAll(".option-item");
        
        options.forEach((opt, idx) => {
            opt.classList.add("disabled");
            
            if (idx === correctIndex) {
                opt.classList.add("correct");
                opt.querySelector(".status-badge").textContent = "✓";
            } else if (idx === selectedIndex && selectedIndex !== correctIndex) {
                opt.classList.add("wrong");
                opt.querySelector(".status-badge").textContent = "✕";
            }
        });

        if (selectedIndex === correctIndex) {
            this.correctCount++;
        } else {
            this.wrongCount++;
        }

        this.rationaleText.textContent = this.questions[this.currentIdx].rationale;
        this.rationaleCard.classList.add("visible");
        this.nextBtn.classList.add("active");
    }

    handleNext() {
        if (this.currentIdx < this.questions.length - 1) {
            this.currentIdx++;
            this.renderQuestion();
        } else {
            this.showResults();
        }
    }

    // Results Breakdown Matrix
    showResults() {
        this.questionView.style.display = "none";
        this.resultsView.style.display = "block";
        this.stepLabel.textContent = "Summary";

        const total = this.questions.length;
        const accuracy = Math.round((this.correctCount / total) * 100);

        this.container.querySelector("#quiz-title-summary").textContent = this.quizTitle;
        this.container.querySelector("#count-right").textContent = this.correctCount;
        this.container.querySelector("#count-wrong").textContent = this.wrongCount;
        this.container.querySelector("#accuracy-rate").textContent = `${accuracy}%`;
    }

    restart() {
        this.currentIdx = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.resultsView.style.display = "none";
        this.questionView.style.display = "block";
        this.renderQuestion();
    }
}
