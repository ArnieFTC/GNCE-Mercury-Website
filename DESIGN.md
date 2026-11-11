---
name: GNCE Mercury
description: FTC team #26413. Every page wears an FTC game's official palette from header to footer (this season's on the site-wide pages, each season's on its own page); the robots are launched on a black stage.
colors:
  stage: "#0A0A0A"
  stage-raise: "#1F1F1F"
  on-stage: "#F4F4F4"
  on-stage-2: "#C9C9C9"
  paper: "#FFFFFF"
  alu: "#EEE9A5"
  alu-deep: "#DFD388"
  line: "#E0D5AD"
  ink: "#111111"
  steel: "#474747"
  quiet: "#6F6F6F"
  box-line: "#BBA13E"
  ink-lift: "#2E2E2E"
  on-stage-3: "#A8A8A8"
  bronze: "#C2814E"
  silver: "#B9BEC6"
  gold: "#E3BC59"
  platinum: "#EAE8E1"
  itd: "#0083AE"
  decode: "#92DBAC"
  biobuzz: "#F7E326"
  biobuzz-pale: "#EEE9A5"
  biobuzz-gold: "#BBA13E"
  decode-amber: "#E5AE32"
  decode-vermilion: "#EA572E"
  decode-teal: "#598290"
  itd-pale: "#ABD8E7"
  itd-yellow: "#F5E565"
  ftc: "#F57E25"
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
  button-season:
    backgroundColor: "{colors.biobuzz}"
    textColor: "{colors.stage}"
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
    backgroundColor: "{colors.paper}"
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
calendar from `SEASON`. The season colours (`--itd`, `--decode`, `--biobuzz`) open the round 9 block near the end of `css/style.css`; the
rest of each game's palette, FIRST Tech Challenge's orange (`--ftc`), the plain greys and the liveries (`--lv-field`,
`--lv-ground`, `--lv-line`, `--lv-mark`, `--lv-tag`, `--lv-glow`, set on `<body>` for each page) are in the round 10
block that ends the file. Everything below describes the files as they ship
(round 2, "Keynote stage", with round 3's changes: no scroll motion, a coloured tier chart and budget donut on
the partners page, two-column outreach); it replaces the earlier violet "Season Program" record entirely.

## Overview

**Creative North Star: "The Keynote Stage"**

Each season's robot is launched the way a hardware company launches a product: the machine alone on an
almost-black stage, lit from above, standing on a thin floor line. Then the page steps out into calm white
and aluminium-grey reading pages that explain the robot, the people, the outreach and the partners.

**Season liveries, wall to wall (round 10; Andy: "i think you can make the entire pages color scene with some
respect to the ftc colors").** Every FTC season has a game, and FIRST gives each game a colour palette of three or
four colours and black. Every page wears one game's palette from its header to its footer, the way a race car
wears a livery that is repainted each year: the site-wide pages wear this season's game (BIOBUZZ: yellow, pale
yellow, gold), and each season's page wears its own game (DECODE: mint, vermilion, slate teal; INTO THE DEEP:
blue, pale blue, yellow). The two pages that show all three games side by side, home and Seasons, keep the black
stage as their head, so the three colours stand on black. A livery fills six jobs: the field (page heads and closing calls: one flat colour
with black type, as on the opening's title card), the ground (the alternate bands), the line (box outlines), the
mark (the signal: the sponsor action, "next", the controls that move things), the tag (above headings) and the
glow (the colour as type on black, in the footer). FIRST Tech Challenge's own orange marks the programme where it
is named: "FTC team 26413" on the home stage and the last row of every page. Round 9 (Andy: "reference the mclaren
page and build more interactive and somewhat colorful page") had put one colour per season on a few blocks, about
1.5% of the screen as on McLaren's page; round 10 puts the palettes on the page. Beyond the liveries, colour comes
from the robots, the photos, the Mercury logo (kept as-is) and, on the partners page, the four sponsorship tiers in
the colours of their names (Andy, 2026-11-09: "the sponsorship category should be the color of the tier name"); the
budget donut is grey.

Three grounds carry the site. The stage (near-black: the home launch, the partners tier chart and budget
donut, the footer, the photo viewer), the field (the page's game colour, flat, with black type: every inner
page head, every season head with its robot standing straight on it, the strip that closes the home stage, and
the closing "join or partner" bands on the home, team and partners pages) and the reading ground (white, with
bands in the livery's pale colour where aluminium grey used to be). Sections run the full width of the page and are separated by a change of ground, never by hairlines.
Since round 7 (Andy: "reference the VulcanForms website") the things inside a section are boxes drawn like the cells of an engineering spec sheet: white, a 1px line in the livery's line colour and square corners (Stage Step with a light line on the stage, white with a black line on a field). Nothing floats: the rounded panels on a grey ground from round 6 were removed because Andy said they looked "so AI". Buttons are square, and nothing casts a shadow
except a robot on its floor (the only other shadows are the small lift under the chosen outreach year and the
halo around the part markers). One family, Archivo, does everything; robot names are set extra wide (125%).

The neutrals are plain: black, white and greys with no colour of their own (until round 10 they leaned violet,
from the logo's outline, which fought the yellow). The reference study of Apple,
TechCrunch, Vogue, The New York Times Company and Prada specifically warned against reusing Apple's exact
greys (#F5F5F7, #A1A1A6) and its 28px cards, which is why the values and radii here differ.

**Key Characteristics:**
- Three grounds: the near-black stage (home launch, partners sheets, footer), the field in the page's game colour with black type (page heads, closing calls), and white with pale livery bands for reading.
- Season liveries, wall to wall: every page wears one FTC game's official palette (this season's on the site-wide pages, each season's on its own page), always as flat solid colour; FIRST Tech Challenge's orange marks the programme in two places. Robots, photos and the logo carry the rest; the four sponsorship tiers wear the colour of their names; the budget donut is grey.
- Archivo only: page and section headings in capitals at 108% width and 700 (a lighter second line where the heading has a natural one), 125% width at 700 for robot and game names, sentence-case nav and text links, tabular figures for every number.
- Full-width sections; every item (a write-up, a member, a program, a season, a post, a table, a tile) is a white box with a 1px line in the livery's line colour and square corners. Square buttons, no section hairlines, no shadows (except the floating header bar once the page scrolls, and the open menu).
- Selection shown as light: the chosen bay's field is lit in its season's colour, the others hold a deep shade of theirs; a chosen story row turns white with a signal-colour marker.
- One authored opening (the line-up title card, once a visit) and one load moment on the stage; everything else answers a click, tap, drag or key. Nothing moves, fades, pins or changes while scrolling.

## Colors

Black, white and plain greys; the three FTC games' official palettes, worn as liveries (one per page); FIRST Tech Challenge's orange for the programme's mark; four metals for the sponsorship tiers (on the tier headers, ticks and tags only) and a grey budget scale, both on the partners page.

### Primary
- **Ink** (ink, #111111): primary text on light grounds, primary buttons, pressed toggles, lead tags, the best bar in a chart, keylines, focus rings on light. Type on a field is pure black (#000): on INTO THE DEEP's blue only pure black passes (4.9:1).

### Neutral
- **Stage Black** (stage, #0A0A0A): the dark ground: the home launch (`.launch`), the partners sheets (`.band--stage.sheet`), the footer, the photo viewer. Inside a field (`.band--stage:not(.sheet)`, `.season-head`) the same token is re-pointed at the livery's field colour, and the tokens for text on the stage at black.
- **Stage Step** (stage-raise, #1F1F1F): a step up on the stage: the bay labels, tiles on the partners sheets. On a field it is white (a box on a field is white inside a black line: season-fact tiles, the two boxes of the home page's closing band).
- **Stage Light** (on-stage) and **Stage Dim** (on-stage-2): primary and secondary text on the stage (Stage Dim, #A8A8A8, is 8.3:1 on Stage Black). Rules on the stage are on-stage at 14% (`--rule-stage`): the line-up card's results rows, the partner-strip top edge, the open menu's rows and, without JavaScript, the lines between the stacked season cards. The floor line is the same light at 16%.
- **Paper** (paper): the default reading ground, form fields, tiles on grey bands, the sponsor tiles.
- **Ground** (alu; the token keeps its old name): the livery's light colour (`--lv-ground`: BIOBUZZ pale yellow #EEE9A5, INTO THE DEEP pale blue #ABD8E7; DECODE's palette has no pale member and its mint #92DBAC is as light as those two, so the mint is its ground as well as its field): alternate bands (`band--grey`), quotes inside a box, the nav's hover, the year tabs. A picture inside a box stands on white (a picture shot on black on black), never on the ground colour.
- **Ground Deep** (alu-deep): the ground mixed 30% toward the line colour: chart tracks, the parts progress track, the pager hover fill.
- **Data Line** (line): 1px separators inside data (table rows, spec rows, contact rows, record lists), the footer divisions, and the 1px borders of toggles and the Copy button.
- **Steel** (steel, #474747): secondary text on light (dates, captions, labels, hints); 9.3:1 on white, 7.5:1 on the pale yellow, 6:1 on the pale blue. On a field it is black.
- **Quiet** (quiet, #6F6F6F): control edges and non-text marks (5:1 on white, 4:1 on the pale yellow, 3.2:1 on the pale blue). Never text.

### Secondary: the three liveries and the programme's orange
- **The palettes** (FIRST's one-page style guide for each game; see Assets and Provenance). BIOBUZZ, 2026–27: yellow #F7E326 (PMS 102 C), pale yellow #EEE9A5 (PMS 600 C), gold #BBA13E (PMS 7753 C). DECODE, 2025–26: mint #92DBAC (PMS 353 C), vermilion #EA572E (PMS 172 C), amber #E5AE32 (PMS 124 C; in the palette, not used on the site), slate teal #598290 (PMS 2212 C). INTO THE DEEP, 2024–25: blue #0083AE (PMS 7704 C), pale blue #ABD8E7 (PMS 635 C), yellow #F5E565 (PMS 106 C). Each has black. Set once in `:root` (`--biobuzz`, `--biobuzz-pale`, `--biobuzz-gold`, `--decode`, `--decode-vermilion`, `--decode-amber`, `--decode-teal`, `--itd`, `--itd-pale`, `--itd-yellow`).
- **A livery** is six tokens on `<body>`: `--lv-field` (page heads, closing calls, the strip the header bar floats on), `--lv-ground` (alternate bands and small fills), `--lv-line` (box outlines; separators are the line colour at 45% on white), `--lv-mark` (the signal colour), `--lv-tag` (the tag above headings), `--lv-glow` (the colour as type on black). BIOBUZZ (plain `body`, every site-wide page and the BIOBUZZ page): yellow / pale yellow / gold / yellow / yellow / yellow. DECODE (`body[data-livery="2025"]`): mint / mint / slate teal / vermilion / vermilion / mint. INTO THE DEEP (`body[data-livery="2024"]`): blue / pale blue / blue / yellow / yellow / pale blue.
- **Type on a field** is black, with no exception: 16:1 on the yellow, 13:1 on the mint, 4.9:1 on the blue (pure black only). The white header bar, the fact tiles and the boxes on a field are white inside a black line, and a photograph on a field has the same line. The Seasons page's head is not a field: like the home stage it is black, because the page shows all three games.
- **The programme's orange** (`--ftc`, #F57E25, PMS 158, from FIRST's brand guidelines): "FTC team 26413" on the home stage (7.4:1 on Stage Black) and the last row of every page, a full-width orange bar with black type (7.9:1). Nowhere else: it is the programme's colour, not the team's or the season's. It never carries white type (2.7:1) and is never type on white.
- **One season's colour on another page**: an element with `data-season="2024|2025|2026"` still gets its season's main colour as `--c` (the home bays, the season cards, the rows of the Seasons page, each a field of its own colour with black type, the pagers, the squares in the record).
- **Lights down:** an unchosen bay holds a deep shade of its own colour, worked out from the colour itself (`--c-dim`: `oklch(from var(--c) 0.3 calc(c * 0.55) h)`; `--c-mid` for the hovered bay), so a new season needs one value. Browsers without relative colours fall back to a 17% mix, then to Stage Step. BIOBUZZ's yellow is the exception: a darkened yellow is olive, so its field with the lights down is the stage's own dark with a 9% trace of yellow. The white pool of light at a robot's feet is weaker on yellow too (`--pool: 0.14` against 0.36), because white can only wash a yellow out. (The pool is on the home bays and in the opening only: a season head and a Seasons row are flat fields.)
- **The signal colour** (`--season`, which is the page's `--lv-mark`; `--on-season` is the text on it, black; `--season-press` its hover, 14% toward black, and for DECODE's vermilion 14% toward white, because darkened it left its black label at 4.1:1): the header's "Partner with us" (the mark with black type where the bar floats on black, mint or blue; where it floats on a strip of the mark's own colour, on the yellow pages, the button is black and the colour is its type: `--cta` / `--on-cta`), the next event in the calendar, the previous/next buttons of the card strip and the photo viewer, the Play video tab, the marker on the chosen story row, the arrow on a strip card and text selection on white and on black (on a field, on the ground, in a pale quote, on the year tabs and on the orange bar selected text is black with white type, because the signal colour would not show there). The 28×8px tag above headings is `--lv-tag` (the mark's colour in all three liveries); on a field the tag is black. Sponsor buttons that stand on a field (the strip under the home stage, the closing bands) are black, so the header's is the one signal button in view. Under 1100px the home line-up's credit box is a dark box with a light button, which takes the signal colour at 560px and under, where the header's is in the menu.
- **To repaint for a new season:** add the new game's colours to `:root`, write its livery block, move the plain `body` selector to it and give last season's page `data-livery` with its year (README, "Start a new season"). To go back to round 9's small blocks of colour, delete the round 10 block.

### Tertiary: the tier metals and the budget greys
- **Tier metals** (2026-11-09, at Andy's request: each tier in the colour of its name): Bronze #C2814E, Silver #B9BEC6, Gold #E3BC59, Platinum #EAE8E1, softened from the sponsorship package's #C27A3A, #C3C7CF, #D9AC3C and #E6E6E4. Solid header blocks with ink text (5.7:1 on Bronze, 9.8:1 Silver, 10.1:1 Gold, 14.9:1 Platinum), ticks in the metal (5.5:1 or better on the washes) and the tier tags on sponsor cards. The column washes stay neutral, `--bronze-wash` #1A1A1A to `--platinum-wash` #2A2A2A; a hovered column warms to 30% of its metal. The first metal version also tinted the columns and coloured the donut, and Andy found it AI-looking.
- **Budget greys** (`--budget-travel` … `--budget-first`): #F2F2F2 down to #3A3A3A, the largest line brightest, in ring order. The 2px stage gaps between slices and the table beside the donut (with its own key squares) carry the identity; no hue.

### Named Rules
**The Season Livery Rule.** Every colour on a page comes from FIRST's palettes: the page's own game for its field, ground, line, mark and tag; another season's main colour only where that season is shown; FTC orange only where the programme is named. Colour is always flat and solid: a whole field with black type, a whole band of the pale ground, a block, a bar, a tag or an arrow. Never a gradient between two colours, never a tint behind single cells or columns of a table, never coloured text on white, never a new hue for links or highlights. Violet stays out (Andy found it AI-like).

**The Keyline Rule.** Every block of the signal colour carries an ink keyline (a 1.5px ink border or inset line), as the yellow shapes in the BIOBUZZ logo do. It keeps a light colour's edge clear on white and on the pale ground (yellow on white is 1.3:1 without it) and is invisible on the stage. What is white on a field has a black line too: the header bar, the fact tiles, the boxes of a closing band, a photograph. Fields that run the full width (heads, bands) and the bays on the stage have no keyline: they are surfaces, not controls. A field that is a box on white (a row of the Seasons page) keeps the box's line, in black.

**The Light Still Leads Rule.** On the stage, emphasis is light: the chosen bay is lit, the others turned down. On light pages it is ink and weight; the signal colour marks actions and the current thing, never ordinary links or text.

**The Spec Box Rule.** Sections are full-width bands (white, the livery's pale ground, a field or the stage); every inner page head is a field. Inside a section, each item is a box: paper fill, 1px `--box-line` (the livery's line colour: gold, slate teal or blue), `--r-md` corners (0 since round 8), on white and ground bands alike; on the stage, Stage Step with a 1px light line (`--box-line-stage`); on a field, white with a black line. Inside a box, quotes and chips are filled with the ground colour and photo frames are white, never boxed again (css/style.css "Boxes"). The footer is a stage band that closes every page: the field's 8px stripe on its top edge, its headings in the livery's glow colour, and FTC orange as its last row.

**The Metals Name The Tiers Rule.** Each sponsorship tier wears the colour of its name, on its header block (ink text on it), the ticks in its column and its tag on a sponsor card. Nothing else on the site takes a metal: the column washes stay neutral, the budget donut stays grey, and text never wears one.

## Typography

**Display Font:** Archivo (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Archivo, the same family

Archivo is self-hosted as one variable file, `fonts/archivo-latin.woff2` (Google Fonts latin subset, SIL Open Font License), weight 100–900, width 62–125%. Width is set with `font-stretch`.

**Character:** One engineered sans. Since round 8 (after mclaren.com/racing/formula-1) page and section headings are set in capitals at 108% width. A heading with a natural first line splits into two weights: a bold first line and a lighter second line (`<span class="lite">`) that also steps down in tone (Steel on light grounds, Stage Light 2 on the stage), the way McLaren sets "OUR 2026 / F1 DRIVER LINE-UP" in black over grey. A heading without one stays a single line ("Where the money goes", "Become a sponsor"). Robot names stay the widest voice (125%, 700). Only headings and buttons are capitals: nav links, text links and reading text are normal width and sentence case.

### Hierarchy
- **Display** (800, uppercase, 108% width, 2.75–5rem): the home h1 "GNCE Mercury", with its second line "FTC team 26413" at 400 and 1.125–2.125rem.
- **Machine name** (700, 125% width): season-head h1 (2.75–5.5rem; while the head has two columns, 900px and up, capped at 6.8vw so BIOBUZZ never splits), line-up card h2 (1.875–3rem), Seasons index rows (1.75–3rem), bay labels (0.875–1.25rem) and the pager (1.3125rem). Robot and game names only.
- **Headline** (700, uppercase, 108% width, `--fs-xl` 2.5–4.5rem, line-height 1): inner page h1 and the partners head h1 (under about 390px both follow the screen width, capped at 10.2vw, so "GNCE MERCURY" and "RESOURCES" fit a 320px phone; the partners h1 breaks only at its space); a 28×8px tag in the signal colour with an ink keyline sits above it (on a season's own page, in that season's colour).
- **Title** (700, uppercase, 108% width, `--fs-lg` 1.75–2.75rem, line-height 0.98): section h2 (capped at 8vw, so under about 350px a long word still fits; with a larger browser default font the cap reaches wider screens, a deliberate trade so headings never overflow). Split into a bold line and a lighter `.lite` line only where there is a natural first line ("Our 2026–27 / sponsors", "From 4 to 17 / FIRST LEGO League teams in Weston"); never with a second line that starts with a filler word ("Contact / us"). Every heading that opens a section carries the 28×8px tag; no heading inside a box does. Card titles set as `h2.h3`, captain names and news post titles stay in sentence case at 600.
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
- **Home stage (`.launch`):** h1 and team line (from 1200px the head uses the line-up's columns, so the team line starts on the season card's left edge), then the line-up: three bays with the chosen season's card to the right from 1100px; the chosen bay widens (1.7fr desktop, 1.9fr at 720px and under). Below 1100px the card drops under the bays and a short partner credit replaces the partner strip. On short laptops (1100px+ wide, 920px tall or less) the stage tightens (16px under the bar, 32px from 1240px wide, or 1200px when 881–920px tall; the name at most 72px), and at 760px tall or less the short plain-text spec list under the results hides, so "Supported by … / Partner with us" stays in the first screen.
- **Header:** a white bar (round 8, after McLaren), sticky, 56px tall. Under 720px it is flush and full-width, as McLaren's phone header is; from 720px it floats 10px down on a stage-black strip, lined up with the content (its edges sit 16px outside the content's, so the logo and the button stand on the content edges; max 1272px). Ink logo name, sentence-case nav, a "Partner with us" button in the signal colour with an ink keyline (outlined ink on the partners page, where you already are). Once the page scrolls the bar gains a soft shadow (0 8px 24px, 18%, easing over 200ms) and the strip above it stays stage-black, as McLaren's black strip does; nothing in the header moves. The nav collapses into a Menu button at 1080px and under: a white panel under the bar with a shadow, over a 55% stage scrim that dims the page (a click on it closes the menu). The header button hides at 560px and under, and only then does the menu carry its own (outlined, like the one in the bar, on the partners page). The controls in the header carry a negative scroll margin, so taking focus never scrolls the page under them.
- **Parts explorer (2025–26 page):** choose a part with its button, its marker or the arrow keys; scrolling never changes it and nothing pins.
- **Reading width:** running text keeps `.prose` (62ch); a paragraph beside a photo (`.split > div > p`) and the closing help list keep 66ch, and 54ch below 900px where the columns stack (in Archivo 1ch is the wide "0", so 54ch holds about 65 characters). The spec sheet's title row is exempt: it runs the full width of its box.
- **Breakpoints in use:** 359, 520, 559/560/561, 700, 719/720 (the floating header), 760, 800, 860, 900, 960, 1000, 1080 (the menu; 1081 in `js/main.js`), 1099/1100, 1200px; height queries at 760, 880 and 920/921px; a 460px container query on the contact list. Check 320, 390, 768 and 1440px.
- **Photos never larger than their pixels:** wrap a photo in `.photo` with `style="--w: <image width>px"`; entry images use `object-fit: scale-down` in a 16:10 mat unless `.cover`; `.on-black` puts black-background shots on #000. The home page's team strip shows portraits at 280–390px tall (800×1000 files) and the team photo at most 927px wide; the outreach stories frame is 4:3 and at most 701px wide for 1400px files.

## Elevation & Depth

The system is flat. Depth comes from the change of ground (stage, field, white, pale ground), from tiles one step lighter or darker than their band, and from light on the stage. Shadow is reserved for things that physically stand somewhere.

### Shadow Vocabulary
- **Robot on its field** (`filter: drop-shadow(0 16px 14px rgba(11, 10, 15, 0.4))` in the bays; `0 20px 16px / 0.42` on season heads, `0 14px 12px / 0.4` on Seasons index rows, `0 22px 18px / 0.42` in the opening): robot cut-outs on their colour fields only. On a season head and a Seasons row the shadow is not clipped by the picture's box: it fades out on the field.
- **Light pool** (`radial-gradient(72% 58% at 50% 104%, rgba(255,255,255,0.36), transparent 70%)`): the light at the robot's feet on a lit colour field: the chosen bay and every field in the opening. Season heads and Seasons index rows are flat fields without it (round 10).
- **Explorer marker** (`box-shadow: 0 0 0 3px #fff, 0 3px 10px rgba(0,0,0,0.3)`): part markers on the DECODE render, so they read over it.
- **Chosen segment** (`box-shadow: 0 1px 2px rgba(22,20,28,0.08), 0 4px 14px rgba(22,20,28,0.08)`): the selected outreach year pill only.
- **Focus halo** (`box-shadow: 0 0 0 3px rgba(22,20,28,0.14)`): focused form fields only. Buttons have no hover ring since round 8; they darken or lighten instead.

### Named Rules
**The Flat Tile Rule.** Boxes, menus and buttons never cast shadows, and a box never holds another box: inside a box, quotes take a flat fill of the ground colour, chips are white with the box line, and photo frames are white.

## Shapes

Square, after McLaren (round 8): every corner is 0 (`--r-sm`, `--r-md`, `--r-lg` and `--pill` are all 0px), boxes, photos, buttons, toggles, tabs, tags and chips alike. Markers are small filled circles (`.dia`, 7px); in the line-up they are 6px, outlined when idle and filled when chosen. No section hairlines: 1px lines draw the boxes and sit inside data (tables, spec rows, results, lists), between the footer's parts and on the stage (floor line, partner-strip edge). The heavier marks are the 28×8px keylined tag above page and section headings (never inside a box), the 8px marker on the chosen story row, and the 2px ink rule over each column of `.entries--ruled`.

## Components

### Buttons
Quiet square ink buttons; the stage versions invert.
- **Shape:** square, 46px tall, 11px 24px padding, 1.5px border in the fill colour, uppercase 0.8125rem 600 tracked 0.04em, ending in a drawn north-east arrow (an SVG mask in `currentColor`, 0.72em) that nudges 2px up and right on hover with a mouse. A mail link (`mailto:`) opens your mail app and a submit button sends a form rather than opening a page, so neither has an arrow; a download has a drawn down arrow that nudges 2px down. Header button 36px; phone partner credit 42px; open-menu button 52px.
- **Primary (`.btn`):** ink fill, white text. Hover: the lighter ink fill (Ink Lift), no halo since round 8; press scales to 0.97 (200ms).
- **Line (`.btn--line`):** transparent, ink text, #BAB8C4 border; fills ink on hover.
- **On the stage:** `.btn--light` (Stage Light fill, ink text, turns white on hover) for the main action; `.btn--outline-light` (40% on-stage border) for the second.
- **On a field:** the same two classes turn black: `.btn--light` is a black button with white text (Ink Lift on hover), `.btn--outline-light` a black outline with black text that fills black on hover.
- **Signal (`.btn--season`, and the header button):** the signal colour (the page's mark: yellow, vermilion on the DECODE page) with an ink border and black text, for the sponsor action only ("Partner with us"). The header button takes its two colours from `--cta` and `--on-cta`: the mark with black type on home, Seasons, DECODE and INTO THE DEEP; black with the mark as its type on the yellow pages, where a yellow button on the yellow strip would read as a window onto the field. Hover (mouse only) steps the mark 14% toward black (the vermilion toward white) and the black button to Ink Lift. A sponsor button that stands on a field (`btn btn--light btn--sponsor`: the strip under the home stage, the closing bands) is a black button at every width.
- **Hover and press (round 9):** with a mouse a button steps up 1px (150ms); pressed, any button, arrow or tab scales to 0.97 (90ms).
- **Text link (`.text-link`):** sentence case, 0.9375rem 600, underlined 1.5px (3px on hover), ending in the drawn arrow (no arrow on a mail link), balanced so the arrow never sits alone on a line, for secondary actions ("Join as a student", "See how we built it").
- **Focus:** a square 2px outline, 3px offset, ink on light and on the white header bar, Stage Light on the stage, black on a field. The skip link is ink with white text and a white-then-ink double ring, so it shows over the white bar and the stage alike, and it moves keyboard focus into `main`, not only the view. The sponsor logos in the footer sit on white tiles, so their ring is ink.

### Chips and toggles
- **Toggles** (`.callout-btn`, `.crew-filter button`): square paper buttons with a 1px Data Line border (aluminium, borderless, on white bands); ink border on hover; pressed = ink fill, white text.
- **Year tabs** (`.year-tabs`): a square segmented control on the ground colour; the chosen year is solid ink with white text.
- **Lead tag** (`.lead-tag`): square ink tag, white, 0.8125rem 600. **Subteam chip** (`.chip`): square white tag with a 1px line in the box-line colour, ink, 500 (so a member's card has one kind of tinted fill, its quotes).

### Cards / Containers
- **Corner Style:** square (0) for every box.
- **Background:** paper with a 1px `--box-line` border on white and ground bands; Stage Step with a 1px `--box-line-stage` border on the stage; white with a black line on a field. Inside a box, quotes are the ground colour, chips white with the box line, and photo frames white.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px `--box-line` (the livery's line colour: gold #BBA13E, slate teal #598290 or blue #0083AE) around the box; 1px Data Line (the line colour at 45% on white) between rows inside it.
- **Internal Padding:** 18–36px; quotes, the part list and season-fact tiles use 12–18px.

### Inputs / Fields
- **Style:** white, 1px Quiet border, square corners, 50px tall, 13px 16px padding; 600 labels above, a steel hint (the message hint) between the label and the field.
- **Focus:** ink border plus the 3px soft halo; no outline.
- **Choices:** topic radios are 50px square tiles; checked = ink edge (border plus 1px inset ring); radios take `accent-color: ink`.
- **Error:** #B3261E text (secret-quote message only).
- **Sending (contact form):** "Send message" posts the form to `contact.php`, which emails it from the website; the status line beside the button reads "Sending…", then the result ("Thanks, … Your message is on its way to the team …"). A problem with one field is written under that field in ink (600, no colour), linked to it for screen readers, and the cursor goes there; it clears when the field is edited. If the website can't send it, the visitor's email app opens with the message instead; with no answer after 30 seconds the line says the message may or may not have been sent. Email addresses in the line are links. A hidden trap field catches spam robots.

### Navigation
- **Desktop:** sentence-case links (0.9375rem 500) in ink on the white bar, 40px tall, as McLaren's nav is; hover fills the ground colour; the current page is 600 with a 3px ink underline (an underline in forced-colours mode). The bar has a 1.5px black keyline (a bottom line on phones, where it is flush) and floats on a strip of the page's field colour (black on the home page and the Seasons page); scrolled, 10px of that strip stay above it. The pages' `theme-color` is white, the colour of this bar, which is the top of every page on a phone.
- **Mobile (1080px and under):** a square Menu button opens a white panel under the bar, aligned with it: 56px sentence-case rows (1.5rem 600) divided by Data Lines, with a shadow and a scrim over the page; a click on the scrim, Esc, or tabbing out closes it. Under 561px it ends in a full-width ink "PARTNER WITH US" button in the same capitals as every button (wider screens keep that button in the bar). Without JavaScript a plain link row (`.nojs-nav`) shows.
- **Breadcrumbs:** slash-separated, 0.9375rem, at the top of season heads.

### The Season Line-up (signature)
Three bays hold the three robots side by side, oldest first, each on a field of its season's colour, 6px apart. Each label sits in a Stage Step box under its field: a small square and the season years, the machine name (125%, 700), a status line. With JavaScript the bays become tabs (arrow keys, Home/End): the chosen bay's field is lit in the season's full colour with a pool of light at the robot's feet, its label turns white with ink text, and its column widens; the others hold a deep shade of their own colour and their robots dim to 55% grey and step back (hovering one brings it half up). The season card beside them fades in from an 8px blur (320ms, like the colour, the label and the marker; the robots take 420ms), its game name in the season's colour. The stage is as tall with one season chosen as with another: the three cards share one grid cell and the labels take the height of the tallest case (the script tries each choice once), so nothing under the stage moves on a choice. At 360px and under the three bays are equal thirds (a wider chosen bay would leave the others no room for their names). The choice is written to the URL (`?season=2025`); the home page opens on `data-default`. Without JavaScript every field is lit and every season card shows, stacked.

### Season Head
A field in the season's colour: breadcrumb, machine name, lead and the robot cut-out standing straight on the field (no pool of light, no inner block), then a row of white fact tiles with black lines. All type is black, on all three fields. The whole page below wears that game's livery (`<body data-livery>`). Robots carry a `view-transition-name`, so in supporting browsers the robot morphs between the home bay, the Seasons index row, the season head and the pager (480ms).

### Card strip (home: the team)
A row of cards the visitor moves: `<ul class="card-strip" data-strip>` running from the content's left edge off the right edge of the screen. The cards are 280–320px tall. The first card is the team photo (927:626), then one 4:5 portrait card per member the team page shows, each a link to that member (`team.html#their-id`): the photo fills the card, the name (600) and role sit on a dark gradient at the bottom with a signal-colour arrow. Above it, right: previous/next buttons (46px squares in the signal colour with a keyline; grey and `aria-disabled` at either end). A press moves the row by about one screenful and always stops with a card on the content's left edge; a mouse can drag the row (a drag is not a click on a card); a finger swipes it and it settles on a card's edge; Tab walks the cards, and a card that takes the focus half off the screen is brought fully on. It never moves by itself. On paper the cards wrap. (`.strip` alone is the older photo strip in the outreach galleries.)

### Stories (home: outreach)
Four stories from the Outreach page. Under 900px and without JavaScript each is a card (photo, title, date line, one sentence, a link) in a row that scrolls sideways; the row has the card strip's previous/next buttons and mouse drag (`data-strip` on the same element), so a mouse can reach every card. On paper the cards wrap, each with its photo and text. From 900px with JavaScript: one 4:3 frame on the left, the stories as a column of equal rows on the right (title as a button, date line), and under the frame the chosen story's sentence and link. The chosen row is white with an 8px signal-colour marker on its left edge; the others are steel. Choosing a row cross-fades the photo and swaps the text under it (240ms both); the rows never move and the text area keeps the room of the longest story, so nothing shifts under the pointer or further down the page (McLaren's news module works the same way, with fixed rows).

### News cards and the video card (home, news)
Two cards under "Latest news": a 16:9 picture, the date line, the title as a link, the first paragraph. A video with a poster (`<figure data-video>`) gets a "Play video" tab in the signal colour at its bottom-left corner; pressing it hands over to the video's own controls and starts it. Without JavaScript the video simply has its controls.

### Photo viewer
Photos in the outreach galleries and the build photos on the season pages (`.program-media`, or any block marked `data-gallery`) open large in a full-screen `<dialog>` on the opaque stage black: the photo whole and at most at its own size, between the bar above and the caption and arrows below (the stage is one definite grid track, so the photo's `max-height: 100%` has something to measure against), its alt text as the caption, "2 of 4", Close, and previous/next buttons. Arrow keys, a sideways swipe or drag, Esc; a second finger is a pinch, not a swipe. Focus returns to the photo that opened it. Each photo is a button to the keyboard and to screen readers ("View larger: …"), and brightens slightly under the mouse.

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
The home stage ends in a partner strip in this season's field colour ("Supported by …" in black, a black "Partner with us" button, "Join as a student"): the supporters' names are written on the livery, as on a car. Under 1100px the same credit is a dark box under the line-up, between the bays and the season's card; its button is light, and takes the signal colour at 560px and under. Every page's footer, on the stage, carries Our Sponsors & Supporters, built once in `js/main.js` from `SPONSORS` (logos) and `SUPPORTERS` (names in white tiles, 600), plus a "Become a sponsor" tile outlined in white; the footer's headings are in the livery's glow colour and its top edge is an 8px stripe of the field (under a closing field the two are one). Never remove or move it. The footer's last row (©, "FIRST Tech Challenge team 26413, founded 2024", and small underlined About · Contact · Terms and privacy links) is a full-width bar in FTC orange with black type (the row runs from edge to edge and its padding keeps the type in the page's column, so the bar is one painted surface); it is plain HTML in every page, so it works without JavaScript; the script adds the sponsors strip and page links above it.

### Motion
One easing, `--ease` `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-in-out` is defined in `:root` but unused).
- **Opening (home, first visit of a session): the season line-up title card** (round 9; Andy: "make the like loading into it page a lot cooler"). Three colour fields rise from the bottom, one per season (520ms each, the second and third 70 and 120ms later); each robot comes up on its field (640ms from 150ms) and then its year and game name; at 600ms a black strap slides across the fields carrying the logo and "GNCE MERCURY / FTC TEAM 26413" (set exactly as the page's h1, so when it lands it is the h1). After a hold, at 1480ms, every piece flies to its own place on the page underneath (680ms, `cubic-bezier(0.6, 0, 0.2, 1)`): the fields to the bays, the robots to theirs, each word of the name to the same word of the h1, the logo to the header. The pieces fly on black for the first 440ms; then the black behind the card clears (240ms), so the rest of the page comes up around them as they arrive. The strap closes to a black plate behind the name, as wide as the row of fields, so the name is never read against a colour. At about 2.2s the pieces are swapped for the real ones (140ms) while the lights go down on the bays that are not chosen. On phones the name stands on top and the fields are three rows that fly into the three bays (the oldest season rides on top, so each robot stays on its own colour as the rows close up). Only transforms and opacity move. A click, tap, wheel or key ends it within 0.2s: before the flight the card fades; during the flight every piece is put in its place at once. A press on the card goes no further: the card takes the pointer until its pieces have landed and the press's click is swallowed, so it never also presses the link or button lying under it. It never plays with reduced motion, without JavaScript, on a screen under 480px tall, on a slow or data-saving connection, in a tab that is not showing, or when its four pictures and the typeface are not in within 0.9s (then the page simply shows). When it plays on arrival from another page, the cross-page transition is dropped, so the header and the robots are not drawn over the card. If `js/main.js` arrives more than 0.4s late there is no flight (the card fades, and nothing on the page is hidden meanwhile); without the script it still ends on a click and by itself after 3.2s. If the window changes size during the flight, the card just leaves. Set by an inline script in index.html's `<head>` (sessionStorage `mercury-intro`; `?intro` replays it); the card is the `<div class="opening">` at the top of index.html, the flight is part "intro" in `js/main.js`.
- **Load (stage only, once; not on a load where the opening plays):** the h1 and line rise 26px (900ms, second line +120ms); the robots step in from 40px and 94% scale one after another (1100ms at 220/340/460ms); labels, card and partner strip fade in at 640ms. Season and page heads use the same rise; the season-head robot steps in.
- **Page transitions:** cross-page view transitions (`@view-transition { navigation: auto; }`): the page you leave dims and settles back (240ms to 0 opacity, 0.985 scale, 50% brightness), the next one rises 18px into place (520ms, from 90ms); the header has its own `view-transition-name` so it stays put, and season robots glide between pages. Where cross-page transitions are missing, `.page-enter` (set in each page's `<head>`) gives `main` the same rise on load.
- **Scroll:** nothing. No scroll reveals, no scroll-linked effects, no pinned sections, no sticky columns (Andy, round 3). Content is simply there. The only thing that reacts to scrolling is the header tint. While the page scrolls the content also ignores the pointer (`html.is-scrolling`, part "scroll-calm"), so a resting mouse never sets off a hover effect as things pass under it. (A pointer-following light on the stage was tried in round 6 and removed at Andy's request.)
- **Answers to the visitor:** colour changes 150–200ms; a button steps up 1px under the mouse (150ms) and scales to 0.97 when pressed (90ms); segmented tabs 260ms; header tint and menu open 320ms; panels and part notes fade up 8px (420–480ms); filtered crew members fade up 8px (320ms); a bay's field, label and card change in 320ms and its robot in 420ms; a story's photo and text cross-fade in 240ms; the card strip glides to the next card (the browser's smooth scroll); the photo viewer fades in 180ms and each photo 220ms; hovered photos zoom to 1.03 (600–700ms). The next calendar event's dot pulses twice.
- **Reduced motion:** every animation and transition is cut to 0.01ms and its delay to zero; smooth scrolling and view transitions are off; pictures and controls do not change size under the pointer.
- **Forced colours and print:** in forced colours the chosen bay's label, the chosen story's marker, the arrow buttons and the next event get an outline or a bar in the system's colours (fills and keylines are dropped there). On paper the card strip and the stories wrap, and every story keeps its photo and text.

## Do's and Don'ts

### Do:
- **Do** change colours, sizes, radii and spacing in `:root` in `css/style.css`, never in a component rule.
- **Do** use the stage for the home launch, the partners tier and budget sheets and the footer; a field (the page's game colour, black type) for page heads (the Seasons page keeps the stage: it shows all three games), season heads and the closing call to join or partner; put everything else on white or the livery's pale ground.
- **Do** run sections the full width and put each item (a write-up, a member, a program, a season, a post, a table) in a white box with a 1px `--box-line` border, 6px corners and 16–24px padding.
- **Do** keep every corner square, and end buttons and text links with the drawn arrow (none on mail links and submit buttons, a down arrow on downloads); use `.btn` on light and `.btn--light` / `.btn--outline-light` on the stage.
- **Do** set robot and game names at 125% width and 700, page and section headings uppercase at 108% (split into two weights with `<span class="lite">` only where the heading has a natural first line), and everything else, nav and links included, at normal width in sentence case.
- **Do** give every date, amount, spec and result tabular figures.
- **Do** show a chosen state as light (brighter, full colour, filled dot) and write it to the URL when it is a view someone might share.
- **Do** take every colour from FIRST's palettes (the page's game, another season's colour where that season is shown, FTC orange where the programme is named), and re-point the six `--lv-*` tokens rather than colouring components one by one.
- **Do** set type on a field in black, and give anything white on a field a black line.
- **Do** keep the signal colour to its fixed places, always as a solid block with an ink keyline and black text. The colour is type in two places only, both on black: the header's black button on the yellow pages, and the footer's headings.
- **Do** let the visitor drive anything that moves: buttons, drag, swipe, keys. Give every gesture a button and a key.
- **Do** let new content simply be there: no entrance animation for anything below the first screen.
- **Do** set `--w` to the image's pixel width on every `.photo`.
- **Do** keep the sponsor strip in every footer, built from `SPONSORS` / `SUPPORTERS` in `js/main.js`.
- **Do** add raster images only as the team's own photos or CAD renders, and record how any edited one was made (Assets and Provenance below).

### Don't:
- **Don't** add a hue beyond FIRST's palettes (the three games and FTC orange) and the tier metals; no purple or violet accent, no neon on black. Don't use FTC orange for anything but the programme's two marks.
- **Don't** copy Apple's exact neutrals (#F5F5F7, #A1A1A6) or its 28px cards; use the tokens here.
- **Don't** separate sections with hairlines; change the ground instead. Lines draw boxes and sit inside data, nowhere else.
- **Don't** put shadows on boxes or buttons (the floating header bar's scrolled shadow and the open menu are the exceptions), round a corner, put a box inside a box, or float sections as rounded panels on a grey ground.
- **Don't** colour the budget donut or tint the tier columns, and don't use weak tints, gradients or pill-shaped controls (Andy, 2026-11-09, on colour mockups with one accent on pill buttons and tinted table columns: "just dont do the color it looks terrible"). The tier metals he asked for later the same day; the season colours came with round 9, when he asked for a "somewhat colorful" site after McLaren's; whole fields and bands in the games' palettes came with round 10, when he asked for the colour scheme of the entire page to respect the FTC colours.
- **Don't** add a second font family or system display faces.
- **Don't** put small text labels (eyebrows) above headings or number the seasons 01/02/03; the 28×8px tag is the only mark above a heading, and it never goes on a heading inside a box.
- **Don't** add new load animations outside the stage, counters that tick up, anything that moves by itself (a carousel that advances, a ticker), or motion that ignores reduced motion.
- **Don't** generate or invent images, results, sponsors or numbers; leave "TBD" instead.
- **Don't** show a photo larger than its own pixels.

## Assets and Provenance

- **Font:** Archivo variable (weight 100–900, width 62–125%), self-hosted latin subset `fonts/archivo-latin.woff2`, from Google Fonts, SIL Open Font License.
- **Logo:** `images/logo-mark.png` is the emblem cut out onto transparency from `images/logo.png`, a screenshot with chat text and faded copies behind the emblem (commit d5e93d6), unchanged in colour. It stays the icon, the share image and the logo in the structured data. The header, the footer and the opening use `images/logo-mark-240.webp` (round 9): the same file scaled to 240×256 and saved as WebP at quality 92 (17 KB instead of 235 KB).
- **Season colours:** from the "Color Palette" on FIRST's one-page style guide for each game: INTO THE DEEP (FT044: #ABD8E7, #0083AE, #F5E565, black), DECODE (FT045: #E5AE32, #EA572E, #92DBAC, #598290, black), BIOBUZZ (FT046: #EEE9A5, #BBA13E, #F7E326, black). Round 9 used one from each (#0083AE, #92DBAC, #F7E326); since round 10 every member is used except DECODE's amber, and no colour outside the palettes stands in for one (DECODE has no pale member; its mint, as light as the other two games' pale colours, is its ground as well as its field). FIRST Tech Challenge's orange #F57E25 (PMS 158) and FIRST's black are from FIRST's brand guidelines, firstinspires.org/hubfs/web/about/policy/first-brand-guidelines.pdf (read 2026-11-11). Guides: firstinspires.org/resources/library/season-brand-downloads; info.firstinspires.org/hubfs/2025%20Season/Season%20Assets/FIRST_DIVE-FTC-intothedeep-styleguide.pdf; info.firstinspires.org/hubfs/2026%20Season/Season%20Assets/FIRST_AGE-FTC-style-guide.pdf; firstinspires.org/hubfs/web/brand/season/2027/downloads/ftc-biobuzz-styleguide.pdf (read 2026-11-11). The game logos themselves are not used on the site.
- **Tier metals:** the four tiers and their colours come from the team's 2026–27 sponsorship package (`docs/GNCE-Mercury-Sponsorship-Package-2026-27.pdf`, Andy's Canva PDF). In round 3 the four hex values (#C27A3A, #C3C7CF, #D9AC3C, #E6E6E4) were sampled from the tier header fills on its page 4; since 2026-11-09 the site uses softened versions of them (#C2814E, #B9BEC6, #E3BC59, #EAE8E1) on the tier headers, ticks and tags only. The washes are the site's own, picked for 4.7:1 or better metal ticks. The budget palette is the site's own (dataviz-validated); the package's nine slice colours fail the validator and are not used.
- **`images/into-the-deep-robot-cut.webp`:** made from `images/into-the-deep-robot.png` (the robot on black: an older rough cut-out, upscaled 2x in commit 24b928e by a method that is not recorded) with a flood-fill matte of the black background, enclosed gaps inside the robot cleared, leftover specks removed, and a 0.8px feathered alpha edge.
- **`images/mercinator-v1-cut.webp`:** made from `images/mercinator_v1_fullybuilt.png` (team photo) with Canva's background remover; the mask was taken from Canva's preview, upscaled and applied to the original photo.
- **`images/decode-chassis-v2-ink2.jpg`** (shipped on the 2025–26 page) is a variant of `images/decode-chassis-v2.jpg` from an earlier redesign commit; how it was edited is not recorded. Record it here when known.
- **`images/decode-robot-cad.webp`, `decode-transfer.webp`, `decode-turret.webp`, `decode-limelight.webp`:** the team's CAD renders with their white backgrounds removed to transparency (commit a5620f9).
- **Team portraits** (`images/team/*.jpg`, all 4:5): commit 30b6c14 re-cropped eight of the ten (all but Avo's and Margaret's) to matching framing; Tucker's went from 720×900 to 800×1000 in it, from a source that is not recorded. Margaret's comes from the team's sponsorship package (commit 810a339).
- **Outreach photos** `images/mit_lab_1.jpg` and `images/vulcanforms_1.jpg` were shrunk from 1600×1200 to 1400×1050 in commit 30b6c14 (these are the commit's "two photos shrunk").
- **Every other image** is the team's own photo or CAD render, unchanged apart from re-encoding to WebP where a .webp copy exists, as far as the git history records. No image on the site was generated.
