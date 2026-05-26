---
description: Scaffold a new chapter in the Quarto website
allowed-tools:
  - Write
  - Edit
  - Bash(quarto render:*)
---

Create a new chapter from `$ARGUMENTS` (e.g. `/new-chapter intro Introduction`).

First, parse `$ARGUMENTS`: the first whitespace-delimited token is the **slug**
(used for the filename, no `.qmd`); everything after the first space is the
**title** (default the title to the slug if none is given).

Steps:

1. Create `chapters/<slug>.qmd` with YAML frontmatter only (`title:` set to the
   title, `date: today`). Do NOT add a top-level `#` heading in the body — Quarto
   renders the frontmatter `title:` as the page heading, so a `#` heading would
   duplicate it.
2. Add the chapter to `_quarto.yml` under `chapters:` in a logical position.
3. Confirm it renders: `quarto render chapters/<slug>.qmd`.

Style rules (from CLAUDE.md):

- Blank line before every bullet list
- Chunk options via `#|` directives, not inline `r, opt = val`
- `code-fold: true` only when the output — not the code — is the point
