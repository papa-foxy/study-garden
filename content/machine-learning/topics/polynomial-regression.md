---
id: polynomial-regression
title: Polynomial regression
parent: feature-engineering
oneLine: Add transformed features such as x² or x³ so a linear model can fit a curve.
related: [linear-regression]
beforeAfter:
  type: text-compare
  before: ["price = w₁x + b", "straight-line fit"]
  after: ["price = w₁x + w₂x² + w₃x³ + b", "curved fit"]
  beforeCaption: A straight line can miss a curved pattern.
  afterCaption: Powers of x let the model bend with the data.
keyPoints:
  - A quadratic model can curve down again at large x.
  - Cubic and square-root features can describe different curve shapes.
  - Scaling is essential because powers of x can have very large ranges.
formula: f_w,b(x) = w₁x + w₂x² + w₃x³ + b
selfTest:
  - type: short-answer
    prompt: Why scale features in polynomial regression?
    answer: Powers such as x² and x³ can have vastly different magnitudes.
  - type: short-answer
    prompt: What does polynomial regression add to a linear model?
    answer: Transformed features such as x squared or x cubed.
---

Polynomial regression still uses a linear model in its parameters, but it gives the model transformed features such as x² and x³. This lets it fit a curve when a straight line is too simple.

If x ranges from 1 to 1,000, then x² and x³ can be millions or billions. Feature scaling is therefore required for fast, stable gradient descent.
