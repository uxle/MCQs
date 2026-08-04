export function renderQuestion(stepEl, textEl, questionObj, currentIdx, total) {
    stepEl.textContent = `Question ${currentIdx + 1} of ${total}`;
    textEl.textContent = questionObj.question;
}
