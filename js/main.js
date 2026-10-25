// =========================================================
// GNCE Mercury 26413 — shared header, footer, countdown, and page behaviour
// The nav tabs and the sponsors are defined ONCE here, so every page stays in sync.
// Every section below is wrapped in part(), and each one quietly skips a page that
// doesn't have its block, so a pasted or missing block can never break a page.
// =========================================================

// SEASON SCHEDULE: drives the countdown + timeline and the "Next competition" line in the footer.
// Dates are "YYYY-MM-DD". List events in order; the countdown moves to the next one automatically.
const SEASON = {
  kickoff: "2026-09-12",
  events: [
    { name: "Ghost Scrimmage", date: "2026-10-25" },
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
// SUPPORTERS are named (no logo) until we have their logos. An open "Become a sponsor" link is always shown.
const SPONSORS = [];
const SUPPORTERS = ["SolidWorks", "Weston Owl", "WEEFC"];
const TEAM_EMAIL = "gncemercury26413@gmail.com";
const INSTAGRAM = "https://www.instagram.com/gnce_mercury/";

// Pages inside /seasons/ set data-root="../" on <body> so links still work.
const root = document.body.dataset.root || "";
const page = document.body.dataset.page || "";
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const part = (name, fn) => { try { fn(); } catch (e) { console.error("[mercury] " + name, e); } };
const main = document.querySelector("main");

// ---------- Time helpers ----------
// Everything runs on Eastern time wall-clock (America/New_York), so the countdown hits 00:00
// at midnight in Massachusetts for every visitor and doesn't jump an hour around daylight saving.
// Times are stored as "Eastern wall-clock expressed as UTC milliseconds".
// Testing: add ?now=2026-10-25T09:00 to the address to see the site as it will look at that moment.
const DAY = 86400000;
const TZ = "America/New_York";
const toDate = str => { const [y, m, d] = str.split("-").map(Number); return Date.UTC(y, m - 1, d); }; // midnight Eastern
const NOW_OVERRIDE = Date.parse((new URLSearchParams(location.search).get("now") || "") + "Z");
const LOADED_AT = Date.now();
const easternNow = () => {
  if (!isNaN(NOW_OVERRIDE)) return NOW_OVERRIDE + (Date.now() - LOADED_AT);
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
  }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
};
const fmt = (d, opts) => new Date(d).toLocaleDateString(undefined, { ...opts, timeZone: "UTC" });
const LONG = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
const SHORT = { month: "short", day: "numeric" };
const seasonEvents = () => SEASON.events.map(e => ({ ...e, day: toDate(e.date) }));
// "Competition day: …", "Next competition: …, Nov 15", or null once the season is over
const statusLine = () => {
  const now = easternNow();
  const events = seasonEvents();
  const today = events.find(e => now >= e.day && now < e.day + DAY);
  if (today) return { text: `Competition day: ${today.name}`, live: true };
  const next = events.find(e => now < e.day);
  return next ? { text: `Next competition: ${next.name}, ${fmt(next.day, SHORT)}` } : null;
};

// ---------- Header ----------
// Solid bar; hides while scrolling down a long page and returns on any scroll up.
// Under 821px the links open as a full-screen menu.
const header = document.createElement("header");
part("header", () => {
  header.className = "site-header at-top";
  header.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <nav class="nav-bar" aria-label="Main">
      <a class="brand" href="${root}index.html">
        <img class="brand-logo" src="${root}images/logo-mark.png" alt="" width="30" height="32" onerror="this.remove()">
        GNCE MERCURY <span class="num">#26413</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu">Menu</button>
      <ul class="nav-links" id="site-menu">
        ${NAV.map(n => {
          const active = page && n.href.startsWith(page);
          return `<li><a href="${root}${n.href}"${active ? ' class="active" aria-current="page"' : ""}>${n.label}</a></li>`;
        }).join("")}
        <li class="nav-extra"><a href="mailto:${TEAM_EMAIL}">${TEAM_EMAIL}</a><a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram @gnce_mercury</a></li>
      </ul>
    </nav>`;
  document.body.prepend(header);
  if (main) { main.id ||= "main"; main.tabIndex = -1; }

  const toggle = header.querySelector(".nav-toggle");
  const links = header.querySelector(".nav-links");
  const items = [...links.querySelectorAll("li")];
  items.forEach((li, i) => li.style.setProperty("--i", i));
  const isOpen = () => links.classList.contains("open");
  const setInert = on => { [main, document.querySelector(".site-footer")].forEach(el => { if (el) el.inert = on; }); };
  const open = () => {
    links.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Close";
    header.classList.remove("is-hidden");
    setInert(true);
    document.documentElement.style.overflow = "hidden";
    links.querySelector("a")?.focus();
  };
  const close = returnFocus => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
    setInert(false);
    document.documentElement.style.overflow = "";
    if (returnFocus) toggle.focus();
  };
  toggle.addEventListener("click", () => (isOpen() ? close(true) : open()));
  links.addEventListener("click", e => { if (e.target.closest("a") && isOpen()) close(false); });
  document.addEventListener("keydown", e => {
    if (!isOpen()) return;
    if (e.key === "Escape") { e.preventDefault(); close(true); return; }
    if (e.key !== "Tab") return;
    // keep focus inside the menu: the Close button plus every link
    const focusables = [toggle, ...links.querySelectorAll("a")];
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  matchMedia("(min-width: 821px)").addEventListener("change", e => { if (e.matches && isOpen()) close(false); });

  // Hide on scroll down, show on scroll up. Never while the menu is open, focus is inside,
  // the page is short, right after an anchor jump, or when the visitor prefers less motion.
  let lastY = scrollY, ticking = false, quietUntil = 0;
  const quiet = () => { quietUntil = performance.now() + 600; header.classList.remove("is-hidden"); };
  addEventListener("hashchange", quiet);
  document.addEventListener("click", e => { if (e.target.closest('a[href*="#"]')) quiet(); });
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
  const onScroll = () => {
    ticking = false;
    const y = scrollY;
    header.classList.toggle("at-top", y < 8);
    const canHide = !RM && !isOpen() && !header.matches(":focus-within") && performance.now() > quietUntil
      && document.documentElement.scrollHeight > innerHeight * 2;
    if (canHide && y > 160 && y - lastY > 6) header.classList.add("is-hidden");
    else if (lastY - y > 6 || y < 160 || !canHide) header.classList.remove("is-hidden");
    lastY = y;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Home: the big wordmark and the small brand never share a screen
  const wordmark = document.querySelector(".wordmark");
  if (wordmark && "IntersectionObserver" in window) {
    const html = document.documentElement;
    html.classList.toggle("wm-visible", wordmark.getBoundingClientRect().bottom > 0);
    new IntersectionObserver(([e]) => html.classList.toggle("wm-visible", e.isIntersecting)).observe(wordmark);
  }
});

// ---------- Footer ----------
// First block on every page: Our Sponsors & Supporters (from SPONSORS and SUPPORTERS above).
const footer = document.createElement("footer");
part("footer", () => {
  footer.className = "site-footer";
  const sponsorItems = [
    ...SPONSORS.map(s => `<a class="sponsor" href="${s.url}" target="_blank" rel="noopener" title="${s.name}"><img src="${root}${s.logo}" alt="${s.name}"></a>`),
    ...SUPPORTERS.map(n => `<span class="sponsor named">${n}</span>`),
    `<a class="sponsor open text-link" href="${root}contact.html#support">Become a sponsor</a>`,
  ].join("");
  const status = statusLine();
  footer.innerHTML = `
    <div class="container footer-sponsors" id="sponsors">
      <div class="fs-head">
        <span class="k">Our Sponsors &amp; Supporters</span>
        <p>Thank you to everyone who helps us build, compete, and run outreach.</p>
      </div>
      <div class="sponsor-row">${sponsorItems}</div>
    </div>
    <div class="container footer-main">
      <a class="footer-brand" href="${root}index.html">
        <img src="${root}images/logo-mark.png" alt="" width="44" height="47">
        <span><b>GNCE Mercury</b><small>FTC #26413 · Galactic Narwhal Chicken Effect · Weston, MA</small></span>
      </a>
      <div class="footer-links">
        ${status ? `<a class="footer-next" href="${root}index.html#countdown">${status.text}</a>` : ""}
        <a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram @gnce_mercury</a>
        <a href="mailto:${TEAM_EMAIL}">${TEAM_EMAIL}</a>
        <span>© ${new Date().getFullYear()} GNCE Mercury</span>
      </div>
    </div>`;
  document.body.append(footer);
});

// ---------- Countdown + season timeline ----------
// The digits are built once and only their text changes. The clock only ticks while the
// countdown is on screen and the tab is visible. Screen readers get one sentence a minute.
part("countdown", () => {
  const cd = document.getElementById("countdown");
  if (!cd) return;
  const events = seasonEvents();
  const kickoff = toDate(SEASON.kickoff);
  const nameEl = cd.querySelector(".event-name");
  const dateEl = cd.querySelector(".event-date");
  const timer = cd.querySelector(".timer");
  const tl = document.getElementById("timeline");
  if (!nameEl || !dateEl || !timer || !events.length) return;
  cd.classList.add("ready");
  timer.setAttribute("aria-hidden", "true");
  const sr = document.createElement("p");
  sr.className = "visually-hidden cd-sr";
  sr.setAttribute("aria-live", "polite");
  cd.append(sr);

  // Timeline positions are % of the way from kickoff to the last event.
  const end = events[events.length - 1].day;
  const pct = d => Math.min(100, Math.max(0, (d - kickoff) / (end - kickoff) * 100));
  const points = [{ name: "Season Kickoff", day: kickoff }, ...events];
  let ptEls = [];
  if (tl) {
    tl.innerHTML = `
      <div class="tl-track"><div class="tl-fill"></div></div>
      <div class="tl-today"><span>Today</span></div>
      ${points.map((p, i) => `
        <div class="tl-pt ${i === 0 ? "first" : ""} ${i === points.length - 1 ? "last" : ""}" style="left:${pct(p.day)}%;--i:${i}">
          <div class="dot"></div>
          <div class="lbl"><b>${p.name}</b><span>${fmt(p.day, SHORT)}</span></div>
        </div>`).join("")}`;
    ptEls = [...tl.querySelectorAll(".tl-pt")];
  }

  const UNITS = ["Days", "Hours", "Min", "Sec"];
  let digits = [], lastState = "", lastMinute = -1;
  const buildUnits = () => {
    timer.innerHTML = UNITS.map(l => `<div class="unit"><div class="n">00</div><div class="l">${l}</div></div>`).join("");
    digits = [...timer.querySelectorAll(".n")];
  };
  const tick = () => {
    const now = easternNow();
    const isToday = d => now >= d && now < d + DAY;

    if (tl) {
      const nowPct = pct(now);
      tl.style.setProperty("--pct", nowPct / 100);
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
    }

    // Event today → competition day, else count down to the next event, else season over
    const today = events.find(e => isToday(e.day));
    const next = events.find(e => now < e.day);
    const state = today ? "today" + today.date : next ? "next" + next.date : "done";
    if (state !== lastState) {
      lastState = state;
      lastMinute = -1;
      cd.classList.toggle("live", !!today);
      if (today) {
        nameEl.textContent = today.name;
        dateEl.textContent = fmt(today.day, LONG);
        timer.innerHTML = `<p class="live-line">Competition day · <a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram ↗</a></p>`;
        timer.removeAttribute("aria-hidden");
        sr.textContent = `Today is competition day: ${today.name}.`;
      } else if (next) {
        nameEl.textContent = next.name;
        dateEl.textContent = fmt(next.day, LONG);
        buildUnits();
        timer.setAttribute("aria-hidden", "true");
      } else {
        nameEl.textContent = "Season complete!";
        dateEl.textContent = "Thanks for following along. See you next season.";
        timer.innerHTML = "";
        sr.textContent = "";
      }
    }

    if (!today && next) {
      let diff = Math.max(0, next.day - now);
      const d = Math.floor(diff / DAY);     diff %= DAY;
      const h = Math.floor(diff / 3600000); diff %= 3600000;
      const m = Math.floor(diff / 60000);   diff %= 60000;
      const s = Math.floor(diff / 1000);
      [d, h, m, s].forEach((v, i) => {
        const t = String(v).padStart(2, "0");
        if (digits[i] && digits[i].textContent !== t) digits[i].textContent = t;
      });
      const minuteKey = d * 1440 + h * 60 + m;
      if (minuteKey !== lastMinute) {
        lastMinute = minuteKey;
        const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
        sr.textContent = `${plural(d, "day")}, ${plural(h, "hour")} and ${plural(m, "minute")} until ${next.name}.`;
      }
    }
  };
  tick();

  // Only tick while the countdown is visible
  let interval = null, onScreen = true;
  const run = () => {
    const want = onScreen && document.visibilityState === "visible";
    if (want && !interval) { tick(); interval = setInterval(tick, 1000); }
    if (!want && interval) { clearInterval(interval); interval = null; }
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; run(); }).observe(cd);
    // The timeline draws once, the first time it comes into view
    if (tl) {
      const tio = new IntersectionObserver(([e]) => { if (e.isIntersecting) { tl.classList.add("drawn"); tio.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
      tio.observe(tl);
    }
  } else if (tl) tl.classList.add("drawn");
  document.addEventListener("visibilitychange", run);
  run();
});

// ---------- Index preview plate (home) ----------
// On a big screen with a mouse, hovering a row in "Read more" shows a photo beside the list.
part("index-preview", () => {
  const list = document.querySelector(".index-list");
  if (!list) return;
  const rows = [...list.querySelectorAll("a[data-preview]")];
  if (!rows.length) return;
  const mq = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1000px)");
  let wrap = null, plate = null, fig = null, imgs = [], cur = 0, preloaded = false;
  const preload = () => { if (preloaded) return; preloaded = true; rows.forEach(a => { new Image().src = a.dataset.preview; }); };
  const show = a => {
    if (!fig) return;
    const y = Math.max(0, Math.min(a.offsetTop + a.offsetHeight / 2 - fig.offsetHeight / 2, list.offsetHeight - fig.offsetHeight));
    fig.style.setProperty("--y", y + "px");
    const target = imgs[1 - cur];
    if (imgs[cur].dataset.src !== a.dataset.preview) {
      target.src = a.dataset.preview;
      target.dataset.src = a.dataset.preview;
      target.classList.toggle("contain", a.dataset.fit === "contain");
      imgs[cur].classList.remove("on");
      target.classList.add("on");
      cur = 1 - cur;
    }
    fig.classList.add("is-shown");
  };
  const hide = () => fig?.classList.remove("is-shown");
  const build = () => {
    if (wrap) return;
    wrap = document.createElement("div");
    wrap.className = "index-wrap has-preview";
    list.before(wrap);
    wrap.append(list);
    plate = document.createElement("div");
    plate.className = "index-plate";
    plate.innerHTML = `<figure class="index-preview" aria-hidden="true"><img alt=""><img alt=""></figure>`;
    wrap.append(plate);
    fig = plate.firstElementChild;
    imgs = [...fig.querySelectorAll("img")];
    list.addEventListener("pointerenter", preload);
    wrap.addEventListener("pointerleave", hide);
    list.addEventListener("focusout", e => { if (!list.contains(e.relatedTarget)) hide(); });
  };
  const teardown = () => {
    if (!wrap) return;
    wrap.before(list);
    wrap.remove();
    wrap = plate = fig = null;
    imgs = [];
  };
  rows.forEach(a => {
    a.addEventListener("pointerenter", () => show(a));
    a.addEventListener("focus", () => { preload(); show(a); });
  });
  const sync = () => (mq.matches ? build() : teardown());
  mq.addEventListener("change", sync);
  sync();
});

// ---------- Outreach year tabs ----------
// Each <section class="year-panel" data-tab="Third Year · 2026–27"> becomes a tab; the first one is shown first.
// Without JavaScript every year simply shows, one after another.
part("year-tabs", () => {
  const tabBar = document.querySelector(".year-tabs");
  if (!tabBar) return;
  const panels = [...document.querySelectorAll(".year-panel")];
  if (!panels.length) return;
  tabBar.innerHTML = panels.map(p => {
    const [name, year] = (p.dataset.tab || p.id).split(" · ");
    return `<button type="button" role="tab" id="tab-${p.id}" aria-controls="${p.id}">${year ? `<span class="tab-year">${year}</span>` : ""}<span class="tab-name">${name}</span></button>`;
  }).join("") + `<span class="tab-ind" aria-hidden="true"></span>`;
  const tabs = [...tabBar.querySelectorAll("[role=tab]")];
  const ind = tabBar.querySelector(".tab-ind");
  panels.forEach(p => { p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", "tab-" + p.id); p.tabIndex = 0; });
  let current = -1;
  const place = () => {
    const t = tabs[current];
    if (!t) return;
    ind.style.setProperty("--x", t.offsetLeft + "px");
    ind.style.setProperty("--w", t.offsetWidth / 100);
  };
  const select = (i, { focus = false, user = false } = {}) => {
    const changed = i !== current;
    current = i;
    panels.forEach((p, j) => { p.hidden = j !== i; });
    tabs.forEach((t, j) => { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; });
    place();
    if (changed && user && !RM) {
      const p = panels[i];
      p.classList.remove("panel-in");
      void p.offsetWidth;
      p.classList.add("panel-in");
      p.addEventListener("animationend", () => p.classList.remove("panel-in"), { once: true });
    }
    if (user) history.replaceState(null, "", "#" + panels[i].id);
    if (focus) { tabs[i].focus(); tabs[i].scrollIntoView({ block: "nearest", inline: "nearest" }); }
  };
  tabs.forEach((t, i) => t.addEventListener("click", () => select(i, { user: true })));
  tabBar.addEventListener("keydown", e => {
    const keys = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select((keys[e.key] + tabs.length) % tabs.length, { focus: true, user: true });
  });
  addEventListener("resize", place);
  document.fonts?.ready.then(place);
  const fromHash = panels.findIndex(p => "#" + p.id === location.hash);
  select(fromHash >= 0 ? fromHash : 0);
});

// ---------- Photo viewer (Loupe) ----------
// Outreach photos, mechanism images and event photos open full screen.
// Swipe or use the arrow keys to move through the photos of the same event.
part("loupe", () => {
  if (typeof HTMLDialogElement !== "function") return;
  const imgs = [...document.querySelectorAll(".chapter img, .parts-grid img, .event-photo")].filter(img => !img.closest("a, button"));
  if (!imgs.length) return;
  imgs.forEach(img => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "zoom";
    btn.setAttribute("aria-label", "Enlarge photo: " + (img.alt || "photo"));
    img.before(btn);
    btn.append(img);
  });
  const dlg = document.createElement("dialog");
  dlg.className = "loupe";
  dlg.setAttribute("aria-label", "Photo viewer");
  dlg.innerHTML = `
    <div class="loupe-bar"><span class="loupe-count"></span><button type="button" class="loupe-close">Close</button></div>
    <div class="loupe-track"></div>
    <div class="loupe-nav"><button type="button" class="loupe-prev">Previous</button><button type="button" class="loupe-next">Next</button></div>`;
  document.body.append(dlg);
  const track = dlg.querySelector(".loupe-track");
  const count = dlg.querySelector(".loupe-count");
  let opener = null, n = 0, slideIO = null;
  const step = dir => track.scrollBy({ left: dir * track.clientWidth, behavior: RM ? "auto" : "smooth" });
  const openAt = (group, index, from) => {
    opener = from;
    n = group.length;
    track.innerHTML = "";
    group.forEach(src => {
      const fig = document.createElement("figure");
      fig.className = "loupe-slide";
      const im = document.createElement("img");
      im.src = src.currentSrc || src.src;
      im.alt = src.alt;
      im.style.maxWidth = `min(92vw, ${src.naturalWidth || src.getAttribute("width") || 1600}px)`;
      const cap = document.createElement("figcaption");
      cap.textContent = src.alt;
      fig.append(im, cap);
      track.append(fig);
    });
    dlg.classList.toggle("single", n < 2);
    count.textContent = `${index + 1} / ${n}`;
    dlg.showModal();
    document.documentElement.classList.add("loupe-open");
    track.scrollLeft = index * track.clientWidth;
    slideIO?.disconnect();
    slideIO = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) count.textContent = `${[...track.children].indexOf(e.target) + 1} / ${n}`;
    }), { root: track, threshold: 0.6 });
    [...track.children].forEach(s => slideIO.observe(s));
  };
  document.addEventListener("click", e => {
    const btn = e.target.closest(".zoom");
    if (!btn) return;
    const img = btn.querySelector("img") || btn.closest(".wt")?.querySelector(".part-card.is-current img");
    if (!img) return;
    const groupEl = btn.closest(".chapter, .parts-grid, .event, .wt");
    const group = groupEl ? [...groupEl.querySelectorAll(".part-card img, .chapter img, .event-photo")].filter(i => !i.closest(".wt-stage")) : [img];
    const target = btn.classList.contains("wt-zoom") ? groupEl.querySelector(".part-card.is-current img") : img;
    openAt(group, Math.max(0, group.indexOf(target)), btn);
  });
  dlg.querySelector(".loupe-close").addEventListener("click", () => dlg.close());
  dlg.querySelector(".loupe-prev").addEventListener("click", () => step(-1));
  dlg.querySelector(".loupe-next").addEventListener("click", () => step(1));
  dlg.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  });
  dlg.addEventListener("click", e => { if (e.target === dlg || e.target === track || e.target.classList.contains("loupe-slide")) dlg.close(); });
  dlg.addEventListener("close", () => {
    document.documentElement.classList.remove("loupe-open");
    slideIO?.disconnect();
    opener?.focus();
  });
});

// ---------- Mechanism walkthrough (DECODE) ----------
// On a big screen, the mechanism cards scroll past on the right while their image holds still on the left.
// Opt in with data-walkthrough on a .parts-grid. Phones and small windows keep the normal card grid.
part("walkthrough", () => {
  const grid = document.querySelector("[data-walkthrough]");
  if (!grid) return;
  const cards = [...grid.querySelectorAll(".part-card")].filter(c => c.querySelector("img") && c.querySelector("h3"));
  if (cards.length < 2) return;
  const mq = matchMedia("(min-width: 1000px) and (min-height: 700px)");
  const pad = n => String(n).padStart(2, "0");
  let wt = null, io = null;
  const build = () => {
    if (wt) return;
    wt = document.createElement("div");
    wt.className = "wt";
    grid.before(wt);
    const stage = document.createElement("figure");
    stage.className = "wt-stage";
    stage.innerHTML = `<button type="button" class="zoom wt-zoom"></button><span class="wt-count"></span><span class="wt-rail" style="--n:${cards.length}"><i></i></span>`;
    const zoom = stage.querySelector(".wt-zoom");
    const clones = cards.map(c => {
      const src = c.querySelector("img");
      const im = document.createElement("img");
      im.src = src.currentSrc || src.getAttribute("src");
      im.alt = "";
      if (src.width) { im.width = src.getAttribute("width") || src.naturalWidth; im.height = src.getAttribute("height") || src.naturalHeight; }
      if (src.classList.contains("render")) im.classList.add("feather");
      zoom.append(im);
      return im;
    });
    wt.append(stage, grid);
    const count = stage.querySelector(".wt-count");
    const rail = stage.querySelector(".wt-rail i");
    const setCurrent = i => {
      cards.forEach((c, j) => c.classList.toggle("is-current", j === i));
      clones.forEach((c, j) => c.classList.toggle("is-current", j === i));
      const name = cards[i].querySelector("h3").textContent;
      count.textContent = `${pad(i + 1)} / ${pad(cards.length)} · ${name}`;
      rail.style.setProperty("--k", i);
      zoom.setAttribute("aria-label", "Enlarge photo: " + (cards[i].querySelector("img").alt || name));
    };
    setCurrent(0);
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setCurrent(cards.indexOf(e.target)); }), { rootMargin: "-45% 0px -45% 0px" });
    cards.forEach(c => io.observe(c));
  };
  const teardown = () => {
    if (!wt) return;
    io?.disconnect();
    wt.before(grid);
    wt.remove();
    wt = null;
    cards.forEach(c => c.classList.remove("is-current"));
  };
  const sync = () => (mq.matches ? build() : teardown());
  mq.addEventListener("change", sync);
  sync();
});

// ---------- Team: monogram plates and the crew filter ----------
part("monograms", () => {
  document.querySelectorAll("div.portrait").forEach(p => {
    const h = p.closest(".member")?.querySelector("h3");
    if (!h) return;
    const words = h.textContent.replace(/\(.*?\)/g, "").trim().split(/\s+/);
    const initials = (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
    p.innerHTML = `<span class="mono-initials">${initials}</span>`;
  });
  // real portraits get a clipping box for the slow hover zoom
  document.querySelectorAll(".member > img.portrait").forEach(img => {
    const box = document.createElement("div");
    box.className = "portrait-box";
    img.before(box);
    box.append(img);
  });
});

part("crew-filter", () => {
  const grid = document.querySelector("[data-filter]");
  if (!grid) return;
  const members = [...grid.querySelectorAll(".member")];
  const chipsOf = m => [...m.querySelectorAll(".chip")].map(c => c.textContent.trim());
  const ORDER = ["CAD", "Build", "Outreach", "Electrical", "Game Strategy"];
  const found = [...new Set(members.flatMap(chipsOf))];
  if (!found.length) return;
  const labels = [...ORDER.filter(l => found.includes(l)), ...found.filter(l => !ORDER.includes(l))];
  const hasLeads = members.some(m => m.querySelector(".lead-tag"));
  const all = ["All", ...labels, ...(hasLeads ? ["Leads"] : [])];
  const bar = document.createElement("div");
  bar.className = "crew-filter";
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", "Filter members by subteam");
  bar.innerHTML = all.map((l, i) => `<button type="button" aria-pressed="${i === 0}">${l}</button>`).join("");
  const live = document.createElement("p");
  live.className = "visually-hidden";
  live.setAttribute("aria-live", "polite");
  grid.before(bar, live);
  bar.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const label = btn.textContent;
    bar.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === btn));
    let shown = 0;
    members.forEach(m => {
      const match = label === "All" || (label === "Leads" ? !!m.querySelector(".lead-tag") : chipsOf(m).includes(label));
      m.classList.toggle("is-dim", !match);
      if (match) shown++;
    });
    live.textContent = label === "All" ? `All ${members.length} members` : `${shown} of ${members.length} members · ${label}`;
  });
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
      msg.textContent = "Wrong password.";
      msg.classList.add("err");
      pass.select();
      return;
    }
    document.getElementById("special-quotes").innerHTML = `<p class="sq-msg">Special quotes unlocked.</p>`;
    revealSpecialQuotes(quotes);
  });

  // Unlock animation: scroll to the quotes, the lock shakes and pops open, then the quote
  // fades in. Afterwards it keeps a "Special quote" badge.
  const revealSpecialQuotes = async quotes => {
    const locked = [...document.querySelectorAll(".quote.locked")];
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const show = q => {
      q.innerHTML = `<span class="sq-badge">Special quote</span><span class="sq-text"></span>`;
      q.querySelector(".sq-text").textContent = quotes[q.dataset.secret] || "";
      q.classList.remove("locked", "unlocking");
      q.classList.add("special");
    };
    if (RM) return locked.forEach(show);

    locked[0]?.closest(".member").scrollIntoView({ behavior: "smooth", block: "center" });
    await wait(700);
    for (const q of locked) {
      q.classList.add("unlocking");
      await wait(650);
      show(q);
      q.classList.add("revealing");
      await wait(350);
    }
  };
});

// ---------- Contact form (contact page) ----------
// Opens the visitor's email app with the message addressed to the team email.
part("contact", () => {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;
  // contact.html?topic=join pre-selects "Joining the team" (used by the Join buttons)
  if (new URLSearchParams(location.search).get("topic") === "join") contactForm.elements.topic.value = "Joining the team";
  const status = contactForm.querySelector(".form-status");
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const f = contactForm.elements;
    const subject = `${f.topic.value} from ${f.name.value}`;
    const body = `${f.message.value}\n\n${f.name.value}\n${f.email.value}`;
    location.href = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (status) status.textContent = `Opening your email app. If nothing opens, email us directly at ${TEAM_EMAIL}.`;
  });
});

part("copy-email", () => {
  const row = document.querySelector(".contact-list a[href^='mailto:']");
  if (!row || !navigator.clipboard || !window.isSecureContext) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy";
  btn.textContent = "Copy";
  const live = document.createElement("span");
  live.className = "visually-hidden";
  live.setAttribute("aria-live", "polite");
  row.after(btn, live);
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(TEAM_EMAIL);
      btn.textContent = "Copied";
      live.textContent = "Email address copied";
      setTimeout(() => { btn.textContent = "Copy"; live.textContent = ""; }, 1600);
    } catch { /* clipboard blocked: the address is still on screen */ }
  });
});

// Spec sheets: "TBD" values are set in the label font so they read as not-yet-known
part("specs", () => {
  document.querySelectorAll(".specs li span:last-child").forEach(s => { if (s.textContent.trim() === "TBD") s.classList.add("tbd"); });
});

// ---------- Reveals ----------
// The motion is chosen by element type, so pages need no attributes:
//   rise    — headings, robot names and big figures lift once from behind their baseline
//   curtain — one to three main photos per page wipe open
//   rule    — hairlines in lists and figure rows draw left to right
//   fade    — everything else (paragraphs, labels, cards) only changes opacity
// Anything already on screen when the page loads stays as it is, so nothing flashes.
part("reveals", () => {
  const html = document.documentElement;
  // if anything below fails, show everything rather than leave a block hidden
  try { reveals(html); } catch (e) { html.classList.add("reveal-all"); throw e; }
});
function reveals(html) {
  if (RM || !("IntersectionObserver" in window) || html.classList.contains("reveal-all") || !main) {
    html.classList.add("reveal-all");
    return;
  }
  const fold = innerHeight * 0.92;
  const below = el => !!el.closest("[hidden]") || el.getBoundingClientRect().top > fold;
  const small = innerWidth < 700;
  const io = new IntersectionObserver(es => es.forEach(async e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target;
    if (el.classList.contains("frame")) {
      const img = el.querySelector("img");
      if (img) {
        await img.decode?.().catch(() => {});
        if (img.clientWidth * 1.06 > (img.naturalWidth || Infinity)) el.style.setProperty("--settle", 1);
      }
    }
    el.classList.add("in");
  }), { rootMargin: "0px 0px -12% 0px" });
  const watch = el => io.observe(el);

  const mask = el => {
    if (el.querySelector(":scope > .mask")) return;
    const outer = document.createElement("span");
    outer.className = "mask";
    const inner = document.createElement("span");
    inner.append(...el.childNodes);
    outer.append(inner);
    el.append(outer);
    return inner;
  };
  const frame = img => {
    const f = document.createElement("span");
    f.className = "frame";
    f.dataset.reveal = "curtain";
    img.before(f);
    f.append(img);
    return f;
  };

  // Page heads: one orchestrated entrance on load
  const head = main.querySelector(".page-head");
  if (head) {
    const ready = [];
    const add = (el, kind, d) => { el.dataset.reveal = kind; el.style.setProperty("--d", d + "ms"); ready.push(el); };
    head.querySelectorAll(":scope > .eyebrow").forEach(el => add(el, "fade", 0));
    head.querySelectorAll(":scope > h1").forEach(el => { mask(el); add(el, "rise", 0); });
    head.querySelectorAll(":scope > p").forEach(el => add(el, "fade", 150));
    head.querySelectorAll(".team-banner").forEach(img => { const f = frame(img); f.style.setProperty("--d", "250ms"); ready.push(f); });
    head.querySelectorAll(".mission").forEach(el => add(el, "fade", 400));
    head.classList.add("is-split");
    requestAnimationFrame(() => requestAnimationFrame(() => ready.forEach(el => el.classList.add("in"))));
  }

  const SKIP = ".hero, .page-head, .year-tabs, .season-hero, .wt-stage, .crew-filter, .special-quotes, .index-plate, .breadcrumb";
  const skip = el => !!el.closest(SKIP);

  // Robot chapters: the robot rises, then its name, then the copy
  main.querySelectorAll(".model").forEach(m => {
    if (!below(m)) return;
    m.dataset.reveal = "model";
    m.querySelectorAll(".model-name").forEach(n => { const inner = mask(n); inner?.style.setProperty("--d", "150ms"); });
    m.querySelectorAll(".model-copy > :not(.model-name)").forEach(el => { el.dataset.reveal = "fade"; el.style.setProperty("--d", "300ms"); watch(el); });
    watch(m);
  });

  // Rise: headings and big figures
  main.querySelectorAll(".section-title, .feature-copy h2, .closing h2, .cta h2, .stat .big").forEach(el => {
    if (skip(el) || el.closest(".model") || !below(el)) return;
    mask(el);
    if (el.matches(".stat .big")) return; // revealed with its row (rule)
    el.dataset.reveal = "rise";
    watch(el);
  });

  // Curtain: at most three main photos per page and per outreach year
  const budget = new Map();
  main.querySelectorAll(".feature-img, .closing-fig img, .chapter-lead img, .event-photo").forEach(img => {
    if (skip(img) || !below(img)) return;
    const scope = img.closest(".year-panel") || main;
    const used = budget.get(scope) || 0;
    if (used >= 3) return;
    budget.set(scope, used + 1);
    watch(frame(img));
  });

  // Rule: lists and rows whose hairlines draw in sequence
  main.querySelectorAll(".facts, .stats, .specs, .index-list, .closing-cols, .event-list, .software-grid, .bars").forEach(el => {
    if (skip(el) || el.closest("[data-reveal]") || !below(el)) return;
    el.dataset.reveal = "rule";
    [...el.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, small ? 2 : 5)));
    watch(el);
  });

  // Fade: the largest remaining blocks; cards in a grid fade one by one
  const GRIDS = ".members-grid, .grid, .parts-grid";
  const walk = (el, depth) => {
    for (const c of el.children) {
      if (c.matches("script, style, template, dialog") || c.dataset.reveal || skip(c)) continue;
      if (c.matches(GRIDS) && !c.querySelector("[data-reveal]")) {
        const perRow = c.matches(".members-grid") ? 4 : 3;
        [...c.children].forEach((card, i) => {
          if (!below(card)) return;
          card.dataset.reveal = "fade";
          card.style.setProperty("--d", (i % perRow) * 80 + "ms");
          watch(card);
        });
        continue;
      }
      if (c.querySelector("[data-reveal], " + SKIP)) { if (depth < 8) walk(c, depth + 1); continue; }
      if (!below(c)) continue;
      c.dataset.reveal = "fade";
      watch(c);
    }
  };
  walk(main, 0);
}

window.__mercury = true;
