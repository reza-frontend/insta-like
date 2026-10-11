/* لیست سفارش / استعلام */
(function () {
  "use strict";
  const root = $(".cart-wrap");
  function render() {
    const items = Cart.get().map(i => ({ ...i, p: byId(PRODUCTS, i.id) }));
    if (!items.length) {
      root.classList.add("is-empty");
      root.innerHTML = `<div class="empty"><div class="empty-ic">${icon("bag")}</div><h3>لیست سفارش شما خالی است</h3>
        <p>محصولات مورد نیاز را از فروشگاه به این لیست اضافه کنید.</p><a class="btn" href="shop.html">رفتن به فروشگاه</a></div>`;
      return;
    }
    root.classList.remove("is-empty");
    const priced = items.filter(i => i.p.price), total = priced.reduce((s, i) => s + i.p.price * i.qty, 0);
    root.innerHTML = `
      <div class="cart-table">${items.map(i => `<div class="ci-row">
        <a class="pic" href="${productUrl(i.p)}">${productImg(i.p)}</a>
        <div><h3><a href="${productUrl(i.p)}">${esc(i.p.title)}</a></h3><small>${esc(catTitle(i.p.cat))} — ${esc(brandTitle(i.p.brand))}</small></div>
        <div class="qty"><button data-q="${i.id}" data-d="1" aria-label="افزایش">+</button><input value="${fa(i.qty)}" readonly aria-label="تعداد"><button data-q="${i.id}" data-d="-1" aria-label="کاهش">−</button></div>
        <div class="price">${i.p.price ? `<b>${money(i.p.price * i.qty)}</b>` : `<span class="inquiry">استعلام</span>`}</div>
        <button class="rm" data-rm="${i.id}" aria-label="حذف">✕</button></div>`).join("")}</div>
      <aside class="box summary"><h4>خلاصه سفارش</h4>
        <div class="row"><span>تعداد اقلام</span><b>${fa(Cart.count())}</b></div>
        <div class="row"><span>اقلام نیازمند استعلام</span><b>${fa(items.length - priced.length)}</b></div>
        <div class="row"><span>جمع مبلغ قطعی</span><b>${total ? money(total) : "—"}</b></div>
        <form class="form" id="order" novalidate>
          <input name="name" required maxlength="80" placeholder="نام و نام خانوادگی / نام مرکز درمانی" autocomplete="name">
          <input name="phone" required maxlength="20" placeholder="شماره تماس" inputmode="tel" autocomplete="tel">
          <input name="city" maxlength="60" placeholder="شهر" autocomplete="address-level2">
          <textarea name="note" maxlength="2000" rows="3" placeholder="توضیحات (سایز، برند، تعداد عمده و...)"></textarea>
          <input name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="btn">ثبت سفارش / درخواست پیش‌فاکتور</button>
          <p class="form-msg" id="form-msg" role="status"></p>
          <small class="muted">پس از ثبت، کارشناسان ما برای تأیید قیمت و نحوه ارسال با شما تماس می‌گیرند.</small>
        </form>
      </aside>`;
    $("#order").onsubmit = submit;
  }

  root.addEventListener("click", e => {
    const q = e.target.closest("[data-q]"), rm = e.target.closest("[data-rm]");
    if (q) { const it = Cart.get().find(i => i.id === +q.dataset.q); if (it) Cart.set(it.id, it.qty + +q.dataset.d); }
    if (rm) Cart.remove(+rm.dataset.rm);
  });

  async function submit(e) {
    e.preventDefault();
    const f = e.target, data = Object.fromEntries(new FormData(f)), msg = $("#form-msg");
    if (!data.name.trim() || !/^[+\d۰-۹\s-]{7,20}$/.test(data.phone.trim())) { msg.className = "form-msg err"; msg.textContent = "نام و شماره تماس معتبر وارد کنید."; return; }
    const items = Cart.get().map(i => ({ id: i.id, title: byId(PRODUCTS, i.id).title, qty: i.qty }));
    f.querySelector("button").disabled = true;
    try {
      if (await sendLead({ type: "order", ...data, items })) {
        Cart.clear();
        root.innerHTML = `<div class="empty"><div class="empty-ic ok">✓</div><h3>سفارش شما ثبت شد</h3><p>کارشناسان ما به‌زودی با شما تماس می‌گیرند.</p><a class="btn" href="shop.html">ادامه خرید</a></div>`;
        return;
      }
      /* بدون سرور: ارسال سفارش از طریق واتساپ */
      const text = `سفارش جدید از ${data.name} (${data.phone}) ${data.city || ""}\n` + items.map(i => `• ${i.title} × ${i.qty}`).join("\n") + (data.note ? `\nتوضیحات: ${data.note}` : "");
      open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    } catch (err) {
      msg.className = "form-msg err"; msg.textContent = err.message;
    }
    f.querySelector("button").disabled = false;
  }

  document.addEventListener("cart:change", render);
  render();
})();
