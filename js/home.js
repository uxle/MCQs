(function () {
    function downloadTemplate() {
        const blob = new Blob([JSON.stringify(window.MCQ.sampleQuizData, null, 2) + "\n"], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quiz-template.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function renderHome(rootEl, { onUpload, onUploadError, onMakeQuestions, onExampleQuestions }) {
        const I = window.MCQ.icon;
        rootEl.innerHTML = `
            <div class="home screen stagger">
                <div style="--i:0">
                    <h1 class="hero-title" id="home-heading" tabindex="-1">Quiz yourself on<br><span class="gradient-text">anything.</span></h1>
                    <p class="hero-sub">Load a question set or write one by hand. Questions and answers can include math, code, charts and diagrams.</p>
                </div>

                <div class="home-upload" style="--i:1">
                    <label class="upload-dropzone" for="json-file-input" id="upload-dropzone">
                        <span class="upload-badge">${I("upload")}</span>
                        <span class="upload-title">Upload a JSON quiz</span>
                        <span class="upload-hint">Choose a file, or drop it here</span>
                    </label>
                    <input type="file" id="json-file-input" class="file-input" accept=".json,application/json">
                </div>

                <div class="home-actions" style="--i:2">
                    <button type="button" class="btn-primary" id="example-questions-btn">${I("play")} Try the example</button>
                    <button type="button" class="action-btn" id="make-questions-btn">${I("pen")}<span>Make questions</span></button>
                </div>

                <button type="button" class="link-btn template-link" id="template-btn" style="--i:3">${I("file")} Not sure of the format? Get a template</button>

                <ul class="feature-chips" style="--i:4" aria-label="Supported question content">
                    <li class="feature-lead" aria-hidden="true">Supports</li>
                    <li>${I("math")} Math</li>
                    <li>${I("code")} Code</li>
                    <li>${I("chart")} Charts</li>
                    <li>${I("diagram")} Diagrams</li>
                </ul>
            </div>
        `;

        const heading = rootEl.querySelector("#home-heading");
        const dropzone = rootEl.querySelector("#upload-dropzone");
        const fileInput = rootEl.querySelector("#json-file-input");

        window.MCQ.initUploader(fileInput, onUpload, onUploadError);

        dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
        dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
        dropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropzone.classList.remove("dragover");
            const file = e.dataTransfer.files[0];
            if (file) window.MCQ.readFile(file, onUpload, onUploadError);
        });

        rootEl.querySelector("#make-questions-btn").addEventListener("click", onMakeQuestions);
        rootEl.querySelector("#example-questions-btn").addEventListener("click", onExampleQuestions);
        rootEl.querySelector("#template-btn").addEventListener("click", downloadTemplate);

        return { heading };
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.renderHome = renderHome;
})();
