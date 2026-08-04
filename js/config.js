export const defaultQuizData = {
    title: "UX Principles Sample Quiz",
    questions: [
        {
            id: 1,
            question: "Which iOS interaction pattern best prevents accidental deletion of user data?",
            options: [
                "A generic alert asking 'Are you sure?'",
                "A destructive Action Sheet with explicit red confirmation text",
                "Deleting immediately and showing a quick banner notification",
                "Disabling deletion completely on mobile views"
            ],
            correct: 1,
            rationale: "Nielsen's 'Error Prevention' heuristic recommends distinct, high-significance visual confirmation controls."
        },
        {
            id: 2,
            question: "According to Fitts's Law, why are mobile tab bars positioned at the bottom?",
            options: [
                "They reduce screen contrast strain",
                "The screen bottom acts as an infinite boundary within thumb reach",
                "It leaves more space for large typography titles",
                "It enforces Miller's Law chunking constraints"
            ],
            correct: 1,
            rationale: "Placing interactive controls at the bottom screen edge minimizes thumb travel distance."
        }
    ]
};
