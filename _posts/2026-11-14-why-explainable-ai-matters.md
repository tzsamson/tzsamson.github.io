---
title: "Why Explainable AI Matters for German Companies"
date: 2026-11-14 
categories: [Explainable AI]
tags: [xai, eu-ai-act, shap]
image:
  path: /assets/img/posts/xai-cover.png
  alt: Explainable AI cover
---

From August 2026, people affected by high-risk AI decisions in the EU
can ask for an explanation...

## What SHAP does

Some text, then code:

```python
import shap
explainer = shap.Explainer(model)
shap_values = explainer(X_test)
```

![SHAP summary plot](/assets/img/posts/shap-summary.png)