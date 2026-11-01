---
id: model-and-parameters
title: Model (w, b)
parent: linear-regression
oneLine: A linear model uses w for the slope and b for the y-intercept.
related:
  - cost-function
beforeAfter:
  type: visual-example
  kind: model-and-parameters
  beforeCaption: A flat line with w = 0, b = 0 misses the house-price points.
  afterCaption: Tuned w and b tilt and shift the line to fit the data.
  whatChanged: Changing parameters changes every prediction from the model.
  whatToNotice: w controls slope; b controls the intercept.
  steps: false
keyPoints:
  - w controls the line slope.
  - b is the y-intercept, the value predicted when x is zero.
  - Parameters are also called weights or coefficients.
selfTest:
  - type: fill-blank
    prompt: In f(x) = w × x + b, w is the line ___.
    answer: slope
  - type: fill-blank
    prompt: b is the y-___.
    answer: intercept
formula: f₍w,b₎(x) = wx + b
---

The model for a straight line is `f(x) = w × x + b`. The parameter `w` controls the slope of the line. The parameter `b` is the y-intercept: the value of the prediction when `x` is zero. Together, `w` and `b` are the model parameters.
