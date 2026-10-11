/* هسته مشترک سایت: داده، ابزارها، هدر/فوتر، سبد، کارت‌ها، اسلایدر و کاروسل
   داده‌ها از data/content.js (تولیدشده توسط پنل مدیریت) خوانده می‌شوند. */
(function () {
  "use strict";
  const C = window.CONTENT;
  const SITE = C.site, CATEGORIES = C.categories, BRANDS = C.brands, PRODUCTS = C.products, POSTS = C.posts, FAQ = C.faq;

  /* ---------- ابزارها ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = v => String(v ?? "").replace(/[&<>"']/g, ch => ESC[ch]);
  const fa = n => String(n ?? "").replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const money = n => fa(Number(n).toLocaleString("en-US")) + " تومان";
  const qs = k => new URLSearchParams(location.search).get(k);
  const tel = s => "tel:" + String(s).replace(/[^\d+]/g, "");
  const paragraphs = t => String(t || "").split(/\n+/).filter(Boolean).map(l => `<p>${esc(l)}</p>`).join("");
  const byId = (list, id) => list.find(x => String(x.id) === String(id));
  const catTitle = id => byId(CATEGORIES, id)?.title || "";
  const brandTitle = id => byId(BRANDS, id)?.title || "";
  const childCats = id => CATEGORIES.filter(c => c.parent === id);
  /* محصول متعلق به دسته است اگر مستقیم یا در زیر‌دسته آن باشد */
  const inCat = (p, id) => !id || p.cat === id || byId(CATEGORIES, p.cat)?.parent === id;
  const productUrl = p => `product.html?id=${p.id}`;

  /* عکس با جایگزین برداری: اگر فایل پیدا نشود، شنونده خطا آن را با آیکن عوض می‌کند */
  const img = (src, alt, iconName) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" data-icon="${esc(iconName)}">`;
  document.addEventListener("error", e => {
    const t = e.target;
    if (t.tagName === "IMG" && t.dataset.icon !== undefined) t.outerHTML = icon(t.dataset.icon);
  }, true);
  const productImg = p => img(p.image || `assets/img/products/${p.slug}.jpg`, p.title, p.icon);
  const catImg = c => img(c.image || `assets/img/categories/${c.id}.jpg`, c.title, c.icon);
  const postImg = p => img(p.image || `assets/img/blog/${p.id}.jpg`, p.title, p.icon);
  const stars = n => n ? `<div class="stars" aria-label="امتیاز ${fa(n)} از ۵">${"<i>★</i>".repeat(n)}${"★".repeat(5 - n)}</div>` : "";
  /* اگر فایل وجود داشت ok اجرا می‌شود */
  const probe = (src, ok) => { if (!src) return; const im = new Image(); im.onload = () => ok(src); im.src = src; };

  /* ---------- سبد خرید / لیست سفارش (localStorage) ---------- */
  const CART_KEY = "medshop_cart";
  const Cart = {
    get() {
      try { return (JSON.parse(localStorage.getItem(CART_KEY)) || []).filter(i => byId(PRODUCTS, i.id)); }
      catch (e) { return []; }
    },
    save(items) { try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {} Cart.render(); },
    add(id, qty = 1) {
      const items = Cart.get(), it = items.find(i => i.id === id);
      it ? it.qty += qty : items.push({ id, qty });
      Cart.save(items);
      toast(`«${esc(byId(PRODUCTS, id).title)}» به لیست سفارش اضافه شد`);
    },
    set(id, qty) { const items = Cart.get(), it = items.find(i => i.id === id); if (it) it.qty = Math.max(1, qty); Cart.save(items); },
    remove(id) { Cart.save(Cart.get().filter(i => i.id !== id)); },
    clear() { Cart.save([]); },
    count() { return Cart.get().reduce((s, i) => s + i.qty, 0); },
    render() { $$(".cart-count").forEach(el => el.textContent = fa(Cart.count())); document.dispatchEvent(new Event("cart:change")); }
  };
  /* افزودن به سبد با data-add (بدون onclick درون‌خطی) */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-add]");
    if (b && !b.disabled) Cart.add(+b.dataset.add, +(b.dataset.qty || 1));
  });

  function toast(html) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = `<span>✓</span> ${html} <a href="cart.html">مشاهده</a>`;
    t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2800);
  }

  /* ---------- ارسال فرم به سرور (api/order.php) ----------
     اگر سایت بدون PHP اجرا شود (مثلاً باز کردن مستقیم فایل)، false برمی‌گرداند تا صفحه روش جایگزین را اجرا کند */
  async function sendLead(data) {
    if (location.protocol === "file:") return false;
    try {
      const r = await fetch("api/order.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "خطا در ارسال");
      return true;
    } catch (e) {
      if (e instanceof TypeError) return false; /* سرور در دسترس نیست */
      throw e;
    }
  }

  /* ---------- آیکن‌های رابط ---------- */
  const sv = (d, s = 18) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const UI = {
    cart: sv('<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/>'),
    search: sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 17),
    phone: sv('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>', 16),
    phoneFill: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>`,
    mail: sv('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>', 16),
    pin: sv('<path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>', 16),
    zoom: sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 16),
    up: sv('<path d="m18 15-6-6-6 6"/>', 16),
    filter: sv('<path d="M3 6h11M18 6h3M3 12h5M12 12h9M3 18h13M20 18h1"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>', 16)
  };

  /* لوگو: اگر assets/img/logo.png باشد جایگزین لوگوی متنی می‌شود */
  const [w1, ...wr] = String(SITE.nameEn || SITE.name).split(" ");
  const logo = () => `<a class="logo" href="index.html" aria-label="${esc(SITE.name)}"><span class="lt"><small>${esc(wr.join(" "))}</small><b>${esc(w1)}</b></span></a>`;

  /* ---------- کارت‌ها ---------- */
  function card(p) {
    const price = p.price ? `<div class="price">${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}<b>${money(p.price)}</b></div>` : "";
    return `<article class="p-card">
      ${p.stock ? "" : `<span class="badge">ناموجود</span>`}
      <a class="p-zoom" href="${productUrl(p)}" aria-label="مشاهده ${esc(p.title)}">${UI.zoom}</a>
      <a href="${productUrl(p)}" class="p-img">${productImg(p)}</a>
      <div class="p-body">
        <h3><a href="${productUrl(p)}">${esc(p.title)}</a></h3>
        <div class="p-foot">${stars(p.rating)}${price}
          <button class="btn-icon" data-add="${p.id}" ${p.stock ? "" : "disabled"} aria-label="افزودن به لیست سفارش">${UI.cart}</button>
        </div>
      </div></article>`;
  }
  const catCard = c => `<a class="cat-card" href="shop.html?cat=${esc(c.id)}"><div class="cimg" style="background:${esc(c.bg)}">${catImg(c)}</div><b>${esc(c.title)}</b></a>`;
  const brandCard = b => `<a class="brand" href="shop.html?brand=${esc(b.id)}" title="${esc(b.title)}">${b.logo
    ? `<img src="${esc(b.logo)}" alt="${esc(b.en)}" loading="lazy">` : `<b style="${esc(b.style)}">${esc(b.en)}</b>`}</a>`;
  const postCard = p => `<a class="post" href="post.html?id=${p.id}"><div class="pi">${postImg(p)}</div><div class="post-b">
      <div class="meta"><span>${esc(p.cat)}</span><span>${esc(fa(p.date))}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p></div></a>`;

  /* ---------- هدر ---------- */
  function header() {
    const top = CATEGORIES.filter(c => !c.parent);
    const mega = top.map(c => `<a href="shop.html?cat=${esc(c.id)}"><span class="mi" style="background:${esc(c.bg)}">${icon(c.icon)}</span>${esc(c.title)}</a>`).join("");
    const catalog = SITE.catalog ? `<a href="${esc(SITE.catalog)}" target="_blank" rel="noopener">دانلود کاتالوگ</a>` : "";
    return `
    <header class="site-header"><div class="container hdr">
      <button class="burger" aria-label="منو" data-nav="open"><span></span><span></span><span></span></button>
      ${logo()}
      <nav class="hnav" aria-label="منوی اصلی">
        <div class="cat-menu"><button class="cat-btn" aria-haspopup="true"><span class="bars"></span> دسته بندی محصولات ⌄</button><div class="mega">${mega}</div></div>
        <a class="center" href="shop.html">محصولات</a>${catalog}
        <a href="blog.html">مقالات</a><a href="about.html">درباره ما</a><a href="contact.html">تماس با ما</a>
      </nav>
      <form class="search" action="shop.html" role="search"><input name="q" aria-label="جستجو" placeholder="جستجو برای محصولات" value="${esc(qs("q") || "")}"><button aria-label="جستجو">${UI.search}</button></form>
      <span class="lang"><i class="flag"></i> فارسی</span>
      <a class="cart-btn" href="cart.html" aria-label="لیست سفارش">${UI.cart}<i class="cart-count">۰</i></a>
    </div></header>
    <div class="mnav"><div class="mnav-in">
      <div class="mnav-head">${logo()}<button data-nav="close" aria-label="بستن">✕</button></div>
      <form action="shop.html" role="search"><input name="q" aria-label="جستجو" placeholder="جستجو برای محصولات"><button aria-label="جستجو">${UI.search}</button></form>
      <a href="index.html">صفحه نخست</a><a href="shop.html">محصولات</a>${catalog}<a href="blog.html">مقالات</a><a href="about.html">درباره ما</a><a href="contact.html">تماس با ما</a><a href="cart.html">لیست سفارش</a>
      <div class="mnav-sep">دسته بندی محصولات</div>
      ${top.map(c => `<a href="shop.html?cat=${esc(c.id)}">${esc(c.title)}</a>`).join("")}
    </div><div class="mnav-bg" data-nav="close"></div></div>`;
  }

  /* ---------- فوتر ---------- */
  const SOCIAL = [["facebook", "f"], ["twitter", "x"], ["instagram", "ig"], ["telegram", "tg"], ["linkedin", "in"], ["youtube", "▶"], ["pinterest", "p"]];
  function footer() {
    const ck = `<i class="ck">✓</i>`;
    const soc = SOCIAL.filter(([k]) => SITE.social?.[k]).map(([k, t]) => `<a href="${esc(SITE.social[k])}" target="_blank" rel="noopener" aria-label="${k}">${t}</a>`).join("");
    const wa = SITE.whatsapp ? `<a class="float-wa" href="https://wa.me/${esc(SITE.whatsapp)}" target="_blank" rel="noopener" aria-label="واتساپ">WA</a>` : "";
    return `
    <footer class="site-footer"><div class="container f-grid">
      <div class="f-brand">${logo()}${soc ? `<div class="social">${soc}</div>` : ""}</div>
      <div><div class="f-title">دسترسی سریع</div>
        <div class="f-links"><a href="index.html">${ck}صفحه نخست</a><a href="shop.html?cat=stapler">${ck}استپلر جراحی</a>
          <a href="shop.html">${ck}محصولات</a><a href="shop.html?cat=stapler-skin">${ck}استپلر پوستی</a>
          <a href="about.html">${ck}درباره ما</a><a href="shop.html?cat=mesh">${ck}مش و تکر مش جراحی</a>
          <a href="contact.html">${ck}تماس با ما</a><a href="blog.html">${ck}مقالات</a></div></div>
      <div class="f-contact"><div class="f-title">اطلاعات تماس</div>
        <p>${UI.pin}<span>${esc(SITE.address)}</span></p>
        <p>${UI.phone}<span><a href="${tel(SITE.phone)}" dir="ltr">${esc(fa(SITE.phone))}</a>${SITE.fax ? ` &nbsp; فکس: <span dir="ltr">${esc(fa(SITE.fax))}</span>` : ""}</span></p>
        <p>${UI.mail}<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></p>
      </div>
    </div>
    <div class="copy">تمامی حقوق برای سایت ${esc(SITE.name)} محفوظ است.</div></footer>
    <a class="float-call" href="${tel(SITE.phone)}" aria-label="تماس">${UI.phoneFill}</a>${wa}
    <button class="to-top" aria-label="بازگشت به بالا">${UI.up}</button>`;
  }

  /* ---------- اسلایدر و کاروسل ---------- */
  function slider(root) {
    const slides = $$(".slide", root), dots = $(".dots", root);
    if (!slides.length) return;
    let i = 0, t;
    slides.forEach(s => probe(s.dataset.img, src => { s.style.backgroundImage = `url("${src}")`; s.classList.add("has-img"); }));
    dots.innerHTML = slides.map((_, k) => `<button aria-label="اسلاید ${fa(k + 1)}"></button>`).join("");
    const go = k => {
      i = (k + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle("on", j === i));
      $$("button", dots).forEach((b, j) => b.classList.toggle("on", j === i));
    };
    const auto = () => { clearInterval(t); if (slides.length > 1) t = setInterval(() => go(i + 1), 6000); };
    $$("button", dots).forEach((b, k) => b.onclick = () => { go(k); auto(); });
    $(".s-prev", root).onclick = () => { go(i - 1); auto(); };
    $(".s-next", root).onclick = () => { go(i + 1); auto(); };
    go(0); auto();
  }
  function carousel(root) {
    const track = $(".track", root); if (!track) return;
    const step = () => (track.firstElementChild?.offsetWidth || 240) + 10;
    const prev = $(".c-prev", root), next = $(".c-next", root), dots = $(".c-dots", root);
    if (prev) prev.onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
    if (next) next.onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
    if (!dots) return;
    const draw = () => {
      const n = Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.05));
      const cur = Math.round(Math.abs(track.scrollLeft) / track.clientWidth);
      dots.innerHTML = n < 2 ? "" : Array.from({ length: n }, (_, k) => `<button class="${k === cur ? "on" : ""}" aria-label="صفحه ${fa(k + 1)}"></button>`).join("");
      $$("button", dots).forEach((b, k) => b.onclick = () => track.scrollTo({ left: -k * track.clientWidth, behavior: "smooth" }));
    };
    track.addEventListener("scroll", () => { clearTimeout(track._d); track._d = setTimeout(draw, 120); }, { passive: true });
    addEventListener("resize", draw); draw();
  }

  /* ---------- راه‌اندازی ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const h = $("#site-header"), f = $("#site-footer");
    if (h) h.outerHTML = header();
    if (f) f.outerHTML = footer();
    probe("assets/img/logo.png", src => $$(".logo").forEach(l => l.innerHTML = `<img src="${src}" alt="${esc(SITE.name)}" height="44">`));
    document.addEventListener("click", e => {
      const n = e.target.closest("[data-nav]");
      if (n) document.body.classList.toggle("nav-open", n.dataset.nav === "open");
      if (e.target.closest(".to-top")) scrollTo({ top: 0, behavior: "smooth" });
    });
    Cart.render();
    $$(".slider").forEach(slider);
    $$(".carousel").forEach(carousel);
    const onScroll = () => document.body.classList.toggle("scrolled", scrollY > 60);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    document.title = document.title.replace("{name}", SITE.name);
  });

  Object.assign(window, {
    SITE, CATEGORIES, BRANDS, PRODUCTS, POSTS, FAQ, UI,
    $, $$, esc, fa, money, qs, tel, paragraphs, byId, catTitle, brandTitle, childCats, inCat, productUrl,
    img, productImg, catImg, postImg, stars, probe, Cart, toast, sendLead, card, catCard, brandCard, postCard
  });
})();
