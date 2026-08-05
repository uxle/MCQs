export function initUploader(fileInputEl, onDataLoaded, onError) {
    fileInputEl.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) readFile(file, onDataLoaded, onError);
        fileInputEl.value = "";
    });
}

export function readFile(file, onDataLoaded, onError) {
    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const parsed = JSON.parse(event.target.result);
            validateQuiz(parsed);
            onDataLoaded(parsed);
        } catch (err) {
            onError(err.message || "Failed to parse JSON file.");
        }
    };

    reader.onerror = () => onError("Could not read the selected file.");
    reader.readAsText(file);
}

function validateQuiz(data) {
    if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("That file doesn't contain any questions.");
    }

    data.questions.forEach((q, i) => {
        if (typeof q.question !== "string" || !q.question.trim()) {
            throw new Error(`Question ${i + 1} is missing its text.`);
        }
        if (!Array.isArray(q.options) || q.options.length < 2) {
            throw new Error(`Question ${i + 1} needs at least two options.`);
        }
        if (typeof q.correct !== "number" || q.correct < 0 || q.correct >= q.options.length) {
            throw new Error(`Question ${i + 1} has an invalid correct-answer index.`);
        }
    });
}
