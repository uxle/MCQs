(function () {
    function slugify(text) {
        return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "quiz";
    }

    function buildResultsPayload(state) {
        const total = state.questions.length;
        const accuracy = total > 0 ? Math.round((state.correctCount / total) * 100) : 0;

        const categoryMap = new Map();
        state.responses.forEach((r) => {
            const cat = r.category || "General";
            if (!categoryMap.has(cat)) categoryMap.set(cat, { total: 0, correct: 0 });
            const bucket = categoryMap.get(cat);
            bucket.total++;
            if (r.isCorrect) bucket.correct++;
        });

        const categories = Array.from(categoryMap.entries())
            .map(([category, bucket]) => ({
                category,
                total: bucket.total,
                correct: bucket.correct,
                accuracy: bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0
            }))
            .sort((a, b) => a.accuracy - b.accuracy);

        return {
            quizTitle: state.title,
            completedAt: new Date().toISOString(),
            totalQuestions: total,
            correct: state.correctCount,
            incorrect: state.wrongCount,
            skipped: state.skippedCount,
            accuracy,
            weakestField: categories.length > 0 ? categories[0].category : null,
            categories,
            responses: state.responses.map((r) => ({
                question: r.question,
                category: r.category,
                yourAnswer: r.selectedText,
                correctAnswer: r.correctText,
                result: r.skipped ? "skipped" : (r.isCorrect ? "correct" : "incorrect")
            }))
        };
    }

    function downloadResults(state) {
        const payload = buildResultsPayload(state);
        const json = JSON.stringify(payload, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const date = payload.completedAt.slice(0, 10);

        const link = document.createElement("a");
        link.href = url;
        link.download = `results-${slugify(state.title)}-${date}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.buildResultsPayload = buildResultsPayload;
    window.MCQ.downloadResults = downloadResults;
})();
