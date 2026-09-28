// =========================================================
// GNCE Mercury 26413 — shared header, footer, and countdown
// The nav tabs are defined ONCE here, so every page stays in sync.
// =========================================================

// SEASON SCHEDULE: drives the countdown + timeline on the home page.
// Dates are "YYYY-MM-DD". List events in order; the countdown moves to the next one automatically.
const SEASON = {
  kickoff: "2026-09-12",
  events: [
    { name: "Wolfpack Scrimmage", date: "2026-11-15" },
    { name: "Windsor Scrimmage", date: "2026-12-06" },
  ],
};

const NAV = [
  { label: "Home",       href: "index.html" },
  { label: "Team",       href: "team.html" },
  { label: "Seasons",    href: "seasons.html" },
  { label: "Outreach",   href: "outreach.html" },
  { label: "Contact",    href: "contact.html" },
];

// SPONSORS: shown in the footer of EVERY page.
// Keep this on all pages. To add a sponsor: { name: "Acme", logo: "images/acme.png", url: "https://acme.com" }.
// While the list is empty, placeholder logo boxes are shown.
const SPONSORS = [];
const SUPPORTERS_NOTE = "Thanks also to SolidWorks, Weston Owl, and WEEFC for supporting our team.";

// Pages inside /seasons/ set data-root="../" on <body> so links still work.
const root = document.body.dataset.root || "";
const page = document.body.dataset.page || "";

// ---------- Header ----------
const header = document.createElement("header");
header.className = "site-header";
header.innerHTML = `
  <nav class="nav-bar">
    <a class="brand" href="${root}index.html">
      <img class="brand-logo" src="${root}images/logo.png" alt="" onerror="this.remove()">
      GNCE MERCURY <span class="num">#26413</span>
    </a>
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
const sponsorLogos = SPONSORS.length
  ? SPONSORS.map(s => `<a class="sponsor" href="${s.url}" target="_blank" rel="noopener" title="${s.name}"><img src="${root}${s.logo}" alt="${s.name}"></a>`).join("")
  : `<span class="sponsor ph">Your logo here</span>`.repeat(4);
footer.innerHTML = `
  <div class="container footer-sponsors" id="sponsors">
    <span class="k">Our Sponsors</span>
    <div class="sponsor-row">${sponsorLogos}</div>
    <p class="supporters">${SUPPORTERS_NOTE} <a href="${root}contact.html#support">Become a sponsor →</a></p>
  </div>
  <div class="container">
    <div class="brand-line">GNCE MERCURY · FTC #26413</div>
    <div>Galactic Narwhal Chicken Effect · Weston, MA</div>
    <div style="margin-top:8px"><a href="https://www.instagram.com/gnce_mercury/" target="_blank" rel="noopener">Instagram: @gnce_mercury</a></div>
    <div style="margin-top:8px">© ${new Date().getFullYear()} GNCE Mercury</div>
  </div>`;
document.body.append(footer);

// ---------- Countdown + season timeline ----------
// Everything runs on Eastern time wall-clock (America/New_York), so the countdown hits 00:00
// at midnight in Massachusetts for every visitor and doesn't jump an hour around daylight saving.
// Times are stored as "Eastern wall-clock expressed as UTC milliseconds".
const DAY = 86400000;
const TZ = "America/New_York";
const toDate = str => { const [y, m, d] = str.split("-").map(Number); return Date.UTC(y, m - 1, d); }; // midnight Eastern
const easternNow = () => {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
  }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
};
const fmt = (d, opts) => new Date(d).toLocaleDateString(undefined, { ...opts, timeZone: "UTC" });
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
    const now = easternNow();
    const isToday = d => now >= d && now < d + DAY;

    // Timeline progress + past / today / next markers
    const nowPct = pct(now);
    tl.querySelector(".tl-fill").style.width = nowPct + "%";
    tl.querySelector(".tl-today").style.left = nowPct + "%";
    let nextMarked = false;
    points.forEach((p, i) => {
      const past = now >= p.day + DAY, today = isToday(p.day);
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
// Any element with class "counter" and data-count counts up every time it scrolls into view,
// and quietly resets to 0 once it's fully off screen.
const counters = document.querySelectorAll(".counter[data-count]");
const show0 = el => (el.dataset.prefix || "") + "0" + (el.dataset.unit || "");
if (counters.length) {
  const run = el => {
    // data-prefix and data-unit always show (e.g. "$" and "k"); data-suffix appears once it finishes (e.g. "+")
    const target = +el.dataset.count, dur = 1400, t0 = performance.now();
    const { prefix = "", unit = "", suffix = "" } = el.dataset;
    const show = n => prefix + n.toLocaleString("en-US") + unit;
    const step = () => {
      const p = Math.min(1, (performance.now() - t0) / dur);
      el.textContent = p < 1 ? show(Math.round(target * (1 - Math.pow(1 - p, 3)))) : show(target) + suffix;
      el._timer = p < 1 ? setTimeout(step, 16) : null;
    };
    step();
  };
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    const el = e.target;
    if (e.intersectionRatio >= 0.5 && !el._shown) {
      el._shown = true;
      run(el);
    } else if (!e.isIntersecting && el._shown) {
      el._shown = false;
      clearTimeout(el._timer);
      el.textContent = show0(el);
    }
  }), { threshold: [0, 0.5] });
  counters.forEach(c => io.observe(c));
}

// ---------- Robot carousel (home page) ----------
// Rotates every 3 seconds; pauses while the mouse is over it; arrows and dots jump directly.
const carousel = document.querySelector(".robot-carousel");
if (carousel) {
  const slides = [...carousel.querySelectorAll(".slide")];
  const dots = carousel.querySelector(".car-dots");
  dots.innerHTML = slides.map((_, i) => `<button aria-label="Show robot ${i + 1}"></button>`).join("");
  const dotBtns = [...dots.children];
  let current = 0, timer;
  const show = i => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle("active", j === current));
    dotBtns.forEach((d, j) => d.classList.toggle("active", j === current));
  };
  const start = () => { clearInterval(timer); timer = setInterval(() => show(current + 1), 3000); };
  carousel.querySelector(".prev").addEventListener("click", () => { show(current - 1); start(); });
  carousel.querySelector(".next").addEventListener("click", () => { show(current + 1); start(); });
  dotBtns.forEach((d, j) => d.addEventListener("click", () => { show(j); start(); }));
  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", start);
  show(0);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) start();
}

// ---------- Starfield (home page) ----------
// Tiny dots + a few 4-point sparkles like the ones in the logo. Seeded, so the layout is the same on every visit.
const starfield = document.querySelector(".starfield");
if (starfield) {
  let seed = 26413;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const SPARKLE = "M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z";
  let html = "";

  for (let i = 0; i < 113; i++) {
    const size = 1.5 + rand() * 1.8;
    const twinkle = rand() < 0.4;
    html += `<div class="dot${twinkle ? " twinkle" : ""}" style="left:${rand() * 100}%;top:${rand() * 100}%;` +
      `width:${size}px;height:${size}px;opacity:${0.4 + rand() * 0.45};` +
      `--dur:${3 + rand() * 4}s;--delay:${-rand() * 6}s"></div>`;
  }

  // Sparkles stay toward the sides so they don't sit on top of the title text
  for (let i = 0; i < 18; i++) {
    const size = 10 + rand() * 16;
    const x = rand() < 0.5 ? 2 + rand() * 24 : 74 + rand() * 24;
    html += `<svg class="sparkle twinkle" viewBox="0 0 24 24" style="left:${x}%;top:${3 + rand() * 80}%;` +
      `width:${size}px;height:${size}px;opacity:${0.5 + rand() * 0.4};` +
      `--dur:${3 + rand() * 3}s;--delay:${-rand() * 5}s"><path d="${SPARKLE}"/></svg>`;
  }

  starfield.innerHTML = html;
}

// ---------- Outreach year tabs ----------
// Each <section class="year-panel" data-tab="..."> becomes a tab; the first one is shown first.
// Without JavaScript every year simply shows, one after another.
const tabBar = document.querySelector(".year-tabs");
if (tabBar) {
  const panels = [...document.querySelectorAll(".year-panel")];
  tabBar.innerHTML = panels.map(p => `<button role="tab" aria-controls="${p.id}">${p.dataset.tab}</button>`).join("");
  const tabs = [...tabBar.children];
  const select = i => {
    panels.forEach((p, j) => { p.hidden = j !== i; });
    tabs.forEach((t, j) => { t.classList.toggle("active", j === i); t.setAttribute("aria-selected", j === i); });
  };
  tabs.forEach((t, i) => t.addEventListener("click", () => { select(i); history.replaceState(null, "", "#" + panels[i].id); }));
  const fromHash = panels.findIndex(p => "#" + p.id === location.hash);
  select(fromHash >= 0 ? fromHash : 0);
}
