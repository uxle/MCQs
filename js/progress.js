(function () {
    function renderProgress(fillEl, labelEl, total, currentIdx) {
        const current = total > 0 ? currentIdx + 1 : 0;
        const pct = total > 0 ? (current / total) * 100 : 0;
        fillEl.style.width = `${pct}%`;
        labelEl.textContent = `${current} / ${total}`;
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.renderProgress = renderProgress;
})();
