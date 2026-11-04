#!/usr/bin/env python3
"""Agent files for mercury26413.org: run this after you change any page, js/main.js (SEASON, SPONSORS,
SUPPORTERS, the emails or Instagram) or ORG below.

    python3 tools/agent_files.py           # rewrite everything it owns
    python3 tools/agent_files.py --check   # change nothing; exit 1 if anything is out of date

It needs only Python 3.8+ (no installs). From each page in PAGES it writes:
  - <page>.html.md   the page as Markdown (served to agents that send "Accept: text/markdown", see .htaccess)
  - the block between <!-- agent:begin --> and <!-- agent:end --> in the page's <head>:
    the canonical link, the Markdown alternate link and the JSON-LD structured data
and for the whole site: llms.txt, llms-full.txt, sitemap.xml and agent/pages.json (read by mcp.php).

Facts come only from the pages, js/main.js and ORG below. Never put anything in ORG that the site doesn't say.
"""
import html
import json
import re
import subprocess
import sys
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://mercury26413.org/"

# Every page of the site, in reading order. A new page must be added here (the script stops if one is missing).
# kind: the schema.org type of the page.  parent: the page it sits under, for the breadcrumb trail.
PAGES = [
    {"path": "index.html", "name": "Home", "kind": "WebPage"},
    {"path": "seasons.html", "name": "Seasons", "kind": "CollectionPage"},
    {"path": "seasons/2026-2027.html", "name": "BIOBUZZ (2026–27)", "kind": "WebPage", "parent": "seasons.html"},
    {"path": "seasons/2025-2026.html", "name": "DECODE (2025–26)", "kind": "WebPage", "parent": "seasons.html"},
    {"path": "seasons/2024-2025.html", "name": "INTO THE DEEP (2024–25)", "kind": "WebPage", "parent": "seasons.html"},
    {"path": "team.html", "name": "Team", "kind": "AboutPage"},
    {"path": "outreach.html", "name": "Outreach", "kind": "WebPage"},
    {"path": "news.html", "name": "News", "kind": "CollectionPage"},
    {"path": "partners.html", "name": "Partners", "kind": "WebPage"},
    {"path": "resources.html", "name": "Resources", "kind": "CollectionPage"},
    {"path": "contact.html", "name": "Contact", "kind": "ContactPage"},
    {"path": "terms.html", "name": "Terms and privacy", "kind": "WebPage"},
]

# The team, as the site describes it (index.html, team.html, contact.html, the footer).
# sameAs: only profiles that are verifiably this team.
ORG = {
    "name": "GNCE Mercury",
    "alternateName": ["FTC team 26413", "FIRST Tech Challenge team 26413", "GNCE Mercury 26413"],
    "description": ("A high school FIRST Tech Challenge team in Weston, Massachusetts: team 26413, founded in 2024. "
                    "We build a new competition robot every year and teach younger students to do the same."),
    "foundingDate": "2024",
    "locality": "Weston", "region": "MA", "country": "US",
    "teamNumber": "26413",
    "parent": "GNCE (Galactic Narwhal Chicken Effect)",
    "logo": {"path": "images/logo-mark.png", "width": 473, "height": 505},
    "sameAs": [],  # filled from INSTAGRAM in js/main.js plus EXTRA_SAME_AS
    "sponsorContact": "Margaret Yang, head of sponsorship",
}
# verified 2026-11-04: each shows "GNCE Mercury", team 26413, Weston, MA, rookie year 2024
EXTRA_SAME_AS = [
    "https://ftc-events.firstinspires.org/team/26413",
    "https://ftcscout.org/teams/26413",
    "https://theorangealliance.org/teams/26413",
]

SKIP_TAGS = {"script", "style", "noscript", "template", "svg", "canvas", "button", "dialog", "iframe", "head", "select"}
TRUE_BLOCK = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "dl", "table", "figure", "blockquote", "pre", "hr",
              "form", "video", "section", "article", "details", "main", "header", "footer", "nav", "aside", "fieldset"}
CONTAINER = {"div", "li", "dd", "dt", "figcaption", "summary", "label", "legend", "address", "hgroup", "caption"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr", "param"}
CLOSES_P = TRUE_BLOCK | {"div", "address", "dl", "dd", "dt", "li", "figcaption"}


# ---------------------------------------------------------------- a small, forgiving HTML tree
class Node:
    __slots__ = ("tag", "attrs", "children", "parent")

    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.children, self.parent = tag, dict(attrs or {}), [], parent

    def cls(self):
        return (self.attrs.get("class") or "").split()

    def iter(self):
        for c in self.children:
            if isinstance(c, Node):
                yield c
                yield from c.iter()

    def find_all(self, pred):
        return [n for n in self.iter() if pred(n)]

    def find(self, pred):
        return next((n for n in self.iter() if pred(n)), None)

    def text(self):
        return "".join(c if isinstance(c, str) else c.text() for c in self.children)


class TreeBuilder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root")
        self.cur = self.root

    def _close(self, tag):
        n = self.cur
        while n is not None and n.tag != tag:
            n = n.parent
        if n is not None and n is not self.root:
            self.cur = n.parent

    def handle_starttag(self, tag, attrs):
        if tag in CLOSES_P and self.cur.tag == "p":
            self.cur = self.cur.parent
        if tag in ("li", "dt", "dd", "tr", "td", "th", "option"):
            same = {"li": ("li",), "dt": ("dt", "dd"), "dd": ("dt", "dd"), "tr": ("tr",), "td": ("td", "th"),
                    "th": ("td", "th"), "option": ("option",)}[tag]
            if self.cur.tag in same:
                self.cur = self.cur.parent
        node = Node(tag, [(k, v if v is not None else "") for k, v in attrs], self.cur)
        self.cur.children.append(node)
        if tag not in VOID:
            self.cur = node

    def handle_startendtag(self, tag, attrs):
        node = Node(tag, [(k, v if v is not None else "") for k, v in attrs], self.cur)
        self.cur.children.append(node)

    def handle_endtag(self, tag):
        if tag not in VOID:
            self._close(tag)

    def handle_data(self, data):
        self.cur.children.append(data)


def parse(text):
    tb = TreeBuilder()
    tb.feed(text)
    tb.close()
    return tb.root


# ---------------------------------------------------------------- HTML to Markdown
def absolute(url, page_path):
    if not url or url.startswith(("mailto:", "tel:", "http://", "https://", "data:")):
        return url
    if url.startswith("#"):
        return BASE + page_path + url
    base_dir = page_path.rsplit("/", 1)[0] + "/" if "/" in page_path else ""
    parts = (base_dir + url).split("/")
    out = []
    for p in parts:
        if p == "..":
            if out:
                out.pop()
        elif p != ".":
            out.append(p)
    path = "/".join(out)
    return BASE + ("" if path == "index.html" else path)


def esc_text(s):
    s = s.replace("\\", "\\\\").replace("*", "\\*").replace("`", "\\`").replace("[", "\\[").replace("]", "\\]")
    s = s.replace("<", "&lt;")
    return re.sub(r"(?<![A-Za-z0-9])_|_(?![A-Za-z0-9])", r"\\_", s)


def ws(s):
    return re.sub(r"[ \t\r\n\f ]+", " ", s.replace("⁠", "").replace("­", ""))


def skipped(n):
    if isinstance(n, str):
        return False
    if n.tag in SKIP_TAGS or n.tag.startswith("!"):
        return True
    a = n.attrs
    return (a.get("aria-hidden") == "true" or "hidden" in a or "data-md-skip" in a
            or n.tag == "input" and a.get("type") == "hidden")


HEADINGS = ("h1", "h2", "h3", "h4", "h5", "h6")


def has_heading(n):
    return n.tag in HEADINGS or n.find(lambda x: x.tag in HEADINGS) is not None


def is_media(n):
    """A photo/video block with no words of its own apart from captions (it belongs under the next heading)."""
    if has_heading(n):
        return False
    if n.tag not in ("img", "video", "figure", "picture") and n.find(lambda x: x.tag in ("img", "video")) is None:
        return False

    def words(x):
        return "".join(c if isinstance(c, str) else ("" if c.tag in ("figcaption", "caption") or skipped(c) else words(c))
                       for c in x.children)
    return not words(n).strip()


def has_block(n):
    return any(isinstance(c, Node) and not skipped(c) and (c.tag in TRUE_BLOCK or has_block(c)) for c in n.children)


class Converter:
    def __init__(self, page_path, hooks):
        self.page = page_path
        self.hooks = hooks  # data attribute -> function(node) -> list of markdown blocks

    # ----- inline
    def inline(self, n, in_link=False):
        if isinstance(n, str):
            return esc_text(ws(n))
        if skipped(n):
            return ""
        t = n.tag
        if t == "br":
            return "\n"
        if t == "wbr":
            return ""
        if t == "img":
            alt = ws(n.attrs.get("alt", "")).strip()
            if not alt:
                return ""
            return esc_text(alt) if in_link else f"![{esc_text(alt)}]({absolute(n.attrs.get('src', ''), self.page)})"
        if t in ("input", "textarea"):
            return ""
        parts = []
        prev_el = False
        # an element made only of other elements (a name, a role and an email; a row of links) lists them as items
        items_only = t in ("p", "div", "li", "dd", "td", "th", "span") and sum(
            1 for c in n.children if isinstance(c, Node) and not skipped(c)) > 1 and all(
            isinstance(c, Node) or not c.strip() for c in n.children)
        for c in n.children:
            if not isinstance(c, str) and skipped(c):
                continue
            if items_only and isinstance(c, str):
                continue
            piece = self.inline(c, in_link or t == "a")
            if not piece.strip():
                if piece and not items_only:
                    parts.append(piece)
                continue
            is_el = not isinstance(c, str)
            glued = parts and not parts[-1].endswith((" ", "\n"))
            if items_only and parts:
                parts.append(" · ")
                piece = piece.strip()
            elif is_el and prev_el and glued and not piece.startswith((" ", "\n", ",", ".", ")", ":", ";")):
                parts.append(" · ")
            elif not is_el and prev_el and glued and piece[:1].isalnum():
                parts.append(" · ")  # e.g. <b>Host a student visit</b>We tour… (the bold is its own line on the page)
            parts.append(piece)
            prev_el = is_el
        s = "".join(parts)
        if t in ("b", "strong"):
            return self.wrap(s, "**")
        if t in ("i", "em", "cite"):
            return self.wrap(s, "*")
        if t == "code":
            return f"`{s.strip()}`" if s.strip() else ""
        if t == "a":
            href = n.attrs.get("href", "")
            label = s.strip()
            if not href or href.startswith(("#", "javascript:")) and not href[1:]:
                return s
            if not label:
                return ""
            return f"[{label}]({absolute(href, self.page)})"
        if t in ("sup",):
            return "^" + s
        if t == "video":
            return self.video(n)
        return s

    @staticmethod
    def wrap(s, mark):
        core = s.strip()
        if not core:
            return s
        lead = s[: len(s) - len(s.lstrip())]
        trail = s[len(s.rstrip()):]
        return f"{lead}{mark}{core}{mark}{trail}"

    def line(self, n):
        s = self.inline(n)
        s = "\n".join(re.sub(r" {2,}", " ", l).strip() for l in s.split("\n"))
        return s.strip()

    # ----- blocks
    def blocks(self, n):
        """Markdown blocks for the children of n."""
        out, buf = [], []

        def flush():
            text = "".join(buf)
            buf.clear()
            text = "\n".join(re.sub(r" {2,}", " ", l).strip() for l in text.split("\n")).strip()
            if text:
                out.append(text.replace("\n", "  \n"))

        # Cards put their photo first and their heading after it. Move the photos to just under that heading,
        # so each section of the Markdown holds its own pictures.
        els = [c for c in n.children if isinstance(c, Node) and not skipped(c)]
        lead = []
        for c in els:
            if not is_media(c):
                break
            lead.append(c)
        anchor = els[len(lead)] if lead and len(lead) < len(els) and has_heading(els[len(lead)]) else None
        if anchor is not None and any(isinstance(c, str) and c.strip() for c in n.children[:n.children.index(anchor)]):
            anchor = None
        media_blocks = []
        if anchor is not None:
            for c in lead:
                media_blocks.extend(self.block(c) if (c.tag in TRUE_BLOCK or c.tag in CONTAINER or has_block(c))
                                    else [x for x in [self.line(c)] if x])

        for c in n.children:
            if isinstance(c, str):
                buf.append(self.inline(c))
                continue
            if skipped(c) or (anchor is not None and c in lead):
                continue
            start = len(out)
            hook = next((h for h in self.hooks if h in c.attrs), None)
            if hook:
                flush()
                start = len(out)
                out.extend(self.hooks[hook](c))
            elif c.tag in TRUE_BLOCK or c.tag in CONTAINER or has_block(c):
                flush()
                start = len(out)
                out.extend(self.block(c))
            else:
                buf.append(self.inline(c))
            if c is anchor:
                flush()
                at = next((i + 1 for i in range(start, len(out)) if out[i].startswith("#")), len(out))
                out[at:at] = media_blocks
        flush()
        return out

    def block(self, n):
        t = n.tag
        if t in ("h1", "h2", "h3", "h4", "h5", "h6"):
            text = self.line(n).replace("\n", " ")
            return [f"{'#' * int(t[1])} {text}"] if text else []
        if t == "p" or (t in CONTAINER and not has_block(n) and t not in ("li", "dd", "dt")):
            text = self.line(n)
            return [text.replace("\n", "  \n")] if text else []
        if t in ("ul", "ol"):
            return [self.list(n)] if self.list(n) else []
        if t == "dl":
            return [self.dl(n)] if self.dl(n) else []
        if t == "table":
            return self.table(n)
        if t == "blockquote":
            cite = [c for c in n.children if isinstance(c, Node) and c.tag == "footer" and not skipped(c)]
            parts = self.blocks(n) if not cite else []
            if cite:
                body = Node("div")
                body.children = [c for c in n.children if c not in cite]
                parts = self.blocks(body) + ["— " + self.line(c) for c in cite]
            inner = "\n\n".join(parts)
            return ["\n".join("> " + l if l else ">" for l in inner.split("\n"))] if inner else []
        if t == "hr":
            return ["* * *"]
        if t == "pre":
            return ["```\n" + n.text().strip("\n") + "\n```"]
        if t == "figure":
            return self.figure(n)
        if t == "video":
            return [self.video(n)]
        if t == "form":
            return self.form(n)
        if t == "img":
            s = self.inline(n)
            return [s] if s else []
        if t == "a" and has_block(n):
            inner = self.blocks(n)
            href = n.attrs.get("href")
            if href and inner:
                inner.append(f"[Open]({absolute(href, self.page)})")
            return inner
        if t == "section" and "data-tab" in n.attrs:
            inner = self.blocks(n)
            first = n.find(lambda x: x.tag in ("h1", "h2", "h3"))
            if not first:
                inner.insert(0, "## " + esc_text(ws(n.attrs["data-tab"]).strip()))
            return inner
        return self.blocks(n)

    def list(self, n):
        ordered = n.tag == "ol"
        items, i = [], int(n.attrs.get("start") or 1)
        for li in n.children:
            if isinstance(li, str) or skipped(li) or li.tag != "li":
                continue
            if has_block(li):
                parts = self.blocks(li)
            else:
                text = self.line(li)
                parts = [text.replace("\n", "  \n")] if text else []
            if not parts:
                continue
            marker = f"{i}. " if ordered else "- "
            pad = " " * len(marker)
            body = "\n\n".join(parts)
            lines = body.split("\n")
            items.append(marker + lines[0] + "".join("\n" + (pad + l if l else "") for l in lines[1:]))
            i += 1
        return "\n".join(items)

    def dl(self, n):
        rows = []
        groups = []
        for c in n.children:
            if isinstance(c, str) or skipped(c):
                continue
            if c.tag == "div":
                groups.append([x for x in c.children if isinstance(x, Node) and not skipped(x)])
            else:
                groups.append([c])
        term = None
        for g in groups:
            for x in g:
                if x.tag == "dt":
                    term = self.line(x)
                elif x.tag == "dd":
                    val = self.line(x).replace("\n", " ")
                    rows.append(f"**{term}:** {val}" if term else val)
        return "  \n".join(rows)

    def cell(self, n):
        return self.line(n).replace("\n", " ").replace("|", "\\|")

    def table(self, n):
        out = []
        cap = n.find(lambda x: x.tag == "caption")
        if cap is not None and not skipped(cap):
            text = self.line(cap)
            if text:
                out.append(f"**{text}**")
        rows = []
        head_rows = 0
        for tr in n.find_all(lambda x: x.tag == "tr"):
            cells = [c for c in tr.children if isinstance(c, Node) and c.tag in ("td", "th")]
            if not cells:
                continue
            in_head = tr.parent is not None and tr.parent.tag == "thead"
            rows.append(([self.cell(c) for c in cells], in_head))
            head_rows += in_head
        if not rows:
            return out
        width = max(len(r) for r, _ in rows)
        rows = [(r + [""] * (width - len(r)), h) for r, h in rows]
        if head_rows:
            header = rows[0][0]
            body = [r for r, h in rows[1:]]
        else:
            header = [""] * width
            body = [r for r, _ in rows]
        lines = ["| " + " | ".join(header) + " |", "|" + "|".join(" --- " for _ in header) + "|"]
        lines += ["| " + " | ".join(r) + " |" for r in body]
        out.append("\n".join(lines))
        return out

    def figure(self, n):
        out = []
        for c in n.children:
            if isinstance(c, str) or skipped(c):
                continue
            if c.tag == "figcaption":
                text = self.line(c)
                vid = n.find(lambda x: x.tag == "video")
                if vid is not None and ws(vid.attrs.get("aria-label", "")).strip() == ws(c.text()).strip():
                    continue
                if text:
                    out.append(f"*{text}*" if "*" not in text else text)
            else:
                out.extend(self.block(c) if (c.tag in TRUE_BLOCK or c.tag in CONTAINER or has_block(c)) else
                           [x for x in [self.line(c)] if x])
        return out

    def video(self, n):
        src = n.attrs.get("src") or next((s.attrs.get("src") for s in n.children if isinstance(s, Node) and s.tag == "source"), "")
        label = ws(n.attrs.get("aria-label") or n.attrs.get("title") or "Video").strip()
        return f"[Video: {esc_text(label)}]({absolute(src, self.page)})" if src else ""

    def form(self, n):
        out = []
        fields = []
        action = n.attrs.get("action", "")
        for c in n.iter():
            if skipped(c):
                continue
            if c.tag in ("h1", "h2", "h3", "h4") and not out:
                out.extend(self.block(c))
            elif c.tag == "fieldset":
                legend = c.find(lambda x: x.tag == "legend")
                opts = [self.line(l) for l in c.find_all(lambda x: x.tag == "label")]
                fields.append(f"- {self.line(legend) if legend else 'Choice'}: one of " + "; ".join(o for o in opts if o))
            elif c.tag == "label" and c.attrs.get("for"):
                ctrl = n.find(lambda x: x.attrs.get("id") == c.attrs["for"])
                req = " (required)" if ctrl is not None and "required" in ctrl.attrs else ""
                fields.append(f"- {self.line(c)}{req}")
        if fields:
            out.append("Form fields:\n" + "\n".join(fields))
        for p in n.find_all(lambda x: x.tag == "p" and "note" in x.cls()):
            text = self.line(p)
            if text:
                out.append(text)
        return out


# ---------------------------------------------------------------- site data from js/main.js
def read_main_js():
    js = (ROOT / "js/main.js").read_text(encoding="utf-8")
    js_nc = re.sub(r"/\*.*?\*/", "", js, flags=re.S)                       # /* block comments */
    js_nc = re.sub(r"(^|[\s,\[{(;])//[^\n]*", r"\1", js_nc, flags=re.M)     # // comments (not https://)

    def const_str(name):
        m = re.search(rf'const {name} = "([^"]+)";', js_nc)
        if not m:
            sys.exit(f"agent_files: could not find {name} in js/main.js")
        return m.group(1)

    def block(name, open_ch, close_ch):
        m = re.search(rf"const {name} = {re.escape(open_ch)}(.*?)\n{re.escape(close_ch)};", js_nc, re.S) or \
            re.search(rf"const {name} = {re.escape(open_ch)}(.*?){re.escape(close_ch)};", js_nc, re.S)
        if not m:
            sys.exit(f"agent_files: could not find {name} in js/main.js")
        return m.group(1)

    season = block("SEASON", "{", "}")
    kickoff = re.search(r'kickoff:\s*"(\d{4}-\d{2}-\d{2})"', season)
    events_src = re.search(r"events:\s*\[(.*?)\]", season, re.S)
    events = []
    for obj in re.findall(r"\{[^{}]*\}", events_src.group(1) if events_src else ""):
        name = re.search(r"""name:\s*(["'])(.+?)\1""", obj)
        when = re.search(r"""date:\s*(["'])(\d{4}-\d{2}-\d{2})\1""", obj)
        if not name or not when:
            sys.exit(f"agent_files: a SEASON event in js/main.js needs a name and a YYYY-MM-DD date: {obj.strip()}")
        events.append((name.group(2), when.group(2)))
    if not kickoff:
        sys.exit("agent_files: SEASON.kickoff not found in js/main.js")
    def array(name):
        m = re.search(rf"const {name} = \[([^\[\]]*)\];", js_nc)
        if not m:
            sys.exit(f"agent_files: could not find {name} in js/main.js")
        return m.group(1)

    sponsor_objs = re.findall(r"\{[^{}]*\}", array("SPONSORS"))
    sponsors = [re.search(r'name:\s*"([^"]+)"', o).group(1) for o in sponsor_objs if re.search(r'name:\s*"', o)]
    sponsor_urls = {re.search(r'name:\s*"([^"]+)"', o).group(1): re.search(r'url:\s*"([^"]+)"', o).group(1)
                    for o in sponsor_objs if re.search(r'name:\s*"', o) and re.search(r'url:\s*"', o)}
    supporters = re.findall(r'"([^"]+)"', array("SUPPORTERS"))
    nav = re.findall(r'label:\s*"([^"]+)",\s*href:\s*"([^"]+)"', array("NAV"))
    return {
        "kickoff": kickoff.group(1), "events": [{"name": n, "date": d} for n, d in events],
        "sponsors": sponsors, "sponsor_urls": sponsor_urls, "supporters": supporters, "nav": nav,
        "team_email": const_str("TEAM_EMAIL"), "sponsor_email": const_str("SPONSOR_EMAIL"),
        "instagram": const_str("INSTAGRAM"),
    }


def long_date(iso):
    d = date.fromisoformat(iso)
    return f"{d:%A}, {d:%B} {d.day}, {d.year}"


def and_list(names):
    return names[0] if len(names) == 1 else ", ".join(names[:-1]) + " and " + names[-1]


# ---------------------------------------------------------------- per page
def page_url(path):
    return BASE if path == "index.html" else BASE + path


def md_url(path):
    return BASE + path + ".md"


def head_meta(root):
    title = root.find(lambda n: n.tag == "title")
    desc = root.find(lambda n: n.tag == "meta" and n.attrs.get("name") == "description")
    return ws(title.text()).strip() if title else "", ws(desc.attrs.get("content", "")).strip() if desc else ""


def org_node(site, full):
    node = {"@type": "Organization", "@id": BASE + "#organization", "name": ORG["name"], "url": BASE}
    if not full:
        return node
    node.update({
        "alternateName": ORG["alternateName"],
        "description": ORG["description"],
        "logo": {"@type": "ImageObject", "url": BASE + ORG["logo"]["path"], "width": ORG["logo"]["width"],
                 "height": ORG["logo"]["height"]},
        "image": BASE + ORG["logo"]["path"],
        "email": site["team_email"],
        "foundingDate": ORG["foundingDate"],
        "address": {"@type": "PostalAddress", "addressLocality": ORG["locality"], "addressRegion": ORG["region"],
                    "addressCountry": ORG["country"]},
        "identifier": {"@type": "PropertyValue", "propertyID": "FIRST Tech Challenge team number", "value": ORG["teamNumber"]},
        "contactPoint": [
            {"@type": "ContactPoint", "contactType": "general", "email": site["team_email"], "availableLanguage": "en",
             "url": BASE + "contact.html"},
            {"@type": "ContactPoint", "contactType": "sponsorship", "name": ORG["sponsorContact"],
             "email": site["sponsor_email"], "availableLanguage": "en", "url": BASE + "partners.html"},
        ],
        "parentOrganization": {"@type": "Organization", "name": ORG["parent"]},
        "memberOf": {"@type": "ProgramMembership", "programName": "FIRST Tech Challenge",
                     "url": "https://www.firstinspires.org/programs/ftc/",
                     "hostingOrganization": {"@type": "Organization", "name": "FIRST", "url": "https://www.firstinspires.org/"}},
        "sameAs": site["same_as"],
    })
    return node


def jsonld(page, title, desc, site, root):
    url = page_url(page["path"])
    website = {"@type": "WebSite", "@id": BASE + "#website", "url": BASE, "name": ORG["name"], "inLanguage": "en-US",
               "publisher": {"@id": BASE + "#organization"}}
    webpage = {"@type": page["kind"], "@id": url + "#webpage", "url": url, "name": title, "description": desc,
               "inLanguage": "en-US", "isPartOf": {"@id": BASE + "#website"}, "about": {"@id": BASE + "#organization"},
               "publisher": {"@id": BASE + "#organization"}}
    graph = [org_node(site, page["path"] in ("index.html", "contact.html", "team.html")), website if page["path"] == "index.html"
             else {"@type": "WebSite", "@id": BASE + "#website", "url": BASE, "name": ORG["name"]}, webpage]
    if page["path"] != "index.html":
        trail = [("Home", BASE)]
        if page.get("parent"):
            parent = next(p for p in PAGES if p["path"] == page["parent"])
            trail.append((parent["name"], page_url(parent["path"])))
        trail.append((page["name"], url))
        crumbs = {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(trail)]}
        webpage["breadcrumb"] = {"@id": url + "#breadcrumb"}
        graph.append(crumbs)
    if page["path"] == "news.html":
        posts = []
        for art in root.find_all(lambda n: n.tag == "article" and "post" in n.cls()):
            h = art.find(lambda n: n.tag == "h2")
            t = art.find(lambda n: n.tag == "time")
            lead = art.find(lambda n: n.tag == "p" and "post-lead" in n.cls())
            img = art.find(lambda n: n.tag == "img")
            vid = art.find(lambda n: n.tag == "video")
            pid = art.attrs.get("id", "")
            if not pid:
                sys.exit(f"agent_files: every <article class=\"post\"> in {page['path']} needs an id (see the comment above the posts)")
            if vid is not None and not vid.attrs.get("poster"):
                sys.exit(f"agent_files: the video in post #{pid} needs a poster image")
            post = {"@type": "BlogPosting", "@id": f"{url}#{pid}", "url": f"{url}#{pid}",
                    "headline": ws(h.text()).strip() if h else "", "isPartOf": {"@id": url + "#webpage"},
                    "author": {"@id": BASE + "#organization"}, "publisher": {"@id": BASE + "#organization"},
                    "inLanguage": "en-US"}
            if t is not None and t.attrs.get("datetime"):
                post["datePublished"] = t.attrs["datetime"]
            if lead is not None:
                post["description"] = ws(lead.text()).strip()
            if img is not None:
                post["image"] = absolute(img.attrs.get("src", ""), page["path"])
            elif vid is not None and vid.attrs.get("poster"):
                post["image"] = absolute(vid.attrs["poster"], page["path"])
            if vid is not None:
                src = vid.attrs.get("src") or next((s.attrs.get("src") for s in vid.children if isinstance(s, Node) and s.tag == "source"), "")
                post["video"] = {"@type": "VideoObject", "name": post["headline"], "contentUrl": absolute(src, page["path"]),
                                 "thumbnailUrl": absolute(vid.attrs.get("poster", ""), page["path"]),
                                 "description": ws(vid.attrs.get("aria-label", "")).strip() or post["headline"]}
                if post.get("datePublished"):
                    post["video"]["uploadDate"] = post["datePublished"]
            posts.append(post)
        if posts:
            webpage["hasPart"] = [{"@id": p["@id"]} for p in posts]
            graph.extend(posts)
    data = {"@context": "https://schema.org", "@graph": graph}
    return json.dumps(data, ensure_ascii=False, indent=2).replace("</", "<\\/")


def head_block(page, title, desc, site, root):
    url = page_url(page["path"])
    ld = jsonld(page, title, desc, site, root).replace("\n", "\n  ")
    return ("<!-- agent:begin: written by tools/agent_files.py (run it after editing this page; don't edit by hand) -->\n"
            f'  <link rel="canonical" href="{url}">\n'
            f'  <link rel="alternate" type="text/markdown" href="{md_url(page["path"])}" title="This page as Markdown">\n'
            f'  <link rel="describedby" type="text/plain" href="{BASE}llms.txt" title="Site guide for AI agents">\n'
            f'  <script type="application/ld+json">\n  {ld}\n  </script>\n'
            "  <!-- agent:end -->")


def footer_md(site):
    names = [f"[{n}]({site['sponsor_urls'][n]})" if n in site["sponsor_urls"] else n for n in site["sponsors"]]
    names += site["supporters"]
    pages = " · ".join(f"[{label}]({page_url(href)})" for label, href in [("Home", "index.html")] + site["nav"])
    return "\n\n".join([
        "* * *",
        f"**{ORG['name']}**, FIRST Tech Challenge team {ORG['teamNumber']} from Weston, MA, founded "
        f"{ORG['foundingDate']}. One of the teams of {ORG['parent']}.",
        f"Sponsors and supporters: {and_list(names)}. [Become a sponsor]({BASE}partners.html)." if names else
        f"[Become a sponsor]({BASE}partners.html).",
        f"Email [{site['team_email']}](mailto:{site['team_email']}) · Sponsorship [{site['sponsor_email']}](mailto:{site['sponsor_email']}) · "
        f"[Instagram @gnce\\_mercury]({site['instagram']}) · [Join the team]({BASE}contact.html?topic=join#contact-form)",
        f"Pages: {pages}",
        f"[About]({BASE}team.html#about) · [Contact]({BASE}contact.html) · [Terms and privacy]({BASE}terms.html)",
    ])


def convert(page, site):
    src = (ROOT / page["path"]).read_text(encoding="utf-8")
    root = parse(src)
    title, desc = head_meta(root)
    main = root.find(lambda n: n.tag == "main")
    if main is None:
        sys.exit(f"agent_files: {page['path']} has no <main>")

    def calendar(_node):
        pts = [("Season kickoff", site["kickoff"])] + [(e["name"], e["date"]) for e in site["events"]]
        return ["Season calendar, oldest first, in Massachusetts (Eastern) time. The next event is the first date "
                "that hasn't passed yet.",
                "\n".join(f"- {long_date(d)}: {esc_text(n)}" for n, d in pts)]

    conv = Converter(page["path"], {"data-calendar": calendar})
    body = "\n\n".join(b for b in conv.blocks(main) if b.strip())
    body = re.sub(r"\n{3,}", "\n\n", body)
    front = "\n".join(["---", f"title: {json.dumps(title, ensure_ascii=False)}",
                       f"description: {json.dumps(desc, ensure_ascii=False)}", f"url: {page_url(page['path'])}", "---"])
    md = f"{front}\n\n{body}\n\n{footer_md(site)}\n"
    return src, root, title, desc, md


# ---------------------------------------------------------------- site files
def lastmod(path):
    try:
        dirty = subprocess.run(["git", "status", "--porcelain", "--", path], cwd=ROOT, capture_output=True, text=True,
                               encoding="utf-8")
        if dirty.returncode == 0 and dirty.stdout.strip():
            return date.today().isoformat()
        out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", path], cwd=ROOT, capture_output=True, text=True,
                             encoding="utf-8")
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip()
    except OSError:
        pass
    return date.fromtimestamp((ROOT / path).stat().st_mtime).isoformat()


def sitemap(pages):
    rows = []
    for p in pages:
        rows.append(f"  <url>\n    <loc>{html.escape(page_url(p['path']))}</loc>\n    <lastmod>{lastmod(p['path'])}</lastmod>\n  </url>")
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + "\n".join(rows) + "\n</urlset>\n")


def llms_txt(infos, site):
    def item(info):
        return f"- [{info['title']}]({md_url(info['path'])}): {info['description']}"
    core = [i for i in infos if i["path"] in ("index.html", "team.html", "partners.html", "contact.html", "news.html")]
    seasons = [i for i in infos if i["path"].startswith("seasons")]
    more = [i for i in infos if i not in core and i not in seasons and i["path"] != "terms.html"]
    names = site["sponsors"] + site["supporters"]
    lines = [
        f"# {ORG['name']}",
        "",
        f"> {ORG['name']} is FIRST Tech Challenge (FTC) team {ORG['teamNumber']}, a high school robotics team in Weston, "
        f"Massachusetts, founded in {ORG['foundingDate']}. We build a new competition robot every season and coach younger "
        "students in FIRST LEGO League.",
        "",
        "Every page is also available as Markdown: add `.md` to a page's `.html` address (for example "
        f"{md_url('team.html')}; the home page is {md_url('index.html')}), or request any page with the header "
        f"`Accept: text/markdown`. Read-only tools for agents: the MCP server at <{BASE}mcp> (server card: "
        f"<{BASE}.well-known/mcp/server-card.json>), and WebMCP tools registered on every page.",
        "",
        f"- General questions and joining the team: {site['team_email']}",
        f"- Sponsorship: {site['sponsor_email']} ({ORG['sponsorContact']})",
        f"- Instagram: {site['instagram']}",
    ]
    if names:
        lines.append(f"- Sponsors and supporters: {and_list(names)}")
    lines += ["", "## Main pages", ""] + [item(i) for i in core]
    lines += ["", "## Seasons and robots", ""] + [item(i) for i in seasons]
    lines += ["", "## More", ""] + [item(i) for i in more]
    lines += ["", "## Optional", "",
              f"- [Sponsorship package, 2026–27 (PDF)]({BASE}docs/GNCE-Mercury-Sponsorship-Package-2026-27.pdf): tiers, budget and contacts",
              f"- [Terms and privacy]({md_url('terms.html')}): how the site and its content may be used",
              f"- [Whole site in one file]({BASE}llms-full.txt): every page above as Markdown",
              f"- [Sitemap]({BASE}sitemap.xml)"]
    return "\n".join(lines) + "\n"


def llms_full(infos):
    parts = [f"# {ORG['name']}: the whole site as Markdown\n\nSource: {BASE} (one section per page, in site order).\n"]
    for i in infos:
        body = re.sub(r"\A---\n.*?\n---\n\n", "", i["md"], flags=re.S)
        body = body.split("\n* * *\n")[0].rstrip() if i["path"] != "index.html" else body.rstrip()
        parts.append(f"<!-- page: {page_url(i['path'])} -->\n\n{body}\n")
    return "\n\n".join(parts)


def pages_json(infos, site):
    return json.dumps({
        "site": BASE,
        "organization": {
            "name": ORG["name"], "teamNumber": ORG["teamNumber"], "program": "FIRST Tech Challenge",
            "description": ORG["description"], "founded": ORG["foundingDate"],
            "location": f"{ORG['locality']}, {ORG['region']}, {ORG['country']}", "parentOrganization": ORG["parent"],
            "email": site["team_email"], "sponsorshipEmail": site["sponsor_email"], "sponsorshipContact": ORG["sponsorContact"],
            "instagram": site["instagram"], "sameAs": site["same_as"], "website": BASE,
            "sponsorsAndSupporters": site["sponsors"] + site["supporters"],
        },
        "season": {"kickoff": site["kickoff"], "events": site["events"], "timeZone": "America/New_York"},
        "pages": [{"slug": i["path"][:-5], "title": i["title"], "description": i["description"], "url": page_url(i["path"]),
                   "markdownUrl": md_url(i["path"]), "markdownFile": i["path"] + ".md"} for i in infos],
    }, ensure_ascii=False, indent=2) + "\n"


def server_card(pages_json_text):
    """The MCP server card, as mcp.php builds it (php mcp.php --card), saved for hosts without PHP."""
    import shutil
    import tempfile
    php = shutil.which("php")
    if not php:
        print("agent_files: php not found, so .well-known/mcp/server-card.json was left as it is "
              "(it only matters if mcp.php's tools changed)")
        return None
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        (tmp / "agent").mkdir()
        (tmp / "agent/pages.json").write_text(pages_json_text, encoding="utf-8")
        (tmp / "mcp.php").write_text((ROOT / "mcp.php").read_text(encoding="utf-8"), encoding="utf-8")
        out = subprocess.run([php, str(tmp / "mcp.php"), "--card"], capture_output=True, text=True, encoding="utf-8")
    if out.returncode != 0 or not out.stdout.startswith("{"):
        sys.exit("agent_files: php mcp.php --card failed:\n" + out.stdout + out.stderr)
    return out.stdout


def main():
    check = "--check" in sys.argv
    site = read_main_js()
    site["same_as"] = [site["instagram"]] + EXTRA_SAME_AS

    listed = {p["path"] for p in PAGES}
    skip_dirs = {"tools", "docs", "node_modules", "agent"}
    found = {p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*.html")
             if not any(part.startswith(".") or part in skip_dirs for part in p.relative_to(ROOT).parts[:-1])}
    if found - listed:
        sys.exit("agent_files: add these pages to PAGES in tools/agent_files.py: " + ", ".join(sorted(found - listed)))
    if listed - found:
        sys.exit("agent_files: these pages in PAGES don't exist: " + ", ".join(sorted(listed - found)))

    writes = {}
    infos = []
    marker = re.compile(r"<!-- agent:begin.*?<!-- agent:end -->", re.S)
    for page in PAGES:
        src, root, title, desc, md = convert(page, site)
        block = head_block(page, title, desc, site, root)
        if marker.search(src):
            new_src = marker.sub(lambda _m: block, src, count=1)
        else:
            anchor = re.search(r"\n(\s*)<link rel=\"preload\"|\n(\s*)<link rel=\"stylesheet\"", src)
            if not anchor:
                sys.exit(f"agent_files: {page['path']}: no stylesheet <link> to put the agent block before")
            new_src = src[:anchor.start()] + "\n  " + block + src[anchor.start():]
        writes[page["path"]] = new_src
        writes[page["path"] + ".md"] = md
        infos.append({"path": page["path"], "title": title, "description": desc, "md": md})

    hta = (ROOT / ".htaccess").read_text(encoding="utf-8")
    hblock = "\n".join(
        f'  <Files "{p["path"].rsplit("/", 1)[-1]}">\n'
        f"    Header append Link '<{md_url(p['path'])}>; rel=\"alternate\"; type=\"text/markdown\"'\n"
        "  </Files>" for p in PAGES)
    hmark = re.compile(r"  # agent:begin.*?  # agent:end", re.S)
    if not hmark.search(hta):
        sys.exit("agent_files: .htaccess has no '# agent:begin' / '# agent:end' block")
    writes[".htaccess"] = hmark.sub(lambda _m: "  # agent:begin: each page points to its Markdown version\n" + hblock + "\n  # agent:end", hta, count=1)

    writes["llms.txt"] = llms_txt(infos, site)
    writes["llms-full.txt"] = llms_full(infos)
    writes["sitemap.xml"] = sitemap(PAGES)
    writes["agent/pages.json"] = pages_json(infos, site)
    card = server_card(writes["agent/pages.json"])
    if card is not None:
        writes[".well-known/mcp/server-card.json"] = card

    stale = []
    for rel, content in writes.items():
        path = ROOT / rel
        old = path.read_text(encoding="utf-8") if path.exists() else None
        if rel == "sitemap.xml" and old is not None:
            # dates alone don't make the sitemap stale for --check
            same = re.sub(r"<lastmod>.*?</lastmod>", "", old) == re.sub(r"<lastmod>.*?</lastmod>", "", content)
            if same and check:
                continue
        if old != content:
            stale.append(rel)
            if not check:
                path.parent.mkdir(parents=True, exist_ok=True)
                with open(path, "w", encoding="utf-8", newline="\n") as fh:
                    fh.write(content)
    if check:
        if stale:
            print("agent_files: out of date (run python3 tools/agent_files.py): " + ", ".join(stale))
            sys.exit(1)
        print("agent_files: up to date")
    else:
        print("agent_files: wrote " + (", ".join(stale) if stale else "nothing (already up to date)"))


if __name__ == "__main__":
    main()
