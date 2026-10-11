/* فروشگاه: فیلتر دسته/برند/موجودی، جستجو، مرتب‌سازی، تعداد ستون و صفحه‌بندی */
(function () {
  "use strict";
  const PER_PAGE = 24;
  const params = new URLSearchParams(location.search);
  const state = {
    cat: params.get("cat") || "", brand: params.get("brand") || "", q: (params.get("q") || "").trim(),
    sort: params.get("sort") || "", stock: params.get("stock") === "1", page: Math.max(1, +params.get("page") || 1)
  };
  const url = patch => {
    const s = { ...state, page: 1, ...patch }, u = new URLSearchParams();
    if (s.cat) u.set("cat", s.cat); if (s.brand) u.set("brand", s.brand); if (s.q) u.set("q", s.q);
    if (s.sort) u.set("sort", s.sort); if (s.stock) u.set("stock", "1"); if (s.page > 1) u.set("page", s.page);
    return "shop.html" + (u.toString() ? "?" + u : "");
  };
  const norm = s => String(s).toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/‌/g, " ");
  const count = f => PRODUCTS.filter(f).length;

  /* نوار دسته‌ها در هدر خاکستری */
  $("#shop-cats").innerHTML = CATEGORIES.map(c =>
    `<a href="${url({ cat: c.id, brand: "" })}" class="${state.cat === c.id ? "on" : ""}">${esc(c.title)}</a>`).join("");

  /* عنوان و مسیر */
  const title = state.q ? `نتایج جستجو: «${state.q}»` : state.cat ? catTitle(state.cat) : state.brand ? `برند ${brandTitle(state.brand)}` : "فروشگاه";
  $("#ph-title").textContent = title;
  $("#crumb-cur").textContent = title;
  document.title = `${title} | ${SITE.name}`;

  /* پنل فیلتر */
  $("#f-cat").innerHTML = `<a href="${url({ cat: "" })}" class="${state.cat ? "" : "on"}">همه محصولات <em>${fa(PRODUCTS.length)}</em></a>` +
    CATEGORIES.filter(c => !c.parent).map(c =>
      `<a href="${url({ cat: c.id })}" class="${state.cat === c.id ? "on" : ""}">${esc(c.title)} <em>${fa(count(p => inCat(p, c.id)))}</em></a>` +
      childCats(c.id).map(ch => `<a class="child ${state.cat === ch.id ? "on" : ""}" href="${url({ cat: ch.id })}">— ${esc(ch.title)} <em>${fa(count(p => p.cat === ch.id))}</em></a>`).join("")
    ).join("");
  $("#f-brand").innerHTML = `<a href="${url({ brand: "" })}" class="${state.brand ? "" : "on"}">همه برندها</a>` +
    BRANDS.map(b => `<a href="${url({ brand: b.id })}" class="${state.brand === b.id ? "on" : ""}">${esc(b.title)} <em>${fa(count(p => p.brand === b.id))}</em></a>`).join("");
  $("#f-sort").value = state.sort;
  $("#f-stock").checked = state.stock;
  $("#f-sort").onchange = e => location.href = url({ sort: e.target.value });
  $("#f-stock").onchange = e => location.href = url({ stock: e.target.checked });
  const active = [state.cat, state.brand, state.stock, state.sort].filter(Boolean).length;
  $("#filter-n").textContent = active ? fa(active) : "";
  $("#filter-ic").innerHTML = UI.filter;
  const drawer = $("#drawer"), toggle = open => drawer.classList.toggle("open", open);
  $("#filter-open").onclick = () => toggle(true);
  $("#filter-close").onclick = $("#filter-bg").onclick = () => toggle(false);
  addEventListener("keydown", e => { if (e.key === "Escape") toggle(false); });

  /* تعداد ستون (ذخیره در مرورگر) */
  let cols = 3;
  try { cols = +localStorage.getItem("shop_cols") || 3; } catch (e) {}
  const setCols = n => {
    cols = n; $("#grid").style.setProperty("--cols", n);
    $$("[data-cols]").forEach(b => b.classList.toggle("on", +b.dataset.cols === n));
    try { localStorage.setItem("shop_cols", n); } catch (e) {}
  };
  $$("[data-cols]").forEach(b => b.onclick = () => setCols(+b.dataset.cols));
  setCols(cols);

  /* لیست محصولات */
  const q = norm(state.q);
  let list = PRODUCTS.filter(p => inCat(p, state.cat) && (!state.brand || p.brand === state.brand) && (!state.stock || p.stock)
    && (!q || norm(`${p.title} ${p.en} ${p.short}`).includes(q)));
  const sorters = {
    new: (a, b) => (b.isNew - a.isNew) || b.id - a.id,
    best: (a, b) => (b.isBest - a.isBest) || b.rating - a.rating,
    rating: (a, b) => b.rating - a.rating,
    name: (a, b) => a.title.localeCompare(b.title, "fa")
  };
  if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE)), page = Math.min(state.page, pages);
  $("#count").textContent = `نمایش ${fa(list.length)} محصول`;
  $("#grid").innerHTML = list.length
    ? list.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(card).join("")
    : `<div class="empty">محصولی یافت نشد. <a href="shop.html">مشاهده همه محصولات</a></div>`;
  $("#pager").innerHTML = pages < 2 ? "" : Array.from({ length: pages }, (_, i) =>
    `<a href="${url({ page: i + 1 })}" class="${i + 1 === page ? "on" : ""}">${fa(i + 1)}</a>`).join("");
})();
