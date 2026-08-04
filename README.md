# MCQ

A lightweight, modular, and minimalist Multiple Choice Question (MCQ) engine designed with Apple-inspired aesthetics. Built with vanilla HTML, CSS, and JavaScript, it allows users to practice design principles, heuristics, and accessibility standards with real-time animated feedback.

---

## ✨ Features

- **Apple Aesthetic Design:** Clean frosted glass UI, smooth spring animations, SF Pro typography, and high visual contrast.
- **Custom JSON Upload:** Drag and drop or select any `.json` file to load custom quiz sets locally via the HTML5 `FileReader` API (no backend server required).
- **Interactive Visual Feedback:**
  - 🟢 **Correct Answer:** Soft green glow with a spring bounce animation (`✓`).
  - 🔴 **Incorrect Answer:** Crimson highlight with a subtle horizontal shake animation (`✕`).
- **UX Principle Rationale:** Displays instant contextual explanations for each question upon selection.
- **Detailed Results Breakdown:** Final screen provides a clean matrix displaying **Right Answers**, **Wrong Answers**, and **Accuracy Percentage**.

---

## 📁 File Structure

```text
.
├── index.html     # HTML entry point / wrapper shell
├── style.css      # CSS styles, Apple glassmorphism, & keyframe animations
├── mcq.js         # Core Engine class, UI rendering, & JSON upload logic
├── sample.json    # Sample quiz dataset
└── README.md      # Project documentation
```


🚀 Getting Started
 * Clone or Download the project files to a folder on your machine.
 * Open index.html in any modern web browser (Double-click to open via file:// or run via a local server).
 * Use the 📂 Upload JSON button in the top-right corner to load sample.json or your own custom quiz files.
📝 Custom JSON Schema
To create custom quizzes, structure your JSON files following this format:

```json
{
  "title": "My Custom UI/UX Quiz",
  "questions": [
    {
      "id": 1,
      "question": "What is the primary benefit of Progressive Disclosure?",
      "options": [
        "Increases visual clutter",
        "Reduces cognitive load by showing information as needed",
        "Improves server load time",
        "Disables animations for low-end devices"
      ],
      "correct": 1,
      "rationale": "Progressive disclosure helps manage information complexity by presenting only essential controls initially."
    }
  ]
}
```


 * correct: Zero-based index of the correct answer inside the options array (0 = Option A, 1 = Option B, etc.).
 * rationale: Explanation displayed when the user picks an answer.
📄 License
This project is open source and available under the MIT License.

---

