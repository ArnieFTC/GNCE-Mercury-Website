# GNCE Mercury website — notes for Claude

- The **Our Sponsors** strip is in the footer of every page. It is built once in
  `js/main.js` (the `SPONSORS` list, rendered into the footer). Keep it on every page;
  don't remove or move it unless Andy (AndyDing09) asks.

## Website design and improvement work

When a task is about improving the website's design, UX, copy, accessibility or front-end code:

1. Read `DESIGN_PROGRESS.md` first. It holds the design brief, what has been done, open
   findings and blockers, and the exact next action. Continue from it rather than starting over,
   and update it at the end of each round of changes.
2. Use the three-skill workflow and say plainly which ones actually ran:
   - **frontend-design** for visual direction (if the skill isn't installed, apply its published
     guidance directly and say it was applied, not invoked);
   - **Impeccable** (`.claude/skills/impeccable/`) for critique and the refinement passes
     (layout, typeset, adapt, clarify, animate, polish, harden);
   - **/vercel** (`.claude/skills/vercel/`) to audit the changed files against the live Web
     Interface Guidelines (its bundled `guidelines.md` is only a fallback).
3. Check the rendered pages at about 390, 768 and 1440 px wide plus the narrowest width (320),
   with keyboard and reduced motion, before saying something works.
4. Never invent team facts, results, quotes, sponsors or numbers; list missing ones as blockers.
5. Commit and push website work to `main` (Andy's standing instruction), not to a side branch.
   `main` is the live site, so verify a round before pushing it.
