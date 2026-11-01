---
id: convergence
title: Checking convergence
parent: ml-week-one
oneLine: Read the learning curve to see whether cost is falling and settling down.
related: [cost-function]
beforeAfter:
  type: text-compare
  before: ["J rises or keeps changing sharply"]
  after: ["J falls quickly, then levels off"]
  beforeCaption: Rising cost signals a problem.
  afterCaption: A flattening learning curve indicates convergence.
keyPoints:
  - Plot cost J against the number of iterations.
  - J should decrease after every iteration for correctly configured gradient descent.
  - An epsilon test is possible, but visually inspecting the curve is often more informative.
selfTest:
  - type: short-answer
    prompt: What should J do during a healthy gradient-descent run?
    answer: Decrease after every iteration.
  - type: short-answer
    prompt: What does a flat learning curve usually mean?
    answer: The algorithm has converged near a minimum.
---

A learning curve puts iteration number on the horizontal axis and cost **J(w, b)** on the vertical axis. At first, cost often falls steeply. It then levels off as the model approaches a minimum.

If cost increases, the learning rate may be too large or the implementation may contain a bug.
