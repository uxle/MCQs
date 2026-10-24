(function () {
    function currentTheme() {
        return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    }

    function applyThemeUI(toggleBtn, theme, animate) {
        const next = theme === "dark" ? "light" : "dark";
        toggleBtn.innerHTML = window.MCQ.icon(theme === "dark" ? "sun" : "moon");
        toggleBtn.setAttribute("aria-label", `Switch to ${next} mode`);
        toggleBtn.title = `Switch to ${next} mode`;

        if (animate) {
            toggleBtn.classList.remove("spin");
            void toggleBtn.offsetWidth;
            toggleBtn.classList.add("spin");
        }

        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
            if (bg) meta.setAttribute("content", bg);
        }
    }

    function initTheme(toggleBtn) {
        applyThemeUI(toggleBtn, currentTheme(), false);

        toggleBtn.addEventListener("click", () => {
            const next = currentTheme() === "dark" ? "light" : "dark";
            document.documentElement.dataset.theme = next;

            try {
                localStorage.setItem("mcq-theme", next);
            } catch (e) {
                /* localStorage unavailable — theme still applies for this session */
            }

            applyThemeUI(toggleBtn, next, true);
            window.dispatchEvent(new Event("mcq:theme"));
        });
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.initTheme = initTheme;
})();
