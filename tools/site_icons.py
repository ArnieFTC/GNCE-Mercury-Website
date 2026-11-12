#!/usr/bin/env python3
"""Build the site's icons (the picture in a browser tab and next to the site in Google's results) from the
team's logo, images/logo-mark.png.

    python3 tools/site_icons.py            write the three icon files at the top of the site
    python3 tools/site_icons.py --check    exit 1 if a file is missing, is not an opaque square picture of the
                                           sizes named below, or is not what this script makes from the logo

Needs Pillow (pip install pillow). Run it again only if the logo itself changes.

Why the icon is not simply the logo file: Google's rules require a square icon
(developers.google.com/search/docs/appearance/favicon-in-search) and the logo file is 473 x 505, so it did not
qualify; in November 2026 Google's results showed a plain globe beside the site. A browser tab also draws the icon
at 16 pixels (32 on a sharp screen), where the whole logo (Mercury, the staff, the diamond) is a smudge. So the icon
is the logo's clearest part: Mercury's head and winged helmet, on the logo's own purple.

Nothing is redrawn. The icon is one square cut from images/logo-mark.png (HEAD below, 174 x 174 pixels) and scaled
to each size, with a little sharpening at the three smallest. Inside the square, these are filled with the
diamond's purple and nothing else is changed:
  - the top right corner, which lies outside the diamond (the diamond's upper right edge crosses the square);
  - the cut-out's dark fringe along that edge, which on purple would show as a thin dark line;
  - the starry background behind the head (two stars, four dots and two pieces of the orbit band), which at icon
    size reads as specks and scratches.

The files. Keep these three addresses: Google asks for an icon URL that is stable.
    favicon.ico            16, 32 and 48 px, as classic 32-bit bitmaps: browser tabs
    icon-192.png           192 px: the large icon (Android; Google recommends one larger than 48 px)
    apple-touch-icon.png   180 px: the home screen of an iPhone or iPad
Every page names them in its <head>, and so does contact.php's result page.
"""
import functools
import pathlib
import struct
import sys

from PIL import Image, ImageChops, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOGO = ROOT / "images" / "logo-mark.png"
# The square that is cut from the logo, as a crop box in the logo's own pixels (left, top, right, bottom; the right
# and bottom are not included): columns 204-377 and rows 127-300. It holds the head and the winged helmet, with the
# room in front of the face that a profile needs. Its left edge stands just clear of the hand and the staff, and
# its bottom edge just above the shoulders, so it cuts the neck and nothing else of the figure.
HEAD = (204, 127, 378, 301)
PURPLE = (71, 56, 103)                         # the diamond's colour, read from the logo
# The background marks inside the square that are left out: one point in each (in the logo's pixels) and how many
# of the square's pixels the mark covers with its soft edge, as measured on the logo.
LEFT_OUT = {
    "star above the helmet": ((247, 131), 123),
    "star at the left edge": ((215, 202), 305),
    "dot at the top left": ((212, 137), 36),
    "dot near the top": ((267, 145), 28),
    "dot at the right": ((364, 228), 49),
    "dot in the bottom right corner": ((376, 300), 11),
    "orbit band, its tip at the right edge": ((376, 200), 112),
    "orbit band, the streak at the lower right": ((352, 273), 443),
}
SHARPEN = {16: 60, 32: 60, 48: 40}             # per cent of unsharp mask at the small sizes; none above
FILES = {"favicon.ico": (16, 32, 48), "icon-192.png": (192,), "apple-touch-icon.png": (180,)}


def off_purple(pixel):
    """How far a pixel of the logo is from the diamond's purple (0 for a pixel outside the logo)."""
    return sum(abs(a - b) for a, b in zip(pixel[:3], PURPLE)) if pixel[3] >= 128 else 0


def mark(px, name):
    """The square's pixels that belong to one background mark: the star, dot or band and its soft edge."""
    seed, size = LEFT_OUT[name]
    left, top, right, bottom = HEAD
    assert off_purple(px[seed]) > 60, f"no {name} at {seed}: the logo changed, measure LEFT_OUT again"
    todo, found = [seed], {seed}
    while todo:
        x, y = todo.pop()
        for nx in (x - 1, x, x + 1):
            for ny in (y - 1, y, y + 1):
                if (nx, ny) not in found and left <= nx < right and top <= ny < bottom and off_purple(px[nx, ny]) > 12:
                    found.add((nx, ny))
                    todo.append((nx, ny))
        # more than the mark's own size means it has run into the figure
        assert len(found) <= size + max(30, size // 4), f"the {name} joins something larger: measure LEFT_OUT again"
    return found


@functools.lru_cache(maxsize=None)
def square():
    """The square every icon is scaled from: the head on the logo's purple, with no transparency."""
    logo = Image.open(LOGO).convert("RGBA")
    assert logo.size == (473, 505), f"the logo changed size ({logo.size}): choose the HEAD square again"
    px = logo.load()
    fill = set()
    for name in LEFT_OUT:
        fill |= mark(px, name)
    # The logo file is a cut-out, and along the diamond's edge its pixels still carry the dark background it was
    # cut from. Nothing in the logo is darker than the diamond, so inside the square every pixel that is darker is
    # that fringe (183 of them, all within a few pixels of the edge).
    left, top, right, bottom = HEAD
    for y in range(top, bottom):
        for x in range(left, right):
            r, g, b, a = px[x, y]
            if a and r + g + b < sum(PURPLE) - 24:
                fill.add((x, y))
    for spot in fill:
        px[spot] = PURPLE + (255,)
    ground = Image.new("RGBA", (right - left, bottom - top), PURPLE + (255,))
    ground.alpha_composite(logo.crop(HEAD))
    return ground.convert("RGB")


def icon(size):
    """The icon, `size` pixels square."""
    out = square().resize((size, size), Image.LANCZOS)
    if size in SHARPEN:
        out = out.filter(ImageFilter.UnsharpMask(radius=0.6, percent=SHARPEN[size], threshold=0))
    return out


def ico(pictures):
    """A classic .ico file: for each picture a 32-bit bitmap (rows from the bottom up, in the order blue, green,
    red, alpha), then its 1-bit mask, all zero because every pixel is opaque. Written here rather than by Pillow,
    whose writer leaves the mask out of 32-bit frames while their headers still count it."""
    head = struct.pack("<HHH", 0, 1, len(pictures))
    offset = 6 + 16 * len(pictures)
    entries, frames = b"", b""
    for im in pictures:
        w, h = im.size
        r, g, b, a = im.convert("RGBA").split()
        bgra = Image.merge("RGBA", (b, g, r, a)).tobytes()
        colour = b"".join(bgra[y * w * 4:(y + 1) * w * 4] for y in reversed(range(h)))
        mask = bytes((w + 31) // 32 * 4 * h)
        frame = struct.pack("<IiiHHIIiiII", 40, w, 2 * h, 1, 32, 0, len(colour) + len(mask), 0, 0, 0, 0)
        frame += colour + mask
        entries += struct.pack("<BBBBHHII", w % 256, h % 256, 0, 0, 1, 32, len(frame), offset)
        frames += frame
        offset += len(frame)
    return head + entries + frames


def write():
    for name, sizes in FILES.items():
        path = ROOT / name
        if name.endswith(".ico"):
            path.write_bytes(ico([icon(s) for s in sizes]))
        else:
            icon(sizes[0]).save(path, format="PNG", optimize=True)
        print(f"site_icons: wrote {name} ({', '.join(str(s) for s in sizes)} px, {path.stat().st_size:,} bytes)")


def check():
    bad = 0
    for name, sizes in FILES.items():
        path = ROOT / name
        kind = "ICO" if name.endswith(".ico") else "PNG"
        try:
            im = Image.open(path)
            im.load()
        except Exception as error:  # missing, or not a picture at all
            print(f"site_icons: {name} cannot be read ({error})")
            bad += 1
            continue
        if im.format != kind:
            print(f"site_icons: {name} is a {im.format} file, expected {kind}")
            bad += 1
            continue
        have = sorted(im.info["sizes"]) if kind == "ICO" else [im.size]
        want = [(s, s) for s in sizes]
        if have != want:
            print(f"site_icons: {name} holds {have}, expected {want}")
            bad += 1
            continue
        for s in sizes:
            held = im.ico.getimage((s, s)) if kind == "ICO" else im
            if held.size != (s, s):
                print(f"site_icons: {name} gives a {held.size} picture for {s} px")
                bad += 1
            elif held.convert("RGBA").getextrema()[3][0] < 255:
                print(f"site_icons: {name} at {s} px has transparent pixels")
                bad += 1
            else:
                # a few levels of difference are allowed: another version of Pillow may round a pixel the other way
                step = max(hi for _, hi in ImageChops.difference(held.convert("RGB"), icon(s)).getextrema())
                if step > 3:
                    print(f"site_icons: {name} at {s} px is not what the logo gives now (off by {step} levels): "
                          "run tools/site_icons.py")
                    bad += 1
    print("site_icons: all three icons are there, square, opaque, the right size and made from the logo as it is"
          if not bad else "site_icons: FAILED")
    return bad


if __name__ == "__main__":
    if sys.argv[1:] == ["--check"]:
        sys.exit(1 if check() else 0)
    if sys.argv[1:]:
        sys.exit(__doc__)
    write()
