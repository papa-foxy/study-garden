---
id: supervised-learning
title: Supervised learning
parent: ml-week-one
oneLine: Learn from examples that include inputs and their correct answers.
related:
  - unsupervised-learning
beforeAfter:
  type: visual-example
  kind: supervised-learning
  beforeCaption: House sizes are listed, but prices are missing; a new house is “?”.
  afterCaption: Each house has a price label, so a model can predict the new house’s price.
  whatChanged: The examples now pair each input with its correct answer.
  whatToNotice: The known prices teach the model what size tends to mean for price.
  steps: false
keyPoints:
  - Each training example contains an input x and a target y.
  - The algorithm learns a mapping from inputs to targets.
  - Regression and classification are supervised tasks.
selfTest:
  - type: fill-blank
    prompt: Supervised examples include inputs and their ___ labels.
    answer: correct
  - type: multiple-choice
    prompt: Is predicting house price supervised learning?
    options:
      - Yes
      - No
      - Only if there are no prices
    answer: Yes
---

In supervised learning, the training data includes the answer for each example. The input is written as `x`; the answer or target is written as `y`. The algorithm uses these labeled examples to learn how to predict a target for new inputs.

### Two learning settings

Machine learning learns patterns from data. Two broad settings are **supervised** and **unsupervised** learning. The key difference is whether examples include the answer the model should learn to predict.

Supervised learning includes regression and classification: it learns from examples with known answers.
