# Quiz duplicate validator

Run the release gate from the repository root:

```bash
node Quizzes/validator/validate-quiz-bank.mjs
node Quizzes/validator/validate-quiz-bank.test.mjs
```

The validator checks question schema, unique IDs, current-bank duplicates, and exact or near matches to permanently retired prompts. Near matches use the higher of token and character-trigram Dice similarity with a default rejection threshold of `0.78`.

`VALIDATOR_AGENT.md` defines the independent semantic review that follows the automated gate. Before replacing an active set, move its outgoing prompts into `question-history.json` so later releases cannot reuse them. Prompts still active in the current bank must not be added to history.
