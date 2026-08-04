export function renderOptions(container, questionObj, onSelect) {
    container.innerHTML = "";
    questionObj.options.forEach((optText, idx) => {
        const item = document.createElement("div");
        item.className = "option-item";
        item.innerHTML = `
            <span>${optText}</span>
            <span class="status-badge"></span>
        `;
        item.addEventListener("click", () => onSelect(idx, questionObj.correct));
        container.appendChild(item);
    });
}

export function applyOptionStyles(container, selectedIdx, correctIdx) {
    const options = container.querySelectorAll(".option-item");
    options.forEach((opt, idx) => {
        opt.style.pointerEvents = "none";
        if (idx === correctIdx) {
            opt.classList.add("correct");
            opt.querySelector(".status-badge").textContent = "✓";
        } else if (idx === selectedIdx && selectedIdx !== correctIdx) {
            opt.classList.add("wrong");
            opt.querySelector(".status-badge").textContent = "✕";
        }
    });
}
