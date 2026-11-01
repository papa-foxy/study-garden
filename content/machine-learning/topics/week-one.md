---
id: ml-week-one
title: Machine learning
parent: ""
oneLine: Learn how a model makes predictions and how training improves them.
related: []
beforeAfter:
  type: visual-example
  kind: ml-week-one
  beforeCaption: "Spam caught by hand-written rules: 6 of 10 emails"
  afterCaption: "Learned from examples: 9 of 10 caught"
  whatChanged: The learned filter catches three more spam messages in the same 10-email inbox.
  whatToNotice: It improves by learning patterns from labeled examples.
  steps: false
keyPoints:
  - A model finds useful patterns in examples.
  - Training adjusts the model to make better predictions.
selfTest:
  - type: multiple-choice
    prompt: What makes machine learning different from a hand-written rule list?
    options: [It learns patterns from examples, It removes all input data, It only sorts files]
    answer: It learns patterns from examples
  - type: fill-blank
    prompt: A trained model uses learned patterns to make a ___ for a new example.
    answer: prediction
---

## The big idea

Machine learning uses examples to help a computer make predictions. In Week 1, we build a straight-line model and learn how to improve it.
