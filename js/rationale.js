(function () {
    function showRationale(cardEl, textEl, rationaleText) {
        if (!rationaleText) return;
        textEl.textContent = rationaleText;
        cardEl.hidden = false;
    }

    function hideRationale(cardEl) {
        cardEl.hidden = true;
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.showRationale = showRationale;
    window.MCQ.hideRationale = hideRationale;
})();
