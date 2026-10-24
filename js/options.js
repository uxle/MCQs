(function () {
    const KEYS = "ABCDEF";

    function renderOptions(container, questionObj, onSelect) {
        container.replaceChildren();
        container.classList.remove("answered", "has-wrong");
        container.classList.add("stagger");

        questionObj.options.forEach((optText, idx) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "option-item";
            btn.style.setProperty("--i", String(idx));
            btn.dataset.index = String(idx);
            if (window.MCQ.isRtl(window.MCQ.zoltoPlainText(optText))) btn.dir = "rtl";

            const key = document.createElement("span");
            key.className = "option-key";
            key.setAttribute("aria-hidden", "true");
            key.textContent = KEYS[idx] || String(idx + 1);

            const label = document.createElement("span");
            label.className = "option-label";
            const text = document.createElement("span");
            text.className = "option-text";
            window.MCQ.renderZolto(text, optText, { inline: true });
            label.appendChild(text);

            const badge = document.createElement("span");
            badge.className = "option-badge";
            badge.setAttribute("aria-hidden", "true");

            btn.append(key, label, badge);
            btn.addEventListener("click", () => onSelect(idx, questionObj.correct));
            container.appendChild(btn);
        });
    }

    function srNote(text) {
        const s = document.createElement("span");
        s.className = "sr-only";
        s.textContent = text;
        return s;
    }

    function applyOptionStyles(container, selectedIdx, correctIdx) {
        container.classList.add("answered");
        if (selectedIdx !== null && selectedIdx !== correctIdx) container.classList.add("has-wrong");

        container.querySelectorAll(".option-item").forEach((opt, idx) => {
            opt.disabled = true;
            const badge = opt.querySelector(".option-badge");
            if (idx === correctIdx) {
                opt.classList.add("correct");
                badge.innerHTML = window.MCQ.icon("check").replace("<path", '<path class="draw"');
                opt.appendChild(srNote(". Correct answer."));
            } else if (idx === selectedIdx) {
                opt.classList.add("wrong");
                badge.innerHTML = window.MCQ.icon("x");
                opt.appendChild(srNote(". Your answer, incorrect."));
            }
        });
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.renderOptions = renderOptions;
    window.MCQ.applyOptionStyles = applyOptionStyles;
})();
