// =========================================================
// GNCE Mercury 26413 — shared header, footer, and countdown
// The nav tabs are defined ONCE here, so every page stays in sync.
// =========================================================

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

// ---------- Countdown ----------
// Edit the date + event name on the <div class="countdown"> in index.html.
const cd = document.querySelector(".countdown[data-date]");
if (cd) {
  const target = new Date(cd.dataset.date);
  cd.querySelector(".event-name").textContent = cd.dataset.event;
  cd.querySelector(".event-date").textContent = target.toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const timer = cd.querySelector(".timer");

  const tick = () => {
    let diff = Math.max(0, target - new Date());
    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000);  diff %= 3600000;
    const m = Math.floor(diff / 60000);    diff %= 60000;
    const s = Math.floor(diff / 1000);
    timer.innerHTML = [[d, "Days"], [h, "Hours"], [m, "Min"], [s, "Sec"]]
      .map(([n, l]) => `<div class="unit"><div class="n">${String(n).padStart(2, "0")}</div><div class="l">${l}</div></div>`)
      .join("");
  };
  tick();
  setInterval(tick, 1000);
}
