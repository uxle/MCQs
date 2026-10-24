(function () {
    const MAX_SEGMENTS = 24;

    // Segmented progress: each question is a segment that fills green / red / grey
    // as it is answered, so the bar doubles as a live scorecard. Very long quizzes
    // fall back to a single continuous bar.
    function renderProgress(trackEl, labelEl, total, currentIdx, responses) {
        const current = total > 0 ? currentIdx + 1 : 0;
        labelEl.innerHTML = `<b>${current}</b> / ${total}` + (total > 1 && current === total ? " · last one" : "");
        trackEl.setAttribute("aria-valuetext", `Question ${current} of ${total}`);
        trackEl.setAttribute("aria-valuenow", String(current));
        trackEl.setAttribute("aria-valuemax", String(total));

        if (total > MAX_SEGMENTS) {
            let bar = trackEl.querySelector(".seg-bar > i");
            if (!bar) {
                trackEl.replaceChildren();
                const wrap = document.createElement("span");
                wrap.className = "seg-bar";
                bar = document.createElement("i");
                wrap.appendChild(bar);
                trackEl.appendChild(wrap);
            }
            const done = responses ? responses.length : currentIdx;
            requestAnimationFrame(() => { bar.style.width = `${(done / total) * 100}%`; });
            return;
        }

        if (trackEl.children.length !== total || !trackEl.querySelector(".seg")) {
            trackEl.replaceChildren();
            for (let i = 0; i < total; i++) {
                const seg = document.createElement("span");
                seg.className = "seg";
                trackEl.appendChild(seg);
            }
        }

        Array.from(trackEl.children).forEach((seg, i) => {
            const r = responses && responses[i];
            let cls = "seg";
            if (r) cls += r.skipped ? " done-skip" : r.isCorrect ? " done-correct" : " done-wrong";
            else if (i === currentIdx) cls += " current";
            if (seg.className !== cls) seg.className = cls;
        });
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.renderProgress = renderProgress;
})();
