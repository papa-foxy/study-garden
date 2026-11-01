---
id: gradient-descent
title: Gradient descent
parent: linear-regression
oneLine: Improve a model by taking small steps toward a lower cost.
related: []
beforeAfter:
  type: visual-example
  kind: gradient-descent
  beforeCaption: "Start at w = −0.1, b = 900: the prediction line misses the housing data and cost is high."
  afterCaption: After repeated updates, the line fits the houses and the path reaches a low-cost contour.
  whatChanged: Small parameter updates gradually reduce the prediction error.
  whatToNotice: The contour path and fitted line describe the same optimization.
  steps: true
demo: gd-run
keyPoints:
  - Start with values for the model parameters.
  - Use the slope of the cost to decide which way to move.
  - Repeat small updates until the cost stops improving.
selfTest:
  - type: fill-blank
    prompt: Gradient descent takes steps toward a lower ___.
    answer: cost
    explanation: Cost measures how far the predictions are from the true values.
  - type: multiple-choice
    prompt: What does gradient descent change during training?
    options:
      - The model parameters
      - The training labels
      - The number of examples
    answer: The model parameters
    explanation: It adjusts values such as w and b to lower the cost.
  - type: short-answer
    prompt: In your own words, why are the updates repeated?
    answer: Each update moves toward a lower cost; repeating can reach a good fit.
    explanation: One small step usually does not reach the minimum.
formula: w := w − α ∂J/∂w;  b := b − α ∂J/∂b
---

Gradient descent is an optimization algorithm: a repeatable way to find model settings that make the cost small. Picture walking down a hill. At each point, look at which direction slopes downward and take a small step.

The cost function is a score for how wrong the model is. A smaller cost means the model predictions fit the examples better.

### Gradient descent for linear regression

For linear regression with squared error, gradient descent uses these average slopes:

`slope for w = (1 / m) × sum (f(x(i)) − y(i)) × x(i)`

`slope for b = (1 / m) × sum (f(x(i)) − y(i))`

Subtract `alpha` times each slope from its parameter, using the old values for both updates.

### Why use gradient descent?

Plots help build intuition, but choosing values by eye does not scale when a model has many parameters. Gradient descent uses the cost slope to adjust the parameters automatically.

### Notes merged from Gradient descent for linear regression

Key points:
- The w slope averages each error multiplied by its input x.
- The b slope averages the prediction errors.
- Squared error cost is convex, so it has one global minimum.

Recall questions:
- What extra factor appears in the slope for w? Answer: The input x(i)
- The slope for b averages the prediction ___. Answer: errors

### Notes merged from Why use gradient descent?

Key points:
- A graph can help with intuition for one or two parameters.
- Real models can have hundreds or millions of parameters.
- Gradient descent automates the search for lower cost.

Recall questions:
- Why is choosing parameters by eye impractical for large models? Answer: There can be many parameters
- What does gradient descent help find? Answer: Parameter values that make the cost smaller.
