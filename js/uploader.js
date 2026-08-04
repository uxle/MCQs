export function initUploader(fileInputEl, onDataLoaded) {
    fileInputEl.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed.questions && Array.isArray(parsed.questions)) {
                    onDataLoaded(parsed);
                } else {
                    alert("Invalid JSON format: missing 'questions' array.");
                }
            } catch (err) {
                alert("Failed to parse JSON file.");
            }
        };
        reader.readAsText(file);
    });
}
