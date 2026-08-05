export function renderOptions(container, questionObj, onSelect) {
    container.replaceChildren();

    questionObj.options.forEach((optText, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option-item";

        const label = document.createElement("span");
        label.className = "option-label";
        label.textContent = optText;

        const badge = document.createElement("span");
        badge.className = "option-badge";
        badge.setAttribute("aria-hidden", "true");

        btn.append(label, badge);
        btn.addEventListener("click", () => onSelect(idx, questionObj.correct));
        container.appendChild(btn);
    });
}

export function applyOptionStyles(container, selectedIdx, correctIdx) {
    const options = container.querySelectorAll(".option-item");
    options.forEach((opt, idx) => {
        opt.disabled = true;
        if (idx === correctIdx) {
            opt.classList.add("correct");
            opt.querySelector(".option-badge").textContent = "✓";
        } else if (idx === selectedIdx) {
            opt.classList.add("wrong");
            opt.querySelector(".option-badge").textContent = "✕";
        }
    });
}
