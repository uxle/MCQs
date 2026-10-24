# MCQ Practice

A lightweight, modular multiple-choice quiz engine. Built with vanilla HTML,
CSS, and JavaScript — no build step, no framework, no server. Works for any
subject: science, trivia, certifications, interview prep, or your own
question bank.

---

## ✨ Features

- **Home screen** — one clear primary action (**Try the example**), a quiet
  upload dropzone (click or drag-and-drop a `.json`), **Make questions** for
  building by hand, and a downloadable `quiz-template.json`.
- **Make questions** — a builder with one-tap **Math / Code / Chart / Diagram**
  snippets, auto-growing fields, a live **WYSIWYG preview** rendered with the
  real quiz components, up to 6 options per question, inline validation (no
  alerts) and an honest footer ("No questions yet" → "N questions ready").
- **Skip → Continue** — one footer button that is **Skip** until you answer,
  then **Continue** (or **Finish**). It is pinned to the bottom of the screen,
  inside the thumb zone, however long the question or explanation is.
- **Calm feedback** — a verdict card ("Correct" / "Not quite" / "Skipped" plus
  "Answer: B") with the explanation. Wrong answers shake, then the right one is
  revealed a beat later.
- **Results that motivate** — peak-end copy ("A good start", not "Keep
  practising"), an animated ring, Correct / Missed / Total stats that add up,
  per-topic bars, and an adaptive primary action: **Practise N missed** (a
  focused quiz of just what you missed) or **Try again** on a perfect score.
- **Review answers** — every missed question shown exactly like the real quiz,
  with your pick, the correct answer and the explanation.
- **Export results** — a `results.json` with score, per-question breakdown and
  per-topic accuracy (weakest topic first).
- **Zolto-powered content** — questions, options and explanations are rendered
  with [Zolto](https://github.com/uxle/Zolto) (`npm i zolto`): math, fenced
  code, `@chart` charts, `@diagram` diagrams, tables, callouts and images on
  top of Markdown, sanitized before it reaches the page. Typographic weight
  follows content, so a table or quote never out-shouts the question itself.
- **Mobile-first, fluid and liquid** — the layout responds to the width of the
  *app*, not just the window (CSS container queries), with fluid type and
  spacing. Phones get a full-bleed screen with safe-area padding; tablets and
  desktops a centred card; landscape phones a two-column question/answers
  layout; ultra-narrow (watch-class) screens a compact stacked layout.
- **Honours text size** — density adapts to large system text without ever
  removing labels, hints or the tick/cross cues; only physically tiny screens
  drop secondary copy.
- **Touch and pointer aware** — 44 px targets on touch, hover effects only on
  devices that can hover, 16 px inputs so iOS never zooms, `dvh` for mobile
  browser bars.
- **Purposeful motion** — screen and question transitions, staggered options,
  spring pop on correct, count-up score, confetti for a perfect run. All of it
  disappears under `prefers-reduced-motion`.
- **Accessible** — WCAG AA contrast in light and dark, colour never the only
  cue (icons, words and a striped progress segment for misses), focusable scroll
  regions, live announcements, a radiogroup in the builder, RTL-aware options,
  `forced-colors` support, and a native confirm dialog before leaving a quiz.
- **Keyboard first** — `1`–`6` / `A`–`F` to answer, `Enter` to continue.
- **Dark / light mode** — toggle in the header, remembered; follows the system
  on first visit.

---

## 📁 File Structure

```text
.
├── index.html            # Entry point (4 stylesheets + deferred scripts, no CDN)
├── css/
│   ├── 1-variables.css    # Design tokens — light/dark palettes, motion, radii
│   ├── 2-base.css         # Reset, page layout, safe-area, persistent app shell
│   ├── 3-components.css   # Home, builder, quiz, results, review, Zolto content styles
│   └── 4-responsive.css   # Container queries: phone / narrow / large-text / watch; landscape
├── js/
│   ├── icons.js            # Inline SVG icon set + brand mark (no icon font / CDN)
│   ├── vendor/zolto.min.js # Zolto engine (bundled from npm `zolto`, no build step needed)
│   ├── zolto.js            # Adapter: renders Zolto source into question/option/rationale
│   ├── config.js           # Bundled sample quiz data (written in Zolto)
│   ├── state.js            # Score, skip, and per-response tracking
│   ├── theme.js             # Dark/light toggle logic
│   ├── uploader.js          # Reads + validates uploaded/dropped JSON
│   ├── progress.js          # Progress bar + fraction label
│   ├── question.js          # Question text rendering
│   ├── options.js           # Answer buttons + correct/wrong styling
│   ├── rationale.js         # Explanation card
│   ├── exporter.js          # Builds and downloads results.json
│   ├── home.js              # Home screen (primary action, dropzone, template link)
│   ├── builder.js           # "Make questions" quiz builder
│   ├── quizview.js          # Quiz screen markup
│   ├── results.js           # Results screen (ring, stats, topics, Practise missed)
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
   to build one, or tap **Try the example** to see the demo.

> Everything runs fully offline: icons are inline SVG, and the Zolto engine is
> bundled in `js/vendor/`. No CDN, no build step.

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

## ✍️ Writing questions in Zolto

`question`, every entry in `options`, and `rationale` are Zolto source (plain
text still works, since Zolto is a superset of Markdown):

```json
{
  "question": "What does this expression evaluate to?\n\n@math\n\\frac{1}{2} + \\frac{1}{4}\n@/math",
  "options": ["$\\frac{3}{4}$", "$\\frac{2}{6}$", "`compile(src)`", "$1$"],
  "correct": 0
}
```

Remember to escape backslashes and newlines in JSON (`\\` and `\n`). If you
update the bundled engine: `npm i zolto esbuild`, then bundle
`import { compile } from 'zolto'; window.Zolto = { compile };` as an IIFE
into `js/vendor/zolto.min.js`.

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
