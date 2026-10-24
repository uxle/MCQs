window.MCQ = window.MCQ || {};

// Questions, options and rationales are written in Zolto syntax.
window.MCQ.sampleQuizData = {
    "title": "Zolto Sample Quiz",
    "questions": [
        {
            "id": 1,
            "question": "How does Zolto relate to standard Markdown?",
            "options": [
                "It is a strict superset of Markdown",
                "It replaces Markdown with an incompatible syntax",
                "It only works as a Markdown linter",
                "It converts Markdown to PDF only"
            ],
            "correct": 0,
            "category": "Basics",
            "rationale": "Every valid `.md` file is also a valid `.zl` file, and Zolto adds math, diagrams, charts and more on top."
        },
        {
            "id": 2,
            "question": "Which command installs the Zolto CLI globally from npm?",
            "options": [
                "`npm install -g zolto`",
                "`npm install zolto --global-cli`",
                "`pip install zolto`",
                "`npx zolto install --global`"
            ],
            "correct": 0,
            "category": "Tooling",
            "rationale": "The CLI ships in the `zolto` npm package; after installing, `zolto init my-project` scaffolds a project."
        },
        {
            "id": 3,
            "question": "Which function turns Zolto source into HTML in a single call?",
            "options": [
                "`compile(src)`",
                "`toHTML(src)`",
                "`parseOnly(src)`",
                "`Zolto.run(src)`"
            ],
            "correct": 0,
            "category": "API",
            "rationale": "`compile(src)` parses and renders in one step. `parse` returns an AST and `render` turns that AST into HTML."
        },
        {
            "id": 4,
            "question": "In $E = mc^2$, what does $c$ represent?",
            "options": [
                "The speed of light in a vacuum",
                "The specific heat capacity",
                "The charge of an electron",
                "A constant of integration"
            ],
            "correct": 0,
            "category": "Math",
            "rationale": "Zolto renders inline math such as $E = mc^2$ natively. Here $c$ is the speed of light."
        },
        {
            "id": 5,
            "question": "What does this expression evaluate to?\n\n@math\n\\frac{1}{2} + \\frac{1}{4}\n@/math",
            "options": [
                "$\\frac{3}{4}$",
                "$\\frac{2}{6}$",
                "$\\frac{1}{6}$",
                "$1$"
            ],
            "correct": 0,
            "category": "Math",
            "rationale": "Use a common denominator: $\\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4}$."
        },
        {
            "id": 6,
            "question": "What does this snippet print?\n\n```js\nconst xs = [1, 2, 3];\nconsole.log(xs.map(x => x * 2).join('-'));\n```",
            "options": [
                "`2-4-6`",
                "`1-2-3`",
                "`2,4,6`",
                "`6`"
            ],
            "correct": 0,
            "category": "Code",
            "rationale": "`map` doubles each item to `[2, 4, 6]` and `join('-')` glues them with dashes."
        },
        {
            "id": 7,
            "question": "Which quarter had the highest revenue?\n\n@chart bar title=\"Revenue by quarter\"\nlabels:\n  Q1\n  Q2\n  Q3\n  Q4\n\ndata:\n  10\n  25\n  18\n  30\n@/chart",
            "options": [
                "Q1",
                "Q2",
                "Q3",
                "Q4"
            ],
            "correct": 3,
            "category": "Charts",
            "rationale": "Q4 has the tallest bar at 30, ahead of Q2 at 25."
        },
        {
            "id": 8,
            "question": "In this sequence diagram, who sends the first message?\n\n@diagram sequence title=\"Login\"\nactor User\nactor Server\n\nUser -> Server: POST /login\nServer -> User: Token\n@/diagram",
            "options": [
                "The User",
                "The Server",
                "Both at the same time",
                "Neither, the diagram is empty"
            ],
            "correct": 0,
            "category": "Diagrams",
            "rationale": "The first arrow, `POST /login`, goes from User to Server."
        },
        {
            "id": 9,
            "question": "Inside an `@mcq` block, which directive marks the correct answer?",
            "options": [
                "`@correct`",
                "`@right`",
                "`@answer`",
                "`@key`"
            ],
            "correct": 0,
            "category": "Quizzes",
            "rationale": "Wrong options use `@choice`; the right one uses `@correct`."
        },
        {
            "id": 10,
            "question": "How many external runtime dependencies does Zolto have?",
            "options": [
                "Zero",
                "One (a math library)",
                "Three",
                "More than ten"
            ],
            "correct": 0,
            "category": "Basics",
            "rationale": "Math, diagrams, charts and vector graphics are all built in, so it has zero dependencies."
        }
    ]
};
