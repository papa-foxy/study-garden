---
id: choosing-learning-rate
title: Choosing the learning rate
parent: convergence
oneLine: Find the largest alpha that lowers cost quickly without oscillating.
related: [learning-rate]
beforeAfter:
  type: text-compare
  before: ["α too large → J oscillates or grows"]
  after: ["α chosen well → J falls steadily"]
  beforeCaption: Oversized steps can jump past the minimum.
  afterCaption: A stable step size learns quickly without diverging.
keyPoints:
  - Test values spaced by factors of about 3 or 10.
  - A tiny alpha is useful to distinguish a high-alpha problem from a code bug.
  - Select the largest value that still gives steady progress.
selfTest:
  - type: short-answer
    prompt: What can persistent oscillation in J indicate?
    answer: The learning rate is too large, or the code has a bug.
  - type: short-answer
    prompt: Why try a tiny alpha while debugging?
    answer: If J then decreases, the earlier alpha was probably too large.
---

An alpha that is too large overshoots the minimum. The cost may bounce up and down or grow. To diagnose the cause, temporarily try a very small alpha. If cost still rises, inspect the code; a sign error can accidentally make gradient descent climb uphill.

Try several values such as 0.001, 0.003, 0.01, 0.03, 0.1, and 0.3. Choose the largest value that remains stable.
