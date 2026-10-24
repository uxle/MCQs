(function () {
    const registry = new WeakMap();
    const VISUAL_DIRECTIVE = /^(@(?:chart|diagram|vector)\b[^\n]*)$/gm;

    function plainText(src) {
        return String(src)
            .replace(/```[\s\S]*?```/g, " code ")
            .replace(/^@\/?[a-z]+[^\n]*$/gim, " ")
            .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
            .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
            .replace(/[`*_#>$|]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    // First strong letter decides direction (so an Arabic option mirrors its row)
    function isRtl(text) {
        const m = String(text).match(/\p{L}/u);
        return !!m && /[֐-ࣿיִ-﷽ﹰ-ﻼ]/.test(m[0]);
    }

    // Size/weight of a question follows how much text it holds
    function lengthClass(src) {
        const len = plainText(src).length;
        return len > 220 ? "q-xlong" : len > 110 ? "q-long" : "";
    }

    function currentTheme() {
        return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    }

    // Charts/diagrams/vectors bake in a theme, so request the app's current one
    function withTheme(src) {
        const theme = currentTheme();
        return src.replace(VISUAL_DIRECTIVE, (line) => (/\btheme\s*=/.test(line) ? line : `${line} theme="${theme}"`));
    }

    function hoistStyles(root) {
        root.querySelectorAll("style").forEach((style) => {
            if (style.id && !document.getElementById(style.id)) document.head.appendChild(style);
            else style.remove();
        });
    }

    function unwrapSingleParagraph(root) {
        const kids = Array.from(root.children);
        if (kids.length === 1 && kids[0].tagName === "P") kids[0].replaceWith(...kids[0].childNodes);
    }

    // Quiz content is data, not code: no scripts, handlers, or javascript: links
    function sanitize(root) {
        root.querySelectorAll(".zl-copy, script, iframe, object, embed, form").forEach((n) => n.remove());
        root.querySelectorAll("*").forEach((el) => {
            Array.from(el.attributes).forEach((attr) => {
                if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
            });
        });
        root.querySelectorAll("a[href]").forEach((a) => {
            if (/^\s*(javascript|data|vbscript):/i.test(a.getAttribute("href"))) { a.removeAttribute("href"); return; }
            a.target = "_blank";
            a.rel = "noopener noreferrer";
        });
    }

    function imageFallback(img) {
        const alt = img.getAttribute("alt") || "";
        const box = document.createElement("div");
        box.className = "img-fallback";
        box.setAttribute("role", "img");
        box.setAttribute("aria-label", alt ? `Image unavailable: ${alt}` : "Image unavailable");
        box.innerHTML = window.MCQ.icon("image");
        const label = document.createElement("span");
        label.textContent = alt ? `Image unavailable · ${alt}` : "Image unavailable";
        box.appendChild(label);
        img.replaceWith(box);
    }

    // Broken, blocked or offline images become a labelled placeholder, and
    // remote images never send a referrer.
    function hardenImages(root) {
        root.querySelectorAll("img").forEach((img) => {
            img.referrerPolicy = "no-referrer";
            img.decoding = "async";
            const src = (img.getAttribute("src") || "").trim();
            if (!src || src === "#") { imageFallback(img); return; }
            img.addEventListener("error", () => imageFallback(img), { once: true });
        });
    }

    // One-entry legends repeat the title and collide with axis labels
    function dropSingleLegends(root) {
        root.querySelectorAll(".zl-chart-legend").forEach((g) => {
            if (g.querySelectorAll("text").length <= 1) g.remove();
        });
    }

    // Top-level SVG visuals get a consistent "figure" panel
    function frameVisuals(root) {
        root.querySelectorAll(":scope > svg").forEach((svg) => {
            const panel = document.createElement("div");
            panel.className = "zl-visual";
            svg.replaceWith(panel);
            panel.appendChild(svg);
        });
    }

    // Keyboard users must be able to reach scrollable tables / code / equations
    function makeScrollersFocusable(root) {
        root.querySelectorAll(".zl-pre, .zl-math-display, .zl-visual").forEach((el) => {
            if (!el.hasAttribute("tabindex")) { el.tabIndex = 0; el.setAttribute("role", "region"); el.setAttribute("aria-label", el.classList.contains("zl-pre") ? "Code" : el.classList.contains("zl-visual") ? "Figure" : "Equation"); }
        });
    }

    function renderZolto(el, src, opts) {
        const text = src == null ? "" : String(src);
        registry.set(el, { src: text, opts });
        el.setAttribute("dir", "auto");
        const engine = window.Zolto;
        if (!engine || typeof engine.compile !== "function") {
            el.textContent = text;
            return;
        }
        try {
            el.innerHTML = engine.compile(withTheme(text));
            hoistStyles(el);
            sanitize(el);
            hardenImages(el);
            dropSingleLegends(el);
            frameVisuals(el);
            makeScrollersFocusable(el);
            if (opts && opts.inline) unwrapSingleParagraph(el);
            el.classList.add("zl-content");
        } catch (err) {
            el.textContent = text;
        }
    }

    // Visuals are theme-baked, so redraw just those when the theme flips
    window.addEventListener("mcq:theme", () => {
        document.querySelectorAll(".zl-content").forEach((el) => {
            const entry = registry.get(el);
            if (entry && /@(?:chart|diagram|vector)\b/.test(entry.src)) renderZolto(el, entry.src, entry.opts);
        });
    });

    window.MCQ = window.MCQ || {};
    window.MCQ.renderZolto = renderZolto;
    window.MCQ.zoltoPlainText = plainText;
    window.MCQ.isRtl = isRtl;
    window.MCQ.lengthClass = lengthClass;
})();
