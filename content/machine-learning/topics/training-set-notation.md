---
id: training-set-notation
title: Notation
parent: linear-regression
oneLine: A training set is a collection of examples written as input-target pairs.
related: []
beforeAfter:
  type: visual-example
  kind: training-set-notation
  beforeCaption: A plain table lists house sizes and prices.
  afterCaption: The same table marks x, y, m, and highlights example i = 2 as (x⁽²⁾, y⁽²⁾).
  whatChanged: The values now have consistent names for equations and code.
  whatToNotice: Superscript (i) means example number i; it is not an exponent.
  steps: false
keyPoints:
  - x is an input feature and y is the true target.
  - m is the number of examples in the training set.
  - x(i), y(i) refer to the input and target in example i; i is an index, not an exponent.
selfTest:
  - type: fill-blank
    prompt: In the notation, m is the number of training ___.
    answer: examples
  - type: multiple-choice
    prompt: Does x(2) mean x squared?
    options:
      - No
      - it identifies the second example
      - Yes
      - Always
    answer: No, it identifies the second example
formula: "Training set: {(x⁽ⁱ⁾, y⁽ⁱ⁾)} for i = 1…m"
---

A **training set** is the collection of examples used to train a model. We write an example as `(x, y)`: `x` is the input feature and `y` is its true target. The symbol `m` is the number of examples. In `x(i)`, the `i` in parentheses is the row number, not a power.

### How training works

Training has three parts: examples go into a learning algorithm, the algorithm produces a model `f`, and the model uses a new input `x` to produce a prediction called **y-hat**. The true target `y` and the prediction y-hat may differ.

### Notes merged from How training works

Key points:
- The algorithm learns from the training set.
- The result of learning is a model f.
- A model predicts targets for new inputs.

Recall questions:
- What comes after a model learns from the training set? Answer: Use the model to predict a target for a new input.
- A prediction from the model is often written y-hat. Answer: y-hat
