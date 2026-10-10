"""Injects isometric 3D renders into fardis-energy-brochure.html (between <!--3d:name--> markers)."""
import pathlib, re
from iso3d import DARK, ORANGE, STEEL, WALL, Iso, house, pv_ground, pv_quad

LEG = ("#9aa3af", "#7d8592", "#646b77")


def roof_pv(iso, x, y, z, w, d, rise=10, cols=4, rows=2):
    """Tilted module on a flat roof at height z."""
    for lx in (x + 4, x + w - 8):
        iso.box(lx, y + 2, z, 3, 3, rise, LEG)
    pv_quad(iso, (x, y, z + rise), (x + w, y, z + rise), (x + w, y + d, z + 2), (x, y + d, z + 2), cols, rows)


def hero():
    iso = Iso()
    house(iso, 0, 0, 120, 90, 62, 34)
    pv_ground(iso, 150, -20, 74, 34, 8, 30)
    iso.box(126, 64, 0, 16, 14, 36, DARK)                       # inverter / battery
    iso.front(126, 64, 0, 16, 14, 36, '<rect x="3" y="5" width="10" height="7" rx="1.5" fill="#F28C0F"/>')
    pv_ground(iso, 150, 30, 74, 34, 8, 30)
    pv_ground(iso, 150, 80, 74, 34, 8, 30)
    iso.podium(110, 50, 165, 20)
    return iso.svg()


def mini_home():
    iso = Iso()
    house(iso, 0, 0, 70, 56, 40, 24)
    iso.podium(35, 28, 72, 10)
    return iso.svg(6)


def mini_garden():
    iso = Iso()
    iso.box(0, 0, 0, 30, 30, 52, STEEL)                          # water tank
    iso.box(0, 0, 52, 30, 30, 4, ORANGE)
    iso.box(42, 4, 0, 18, 16, 16, DARK)                          # pump
    iso.front(42, 4, 0, 18, 16, 16, '<circle cx="9" cy="8" r="4" fill="#F28C0F"/>')
    pv_ground(iso, 10, 46, 64, 30, 6, 26, 4, 2)
    iso.podium(38, 38, 62, 10)
    return iso.svg(6)


def mini_shop():
    iso = Iso()
    W, D, H = 80, 50, 46
    iso.box(0, 0, 0, W, D, H, WALL)
    iso.front(0, 0, 0, W, D, H,
              f'<rect x="8" y="16" width="40" height="22" rx="2" fill="#BFE3FA" stroke="#16181D" stroke-width="2"/>'
              f'<rect x="56" y="14" width="16" height="32" rx="2" fill="#16181D"/>')
    iso.poly([(0, D, H - 6), (W, D, H - 6), (W, D + 14, H - 16), (0, D + 14, H - 16)], "#F28C0F")   # awning
    roof_pv(iso, 8, 6, H, 64, 36, 10, 4, 2)
    iso.podium(40, 30, 66, 10)
    return iso.svg(6)


def mini_factory():
    iso = Iso()
    iso.box(84, -6, 0, 10, 10, 78, STEEL)                       # chimney behind
    iso.box(84, -6, 78, 10, 10, 4, ORANGE)
    W, D, H = 96, 60, 40
    iso.box(0, 0, 0, W, D, H, WALL)
    iso.front(0, 0, 0, W, D, H, "".join(f'<rect x="{8 + i * 22}" y="12" width="14" height="10" rx="1.5" fill="#BFE3FA" stroke="#16181D" stroke-width="1.6"/>' for i in range(4))
              + '<rect x="36" y="26" width="24" height="14" fill="#16181D"/>')
    roof_pv(iso, 4, 4, H, 42, 50, 10, 3, 3)
    roof_pv(iso, 50, 4, H, 42, 50, 10, 3, 3)
    iso.podium(48, 30, 78, 10)
    return iso.svg(6)


def mini_plant():
    iso = Iso()
    for row in range(3):
        for col in range(2):
            pv_ground(iso, col * 62, row * 40, 56, 30, 6, 24, 4, 2)
    iso.box(130, 40, 0, 18, 22, 26, ORANGE)                     # substation / transformer
    iso.box(132, 42, 26, 14, 18, 4, DARK)
    iso.podium(70, 60, 110, 12)
    return iso.svg(6)


SCENES = {"hero": hero, "home": mini_home, "garden": mini_garden, "shop": mini_shop,
          "factory": mini_factory, "plant": mini_plant}

path = pathlib.Path(__file__).with_name("fardis-energy-brochure.html")
html = path.read_text()
for name, fn in SCENES.items():
    html, n = re.subn(rf"(<!--3d:{name}-->).*?(<!--/3d:{name}-->)", lambda m, svg=fn(): m.group(1) + svg + m.group(2), html, flags=re.S)
    assert n == 1, name
path.write_text(html)
