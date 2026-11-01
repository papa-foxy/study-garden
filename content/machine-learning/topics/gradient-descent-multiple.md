---
id: gradient-descent-multiple
title: Gradient descent with many features
parent: ml-week-one
oneLine: Improve every weight and the intercept to lower squared error.
related: [gradient-descent]
beforeAfter:
  type: text-compare
  before: ["wⱼ = wⱼ − α × derivative for feature j"]
  after: ["Update every wⱼ and b simultaneously"]
  beforeCaption: One weight alone cannot fit a multi-feature model.
  afterCaption: Every parameter moves according to its own slope.
keyPoints:
  - Each weight wⱼ uses the matching feature xⱼ.
  - b has its own derivative and update.
  - The normal equation is specific to linear regression and becomes slow with many features.
formula: wⱼ = wⱼ − α(1/m)Σ(f_w,b(x⁽ⁱ⁾) − y⁽ⁱ⁾)xⱼ⁽ⁱ⁾
selfTest:
  - type: short-answer
    prompt: Which feature appears in the update for wⱼ?
    answer: xⱼ.
  - type: short-answer
    prompt: Why is gradient descent preferred over the normal equation for large problems?
    answer: It scales better and applies beyond linear regression.
---

The multi-feature cost function is still squared error. Gradient descent changes every **wⱼ** and **b** simultaneously, using the error on each example and the relevant feature value.

The normal equation can solve linear regression directly, but it does not generalize to many other models and becomes expensive when the number of features is large.
