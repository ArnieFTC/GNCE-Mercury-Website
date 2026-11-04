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
      <a class="brand" href="${root}index.html" aria-label="GNCE Mercury, home">
        <img src="${root}images/logo-mark.png" alt="" width="473" height="505">
        <span class="brand-name"><b translate="no">GNCE Mercury</b><small>FTC team 26413</small></span>
      </a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">
        <svg viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M2 5h14M2 13h14"/></svg>
        <span>Menu</span>
      </button>
      <nav class="nav" id="site-nav" aria-label="Main">${links}<a class="btn nav-cta" href="${root}partners.html">Partner with us</a></nav>
      <a class="btn header-cta" href="${root}partners.html"${page === "partners" ? ' aria-current="page"' : ""}>Partner with us</a>
    </div>`;
  const skip = document.createElement("a");
  skip.className = "skip-link";
  skip.href = "#main";
  skip.textContent = "Skip to content";
  document.body.prepend(skip, header);

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
    if (e.key === "Escape" && header.classList.contains("is-open")) { set(false); btn.focus(); }
  });
  header.querySelector(".nav").addEventListener("click", e => { if (e.target.closest("a")) set(false); });
  matchMedia("(min-width: 1081px)").addEventListener("change", e => { if (e.matches) set(false); });
  // the open menu covers the page, so it closes as soon as keyboard focus leaves the header
  header.addEventListener("focusout", e => {
    if (header.classList.contains("is-open") && e.relatedTarget && !header.contains(e.relatedTarget)) set(false);
  });
  // once the page scrolls under it, the bar turns translucent so the content shows through
  let ticking = false;
  const tint = () => { header.classList.toggle("is-scrolled", scrollY > 8); ticking = false; };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(tint); } }, { passive: true });
  tint();
});

// ---------- Footer: sponsors on every page ----------
part("footer", () => {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  const sponsorItems = [
    ...SPONSORS.map(s => `<li><a class="sponsor" href="${esc(s.url)}" target="_blank" rel="noopener" translate="no"><img src="${root}${esc(s.logo)}" alt="${esc(s.name)}"${s.width ? ` width="${s.width}" height="${s.height}"` : ""}></a></li>`),
    ...SUPPORTERS.map(n => `<li class="named" translate="no">${esc(n)}</li>`),
    `<li class="open"><a href="${root}partners.html">Become a sponsor</a></li>`,
  ].join("");
  const next = nextEvent();
  footer.innerHTML = `
    <div class="container footer-sponsors" id="sponsors">
      <div>
        <h2>Our Sponsors &amp; Supporters</h2>
        <p>Thank you to everyone who helps us build, compete, and run outreach.</p>
      </div>
      <ul class="sponsor-row" aria-label="Sponsors and supporters">${sponsorItems}</ul>
    </div>
    <div class="container footer-main">
      <a class="footer-brand" href="${root}index.html">
        <img src="${root}images/logo-mark.png" alt="" width="473" height="505" loading="lazy">
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
    </div>
    <div class="container footer-legal">
      <span>© ${new Date().getFullYear()} <span translate="no">GNCE Mercury</span>, <span translate="no">Galactic Narwhal Chicken Effect</span></span>
      <span><span translate="no">FIRST&nbsp;Tech&nbsp;Challenge</span> team&nbsp;26413, founded 2024</span>
    </div>`;
  document.body.append(footer);
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
  const fromHash = panels.findIndex(p => "#" + p.id === location.hash);
  select(fromHash >= 0 ? fromHash : 0);
  addEventListener("hashchange", () => {
    const j = panels.findIndex(p => "#" + p.id === location.hash);
    if (j >= 0) select(j);
  });
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

// ---------- Special quotes (team page) ----------
// The locked quotes are stored encrypted (AES-GCM, key derived from the password with PBKDF2),
// so neither the quotes nor the password appear in the page source.
const SPECIAL_QUOTES = {
  salt: "rqnXEPWc0gRDtiAZzWWHww==",
  iv: "5iLWcamT14Vqij3Z",
  data: "LNADRR3AoBI8igyzV4g75+UZtJ4TE1lnYU6WsCx0qhcX5MGQiN4/S0RT1Vx9PHBngHibyKdMjW3DvSAGWk7G9IOM4oCNpO3q/eijhuxTjAST9ZJgKgQ=",
};
part("special-quotes", () => {
  const sqOpen = document.getElementById("sq-open");
  if (!sqOpen) return;
  const form = document.getElementById("sq-form");
  const pass = document.getElementById("sq-pass");
  const msg = document.getElementById("sq-msg");
  if (!form || !pass || !msg || !window.crypto?.subtle) return;
  sqOpen.closest(".sq")?.removeAttribute("hidden"); // the lock only works with JavaScript, so it starts hidden
  const bytes = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const unlock = async password => {
    const { subtle } = crypto;
    const base = await subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    const key = await subtle.deriveKey(
      { name: "PBKDF2", salt: bytes(SPECIAL_QUOTES.salt), iterations: 250000, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    const plain = await subtle.decrypt({ name: "AES-GCM", iv: bytes(SPECIAL_QUOTES.iv) }, key, bytes(SPECIAL_QUOTES.data));
    return JSON.parse(new TextDecoder().decode(plain));
  };
  pass.addEventListener("input", () => pass.removeAttribute("aria-invalid"));
  sqOpen.addEventListener("click", () => {
    form.hidden = false;
    sqOpen.hidden = true;
    pass.focus();
  });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    msg.textContent = "Checking…";
    msg.classList.remove("err");
    let quotes;
    try {
      quotes = await unlock(pass.value);
    } catch {
      msg.textContent = "That password didn’t work. Check it and try again.";
      msg.classList.add("err");
      pass.setAttribute("aria-invalid", "true");
      pass.select();
      return;
    }
    msg.tabIndex = -1;
    msg.focus({ preventScroll: true });
    form.hidden = true;
    msg.textContent = "Special quotes unlocked.";
    reveal(quotes);
  });
  // the lock shakes and opens, then the quote appears; afterwards it keeps a "Special quote" badge
  const reveal = async quotes => {
    const locked = [...document.querySelectorAll(".quote.locked")];
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const show = q => {
      q.innerHTML = `<span class="sq-badge">Special quote</span><span class="sq-text"></span>`;
      q.querySelector(".sq-text").textContent = quotes[q.dataset.secret] || "";
      q.classList.remove("locked", "unlocking");
      q.classList.add("special");
    };
    const focusFirst = () => {
      const a = document.activeElement;
      if (!locked[0] || (a !== msg && a !== document.body)) return; // the visitor has moved on: leave focus alone
      locked[0].tabIndex = -1;
      locked[0].focus({ preventScroll: true });
    };
    if (RM) { locked.forEach(show); focusFirst(); return; }
    locked[0]?.closest(".member")?.scrollIntoView({ behavior: "smooth", block: "center" });
    await wait(600);
    for (const q of locked) {
      q.classList.add("unlocking");
      await wait(600);
      show(q);
      q.classList.add("revealing");
      await wait(300);
    }
    focusFirst();
  };
});

// ---------- Contact form (contact page) ----------
// Opens the visitor's email app with the message addressed to the team email.
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
  // a typed message is not lost by accident: the browser asks before leaving the page
  let dirty = false;
  const warn = e => { e.preventDefault(); e.returnValue = ""; };
  form.addEventListener("input", () => {
    const d = !!form.elements.message?.value.trim();
    if (d !== dirty) { dirty = d; (d ? addEventListener : removeEventListener)("beforeunload", warn); }
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const f = form.elements;
    const subject = `${f.topic.value} from ${f.name.value}`;
    const body = `${f.message.value}\n\n${f.name.value}\n${f.email.value}`;
    const to = f.topic.value === "Sponsorship" ? SPONSOR_EMAIL : TEAM_EMAIL;
    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    dirty = false;
    removeEventListener("beforeunload", warn);
    location.href = url;
    if (status) status.textContent = url.length > 1900
      ? `Opening your email app… Long messages can get cut short in some email apps, so check the whole message is in the draft. If it isn’t, email us at ${to}.`
      : `Opening your email app… If nothing opens, email us at ${to}.`;
  });
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

// ---------- Pointer light ----------
// On the dark stage sections a soft light follows a mouse or trackpad (css "Pointer light"). Only fine pointers,
// never with reduced motion; it moves with the pointer, never with scrolling.
part("stage-light", () => {
  if (RM || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll(".launch, .season-head, .band--stage").forEach(el => {
    let raf = 0, x = 0, y = 0;
    el.addEventListener("pointerenter", () => el.classList.add("has-light"));
    el.addEventListener("pointerleave", () => el.classList.remove("has-light"));
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left; y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; el.style.setProperty("--mx", x + "px"); el.style.setProperty("--my", y + "px"); });
    }, { passive: true });
  });
});

// ---------- Opening ----------
// index.html's <head> adds .intro (the overlay) and .intro-stage (the stage's entrance waits for it) on the
// first visit of a session. Here: end it after its 1.7s, or at once on a click, tap, wheel or key, pulling the
// stage's entrance forward by the time that was skipped so nothing sits waiting in the dark.
part("intro", () => {
  const rootEl = document.documentElement;
  if (!rootEl.classList.contains("intro")) return;
  const t0 = performance.now();
  const end = () => rootEl.classList.remove("intro");
  let timer = setTimeout(end, 1750);
  const skip = () => {
    if (!rootEl.classList.contains("intro") || rootEl.classList.contains("intro-skip")) return;
    clearTimeout(timer);
    const shift = Math.max(0, 1100 - (performance.now() - t0));
    document.getAnimations().forEach(a => {
      const el = a.effect && a.effect.target;
      if (shift && el && el.closest && el.closest(".launch") && a.currentTime != null) a.currentTime += shift;
    });
    rootEl.classList.add("intro-skip");
    timer = setTimeout(end, 200);
  };
  ["pointerdown", "keydown", "wheel"].forEach(t => addEventListener(t, skip, { once: true, passive: true }));
});

// ---------- Robot morph ----------
// Robots carry style="view-transition-name: …". Only the robot you are heading to (or coming back
// from) keeps its name, so it is the one that glides between pages in browsers that support it.
part("morph", () => {
  const named = [...document.querySelectorAll('img[style*="view-transition-name"]')];
  if (!named.length) return;
  named.forEach(el => { el.dataset.vt = el.style.viewTransitionName; });
  addEventListener("pageswap", e => {
    const to = e.activation?.entry?.url;
    const back = e.activation?.navigationType === "traverse";
    const keep = (back && named.find(el => el.closest(".season-head"))) || named.find(el => to && el.closest("a[href]")?.href === to);
    named.forEach(el => { el.style.viewTransitionName = el === keep ? el.dataset.vt : "none"; });
  });
  addEventListener("pageshow", e => { if (e.persisted) named.forEach(el => { el.style.viewTransitionName = el.dataset.vt; }); });
});

window.__mercury = true;
