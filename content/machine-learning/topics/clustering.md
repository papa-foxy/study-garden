---
id: clustering
title: Clustering
parent: unsupervised-learning
oneLine: Group examples that are similar to each other.
related: []
beforeAfter:
  type: visual-example
  kind: clustering
  beforeCaption: Customer dots with no groups or names.
  afterCaption: "Three groups appear: bargain, regular, and big spender."
  whatChanged: Similar customers are grouped together.
  whatToNotice: The group names are interpretations added after clustering.
  steps: false
keyPoints:
  - Clustering is an unsupervised learning task.
  - Similar examples are grouped together.
  - Google News topic grouping is one familiar example.
selfTest:
  - type: multiple-choice
    prompt: Does clustering need answer labels for each example?
    options:
      - No
      - Yes
      - It needs only one label
    answer: No
  - type: fill-blank
    prompt: Clustering groups ___ examples.
    answer: similar
---

Clustering groups similar examples without needing answer labels. For example, a news service can group articles that discuss similar topics.
