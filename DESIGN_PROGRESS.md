# Design progress — GNCE Mercury website

Checkpoint for website design work. Read this before starting, update it after each round.
(Reading it is a convention set in `CLAUDE.md`; nothing loads it automatically.)

_Last updated: 2026-11-11. **Round 9** gave each season its game's colour (from FIRST's style guides), made this
season's colour the site's one signal colour, replaced the home page's opening with a title card that flies into
the page, and added parts the visitor moves: a team strip, outreach stories, latest news and a photo viewer; see
"Round 9" below. Before it: the contact form sends from the website (`contact.php`), and **Round 8** restyled the
site after mclaren.com/racing/formula-1 (square corners, a floating white header bar, page and section headings in
capitals with a lighter second line, square buttons with a drawn arrow). The four sponsorship tiers wear the
colours of their names. Work is committed straight to `main`, Andy's standing instruction; `main` is the live site._

## What happened

1. **Rounds 1–3 (earlier on 2026-11-03)** refined the old dark "Rolex-style" design: commits `9a8dc6e`,
   `58bcfff`, `0d4e84d` (critique 23 → 29/40). The full notes for those rounds are in this file's git history
   (`git show 0d4e84d:DESIGN_PROGRESS.md`).
2. **Andy's verdict:** "your barely changed anything… I wanted you to use the skills to help me completely
   redesign the website, forget about what is currently on there, the only thing I want you to keep is
   content." He asked for something professional, somewhat interactive and not AI-looking, built after
   studying at least five big-company websites, with /vercel, Impeccable and frontend-design.
3. **This redesign** replaces the whole visual world, layout, components and interactions. Kept: every piece
   of content (text, facts, photos, renders, quotes), the Mercury logo, the sponsor strip on every page,
   the special-quotes lock, and the behaviour students rely on (`SEASON`, `SPONSORS`, crew filter links).

4. **Round 2 (same day).** Andy: the colour "is so AI-like", the site "feels too static"; the boxes and
   placement are fine; make it nicer but still professional, like Apple, TechCrunch, Vogue, The New York Times
   Company and Prada; use every skill. He also sent the 2026–27 sponsorship package (PDF) to add to the site.

## Round 9: season colours, a new opening, parts the visitor moves (2026-11-11)

Andy: "once again reference the mclaren page and build more interactive and somewhat colorful page. Use all the
different skills that is good to make a super nice design page", and about the opening: "make the like loading
into it page a lot cooler use your imagination the one rn look terrible".

**Colour.** Round 8 ended with no brand colour, because one accent on the buttons had looked terrible. This round
the colour comes from the subject. Each season wears its game's colour, read from FIRST's one-page style guide for
that game: INTO THE DEEP `#0083AE` (PMS 7704 C), DECODE `#92DBAC` (PMS 353 C), BIOBUZZ `#F7E326` (PMS 102 C).
`data-season="2024|2025|2026"` on a block sets `--c`. This season's colour (`--season`) is the site's one signal
colour, used the way McLaren uses papaya (measured on their page: about 1.5% of the screen, always a solid block, a
thin bar or an arrow): the header's sponsor button, the 28×8px tag above section headings, the next event in the
calendar, the chosen story's marker, the arrow buttons, the play tab. Every block of it carries an ink keyline, as
the yellow shapes in the BIOBUZZ logo do; that also keeps a light colour's edge clear on white. It is never a
page or section background behind reading text (the next event's tile, with a date and a name on it, is the
largest block of it), and only one signal button is in view at a time (the sponsor buttons on the stage are light
ones; on phones, where the header's button is inside the menu, the stage's takes the colour). On a season page
the tags take that season's colour. Off switch, if Andy dislikes it again:
`--season: var(--ink); --on-season: #fff;` in the "Round 9" block of `css/style.css` turns every signal block black.

**The opening** (home page, first visit of a session; replaces round 5's spotlight and iris). A title card: three
colour fields rise, one per season, each with its robot and game name, and a black strap carries the logo and the
team's name across them. Then every piece flies to its own place on the page underneath (the fields become the
three bays, the name becomes the heading, the logo goes to the header); they fly on black, and the page comes up
around them as they arrive. Measured from the page load: the flight starts at about 1.6 s and the card is gone
by about 2.4 s; any click, tap, wheel or key ends it within 0.2 s, and a press on the card never also presses what
lies under it. It never plays with reduced motion, without JavaScript, in a window under 480px tall, on a slow or
data-saving connection, in a tab that is not showing, or when its four pictures and the typeface are not in within
0.9 s; if `js/main.js` is late or never runs it still ends by itself. `index.html?intro` replays it.

**Parts the visitor moves** (none of them moves by itself, and nothing moves because of scrolling):
- the home line-up: each bay stands on its season's colour; the chosen one is lit, the others hold a deep shade of
  their own colour (BIOBUZZ's goes to a neutral dark: a darkened yellow is olive). The stage is as tall with one
  season chosen as with another, so nothing below it moves on a choice;
- a team strip on the home page (arrow buttons, mouse drag, swipe, Tab): the team photo and one card per member,
  the same members and order as `team.html`;
- outreach stories on the home page: from 900px one frame, the stories as rows beside it, the chosen story's
  sentence and link under the frame (the rows never move); under 900px a row of cards with the same arrow buttons;
- latest news on the home page: the two newest posts; a video gets a "Play video" tab that hands over to the
  video's own controls;
- a photo viewer (`<dialog>`: arrows, swipe, Esc, caption from the alt text) for the galleries on the outreach and
  season pages.

**Also:** the header and footer logo is a 240px WebP (17.7 KB; the 235 KB PNG stays for the icon, sharing image and
JSON-LD); a colour square before each season in the results table; hover and press states gated to real pointers;
forced-colours and print rules for the new parts.

**How round 9 was researched and reviewed.** The account's usage limit cut two of the agent runs short, so this is
what actually happened:

- Start of the round: a research workflow (McLaren's page: where its papaya sits and how much of it there is, how
  its modules behave; the team's own colour sources; the old opening) and a design panel with judges that settled
  the colour system, the modules and the opening's idea.
- A second study (frame captures of about 40 sites' openings, closer measurements of McLaren's modules) hit the
  usage limit before its four agents reported. The raw measurements of two of them were recovered from their
  transcripts and used. The three season colours were then checked by hand against FIRST's style guides.
- Final review, first try: four reviewers (break-tester, code reviewer, design critic, motion critic) hit the usage
  limit again and none reported. The break-tester had left 15 test reports and 498 screenshots of the opening on
  disk; those were read and used.
- Final review, second try: a design critic (Impeccable's critique method, score 28 of 40 before the fixes) and a
  motion critic (the choreograph and emil-design-eng skills) each worked alone from screenshots, frame sheets and
  the code, and both finished: 12 and 10 findings. The code review and the break tests of everything but the
  opening were done by the author (two scripts, 108 checks). After the fixes no second independent critique was
  run; the fixes were checked by tests and by looking at new captures.

**What the review found, all fixed unless noted:**
- Photo viewer on a desktop: the photo was laid out wider than the room it had, so it was cut off at the bottom and
  covered its caption and arrows (the stage's grid track was not definite). Found by the design critic and by the
  author's break test independently. Now 232 photo openings at 8 window sizes all fit.
- On a touch screen the tap that ended the opening also pressed what lay under the finger: it opened the sponsor
  page, switched the season or opened the menu (from the break-tester's reports). The card now keeps the pointer
  until its pieces have landed, and the press's click is swallowed.
- Arriving at Home from another page, the cross-page transition drew the header and three ghost robots over the
  title card for 0.8 s. The transition is dropped on a load where the opening plays.
- Choosing a season changed the stage's height (69px on a desktop, up to 151px on a phone), so everything below
  jumped. The three cards now share one cell and the labels one height: 0px at 13 widths.
- If `js/main.js` came late, the flight ran into the stylesheet's safety fade and the title and bays vanished for
  up to 0.8 s. A late script now means no flight.
- The frames in the middle of the flight showed the page's text sliced by the passing colour fields, and a yellow
  notch beside the name. The pieces now fly on black, the page comes up when they are nearly home, and the name's
  plate is as wide as the fields.
- The yellow sponsor button stood twice in one screen, and the closing band put a yellow box behind a heading, a
  sentence and a button, which is the use of colour Andy had turned down. The stage's sponsor buttons are light
  again and the closing band is two equal boxes, as on the old site.
- Story cards under 900px had no buttons and a hidden scrollbar (a mouse could not reach three of the four). They
  have the card strip's arrow buttons and drag now.
- Smaller things: a window resized in mid-flight; an input in mid-flight left two half-flown copies fading over the
  real pieces; the lights went down as a third beat; on phones two robots flew over the wrong colour; the card did
  not wait for the typeface; a tab opened in the background spent the opening unseen; BIOBUZZ's bay turned olive
  with the lights down and the light pool washed its yellow out; the team cards were 390px tall; a sentence was
  left alone under the strip; the viewer was see-through; the bays were uneven at 320px; the season link in the
  results table sat 3px low; three press depths and five durations answered one click; pictures still changed size
  under the pointer with reduced motion; a team card could take the keyboard focus half off the screen; on paper
  three of the four stories lost their text and seven team cards were cut off; in forced colours the chosen bay and
  story could not be told apart; with WCAG text spacing the third bay left a 320px screen.
- Not changed: early in the flight a 2–6px sliver of the colour fields shows above the name's plate for about
  0.15 s (the strap crosses the fields in the card's layout, and the two edges only meet at the end).

## Contact form sends from the website (2026-11-09)

Andy: "can you make it so that you can send the email in the website". The form used to open the visitor's own
email app. Now `contact.php` (PHP on Hostinger, like `mcp.php`) emails the message to the team email
(Sponsorship to Margaret) from website@mercury26413.org with the sender as Reply-To, and keeps no copy. The page
sends it with fetch and shows the result in the form; without JavaScript the browser posts to `contact.php` and
gets a short result page; on GitHub Pages (no PHP), or if sending fails, the form opens the email app as before.
Spam: a hidden trap field, a send in the first 3 seconds on the page is asked to press Send again, no links in
the name, at most 3 links in the message, 5 messages an hour and 10 a day from one internet address (a whole IPv6
network counts as one), and 5 a minute and 80 a day for the site (Hostinger allows PHP 10 emails a minute and 100
a day). The WebMCP form tool is now `send_message_to_team` (the visitor still presses Send). Terms and privacy says
what the form sends and keeps.

Review (a workflow: security, browser and privacy reviewers, each finding reproduced by a skeptic before it
counted) found 39 issues in the first version, fixed in a second pass: the limits are now one file changed under a
lock, so posts arriving together can't all pass (30 at once from one address sent exactly 5); the sender key is
the connecting address only (Hostinger's CDN docs: REMOTE_ADDR is already the visitor, and X-Forwarded-For can be
forged), with a per-minute cap for Hostinger's 10 a minute; nothing is sent if the counts folder isn't this
account's alone; the stored code is 4 characters of a salted hash that tens of thousands of addresses share; a
message is counted before sending; the server's note leads the email body, bidi and zero-width characters are
stripped, and Reply-To takes plain addresses only. In the page: an AI agent's send was reported to it as
"cancelled by a form reset" (Chrome cancels a WebMCP call when its form resets; the form now empties after the
answer); the trap field was a parameter of the WebMCP tool, so an agent filling it lost the message (now readonly,
which keeps it out of the tool, and emptied for agents); the time check compared two clocks (now the page sends its
own time on the page); field errors are written under the field and linked to it; a slow server no longer opens the
email app (the message may have been sent); a 429 opens the email app instead of blaming the visitor; the
leave-page warning comes back after the email app opens; the message box no longer cuts long pastes at 5,000
characters without a word; long addresses wrap. Without JavaScript the error page says to use Back to keep the
message. Tested locally with a captured-mail PHP server (no real email): 43 request cases and 33 browser cases.

## Round 8 follow-up: critique and adversarial review (2026-11-09)

The Impeccable critique of round 8 (index, partners, team; two isolated reviewers, snapshot
`.impeccable/critique/2026-11-09T05-19-09Z__index-html.md`) scored 20/28 (three heuristics n/a; 28/40 on the old
scale) and found that the 8% wider capitals broke narrow columns, the floating bar showed slices of the page
above it once scrolled, the light heading line was a formula, capitals and arrows were everywhere, and the
photos stayed small. Fixed in a second pass:
- Breakage: the partners h1 read "GNCE MERCU / RY" at 320 (now a normal space and a vw cap); "SPONSORSHIP" ran
  32-44px into the tier table at 1100-1440 (the tiers h2 now spans the sheet); "ABOUT GNCE MERCURY" overflowed
  its box (now a card heading, `h2.h3`, as is contact's "Joining the team"); "2026– / 27" splits (word joiners).
- Header: flush and full-width under 720px; from 720px it floats lined up with the content (logo and button on
  the content edges); scrolled, the 10px strip above it stays black; the open menu has a shadow, a scrim over
  the page (a click on it closes the menu) and no second "Partner with us" from 561px.
- Headings: the light line is Steel (Stage Light 2 on the stage); a heading splits only where it has a natural
  first line ("Our 2026–27 / sponsors", "From 4 to 17 / FIRST LEGO League teams in Weston"; the old split put
  the payoff "to 17" in the quiet line); every section-opening heading has the bar, no heading in a box does.
  Game names were back to 125% (round 8 had squeezed them to 108%); captain names and post titles sentence case.
- Capitals only on headings and buttons: the nav and text links are sentence case, like McLaren's. No arrow on
  mail links and submit buttons; a down arrow on downloads. Square focus rings; a skip link visible on the bar.
- Photos: the home outreach section now leads with its two photos side by side at one height (702x502 and
  502x502 at 1440, half their pixel width), unboxed. A full content-width photo band was not done (see Next).
- Smaller: reading width capped beside photos; results-table robot links underlined; Margaret's link a 24px
  target; a rule between a closing stage band and the black footer; "Ryken RoboBowl" no longer grey in the
  DECODE card (an older selector bug).

Adversarial review (a workflow: five reviewers, each followed by a skeptic who had to reproduce every finding):
37 confirmed, none refuted. The ones that mattered: the footer's VulcanForms logo link had an invisible focus
ring on every page (light ring on its white tile; older than round 8); the menu's scrim missed the footer in
browsers without `pagereveal`; focusing a header control mid-page made the page jump about 450px; the new
reading-width cap squeezed the season spec-sheet title row; BIOBUZZ split "BIOBUZ / Z" at 900-968; Margaret's
address split mid-word at 900-1097; the short-laptop stage rules had been dead since round 7 (overridden later
in the file). Third pass fixed all of them except the photo-band decision, and made 14 headings whose second line
started with a filler word ("Contact / us", "Parts / of the robot") single-line, with the same words.
- Tier colours (Andy, during this round: "also have more color like the sponsorship category should be the color
  of the tier name"): Bronze #C2814E, Silver #B9BEC6, Gold #E3BC59, Platinum #EAE8E1, softened from the package's
  metals, on the tier header blocks, the ticks in each column and the sponsor-card tier tags only. Picked from
  three rendered options (classic, softened, muted). Unlike the version Andy found AI-looking, the columns stay
  neutral and the budget donut stays grey. Ink on the blocks 5.7:1 (Bronze) to 14.9:1; ticks 5.5:1 or better.
- Skills that ran: Impeccable (critique with two isolated sub-agents, detector, craft floor), /vercel (live
  guidelines, unchanged since round 8: passes; the header bar's shadow fades with a box-shadow transition, a
  small paint cost kept on purpose), emil-design-eng (scrim fade, no motion on keyboard actions),
  workflow-based adversarial verification. frontend-design is not installed in this session.

- Verified (Playwright Chromium, the local static and Apache servers): interaction tests 67/67 and agent-readiness
  tests 57/57 after every pass; agent files up to date (`tools/agent_files.py --check`); detector clean on all 12
  pages (the config's file-only ignores each carry the reason they are false positives; rendered scans of partners
  and team report nothing). Review round 1: five reviewers and five skeptics, sweeps of 219 page loads at 18
  widths, 3,384 text measurements, 721 focus stops; 37 findings confirmed, none refuted. Round 2 (three re-checkers
  and their skeptics): 34 of the 37 fixed, the other three now no worse than the live site had them; 16 new small
  findings (11 after overlaps), fixed in a fourth pass. Final check: every h1 and h2 on the 12 pages breaks cleanly
  at 320-414 (no mid-word split, no line ending in "&", no overflow), and the header and menu behave from 320 to
  1920. The three small things it found are fixed in the commit after: 32px of air under the bar on 881-920px-tall
  screens too (it was 24px there), "INTO THE DEEP" kept off a line ending in "THE" on the home and Seasons cards,
  and a #target re-lined when the header grows after the browser's jump to it. Not possible here: Safari,
  Firefox, real phones, screen readers.

## Round 8: after McLaren F1 (2026-11-09)

Andy: "https://www.mclaren.com/racing/formula-1/ like this is one i really like use all the skills with this as
reference and make it", then "continue in max". Reference captured at 1440 and 390 (scratchpad refs/mclaren).
Adopted from McLaren: sharp square corners everywhere; a floating white header bar over the dark heads; page and
section headings in capitals, two weights (bold line, regular `.lite` line, as in "OUR 2026 / F1 DRIVER LINE-UP");
a short bar above headings; square uppercase buttons and links with a drawn north-east arrow. Not adopted:
papaya orange (Andy had just rejected colour mockups: ink does its job) and full-bleed photo heroes (the largest
team photo is 1400px wide, so it would be shown larger than its pixels).
- Skills that ran: extract-design-system (its Playwright needs a different browser build than this machine's, so
  the tokens were measured from the captures instead); Impeccable (context, craft floor, critique with two
  isolated reviewers, detector); emil-design-eng (arrow as a drawn icon, hover only with a mouse, no hover ring,
  eased header shadow); /vercel guidelines audit (forced-colours fallback for the current-page marker and the
  arrow). frontend-design is not installed in this session; Hallmark, tastemaker, Taste Skill, AccessLint and
  Chrome DevTools MCP were installed at project scope and load from the next session.
- Fixes found while checking: the wider capitals pushed "GNCE MERCURY" into the intro at 1440 (hero now
  2.75–5rem); "FIRST LEGO League" was one unbreakable 297px word at 320 (it may now break after FIRST); the bar's
  10px margin pushed the partner strip to 906px at 1440x900 (taken back from the stage padding); the home h1's
  second line has a hidden comma so screen readers and the Markdown copy read "GNCE Mercury, FTC team 26413".
- Verified: itest4 67/67, agent-test 57/57, layout audit of all 12 pages at 320/390/768/1440 (no overflow),
  contrast scan AA, keyboard focus visible on the white bar, reduced motion.

## Partners page in greys (2026-11-09)

Andy: the sponsorship tiers had "such AI colors" and the site felt monotone. Three single-colour directions
(FTC orange, robot blue, brass) were mocked on the real page; Andy: "just dont do the color it looks terrible".
So the colour went instead: the tier headers now step from mid grey (Bronze) to white (Platinum) over neutral
column washes, and the budget donut runs from bright to dim grey by size, with the table as its key. The
bronze/silver/gold token names stay in css/style.css so nothing else had to change. Contrast scan AA.

## Agent readiness (2026-11-04)

Andy asked to fix 16 findings from an agent-readiness scan of mercury26413.org (robots.txt, Content Signals,
sitemap, canonical, JSON-LD, sameAs, about/terms links, machine-readable contact, llms.txt, Markdown for
`Accept: text/markdown`, Link headers, WebMCP tools, MCP server card). Not a design round, but two visible changes:
- **Footer:** the legal row is now static HTML on every page and gains small About · Contact · Terms and privacy
  links (underlined, Stage Light 2, 0.8125rem); the sponsors strip and page links are still built by js/main.js.
- **New page:** terms.html (Terms and privacy), a stage page head and one prose column, linked from the footer.
- Everything else is for machines: see README "AI agents" and tools/agent_files.py.
- Verified live (2026-11-04): all 57 agent checks pass on https://mercury26413.org/ (scratchpad agent-test.js);
  Cloudflare's isitagentready.com scan moved from level 0 to level 4 "Agent-Integrated". Hostinger notes:
  LiteSpeed needs single-quoted Header values and ForceType for *.html.md; its CDN sometimes shows a JS bot check
  (403) to data-centre clients and answers GPTBot (OpenAI's training crawler) with 429, which fits ai-train=no.

## Round 7: no floating panels; boxes after VulcanForms (2026-11-04)

Andy: "i dont like the rounded pop out panel can you go back cuz it looks so ai and reference vulcanform website".
- **Reference study (vulcanforms.com, captured at 1440 and 390):** full-width sections on white with photography
  edge to edge; content in boxes drawn with a thin grey line and near-square 5–7px corners, like a spec sheet;
  bold headings; a small uppercase tracked menu; pill buttons; a black footer. Their bronze accent (#A58B64) was
  not adopted: the site keeps colour only from robots, photos, the logo and the partners page's tier metals.
- **Gone:** the grey page ground, the rounded section panels and their gaps (round 6). Sections run the full width
  again; inner page heads are full-width stage bands.
- **Boxes:** every tile, write-up, member, program, season row, post, fact, spec sheet, event, contact list,
  resource row and the results table is a white box with a 1px #C4C3CC line and 6px corners (Stage Step with a
  light line on the stage). Radii are now 4/6/8px. Inside a box, quotes, chips and photo frames are flat aluminium.
- **Type and chrome:** h1 and h2 at 700; the menu is 0.8125rem 600 uppercase with 0.06em tracking (fits one row
  from 1081px); the footer is black like the header, with the sponsor logos on white tiles.
- **Fixes in the round:** the results table's rows are padded inside their box on phones and the header row has
  room under the top line.
- Verified: itest4 67/67; audit of all 11 pages at 320/390/768/1440 (no overflow, one h1, no skipped headings);
  rendered contrast scan AA on every page; rendered detector clean except "VulcanForms" named 3× in the outreach
  tour card and 6× in the news post, which is the sponsor's name in prose, left as written.

## Round 6: contrast, defined boxes, fixes (2026-11-04)

Andy: "make the whole website more interactive and more contrasting", then "no, I don't really want the
highlight where my mouse moves stuff on the background; what I want is more contrast colors and defined boxes,
not just long pages of stuff". Also: fix the captain award table overlap, remove the special quotes and their
password prompt, the VulcanForms tour was Oct 31, and money raised is $20,000+.
- **Defined boxes:** every section is now a rounded panel on a mid-grey page ground (#D3D3DB, 12px gaps), every
  inner page head is a dark stage panel, and the footer is a panel. Inside, write-ups, members, outreach programs,
  season rows, the news post, the proof columns and the results table sit on cards in the opposite fill.
- **Contrast:** secondary text 9:1 on white and 10.9:1 on the stage; control edges (inputs, toggles, Copy, choice
  tiles) reach 3:1 (`--quiet` #7F7C8A); line buttons have ink borders; ink buttons visibly lighten on hover with a
  4px ring; the current nav item is bolder and brighter; the chosen outreach year is solid ink; stage rules and
  the home floor line are brighter; Stage Step tiles show against the stage.
- **Interaction:** the tier chart lights the column and row under the pointer; links have a heavier underline that
  tightens on hover; hover effects pause while the page scrolls. The pointer-following stage light was removed.
- **Fixes:** captain award tables share one column grid and never let the event column go narrower than its
  longest word (captains sit side by side from 1100px); special quotes and the password prompt removed (HTML, JS
  with its encrypted data, CSS, test); VulcanForms tour dated Oct 31, 2026 (outreach and the news post); home
  "Raised for parts, travel, and outreach" is $20,000+.
- Audit workflow (contrast + interaction auditors, merged list of 18): built items 2, 3, 4, 5, 10, 11, 12 and the
  scroll calm (a simpler form of item 1); the rest (photo viewer, tier "Ask" links, row links, chip filtering and
  others) wait for Andy, since he asked for contrast and boxes rather than more pointer effects.

## Round 5: opening animation and page transitions (2026-11-04)

Andy: "make me a opening animation and transition animation between sits".
- **Opening** (home, first visit of a session): the spotlight comes up on the Mercury mark, the name rises under
  it, then the stage opens like an iris onto the home page and the robots step in. About 1.7s, skippable, never
  with reduced motion or without JavaScript, `?intro` replays it. Built from the site's own spotlight idea.
- **Page transitions:** the page you leave dims like stage lights going down, the next one rises into place; the
  header stays put; season robots still glide between pages. Fallback entrance where unsupported.
- Verified: 68 of 68 interaction tests (10 new: plays once, clears itself, nothing left covering the page, click
  skips and the stage is lit within 1.3s, `?intro`, reduced motion, no JavaScript, a real Team to News navigation
  runs a view transition, the header holds still); frame-by-frame captures at 1440 and 390; all 11 pages clean at
  320/390/768/1440; contrast AA.

## Round 4b: budget section redone (2026-11-04)

Andy: "wording and formatting is still off and i dont really like it please redo" (the Season budget section;
his screenshot showed the intro running wide and the table caption floating apart from it at a mid width).
- Renamed "Where the money goes". Plain intro from the package's facts only: the $52,000 maximum, what it pays
  for, "Every line is a maximum: travel depends on which events we qualify for", the quarterly report.
- New layout: text and donut on the left, the table on the right, top-aligned, from 760px; stacked on phones.
  The table caption is visually hidden (it was the floating line); the donut centre reads "season maximum".
- Also: the in-kind help link now reads "Tell us" (still emails Margaret).

## Round 4: first Platinum sponsor and a News page (2026-11-04)

Andy: add VulcanForms (logo sent as a white-on-black 1200×630 image) as a sponsor, and make a blog section
thanking them "for applying for the platinum level sponsoring"; no exact amount, "$7,500+" for now (the deal is
not confirmed as final, so the post says "applying to sponsor" and promises no deliverables).
- **Sponsor:** `SPONSORS` in `js/main.js` now holds VulcanForms (logo `images/sponsors/vulcanforms-logo.png`, made
  from Andy's image: black on transparent, so it sits on the footer's white tiles; links to vulcanforms.com). It
  shows in every footer and in the "Supported by" lines (home and partners).
- **News page** (`news.html`, new, in the main nav after Outreach and in every page's no-JS nav): the first post,
  "Thank you, VulcanForms" (Nov 3, 2026), with Andy's banner image: thanks them for applying to sponsor at the
  Platinum level ($7,500+). Facts only from Andy, the package (what sponsorship funds cover) and the outreach
  page (the tour, now linked straight to `outreach.html#vulcanforms-tour`).
- **Review** (3 lenses, each finding re-checked by a skeptic): 6 confirmed and fixed (the post had stated the
  sponsorship as settled and promised Platinum deliverables; the tour link; a phone line break in "2026–27"; the
  banner's fetch priority; this log's wording), 5 rejected. The file-only hook's cramped-padding reports on
  partners.html are `clamp()` false positives, recorded as a file-scoped exception.
- **Partners:** an "Our 2026–27 sponsors" band (grey, after the budget) with a card for VulcanForms: logo,
  Platinum tag, $7,500+, and a link to the thank-you post.

## Round 3: no scroll motion, two-column outreach, Partners rework

Andy (2026-11-03): the tier table is "so large" and "not colorful"; he wants "an actual chart kinda like in the
pdf", a pie chart, a better-formatted table, the "price distribution" fixed, the whole sponsorship page
reworked; outreach in two columns; and "make it so that the things don't move as I scroll".

Done and pushed first (verified on its own):
- **No scroll motion anywhere.** Removed the one-shot scroll reveal (JS part and CSS), the scroll-linked stage
  dim (`animation-timeline: view()`), the pinned DECODE explorer (it now changes only on click, tap or arrow
  keys), and the sticky outreach text column. Only the header stays sticky. Load-time entrances and click
  feedback remain. New test: on 6 pages nothing animates or changes after scrolling down and back up.
- **Outreach two per row** from 860px (photo on top, story below; lead photos in a shared 4:3 frame, the
  portrait video-call grid letterboxed, not cropped); one per row on phones.

**Partners page rebuilt** ("the package sheet"). A design panel ran first: three critics (design director,
data editor, sponsor journey), a palette designer using the dataviz validator, and three competing page plans.
I built from the package-faithful plan (it had a working prototype) with the sponsor-first plan's best ideas,
and stopped the panel before its judges, since the page had moved past the plans. The critics found:
- the old tier table hid Gold and Platinum behind a sideways scroll on phones and ran about 790px tall there;
- the "price distribution" was drawn wrong: bars came from the rounded percentages against a hard-coded 38,
  so Travel read as 100% and Growth ($2,950) drew the same as the $2,500 lines;
- a head tile, "2026 / MA State Championship", read as a States win;
- the money story was told four times in seven bands (5,458px tall at 1440).

What it is now (5 bands, 4,284px at 1440):
- **Head on the stage:** "Sponsor GNCE Mercury", who the team is (package page 2), the tier range, Margaret's
  name, portrait and address in plain view, the PDF. The fact tiles are gone.
- **Sponsorship tiers on the same dark sheet:** the package's page 4 as a chart: solid metal header blocks
  (the PDF's own fills, ink text), each column washed in its metal, metal ticks, compact 40px rows, 880px wide,
  439px tall. At 640px and under it becomes a grid with each benefit on its own line, so all four tiers show
  at 320px with no sideways scroll.
- **Season budget:** a donut (Andy's pie chart) drawn from the dollar amounts by `js/main.js`, largest first
  from 12 o'clock, with the package's sentence about what sponsorship covers and the real table as its legend.
  Pointing at a slice or row lights both and shows that line in the centre; tap a slice on phones.
- **What you would be supporting** (white): team photo, the FTC explainer, Jessie Chan's quote from the
  package, and the three proof columns.
- **Become a sponsor** (stage): Margaret, the package's promise to respond promptly, the PDF, and other ways
  to help (in-kind, student visits, demonstrations).
- **Shares** match the package: Growth shows **5%** (Andy's call; $2,950 of $52,000 is 5.7%, and the package
  rounds so the column adds to 100%). The note under the table says so. The slices are drawn from the amounts.
- Colour: the tier metals and a nine-colour budget palette (copper/bronze/gold family plus verdigris and blued
  steel), validated with the dataviz script on Stage Black (all PASS); used only on the partners page.

## Round 2: Keynote stage

**Reference study** (Playwright, all five reachable; Prada partly): the UI stays neutral and the imagery
carries the colour; two weights, sentence case, tracking tightening with size; no shadows; motion is scarce
and one-shot (Apple: a 30px rise over ~0.9s and one sticky pin per story beat; no site uses scroll-scrubbed
timelines or hides its header); partners as sentences or wordmarks, never a logo wall. The synthesis named
why the violet read AI-like (the logo's hue flooded every wall and button; every heading wide and heavy;
nothing answered the visitor) and warned that a first pass of this round used Apple's exact neutrals
(#F5F5F7, #A1A1A6) and 28px cards, which would swap one cliché for a copy. Those values were replaced.

**Direction:** Impeccable `concept-seed` (seed:df12dec937d8ef74) assigned my #6 of seven grounded
candidates (a TechCrunch-style newsroom). Andy chose my pick card, **Keynote stage**: each season's robot
launched on an almost-black stage, lit, then calm light pages. Raises from the dealt hand: colour only for
what matters now (glass partition), one control transforms the stage (drawcord cape), every chosen state
addressable (`?season=`), fixed-place tabular figures for money (nixie), declared phone density steps,
lines drawn in sequence on load.

**Answers:** DECODE scores **12 balls** in autonomous (the package's number replaces 18/9); show the tiers,
the budget and the PDF on the partners page.

**Design plan (frontend-design, applied directly):**
- Palette: stage #0B0A0F (the logo's outline, almost black) with text #EFEEF3 / #A09DAC; paper #FFFFFF;
  cool grey #F1F1F4; ink #16141C; steel #5C5967; tier metals bronze #A8692F, silver #9AA0A8, gold #C29A2A,
  platinum #D6D9DE as swatches only. No brand hue: the logo keeps its violet, the walls do not.
- Type: Archivo at normal width in 400/600, tracking by size; robot names at 125% width, the team's voice.
- Layout: unchanged (Andy: boxes and placement are fine). Surfaces: flat filled tiles (14–18px corners), pill
  buttons, no section hairlines, no shadows except the robots' floor shadows.
- Motion thesis: one authored moment (on load the title rises and the robots step into the light one after
  another, the floor line draws); after that motion answers the visitor: the spotlight moves with the chosen
  season and its card comes up out of a blur; one-shot reveals (24px rise, 0.8s, 80ms stagger) for photos,
  tiles and data, bars drawing to their value; the DECODE explorer pins and walks through its six parts as
  you scroll; the stage dims as you scroll past it; a pulse on the next event. Reduced motion: all instant.
- Review against the clusters: near-black + one neon accent (no accent at all); SaaS card kit (tiles are flat,
  unshadowed, two radii by hierarchy, not everything is a tile); broadsheet hairlines (removed); Apple copy
  (own values, wide robot names, no blue).

**Sponsorship package on the site:** the PDF at `docs/`; partners page tiers table, ranked budget bars
(dataviz guidance: ranked bars in one ink, not the package's nine-colour donut), FTC explainer, visits and
demos; Margaret as head of sponsorship (team page record and email link); student-leader records for Zade
and Ethan; Ashna's Website chip; the camp line about VEX teams.

## Goal and audiences (from `PRODUCT.md`)

| Audience | What they need | Primary action |
|---|---|---|
| **Sponsors and donors** (first screen is theirs) | Is this a real, credible team? What does support pay for? | **Partner with us** → `partners.html` |
| Prospective students and parents | Who is on the team, what would I do, how do I join? | **Join as a student** → `contact.html?topic=join` |
| Judges and other FTC teams | How each robot works and changed | Season pages, Resources |

Andy's answers (2026-11-03): first screen for **sponsors**; keep **only the Mercury logo** from the old brand;
must not feel like **a generic tech startup** or **childish**; signature interaction **season story**;
direction **Motorsport season program** (picked from Impeccable's direction cards).

## Reference study (7 sites)

McLaren, Mercedes-AMG F1, Boston Dynamics, SpaceX, Apple, Rolex and Porsche were captured with Playwright at
desktop and phone widths and compared. What all of them do:
- one subject, one headline and one action on the first screen; a visible h1;
- one typeface in two or three weights, a neutral ground, one accent kept for interactive things;
- sections separated by a change of background, not by boxes;
- credibility from specific, dated facts; history told as uniform dated entries;
- no counters, no scroll-jacking, nothing that moves on its own except a deliberate video.
None of them puts sponsors in the first screen; for Mercury the strip goes directly under the hero, inside the
first screen (Boston Dynamics' placement), with names typeset and a "Partner with us" action.
Traps to avoid: neon on black, gradient text, frosted buttons, fade-up on every section, counters,
unmaintained live widgets, autoplay, stretched phone photos, a desktop nav hidden behind a hamburger,
copying McLaren's orange and notched corners or Apple's blue cards.

## Design plan (frontend-design two-pass plan, reviewed against the brief)

**Palette** (named hex values; tokens in `css/style.css` `:root`)

| Name | Hex | Role |
|---|---|---|
| Livery violet | `#2A2346` | The launch panel, season heads, partner panels |
| Lavender stripe | `#B9A6F2` | The livery stripe and accents on violet |
| Paper / paddock grey | `#FFFFFF` / `#F2F2F0` | Everything else, alternating by section |
| Ink | `#1C1A26` | Text (the logo's outline colour, not a generic #111) |
| Steel | `#585C65` | Secondary text |
| Action violet | `#5B3FC4` | Links and buttons on light grounds |

**Type**: one family, Archivo (variable width and weight, self-hosted). Machine names and the team name are
set wide and heavy (125% width, 800+ weight) like a livery; headings at 112% width; text at normal width.
Tabular figures for every date, spec and result. Sentence case; no all-caps labels except the official game
names (DECODE, INTO THE DEEP, BIOBUZZ).

**Shape**: square corners, hairline rules for data only, the logo's diamond as the one marker (selected
season, awards, next event, part markers, radio buttons).

**Layout**
```
[logo GNCE Mercury]        Seasons Team Outreach Partners Resources Contact [Partner with us]
┌──────────────────────────── violet launch panel ─────────────────────────────┐
│ GNCE Mercury (h1, wide)                              team line (one sentence) │
│ ┌ bay ──────┬ bay ──────┬ bay ──────┐  DECODE                                 │
│ │ robot     │ robot ✦   │ robot     │  2025–26, our second season…            │
│ │───floor───│───floor───│───floor───│  Dec 14  Ryken RoboBowl  Winning all.   │
│ │◇ 2024–25  │◆ 2025–26  │◇ 2026–27  │  Jan 24  WNEU  Sustain Award            │
│ │INTO THE.. │DECODE     │BIOBUZZ    │  3 specs · See how we built it          │
│ └───────────┴───────────┴───────────┘                                         │
│ ═══ lavender stripe ═══  Supported by SolidWorks, Weston Owl and WEEFC  [Partner with us] │
└──────────────────────────────────────────────────────────────────────────────┘
[The record so far: dated results table + three impact figures]
[The 2026–27 season so far: calendar from SEASON]  [Team]  [Outreach]  [Join / partner]  [footer + sponsors]
```
Season pages: violet season head (name, line, robot, facts row) → the robot and spec sheet → parts explorer
→ mechanisms → software → events → previous/next season.

**Review against the generated-design clusters** (what changed after the first plan):
- The first plan numbered the season tabs 01/02/03. The year ranges already carry the order, so the numbers
  were dropped (craft floor: numbers only when the sequence is information).
- Near-black + one accent (cluster 2) was the old site; the new ground is white/grey with a violet field.
- Hairline rules (cluster 3) are kept only where they separate data: results, specs, events, calendar.
- No eyebrow labels, no middle-dot meta strings, no mono "technical" labels, no "→" glyphs (cluster 5).
- The impact numbers are shown at data size, not as a hero metric, and are not animated.

**Motion**: only in answer to the visitor. Choosing a season lights its robot (the others dim and step back)
and slides its card in; choosing a part moves the marker; filters and tabs swap content; a robot glides into
its season page (cross-document view transition). Nothing on load, nothing on scroll, nothing loops.
Reduced motion makes every change instant.

## Decisions and conflicts

- **Default season in the line-up:** DECODE (2025–26), because it carries the dated record sponsors look
  for. Switch `data-default` to 2026 when BIOBUZZ has results.
- **Section numbers vs the direction contract:** the contract mentioned numbered tabs; the craft floor
  wins (see above).
- **Robot images:** INTO THE DEEP was cut out of its black background (`into-the-deep-robot-cut.webp`); the
  Mercinator was cut out with Canva's background remover (`mercinator-v1-cut.webp`, mask upscaled from
  Canva's preview and applied to the original photo). DECODE's CAD render already had transparency.
- **Sponsor content** moved from `contact.html#support` to a new `partners.html`; `contact.html#support`
  still exists and points there, so old links work.
- **Without JavaScript** every page shows a plain nav (`<noscript>`); the footer and sponsor strip are still
  built by `js/main.js` so that `SPONSORS` stays a single list.
- **"Join as a student"** stays the student action everywhere; "Partner with us" is the sponsor action.
- **Colour comes from the seasons (round 9).** The three season colours are FIRST's own (the one-page style guide
  of each game); nothing else on the site is coloured except the sponsorship tiers. This season's colour doubles as
  the signal colour. When a new season starts: add its colour, put `data-season` on its blocks and point `--season`
  at it (README, "Start a new season").
- **The signal colour and its off switch.** It marks one action (sponsoring) and "next" or "chosen", always as a
  solid block with an ink keyline, never as text, never as a tint and never as a page or section background
  behind reading text.
  One signal button is in view at a time: the header's. A first version closed the home page with a yellow box
  around the sponsor text; the design critic pointed out that this was the use of colour Andy had turned down in
  round 8, so the closing band is two equal boxes again. If the colour has to go altogether:
  `--season: var(--ink); --on-season: #fff;` in the "Round 9" block.
- **The opening is decoration and gives way to everything:** any input, reduced motion, a window under 480px tall,
  a slow or data-saving connection, a tab that is not showing, pictures or a typeface that take more than 0.9 s, a
  late or missing script, a window that changes size. Once per browser session.
- **The home strip shows only the members `team.html` shows** (that page hides some on purpose; see its comments).
  A test compares the two pages.
- **Nothing on the home page reflows on a choice:** the stage keeps its height whichever season is chosen, and
  choosing a story changes the photo and the text under the frame while the rows keep their place (McLaren's news
  module behaves the same way). The price on a phone: under a short season card there is empty stage.
- **Left as they were after the guideline review:** `theme-color` stays the stage black, and people's names carry
  no `translate="no"` (as on `team.html`).

## Blocked: needs facts, assets or accounts from the team

- ⊘ B1 A sharp wide team photo (≥ 2400 px wide). The Ryken photo is shown at its real 927 px until then.
- ⊘ B2 Joining facts: who can join (grades/schools), meeting schedule, time commitment, cost.
- ◐ B3 Sponsoring: tiers, budget, packet and contact (Margaret) now come from the 2026–27 package. Still missing:
  a donation link.
- ◐ B4 The contact form now sends from the website (`contact.php`, 2026-11-09). Needs the team, once: create the
  mailbox website@mercury26413.org in hPanel → Emails (bounce notices go there; forward it to the team email), then
  send one General and one Sponsorship test from the live form and check both arrive and aren't marked as spam.
  PHP `mail()` can't confirm delivery, so "on its way" is all the form says. If messages go missing, Hostinger
  recommends SMTP with a mailbox password instead of `mail()`; that needs a decision on where the password lives.
- ◐ B5 Sources for "1,000 students directly impacted" and "100,000+ students reached". The amount raised is now $20,000+ (Andy, 2026-11-04).
- ⊘ B6 Coach photos (the coaches are listed by name only).
- ⊘ B7 Resources links: code, CAD, portfolio, build log.
- ⊘ B8 2026 MA States results (alliance and awards show "—").
- ◐ B9 Partner logos: VulcanForms has its logo (round 4). SolidWorks, Weston Owl and WEEFC are still typeset names until logo files arrive; also one true
  sentence per partner about what they gave.
- ⊘ B10 Better robot images: a clean side-on photo of each robot on a plain background would make the
  line-up sharper (the INTO THE DEEP cut-out comes from an older rough cut-out; the Mercinator one from an
  upscaled mask).
- ◐ B12 Sponsorship package: the email is now a clickable link in `docs/` (added to the PDF directly, pages
  unchanged; redo it after a new Canva export, or turn the email into a link in Canva). Still to confirm: where
  the QR code points.
- ⊘ B13 One line each on what "Growth" (budget) and "Can request media" (Platinum) mean, and WEEFC's full name.
- ⊘ B14 Matching gifts and gifts under $500: who receives payment and how, so a parent at a company with a
  matching program can act (the page sends those questions to Margaret for now).
- ⊘ B15 VulcanForms: confirm the Platinum sponsorship is final and what the amount is. Until then the post says
  "applying to sponsor" and shows $7,500+; once it is final, change its lead to "signing on to sponsor".
- ⊘ B11 Which other members code: the Software filter shows only Arnie (Software Lead) until members get a
  Software chip.
- ⊘ B16 Round 9 on real hardware: the opening, the strip's swipe and the photo viewer have only run in Chromium on
  the build machine. Someone should open the home page on an iPhone (Safari) and an Android phone, and in Safari and
  Firefox on a computer, and say if anything looks or feels off.
- ⊘ B17 Hostinger's "Checking your browser" page: the test browser on the build machine got it before the site on
  a first visit (about 3.5 s; see "Latest verification"). If people on ordinary phones and computers get it too, it
  delays the home page and its opening. It is a setting of Hostinger's CDN, not of the site's files. Andy: open the
  site in a private window on a phone on mobile data and say whether it appears.

## Skills and checks actually used

**Round 9:**
- **Workflows (ultracode):** four runs. A research workflow and a design panel with judges at the start (both
  finished). A second study and the first final review (four agents each) were cut off by the account's usage
  limit before any agent reported; what they had written to disk or to their transcripts was read and used. A last
  workflow with two critics finished (see "How round 9 was researched and reviewed" above). The code review and
  most of the break testing were therefore done by the author, not by independent agents.
- **Impeccable 4.8.0:** craft floor, colorize and animate read before the UI edits; the detector hook ran after
  every edit; the rendered detector on all 12 pages of the final build at 1280×800 and 390×844: 0 findings with
  the project's exceptions. Without them it reports four names over the team strip's photos as 1.0:1 (it does not
  composite the dark scrim over the photo; measured against the real pixels the worst is 7.8:1, at 320px wide) and
  the sponsor's name repeated inside one article on the outreach page and one on the news page. An independent
  critic followed `reference/critique.md` on screenshots of 9 pages at two widths and
  24 captures of the parts in use: 28 of 40 before the fixes, 12 findings.
- **choreograph and emil-design-eng:** applied by the author to the opening, and used by the independent motion
  critic on exact frames of it (desktop and phone) and its measured timeline: 10 findings. Its verdict on Andy's
  request: the new opening "earns a lot cooler".
- **/vercel:** the live guidelines were fetched (identical to the bundled copy) and the changed files reviewed
  against them by the author: 5 fixes. The review fixes were read against the same copy again before the push:
  nothing new. An independent pass was part of the review that the usage limit cut off.
- **taste-skill (design-taste-frontend) and tastemaker:** invoked; tastemaker's scripts (`check_contrast.py
  --matrix`, `audit_motion.py`, `anti_slop_scan.py`) ran on the build and found no real issue.
- **mobile-native:** applied: hover only for real pointers, `touch-action` on the swipe surfaces,
  `overscroll-behavior` on the rows and the viewer, no text selection on controls. Not checked on a real phone.
- **AccessLint:** `audit_live` on all 12 pages of the final build, and on four in-use states set up inside the
  checker's own browser: a season chosen and the stories row stepped in a 420px window; a story and a season
  chosen, the team strip stepped and the video playing; the photo viewer open on the outreach page and on a season
  page. Fixed from it during the round: the header logo link's name now contains its visible text, and the season
  cards are `<section>` (role `tabpanel` is not allowed on `<article>`). Left: its `landmarks/region` note on the
  `<noscript>` fallback menu (it is a `<nav>` when it renders) and on the open photo viewer (a modal dialog is not
  a landmark and needs none; while it is open the rest of the page is inert). It also reports "low contrast" on a
  page title whenever it samples the title during its 0.9 s fade-in; on a settled tab it reports none, and the
  titles measure 17.1:1 from the pixels.
- **frontend-design:** not installed; its guidance applied directly. **Hallmark:** not used (it must not be used on
  an existing design).

**Round 3:**
- **Workflows (ultracode):** a design panel (three critics: design director, data editor, sponsor journey; a
  palette designer; three competing page plans; stopped before its judges once the build had moved past the
  plans), then a five-lens review (Impeccable finish reviewer, /vercel, content against the PDF, dataviz,
  regression and motion sweep) with an independent skeptic re-checking every finding: 13 confirmed and fixed,
  10 rejected or already fixed.
- **Impeccable 4.8.0:** craft floor read before the edits; the finish reviewer ran in the review (its first pass
  asked for recaptures because lazy photos were blank in full-page shots; recaptured with every image loaded,
  then the closing verdict below); rendered detector: 0 findings; the file-only hook's low-contrast and
  cramped-padding reports on partners.html are false positives (it reads the stage text as black and cannot
  evaluate `clamp()` padding) and are recorded as file-scoped exceptions in `.impeccable/config.json`.
- **/vercel:** the live guidelines (fetched, HTTP 200) applied by the review's /vercel lens to every changed file.
- **dataviz:** palette built and checked with its validator; donut built to its marks and interaction rules
  (2px gaps, legend in ring order, drawn from the amounts, table fallback); the skill ranks donuts low for 9
  parts, and Andy asked for one, so it ships with the full legend table.
- **anthropic-skills:no-slop-writing** rules applied to the new copy (no em dashes in prose, plain verbs).
- **frontend-design:** not installed; its guidance applied directly (as in rounds 1 and 2).

**Round 2:**
- **Impeccable 4.8.0**: invoked. `impeccable context`; references read: new-work, colorize, animate, typeset,
  delight, craft floor (before every UI edit). `concept-seed` roll (seed:df12dec937d8ef74), Andy's choice
  recorded (`--kind pick`), `surface-brief write` (contract updated twice: the choice, then the retune after the
  study). Rendered detector: 0 findings on all 10 pages. Finish reviewer: disposition "fix" with 4 confirmed
  material fixes, all applied; a verdict pass and the documenter followed (see "Latest verification").
- **/vercel**: invoked via the Skill tool; live guidelines fetched (HTTP 200, identical to the bundled snapshot,
  so no fallback); the audit ran in two review sub-agents over all 10 pages plus `css/style.css` and
  `js/main.js`, each finding re-checked by a separate verifier: 30 confirmed and fixed, 3 rejected.
- **anthropic-skills:website-building**: invoked; only its SKILL.md is installed here (its sub-files and palette
  generator are missing), so its top-level guidance was applied: research first, derive the palette from the
  subject, Playwright QA at desktop and mobile. Its "generate images" and "custom SVG logo" steps were skipped
  on purpose: the site uses only the team's real photos and keeps the Mercury logo.
- **anthropic-skills:no-slop-writing**: invoked for the new partners copy (banned-pattern sweep, no em dashes in
  prose, plain verbs).
- **dataviz**: invoked before the budget chart: ranked bars in one ink inside a real table, largest first,
  instead of the package's nine-colour donut.
- **frontend-design**: still not installed; its guidance was applied directly (the plan in "Round 2" above).
- **Reference study**: a 6-agent workflow studied the five sites in Playwright and wrote a synthesis.

**Round 1:**
- **frontend-design**: not installed in this environment (the Skill call failed; the plugin install card was
  shown). Its published guidance was **applied directly, not invoked**: the two-pass plan above, the cluster
  review, and the restraint rules.
- **Impeccable 4.8.0**: invoked. `init` wrote `PRODUCT.md`; `new-work` ran: reference study, `concept-seed`
  roll (`--scope direction --mode persuade`, seed:cb4434602c5788c2), direction cards answered by Andy,
  `surface-brief write` (`.impeccable/surfaces/index-html.md`, direction contract), craft floor read before
  every UI edit, detector, finish review, documenter (see "Latest verification").
- **/vercel**: invoked via the Skill tool. The live guidelines were fetched (HTTP 200; identical to the
  bundled snapshot, so no fallback). The audit itself ran inside two review sub-agents applying every rule
  to all 10 pages plus `css/style.css` and `js/main.js`; each finding was re-checked by a separate verifier.
- **Page building:** I built the system, the home page and the DECODE page; four sub-agents converted the
  other pages from the old content (`git show 0d4e84d:<file>`) under one written brief, and I merged and
  reviewed their work.

## Latest verification

**Round 9, 2026-11-11** (Playwright Chromium on the final build; a local static server, Apache + PHP for the agent
files, and a PHP server that writes mail to files for the contact form):
- Interaction suite: 168 passed, 0 failed. 64 of them are on the opening: once per session, every way of ending
  it, a tap on a touch screen not reaching the page under the card, a late and a missing `js/main.js`, a window
  resized in mid-flight, arrival from another page, a tab opened in the background, reduced motion, a slow
  connection, a short window.
- The author's break tests of the new parts (two scripts): 108 checks, all pass.
- Photo viewer: 232 photo openings at 8 window sizes (1920×1080 down to 320×640, and 844×390 on its side): every
  photo is shown whole between the bar above and the caption and arrows below.
- Line-up: with each of the three seasons chosen the stage is the same height, at 13 widths from 320 to 1920px
  (0px difference).
- Page audit, 12 pages at 320, 390, 768 and 1440px: no sideways page scroll, one `h1` per page, no skipped heading
  level, no script error, no failed request. Reported and intended: the team strip's cards beyond the screen edge
  (they are in its own scroller), the contact form's off-screen spam trap, text links inside sentences (19px tall)
  and the radio buttons' 18px dots (the labels are the targets).
- Contrast scan (text against its real background), 12 pages: nothing under WCAG AA. The names over the team
  strip's photos, measured against the pixels behind them: 7.8:1 or better at 320, 390, 768 and 1440px.
- Keyboard: every focus stop of the home page (65 at 1440px, 58 at 390px), the outreach page (41) and the BIOBUZZ
  page (23 at 390px) is on screen, clear of the header and has a visible ring; the skip link is painted on top of
  the header.
- Reduced motion (1440 and 390px): no opening, and nothing animates on a load, a season choice, a story choice, a
  strip step or in the photo viewer: 14 checks pass.
- Impeccable detector and AccessLint: see "Skills and checks actually used".
- Pixel comparison of the 11 pages other than Home, before and after the review fixes, at 1440 and 390px:
  identical (the one difference is the browser's own loading spinner on a video).
- The opening with the processor slowed down 4× and 6× (phone size): during the flight the frames stay 17 ms
  apart (worst 33 ms); the long tasks of the page starting up fall in the first 0.7 s, while the card builds. This
  machine draws in software, so a real phone can differ.
- Agent files: `python3 tools/agent_files.py --check` is clean; 57 checks of `robots.txt`, `llms.txt`, the
  Markdown copies, the `Link` header, the sitemap and `mcp.php` pass under Apache.
- Contact form (not changed this round): 43 request cases and 33 browser cases pass against the server that
  captures mail. No real email was sent.
- Not tested: real iPhones and Android phones, Safari, Firefox, screen readers, Windows High Contrast (its rules
  are written from the specification), a real slow network (the tests hold requests back locally), paper (print
  was checked in Chromium's print layout only).
- The live site after the push (`main` at `0b0ad67`): all 12 pages answer 200 with `?v=229`; `css/style.css`,
  `js/main.js`, the new logo file, four pages, `llms-full.txt` and `sitemap.xml` are byte-identical to the
  repository; the agent files and the Markdown copy on `Accept: text/markdown` answer as before, and so do
  `contact.php` (303 on a plain GET) and `mcp.php` (405 on a plain GET). In a browser the opening played with its
  flight (a first visit and `?intro`, at 1440×900 and 390×844), a season choice, the team strip and the photo
  viewer worked, and the 12 pages loaded without a script error or a failed request, each with the sponsor strip
  in its footer.
- Seen on the live host and not part of the site's files: Hostinger's CDN answered the test browser's first visit
  with its own "Checking your browser before accessing" page (HTTP 403), which reloaded into the site after about
  3.5 s; plain requests (curl) were served directly. Whether ordinary visitors get that page cannot be told from
  the build machine (B17). A browser check of the live site has to wait for that page to pass.

**Round 3, 2026-11-03** (Playwright Chromium, local static server):
- Interaction tests: **57 of 57 pass**. New ones: the DECODE explorer changes only on click and arrow keys and
  never on scroll; on 6 pages nothing animates or changes after scrolling down and back up (no reveal classes,
  no running animations, no changed opacity or transform).
- Render audit, all 10 pages at 320 / 390 / 768 / 1440: no horizontal overflow, no console or page errors, no
  failed requests, one `h1` per page, no skipped heading levels. Also no overflow at 396–450px (the footer
  address now breaks before "@"; it used to force sideways scroll on large phones).
- Partners: tier chart 888×439px at 1440; all four tiers on screen at 390 and 320 with no sideways scroll; the
  donut draws 9 slices from the amounts and is not drawn if the lines do not add up; hover and touch tap tested
  (a mouse click keeps the slice lit; a tap toggles; a tap elsewhere clears); without JavaScript the table stands
  alone; in forced-colours mode the table takes the full width and ticks follow the theme; print keeps the
  legend swatches. Ticks 4.7:1 or more on their washes, ink on every metal 5.3:1 or more, every slice 3:1 or
  more on the stage; palette passes the dataviz validator, also with the 1% slice treated as absent.
- Content: every tier cell, budget line, amount and share checked against the package; no invented facts
  (the cumulative-tier sentence and the free-demo item were removed after review).
- Contrast on the rendered pages (reduced motion): AA on every page. Impeccable rendered detector: 0 findings.
- Closing Impeccable finish verdict on fresh captures: the partners page passes on every one of Andy's points
  (compact, colourful tier chart like page 4; honest donut with a sorted legend; no visual defect at 320, 390,
  768 or 1440). Its two material fixes were applied: the sheet's hairlines above the tiers and the budget are
  gone (space alone separates them, per the contract), and the camp card on outreach now leads with its video
  in the same 4:3 frame (its photos moved into the strip), so the two columns end within about 50px of each
  other instead of leaving a 1,100px gap.
- Not tested: real iOS/Android devices, screen readers, Safari and Firefox.

**Round 2, 2026-11-03** (superseded where round 3 changed things: the tier table no longer scrolls inside a box,
the explorer no longer steps on scroll, and there are no one-shot reveals) (Playwright Chromium, local static
server):
- Render audit, all 10 pages at 320 / 390 / 768 / 1440: no horizontal overflow, no console or page errors, no
  failed requests, one `h1` per page, no skipped heading levels. The tier table scrolls inside its own box on
  phones (its sticky first column stays put); the hidden "Included / Not included" labels are contained.
- Interaction tests: **49 of 49 pass**, the round-1 suite plus `?season=` links, the chosen season written to
  the address, and the DECODE explorer stepping through all six parts in order as the page scrolls.
- One-shot reveals: every revealed block appears after scrolling, on 8 pages at 1440 and 390 (none stuck).
- Contrast measured on the rendered pages with reduced motion: AA on every page. (Without reduced motion the
  scan reads unrevealed blocks as invisible, which is the reveal working, not a contrast failure.)
- Impeccable detector on the rendered pages: 0 findings. The file-only hook still reports low contrast for
  stage text and cramped padding on bands, which it cannot see correctly; left standing, not suppressed.
- Finish review: the reviewer judged that the build mostly meets the Keynote-stage contract and mostly no
  longer reads AI-like ("the DECODE season page reads like a real hardware launch"); fixes applied:
  - home: the chosen robot now takes the middle of the stage (1.7× bay) and the stage is taller on tall screens;
  - seasons: no cards inside cards;
  - partners: plain lists instead of pill tiles, one duplicate sentence removed;
  - phone line-up labels aligned from the top.
- Verdict pass on those fixes: seasons and phone labels resolved; two partial, then fixed:
  - home: the three spec tiles in the season card became small plain text under the results, so the stage stays the subject; on
    short laptops (880px tall or less) the robots get more height, and at 760px or less the spec line gives way.
    Measured: the partner strip stays in the first screen at 1280×720, 1366×768, 1536×864 and 1440×900, and the
    chosen robot is 248–339px wide;
  - partners: "What you would be supporting" is three plain columns under an ink rule (no cards), and the
    FTC / visit / demo row is an unboxed two-column split.
  - Second verdict pass: **ship** (both resolved, no regression). Its two small notes were applied: at 760–1099px
    the lone third column spans the row, and from 1200px the team line on the home stage now starts exactly on
    the season card's left edge (it sat 7–9px off). This clearance covers those fixes, not the whole site.
- Documenter: `DESIGN.md` and `.impeccable/design.json` rewritten for the Keynote stage world from the shipped
  CSS and JS; a checker then compared every claim with the code and corrected 20 mismatches. It also listed
  eight colours still typed straight into rules instead of `:root` and two stale class names (`.ruled`,
  `.dia`); recorded in `DESIGN.md`, not changed.
- Content check against the package PDF: every tier cell, budget line, amount and percentage matches; no
  invented fact. Fixed:
  - the demo line now offers to talk about a demonstration (private demos are a Platinum benefit);
  - the DECODE spec sheet credits the package for the 12-ball count;
  - the budget bars have no full-width track (the longest bar is the largest line, not 100%);
  - the lead no longer says every dollar goes "straight to building robots" (travel is 38% of the budget).
- /vercel fixes include:
  - the pinned explorer only pins where it fits;
  - focus survives part changes;
  - print shows every block;
  - leaving an unsent contact message asks first;
  - the year pager uses real links;
  - footer headings are in order;
  - theme-color matches the dark header;
  - the next-event pulse stops after two beats;
  - hover states;
  - `translate="no"` on event names.
- Not tested: real iOS/Android devices, screen readers, Safari and Firefox (Chromium only).

**Round 1** (violet "Season Program"; superseded): see this file's git history at commit 4f09c6c.

## Next action

0. Andy's verdict on round 9: the colour (its off switch is under "Decisions and conflicts"), the opening
   (`index.html?intro` replays it) and the new parts of the home page. Then B16: a look on real phones and in
   Safari and Firefox, and B17: whether Hostinger's "Checking your browser" page shows for ordinary visitors.
1. Contact form (B4): the team creates website@mercury26413.org and sends two test messages from the live form.
2. Still open from round 8: with WCAG text spacing at 320, the outreach year tabs scroll sideways and the tier
   header cells overflow; Windows High Contrast and a screen reader on the skip link and the menu are unchecked.
3. Ask Andy for what is still blocked: a donation link, partner logos, sources for the three impact figures,
   joining facts, States results, a sharp wide team photo, coach photos, the package questions (B12–B14: the QR
   code's target, what "Growth" and "Can request media" mean, matching gifts) and B15 (is the VulcanForms Platinum
   sponsorship final, and the amount).
4. Confirm the DECODE engineering portfolio also says 12 balls before it is published next to the site.
5. When BIOBUZZ has results, switch `data-default` on the home line-up to 2026 and add its events. When the next
   game is announced, give the new season its colour (README, "Start a new season").
6. For every change: check at 320/390/768/1440 with keyboard and reduced motion, run `/vercel` on the changed
   files, run `python3 tools/agent_files.py`, bump `?v=` on the stylesheet and the script, push to `main`.

The scratchpad test scripts (`itest5.js`, `mb1.js`, `mb2.js`, `viewerfit.js`, `lineup_h.js`, `audit.js`,
`cscan.js`, `kbd.js`, `rm.js`, `labelpx.js`, and for the opening `stepflight.js`, `optime.js` and `perf_open.js`)
live outside the repo and won't survive a new session. Recreate them from the checks listed under "Latest
verification" if needed.
