import { initUploader, readFile } from './uploader.js';

export function renderHome(rootEl, { onUpload, onUploadError, onMakeQuestions, onExampleQuestions }) {
    rootEl.innerHTML = `
        <h1 class="sr-only" id="home-heading" tabindex="-1">Home</h1>

        <div class="home-upload">
            <label class="upload-dropzone" for="json-file-input" id="upload-dropzone">
                <i class="fa-solid fa-file-arrow-up" aria-hidden="true"></i>
                <span class="upload-title">Upload a JSON quiz</span>
                <span class="upload-hint">Tap to choose a file, or drop it here</span>
            </label>
            <input type="file" id="json-file-input" class="file-input" accept=".json">
        </div>

        <div class="home-actions">
            <button type="button" class="action-btn" id="make-questions-btn">
                <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
                <span>Make questions</span>
            </button>
            <button type="button" class="action-btn" id="example-questions-btn">
                <i class="fa-solid fa-clipboard-question" aria-hidden="true"></i>
                <span>Example questions</span>
            </button>
        </div>
    `;

    const heading = rootEl.querySelector("#home-heading");
    const dropzone = rootEl.querySelector("#upload-dropzone");
    const fileInput = rootEl.querySelector("#json-file-input");
    const makeQuestionsBtn = rootEl.querySelector("#make-questions-btn");
    const exampleQuestionsBtn = rootEl.querySelector("#example-questions-btn");

    initUploader(fileInput, onUpload, onUploadError);

    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        if (file) readFile(file, onUpload, onUploadError);
    });

    makeQuestionsBtn.addEventListener("click", onMakeQuestions);
    exampleQuestionsBtn.addEventListener("click", onExampleQuestions);

    return { heading };
}
