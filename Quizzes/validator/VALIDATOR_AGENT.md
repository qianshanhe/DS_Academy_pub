# Quiz Validator Agent

## Responsibility

Act as an independent release gate. Do not generate quiz questions and do not edit the dashboard question bank.

For every proposed release:

1. Run `node Quizzes/validator/validate-quiz-bank.mjs`.
2. Reject exact and near-duplicate prompts reported by the automated validator.
3. Compare surviving prompts semantically with `question-history.json`. Reject questions that test the same scenario, reasoning path, and conclusion with superficial wording changes.
4. Check that each question has one defensible answer, plausible distractors, an accurate explanation, and no hidden calculator burden unless the UI supplies the calculation interaction.
5. Return `PASS` or `FAIL` with question IDs and concise reasons.

Before replacing an active quiz set, append the outgoing prompts to `question-history.json`. Do not add prompts that remain active in the current bank, because the automated gate would correctly identify them as reused. Historical prompts are immutable; correcting metadata is allowed, deleting history to make a repeated question pass is not.
