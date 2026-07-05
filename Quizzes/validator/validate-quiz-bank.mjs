import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const validatorDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(validatorDirectory, "../..");
const defaultBankPath = path.join(projectRoot, "Quizzes/dashboard/app.js");
const defaultHistoryPath = path.join(validatorDirectory, "question-history.json");
const defaultThreshold = 0.78;

function normalize(text) {
  return text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ngrams(text, size) {
  const compact = ` ${normalize(text)} `;
  const grams = new Set();
  for (let index = 0; index <= compact.length - size; index += 1) {
    grams.add(compact.slice(index, index + size));
  }
  return grams;
}

const stopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "for", "from", "how", "in", "into",
  "is", "it", "might", "of", "on", "or", "should", "that", "the", "this", "to", "what", "when",
  "which", "why", "with", "would"
]);

function stem(token) {
  let value = token;
  if (value.length > 5 && value.endsWith("ing")) {
    value = value.slice(0, -3);
    if (value.length > 2 && value.at(-1) === value.at(-2)) value = value.slice(0, -1);
  } else if (value.length > 4 && value.endsWith("ied")) {
    value = `${value.slice(0, -3)}y`;
  } else if (value.length > 4 && value.endsWith("ed")) {
    value = value.slice(0, -2);
  }
  if (value.length > 4 && value.endsWith("ly")) value = value.slice(0, -2);
  if (value.length > 4 && value.endsWith("s") && !value.endsWith("ss")) value = value.slice(0, -1);
  return value;
}

function tokens(text) {
  return new Set(
    normalize(text)
      .split(" ")
      .filter((token) => token && !stopWords.has(token))
      .map(stem)
  );
}

function diceCoefficient(left, right) {
  if (!left.size && !right.size) return 1;
  let overlap = 0;
  left.forEach((value) => {
    if (right.has(value)) overlap += 1;
  });
  return (2 * overlap) / (left.size + right.size);
}

export function lexicalSimilarity(left, right) {
  return Math.max(
    diceCoefficient(tokens(left), tokens(right)),
    diceCoefficient(ngrams(left, 3), ngrams(right, 3))
  );
}

export function loadQuizBank(bankPath = defaultBankPath) {
  const source = fs.readFileSync(bankPath, "utf8");
  const start = source.indexOf("const quizBank =");
  const end = source.indexOf("const millisecondsPerDay");
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`Could not isolate quizBank in ${bankPath}`);
  }

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source.slice(start, end)}\nglobalThis.__quizBank = quizBank;`, sandbox, {
    filename: bankPath
  });
  return sandbox.__quizBank;
}

export function flattenQuestions(bank) {
  const questions = [];
  for (const type of ["daily", "weekly"]) {
    if (!Array.isArray(bank[type])) {
      throw new Error(`quizBank.${type} must be an array`);
    }
    bank[type].forEach((set) => {
      if (!set.id || !Array.isArray(set.questions)) {
        throw new Error(`Every ${type} set needs an id and questions array`);
      }
      set.questions.forEach((question) => {
        questions.push({ ...question, setId: set.id, quizType: type });
      });
    });
  }
  return questions;
}

function validateSchema(questions) {
  const errors = [];
  const ids = new Set();
  questions.forEach((question) => {
    const label = question.id || "<missing id>";
    if (!question.id || !question.prompt || !question.skill || !question.type) {
      errors.push(`${label}: id, prompt, skill, and type are required`);
    }
    if (ids.has(question.id)) errors.push(`${label}: duplicate question id`);
    ids.add(question.id);

    if (question.freeResponse && !question.keywords?.length) {
      errors.push(`${label}: free-response questions require keywords`);
    }
    if (!question.freeResponse && !question.formulaBuilder) {
      if (!Array.isArray(question.choices) || question.choices.length < 2) {
        errors.push(`${label}: multiple-choice questions require at least two choices`);
      } else if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.choices.length) {
        errors.push(`${label}: answer index is outside the choices array`);
      }
    }
  });
  return errors;
}

function duplicateMessage(kind, current, candidate, score) {
  const currentLabel = `${current.quizType}/${current.setId}/${current.id}`;
  const candidateLabel = candidate.id || candidate.source || "historical question";
  return `${kind}: ${currentLabel} matches ${candidateLabel} (${score.toFixed(3)})\n` +
    `  current: ${current.prompt}\n  compared: ${candidate.prompt}`;
}

export function validateQuestions(questions, history, threshold = defaultThreshold) {
  const errors = validateSchema(questions);

  for (let leftIndex = 0; leftIndex < questions.length; leftIndex += 1) {
    const left = questions[leftIndex];
    for (let rightIndex = leftIndex + 1; rightIndex < questions.length; rightIndex += 1) {
      const right = questions[rightIndex];
      const exact = normalize(left.prompt) === normalize(right.prompt);
      const score = lexicalSimilarity(left.prompt, right.prompt);
      if (exact || score >= threshold) {
        errors.push(duplicateMessage(exact ? "Exact current duplicate" : "Near current duplicate", left, right, score));
      }
    }

    history.forEach((historical) => {
      const exact = normalize(left.prompt) === normalize(historical.prompt);
      const score = lexicalSimilarity(left.prompt, historical.prompt);
      if (exact || score >= threshold) {
        errors.push(duplicateMessage(exact ? "Retired question reused" : "Near match to retired question", left, historical, score));
      }
    });
  }
  return errors;
}

function parseArguments(argv) {
  const options = { bankPath: defaultBankPath, historyPath: defaultHistoryPath, threshold: defaultThreshold };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--bank") options.bankPath = path.resolve(argv[++index]);
    else if (argv[index] === "--history") options.historyPath = path.resolve(argv[++index]);
    else if (argv[index] === "--threshold") options.threshold = Number(argv[++index]);
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  if (!Number.isFinite(options.threshold) || options.threshold <= 0 || options.threshold > 1) {
    throw new Error("--threshold must be greater than 0 and no greater than 1");
  }
  return options;
}

export function runValidation(options) {
  const bank = loadQuizBank(options.bankPath);
  const questions = flattenQuestions(bank);
  const history = JSON.parse(fs.readFileSync(options.historyPath, "utf8"));
  const errors = validateQuestions(questions, history, options.threshold);
  return { errors, questionCount: questions.length, historyCount: history.length };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const result = runValidation(parseArguments(process.argv.slice(2)));
    if (result.errors.length) {
      console.error(`Quiz validation failed with ${result.errors.length} problem(s):\n`);
      result.errors.forEach((error) => console.error(`${error}\n`));
      process.exitCode = 1;
    } else {
      console.log(`Quiz validation passed: ${result.questionCount} current questions checked against ${result.historyCount} retired prompts.`);
    }
  } catch (error) {
    console.error(`Quiz validation could not run: ${error.message}`);
    process.exitCode = 1;
  }
}
