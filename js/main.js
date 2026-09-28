// =========================================================
// GNCE Mercury 26413 — shared header, footer, and countdown
// The nav tabs are defined ONCE here, so every page stays in sync.
// =========================================================

// SEASON SCHEDULE: drives the countdown + timeline on the home page.
// Dates are "YYYY-MM-DD". List events in order; the countdown moves to the next one automatically.
const SEASON = {
  kickoff: "2026-09-12",
  events: [
    { name: "[Qualifier 1 Name]", date: "2026-11-15" },
    { name: "[Qualifier 2 Name]", date: "2026-12-06" },
  ],
};

const NAV = [
  { label: "Home",       href: "index.html" },
  { label: "Team",       href: "team.html" },
  { label: "Seasons",    href: "seasons.html" },
  { label: "Outreach",   href: "outreach.html" },
  { label: "Contact",    href: "contact.html" },
];

// Pages inside /seasons/ set data-root="../" on <body> so links still work.
const root = document.body.dataset.root || "";
const page = document.body.dataset.page || "";

// ---------- Header ----------
const header = document.createElement("header");
header.className = "site-header";
header.innerHTML = `
  <nav class="nav-bar">
    <a class="brand" href="${root}index.html">GNCE MERCURY <span class="num">#26413</span></a>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
    <ul class="nav-links">
      ${NAV.map(n => `<li><a href="${root}${n.href}" class="${n.href.startsWith(page) && page ? "active" : ""}">${n.label}</a></li>`).join("")}
    </ul>
  </nav>`;
document.body.prepend(header);

const toggle = header.querySelector(".nav-toggle");
const links = header.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.textContent = open ? "✕" : "☰";
});

// ---------- Footer ----------
const footer = document.createElement("footer");
footer.className = "site-footer";
footer.innerHTML = `
  <div class="container">
    <div class="brand-line">GNCE MERCURY · FTC #26413</div>
    <div>Galactic Narwhal Chicken Effect · Weston, MA</div>
    <div style="margin-top:8px">© ${new Date().getFullYear()} GNCE Mercury</div>
  </div>`;
document.body.append(footer);

// ---------- Countdown + season timeline ----------
const DAY = 86400000;
const toDate = str => { const [y, m, d] = str.split("-").map(Number); return new Date(y, m - 1, d); }; // local midnight
const fmt = (d, opts) => d.toLocaleDateString(undefined, opts);
const LONG = { weekday: "long", month: "long", day: "numeric", year: "numeric" };

const cd = document.getElementById("countdown");
if (cd) {
  const events = SEASON.events.map(e => ({ ...e, day: toDate(e.date) }));
  const kickoff = toDate(SEASON.kickoff);
  const nameEl = cd.querySelector(".event-name");
  const dateEl = cd.querySelector(".event-date");
  const timer = cd.querySelector(".timer");
  const tl = document.getElementById("timeline");

  // Timeline positions are % of the way from kickoff to the last event.
  const end = events[events.length - 1].day;
  const pct = d => Math.min(100, Math.max(0, (d - kickoff) / (end - kickoff) * 100));
  const points = [{ name: "Season Kickoff", day: kickoff }, ...events];
  tl.innerHTML = `
    <div class="tl-track"><div class="tl-fill"></div></div>
    <div class="tl-today"><span>Today</span></div>
    ${points.map((p, i) => `
      <div class="tl-pt ${i === 0 ? "first" : ""} ${i === points.length - 1 ? "last" : ""}" style="left:${pct(p.day)}%">
        <div class="dot"></div>
        <div class="lbl"><b>${p.name}</b><span>${fmt(p.day, { month: "short", day: "numeric" })}</span></div>
      </div>`).join("")}`;
  const ptEls = tl.querySelectorAll(".tl-pt");

  let lastState = "";
  const tick = () => {
    const now = new Date();
    const isToday = d => now >= d && now < new Date(+d + DAY);

    // Timeline progress + past / today / next markers
    const nowPct = pct(now);
    tl.querySelector(".tl-fill").style.width = nowPct + "%";
    tl.querySelector(".tl-today").style.left = nowPct + "%";
    let nextMarked = false;
    points.forEach((p, i) => {
      const past = now >= new Date(+p.day + DAY), today = isToday(p.day);
      const next = !past && !today && !nextMarked;
      if (next) nextMarked = true;
      ptEls[i].classList.toggle("past", past);
      ptEls[i].classList.toggle("today", today);
      ptEls[i].classList.toggle("next", next);
    });

    // Countdown: event today → COMPETITION DAY!, else count down to the next event, else season over
    const today = events.find(e => isToday(e.day));
    const next = events.find(e => now < e.day);
    const state = today ? "today" + today.date : next ? "next" + next.date : "done";

    if (state !== lastState) {
      lastState = state;
      cd.classList.toggle("live", !!today);
      if (today) {
        nameEl.textContent = today.name;
        dateEl.textContent = fmt(today.day, LONG);
        timer.innerHTML = `<div class="comp-day">COMPETITION DAY!</div>`;
      } else if (next) {
        nameEl.textContent = "Next Competition: " + next.name;
        dateEl.textContent = fmt(next.day, LONG);
      } else {
        nameEl.textContent = "Season complete!";
        dateEl.textContent = "Thanks for following along. See you next season.";
        timer.innerHTML = "";
      }
    }

    if (!today && next) {
      let diff = Math.max(0, next.day - now);
      const d = Math.floor(diff / DAY);     diff %= DAY;
      const h = Math.floor(diff / 3600000); diff %= 3600000;
      const m = Math.floor(diff / 60000);   diff %= 60000;
      const s = Math.floor(diff / 1000);
      timer.innerHTML = [[d, "Days"], [h, "Hours"], [m, "Min"], [s, "Sec"]]
        .map(([n, l]) => `<div class="unit"><div class="n">${String(n).padStart(2, "0")}</div><div class="l">${l}</div></div>`)
        .join("");
    }
  };
  tick();
  setInterval(tick, 1000);
}

// ---------- Animated number counters ----------
// Any element with class "counter" and data-count counts up when it scrolls into view.
const counters = document.querySelectorAll(".counter[data-count]");
if (counters.length) {
  const run = el => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "", dur = 1400, t0 = performance.now();
    const step = () => {
      const p = Math.min(1, (performance.now() - t0) / dur);
      el.textContent = p < 1 ? Math.round(target * (1 - Math.pow(1 - p, 3))) : target + suffix;
      if (p < 1) setTimeout(step, 16);
    };
    step();
  };
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
  }), { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}
