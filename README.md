# Study Garden

A small, mobile-first study website for one learner. The study engine reads subjects and topics from files, so subject-specific content can be added without changing the React app.

## Run locally

```sh
npm install
npm run dev
```

Build the static site with `npm run build`. Check Markdown topic files with `npm run validate`.

## Add a subject

1. Add `content/<subject-id>/subject.json` with the subject ID, name, color, description, type, root topic ID, and optional plugin IDs.
2. Add Markdown topic files under `content/<subject-id>/topics/`.
3. Set every topic's `parent` to another topic ID in the same subject. Use an empty parent for the root.
4. Run `npm run validate` to check the content structure and links.

The topic loader supports Markdown explanations, key points, common mistakes, vocabulary, related topics, self-tests, and the shared before/after visual types. Progress and theme settings stay in this browser's local storage.

## Included content and tools

- Library for Machine Learning and English.
- Machine Learning Week 1 topics, including the supervised and unsupervised branches, summarized from the materials in `C:\Learning Material\Machine Learning by DeepLearning.AI\Week 1`.
- 6 English sample topics to demonstrate subject-independent content.
- The original Week 1 mind maps, copied into `public/content/machine-learning/` for the Machine Learning overview.
- Collapsible topic trees with URL-linked detail panels and full topic pages.
- Text compare, step-through, and data-driven SVG visuals.
- Four small interactive ML demos and two English demos.
- Three question types, saved progress, light/dark theme, and text scaling.

Content and demos are optional. A topic still works without either.
