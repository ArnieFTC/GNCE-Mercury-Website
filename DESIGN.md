---
name: GNCE Mercury
description: FTC team #26413 presented as a motorsport team's season program, in the livery of its logo.
colors:
  violet: "#2A2346"
  lavender: "#B9A6F2"
  action: "#5B3FC4"
  action-deep: "#4A31A8"
  on-violet: "#FFFFFF"
  on-violet-2: "#C4BCDF"
  paper: "#FFFFFF"
  paddock: "#F2F2F0"
  hairline: "#DCDCD8"
  ink: "#1C1A26"
  steel: "#585C65"
  footer: "#18161F"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 1rem + 6vw, 6rem)"
    fontWeight: 840
    lineHeight: 0.92
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 1.3rem + 3.4vw, 4rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 122"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.625rem, 1.15rem + 1.6vw, 2.375rem)"
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 112"
  subtitle:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 650
    lineHeight: 1.2
    fontFeature: "'tnum' 1, 'lnum' 1"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(56px, 7vw, 112px)"
  section-tight: "clamp(40px, 5vw, 72px)"
  max: "1280px"
  header: "68px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.action-deep}"
    textColor: "{colors.paper}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.action}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
    height: "48px"
  button-livery:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
    height: "48px"
  button-livery-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-ghost-dark:
    backgroundColor: "transparent"
    textColor: "{colors.on-violet}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
    height: "48px"
  toggle:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "44px"
  toggle-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  text-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
    height: "48px"
  lead-tag:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "3px 8px"
---

# Design System: GNCE Mercury

The named colors, the type scale (`--fs-*`) and the main spacing live in `:root` at the top of `css/style.css`.
Change them there, never inside a component. A few values are still typed into component rules: the smaller
type sizes (0.875rem, 0.8125rem and some per-component clamps) and five colors (footer text #E4E1EE and
#ABA6BE, field border #A9A9A3, error red #A3243B, inactive explorer marker #8F86AE). Everything below
describes what is in that file and the pages as they ship.

## Overview

**Creative North Star: "The Season Program"**

The site reads like a motorsport team's season launch and partner programme. Each season's robot is
launched on a deep violet field, specified with a spec sheet and dated results, and the partners who made
it possible are credited at the foot of the panel and in every footer. The look comes from the team's own
logo: its violet, its lavender diamond and its dark outline.

Two grounds carry the site. The violet field is for launches and partners (the home launch panel, the head
of each season page, the partner panel) and for the closing calls to join or partner on the home, team and
partners pages. White and paddock grey carry everything else: records, write-ups,
people, forms. A near-black footer is an extra ground, used only for the footer. Sections are separated by a change of
ground or by a hairline rule, never by boxes or cards. Corners are square everywhere. One type family,
Archivo, does all the work: set extra wide and heavy for machine names and page titles, plain for reading.

Motion happens only in answer to the visitor: choosing a season, picking a robot part, filtering the crew,
switching an outreach year, moving between pages. Nothing animates on load or on scroll, and reduced motion
turns all of it off.

**Key Characteristics:**
- Violet field for launches, partners and closing calls to join; white and paddock grey for everything else.
- One family (Archivo), wide and heavy for machine names, plain for text, tabular figures for every date and spec.
- Square corners on everything; rules and grounds instead of cards.
- The logo's diamond is the only marker.
- Robots stand on the violet as cut-outs at one scale, with a soft floor shadow.
- Motion only in answer to the visitor.

## Colors

The team's livery: one deep violet, one bright lavender stripe, one action violet, set on white and a warm paddock grey.

### Primary
- **Mercury Violet** (violet): the launch and partner field. Home launch panel, season page heads, the partner panel, the closing join-or-partner bands (`band--violet` on the home, team and partners pages), the backdrop behind robot thumbnails (season index rows, pager), and member lead tags.
- **Action Violet** (action): links and buttons on light grounds, the nav underline, the active outreach tab bar, focus rings on light, the "next event" marker in the calendar, the best bar in data bars. Its hover is **Deep Action Violet** (action-deep).

### Secondary
- **Livery Lavender** (lavender): the stripe. Used only on violet or the footer: the 3px rule over the partner strip, the phone partner credit, season facts and sponsor row; the bar over the chosen bay; the chosen bay's filled diamond; the livery button; focus rings on dark grounds. The exceptions are text selection (lavender on every ground) and the touch tap highlight (lavender at 25%).

### Neutral
- **Paper** (paper): the default page ground and form field fill.
- **Paddock Grey** (paddock): alternate bands (`band--grey`) and the mat behind entry images and portraits.
- **Hairline** (hairline): 1px rules between rows, header border, quiet button outlines.
- **Ink** (ink): all text on light, the 2px rule that opens a list or table, pressed toggles, callout labels. Taken from the logo's outline.
- **Steel** (steel): secondary text on light (dates, labels, captions, hints).
- **On-Violet** and **On-Violet Soft** (on-violet, on-violet-2): primary and secondary text on the violet field. Hairlines on violet are on-violet-2 at 22% (`--rule-violet`).
- **Footer Night** (footer): the footer ground only, with text in #E4E1EE and secondary text in #ABA6BE. The direction contract named only violet, white and grey; this fourth ground was added in the build to close every page and is used nowhere else.

### Named Rules
**The Livery Stripe Rule.** Lavender lives on dark grounds only (violet or footer); text selection and the tap highlight are the only exceptions. On white, the accent is Action Violet. Never put lavender text or rules on paper.

**The Two Grounds Rule.** Violet is for launching machines, crediting partners and the closing call to join or partner. Write-ups, people, records and forms sit on paper or paddock grey.

## Typography

**Display Font:** Archivo (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Archivo, the same family
**Label/Mono Font:** none; labels are Archivo with tabular figures

Archivo is self-hosted as one variable file, `fonts/archivo-latin.woff2` (Google Fonts latin subset, SIL Open Font License), carrying weight 100–900 and width 62–125%. The width axis is set with `font-stretch`.

**Character:** One family with two voices. Stretched to 118–125% and weighted 780–840 it becomes the machine-name voice of a team livery; at normal width and 400 it is a plain, readable text face.

### Hierarchy
- **Display** (840, 125% width, `--fs-display` 2.75–6rem, line-height 0.92): the season page h1 (machine name). The home h1 "GNCE Mercury" uses the same voice at 820, capped at 5.25rem.
- **Headline** (800, 122% width, `--fs-xl` 2.25–4rem, line-height 0.98): inner page h1 and the partner panel h1.
- **Machine name** (800–820, 125% width; 122% in the pager): season names in the bays, the line-up card, season index rows and pager, each set in its own component rule and sized to context. The `.machine` helper class in the CSS is not used on any page.
- **Title** (750, 112% width, `--fs-lg` 1.625–2.375rem, line-height 1.1): section h2.
- **Subtitle** (650, `--fs-md` 1.25rem, line-height 1.25): h3, lead paragraphs (400, steel, line-height 1.5, 60ch).
- **Body** (400, `--fs-base` 1.0625rem, line-height 1.6): running text, held to 62ch.
- **Label** (`--fs-sm` 0.9375rem, 0.875rem, or 0.8125rem for tags; 550 for nav, 650 for buttons, 400 for most spec terms, dates and captions): nav, buttons (108% width), spec terms, dates, captions. Sentence case, no tracking.

### Named Rules
**The Tabular Figures Rule.** Every date, spec and number uses tabular lining figures (`<time>` and `.num` get them automatically; spec, facts and figures values set them).

**The Width Is The Voice Rule.** Emphasis comes from the width axis plus weight, not from a second family, all-caps tracking or color. Wide is for names and titles, with a lighter 108–112% on buttons, tabs and the phone menu; reading text stays at normal width.

## Layout

- **Container:** content max 1280px (`--max`) plus a fluid gutter of 16–40px (`--gutter`) each side.
- **Vertical rhythm:** bands are padded by `--section` (56–112px); tight bands by 40–72px. Section heads sit 28–48px above their content.
- **Grids:** two-column splits run 7:5 (or 5:7 flipped, or even) from 900px. Entry grids go 1 → 2 columns at 760px → 3 at 1100px. Data lists (spec sheets, events, results, resources, contacts) are full-width rows ruled with hairlines; the season calendar is a ruled grid of columns (150px minimum).
- **Home launch panel:** h1 and the team line, then the line-up: three garage bays side by side with the chosen season's card to the right from 1100px; below 1100px the card drops under the bays and a short partner credit replaces the full partner strip. On phones (720px and under) the chosen bay widens to 1.9fr. On short laptop screens (1100px+ and 860px tall or less) the panel tightens so the partner strip stays in the first screen.
- **Header:** sticky, 68px, white with a hairline. The nav collapses into a Menu button at 1080px and under; the header "Partner with us" button hides at 560px and under (it moves into the open menu).
- **Breakpoints in use:** 359, 480, 520, 560, 700, 720, 760, 800, 860, 900, 960, 1000, 1080/1100, 1200px, plus the 860px-tall short-screen query and a 460px container query on the contact list. Check every page at 320, 390, 768 and 1440px.
- **Photos never larger than their pixels:** wrap a photo in `.photo` with `style="--w: <image width>px"`; entry images use `object-fit: scale-down` in a 16:10 mat, except `.cover` entries, which fill it (`object-fit: cover`).

## Elevation & Depth

The system is flat. Depth comes from the change of ground (violet, paper, paddock, footer) and from rules: a 2px ink rule opens a list, 1px hairlines separate its rows, and a 3px lavender stripe opens a partner or facts block on violet. Nothing on the page floats over anything else except the sticky header, the open mobile menu and the parts-explorer diamonds and labels on their render; the header and menu have no shadow.

### Shadow Vocabulary
- **Robot floor shadow** (`filter: drop-shadow(0 18px 18px rgba(8, 6, 20, 0.45))`, 24px/0.5 on season heads, 14px on season rows): only under robot cut-outs standing on violet, so they sit on the floor.
- **Garage light** (`radial-gradient(60% 55% at 50% 100%, rgba(185, 166, 242, 0.26), transparent 70%)`): a pool of light under the chosen bay only.
- **Callout marker lift** (`box-shadow: 0 2px 6px rgba(28, 26, 38, 0.35)`): the diamond markers on the parts explorer, so they read over a render.

### Named Rules
**The Flat Paddock Rule.** No shadows on buttons, cards, menus or panels. Shadow belongs to robots on the floor and to markers on a render, nothing else.

## Shapes

Every corner is square (0px): buttons, fields, chips, tags, images, panels. The only other shape is the logo's diamond, a square rotated 45°. It is used as a filled or outlined marker (7–14px): season markers in the bays (outlined, filled when chosen), result and event markers, list bullets on support lists, radio buttons on the contact form, the locked-quote marker, and the parts-explorer callouts. Bars and stripes (2–3px) mark the active nav item, outreach tab and chosen bay.

**The One Marker Rule.** The diamond is the only marker. No circles, checkmarks, arrows or icon glyphs as bullets or badges; the only SVG icon is the Menu button's.

## Components

### Buttons
Solid, square and plain; the color does the work.
- **Shape:** square (0px), 48px tall (44px with 10px 18px padding in the header and partner credit; 52px and borderless in the open mobile menu), 2px border the same color as the fill.
- **Primary:** Action Violet with white text, 650 weight, 108% width, 12px 22px padding. "Partner with us" in the header is always primary.
- **Hover / Focus:** fill deepens to Deep Action Violet over 160ms; focus is a 2px outline offset 3px (Action Violet on light, Lavender on dark).
- **Line:** transparent with an Action Violet border and text; fills on hover.
- **Livery:** Lavender fill with ink text, for the main action on violet; turns white on hover.
- **Ghost dark:** transparent with an On-Violet Soft border on violet; fills white on hover.
- **Text link:** underlined 1px, 2px on hover, 650 weight, for secondary actions beside a button ("Join as a student", "See how we built it").

### Chips
- **Toggle buttons** (crew filter, parts-explorer buttons): white, 1px hairline border, ink text, 44px tall; border goes ink on hover; pressed state is solid ink with white text.
- **Lead tag:** violet fill, white text, 0.8125rem 650. **Subteam chip:** 1px hairline outline, ink text.

### Cards / Containers
There are no cards. Content sits in rows and columns separated by rules.
- **Corner Style:** square.
- **Background:** the band's ground; images sit on a paddock (or paper, on grey bands) mat; black-background photos sit on black (`on-black`).
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 2px ink top rule to open a list, 1px hairline between rows; 3px lavender stripe on violet.
- **Internal Padding:** rows 10–24px vertical (24–40px on the Seasons index rows), no left inset.

### Inputs / Fields
- **Style:** white, 1px #A9A9A3 border, square, 48px tall, 12px 14px padding; labels 650 above the field; hints in steel 0.875rem.
- **Focus:** border and a 2px outline in Action Violet, no offset.
- **Choices:** the topic radios are square tiles with a diamond radio; the checked tile gets a 2px Action Violet edge (its 1px border plus a 1px inset ring).

### Navigation
- **Desktop:** 550-weight ink links, 44px tall; hover and current page draw a 2px Action Violet underline from the left (200ms); current page is 700.
- **Mobile (1080px and under):** a Menu button opens a full-width panel of 56px rows at 1.25rem/112% width with hairlines, ending in a full "Partner with us" button. Without JavaScript a plain link row (`nojs-nav`) shows instead.
- **Breadcrumbs:** small, slash-separated, at the top of each season head, above the machine name. Other inner pages have none.

### The Season Line-up (signature)
Three garage bays hold the three robots side by side at one scale, oldest first, each labeled with an outlined diamond, the season years, the machine name and a status line. With JavaScript the bays are tabs: the chosen bay is lit (lavender bar on top, garage light, full-color robot, filled diamond) and the others wait dimmed and slightly smaller; the season card beside them swaps in its results, specs and a link. The home line-up opens on DECODE (`data-default="2025"`). The season tabs carry no 01/02/03 numbers; the years are the labels. Without JavaScript every season card shows, stacked.

### Season Head
The top of each season page: violet field, breadcrumb, display-size machine name, lead, the robot cut-out on the right with its floor shadow, and a season facts row under a lavender stripe. The robot keeps its `view-transition-name`, so in supporting browsers it morphs between the home bay, the Seasons index row, the season head and the pager.

### Spec Sheet and Records
Two-column definition rows (steel term, 600 tabular value) under a 2px ink rule. Missing spec values read "TBD" and are set in steel (`.tbd`); missing event results show an em dash announced as "Not recorded". Neither is ever guessed. Results tables collapse into stacked rows at 720px.

### Partner Strip and Sponsor Row
A partner strip under a 3px lavender stripe closes the home launch panel ("Supported by ...", livery button, a plain "Join as a student" link). Every page's footer carries the Our Sponsors & Supporters row, built once in `js/main.js` from `SPONSORS` (logos) and `SUPPORTERS` (names set wide and bold in white), with a "Become a sponsor" link. Never remove or move it.

### Motion
One easing for everything: `cubic-bezier(0.16, 1, 0.3, 1)`. State colors 160ms; underlines and small marker changes 200ms; explorer diamonds scale in 260ms; tab bars 300ms; bay light, livery bar and robot 420–520ms; entering cards, panels, part notes and filtered crew members 320–380ms (fade up 8–10px); a Seasons-index robot lifts 4px on hover (320ms); a locked quote shakes for 600ms before it opens. Page-to-page robot morph 420ms via view transitions. All of it is cut to near zero under reduced motion.

## Do's and Don'ts

### Do:
- **Do** change colors, sizes and spacing in `:root` in `css/style.css`, never in a component rule.
- **Do** use the violet field only for launching a machine, crediting partners or a closing call to join or partner; put everything else on paper or paddock grey.
- **Do** use Action Violet (#5B3FC4) for links and buttons on light, and Lavender (#B9A6F2) only on violet or the footer.
- **Do** set machine names and page titles wide (118–125%) and heavy (780–840); keep reading text at normal width.
- **Do** give every date, spec and number tabular figures.
- **Do** separate content with a 2px ink rule over a list and 1px hairlines between rows.
- **Do** set `--w` to the image's pixel width on every `.photo` so photos are never upscaled.
- **Do** keep the sponsor strip in every footer, built from `SPONSORS` / `SUPPORTERS` in `js/main.js`.
- **Do** add new raster images only as the team's own photos or CAD renders, and record how any edited one was made.
- **Do** make motion an answer to a click, tap or key, with the shared easing, and let reduced motion turn it off.

### Don't:
- **Don't** round corners anywhere.
- **Don't** add a second font family or system display faces.
- **Don't** add shadows to buttons, panels or menus; shadow is only for robots on the floor and explorer markers.
- **Don't** use any marker other than the diamond: no icon glyphs, emoji, checkmarks or arrows as bullets.
- **Don't** number the season tabs (01/02/03) or put small labels (eyebrows) above headings.
- **Don't** animate on page load or on scroll, and don't add counters that tick up.
- **Don't** put content in boxed cards with borders and shadows; use rows and grounds.
- **Don't** generate or invent images, results, sponsors or numbers; leave a `tbd` instead.
- **Don't** show a photo larger than its own pixels.

## Assets and Provenance

- **Font:** Archivo variable (weight 100–900, width 62–125%), self-hosted latin subset `fonts/archivo-latin.woff2`, from Google Fonts, SIL Open Font License.
- **Logo:** `images/logo-mark.png` is the emblem cut out onto transparency from `images/logo.png`, a screenshot with chat text and faded copies behind the emblem (commit d5e93d6). Only `logo-mark.png` is used on the site.
- **`images/into-the-deep-robot-cut.webp`:** made from `images/into-the-deep-robot.png` (the robot on black: an older rough cut-out, upscaled 2x in commit 24b928e by a method that is not recorded) with a flood-fill matte of the black background, gaps inside the robot cleared by hand, leftover specks dropped, and a 0.8px feathered alpha edge.
- **`images/mercinator-v1-cut.webp`:** made from `images/mercinator_v1_fullybuilt.png` (team photo) with Canva's background remover; the mask was taken from Canva's preview, upscaled and applied to the original photo.
- **`images/decode-chassis-v2-ink2.jpg`** (shipped on the 2025–26 page) is a variant of `images/decode-chassis-v2.jpg` from an earlier redesign commit; how it was edited is not recorded. Record it here when known.
- **`images/decode-robot-cad.webp`, `decode-transfer.webp`, `decode-turret.webp`, `decode-limelight.webp`:** the team's CAD renders with their white backgrounds removed to transparency (commit a5620f9).
- **Team portraits** (`images/team/*.jpg`): re-cropped to a matching 4:5 framing, two of them shrunk (commit 30b6c14); one comes from the team's sponsorship package (commit 810a339).
- **Every other image** is the team's own photo or CAD render, unchanged apart from re-encoding to WebP where a .webp copy exists, as far as the git history records. No image on the site was generated; the method of the 2x upscale above is not recorded.
