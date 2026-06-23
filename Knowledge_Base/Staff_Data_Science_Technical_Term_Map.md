# Staff data science technical term map

## Core distinction

The most important distinction is between prediction and causation.

- A predictive model estimates an unknown outcome: who may churn, future contact volume, or expected customer value.
- A causal method estimates what would change because of an action: whether AI assistance reduces resolution time or whether an offer increases retention.
- A prescriptive or targeting method uses those estimates to decide what action to take and for whom.

High predictive accuracy does not imply that acting on a predictor will improve an outcome.

## Predictive models

### Ensemble methods

Combine multiple models to improve accuracy or stability. Random forests average many decision trees; gradient boosting builds trees sequentially to correct prior errors. They work well on structured/tabular data but require careful validation, calibration, and interpretability checks.

### Time-series forecasting

Predicts a variable indexed by time, such as hourly support contacts or weekly demand. It must account for trend, seasonality, holidays, autocorrelation, and changing conditions. Random train/test splits are usually invalid; evaluation should respect time order.

### Lifetime value modeling

Estimates the future economic value associated with a customer. A useful formulation combines expected future revenue or margin, retention/survival, cost, and discounting. Predictions depend heavily on the time horizon and on whether the model estimates value under current policy or under an intervention.

### Deep learning

Uses multilayer neural networks to learn complex representations. It is especially relevant to text, speech, images, recommendations, and GenAI systems. It is not automatically superior for ordinary tabular data and introduces data, compute, monitoring, and interpretability costs.

### Uplift modeling

Estimates conditional treatment effect:

`uplift(x) = E[Y | T=1, X=x] - E[Y | T=0, X=x]`

It targets people whose outcome is likely to change because of treatment, not merely people likely to have the outcome. It requires credible treatment/control data and careful evaluation of treatment-effect ranking.

## Experimentation and inference

### A/B testing

Randomly assigns units to variants so outcome differences can be interpreted causally, subject to assumptions such as correct randomization, consistent exposure, limited interference, and valid measurement. Design choices include unit of randomization, sample size, duration, primary metric, guardrails, and analysis population.

### CUPED

Controlled-experiment variance reduction using pre-treatment information correlated with the outcome. A common adjusted outcome is:

`Y_adj = Y - theta(X - mean(X))`

where `X` is pre-treatment and `theta` is chosen to reduce variance. CUPED can improve precision but does not repair bad randomization or post-treatment bias.

### Bayesian inference

Updates a prior distribution with observed data to produce a posterior distribution. It supports statements such as the posterior probability that an effect exceeds a business threshold. Results depend on the likelihood and prior; it does not eliminate the need for good experimental design.

### Sequential testing

Allows evidence to be examined during an experiment using rules that preserve inferential validity. Ordinary fixed-horizon p-values become unreliable if teams repeatedly peek and stop opportunistically. Valid approaches include group-sequential methods, alpha-spending, always-valid inference, and explicitly specified Bayesian decision rules.

### Multi-armed bandits

Adaptively allocate more traffic to better-performing options while continuing to learn. They optimize cumulative reward under an exploration–exploitation trade-off. They are useful for ongoing allocation but can be less suitable than a conventional experiment when clean effect estimation, delayed outcomes, or multiple guardrails are central.

## Causal inference and econometrics

Causal inference estimates counterfactual contrasts: what would have happened to the same unit under a different action. Because both potential outcomes cannot be observed for one unit, identification requires assumptions and a design such as randomization, difference-in-differences, regression discontinuity, instrumental variables, matching, or weighting.

“Incremental impact” means the outcome caused by the intervention beyond what would have occurred anyway. “Attribution” is only causal when its design and assumptions identify that counterfactual; assigning credit with a reporting rule is not necessarily causal inference.

## Metrics and model validation

- A predictive KPI leads or forecasts a later business outcome.
- A causally informative metric responds to the intervention in a way that represents the intended mechanism or outcome.
- A primary metric determines success; guardrails detect unacceptable harm.
- Model validation must match use: temporal or out-of-sample performance, calibration, subgroup behavior, robustness, leakage checks, and online impact where applicable.

## Production ML, personalization, and GenAI

Productionalizing a model includes data pipelines, feature consistency, serving, latency, monitoring, retraining, rollback, governance, and ownership—not simply deploying a model artifact.

Personalization chooses content or actions based on user context. Recommendation systems rank candidate items or actions. GenAI systems generate outputs and add concerns including hallucination, prompt injection, safety, privacy, groundedness, human escalation, latency, and cost.

Responsible AI requires explicit evaluation of subgroup harms, privacy, transparency, human oversight, misuse, and operational failure modes.

## Worked example: AI-assisted customer support

Suppose an AI assistant suggests answers to support experts.

- Forecasting estimates next week's support demand for staffing.
- A recommendation model ranks suggested answers.
- An A/B test estimates whether enabling suggestions changes resolution time and customer satisfaction.
- CUPED uses pre-experiment expert performance to improve precision.
- Uplift modeling identifies which experts or cases benefit from suggestions.
- Causal inference estimates impact if a clean randomized rollout is unavailable.
- Guardrails track incorrect advice, escalations, repeat contacts, fairness, and expert workload.
- Production monitoring checks drift, latency, failures, and model quality after launch.

## Common failure modes

- Treating correlation or feature importance as incremental impact.
- Using random cross-validation for temporal prediction.
- Targeting high-risk customers instead of customers whose behavior is changeable.
- Peeking at fixed-horizon tests without sequential correction.
- Optimizing a proxy metric that harms the real outcome.
- Reporting offline model accuracy without proving online business value.
- Treating “deployed” as sufficient without monitoring and rollback plans.

## Interview articulation

“I first separate the business problem into prediction, causal measurement, and decisioning. I define the estimand and success metrics, choose the simplest design that identifies the required quantity, state the assumptions, validate the model or experiment against realistic failure modes, and connect the result to an operating decision. For live ML, I also define monitoring, guardrails, and rollback criteria.”
