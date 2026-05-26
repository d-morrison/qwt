---
description: Scaffold a new chapter in the Quarto website
allowed-tools:
  - Write
  - Edit
  - Bash(quarto render:*)
---

Create a new chapter. `$ARGUMENTS` is the filename slug (no `.qmd`) and optionally
a title after a space (e.g. `/new-chapter intro Introduction`).

Steps:

1. Create `chapters/$ARGUMENTS.qmd` with YAML frontmatter (`title:`, `date: today`)
   and a first-level section heading matching the title.
2. Add the chapter to `_quarto.yml` under `chapters:` in a logical position.
3. Confirm it renders: `quarto render chapters/<slug>.qmd`.

Style rules (from CLAUDE.md):

- Blank line before every bullet list
- Chunk options via `#|` directives, not inline `r, opt = val`
- `code-fold: true` only when the output — not the code — is the point
