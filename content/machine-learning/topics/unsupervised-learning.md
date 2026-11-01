---
id: unsupervised-learning
title: Unsupervised learning
parent: ml-week-one
oneLine: Find useful patterns in input data without supplied answer labels.
related: []
beforeAfter:
  type: visual-example
  kind: unsupervised-learning
  beforeCaption: Customer dots with no labels or groups.
  afterCaption: The model finds two groups from the dots alone.
  whatChanged: A pattern appears even though no correct group labels were supplied.
  whatToNotice: The groups are discovered from input features.
  steps: false
keyPoints:
  - The training data has inputs but no target labels.
  - Clustering groups similar examples.
  - Anomaly detection finds unusual examples; dimensionality reduction uses fewer features.
selfTest:
  - type: multiple-choice
    prompt: Which task can group similar news stories without labels?
    options:
      - Clustering
      - Regression
      - Linear interpolation
    answer: Clustering
  - type: short-answer
    prompt: Name one other unsupervised learning task.
    answer: Anomaly detection or dimensionality reduction.
---

Unsupervised learning starts with input examples but no supplied answers. It can look for **clusters** (groups of similar examples), unusual cases with **anomaly detection**, or a smaller set of useful features with **dimensionality reduction**.

### Finding patterns without labels

Unsupervised learning works with input examples that have no supplied correct answers. It can group similar items, flag unusual ones, or compress features while keeping useful structure.
