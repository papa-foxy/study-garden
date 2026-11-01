---
id: learning-rate
title: Learning rate
parent: gradient-descent
oneLine: Alpha sets the size of each gradient descent step.
related:
  - convexity
beforeAfter:
  type: visual-example
  kind: learning-rate
  beforeCaption: At step 0, α = 0.01, 0.1, and 1 start at the same parameter.
  afterCaption: After 10 steps, tiny α barely moves, a good α nears the minimum, and large α overshoots.
  whatChanged: Step size determines how quickly cost changes.
  whatToNotice: A large learning rate can bounce or diverge.
  steps: true
demo: learning-rate
keyPoints:
  - A small alpha is safe but can be slow.
  - A large alpha can overshoot or diverge.
  - Near a minimum, the slope gets smaller, so updates naturally shrink.
selfTest:
  - type: fill-blank
    prompt: The learning rate is often written as ___.
    answer: alpha
  - type: multiple-choice
    prompt: What can happen when alpha is much too large?
    options:
      - The updates can overshoot
      - The model stops having parameters
      - The data gets labeled
    answer: The updates can overshoot
  - type: short-answer
    prompt: What is a drawback of choosing alpha too small?
    answer: Learning is very slow because it takes many small steps.
formula: new parameter = old parameter − α × slope
---

The learning rate, written as alpha, controls the size of each step. If it is too small, learning crawls. If it is too large, the updates may jump over the best value and fail to settle.

With a good learning rate, the algorithm moves quickly at first and takes smaller steps near the bottom because the slope becomes flatter.
