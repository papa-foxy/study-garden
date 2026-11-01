---
id: vectorized-gradient-descent
title: Vectorized gradient descent
parent: vectorization
oneLine: Update every weight together with one vector expression.
related: [gradient-descent]
beforeAfter:
  type: text-compare
  before: ["for j in range(n):", "  w[j] = w[j] − α × d[j]"]
  after: ["w = w − α × d"]
  beforeCaption: Each parameter update runs in sequence.
  afterCaption: The full parameter vector updates together.
keyPoints:
  - d stores one derivative for each weight.
  - α is a scalar learning rate applied to every derivative.
  - Simultaneous vector updates scale well to many features.
selfTest:
  - type: short-answer
    prompt: In w = w − αd, what does d contain?
    answer: The derivatives for the weights.
  - type: short-answer
    prompt: Why update all weights together?
    answer: It is concise and efficient for many features.
---

With many features, gradient descent has a derivative for every weight. A loop updates them one by one. Vectorization expresses the same simultaneous update as **w = w − αd**, which is much more practical for large models.
