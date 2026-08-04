export function showRationale(cardEl, textEl, rationaleText) {
    textEl.textContent = rationaleText;
    cardEl.classList.add("visible");
}

export function hideRationale(cardEl) {
    cardEl.classList.remove("visible");
}
