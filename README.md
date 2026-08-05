# MCQ Practice

A lightweight, modular multiple-choice quiz engine. Built with vanilla HTML,
CSS, and JavaScript — no build step, no framework. Works for any subject:
science, trivia, certifications, interview prep, or your own question bank.

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
- **Export results** — after finishing, download a `results.json` with your
  score, a per-question breakdown, and a per-field/category accuracy
  breakdown (sorted so your weakest field shows first).
- **Review missed questions** — a compact, collapsible list on the results
  screen; each row expands on tap so a long list never overflows the screen.
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
├── index.html            # Entry point (loads Font Awesome + the 4 stylesheets)
├── css/
│   ├── 1-variables.css    # Design tokens — light/dark palettes, motion, radii
│   ├── 2-base.css         # Reset, page layout, safe-area, persistent app shell
│   ├── 3-components.css   # Home, builder, quiz, and results screen styles
│   └── 4-responsive.css   # Breakpoints: large phone / small phone / watch-class
├── js/
│   ├── main.js             # MCQEngine — screen routing + orchestration
│   ├── config.js           # Bundled sample quiz data
│   ├── state.js             # Score, skip, and per-response tracking
│   ├── theme.js             # Dark/light toggle logic
│   ├── uploader.js          # Reads + validates uploaded/dropped JSON
│   ├── home.js               # Home screen (upload dropzone + 2 actions)
│   ├── builder.js            # "Make questions" quiz builder
│   ├── quizview.js           # Quiz screen markup
│   ├── progress.js           # Progress bar + fraction label
│   ├── question.js           # Question text rendering
│   ├── options.js            # Answer buttons + correct/wrong styling
│   ├── rationale.js          # Explanation card
│   ├── results.js            # Results screen + collapsible review list
│   └── exporter.js           # Builds and downloads results.json
├── sample.json            # Sample quiz dataset (mirrors config.js)
└── README.md
```

---

## 🚀 Getting Started

1. Clone or download the project files.
2. Open `index.html` in any modern browser (double-click, or serve locally).
3. On the home screen: drop in your own `.json` quiz, tap **Make questions**
   to build one, or tap **Example questions** to try the demo.

> Icons are loaded from the Font Awesome CDN, so an internet connection is
> needed the first time icons render. Everything else — including the
> sample quiz, the builder, and exporting results — works fully offline.

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
- `rationale`: optional — shown after the question is answered.

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
