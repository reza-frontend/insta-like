"""Shared 'airy nature' building blocks for the Fardis Energy brochures:
landscape SVGs (sky, hills, farm fields, trees, flowers), icons, sprite defs and page helpers."""
import pathlib, random

HERE = pathlib.Path(__file__).parent
CSS = (HERE / "nature.css").read_text()
PHONE = "0915 550 3263"

FLOWER_COLS = ["#FFFFFF", "#FFE9A8", "#F6C27A", "#FFFFFF"]


def flower(x, y, s, col, center="#FFE08A"):
    petals = "".join(
        f'<circle cx="{x + dx * s:.1f}" cy="{y + dy * s:.1f}" r="{s * .62:.1f}" fill="{col}"/>'
        for dx, dy in ((0, -1), (.95, -.31), (.59, .81), (-.59, .81), (-.95, -.31)))
    return petals + f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{s * .5:.1f}" fill="{center if col != "#FFC93C" else "#F28C0F"}"/>'


def stem(x, y, h):
    return (f'<path d="M{x:.1f} {y:.1f} q{-2:.1f} {h / 2:.1f} 0 {h:.1f}" stroke="#5E9E4F" stroke-width="1.6" fill="none"/>'
            f'<path d="M{x:.1f} {y + h * .55:.1f} q6 -3 9 -8 q-7 0 -9 8z" fill="#7DBE62"/>')


def tree(x, y, s=1.0):
    return (f'<rect x="{x - 2.5 * s:.1f}" y="{y - 14 * s:.1f}" width="{5 * s:.1f}" height="{16 * s:.1f}" rx="2" fill="#9C7149"/>'
            f'<circle cx="{x:.1f}" cy="{y - 24 * s:.1f}" r="{15 * s:.1f}" fill="#6FB25A"/>'
            f'<circle cx="{x - 9 * s:.1f}" cy="{y - 17 * s:.1f}" r="{10 * s:.1f}" fill="#7DBE62"/>'
            f'<circle cx="{x + 9 * s:.1f}" cy="{y - 18 * s:.1f}" r="{11 * s:.1f}" fill="#5E9E4F"/>'
            f'<circle cx="{x - 4 * s:.1f}" cy="{y - 30 * s:.1f}" r="{5 * s:.1f}" fill="#9AD27E" opacity=".8"/>')


def cloud(x, y, s=1.0, op=.95):
    return (f'<g fill="#fff" opacity="{op}"><ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{38 * s:.1f}" ry="{11 * s:.1f}"/>'
            f'<circle cx="{x - 12 * s:.1f}" cy="{y - 8 * s:.1f}" r="{13 * s:.1f}"/><circle cx="{x + 10 * s:.1f}" cy="{y - 12 * s:.1f}" r="{17 * s:.1f}"/></g>')


def bird(x, y, s=1.0):
    return f'<path d="M{x} {y} q{5 * s} {-5 * s} {10 * s} 0 q{5 * s} {-5 * s} {10 * s} 0" fill="none" stroke="#5B6B60" stroke-width="1.4" stroke-linecap="round"/>'


def landscape(seed=1, fields=True, trees=True, flowers=40, h=260, with_river=False):
    """Wide (800 x h) layered landscape; meant to sit at the bottom of a page (slice)."""
    rnd = random.Random(seed)
    W = 800
    out = [f'<svg class="land" viewBox="0 0 {W} {h}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">']
    out.append('<defs><linearGradient id="fieldG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E3A1"/><stop offset="1" stop-color="#EBCB72"/></linearGradient>'
               f'<clipPath id="fieldClip{seed}"><path d="M300 {h * .42:.0f} C420 {h * .30:.0f} 600 {h * .30:.0f} 800 {h * .40:.0f} V{h} H300Z"/></clipPath></defs>')
    out.append(f'<path d="M0 {h * .45:.0f} C150 {h * .25:.0f} 300 {h * .38:.0f} 420 {h * .33:.0f} S700 {h * .22:.0f} 800 {h * .36:.0f} V{h} H0Z" fill="#D6EDC8"/>')
    if fields:
        out.append(f'<g clip-path="url(#fieldClip{seed})"><rect x="300" y="0" width="500" height="{h}" fill="url(#fieldG)"/>')
        for i in range(-10, 30):
            x = 300 + i * 26
            out.append(f'<path d="M{x} {h} L{x + 160} {h * .3:.0f}" stroke="#D9B65A" stroke-width="5" opacity=".55"/>')
        out.append("</g>")
    out.append(f'<path d="M0 {h * .62:.0f} C120 {h * .50:.0f} 260 {h * .58:.0f} 380 {h * .55:.0f} S620 {h * .46:.0f} 800 {h * .58:.0f} V{h} H0Z" fill="#A9D88E"/>')
    if trees:
        for tx, ts in ((70, .9), (110, .65), (690, .8), (735, 1.0), (250, .55)):
            out.append(tree(tx, h * .6 + rnd.uniform(-4, 6), ts))
    if fields:  # green crop rows in the mid field
        for i in range(9):
            y = h * .66 + i * 7
            out.append(f'<path d="M{430 + i * 8} {y:.0f} H{800}" stroke="#8CC56E" stroke-width="3" opacity=".6"/>')
    out.append(f'<path d="M0 {h * .78:.0f} C160 {h * .70:.0f} 330 {h * .80:.0f} 480 {h * .74:.0f} S700 {h * .70:.0f} 800 {h * .76:.0f} V{h} H0Z" fill="#86C46A"/>')
    if with_river:
        out.append(river([(250, h * .56, 6), (300, h * .62, 14), (240, h * .70, 26), (330, h * .82, 46), (470, h * .93, 72), (560, h + 30, 110)],
                         f"l{seed}", 6))
        out.append(reeds(205, h * .86, 1.1) + reeds(420, h * .78, .9) + reeds(640, h * .96, 1.2))
    for _ in range(flowers):
        x, y = rnd.uniform(8, W - 8), rnd.uniform(h * .82, h - 6)
        if with_river and 280 < x < 640 and y > h * .8:   # keep the river clear
            continue
        s = rnd.uniform(2.2, 3.6)
        out.append(stem(x, y, rnd.uniform(6, 12)) + flower(x, y, s, rnd.choice(FLOWER_COLS)))
    out.append("</svg>")
    return "".join(out)


def _catmull(pts, steps=14):
    """Catmull-Rom through (x, y, w) points -> dense list of (x, y, w)."""
    P = [pts[0]] + pts + [pts[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(steps):
            t = k / steps
            out.append(tuple(.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t * t
                                   + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t ** 3) for j in range(3)))
    out.append(pts[-1])
    return out


def river(pts, uid, drop=4.0, ripples=True):
    """Winding river from far (first point, narrow) to near (last point, wide) with a raised bank for depth."""
    import math
    d = _catmull(pts)
    left, right = [], []
    for i, (x, y, w) in enumerate(d):
        a, b = d[max(i - 1, 0)], d[min(i + 1, len(d) - 1)]
        tx, ty = b[0] - a[0], b[1] - a[1]
        n = math.hypot(tx, ty) or 1
        nx, ny = -ty / n, tx / n
        left.append((x + nx * w / 2, y + ny * w / 2)); right.append((x - nx * w / 2, y - ny * w / 2))
    poly = left + right[::-1]
    pts_s = " ".join(f"{x:.1f},{y:.1f}" for x, y in poly)
    (fx, fy, _), (lx, ly, _) = pts[0], pts[-1]
    g = (f'<defs><linearGradient id="rv{uid}" gradientUnits="userSpaceOnUse" x1="{fx}" y1="{fy}" x2="{lx}" y2="{ly}">'
         '<stop offset="0" stop-color="#D4EEF9"/><stop offset=".45" stop-color="#8FCDEB"/><stop offset="1" stop-color="#4C9FD0"/></linearGradient></defs>')
    out = [g,
           f'<polygon points="{pts_s}" fill="#6E9E58" transform="translate(0 {drop})"/>',          # bank side (depth)
           f'<polygon points="{pts_s}" fill="#8A6A48" transform="translate(0 {drop * .45:.1f})"/>',  # wet earth edge
           f'<polygon points="{pts_s}" fill="url(#rv{uid})"/>']
    # light rim on the far bank
    out.append('<polyline points="' + " ".join(f"{x:.1f},{y:.1f}" for x, y in left) + '" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.1"/>')
    if ripples:
        for i in range(6, len(d) - 3, 7):
            x, y, w = d[i]
            a, b = d[i - 2], d[i + 2]
            tx, ty = b[0] - a[0], b[1] - a[1]
            n = math.hypot(tx, ty) or 1
            L = w * .32
            for off in (-.18, .2):
                cx = x + (-ty / n) * w * off
                cy = y + (tx / n) * w * off
                out.append(f'<path d="M{cx - tx / n * L:.1f} {cy - ty / n * L:.1f} q{tx / n * L:.1f} {-w * .06:.1f} {2 * tx / n * L:.1f} {2 * ty / n * L:.1f}" '
                           f'fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="{max(.6, w * .03):.1f}" stroke-linecap="round"/>')
    return "".join(out)


def reeds(x, y, s=1.0):
    return "".join(f'<path d="M{x + i * 2.4 * s:.1f} {y:.1f} q{(i - 1.5) * 1.5 * s:.1f} {-6 * s:.1f} {(i - 1.5) * 2.5 * s:.1f} {-(9 + (i % 2) * 4) * s:.1f}" '
                   f'stroke="#5E9E4F" stroke-width="{1.3 * s:.1f}" fill="none" stroke-linecap="round"/>' for i in range(4))


def meadow(seed=3):
    """Footer strip: soft hills and a few trees."""
    out = ['<svg class="meadow" viewBox="0 0 800 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true">',
           '<path d="M0 52 C140 34 300 56 420 44 S680 30 800 46 V100 H0Z" fill="#DDEFD2"/>',
           tree(60, 58, .75), tree(95, 62, .5), tree(745, 56, .7),
           '<path d="M0 70 C180 58 330 74 500 64 S720 58 800 66 V100 H0Z" fill="#A9D88E"/>',]
    out.append("</svg>")
    return "".join(out)


def sky_deco(seed=5):
    rnd = random.Random(seed)
    parts = [cloud(rnd.uniform(80, 720), rnd.uniform(40, 150), rnd.uniform(.6, 1.1), rnd.uniform(.7, .95)) for _ in range(4)]
    return '<svg class="skydeco" viewBox="0 0 800 260" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' + "".join(parts) + "</svg>"


SUN = ('<svg class="sun" viewBox="0 0 200 200" aria-hidden="true"><defs>'
       '<radialGradient id="sunGlow"><stop offset="0" stop-color="#FFE7B0" stop-opacity=".9"/><stop offset="1" stop-color="#FFE7B0" stop-opacity="0"/></radialGradient>'
       '<radialGradient id="sunBall" cx="40%" cy="38%" r="65%"><stop offset="0" stop-color="#FFE2A3"/><stop offset=".5" stop-color="#FFB547"/><stop offset="1" stop-color="#F28C0F"/></radialGradient></defs>'
       '<circle cx="100" cy="100" r="100" fill="url(#sunGlow)"/><circle cx="100" cy="100" r="40" fill="url(#sunBall)"/>'
       '<g stroke="#FFB547" stroke-width="3" stroke-linecap="round" opacity=".8">'
       + "".join(f'<path d="M100 44 V30" transform="rotate({a} 100 100)"/>' for a in range(0, 360, 30))
       + "</g></svg>")

DEFS = """<svg width="0" height="0" style="position:absolute"><defs>
  <linearGradient id="islTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C4E8A8"/><stop offset="1" stop-color="#86C46A"/></linearGradient>
  <linearGradient id="islSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C99B6D"/><stop offset=".6" stop-color="#AD7F52"/><stop offset="1" stop-color="#8E6640"/></linearGradient>
  <filter id="blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  <symbol id="logo" viewBox="0 0 48 48">
    <circle cx="24" cy="20" r="9" fill="#F28C0F"/>
    <g stroke="#F28C0F" stroke-width="3" stroke-linecap="round"><path d="M24 3v4M24 33v4M7 20h4M37 20h4M12 8l3 3M33 29l3 3M36 8l-3 3M15 29l-3 3"/></g>
    <path d="M6 44 L14 34 H34 L42 44 Z" fill="#2F5D3A"/>
    <path d="M17.5 34 L15 44 M24 34 V44 M30.5 34 L33 44 M10 39 H38" stroke="#E9F5E1" stroke-width="1.4"/>
  </symbol>
  <symbol id="leaf" viewBox="0 0 24 24"><path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z" fill="#7DBE62"/><path d="M5 19C9 14 12 11 16 8" stroke="#fff" stroke-width="1.4" fill="none"/></symbol>
</defs></svg>"""

ICONS = dict(
    home='<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    work='<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3"/>',
    car='<path d="M3 16h18l-2-7H5z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    tent='<path d="M12 3L2 21h20z"/><path d="M12 3v18M9 21l3-6 3 6"/>',
    shield='<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>',
    truck='<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    phone='<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    msg='<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    web='<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    pin='<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    gear='<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    fridge='<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M6 9h12M9 5v2M9 12v3"/>',
    bulb='<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    wifi='<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
    tv='<rect x="2" y="5" width="20" height="13" rx="2"/><path d="M8 21h8"/>',
    laptop='<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
    mobile='<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    pos='<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h2"/>',
    fan='<circle cx="12" cy="12" r="2"/><path d="M12 10c0-4 1-7 4-7s2 5-2 7M14 12c4 0 7 1 7 4s-5 2-7-2M12 14c0 4-1 7-4 7s-2-5 2-7M10 12c-4 0-7-1-7-4s5-2 7 2"/>',
    pulse='<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    clock='<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
)


def ico(name, cls=""):
    return f'<span class="ico {cls}"><svg viewBox="0 0 24 24">{ICONS[name]}</svg></span>'


def brand(sub="FARDIS ENERGY"):
    return f'<div class="brand"><svg class="logo-mark"><use href="#logo"/></svg><div class="brand-name">فردیس انرژی<small>{sub}</small></div></div>'


def folio(n, label):
    k = int(n.translate(str.maketrans("۰۱۲۳۴۵۶۷۸۹", "0123456789")))
    corner = f'<svg class="corner" viewBox="0 0 300 120" aria-hidden="true">{cloud(70, 70, .9, .9)}{cloud(190, 40, .55, .7)}</svg>'
    return f'{corner}{meadow(k + 7)}<div class="folio"><span><b>فردیس انرژی</b> — {label}</span><span>{n}</span></div>'


def page_html(title, body, extra_css=""):
    return f"""<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800;900&display=swap" rel="stylesheet">
<style>
{CSS}
{extra_css}
</style>
</head>
<body>
{DEFS}
{body}
</body>
</html>
"""


def tel_qr():
    """QR (tel: link) — generated once with the `qrcode` npm package; stored next to this file."""
    return (HERE / "qr-tel.svg").read_text().replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg class="qr"')
