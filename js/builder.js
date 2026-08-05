(function () {
function renderBuilder(rootEl, { onStartQuiz, onError }) {
    const questions = [];

    rootEl.innerHTML = `
        <h1 class="sr-only" id="builder-heading" tabindex="-1">Create a quiz</h1>

        <label class="field">
            <span class="field-label">Quiz title</span>
            <input type="text" id="builder-title" class="text-input" placeholder="My quiz" value="My Quiz">
        </label>

        <div class="builder-draft">
            <label class="field">
                <span class="field-label">Question</span>
                <textarea id="draft-question" class="text-input" rows="2" placeholder="Type your question…"></textarea>
            </label>

            <span class="field-label">Options — select the correct one</span>
            <div id="draft-options"></div>
            <button type="button" class="link-btn" id="add-option-btn">
                <i class="fa-solid fa-plus" aria-hidden="true"></i> Add option
            </button>

            <label class="field">
                <span class="field-label">Field / category (optional)</span>
                <input type="text" id="draft-category" class="text-input" placeholder="e.g. Science">
            </label>

            <label class="field">
                <span class="field-label">Explanation (optional)</span>
                <input type="text" id="draft-rationale" class="text-input" placeholder="Shown after answering…">
            </label>

            <button type="button" class="action-btn" id="add-question-btn">
                <i class="fa-solid fa-plus" aria-hidden="true"></i><span>Add question</span>
            </button>
        </div>

        <div class="builder-list" id="builder-list"></div>

        <div class="card-footer">
            <button type="button" class="btn-primary" id="start-quiz-btn" disabled>Start quiz</button>
        </div>
    `;

    const heading = rootEl.querySelector("#builder-heading");
    const titleInput = rootEl.querySelector("#builder-title");
    const draftQuestion = rootEl.querySelector("#draft-question");
    const draftOptions = rootEl.querySelector("#draft-options");
    const addOptionBtn = rootEl.querySelector("#add-option-btn");
    const draftCategory = rootEl.querySelector("#draft-category");
    const draftRationale = rootEl.querySelector("#draft-rationale");
    const addQuestionBtn = rootEl.querySelector("#add-question-btn");
    const builderList = rootEl.querySelector("#builder-list");
    const startQuizBtn = rootEl.querySelector("#start-quiz-btn");

    function addOptionRow() {
        const rows = draftOptions.querySelectorAll(".draft-option-row");
        if (rows.length >= 6) return;

        const row = document.createElement("div");
        row.className = "draft-option-row";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "draft-correct";
        radio.className = "draft-option-radio";
        radio.setAttribute("aria-label", `Mark option ${rows.length + 1} as correct`);
        if (rows.length === 0) radio.checked = true;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "text-input draft-option-input";
        input.placeholder = `Option ${rows.length + 1}`;

        row.append(radio, input);

        if (rows.length >= 2) {
            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "icon-btn-sm";
            removeBtn.setAttribute("aria-label", "Remove option");
            removeBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
            removeBtn.addEventListener("click", () => {
                const wasChecked = radio.checked;
                row.remove();
                if (wasChecked) {
                    const first = draftOptions.querySelector(".draft-option-radio");
                    if (first) first.checked = true;
                }
            });
            row.appendChild(removeBtn);
        }

        draftOptions.appendChild(row);
    }

    addOptionRow();
    addOptionRow();
    addOptionBtn.addEventListener("click", addOptionRow);

    function renderQuestionList() {
        builderList.replaceChildren();

        questions.forEach((q, idx) => {
            const item = document.createElement("div");
            item.className = "builder-item";

            const text = document.createElement("span");
            text.className = "builder-item-text";
            text.textContent = `${idx + 1}. ${q.question}`;

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "icon-btn-sm";
            removeBtn.setAttribute("aria-label", "Remove question");
            removeBtn.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i>';
            removeBtn.addEventListener("click", () => {
                questions.splice(idx, 1);
                renderQuestionList();
            });

            item.append(text, removeBtn);
            builderList.appendChild(item);
        });

        startQuizBtn.disabled = questions.length === 0;
    }

    addQuestionBtn.addEventListener("click", () => {
        const questionText = draftQuestion.value.trim();
        const rows = Array.from(draftOptions.querySelectorAll(".draft-option-row"));
        const options = rows.map((row) => row.querySelector(".draft-option-input").value.trim());
        const correctIdx = rows.findIndex((row) => row.querySelector(".draft-option-radio").checked);

        if (!questionText) {
            onError("Add the question text first.");
            return;
        }
        if (options.some((opt) => opt.length === 0)) {
            onError("Fill in every option, or remove the empty one.");
            return;
        }
        if (correctIdx === -1) {
            onError("Select which option is correct.");
            return;
        }

        questions.push({
            question: questionText,
            options,
            correct: correctIdx,
            category: draftCategory.value.trim() || undefined,
            rationale: draftRationale.value.trim() || undefined
        });

        draftQuestion.value = "";
        draftCategory.value = "";
        draftRationale.value = "";
        draftOptions.replaceChildren();
        addOptionRow();
        addOptionRow();

        renderQuestionList();
        draftQuestion.focus();
    });

    startQuizBtn.addEventListener("click", () => {
        if (questions.length === 0) return;
        onStartQuiz({
            title: titleInput.value.trim() || "My Quiz",
            questions
        });
    });

    return { heading };
}

window.MCQ = window.MCQ || {};
window.MCQ.renderBuilder = renderBuilder;
})();
