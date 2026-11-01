---
id: convexity
title: Convex cost
parent: gradient-descent
oneLine: A convex cost has one bowl-shaped minimum.
related: []
beforeAfter:
  type: visual-example
  kind: convexity
  beforeCaption: A bumpy cost surface lets two starts settle in different valleys.
  afterCaption: A bowl-shaped cost sends either start to the same minimum.
  whatChanged: Convex cost has no competing local valleys.
  whatToNotice: This makes the global minimum easier to reach.
  steps: false
keyPoints:
  - Convex means bowl-shaped for this cost curve.
  - Linear regression with squared error has one minimum.
  - A suitable learning rate lets gradient descent find that minimum.
selfTest:
  - type: fill-blank
    prompt: A convex cost for linear regression has one ___ minimum.
    answer: global
  - type: multiple-choice
    prompt: What shape is a simple convex cost curve like?
    options:
      - A bowl
      - A staircase
      - A flat line
    answer: A bowl
  - type: short-answer
    prompt: Why is one minimum helpful for gradient descent?
    answer: There are no other local valleys to trap the algorithm.
---

Convex means the cost forms a bowl shape. For linear regression with squared error, there is one lowest point, called the global minimum. Gradient descent can work its way to that point when the learning rate is chosen well.

Some larger, more complex models have bumpy costs with many valleys. This simple linear regression cost does not.
