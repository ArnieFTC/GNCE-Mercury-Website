---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["team.html","seasons.html","seasons/2024-2025.html","seasons/2025-2026.html","seasons/2026-2027.html","outreach.html","contact.html","resources.html"]
---

# Surface brief: GNCE Mercury website (home + all pages)

Scope: full redesign of every page; content and the Mercury logo kept, everything else replaced.
Visitor mode: Persuade (home, partners); Read (season pages, outreach, resources); Operate (contact form).
Audience and job: sponsors first (is this team credible and worth funding? how do I help?), then
students/parents (join), then judges/other teams (how each robot works and changed).
Action: "Partner with us" (sponsor pitch + email), "Join the team" (contact form, topic preselected).
Proof: three robots in three seasons, dated results (Think, winning alliance, Sustain, States), named
supporters, outreach programs with dates and photos, engineering write-ups.
Constraints: static HTML/CSS/JS, self-hosted fonts, no build step, sponsor strip in every footer,
WCAG 2.2 AA, works without JS, phone photos never shown larger than their pixels.
Reference study: 7 sites (McLaren, Mercedes-AMG F1, Boston Dynamics, SpaceX, Apple, Rolex, Porsche);
traps to avoid are recorded in DESIGN_PROGRESS.md.
Memorable moment: the season launch line-up; choosing a season spotlights its machine and swaps in its results.
Unresolved: sponsor packet/tiers, donation link, join facts, stat sources (see DESIGN_PROGRESS.md Blocked).

## Direction contract

THESIS: Present GNCE Mercury as a sponsor-funded racing team: each season's machine is launched, specified and
raced, and partners are credited for what they made possible. It refuses the dark tech-startup hero (neon,
counters, card grid) and the club page (photo banner, about-us, logo wall).

OWN-WORLD: The team's livery taken from its logo: a deep Mercury-violet field (#2A2346) for the launch and
partner panels, clean white and paddock grey (#F2F2F0) for everything else, steel grey text, and a bright
lavender livery stripe (#B9A6F2) on violet with an action violet (#5B3FC4) on white. One family, Archivo,
wide and heavy for machine names, plain for text. Square corners, the logo's diamond as the only marker,
tabular figures for every spec and date.

STORY: A sponsor sees within seconds that this is a real team with three machines, a dated record and
named partners, and how to become one. Students see the people and how to join. Judges reach each season's
engineering in one click.

FIRST VIEWPORT: The header carries the logo, the nav and a violet "Partner with us" button. Below it, a
violet launch panel fills most of the screen:
- the h1 "GNCE Mercury", the team line under it;
- three garage bays holding the three robots side by side at one scale;
- numbered season tabs (01 2024–25 · 02 2025–26 · 03 2026–27) under the bays;
- the chosen season's results and specs on the right.
The partner strip ("Supported by SolidWorks, Weston Owl and WEEFC", "Partner with us") sits at the panel's
foot, inside the first screen.

FORM: Motorsport season program (an F1 team's season launch and partner programme), candidate 1 of 7 on my
list, chosen as the pick card. seed:cb4434602c5788c2

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
