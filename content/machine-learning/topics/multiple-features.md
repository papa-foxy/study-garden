---
id: multiple-features
title: Multiple features
parent: ml-week-one
oneLine: Predict with several inputs instead of just one.
related: [model-and-parameters]
beforeAfter:
  type: text-compare
  before: ["price = w × size + b"]
  after: ["price = w₁ × size + w₂ × bedrooms + w₃ × age + b"]
  beforeCaption: One feature can miss useful information.
  afterCaption: Each useful feature gets its own weight.
keyPoints:
  - n is the number of features; m is the number of training examples.
  - xⱼ is feature j, while x⁽ⁱ⁾ is every feature for example i.
  - Multiple linear regression predicts one target using many features.
formula: f_w,b(x) = w₁x₁ + w₂x₂ + … + wₙxₙ + b
selfTest:
  - type: short-answer
    prompt: What does xⱼ mean?
    answer: The j-th feature.
  - type: short-answer
    prompt: What does m count?
    answer: Training examples.
---

Using only house size can miss important evidence. Bedrooms, floors, age, and location-related features can help explain price. A multiple-feature model gives each input its own weight.

The notation is precise: **x⁽ⁱ⁾** is the full feature vector for row i, while **xⱼ⁽ⁱ⁾** is feature j in row i. For example, x₃⁽²⁾ could be the number of floors for the second house.
