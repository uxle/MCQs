(function () {
    function renderQuestion(textEl, questionObj) {
        textEl.textContent = questionObj.question;
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.renderQuestion = renderQuestion;
})();
