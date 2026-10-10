"""Builds fardis-portable-power-brochure.html (portable power line, airy nature theme)."""
import pathlib

from iso3d import DARK, ORANGE, STEEL, Iso, island
from nature import PHONE, SUN, brand, folio, ico, landscape, page_html, sky_deco


BOLT = '<path d="M{x} {y} l-9 15 h10 l-6 14 l17-20 h-10 l6-9z" fill="#F28C0F"/>'


def station(iso, ox=0, oy=0):
    W, D, H = 170, 95, 105
    iso.box(ox, oy, 0, W, D, 14, ORANGE)
    iso.box(ox, oy, 14, W, D, H - 14)
    for hx in (35, 125):
        iso.box(ox + hx, oy + 40, H, 10, 15, 24, STEEL)
    iso.box(ox + 35, oy + 40, H + 24, 100, 15, 10, STEEL)
    face = (
        '<rect x="12" y="14" width="72" height="38" rx="5" fill="#2f343c"/>'
        + BOLT.format(x=32, y=19)
        + '<rect x="50" y="25" width="22" height="14" rx="2" fill="none" stroke="#F28C0F" stroke-width="2"/>'
          '<rect x="53" y="28" width="13" height="8" fill="#F28C0F"/>'
          '<g fill="#3a3f48"><circle cx="108" cy="32" r="10"/><circle cx="142" cy="32" r="10"/></g>'
          '<g fill="#F28C0F"><rect x="103" y="29" width="3" height="6"/><rect x="110" y="29" width="3" height="6"/>'
          '<rect x="137" y="29" width="3" height="6"/><rect x="144" y="29" width="3" height="6"/></g>'
          '<g fill="#3a3f48"><rect x="14" y="62" width="14" height="8" rx="2"/><rect x="33" y="62" width="14" height="8" rx="2"/>'
          '<rect x="52" y="62" width="14" height="8" rx="2"/></g>'
          '<rect x="98" y="58" width="56" height="15" rx="7.5" fill="#F28C0F"/>')
    iso.front(ox, oy, 14, W, D, H - 14, face)
    iso.side(ox, oy, 14, W, D, H - 14,
             '<g stroke="#2f343c" stroke-width="4" stroke-linecap="round">'
             + "".join(f'<path d="M18 {v} H77"/>' for v in range(22, 80, 11)) + "</g>")


def bank(iso, ox=0, oy=0, h=110):
    W, D = 56, 24
    iso.box(ox, oy, 0, W, D, h)
    bars = "".join(f'<rect x="10" y="{40 + i * 11}" width="36" height="6" rx="3" fill="#F28C0F"{" opacity=.4" if i == 3 else ""}/>' for i in range(4))
    iso.front(ox, oy, 0, W, D, h,
              '<rect x="8" y="10" width="40" height="22" rx="4" fill="#2f343c"/>'
              '<text x="28" y="26" font-size="11" font-weight="900" fill="#F28C0F" text-anchor="middle" font-family="Vazirmatn">100%</text>'
              + bars + f'<rect x="18" y="{h - 14}" width="20" height="5" rx="2.5" fill="#3a3f48"/>')
    iso.side(ox, oy, 0, W, D, h, f'<rect x="9" y="8" width="6" height="{h - 16}" rx="3" fill="#F28C0F"/>')


def package(iso, ox=0, oy=0):
    # inverter (left) first, battery cabinet (higher x) occludes it
    iso.box(ox, oy + 30, 0, 64, 55, 98)
    iso.front(ox, oy + 30, 0, 64, 55, 98,
              '<rect x="9" y="12" width="46" height="24" rx="4" fill="#2f343c"/>'
              '<text x="32" y="29" font-size="12" font-weight="900" fill="#F28C0F" text-anchor="middle" font-family="Vazirmatn">2kVA</text>'
              '<g fill="#3a3f48"><circle cx="18" cy="50" r="5"/><circle cx="32" cy="50" r="5"/><circle cx="46" cy="50" r="5"/></g>'
              '<g stroke="#2f343c" stroke-width="3"><path d="M10 66 H54 M10 74 H54 M10 82 H54"/></g>')
    iso.side(ox, oy + 30, 0, 64, 55, 98, '<rect x="8" y="10" width="5" height="78" rx="2.5" fill="#F28C0F"/>')
    iso.box(ox + 84, oy, 0, 76, 70, 128, STEEL)
    iso.box(ox + 84, oy, 128, 76, 70, 8)
    mods = "".join(f'<rect x="10" y="{14 + i * 24}" width="56" height="17" rx="3" fill="#F28C0F"{" opacity=.45" if i == 4 else ""}/>' for i in range(5))
    iso.front(ox + 84, oy, 0, 76, 70, 128, mods)
    iso.side(ox + 84, oy, 0, 76, 70, 128,
             '<text x="35" y="70" font-size="10" font-weight="900" fill="#F28C0F" text-anchor="middle" font-family="Vazirmatn">3.2kWh</text>')




def scene(fn, isl, seed, cls="r3d", **kw):
    iso = Iso()
    fn(iso, **kw)
    island(iso, *isl, seed=seed, flowers=5)
    return iso.svg(cls=cls)


STATION = scene(station, (85, 47, 120), 1)
BANK = scene(bank, (28, 12, 52), 2)
BANK_S = scene(bank, (28, 12, 52), 3, h=92)
PACK = scene(package, (80, 50, 128), 4)


def cover_scene():
    iso = Iso()
    station(iso, 0, 0)
    bank(iso, 205, 40)
    island(iso, 140, 60, 165, 22, seed=9, flowers=8)
    return iso.svg(cls="hero3d")


LEAF = '<svg><use href="#leaf"/></svg>'
LABEL = "تجهیزات برق قابل‌حمل"
BOLT_SYM = """<svg width="0" height="0" style="position:absolute"><defs>
  <linearGradient id="boltG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD27A"/><stop offset="1" stop-color="#F28C0F"/></linearGradient>
  <symbol id="bolt3d" viewBox="0 0 110 150">
    <path d="M70 6 L18 84 h32 l-10 60 L96 60 H62 Z" fill="#D27407" transform="translate(8 6)"/>
    <path d="M70 6 L18 84 h32 l-10 60 L96 60 H62 Z" fill="url(#boltG)"/>
    <path d="M70 6 L18 84 h32" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
  </symbol></defs></svg>"""


def chips(items):
    return '<div class="chips">' + "".join(f'<div class="chip">{ico(n, "o" if i % 2 else "")}<span>{t}</span></div>' for i, (n, t) in enumerate(items)) + "</div>"


def ask():
    return (f'<div class="ask"><div><small>قیمت</small><b>استعلامی</b></div>'
            f'<div class="call">{ico("phone")}<div><small>برای استعلام تماس بگیرید</small><b class="ltr">{PHONE}</b></div></div></div>')


CSS = """
  .cover .sun{top:-14mm;left:-14mm;width:88mm;height:88mm}
  .cover .brand{position:absolute;top:16mm;right:17mm;z-index:2}
  .sub-brand{display:inline-flex;align-items:center;gap:6px;font-size:10pt;font-weight:800;background:#fff;color:var(--leaf);padding:4px 14px;border-radius:30px;box-shadow:var(--shadow);margin-bottom:4mm}
  .sub-brand svg{width:16px;height:16px}
  .cover-body{position:absolute;right:17mm;left:17mm;top:42mm;z-index:2}
  .cover h1{font-size:40pt;font-weight:900;line-height:1.45;color:var(--leaf-deep)}
  .cover h1 em{font-style:normal;color:var(--primary)}
  .cover .desc{font-size:12.5pt;font-weight:500;margin-top:3mm;max-width:115mm;color:var(--ink-2)}
  .cover .calm{display:inline-block;margin-top:3mm;font-size:11.5pt;font-weight:800;color:var(--leaf);border-right:4px solid var(--leaf-2);padding-right:4mm}
  .cover .land{height:120mm}
  .hero-wrap{position:absolute;left:8mm;right:8mm;bottom:36mm;height:100mm;display:grid;place-items:center;z-index:1}
  .hero3d{height:100%;width:auto;filter:drop-shadow(0 20px 18px rgba(60,90,60,.18))}
  .fl{position:absolute;z-index:1}
  .fl.b1{width:20mm;height:28mm;left:24mm;top:96mm;transform:rotate(-12deg);filter:drop-shadow(0 10px 10px rgba(60,90,60,.2))}
  .badges{position:absolute;bottom:10mm;right:17mm;left:17mm;display:grid;grid-template-columns:1fr 1fr;gap:5mm;z-index:2}
  .badge{display:flex;gap:4mm;align-items:center;padding:3.5mm 5mm;background:rgba(255,255,255,.95)}
  .badge b{display:block;font-size:11pt}
  .badge span{font-size:8.8pt;color:var(--ink-2)}

  .scen{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-top:8mm}
  .sc{position:relative;padding:7mm 6mm 6mm;overflow:hidden}
  .sc-n{position:absolute;left:5mm;top:2mm;font-size:34pt;font-weight:900;color:var(--leaf-soft);line-height:1.2}
  .sc .ico{width:42px;height:42px;border-radius:12px}
  .sc h3{font-size:14pt;font-weight:900;margin-top:4mm}
  .sc p{font-size:9.4pt;color:var(--ink-2);line-height:1.8;margin:1.5mm 0 3mm;min-height:24mm}
  .quote3d{margin-top:9mm;display:flex;align-items:center;gap:6mm;background:var(--primary-soft);border-radius:6mm;padding:7mm 8mm;border:1.5px solid #FFE0B0}
  .quote3d .qb{width:18mm;height:25mm;flex:none}
  .quote3d b{display:block;font-size:15pt;color:var(--primary-deep)}
  .quote3d span{font-size:10pt;color:var(--ink-2)}

  .stage{position:relative;height:108mm;margin-top:4mm;display:grid;place-items:center}
  .stage svg{height:102mm;width:auto;position:relative;z-index:1}
  .specs{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin-top:2mm}
  .spec3d{padding:4mm 5mm;border-bottom:4px solid var(--leaf-2)}
  .spec3d:nth-child(2){border-bottom-color:var(--primary)}
  .spec3d small{display:block;font-size:8.5pt;color:var(--ink-2)}
  .spec3d b{font-size:17pt;font-weight:900;color:var(--leaf-deep);display:block;text-align:right}
  .mini{font-size:11pt;font-weight:800;margin:6mm 0 3mm}
  .ask{margin-top:6mm;display:flex;align-items:center;justify-content:space-between;gap:6mm;background:rgba(255,255,255,.9);border:1px solid var(--line);border-radius:5mm;padding:5mm 6mm;box-shadow:var(--shadow)}
  .ask small{display:block;font-size:8.3pt;color:var(--ink-2)}
  .ask > div > b{font-size:17pt;font-weight:900;color:var(--leaf-deep)}

  .pb-grid{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-top:6mm}
  .pb{padding:0 6mm 6mm;position:relative;overflow:hidden}
  .pb.hot{border:2px solid #FFD9A3}
  .pb-stage{height:96mm;margin:0 -6mm 3mm;background:linear-gradient(180deg,#E6F4FD 0 60%,#E3F2D8 60%);display:grid;place-items:center;padding:5mm 0}
  .pb-stage svg{height:84mm;width:auto}
  .pb.hot .pb-stage svg{height:72mm;margin-top:12mm}
  .pb .tag{position:absolute;top:4mm;right:4mm;font-size:8pt;font-weight:800;background:#fff;color:var(--leaf);padding:.4mm 3mm;border-radius:20px}
  .pb.hot .tag{background:var(--primary);color:#fff}
  .pb h3{font-size:13pt;font-weight:900}
  .pb .model{font-size:9pt;font-weight:800;color:var(--primary-deep);text-align:right;margin-bottom:2mm}
  .kv{display:flex;justify-content:space-between;font-size:9.4pt;padding:1.5mm 0;border-bottom:1px dashed var(--line)}
  .kv span{color:var(--ink-2)}
  .pb p{font-size:9pt;color:var(--ink-2);line-height:1.75;margin-top:3mm}
  .pb-common{margin-top:6mm}

  .cmp{width:100%;border-collapse:separate;border-spacing:0;margin-top:7mm;font-size:9.2pt;background:#fff;border:1px solid var(--line);border-radius:5mm;overflow:hidden;box-shadow:var(--shadow)}
  .cmp th{background:var(--leaf);color:#fff;font-size:9pt;font-weight:800;padding:3.5mm 2mm;text-align:center}
  .cmp td{padding:3.2mm 2mm;border-bottom:1px solid var(--line);text-align:center}
  .cmp tr:last-child td{border-bottom:none}
  .cmp tr:nth-child(even) td{background:#FAFDF7}
  .cmp td:first-child{text-align:right;font-weight:800;padding-right:4mm;background:var(--leaf-soft)}
  .cmp .y{font-style:normal;color:var(--primary);font-weight:900}
  .needs{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:8mm}
  .nd{border-radius:4mm;padding:4.5mm 5mm;background:#fff;border-right:5px solid var(--leaf-2);box-shadow:var(--shadow)}
  .nd:nth-child(even){border-right-color:var(--primary)}
  .nd b{display:block;font-size:10.5pt}
  .nd span{font-size:9.2pt;color:var(--primary-deep);font-weight:700}

  .feat{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:7mm}
  .f{display:flex;gap:4mm;padding:5mm}
  .f .ico{width:42px;height:42px;border-radius:12px}
  .f b{font-size:11pt;display:block}
  .f span{font-size:9pt;color:var(--ink-2)}
  .sub-h{font-size:16pt;font-weight:900;margin:12mm 0 2mm}
  .iso-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;text-align:center}
  .blk{width:30mm;height:30mm;margin:9mm auto 8mm;position:relative;transform:rotateX(55deg) rotateZ(45deg);background:var(--primary);border-radius:3mm;
       box-shadow:1px 1px 0 #E58209,2px 2px 0 #E58209,3px 3px 0 #DC7C08,4px 4px 0 #DC7C08,5px 5px 0 #D27407,6px 6px 0 #D27407,7px 7px 0 #C86E06,8px 8px 0 #C86E06,14px 22px 22px rgba(60,90,60,.16)}
  .blk.b2{background:var(--leaf-2);box-shadow:1px 1px 0 #7AB95F,2px 2px 0 #7AB95F,3px 3px 0 #70AE56,4px 4px 0 #70AE56,5px 5px 0 #66A44D,6px 6px 0 #66A44D,7px 7px 0 #5E9E4F,8px 8px 0 #5E9E4F,14px 22px 22px rgba(60,90,60,.16)}
  .blk.b3{background:#7CC0EA;box-shadow:1px 1px 0 #6BB3E0,2px 2px 0 #6BB3E0,3px 3px 0 #5EA8D8,4px 4px 0 #5EA8D8,5px 5px 0 #519ECF,6px 6px 0 #519ECF,7px 7px 0 #4794C6,8px 8px 0 #4794C6,14px 22px 22px rgba(60,90,60,.16)}
  .blk span{position:absolute;inset:0;display:grid;place-items:center;font-size:24pt;font-weight:900;color:#fff;transform:rotateZ(-45deg)}
  .is b{display:block;font-size:12pt}
  .is small{font-size:9pt;color:var(--ink-2)}
  .cta{margin-top:12mm;background:var(--primary-soft);border:1.5px solid #FFE0B0;border-radius:5mm;padding:6mm 7mm;display:flex;align-items:center;justify-content:space-between;gap:6mm}
  .cta b{font-size:13pt;color:var(--primary-deep);display:block}
  .cta span{font-size:9.4pt;color:var(--ink-2)}
  .cta .call b{color:#fff;display:inline;font-size:13pt}

  .back .sun{top:-18mm;left:-18mm;width:80mm;height:80mm}
  .back .land{height:140mm}
  .back-in{position:absolute;inset:16mm 17mm 12mm;display:flex;flex-direction:column;z-index:2}
  .back h2{font-size:38pt;font-weight:900;line-height:1.45;margin-top:26mm;color:var(--leaf-deep)}
  .back h2 em{font-style:normal;color:var(--primary)}
  .back .sub{font-size:12.5pt;margin-top:4mm;max-width:140mm;font-weight:500;color:var(--ink-2)}
  .back .fl.b2{position:absolute;left:20mm;top:96mm;width:26mm;height:36mm;transform:rotate(-10deg);filter:drop-shadow(0 12px 12px rgba(60,90,60,.2))}
  .contacts{margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:4mm}
  .c{padding:4.5mm 5mm;display:flex;gap:4mm;align-items:center;background:rgba(255,255,255,.95)}
  .c.wide{grid-column:span 2}
  .c small{display:block;font-size:8pt;color:var(--ink-2)}
  .c b{font-size:10.5pt;font-weight:800}
  .c.big b{font-size:20pt;font-weight:900;color:var(--leaf-deep)}
  .c.big .ico{width:46px;height:46px;border-radius:14px}
"""


def build():
    body = f"""{BOLT_SYM}
<!-- 1 COVER -->
<section class="page sky cover">
  {SUN}{sky_deco(41)}
  {brand()}
  <div class="cover-body">
    <span class="sub-brand">{LEAF}تجهیزات برق قابل‌حمل</span>
    <h1>برق مطمئن،<br><em>هرجا</em> که بهش<br>نیاز داری</h1>
    <p class="desc">محصولات قابل حمل و اضطراری برای خانه، محل کار، سفر و کمپینگ</p>
    <span class="calm">دیگه نگران قطع برق نباش؛ ما کنارتیم.</span>
  </div>
  {landscape(seed=42, flowers=22, h=457)}
  <svg class="fl b1"><use href="#bolt3d"/></svg>
  <div class="hero-wrap">{cover_scene()}</div>
  <div class="badges">
    <div class="badge card">{ico("shield")}<div><b>ایمن و مطمئن</b><span>حفاظت باتری و اصالت کالا</span></div></div>
    <div class="badge card">{ico("truck", "o")}<div><b>ارسال سریع</b><span>به سراسر کشور</span></div></div>
  </div>
</section>

<!-- 2 SCENARIOS -->
<section class="page"><div class="pad">
  <span class="eyebrow">{LEAF}کجا به کارت میاد؟</span>
  <h2 class="sec-title">قطعی برق، دیگه <span>مسئله</span> نیست</h2>
  <p class="lead">چه توی خونه باشی، چه سر کار یا وسط جاده؛ یه منبع برق مطمئن همیشه همراهته.</p>
  <div class="scen">
    <div class="sc card"><div class="sc-n">۰۱</div>{ico("home", "o")}<h3>خانه</h3><p>وقتی برق می‌ره، یخچال، روشنایی و مودم روشن می‌مونن و زندگی روال عادیش رو ادامه می‌ده.</p><span class="tag-pill">پکیج برق اضطراری</span></div>
    <div class="sc card"><div class="sc-n">۰۲</div>{ico("work")}<h3>محل کار و مغازه</h3><p>کارتخوان، روشنایی و سیستم فروش قطع نمی‌شن؛ مشتری منتظر نمی‌مونه.</p><span class="tag-pill g">پکیج برق اضطراری</span></div>
    <div class="sc card"><div class="sc-n">۰۳</div>{ico("car")}<h3>سفر</h3><p>شارژ گوشی و لپ‌تاپ در طول مسیر، بدون نگرانی از پیدا کردن پریز.</p><span class="tag-pill g">پاوربانک‌ها و پاور استیشن</span></div>
    <div class="sc card"><div class="sc-n">۰۴</div>{ico("tent", "o")}<h3>کمپینگ</h3><p>روشنایی چادر، شارژ وسایل و یه شب آروم توی طبیعت، دور از شبکه برق.</p><span class="tag-pill">پاور استیشن</span></div>
  </div>
  <div class="quote3d"><svg class="qb"><use href="#bolt3d"/></svg><div><b>برق، همون‌جایی که لازمش داری.</b><span>از یه پاوربانک توی کیف تا پکیجی که کل خونه رو سرپا نگه می‌داره.</span></div></div>
</div>{folio("۰۲", LABEL)}</section>

<!-- 3 PACKAGE -->
<section class="page mint"><div class="pad">
  <span class="eyebrow">{LEAF}پکیج</span>
  <h2 class="sec-title">پکیج برق اضطراری <span>۳.۲ کیلووات</span></h2>
  <p class="lead">برای خونه و مغازه‌ای که قطعی برق اذیتش می‌کنه؛ یخچال، روشنایی و وسایل ضروری رو ساعت‌ها روشن نگه می‌داره.</p>
  <div class="stage">{PACK}</div>
  <div class="specs">
    <div class="spec3d card"><small>اینورتر</small><b class="ltr">2 kVA</b></div>
    <div class="spec3d card"><small>ظرفیت باتری</small><b class="ltr">3.2 kWh</b></div>
    <div class="spec3d card"><small>کاربرد</small><b>خانه و مغازه</b></div>
  </div>
  <h4 class="mini">وسایلی که روشن نگه می‌داره</h4>
  {chips([("fridge", "یخچال"), ("bulb", "روشنایی"), ("wifi", "مودم و اینترنت"), ("tv", "تلویزیون"), ("pos", "کارتخوان و صندوق")])}
  {ask()}
</div>{folio("۰۳", LABEL)}</section>

<!-- 4 STATION -->
<section class="page sky"><div class="pad">
  <span class="eyebrow">{LEAF}پاوراستیشن</span>
  <h2 class="sec-title">پاور استیشن <span class="ltr">PS-OT600B</span></h2>
  <p class="lead">همراه سبک و قابل حمل برای سفر و کمپینگ؛ شارژ گوشی، لپ‌تاپ و روشنایی چادر رو تضمین می‌کنه.</p>
  <div class="stage">{STATION}</div>
  <div class="specs">
    <div class="spec3d card"><small>اینورتر</small><b class="ltr">900 VA</b></div>
    <div class="spec3d card"><small>ظرفیت باتری</small><b class="ltr">1 kWh</b></div>
    <div class="spec3d card"><small>کاربرد</small><b>سفر و کمپینگ</b></div>
  </div>
  <h4 class="mini">وسایلی که روشن نگه می‌داره</h4>
  {chips([("mobile", "گوشی"), ("laptop", "لپ‌تاپ"), ("bulb", "روشنایی چادر"), ("fan", "پنکه کوچک"), ("wifi", "مودم")])}
  {ask()}
</div>{folio("۰۴", LABEL)}</section>

<!-- 5 POWERBANKS -->
<section class="page"><div class="pad">
  <span class="eyebrow">{LEAF}پاوربانک</span>
  <h2 class="sec-title">پاوربانک‌های <span>۱۰۰ واتی</span></h2>
  <p class="lead">خروجی <span class="ltr">USB-C 100W</span> برای شارژ سریع گوشی و لپ‌تاپ؛ در دو ظرفیت، برای دو سبک زندگی.</p>
  <div class="pb-grid">
    <div class="pb card"><div class="pb-stage">{BANK}</div><span class="tag">پاوربانک</span>
      <h3>پاوربانک ۶۰ آمپرساعت</h3><div class="model ltr">PB600-100W</div>
      <div class="kv"><span>ظرفیت</span><b class="ltr">60Ah</b></div><div class="kv"><span>خروجی</span><b class="ltr">USB-C 100W</b></div>
      <p>برای کسایی که یک روز کامل بیرون‌اند؛ چند بار شارژ کامل گوشی و لپ‌تاپ با یک بار شارژ خودش.</p></div>
    <div class="pb card hot"><div class="pb-stage">{BANK_S}</div><span class="tag">★ پرفروش</span>
      <h3>پاوربانک ۴۰ آمپرساعت</h3><div class="model ltr">PB400-100W</div>
      <div class="kv"><span>ظرفیت</span><b class="ltr">40Ah</b></div><div class="kv"><span>خروجی</span><b class="ltr">USB-C 100W</b></div>
      <p>سبک‌ترین انتخاب برای مسافرت‌های روزمره؛ توی کیف جا می‌شه ولی برای شارژ سریع گوشی و لپ‌تاپ کم نمیاره.</p></div>
  </div>
  <div class="pb-common">{chips([("mobile", "شارژ سریع گوشی"), ("laptop", "شارژ لپ‌تاپ با USB-C"), ("car", "همراه سفر"), ("shield", "حفاظت باتری")])}</div>
  {ask()}
</div>{folio("۰۵", LABEL)}</section>

<!-- 6 GUIDE -->
<section class="page mint"><div class="pad">
  <span class="eyebrow">{LEAF}راهنمای انتخاب</span>
  <h2 class="sec-title">کدوم محصول <span>مناسب</span> شماست؟</h2>
  <p class="lead">اگه مطمئن نیستی کدوم محصول به کارت میاد، این جدول کمکت می‌کنه؛ برای راهنمایی دقیق‌تر هم کافیه تماس بگیری.</p>
  <table class="cmp">
    <thead><tr><th></th><th>پکیج اضطراری</th><th>پاور استیشن</th><th>پاوربانک ۶۰Ah</th><th>پاوربانک ۴۰Ah</th></tr></thead>
    <tbody>
      <tr><td>مدل</td><td class="ltr">2kVA / 3.2kWh</td><td class="ltr">PS-OT600B</td><td class="ltr">PB600-100W</td><td class="ltr">PB400-100W</td></tr>
      <tr><td>توان / ظرفیت</td><td class="ltr">2kVA · 3.2kWh</td><td class="ltr">900VA · 1kWh</td><td class="ltr">60Ah · 100W</td><td class="ltr">40Ah · 100W</td></tr>
      <tr><td>قابل حمل</td><td>ثابت</td><td><i class="y">●</i> دسته‌دار</td><td><i class="y">●</i> کیف و کوله</td><td><i class="y">●</i> جیب و کیف</td></tr>
      <tr><td>یخچال و روشنایی خانه</td><td><i class="y">✓</i></td><td>—</td><td>—</td><td>—</td></tr>
      <tr><td>مغازه و کارتخوان</td><td><i class="y">✓</i></td><td>—</td><td>—</td><td>—</td></tr>
      <tr><td>سفر و کمپینگ</td><td>—</td><td><i class="y">✓</i></td><td><i class="y">✓</i></td><td><i class="y">✓</i></td></tr>
      <tr><td>شارژ گوشی و لپ‌تاپ</td><td><i class="y">✓</i></td><td><i class="y">✓</i></td><td><i class="y">✓</i></td><td><i class="y">✓</i></td></tr>
    </tbody>
  </table>
  <div class="needs">
    <div class="nd"><b>قطعی برق خونه یا مغازه</b><span>← پکیج برق اضطراری ۳.۲ کیلووات</span></div>
    <div class="nd"><b>سفر جاده‌ای و کمپینگ</b><span>← پاور استیشن <span class="ltr">PS-OT600B</span></span></div>
    <div class="nd"><b>یه روز کامل بیرون از خونه</b><span>← پاوربانک <span class="ltr">PB600-100W</span></span></div>
    <div class="nd"><b>همراه روزمره توی کیف</b><span>← پاوربانک <span class="ltr">PB400-100W</span></span></div>
  </div>
</div>{folio("۰۶", LABEL)}</section>

<!-- 7 WHY + STEPS -->
<section class="page"><div class="pad">
  <span class="eyebrow">{LEAF}چرا فردیس انرژی؟</span>
  <h2 class="sec-title">خیالت از <span>برق</span> راحت</h2>
  <div class="feat">
    <div class="f card">{ico("home")}<div><b>ساخته شده برای ایران</b><span>سازگار با شرایط اقلیمی و نیاز کاربران ایرانی</span></div></div>
    <div class="f card">{ico("shield", "o")}<div><b>ضمانت و خدمات</b><span>گارانتی معتبر و خدمات پس از فروش</span></div></div>
    <div class="f card">{ico("phone", "o")}<div><b>پشتیبانی تلفنی سریع</b><span>پاسخ‌گویی صمیمی و تخصصی</span></div></div>
    <div class="f card">{ico("gear")}<div><b>طراحی و توسعه داخلی</b><span>توسط یک تیم جوان و حرفه‌ای</span></div></div>
  </div>
  <h3 class="sub-h">خرید در ۳ قدم</h3>
  <div class="iso-steps">
    <div class="is"><div class="blk"><span>۱</span></div><b>تماس بگیر</b><small>نیازت رو تلفنی بگو</small></div>
    <div class="is"><div class="blk b2"><span>۲</span></div><b>انتخاب کن</b><small>کمکت می‌کنیم بهترین گزینه رو برداری</small></div>
    <div class="is"><div class="blk b3"><span>۳</span></div><b>تحویل بگیر</b><small>ارسال سریع به سراسر کشور</small></div>
  </div>
  <div class="cta"><div><b>هنوز مطمئن نیستی؟</b><span>برای راهنمایی سریع و استعلام قیمت روز، همین الان تماس بگیر.</span></div>
    <div class="call">{ico("phone")}<div><small>تماس بگیرید</small><b class="ltr">{PHONE}</b></div></div></div>
</div>{folio("۰۷", LABEL)}</section>

<!-- 8 BACK -->
<section class="page sky back">
  {SUN}{sky_deco(47)}
  {landscape(seed=48, flowers=22, h=533)}
  <svg class="fl b2"><use href="#bolt3d"/></svg>
  <div class="back-in">
    {brand()}
    <h2>قطعی برق؟<br><em>ما کنارتیم.</em></h2>
    <p class="sub">تأمین و فروش تجهیزات برق قابل‌حمل با کیفیت و پشتیبانی مطمئن. برای مشاوره، استعلام قیمت و سفارش تماس بگیرید.</p>
    <div class="contacts">
      <div class="c card wide big">{ico("phone", "solid")}<div><small>مشاوره، استعلام قیمت و سفارش</small><b class="ltr">{PHONE}</b></div></div>
      <div class="c card wide">{ico("pin", "solid")}<div><small>آدرس</small><b>مشهد، بین چمران ۶ و ۸، پلاک ۷۸، طبقه ۱، واحد ۲</b></div></div>
    </div>
  </div>
</section>
"""
    return page_html("فردیس انرژی - برق قابل حمل", body, CSS)


pathlib.Path(__file__).with_name("fardis-portable-power-brochure.html").write_text(build())
