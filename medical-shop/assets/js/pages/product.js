/* صفحه محصول */
(function () {
  "use strict";
  const p = byId(PRODUCTS, qs("id"));
  if (!p) {
    $("#pd-root").innerHTML = `<div class="empty">این محصول پیدا نشد. <a href="shop.html">بازگشت به فروشگاه</a></div>`;
    $(".related").remove();
    return;
  }
  const cat = byId(CATEGORIES, p.cat), parent = cat?.parent ? byId(CATEGORIES, cat.parent) : null;
  document.title = `${p.title} | ${SITE.name}`;
  $('meta[name="description"]').content = p.short;
  $("#crumb").innerHTML = [`<a href="index.html">خانه</a>`, `<a href="shop.html">محصولات</a>`,
    parent && `<a href="shop.html?cat=${esc(parent.id)}">${esc(parent.title)}</a>`,
    cat && `<a href="shop.html?cat=${esc(cat.id)}">${esc(cat.title)}</a>`, `<b>${esc(p.title)}</b>`].filter(Boolean).join(" / ");

  const specs = Object.entries(p.specs || {});
  const price = p.price
    ? `<div class="price">${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}<b>${money(p.price)}</b></div>`
    : `<div><span class="inquiry">استعلام قیمت</span><small class="muted">برای قیمت روز تماس بگیرید: <a href="${tel(SITE.phone)}" dir="ltr">${esc(fa(SITE.phone))}</a></small></div>`;
  const body = p.body ? paragraphs(p.body) : `<p>${esc(p.short)}</p>
    <p>این محصول با رعایت کامل الزامات سیستم مدیریت کیفیت تجهیزات پزشکی (ISO 13485) تولید شده و دارای مجوز اداره کل تجهیزات پزشکی است. بسته‌بندی استریل و تکی آن، ایمنی بیمار و کادر درمان را تضمین می‌کند.</p>
    <h3>قیمت ${esc(p.title)}</h3><p>قیمت این کالا بسته به سایز، برند و تعداد سفارش متغیر است. برای دریافت قیمت روز و پیش‌فاکتور رسمی با شماره ${esc(fa(SITE.phone))} تماس بگیرید.</p>`;

  $("#pd-root").innerHTML = `
  <div class="pd">
    <div class="pd-gal"><div class="main">${productImg(p)}</div></div>
    <div class="pd-info">
      <h1>${esc(p.title)}</h1><div class="en" dir="ltr">${esc(p.en)}</div>${stars(p.rating)}
      <div class="pd-meta">
        <span>برند: <b><a href="shop.html?brand=${esc(p.brand)}">${esc(brandTitle(p.brand))}</a></b></span>
        <span>دسته: <b><a href="shop.html?cat=${esc(p.cat)}">${esc(catTitle(p.cat))}</a></b></span>
        <span>کد کالا: <b>${fa("MS-" + String(p.id).padStart(4, "0"))}</b></span>
        <span>وضعیت: <b class="${p.stock ? "ok" : "no"}">${p.stock ? "موجود" : "ناموجود"}</b></span>
      </div>
      <p class="short">${esc(p.short)}</p>
      <ul class="spec-mini">${specs.slice(0, 4).map(([k, v]) => `<li>${esc(k)}: <b>${esc(v)}</b></li>`).join("")}</ul>
      <div class="buy">${price}
        <div class="buy-row">
          <div class="qty"><button type="button" data-step="1" aria-label="افزایش">+</button><input id="qty" value="1" inputmode="numeric" aria-label="تعداد"><button type="button" data-step="-1" aria-label="کاهش">−</button></div>
          <button class="btn" id="add" ${p.stock ? "" : "disabled"}>${p.price ? "افزودن به سبد" : "افزودن به لیست استعلام"}</button>
        </div>
      </div>
      <div class="guar"><div><b>ضمانت اصالت</b>کالای اورجینال</div><div><b>ارسال سریع</b>۲ تا ۳ روز کاری</div><div><b>استاندارد</b>ISO 13485 / CE</div></div>
    </div>
  </div>
  <div class="tabs">
    <div class="tab-btns" role="tablist"><button class="on" data-t="t1" role="tab">توضیحات</button><button data-t="t2" role="tab">مشخصات فنی</button><button data-t="t3" role="tab">سوالات متداول</button></div>
    <div class="tab on" id="t1" role="tabpanel">${body}</div>
    <div class="tab" id="t2" role="tabpanel"><table class="spec-table">${[["نام انگلیسی", p.en], ["برند", brandTitle(p.brand)], ...specs]
      .map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table></div>
    <div class="tab" id="t3" role="tabpanel"><div class="faq">${FAQ.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div></div>
  </div>`;

  const qty = $("#qty"), val = () => Math.max(1, parseInt(qty.value, 10) || 1);
  $$("[data-step]").forEach(b => b.onclick = () => qty.value = Math.max(1, val() + +b.dataset.step));
  $("#add").onclick = () => Cart.add(p.id, val());
  $$(".tab-btns button").forEach(b => b.onclick = () => {
    $$(".tab-btns button").forEach(x => x.classList.toggle("on", x === b));
    $$(".tab").forEach(t => t.classList.toggle("on", t.id === b.dataset.t));
  });

  const rel = PRODUCTS.filter(x => x.id !== p.id && (x.cat === p.cat || inCat(x, cat?.parent || p.cat)));
  const extra = PRODUCTS.filter(x => x.isBest && x.id !== p.id && !rel.includes(x));
  $("#related").innerHTML = rel.concat(extra).slice(0, 10).map(card).join("");
})();
