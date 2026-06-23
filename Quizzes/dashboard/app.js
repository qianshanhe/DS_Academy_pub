const quizzes = {
  daily: {
    title: "Daily Quiz",
    mode: "Daily Practice",
    heading: "Prediction, Causal Impact, and Evaluation",
    questions: [
      {
        id: "daily-q1",
        type: "Multiple Choice",
        skill: "Metric choice",
        prompt:
          "A churn model has 92% accuracy, but only 4% of users churn. Which evaluation move is most defensible?",
        choices: [
          "Report accuracy because it is already high.",
          "Inspect precision, recall, PR-AUC, and the confusion matrix at useful thresholds.",
          "Use R-squared because churn is a prediction problem.",
          "Switch directly to uplift modeling because churn is rare."
        ],
        answer: 1,
        explanation:
          "Accuracy can be high when the negative class dominates. Precision, recall, PR-AUC, and threshold-specific confusion matrices show whether the model actually finds churners at a usable intervention cost."
      },
      {
        id: "daily-q2",
        type: "Interactive Calculation",
        skill: "Confusion matrix math",
        prompt:
          "Build each metric formula by placing TP, FP, FN, and TN into the empty numerator and denominator slots. The dashboard will calculate the result from the formula you build.",
        formulaBuilder: true,
        chips: [
          { role: "TP", count: 80 },
          { role: "FP", count: 40 },
          { role: "FN", count: 20 },
          { role: "TN", count: 860 }
        ],
        formulas: [
          {
            id: "precision",
            label: "Precision",
            expectedNumerator: ["TP"],
            expectedDenominator: ["TP", "FP"]
          },
          {
            id: "recall",
            label: "Recall",
            expectedNumerator: ["TP"],
            expectedDenominator: ["TP", "FN"]
          },
          {
            id: "fpr",
            label: "False positive rate",
            expectedNumerator: ["FP"],
            expectedDenominator: ["FP", "TN"]
          }
        ],
        explanation:
          "Precision = 80 / (80 + 40) = 0.667. Recall = 80 / (80 + 20) = 0.800. False positive rate = 40 / (40 + 860) = 0.044."
      },
      {
        id: "daily-q3",
        type: "Diagnosis",
        skill: "Causal vs predictive framing",
        prompt:
          "A churn-risk model ranks customers by probability of leaving. Why does that not by itself tell you who should receive a retention offer?",
        choices: [
          "Because churn models cannot be evaluated offline.",
          "Because the business decision depends on incremental treatment effect, offer cost, and targeting constraints.",
          "Because all high-risk customers should receive the offer.",
          "Because classification models are always less useful than regression models."
        ],
        answer: 1,
        explanation:
          "Risk is not the same as treatment responsiveness. The decision needs incremental lift, cost, margin, and constraints; high-risk users may leave regardless or may stay without an offer."
      }
    ]
  },
  weekly: {
    title: "Weekly Review",
    mode: "Cumulative Review",
    heading: "Forecasting, Experimentation, Uplift, and Production Monitoring",
    questions: [
      {
        id: "weekly-q1",
        type: "Transfer",
        skill: "Problem framing",
        prompt:
          "A support team asks whether an AI answer assistant reduces repeat contacts. Which method best answers that question?",
        choices: [
          "Forecast next month's contact volume.",
          "Run a randomized experiment with repeat contacts as an outcome.",
          "Train a ranking model for suggested answers.",
          "Cluster users by support topic."
        ],
        answer: 1,
        explanation:
          "The question asks for causal impact. A randomized experiment estimates whether the assistant caused a change in repeat contacts."
      },
      {
        id: "weekly-q2",
        type: "Trade-Off",
        skill: "Experiment design",
        prompt:
          "When might a sequential test be preferable to a fixed-horizon A/B test, and what risk must you control?",
        freeResponse: true,
        keywords: ["monitor", "early", "alpha", "type i", "stopping"],
        explanation:
          "Sequential tests can support earlier decisions while monitoring results over time, but the design must control false positives from repeated looks and stopping rules."
      },
      {
        id: "weekly-q3",
        type: "Diagnosis",
        skill: "Production monitoring",
        prompt:
          "A deployed recommendation model has stable offline validation metrics but worse business outcomes. Which investigation is most complete?",
        choices: [
          "Only retrain the model with more rows.",
          "Check data drift, feature freshness, serving bugs, calibration, latency, user mix, and whether the business metric matches the offline objective.",
          "Ignore online outcomes because validation was stable.",
          "Lower the decision threshold until the business metric improves."
        ],
        answer: 1,
        explanation:
          "Deployment failures often come from data, serving, calibration, latency, population changes, or metric mismatch. More data or threshold changes may not fix the root cause."
      },
      {
        id: "weekly-q4",
        type: "Interview Articulation",
        skill: "General vs heuristic",
        prompt:
          "Explain the difference between forecasting demand and estimating product impact in two or three sentences.",
        freeResponse: true,
        keywords: ["forecast", "future", "causal", "impact", "random"],
        explanation:
          "Forecasting predicts future demand from patterns in data. Estimating product impact asks whether a change caused an outcome difference, typically requiring randomization or a credible causal design."
      }
    ]
  }
};

const storageKey = "ds-academy-quiz-attempts";
const state = {
  currentQuiz: "daily",
  submitted: false
};

const quizForm = document.querySelector("#quizForm");
const quizTitle = document.querySelector("#quizTitle");
const quizMeta = document.querySelector("#quizMeta");
const quizMode = document.querySelector("#quizMode");
const quizHeading = document.querySelector("#quizHeading");
const submitQuiz = document.querySelector("#submitQuiz");
const resetAttempt = document.querySelector("#resetAttempt");
const exportAttempts = document.querySelector("#exportAttempts");
const clearHistory = document.querySelector("#clearHistory");
const resultPanel = document.querySelector("#resultPanel");
const resultTitle = document.querySelector("#resultTitle");
const resultDetail = document.querySelector("#resultDetail");
const scoreValue = document.querySelector("#scoreValue");
const scoreSummary = document.querySelector("#scoreSummary");
const progressRing = document.querySelector(".progress-ring");
const weakAreas = document.querySelector("#weakAreas");
const historyList = document.querySelector("#historyList");

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

function getAttempts() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveAttempts(attempts) {
  localStorage.setItem(storageKey, JSON.stringify(attempts));
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function freeResponseScore(question, response) {
  const answer = normalize(response);
  if (!answer) return false;
  const hits = question.keywords.filter((keyword) => answer.includes(keyword));
  return hits.length >= Math.ceil(question.keywords.length * 0.45);
}

function renderFormulaBuilder(question) {
  return `
    <div class="formula-builder" data-formula-question="${question.id}">
      <div class="chip-bank" aria-label="Metric labels to place">
        ${question.chips
          .map(
            (chip) => `
              <button class="metric-chip" type="button" draggable="true" data-role="${chip.role}" data-count="${chip.count}" aria-pressed="false">
                <span>${chip.role}</span>
                <small>${chip.count}</small>
              </button>`
          )
          .join("")}
      </div>
      <div class="formula-list" aria-label="Metric formula slots">
        ${question.formulas.map((formula) => renderFormulaRow(formula)).join("")}
      </div>
    </div>`;
}

function renderFormulaRow(formula) {
  return `
    <div class="formula-row" data-formula-id="${formula.id}">
      <div class="formula-name">${formula.label}</div>
      <div class="fraction" aria-label="${formula.label} formula">
        <div class="fraction-numerator">
          ${renderFormulaSlot(formula.id, "numerator", 0, formula.expectedNumerator[0])}
        </div>
        <div class="fraction-bar"></div>
        <div class="fraction-denominator">
          ${formula.expectedDenominator
            .map((expectedRole, index) => `
              ${index > 0 ? '<span class="formula-plus">+</span>' : ""}
              ${renderFormulaSlot(formula.id, "denominator", index, expectedRole)}
            `)
            .join("")}
        </div>
      </div>
      <div class="formula-result">
        <span>Result</span>
        <strong data-formula-result="${formula.id}">--</strong>
      </div>
    </div>`;
}

function renderFormulaSlot(formulaId, part, index, expectedRole) {
  return `
    <button class="formula-slot" type="button" data-formula-id="${formulaId}" data-part="${part}" data-index="${index}" data-expected-role="${expectedRole}" aria-label="${formulaId} ${part} slot ${index + 1}">
      <span>Drop</span>
    </button>`;
}

function renderQuiz() {
  const quiz = quizzes[state.currentQuiz];
  state.submitted = false;
  quizTitle.textContent = quiz.title;
  quizMeta.textContent = `${quiz.questions.length} questions`;
  quizMode.textContent = quiz.mode;
  quizHeading.textContent = quiz.heading;
  resultPanel.hidden = true;
  submitQuiz.textContent = "Check Answers";
  scoreValue.textContent = "--";
  scoreSummary.textContent = "Submit your answers to score this attempt.";
  progressRing.style.setProperty("--score-angle", "0deg");

  quizForm.innerHTML = quiz.questions
    .map((question, index) => {
      const body = question.formulaBuilder
        ? renderFormulaBuilder(question)
        : question.freeResponse
          ? `<textarea name="${question.id}" aria-label="Answer for question ${index + 1}" placeholder="Type your answer here"></textarea>`
          : `<div class="choice-list">${question.choices
            .map(
              (choice, choiceIndex) => `
                <label class="choice">
                  <input type="radio" name="${question.id}" value="${choiceIndex}">
                  <span>${choice}</span>
                </label>`
            )
            .join("")}</div>`;

      return `
        <article class="question-card" data-question-id="${question.id}">
          <div class="question-topline">
            <span class="question-number">Question ${index + 1}</span>
            <span class="question-type">${question.type}</span>
          </div>
          <h3>${question.prompt}</h3>
          ${body}
          <div class="feedback" id="feedback-${question.id}"></div>
        </article>`;
    })
    .join("");

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.quiz === state.currentQuiz);
  });
  setupFormulaBuilders();
}

function setupFormulaBuilders() {
  document.querySelectorAll(".formula-builder").forEach((builder) => {
    let selectedRole = "";
    let selectedCount = "";

    builder.querySelectorAll(".metric-chip").forEach((chip) => {
      chip.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", chip.dataset.role);
        event.dataTransfer.setData("application/x-count", chip.dataset.count);
      });

      chip.addEventListener("click", () => {
        selectedRole = chip.dataset.role;
        selectedCount = chip.dataset.count;
        builder.querySelectorAll(".metric-chip").forEach((otherChip) => {
          otherChip.classList.toggle("is-selected", otherChip === chip);
          otherChip.setAttribute("aria-pressed", String(otherChip === chip));
        });
      });
    });

    builder.querySelectorAll(".formula-slot").forEach((slot) => {
      slot.addEventListener("dragover", (event) => {
        event.preventDefault();
        slot.classList.add("is-ready");
      });

      slot.addEventListener("dragleave", () => {
        slot.classList.remove("is-ready");
      });

      slot.addEventListener("drop", (event) => {
        event.preventDefault();
        placeFormulaRole(
          builder,
          slot,
          event.dataTransfer.getData("text/plain"),
          event.dataTransfer.getData("application/x-count")
        );
      });

      slot.addEventListener("click", () => {
        if (selectedRole) {
          placeFormulaRole(builder, slot, selectedRole, selectedCount);
          selectedRole = "";
          selectedCount = "";
          builder.querySelectorAll(".metric-chip").forEach((chip) => {
            chip.classList.remove("is-selected");
            chip.setAttribute("aria-pressed", "false");
          });
        }
      });
    });

    updateFormulaOutputs(builder);
  });
}

function placeFormulaRole(builder, slot, role, count) {
  if (!role) return;
  slot.dataset.role = role;
  slot.dataset.count = count;
  slot.classList.remove("is-ready");
  slot.innerHTML = `<span>${role}</span><small>${count}</small>`;
  updateFormulaOutputs(builder);
}

function getFormulaValues(row) {
  const numeratorSlots = [...row.querySelectorAll('.formula-slot[data-part="numerator"]')];
  const denominatorSlots = [...row.querySelectorAll('.formula-slot[data-part="denominator"]')];
  const hasAllValues = [...numeratorSlots, ...denominatorSlots].every((slot) => Number.isFinite(Number(slot.dataset.count)));
  const numerator = numeratorSlots.reduce((sum, slot) => sum + Number(slot.dataset.count || 0), 0);
  const denominator = denominatorSlots.reduce((sum, slot) => sum + Number(slot.dataset.count || 0), 0);
  return { hasAllValues, numerator, denominator };
}

function updateFormulaOutputs(builder) {
  builder.querySelectorAll(".formula-row").forEach((row) => {
    const values = getFormulaValues(row);
    const output = values.hasAllValues && values.denominator > 0
      ? (values.numerator / values.denominator).toFixed(3)
      : "--";
    builder.querySelector(`[data-formula-result="${row.dataset.formulaId}"]`).textContent = output;
  });
}

function formulaBuilderScore(question) {
  const builder = quizForm.querySelector(`[data-formula-question="${question.id}"]`);
  if (!builder) return false;
  return [...builder.querySelectorAll(".formula-slot")].every((slot) => slot.dataset.role === slot.dataset.expectedRole);
}

function gradeQuiz() {
  const quiz = quizzes[state.currentQuiz];
  const misses = [];
  let correct = 0;

  quiz.questions.forEach((question) => {
    let isCorrect = false;
    let response = "";

    if (question.formulaBuilder) {
      isCorrect = formulaBuilderScore(question);
    } else if (question.freeResponse) {
      const field = quizForm.elements[question.id];
      response = field.value;
      isCorrect = freeResponseScore(question, response);
    } else {
      const checked = quizForm.querySelector(`input[name="${question.id}"]:checked`);
      response = checked ? checked.value : "";
      isCorrect = Number(response) === question.answer;
    }

    if (isCorrect) correct += 1;
    if (!isCorrect) misses.push(question.skill);

    const feedback = document.querySelector(`#feedback-${question.id}`);
    feedback.className = `feedback is-visible ${isCorrect ? "is-correct" : "is-wrong"}`;
    feedback.innerHTML = `<strong>${isCorrect ? "Correct" : "Review this"}</strong>${question.explanation}`;
  });

  const attempt = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    quiz: state.currentQuiz,
    title: quiz.title,
    score: correct,
    total: quiz.questions.length,
    misses,
    createdAt: new Date().toISOString()
  };

  const attempts = [attempt, ...getAttempts()].slice(0, 50);
  saveAttempts(attempts);
  state.submitted = true;
  updateSummary(attempt);
  renderHistory();
}

function updateSummary(attempt) {
  const percent = Math.round((attempt.score / attempt.total) * 100);
  resultPanel.hidden = false;
  resultTitle.textContent = `${attempt.score}/${attempt.total} correct`;
  resultDetail.textContent =
    attempt.misses.length === 0
      ? "No weak areas flagged in this attempt."
      : `Review next: ${[...new Set(attempt.misses)].join(", ")}.`;
  scoreValue.textContent = `${percent}%`;
  scoreSummary.textContent = `${attempt.title}: ${attempt.score} of ${attempt.total} correct.`;
  progressRing.style.setProperty("--score-angle", `${Math.round(percent * 3.6)}deg`);
  updateWeakAreas(getAttempts());
}

function updateWeakAreas(attempts) {
  const counts = new Map();
  attempts.forEach((attempt) => {
    attempt.misses.forEach((skill) => counts.set(skill, (counts.get(skill) || 0) + 1));
  });

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  weakAreas.innerHTML = ranked.length
    ? ranked.map(([skill, count]) => `<span class="tag">${skill} (${count})</span>`).join("")
    : `<span class="empty-state">No attempts yet</span>`;
}

function renderHistory() {
  const attempts = getAttempts();
  updateWeakAreas(attempts);
  if (!attempts.length) {
    historyList.innerHTML = `<p class="empty-state">No attempts saved yet.</p>`;
    scoreValue.textContent = "--";
    scoreSummary.textContent = "Submit your answers to score this attempt.";
    progressRing.style.setProperty("--score-angle", "0deg");
    return;
  }

  historyList.innerHTML = attempts
    .map((attempt) => {
      const date = new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }).format(new Date(attempt.createdAt));
      return `
        <div class="history-item">
          <div>
            <strong>${attempt.title}</strong>
            <span>${date}${attempt.misses.length ? ` · Review ${[...new Set(attempt.misses)].join(", ")}` : ""}</span>
          </div>
          <span class="history-score">${attempt.score}/${attempt.total}</span>
        </div>`;
    })
    .join("");
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    state.currentQuiz = tab.dataset.quiz;
    renderQuiz();
  });
});

submitQuiz.addEventListener("click", gradeQuiz);

resetAttempt.addEventListener("click", () => {
  renderQuiz();
});

clearHistory.addEventListener("click", () => {
  saveAttempts([]);
  renderHistory();
  resultPanel.hidden = true;
});

exportAttempts.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(getAttempts(), null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ds-academy-quiz-attempts.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

renderQuiz();
renderHistory();
