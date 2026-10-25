# GNCE Mercury — FTC 26413 Website

Plain HTML/CSS/JS site, hosted on GitHub Pages. No build step: edit a file, commit, and it's live.

## Quick edit guide

| What | Where |
|---|---|
| Nav tabs | `js/main.js` → `NAV` list at the top |
| Colors, fonts, type sizes, motion timings | `css/style.css` → `:root` at the top |
| Countdown, season timeline, "Next competition" line in the footer | `js/main.js` → `SEASON` at the top (dates are `YYYY-MM-DD`, Eastern time) |
| "The record so far" numbers | `index.html` → edit the numbers in the `stat` blocks directly |
| Robots on the home page | `index.html` → one `<article class="model">` per robot |
| Team members | `team.html` → copy/paste a `card member` block |
| Season list | `seasons.html` → copy/paste a row |
| Season robot + qualifiers | `seasons/<year>.html` → copy/paste an `event` block per qualifier |
| Outreach events | `outreach.html` → copy/paste an `<article class="chapter">` into a year's `chapters` |
| Sponsors (footer of every page) | `js/main.js` → `SPONSORS` / `SUPPORTERS` lists |
| Email, socials, donate link, form | `contact.html` |

`js/main.js` attaches behaviour by class name and quietly skips any block that's missing what it needs,
so a pasted block can never break a page.

## Design blocks

| Block | What it does |
|---|---|
| `<article class="model">` (home) | One robot staged on the page, with its name and a link to its season |
| `<figure class="season-hero">` + `<nav class="season-pager">` (season pages) | The big robot at the top and the links to the other seasons |
| `<div class="spec-sheet">` around `<ul class="specs">` | The spec sheet. Write `TBD` for anything not decided yet |
| `<article class="chapter">` (outreach) | One event: `chapter-lead` photo, optional `chapter-strip` photos, then the text |
| `data-preview="images/…"` on the home "Read more" links | The photo that appears beside the list on big screens |
| `data-walkthrough` on a `parts-grid` | Turns the mechanism cards into the scroll-through tour on big screens |
| `data-filter` on the Members grid | Builds the subteam filter from each member's `chip`s |
| Image classes | `print`: a photo in a thin mat · `on-black`: an image whose own background is black · `render` / `photo`: fill the card's image box · `feather`: soften the edges of a render on black |
| `style="view-transition-name: robot-…"` | Lets a robot glide from the home page or Seasons into its season page. Each name may appear only once per page, and the season hero must never be `loading="lazy"` |

## Adding photos

Put images in `images/` (`../images/...` inside the `seasons/` folder). Give every `<img>` its real
`width` and `height` and good `alt` text. Images are square-cornered and are never shown larger than
their real pixel size, so use a photo that's at least as big as where it goes.

Team portraits: replace a member's `<div class="portrait">…</div>` with
`<img class="portrait" src="images/team/NAME.jpg" alt="NAME" width="800" height="1000" loading="lazy">` (4:5 crop).
Until then the plate shows their initials.

## Motion rules

Things arrive once, slowly, and then stay still. Headings rise as one block, the main photo or two on a
page wipe open, hairlines draw, everything else fades. Nothing loops, autoplays, follows the cursor or
is tied to the scrollbar, and there's never more than one big effect on screen at a time. Please keep it
that way: no new animation libraries.

Before you push a bigger change, check it with reduced motion turned on, with JavaScript off, and on a
phone. Add `?now=2026-10-25T09:00` to an address to see the countdown and footer as they'll look at that moment.

## Adding a new season

1. Copy `seasons/2026-2027.html` → `seasons/2027-2028.html` and edit it.
2. Add a row for it in `seasons.html`, and a `model` on the home page.
3. Update the season pager links at the bottom of the neighbouring season page.
