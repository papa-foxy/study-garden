---
id: feature-engineering
title: Feature engineering
parent: ml-week-one
oneLine: Create useful new inputs from domain knowledge and existing data.
related: [regression]
beforeAfter:
  type: text-compare
  before: ["frontage", "depth"]
  after: ["frontage", "depth", "area = frontage × depth"]
  beforeCaption: Two dimensions are treated as separate inputs.
  afterCaption: Area captures a property characteristic that may matter more.
keyPoints:
  - Engineered features combine or transform raw inputs.
  - Good features make the input-to-target relationship easier to learn.
  - Feature engineering can introduce non-linear patterns into a linear model.
formula: x₃ = x₁ × x₂
selfTest:
  - type: short-answer
    prompt: What engineered feature can be made from frontage and depth?
    answer: Area, calculated as frontage times depth.
  - type: short-answer
    prompt: Why engineer features?
    answer: To represent useful patterns more clearly for the model.
---

Feature engineering uses understanding of the problem to create a more informative input. For land, frontage and depth matter, but their product, area, can be a stronger clue about price.

Gradient descent can then learn whether width, depth, or area is most helpful by adjusting the corresponding weights.
