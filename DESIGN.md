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
  box-line: "#C4C3CC"
  ink-lift: "#2C2935"
  on-stage-3: "#A09DAC"
  bronze: "#C2814E"
  silver: "#B9BEC6"
  gold: "#E3BC59"
  platinum: "#EAE8E1"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 0.6rem + 5.2vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 108"
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
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.022em"
    fontVariation: "'wdth' 108"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.15rem + 1.9vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 108"
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
  sm: "0px"
  md: "0px"
  lg: "0px"
  pill: "0px"
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
    backgroundColor: "{colors.ink-lift}"
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
(kept as-is) and, on the partners page, the four sponsorship tiers in the colours of their names (Andy,
2026-11-09: "the sponsorship category should be the color of the tier name"); the budget donut is grey.

Two grounds carry the site. The stage (home launch, every season head, the partners package sheet (head, tier
chart and budget donut), and the closing
"join or partner" bands on the home, team and partners pages) and the reading ground (white, with
aluminium-grey bands). Sections run the full width of the page and are separated by a change of ground, never by hairlines.
Since round 7 (Andy: "reference the VulcanForms website") the things inside a section are boxes drawn like the cells of an engineering spec sheet: white, a 1px #C4C3CC line and near-square 6px corners (Stage Step with a light line on the stage). Nothing floats: the rounded panels on a grey ground from round 6 were removed because Andy said they looked "so AI". Buttons are pills, and nothing casts a shadow
except a robot on its floor (the only other shadows are the small lift under the chosen outreach year and the
halo around the part markers). One family, Archivo, does everything; robot names are set extra wide (125%).

The neutrals are our own: tinted from the logo's dark outline, not copied. The reference study of Apple,
TechCrunch, Vogue, The New York Times Company and Prada specifically warned against reusing Apple's exact
greys (#F5F5F7, #A1A1A6) and its 28px cards, which is why the values and radii here differ.

**Key Characteristics:**
- Two grounds: the near-black stage for launches and closing calls, white and aluminium grey for reading.
- No brand hue; light, robots, photos and the logo carry the colour, and the four sponsorship tiers wear the colour of their names. The budget donut is grey.
- Archivo only: page and section headings in capitals at 108% width and 700 (a lighter second line where the heading has a natural one), 125% width at 700 for robot and game names, sentence-case nav and text links, tabular figures for every number.
- Full-width sections; every item (a write-up, a member, a program, a season, a post, a table, a tile) is a white box with a 1px line and square corners. Square buttons, no section hairlines, no shadows (except the floating header bar once the page scrolls, and the open menu).
- Selection shown as light brightening (the chosen robot steps into a spotlight), never as a sliding bar.
- One authored load moment on the stage; everything else answers a click, tap or key. Nothing moves, fades, pins or changes while scrolling.

## Colors

A cool, logo-tinted grey scale from near-black to white, with four metals for the sponsorship tiers (on the tier headers, ticks and tags only) and a grey budget scale, both on the partners page.

### Primary
- **Logo Outline Ink** (ink): primary text on light grounds, primary buttons, pressed toggles, lead tags, the chosen calendar tile, the best bar in a chart, focus rings on light. It is tinted from the logo's near-black outline, so the "accent" on light pages is simply ink.

### Neutral
- **Stage Black** (stage): the stage ground (`.launch`, `.season-head`, `.band--stage`), the header and the footer, the robot mats in the Seasons index and pager, and the hover fill of the primary button.
- **Stage Step** (stage-raise): a step up on the stage: season-fact tiles, the `.ruled` tiles in the home page's closing stage band, the phone partner credit.
- **Stage Light** (on-stage) and **Stage Dim** (on-stage-2): primary and secondary text on the stage (Stage Dim is 7.4:1 on Stage Black, 6.7:1 on Stage Step). Rules on the stage are on-stage at 14% (`--rule-stage`): the line-up card's results rows, the partner-strip top edge, the open menu's rows and, without JavaScript, the lines between the stacked season cards. The floor line is the same light at 16%.
- **Paper** (paper): the default reading ground, form fields, tiles on grey bands, the sponsor tiles.
- **Aluminium** (alu): alternate bands (`band--grey`), and quotes, chips and photo frames inside a box.
- **Aluminium Deep** (alu-deep): chart tracks, the parts progress track, the pager hover fill.
- **Data Line** (line): 1px separators inside data (table rows, spec rows, contact rows, record lists), the footer divisions, and the 1px borders of toggles and the Copy button.
- **Steel** (steel): secondary text on light (dates, captions, labels, hints); 6:1 on aluminium.
- **Quiet** (quiet): non-text marks only (inactive explorer markers). Never text.

### Tertiary: the tier metals and the budget greys
- **Tier metals** (2026-11-09, at Andy's request: each tier in the colour of its name): Bronze #C2814E, Silver #B9BEC6, Gold #E3BC59, Platinum #EAE8E1, softened from the sponsorship package's #C27A3A, #C3C7CF, #D9AC3C and #E6E6E4. Solid header blocks with ink text (5.7:1 on Bronze, 9.8:1 Silver, 10.1:1 Gold, 14.9:1 Platinum), ticks in the metal (5.5:1 or better on the washes) and the tier tags on sponsor cards. The column washes stay neutral, `--bronze-wash` #1A1820 to `--platinum-wash` #2A2832; a hovered column warms to 30% of its metal. The first metal version also tinted the columns and coloured the donut, and Andy found it AI-looking.
- **Budget greys** (`--budget-travel` … `--budget-first`): #F2F1F5 down to #3A3842, the largest line brightest, in ring order. The 2px stage gaps between slices and the table beside the donut (with its own key squares) carry the identity; no hue.

### Named Rules
**The Light Is The Accent Rule.** There is no brand colour. Emphasis on the stage is brightness (a spotlight, full colour against dimmed grey); on light pages it is ink and weight. Don't introduce a hue for links, buttons or highlights.

**The Spec Box Rule.** Sections are full-width bands (white, aluminium or the stage); every inner page head is a stage band. Inside a section, each item is a box: paper fill, 1px `--box-line`, `--r-md` corners (0 since round 8), on white and aluminium bands alike; on the stage, Stage Step with a 1px light line (`--box-line-stage`). Inside a box, quotes, chips and photo frames are filled aluminium, never boxed again (css/style.css "Boxes"). The footer is a stage band that closes every page the way the header opens it.

**The Metals Name The Tiers Rule.** Each sponsorship tier wears the colour of its name, on its header block (ink text on it), the ticks in its column and its tag on a sponsor card. Nothing else on the site takes a metal: the column washes stay neutral, the budget donut stays grey, and text never wears one.

## Typography

**Display Font:** Archivo (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Archivo, the same family

Archivo is self-hosted as one variable file, `fonts/archivo-latin.woff2` (Google Fonts latin subset, SIL Open Font License), weight 100–900, width 62–125%. Width is set with `font-stretch`.

**Character:** One engineered sans. Since round 8 (after mclaren.com/racing/formula-1) page and section headings are set in capitals at 108% width. A heading with a natural first line splits into two weights: a bold first line and a lighter second line (`<span class="lite">`) that also steps down in tone (Steel on light grounds, Stage Light 2 on the stage), the way McLaren sets "OUR 2026 / F1 DRIVER LINE-UP" in black over grey. A heading without one stays a single line ("Where the money goes", "Become a sponsor"). Robot names stay the widest voice (125%, 700). Only headings and buttons are capitals: nav links, text links and reading text are normal width and sentence case.

### Hierarchy
- **Display** (800, uppercase, 108% width, 2.75–5rem): the home h1 "GNCE Mercury", with its second line "FTC team 26413" at 400 and 1.125–2.125rem.
- **Machine name** (700, 125% width): season-head h1 (2.75–5.5rem; while the head has two columns, 900px and up, capped at 6.8vw so BIOBUZZ never splits), line-up card h2 (1.875–3rem), Seasons index rows (1.75–3rem), bay labels (0.875–1.25rem) and the pager (1.3125rem). Robot and game names only.
- **Headline** (700, uppercase, 108% width, `--fs-xl` 2.5–4.5rem, line-height 1): inner page h1 and the partners head h1 (under about 390px both follow the screen width, capped at 10.2vw, so "GNCE MERCURY" and "RESOURCES" fit a 320px phone; the partners h1 breaks only at its space); a 28×4px bar in the text colour sits above it.
- **Title** (700, uppercase, 108% width, `--fs-lg` 1.75–2.75rem, line-height 0.98): section h2 (capped at 8vw, so under about 350px a long word still fits; with a larger browser default font the cap reaches wider screens, a deliberate trade so headings never overflow). Split into a bold line and a lighter `.lite` line only where there is a natural first line ("Our 2026–27 / sponsors", "From 4 to 17 / FIRST LEGO League teams in Weston"); never with a second line that starts with a filler word ("Contact / us"). Every heading that opens a section carries the 28×4px bar; no heading inside a box does. Card titles set as `h2.h3`, captain names and news post titles stay in sentence case at 600.
- **Subtitle** (600, `--fs-md` 1.3125rem, line-height 1.24): h3 and `.h3`. Lead paragraphs (`.lead`) use the same size at 400 in steel, line-height 1.42, 54ch.
- **Body** (400, `--fs-base` 1.0625rem, line-height 1.55): running text, held to 62ch (`.prose`).
- **Label** (`--fs-sm` 0.9375rem, or 0.875 / 0.8125rem; 600 for values, 500 for table heads, 400 for terms and captions): spec terms, dates, captions in sentence case. Buttons are uppercase, 0.8125rem 600, tracked 0.04em; nav links (0.9375rem 500) and text links (0.9375rem 600) are sentence case.

### Named Rules
**The Width Is The Voice Rule.** Robot and game names go widest (125%, 700). Page and section headings go uppercase at 108%, in two weights where the heading has a natural first line. Reading text, nav and links stay at normal width in sentence case.

**The Fixed-Place Figures Rule.** Every date, amount, spec and result uses tabular lining figures (`<time>` and `.num` get them automatically; spec, facts, figures, budget and season-fact values set them).

## Layout

- **Container:** `.container`, content max 1240px (`--max`) plus a 16–44px fluid gutter (`--gutter`).
- **Vertical rhythm:** `.band` is padded by `--section` (64–128px); `.band--tight` by 44–76px. `.section-head` (heading left, short note right) sits 32–56px above its content.
- **Grids:** `.split` runs 7:5 from 900px (`--flip` 5:7, `--even`, `--center`). `.entries--2/--3` go 1 → 2 columns at 760px → 3 at 1100px. Facts, figures and the calendar use `auto-fit` grids of tiles with a 12px gap; coaches use `auto-fill` (12px gap) and the season facts `auto-fit` with a 10px gap.
- **Home stage (`.launch`):** h1 and team line (from 1200px the head uses the line-up's columns, so the team line starts on the season card's left edge), then the line-up: three bays with the chosen season's card to the right from 1100px; the chosen bay widens (1.7fr desktop, 1.9fr at 720px and under). Below 1100px the card drops under the bays and a short partner credit replaces the partner strip. On short laptops (1100px+ wide, 920px tall or less) the stage tightens (16px under the bar, 32px from 1240px wide and 880px tall; the name at most 72px), and at 760px tall or less the short plain-text spec list under the results hides, so "Supported by … / Partner with us" stays in the first screen.
- **Header:** a white bar (round 8, after McLaren), sticky, 56px tall. Under 720px it is flush and full-width, as McLaren's phone header is; from 720px it floats 10px down on a stage-black strip, lined up with the content (its edges sit 16px outside the content's, so the logo and the button stand on the content edges; max 1272px). Ink logo name, sentence-case nav, an ink "Partner with us" button (outlined on the partners page, where you already are). Once the page scrolls the bar gains a soft shadow (0 8px 24px, 18%, easing over 200ms) and the strip above it stays stage-black, as McLaren's black strip does; nothing in the header moves. The nav collapses into a Menu button at 1080px and under: a white panel under the bar with a shadow, over a 55% stage scrim that dims the page (a click on it closes the menu). The header button hides at 560px and under, and only then does the menu carry its own (outlined, like the one in the bar, on the partners page). The controls in the header carry a negative scroll margin, so taking focus never scrolls the page under them.
- **Parts explorer (2025–26 page):** choose a part with its button, its marker or the arrow keys; scrolling never changes it and nothing pins.
- **Reading width:** running text keeps `.prose` (62ch); a paragraph beside a photo (`.split > div > p`) and the closing help list keep 66ch, and 54ch below 900px where the columns stack (in Archivo 1ch is the wide "0", so 54ch holds about 65 characters). The spec sheet's title row is exempt: it runs the full width of its box.
- **Breakpoints in use:** 359, 520, 559/560/561, 700, 719/720 (the floating header), 760, 800, 860, 900, 960, 1000, 1080 (the menu; 1081 in `js/main.js`), 1099/1100, 1200px; height queries at 760, 880 and 920/921px; a 460px container query on the contact list. Check 320, 390, 768 and 1440px.
- **Photos never larger than their pixels:** wrap a photo in `.photo` with `style="--w: <image width>px"`; entry images use `object-fit: scale-down` in a 16:10 mat unless `.cover`; `.on-black` puts black-background shots on #000. The home outreach section lets its two photos lead (`.entries--photos`, round 8): side by side at one height from 760px (7fr / 5fr, cropped to 7:5 and 1:1), with no box around them and the stories underneath, each shown at about half its pixel width.

## Elevation & Depth

The system is flat. Depth comes from the two grounds, from tiles one step lighter or darker than their band, and from light on the stage. Shadow is reserved for things that physically stand somewhere.

### Shadow Vocabulary
- **Robot on the floor** (`filter: drop-shadow(0 22px 22px rgba(0, 0, 0, 0.6))`; 28px/0.65 on season heads, 16px on Seasons index rows): robot cut-outs on the stage only.
- **Spotlight** (a clipped cone `linear-gradient` plus `radial-gradient(45% 16% at 50% 94%, rgba(255,255,255,0.22), transparent 72%)`): the chosen bay; a softer fixed version sits behind the season-head robot and in Seasons index mats.
- **Explorer marker** (`box-shadow: 0 0 0 3px #fff, 0 3px 10px rgba(0,0,0,0.3)`): part markers on the DECODE render, so they read over it.
- **Chosen segment** (`box-shadow: 0 1px 2px rgba(22,20,28,0.08), 0 4px 14px rgba(22,20,28,0.08)`): the selected outreach year pill only.
- **Focus halo** (`box-shadow: 0 0 0 3px rgba(22,20,28,0.14)`): focused form fields only. Buttons have no hover ring since round 8; they darken or lighten instead.

### Named Rules
**The Flat Tile Rule.** Boxes, menus and buttons never cast shadows, and a box never holds another box: inside a box, quotes, chips and photo frames take a flat aluminium fill instead.

## Shapes

Square, after McLaren (round 8): every corner is 0 (`--r-sm`, `--r-md`, `--r-lg` and `--pill` are all 0px), boxes, photos, buttons, toggles, tabs, tags and chips alike. Markers are small filled circles (`.dia`, 7px); in the line-up they are 6px, outlined when idle and filled when chosen. No section hairlines: 1px lines draw the boxes and sit inside data (tables, spec rows, results, lists), between the footer's parts and on the stage (floor line, partner-strip edge). The heavier marks are the 28×4px bar above page and section headings (never inside a box) and the 2px ink rule over each column of `.entries--ruled`.

## Components

### Buttons
Quiet square ink buttons; the stage versions invert.
- **Shape:** square, 46px tall, 11px 24px padding, 1.5px border in the fill colour, uppercase 0.8125rem 600 tracked 0.04em, ending in a drawn north-east arrow (an SVG mask in `currentColor`, 0.72em) that nudges 2px up and right on hover with a mouse. A mail link (`mailto:`) or a submit button opens your mail app rather than a page, so it has no arrow; a download has a drawn down arrow that nudges 2px down. Header button 36px; phone partner credit 42px; open-menu button 52px.
- **Primary (`.btn`):** ink fill, white text. Hover: the lighter ink fill (Ink Lift), no halo since round 8; press scales to 0.97 (200ms).
- **Line (`.btn--line`):** transparent, ink text, #BAB8C4 border; fills ink on hover.
- **On the stage:** `.btn--light` (Stage Light fill, ink text, turns white on hover) for the main action; `.btn--outline-light` (40% on-stage border) for the second.
- **Text link (`.text-link`):** sentence case, 0.9375rem 600, underlined 1.5px (3px on hover), ending in the drawn arrow (no arrow on a mail link), balanced so the arrow never sits alone on a line, for secondary actions ("Join as a student", "See how we built it").
- **Focus:** a square 2px outline, 3px offset, ink on light and on the white header bar, Stage Light on the stage. The skip link is ink with white text and a white-then-ink double ring, so it shows over the white bar and the stage alike, and it moves keyboard focus into `main`, not only the view. The sponsor logos in the footer sit on white tiles, so their ring is ink.

### Chips and toggles
- **Toggles** (`.callout-btn`, `.crew-filter button`): square paper buttons with a 1px Data Line border (aluminium, borderless, on white bands); ink border on hover; pressed = ink fill, white text.
- **Year tabs** (`.year-tabs`): a square segmented control on aluminium; the chosen year is solid ink with white text.
- **Lead tag** (`.lead-tag`): square ink tag, white, 0.8125rem 600. **Subteam chip** (`.chip`): square aluminium tag, ink, 500.

### Cards / Containers
- **Corner Style:** square (0) for every box.
- **Background:** paper with a 1px `--box-line` border on white and aluminium bands; Stage Step with a 1px `--box-line-stage` border on the stage. Inside a box, quotes, chips and photo frames are aluminium with no border.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px `--box-line` (#C4C3CC) around the box; 1px Data Line between rows inside it.
- **Internal Padding:** 18–36px; quotes, the part list and season-fact tiles use 12–18px.

### Inputs / Fields
- **Style:** white, 1px Quiet border, square corners, 50px tall, 13px 16px padding; 600 labels above, a steel hint (the message hint) between the label and the field.
- **Focus:** ink border plus the 3px soft halo; no outline.
- **Choices:** topic radios are 50px square tiles; checked = ink edge (border plus 1px inset ring); radios take `accent-color: ink`.
- **Error:** #B3261E text (secret-quote message only).

### Navigation
- **Desktop:** sentence-case links (0.9375rem 500) in ink on the white bar, 40px tall, as McLaren's nav is; hover fills aluminium; the current page is 600 with a 3px ink underline (an underline in forced-colours mode).
- **Mobile (1080px and under):** a square Menu button opens a white panel under the bar, aligned with it: 56px sentence-case rows (1.5rem 600) divided by Data Lines, with a shadow and a scrim over the page; a click on the scrim, Esc, or tabbing out closes it. Under 561px it ends in a full-width ink "PARTNER WITH US" button in the same capitals as every button (wider screens keep that button in the bar). Without JavaScript a plain link row (`.nojs-nav`) shows.
- **Breadcrumbs:** slash-separated, 0.9375rem, at the top of season heads.

### The Season Line-up (signature)
Three bays hold the three robots side by side, oldest first, on one continuous floor line. Each label: a small circle and the season years, the machine name (125%, 700), a status line. With JavaScript the bays become tabs (arrow keys, Home/End): the chosen robot stands full colour in a spotlight cone and its column widens; the others dim to 32% grey and step back. The season card beside them fades in from an 8px blur (520ms). The choice is written to the URL (`?season=2025`); the home page opens on `data-default`. Without JavaScript every season card shows, stacked.

### Season Head
Stage ground, breadcrumb, machine name, lead, the robot cut-out in its fixed spotlight, then a row of Stage Step fact tiles. Robots carry a `view-transition-name`, so in supporting browsers the robot morphs between the home bay, the Seasons index row, the season head and the pager (480ms).

### News and sponsors
- **News post (`.post`, news.html):** one `<article>` per post, newest first; the picture (`.post-media`, square) beside the story from 900px (5:6), stacked on phones; h2 title, the outreach dateline (date in 600 ink, then the topic), a 1.1875rem lead paragraph, plain paragraphs at 62ch and text links. Sponsor posts name the tier and its range, never an amount.
- **Sponsor card (`.sponsor-card`, partners):** a white card on the grey band per sponsor, highest tier first: the logo (36–48px tall, linking to the sponsor), a tier tag (a square tag filled with that tier's metal, ink text, a faint inset ring so Platinum shows on white) with the tier's range, and a link to the thank-you post.
- **Sponsor logos:** dark artwork on a transparent background in `images/sponsors/`, so they sit on the footer's white tiles; a white-on-black logo is converted (luminance to alpha, near-black clipped to fully transparent), never shown on a black box in the footer.

### Data: results, specs, tiers, budget
- **Specs and results:** spec sheets are two-column rows (steel term, 600 tabular value) inside a tile, 1px Data Line between rows. The home results table (date, event, result, robot) sits straight on the band with the same lines; event tiles on season pages give results as term/value pairs (600 values) without lines. Missing values read "TBD" in steel (`.tbd`); missing results show an em dash announced as "Not recorded". The results table stacks at 720px.
- **Tiers (`.tiers`, partners):** a real table on the stage, at most 880px wide, like package page 4: four solid metal header blocks (name 15px/600 and amount 22px/600 in ink, square), neutral column washes, ticks in the metal, an en dash for "not included" with hidden "Not included" text, 1px stage rules between rows, `table-layout: fixed` with a 36% benefit column. At 640px and under the same table is laid out as a grid: four header blocks, then each benefit on its own line with four cells under it, so all four tiers show down to 320px with no sideways scroll (`role` attributes keep it a table for screen readers).
- **Budget (`.budget` + `.donut`, partners):** a real table, largest line first, is the source and the legend (a 12px swatch per row once the chart is drawn). The `budget-chart` part in `js/main.js` draws a donut from the "Up to" amounts (never from the rounded shares), clockwise from 12 o'clock in table order, inner radius 0.62, 2px Stage Black gaps, "$52,000 / season maximum" in the centre; it is not drawn if the lines do not add up to the total row. Pointing at a slice or a row (or tapping a slice) lights both, dims the rest to 30% and shows that line in the centre. Shares are the package's figures (amount ÷ total, rounded so they add up to 100%); the slices are always drawn from the amounts. Without JavaScript, or in forced-colours mode, the table stands alone. Layout ("Where the money goes"): from 760px the heading, two short paragraphs and the donut sit in the left column (5fr) and the table in the right (7fr, at most 680px), both from the top; below 760px they stack, donut centred. The table caption is visually hidden; the column heads carry the meaning.
- **Transfer bars (`.bars`):** grey bars on an aluminium track, the best value in ink.

### Partner Strip and Sponsor Row
The home stage ends in a partner strip ("Supported by …", a Stage Light "Partner with us" pill, "Join as a student"). Every page's footer, on the stage, carries Our Sponsors & Supporters, built once in `js/main.js` from `SPONSORS` (logos) and `SUPPORTERS` (names in white tiles, 600), plus an outlined "Become a sponsor" tile. Never remove or move it. The footer's last row (©, team number, and small underlined About · Contact · Terms and privacy links in Stage Light 2) is plain HTML in every page, so it works without JavaScript; the script adds the sponsors strip and page links above it.

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
- **Do** run sections the full width and put each item (a write-up, a member, a program, a season, a post, a table) in a white box with a 1px `--box-line` border, 6px corners and 16–24px padding.
- **Do** keep every corner square, and end buttons and text links with the drawn arrow (none on mail links and submit buttons, a down arrow on downloads); use `.btn` on light and `.btn--light` / `.btn--outline-light` on the stage.
- **Do** set robot and game names at 125% width and 700, page and section headings uppercase at 108% (split into two weights with `<span class="lite">` only where the heading has a natural first line), and everything else, nav and links included, at normal width in sentence case.
- **Do** give every date, amount, spec and result tabular figures.
- **Do** show a chosen state as light (brighter, full colour, filled dot) and write it to the URL when it is a view someone might share.
- **Do** let new content simply be there: no entrance animation for anything below the first screen.
- **Do** set `--w` to the image's pixel width on every `.photo`.
- **Do** keep the sponsor strip in every footer, built from `SPONSORS` / `SUPPORTERS` in `js/main.js`.
- **Do** add raster images only as the team's own photos or CAD renders, and record how any edited one was made (Assets and Provenance below).

### Don't:
- **Don't** add a brand hue, a purple or violet accent, or neon on black.
- **Don't** copy Apple's exact neutrals (#F5F5F7, #A1A1A6) or its 28px cards; use the tokens here.
- **Don't** separate sections with hairlines; change the ground instead. Lines draw boxes and sit inside data, nowhere else.
- **Don't** put shadows on boxes or buttons (the floating header bar's scrolled shadow and the open menu are the exceptions), round a corner, put a box inside a box, or float sections as rounded panels on a grey ground.
- **Don't** add an accent hue, colour the budget donut or tint the tier columns (Andy, 2026-11-09, on colour mockups: "just dont do the color it looks terrible"). The only colour beyond the content is the four tier metals, which he asked for later the same day ("the sponsorship category should be the color of the tier name"); ink does the job McLaren's papaya does.
- **Don't** add a second font family or system display faces.
- **Don't** put small text labels (eyebrows) above headings or number the seasons 01/02/03; the 28×4px bar is the only mark above a heading, and it never goes on a heading inside a box.
- **Don't** add new load animations outside the stage, counters that tick up, or motion that ignores reduced motion.
- **Don't** generate or invent images, results, sponsors or numbers; leave "TBD" instead.
- **Don't** show a photo larger than its own pixels.

## Assets and Provenance

- **Font:** Archivo variable (weight 100–900, width 62–125%), self-hosted latin subset `fonts/archivo-latin.woff2`, from Google Fonts, SIL Open Font License.
- **Logo:** `images/logo-mark.png` is the emblem cut out onto transparency from `images/logo.png`, a screenshot with chat text and faded copies behind the emblem (commit d5e93d6). Only `logo-mark.png` is used on the site, unchanged in colour.
- **Tier metals:** the four tiers and their colours come from the team's 2026–27 sponsorship package (`docs/GNCE-Mercury-Sponsorship-Package-2026-27.pdf`, Andy's Canva PDF). In round 3 the four hex values (#C27A3A, #C3C7CF, #D9AC3C, #E6E6E4) were sampled from the tier header fills on its page 4; since 2026-11-09 the site uses softened versions of them (#C2814E, #B9BEC6, #E3BC59, #EAE8E1) on the tier headers, ticks and tags only. The washes are the site's own, picked for 4.7:1 or better metal ticks. The budget palette is the site's own (dataviz-validated); the package's nine slice colours fail the validator and are not used.
- **`images/into-the-deep-robot-cut.webp`:** made from `images/into-the-deep-robot.png` (the robot on black: an older rough cut-out, upscaled 2x in commit 24b928e by a method that is not recorded) with a flood-fill matte of the black background, enclosed gaps inside the robot cleared, leftover specks removed, and a 0.8px feathered alpha edge.
- **`images/mercinator-v1-cut.webp`:** made from `images/mercinator_v1_fullybuilt.png` (team photo) with Canva's background remover; the mask was taken from Canva's preview, upscaled and applied to the original photo.
- **`images/decode-chassis-v2-ink2.jpg`** (shipped on the 2025–26 page) is a variant of `images/decode-chassis-v2.jpg` from an earlier redesign commit; how it was edited is not recorded. Record it here when known.
- **`images/decode-robot-cad.webp`, `decode-transfer.webp`, `decode-turret.webp`, `decode-limelight.webp`:** the team's CAD renders with their white backgrounds removed to transparency (commit a5620f9).
- **Team portraits** (`images/team/*.jpg`, all 4:5): commit 30b6c14 re-cropped eight of the ten (all but Avo's and Margaret's) to matching framing; Tucker's went from 720×900 to 800×1000 in it, from a source that is not recorded. Margaret's comes from the team's sponsorship package (commit 810a339).
- **Outreach photos** `images/mit_lab_1.jpg` and `images/vulcanforms_1.jpg` were shrunk from 1600×1200 to 1400×1050 in commit 30b6c14 (these are the commit's "two photos shrunk").
- **Every other image** is the team's own photo or CAD render, unchanged apart from re-encoding to WebP where a .webp copy exists, as far as the git history records. No image on the site was generated.
