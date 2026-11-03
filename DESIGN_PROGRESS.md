# Design progress — GNCE Mercury website

Checkpoint for website design work. Read this before starting, update it after each round.
(Reading it is a convention set in `CLAUDE.md`; nothing loads it automatically.)

_Last updated: 2026-11-03, round 1 implemented and verified; round 2 review next. Work is committed straight to `main`, Andy's standing instruction; `main` is the live site._

## Goal

Make the site feel like a confident, premium team site (the captain asked for "Rolex-style" polish that
doesn't look AI-made) while helping its three audiences do what they came for:

| Audience | Situation | What they need | Primary action |
|---|---|---|---|
| Prospective student + parent | Phone, evenings, after hearing about the team | Is this a real, welcoming team? What would I do? How do I join? | **Join as a student** → `contact.html?topic=join` |
| Sponsor / donor (local business, family) | Desktop, quick credibility check | Results, reach, what money pays for, how to give | **Sponsor us** → `contact.html#support` |
| Judges, other FTC teams | Desktop, engineering interest | How the robots work and changed; outreach evidence | Season pages, Resources |

## Design brief (frontend-design plan, reviewed against the brief)

Pinned by the team (kept): warm near-black page, bone text, the logo's lavender as the only accent,
Newsreader / General Sans / IBM Plex Mono, square photos, pill buttons, the giant "Mercury" wordmark.

**Color roles** (5 values)

| Name | Hex | Role |
|---|---|---|
| Ink | `#0f0e0d` | Page |
| Ink 2 | `#171614` | Image wells, mats, footer |
| Bone | `#ede8df` | Headlines, primary text, primary button |
| Stone | `#bbb4a8` | Body copy, secondary text |
| Lavender | `#b69cff` | The logo's diamond: current / active / award / focus only |

**Type roles**
- Newsreader 300: wordmark, page titles, robot names. Newsreader 400: section and card headings, quotes.
  Newsreader italic: one personality moment, the team's full name under the wordmark.
- General Sans 400/500: body, buttons, labels, form labels, filters, breadcrumbs.
- IBM Plex Mono: **data only**: dates, measurements, spec keys, counts, timer, team number.
- Sentence case everywhere; numerals for counts.

**Layout**
- Left-aligned reading text; centered only for page titles and the closing call.
- Each page title stands alone: no label above it. Season pages open with the robot.
- Home, desktop:
  ```
  [nav ............................................ Sponsor us]
  [◆ States qualifier  ◆ Sustain Award  ◆ Winning alliance  ◆ Think Award]   static credentials row
  [pitch + Join / Sponsor                                     logo]
  [M E R C U R Y  (full measure: the one bold element)]
  [Galactic Narwhal Chicken Effect (italic)   Founded 2024   Instagram]
  [Ryken team photo at its real size (927px)      | caption, bottom]
  [robots: three staged chapters] [record + countdown] [team & outreach] [closing]
  ```
- DECODE season page:
  ```
  [Seasons / 2025–2026]  [DECODE + lede]
  [ robot render with ◆ markers on six parts ]
  [ Chassis  Intake  Transfer  Shooter  Turret  Limelight ]   buttons, arrow keys
  [ Turret: 1:3 herringbone gear on a lazy susan…   More on the turret ——— ]
  ```

**Imagery**: real robots and real people only; never upscale a photo past its pixel size (README rule).

**Interaction**: motion answers the visitor or explains the robots. Focal moments: the wordmark on load,
the robots arriving on the home page, a robot gliding into its season page, and the callouts on the DECODE
render. Photos (max 3 per page) wipe open and data lists draw their hairlines; plain paragraphs and
section headings simply appear. Nothing loops.

**Review against frontend-design's generated-design clusters**
- Near-black + one accent (cluster 2) and tinted near-black (cluster 5): pinned by the team; kept.
- Template chrome (cluster 5) was the free axis the site had spent on defaults. Changed:
  - eyebrow labels that restate the heading are removed;
  - mono goes back to data only;
  - the phone menu is no longer numbered;
  - the "→" glyph is dropped from filled buttons;
  - middle-dot strings are cut where a sentence reads better.
- Hairlines (cluster 3) stay only where they separate data: specs, events, records.

## Acceptance criteria

1. No empty or placeholder UI on a primary page; every visible control works.
2. Nothing auto-moves without a way to stop it (WCAG 2.2.2); reduced motion shows everything, statically.
3. Keyboard: every control reachable with a visible focus ring, no invisible focus stops, Esc closes overlays.
4. No horizontal scroll at 320, 390, 768 or 1440; no console errors, no 404s.
5. One name per action ("Join as a student", "Sponsor us"); headings in sentence case.
6. No invented facts: every claim on the site is the team's own.
7. The DECODE callouts work by tap, mouse and keyboard, and every note links to its mechanism card.
8. /vercel audit of changed files has no unexplained findings; Impeccable critique scores higher than 23/40.

## Prioritized issues (baseline, 2026-11-03)

Status: ☐ open · ☑ fixed · ⊘ blocked (needs the team). All are **existing** issues unless marked *regression*.

### Functional and accessibility

| # | Where | Problem → effect | Correction | Verify | |
|---|---|---|---|---|---|
| F1 | index.html ticker, style.css `.ticker` | Infinite marquee, pausable only by mouse hover → fails WCAG 2.2.2 for keyboard/touch; label ignored by screen readers | Static row of the 4 credentials (team's choice) | Render 320–1440; no animation | ☑ |
| F2 | style.css reduced-motion ticker | Static fallback doesn't wrap → 3 of 4 credentials clipped at 390/768 | Removed with F1; new row wraps | 390 + reduced motion | ☑ |
| F3 | main.js year tabs, style.css:744 | Tab panels focusable (tabIndex 0) with `outline: none` → invisible focus stop | No tabIndex on panels | Tab order test | ☑ |
| F4 | main.js reveals | Focus can land on blocks still at opacity 0 for 150–300 ms | Focus shows the block at once (no delay) | Tab test, computed opacity | ☑ |
| F5 | team.html filter, style.css:497 | Non-matching members dimmed to 2.76:1 text; on phones the 2 matches hide among 8 dim cards | Filter hides non-matches, shows a count, keeps state in the URL (`?crew=CAD`) | Filter test, deep link | ☑ |
| F6 | contact.html form | "Send" is wrong (it opens the mail app); email field spell-checked; "General question" and "Other" overlap | "Open in your email app", `spellcheck="false"`, 4 topics | Render + submit | ☑ |
| F7 | all pages | No `theme-color`, no `color-scheme: dark` → light browser chrome / scrollbars / controls | Add both | Computed style | ☑ |
| F8 | seasons/*.html | Breadcrumb is a `<div>` | `<nav aria-label="Breadcrumb">` | DOM | ☑ |
| F9 | all pages | Brand and robot names get machine-translated | `translate="no"` on names | DOM | ☑ |
| F10 | all pages | Display and text fonts not preloaded → wordmark reflows on load | Preload Newsreader + General Sans 400 | Network panel | ☑ |
| F11 | outreach.html, main.js `frame()` | Hidden-panel and below-fold photos load eagerly | `loading="lazy"`; curtain only forces eager near view | Network | ☑ |
| F12 | style.css | No `touch-action`, tap highlight, or overscroll containment on the phone menu | Add | Computed style | ☑ |
| F13 | main.js reveals | Init interleaves layout reads and DOM writes | Measure first, then write | Code review | ☑ |
| F14 | style.css, main.js | Dead code from an old home layout (`.index-list`, preview plate, `.facts`, `.strip`) | Remove | grep | ☑ |

### Design and content

| # | Where | Problem → effect | Correction | Verify | |
|---|---|---|---|---|---|
| A1 | index.html hero | Empty 21:9 grey box under the wordmark → reads as unfinished | Team chose the Ryken team photo: shown at its real size (927px) with its caption; home "Team" section gets a different photo so it isn't shown twice | Render 390/1440 | ☑ |
| A2 | all page heads, home sections | Eyebrow labels restate the heading ("Community" over "Outreach") | Remove; fold real info (season years) into copy | Render | ☑ |
| A3 | site-wide | Mono used as costume for names, chips, form labels, breadcrumbs, captions | Mono for data only | Render | ☑ |
| A4 | phone menu | Numbered 01–07 though not a sequence | Remove numbers | 390 menu open | ☑ |
| A5 | `.btn` | "→" glued to filled buttons | Remove glyph; hover keeps color change | Hover | ☑ |
| A6 | main.js reveals | Fade/rise on nearly every block (generic) | Quieter, robot-led motion (team's choice) | Scroll test, reduced motion | ☑ |
| A7 | index.html record | Countdown touches the stats (0px gap) and reads as a 4th stat | Separate the two blocks | Render | ☑ |
| A8 | index.html closing | Empty quadrant at 1440 | Recompose: heading with the body, centered against the photo | Render 1440 | ☑ |
| A9 | index.html hero foot | "Instagram" sits ~11px low | Align items | Render | ☑ |
| A10 | site-wide CTAs | "Support us" / "Sponsor us" / "Become a sponsor" for one action | "Sponsor us" everywhere; the mail button says what it does | grep | ☑ |
| A11 | contact, team, seasons | Title Case outliers; "Ten … four" | Sentence case; numerals | grep | ☑ |
| A12 | resources.html | Four "Coming soon" cards and nothing usable | Lead with what exists now (season write-ups), keep the coming-soon list | Render | ☑ |
| A13 | seasons/2025-2026.html | The robot render is a picture, not an explanation | **New interaction:** callouts on six parts, linked to mechanism cards | Tap / mouse / keyboard test | ☑ |
| A14 | contact.html | Join visitors land on a bare form | Short "Joining the team" note using facts already on the site | Render | ☑ |
| A15 | copy | Straight apostrophes | Curly ’ in visible text | grep | ☑ |
| A16 | `.btn.ghost` | Border 2.82:1 | Stronger border | Contrast calc | ☑ |

### Blocked: needs facts, assets or accounts from the team

- ⊘ B1 A sharp wide team photo (≥ 2400 px wide). The Ryken photo is used at its real size until then.
- ⊘ B2 Joining facts: who can join (grades/schools), meeting schedule, time commitment, cost.
- ⊘ B3 Sponsoring: tiers or amounts, a donation link, a sponsor packet, an adult contact.
- ⊘ B4 A form service (e.g. Formspree) so the contact form sends without a mail app; needs a team account.
- ⊘ B5 Sources for "1,000 students directly impacted", "$8,000+ raised", "100,000+ students reached".
- ⊘ B6 Coach photos (four initials plates).
- ⊘ B7 Resources links: code, CAD, portfolio, build log.
- ⊘ B8 2026 MA States results (alliance and awards show "—").
- ⊘ B9 A cleaner cut-out of the INTO THE DEEP robot (current edges are aliased).
- ⊘ B10 Plain-language wording for FTC awards (Think, Sustain) for parents and sponsors.
- ⊘ B11 Without JavaScript there is no nav, footer or sponsor strip (they're built by `js/main.js`);
  a `<noscript>` copy would fork the single `SPONSORS` list, so it's left as a known limitation.

## Decisions and conflicts

- **Questions round:** Impeccable's critique asks the user questions. The team first said to proceed without
  stopping, then asked for the questions. Answers:
  - ticker → static row;
  - empty hero slot → Ryken team photo;
  - motion → quieter, robot-led;
  - scope → all 5 priority issues plus DECODE callouts.
- **Ryken photo vs 21:9 slot:** the photo is 927 × 626. Cropping to 21:9 cuts heads or the robot, and stretching
  breaks the README's "never larger than real pixel size" rule. So it's shown whole, at up to its real width,
  with its caption beside it.
- **/vercel "Title Case"** vs frontend-design "sentence case": the site is mostly sentence case, so sentence case wins.
- **/vercel "second person, avoid first person":** the site is the team speaking ("we"), which is kept.
- **Craft floor "no eyebrow above a heading":** removed everywhere except the co-captain role lines on the team
  page, which the team placed above the names on purpose.
- **README motion rules** are updated to match the quieter motion.
- **Branch:** this task started on `Last-season/summer` with merging kept out of scope. Andy then said to always
  commit to `main`, so round 1 onward is committed to `main`. The branch's only extra commit, the CLAUDE.md
  update, was fast-forwarded into `main`.
- **Footer link** "Become a sponsor" is kept; it reads naturally under the sponsor list, and every other call to
  action says "Sponsor us".

## Skills and checks actually used

- **frontend-design**: not installed in this environment (the plugin card was offered). Its published
  SKILL.md was fetched and **applied directly** (not invoked) for the brief and review above.
- **Impeccable 4.8.0**: invoked via the Skill tool; `impeccable context` ran; references read: craft-floor,
  critique, audit, polish, layout, typeset, clarify, animate, adapt, harden, init, routing.
  - Critique ran dual-agent: design review plus detector/browser. Result: 23/40, P0 0, P1 3.
  - Snapshot: `.impeccable/critique/2026-11-03T03-15-48Z__index-html.md`.
  - Detector: 23 warnings. marquee is real on index; tight-leading and cramped-padding are false positives.
- **/vercel**: invoked via the Skill tool. Live guidelines fetched 2026-11-03 (HTTP 200); identical to the
  bundled snapshot, so **no fallback was needed**. Baseline findings are folded into F/A above.
- **Rendering**: Playwright Chromium at 320/390/768/1440 on all 9 pages. Baseline: no overflow, no console
  errors, no 404s.

## Latest verification

Round 1, 2026-11-03 (Playwright Chromium, local static server):

- **Render audit:** all 9 pages at 320 / 390 / 768 / 1440. No horizontal overflow, no console or page errors,
  no failed requests, one `h1` per page, no skipped heading levels. The only target under 24 px is the inline
  email link in a sentence, which WCAG 2.5.8 allows.
- **Interaction tests:** 28 of 28 pass (script: scratchpad `itest.js`).
  - Home: credentials are still, with no running animations. The hero photo is laid out at its real 927 px.
  - Keyboard focus on a block that hasn't revealed yet shows it at full opacity within 220 ms.
  - DECODE callouts:
    - 6 buttons with the first one pressed, and every diamond sits on the image.
    - Clicking a part shows its note and a link to its card.
    - ArrowRight/ArrowLeft move between parts and wrap around.
    - Clicking a diamond selects its part, and the diamonds are out of the tab order.
    - "More on the limelight" scrolls to its card at 80 px, and the walkthrough shows Limelight.
    - At 390 px, tapping a part works with no overflow.
  - Team filter: Electrical shows 2 of 10 members, writes `?crew=Electrical` and shows a count. All clears it.
    `?crew=cad` opens the CAD filter.
  - Outreach: panels are no longer focus stops; Tab goes from the tab into the first photo button.
  - Reduced motion (index, DECODE, team): `reveal-all` is set and nothing is invisible except the by-design
    inactive part labels and stacked walkthrough images. No animations run.
  - Phone menu: unnumbered, focus moves to the first link, the page is inert, and Esc closes it and returns focus.
  - Contact:
    - `?topic=join` preselects the topic and shows the join hint.
    - "General question" clears the hint.
    - An empty submit stops at Name.
    - A valid submit shows "Opening your email app…".
  - JavaScript off (index, DECODE, team, outreach): nothing is hidden, and the callouts show as a plain list.
- **Impeccable detector:** 23 warnings at baseline, now 16; marquee is gone.
  - All `tight-leading` hits are the 1.3 line-height, which renders at 1.30× (false positive, confirmed in
    the baseline critique).
  - All `cramped-padding` hits are static misreads: the coach initials plates, and the credentials bar,
    whose text has 13 px of inset.
- **Not yet done:** round 2 Impeccable critique and /vercel audit of the changed files.
- **Not tested:** real iOS or Android devices and screen readers. Touch was emulated with clicks only.

## Next action

Round 2: run the Impeccable critique (two isolated assessments) and the /vercel audit on the changed files,
verify the findings, fix the real ones, then run the final critique and audit.
