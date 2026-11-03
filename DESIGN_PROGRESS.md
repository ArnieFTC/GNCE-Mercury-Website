# Design progress — GNCE Mercury website

Checkpoint for website design work. Read this before starting, update it after each round.
(Reading it is a convention set in `CLAUDE.md`; nothing loads it automatically.)

_Last updated: 2026-11-03. **Full redesign** ("Motorsport season program") built across all pages; see
"Latest verification" for what was checked. Work is committed straight to `main`, Andy's standing
instruction; `main` is the live site._

## What happened

1. **Rounds 1–3 (earlier on 2026-11-03)** refined the old dark "Rolex-style" design: commits `9a8dc6e`,
   `58bcfff`, `0d4e84d` (critique 23 → 29/40). The full notes for those rounds are in this file's git history
   (`git show 0d4e84d:DESIGN_PROGRESS.md`).
2. **Andy's verdict:** "your barely changed anything… I wanted you to use the skills to help me completely
   redesign the website, forget about what is currently on there, the only thing I want you to keep is
   content." He asked for something professional, somewhat interactive and not AI-looking, built after
   studying at least five big-company websites, with /vercel, Impeccable and frontend-design.
3. **This redesign** replaces the whole visual world, layout, components and interactions. Kept: every piece
   of content (text, facts, photos, renders, quotes), the Mercury logo, the sponsor strip on every page,
   the special-quotes lock, and the behaviour students rely on (`SEASON`, `SPONSORS`, crew filter links).

## Goal and audiences (from `PRODUCT.md`)

| Audience | What they need | Primary action |
|---|---|---|
| **Sponsors and donors** (first screen is theirs) | Is this a real, credible team? What does support pay for? | **Partner with us** → `partners.html` |
| Prospective students and parents | Who is on the team, what would I do, how do I join? | **Join as a student** → `contact.html?topic=join` |
| Judges and other FTC teams | How each robot works and changed | Season pages, Resources |

Andy's answers (2026-11-03): first screen for **sponsors**; keep **only the Mercury logo** from the old brand;
must not feel like **a generic tech startup** or **childish**; signature interaction **season story**;
direction **Motorsport season program** (picked from Impeccable's direction cards).

## Reference study (7 sites)

McLaren, Mercedes-AMG F1, Boston Dynamics, SpaceX, Apple, Rolex and Porsche were captured with Playwright at
desktop and phone widths and compared. What all of them do:
- one subject, one headline and one action on the first screen; a visible h1;
- one typeface in two or three weights, a neutral ground, one accent kept for interactive things;
- sections separated by a change of background, not by boxes;
- credibility from specific, dated facts; history told as uniform dated entries;
- no counters, no scroll-jacking, nothing that moves on its own except a deliberate video.
None of them puts sponsors in the first screen; for Mercury the strip goes directly under the hero, inside the
first screen (Boston Dynamics' placement), with names typeset and a "Partner with us" action.
Traps to avoid: neon on black, gradient text, frosted buttons, fade-up on every section, counters,
unmaintained live widgets, autoplay, stretched phone photos, a desktop nav hidden behind a hamburger,
copying McLaren's orange and notched corners or Apple's blue cards.

## Design plan (frontend-design two-pass plan, reviewed against the brief)

**Palette** (named hex values; tokens in `css/style.css` `:root`)

| Name | Hex | Role |
|---|---|---|
| Livery violet | `#2A2346` | The launch panel, season heads, partner panels |
| Lavender stripe | `#B9A6F2` | The livery stripe and accents on violet |
| Paper / paddock grey | `#FFFFFF` / `#F2F2F0` | Everything else, alternating by section |
| Ink | `#1C1A26` | Text (the logo's outline colour, not a generic #111) |
| Steel | `#585C65` | Secondary text |
| Action violet | `#5B3FC4` | Links and buttons on light grounds |

**Type**: one family, Archivo (variable width and weight, self-hosted). Machine names and the team name are
set wide and heavy (125% width, 800+ weight) like a livery; headings at 112% width; text at normal width.
Tabular figures for every date, spec and result. Sentence case; no all-caps labels except the official game
names (DECODE, INTO THE DEEP, BIOBUZZ).

**Shape**: square corners, hairline rules for data only, the logo's diamond as the one marker (selected
season, awards, next event, part markers, radio buttons).

**Layout**
```
[logo GNCE Mercury]        Seasons Team Outreach Partners Resources Contact [Partner with us]
┌──────────────────────────── violet launch panel ─────────────────────────────┐
│ GNCE Mercury (h1, wide)                              team line (one sentence) │
│ ┌ bay ──────┬ bay ──────┬ bay ──────┐  DECODE                                 │
│ │ robot     │ robot ✦   │ robot     │  2025–26, our second season…            │
│ │───floor───│───floor───│───floor───│  Dec 14  Ryken RoboBowl  Winning all.   │
│ │◇ 2024–25  │◆ 2025–26  │◇ 2026–27  │  Jan 24  WNEU  Sustain Award            │
│ │INTO THE.. │DECODE     │BIOBUZZ    │  3 specs · See how we built it          │
│ └───────────┴───────────┴───────────┘                                         │
│ ═══ lavender stripe ═══  Supported by SolidWorks, Weston Owl and WEEFC  [Partner with us] │
└──────────────────────────────────────────────────────────────────────────────┘
[The record so far: dated results table + three impact figures]
[The 2026–27 season so far: calendar from SEASON]  [Team]  [Outreach]  [Join / partner]  [footer + sponsors]
```
Season pages: violet season head (name, line, robot, facts row) → the robot and spec sheet → parts explorer
→ mechanisms → software → events → previous/next season.

**Review against the generated-design clusters** (what changed after the first plan):
- The first plan numbered the season tabs 01/02/03. The year ranges already carry the order, so the numbers
  were dropped (craft floor: numbers only when the sequence is information).
- Near-black + one accent (cluster 2) was the old site; the new ground is white/grey with a violet field.
- Hairline rules (cluster 3) are kept only where they separate data: results, specs, events, calendar.
- No eyebrow labels, no middle-dot meta strings, no mono "technical" labels, no "→" glyphs (cluster 5).
- The impact numbers are shown at data size, not as a hero metric, and are not animated.

**Motion**: only in answer to the visitor. Choosing a season lights its robot (the others dim and step back)
and slides its card in; choosing a part moves the marker; filters and tabs swap content; a robot glides into
its season page (cross-document view transition). Nothing on load, nothing on scroll, nothing loops.
Reduced motion makes every change instant.

## Decisions and conflicts

- **Default season in the line-up:** DECODE (2025–26), because it carries the dated record sponsors look
  for. Switch `data-default` to 2026 when BIOBUZZ has results.
- **Section numbers vs the direction contract:** the contract mentioned numbered tabs; the craft floor
  wins (see above).
- **Robot images:** INTO THE DEEP was cut out of its black background (`into-the-deep-robot-cut.webp`); the
  Mercinator was cut out with Canva's background remover (`mercinator-v1-cut.webp`, mask upscaled from
  Canva's preview and applied to the original photo). DECODE's CAD render already had transparency.
- **Sponsor content** moved from `contact.html#support` to a new `partners.html`; `contact.html#support`
  still exists and points there, so old links work.
- **Without JavaScript** every page shows a plain nav (`<noscript>`); the footer and sponsor strip are still
  built by `js/main.js` so that `SPONSORS` stays a single list.
- **"Join as a student"** stays the student action everywhere; "Partner with us" is the sponsor action.

## Blocked: needs facts, assets or accounts from the team

- ⊘ B1 A sharp wide team photo (≥ 2400 px wide). The Ryken photo is shown at its real 927 px until then.
- ⊘ B2 Joining facts: who can join (grades/schools), meeting schedule, time commitment, cost.
- ⊘ B3 Sponsoring: tiers or amounts, a donation link, a sponsor packet, an adult contact.
- ⊘ B4 A form service (e.g. Formspree) so the contact form sends without a mail app; needs a team account.
- ⊘ B5 Sources for "1,000 students directly impacted", "$8,000+ raised", "100,000+ students reached".
- ⊘ B6 Coach photos (the coaches are listed by name only).
- ⊘ B7 Resources links: code, CAD, portfolio, build log.
- ⊘ B8 2026 MA States results (alliance and awards show "—").
- ⊘ B9 Partner logos (SolidWorks, Weston Owl, WEEFC are typeset names until logo files arrive) and one true
  sentence per partner about what they gave.
- ⊘ B10 Better robot images: a clean side-on photo of each robot on a plain background would make the
  line-up sharper (the INTO THE DEEP cut-out comes from an older rough cut-out; the Mercinator one from an
  upscaled mask).
- ⊘ B11 Which other members code: the Software filter shows only Arnie (Software Lead) until members get a
  Software chip.

## Skills and checks actually used

- **frontend-design**: not installed in this environment (the Skill call failed; the plugin install card was
  shown). Its published guidance was **applied directly, not invoked**: the two-pass plan above, the cluster
  review, and the restraint rules.
- **Impeccable 4.8.0**: invoked. `init` wrote `PRODUCT.md`; `new-work` ran: reference study, `concept-seed`
  roll (`--scope direction --mode persuade`, seed:cb4434602c5788c2), direction cards answered by Andy,
  `surface-brief write` (`.impeccable/surfaces/index-html.md`, direction contract), craft floor read before
  every UI edit, detector, finish review, documenter (see "Latest verification").
- **/vercel**: invoked via the Skill tool. The live guidelines were fetched (HTTP 200; identical to the
  bundled snapshot, so no fallback). The audit itself ran inside two review sub-agents applying every rule
  to all 10 pages plus `css/style.css` and `js/main.js`; each finding was re-checked by a separate verifier.
- **Page building:** I built the system, the home page and the DECODE page; four sub-agents converted the
  other pages from the old content (`git show 0d4e84d:<file>`) under one written brief, and I merged and
  reviewed their work.

## Latest verification

Redesign round, 2026-11-03 (Playwright Chromium against a local static server):

- **Render audit**, all 10 pages at 320 / 390 / 768 / 1440: no horizontal overflow, no console or page
  errors, no failed requests, one `h1` per page, no skipped heading levels, no image missing `alt`.
  Targets under 24 px are only links inside sentences and the contact radios (their whole 48 px label is
  the target), which WCAG 2.5.8 allows.
- **Interaction tests: 45 of 45 pass** (scratchpad `itest2.js`): the line-up tabs (click, arrow keys, Home/
  End, card swap, no navigation on a plain click), the next event and calendar from `SEASON`, the
  sponsor strip and "Supported by" line from `SUPPORTERS`, the partner strip inside the first screen at
  1440×900 and 1366×768, no animation under reduced motion, every season card and robot visible without
  JavaScript, the phone menu (opens, Esc closes and returns focus), the DECODE parts (6 buttons, notes, arrow
  keys, diamonds out of the tab order and on the render), the crew filter and `?crew=` links, the special-
  quotes lock (opens, wrong password message), outreach tabs, `#year-1` links and no video autoplay,
  `?topic=join|sponsor` on the contact form and an empty submit stopping at Name, no image painted wider than
  its pixels on any page, and every internal link and anchor resolving.
- **Contrast** measured on the rendered pages: all visible text passes WCAG AA on every page.
- **Impeccable detector** on the rendered pages (desktop and 390 px): 0 anti-patterns. The file-only hook
  still reports "low-contrast #c4bcdf on #ffffff" and "cramped-padding section.band"; both are static
  misreads (it cannot see the violet bands or the container gutter) and were left standing, not suppressed.
- **Finish review** (Impeccable finish reviewer, then an independent verifier): first attempt stopped at the
  evidence check because my full-page captures were taken while scrolled; recaptured, then reviewed.
  Verdict: "at desktop the build meets the direction contract… nothing in it looks like generic AI output".
  Confirmed fixes, all applied:
  - the impact figures were styled as a hero-metric row → now set as data, label first;
  - results-table cells were flex boxes (rules misaligned) → table cells again;
  - an eyebrow year above each name on Seasons → removed;
  - phones lost the partner strip and the line-up → a partner credit under the bays, and the chosen bay
    widens;
  - the partners page opened on a plain white head → it opens on the violet partner panel with a facts row;
  - the contact topic diamonds touched their box edge → padding restored.
  Rejected after verification: the PYT call screenshot (added by Andy before the redesign), the repeated
  Ryken team photo (the only team photo, blocker B1), the near-black footer ground (documented instead).
- **/vercel audit**: 20 findings confirmed and fixed, 13 rejected as not applicable. Fixed:
  - focus could slip behind the open phone menu (P1);
  - focus on the contact radios was invisible;
  - hover states lowered contrast;
  - `touch-action` and `overscroll-behavior` were missing;
  - the breadcrumb separator was read aloud;
  - proper names lacked `translate="no"`;
  - names and dates broke across lines;
  - "—" now reads as "Not recorded";
  - two passive sentences;
  - the copy button gave no failure message;
  - long `mailto:` messages could be cut short;
  - the year tabs ignored `hashchange`;
  - the special-quotes reveal stole focus;
  - partners photo priority.
- **Content fidelity** (diff of every old page against the new site, plus a trace of every new factual
  claim): nothing lost, nothing invented. Fixed:
  - "every event" overstated the record → "every qualifier and championship";
  - "Learning from engineers" → "…from scientists and engineers";
  - three camp photos were cropped → shown whole;
  - the old `#robot` and `#countdown` anchors → restored.
- **Not tested:** real iOS/Android devices, screen readers, Safari and Firefox (Chromium only).

## Next action

1. Ask Andy for the blocked facts and assets (B1–B11), above all partner logos, sponsor tiers or packet,
   a donation link, and sources for the three impact figures.
2. Ideas the finish reviewer raised as the design's ceiling (not defects), for a later round if Andy wants
   more: the team number 26413 used as a livery number on the launch panel, the logo's diamond as a large
   mark, the lavender stripe as a real band of livery, and a floor or plinth in the garage bays.
3. When BIOBUZZ has results, switch `data-default` on the home line-up to 2026 and add its events.
4. For every change: check at 320/390/768/1440 with keyboard and reduced motion, run `/vercel` on the changed
   files, push to `main`.

The scratchpad test scripts (`audit.js`, `itest2.js`, `cscan.js`, `states.js`) live outside the repo and
won't survive a new session. Recreate them from the checks listed above if needed.
