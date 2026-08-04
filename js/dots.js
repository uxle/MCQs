export function renderDots(container, total, currentIdx) {
    container.innerHTML = "";
    for (let i = 0; i < total; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        if (i === currentIdx) dot.classList.add("active");
        if (i < currentIdx) dot.classList.add("completed");
        container.appendChild(dot);
    }
}
