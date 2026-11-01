---
id: visualizing-cost
title: Visualizing cost
parent: cost-function
oneLine: A cost curve or contour plot shows how parameter choices change the error.
related: []
beforeAfter:
  type: visual-example
  kind: visualizing-cost
  beforeCaption: The parameter pair sits on an outer contour ring and gives a poor house-price line.
  afterCaption: The pair reaches the center of the contours and gives a good line.
  whatChanged: Moving toward the center means lower cost.
  whatToNotice: Each contour joins parameter choices with equal cost.
  steps: false
keyPoints:
  - A cost curve shows cost as one parameter changes.
  - With w and b, the surface forms a three-dimensional bowl.
  - A contour plot is a top view; its center is the minimum.
selfTest:
  - type: multiple-choice
    prompt: What do the loops on a contour plot connect?
    options:
      - Points with equal cost
      - Different training labels
      - Different subjects
    answer: Points with equal cost
  - type: short-answer
    prompt: What does the center of the smallest contour represent?
    answer: The minimum cost and best values for w and b.
---

When only `w` changes, draw cost as a curve. When both `w` and `b` change, cost is a bowl-shaped surface. A **contour plot** is a map-like top view: every loop joins parameter pairs with the same cost. The smallest loop surrounds the best fit.
