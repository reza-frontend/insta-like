"""Generates fardis-portable-power-brochure.html with isometric (pseudo-3D) product renders."""
import pathlib

from iso3d import C, S, DARK, ORANGE, STEEL, Iso

PHONE = "0915 550 3263"

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


def scene(fn, podium, cls, **kw):
    iso = Iso()
    fn(iso, **kw)
    if podium:
        iso.podium(*podium)
    return iso.svg(cls=cls)


STATION = scene(station, (85, 47, 120), "r3d")
BANK = scene(bank, (28, 12, 52), "r3d")
BANK_S = scene(lambda i: bank(i, h=92), (28, 12, 52), "r3d")
PACK = scene(package, (80, 50, 128), "r3d")


def cover_scene():
    iso = Iso()
    station(iso, 0, 0)
    bank(iso, 205, 40)
    iso.podium(140, 60, 165, 20)
    return iso.svg(cls="hero3d")


COVER = cover_scene()


def ico(path):
    return f'<span class="ico"><svg viewBox="0 0 24 24">{path}</svg></span>'


I_HOME = '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>'
I_WORK = '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3"/>'
I_CAR = '<path d="M3 16h18l-2-7H5z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'
I_TENT = '<path d="M12 3L2 21h20z"/><path d="M12 3v18M9 21l3-6 3 6"/>'
I_SHIELD = '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>'
I_TRUCK = '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'
I_PHONE = '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'
I_PIN = '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'
I_GEAR = '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'
I_FRIDGE = '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M6 9h12M9 5v2M9 12v3"/>'
I_BULB = '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>'
I_WIFI = '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>'
I_TV = '<rect x="2" y="5" width="20" height="13" rx="2"/><path d="M8 21h8"/>'
I_LAPTOP = '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>'
I_MOBILE = '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'
I_POS = '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h2"/>'
I_FAN = '<circle cx="12" cy="12" r="2"/><path d="M12 10c0-4 1-7 4-7s2 5-2 7M14 12c4 0 7 1 7 4s-5 2-7-2M12 14c0 4-1 7-4 7s-2-5 2-7M10 12c-4 0-7-1-7-4s5-2 7 2"/>'


def chips(items):
    return '<div class="chips">' + "".join(f'<div class="chip">{ico(p)}<span>{t}</span></div>' for p, t in items) + "</div>"


def folio(n):
    return f'<div class="folio"><span><b>فردیس انرژی</b> — تجهیزات برق قابل‌حمل</span><span>{n}</span></div>'


def ask(dark=False):
    return (f'<div class="ask{" dark" if dark else ""}"><div><small>قیمت</small><b>استعلامی</b></div>'
            f'<div class="call">{ico(I_PHONE)}<div><small>برای استعلام تماس بگیرید</small><b class="ltr">{PHONE}</b></div></div></div>')


CSS = pathlib.Path(__file__).with_name("portable.css").read_text()

html = f"""<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>فردیس انرژی - برق قابل حمل</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800;900&display=swap" rel="stylesheet">
<style>
{CSS}
</style>
</head>
<body>

<svg width="0" height="0" style="position:absolute">
  <defs>
    <linearGradient id="podTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC676"/><stop offset="1" stop-color="#F28C0F"/></linearGradient>
    <linearGradient id="podSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E07F08"/><stop offset=".6" stop-color="#C96F05"/><stop offset="1" stop-color="#9E5703"/></linearGradient>
    <filter id="blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <symbol id="logo" viewBox="0 0 48 48">
      <circle cx="24" cy="20" r="9" style="fill:var(--sun,#F28C0F)"/>
      <g style="stroke:var(--sun,#F28C0F)" stroke-width="3" stroke-linecap="round"><path d="M24 3v4M24 33v4M7 20h4M37 20h4M12 8l3 3M33 29l3 3M36 8l-3 3M15 29l-3 3"/></g>
      <path d="M6 44 L14 34 H34 L42 44 Z" fill="currentColor"/>
      <path d="M17.5 34 L15 44 M24 34 V44 M30.5 34 L33 44 M10 39 H38" style="stroke:var(--grid,#16181D)" stroke-width="1.4"/>
    </symbol>
    <symbol id="bolt3d" viewBox="0 0 110 150">
      <path d="M70 6 L18 84 h32 l-10 60 L96 60 H62 Z" fill="#9E5703" transform="translate(10 6)"/>
      <path d="M70 6 L18 84 h32 l-10 60 L96 60 H62 Z" fill="url(#podTop)"/>
      <path d="M70 6 L18 84 h32" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>
    </symbol>
    <symbol id="boltDark" viewBox="0 0 110 150">
      <path d="M70 6 L18 84 h32 l-10 60 L96 60 H62 Z" fill="#000" opacity=".35" transform="translate(10 6)"/>
      <path d="M70 6 L18 84 h32 l-10 60 L96 60 H62 Z" fill="#16181D"/>
      <path d="M70 6 L18 84 h32" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
    </symbol>
    <symbol id="cube" viewBox="0 0 40 46">
      <path d="M20 0 L40 11.5 L20 23 L0 11.5Z" fill="#FFB24D"/><path d="M0 11.5 L20 23 V46 L0 34.5Z" fill="#F28C0F"/><path d="M40 11.5 L20 23 V46 L40 34.5Z" fill="#C96F05"/>
    </symbol>
  </defs>
</svg>

<!-- 1 COVER -->
<section class="page cover">
  <div class="grid"></div>
  <div class="brand">
    <svg class="logo-mark" style="color:#16181D;--grid:#DDF0FC"><use href="#logo"/></svg>
    <div class="brand-name">فردیس انرژی<small>FARDIS ENERGY</small></div>
  </div>
  <span class="sub-brand">تجهیزات برق قابل‌حمل</span>
  <div class="cover-body">
    <h1>برق مطمئن،<br><em>هرجا</em> که بهش<br>نیاز داری</h1>
    <p class="desc">محصولات قابل حمل و اضطراری برای خانه، محل کار، سفر و کمپینگ</p>
    <span class="calm">دیگه نگران قطع برق نباش؛ ما کنارتیم.</span>
  </div>
  <svg class="fl c1"><use href="#cube"/></svg><svg class="fl c2"><use href="#cube"/></svg><svg class="fl c3"><use href="#cube"/></svg>
  <svg class="fl b1"><use href="#bolt3d"/></svg>
  <div class="hero-wrap">{COVER}</div>
  <div class="badges">
    <div class="badge">{ico(I_SHIELD)}<div><b>ایمن و مطمئن</b><span>حفاظت باتری و اصالت کالا</span></div></div>
    <div class="badge">{ico(I_TRUCK)}<div><b>ارسال سریع</b><span>به سراسر کشور</span></div></div>
  </div>
</section>

<!-- 2 SCENARIOS -->
<section class="page"><div class="pad">
  <span class="eyebrow">کجا به کارت میاد؟</span>
  <h2 class="sec-title">قطعی برق، دیگه <span>مسئله</span> نیست</h2>
  <p class="lead">چه توی خونه باشی، چه سر کار یا وسط جاده؛ یه منبع برق مطمئن همیشه همراهته.</p>
  <div class="scen">
    <div class="sc">
      <div class="sc-n">۰۱</div>{ico(I_HOME)}
      <h3>خانه</h3><p>وقتی برق می‌ره، یخچال، روشنایی و مودم روشن می‌مونن و زندگی روال عادیش رو ادامه می‌ده.</p>
      <span class="pick">پکیج برق اضطراری</span>
    </div>
    <div class="sc">
      <div class="sc-n">۰۲</div>{ico(I_WORK)}
      <h3>محل کار و مغازه</h3><p>کارتخوان، روشنایی و سیستم فروش قطع نمی‌شن؛ مشتری منتظر نمی‌مونه.</p>
      <span class="pick">پکیج برق اضطراری</span>
    </div>
    <div class="sc">
      <div class="sc-n">۰۳</div>{ico(I_CAR)}
      <h3>سفر</h3><p>شارژ گوشی و لپ‌تاپ در طول مسیر، بدون نگرانی از پیدا کردن پریز.</p>
      <span class="pick">پاوربانک‌ها و پاور استیشن</span>
    </div>
    <div class="sc">
      <div class="sc-n">۰۴</div>{ico(I_TENT)}
      <h3>کمپینگ</h3><p>روشنایی چادر، شارژ وسایل و یه شب آروم توی طبیعت، دور از شبکه برق.</p>
      <span class="pick">پاور استیشن</span>
    </div>
  </div>
  <div class="quote3d">
    <svg class="qb"><use href="#bolt3d"/></svg>
    <div><b>برق، همون‌جایی که لازمش داری.</b><span>از یه پاوربانک توی کیف تا پکیجی که کل خونه رو سرپا نگه می‌داره.</span></div>
  </div>
  {folio("۰۲")}
</div></section>

<!-- 3 PACKAGE -->
<section class="page dark"><div class="pad">
  <span class="eyebrow">پکیج</span>
  <h2 class="sec-title">پکیج برق اضطراری <span>۳.۲ کیلووات</span></h2>
  <p class="lead">برای خونه و مغازه‌ای که قطعی برق اذیتش می‌کنه؛ یخچال، روشنایی و وسایل ضروری رو ساعت‌ها روشن نگه می‌داره.</p>
  <div class="stage">{PACK}<div class="glow"></div></div>
  <div class="specs">
    <div class="spec3d"><small>اینورتر</small><b class="ltr">2 kVA</b></div>
    <div class="spec3d"><small>ظرفیت باتری</small><b class="ltr">3.2 kWh</b></div>
    <div class="spec3d"><small>کاربرد</small><b>خانه و مغازه</b></div>
  </div>
  <h4 class="mini">وسایلی که روشن نگه می‌داره</h4>
  {chips([(I_FRIDGE, "یخچال"), (I_BULB, "روشنایی"), (I_WIFI, "مودم و اینترنت"), (I_TV, "تلویزیون"), (I_POS, "کارتخوان و صندوق")])}
  {ask(True)}
  {folio("۰۳")}
</div></section>

<!-- 4 STATION -->
<section class="page"><div class="pad">
  <span class="eyebrow">پاوراستیشن</span>
  <h2 class="sec-title">پاور استیشن <span class="ltr">PS-OT600B</span></h2>
  <p class="lead">همراه سبک و قابل حمل برای سفر و کمپینگ؛ شارژ گوشی، لپ‌تاپ و روشنایی چادر رو تضمین می‌کنه.</p>
  <div class="stage light">{STATION}<div class="glow"></div></div>
  <div class="specs">
    <div class="spec3d"><small>اینورتر</small><b class="ltr">900 VA</b></div>
    <div class="spec3d"><small>ظرفیت باتری</small><b class="ltr">1 kWh</b></div>
    <div class="spec3d"><small>کاربرد</small><b>سفر و کمپینگ</b></div>
  </div>
  <h4 class="mini">وسایلی که روشن نگه می‌داره</h4>
  {chips([(I_MOBILE, "گوشی"), (I_LAPTOP, "لپ‌تاپ"), (I_BULB, "روشنایی چادر"), (I_FAN, "پنکه کوچک"), (I_WIFI, "مودم")])}
  {ask()}
  {folio("۰۴")}
</div></section>

<!-- 5 POWERBANKS -->
<section class="page"><div class="pad">
  <span class="eyebrow">پاوربانک</span>
  <h2 class="sec-title">پاوربانک‌های <span>۱۰۰ واتی</span></h2>
  <p class="lead">خروجی <span class="ltr">USB-C 100W</span> برای شارژ سریع گوشی و لپ‌تاپ؛ در دو ظرفیت، برای دو سبک زندگی.</p>
  <div class="pb-grid">
    <div class="pb">
      <div class="pb-stage">{BANK}</div>
      <span class="tag">پاوربانک</span>
      <h3>پاوربانک ۶۰ آمپرساعت</h3><div class="model ltr">PB600-100W</div>
      <div class="kv"><span>ظرفیت</span><b class="ltr">60Ah</b></div>
      <div class="kv"><span>خروجی</span><b class="ltr">USB-C 100W</b></div>
      <p>برای کسایی که یک روز کامل بیرون‌اند؛ چند بار شارژ کامل گوشی و لپ‌تاپ با یک بار شارژ خودش.</p>
    </div>
    <div class="pb hot">
      <div class="pb-stage">{BANK_S}</div>
      <span class="tag">★ پرفروش</span>
      <h3>پاوربانک ۴۰ آمپرساعت</h3><div class="model ltr">PB400-100W</div>
      <div class="kv"><span>ظرفیت</span><b class="ltr">40Ah</b></div>
      <div class="kv"><span>خروجی</span><b class="ltr">USB-C 100W</b></div>
      <p>سبک‌ترین انتخاب برای مسافرت‌های روزمره؛ توی کیف جا می‌شه ولی برای شارژ سریع گوشی و لپ‌تاپ کم نمیاره.</p>
    </div>
  </div>
  <div class="pb-common">{chips([(I_MOBILE, "شارژ سریع گوشی"), (I_LAPTOP, "شارژ لپ‌تاپ با USB-C"), (I_CAR, "همراه سفر"), (I_SHIELD, "حفاظت باتری")])}</div>
  {ask()}
  {folio("۰۵")}
</div></section>

<!-- 6 GUIDE -->
<section class="page"><div class="pad">
  <span class="eyebrow">راهنمای انتخاب</span>
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
  {folio("۰۶")}
</div></section>

<!-- 7 WHY + STEPS -->
<section class="page"><div class="pad">
  <span class="eyebrow">چرا فردیس انرژی؟</span>
  <h2 class="sec-title">خیالت از <span>برق</span> راحت</h2>
  <div class="feat">
    <div class="f">{ico(I_HOME)}<div><b>ساخته شده برای ایران</b><span>سازگار با شرایط اقلیمی و نیاز کاربران ایرانی</span></div></div>
    <div class="f">{ico(I_SHIELD)}<div><b>ضمانت و خدمات</b><span>گارانتی معتبر و خدمات پس از فروش</span></div></div>
    <div class="f">{ico(I_PHONE)}<div><b>پشتیبانی تلفنی سریع</b><span>پاسخ‌گویی صمیمی و تخصصی</span></div></div>
    <div class="f">{ico(I_GEAR)}<div><b>طراحی و توسعه داخلی</b><span>توسط یک تیم جوان و حرفه‌ای</span></div></div>
  </div>
  <h3 class="sub-h">خرید در ۳ قدم</h3>
  <div class="iso-steps">
    <div class="is"><div class="blk"><span>۱</span></div><b>تماس بگیر</b><small>نیازت رو تلفنی بگو</small></div>
    <div class="is"><div class="blk b2"><span>۲</span></div><b>انتخاب کن</b><small>کمکت می‌کنیم بهترین گزینه رو برداری</small></div>
    <div class="is"><div class="blk b3"><span>۳</span></div><b>تحویل بگیر</b><small>ارسال سریع به سراسر کشور</small></div>
  </div>
  <div class="cta">
    <div><b>هنوز مطمئن نیستی؟</b><span>برای راهنمایی سریع و استعلام قیمت روز، همین الان تماس بگیر.</span></div>
    <span class="btn ltr">{PHONE}</span>
  </div>
  {folio("۰۷")}
</div></section>

<!-- 8 BACK -->
<section class="page back">
  <div class="ring"></div><div class="ring two"></div>
  <div class="back-in">
    <div class="brand">
      <svg class="logo-mark" style="color:#16181D;--sun:#16181D;--grid:#F28C0F"><use href="#logo"/></svg>
      <div class="brand-name">فردیس انرژی<small>FARDIS ENERGY</small></div>
    </div>
    <h2>قطعی برق؟<br><span>ما کنارتیم.</span></h2>
    <p class="sub">تأمین و فروش تجهیزات برق قابل‌حمل با کیفیت و پشتیبانی مطمئن. برای مشاوره، استعلام قیمت و سفارش تماس بگیرید.</p>
    <svg class="bolt-big"><use href="#boltDark"/></svg>
    <div class="contacts">
      <div class="c wide big">{ico(I_PHONE)}<div><small>مشاوره، استعلام قیمت و سفارش</small><b class="ltr">{PHONE}</b></div></div>
      <div class="c wide">{ico(I_PIN)}<div><small>آدرس</small><b>مشهد، بین چمران ۶ و ۸، پلاک ۷۸، طبقه ۱، واحد ۲</b></div></div>
    </div>
    <div class="back-foot"><span>فردیس انرژی — تجهیزات برق قابل‌حمل</span><span>ارسال به سراسر کشور</span></div>
  </div>
</section>

</body>
</html>
"""
pathlib.Path(__file__).with_name("fardis-portable-power-brochure.html").write_text(html)
