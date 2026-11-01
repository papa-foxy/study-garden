---
id: cost-function
title: Cost function
parent: linear-regression
oneLine: A score that measures how far model predictions are from the true targets.
related:
  - gradient-descent
beforeAfter:
  type: visual-example
  kind: cost-function
  beforeCaption: A poor house-price line has long error bars and high J(w,b).
  afterCaption: A better line has shorter errors and lower J(w,b).
  whatChanged: The score falls as predictions move closer to known prices.
  whatToNotice: The cost summarizes error across the training examples.
  steps: false
keyPoints:
  - The cost depends on model parameters w and b.
  - A smaller cost means predictions fit the training data better.
  - Training looks for parameter values that reduce cost.
selfTest:
  - type: multiple-choice
    prompt: What does the cost function measure?
    options:
      - How wrong the model predictions are
      - How many features exist
      - How quickly code runs
    answer: How wrong the model predictions are
  - type: fill-blank
    prompt: The training goal is to make cost as ___ as possible.
    answer: small
formula: J(w,b) = (1 / 2m) Σ (f₍w,b₎(x⁽ⁱ⁾) − y⁽ⁱ⁾)²
---

The **cost function**, written `J(w, b)`, measures how well the line fits all the training examples. It compares the model prediction for each input with the true target. Training aims to find `w` and `b` that make the cost small.

### Squared error cost

For each example, calculate the prediction error `f(x(i)) − y(i)`. Square the error, add the squared errors for all `m` examples, then divide by `2m`:

`J(w, b) = (1 / 2m) × sum (f(x(i)) − y(i))²`

The `m` averages across examples. The extra `2` cancels with the derivative of the square during gradient descent.

### Notes merged from Squared error cost

Key points:
- Squaring makes negative errors positive.
- Squaring gives larger errors a larger penalty.
- The factor 2 makes later derivative formulas cleaner.

Recall questions:
- Why square prediction errors? Answer: To keep errors positive and penalize large errors
- The squared error cost divides by ___. Answer: 2m
