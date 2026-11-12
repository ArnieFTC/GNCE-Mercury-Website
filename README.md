# GNCE Mercury — FTC 26413 Website

Plain HTML/CSS/JS site. No build step: edit a file, commit to `main`, and it's live at https://mercury26413.org/
(Hostinger, which deploys `main` automatically and reads `.htaccess`; GitHub Pages keeps a mirror).
After editing a page, run `python3 tools/agent_files.py` (see "AI agents" below).

The look is a product keynote stage in the colours of FIRST Tech Challenge. Each season's robot is launched
on a black stage, and since round 10 every page wears one FTC game's official colour palette from its header to
its footer, the way a race car wears a livery: the site-wide pages wear this season's game (BIOBUZZ: yellow, pale
yellow, gold, black) and each season's page wears its own (DECODE: mint, vermilion, slate teal; INTO THE DEEP:
blue, pale blue, yellow). Page heads and closing calls are flat fields of the game's colour with black type;
reading sections are white, with bands in the game's light colour. The home page and the Seasons page, which
show all three games, keep a black head. FIRST Tech Challenge's own orange marks
"FTC team 26413" on the home page and the last row of every page. All colours are FIRST's published values (its
brand guidelines and each game's style guide). The four sponsorship tiers wear the colours of their names. One typeface (Archivo, self-hosted in `fonts/`); since round 8 (after mclaren.com) square boxes
with a thin line, a floating white header bar, page and section headings in capitals, and square buttons with
a drawn arrow. `DESIGN.md` describes the system; `DESIGN_PROGRESS.md` holds the history, open questions and
next steps.

## Quick edit guide

| What | Where |
|---|---|
| Nav links | `js/main.js` → `NAV` list at the top |
| Sponsors and supporters (footer of every page, "Supported by" lines) | `js/main.js` → `SPONSORS` (with logo files in `images/sponsors/`) / `SUPPORTERS`; also the "Our 2026–27 sponsors" cards on `partners.html` |
| News posts (sponsor thank-yous, team updates) | `news.html` → copy an `<article class="post">` above the others (newest first) |
| This season's dates (home calendar, "next event" lines, footer) | `js/main.js` → `SEASON` (dates are `YYYY-MM-DD`, Eastern time) |
| Colors, type sizes, spacing | `css/style.css` → `:root` at the top |
| The colours of a page (its livery) | `css/style.css` → the "Round 10" block at the end: each game's palette in `:root`, then one block of six `--lv-*` tokens per game (field, ground, line, mark, tag, glow). A season page says which livery it wears with `<body data-livery="2025">`; a page without it wears this season's |
| The opening on the home page (the title card that flies into the page) | `index.html` → `<div class="opening">` right under `<body>`: one `op-field` and one `op-slot` per season |
| Home page: the team strip | `index.html` → `<ul class="card-strip">`: one card per member, in the order of `team.html`. Show only the members `team.html` shows |
| Home page: the outreach stories | `index.html` → `<div class="stories">`: one `<article class="story">` each (photo, title, date line, one sentence from `outreach.html`, a link to it) |
| Home page: latest news | `index.html` → the two `news-card`s: copy the newest posts from `news.html` and drop the oldest |
| The three robots on the home page | `index.html` → one `<a class="bay">` per season plus its `<section class="season-card">` |
| Which season the home page shows first | `index.html` → `data-default="2025"` on the `<div class="lineup">` |
| Every competition result | `index.html` → the table under "The record so far" (one `<tr>` per event), and the season page's `events` list |
| Season pages | `seasons/<year>.html` → `season-head` at the top, spec sheet (`<dl class="spec">`), mechanisms, `events` |
| Season list | `seasons.html` → one `<li class="season-row">` per season |
| Team members | `team.html` → copy/paste an `<article class="member">` and give it its own `id` (the home strip links to `team.html#that-id`); add or remove the same person in the home page's team strip |
| Outreach events | `outreach.html` → copy/paste an `<article class="program">` into a year's `programs` |
| Partner page | `partners.html` (tiers table, budget table and donut, other ways to help) |
| Sponsorship package PDF | `docs/GNCE-Mercury-Sponsorship-Package-2026-27.pdf` (replace the file to update every download link) |
| Email, Instagram, the contact form | `contact.html` (the address itself is `TEAM_EMAIL` in `js/main.js`) |
| Footer: About, Contact and Terms links and the © line | the `<footer class="site-footer">` at the bottom of every page (plain HTML; `js/main.js` adds the sponsors strip and page links above it) |
| Terms and privacy | `terms.html` (keep it true: update it if the site ever adds cookies or analytics, or changes what the contact form sends or keeps) |
| Sponsorship email (margaret@mercury26413.org) | `SPONSOR_EMAIL` in `js/main.js` (used by the form's Sponsorship topic), plus the "Email us about sponsoring" buttons in `partners.html` and `contact.html` |
| The site icon (the picture in a browser tab and beside the site in Google's results) | `favicon.ico`, `icon-192.png` and `apple-touch-icon.png` at the top of the site: Mercury's head from `images/logo-mark.png`, written by `python3 tools/site_icons.py` (needs Pillow: `pip install pillow`). Keep the three file names: Google asks for a stable icon address, and its rules require a square icon. Run the script again only if the logo changes; `python3 tools/site_icons.py --check` says whether the files still match it |

`js/main.js` attaches behaviour by class name and quietly skips any block that's missing what it needs,
so a pasted block can never break a page.

## Building blocks

| Block | What it does |
|---|---|
| `<section class="band">` (`band--grey`, `band--stage`) | A full-width section: white, aluminium grey, or the black stage. Sections are told apart by their ground, not by lines |
| `.tile` | A square, flat box (white on grey, grey on white). Never put a tile inside a tile |
| Buttons | `btn` (square, black, capitals, with a drawn arrow; none on mail links, a down arrow on downloads), `btn--line` (outline), and on the black stage `btn--light` (white) and `btn--outline-light`. On a colour field (a page head, the strip under the home stage, a closing band) `btn--light` and `btn--outline-light` turn black by themselves. `btn btn--light btn--sponsor` is the sponsor button there ("Partner with us"). `btn btn--season` is the signal colour by itself |
| `data-season="2024"` (or `2025`, `2026`) | Gives a block its season's colour (as `--c`): the bays and cards on the home page, the rows on `seasons.html`, the head and the pager links of a season page, a row's robot cell in the record. A season page also has `<body data-livery="2025">` (its year): the whole page (head, bands, lines, buttons, footer) then wears that game's palette |
| `<ul class="card-strip" data-strip id="…">` + `<div class="strip-nav" data-strip-nav="that id" data-label="team members">` | A row of cards the visitor moves: the script adds the previous/next buttons to the `strip-nav`, and a mouse can drag the row. Cards are `<a class="strip-card">` (a `strip-card--wide` first card for a wide photo; `strip-card--plain` for a member without a photo), each with a `<span class="strip-label"><b>name</b><span>role</span></span>` |
| `<div class="stories" id="…" data-stories data-strip>` + `<div class="strip-nav" data-strip-nav="that id" data-label="stories">` in the section head | Stories with photos. On wide screens: one big frame, the stories as rows beside it, and the chosen story's sentence and link under the frame. Under 900px: a row of cards to swipe, drag or move with the previous/next buttons. Each `<article class="story">` holds a `<div class="story-photo">` with the image, then a `<div class="story-text">` with an `<h3>`, a `<p class="dateline">`, a sentence and a link |
| `<figure data-video>` around a `<video controls poster="…">` | Puts a "Play video" button on the poster; pressing it starts the video with its own controls |
| `data-gallery` (and every `program-media` on the outreach page) | The pictures inside open large when clicked (arrows, swipe, Esc). The caption is the picture's `alt` text, so write a good one |
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

Opening: on the first visit of a session the home page opens with a title card: three colour fields rise, one
per season, each with its robot and game name; a black strap carries the team's name across them; then every
piece flies to its own place on the page (the fields become the three bays, the name becomes the heading) while
the rest of the page comes up around them. About 2.2s; any click, tap or key ends it; add `?intro` to the
address to see it again. It does not play with reduced motion, on a slow connection, on a very short screen, or in
a tab that is not showing. A press on the card only ends it: it never also presses a link under the card.
Moving between pages, the page you leave dims and the next one rises into place (cross-page view transitions;
the header stays put). Both are set up by a small script at the top of each page's `<head>`: keep it when you
copy a page. When a page opens without the title card, its title rises and the robots step into the light one
after another.
After that, motion only answers a click, a tap, a drag or a key: choosing a season lights its colour field and
brings its card up; the team strip moves when you press its arrows or drag it; choosing an outreach story
changes the photo; a gallery photo opens large; filters, tabs and parts swap their content; a robot glides
into its season page in browsers that support it. Nothing moves by itself. **Nothing moves, fades, pins or changes while you scroll** (Andy's rule, round 3): no scroll
reveals, no scroll-linked effects, no sticky sections other than the header. The only loop is the small
pulse on the next event, and it stops after two beats. Everything is visible without the motion, and with
reduced motion turned on it all changes instantly. Please keep it that way: no animation libraries.

Before you push a bigger change, check it on a phone, with the keyboard, with reduced motion turned on, and
with JavaScript off. Add `?now=2026-11-15T09:00` to an address to see the calendar and footer as they will
look at that moment.

## Adding a new season

1. Copy `seasons/2026-2027.html` → `seasons/2027-2028.html` and edit it.
2. Add a `season-row` for it in `seasons.html`.
3. On the home page add a `bay` and a `season-card` for it (and change `data-default` when its results come in),
   and an `op-field` and an `op-slot` for it in the opening (`<div class="opening">`). Four seasons in one row
   get tight: drop the oldest from the home line-up and the opening when that happens.
4. Give the new season its livery. Look up the colour palette in FIRST's style guide for the new game
   (firstinspires.org → Resources → Season brand downloads). In `css/style.css`: add the game's main colour to the
   "Round 9" block (`--newgame: #…;` and `[data-season="2027"] { --c: var(--newgame); }`) and the rest of its
   palette to the "Round 10" block. There, write a livery block for it (the six `--lv-*` tokens: field, ground,
   line, mark, tag, glow) with the selector `body, body[data-livery="2027"]`, and take the plain `body` off last
   season's block, so every site-wide page is repainted in the new game's colours while last season's page keeps
   its own. Put `data-livery="2027"` on the new page's `<body>` and `data-season="2027"` on the new blocks. Type
   on a field is black: check that black on the new field colour is 4.5:1 or more. A livery block has two more
   lines, and the comments in the BIOBUZZ and DECODE blocks say how to choose them: which way the mark steps
   under the pointer (`--lv-press-to`: `#000` for a light mark, `#fff` for a mid-tone one, so that black text
   on the hovered button stays 4.5:1 or more), and the colours of the header's "Partner with us" button
   (`--cta`, `--on-cta`, `--cta-press`: the mark with black type, or, when the mark is the field's own colour
   as BIOBUZZ's yellow is, black with the mark as its type).
5. Update the pager links at the bottom of the neighbouring season page, and `SEASON` in `js/main.js`.
6. Add the new page to `PAGES` in `tools/agent_files.py` and run `python3 tools/agent_files.py`.

## AI agents

The site is set up so AI assistants and agents can read it without scraping:

| What | Where |
|---|---|
| Crawl rules, how our content may be used (`Content-Signal: search=yes, ai-input=yes, ai-train=no`), sitemap pointer | `robots.txt` (hand-written; keep the signal the same as in `terms.html` and `.htaccess`) |
| Every page as Markdown (`team.html.md` …), `llms.txt`, `llms-full.txt`, `sitemap.xml`, `agent/pages.json`, and each page's canonical link and JSON-LD (the `agent:begin` … `agent:end` block in `<head>`) | written by `python3 tools/agent_files.py` from the pages and `js/main.js`. Never edit them by hand. Run it after every page edit; `--check` only reports what is out of date |
| Team facts for the JSON-LD (founding year, location, verified profiles for `sameAs`) | `ORG` and `EXTRA_SAME_AS` at the top of `tools/agent_files.py` |
| Markdown for `Accept: text/markdown`, Link headers, the `/mcp` address | `.htaccess` (Hostinger only; the per-page part is written by the script) |
| MCP server (read-only tools: team info, pages, search, season schedule) and its server card | `mcp.php`, at https://mercury26413.org/mcp and `/.well-known/mcp/server-card.json` (built from `mcp.php`; the script saves a copy for hosts without PHP) |
| WebMCP tools for agents in the browser, and the contact form as a tool | the `webmcp` part of `js/main.js`; `toolname` / `toolparamdescription` on the form in `contact.html` |

To check the live server: `curl -sI -H 'Accept: text/markdown' https://mercury26413.org/` should answer
`content-type: text/markdown; charset=utf-8`, and `curl -sI https://mercury26413.org/` should show a `link:` header.

The contact form sends from the website through `contact.php` (PHP `mail()` on Hostinger), to `TEAM_EMAIL`
(Sponsorship to `SPONSOR_EMAIL`), with the sender as Reply-To. Its spam checks and limits are explained at its top:
5 messages an hour and 10 a day from one internet address, 5 a minute and 80 a day for the site (Hostinger allows
PHP 10 emails a minute and 100 a day). `FROM_EMAIL` (website@mercury26413.org) should be a real mailbox, so bounce
notices have somewhere to go. Where PHP isn't available (GitHub Pages), or the website can't send, the form opens
the visitor's email app instead.
