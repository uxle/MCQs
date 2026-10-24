(function () {
const RING_C = 2 * Math.PI * 52; // circumference of the r=52 ring
const reduceMotion = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

// Peak-end rule: the last screen colours how the whole session is remembered.
// Lead with what went well, then give one concrete, doable next step. Never
// shame a low score ("keep practising" reads as failure; "a good start" doesn't).
function messageFor(pct, correct, total, missed) {
    const n = missed === 1 ? "1 question" : `${missed} questions`;
    if (total === 0) return { head: "Quiz complete", sub: "" };
    if (pct === 100) return { head: "Flawless run", sub: `${correct} of ${total}. Every single answer was right.` };
    if (pct >= 80) return { head: "Great work", sub: `${correct} of ${total} right. Just ${n} left to polish.` };
    if (pct >= 60) return { head: "Solid effort", sub: `${correct} of ${total} right. The core is there, so revisit ${n}.` };
    if (pct >= 40) return { head: "Getting there", sub: `${correct} of ${total} right. Practise the ${n} you missed and it will stick.` };
    return { head: "A good start", sub: `${correct} of ${total} right. Every attempt makes answers stick. Try the ${n} you missed.` };
}

function countUp(el, to, { duration = 900, suffix = "", delay = 0 } = {}) {
    if (reduceMotion() || to === 0) { el.textContent = to + suffix; return; }
    el.textContent = "0" + suffix;
    const start = performance.now() + delay;
    function tick(now) {
        const t = Math.min(Math.max((now - start) / duration, 0), 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        el.textContent = Math.round(to * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function confetti(host) {
    if (reduceMotion()) return;
    const colors = ["var(--accent)", "var(--accent-2)", "var(--success)", "#ffd166", "#ff7aa2"];
    const layer = document.createElement("div");
    layer.className = "confetti";
    layer.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 28; i++) {
        const bit = document.createElement("i");
        bit.style.setProperty("--x", `${6 + Math.random() * 88}%`);
        bit.style.setProperty("--dx", `${(Math.random() - 0.5) * 120}px`);
        bit.style.setProperty("--rot", `${360 + Math.random() * 540}deg`);
        bit.style.setProperty("--d", `${Math.random() * 280}ms`);
        bit.style.setProperty("--c", colors[i % colors.length]);
        layer.appendChild(bit);
    }
    host.appendChild(layer);
    setTimeout(() => layer.remove(), 2400);
}

function renderResultsView(rootEl) {
    const I = window.MCQ.icon;
    rootEl.innerHTML = `
        <div class="results screen">
            <div class="results-hero">
                <div class="score-ring" id="score-ring" role="img" aria-label="Score">
                    <svg viewBox="0 0 120 120" aria-hidden="true">
                        <defs><linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/>
                        </linearGradient></defs>
                        <circle class="ring-track" cx="60" cy="60" r="52"/>
                        <circle class="ring-fill" id="ring-fill" cx="60" cy="60" r="52"/>
                    </svg>
                    <div class="score-center">
                        <span class="score-pct" id="accuracy-rate">0%</span>
                        <span class="score-cap">accuracy</span>
                    </div>
                </div>
                <div class="results-copy">
                    <h1 class="results-title" id="results-title" tabindex="-1">Quiz complete</h1>
                    <p class="results-subtitle" id="quiz-title-summary"></p>
                    <p class="skip-note" id="skip-note" hidden></p>
                    <p class="perfect-note" id="perfect-note" hidden>${I("check")} Every answer was correct</p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-box" style="--i:0"><div class="stat-value stat-right" id="count-right">0</div><div class="stat-label">Correct</div></div>
                <div class="stat-box" style="--i:1"><div class="stat-value stat-wrong" id="count-wrong">0</div><div class="stat-label">Missed</div></div>
                <div class="stat-box" style="--i:2"><div class="stat-value stat-total" id="count-total">0</div><div class="stat-label">Total</div></div>
            </div>

            <div class="category-list" id="category-list" hidden></div>

            <div class="results-secondary">
                <button type="button" class="action-btn" id="review-btn" aria-label="Review answers" hidden>${I("eye")}<span>Review</span></button>
                <button type="button" class="action-btn" id="export-btn" aria-label="Export results">${I("download")}<span>Export</span></button>
                <button type="button" class="link-btn" id="retake-btn" hidden>${I("refresh")} Retake all questions</button>
            </div>

            <div class="card-footer results-footer">
                <button type="button" class="btn-primary" id="restart-btn"></button>
            </div>
        </div>
    `;

    return {
        resultsTitle: rootEl.querySelector("#results-title"),
        restartBtn: rootEl.querySelector("#restart-btn"),
        exportBtn: rootEl.querySelector("#export-btn"),
        reviewBtn: rootEl.querySelector("#review-btn"),
        retakeBtn: rootEl.querySelector("#retake-btn")
    };
}

function renderResults(container, state) {
    const total = state.questions.length;
    const pct = total > 0 ? Math.round((state.correctCount / total) * 100) : 0;

    const missedCount = state.responses.filter((r) => !r.isCorrect).length;
    const msg = messageFor(pct, state.correctCount, total, missedCount);
    container.querySelector("#results-title").textContent = msg.head;
    container.querySelector("#quiz-title-summary").textContent = msg.sub;
    container.querySelector("#score-ring").setAttribute("aria-label", `Score: ${pct} percent`);

    // Ring sweeps from empty to the score; numbers count up in step with it
    const ring = container.querySelector("#ring-fill");
    ring.classList.toggle("is-empty", pct === 0);
    requestAnimationFrame(() => requestAnimationFrame(() => {
        ring.style.strokeDashoffset = String(RING_C * (1 - pct / 100));
    }));
    countUp(container.querySelector("#accuracy-rate"), pct, { suffix: "%", duration: 1200, delay: 200 });
    countUp(container.querySelector("#count-right"), state.correctCount, { delay: 300 });
    countUp(container.querySelector("#count-wrong"), missedCount, { delay: 380 });
    countUp(container.querySelector("#count-total"), total, { delay: 460 });

    const skipNote = container.querySelector("#skip-note");
    if (state.skippedCount > 0) {
        skipNote.textContent = `${state.skippedCount} question${state.skippedCount === 1 ? "" : "s"} skipped`;
        skipNote.hidden = false;
    } else {
        skipNote.hidden = true;
    }

    // Per-topic accuracy, weakest first (matches the exported results.json)
    const buckets = new Map();
    state.responses.forEach((r) => {
        const key = r.category || "General";
        if (!buckets.has(key)) buckets.set(key, { total: 0, correct: 0 });
        const b = buckets.get(key);
        b.total++;
        if (r.isCorrect) b.correct++;
    });
    const list = container.querySelector("#category-list");
    if (buckets.size > 1) {
        const rows = Array.from(buckets, ([name, b]) => ({ name, acc: Math.round((b.correct / b.total) * 100) })).sort((a, b) => a.acc - b.acc);
        list.replaceChildren();
        const title = document.createElement("p");
        title.className = "category-title";
        title.textContent = "By topic";
        list.appendChild(title);
        rows.forEach((row, i) => {
            const el = document.createElement("div");
            el.className = "cat-row";
            el.style.setProperty("--i", String(i));
            const color = row.acc >= 80 ? "var(--success)" : row.acc >= 50 ? "var(--accent)" : "var(--danger)";
            el.innerHTML = `<span class="cat-name"></span><span class="cat-bar"><i style="--bar-color:${color};--i:${i}"></i></span><span class="cat-pct">${row.acc}%</span>`;
            el.querySelector(".cat-name").textContent = row.name;
            el.querySelector(".cat-name").title = row.name;
            list.appendChild(el);
            requestAnimationFrame(() => requestAnimationFrame(() => { el.querySelector(".cat-bar > i").style.width = `${row.acc}%`; }));
        });
        list.hidden = false;
    } else {
        list.hidden = true;
    }

    container.querySelector("#perfect-note").hidden = missedCount !== 0 || total === 0;
    container.querySelector("#review-btn").hidden = missedCount === 0;
    container.querySelector("#retake-btn").hidden = missedCount === 0;

    // One primary action, chosen for the situation: fix what was missed, or go again
    const I = window.MCQ.icon;
    const primary = container.querySelector("#restart-btn");
    primary.innerHTML = missedCount > 0
        ? `${I("play")} Practise ${missedCount} missed`
        : `${I("refresh")} Try again`;

    if (missedCount === 0 && total > 0) setTimeout(() => confetti(container.querySelector(".results")), 500);
    return missedCount;
}

window.MCQ = window.MCQ || {};
window.MCQ.renderResultsView = renderResultsView;
window.MCQ.renderResults = renderResults;
})();
