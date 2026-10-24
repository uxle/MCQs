(function () {
const MAX_OPTIONS = 6;
const SNIPPETS = {
    math: { label: "Math", icon: "math", text: "$x^2 + y^2 = r^2$" },
    code: { label: "Code", icon: "code", text: "\n```js\nconsole.log(\"hello\");\n```\n" },
    chart: { label: "Chart", icon: "chart", text: "\n@chart bar title=\"Title\"\nlabels:\n  A\n  B\n  C\n\ndata:\n  10\n  20\n  15\n@/chart\n" },
    diagram: { label: "Diagram", icon: "diagram", text: "\n@diagram sequence title=\"Flow\"\nactor User\nactor Server\n\nUser -> Server: Request\nServer -> User: Response\n@/diagram\n" }
};

function renderBuilder(rootEl, { onStartQuiz }) {
    const I = window.MCQ.icon;
    const questions = [];

    rootEl.innerHTML = `
        <div class="screen screen-builder">
            <h1 class="sr-only" id="builder-heading" tabindex="-1">Create a quiz</h1>

            <label class="field">
                <span class="field-label">Quiz title</span>
                <input type="text" id="builder-title" class="text-input" placeholder="My quiz" value="My Quiz" autocomplete="off">
            </label>

            <div class="builder-draft">
                <div class="field">
                    <label class="field-label" for="draft-question">Question</label>
                    <div class="snippet-bar" role="group" aria-label="Insert into question">
                        ${Object.entries(SNIPPETS).map(([k, s]) => `<button type="button" class="snippet-btn" data-snippet="${k}">${I(s.icon)}${s.label}</button>`).join("")}
                    </div>
                    <textarea id="draft-question" class="text-input" rows="3" placeholder="Type your question. Markdown, math, code, charts and diagrams all work." aria-describedby="form-msg"></textarea>
                </div>

                <span class="field-label" id="opts-label">Options <span class="opt">· tap the circle beside the correct answer</span></span>
                <div class="draft-options" id="draft-options" role="radiogroup" aria-labelledby="opts-label"></div>
                <button type="button" class="link-btn" id="add-option-btn">${I("plus")} Add option</button>

                <label class="field">
                    <span class="field-label">Topic <span class="opt">(optional)</span></span>
                    <input type="text" id="draft-category" class="text-input" placeholder="e.g. Science" list="cat-list" autocomplete="off">
                    <datalist id="cat-list"></datalist>
                </label>

                <label class="field">
                    <span class="field-label">Explanation <span class="opt">(optional, shown after answering)</span></span>
                    <textarea id="draft-rationale" class="text-input plain" rows="2" placeholder="Why is that the answer?"></textarea>
                </label>

                <details class="draft-preview" id="draft-preview">
                    <summary>Live preview</summary>
                    <div class="preview-body" id="preview-body"></div>
                </details>

                <div class="add-question-row">
                    <button type="button" class="action-btn" id="add-question-btn">${I("plus")}<span>Add question</span></button>
                    <p class="form-msg" id="form-msg" role="status" aria-live="polite"></p>
                </div>
            </div>

            <div class="builder-list" id="builder-list"></div>

            <div class="card-footer">
                <span class="footer-note" id="footer-note"></span>
                <button type="button" class="btn-primary" id="start-quiz-btn" disabled>Start quiz ${I("arrow", "icon-arrow")}</button>
            </div>
        </div>
    `;

    const $ = (sel) => rootEl.querySelector(sel);
    const heading = $("#builder-heading");
    const titleInput = $("#builder-title");
    const draftQuestion = $("#draft-question");
    const draftOptions = $("#draft-options");
    const addOptionBtn = $("#add-option-btn");
    const draftCategory = $("#draft-category");
    const draftRationale = $("#draft-rationale");
    const addQuestionBtn = $("#add-question-btn");
    const formMsg = $("#form-msg");
    const preview = $("#draft-preview");
    const previewBody = $("#preview-body");
    const builderList = $("#builder-list");
    const startQuizBtn = $("#start-quiz-btn");
    const footerNote = $("#footer-note");
    const catList = $("#cat-list");

    // The preview earns its space on wide screens; on phones it starts folded
    preview.open = rootEl.clientWidth >= 520;

    /* ---------- messages & validation ---------- */
    function setMsg(text, kind) {
        formMsg.textContent = text || "";
        formMsg.classList.toggle("ok", kind === "ok");
    }
    function markInvalid(el) {
        el.setAttribute("aria-invalid", "true");
        el.focus();
        el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    rootEl.addEventListener("input", (e) => {
        if (e.target.getAttribute && e.target.getAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid");
        if (formMsg.textContent && !formMsg.classList.contains("ok")) setMsg("");
    });

    /* ---------- options ---------- */
    function optionRows() { return Array.from(draftOptions.querySelectorAll(".draft-option-row")); }

    function reindex() {
        optionRows().forEach((row, i) => {
            row.querySelector(".draft-option-radio").setAttribute("aria-label", `Mark option ${i + 1} as correct`);
            const input = row.querySelector(".draft-option-input");
            input.placeholder = `Option ${i + 1}`;
            input.setAttribute("aria-label", `Option ${i + 1}`);
        });
        const full = optionRows().length >= MAX_OPTIONS;
        addOptionBtn.disabled = full;
        addOptionBtn.lastChild.textContent = full ? ` Up to ${MAX_OPTIONS} options` : " Add option";
    }

    function addOptionRow(focus) {
        const rows = optionRows();
        if (rows.length >= MAX_OPTIONS) return;

        const row = document.createElement("div");
        row.className = "draft-option-row";

        const wrap = document.createElement("label");
        wrap.className = "radio-wrap";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "draft-correct";
        radio.className = "draft-option-radio";
        if (rows.length === 0) radio.checked = true;
        wrap.appendChild(radio);

        const input = document.createElement("input");
        input.type = "text";
        input.className = "text-input draft-option-input";
        input.autocomplete = "off";
        input.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            const all = optionRows();
            const idx = all.indexOf(row);
            if (idx < all.length - 1) all[idx + 1].querySelector(".draft-option-input").focus();
            else if (all.length < MAX_OPTIONS) addOptionRow(true);
            else addQuestionBtn.focus();
        });

        row.append(wrap, input);

        if (rows.length >= 2) {
            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "icon-btn-sm";
            removeBtn.setAttribute("aria-label", "Remove option");
            removeBtn.innerHTML = I("x");
            removeBtn.addEventListener("click", () => {
                const wasChecked = radio.checked;
                row.remove();
                if (wasChecked) {
                    const first = draftOptions.querySelector(".draft-option-radio");
                    if (first) first.checked = true;
                }
                reindex();
                schedulePreview();
            });
            row.appendChild(removeBtn);
        } else {
            row.appendChild(document.createElement("span"));
        }

        draftOptions.appendChild(row);
        reindex();
        if (focus) input.focus();
    }

    function resetOptions() {
        draftOptions.replaceChildren();
        addOptionRow();
        addOptionRow();
    }
    resetOptions();
    addOptionBtn.addEventListener("click", () => { addOptionRow(true); schedulePreview(); });

    /* ---------- snippets + auto-growing textarea ---------- */
    function autoGrow(ta) {
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight + 2, 360) + "px";
    }
    rootEl.querySelectorAll("[data-snippet]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const s = SNIPPETS[btn.dataset.snippet];
            const start = draftQuestion.selectionStart ?? draftQuestion.value.length;
            const end = draftQuestion.selectionEnd ?? start;
            draftQuestion.setRangeText(s.text, start, end, "end");
            draftQuestion.focus();
            autoGrow(draftQuestion);
            schedulePreview();
        });
    });
    draftQuestion.addEventListener("input", () => autoGrow(draftQuestion));
    draftRationale.addEventListener("input", () => autoGrow(draftRationale));

    /* ---------- live preview (WYSIWYG: uses the real quiz components) ---------- */
    let previewTimer = 0;
    function collect() {
        const rows = optionRows();
        return {
            question: draftQuestion.value.trim(),
            options: rows.map((r) => r.querySelector(".draft-option-input").value.trim()),
            correct: rows.findIndex((r) => r.querySelector(".draft-option-radio").checked),
            category: draftCategory.value.trim(),
            rationale: draftRationale.value.trim()
        };
    }
    function renderPreview() {
        if (!preview.open) return;
        const d = collect();
        previewBody.replaceChildren();
        if (!d.question && d.options.every((o) => !o)) {
            const p = document.createElement("p");
            p.className = "preview-empty";
            p.textContent = "Start typing and your question appears here, exactly as it will in the quiz.";
            previewBody.appendChild(p);
            return;
        }
        const wrap = document.createElement("div");
        wrap.className = "no-anim";
        const qEl = document.createElement("div");
        qEl.className = "question-text";
        window.MCQ.renderZolto(qEl, d.question || "Your question…");
        const lc = window.MCQ.lengthClass(d.question);
        if (lc) qEl.classList.add(lc);
        const stack = document.createElement("div");
        stack.className = "options-stack";
        const opts = d.options.map((o, i) => o || `Option ${i + 1}`);
        window.MCQ.renderOptions(stack, { options: opts, correct: Math.max(d.correct, 0) }, () => {});
        stack.classList.remove("stagger");
        window.MCQ.applyOptionStyles(stack, null, Math.max(d.correct, 0));
        wrap.append(qEl, stack);
        if (d.rationale) {
            const card = document.createElement("div");
            card.className = "rationale-card";
            card.dataset.verdict = "correct";
            card.innerHTML = '<p class="rationale-title"></p><div class="rationale-text"></div>';
            card.querySelector(".rationale-title").innerHTML = I("check") + "<span>Correct</span>";
            window.MCQ.renderZolto(card.querySelector(".rationale-text"), d.rationale);
            wrap.appendChild(card);
        }
        previewBody.appendChild(wrap);
    }
    function schedulePreview() {
        clearTimeout(previewTimer);
        previewTimer = setTimeout(renderPreview, 220);
    }
    preview.addEventListener("toggle", renderPreview);
    [draftQuestion, draftCategory, draftRationale].forEach((el) => el.addEventListener("input", schedulePreview));
    draftOptions.addEventListener("input", schedulePreview);
    draftOptions.addEventListener("change", schedulePreview);
    renderPreview();
    window.addEventListener("mcq:theme", renderPreview);

    /* ---------- question list ---------- */
    function renderQuestionList() {
        builderList.replaceChildren();

        if (questions.length === 0) {
            const empty = document.createElement("p");
            empty.className = "builder-empty";
            empty.textContent = "Questions you add will appear here.";
            builderList.appendChild(empty);
        }

        questions.forEach((q, idx) => {
            const item = document.createElement("div");
            item.className = "builder-item";

            const num = document.createElement("span");
            num.className = "builder-item-num";
            num.textContent = String(idx + 1).padStart(2, "0");

            const text = document.createElement("span");
            text.className = "builder-item-text";
            text.textContent = window.MCQ.zoltoPlainText(q.question);
            text.title = text.textContent;

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "icon-btn-sm";
            removeBtn.setAttribute("aria-label", `Remove question ${idx + 1}`);
            removeBtn.innerHTML = I("trash");
            removeBtn.addEventListener("click", () => {
                questions.splice(idx, 1);
                renderQuestionList();
                setMsg("");
            });

            item.append(num, text, removeBtn);
            builderList.appendChild(item);
        });

        const n = questions.length;
        startQuizBtn.disabled = n === 0;
        footerNote.textContent = n === 0 ? "No questions yet" : `${n} question${n === 1 ? "" : "s"} ready`;

        catList.replaceChildren();
        Array.from(new Set(questions.map((q) => q.category).filter(Boolean))).forEach((c) => {
            const o = document.createElement("option");
            o.value = c;
            catList.appendChild(o);
        });
    }
    renderQuestionList();

    /* ---------- add a question ---------- */
    addQuestionBtn.addEventListener("click", () => {
        const d = collect();

        if (!d.question) { setMsg("Write the question first."); markInvalid(draftQuestion); return; }
        const emptyIdx = d.options.findIndex((o) => !o);
        if (emptyIdx !== -1) {
            setMsg(`Fill in option ${emptyIdx + 1}, or remove it.`);
            markInvalid(optionRows()[emptyIdx].querySelector(".draft-option-input"));
            return;
        }
        if (d.correct === -1) { setMsg("Choose which option is correct."); return; }

        questions.push({
            question: d.question,
            options: d.options,
            correct: d.correct,
            category: d.category || undefined,
            rationale: d.rationale || undefined
        });

        draftQuestion.value = "";
        draftRationale.value = "";
        autoGrow(draftQuestion);
        autoGrow(draftRationale);
        draftQuestion.style.height = "";
        draftRationale.style.height = "";
        resetOptions();
        renderQuestionList();
        renderPreview();
        setMsg(`Added. ${questions.length} so far.`, "ok");
        draftQuestion.focus({ preventScroll: true });
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
