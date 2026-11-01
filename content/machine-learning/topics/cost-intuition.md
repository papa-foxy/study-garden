---
id: cost-intuition
title: Cost intuition (b = 0)
parent: cost-function
oneLine: The cost changes as the line parameters change, and its lowest point is the best fit.
related: []
beforeAfter:
  type: visual-example
  kind: cost-intuition
  beforeCaption: For (1,1), (2,2), (3,3), w = 0.5 gives J ≈ 0.58.
  afterCaption: At w = 1 the points fit exactly and J = 0.
  whatChanged: The marker moves down the U-curve as the line improves.
  whatToNotice: The minimum is the parameter value with the lowest cost.
  steps: false
keyPoints:
  - With b fixed at zero, cost depends only on w.
  - A perfect fit has zero squared error cost.
  - The best parameter is the one at the bottom of the cost curve.
selfTest:
  - type: multiple-choice
    prompt: For points (1,1), (2,2), (3,3) with b = 0, which w has zero cost?
    options:
      - 0
      - 0.5
      - 1
    answer: 1
  - type: short-answer
    prompt: What does the lowest point of the cost curve represent?
    answer: The parameter value with the smallest cost and best fit.
formula: J(w) = (1 / 2m) Σ (wx⁽ⁱ⁾ − y⁽ⁱ⁾)²
---

To picture cost, fix `b = 0` and try different slopes `w`. For the examples `(1, 1)`, `(2, 2)`, `(3, 3)`, the choice `w = 1` fits all three perfectly and gives `J(w) = 0`. A flatter line has a higher cost.
