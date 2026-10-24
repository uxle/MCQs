(function () {
    // Inline SVG icons (24x24, 1.75 stroke). No CDN, works fully offline.
    const PATHS = {
        home: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
        moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
        upload: '<path d="M12 16V5"/><path d="m7.5 9.5 4.5-4.5 4.5 4.5"/><path d="M5 15v3a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 18v-3"/>',
        pen: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
        cards: '<rect x="4" y="5" width="16" height="14" rx="3"/><path d="M8.5 10h7M8.5 14h4"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        x: '<path d="m6 6 12 12M18 6 6 18"/>',
        trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>',
        back: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
        arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
        download: '<path d="M12 4v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M5 19h14"/>',
        check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
        refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.5L4 8.5"/><path d="M4 4v4.5h4.5"/><path d="M4 13a8 8 0 0 0 14.3 4.5L20 15.5"/><path d="M20 20v-4.5h-4.5"/>',
        eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>',
        math: '<path d="M5 7h6M8 4v6"/><path d="M13.5 17.5h6"/><path d="M5.5 15.5 10 20M10 15.5 5.5 20"/><path d="M14 8h5.5"/>',
        code: '<path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 6l-3 12"/>',
        chart: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
        diagram: '<rect x="3.5" y="4" width="6" height="5" rx="1.5"/><rect x="14.5" y="15" width="6" height="5" rx="1.5"/><path d="M9.5 6.5h3A2 2 0 0 1 14.5 8.5v6.5"/>',
        bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"/>',
        image: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 3.5 3 3-2.5L20 16"/>',
        play: '<path d="M8 5.5v13l10-6.5-10-6.5Z"/>',
        file: '<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20V3.5Z"/><path d="M14 3.5V8h4"/>',
        keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="3"/><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M7.5 14h9"/>'
    };

    function icon(name, extraClass) {
        const body = PATHS[name] || "";
        return `<svg class="icon${extraClass ? " " + extraClass : ""}" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
    }

    // Brand mark: a rounded square holding a check inside an answer-option bar.
    function logo() {
        return `<svg class="logo" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
            <defs><linearGradient id="logo-grad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/></linearGradient></defs>
            <rect width="32" height="32" rx="10" fill="url(#logo-grad)"/>
            <rect x="7" y="8.5" width="18" height="4" rx="2" fill="#fff" fill-opacity=".45"/>
            <rect x="7" y="14" width="11" height="4" rx="2" fill="#fff" fill-opacity=".45"/>
            <path d="m11 22.4 3 3 7.5-8.4" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" transform="translate(1 -1.2)"/>
        </svg>`;
    }

    window.MCQ = window.MCQ || {};
    window.MCQ.icon = icon;
    window.MCQ.logo = logo;
})();
