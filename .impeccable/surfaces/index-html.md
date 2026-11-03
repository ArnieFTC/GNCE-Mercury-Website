---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["team.html","seasons.html","seasons/2024-2025.html","seasons/2025-2026.html","seasons/2026-2027.html","outreach.html","contact.html","resources.html","partners.html"]
---

# Surface brief: GNCE Mercury website (home + all pages)

Scope: round 2 of the redesign, every page. Andy (2026-11-03): the violet livery reads AI-like and the site
feels static; layout and placement stay, content stays, the Mercury logo stays; colour world, type use,
surfaces and motion are replaced. The 2026–27 sponsorship package (Andy, Canva PDF) is now a source of truth.
Visitor mode: Persuade (home, partners); Read (season pages, outreach, resources); Operate (contact form).
Audience and job: sponsors first (is this team credible and worth funding? how do I help?), then
students/parents (join), then judges/other teams (how each robot works and changed).
Action: "Partner with us" (tiers, budget, the package PDF, email Margaret), "Join the team" (contact form).
Proof: three robots in three seasons, dated results, named supporters, the 2026–27 tiers and $52,000 budget,
outreach programs with dates and photos, engineering write-ups.
Constraints: static HTML/CSS/JS, self-hosted fonts, no build step, sponsor strip in every footer,
WCAG 2.2 AA, works without JS and with reduced motion, photos never shown larger than their pixels.
Reference study: Andy's five (Apple, TechCrunch, Vogue, NYT Company, Prada), studied in a browser; the
synthesis warned against copying Apple's exact neutrals and 28px cards, so the values here are our own.
Answers (2026-11-03): direction Keynote stage (pick card); DECODE autonomous is 12 balls; show tiers, budget
and the PDF on the partners page.
Memorable moment: the robots rise into the light on a black stage; choosing a season moves the spotlight.
Unresolved: donation link, partner logos, stat sources, join facts, States results.

## Direction contract

THESIS: Launch each season's robot the way a product company launches hardware: the machine alone on a
black stage, lit, then calm light pages that explain it and the people and partners behind it. It refuses
the purple "AI" palette, the dark startup hero with neon accents, and the broadsheet of hairlines.

OWN-WORLD: Two grounds and no brand hue: an almost-black stage tinted from the logo's outline (#0B0A0F)
for launches, season heads, the partner head and the closing call, and white with a cool grey (#F1F1F4)
for reading. Colour comes only from the robots, photos, the logo and the four tier metals. Archivo at
normal width in two weights for text and headings; robot names set extra wide (125%) as the team's voice.
Flat filled tiles (14–18px corners, no shadows), pill buttons, no section hairlines; light is the accent.

STORY: A sponsor sees three real machines and a dated record in seconds, then the tiers, the budget and who
to email. Students meet the people and how to join. Judges scroll a season like a product page.

FIRST VIEWPORT: A dark translucent header with the logo, nav and a "Partner with us" pill. The black stage
fills the screen: "GNCE Mercury" and the team line; the three robots stand in a row on a lit floor, the
chosen one in a spotlight with its results and specs beside it; "Supported by …" and "Partner with us" at
the stage's foot, inside the first screen.

FORM: Product keynote stage (a hardware launch page), candidate 1 of 7 on my list, chosen as the pick card
over the assigned newsroom. Raises from the hand: colour reserved for what matters now, selection shown
as light brightening rather than sliding (glass partition, competitive); one control transforms the
stage (drawcord cape); every chosen state addressable by URL (HyperCard); fixed-place tabular figures for
money and results (nixie); declared density steps on phones (info-noise sleeve); lines and floors drawn in
sequence on load (blackbook). seed:df12dec937d8ef74

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
