// =========================================================
// GNCE Mercury 26413: shared header, footer, season line-up and page behaviour
// The nav and the sponsors are defined ONCE here, so every page stays in sync.
// Every section below is wrapped in part(), and each one quietly skips a page that
// doesn't have its block, so a pasted or missing block can never break a page.
// =========================================================

// SEASON SCHEDULE: drives the season calendar on the home page, the "next event" lines and
// the footer. Dates are "YYYY-MM-DD", in order. Past events stay listed and turn grey.
const SEASON = {
  kickoff: "2026-09-12",
  events: [
    { name: "Ghost Scrimmage", date: "2026-10-25" },
    { name: "Wolfpack Scrimmage", date: "2026-11-15" },
    { name: "Windsor Scrimmage", date: "2026-12-06" },
  ],
};

const NAV = [
  { label: "Seasons",   href: "seasons.html",   page: "seasons" },
  { label: "Team",      href: "team.html",      page: "team" },
  { label: "Outreach",  href: "outreach.html",  page: "outreach" },
  { label: "News",      href: "news.html",      page: "news" },
  { label: "Partners",  href: "partners.html",  page: "partners" },
  { label: "Resources", href: "resources.html", page: "resources" },
  { label: "Contact",   href: "contact.html",   page: "contact" },
];

// SPONSORS: shown in the footer of EVERY page (and named in the strip on the home page).
// Keep this on all pages. To add a sponsor with a logo:
//   { name: "Acme", logo: "images/acme.png", width: 240, height: 80, url: "https://acme.com" }
// (width and height are the logo file's real size in pixels).
// SUPPORTERS are named (no logo) until we have their logos. A "Become a sponsor" link is always shown.
const SPONSORS = [
  // Platinum, 2026–27 (thank-you post: news.html#vulcanforms-platinum)
  { name: "VulcanForms", logo: "images/sponsors/vulcanforms-logo.png", width: 782, height: 164, url: "https://www.vulcanforms.com/" },
];
const SUPPORTERS = ["SolidWorks", "Weston Owl", "WEEFC"];
const TEAM_EMAIL = "gncemercury26413@gmail.com";
// Sponsorship emails (the "Email us about sponsoring" buttons and the contact form's Sponsorship topic) go here.
// The buttons on partners.html and contact.html have this address written in them too: change both together.
const SPONSOR_EMAIL = "margaret@mercury26413.org";
const INSTAGRAM = "https://www.instagram.com/gnce_mercury/";

// Pages inside /seasons/ set data-root="../" on <body> so links still work.
const root = document.body.dataset.root || "";
const page = document.body.dataset.page || "";
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const part = (name, fn) => { try { fn(); } catch (e) { console.error("[mercury] " + name, e); } };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------- Time helpers ----------
// Everything runs on Eastern wall-clock time (America/New_York), so "next event" flips at
// midnight in Massachusetts for every visitor.
// Testing: add ?now=2026-11-15T09:00 to the address to see the site as it will look then.
const DAY = 86400000;
const toDate = str => { const [y, m, d] = str.split("-").map(Number); return Date.UTC(y, m - 1, d); };
const NOW_OVERRIDE = Date.parse((new URLSearchParams(location.search).get("now") || "") + "Z");
const easternNow = () => {
  if (!isNaN(NOW_OVERRIDE)) return NOW_OVERRIDE;
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
  }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
};
const fmt = (d, opts) => new Date(d).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
const SHORT = { month: "short", day: "numeric" };
const LONG = { weekday: "long", month: "long", day: "numeric" };
const iso = d => new Date(d).toISOString().slice(0, 10);
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

// The season's points (kickoff first), each marked past / today / next
const seasonPoints = () => {
  const now = easternNow();
  let nextMarked = false;
  return [{ name: "Season kickoff", day: toDate(SEASON.kickoff) },
    ...SEASON.events.map(e => ({ name: e.name, day: toDate(e.date) }))].map(p => {
    const past = now >= p.day + DAY;
    const today = now >= p.day && now < p.day + DAY;
    const next = !past && !today && !nextMarked;
    if (next) nextMarked = true;
    return { ...p, past, today, next, days: Math.ceil((p.day - now) / DAY) };
  });
};
// "Today: …", "Wolfpack Scrimmage, Saturday, November 15 (in 12 days)", or null once the season is over
const nextEvent = () => {
  const pts = seasonPoints().slice(1);
  const today = pts.find(p => p.today);
  if (today) return { text: `Today: ${today.name}`, short: `Today: ${today.name}` };
  const next = pts.find(p => p.next);
  if (!next) return null;
  const when = next.days === 1 ? "tomorrow" : `in ${plural(next.days, "day")}`;
  return { text: `${next.name}, ${fmt(next.day, LONG)} (${when})`, short: `${next.name}, ${fmt(next.day, SHORT)}` };
};

// ---------- Header ----------
// A solid bar with the nav and "Partner with us". Under 1081px the links open from a Menu button.
part("header", () => {
  const header = document.createElement("header");
  header.className = "site-header";
  const links = NAV.map(n => `<a href="${root}${n.href}"${n.page === page ? ' aria-current="page"' : ""}>${n.label}</a>`).join("");
  header.innerHTML = `
    <div class="container bar">
      <a class="brand" href="${root}index.html" aria-label="GNCE Mercury FTC team 26413, home">
        <img src="${root}images/logo-mark-240.webp" alt="" width="240" height="256">
        <span class="brand-name"><b translate="no">GNCE Mercury</b><small>FTC team 26413</small></span>
      </a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">
        <svg viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M2 5h14M2 13h14"/></svg>
        <span>Menu</span>
      </button>
      <nav class="nav" id="site-nav" aria-label="Main">${links}<a class="btn nav-cta" href="${root}partners.html"${page === "partners" ? ' aria-current="page"' : ""}>Partner with us</a></nav>
      <a class="btn header-cta" href="${root}partners.html"${page === "partners" ? ' aria-current="page"' : ""}>Partner with us</a>
    </div>`;
  const skip = document.createElement("a");
  skip.className = "skip-link";
  skip.href = "#main";
  skip.textContent = "Skip to content";
  // the skip link moves keyboard focus into main, not only the view: main takes focus once, then lets it go
  // (on blur, or on the next press inside it, so a later click and Tab carry on from where you clicked)
  skip.addEventListener("click", e => {
    const main = document.getElementById("main");
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !main || main.hasAttribute("tabindex")) return;
    main.tabIndex = -1;
    const drop = () => { main.removeAttribute("tabindex"); main.removeEventListener("blur", drop); main.removeEventListener("pointerdown", drop); };
    main.addEventListener("blur", drop);
    main.addEventListener("pointerdown", drop);
  });
  document.body.prepend(skip, header);
  // the header's real height (it grows with enlarged text spacing or a bigger default font) sets the page's
  // scroll padding and the header controls' scroll margin in css/style.css; without JavaScript the CSS fallback holds
  if ("ResizeObserver" in window) {
    // when it changes, a #target still sitting where the old padding put it (the browser's own jump to the address's
    // #fragment while the page loads) is lined up again under the new height
    const html = document.documentElement;
    new ResizeObserver(() => {
      const target = document.querySelector(":target");
      const lined = target && Math.abs(target.getBoundingClientRect().top - parseFloat(getComputedStyle(html).scrollPaddingTop)) < 1;
      html.style.setProperty("--header-real", header.offsetHeight + "px");
      if (lined) target.scrollIntoView();
    }).observe(header);
  }

  const btn = header.querySelector(".menu-btn");
  const label = btn.querySelector("span");
  const icon = btn.querySelector("path");
  const set = open => {
    header.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open);
    label.textContent = open ? "Close" : "Menu";
    icon.setAttribute("d", open ? "M3 3l12 12M15 3L3 15" : "M2 5h14M2 13h14");
  };
  btn.addEventListener("click", () => set(!header.classList.contains("is-open")));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && header.classList.contains("is-open")) { set(false); btn.focus({ preventScroll: true }); }
  });
  header.querySelector(".nav").addEventListener("click", e => { if (e.target.closest("a")) set(false); });
  // the open menu dims the page; a click or tap anywhere outside the bar and its panel (the dimmed page, or the
  // dark strip around a floating bar) closes it. A press that starts inside and is let go outside is not a click on the page.
  const bar = header.querySelector(".bar");
  let pressedInside = false;
  document.addEventListener("pointerdown", e => { pressedInside = bar.contains(e.target); }, true);
  document.addEventListener("click", e => {
    // only a pointer click has a press of its own (detail > 0); a keyboard or scripted click never inherits an old one
    const fromInside = pressedInside && e.detail > 0;
    pressedInside = false;
    if (header.classList.contains("is-open") && !fromInside && !bar.contains(e.target)) set(false);
  });
  matchMedia("(min-width: 1081px)").addEventListener("change", e => { if (e.matches) set(false); });
  // the open menu covers the page, so it closes as soon as keyboard focus leaves the header
  header.addEventListener("focusout", e => {
    if (header.classList.contains("is-open") && e.relatedTarget && !header.contains(e.relatedTarget)) set(false);
  });
  // once the page scrolls under it, the bar gains its shadow (and the strip beside it lets the page show)
  let ticking = false;
  const tint = () => { header.classList.toggle("is-scrolled", scrollY > 8); ticking = false; };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(tint); } }, { passive: true });
  tint();
});

// ---------- Footer: sponsors on every page ----------
// Each page ends in <footer class="site-footer"> holding only the legal row (plain HTML, so About, Contact and
// Terms work without JavaScript). The sponsors strip and the page links are added above that row here.
part("footer", () => {
  const legal = document.querySelector(".site-footer .footer-legal");
  const footer = legal ? legal.parentElement : document.createElement("footer");
  footer.className = "site-footer";
  const sponsorItems = [
    ...SPONSORS.map(s => `<li><a class="sponsor" href="${esc(s.url)}" target="_blank" rel="noopener" translate="no"><img src="${root}${esc(s.logo)}" alt="${esc(s.name)}"${s.width ? ` width="${s.width}" height="${s.height}"` : ""}></a></li>`),
    ...SUPPORTERS.map(n => `<li class="named" translate="no">${esc(n)}</li>`),
    `<li class="open"><a href="${root}partners.html">Become a sponsor</a></li>`,
  ].join("");
  const next = nextEvent();
  const top = `
    <div class="container footer-sponsors" id="sponsors">
      <div>
        <h2>Our Sponsors &amp; Supporters</h2>
        <p>Thank you to everyone who helps us build, compete, and run outreach.</p>
      </div>
      <ul class="sponsor-row" aria-label="Sponsors and supporters">${sponsorItems}</ul>
    </div>
    <div class="container footer-main">
      <a class="footer-brand" href="${root}index.html">
        <img src="${root}images/logo-mark-240.webp" alt="" width="240" height="256" loading="lazy">
        <span><b translate="no">GNCE Mercury</b><small>FTC team 26413, Weston, MA</small></span>
      </a>
      <div class="footer-cols">
        <div>
          <h2>Pages</h2>
          <ul>${NAV.map(n => `<li><a href="${root}${n.href}">${n.label}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h2>Reach us</h2>
          <ul>
            <li><a href="mailto:${TEAM_EMAIL}">${TEAM_EMAIL.replace("@", "<wbr>@")}</a></li>
            <li><a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram @gnce_mercury</a></li>
            <li><a href="${root}contact.html?topic=join#contact-form">Join the team</a></li>
          </ul>
        </div>
        <div>
          <h2>Next event</h2>
          <p>${next ? esc(next.short) : "The season is over. See you next season."}</p>
        </div>
      </div>
    </div>`;
  if (legal) {
    legal.insertAdjacentHTML("beforebegin", top);
  } else {
    footer.innerHTML = top + `
    <div class="container footer-legal">
      <span>© <span data-year></span> <span translate="no">GNCE Mercury</span>, <span translate="no">Galactic Narwhal Chicken Effect</span></span>
      <span><span translate="no">FIRST&nbsp;Tech&nbsp;Challenge</span> team&nbsp;26413, founded 2024</span>
      <nav class="footer-links" aria-label="About and legal"><a href="${root}team.html#about">About</a><a href="${root}contact.html">Contact</a><a href="${root}terms.html">Terms and privacy</a></nav>
    </div>`;
    document.body.append(footer);
  }
  footer.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
});

// "Supported by …" lines (home page strip, partners page) read the same list as the footer
part("supporters", () => {
  const names = [...SPONSORS.map(s => s.name), ...SUPPORTERS];
  if (!names.length) return;
  const text = names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1] : names[0];
  const html = names.map(n => `<span translate="no">${esc(n)}</span>`);
  const joined = html.length > 1 ? html.slice(0, -1).join(", ") + " and " + html[html.length - 1] : html[0];
  document.querySelectorAll("[data-supporters]").forEach(el => { el.innerHTML = joined; });
});

// ---------- Season calendar + next event ----------
// <ol class="calendar" data-calendar></ol> lists the season from SEASON above.
// <span data-next-event></span> is filled with the next event and how far away it is.
part("calendar", () => {
  const pts = seasonPoints();
  document.querySelectorAll("[data-calendar]").forEach(el => {
    el.innerHTML = pts.map(p => {
      const state = p.today ? "Today" : p.next ? (p.days === 1 ? "Next, tomorrow" : `Next, in ${plural(p.days, "day")}`) : "";
      const cls = p.today ? "is-today" : p.next ? "is-next" : p.past ? "is-past" : "";
      return `<li class="${cls}"><time datetime="${iso(p.day)}">${fmt(p.day, { weekday: "short", ...SHORT })}</time><b>${esc(p.name)}</b>${state ? `<span class="cal-state"><span class="dia" aria-hidden="true"></span>${state}</span>` : ""}</li>`;
    }).join("");
  });
  const next = nextEvent();
  document.querySelectorAll("[data-next-event]").forEach(el => {
    el.textContent = next ? next.text : "No more events this season. Results will show up here after the season.";
  });
});

// ---------- Home: the season line-up ----------
// Each .bay is a link to its season page. With JavaScript the bays become tabs: choosing one
// lights its robot and shows that season's card. Ctrl/Cmd-click still opens the season page.
// data-default on the line-up picks the season shown first.
part("lineup", () => {
  const lu = document.querySelector("[data-lineup]");
  if (!lu) return;
  const list = lu.querySelector(".bays");
  const bays = [...lu.querySelectorAll(".bay")];
  const cards = bays.map(b => document.getElementById(b.dataset.card));
  if (!list || bays.length < 2 || cards.some(c => !c)) return;
  list.setAttribute("role", "tablist");
  list.setAttribute("aria-label", "Our seasons");
  bays.forEach((b, i) => {
    if (!b.id) b.id = "bay-" + i;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", cards[i].id);
    cards[i].setAttribute("role", "tabpanel");
    cards[i].setAttribute("aria-labelledby", b.id);
  });
  let current = -1;
  const select = (i, { user = false, focus = false } = {}) => {
    if (i === current) { if (focus) bays[i].focus(); return; }
    current = i;
    bays.forEach((b, j) => { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; });
    cards.forEach((c, j) => { c.hidden = j !== i; c.classList.toggle("is-current", j === i); });
    if (user && !RM) {
      const c = cards[i];
      c.classList.remove("is-entering");
      void c.offsetWidth;
      c.classList.add("is-entering");
    }
    if (focus) bays[i].focus();
    if (user) {
      const url = new URL(location.href);
      url.searchParams.set("season", bays[i].dataset.season);
      history.replaceState(null, "", url);
    }
  };
  bays.forEach((b, i) => b.addEventListener("click", e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    select(i, { user: true });
  }));
  list.addEventListener("keydown", e => {
    const keys = { ArrowRight: current + 1, ArrowLeft: current - 1, ArrowDown: current + 1, ArrowUp: current - 1, Home: 0, End: bays.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select((keys[e.key] + bays.length) % bays.length, { user: true, focus: true });
  });
  const asked = new URLSearchParams(location.search).get("season");
  const start = [asked, lu.dataset.default].map(v => bays.findIndex(b => b.dataset.season === v)).find(i => i >= 0);
  select(start ?? bays.length - 1);
  lu.classList.add("is-ready");
  // A name wraps differently when its bay is the wide, chosen one, so the labels would be taller with one season
  // chosen than with another and everything under the stage would move on a choice. The labels get the height of
  // the tallest case (measured by trying each choice once, with the transitions off); the three cards already
  // share one cell (css/style.css).
  const labels = bays.map(b => b.querySelector(".bay-label"));
  if (labels.every(Boolean)) {
    let wide = 0;
    const level = () => {
      wide = innerWidth;
      lu.classList.add("is-still");
      list.style.removeProperty("--label-h");
      let max = 0;
      bays.forEach((_, i) => {
        bays.forEach((b, j) => b.setAttribute("aria-selected", j === i));
        max = Math.max(max, ...labels.map(l => l.getBoundingClientRect().height));
      });
      bays.forEach((b, j) => b.setAttribute("aria-selected", j === current));
      list.style.setProperty("--label-h", Math.ceil(max) + "px");
      void lu.offsetWidth;
      lu.classList.remove("is-still");
    };
    level();
    let queued = false;
    addEventListener("resize", () => {
      if (queued || innerWidth === wide) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; level(); });
    }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(level);
  }
});

// ---------- Outreach year tabs ----------
// Each <section class="year-panel" data-tab="Third year · 2026–27"> becomes a tab; the first one shows first.
// Without JavaScript every year simply shows, one after another.
part("year-tabs", () => {
  const tabBar = document.querySelector(".year-tabs");
  const panels = [...document.querySelectorAll(".year-panel")];
  if (!tabBar || panels.length < 2) return;
  const parts = p => (p.dataset.tab || p.id).split(" · ");
  tabBar.setAttribute("role", "tablist");
  tabBar.innerHTML = panels.map(p => {
    const [name, year] = parts(p);
    return `<button type="button" role="tab" id="tab-${p.id}" aria-controls="${p.id}"><span class="tab-name">${esc(name)}</span>${year ? `<span class="tab-year">${esc(year)}</span>` : ""}</button>`;
  }).join("");
  const tabs = [...tabBar.querySelectorAll("[role=tab]")];
  const label = j => { const [n, y] = parts(panels[j]); return n + (y ? ", " + y : ""); };
  panels.forEach((p, i) => {
    p.setAttribute("role", "tabpanel");
    p.setAttribute("aria-labelledby", "tab-" + p.id);
    const nav = document.createElement("nav");
    nav.className = "year-pager";
    nav.setAttribute("aria-label", "Other years");
    nav.innerHTML = (i > 0 ? `<a class="btn btn--line" href="#${panels[i - 1].id}" data-go="${i - 1}">Previous: ${esc(label(i - 1))}</a>` : "<span></span>")
      + (i < panels.length - 1 ? `<a class="btn btn--line" href="#${panels[i + 1].id}" data-go="${i + 1}">Next: ${esc(label(i + 1))}</a>` : "");
    p.append(nav);
  });
  let current = -1;
  const select = (i, { focus = false, user = false } = {}) => {
    const changed = i !== current;
    current = i;
    panels.forEach((p, j) => { p.hidden = j !== i; });
    tabs.forEach((t, j) => { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; });
    if (changed && user && !RM) {
      const p = panels[i];
      p.classList.remove("panel-in");
      void p.offsetWidth;
      p.classList.add("panel-in");
    }
    if (user) history.replaceState(null, "", "#" + panels[i].id);
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => t.addEventListener("click", () => select(i, { user: true })));
  document.addEventListener("click", e => {
    const b = e.target.closest(".year-pager [data-go]");
    if (!b || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const j = +b.dataset.go;
    select(j, { user: true });
    tabBar.scrollIntoView({ block: "start", behavior: RM ? "auto" : "smooth" });
    tabs[j].focus({ preventScroll: true });
  });
  tabBar.addEventListener("keydown", e => {
    const keys = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select((keys[e.key] + tabs.length) % tabs.length, { focus: true, user: true });
  });
  // the address can name a year (#year-2) or anything inside one (#summer-camp): that year opens, and the page goes
  // to the thing named (the browser could not, while its year was hidden)
  const target = () => { try { return document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { return null; } };
  const open = () => {
    const el = location.hash.length > 1 ? target() : null;
    const j = el ? panels.findIndex(p => p === el || p.contains(el)) : -1;
    if (j < 0) return false;
    select(j);
    if (el !== panels[j]) el.scrollIntoView();
    return true;
  };
  if (!open()) select(0);
  addEventListener("hashchange", open);
});

// ---------- Robot callouts (season pages) ----------
// <ol class="callouts" data-x data-y data-card> inside a <figure> with the robot render.
// Without JavaScript it is a plain list of parts. With it, each part gets a marker on the
// render and a button; choosing one shows its note and lights its marker.
part("callouts", () => {
  document.querySelectorAll(".callouts").forEach(list => {
    const fig = list.closest("[data-explorer]");
    const img = fig?.querySelector("img");
    const items = [...list.querySelectorAll(":scope > li")].filter(li => li.dataset.x && li.dataset.y);
    if (!img || items.length < 2) return;

    // the markers sit in a box exactly the size of the image
    const stage = document.createElement("span");
    stage.className = "callout-stage";
    img.before(stage);
    stage.append(img);

    const note = document.createElement("div");
    note.className = "callout-note";
    note.id = (list.id || "callouts") + "-note";
    note.setAttribute("aria-live", "polite");
    note.innerHTML = '<p><b></b><span></span></p><a class="text-link"></a>';
    const noteName = note.querySelector("b"), noteText = note.querySelector("span"), noteLink = note.querySelector("a");

    const parts = items.map((li, i) => {
      const name = li.querySelector("b")?.textContent.trim() || "Part " + (i + 1);
      const m = document.createElement("button");
      m.type = "button";
      m.className = "callout-mark" + (li.dataset.label === "below" ? " below" : "");
      m.tabIndex = -1; // the buttons in the bar are the keyboard path
      m.setAttribute("aria-hidden", "true");
      m.style.left = li.dataset.x + "%";
      m.style.top = li.dataset.y + "%";
      m.innerHTML = `<span class="callout-label">${esc(name)}</span>`;
      stage.append(m);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "callout-btn";
      b.textContent = name;
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("aria-controls", note.id);
      return { li, m, b, name };
    });

    const bar = document.createElement("div");
    bar.className = "callout-bar";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", list.getAttribute("aria-label") || "Parts of the robot");
    parts.forEach(x => bar.append(x.b));
    list.hidden = true;
    list.after(bar, note);

    let current = -1;
    const select = (i, user) => {
      if (i === current) return;
      current = i;
      parts.forEach((x, j) => {
        x.b.setAttribute("aria-pressed", j === i);
        x.m.classList.toggle("is-on", j === i);
      });
      stage.classList.add("has-on");
      const { li, name } = parts[i];
      const text = li.querySelector(":scope > span")?.textContent.trim() || "";
      const card = li.dataset.card && document.getElementById(li.dataset.card);
      noteName.textContent = name;
      noteText.textContent = text;
      noteLink.hidden = !card;
      if (card) { noteLink.href = "#" + card.id; noteLink.textContent = `More on the ${li.dataset.link || name.toLowerCase()}`; }
      if (user && !RM) { note.classList.remove("note-in"); void note.offsetWidth; note.classList.add("note-in"); }
    };
    const goTo = i => select(i, true);
    parts.forEach((x, i) => {
      x.b.addEventListener("click", () => goTo(i));
      x.m.addEventListener("click", () => { goTo(i); x.b.focus({ preventScroll: true }); });
      x.b.addEventListener("pointerenter", () => x.m.classList.add("is-hint"));
      x.b.addEventListener("pointerleave", () => x.m.classList.remove("is-hint"));
    });
    // arrow keys move between parts, like a toolbar
    bar.addEventListener("keydown", e => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      const i = (parts.findIndex(x => x.b === document.activeElement) + k + parts.length) % parts.length;
      parts[i].b.focus({ preventScroll: true });
      goTo(i);
    });
    select(0, false);
  });
});

// ---------- Team: the crew filter ----------
// Built from the <span class="chip"> subteams and <span class="lead-tag"> roles on each member.
part("crew-filter", () => {
  const grid = document.querySelector("[data-filter]");
  if (!grid) return;
  const members = [...grid.querySelectorAll(".member")];
  const chipsOf = m => [...m.querySelectorAll(".chip")].map(c => c.textContent.trim());
  const roleTeams = m => [...m.querySelectorAll(".lead-tag")].map(t => t.textContent.trim()).filter(t => / Lead$/.test(t)).map(t => t.replace(/ Lead$/, ""));
  const tagsOf = m => [...chipsOf(m), ...roleTeams(m)];
  const ORDER = ["CAD", "Build", "Outreach", "Electrical", "Software", "Game Strategy"];
  const found = [...new Set(members.flatMap(tagsOf))];
  if (!found.length) return;
  const labels = [...ORDER.filter(l => found.includes(l)), ...found.filter(l => !ORDER.includes(l))];
  const hasLeads = members.some(m => m.querySelector(".lead-tag"));
  const all = ["All", ...labels, ...(hasLeads ? ["Leads"] : [])];
  const bar = document.createElement("div");
  bar.className = "crew-filter";
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", "Filter members by subteam");
  bar.innerHTML = all.map((l, i) => `<button type="button" aria-pressed="${i === 0}">${esc(l)}</button>`).join("");
  const count = document.createElement("p");
  count.className = "crew-count";
  count.setAttribute("aria-live", "polite");
  grid.before(bar, count);
  const apply = (label, user) => {
    bar.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.textContent === label));
    const shown = [];
    members.forEach(m => {
      const match = label === "All" || (label === "Leads" ? !!m.querySelector(".lead-tag") : tagsOf(m).includes(label));
      const appearing = match && m.hidden;
      m.hidden = !match;
      if (match) shown.push(m.querySelector("h3")?.textContent.trim());
      if (appearing && user && !RM) m.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    });
    count.textContent = "";
    if (label !== "All") {
      count.append(`${shown.length} of ${members.length} members ${label === "Leads" ? "are leads" : "in " + label}`);
      const names = document.createElement("span");
      names.className = "visually-hidden";
      names.textContent = `: ${shown.join(", ")}`;
      count.append(names);
    }
    // keep the choice in the address so a filtered view can be shared (team.html?crew=CAD)
    if (user) {
      const url = new URL(location.href);
      if (label === "All") url.searchParams.delete("crew"); else url.searchParams.set("crew", label);
      history.replaceState(null, "", url);
    }
  };
  bar.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (btn) apply(btn.textContent, true);
  });
  const fromUrl = (new URLSearchParams(location.search).get("crew") || "").toLowerCase();
  const start = all.find(l => l.toLowerCase() === fromUrl);
  if (start) apply(start, false);
});

// ---------- Contact form (contact page) ----------
// Sends the message from the website: contact.php emails it to the team (Sponsorship to SPONSOR_EMAIL). If the
// website can't send it (no PHP on a copy of the site, the server is down, a limit is reached), the visitor's
// email app opens with the message instead, as the form did before.
part("contact", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  // contact.html?topic=join (or sponsor / outreach) pre-selects the topic
  const TOPICS = { join: "Joining the team", sponsor: "Sponsorship", outreach: "Outreach / collaboration" };
  const asked = TOPICS[new URLSearchParams(location.search).get("topic")];
  if (asked && form.elements.topic) form.elements.topic.value = asked;
  // A one-line prompt under "Message" for each topic: what's useful for us to know
  const HINTS = {
    "Joining the team": "Rookies are part of the team from day one. Tell us what you’d like to work on (building, coding, CAD, or outreach) and anything you want to ask.",
    "Sponsorship": "Tell us who you are and how you’d like to help.",
    "Outreach / collaboration": "Tell us about your event, school or group.",
  };
  const hint = document.getElementById("message-hint");
  const showHint = () => { if (hint) hint.textContent = HINTS[form.elements.topic?.value] || ""; };
  form.addEventListener("change", e => { if (e.target.name === "topic") showHint(); });
  showHint();
  const status = form.querySelector(".form-status");
  const button = form.querySelector("button[type=submit]");
  const f = form.elements;
  // a typed message is not lost by accident: the browser asks before leaving the page
  let dirty = false;
  const warn = e => { e.preventDefault(); e.returnValue = ""; };
  const setDirty = d => { if (d !== dirty) { dirty = d; (d ? addEventListener : removeEventListener)("beforeunload", warn); } };
  const hasMessage = () => !!f.message?.value.trim();

  // the status line beside the button; email addresses in it are links
  const mail = address => ({ href: `mailto:${address}`, text: address });
  const say = (...parts) => {
    if (!status) return;
    status.replaceChildren(...parts.map(p => {
      if (typeof p === "string") return p;
      const a = document.createElement("a");
      a.href = p.href;
      a.textContent = p.text;
      return a;
    }));
  };
  // a problem with one field: shown under it and linked to it for screen readers, until the visitor edits it
  const clearError = el => {
    const err = el?.id && document.getElementById(`${el.id}-error`);
    if (!err) return;
    err.remove();
    el.removeAttribute("aria-invalid");
    const ids = (el.getAttribute("aria-describedby") || "").split(" ").filter(id => id && id !== err.id);
    if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
    else el.removeAttribute("aria-describedby");
  };
  const showError = (el, text) => {
    clearError(el);
    const err = document.createElement("p");
    err.className = "field-error";
    err.id = `${el.id}-error`;
    err.textContent = text;
    el.after(err);
    el.setAttribute("aria-invalid", "true");
    el.setAttribute("aria-describedby", [el.getAttribute("aria-describedby"), err.id].filter(Boolean).join(" "));
  };
  form.addEventListener("input", e => { clearError(e.target); setDirty(hasMessage()); });

  const send = async () => {
    const name = f.name.value.trim();
    const email = f.email.value.trim();
    const to = f.topic.value === "Sponsorship" ? SPONSOR_EMAIL : TEAM_EMAIL;
    // when the website can't send it: the visitor's email app, with the message filled in
    const draft = why => {
      const subject = `${f.topic.value} from ${name}`;
      const body = `${f.message.value}\n\n${name}\n${email}`;
      const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setDirty(false);
      location.href = url;
      // the message is still only in this form: warn again before leaving the page
      setTimeout(() => setDirty(hasMessage()), 500);
      say(`${why} We’re opening it in your email app instead${url.length > 1900 ? " (check that the whole message is in the draft: long messages can get cut short)" : ""}. If nothing opens, email us at `, mail(to), ".");
      return `Not sent from the website (${why}). The browser was asked to open the visitor's email app with a draft to ${to}; nothing is sent unless they press Send there.`;
    };
    // contact.php refuses a message sent within a few seconds of the page opening (it measures nothing itself)
    if (f.t) f.t.value = String(Math.round(performance.now()));
    say("Sending…");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    let res, data;
    try {
      res = await fetch(`${root}contact.php`, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" }, signal: ctrl.signal });
      data = await res.json().catch(err => { if (err.name === "AbortError") throw err; return null; });
    } catch (err) {
      if (err.name !== "AbortError") return draft("Your message couldn’t be sent from the website: there was no connection.");
      // no answer in 30 seconds: the server may still have sent it, so don't offer to send it twice
      say("Our website is taking a long time to answer, so your message may or may not have been sent. If you don’t hear from us in a few days, email us at ", mail(to), ".");
      return `Unknown: the website didn't answer within 30 seconds, so the message may or may not have been sent. Don't send it again; if there is no reply in a few days, the visitor can email ${to}.`;
    } finally {
      clearTimeout(timer);
    }
    if (res.ok && data && data.ok === true) {
      setDirty(false);
      say(`Thanks${name ? ", " + name : ""}. Your message is on its way to the team, and we’ll reply to ${email}.`);
      // Empty the form only after an agent has had its answer: Chrome cancels a WebMCP call when its form resets.
      // For a moment a second press does nothing (no "Please fill out this field" on the emptied form).
      quietUntil = performance.now() + 1500;
      form.noValidate = true;
      setTimeout(() => { form.noValidate = false; }, 1500);
      setTimeout(() => { form.reset(); showHint(); }, 0);
      return `Sent: the website passed the message to the team's email (${to}); they will reply to ${email}.`;
    }
    // something to fix in the form: say what, under the field, and put the cursor there
    if (res.status === 400 && data && data.message) {
      say(data.message);
      const el = data.field && f[data.field];
      if (el && el.id) {
        showError(el, data.message);
        el.focus();
      }
      return `Not sent: ${data.message}`;
    }
    // limits, a server error, or a copy of the site without PHP (GitHub Pages)
    return draft("Our website couldn’t send your message.");
  };

  let sending = false, quietUntil = 0;
  form.addEventListener("submit", e => {
    e.preventDefault();
    // An AI agent filled the form through WebMCP (toolname on the <form>): it is told what happened
    const agent = e.agentInvoked && typeof e.respondWith === "function";
    if (sending || performance.now() < quietUntil) {
      if (agent) e.respondWith(Promise.resolve(sending ? "Not sent again: the form is already sending this message." : "Not sent again: this message was just sent."));
      return;
    }
    // an agent never means to fill the trap for spam robots, which would drop the message
    if (agent && f.fax_only) f.fax_only.value = "";
    sending = true;
    if (button) button.setAttribute("aria-disabled", "true");
    const done = send().finally(() => {
      sending = false;
      if (button) button.removeAttribute("aria-disabled");
    });
    if (agent) e.respondWith(done);
  });
});

// ---------- WebMCP: read-only tools for AI agents in the browser ----------
// Browsers with WebMCP (document.modelContext) let an agent call these instead of scraping the page.
// They read the same files as the MCP server (mcp.php): agent/pages.json and the *.html.md pages that
// tools/agent_files.py writes. The contact form is a tool too (toolname on its <form> in contact.html).
part("webmcp", () => {
  const mc = document.modelContext || navigator.modelContext;
  if (!mc || typeof mc.registerTool !== "function" || window.__mercuryWebMcp) return;
  window.__mercuryWebMcp = true;
  let site = null;
  const getSite = async () => site || (site = await fetch(`${root}agent/pages.json`).then(r => {
    if (!r.ok) throw new Error(`Site index unavailable (${r.status})`);
    return r.json();
  }));
  const getText = async file => {
    const r = await fetch(root + file);
    if (!r.ok) throw new Error(`${file} unavailable (${r.status})`);
    return r.text();
  };
  const noInput = { type: "object", properties: {}, additionalProperties: false };
  const readOnly = { readOnlyHint: true };
  const tools = [
    {
      name: "get_team_info",
      title: "Team facts and contacts",
      description: "Facts about GNCE Mercury, FIRST Tech Challenge team 26413 from Weston, Massachusetts: what the team is, when it was founded, how to reach it (general and sponsorship email, Instagram) and its sponsors and supporters.",
      inputSchema: noInput,
      annotations: readOnly,
      execute: async () => (await getSite()).organization,
    },
    {
      name: "list_pages",
      title: "List the website pages",
      description: "Every page of this website with its title, a one-line description, its address and the address of its Markdown version. Use read_page to read one.",
      inputSchema: noInput,
      annotations: readOnly,
      execute: async () => ({ pages: (await getSite()).pages.map(p => ({ page: p.slug, title: p.title, description: p.description, url: p.url, markdownUrl: p.markdownUrl })) }),
    },
    {
      name: "read_page",
      title: "Read a page",
      description: "The full text of one page of this website as Markdown. Pages: index (home: robots, competition record, season calendar), seasons and seasons/<years> (each robot), team, outreach, news, partners (sponsorship tiers and budget), resources, contact, terms.",
      inputSchema: { type: "object", properties: { page: { type: "string", description: "The page to read, e.g. \"index\", \"team\" or \"seasons/2025-2026\" (list_pages gives them all)." } }, required: ["page"], additionalProperties: false },
      annotations: readOnly,
      execute: async ({ page: slug } = {}) => {
        if (typeof slug !== "string" || !slug.trim()) return { error: "Say which page to read in \"page\", e.g. \"index\" or \"team\" (list_pages lists them)." };
        let want = slug.trim().replace(/^\/+|\/+$/g, "").replace(/\.html(\.md)?$/, "");
        if (want === "home") want = "index";
        const p = (await getSite()).pages.find(x => x.slug === want);
        if (!p) return { error: `No page called "${slug}". Use list_pages to see the pages.` };
        return { page: p.slug, url: p.url, markdown: await getText(p.markdownFile) };
      },
    },
    {
      name: "search_site",
      title: "Search the website",
      description: "Find the sections of this website that mention some words, for example \"Sustain Award\", \"summer camp\" or \"Platinum\". Returns the best matching sections with the page they are on.",
      inputSchema: { type: "object", properties: { query: { type: "string", minLength: 2, maxLength: 200, description: "Words to look for." }, limit: { type: "integer", minimum: 1, maximum: 10, default: 5, description: "How many sections to return (1 to 10)." } }, required: ["query"], additionalProperties: false },
      annotations: readOnly,
      execute: async ({ query = "", limit = 5 } = {}) => {
        const q = String(query).trim().toLowerCase();
        if (q.length < 2) return { error: "Give a query of at least 2 characters." };
        const STOP = new Set(["the", "a", "an", "and", "or", "is", "are", "was", "of", "in", "on", "at", "to", "for", "me", "my", "you", "your", "our", "about", "what", "who", "when", "where", "how", "did", "does", "do", "tell", "with", "this", "that"]);
        const words = q.split(/[^\p{L}\p{N}$+.\-]+/u).map(t => t.replace(/^[.+-]+|[.+-]+$/g, "")).filter(t => t.length >= 2);
        const terms = words.some(t => !STOP.has(t)) ? words.filter(t => !STOP.has(t)) : words;
        const { pages } = await getSite();
        const hits = [];
        for (const p of pages) {
          const md = (await getText(p.markdownFile)).replace(/^---\n[\s\S]*?\n---\n/, "").split("\n* * *\n")[0];
          for (const section of ("\n" + md).split(/\n(?=#{1,3} )/)) {
            const low = section.toLowerCase();
            const matched = terms.filter(t => low.includes(t)).length;
            if (!matched) continue;
            const score = 4 * matched + (low.includes(q) ? 10 : 0) + terms.reduce((s, t) => s + Math.min(low.split(t).length - 1, 5), 0);
            const heading = (section.match(/^#{1,3} (.+)$/m) || [])[1] || p.title;
            const plain = section.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
              .replace(/^\s*(#{1,6}|>|-|\d+\.)\s+/gm, "").replace(/\\\*/g, "\u0001").replace(/\*|`|\|/g, "")
              .replace(/\u0001/g, "*").replace(/\\([\\`*_[\]])/g, "$1").replace(/\s+/g, " ").trim();
            const at = Math.max(0, plain.toLowerCase().indexOf(terms[0] || q) - 120);
            hits.push({ score, page: p.slug, pageTitle: p.title, section: heading, url: p.url, snippet: (at ? "…" : "") + plain.slice(at, at + 360) + (plain.length > at + 360 ? "…" : "") });
          }
        }
        hits.sort((a, b) => b.score - a.score);
        const results = hits.slice(0, Math.max(1, Math.min(10, Number(limit) || 5))).map(({ score, ...h }) => h);
        return results.length ? { query, results } : { query, results, note: "Nothing on the site matches. Try fewer or different words." };
      },
    },
    {
      name: "get_season_schedule",
      title: "This season's events",
      description: "This season's kickoff and events (scrimmages and competitions) with their dates, which are past, which is today and which is next, in Massachusetts time.",
      inputSchema: noInput,
      annotations: readOnly,
      execute: async () => {
        const pts = seasonPoints();
        const row = p => ({ name: p.name, date: iso(p.day), weekday: fmt(p.day, { weekday: "long" }), status: p.past ? "past" : p.today ? "today" : "upcoming", daysAway: p.past ? undefined : p.days });
        const next = pts.find(p => p.today || p.next);
        return { timeZone: "America/New_York", next: next ? row(next) : null, events: pts.map(row) };
      },
    },
  ];
  for (const tool of tools) {
    try { Promise.resolve(mc.registerTool(tool)).catch(err => console.warn("[mercury] WebMCP", tool.name, err)); }
    catch (err) { console.warn("[mercury] WebMCP", tool.name, err); }
  }
});

part("copy-email", () => {
  const link = document.querySelector(".contact-list a[href^='mailto:']");
  if (!link || !navigator.clipboard || !window.isSecureContext) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy";
  btn.textContent = "Copy";
  btn.setAttribute("aria-label", "Copy email address");
  const live = document.createElement("span");
  live.className = "visually-hidden";
  live.setAttribute("aria-live", "polite");
  link.after(btn, live);
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(TEAM_EMAIL);
      btn.textContent = "Copied";
      live.textContent = "Email address copied";
      setTimeout(() => { btn.textContent = "Copy"; live.textContent = ""; }, 1600);
    } catch {
      btn.textContent = "Copy failed";
      live.textContent = "Couldn’t copy. Select the address and copy it.";
      setTimeout(() => { btn.textContent = "Copy"; live.textContent = ""; }, 2400);
    }
  });
});

// Spec sheets: "TBD" values read as not-yet-known
part("specs", () => {
  document.querySelectorAll(".spec dd").forEach(d => { if (d.textContent.trim() === "TBD") d.classList.add("tbd"); });
});

// ---------- Budget donut (partners) ----------
// Draws the season budget as a donut from the "Up to" amounts in <table class="budget">, which stays the
// source and the legend. Slices run clockwise from 12 o'clock in the table's order (largest first), each in
// its row's --c colour. If the lines do not add up to the total row, nothing is drawn (the table still reads).
// Pointing at a slice or a row lights both and shows that line in the centre; nothing moves on scroll.
part("budget-chart", () => {
  const fig = document.querySelector(".budget-figure");
  if (!fig) return;
  const table = fig.querySelector("table.budget"), donut = fig.querySelector(".donut"), svg = donut?.querySelector("svg");
  if (!table || !svg || !table.tFoot) return;
  const money = el => Number((el?.textContent || "").replace(/[^0-9.]/g, ""));
  const data = [...table.tBodies[0].rows].map(r => ({ r, v: money(r.querySelector(".amt")) }));
  const totalCell = table.tFoot.querySelector(".amt");
  const total = money(totalCell), sum = data.reduce((s, d) => s + d.v, 0);
  if (!sum || sum !== total || data.some(d => !(d.v > 0))) {
    console.warn(`[mercury] budget lines add up to ${sum}, not ${total}: the chart is not drawn`);
    return;
  }
  const C = 120, R = 118, r = 73, NS = "http://www.w3.org/2000/svg";
  const pt = (rad, a) => [C + rad * Math.sin(a), C - rad * Math.cos(a)].map(n => n.toFixed(2)).join(" ");
  let a0 = 0;
  data.forEach((d, i) => {
    const a1 = a0 + (d.v / sum) * 2 * Math.PI, big = a1 - a0 > Math.PI ? 1 : 0;
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", `M${pt(R, a0)}A${R} ${R} 0 ${big} 1 ${pt(R, a1)}L${pt(r, a1)}A${r} ${r} 0 ${big} 0 ${pt(r, a0)}Z`);
    p.style.fill = getComputedStyle(d.r).getPropertyValue("--c").trim();
    svg.append(p);
    d.p = p;
    a0 = a1;
  });
  const [cb, cs] = donut.querySelector(".donut-centre").children;
  let ptr = "";
  svg.addEventListener("pointerdown", e => { ptr = e.pointerType; });
  const reset = () => {
    delete fig.dataset.active;
    data.forEach(d => { d.r.classList.remove("is-on"); d.p.classList.remove("is-on"); });
    cb.textContent = totalCell.textContent.trim();
    cs.textContent = "season maximum";
  };
  const on = i => {
    fig.dataset.active = i;
    data.forEach((d, j) => { d.r.classList.toggle("is-on", i === j); d.p.classList.toggle("is-on", i === j); });
    const d = data[i];
    cb.textContent = d.r.querySelector(".amt").textContent.trim();
    cs.textContent = `${d.r.querySelector("th").textContent.trim()}, ${d.r.querySelector(".pct").textContent.trim()}`;
  };
  data.forEach((d, i) => {
    for (const el of [d.r, d.p]) el.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") on(i); });
    d.p.addEventListener("click", () => {
      if (ptr === "mouse") return on(i);
      fig.dataset.active === String(i) ? reset() : on(i); // a tap toggles a slice, for touch
    });
  });
  document.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse" && fig.dataset.active && !e.target.closest(".donut path")) reset();
  });
  fig.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") reset(); });
  reset();
  fig.classList.add("has-chart");
  donut.hidden = false;
});

// ---------- Calm while scrolling ----------
// While the page scrolls, the content ignores the pointer, so a resting mouse never sets off hover effects
// (photo zooms, lit rows) as things pass under it; hover comes back the moment scrolling stops.
part("scroll-calm", () => {
  const rootEl = document.documentElement;
  let t = 0;
  addEventListener("scroll", () => {
    if (!t) rootEl.classList.add("is-scrolling");
    clearTimeout(t);
    t = setTimeout(() => { rootEl.classList.remove("is-scrolling"); t = 0; }, 160);
  }, { passive: true });
});

// ---------- Strips: rows of cards the visitor moves ----------
// <ul class="card-strip" data-strip id="…"> scrolls sideways on its own (swipe, trackpad, Tab). Here: the previous/next
// buttons, put into the <div class="strip-nav" data-strip-nav="that id">, and dragging with a mouse.
// Nothing here moves by itself.
const chevron = dir => `<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="${dir < 0 ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}"/></svg>`;
const stripButtons = (nav, what, onGo) => {
  const make = dir => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "strip-btn";
    b.setAttribute("aria-label", `${dir < 0 ? "Previous" : "Next"} ${what}`);
    b.innerHTML = chevron(dir);
    b.addEventListener("click", () => { if (b.getAttribute("aria-disabled") !== "true") onGo(dir); });
    return b;
  };
  const prev = make(-1), next = make(1);
  nav.append(prev, next);
  return { prev, next };
};
part("strip", () => {
  document.querySelectorAll("[data-strip]").forEach(strip => {
    const items = [...strip.children]; // the cards as written in the page (the stories row is re-arranged on wide screens, where it does not scroll)
    const nav = strip.id && document.querySelector(`[data-strip-nav="${strip.id}"]`);
    if (items.length < 2) return;
    // each card's left edge in the row's own coordinates; the first one's is the row's left padding, which is
    // where the content's left edge is (measured, because the padding is written with max() and a percentage)
    const lefts = () => { const x0 = strip.getBoundingClientRect().left - strip.scrollLeft; return items.map(li => li.getBoundingClientRect().left - x0); };
    const max = () => strip.scrollWidth - strip.clientWidth;
    // the row moves by about one screenful of cards, and always stops with a card on the content's left edge
    const go = dir => {
      const l = lefts(), pad = l[0], s = l.map(x => x - pad);
      const left = strip.scrollLeft, page = (strip.clientWidth - 2 * pad) * 0.82;
      let to;
      if (dir > 0) to = [...s].reverse().find(x => x > left + 4 && x <= left + page) ?? s.find(x => x > left + 4) ?? max();
      else to = s.find(x => x < left - 4 && x >= left - page) ?? [...s].reverse().find(x => x < left - 4) ?? 0;
      strip.scrollTo({ left: Math.max(0, Math.min(to, max())), behavior: RM ? "auto" : "smooth" });
    };
    if (nav) {
      const { prev, next } = stripButtons(nav, nav.dataset.label || "cards", go);
      let ticking = false;
      const mark = () => {
        ticking = false;
        nav.hidden = max() < 8;
        prev.setAttribute("aria-disabled", strip.scrollLeft < 4);
        next.setAttribute("aria-disabled", strip.scrollLeft > max() - 4);
      };
      const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(mark); } };
      strip.addEventListener("scroll", queue, { passive: true });
      addEventListener("resize", queue, { passive: true });
      mark();
    }
    // a card that takes the keyboard focus comes fully on screen (the browser leaves a half-shown one where it is)
    strip.addEventListener("focusin", e => {
      const li = items.find(x => x.contains(e.target));
      if (!li || max() < 8 || !e.target.matches(":focus-visible")) return;
      const box = strip.getBoundingClientRect(), r = li.getBoundingClientRect(), pad = Math.min(lefts()[0], 24);
      const d = r.left < box.left + pad ? r.left - box.left - pad : r.right > box.right - pad ? r.right - box.right + pad : 0;
      if (d) strip.scrollBy({ left: d, behavior: "instant" });
    });
    // a mouse can drag the row; the press that ends a drag is not a click on a card
    let drag = null;
    strip.addEventListener("dragstart", e => e.preventDefault());
    strip.addEventListener("pointerdown", e => { if (e.pointerType === "mouse" && e.button === 0 && max() >= 8) drag = { x: e.clientX, left: strip.scrollLeft, moved: false }; });
    addEventListener("pointermove", e => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 6) return;
        drag.moved = true;
        strip.classList.add("is-dragging");
        strip.scrollTo({ left: strip.scrollLeft, behavior: "instant" }); // a drag takes over from a row that is still gliding
        drag.x = e.clientX;
        drag.left = strip.scrollLeft;
        return;
      }
      strip.scrollLeft = drag.left - dx;
    });
    const drop = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      if (!moved) return;
      const stop = e => { e.preventDefault(); e.stopPropagation(); };
      strip.addEventListener("click", stop, { capture: true, once: true });
      setTimeout(() => { strip.removeEventListener("click", stop, { capture: true }); strip.classList.remove("is-dragging"); }, 0);
    };
    addEventListener("pointerup", drop);
    addEventListener("pointercancel", drop);
  });
});

// ---------- Home: outreach stories ----------
// <div class="stories" data-stories> holds one <article class="story"> per story (its photo, then its text: a
// title, a date line, a sentence and a link). On wide screens the photos move into one big frame, the stories
// become a column of rows (each title a button), and each story's sentence and link move under the frame:
// choosing a story shows its photo and its text there, and the rows stay where they are. On phones the stories
// stay as cards to swipe through, each whole.
part("stories", () => {
  document.querySelectorAll("[data-stories]").forEach((box, n) => {
    const stories = [...box.querySelectorAll(":scope > .story")];
    const photos = stories.map(s => s.querySelector(".story-photo"));
    const texts = stories.map(s => s.querySelector(".story-text"));
    const titles = stories.map(s => s.querySelector("h3"));
    if (stories.length < 2 || [photos, texts, titles].some(list => list.some(x => !x))) return;
    const wide = matchMedia("(min-width: 900px)");
    const paper = matchMedia("print"); // on paper every story is a card with its own photo and text
    const stage = document.createElement("div");
    stage.className = "story-stage";
    const notes = document.createElement("div");
    notes.className = "story-notes";
    // what goes under the frame: everything in a story's text after its title and date line
    const bodies = texts.map(t => [...t.children].filter(el => el.tagName !== "H3" && !el.classList.contains("dateline")));
    const noteOf = stories.map((s, i) => { const d = document.createElement("div"); d.className = "story-note"; d.id = `story-note-${n}-${i}`; return d; });
    photos.forEach((ph, i) => { if (!ph.id) ph.id = `story-photo-${n}-${i}`; });
    box.style.setProperty("--stories", stories.length);
    let current = 0;
    const select = i => {
      current = i;
      stories.forEach((s, j) => s.classList.toggle("is-on", j === i));
      photos.forEach((ph, j) => ph.classList.toggle("is-on", j === i));
      noteOf.forEach((d, j) => d.classList.toggle("is-on", j === i));
      box.querySelectorAll(".story-pick").forEach((b, j) => b.setAttribute("aria-pressed", j === i));
    };
    const arrange = () => {
      if (wide.matches && !paper.matches) {
        photos.forEach(ph => stage.append(ph));
        noteOf.forEach((d, i) => { d.append(...bodies[i]); notes.append(d); });
        box.prepend(stage);
        box.append(notes);
        titles.forEach((h, i) => {
          if (h.querySelector(".story-pick")) return;
          const b = document.createElement("button");
          b.type = "button";
          b.className = "story-pick";
          b.setAttribute("aria-controls", `${photos[i].id} ${noteOf[i].id}`);
          b.addEventListener("click", () => select(i)); // the button covers its whole row (css/style.css)
          b.append(...h.childNodes);
          h.append(b);
        });
        box.classList.add("is-ready");
        select(current);
      } else {
        box.classList.remove("is-ready");
        titles.forEach(h => { const b = h.querySelector(".story-pick"); if (b) { h.append(...b.childNodes); b.remove(); } });
        stories.forEach((s, i) => {
          s.prepend(photos[i]);
          texts[i].append(...bodies[i]);
          [s, photos[i], noteOf[i]].forEach(el => el.classList.remove("is-on"));
        });
        stage.remove();
        notes.remove();
      }
    };
    wide.addEventListener("change", arrange);
    paper.addEventListener("change", arrange);
    arrange();
  });
});

// ---------- Video cards ----------
// <figure data-video> around a <video controls poster>: the poster gets a "Play video" button; pressing it starts
// the video with its own controls. Without JavaScript the video simply has its controls.
part("video-tile", () => {
  document.querySelectorAll("[data-video]").forEach(box => {
    const v = box.querySelector("video");
    if (!v || !v.hasAttribute("controls") || !v.hasAttribute("poster")) return;
    v.removeAttribute("controls");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "play";
    b.innerHTML = `<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 1l11 6-11 6z" fill="currentColor"/></svg><span>Play video</span>`;
    const about = v.getAttribute("aria-label");
    if (about) b.setAttribute("aria-label", `Play video: ${about}`);
    b.addEventListener("click", () => {
      v.setAttribute("controls", "");
      b.remove();
      v.focus({ preventScroll: true });
      const playing = v.play();
      if (playing && playing.catch) playing.catch(() => {});
    });
    box.append(b);
  });
});

// ---------- Photo viewer ----------
// Photos in an outreach gallery (<div class="program-media">, or anything marked data-gallery) open large:
// previous/next buttons, the arrow keys, a swipe, and Esc or Close to leave. The caption is the photo's alt text.
part("viewer", () => {
  if (!window.HTMLDialogElement) return;
  const groups = [...document.querySelectorAll(".program-media, [data-gallery]")].map(g => [...g.querySelectorAll("img")]).filter(g => g.length);
  if (!groups.length) return;
  let dlg = null, img, cap, count, nav, group = [], at = 0, opener = null;
  const show = i => {
    at = (i + group.length) % group.length;
    const from = group[at];
    img.classList.remove("is-in");
    img.src = from.currentSrc || from.src;
    img.alt = from.alt;
    if (from.naturalWidth) { img.width = from.naturalWidth; img.height = from.naturalHeight; }
    if (!RM) { void img.offsetWidth; img.classList.add("is-in"); }
    cap.textContent = from.alt;
    count.textContent = `${at + 1} of ${group.length}`;
    nav.hidden = group.length < 2;
  };
  const build = () => {
    if (dlg) return;
    dlg = document.createElement("dialog");
    dlg.className = "viewer";
    dlg.setAttribute("aria-label", "Photo viewer");
    dlg.innerHTML = `
      <div class="viewer-top"><span class="viewer-count" role="status"></span><button class="viewer-close" type="button">Close</button></div>
      <div class="viewer-stage"><img alt=""></div>
      <div class="viewer-foot"><p class="viewer-cap" aria-hidden="true"></p><div class="strip-nav"></div></div>`;
    document.body.append(dlg);
    img = dlg.querySelector("img");
    cap = dlg.querySelector(".viewer-cap");
    count = dlg.querySelector(".viewer-count");
    nav = dlg.querySelector(".strip-nav");
    stripButtons(nav, "photo", dir => show(at + dir));
    const stage = dlg.querySelector(".viewer-stage");
    dlg.querySelector(".viewer-close").addEventListener("click", () => dlg.close());
    stage.addEventListener("click", e => { if (e.target === stage) dlg.close(); });
    dlg.addEventListener("keydown", e => {
      if (group.length < 2) return;
      if (e.key === "ArrowRight") { e.preventDefault(); show(at + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); show(at - 1); }
    });
    // a sideways swipe with one finger (or a mouse) shows the next or previous photo; a second finger is a pinch
    let down = null;
    stage.addEventListener("pointerdown", e => { down = down ? { id: -1 } : { id: e.pointerId, x: e.clientX, y: e.clientY }; });
    stage.addEventListener("pointerup", e => {
      const d = down;
      down = null;
      if (!d || d.id !== e.pointerId || group.length < 2) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) show(at + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener("pointercancel", () => { down = null; });
    dlg.addEventListener("close", () => { if (opener) opener.focus({ preventScroll: true }); });
  };
  groups.forEach(g => g.forEach((el, i) => {
    el.dataset.viewable = "";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `View larger: ${el.alt}`);
    const open = () => { build(); group = g; opener = el; show(i); dlg.showModal(); };
    el.addEventListener("click", open);
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  }));
});

// ---------- Opening ----------
// index.html's <head> adds .intro on the first visit of a session, and the <div class="opening"> title card builds
// itself in CSS once its pictures have loaded (the small script under it sets window.__opening and .op-go).
// Here: after the card has stood for a moment, every piece flies to its own place on the page underneath (the
// colour fields to the bays, the robots to theirs, the name to the h1, the logo to the header) while the black
// behind the card clears, so the page comes up around the pieces. When they land they are swapped for the real
// ones, and the lights go down on the bays that are not chosen. A click, tap, wheel or key ends it at once.
part("intro", () => {
  const rootEl = document.documentElement;
  if (!rootEl.classList.contains("intro")) return;
  const op = document.querySelector(".opening");
  const lu = document.querySelector("[data-lineup]");
  let onResize = null;
  const done = () => {
    rootEl.classList.remove("intro", "intro-skip", "op-go", "op-landing");
    if (lu) lu.classList.remove("is-arriving"); // the lights go down on the unchosen bays (their own transition)
    if (onResize) removeEventListener("resize", onResize);
  };
  if (!op || !op.animate) return done();
  const HOLD = 1480;  // from the card starting to build until the pieces fly
  const FLY = 680;
  const SWAP = 140;   // the flown pieces give way to the real ones
  const LATE = 400;   // this script may come that long after the flight was due; later than that, the card just leaves
  const SAFETY = 3200; // css/style.css (op-safety-go): this long after it started, the card fades by itself in 300ms
  let over = false, timer = 0, flights = [];
  // leave without the flight (a skip, or a page that is not where the flight expects it); mid-flight the pieces
  // stop where they are and fade with the card
  const fade = () => {
    if (over) return;
    over = true;
    clearTimeout(timer);
    flights.forEach(a => a.pause());
    rootEl.classList.remove("op-landing");
    rootEl.classList.add("intro-skip");
    setTimeout(done, 200);
  };
  const textRect = node => { const r = document.createRange(); r.selectNodeContents(node); return r.getBoundingClientRect(); };
  const land = () => {
    if (over) return;
    const h1 = document.getElementById("launch-title");
    const brand = document.querySelector(".site-header .brand img");
    if (!lu || !lu.classList.contains("is-ready") || !h1 || !brand || scrollY > 4) return fade();
    // the card lands on a stage where every bay is lit: set at once, without the bays' own transitions
    lu.classList.add("is-arriving", "is-still");
    void lu.offsetWidth;
    lu.classList.remove("is-still");
    const opts = { duration: FLY, easing: "cubic-bezier(0.6, 0, 0.2, 1)", fill: "forwards" };
    // First every piece is measured, then every piece is set moving (no layout work between two starts).
    // el goes from where it is to the rect `to`; `inner` is the part of el that has to land on it (default: all of it)
    const moves = [];
    const fly = (el, to, inner) => {
      const box = el.getBoundingClientRect();
      const from = inner || box;
      if (!from.width || !from.height || !to.width) return;
      const sx = to.width / from.width, sy = inner ? sx : to.height / from.height;
      const dx = to.left - box.left - sx * (from.left - box.left), dy = to.top - box.top - sy * (from.top - box.top);
      moves.push([el, `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`]);
    };
    let bayTop = innerHeight, bayRight = 0;
    op.querySelectorAll(".op-field").forEach(f => {
      const stage = lu.querySelector(`.bay[data-season="${f.dataset.season}"] .bay-stage`);
      if (!stage) return;
      const to = stage.getBoundingClientRect();
      bayTop = Math.min(bayTop, to.top);
      bayRight = Math.max(bayRight, to.right);
      fly(f, to);
    });
    op.querySelectorAll(".op-slot").forEach(s => {
      const img = lu.querySelector(`.bay[data-season="${s.dataset.season}"] .bay-stage img`);
      if (img) fly(s.querySelector(".op-robot"), img.getBoundingClientRect());
    });
    // each word of the name lands on the same word of the h1 (which may have wrapped), the team line on the h1's
    // second line, the logo on the header's
    const name = h1.firstChild, sub = op.querySelector(".op-sub"), lite = h1.querySelector(".lite");
    const text = { left: Infinity, top: Infinity, right: 0, bottom: 0 }; // where the name's lines end up
    const grow = r => { text.left = Math.min(text.left, r.left); text.top = Math.min(text.top, r.top); text.right = Math.max(text.right, r.right); text.bottom = Math.max(text.bottom, r.bottom); };
    if (name && name.nodeType === 3) {
      let at = 0;
      const targets = name.nodeValue.trim().split(/\s+/).map(w => {
        const i = name.nodeValue.indexOf(w, at);
        at = i + w.length;
        const r = document.createRange();
        r.setStart(name, i);
        r.setEnd(name, at);
        return r.getBoundingClientRect();
      });
      op.querySelectorAll(".op-word span").forEach((w, i) => {
        if (!targets[i]) return;
        grow(targets[i]);
        fly(w, targets[i], textRect(w));
      });
    }
    if (lite) { const to = textRect(lite); grow(to); fly(sub, to, textRect(sub)); }
    fly(op.querySelector(".op-logo"), brand.getBoundingClientRect());
    // the strap's black band closes down to a plate behind the name and rides with it, so the name is never read
    // against a colour field; where it lands the stage is black too, so it simply is not there any more. It is as
    // wide as the row of fields under it (they close to the bays), so no field shows beside it on the way
    const strap = op.querySelector(".op-strap"), sr = strap.getBoundingClientRect();
    let plate = "";
    if (text.right > text.left && sr.width && sr.height) {
      const l = text.left - 16, t = text.top - 12, w = Math.max(text.right + 28, bayRight) - l, h = Math.min(bayTop, text.bottom + 12) - t;
      plate = `translate(${l - sr.left}px, ${t - sr.top}px) scale(${w / sr.width}, ${Math.max(0.05, h / sr.height)})`;
    }
    // everything is measured: now the writes
    if (plate) strap.style.setProperty("--strap-to", plate);
    moves.forEach(([el, to]) => { el.style.transformOrigin = "0 0"; flights.push(el.animate({ transform: ["none", to] }, opts)); });
    op.querySelectorAll(".op-name").forEach(el => flights.push(el.animate({ opacity: [1, 0] }, { duration: 160, fill: "forwards" })));
    rootEl.classList.add("op-landing");  // the real pieces wait out of sight until the flown ones are on them
    op.classList.add("is-flying");
    // the pieces are aimed at the page as it is laid out now: if the window changes size or turns, the card just leaves
    const size = innerWidth + "x" + innerHeight;
    onResize = () => { if (innerWidth + "x" + innerHeight !== size) fade(); };
    addEventListener("resize", onResize);
    Promise.all(flights.map(a => a.finished)).then(() => {
      if (over) return;
      over = true;
      rootEl.classList.remove("op-landing");
      op.classList.add("is-landed"); // what shows now is the page itself: presses go to it
      lu.classList.remove("is-arriving"); // the lights go down on the unchosen bays as the flown pieces give way
      op.animate({ opacity: [1, 0] }, { duration: SWAP, easing: "linear", fill: "forwards" }).finished.then(done, done);
    }).catch(() => {});
  };
  const wait = () => {
    if (over) return;
    if (!rootEl.classList.contains("intro") || rootEl.classList.contains("intro-skip")) { over = true; setTimeout(done, 200); return; } // the script under the card ended it
    const t0 = window.__opening;
    if (t0 == null) { timer = setTimeout(wait, 50); return; }
    // this script can arrive late (a slow connection). Then there is no flight: while the card still stands it
    // fades; once the stylesheet's safety fade has taken it, only the classes are left to clear
    const late = performance.now() - t0;
    if (late >= SAFETY - 50) { over = true; setTimeout(done, Math.max(0, SAFETY + 360 - late)); return; }
    if (late > HOLD + LATE) return fade();
    timer = setTimeout(() => { try { land(); } catch (e) { fade(); } }, Math.max(0, HOLD - late));
  };
  wait();
  // any input ends it. Before the flight the card just leaves; during the flight every piece is put in its place
  // at once (two half-flown copies fading over the real ones would look like a fault)
  const skip = () => {
    if (over) return;
    if (!flights.length) return fade();
    op.classList.add("is-skipped");
    flights.forEach(a => a.finish());
  };
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach(t => addEventListener(t, skip, { once: true, passive: true }));
});

// ---------- Robot morph ----------
// Robots carry style="view-transition-name: …". Only the robot you are heading to (or coming back
// from) keeps its name, so it is the one that glides between pages in browsers that support it.
// The page head keeps its place across a page change (css "Page transitions") only while it is on screen and
// the link opens the top of the next page; otherwise it leaves with the rest of the page. A page that arrives
// through a page transition skips its own entrance (html.vt-arrived): the transition is the entrance.
part("morph", () => {
  const named = [...document.querySelectorAll('img[style*="view-transition-name"]')];
  named.forEach(el => { el.dataset.vt = el.style.viewTransitionName; });
  const head = document.querySelector(".page-band, .season-head, .partner-head");
  const holdHead = hold => [head, head?.querySelector(":scope > .container")].forEach(el => { if (el) el.style.viewTransitionName = hold ? "" : "none"; });
  addEventListener("pageswap", e => {
    const to = e.activation?.entry?.url;
    const back = e.activation?.navigationType === "traverse";
    if (head) {
      const r = head.getBoundingClientRect();
      holdHead(r.bottom > 0 && r.top < innerHeight && !back && !(to && new URL(to).hash));
    }
    const keep = (back && named.find(el => el.closest(".season-head"))) || named.find(el => to && el.closest("a[href]")?.href === to);
    named.forEach(el => { el.style.viewTransitionName = el === keep ? el.dataset.vt : "none"; });
  });
  addEventListener("pagereveal", e => { if (e.viewTransition) document.documentElement.classList.add("vt-arrived"); });
  addEventListener("pageshow", e => {
    if (!e.persisted) return;
    named.forEach(el => { el.style.viewTransitionName = el.dataset.vt; });
    holdHead(true);
  });
});

window.__mercury = true;
