---
name: GNCE Mercury
description: FTC team #26413, each season's robot launched alone on a black stage, then explained on calm light pages.
colors:
  stage: "#0B0A0F"
  stage-raise: "#201E29"
  on-stage: "#EFEEF3"
  on-stage-2: "#C2BFCD"
  paper: "#FFFFFF"
  alu: "#E9E9EE"
  alu-deep: "#DAD9E1"
  line: "#CDCCD6"
  ink: "#16141C"
  steel: "#4A4755"
  quiet: "#7F7C8A"
  ground: "#D3D3DB"
  ink-lift: "#2C2935"
  on-stage-3: "#A09DAC"
  bronze: "#C27A3A"
  silver: "#C3C7CF"
  gold: "#D9AC3C"
  platinum: "#E6E6E4"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, 1rem + 6.2vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.025em"
  machine-name:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 0.9rem + 5.6vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 1.3rem + 3.8vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.15rem + 1.9vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.016em"
  subtitle:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 600
    lineHeight: 1.24
    letterSpacing: "-0.006em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.2
    fontFeature: "'tnum' 1, 'lnum' 1"
rounded:
  sm: "10px"
  md: "14px"
  lg: "18px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 44px)"
  section: "clamp(64px, 8vw, 128px)"
  section-tight: "clamp(44px, 5vw, 76px)"
  max: "1240px"
  header: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "11px 24px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.stage}"
    textColor: "{colors.paper}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "11px 24px"
    height: "46px"
  button-light:
    backgroundColor: "{colors.on-stage}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "11px 24px"
    height: "46px"
  button-light-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-outline-light:
    backgroundColor: "transparent"
    textColor: "{colors.on-stage}"
    rounded: "{rounded.pill}"
    padding: "11px 24px"
    height: "46px"
  toggle:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
    height: "42px"
  toggle-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  text-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "13px 16px"
    height: "50px"
  tile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "clamp(22px, 3vw, 36px)"
  tile-on-white:
    backgroundColor: "{colors.alu}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  stage-tile:
    backgroundColor: "{colors.stage-raise}"
    textColor: "{colors.on-stage}"
    rounded: "{rounded.md}"
    padding: "14px 18px 16px"
  lead-tag:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  chip:
    backgroundColor: "{colors.alu}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
---

# Design System: GNCE Mercury

**Where things live.** The palette, the type scale (`--fs-*`), the radii and the main spacing are custom
properties in `:root` at the top of `css/style.css` (`--stage`, `--alu`, `--fs-lg`, `--r-md`, `--section`,
`--ease` and so on). Change them there, never inside a component rule. (A few one-off values are still typed
straight into rules: the greys #CFCDD8, #BAB8C4, #CBC9D3, #D6D4DE, #B8B6C2 and #A9ADB5, the error red
#B3261E, #8B8896 for the inactive part markers, which repeats `--quiet`, and the smaller 0.875 / 0.8125rem
label sizes.) Interactions (and the budget donut) live in `js/main.js`, each in its own `part("…")` block; the
load animation and every keyframe are in the Motion section at the end of `css/style.css`. The sponsor strip is built in `js/main.js` from `SPONSORS` / `SUPPORTERS`, the season
calendar from `SEASON`. Everything below describes the files as they ship
(round 2, "Keynote stage", with round 3's changes: no scroll motion, a coloured tier chart and budget donut on
the partners page, two-column outreach); it replaces the earlier violet "Season Program" record entirely.

## Overview

**Creative North Star: "The Keynote Stage"**

Each season's robot is launched the way a hardware company launches a product: the machine alone on an
almost-black stage, lit from above, standing on a thin floor line. Then the page steps out into calm white
and aluminium-grey reading pages that explain the robot, the people, the outreach and the partners. Light
is the accent. There is no brand hue: colour comes only from the robots, the photos, the Mercury logo
(kept as-is) and, on the partners page, the sponsorship package's four tier metals and the budget donut's
validated palette (Andy asked for that page to be colourful, like the package).

Two grounds carry the site. The stage (home launch, every season head, the partners package sheet (head, tier
chart and budget donut), and the closing
"join or partner" bands on the home, team and partners pages) and the reading ground (white, with
aluminium-grey bands and tiles). Sections are separated by a change of ground, never by hairlines.
Since round 6 every page is a stack of defined boxes: each section is a rounded panel (28px corners, 20px on phones) on a mid-grey page ground (#D3D3DB) with 12px gaps (8px on phones), and the things inside a section sit on cards of their own. Content sits on flat, filled, rounded tiles (10/14/18px), buttons are pills, and nothing casts a shadow
except a robot on its floor (the only other shadows are the small lift under the chosen outreach year and the
halo around the part markers). One family, Archivo, does everything; robot names are set extra wide (125%).

The neutrals are our own: tinted from the logo's dark outline, not copied. The reference study of Apple,
TechCrunch, Vogue, The New York Times Company and Prada specifically warned against reusing Apple's exact
greys (#F5F5F7, #A1A1A6) and its 28px cards, which is why the values and radii here differ.

**Key Characteristics:**
- Two grounds: the near-black stage for launches and closing calls, white and aluminium grey for reading.
- No brand hue; light, robots, photos, the logo carry the colour, plus the tier metals and the budget palette on the partners page.
- Archivo only: normal width at 600 for headings, 125% width at 700 for robot names, tabular figures for every number.
- Sections are panels on the page ground; items are cards inside them. Flat filled tiles with 10/14/18px corners, pill buttons, no section hairlines, no card shadows.
- Selection shown as light brightening (the chosen robot steps into a spotlight), never as a sliding bar.
- One authored load moment on the stage; everything else answers a click, tap or key. Nothing moves, fades, pins or changes while scrolling.

## Colors

A cool, logo-tinted grey scale from near-black to white, with four metals for the sponsorship tiers and a nine-colour budget palette, both used only on the partners page.

### Primary
- **Logo Outline Ink** (ink): primary text on light grounds, primary buttons, pressed toggles, lead tags, the chosen calendar tile, the best bar in a chart, focus rings on light. It is tinted from the logo's near-black outline, so the "accent" on light pages is simply ink.

### Neutral
- **Stage Black** (stage): the stage ground (`.launch`, `.season-head`, `.band--stage`), the header, the robot mats in the Seasons index and pager, and the hover fill of the primary button.
- **Stage Step** (stage-raise): a step up on the stage: season-fact tiles, the `.ruled` tiles in the home page's closing stage band, the phone partner credit.
- **Stage Light** (on-stage) and **Stage Dim** (on-stage-2): primary and secondary text on the stage (Stage Dim is 7.4:1 on Stage Black, 6.7:1 on Stage Step). Rules on the stage are on-stage at 14% (`--rule-stage`): the line-up card's results rows, the partner-strip top edge, the open menu's rows and, without JavaScript, the lines between the stacked season cards. The floor line is the same light at 16%.
- **Paper** (paper): the default reading ground, form fields, tiles on grey bands, the sponsor tiles.
- **Aluminium** (alu): alternate bands (`band--grey`), tiles on white bands, the footer.
- **Aluminium Deep** (alu-deep): chart tracks, the parts progress track, the pager hover fill.
- **Data Line** (line): 1px separators inside data (table rows, spec rows, contact rows, record lists), the footer divisions, and the 1px borders of toggles and the Copy button.
- **Steel** (steel): secondary text on light (dates, captions, labels, hints); 6:1 on aluminium.
- **Quiet** (quiet): non-text marks only (inactive explorer markers). Never text.

### Tertiary: the tier metals and the budget palette
- **Bronze** #C27A3A, **Silver** #C3C7CF, **Gold** #D9AC3C, **Platinum** #E6E6E4: the header fills of the tier table in the team's 2026–27 sponsorship package (`docs/GNCE-Mercury-Sponsorship-Package-2026-27.pdf`, sampled from page 4), used as solid header blocks with ink text (5.3:1 to 14.6:1) and as each tier's tick colour. Each has a dark wash for its column on the stage (`--bronze-wash` #2C1E17, `--silver-wash` #2C2C32, `--gold-wash` #302717, `--platinum-wash` #323235); every tick is 4.7:1 or more on its wash.
- **Budget palette** (`--budget-travel` … `--budget-first`): #895012, #BC8647, #9E440B, #08A29C, #AE7E02, #97463E, #3F87BD, #6B8E23, #CA7873, one per budget line in ring order. Built with the dataviz method in the package's copper/bronze/gold family, widened by two cool steps (verdigris, blued steel) and an olive for Tools to pass; validated in dark mode on Stage Black: every slice 3:1 or more, worst adjacent pair ΔE 8.4 colour-blind (FIRST/Tools) / 16.9 normal, including the wrap from the last slice to the first, and still passing with the 1% FIRST sliver treated as absent (so Tools and Travel count as neighbours). The package's own nine browns fail the validator, so they are not copied.

### Named Rules
**The Light Is The Accent Rule.** There is no brand colour. Emphasis on the stage is brightness (a spotlight, full colour against dimmed grey); on light pages it is ink and weight. Don't introduce a hue for links, buttons or highlights.

**The Panel Rule.** Every section is a panel on the grey page ground: white panels for reading, aluminium panels for alternate sections, stage panels for launches, every page head, the partners package sheet and the closing calls. The things inside a panel sit on cards in the opposite fill (aluminium cards in white panels, white cards in aluminium panels, Stage Step cards on the stage), and whatever sits inside a card takes the card's opposite (`--card` / `--card-in`, set per panel in css/style.css "Panels and cards"). The footer is a panel too.

**The Metals Stay On The Partners Page Rule.** The tier metals and the budget palette colour the tier chart and the budget donut only. Text never wears them, except the tier names and amounts printed in ink on a metal fill; nowhere else on the site gets a brand colour from them.

## Typography

**Display Font:** Archivo (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Archivo, the same family

Archivo is self-hosted as one variable file, `fonts/archivo-latin.woff2` (Google Fonts latin subset, SIL Open Font License), weight 100–900, width 62–125%. Width is set with `font-stretch`.

**Character:** One quiet, engineered sans at normal width for everything a reader reads; the same face stretched to 125% and set at 700 becomes the team's voice for robot names.

### Hierarchy
- **Display** (600, `--fs-hero` 3–6rem, line-height 0.96, -0.025em): the home h1 "GNCE Mercury" only.
- **Machine name** (700, 125% width): season-head h1 (2.75–5.5rem), line-up card h2 (1.875–3rem), Seasons index rows (1.75–3rem), bay labels (0.875–1.25rem) and the pager (1.3125rem). Robot and game names only.
- **Headline** (600, `--fs-xl` 2.5–4.5rem, line-height 1, -0.022em): inner page h1 and the partners head h1 (normal width there).
- **Title** (600, `--fs-lg` 1.75–2.75rem, line-height 1.08, -0.016em): section h2.
- **Subtitle** (600, `--fs-md` 1.3125rem, line-height 1.24): h3 and `.h3`. Lead paragraphs (`.lead`) use the same size at 400 in steel, line-height 1.42, 54ch.
- **Body** (400, `--fs-base` 1.0625rem, line-height 1.55): running text, held to 62ch (`.prose`).
- **Label** (`--fs-sm` 0.9375rem, or 0.875 / 0.8125rem; 600 for buttons and values, 500 for nav and table heads, 400 for terms and captions): buttons, nav, spec terms, dates, captions. Sentence case, no tracking.

### Named Rules
**The Width Is The Voice Rule.** Only robot and game names go wide (125%, 700). Page titles, section heads and reading text stay at normal width.

**The Fixed-Place Figures Rule.** Every date, amount, spec and result uses tabular lining figures (`<time>` and `.num` get them automatically; spec, facts, figures, budget and season-fact values set them).

## Layout

- **Container:** `.container`, content max 1240px (`--max`) plus a 16–44px fluid gutter (`--gutter`).
- **Vertical rhythm:** `.band` is padded by `--section` (64–128px); `.band--tight` by 44–76px. `.section-head` (heading left, short note right) sits 32–56px above its content.
- **Grids:** `.split` runs 7:5 from 900px (`--flip` 5:7, `--even`, `--center`). `.entries--2/--3` go 1 → 2 columns at 760px → 3 at 1100px. Facts, figures and the calendar use `auto-fit` grids of tiles with a 12px gap; coaches use `auto-fill` (12px gap) and the season facts `auto-fit` with a 10px gap.
- **Home stage (`.launch`):** h1 and team line (from 1200px the head uses the line-up's columns, so the team line starts on the season card's left edge), then the line-up: three bays with the chosen season's card to the right from 1100px; the chosen bay widens (1.7fr desktop, 1.9fr at 720px and under). Below 1100px the card drops under the bays and a short partner credit replaces the partner strip. On short laptops (1100px+ wide, 880px tall or less) the stage tightens, and at 760px tall or less the short plain-text spec list under the results hides, so "Supported by … / Partner with us" stays in the first screen.
- **Header:** sticky, 56px, stage black; turns translucent (80% opacity) with an 18px blur once the page scrolls (a tint change, not movement; it is the only element that reacts to scrolling). The nav collapses into a Menu button at 1080px and under; the header "Partner with us" pill hides at 560px and under.
- **Parts explorer (2025–26 page):** choose a part with its button, its marker or the arrow keys; scrolling never changes it and nothing pins.
- **Breakpoints in use:** 359, 520, 559/560, 700, 720, 760, 800, 860, 900, 960, 1000, 1080 (the menu; 1081 in `js/main.js`), 1099/1100, 1200px; height queries at 760 and 880/881px; a 460px container query on the contact list. Check 320, 390, 768 and 1440px.
- **Photos never larger than their pixels:** wrap a photo in `.photo` with `style="--w: <image width>px"`; entry images use `object-fit: scale-down` in a 16:10 mat unless `.cover`; `.on-black` puts black-background shots on #000.

## Elevation & Depth

The system is flat. Depth comes from the two grounds, from tiles one step lighter or darker than their band, and from light on the stage. Shadow is reserved for things that physically stand somewhere.

### Shadow Vocabulary
- **Robot on the floor** (`filter: drop-shadow(0 22px 22px rgba(0, 0, 0, 0.6))`; 28px/0.65 on season heads, 16px on Seasons index rows): robot cut-outs on the stage only.
- **Spotlight** (a clipped cone `linear-gradient` plus `radial-gradient(45% 16% at 50% 94%, rgba(255,255,255,0.22), transparent 72%)`): the chosen bay; a softer fixed version sits behind the season-head robot and in Seasons index mats.
- **Explorer marker** (`box-shadow: 0 0 0 3px #fff, 0 3px 10px rgba(0,0,0,0.3)`): part markers on the DECODE render, so they read over it.
- **Chosen segment** (`box-shadow: 0 1px 2px rgba(22,20,28,0.08), 0 4px 14px rgba(22,20,28,0.08)`): the selected outreach year pill only.
- **Hover halo** (`box-shadow: 0 0 0 3px rgba(22,20,28,0.14)`, on the stage `rgba(239,238,243,0.28)`): a ring, not a drop shadow, on hovered pill buttons and focused fields.

### Named Rules
**The Flat Tile Rule.** Tiles, cards, menus and panels never cast shadows. A card sits inside a panel (that is the system), but a card never holds another card: inside a card, quotes, chips and photo frames take the opposite fill instead.

## Shapes

Gently rounded and consistent: 10px (`--r-sm`) for small images, the pager's robot mats, inputs, quotes and the part list (`.callouts`); 14px (`--r-md`) for content tiles, photos, facts, spec sheets, events and table wrappers; 18px (`--r-lg`) for captain tiles, the explorer figure and stage media. Every button, toggle, tag, chip, segmented control and chart bar is a pill (`--pill`). Markers are small filled circles (`.dia`, 7px); in the line-up they are 6px, outlined when idle and filled when chosen. No section hairlines: 1px lines appear only inside data (tables, spec rows, results, lists), between the footer's parts and on the stage (floor line, partner-strip edge, menu rows). The one heavier line is the 2px ink rule over each column of `.entries--ruled` ("What you would be supporting" on the partners page; from 760 to 1099px a lone third column spans the row).

## Components

### Buttons
Quiet ink pills; the stage versions invert.
- **Shape:** pill, 46px tall, 11px 24px padding, 1.5px border in the fill colour, 600 at 0.9375rem. Header pill 36px; phone partner credit 42px; open-menu pill 52px.
- **Primary (`.btn`):** ink fill, white text. Hover: stage-black fill plus a 3px soft halo; press scales to 0.97 (200ms).
- **Line (`.btn--line`):** transparent, ink text, #BAB8C4 border; fills ink on hover.
- **On the stage:** `.btn--light` (Stage Light fill, ink text, turns white on hover) for the main action; `.btn--outline-light` (40% on-stage border) for the second.
- **Text link (`.text-link`):** 600, underlined 1px, 2px on hover, for secondary actions ("Join as a student", "See how we built it").
- **Focus:** 2px outline, 3px offset, ink on light and Stage Light on the stage.

### Chips and toggles
- **Toggles** (`.callout-btn`, `.crew-filter button`): paper pill with a 1px Data Line border (aluminium, borderless, on white bands); ink border on hover; pressed = ink fill, white text.
- **Year tabs** (`.year-tabs`): a segmented control on aluminium; the chosen year is a white lifted pill.
- **Lead tag** (`.lead-tag`): ink pill, white, 0.8125rem 600. **Subteam chip** (`.chip`): aluminium pill, ink, 500.

### Cards / Containers
- **Corner Style:** 14px (`--r-md`), 18px for captains and the explorer figure.
- **Background:** the opposite of the band: aluminium tiles on white bands, white tiles on grey bands, Stage Step tiles on the stage. The CSS swaps this automatically for `.tile`, `.facts`, `.figures`, `.event`, `.calendar li`, `.spec`, `.pull`, `.quote`, `.resource-list li`, `.coaches li`, `.contact-list`.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** none; 1px Data Line only between rows inside a tile.
- **Internal Padding:** 18–36px; quotes, the part list and season-fact tiles use 12–18px.

### Inputs / Fields
- **Style:** white, 1px #CBC9D3 border, 10px corners, 50px tall, 13px 16px padding; 600 labels above, a steel hint (the message hint) between the label and the field.
- **Focus:** ink border plus the 3px soft halo; no outline.
- **Choices:** topic radios are 50px rounded tiles; checked = ink edge (border plus 1px inset ring); radios take `accent-color: ink`.
- **Error:** #B3261E text (secret-quote message only).

### Navigation
- **Desktop:** pill links on the stage-black header, #CFCDD8 at 500, 40px tall; hover and current page brighten to white on an 8–12% light fill.
- **Mobile (1080px and under):** a pill Menu button opens a translucent black panel of 56px rows at 1.5rem 600 with stage rules, ending in a full Stage Light "Partner with us" pill. Without JavaScript a plain link row (`.nojs-nav`) shows.
- **Breadcrumbs:** slash-separated, 0.9375rem, at the top of season heads.

### The Season Line-up (signature)
Three bays hold the three robots side by side, oldest first, on one continuous floor line. Each label: a small circle and the season years, the machine name (125%, 700), a status line. With JavaScript the bays become tabs (arrow keys, Home/End): the chosen robot stands full colour in a spotlight cone and its column widens; the others dim to 32% grey and step back. The season card beside them fades in from an 8px blur (520ms). The choice is written to the URL (`?season=2025`); the home page opens on `data-default`. Without JavaScript every season card shows, stacked.

### Season Head
Stage ground, breadcrumb, machine name, lead, the robot cut-out in its fixed spotlight, then a row of Stage Step fact tiles. Robots carry a `view-transition-name`, so in supporting browsers the robot morphs between the home bay, the Seasons index row, the season head and the pager (480ms).

### News and sponsors
- **News post (`.post`, news.html):** one `<article>` per post, newest first; the picture (`.post-media`, 18px corners) beside the story from 900px (5:6), stacked on phones; h2 title, the outreach dateline (date in 600 ink, then the topic), a 1.1875rem lead paragraph, plain paragraphs at 62ch and text links. Sponsor posts name the tier and its range, never an amount.
- **Sponsor card (`.sponsor-card`, partners):** a white card on the grey band per sponsor, highest tier first: the logo (36–48px tall, linking to the sponsor), a tier tag (a pill filled with that tier's metal, ink text, a faint inset ring so Platinum shows on white) with the tier's range, and a link to the thank-you post.
- **Sponsor logos:** dark artwork on a transparent background in `images/sponsors/`, so they sit on the footer's white tiles; a white-on-black logo is converted (luminance to alpha, near-black clipped to fully transparent), never shown on a black box in the footer.

### Data: results, specs, tiers, budget
- **Specs and results:** spec sheets are two-column rows (steel term, 600 tabular value) inside a tile, 1px Data Line between rows. The home results table (date, event, result, robot) sits straight on the band with the same lines; event tiles on season pages give results as term/value pairs (600 values) without lines. Missing values read "TBD" in steel (`.tbd`); missing results show an em dash announced as "Not recorded". The results table stacks at 720px.
- **Tiers (`.tiers`, partners):** a real table on the stage, at most 880px wide, like package page 4: four solid metal header blocks (name 15px/600 and amount 22px/600 in ink, 10px top corners), each column washed in its metal, ticks in the metal, an en dash for "not included" with hidden "Not included" text, 1px stage rules between rows, `table-layout: fixed` with a 36% benefit column. At 640px and under the same table is laid out as a grid: four header blocks, then each benefit on its own line with four cells under it, so all four tiers show down to 320px with no sideways scroll (`role` attributes keep it a table for screen readers).
- **Budget (`.budget` + `.donut`, partners):** a real table, largest line first, is the source and the legend (a 12px swatch per row once the chart is drawn). The `budget-chart` part in `js/main.js` draws a donut from the "Up to" amounts (never from the rounded shares), clockwise from 12 o'clock in table order, inner radius 0.62, 2px Stage Black gaps, "$52,000 / season maximum" in the centre; it is not drawn if the lines do not add up to the total row. Pointing at a slice or a row (or tapping a slice) lights both, dims the rest to 30% and shows that line in the centre. Shares are the package's figures (amount ÷ total, rounded so they add up to 100%); the slices are always drawn from the amounts. Without JavaScript, or in forced-colours mode, the table stands alone. Layout ("Where the money goes"): from 760px the heading, two short paragraphs and the donut sit in the left column (5fr) and the table in the right (7fr, at most 680px), both from the top; below 760px they stack, donut centred. The table caption is visually hidden; the column heads carry the meaning.
- **Transfer bars (`.bars`):** grey bars on an aluminium track, the best value in ink.

### Partner Strip and Sponsor Row
The home stage ends in a partner strip ("Supported by …", a Stage Light "Partner with us" pill, "Join as a student"). Every page's footer, on aluminium, carries Our Sponsors & Supporters, built once in `js/main.js` from `SPONSORS` (logos) and `SUPPORTERS` (names in white tiles, 600), plus an outlined "Become a sponsor" tile. Never remove or move it.

### Motion
One easing, `--ease` `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-in-out` is defined in `:root` but unused).
- **Opening (home, first visit of a session):** the spotlight comes up on the Mercury mark (760ms, from 30% brightness and 94% scale), "GNCE Mercury" rises under it (from 300ms), both fade at 1000ms, then the stage opens like an iris from just under the mark (640ms, `mask` with an animated `--iris` radius) onto the home page, whose own entrance is held back 1.1s to follow it. About 1.7s; a click, tap, wheel or key skips it and pulls the stage's entrance forward. Set by an inline script in index.html's `<head>` (sessionStorage `mercury-intro`; `?intro` replays it); never with reduced motion or without JavaScript; every layer hides itself at the end even if a script fails.
- **Load (stage only, once):** the h1 and line rise 26px (900ms, second line +120ms); the robots step in from 40px and 94% scale one after another (1100ms at 220/340/460ms); the floor line draws from the centre (1200ms); labels, card and partner strip fade in at 640ms. Season and page heads use the same rise; the season-head robot steps in.
- **Page transitions:** cross-page view transitions (`@view-transition { navigation: auto; }`): the page you leave dims and settles back (240ms to 0 opacity, 0.985 scale, 50% brightness), the next one rises 18px into place (520ms, from 90ms); the header has its own `view-transition-name` so it stays put, and season robots glide between pages. Where cross-page transitions are missing, `.page-enter` (set in each page's `<head>`) gives `main` the same rise on load.
- **Scroll:** nothing. No scroll reveals, no scroll-linked effects, no pinned sections, no sticky columns (Andy, round 3). Content is simply there. The only thing that reacts to scrolling is the header tint. While the page scrolls the content also ignores the pointer (`html.is-scrolling`, part "scroll-calm"), so a resting mouse never sets off a hover effect as things pass under it. (A pointer-following light on the stage was tried in round 6 and removed at Andy's request.)
- **Answers to the visitor:** colour changes 160–200ms; segmented tabs 260ms; header tint and menu open 320ms; panels and part notes fade up 8px (420–480ms); filtered crew members fade up 8px (320ms); bay light and robot dim 600–700ms; hovered photos zoom to 1.03 (700ms); a locked quote shakes 600ms. The next calendar event's dot pulses twice.
- **Reduced motion:** every animation and transition is cut to 0.01ms; smooth scrolling and view transitions are off.

## Do's and Don'ts

### Do:
- **Do** change colours, sizes, radii and spacing in `:root` in `css/style.css`, never in a component rule.
- **Do** use the stage only for a launch (home, season heads), the partners head with its tier and budget sheet, and the closing call to join or partner; put everything else on paper or aluminium.
- **Do** put each section in a panel and each item (a write-up, a member, a program, a season, a post, a table) on a card in the opposite fill, with 18px corners and 16–24px padding.
- **Do** make every button, toggle, tag and chip a pill; use `.btn` on light and `.btn--light` / `.btn--outline-light` on the stage.
- **Do** set only robot and game names at 125% width and 700; keep everything else at normal width.
- **Do** give every date, amount, spec and result tabular figures.
- **Do** show a chosen state as light (brighter, full colour, filled dot) and write it to the URL when it is a view someone might share.
- **Do** let new content simply be there: no entrance animation for anything below the first screen.
- **Do** set `--w` to the image's pixel width on every `.photo`.
- **Do** keep the sponsor strip in every footer, built from `SPONSORS` / `SUPPORTERS` in `js/main.js`.
- **Do** add raster images only as the team's own photos or CAD renders, and record how any edited one was made (Assets and Provenance below).

### Don't:
- **Don't** add a brand hue, a purple or violet accent, or neon on black.
- **Don't** copy Apple's exact neutrals (#F5F5F7, #A1A1A6) or its 28px cards; use the tokens here.
- **Don't** separate sections with hairlines; change the ground instead. Lines belong inside data only.
- **Don't** put shadows on tiles, buttons, menus or panels, or put a card inside a card.
- **Don't** use the tier metals or the budget palette outside the partners page's tier chart and donut, and don't set text in them.
- **Don't** add a second font family or system display faces.
- **Don't** put small labels (eyebrows) above headings or number the seasons 01/02/03.
- **Don't** add new load animations outside the stage, counters that tick up, or motion that ignores reduced motion.
- **Don't** generate or invent images, results, sponsors or numbers; leave "TBD" instead.
- **Don't** show a photo larger than its own pixels.

## Assets and Provenance

- **Font:** Archivo variable (weight 100–900, width 62–125%), self-hosted latin subset `fonts/archivo-latin.woff2`, from Google Fonts, SIL Open Font License.
- **Logo:** `images/logo-mark.png` is the emblem cut out onto transparency from `images/logo.png`, a screenshot with chat text and faded copies behind the emblem (commit d5e93d6). Only `logo-mark.png` is used on the site, unchanged in colour.
- **Tier metals:** the four tiers and their colours come from the team's 2026–27 sponsorship package (`docs/GNCE-Mercury-Sponsorship-Package-2026-27.pdf`, Andy's Canva PDF). Since round 3 the four hex values (#C27A3A, #C3C7CF, #D9AC3C, #E6E6E4) are sampled from the tier header fills on its page 4, replacing the darker values the site chose in round 2. The washes are the site's own, picked for 4.7:1 or better metal ticks. The budget palette is the site's own (dataviz-validated); the package's nine slice colours fail the validator and are not used.
- **`images/into-the-deep-robot-cut.webp`:** made from `images/into-the-deep-robot.png` (the robot on black: an older rough cut-out, upscaled 2x in commit 24b928e by a method that is not recorded) with a flood-fill matte of the black background, enclosed gaps inside the robot cleared, leftover specks removed, and a 0.8px feathered alpha edge.
- **`images/mercinator-v1-cut.webp`:** made from `images/mercinator_v1_fullybuilt.png` (team photo) with Canva's background remover; the mask was taken from Canva's preview, upscaled and applied to the original photo.
- **`images/decode-chassis-v2-ink2.jpg`** (shipped on the 2025–26 page) is a variant of `images/decode-chassis-v2.jpg` from an earlier redesign commit; how it was edited is not recorded. Record it here when known.
- **`images/decode-robot-cad.webp`, `decode-transfer.webp`, `decode-turret.webp`, `decode-limelight.webp`:** the team's CAD renders with their white backgrounds removed to transparency (commit a5620f9).
- **Team portraits** (`images/team/*.jpg`, all 4:5): commit 30b6c14 re-cropped eight of the ten (all but Avo's and Margaret's) to matching framing; Tucker's went from 720×900 to 800×1000 in it, from a source that is not recorded. Margaret's comes from the team's sponsorship package (commit 810a339).
- **Outreach photos** `images/mit_lab_1.jpg` and `images/vulcanforms_1.jpg` were shrunk from 1600×1200 to 1400×1050 in commit 30b6c14 (these are the commit's "two photos shrunk").
- **Every other image** is the team's own photo or CAD render, unchanged apart from re-encoding to WebP where a .webp copy exists, as far as the git history records. No image on the site was generated.
