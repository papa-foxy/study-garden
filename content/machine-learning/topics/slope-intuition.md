---
id: slope-intuition
title: Slope intuition
parent: gradient-descent
oneLine: The slope sign tells which direction lowers the cost.
related: []
beforeAfter:
  type: visual-example
  kind: slope-intuition
  beforeCaption: A ball rests to the right of the cost minimum where slope is positive.
  afterCaption: One update moves it left toward the bottom of the curve.
  whatChanged: The downhill direction is opposite the local slope.
  whatToNotice: Switch the start point to compare either side of the minimum.
  steps: false
demo: slope-ball
keyPoints:
  - A positive slope makes the parameter decrease.
  - A negative slope makes the parameter increase.
  - The minus sign in the update rule moves against the slope.
selfTest:
  - type: multiple-choice
    prompt: If the slope is positive, what happens to w?
    options:
      - It decreases
      - It increases
      - It stays fixed
    answer: It decreases
  - type: fill-blank
    prompt: If the slope is negative, subtracting it makes w ___.
    answer: increase
  - type: short-answer
    prompt: What does the sign of the slope tell us?
    answer: Which direction to move to reduce cost.
---

The slope tells how the cost changes when a parameter changes. If the slope is positive, moving the parameter a little smaller lowers the cost. If it is negative, moving it a little larger lowers the cost.

That is why the update rule subtracts the slope.
