# GNCE Mercury — FTC 26413 Website

Plain HTML/CSS/JS site, hosted on GitHub Pages.

## Quick edit guide

| What | Where |
|---|---|
| Nav tabs | `js/main.js` → `NAV` list at the top |
| Colors / fonts | `css/style.css` → `:root` at the top |
| Countdown + season timeline | `js/main.js` → `SEASON` list at the top (dates are `YYYY-MM-DD`, Eastern time) |
| "By the Numbers" stats | `index.html` → the `counter` divs (`data-count`, `data-prefix`, `data-suffix`) |
| Team members | `team.html` → copy/paste a `card member` block |
| Season list | `seasons.html` → copy/paste a card |
| Season robot + qualifiers | `seasons/<year>.html` → copy/paste an `event` block per qualifier |
| Outreach events | `outreach.html` |
| Sponsors (footer of every page) | `js/main.js` → `SPONSORS` list |
| Email, socials, donate link, form | `contact.html` |

## Adding photos

Put images in `images/`, then replace a placeholder like
`<div class="ph square">[ Photo ]</div>` with
`<img src="images/name.jpg" alt="Name" style="border-radius:10px;aspect-ratio:1;object-fit:cover">`.
(Use `../images/...` inside the `seasons/` folder.)

## Adding a new season

1. Copy `seasons/2026-2027.html` → `seasons/2027-2028.html` and edit it.
2. Add a card for it in `seasons.html`.
