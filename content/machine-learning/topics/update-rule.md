---
id: update-rule
title: The update rule
parent: gradient-descent
oneLine: New parameter = old parameter minus learning rate times slope.
related: []
beforeAfter:
  type: visual-example
  kind: update-rule
  beforeCaption: One step starts with w = 0.5, α = 0.1, and slope = −2.
  afterCaption: The arithmetic gives w := 0.5 − 0.1(−2) = 0.7.
  whatChanged: The parameter moves opposite the slope, scaled by α.
  whatToNotice: The same rule is applied to each parameter.
  steps: true
demo: simultaneous
keyPoints:
  - The minus sign points the update downhill.
  - Compute new w and b from the old values before changing either one.
  - Alpha controls how far each update moves.
selfTest:
  - type: fill-blank
    prompt: New w equals old w minus alpha times the ___.
    answer: slope
    explanation: The slope tells which direction leads toward lower cost.
  - type: multiple-choice
    prompt: Why calculate both new parameters before replacing the old ones?
    options:
      - So both use the same old values
      - To make alpha bigger
      - To remove the cost function
    answer: So both use the same old values
  - type: short-answer
    prompt: What does alpha control in the update rule?
    answer: The step size.
formula: parameter := parameter − α × slope
---

The update rule says how to change a parameter. Gradient descent updates both the slope w and intercept b of the line.

Calculate both new values using the old w and b, then replace them together. This is called a simultaneous update.
