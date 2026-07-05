import assert from "node:assert/strict";
import { lexicalSimilarity, validateQuestions } from "./validate-quiz-bank.mjs";

const baseQuestion = {
  id: "new-q1",
  setId: "test-set",
  quizType: "daily",
  type: "Multiple Choice",
  skill: "Testing",
  prompt: "Which metric should a capacity-limited review team evaluate?",
  choices: ["A", "B"],
  answer: 0
};

const history = [{
  id: "retired-q1",
  prompt: "Which metric should a capacity limited review team evaluate?"
}];

const duplicateErrors = validateQuestions([baseQuestion], history);
assert.equal(duplicateErrors.length, 1, "normalized historical duplicate must be rejected");

const nearScore = lexicalSimilarity(
  "Why can a random row split leak future information in a forecast?",
  "Why might randomly splitting rows leak future information into forecasting?"
);
assert.ok(nearScore >= 0.78, `near duplicate score was only ${nearScore}`);

const cleanQuestion = {
  ...baseQuestion,
  id: "new-q2",
  prompt: "A queue can process ten cases hourly. Which policy maximizes expected net value?"
};
assert.deepEqual(validateQuestions([cleanQuestion], history), []);

console.log("Validator self-test passed: exact, near-duplicate, and clean cases behave correctly.");
