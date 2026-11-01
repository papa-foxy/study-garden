---
id: scaling-methods
title: Ways to scale features
parent: feature-scaling
oneLine: Divide by a maximum, normalize around the mean, or standardize with a z-score.
related: [learning-rate]
beforeAfter:
  type: text-compare
  before: ["size = 1,500", "bedrooms = 3"]
  after: ["size scaled near 0", "bedrooms scaled near 0"]
  beforeCaption: Raw units can have unrelated sizes.
  afterCaption: Scaled values are easier for gradient descent to handle together.
keyPoints:
  - Divide by the maximum to map values near 0 to 1.
  - Mean normalization uses (x − μ) / (max − min).
  - Z-score normalization uses (x − μ) / σ and gives mean 0, standard deviation 1.
formula: x_zscore = (x − μ) / σ
selfTest:
  - type: short-answer
    prompt: What does μ represent?
    answer: The mean of a feature.
  - type: short-answer
    prompt: What range is often a useful target after scaling?
    answer: Roughly −1 to +1.
---

Three common approaches are dividing by the maximum, mean normalization, and z-score normalization. The goal is not a perfect fixed range. It is to avoid features that differ by orders of magnitude.

Ranges such as −3 to +3 are usually fine. When in doubt, scale: it normally makes gradient descent easier to tune.
