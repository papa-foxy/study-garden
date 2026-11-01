---
id: regression
title: Regression
parent: supervised-learning
oneLine: Predict a numerical value from one or more input features.
related:
  - classification
beforeAfter:
  type: visual-example
  kind: regression
  beforeCaption: House-size and price dots; a new 1,500 sq ft house is “?”.
  afterCaption: A fitted line predicts about $250,000 for the new house.
  whatChanged: The line turns the size pattern into a numerical price prediction.
  whatToNotice: Regression outputs a number.
  steps: false
keyPoints:
  - Regression outputs a number.
  - Linear regression is one regression algorithm.
selfTest:
  - type: fill-blank
    prompt: Regression predicts a ___.
    answer: number
  - type: multiple-choice
    prompt: Is house-price prediction regression?
    options:
      - Yes
      - No
      - It is clustering
    answer: Yes
---

Regression is a supervised learning task where the target can take a numerical value. Predicting a house price from its size is one example.

### Compared with classification

Regression predicts a number, such as a house price. Classification predicts a category, such as benign or malignant.

### Notes merged from Regression vs classification

Key points:
- A price or temperature is a numerical output, so it is regression.
- A spam label or diagnosis category is classification.
- Classification can have two or many categories.

Recall questions:
- Predicting tomorrow temperature is which kind of task? Answer: Regression
- Predicting whether a transaction is fraud is which kind of task? Answer: Classification
