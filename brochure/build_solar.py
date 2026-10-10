"""Builds fardis-energy-brochure.html (solar EPC brochure, airy nature theme)."""
import pathlib
from iso3d import CANOPY, DARK, EARTH, GRASS, ORANGE, STEEL, WALL, WATER, Iso, house, island, pv_ground, pv_quad, shed, vtree, well
from nature import PHONE, SUN, brand, folio, ico, landscape, meadow, page_html, sky_deco, tel_qr

LEG = ("#9aa3af", "#7d8592", "#646b77")
LABEL = "پیشرو در انرژی"


def roof_pv(iso, x, y, z, w, d, rise=10, cols=4, rows=2):
    for lx in (x + 4, x + w - 8):
        iso.box(lx, y + 2, z, 3, 3, rise, LEG)
    pv_quad(iso, (x, y, z + rise), (x + w, y, z + rise), (x + w, y + d, z + 2), (x, y + d, z + 2), cols, rows)


def hero():
    iso = Iso()
    house(iso, 0, 0, 120, 90, 62, 34)
    pv_ground(iso, 150, -20, 74, 34, 8, 30)
    iso.box(126, 64, 0, 16, 14, 36, STEEL)
    iso.front(126, 64, 0, 16, 14, 36, '<rect x="3" y="5" width="10" height="7" rx="1.5" fill="#F28C0F"/>')
    pv_ground(iso, 150, 30, 74, 34, 8, 30)
    pv_ground(iso, 150, 80, 74, 34, 8, 30)
    island(iso, 110, 50, 165, 22, seed=4, flowers=8)
    return iso.svg(cls="hero3d")


def mini(fn, isl, seed):
    iso = Iso()
    fn(iso)
    island(iso, *isl, seed=seed, flowers=4)
    return iso.svg(6, "r3d")


def m_home(iso):
    house(iso, 0, 0, 70, 56, 40, 24)


def m_garden(iso):
    iso.box(0, 0, 0, 30, 30, 52, STEEL)
    iso.box(0, 0, 52, 30, 30, 4, ORANGE)
    iso.box(42, 4, 0, 18, 16, 16, STEEL)
    iso.front(42, 4, 0, 18, 16, 16, '<circle cx="9" cy="8" r="4" fill="#F28C0F"/>')
    pv_ground(iso, 10, 46, 64, 30, 6, 26, 4, 2)


def m_shop(iso):
    W, D, H = 80, 50, 46
    iso.box(0, 0, 0, W, D, H, WALL)
    iso.front(0, 0, 0, W, D, H, '<rect x="8" y="16" width="40" height="22" rx="2" fill="#BFE3FA" stroke="#5B6B60" stroke-width="2"/>'
                                '<rect x="56" y="14" width="16" height="32" rx="2" fill="#5E9E4F"/>')
    iso.poly([(0, D, H - 6), (W, D, H - 6), (W, D + 14, H - 16), (0, D + 14, H - 16)], "#F28C0F")
    roof_pv(iso, 8, 6, H, 64, 36, 10, 4, 2)


def m_factory(iso):
    iso.box(84, -6, 0, 10, 10, 78, STEEL)
    iso.box(84, -6, 78, 10, 10, 4, ORANGE)
    W, D, H = 96, 60, 40
    iso.box(0, 0, 0, W, D, H, WALL)
    iso.front(0, 0, 0, W, D, H, "".join(f'<rect x="{8 + i * 22}" y="12" width="14" height="10" rx="1.5" fill="#BFE3FA" stroke="#5B6B60" stroke-width="1.6"/>' for i in range(4))
              + '<rect x="36" y="26" width="24" height="14" fill="#5B6B60"/>')
    roof_pv(iso, 4, 4, H, 42, 50, 10, 3, 3)
    roof_pv(iso, 50, 4, H, 42, 50, 10, 3, 3)


def m_plant(iso):
    for row in range(3):
        for col in range(2):
            pv_ground(iso, col * 62, row * 40, 56, 30, 6, 24, 4, 2)
    iso.box(130, 40, 0, 18, 22, 26, ORANGE)
    iso.box(132, 42, 26, 14, 18, 4, STEEL)


def diorama():
    """Isometric river valley: PV field on the far bank, floating PV on the river, farmhouse on the near bank, waterfall."""
    iso = Iso()
    TOPSOIL = ("#A6D98A", EARTH[1], EARTH[2])
    L, H = 400, 30

    def bank(y, d):
        iso.box(0, y, 0, L, d, H - 4, EARTH)
        iso.box(0, y, H - 4, L, d, 4, TOPSOIL)

    bank(0, 120)
    iso.dz = H
    for row in range(2):
        for i in range(5):
            pv_ground(iso, 16 + i * 66, 14 + row * 46, 58, 30, 6, 24, 4, 2)
    vtree(iso, 362, 8, 0, 1.1); vtree(iso, 366, 62, 0, .8)
    iso.dz = 0
    iso.box(0, 120, 0, L, 66, 10, EARTH)                       # river bed
    iso.box(0, 120, 10, L, 66, 13, WATER)                      # water
    iso.dz = 23
    for i in range(4):
        for j in range(2):
            x, y = 150 + i * 36, 130 + j * 26
            iso.box(x, y, 0, 30, 20, 2.5, ("#FFFFFF", "#E6EEF2", "#CBD6DC"))
            pv_quad(iso, (x + 2, y + 2, 7), (x + 28, y + 2, 7), (x + 28, y + 18, 3.5), (x + 2, y + 18, 3.5), 3, 1)
    iso.dz = 0
    # ripples on the open water
    for (x, y) in ((40, 140), (90, 165), (60, 175), (120, 135)):
        a, b = iso.p(x, y, 23.2), iso.p(x + 22, y, 23.2)
        iso.parts.append(f'<path d="M{a[0]:.1f} {a[1]:.1f} Q{(a[0] + b[0]) / 2:.1f} {(a[1] + b[1]) / 2 - 3:.1f} {b[0]:.1f} {b[1]:.1f}" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" fill="none"/>')
    bank(186, 92)
    iso.dz = H
    house(iso, 26, 206, 84, 56, 44, 24)
    for (x, y, k) in ((140, 214, 1.0), (172, 240, .8), (232, 206, .9), (286, 236, 1.1), (330, 210, .9), (360, 246, 1.0)):
        vtree(iso, x, y, 0, k)
    iso.dz = 0
    # waterfall over the near edge (+x face) into a pool
    fall = '<defs><linearGradient id="fallG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9F7FD"/><stop offset="1" stop-color="#7CC3E6"/></linearGradient></defs>'
    iso.parts.append(fall)
    iso.poly([(L + .5, 120, 23), (L + .5, 186, 23), (L + .5, 186, 2), (L + .5, 120, 2)], "url(#fallG)")
    for k in range(5):
        y0 = 126 + k * 12
        a, b = iso.p(L + .6, y0, 22), iso.p(L + .6, y0, 4)
        iso.parts.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="#fff" stroke-opacity=".7" stroke-width="1.6"/>')
    iso.box(L, 104, 0, 60, 98, 2, WATER)
    for (y, r) in ((140, 8), (160, 10), (178, 7)):
        cx, cy = iso.p(L + 6, y, 2)
        iso.parts.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{r}" ry="{r * .45:.1f}" fill="#fff" opacity=".85"/>')
    return iso.svg(14, "dio")


def farm_diorama():
    """Farm plot: crop field + irrigation channel, solar array driving a well pump, water tank, PV-roofed shed."""
    iso = Iso()
    L, D, H = 400, 270, 26
    iso.box(0, 0, 0, L, D, H - 4, EARTH)
    iso.box(0, 0, H - 4, L, D, 4, ("#A6D98A", EARTH[1], EARTH[2]))
    iso.dz = H
    # ploughed field with crop rows
    iso.poly([(8, 8, .2), (178, 8, .2), (178, 170, .2), (8, 170, .2)], "#C9A27A")
    for k in range(11):
        y = 16 + k * 14
        iso.box(14, y, 0, 158, 6, 3.5, ("#8CCB6E", "#6FB25A", "#5E9E4F"))
    # irrigation channel along the field
    iso.poly([(8, 178, .25), (178, 178, .25), (178, 190, .25), (8, 190, .25)], "#4C9FD0")
    iso.poly([(8, 178, .3), (178, 178, .3), (178, 181, .3), (8, 181, .3)], "#2E6F99")
    for x in (40, 100, 150):
        a, b = iso.p(x, 185, .4), iso.p(x + 16, 185, .4)
        iso.parts.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="#fff" stroke-opacity=".7" stroke-width="1.2" stroke-linecap="round"/>')
    # solar array that drives the pump
    for i in range(3):
        pv_ground(iso, 206 + i * 62, 12, 54, 30, 6, 24, 4, 2)
    for (p1, p2, col, w) in (((300, 48, .5), (238, 108, .5), "#F28C0F", 2), ((206, 122, .5), (178, 182, .5), "#5B6B60", 3)):
        a, b = iso.p(*p1), iso.p(*p2)
        iso.parts.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{col}" stroke-width="{w}" stroke-linecap="round"/>')
    well(iso, 194, 92, 30)
    iso.box(232, 104, 0, 14, 12, 15, STEEL)                    # solar pump controller
    iso.front(232, 104, 0, 14, 12, 15, '<rect x="3" y="3" width="8" height="5" rx="1" fill="#F28C0F"/>')
    vtree(iso, 384, 92, 0, .9)
    vtree(iso, 8, 200, 0, .9)
    # elevated water tank, fed from the channel side
    for (lx, ly) in ((64, 208), (92, 208), (64, 236), (92, 236)):
        iso.box(lx, ly, 0, 4, 4, 30, STEEL)
    iso.box(60, 204, 30, 40, 40, 26, ("#E8F4FA", "#BFDDEB", "#9CC6DA"))
    iso.front(60, 204, 30, 40, 40, 26, '<rect x="6" y="6" width="28" height="4" rx="2" fill="#4C9FD0" opacity=".6"/>')
    vtree(iso, 140, 232, 0, 1.0)
    # shed (سوله) with PV roof
    shed(iso, 236, 168, 150, 72, 36, 13, 8)
    vtree(iso, 200, 250, 0, .7)
    iso.dz = 0
    return iso.svg(14, "dio")


LEAF = '<svg><use href="#leaf"/></svg>'

CSS = """
  /* cover */
  .cover .sun{top:-14mm;left:-14mm;width:92mm;height:92mm}
  .cover .brand{position:absolute;top:16mm;right:17mm;z-index:2}
  .cover-body{position:absolute;right:17mm;left:17mm;top:42mm;z-index:2}
  .cover-tag{display:inline-flex;align-items:center;gap:6px;background:#fff;color:var(--leaf);font-weight:800;font-size:10pt;padding:4px 14px;border-radius:40px;box-shadow:var(--shadow)}
  .cover-tag svg{width:16px;height:16px}
  .cover h1{font-size:48pt;font-weight:900;line-height:1.35;margin-top:5mm;color:var(--leaf-deep)}
  .cover h1 em{font-style:normal;color:var(--primary)}
  .cover p{font-size:12.5pt;color:var(--ink-2);font-weight:500;margin-top:4mm;max-width:125mm}
  .cover .land{height:120mm}
  .hero-wrap{position:absolute;left:10mm;right:10mm;bottom:44mm;height:110mm;display:grid;place-items:center;z-index:1}
  .hero3d{height:100%;width:auto;filter:drop-shadow(0 20px 18px rgba(60,90,60,.18))}
  .cover-strip{position:absolute;bottom:9mm;right:14mm;left:14mm;display:flex;gap:3mm;z-index:2}
  .cover-strip div{flex:1;background:rgba(255,255,255,.92);border-radius:4mm;padding:2.5mm 3.5mm;font-size:9.5pt;font-weight:800;color:var(--leaf-deep);box-shadow:var(--shadow);border-bottom:3px solid var(--primary)}
  .cover-strip span{display:block;font-weight:500;color:var(--ink-2);font-size:8.3pt}

  /* about */
  .about-hero{display:grid;grid-template-columns:1.15fr .85fr;gap:9mm;align-items:start;margin-top:6mm}
  .about-hero p{font-size:10.8pt;color:var(--ink-2);margin-bottom:3.5mm;text-align:justify}
  .about-hero p b{color:var(--ink)}
  .quote{background:var(--leaf-soft);border-radius:6mm;padding:8mm 7mm;position:relative;overflow:hidden}
  .quote .lf{position:absolute;left:-4mm;bottom:-4mm;width:30mm;height:30mm;opacity:.35}
  .quote p{color:var(--leaf-deep);font-size:13pt;font-weight:800;line-height:1.75;text-align:right;position:relative}
  .quote small{display:block;margin-top:3mm;font-size:9pt;color:var(--leaf);font-weight:700;position:relative}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:9mm}
  .stat{padding:5mm 3mm;text-align:center;background:#fff;border-radius:5mm;box-shadow:var(--shadow);border-top:4px solid var(--leaf-2)}
  .stat:nth-child(odd){border-top-color:var(--primary)}
  .stat b{direction:ltr;display:block;font-size:24pt;font-weight:900;line-height:1.15;color:var(--leaf-deep)}
  .stat b i{font-style:normal;color:var(--primary);font-size:14pt}
  .stat span{font-size:9pt;color:var(--ink-2)}
  .values{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;margin-top:8mm}
  .value{padding:6mm}
  .value h4{font-size:11.5pt;font-weight:800;margin:3mm 0 1.5mm}
  .value p{font-size:9.3pt;color:var(--ink-2);line-height:1.8}
  .certs{display:flex;gap:3mm;margin-top:8mm;flex-wrap:wrap}
  .cert{font-size:8.8pt;font-weight:700;padding:2mm 4mm;border-radius:30px;border:1.5px dashed var(--leaf-2);color:var(--leaf);background:#fff}

  /* epc */
  .epc-letters{display:flex;gap:5mm;margin:8mm 0 8mm}
  .epc-l{flex:1;padding:6mm 6mm 5mm;position:relative;overflow:hidden}
  .epc-l .big{font-size:52pt;font-weight:900;line-height:1;direction:ltr;display:block;text-align:left;color:var(--primary)}
  .epc-l:nth-child(2) .big{color:var(--leaf)}
  .epc-l:nth-child(3) .big{color:#4FA3D9}
  .epc-l h3{font-size:14pt;font-weight:800;margin-top:3mm}
  .epc-l h3 small{display:block;font-size:8pt;color:#9aa59c;font-weight:600;direction:ltr;text-align:right;letter-spacing:1.5px}
  .epc-l ul{list-style:none;margin-top:3mm}
  .epc-l li{font-size:9.2pt;color:var(--ink-2);padding:1.2mm 0;border-bottom:1px dashed var(--line)}
  .epc-l li:last-child{border:none}
  .epc-l li::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--leaf-2);margin-left:6px;vertical-align:middle}
  .timeline h3{font-size:13pt;font-weight:800;margin-bottom:5mm}
  .steps{display:grid;grid-template-columns:repeat(6,1fr);position:relative}
  .steps::before{content:"";position:absolute;top:7mm;right:8%;left:8%;height:2px;background:repeating-linear-gradient(90deg,var(--leaf-2) 0 6px,transparent 6px 11px)}
  .step{text-align:center;position:relative;padding:0 1.5mm}
  .step .dot{width:14mm;height:14mm;border-radius:50%;background:var(--primary);color:#fff;font-weight:900;font-size:14pt;display:grid;place-items:center;margin:0 auto 3mm;box-shadow:0 0 0 5px #fff,0 6px 14px rgba(242,140,15,.3)}
  .step:nth-child(even) .dot{background:var(--leaf)}
  .step b{display:block;font-size:10pt}
  .step span{font-size:8.2pt;color:var(--ink-2);line-height:1.6;display:block;margin-top:1mm}
  .om{margin-top:9mm;display:flex;align-items:center;gap:6mm;background:var(--leaf-soft);border:1.5px solid #CFE8BF;border-radius:5mm;padding:6mm 7mm}
  .om b.k{font-size:13pt;font-weight:900;white-space:nowrap;color:var(--leaf)}
  .om p{font-size:9.6pt;line-height:1.75;color:var(--ink-2)}
  .om p b{color:var(--ink)}

  /* solutions */
  .sol-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4mm;margin-top:6mm}
  .sol{padding:4.5mm;display:grid;grid-template-columns:24mm 1fr;gap:4.5mm;align-items:start}
  .sol.feature{grid-column:span 2;grid-template-columns:44mm 1fr;background:linear-gradient(135deg,#F1F9EC,#fff)}
  .sol .art{width:100%;aspect-ratio:1;border-radius:4mm;background:linear-gradient(180deg,#E6F4FD 0 58%,#DDF0D0 58%);display:grid;place-items:center;overflow:hidden}
  .sol .art svg{width:98%;height:98%}
  .sol h3{font-size:13pt;font-weight:900}
  .sol .tag-pill{margin:1.5mm 0 2mm}
  .sol p{font-size:9pt;color:var(--ink-2);line-height:1.75}
  .range{margin-top:5mm;padding:5mm 6mm}
  .range-h{display:flex;justify-content:space-between;font-size:9pt;font-weight:700;margin-bottom:3mm}
  .bar{height:9px;border-radius:9px;background:linear-gradient(90deg,var(--primary),#FFC93C 50%,var(--leaf-2))}
  .ticks{display:flex;justify-content:space-between;font-size:8pt;color:var(--ink-2);margin-top:2.5mm}
  .ticks span{direction:ltr;unicode-bidi:isolate}

  /* river page */
  .river-page .ribbon{position:absolute;inset:0;width:100%;height:100%;z-index:0}
  .dio-wrap{position:relative;height:138mm;margin-top:0;display:grid;place-items:center}
  .dio{height:100%;width:auto;filter:drop-shadow(0 22px 20px rgba(40,90,120,.22))}
  .eco{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin-top:4mm}
  .eco .card{padding:5mm;position:relative;overflow:hidden}
  .eco .card::after{content:"";position:absolute;left:-6mm;bottom:-10mm;width:30mm;height:16mm;border-radius:50%;background:#DFF1FA}
  .eco h4{font-size:11.5pt;font-weight:900;margin:3mm 0 1mm;position:relative;z-index:1}
  .eco p{font-size:9pt;color:var(--ink-2);line-height:1.75;position:relative;z-index:1}
  .ico.w{background:#DFF1FA}.ico.w svg{stroke:#3E8FC4}
  .river-quote{margin-top:7mm;text-align:center;font-size:12pt;font-weight:800;color:#2F6F95}
  .river-quote em{font-style:normal;color:var(--primary)}

  /* farm page */
  .farm-page .eco .card::after{background:#EEF7E7}

  /* back */
  .back .sun{top:-18mm;left:-18mm;width:80mm;height:80mm}
  .back .land{height:135mm}
  .back-in{position:absolute;inset:16mm 17mm 12mm;display:flex;flex-direction:column;z-index:2}
  .back h2{font-size:36pt;font-weight:900;line-height:1.4;margin-top:22mm;color:var(--leaf-deep)}
  .back h2 em{font-style:normal;color:var(--primary)}
  .back .sub{font-size:12pt;margin-top:3mm;max-width:140mm;color:var(--ink-2);font-weight:500}
  .offer{margin-top:8mm;padding:7mm;display:grid;grid-template-columns:1fr auto;gap:6mm;align-items:center;border-right:5px solid var(--primary)}
  .offer h3{font-size:15pt;font-weight:900;color:var(--primary-deep)}
  .offer p{font-size:9.6pt;color:var(--ink-2);margin-top:1mm}
  .qr-box{width:30mm;text-align:center}
  .qr-box .q{width:30mm;height:30mm;padding:2mm;border-radius:3mm;background:#fff;border:1.5px solid var(--line)}
  .qr-box small{display:block;font-size:7.6pt;font-weight:700;color:var(--leaf);margin-top:1mm}
  .gains{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin-top:6mm}
  .gains div{padding:4mm 5mm;text-align:center}
  .gains b{display:block;font-size:19pt;font-weight:900;line-height:1.25;color:var(--leaf)}
  .gains span{font-size:8.8pt;font-weight:600;color:var(--ink-2)}
  .contacts{margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:3.5mm}
  .c{padding:4mm 5mm;display:flex;gap:4mm;align-items:center;background:rgba(255,255,255,.95)}
  .c small{display:block;font-size:8pt;color:var(--ink-2)}
  .c b{font-size:10.5pt;font-weight:800}
"""


def solar():
    sols = [
        ("خانگی و ویلایی", "۳ تا ۲۰ کیلووات", "کاهش یا حذف قبض برق، درآمد از فروش برق مازاد و برق پایدار در خاموشی‌ها با سامانه هیبرید.",
         ["On‑Grid", "هیبرید + باتری", "پشت‌بامی"], mini(m_home, (35, 28, 72, 10), 1)),
        ("باغ و کشاورزی", "پمپ ۱ تا ۱۰۰ اسب‌بخار", "پمپاژ خورشیدی چاه بدون سوخت و شبکه، آبیاری قطره‌ای و برق‌رسانی به گلخانه و دامداری.",
         ["پمپ خورشیدی", "Off‑Grid", "گلخانه"], mini(m_garden, (38, 38, 62, 10), 2)),
        ("تجاری و مغازه", "۱۰ تا ۲۰۰ کیلووات", "کاهش هزینه انرژی فروشگاه‌ها، رستوران‌ها، دفاتر، هتل‌ها و مجتمع‌ها در ساعات اوج مصرف.",
         ["پیک‌سایی", "پارکینگ خورشیدی", "UPS"], mini(m_shop, (40, 30, 66, 10), 3)),
        ("صنعتی و کارخانه", "۱۰۰ کیلووات تا ۱ مگاوات", "بهره‌گیری از سقف سوله‌ها و زمین‌های بلااستفاده برای تأمین بخشی از مصرف و کاهش وابستگی به شبکه.",
         ["سقف سوله", "خودتأمین", "ذخیره‌ساز صنعتی"], mini(m_factory, (48, 30, 78, 10), 4)),
    ]
    sol_html = "".join(
        f'<div class="sol card"><div class="art">{art}</div><div><h3>{t}</h3><span class="tag-pill">{cap}</span><p>{d}</p>'
        f'<div class="tags">{"".join(f"<i>{x}</i>" for x in tags)}</div></div></div>'
        for t, cap, d, tags, art in sols)
    plant = mini(m_plant, (70, 60, 110, 12), 5)

    body = f"""
<!-- 1 COVER -->
<section class="page sky cover">
  {SUN}{sky_deco(11)}
  {brand()}
  <div class="cover-body">
    <span class="cover-tag">{LEAF}پیمانکار EPC انرژی خورشیدی</span>
    <h1>پیشرو در<br><em>انرژی</em> پاک</h1>
    <p>از مطالعه و طراحی تا تأمین تجهیزات، نصب، راه‌اندازی و نگهداری؛ یک مسیر، یک مسئول — برای خانه، باغ، مغازه، کارخانه و نیروگاه.</p>
  </div>
  {landscape(seed=21, flowers=22, h=457)}
  <div class="hero-wrap">{hero()}</div>
  <div class="cover-strip">
    <div>خانگی<span>۳ تا ۲۰ کیلووات</span></div>
    <div>کشاورزی و باغ<span>پمپ و برق خورشیدی</span></div>
    <div>تجاری و صنعتی<span>۵۰ کیلووات تا ۱ مگاوات</span></div>
    <div>نیروگاه<span>مقیاس مگاواتی</span></div>
  </div>
</section>

<!-- 2 ABOUT -->
<section class="page"><div class="pad">
  <span class="eyebrow">{LEAF}درباره ما</span>
  <h2 class="sec-title">ما خورشید را به <span>برق مطمئن</span> تبدیل می‌کنیم</h2>
  <div class="about-hero">
    <div>
      <p><b>فردیس انرژی</b> شرکتی تخصصی در حوزه انرژی‌های تجدیدپذیر است که با تمرکز بر سامانه‌های فتوولتائیک، پروژه‌ها را به‌صورت <b>EPC</b> (مهندسی، تأمین، اجرا) و کلید‌در‌دست تحویل می‌دهد. تیم ما متشکل از مهندسان برق، سازه و انرژی است که هر پروژه را از امکان‌سنجی فنی و اقتصادی تا اتصال به شبکه و بهره‌برداری همراهی می‌کنند.</p>
      <p>از سامانه‌های کوچک پشت‌بامی برای منازل تا پمپ‌های خورشیدی باغات، سامانه‌های صنعتی روی سقف کارخانه‌ها و نیروگاه‌های زمینی مگاواتی؛ هر پروژه را با همان دقت مهندسی، تجهیزات استاندارد و پشتیبانی بلندمدت اجرا می‌کنیم.</p>
      <p>هدف ما ساده است: <b>کاهش هزینه برق، استقلال انرژی و بازگشت سرمایه قابل پیش‌بینی</b> برای مشتریانمان.</p>
    </div>
    <div class="quote">
      <svg class="lf"><use href="#leaf"/></svg>
      <p>ما فقط پنل نصب نمی‌کنیم؛ ما یک نیروگاه کوچک و پاک برای ۲۵ سال آینده شما می‌سازیم.</p>
      <small>— مدیریت فردیس انرژی</small>
    </div>
  </div>
  <div class="stats">
    <div class="stat"><b>+۱۴۰</b><span>پروژه اجراشده</span></div>
    <div class="stat"><b>۲۲<i> MW</i></b><span>ظرفیت نصب‌شده تجمعی</span></div>
    <div class="stat"><b>۱۱</b><span>استان تحت پوشش</span></div>
    <div class="stat"><b>+۸</b><span>سال تجربه تیم فنی</span></div>
  </div>
  <div class="values">
    <div class="value card">{ico("shield", "o")}<h4>کیفیت و تضمین</h4><p>پنل‌های Tier‑1، اینورترهای معتبر و ضمانت عملکرد تا ۲۵ سال.</p></div>
    <div class="value card">{ico("pulse")}<h4>مهندسی دقیق</h4><p>شبیه‌سازی تولید با PVsyst، طراحی سازه و حفاظت مطابق استانداردهای IEC.</p></div>
    <div class="value card">{ico("clock", "o")}<h4>پشتیبانی همیشگی</h4><p>مانیتورینگ آنلاین، سرویس دوره‌ای و پاسخ‌گویی سریع پس از فروش.</p></div>
  </div>
  <div class="certs">
    <span class="cert">مطابق ضوابط ساتبا</span><span class="cert">استانداردهای IEC 61215 / 61730</span>
    <span class="cert">طراحی بر پایه PVsyst</span><span class="cert">بیمه مسئولیت پروژه</span>
  </div>
</div>{folio("۰۲", LABEL)}</section>

<!-- 3 EPC -->
<section class="page mint"><div class="pad">
  <span class="eyebrow">{LEAF}خدمات</span>
  <h2 class="sec-title">خدمات جامع <span>EPC</span> خورشیدی</h2>
  <p class="lead">یک قرارداد، یک پاسخ‌گو. تمام مراحل پروژه، از اولین بازدید تا سال‌ها پس از بهره‌برداری، با فردیس انرژی.</p>
  <div class="epc-letters">
    <div class="epc-l card"><span class="big">E</span><h3>مهندسی و طراحی<small>ENGINEERING</small></h3><ul>
      <li>بازدید محل و امکان‌سنجی فنی</li><li>تحلیل اقتصادی و بازگشت سرمایه</li><li>شبیه‌سازی تولید و چیدمان پنل</li><li>طراحی سازه، کابل‌کشی و حفاظت</li><li>اخذ مجوزها و قرارداد خرید برق</li></ul></div>
    <div class="epc-l card"><span class="big">P</span><h3>تأمین تجهیزات<small>PROCUREMENT</small></h3><ul>
      <li>پنل‌های خورشیدی Tier‑1</li><li>اینورتر On‑Grid، Off‑Grid و هیبرید</li><li>باتری لیتیومی و ذخیره‌سازی</li><li>سازه گالوانیزه و تابلوهای حفاظتی</li><li>کنترل کیفیت و ضمانت اصالت کالا</li></ul></div>
    <div class="epc-l card"><span class="big">C</span><h3>اجرا و راه‌اندازی<small>CONSTRUCTION</small></h3><ul>
      <li>نصب سازه و پنل روی سقف یا زمین</li><li>اجرای کابل‌کشی AC/DC و ارتینگ</li><li>تست، کمیسیونینگ و راه‌اندازی</li><li>اتصال به شبکه و نصب کنتور</li><li>آموزش بهره‌بردار و تحویل مدارک</li></ul></div>
  </div>
  <div class="timeline">
    <h3>مسیر پروژه شما</h3>
    <div class="steps">
      <div class="step"><div class="dot">۱</div><b>مشاوره</b><span>بررسی نیاز و قبض برق</span></div>
      <div class="step"><div class="dot">۲</div><b>بازدید</b><span>برداشت محل و سایه‌اندازی</span></div>
      <div class="step"><div class="dot">۳</div><b>طراحی</b><span>پیشنهاد فنی و مالی</span></div>
      <div class="step"><div class="dot">۴</div><b>تأمین</b><span>خرید و حمل تجهیزات</span></div>
      <div class="step"><div class="dot">۵</div><b>نصب</b><span>اجرا و راه‌اندازی</span></div>
      <div class="step"><div class="dot">۶</div><b>بهره‌برداری</b><span>پایش و نگهداری</span></div>
    </div>
  </div>
  <div class="om"><b class="k">+ O&amp;M</b><p><b>بهره‌برداری و نگهداری:</b> شست‌وشوی دوره‌ای پنل‌ها، ترموگرافی، پایش آنلاین تولید، گزارش ماهانه عملکرد و تعمیرات فوری — تا سامانه شما همیشه در بیشترین بازده کار کند.</p></div>
</div>{folio("۰۳", LABEL)}</section>

<!-- 4 SOLUTIONS -->
<section class="page"><div class="pad">
  <span class="eyebrow">{LEAF}راهکارها</span>
  <h2 class="sec-title">برای هر <span>مقیاس</span>، یک راهکار</h2>
  <p class="lead">از چند کیلووات برای یک خانه تا چند مگاوات برای یک نیروگاه؛ هر جا انرژی لازم است، ما هستیم.</p>
  <div class="sol-grid">
    {sol_html}
    <div class="sol card feature"><div class="art">{plant}</div><div>
      <h3>نیروگاه خورشیدی</h3><span class="tag-pill g">۱ مگاوات و بالاتر</span>
      <p>طراحی و احداث نیروگاه‌های زمینی متصل به شبکه به‌صورت کلید‌در‌دست؛ از انتخاب زمین، مطالعات شبکه و اخذ مجوز اتصال تا پست، ترانسفورماتور، اسکادا و بهره‌برداری بلندمدت. امکان همکاری در مدل سرمایه‌گذاری مشترک و قراردادهای خرید تضمینی برق.</p>
      <div class="tags"><i>زمینی ثابت و ردیاب</i><i>پست و ترانس</i><i>SCADA</i><i>قرارداد خرید تضمینی</i></div></div></div>
  </div>
  <div class="range card">
    <div class="range-h"><span>دامنه ظرفیت قابل اجرا</span><span style="color:var(--leaf)">کیلووات ← مگاوات</span></div>
    <div class="bar"></div>
    <div class="ticks"><span>۳ kW</span><span>۲۰ kW</span><span>۲۰۰ kW</span><span>۱ MW</span><span>+۱۰ MW</span></div>
  </div>
</div>{folio("۰۴", LABEL)}</section>

<!-- 5 FARM: well + shed -->
<section class="page mint farm-page"><div class="pad">
  <span class="eyebrow">{LEAF}کشاورزی و صنعت</span>
  <h2 class="sec-title">از <span>چاه</span> تا <span>سوله</span>، با برق خورشید</h2>
  <p class="lead">پمپ چاه کشاورزی را با پنل خورشیدی راه می‌اندازیم و سقف بلااستفاده سوله و انبار را به نیروگاه تبدیل می‌کنیم؛ بدون گازوئیل، بدون دغدغه قطعی برق.</p>
  <div class="dio-wrap">{farm_diorama()}</div>
  <div class="eco">
    <div class="card">{ico("pulse", "w")}<h4>پمپ خورشیدی چاه</h4><p>آبیاری در ساعات آفتابی بدون گازوئیل و بدون نیاز به برق شبکه؛ مناسب چاه‌های دور از دسترس.</p></div>
    <div class="card">{ico("home")}<h4>سقف سوله، نیروگاه شما</h4><p>سقف سوله‌ها و انبارها بهترین جا برای پنل است؛ برق کارگاه تأمین می‌شود یا مازاد آن به شبکه فروخته می‌شود.</p></div>
    <div class="card">{ico("clock", "o")}<h4>ذخیره آب، ذخیره انرژی</h4><p>آب در روز به مخزن پمپ می‌شود تا در هر ساعتی از شبانه‌روز برای آبیاری در دسترس باشد.</p></div>
  </div>
</div>{folio("۰۵", LABEL)}</section>

<!-- 6 RIVER -->
<section class="page sky river-page">
  <svg class="ribbon" viewBox="0 0 210 297" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="rib" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE4F6" stop-opacity=".0"/><stop offset=".35" stop-color="#BFE4F6" stop-opacity=".55"/><stop offset="1" stop-color="#9DD3EE" stop-opacity=".7"/></linearGradient></defs>
    <path d="M230 -10 C170 40 210 80 140 110 S40 150 70 200 S10 260 -20 310 L40 310 C70 270 100 230 80 200 S170 140 190 110 S250 50 260 -10Z" fill="url(#rib)"/>
  </svg>
  <div class="pad">
    <span class="eyebrow">{LEAF}هم‌نفس با طبیعت</span>
    <h2 class="sec-title">انرژی پاک، کنار <span>رود</span> و مزرعه</h2>
    <p class="lead">خورشید بی‌صدا برق می‌سازد؛ نه دودی، نه صدایی و نه آبی که هدر برود. ما سامانه‌ها را طوری طراحی می‌کنیم که کنار زمین کشاورزی، باغ و آب، بخشی از طبیعت باشند — نه مزاحم آن.</p>
    <div class="dio-wrap">{diorama()}</div>
    <div class="eco">
      <div class="card">{ico("shield")}<h4>بدون دود و صدا</h4><p>پنل‌های خورشیدی هنگام تولید برق هیچ آلاینده و صدایی ایجاد نمی‌کنند.</p></div>
      <div class="card">{ico("pulse", "w")}<h4>بدون مصرف آب</h4><p>برخلاف نیروگاه‌های حرارتی، تولید برق خورشیدی به آب خنک‌کاری نیاز ندارد.</p></div>
      <div class="card">{ico("web", "o")}<h4>خورشید روی آب</h4><p>سامانه‌های شناور روی کانال‌ها و مخازن، هم برق می‌سازند و هم تبخیر آب را کم می‌کنند.</p></div>
    </div>
    <p class="river-quote">هر کیلووات خورشیدی، یک قدم برای <em>آب و هوای پاک‌تر</em></p>
  </div>{folio("۰۶", LABEL)}
</section>

<!-- 7 BACK -->
<section class="page sky back">
  {SUN}{sky_deco(17)}
  {landscape(seed=33, flowers=22, h=514)}
  <div class="back-in">
    {brand()}
    <h2>سقف شما،<br><em>نیروگاه شما.</em></h2>
    <p class="sub">برای دریافت مشاوره رایگان، بازدید محل و برآورد هزینه و بازگشت سرمایه، همین امروز با ما تماس بگیرید.</p>
    <div class="offer card">
      <div><h3>مشاوره و امکان‌سنجی رایگان</h3><p>کافی است تصویر قبض برق و آدرس محل را برای ما ارسال کنید؛ پیشنهاد فنی و مالی اولیه را در کمتر از ۴۸ ساعت دریافت می‌کنید.</p></div>
      <div class="qr-box"><div class="q">{tel_qr()}</div><small>اسکن کنید و تماس بگیرید</small></div>
    </div>
    <div class="gains">
      <div class="card"><b>تا ۹۰٪</b><span>کاهش هزینه قبض برق</span></div>
      <div class="card"><b>۳ تا ۵ سال</b><span>دوره معمول بازگشت سرمایه</span></div>
      <div class="card"><b>+۲۵ سال</b><span>عمر مفید سامانه</span></div>
    </div>
    <div class="contacts">
      <div class="c card">{ico("phone", "solid")}<div><small>تلفن تماس</small><b class="ltr">{PHONE}</b></div></div>
      <div class="c card">{ico("msg", "solid")}<div><small>واتساپ / تلگرام</small><b class="ltr">{PHONE}</b></div></div>
      <div class="c card">{ico("web", "solid")}<div><small>وب‌سایت</small><b class="ltr">www.fardisenergy.ir</b></div></div>
      <div class="c card">{ico("pin", "solid")}<div><small>دفتر مرکزی</small><b>مشهد، خیابان چمران ۱۳</b></div></div>
    </div>
  </div>
</section>
"""
    return page_html("بروشور فردیس انرژی", body, CSS)


pathlib.Path(__file__).with_name("fardis-energy-brochure.html").write_text(solar())
