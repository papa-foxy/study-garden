---
id: classification
title: Classification
parent: supervised-learning
oneLine: Predict a category, such as whether a tumor is benign or malignant.
related: []
beforeAfter:
  type: visual-example
  kind: classification
  beforeCaption: Tumor-size measurements appear as mixed circles and crosses; new patient “?”.
  afterCaption: A boundary separates classes; the new patient is predicted benign (0) or malignant (1).
  whatChanged: A category boundary turns measurements into a class decision.
  whatToNotice: Classification outputs a label, not a number.
  steps: false
keyPoints:
  - Classification predicts a category, not a continuous number.
  - Categories can be binary or multi-class.
  - A decision boundary separates predicted classes.
selfTest:
  - type: fill-blank
    prompt: Classification predicts a ___.
    answer: category
  - type: multiple-choice
    prompt: Spam or not spam is an example of what?
    options:
      - Classification
      - Regression
      - Dimensionality reduction
    answer: Classification
---

Classification predicts a category. Categories can be two labels, such as spam and not spam, or several labels. With many input features, a model can use a **decision boundary** to separate categories.

### Compared with regression

Classification predicts a category, such as benign or malignant. Regression predicts a number, such as a house price.
