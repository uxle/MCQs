(function () {
    function renderQuestion(textEl, questionObj) {
        window.MCQ.renderZolto(textEl, questionObj.question);
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.renderQuestion = renderQuestion;
})();
