# GNCE Mercury — FTC 26413 Website

Plain HTML/CSS/JS site, hosted on GitHub Pages. No build step: edit a file, commit, and it's live.

The look is a motorsport season program in the team's own livery: a violet field (from the logo) for the
season launches and the partner panels, white and light grey for everything else, one typeface (Archivo,
self-hosted in `fonts/`), square corners, and the logo's diamond as the only marker. `DESIGN.md` describes
the system; `DESIGN_PROGRESS.md` holds the history, open questions and next steps.

## Quick edit guide

| What | Where |
|---|---|
| Nav links | `js/main.js` → `NAV` list at the top |
| Sponsors and supporters (footer of every page, "Supported by" line on the home page) | `js/main.js` → `SPONSORS` / `SUPPORTERS` |
| This season's dates (home calendar, "next event" lines, footer) | `js/main.js` → `SEASON` (dates are `YYYY-MM-DD`, Eastern time) |
| Colors, type sizes, spacing | `css/style.css` → `:root` at the top |
| The three robots on the home page | `index.html` → one `<a class="bay">` per season plus its `<article class="season-card">` |
| Which season the home page shows first | `index.html` → `data-default="2025"` on the `<div class="lineup">` |
| Every competition result | `index.html` → the table under "The record so far" (one `<tr>` per event), and the season page's `events` list |
| Season pages | `seasons/<year>.html` → `season-head` at the top, spec sheet (`<dl class="spec">`), mechanisms, `events` |
| Season list | `seasons.html` → one `<li class="season-row">` per season |
| Team members | `team.html` → copy/paste an `<article class="member">` |
| Outreach events | `outreach.html` → copy/paste an `<article class="program">` into a year's `programs` |
| Partner page | `partners.html` |
| Email, Instagram, the contact form | `contact.html` (the address itself is `TEAM_EMAIL` in `js/main.js`) |
| Sponsorship email (margaret@mercury26413.org) | `SPONSOR_EMAIL` in `js/main.js` (used by the form's Sponsorship topic), plus the "Email us about sponsoring" buttons in `partners.html` and `contact.html` |

`js/main.js` attaches behaviour by class name and quietly skips any block that's missing what it needs,
so a pasted block can never break a page.

## Building blocks

| Block | What it does |
|---|---|
| `<section class="band">` (`band--grey`, `band--violet`) | A full-width section. Sections are told apart by their background, not by boxes |
| `<div class="lineup" data-lineup>` (home) | The season line-up: three garage bays. Each `<a class="bay">` links to its season and names its card in `data-card`; with JavaScript the bays become tabs that light their robot and swap the card. Arrow keys move between seasons |
| `<section class="season-head">` (season pages) | The season's launch: name, one line, the robot, and a row of facts (`<dl class="season-facts">`) |
| `<dl class="spec">` | A spec sheet. Write `TBD` for anything not decided yet; it shows in grey |
| `<div data-explorer>` + `<ol class="callouts">` (DECODE page) | Diamonds on the robot render and a button per part. Each `<li>` has `data-x` / `data-y` (the diamond's position in % of the image) and `data-card` (the id of that part's mechanism); optional `data-label="below"` puts the name under the diamond, and `data-link` sets how the part is named in "More on the …" |
| `<ol class="events">` | One `<li class="event">` per event: date, name and notes, then Alliance / Awards |
| `<ol class="calendar" data-calendar>` / `<span data-next-event>` | Filled from `SEASON`: past events turn grey, the next one is marked with how many days are left |
| `<div class="members" data-filter>` (team) | Builds the subteam filter from each member's `chip`s and lead roles ("Software Lead" counts as Software). Filters can be linked to: `team.html?crew=CAD` |
| `<div class="year-tabs">` + `<section class="year-panel" data-tab="Third year · 2026–27">` (outreach) | One tab per year, built from `data-tab` (name, then year). Without JavaScript the years simply follow each other |
| `<figure class="photo" style="--w: 927px">` | A photo that is never shown wider than its real pixels (set `--w` to the image's width) |
| `style="view-transition-name: robot-…"` | Lets a robot glide from the home page or Seasons into its season page in browsers that support it. Each name may appear only once per page, and the season-head robot must never be `loading="lazy"` |

## Adding photos

Put images in `images/` (`../images/...` inside the `seasons/` folder). Give every `<img>` its real
`width` and `height` and good `alt` text. Photos are never shown larger than their real pixel size, so use
one that's at least as big as where it goes.

Robot cut-outs (`*-cut.webp`) have a transparent background so they can stand on the violet field:
- `into-the-deep-robot-cut.webp` was cut from `into-the-deep-robot.png` by removing its black background.
- `mercinator-v1-cut.webp` was cut from `mercinator_v1_fullybuilt.png` with Canva's background remover.

Team portraits: `<img class="portrait" src="images/team/NAME.jpg" alt="NAME" width="800" height="1000" loading="lazy">` (4:5 crop).

## Motion rules

Motion only answers what you do: choosing a season lights its robot and slides its card in, choosing a part
of the DECODE robot moves the marker, filters and tabs swap their content, and a robot glides into its season
page. Nothing moves on its own, loops, autoplays, or is tied to scrolling. With reduced motion turned on,
everything changes instantly. Please keep it that way: no animation libraries.

Before you push a bigger change, check it on a phone, with the keyboard, with reduced motion turned on, and
with JavaScript off. Add `?now=2026-11-15T09:00` to an address to see the calendar and footer as they will
look at that moment.

## Adding a new season

1. Copy `seasons/2026-2027.html` → `seasons/2027-2028.html` and edit it.
2. Add a `season-row` for it in `seasons.html`.
3. On the home page add a `bay` and a `season-card` for it (and change `data-default` when its results come in).
4. Update the pager links at the bottom of the neighbouring season page, and `SEASON` in `js/main.js`.
