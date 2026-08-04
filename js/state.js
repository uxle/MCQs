export class QuizState {
    constructor() {
        this.questions = [];
        this.currentIdx = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.answered = false;
        this.title = "Assessment";
    }

    reset() {
        this.currentIdx = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.answered = false;
    }

    recordAnswer(isCorrect) {
        this.answered = true;
        if (isCorrect) this.correctCount++;
        else this.wrongCount++;
    }
}
