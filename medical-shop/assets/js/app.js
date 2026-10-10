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
  const productImg = p => p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : icon(p.icon);

  /* ---------- سبد خرید (localStorage) ---------- */
  const CART_KEY = "medshop_cart";
  const Cart = {
    get() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } },
    save(items) { try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {} Cart.render(); },
    add(id, qty = 1) {
      const items = Cart.get(); const it = items.find(i => i.id === id);
      it ? it.qty += qty : items.push({ id, qty });
      Cart.save(items);
      const p = PRODUCTS.find(x => x.id === id);
      toast(`«${p.title}» به سبد اضافه شد`);
    },
    set(id, qty) { let items = Cart.get(); const it = items.find(i => i.id === id); if (it) it.qty = Math.max(1, qty); Cart.save(items); },
    remove(id) { Cart.save(Cart.get().filter(i => i.id !== id)); },
    count() { return Cart.get().reduce((s, i) => s + i.qty, 0); },
    render() { $$(".cart-count").forEach(el => el.textContent = fa(Cart.count())); document.dispatchEvent(new Event("cart:change")); }
  };

  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
    t.innerHTML = `<span>✓</span> ${msg} <a href="cart.html">مشاهده سبد</a>`;
    t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2800);
  }

  /* ---------- کارت محصول ---------- */
  function card(p) {
    const price = p.price
      ? `${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}<b>${money(p.price)}</b>`
      : `<span class="inquiry">استعلام قیمت</span>`;
    return `<article class="p-card">
      ${p.isNew ? `<span class="badge new">جدید</span>` : ""}${!p.stock ? `<span class="badge out">ناموجود</span>` : ""}
      <a href="product.html?id=${p.id}" class="p-img">${productImg(p)}</a>
      <div class="p-body">
        <a class="p-cat" href="shop.html?cat=${p.cat}">${catTitle(p.cat)}</a>
        <h3><a href="product.html?id=${p.id}">${p.title}</a></h3>
        <span class="p-en">${p.en}</span>
        <div class="p-foot"><div class="price">${price}</div>
          <button class="btn-icon" ${p.stock ? "" : "disabled"} onclick="Cart.add(${p.id})" title="افزودن به سبد">${svgCart}</button>
        </div>
      </div></article>`;
  }

  const svgCart = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/></svg>`;
  const svgSearch = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
  const svgUser = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>`;
  const svgPhone = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>`;
  const svgMail = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>`;
  const svgClock = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
  const logoMark = `<svg viewBox="0 0 48 48" width="44" height="44"><rect width="48" height="48" rx="12" fill="var(--primary)"/><path d="M20 10h8v10h10v8H28v10h-8V28H10v-8h10z" fill="#fff"/><circle cx="36" cy="12" r="5" fill="var(--accent)"/></svg>`;

  /* ---------- هدر ---------- */
  function header() {
    const page = location.pathname.split("/").pop() || "index.html";
    const mega = CATEGORIES.map(c => `<div class="mega-col">
        <a class="mega-title" href="shop.html?cat=${c.id}"><span class="mi">${icon(c.icon)}</span>${c.title}</a>
        ${(c.children || []).map(ch => `<a href="shop.html?cat=${ch.id}">${ch.title}</a>`).join("")}
        ${PRODUCTS.filter(p => p.parent === c.id).slice(0, 3).map(p => `<a class="sub" href="product.html?id=${p.id}">${p.title}</a>`).join("")}
      </div>`).join("");
    const nav = [["index.html", "صفحه اصلی"], ["shop.html", "فروشگاه"], ["brands", "برندها"], ["blog.html", "مقالات"], ["about.html", "درباره ما"], ["contact.html", "تماس با ما"]];
    return `
    <div class="topbar"><div class="container">
      <div class="tb-info"><span>${svgPhone} ${fa(SITE.phone)}</span><span>${svgMail} ${SITE.email}</span><span class="hide-sm">${svgClock} ${SITE.hours}</span></div>
      <div class="tb-links"><a href="about.html">درباره ما</a><a href="contact.html">تماس</a><a href="#" onclick="return false">English</a></div>
    </div></div>
    <header class="site-header"><div class="container hdr">
      <button class="burger" aria-label="منو" onclick="document.body.classList.toggle('nav-open')"><span></span><span></span><span></span></button>
      <a class="logo" href="index.html">${logoMark}<span><b>${SITE.name}</b><small>${SITE.nameEn}</small></span></a>
      <form class="search" action="shop.html"><input name="q" placeholder="جستجوی محصول، مثلاً تروکار، استپلر، مش..." value="${qs("q") || ""}"><button aria-label="جستجو">${svgSearch}</button></form>
      <div class="hdr-actions">
        <a class="hdr-call" href="tel:${SITE.phoneRaw}"><span class="ic">${svgPhone}</span><span><small>مشاوره و خرید</small><b>${fa(SITE.phone)}</b></span></a>
        <a class="hdr-btn" href="#" onclick="alert('صفحه ورود/ثبت‌نام به بک‌اند متصل شود');return false" title="حساب کاربری">${svgUser}</a>
        <a class="hdr-btn cart-btn" href="cart.html" title="سبد خرید">${svgCart}<i class="cart-count">۰</i></a>
      </div>
    </div>
    <nav class="main-nav"><div class="container nav-inner">
      <div class="cat-menu"><button class="cat-btn"><span class="bars"></span> دسته‌بندی محصولات</button><div class="mega">${mega}</div></div>
      <ul>${nav.map(([h, t]) => h === "brands"
        ? `<li class="has-drop"><a href="shop.html">${t} ▾</a><div class="drop">${BRANDS.map(b => `<a href="shop.html?brand=${b.id}">${b.title}</a>`).join("")}</div></li>`
        : `<li><a href="${h}" class="${page === h ? "active" : ""}">${t}</a></li>`).join("")}</ul>
      <a class="nav-cta" href="contact.html">درخواست پیش‌فاکتور</a>
    </div></nav></header>
    <div class="mnav"><div class="mnav-in">
      <div class="mnav-head">${logoMark}<b>${SITE.name}</b><button onclick="document.body.classList.remove('nav-open')">✕</button></div>
      ${nav.filter(n => n[0] !== "brands").map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}
      <div class="mnav-sep">دسته‌بندی‌ها</div>
      ${CATEGORIES.map(c => `<a href="shop.html?cat=${c.id}">${c.title}</a>`).join("")}
    </div><div class="mnav-bg" onclick="document.body.classList.remove('nav-open')"></div></div>`;
  }

  /* ---------- فوتر ---------- */
  function footer() {
    return `
    <section class="newsletter"><div class="container nl">
      <div><h3>از تخفیف‌ها و محصولات جدید باخبر شوید</h3><p>شماره موبایل یا ایمیل خود را وارد کنید.</p></div>
      <form onsubmit="event.preventDefault();this.reset();alert('ثبت شد؛ از همراهی شما سپاسگزاریم.')"><input required placeholder="ایمیل یا شماره موبایل"><button class="btn">عضویت</button></form>
    </div></section>
    <footer class="site-footer"><div class="container f-grid">
      <div class="f-about"><a class="logo light" href="index.html">${logoMark}<span><b>${SITE.name}</b><small>${SITE.nameEn}</small></span></a>
        <p>${SITE.name}، ${SITE.slogan}. تمامی محصولات دارای مجوز اداره کل تجهیزات پزشکی، استاندارد ISO 13485 و نشان CE هستند و به‌صورت مستقیم و بدون واسطه عرضه می‌شوند.</p>
        <div class="social"><a href="${SITE.instagram}" aria-label="Instagram">IG</a><a href="${SITE.telegram}" aria-label="Telegram">TG</a><a href="https://wa.me/${SITE.whatsapp}" aria-label="WhatsApp">WA</a><a href="${SITE.linkedin}" aria-label="LinkedIn">in</a></div>
      </div>
      <div><h4>دسته‌بندی محصولات</h4>${CATEGORIES.slice(0, 6).map(c => `<a href="shop.html?cat=${c.id}">${c.title}</a>`).join("")}</div>
      <div><h4>دسترسی سریع</h4><a href="shop.html">فروشگاه</a><a href="blog.html">مقالات</a><a href="about.html">درباره ما</a><a href="contact.html">تماس با ما</a><a href="index.html#faq">سوالات متداول</a><a href="about.html#rules">قوانین و مقررات</a></div>
      <div class="f-contact"><h4>اطلاعات تماس</h4>
        <p>${svgPhone} <a href="tel:${SITE.phoneRaw}">${fa(SITE.phone)}</a></p>
        <p>${svgPhone} ${fa(SITE.mobile)}</p>
        <p>${svgMail} ${SITE.email}</p>
        <p>${svgClock} ${SITE.hours}</p>
        <p>📍 ${SITE.address}</p>
        <div class="trust"><span>نماد<br>اعتماد</span><span>ساماندهی</span><span>IRC</span></div>
      </div>
    </div>
    <div class="copy"><div class="container">© ${fa(new Date().getFullYear())} — کلیه حقوق برای ${SITE.name} محفوظ است.</div></div></footer>
    <a class="float-call" href="tel:${SITE.phoneRaw}" aria-label="تماس">${svgPhone}</a>
    <a class="float-wa" href="https://wa.me/${SITE.whatsapp}" aria-label="واتساپ">WA</a>
    <button class="to-top" aria-label="بالا" onclick="scrollTo({top:0,behavior:'smooth'})">▲</button>`;
  }

  /* ---------- اسلایدر و کاروسل ---------- */
  function slider(root) {
    const slides = $$(".slide", root), dots = $(".dots", root);
    let i = 0, t;
    dots.innerHTML = slides.map((_, k) => `<button aria-label="${k + 1}"></button>`).join("");
    const go = k => { i = (k + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle("on", j === i));
      $$("button", dots).forEach((b, j) => b.classList.toggle("on", j === i)); };
    const auto = () => { clearInterval(t); t = setInterval(() => go(i + 1), 5500); };
    $$("button", dots).forEach((b, k) => b.onclick = () => { go(k); auto(); });
    $(".s-prev", root).onclick = () => { go(i - 1); auto(); };
    $(".s-next", root).onclick = () => { go(i + 1); auto(); };
    go(0); auto();
  }
  function carousel(root) {
    const track = $(".track", root);
    const step = () => track.querySelector(":scope > *")?.offsetWidth + 20 || 260;
    $(".c-prev", root).onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
    $(".c-next", root).onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
  }

  /* ---------- راه‌اندازی ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const h = $("#site-header"), f = $("#site-footer");
    if (h) h.outerHTML = header();
    if (f) f.outerHTML = footer();
    Cart.render();
    $$(".slider").forEach(slider);
    $$(".carousel").forEach(carousel);
    const tt = $(".to-top");
    addEventListener("scroll", () => {
      document.body.classList.toggle("scrolled", scrollY > 140);
      tt && tt.classList.toggle("show", scrollY > 600);
    }, { passive: true });
    document.title = document.title.replace("{name}", SITE.name);
  });

  Object.assign(window, { $, $$, fa, money, qs, catTitle, brandTitle, productImg, Cart, card, toast });
})();
