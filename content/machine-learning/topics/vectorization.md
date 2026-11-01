---
id: vectorization
title: Vectorization
parent: ml-week-one
oneLine: Compute whole arrays at once for cleaner and faster machine-learning code.
related: [model-and-parameters]
beforeAfter:
  type: text-compare
  before: ["for j in range(n):", "  f += w[j] * x[j]", "f += b"]
  after: ["f = np.dot(w, x) + b"]
  beforeCaption: A loop handles one element at a time.
  afterCaption: A dot product expresses the whole calculation at once.
keyPoints:
  - Math notation often starts indexes at 1; Python starts at 0.
  - np.dot(w, x) computes the weighted sum of two vectors.
  - Optimized array routines can use parallel hardware.
formula: f_w,b(x) = w · x + b
selfTest:
  - type: short-answer
    prompt: What Python expression computes a weighted sum of w and x?
    answer: np.dot(w, x)
  - type: short-answer
    prompt: Why is vectorization useful?
    answer: It makes code shorter and usually faster.
---

Vectorization means writing an operation for entire arrays instead of manually handling every number. The vector **w** contains model weights and **x** contains features. Their dot product multiplies matching values and adds the results.

For large feature sets, vectorized code is easier to read and lets libraries such as NumPy use optimized CPU or GPU routines.
