---
id: linear-regression
title: Linear regression
parent: regression
oneLine: Fit a straight-line model to predict a numerical target.
related: []
beforeAfter:
  type: visual-example
  kind: linear-regression
  beforeCaption: House-size and price points with no line.
  afterCaption: "A best-fit straight line summarizes the trend: f(x) = wx + b."
  whatChanged: The line gives a numerical prediction for each house size.
  whatToNotice: The line is chosen to keep prediction errors small overall.
  steps: false
keyPoints:
  - Linear regression predicts a number.
  - With one input feature, it fits a straight line.
  - The model is written f(x) = w × x + b.
selfTest:
  - type: multiple-choice
    prompt: What does univariate linear regression use?
    options:
      - One input feature
      - No input features
      - One category only
    answer: One input feature
  - type: fill-blank
    prompt: Linear regression predicts a ___.
    answer: number
formula: f₍w,b₎(x) = wx + b
---

Linear regression fits a straight line to examples and uses it to predict a number. For example, it can learn the relationship between a house size and its price. With one input feature, it is called **univariate linear regression**.
