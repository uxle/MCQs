function currentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyThemeUI(toggleBtn, theme) {
    const icon = toggleBtn.querySelector("i");
    if (theme === "dark") {
        icon.className = "fa-solid fa-sun";
        toggleBtn.setAttribute("aria-label", "Switch to light mode");
    } else {
        icon.className = "fa-solid fa-moon";
        toggleBtn.setAttribute("aria-label", "Switch to dark mode");
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
        if (bg) meta.setAttribute("content", bg);
    }
}

export function initTheme(toggleBtn) {
    applyThemeUI(toggleBtn, currentTheme());

    toggleBtn.addEventListener("click", () => {
        const next = currentTheme() === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;

        try {
            localStorage.setItem("mcq-theme", next);
        } catch (e) {
            /* localStorage unavailable — theme still applies for this session */
        }

        applyThemeUI(toggleBtn, next);
    });
}
