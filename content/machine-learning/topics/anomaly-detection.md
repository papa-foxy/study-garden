---
id: anomaly-detection
title: Anomaly detection
parent: unsupervised-learning
oneLine: Find examples that look very different from the usual pattern.
related: []
beforeAfter:
  type: visual-example
  kind: anomaly-detection
  beforeCaption: Normal card transactions form a cloud, with one unusually large purchase.
  afterCaption: The unusual transaction is flagged “suspicious”.
  whatChanged: One point stands away from the normal spending pattern.
  whatToNotice: Anomaly detection highlights rare or unexpected examples.
  steps: false
keyPoints:
  - An anomaly is an example that differs from typical data.
  - Fraud detection is one possible use.
  - It is one kind of unsupervised learning.
selfTest:
  - type: multiple-choice
    prompt: What does anomaly detection look for?
    options:
      - Unusual examples
      - The average label
      - A straight line only
    answer: Unusual examples
  - type: short-answer
    prompt: Name one use for anomaly detection.
    answer: Finding possible fraud or other unusual events.
---

Anomaly detection looks for examples that differ from the usual pattern. It can help flag possible fraud or unusual system events for a closer look.
