export function showRationale(cardEl, textEl, rationaleText) {
    if (!rationaleText) return;
    textEl.textContent = rationaleText;
    cardEl.hidden = false;
}

export function hideRationale(cardEl) {
    cardEl.hidden = true;
}
