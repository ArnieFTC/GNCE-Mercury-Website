# Design progress — GNCE Mercury website

Checkpoint for website design work. Read this before starting, update it after each round.
(Reading it is a convention set in `CLAUDE.md`; nothing loads it automatically.)

_Last updated: 2026-11-03. Rounds 1–3 done and verified; the final critique and /vercel audit are in, and their confirmed findings are fixed. Work is committed straight to `main`, Andy's standing instruction; `main` is the live site._

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

### Round 2 review findings (2026-11-03)

The review ran as a workflow of 10 agents with no shared context:
- Impeccable Assessment A (design review) and Assessment B (detector plus browser overlay);
- a /vercel audit against the live guidelines;
- a content-truth check;
- hands-on interaction QA;
- for each of those five, a skeptic that tried to refute every finding.

Critique score: **27/40, up from 23**. No P0 or P1 design issues remained; the one P1 was the /vercel
focus-under-header finding, fixed as R1. "Reg." marks regressions introduced by round 1.

| # | Where | Problem | Fix | Reg. | |
|---|---|---|---|---|---|
| R1 | css: html | Shift+Tab could leave focus under the sticky header; the outreach "Next year" button scrolled the tab under it | `scroll-padding-top` on html (replaces `main [id]` scroll-margin) | | ☑ |
| R2 | DECODE callouts | At 1440×900 the part list and note started below the fold | Render on the left, parts and note beside it at ≥1000 px | yes | ☑ |
| R3 | DECODE callouts | The active label covered other diamonds on short screens | Limelight and Chassis labels go below; labels hide when the render is narrower than 330 px | yes | ☑ |
| R4 | DECODE callouts | The note box changed height between parts, moving the page by up to 53 px | Invisible copies of every note size the box | yes | ☑ |
| R5 | DECODE callouts | Six Tab stops; "More on the limelight" | One roving Tab stop with arrows, Home and End; product name kept as written | yes | ☑ |
| R6 | DECODE copy | The shooter RPM range read as if it described the distances; "14 in" read as a preposition; units wrapped | Copy rewritten; "14‑inch"; `&nbsp;` before units | yes | ☑ |
| R7 | DECODE walkthrough | After "More on the Limelight" the sticky stage left the screen | Last card is at least as tall as the stage | yes | ☑ |
| R8 | photo viewer | The first Next did nothing at 320 and 360 px (slides were wider than the track) | Slides can't exceed the track; Next goes to the neighbouring slide | | ☑ |
| R9 | photo curtain | The wipe never animated (clip-path can't interpolate to `none`) | A cover that slides away with `transform` | | ☑ |
| R10 | site-wide | 23 leftover kicker labels above headings; mono used for prose | Software headings fold the topic in; season rows and pagers put the year after the name; outreach dates move under the heading as a dateline (mono for the date only); Resources "Coming soon" tags removed; `.exp`, captain meta, record keys and sheet notes set in sans | | ☑ |
| R11 | contact | Join visitors on phones never saw the joining note; the right column ran about 550 px past the form | The joining note sits under the form; the join hint opens with "Rookies are part of the team from day one" | yes | ☑ |
| R12 | team filter | No coding option, though every join prompt asks about coding | Filters also come from lead roles: "Software" (Arnie, Software Lead) | | ☑ |
| R13 | team filter | Filtered members stayed left-aligned at 641–1000 px | Centred at every column count | yes | ☑ |
| R14 | home | Credentials wrapped 3+1 at 745–985 px; the WNEU awards had no year | 2×2 up to 999 px; years added from the season pages | yes | ☑ |
| R15 | home | The hero foot's middle item was three text runs, and "Instagram ↗" read the arrow aloud; at 1440 the Instagram link sat about 11 px lower than the other two items | One text run with real spaces; ↗ is `aria-hidden`; items aligned | yes | ☑ |
| R16 | home | The photo inside `.hero` broke the hero's first-screen layout; the same credentials were repeated 3 times | Photo moved after the hero; caption trimmed | yes | ☑ |
| R17 | home closing | Both buttons sat under "Students" | Each audience has its own button | | ☑ |
| R18 | copy | Title Case outliers ("The Team", "2nd Season", "Made Playoffs", "Winning Alliance · 1st Pick"); "Ask about joining"; passive sponsor note; "Next competition" for scrimmages; mid-sentence counts in words; straight apostrophes in meta descriptions; "October / 9" break | Sentence case; "Join as a student"; "We thank every sponsor…"; "Next event"; numerals; ’; `&nbsp;` | partly | ☑ |
| R19 | resources | The lead promised code and CAD that are all "on the way" | Lead says what's there now | | ☑ |
| R20 | 2026–27 | Caption said version 1 was unfinished under a "fully built" photo | Caption describes both photos | yes | ☑ |
| R21 | perf | Home robots loaded eagerly; LCP images lazy or without priority on Seasons, Team and 2026–27 | `loading="lazy"` / `fetchpriority="high"` where measured | | ☑ |
| R22 | i18n | Many names still machine-translatable (Limelight, PedroPathing, GNCE Diamond…) | `translate="no"` | partly | ☑ |
| R23 | misc | Ghost buttons had no pressed state; footer "Next event" had no hover; photo buttons had no hover; chip "/" could start a line; no no-JS fallback for the form; sponsor logos had no size | Fixed; the form posts to mailto without JS; SPONSORS takes width/height | | ☑ |
| R24 | footer | Round 2's own change made the footer read "© 2026GNCE Mercury" (found in the visual check) | `translate="no"` on the whole line | round 2 | ☑ |

Refuted by the skeptics, so not changed:
- primary-button hover style (the team's design);
- an unsaved-changes prompt on the contact form (the browser keeps the text when you go back);
- a URL for the selected robot part (each note already links to its card);
- the Resources DECODE link anchor (deliberate);
- the contact-hint layout shift (caused by the visitor's own click).

Considered and left as is:
- the DECODE figures row, which repeats the spec sheet but holds the only "3 sets of gecko wheels" fact;
- "Season Kickoff" on the timeline and "Our Sponsors & Supporters" in the footer, whose case stays unless Andy says so.

### Final review findings (round 3, 2026-11-03)

The final review ran Impeccable A (design review) and B (detector plus overlay) and a /vercel audit, each checked
by a skeptic. A usage limit stopped it once; it was resumed after the reset.

Critique score: **29/40** (it was 23, then 27).

| # | Where | Problem | Fix | Reg. | |
|---|---|---|---|---|---|
| F1 | spec sheets | The key-label rule also hit names nested in values ("Limelight", "Pedro Pathing" turned mono mid-value) | Child combinators: `.specs li > span` | round 2 | ☑ |
| F2 | home credentials | With years added, the row wrapped 3+1 at 1000–1124 px | 2×2 up to 1139 px | round 2 | ☑ |
| V1 | DECODE walkthrough | The photo hover rule replaced the stage crossfade on mouse devices | Hover rule skips the stage | round 2 | ☑ |
| F3 | DECODE, short laptops | Parts and note ran past the fold at 1366×768 and 1280×720 | Tighter season head, 36 px part rows, render capped by screen height on ≤900 px-tall screens | | ☑ |
| B1/V5 | DECODE copy | "0.9 s" split from its unit at 560–570 px | `&nbsp;` before every unit on the page | | ☑ |
| B2 | team captain records | Line height 1.25 | 1.3 | | ☑ |
| CB-1 | 2024–25 lede | One-word last line at 360–390 px | `text-wrap: pretty` for ledes | | ☑ |
| V2–V4 | i18n | Names lost `translate="no"` when the callouts were rebuilt; supporters, Galactic Einsteins, GNCE Diamond, Mercury and Into the Deep were left out | Carried over and added | | ☑ |
| V6 | DECODE intake | Counts in words mid-sentence | "Our first intake, 2 gecko wheels on 2 motors… V2 used 1 motor" | | ☑ |
| V7 | outreach | LCP photo had no priority | `fetchpriority="high"` | | ☑ |
| V8 | header/footer | Menu toggle and logo links had no hover state | Border and underline on hover | | ☑ |
| V9 | countdown | Said "Next event" on event day | Says "Today" | | ☑ |
| minor | outreach datelines | Mono on words ("Ongoing", "Week of") | Mono on the date only | | ☑ |
| minor | captain role lines | Mono costume | Sans, same position and text | | ☑ |
| minor | home | "Meet the team" / "See our outreach" stacked 72 px apart on phones | Even spacing | | ☑ |
| minor | contact | Join link put the form heading under the header | `scroll-margin-top` on the form | | ☑ |

Refuted: hiding the special-quotes feature (it works, and members use it).

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
- ⊘ B12 Which other members code: the Software filter shows only Arnie (Software Lead) until members get a Software chip.
- ⊘ B13 Whether "Resources" stays in the top nav while it mostly links back to the season pages (it's ArnieFTC's addition).
- ⊘ B14 **Decisions for Andy** raised by the final critique:
  1. Wordmark size on short screens: should "Mercury" shrink on laptops under about 820 px tall, so the team
     name line fits the first screen? At full measure it can't fit at 1366×768.
  2. "The record so far": keep the three big numbers, or turn them into one sourced sentence?
  3. Special quotes: keep them public, or reach them only through a link members know?
  4. Season pages: try a less uniform rhythm than eight centred section titles?
  5. Mechanism-card order: the callouts follow the ball path (intake first) but the cards start with the chassis.
     Reorder the cards?
  6. The DECODE "Strategy" card opens with a sentence about code organisation. Move it to the software cards?
  7. "Season Kickoff" (timeline) and "Our Sponsors & Supporters" (footer): sentence case?
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
- **/vercel**: invoked via the Skill tool for the baseline. Round 2 and the final audit followed the same skill
  procedure inside review sub-agents. Live guidelines were fetched each time (HTTP 200) and matched the bundled
  snapshot, so **no fallback was ever needed**. Findings are folded into the F/A, R and round-3 tables.
- **Impeccable critique runs**:
  - baseline 23/40 (dual-agent; snapshot in `.impeccable/critique/`);
  - round 2 27/40 (dual-agent inside the review workflow);
  - final 29/40 (dual-agent; resumed once after a usage limit).
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
- **Round 2** (after the R1–R24 fixes):
  - Render audit of all 9 pages at 320/390/768/1440: no overflow, errors or 404s, one `h1`, no skipped
    heading levels.
  - Interaction tests: **41 of 41 pass** (round 1's 28 plus new ones):
    - ball-path order of the parts;
    - part list and note inside the first screen at 1440×900;
    - equal note height for all parts;
    - one Tab stop for the parts row, and "More on the Limelight";
    - no label covering another diamond at 1280×720, 900×600 and 1000×700;
    - walkthrough stage on screen after the last link;
    - Software filter;
    - photo viewer Next at 320;
    - the outreach Next-year button doesn't hide the focused tab;
    - Shift+Tab through the home page never lands under the header;
    - the hero foot reads as one sentence.
  - Detector: 15 hits, all the known static false positives.
  - Footer and hero-foot text checked in the browser: "© 2026 GNCE Mercury", "Instagram ↗", items level at 1440.
- **Not tested:** real iOS or Android devices and screen readers. Touch was emulated with clicks only.

## Next action

No design work is pending. Next:
1. Ask Andy for the blocked facts and assets (B1–B10, B12, B13) and for the decisions in B14.
2. Fold each answer in as its own small round: edit, check at 320/390/768/1440 with keyboard and reduced motion,
   run `/vercel` on the changed files, push to `main`.
3. Re-run the Impeccable critique after any change that touches layout.

The scratchpad test scripts (`audit.js`, `itest.js`) live outside the repo and won't survive a new session.
Recreate them from the checks listed above if needed.
