# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: sponsors and donors.** Local businesses, companies and families deciding whether this team is
  credible and worth funding. The first screen is designed for them (Andy, 2026-11-03).
- **Prospective students and their parents**, deciding whether to join.
- **Judges and other FTC teams**, looking at how the robots work and how they changed.

## Product Purpose

The public website of GNCE Mercury, FIRST Tech Challenge team #26413 from Weston, Massachusetts, founded
in 2024. It exists to earn sponsorship, recruit members, and show the team's engineering and outreach.
Success is a sponsor emailing about support, a student asking to join, and a judge finding each robot's
engineering story.

## Positioning

A young team (three seasons) that already has a growing record: the Think Award in its rookie year,
then the Sustain Award, first pick on the winning alliance at the Ryken RoboBowl and a trip to the
Massachusetts State Championship in its second. It builds a new robot every season, documents how each
mechanism changed, and teaches younger students through camps and FLL coaching.

## Operating Context

- Hosted on GitHub Pages from `main`. Pushing to `main` updates the live site, and Andy's standing
  instruction is to commit there.
- Edited by students, so there's no build step. Every editable block has an HTML comment saying how to
  change it, and `README.md` has a quick edit guide.
- The season schedule (countdown, timeline, footer "next event") lives in `js/main.js` (`SEASON`).

## Capabilities and Constraints

- Static HTML, CSS and JavaScript only. Self-hosted fonts. No frameworks, trackers or third-party scripts.
- The **Our Sponsors & Supporters** strip appears in the footer of every page and is built once from
  `SPONSORS` / `SUPPORTERS` in `js/main.js` (see `CLAUDE.md`).
- The contact form opens the visitor's email app (mailto). A form service needs a team account
  (undecided).
- Every page has to work with keyboard, reduced motion and JavaScript off, from 320 px phones to desktop.

## Brand Commitments

- **Kept:** the Mercury logo (`images/logo-mark.png`, `images/logo.png`): the god Mercury inside a lavender
  diamond, used as-is. Andy confirmed that nothing else of the previous look is binding.
- **Name:** GNCE Mercury, FTC #26413. GNCE stands for Galactic Narwhal Chicken Effect. GNCE Diamond is the
  sister team.
- **Voice:** the team speaks as "we", in plain sentences.
- **Must not feel like:** a generic tech startup, or something childish (Andy, 2026-11-03). It should be
  professional, somewhat interactive and not AI-looking.

## Evidence on Hand

- **Robots**
  - INTO THE DEEP (2024–25): photo cut-out plus 5 mechanism images.
  - DECODE (2025–26): CAD render plus 6 mechanism renders and photos, a spec sheet, and software and
    autonomous details.
  - The Mercinator (BIOBUZZ, 2026–27): 2 photos.
- **Results**, per season and event:
  - Think Award, WNEU Qualifier (Feb 23, 2025).
  - Winning alliance and 1st pick, Ryken RoboBowl (Dec 14, 2025).
  - Sustain Award, WNEU Qualifier (Jan 24, 2026).
  - MA State Championship (Mar 15, 2026); results not yet given.
- **People**
  - 10 student members with portraits, years and roles, quotes and subteams.
  - Co-captain records for Andy and Arnie.
  - 4 coaches, named, with no photos.
  - Team photo from the Ryken RoboBowl (927 px wide).
- **Outreach**, with photos and dates:
  - MIT Francis Bitter Magnet Lab;
  - VulcanForms tour;
  - Phuthanang Youth Trust mentoring;
  - summer camp (about 13 students in grades 4–8);
  - FLL coaching: Weston grew from 4 to 17 teams and 122 students, 9 of 10 Field School teams competed and
    2 reached States;
  - Clark University showcase;
  - Cambridge Science Festival;
  - FLL mock qualifier.
  - Coach quotes from the FLL coaching.
- **Numbers on the home page:** 1,000 students directly impacted, $8,000+ raised, 100,000+ students reached.
  The team has not yet given sources for these.
- **Supporters:** SolidWorks, Weston Owl and WEEFC, as names only. There are no logos and no other sponsors.
- **Absent, never to be invented:**
  - sponsor tiers or benefits, and a donation link;
  - joining eligibility, meeting schedule and cost;
  - States results;
  - coach photos, and a high-resolution wide team photo;
  - testimonials beyond the existing quotes;
  - any statistic not listed above.

## Product Principles

1. Show the real work (the robots, the people, the record) before telling anything about it.
2. Every claim is the team's own and can be traced to an event, a photo or the portfolio.
3. Sponsors should see credibility and a clear way to help within the first screen.
4. Students maintain this site, so every block stays easy to edit by hand.

## Accessibility & Inclusion

WCAG 2.2 AA:
- full keyboard access, with visible focus;
- motion that can be paused or that respects reduced motion;
- readable at 200% zoom and on 320 px screens;
- content that still renders without JavaScript.
