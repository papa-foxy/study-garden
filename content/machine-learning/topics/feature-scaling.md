---
id: feature-scaling
title: Feature scaling
parent: ml-week-one
oneLine: Put features on comparable ranges so gradient descent can move directly to the minimum.
related: [learning-rate]
beforeAfter:
  type: text-compare
  before: ["size: 300–2,000", "bedrooms: 0–5", "narrow, zig-zag cost contours"]
  after: ["size and bedrooms: similar ranges", "rounder contours", "more direct progress"]
  beforeCaption: Very different feature ranges distort the cost surface.
  afterCaption: Similar ranges make gradient descent converge faster.
keyPoints:
  - Large-valued features often need small weights; small-valued features often need large weights.
  - Unscaled contours can form a narrow ravine.
  - Scaling usually speeds gradient descent and rarely harms it.
selfTest:
  - type: short-answer
    prompt: Why can unscaled features slow gradient descent?
    answer: They create stretched contours that make updates zig-zag.
  - type: short-answer
    prompt: What does scaling try to make comparable?
    answer: Feature ranges.
---

House size may range from hundreds to thousands, while bedrooms range from zero to five. That mismatch makes the cost function much more sensitive to one weight than another, so gradient descent bounces across a narrow valley.

Feature scaling changes inputs so their values have similar ranges. The contours become more balanced, and gradient descent can head toward the minimum more directly.
