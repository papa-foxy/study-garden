---
id: dimensionality-reduction
title: Dimensionality reduction
parent: unsupervised-learning
oneLine: Represent data with fewer useful features while keeping important information.
related: []
beforeAfter:
  type: visual-example
  kind: dimensionality-reduction
  beforeCaption: Each customer is described by income, visits, and spend (3 features).
  afterCaption: The same customers are shown with 2 compact features; the pattern remains visible.
  whatChanged: The representation uses fewer columns while keeping useful structure.
  whatToNotice: The goal is to retain the signal that matters.
  steps: false
keyPoints:
  - A dimension is one feature or direction in the data.
  - Reduction uses fewer features to describe the examples.
  - It can make data easier to inspect or work with.
selfTest:
  - type: fill-blank
    prompt: Dimensionality reduction aims to use ___ features.
    answer: fewer
  - type: multiple-choice
    prompt: Which learning setting commonly includes dimensionality reduction?
    options:
      - Unsupervised learning
      - Regression only
      - Classification only
    answer: Unsupervised learning
---

In a dataset, each feature adds a dimension. Dimensionality reduction represents the data with fewer features while keeping useful information. It can make complex data easier to explore.
