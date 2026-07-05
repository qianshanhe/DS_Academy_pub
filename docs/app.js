const quizBank = {
  daily: [
    {
      id: "decision-metrics",
      title: "Daily Quiz",
      mode: "Daily Practice",
      heading: "Capacity-Constrained Decisions and Error Analysis",
      questions: [
        {
          id: "decision-metrics-q1",
          type: "Trade-Off",
          skill: "Capacity-aware evaluation",
          prompt: "A fraud team can investigate only 200 of 50,000 transactions each day. Which evaluation best matches that operating constraint?",
          choices: [
            "Overall accuracy at a threshold of 0.5.",
            "Precision and captured fraud value among the top 200 alerts, with investigation cost included.",
            "R-squared on the binary fraud label.",
            "Training loss from the final optimization epoch."
          ],
          answer: 1,
          explanation: "The decision is a ranked, capacity-limited policy. Evaluate the alerts the team can actually investigate and translate correct and incorrect alerts into captured value and operating cost."
        },
        {
          id: "decision-metrics-q2",
          type: "Interactive Calculation",
          skill: "Confusion matrix math",
          prompt: "Construct the formulas for specificity, negative predictive value, and miss rate by placing the four outcome labels into their correct slots.",
          formulaBuilder: true,
          chips: [
            { role: "TP", count: 45 },
            { role: "FP", count: 15 },
            { role: "FN", count: 30 },
            { role: "TN", count: 910 }
          ],
          formulas: [
            {
              id: "specificity",
              label: "Specificity",
              expectedNumerator: ["TN"],
              expectedDenominator: ["TN", "FP"]
            },
            {
              id: "npv",
              label: "Negative predictive value",
              expectedNumerator: ["TN"],
              expectedDenominator: ["TN", "FN"]
            },
            {
              id: "miss-rate",
              label: "Miss rate",
              expectedNumerator: ["FN"],
              expectedDenominator: ["FN", "TP"]
            }
          ],
          explanation: "Specificity = 910 / (910 + 15) = 0.984. Negative predictive value = 910 / (910 + 30) = 0.968. Miss rate = 30 / (30 + 45) = 0.400."
        },
        {
          id: "decision-metrics-q3",
          type: "Diagnosis",
          skill: "Policy evaluation",
          prompt: "A new lead-scoring model improves PR-AUC, yet profit falls after deployment. Which investigation is most defensible?",
          choices: [
            "Assume the deployment result is noise because PR-AUC improved.",
            "Audit the chosen threshold, score calibration, contact capacity, treatment cost, and value assigned to each outcome.",
            "Increase model depth without changing the decision rule.",
            "Replace PR-AUC with training accuracy."
          ],
          answer: 1,
          explanation: "A ranking improvement does not guarantee a better operating policy. Deployment value depends on calibration, threshold selection, capacity, intervention effects, and the economics of each decision outcome."
        }
      ]
    },
    {
      id: "experimentation",
      title: "Daily Quiz",
      mode: "Daily Practice",
      heading: "Experiment Design and Decision Quality",
      questions: [
        {
          id: "experimentation-q1",
          type: "Diagnosis",
          skill: "Randomization unit",
          prompt: "A messaging feature lets users invite friends. Why might randomizing individual users bias the estimated effect?",
          choices: [
            "Individual randomization always produces smaller samples.",
            "Treatment can spill over to control users through invitations, violating independence.",
            "The outcome must be normally distributed.",
            "Randomization cannot estimate product effects."
          ],
          answer: 1,
          explanation: "Invitations create interference: treated users can change control users' outcomes. Cluster or network-aware randomization may better match the treatment's exposure mechanism."
        },
        {
          id: "experimentation-q2",
          type: "Multiple Choice",
          skill: "Sample ratio mismatch",
          prompt: "A 50/50 experiment enrolls 60% of eligible users in treatment and 40% in control. What should you do first?",
          choices: [
            "Declare treatment successful because it has more users.",
            "Investigate assignment, eligibility, logging, and exposure before interpreting outcomes.",
            "Reweight the groups and ignore the mismatch.",
            "Wait until both groups have the same conversion rate."
          ],
          answer: 1,
          explanation: "A sample ratio mismatch can signal broken randomization or data loss. Outcome estimates are not trustworthy until the assignment and logging pipeline are validated."
        },
        {
          id: "experimentation-q3",
          type: "Trade-Off",
          skill: "Guardrail metrics",
          prompt: "A checkout redesign raises conversion but also increases refund requests. Which decision is most defensible?",
          choices: [
            "Ship because conversion is the primary metric.",
            "Reject because every guardrail movement invalidates a test.",
            "Quantify net value and uncertainty, then apply the predeclared refund guardrail or decision rule.",
            "Choose whichever metric has the smaller p-value."
          ],
          answer: 2,
          explanation: "A primary metric cannot be interpreted in isolation. Translate both movements into business and customer impact, respect predeclared guardrails, and account for uncertainty."
        }
      ]
    },
    {
      id: "forecasting",
      title: "Daily Quiz",
      mode: "Daily Practice",
      heading: "Forecasting, Leakage, and Uncertainty",
      questions: [
        {
          id: "forecasting-q1",
          type: "Diagnosis",
          skill: "Temporal leakage",
          prompt: "A demand forecast performs extremely well offline because it uses the final weekly inventory adjustment. What is the central concern?",
          choices: [
            "Inventory is categorical.",
            "The feature may contain information unavailable at forecast time.",
            "Weekly data cannot be forecast.",
            "The model needs a deeper neural network."
          ],
          answer: 1,
          explanation: "Features must be available at the prediction timestamp. A final adjustment can encode future information and make offline performance unrealistically optimistic."
        },
        {
          id: "forecasting-q2",
          type: "Transfer",
          skill: "Prediction intervals",
          prompt: "Operations needs to staff for unusually busy days, not merely average demand. Which output is most useful?",
          choices: [
            "Only a point forecast.",
            "A calibrated upper prediction quantile or interval.",
            "Training accuracy.",
            "The largest historical value."
          ],
          answer: 1,
          explanation: "Staffing against tail risk requires uncertainty, such as a calibrated upper quantile. A point forecast hides the range of plausible demand."
        },
        {
          id: "forecasting-q3",
          type: "Trade-Off",
          skill: "Forecast evaluation",
          prompt: "A model has lower MAE overall but systematically underpredicts holiday demand. What is the best conclusion?",
          choices: [
            "Lower aggregate MAE proves it is operationally superior.",
            "Holiday performance and asymmetric underforecast costs must be evaluated separately.",
            "Remove holidays from the test set.",
            "Replace MAE with model accuracy."
          ],
          answer: 1,
          explanation: "Aggregate error can conceal costly segments. Evaluation should reflect calendar slices and the asymmetric business cost of under- versus overforecasting."
        }
      ]
    },
    {
      id: "data-quality",
      title: "Daily Quiz",
      mode: "Daily Practice",
      heading: "SQL, Data Quality, and Analytical Validity",
      questions: [
        {
          id: "data-quality-q1",
          type: "Diagnosis",
          skill: "Join fanout",
          prompt: "After joining orders to order_items, total revenue doubles. What should you inspect first?",
          choices: [
            "Whether revenue should be rounded.",
            "The join cardinality and the grain of each table before aggregation.",
            "Whether the database supports indexes.",
            "The color palette of the dashboard."
          ],
          answer: 1,
          explanation: "A one-to-many join can duplicate order-level revenue. State each table's grain, validate key uniqueness, and aggregate at the intended unit."
        },
        {
          id: "data-quality-q2",
          type: "Multiple Choice",
          skill: "Window functions",
          prompt: "You need each customer's most recent purchase while retaining other columns from that row. Which pattern is strongest?",
          choices: [
            "GROUP BY customer_id and select arbitrary columns.",
            "ROW_NUMBER() over each customer ordered by purchase time descending, then keep row 1.",
            "Use DISTINCT on every column.",
            "Cross join customers and purchases."
          ],
          answer: 1,
          explanation: "A window function ranks complete rows within each customer and makes the tie-breaking rule explicit. A bare group-by cannot reliably retain aligned row values."
        },
        {
          id: "data-quality-q3",
          type: "Trade-Off",
          skill: "Missing data",
          prompt: "A feature is missing more often for users on an older app version. Why is median imputation alone insufficient?",
          choices: [
            "Median imputation is mathematically impossible.",
            "Missingness is informative and may represent a product or logging process tied to outcomes.",
            "All missing values must be deleted.",
            "Only categorical features can be imputed."
          ],
          answer: 1,
          explanation: "The missingness mechanism is not random. Preserve or model a missingness indicator, inspect version-specific pipelines, and test whether deployment reproduces the same pattern."
        }
      ]
    },
    {
      id: "uplift",
      title: "Daily Quiz",
      mode: "Daily Practice",
      heading: "Uplift Modeling and Treatment Policy",
      questions: [
        {
          id: "uplift-q1",
          type: "Transfer",
          skill: "Treatment effect",
          prompt: "Which customer is usually most valuable to target with a retention offer?",
          choices: [
            "The customer with the highest churn risk regardless of response.",
            "The customer whose probability of staying increases enough because of the offer to justify its cost.",
            "Every customer with an account.",
            "The customer with the longest tenure."
          ],
          answer: 1,
          explanation: "Targeting should depend on incremental treatment effect and economics, not untreated risk alone. Some high-risk customers will leave regardless of the offer."
        },
        {
          id: "uplift-q2",
          type: "Diagnosis",
          skill: "Uplift validation",
          prompt: "Why is ordinary classification AUC insufficient for evaluating an uplift model?",
          choices: [
            "AUC cannot be computed on binary outcomes.",
            "It evaluates outcome ranking, not whether treatment changes outcomes relative to control.",
            "Uplift models never use probabilities.",
            "AUC requires more than one million rows."
          ],
          answer: 1,
          explanation: "Uplift is about heterogeneous causal effect. Evaluation needs randomized treatment/control data and policy or uplift metrics such as gain or Qini curves."
        },
        {
          id: "uplift-q3",
          type: "Trade-Off",
          skill: "Treatment policy",
          prompt: "A customer has positive estimated uplift, but the expected incremental margin is smaller than the offer cost. What should the policy do?",
          choices: [
            "Treat because uplift is positive.",
            "Do not treat under a profit-maximizing policy.",
            "Treat only if churn risk exceeds 50%.",
            "Ignore costs during model deployment."
          ],
          answer: 1,
          explanation: "Positive causal effect is not automatically positive economic value. The deployment rule should compare expected incremental benefit with treatment cost and constraints."
        }
      ]
    },
    {
      id: "monitoring",
      title: "Daily Quiz",
      mode: "Daily Practice",
      heading: "Production Monitoring and Model Reliability",
      questions: [
        {
          id: "monitoring-q1",
          type: "Diagnosis",
          skill: "Feature freshness",
          prompt: "A model's scores suddenly become less variable while request volume stays stable. Which check is most urgent?",
          choices: [
            "Increase the learning rate.",
            "Check feature freshness, default values, and serving-time data pipelines.",
            "Add more classes to the model.",
            "Change the dashboard font."
          ],
          answer: 1,
          explanation: "Compressed scores often indicate stale or defaulted features. Validate online feature distributions and timestamps before assuming the model itself degraded."
        },
        {
          id: "monitoring-q2",
          type: "Transfer",
          skill: "Calibration",
          prompt: "Among users assigned a predicted risk near 0.70, only 0.35 experience the event. What has degraded?",
          choices: [
            "Calibration.",
            "Database normalization.",
            "Randomization balance.",
            "SQL syntax."
          ],
          answer: 0,
          explanation: "Calibration compares predicted probabilities with observed frequencies. Ranking could remain useful even while the probability scale becomes unreliable."
        },
        {
          id: "monitoring-q3",
          type: "Trade-Off",
          skill: "Latency guardrails",
          prompt: "A larger model improves offline ranking slightly but adds 400 ms to a real-time recommendation call. What is the right evaluation?",
          choices: [
            "Deploy because offline quality improved.",
            "Measure end-to-end online value, latency-related abandonment, reliability, and infrastructure cost.",
            "Ignore latency because it is not a model metric.",
            "Choose the model with more parameters."
          ],
          answer: 1,
          explanation: "The model operates inside a product system. Small offline gains may be outweighed by user abandonment, timeouts, cost, or reduced serving reliability."
        }
      ]
    },
    {
      id: "causal-observational",
      title: "Daily Quiz",
      mode: "Daily Practice",
      heading: "Observational Causal Inference",
      questions: [
        {
          id: "causal-observational-q1",
          type: "Diagnosis",
          skill: "Difference-in-differences",
          prompt: "What is the key identifying assumption behind a basic difference-in-differences estimate?",
          choices: [
            "Treatment and control must have identical outcome levels.",
            "Without treatment, their outcome trends would have evolved in parallel.",
            "Every observation must receive treatment eventually.",
            "The outcome must be normally distributed."
          ],
          answer: 1,
          explanation: "Difference-in-differences allows baseline level differences, but it relies on a credible counterfactual trend. Pre-trends and domain knowledge help assess that assumption."
        },
        {
          id: "causal-observational-q2",
          type: "Trade-Off",
          skill: "Propensity scores",
          prompt: "After propensity-score matching, one important covariate remains badly imbalanced. What is the strongest response?",
          choices: [
            "Proceed because matching guarantees causality.",
            "Revise the design or model, restrict overlap, and report residual imbalance and sensitivity.",
            "Delete the covariate from the balance table.",
            "Use a larger p-value threshold."
          ],
          answer: 1,
          explanation: "Matching does not automatically remove confounding. Poor balance or overlap indicates the design still lacks comparable treated and control units."
        },
        {
          id: "causal-observational-q3",
          type: "Multiple Choice",
          skill: "Post-treatment bias",
          prompt: "Why can controlling for a variable caused by the treatment bias a causal estimate?",
          choices: [
            "It can block part of the treatment effect or open a spurious path.",
            "It always increases sample size.",
            "It converts continuous outcomes to binary outcomes.",
            "It prevents use of confidence intervals."
          ],
          answer: 0,
          explanation: "A post-treatment control may be a mediator or collider. Covariate selection should follow the causal structure and the effect being estimated."
        }
      ]
    },
    {
      id: "ranking",
      title: "Daily Quiz",
      mode: "Daily Practice",
      heading: "Ranking Systems and Recommendation Trade-Offs",
      questions: [
        {
          id: "ranking-q1",
          type: "Transfer",
          skill: "Ranking metrics",
          prompt: "Why is NDCG often more informative than plain accuracy for a recommendation list?",
          choices: [
            "It rewards placing relevant items higher and can account for graded relevance.",
            "It measures model training speed.",
            "It proves recommendations cause engagement.",
            "It eliminates position bias from logged data."
          ],
          answer: 0,
          explanation: "NDCG reflects order and graded relevance, which matter in ranked interfaces. It remains an offline metric and does not establish causal product impact."
        },
        {
          id: "ranking-q2",
          type: "Diagnosis",
          skill: "Feedback loops",
          prompt: "A recommender trains only on clicks from items it previously displayed. What risk follows?",
          choices: [
            "The model observes unbiased preferences for every item.",
            "Exposure and position bias can reinforce existing recommendations and hide alternatives.",
            "The model becomes a forecasting model.",
            "Clicks no longer need timestamps."
          ],
          answer: 1,
          explanation: "Logged clicks depend on what the system exposed and where it ranked it. Exploration, propensity-aware evaluation, or experiments are needed to learn beyond the current policy."
        },
        {
          id: "ranking-q3",
          type: "Trade-Off",
          skill: "Exploration",
          prompt: "Why deliberately show some uncertain recommendations?",
          choices: [
            "To guarantee every user clicks.",
            "To collect information that can improve future decisions while controlling short-term cost.",
            "To avoid measuring outcomes.",
            "To make offline metrics deterministic."
          ],
          answer: 1,
          explanation: "Exploration trades some immediate reward for information about less-observed actions. The policy should bound user and business risk while learning."
        }
      ]
    }
  ],
  weekly: [
    {
      id: "causal-operations-review",
      title: "Weekly Review",
      mode: "Cumulative Review",
      heading: "Estimands, Explanations, and Operational Decisions",
      questions: [
        {
          id: "causal-operations-review-q1",
          type: "Transfer",
          skill: "Causal estimands",
          prompt: "In a randomized trial, 20% of users assigned to a coaching program never start it. Which effect does comparing outcomes by original assignment estimate?",
          choices: [
            "The intention-to-treat effect of offering access to the program.",
            "The effect among compliers without additional assumptions.",
            "The correlation between attendance and outcomes.",
            "The model's out-of-sample prediction error."
          ],
          answer: 0,
          explanation: "Analyzing users by randomized assignment preserves exchangeability and estimates the effect of offering the program. Estimating a complier effect requires additional assumptions and methods."
        },
        {
          id: "causal-operations-review-q2",
          type: "Diagnosis",
          skill: "Causal interpretation",
          prompt: "A SHAP analysis identifies account age as the strongest contributor to a credit-risk prediction. What conclusion is not justified?",
          choices: [
            "Account age influenced the model's predictions in the analyzed data.",
            "Changing account age would necessarily cause the predicted risk outcome to change in the real world.",
            "The model may rely heavily on account age.",
            "The attribution should be checked across relevant customer segments."
          ],
          answer: 1,
          explanation: "Feature attribution explains model behavior under its data and assumptions; it does not identify the causal effect of intervening on a feature."
        },
        {
          id: "causal-operations-review-q3",
          type: "Trade-Off",
          skill: "Decision analysis",
          prompt: "A medical triage model reduces average waiting time but increases the longest waits for urgent cases. How should the deployment decision be framed?",
          choices: [
            "Use average waiting time as the only criterion.",
            "Evaluate severity-specific tail outcomes, uncertainty, safety constraints, and the cost of delayed urgent care.",
            "Deploy because at least one aggregate metric improved.",
            "Choose the result with the smallest p-value."
          ],
          answer: 1,
          explanation: "Aggregate improvement can conceal unacceptable harm. The decision needs subgroup and tail-risk analysis, explicit safety guardrails, and clinically meaningful costs."
        },
        {
          id: "causal-operations-review-q4",
          type: "Interview Articulation",
          skill: "Counterfactual reasoning",
          prompt: "In two or three sentences, distinguish predicting an observed outcome from defining the counterfactual needed for a policy decision.",
          freeResponse: true,
          keywords: ["predict", "counterfactual", "treatment", "without", "causal"],
          explanation: "Prediction estimates an outcome from observed features under the data-generating process. A policy decision requires a counterfactual comparison between outcomes under alternative actions for the same target population, which is a causal estimand."
        }
      ]
    },
    {
      id: "metrics-causal-review",
      title: "Weekly Review",
      mode: "Cumulative Review",
      heading: "Metrics, Experiments, and Causal Decisions",
      questions: [
        {
          id: "metrics-causal-review-q1",
          type: "Transfer",
          skill: "Decision thresholds",
          prompt: "Two churn models have similar PR-AUC. What additional evidence determines which one should drive outreach?",
          choices: [
            "Only the number of model parameters.",
            "Expected value at feasible thresholds, calibration, capacity, and intervention costs.",
            "Whichever model has higher accuracy at threshold 0.5.",
            "The model trained most recently."
          ],
          answer: 1,
          explanation: "Model selection should reflect the actual decision policy. Threshold-level economics, calibration, and operational capacity can distinguish models with similar aggregate ranking quality."
        },
        {
          id: "metrics-causal-review-q2",
          type: "Diagnosis",
          skill: "Experiment validity",
          prompt: "An experiment shows a large effect, but treatment assignment depends on device type and device type predicts the outcome. What is the main problem?",
          choices: [
            "The sample is necessarily too large.",
            "Assignment is confounded, so the observed difference may not be caused by treatment.",
            "The outcome should be converted to text.",
            "Large effects cannot be real."
          ],
          answer: 1,
          explanation: "When assignment depends on a prognostic variable, treatment and control are not exchangeable. The estimate mixes treatment effect with device composition."
        },
        {
          id: "metrics-causal-review-q3",
          type: "Interview Articulation",
          skill: "Metric choice",
          prompt: "Explain why a high ROC-AUC can coexist with a poor operational policy for a rare event.",
          freeResponse: true,
          keywords: ["threshold", "precision", "rare", "cost", "policy"],
          explanation: "ROC-AUC measures global ranking across thresholds. For a rare event, the chosen operating threshold may still produce low precision or unacceptable intervention cost, so policy-level metrics are essential."
        },
        {
          id: "metrics-causal-review-q4",
          type: "Trade-Off",
          skill: "Multiple testing",
          prompt: "A team checks 30 outcomes and reports the two with p-values below 0.05. What should be challenged?",
          choices: [
            "The use of any outcomes.",
            "Selective reporting and inflated false-positive risk from multiple comparisons.",
            "The experiment's random assignment.",
            "The use of a control group."
          ],
          answer: 1,
          explanation: "Searching many outcomes raises the chance of apparently significant noise. Pre-specification, multiplicity control, and transparent reporting protect inference."
        }
      ]
    },
    {
      id: "forecast-production-review",
      title: "Weekly Review",
      mode: "Cumulative Review",
      heading: "Forecasting and Production Reliability",
      questions: [
        {
          id: "forecast-production-review-q1",
          type: "Diagnosis",
          skill: "Backtesting",
          prompt: "Why is a random train/test split usually weak for a time-series forecast?",
          choices: [
            "It may train on future periods and fail to reproduce deployment chronology.",
            "Random splits always have too few rows.",
            "Forecasts cannot use test data.",
            "Time-series outcomes must be categorical."
          ],
          answer: 0,
          explanation: "Forecast evaluation should mimic prediction from past into future. Rolling or expanding-window backtests preserve chronology and reveal regime-specific performance."
        },
        {
          id: "forecast-production-review-q2",
          type: "Trade-Off",
          skill: "Monitoring design",
          prompt: "Labels arrive 30 days after prediction. What should the monitoring plan include meanwhile?",
          choices: [
            "No monitoring until labels arrive.",
            "Input quality, feature freshness, score distributions, serving health, and delayed outcome metrics.",
            "Only CPU utilization.",
            "Daily retraining regardless of evidence."
          ],
          answer: 1,
          explanation: "Leading indicators cannot replace outcome evaluation, but they can detect pipeline failures early. The plan should combine immediate operational checks with delayed quality metrics."
        },
        {
          id: "forecast-production-review-q3",
          type: "Interview Articulation",
          skill: "Drift diagnosis",
          prompt: "Distinguish feature drift, concept drift, and a serving bug in two or three sentences.",
          freeResponse: true,
          keywords: ["feature", "distribution", "relationship", "outcome", "serving"],
          explanation: "Feature drift changes the input distribution; concept drift changes the relationship between inputs and outcomes. A serving bug is an implementation or data-pipeline failure that makes online behavior differ from the intended model."
        },
        {
          id: "forecast-production-review-q4",
          type: "Transfer",
          skill: "Asymmetric loss",
          prompt: "Underforecasting demand costs three times as much as overforecasting. Which evaluation change is most appropriate?",
          choices: [
            "Use a loss or quantile aligned with the asymmetric cost.",
            "Continue optimizing symmetric error only.",
            "Remove high-demand days.",
            "Measure classification accuracy."
          ],
          answer: 0,
          explanation: "The statistical objective should reflect the decision cost. An asymmetric loss or suitable quantile forecast penalizes costly underprediction more heavily."
        }
      ]
    },
    {
      id: "data-ranking-review",
      title: "Weekly Review",
      mode: "Cumulative Review",
      heading: "Data Integrity, Ranking, and Product Impact",
      questions: [
        {
          id: "data-ranking-review-q1",
          type: "Diagnosis",
          skill: "Data grain",
          prompt: "A customer-level model is trained from a table containing one row per transaction. What must be resolved before modeling?",
          choices: [
            "The transaction table must be sorted alphabetically.",
            "Features and labels must be aggregated to a well-defined customer prediction timestamp and grain.",
            "Every customer must have the same number of transactions.",
            "Transaction values must be integers."
          ],
          answer: 1,
          explanation: "The modeling unit and timestamp determine what information is available and prevent duplicated customers or future leakage. Grain is a modeling contract, not merely a SQL detail."
        },
        {
          id: "data-ranking-review-q2",
          type: "Trade-Off",
          skill: "Offline-online gap",
          prompt: "A recommender improves offline NDCG but lowers online session satisfaction. Which explanation is most complete?",
          choices: [
            "Online metrics are irrelevant.",
            "Logged-data bias, objective mismatch, latency, novelty, or feedback effects may break the offline-to-online link.",
            "NDCG can never be useful.",
            "The experiment must have assigned everyone to treatment."
          ],
          answer: 1,
          explanation: "Offline ranking metrics are proxies based on historical exposure. Product outcomes also depend on system performance, user response, diversity, and the causal effect of changing recommendations."
        },
        {
          id: "data-ranking-review-q3",
          type: "Interview Articulation",
          skill: "Data validation",
          prompt: "Describe three checks you would run before trusting a newly built analytical dataset.",
          freeResponse: true,
          keywords: ["grain", "unique", "missing", "range", "join"],
          explanation: "Strong checks include confirming row grain and key uniqueness, validating join cardinalities, inspecting missingness and ranges, reconciling aggregates to a source, and checking timestamps for leakage."
        },
        {
          id: "data-ranking-review-q4",
          type: "Transfer",
          skill: "Experiment design",
          prompt: "You want to know whether a new ranking algorithm increases long-term retention. What evidence is strongest?",
          choices: [
            "Higher offline NDCG alone.",
            "A sufficiently powered randomized online experiment with retention and guardrails.",
            "More training epochs.",
            "A survey of the model developers."
          ],
          answer: 1,
          explanation: "The question is causal and product-level. A randomized experiment estimates the effect of deploying the ranking policy while guardrails capture unintended consequences."
        }
      ]
    }
  ]
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const urlParameters = new URLSearchParams(window.location.search);

function localDayNumber(date = new Date()) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / millisecondsPerDay);
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function getQuizSelection(type, date = new Date()) {
  const sets = quizBank[type];
  const requestedSetId = urlParameters.get("quiz") === type ? urlParameters.get("set") : "";
  const requestedSet = requestedSetId ? sets.find((set) => set.id === requestedSetId) : null;
  const dayNumber = localDayNumber(date);
  const rotationNumber = type === "weekly" ? Math.floor(dayNumber / 7) : dayNumber;
  const quiz = requestedSet || sets[positiveModulo(rotationNumber, sets.length)];
  return { ...quiz, dateKey: formatDateKey(date), isAdHoc: Boolean(requestedSet) };
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const storageKey = "ds-academy-quiz-attempts";
const requestedQuiz = urlParameters.get("quiz");
const state = {
  currentQuiz: ["daily", "weekly"].includes(requestedQuiz)
    ? requestedQuiz
    : new Date().getDay() === 0
      ? "weekly"
      : "daily",
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
  const quiz = getQuizSelection(state.currentQuiz);
  state.submitted = false;
  quizTitle.textContent = quiz.title;
  quizMeta.textContent = `${quiz.questions.length} questions · ${quiz.isAdHoc ? "Ad-hoc set" : quiz.dateKey}`;
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
  const quiz = getQuizSelection(state.currentQuiz);
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
    quizSetId: quiz.id,
    quizDate: quiz.dateKey,
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
