window.MCQ = window.MCQ || {};

window.MCQ.QuizState = class QuizState {
    constructor() {
        this.questions = [];
        this.currentIdx = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.skippedCount = 0;
        this.answered = false;
        this.title = "Assessment";
        this.responses = [];
    }

    reset() {
        this.currentIdx = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.skippedCount = 0;
        this.answered = false;
        this.responses = [];
    }

    recordAnswer(question, selectedIdx, correctIdx) {
        const isCorrect = selectedIdx === correctIdx;
        this.answered = true;

        if (isCorrect) this.correctCount++;
        else this.wrongCount++;

        this.responses.push({
            question: question.question,
            category: question.category || "General",
            selectedIdx,
            correctIdx,
            selectedText: question.options[selectedIdx],
            correctText: question.options[correctIdx],
            isCorrect,
            skipped: false
        });

        return isCorrect;
    }

    recordSkip(question) {
        this.answered = true;
        this.skippedCount++;

        this.responses.push({
            question: question.question,
            category: question.category || "General",
            selectedIdx: null,
            correctIdx: question.correct,
            selectedText: null,
            correctText: question.options[question.correct],
            isCorrect: false,
            skipped: true
        });
    }
};
