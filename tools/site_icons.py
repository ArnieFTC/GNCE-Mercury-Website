#!/usr/bin/env python3
"""Build the site's icons (the picture in a browser tab and next to the site in Google's results) from the
team's logo, images/logo-mark.png.

    python3 tools/site_icons.py            write the three icon files at the top of the site
    python3 tools/site_icons.py --check    exit 1 if a file is missing, is not square, is not the size named
                                           below, or is not what this script makes from the logo

Needs Pillow (pip install pillow). Run it again only if the logo itself changes.

Why the icon is not simply the logo file: a browser tab draws the icon at 16 to 32 pixels and Google's results
at about 18, and Google only shows an icon that is square
(developers.google.com/search/docs/appearance/favicon-in-search). The logo file is 473 x 505, which is why
results showed a plain globe until November 2026. At those sizes the whole logo (Mercury, the staff, the diamond)
is a smudge, so the icon is the logo's clearest part: Mercury's head and winged helmet, on the logo's own purple.

Nothing is redrawn. The icon is one square cut from images/logo-mark.png and scaled down, with a little
sharpening at the three smallest sizes. Three things in that square are filled with the diamond's purple:
  - its top right corner, which lies outside the diamond (the diamond's upper right edge crosses the square);
  - the cut-out's dark fringe along that edge, which on purple would show as a thin dark line;
  - three small marks of the starry background that the square's edge would cut in two: the star above the
    helmet, the star at the left edge and the dot in the bottom right corner.

The files. Keep these three addresses: Google asks for an icon URL that does not change.
    favicon.ico            16, 32 and 48 px: what a browser asks for by itself
    icon-192.png           192 px: Google's results, Android
    apple-touch-icon.png   180 px: the home screen of an iPhone or iPad
Every page names them in its <head>, and so does contact.php's result page.
"""
import functools
import pathlib
import sys

from PIL import Image, ImageChops, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOGO = ROOT / "images" / "logo-mark.png"
# The square that is cut from the logo, in the logo's own pixels (left, top, right, bottom): the head and the
# winged helmet, with the room in front of the face that a profile needs. Its left edge stands just clear of the
# hand and the staff, and its bottom edge just above the shoulders, so it cuts the neck and nothing else of the body.
HEAD = (204, 127, 378, 301)
PURPLE = (71, 56, 103)                         # the diamond's colour, read from the logo
# One point inside each background mark that the square's edge would cut in two (in the logo's pixels): the star
# above the helmet, the star at the left edge, the dot in the bottom right corner. They are left out.
LEFT_OUT = ((246, 125), (215, 202), (376, 300))
SHARPEN = {16: 60, 32: 60, 48: 40}             # per cent of unsharp mask at the small sizes; none above
FILES = {"favicon.ico": (16, 32, 48), "icon-192.png": (192,), "apple-touch-icon.png": (180,)}


def off_purple(pixel):
    """How far a pixel of the logo is from the diamond's purple (0 for a pixel outside the logo)."""
    return sum(abs(a - b) for a, b in zip(pixel[:3], PURPLE)) if pixel[3] >= 128 else 0


def mark(px, size, seed):
    """Every pixel of the small mark that `seed` lies in: the star or dot and its soft edge."""
    assert off_purple(px[seed]) > 60, f"there is no mark at {seed}: the logo changed, choose LEFT_OUT again"
    todo, found = [seed], {seed}
    while todo:
        x, y = todo.pop()
        for nx in (x - 1, x, x + 1):
            for ny in (y - 1, y, y + 1):
                if (nx, ny) not in found and 0 <= nx < size[0] and 0 <= ny < size[1] and off_purple(px[nx, ny]) > 12:
                    found.add((nx, ny))
                    todo.append((nx, ny))
        # a star is about 360 pixels with its soft edge; more means it has run into the helmet or the hand
        assert len(found) < 500, f"the mark at {seed} joins something larger: the logo changed, choose LEFT_OUT again"
    return found


@functools.lru_cache(maxsize=None)
def square():
    """The square every icon is scaled from: the head on the logo's purple, with no transparency."""
    logo = Image.open(LOGO).convert("RGBA")
    assert logo.size == (473, 505), f"the logo changed size ({logo.size}): choose the HEAD square again"
    px = logo.load()
    fill = set()
    for seed in LEFT_OUT:
        fill |= mark(px, logo.size, seed)
    # The diamond's upper right edge crosses the square. The logo file is a cut-out, and along that edge its
    # pixels still carry the dark background it was cut from. Nothing in the logo is darker than the diamond, so
    # inside the square every pixel that is darker is that fringe (180 of them, all on the edge).
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


def write():
    for name, sizes in FILES.items():
        path = ROOT / name
        if name.endswith(".ico"):
            frames = [icon(s).convert("RGBA") for s in sizes]
            # the largest first; the others are given as they are, so Pillow does not make its own
            frames[-1].save(path, format="ICO", sizes=[(s, s) for s in sizes], append_images=frames[:-1],
                            bitmap_format="bmp")
        else:
            icon(sizes[0]).save(path, format="PNG", optimize=True)
        print(f"site_icons: wrote {name} ({', '.join(str(s) for s in sizes)} px, {path.stat().st_size:,} bytes)")


def check():
    bad = 0
    for name, sizes in FILES.items():
        path = ROOT / name
        if not path.exists():
            print(f"site_icons: {name} is missing")
            bad += 1
            continue
        im = Image.open(path)
        have = sorted(im.info.get("sizes", {im.size})) if name.endswith(".ico") else [im.size]
        want = [(s, s) for s in sizes]
        if have != want:
            print(f"site_icons: {name} holds {have}, expected {want}")
            bad += 1
            continue
        for s in sizes:
            held = (im.ico.getimage((s, s)) if name.endswith(".ico") else im).convert("RGB")
            # a few levels of difference are allowed: another version of Pillow may round a pixel the other way
            step = max(hi for _, hi in ImageChops.difference(held, icon(s)).getextrema())
            if step > 3:
                print(f"site_icons: {name} at {s} px is not what the logo gives now (off by {step} levels): "
                      "run tools/site_icons.py")
                bad += 1
    print("site_icons: all three icons are there, square, the right size and made from the logo as it is"
          if not bad else "site_icons: FAILED")
    return bad


if __name__ == "__main__":
    if "--check" in sys.argv[1:]:
        sys.exit(1 if check() else 0)
    write()
