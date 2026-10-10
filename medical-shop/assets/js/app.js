/* هسته مشترک سایت: هدر، فوتر، سبد خرید، کارت محصول، اسلایدر */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fa = n => String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const money = n => fa(Number(n).toLocaleString("en-US")) + " تومان";
  const qs = k => new URLSearchParams(location.search).get(k);
  const catTitle = id => {
    for (const c of CATEGORIES) {
      if (c.id === id) return c.title;
      for (const ch of c.children || []) if (ch.id === id) return ch.title;
    }
    return "";
  };
  const brandTitle = id => (BRANDS.find(b => b.id === id) || {}).title || "";
  /* عکس با جایگزین: اگر فایل نبود، آیکن برداری نمایش داده می‌شود */
  const imgOr = (src, alt, iconName) => `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.outerHTML=icon('${iconName}')">`;
  /* عکس محصول: اول p.image، بعد assets/img/products/<slug>.jpg */
  const productImg = p => imgOr(p.image || `assets/img/products/${p.slug}.jpg`, p.title, p.icon);
  const catImg = c => imgOr(c.image || `assets/img/categories/${c.id}.jpg`, c.title, c.icon);
  const stars = n => `<div class="stars" title="${fa(n)} از ۵">${"<i>★</i>".repeat(n)}${"★".repeat(5 - n)}</div>`;
  /* اگر فایل وجود داشت callback اجرا می‌شود */
  const probe = (src, ok) => { const im = new Image(); im.onload = () => ok(src); im.src = src; };

  /* ---------- سبد خرید (localStorage) ---------- */
  const CART_KEY = "medshop_cart";
  const Cart = {
    get() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } },
    save(items) { try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {} Cart.render(); },
    add(id, qty = 1) {
      const items = Cart.get(); const it = items.find(i => i.id === id);
      it ? it.qty += qty : items.push({ id, qty });
      Cart.save(items);
      toast(`«${PRODUCTS.find(x => x.id === id).title}» به لیست سفارش اضافه شد`);
    },
    set(id, qty) { const items = Cart.get(); const it = items.find(i => i.id === id); if (it) it.qty = Math.max(1, qty); Cart.save(items); },
    remove(id) { Cart.save(Cart.get().filter(i => i.id !== id)); },
    count() { return Cart.get().reduce((s, i) => s + i.qty, 0); },
    render() { $$(".cart-count").forEach(el => el.textContent = fa(Cart.count())); document.dispatchEvent(new Event("cart:change")); }
  };

  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
    t.innerHTML = `<span>✓</span> ${msg} <a href="cart.html">مشاهده</a>`;
    t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2800);
  }

  /* ---------- آیکن‌های رابط ---------- */
  const sv = (d, s = 18) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const svgCart = sv('<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/>');
  const svgSearch = sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 17);
  const svgPhone = sv('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>', 16);
  const svgPhoneFill = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>`;
  const svgMail = sv('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>', 16);
  const svgPin = sv('<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/><circle cx="10" cy="10" r="2"/>', 16);
  const svgZoom = sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/>', 15);

  /* لوگو: اگر assets/img/logo.png باشد همان نمایش داده می‌شود، وگرنه لوگوی متنی */
  const [w1, ...wr] = SITE.nameEn.split(" ");
  const logo = () => `<a class="logo" href="index.html" aria-label="${SITE.name}"><span class="lt"><small>${wr.join(" ")}</small><b>${w1}</b></span></a>`;

  /* ---------- کارت محصول ---------- */
  function card(p) {
    const price = p.price ? `<div class="price">${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}<b>${money(p.price)}</b></div>` : "";
    return `<article class="p-card">
      ${!p.stock ? `<span class="badge">ناموجود</span>` : ""}
      <a class="p-zoom" href="product.html?id=${p.id}" aria-label="مشاهده">${svgZoom}</a>
      <a href="product.html?id=${p.id}" class="p-img">${productImg(p)}</a>
      <div class="p-body">
        <h3><a href="product.html?id=${p.id}">${p.title}</a></h3>
        <div class="p-foot">${stars(p.rating || 4)}${price}
          <button class="btn-icon" ${p.stock ? "" : "disabled"} onclick="Cart.add(${p.id})" title="افزودن به لیست سفارش">${svgCart}</button>
        </div>
      </div></article>`;
  }
  const catCard = c => `<a class="cat-card" href="shop.html?cat=${c.id}"><div class="cimg" style="background:${c.bg}">${catImg(c)}</div><b>${c.title}</b></a>`;
  const brandCard = b => `<a class="brand" href="shop.html?brand=${b.id}" title="${b.title}">${b.logo ? `<img src="${b.logo}" alt="${b.en}">` : `<b style="${b.style || ""}">${b.en}</b>`}</a>`;

  /* ---------- هدر ---------- */
  function header() {
    const mega = CATEGORIES.map(c => `<a href="shop.html?cat=${c.id}"><span class="mi" style="background:${c.bg}">${icon(c.icon)}</span>${c.title}</a>`).join("");
    return `
    <header class="site-header"><div class="container hdr">
      <button class="burger" aria-label="منو" onclick="document.body.classList.toggle('nav-open')"><span></span><span></span><span></span></button>
      ${logo()}
      <nav class="hnav">
        <div class="cat-menu"><button class="cat-btn"><span class="bars"></span> دسته بندی محصولات ⌄</button><div class="mega">${mega}</div></div>
        <a class="center" href="shop.html">محصولات</a>
        <a href="${SITE.catalog}">دانلود کاتالوگ</a>
        <a href="about.html">درباره ما</a>
        <a href="contact.html">تماس با ما</a>
      </nav>
      <form class="search" action="shop.html"><input name="q" placeholder="جستجو برای محصولات" value="${qs("q") || ""}"><button aria-label="جستجو">${svgSearch}</button></form>
      <span class="lang"><i class="flag"></i> فارسی ⌄</span>
      <a class="cart-btn" href="cart.html" title="لیست سفارش">${svgCart}<i class="cart-count">۰</i></a>
    </div></header>
    <div class="mnav"><div class="mnav-in">
      <div class="mnav-head">${logo()}<button onclick="document.body.classList.remove('nav-open')">✕</button></div>
      <form action="shop.html"><input name="q" placeholder="جستجو برای محصولات"><button>${svgSearch}</button></form>
      <a href="index.html">صفحه نخست</a><a href="shop.html">محصولات</a><a href="${SITE.catalog}">دانلود کاتالوگ</a><a href="about.html">درباره ما</a><a href="contact.html">تماس با ما</a><a href="blog.html">مقالات</a><a href="cart.html">لیست سفارش</a>
      <div class="mnav-sep">دسته بندی محصولات</div>
      ${CATEGORIES.map(c => `<a href="shop.html?cat=${c.id}">${c.title}</a>`).join("")}
    </div><div class="mnav-bg" onclick="document.body.classList.remove('nav-open')"></div></div>`;
  }

  /* ---------- فوتر ---------- */
  function footer() {
    const ck = `<i class="ck">✓</i>`;
    const soc = [["facebook", "f"], ["twitter", "t"], ["instagram", "ig"], ["youtube", "▶"], ["pinterest", "p"]];
    return `
    <footer class="site-footer"><div class="container f-grid">
      <div class="f-brand">${logo()}<div class="social">${soc.map(([k, t]) => `<a href="${SITE[k] || "#"}" aria-label="${k}">${t}</a>`).join("")}</div></div>
      <div><div class="f-title">دسترسی سریع</div>
        <div class="f-links"><a href="index.html">${ck}صفحه نخست</a><a href="shop.html?cat=stapler">استپلر جراحی</a>
          <a href="shop.html">${ck}محصولات</a><a href="shop.html?cat=stapler-skin">استپلر پوستی</a>
          <a href="about.html">${ck}درباره ما</a><a href="shop.html?cat=mesh">مش و تکر مش جراحی</a>
          <a href="contact.html">${ck}تماس با ما</a><a href="blog.html">مقالات</a></div></div>
      <div class="f-contact"><div class="f-title">اطلاعات تماس</div>
        <p>${svgPin}<span>${SITE.address}</span></p>
        <p>${svgPhone}<span><a href="tel:${SITE.phoneRaw}">${fa(SITE.phone)}</a> &nbsp; فکس: ${fa(SITE.fax)}</span></p>
        <p>${svgMail}<a href="mailto:${SITE.email}">${SITE.email}</a></p>
      </div>
    </div>
    <div class="copy">تمامی حقوق برای سایت ${SITE.name} محفوظ است.</div>
    <div class="lang-bar"><span>English 🇬🇧</span><span><i class="flag"></i> فارسی</span></div></footer>
    <a class="float-call" href="tel:${SITE.phoneRaw}" aria-label="تماس">${svgPhoneFill}</a>
    <a class="float-wa" href="https://wa.me/${SITE.whatsapp}" aria-label="واتساپ">WA</a>
    <button class="to-top" aria-label="بالا" onclick="scrollTo({top:0,behavior:'smooth'})">${sv('<path d="m18 15-6-6-6 6"/>', 16)}</button>`;
  }

  /* ---------- اسلایدر و کاروسل ---------- */
  function slider(root) {
    const slides = $$(".slide", root), dots = $(".dots", root);
    let i = 0, t;
    slides.forEach(s => s.dataset.img && probe(s.dataset.img, src => { s.style.backgroundImage = `url("${src}")`; s.classList.add("has-img"); }));
    dots.innerHTML = slides.map((_, k) => `<button aria-label="${k + 1}"></button>`).join("");
    const go = k => { i = (k + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle("on", j === i));
      $$("button", dots).forEach((b, j) => b.classList.toggle("on", j === i)); };
    const auto = () => { clearInterval(t); t = setInterval(() => go(i + 1), 6000); };
    $$("button", dots).forEach((b, k) => b.onclick = () => { go(k); auto(); });
    $(".s-prev", root).onclick = () => { go(i - 1); auto(); };
    $(".s-next", root).onclick = () => { go(i + 1); auto(); };
    go(0); if (slides.length > 1) auto();
  }
  function carousel(root) {
    const track = $(".track", root); if (!track) return;
    const step = () => (track.firstElementChild?.offsetWidth || 240) + 10;
    const prev = $(".c-prev", root), next = $(".c-next", root);
    if (prev) prev.onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
    if (next) next.onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
    const dots = $(".c-dots", root);
    if (dots) {
      const pages = () => Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.05));
      const draw = () => { const n = pages(), cur = Math.round(Math.abs(track.scrollLeft) / track.clientWidth);
        dots.innerHTML = Array.from({ length: n }, (_, k) => `<button class="${k === cur ? "on" : ""}" aria-label="${k + 1}"></button>`).join("");
        $$("button", dots).forEach((b, k) => b.onclick = () => track.scrollTo({ left: -k * track.clientWidth, behavior: "smooth" })); };
      track.addEventListener("scroll", () => { clearTimeout(track._d); track._d = setTimeout(draw, 120); }, { passive: true });
      addEventListener("resize", draw); draw();
    }
  }

  /* ---------- راه‌اندازی ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const h = $("#site-header"), f = $("#site-footer");
    if (h) h.outerHTML = header();
    if (f) f.outerHTML = footer();
    probe("assets/img/logo.png", src => $$(".logo").forEach(l => l.innerHTML = `<img src="${src}" alt="${SITE.name}" style="height:44px">`));
    Cart.render();
    $$(".slider").forEach(slider);
    $$(".carousel").forEach(carousel);
    const onScroll = () => document.body.classList.toggle("scrolled", scrollY > 60);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    document.title = document.title.replace("{name}", SITE.name);
  });

  Object.assign(window, { $, $$, fa, money, qs, catTitle, brandTitle, productImg, catImg, imgOr, stars, probe, Cart, card, catCard, brandCard, toast });
})();
