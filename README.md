# MCQ Practice

A lightweight, modular multiple-choice quiz engine. Built with vanilla HTML,
CSS, and JavaScript — no build step, no framework, no server. Works for any
subject: science, trivia, certifications, interview prep, or your own
question bank.

---

## ✨ Features

- **Home screen** — a big upload dropzone (click or drag-and-drop a `.json`
  file) plus two actions below it: **Make questions** (build a quiz by hand)
  and **Example questions** (try the bundled sample).
- **Make questions** — a small in-app builder: add a question, its options,
  mark the correct one, and optionally a field/category and an explanation.
  Add as many as you like, then start the quiz.
- **Skip → Continue** — the footer button starts as **Skip**; the moment you
  pick an answer it turns into **Continue** (or **Finish** on the last
  question), so answering and skipping share one button instead of two.
- **Review answers** — a dedicated screen (opened from a button on the
  results screen) that shows every missed question exactly like the real
  quiz — full question, options, correct one highlighted green, your wrong
  pick highlighted red — instead of a plain text list.
- **Export results** — download a `results.json` with your score, a
  per-question breakdown, and a per-field/category accuracy breakdown
  (sorted so your weakest field shows first).
- **Dark / light mode** — an explicit toggle in the header, remembered across
  visits. Defaults to your system preference on first visit.
- **Fully responsive** — one fluid layout from ultra-narrow (watch-class,
  ~200px) screens through phones, tablets, laptops, and ultra-wide desktops.
- **Accessible by default** — real, keyboard-operable buttons; a live region
  announces correct/incorrect to screen readers; visible focus rings; motion
  is disabled for users who prefer reduced motion.

---

## 📁 File Structure

```text
.
├── index.html            # Entry point (loads Font Awesome + the 4 stylesheets + 15 scripts)
├── css/
│   ├── 1-variables.css    # Design tokens — light/dark palettes, motion, radii
│   ├── 2-base.css         # Reset, page layout, safe-area, persistent app shell
│   ├── 3-components.css   # Home, builder, quiz, results, and review screen styles
│   └── 4-responsive.css   # Breakpoints: large phone / small phone / watch-class
├── js/
│   ├── config.js           # Bundled sample quiz data
│   ├── state.js            # Score, skip, and per-response tracking
│   ├── theme.js             # Dark/light toggle logic
│   ├── uploader.js          # Reads + validates uploaded/dropped JSON
│   ├── progress.js          # Progress bar + fraction label
│   ├── question.js          # Question text rendering
│   ├── options.js           # Answer buttons + correct/wrong styling
│   ├── rationale.js         # Explanation card
│   ├── exporter.js          # Builds and downloads results.json
│   ├── home.js              # Home screen (upload dropzone + 2 actions)
│   ├── builder.js           # "Make questions" quiz builder
│   ├── quizview.js          # Quiz screen markup
│   ├── results.js           # Results screen (stats + Review/Export/Try again)
│   ├── review.js            # Dedicated review screen (missed questions as real MCQs)
│   └── main.js              # MCQEngine — screen routing + orchestration
├── sample.json            # Sample quiz dataset (mirrors config.js)
└── README.md
```

Each file attaches what it exports to a single shared `window.MCQ` object
(e.g. `window.MCQ.renderOptions = ...`) instead of using `import`/`export`.
Plain `<script src="...">` tags — loaded in dependency order in
`index.html` — work when the page is opened directly from disk; ES modules
do not, since browsers block `import`/`export` module loading over the
`file://` protocol without a server. This is why the app now runs by simply
double-clicking `index.html` — no local server required.

---

## 🚀 Getting Started

1. Clone or download the project files, keeping the folder structure intact.
2. Double-click `index.html` — it opens and runs directly in your browser.
   No server, no build step, no installation.
3. On the home screen: drop in your own `.json` quiz, tap **Make questions**
   to build one, or tap **Example questions** to try the demo.

> Icons are loaded from the Font Awesome CDN, so an internet connection is
> needed the first time icons render. Everything else — including the
> sample quiz, the builder, taking a quiz, reviewing answers, and exporting
> results — works fully offline.

## 📝 Custom JSON Schema

```json
{
  "title": "My Custom Quiz",
  "questions": [
    {
      "id": 1,
      "question": "What is the boiling point of water at sea level?",
      "options": ["90°C", "100°C", "110°C", "120°C"],
      "correct": 1,
      "category": "Science",
      "rationale": "At standard atmospheric pressure, water boils at 100°C (212°F)."
    }
  ]
}
```

- `correct`: zero-based index of the correct answer in `options`.
- `category`: optional — groups questions for the exported per-field accuracy
  breakdown. Defaults to "General" if omitted.
- `rationale`: optional — shown after the question is answered, and in the
  review screen for any question you got wrong.

Invalid files (missing questions, too few options, an out-of-range `correct`
index) are rejected with a specific inline message instead of crashing the quiz.

## 📤 Exported results.json

```json
{
  "quizTitle": "General Knowledge Sample",
  "completedAt": "2026-08-05T00:00:00.000Z",
  "totalQuestions": 5,
  "correct": 3,
  "incorrect": 1,
  "skipped": 1,
  "accuracy": 60,
  "weakestField": "History",
  "categories": [{ "category": "History", "total": 1, "correct": 0, "accuracy": 0 }],
  "responses": [{ "question": "…", "category": "History", "yourAnswer": "1944", "correctAnswer": "1945", "result": "incorrect" }]
}
```

## 📄 License

MIT — see `LICENSE`.
