---
id: batch-gradient-descent
title: Batch gradient descent
parent: gradient-descent
oneLine: Each update uses every example in the training set.
related: []
beforeAfter:
  type: visual-example
  kind: batch-gradient-descent
  beforeCaption: A single training row is used for one update.
  afterCaption: All m housing rows contribute to every batch update.
  whatChanged: Batch gradient descent averages information across the full training set.
  whatToNotice: Every update uses the whole batch.
  steps: true
keyPoints:
  - A batch is the group of examples used in one update.
  - Batch gradient descent uses all m examples each step.
  - Other methods can use smaller groups of examples.
selfTest:
  - type: fill-blank
    prompt: In batch gradient descent, each step uses ___ m examples.
    answer: all
  - type: multiple-choice
    prompt: What does batch refer to here?
    options:
      - The training examples used for one update
      - The model output
      - The number of parameters
    answer: The training examples used for one update
formula: gradient = (1/m) Σ gradient for each training example
---

In **batch gradient descent**, each update uses the whole batch: all `m` training examples. Other versions use smaller portions of the data for an update.
