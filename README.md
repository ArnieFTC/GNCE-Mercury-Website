# GNCE Mercury — FTC 26413 Website

Plain HTML/CSS/JS site, hosted on GitHub Pages. No build step: edit a file, commit, and it's live.

The look is a product keynote stage: each season's robot is launched alone on a black stage, lit like a
product, and calm white and aluminium-grey pages explain it, the people and the partners. There is no brand
colour: colour comes from the robots, the photos, the logo and the four tier metals. One typeface (Archivo,
self-hosted in `fonts/`), rounded tiles, pill buttons. `DESIGN.md` describes the system; `DESIGN_PROGRESS.md`
holds the history, open questions and next steps.

## Quick edit guide

| What | Where |
|---|---|
| Nav links | `js/main.js` → `NAV` list at the top |
| Sponsors and supporters (footer of every page, "Supported by" lines) | `js/main.js` → `SPONSORS` (with logo files in `images/sponsors/`) / `SUPPORTERS`; also the "Our 2026–27 sponsors" cards on `partners.html` |
| News posts (sponsor thank-yous, team updates) | `news.html` → copy an `<article class="post">` above the others (newest first) |
| This season's dates (home calendar, "next event" lines, footer) | `js/main.js` → `SEASON` (dates are `YYYY-MM-DD`, Eastern time) |
| Colors, type sizes, spacing | `css/style.css` → `:root` at the top |
| The three robots on the home page | `index.html` → one `<a class="bay">` per season plus its `<article class="season-card">` |
| Which season the home page shows first | `index.html` → `data-default="2025"` on the `<div class="lineup">` |
| Every competition result | `index.html` → the table under "The record so far" (one `<tr>` per event), and the season page's `events` list |
| Season pages | `seasons/<year>.html` → `season-head` at the top, spec sheet (`<dl class="spec">`), mechanisms, `events` |
| Season list | `seasons.html` → one `<li class="season-row">` per season |
| Team members | `team.html` → copy/paste an `<article class="member">` |
| Outreach events | `outreach.html` → copy/paste an `<article class="program">` into a year's `programs` |
| Partner page | `partners.html` (tiers table, budget table and donut, other ways to help) |
| Sponsorship package PDF | `docs/GNCE-Mercury-Sponsorship-Package-2026-27.pdf` (replace the file to update every download link) |
| Email, Instagram, the contact form | `contact.html` (the address itself is `TEAM_EMAIL` in `js/main.js`) |
| Sponsorship email (margaret@mercury26413.org) | `SPONSOR_EMAIL` in `js/main.js` (used by the form's Sponsorship topic), plus the "Email us about sponsoring" buttons in `partners.html` and `contact.html` |

`js/main.js` attaches behaviour by class name and quietly skips any block that's missing what it needs,
so a pasted block can never break a page.

## Building blocks

| Block | What it does |
|---|---|
| `<section class="band">` (`band--grey`, `band--stage`) | A full-width section: white, aluminium grey, or the black stage. Sections are told apart by their ground, not by lines |
| `.tile` | A rounded, flat, filled box (white on grey, grey on white). Never put a tile inside a tile |
| Buttons | `btn` (black pill), `btn--line` (outline), and on the black stage `btn--light` (white pill) and `btn--outline-light` |
| `<div class="lineup" data-lineup>` (home; `index.html?season=2024` opens a season) | The season line-up: three garage bays. Each `<a class="bay">` links to its season and names its card in `data-card`; with JavaScript the bays become tabs that light their robot and swap the card. Arrow keys move between seasons |
| `<section class="season-head">` (season pages) | The season's launch: name, one line, the robot, and a row of facts (`<dl class="season-facts">`) |
| `<dl class="spec">` | A spec sheet. Write `TBD` for anything not decided yet; it shows in grey |
| `<div data-explorer>` + `<ol class="callouts">` (DECODE page) | Markers on the robot render and a button per part. Each `<li>` has `data-x` / `data-y` (the marker's position in % of the image) and `data-card` (the id of that part's mechanism); optional `data-label="below"` puts the name under the marker, and `data-link` sets how the part is named in "More on the …". Choose a part with its button, its marker or the arrow keys; scrolling never changes it |
| `<ol class="events">` | One `<li class="event">` per event: date, name and notes, then Alliance / Awards |
| `<table class="tiers">` / `<table class="budget">` (partners) | The sponsorship tiers and the season budget, typed from the package. The donut is drawn from the budget table's "Up to" amounts: keep rows largest first, keep the total row equal to their sum (otherwise no chart is drawn), give each row a `--budget-…` colour, and copy each share from the package (amount ÷ total, rounded so the shares add up to 100%) |
| `<ol class="calendar" data-calendar>` / `<span data-next-event>` | Filled from `SEASON`: past events turn grey, the next one is marked with how many days are left |
| `<div class="members" data-filter>` (team) | Builds the subteam filter from each member's `chip`s and lead roles ("Software Lead" counts as Software). Filters can be linked to: `team.html?crew=CAD` |
| `<div class="year-tabs">` + `<section class="year-panel" data-tab="Third year · 2026–27">` (outreach) | One tab per year, built from `data-tab` (name, then year). Without JavaScript the years simply follow each other |
| `<figure class="photo" style="--w: 927px">` | A photo that is never shown wider than its real pixels (set `--w` to the image's width) |
| `style="view-transition-name: robot-…"` | Lets a robot glide from the home page or Seasons into its season page in browsers that support it. Each name may appear only once per page, and the season-head robot must never be `loading="lazy"` |

## Adding photos

Put images in `images/` (`../images/...` inside the `seasons/` folder). Give every `<img>` its real
`width` and `height` and good `alt` text. Photos are never shown larger than their real pixel size, so use
one that's at least as big as where it goes.

Robot cut-outs (`*-cut.webp`) have a transparent background so they can stand on the black stage:
- `into-the-deep-robot-cut.webp` was cut from `into-the-deep-robot.png` by removing its black background.
- `mercinator-v1-cut.webp` was cut from `mercinator_v1_fullybuilt.png` with Canva's background remover.

Team portraits: `<img class="portrait" src="images/team/NAME.jpg" alt="NAME" width="800" height="1000" loading="lazy">` (4:5 crop).

## Motion rules

One authored moment: when a page opens, its title rises and the robots step into the light one after another.
After that, motion only answers a click, a tap or a key: choosing a season moves the spotlight and brings its
card up; filters, tabs and parts swap their content; a robot glides into its season page in browsers that
support it. **Nothing moves, fades, pins or changes while you scroll** (Andy's rule, round 3): no scroll
reveals, no scroll-linked effects, no sticky sections other than the header. The only loop is the small
pulse on the next event, and it stops after two beats. Everything is visible without the motion, and with
reduced motion turned on it all changes instantly. Please keep it that way: no animation libraries.

Before you push a bigger change, check it on a phone, with the keyboard, with reduced motion turned on, and
with JavaScript off. Add `?now=2026-11-15T09:00` to an address to see the calendar and footer as they will
look at that moment.

## Adding a new season

1. Copy `seasons/2026-2027.html` → `seasons/2027-2028.html` and edit it.
2. Add a `season-row` for it in `seasons.html`.
3. On the home page add a `bay` and a `season-card` for it (and change `data-default` when its results come in).
4. Update the pager links at the bottom of the neighbouring season page, and `SEASON` in `js/main.js`.
