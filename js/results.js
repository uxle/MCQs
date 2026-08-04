export function renderResults(container, state) {
    const total = state.questions.length;
    const accuracy = Math.round((state.correctCount / total) * 100) || 0;

    container.querySelector("#quiz-title-summary").textContent = state.title;
    container.querySelector("#count-right").textContent = state.correctCount;
    container.querySelector("#count-wrong").textContent = state.wrongCount;
    container.querySelector("#accuracy-rate").textContent = `${accuracy}%`;
}
