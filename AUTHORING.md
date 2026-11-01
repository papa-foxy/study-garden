# Create topic files from notes

Copy this prompt into an AI chat and paste your notes where indicated.

```text
I will paste my study notes. Turn them into topic files for my study website.

Rules:
- Use plain, simple English.
- Make a topic tree: each topic has an id, a parent, and a one-line summary.
- For each topic, write: a short explanation, 3-5 key points, common mistakes (if any).
- For each topic, create a before / after. Choose the best type:
  text-compare, image-compare, steps, timeline, table-compare, diagram-compare.
  Write both sides and a short caption for each.
- Add 2-4 self-test questions per topic (types: flashcard, multiple-choice,
  fill-blank, short-answer, match-pairs, order-steps).
- Add "related" links between topics that connect.
- Output one Markdown file per topic using this exact format: [paste the format from section 5].
- Also output subject.json.

Here are my notes:
[paste notes]
```
