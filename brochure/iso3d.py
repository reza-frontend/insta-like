"""Tiny isometric (pseudo-3D) SVG helper shared by the brochure build scripts."""
import math

C, S = math.cos(math.pi / 6), 0.5

DARK = ("#3d424c", "#262a31", "#16181D")    # top, front(left), side(right)
ORANGE = ("#FFB24D", "#F28C0F", "#C96F05")
STEEL = ("#5a606b", "#3a3f48", "#2a2e36")


class Iso:
    """Collects SVG for one isometric scene and tracks its bounding box."""

    def __init__(self):
        self.parts, self.xs, self.ys = [], [], []

    def p(self, x, y, z):
        sx, sy = (x - y) * C, (x + y) * S - z
        self.xs.append(sx); self.ys.append(sy)
        return sx, sy

    def poly(self, pts, fill, extra=""):
        d = " ".join(f"{a:.1f},{b:.1f}" for a, b in (self.p(*q) for q in pts))
        self.parts.append(f'<polygon points="{d}" fill="{fill}" {extra}/>')

    def box(self, x, y, z, w, d, h, col=DARK):
        top, front, side = col
        self.poly([(x, y, z + h), (x + w, y, z + h), (x + w, y + d, z + h), (x, y + d, z + h)], top)
        self.poly([(x, y + d, z), (x + w, y + d, z), (x + w, y + d, z + h), (x, y + d, z + h)], front)
        self.poly([(x + w, y, z), (x + w, y + d, z), (x + w, y + d, z + h), (x + w, y, z + h)], side)

    def front(self, x, y, z, w, d, h, inner):
        """Draw 2D content on the +y face (u along x, v downward from top)."""
        ox, oy = self.p(x, y + d, z + h)
        self.p(x + w, y + d, z)
        self.parts.append(f'<g transform="matrix({C:.4f} {S} 0 1 {ox:.1f} {oy:.1f})">{inner}</g>')

    def side(self, x, y, z, w, d, h, inner):
        """Draw 2D content on the +x face (u from front edge toward back, v downward)."""
        ox, oy = self.p(x + w, y + d, z + h)
        self.p(x + w, y, z)
        self.parts.append(f'<g transform="matrix({C:.4f} {-S} 0 1 {ox:.1f} {oy:.1f})">{inner}</g>')

    def podium(self, cx, cy, r, h=16):
        """Orange cylinder (iso circle) centred under world point (cx, cy, 0)."""
        sx, sy = (cx - cy) * C, (cx + cy) * S
        rx, ry = r * 1.2247, r * 0.7071
        self.xs += [sx - rx, sx + rx]; self.ys += [sy - ry, sy + ry + h + 18]
        self.parts.insert(0,
            f'<ellipse cx="{sx:.1f}" cy="{sy + h + 10:.1f}" rx="{rx * 1.05:.1f}" ry="{ry * 1.05:.1f}" fill="#16181D" opacity=".18" filter="url(#blur)"/>'
            f'<path d="M{sx - rx:.1f},{sy:.1f} v{h} a{rx:.1f},{ry:.1f} 0 0 0 {2 * rx:.1f},0 v{-h} z" fill="url(#podSide)"/>'
            f'<ellipse cx="{sx:.1f}" cy="{sy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="url(#podTop)"/>'
            f'<ellipse cx="{sx:.1f}" cy="{sy:.1f}" rx="{rx * .82:.1f}" ry="{ry * .82:.1f}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>')

    def svg(self, pad=10, cls=""):
        x0, x1, y0, y1 = min(self.xs) - pad, max(self.xs) + pad, min(self.ys) - pad, max(self.ys) + pad
        return (f'<svg class="{cls}" viewBox="{x0:.0f} {y0:.0f} {x1 - x0:.0f} {y1 - y0:.0f}" aria-hidden="true">'
                + "".join(self.parts) + "</svg>")



PANEL = "#1d2b44"
WALL = ("#FFFFFF", "#F3EEE6", "#DCD4C8")


def _lerp(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def line(iso, a, b, stroke, w=1.2, op=1):
    (x1, y1), (x2, y2) = iso.p(*a), iso.p(*b)
    iso.parts.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="{w}" stroke-opacity="{op}"/>')


def pv_quad(iso, A, B, Cc, D, cols=4, rows=2):
    """Solar module on an arbitrary quad A-B (back edge) / D-C (front edge)."""
    iso.poly([A, B, Cc, D], PANEL, 'stroke="#C9D2DE" stroke-width="1.6" stroke-linejoin="round"')
    for i in range(1, cols):
        t = i / cols
        line(iso, _lerp(A, B, t), _lerp(D, Cc, t), "#F28C0F", .9, .7)
    for j in range(1, rows):
        t = j / rows
        line(iso, _lerp(A, D, t), _lerp(B, Cc, t), "#F28C0F", .9, .7)
    # glare
    g1, g2 = _lerp(A, B, .15), _lerp(A, B, .45)
    iso.poly([g1, g2, _lerp(D, Cc, .25), _lerp(D, Cc, .05)], "#fff", 'opacity=".08"')


def pv_ground(iso, x, y, w, d, zl=8, zh=26, cols=4, rows=2):
    """Tilted ground-mounted module with two legs (back edge high, front edge low)."""
    for lx in (x + 6, x + w - 10):
        iso.box(lx, y + 2, 0, 4, 4, zh - 2, ("#9aa3af", "#7d8592", "#646b77"))
        iso.box(lx, y + d - 6, 0, 4, 4, zl - 1, ("#9aa3af", "#7d8592", "#646b77"))
    pv_quad(iso, (x, y, zh), (x + w, y, zh), (x + w, y + d, zl), (x, y + d, zl), cols, rows)


def house(iso, x, y, W, D, H, R, panels=True, door=True):
    """Gable-roof house; ridge runs along x. Front slope (+y) can carry PV."""
    ym = y + D / 2
    iso.box(x, y, 0, W, D, H, WALL)
    iso.poly([(x, y, H), (x + W, y, H), (x + W, ym, H + R), (x, ym, H + R)], "#9E5703")  # back slope
    o = 4  # eaves overhang
    iso.poly([(x + W, y, H), (x + W, y + D, H), (x + W, ym, H + R)], "#E9E2D7")      # gable
    FA, FB = (x - o, ym, H + R), (x + W + o, ym, H + R)
    FD, FC = (x - o, y + D + o, H - o * .8), (x + W + o, y + D + o, H - o * .8)
    iso.poly([FA, FB, FC, FD], "#C96F05")                                              # front slope
    if panels:
        a, b = _lerp(FA, FD, .12), _lerp(FB, FC, .12)
        c, d = _lerp(FB, FC, .88), _lerp(FA, FD, .88)
        pv_quad(iso, _lerp(a, b, .08), _lerp(a, b, .92), _lerp(d, c, .92), _lerp(d, c, .08), 5, 2)
    if door:
        u = W
        iso.front(x, y, 0, W, D, H,
                  f'<rect x="{u * .14:.0f}" y="{H * .3:.0f}" width="{u * .2:.0f}" height="{H * .28:.0f}" rx="2" fill="#BFE3FA" stroke="#16181D" stroke-width="2"/>'
                  f'<rect x="{u * .62:.0f}" y="{H * .38:.0f}" width="{u * .16:.0f}" height="{H * .62:.0f}" rx="2" fill="#16181D"/>')
        iso.side(x, y, 0, W, D, H,
                 f'<rect x="{D * .3:.0f}" y="{H * .3:.0f}" width="{D * .4:.0f}" height="{H * .28:.0f}" rx="2" fill="#BFE3FA" stroke="#16181D" stroke-width="2"/>')
