/* پنل مدیریت فروشگاه — رابط کاربری تک‌صفحه‌ای؛ همه داده‌ها از admin/api.php */
(function () {
  "use strict";
  const app = document.getElementById("app");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ESC[c]);
  const fa = n => String(n ?? "").replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const money = n => n ? fa(Number(n).toLocaleString("en-US")) + " تومان" : "استعلامی";
  const src = p => !p ? "" : /^https?:/.test(p) ? p : "../" + p;

  let csrf = "", C = null, ICON_NAMES = [], user = "", newOrders = 0, warn = [];

  /* ---------- ارتباط با API ---------- */
  async function api(action, body, isForm) {
    const opt = { method: body ? "POST" : "GET", headers: { "X-CSRF": csrf }, credentials: "same-origin" };
    if (body) { opt.body = isForm ? body : JSON.stringify(body); if (!isForm) opt.headers["Content-Type"] = "application/json"; }
    const r = await fetch("api.php?action=" + action, opt);
    const j = await r.json().catch(() => ({ ok: false, error: "پاسخ نامعتبر از سرور (آیا PHP فعال است؟)" }));
    if (r.status === 401 && action !== "login") { boot(); throw new Error(j.error); }
    if (!j.ok) throw new Error(j.error || "خطا");
    return j;
  }
  function toast(msg, bad) {
    let box = $("#toasts");
    if (!box) { box = document.createElement("div"); box.id = "toasts"; box.setAttribute("role", "status"); document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = "toast" + (bad ? " bad" : ""); t.textContent = msg;
    box.appendChild(t); setTimeout(() => t.remove(), 3500);
  }
  const run = fn => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message, true); } };

  /* ---------- تعریف بخش‌ها (فرم و جدول هر نوع داده از اینجا ساخته می‌شود) ---------- */
  const catOptions = (withEmpty, onlyTop) => [...(withEmpty ? [["", "— بدون والد —"]] : []),
    ...C.categories.filter(c => !onlyTop || !c.parent).map(c => [c.id, (c.parent ? "— " : "") + c.title])];
  const ENT = {
    products: {
      title: "محصولات", one: "محصول", numeric: true,
      cols: [["تصویر", p => thumb(p.image, p.icon)], ["عنوان", p => `<b>${esc(p.title)}</b><small>${esc(p.en)}</small>`],
        ["دسته", p => esc(C.categories.find(c => c.id === p.cat)?.title)], ["برند", p => esc(C.brands.find(b => b.id === p.brand)?.title)],
        ["قیمت", p => money(p.price)], ["وضعیت", p => `${p.stock ? '<span class="tag ok">موجود</span>' : '<span class="tag no">ناموجود</span>'}${p.isNew ? '<span class="tag">جدید</span>' : ""}${p.isBest ? '<span class="tag hot">پرفروش</span>' : ""}`]],
      search: p => `${p.title} ${p.en} ${p.slug}`,
      filters: () => [["cat", "همه دسته‌ها", catOptions(false)], ["brand", "همه برندها", C.brands.map(b => [b.id, b.title])]],
      blank: () => ({ id: 0, slug: "", title: "", en: "", cat: C.categories[0]?.id || "", brand: C.brands[0]?.id || "", icon: "shield", image: "", price: 0, oldPrice: 0, stock: true, rating: 5, isNew: true, isBest: false, short: "", body: "", specs: {} }),
      fields: () => [
        ["title", "عنوان محصول", "text", { required: true }], ["en", "نام انگلیسی", "text", { dir: "ltr" }],
        ["cat", "دسته‌بندی", "select", { options: catOptions(false) }], ["brand", "برند", "select", { options: C.brands.map(b => [b.id, b.title]) }],
        ["price", "قیمت (تومان) — ۰ یعنی «استعلام قیمت»", "number"], ["oldPrice", "قیمت قبل از تخفیف (اختیاری)", "number"],
        ["image", "تصویر محصول", "image", { hint: "مربعی با پس‌زمینه سفید، حدود ۸۰۰×۸۰۰" }], ["icon", "آیکن جایگزین (وقتی تصویر نیست)", "icon"],
        ["short", "توضیح کوتاه", "textarea", { rows: 3, full: true }], ["body", "توضیحات کامل (هر خط یک پاراگراف)", "textarea", { rows: 8, full: true }],
        ["specs", "مشخصات فنی", "specs", { full: true }],
        ["rating", "امتیاز (۰ تا ۵)", "number", { min: 0, max: 5 }], ["slug", "نامک (برای نام فایل تصویر؛ انگلیسی)", "text", { dir: "ltr", placeholder: "خودکار" }],
        ["stock", "موجود است", "check"], ["isNew", "نمایش در «جدیدترین محصولات»", "check"], ["isBest", "نمایش در «پرفروش‌ها»", "check"]]
    },
    categories: {
      title: "دسته‌بندی‌ها", one: "دسته", sortable: true,
      cols: [["تصویر", c => `<span class="sw" style="background:${esc(c.bg)}">${thumb(c.image, c.icon, true)}</span>`], ["عنوان", c => `<b>${c.parent ? "— " : ""}${esc(c.title)}</b><small dir="ltr">${esc(c.id)}</small>`],
        ["محصولات", c => fa(C.products.filter(p => p.cat === c.id).length)], ["صفحه اصلی", c => c.home ? "✓" : ""]],
      search: c => `${c.title} ${c.id}`,
      blank: () => ({ id: "", title: "", parent: "", icon: "shield", bg: "linear-gradient(160deg,#a1c4fd,#5b7fd1)", image: "", home: true }),
      fields: () => [["title", "عنوان", "text", { required: true }], ["id", "شناسه (انگلیسی، در آدرس صفحه)", "text", { dir: "ltr", required: true, pattern: "[a-z0-9][a-z0-9-]*" }],
        ["parent", "دسته والد", "select", { options: catOptions(true, true) }], ["home", "نمایش کارت در صفحه اصلی", "check"],
        ["image", "تصویر کارت", "image", { hint: "حدود ۶۰۰×۴۳۰" }], ["icon", "آیکن جایگزین", "icon"],
        ["bg", "رنگ/گرادیان پس‌زمینه کارت", "bg", { full: true }]]
    },
    brands: {
      title: "برندها", one: "برند", sortable: true,
      cols: [["لوگو", b => b.logo ? thumb(b.logo) : `<b style="${esc(b.style)}" class="brand-pv">${esc(b.en)}</b>`], ["نام", b => `<b>${esc(b.title)}</b><small dir="ltr">${esc(b.en)}</small>`],
        ["محصولات", b => fa(C.products.filter(p => p.brand === b.id).length)]],
      search: b => `${b.title} ${b.en}`,
      blank: () => ({ id: "", title: "", en: "", logo: "", style: "" }),
      fields: () => [["title", "نام فارسی", "text", { required: true }], ["en", "نام انگلیسی (در صورت نبود لوگو نمایش داده می‌شود)", "text", { dir: "ltr" }],
        ["id", "شناسه (انگلیسی)", "text", { dir: "ltr", required: true, pattern: "[a-z0-9][a-z0-9-]*" }], ["logo", "لوگو", "image", { hint: "PNG با پس‌زمینه شفاف" }],
        ["style", "استایل متن لوگو (CSS اختیاری)", "text", { dir: "ltr", full: true }]]
    },
    posts: {
      title: "مقالات", one: "مقاله", numeric: true, sortable: true,
      cols: [["تصویر", p => thumb(p.image, p.icon)], ["عنوان", p => `<b>${esc(p.title)}</b><small>${esc(p.cat)}</small>`], ["تاریخ", p => esc(fa(p.date))]],
      search: p => `${p.title} ${p.cat}`,
      blank: () => ({ id: 0, title: "", date: new Intl.DateTimeFormat("fa-IR-u-nu-latn", { dateStyle: "short" }).format(new Date()).replace(/\D+/g, "/"), cat: "", icon: "shield", image: "", excerpt: "", body: "" }),
      fields: () => [["title", "عنوان", "text", { required: true, full: true }], ["cat", "موضوع", "text"], ["date", "تاریخ (مثلاً ۱۴۰۵/۰۷/۲۰)", "text"],
        ["image", "تصویر شاخص", "image", { hint: "حدود ۱۲۰۰×۶۰۰" }], ["icon", "آیکن جایگزین", "icon"],
        ["excerpt", "خلاصه", "textarea", { rows: 3, full: true }], ["body", "متن کامل (هر خط یک پاراگراف)", "textarea", { rows: 14, full: true }]]
    },
    faq: {
      title: "سوالات متداول", one: "سوال", numeric: true, sortable: true,
      cols: [["سوال", f => `<b>${esc(f.q)}</b>`], ["پاسخ", f => `<small>${esc(f.a)}</small>`]],
      search: f => `${f.q} ${f.a}`,
      blank: () => ({ id: 0, q: "", a: "" }),
      fields: () => [["q", "سوال", "text", { required: true, full: true }], ["a", "پاسخ", "textarea", { rows: 4, required: true, full: true }]]
    }
  };
  const BG_PRESETS = ["radial-gradient(circle at 50% 45%,#9a9a9a,#3f4245)", "radial-gradient(circle at 50% 40%,#43b4d6,#075f86)", "radial-gradient(circle at 50% 40%,#2fb7a0,#0b6e62)",
    "linear-gradient(180deg,#5fd6ea,#0a5fb8)", "radial-gradient(circle at 50% 50%,#d7ecf7,#6aa7c8)", "radial-gradient(circle at 50% 50%,#2b74d8,#06142f)",
    "linear-gradient(160deg,#ffd84d,#ff8a3d)", "linear-gradient(160deg,#ff3d3d,#ff9a5a)", "linear-gradient(135deg,#7b5cff,#55d3e6)", "linear-gradient(160deg,#9be15d,#00a37a)"];

  function thumb(path, iconName, bare) {
    if (path) return `<img class="th" src="${esc(src(path))}" alt="" loading="lazy">`;
    return iconName ? `<span class="th ${bare ? "bare" : ""}">${window.icon ? icon(iconName) : ""}</span>` : `<span class="th"></span>`;
  }

  /* ---------- چارچوب صفحه ---------- */
  const NAV = [["dash", "داشبورد", "▦"], ["orders", "سفارش‌ها و پیام‌ها", "✉"], ["products", "محصولات", "▣"], ["categories", "دسته‌بندی‌ها", "☰"],
    ["brands", "برندها", "★"], ["posts", "مقالات", "✎"], ["faq", "سوالات متداول", "?"], ["settings", "تنظیمات سایت", "⚙"], ["account", "حساب و پشتیبان", "⚿"]];

  function shell() {
    app.innerHTML = `
      <aside class="side"><div class="brand-box"><b>${esc(C.site.name)}</b><small>پنل مدیریت</small></div>
        <nav>${NAV.map(([k, t, i]) => `<a href="#${k}" data-v="${k}"><i>${i}</i>${t}${k === "orders" ? `<em class="badge" id="nb"></em>` : ""}</a>`).join("")}</nav>
        <div class="side-foot"><a href="../index.html" target="_blank" rel="noopener">↗ مشاهده سایت</a><button id="logout">خروج (${esc(user)})</button></div></aside>
      <button class="menu-t" aria-label="منو">☰</button>
      <main class="main"><div id="warn"></div><div id="view"></div></main>`;
    $("#logout").onclick = run(async () => { await api("logout", {}); location.reload(); });
    $(".menu-t").onclick = () => document.body.classList.toggle("side-open");
    $("#warn").innerHTML = warn.map(w => `<div class="alert">${esc(w)}</div>`).join("");
    badge();
    addEventListener("hashchange", route);
    route();
  }
  function badge() { const b = $("#nb"); if (b) b.textContent = newOrders ? fa(newOrders) : ""; }
  function route() {
    document.body.classList.remove("side-open");
    const [v, arg] = (location.hash.slice(1) || "dash").split("/");
    $$(".side nav a").forEach(a => a.classList.toggle("on", a.dataset.v === v));
    const view = $("#view");
    if (ENT[v]) return arg !== undefined ? editView(v, decodeURIComponent(arg)) : listView(v);
    ({ dash: dashView, orders: ordersView, settings: settingsView, account: accountView }[v] || dashView)(view);
  }

  /* ---------- داشبورد ---------- */
  async function dashView(view) {
    const stat = (n, t, h) => `<a class="stat" href="#${h}"><b>${fa(n)}</b><span>${t}</span></a>`;
    const noImg = C.products.filter(p => !p.image).length;
    view.innerHTML = `<h1>داشبورد</h1>
      <div class="stats">${stat(newOrders, "سفارش/پیام جدید", "orders")}${stat(C.products.length, "محصول", "products")}${stat(C.categories.length, "دسته‌بندی", "categories")}${stat(C.posts.length, "مقاله", "posts")}</div>
      <div class="cards2">
        <section class="card"><h3>آخرین سفارش‌ها</h3><div id="last">...</div><a class="lnk" href="#orders">همه سفارش‌ها ←</a></section>
        <section class="card"><h3>کارهای پیشنهادی</h3><ul class="todo">
          ${noImg ? `<li><a href="#products">${fa(noImg)} محصول بدون تصویر است</a></li>` : ""}
          ${!C.site.url ? `<li><a href="#settings">آدرس سایت را برای ساخت خودکار sitemap وارد کنید</a></li>` : ""}
          ${C.site.slides?.some(s => !s.image) ? `<li><a href="#settings">برای اسلایدر صفحه اصلی تصویر بگذارید</a></li>` : ""}
          ${!C.site.catalog ? `<li><a href="#settings">لینک فایل کاتالوگ را وارد کنید</a></li>` : ""}
          <li><a href="#account">از اطلاعات سایت نسخه پشتیبان بگیرید</a></li></ul></section>
      </div>`;
    const { orders } = await api("orders");
    $("#last", view).innerHTML = orders.length ? `<table class="tbl compact">${orders.slice(0, 6).map(o =>
      `<tr><td>${statusTag(o.status)}</td><td><b>${esc(o.name)}</b></td><td dir="ltr">${esc(o.phone)}</td><td>${o.type === "order" ? fa(o.items.length) + " قلم" : "پیام"}</td><td><small>${dateFa(o.date)}</small></td></tr>`).join("")}</table>` : `<p class="muted">هنوز سفارشی ثبت نشده است.</p>`;
  }
  const dateFa = d => new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d));
  const STATUS = { new: ["جدید", "hot"], doing: ["در حال پیگیری", ""], done: ["انجام شد", "ok"] };
  const statusTag = s => `<span class="tag ${STATUS[s]?.[1] || ""}">${STATUS[s]?.[0] || s}</span>`;

  /* ---------- لیست عمومی ---------- */
  const listState = {};
  function listView(ent) {
    const E = ENT[ent], st = listState[ent] ||= { q: "", f: {} }, view = $("#view");
    const filters = E.filters ? E.filters() : [];
    view.innerHTML = `<div class="head"><h1>${E.title} <small>${fa(C[ent].length)}</small></h1><a class="btn" href="#${ent}/new">+ افزودن ${E.one}</a></div>
      <div class="toolbar"><input type="search" id="q" placeholder="جستجو..." value="${esc(st.q)}">
        ${filters.map(([k, label, opts]) => `<select data-f="${k}"><option value="">${label}</option>${opts.map(([v, t]) => `<option value="${esc(v)}" ${st.f[k] === v ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>`).join("")}
        ${E.sortable ? `<span class="muted">برای تغییر ترتیب، ردیف‌ها را بکشید.</span>` : ""}</div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr>${E.cols.map(c => `<th>${c[0]}</th>`).join("")}<th></th></tr></thead><tbody id="rows"></tbody></table></div>`;
    const draw = () => {
      const q = st.q.trim().toLowerCase();
      const rows = C[ent].filter(x => (!q || E.search(x).toLowerCase().includes(q)) && Object.entries(st.f).every(([k, v]) => !v || x[k] === v));
      $("#rows").innerHTML = rows.length ? rows.map(x => `<tr data-id="${esc(x.id)}" ${E.sortable && !q ? 'draggable="true"' : ""}>
          ${E.cols.map(c => `<td>${c[1](x)}</td>`).join("")}
          <td class="acts"><a class="btn sm" href="#${ent}/${encodeURIComponent(x.id)}">ویرایش</a><button class="btn sm danger" data-del="${esc(x.id)}">حذف</button></td></tr>`).join("")
        : `<tr><td colspan="${E.cols.length + 1}" class="muted center">موردی یافت نشد.</td></tr>`;
    };
    $("#q").oninput = e => { st.q = e.target.value; draw(); };
    $$("[data-f]").forEach(s => s.onchange = () => { st.f[s.dataset.f] = s.value; draw(); });
    $("#rows").onclick = run(async e => {
      const d = e.target.closest("[data-del]"); if (!d) return;
      const item = C[ent].find(x => String(x.id) === d.dataset.del);
      if (!confirm(`«${item.title || item.q}» حذف شود؟ این کار قابل بازگشت نیست.`)) return;
      C = (await api("delete", { entity: ent, id: d.dataset.del })).content; toast("حذف شد"); draw();
    });
    if (E.sortable) dragSort($("#rows"), run(async ids => { C = (await api("reorder", { entity: ent, ids })).content; toast("ترتیب ذخیره شد"); }));
    draw();
  }
  function dragSort(tbody, onDone) {
    let dragged;
    tbody.addEventListener("dragstart", e => { dragged = e.target.closest("tr"); dragged.classList.add("drag"); });
    tbody.addEventListener("dragover", e => {
      e.preventDefault(); const over = e.target.closest("tr");
      if (!over || over === dragged) return;
      const r = over.getBoundingClientRect();
      over.parentNode.insertBefore(dragged, e.clientY > r.top + r.height / 2 ? over.nextSibling : over);
    });
    tbody.addEventListener("dragend", () => { dragged.classList.remove("drag"); onDone($$("tr", tbody).map(t => t.dataset.id)); });
  }

  /* ---------- فرم عمومی ---------- */
  function field([key, label, type, o = {}], val) {
    const id = "f_" + key, req = o.required ? "required" : "", dir = o.dir ? `dir="${o.dir}"` : "";
    const wrap = inner => `<div class="fld ${o.full || type === "textarea" ? "full" : ""}${type === "check" ? " chk" : ""}"><label for="${id}">${esc(label)}${o.required ? " *" : ""}</label>${inner}${o.hint ? `<small class="muted">${esc(o.hint)}</small>` : ""}</div>`;
    switch (type) {
      case "textarea": return wrap(`<textarea id="${id}" name="${key}" rows="${o.rows || 4}" ${req}>${esc(val)}</textarea>`);
      case "number": return wrap(`<input id="${id}" name="${key}" type="number" min="${o.min ?? 0}" ${o.max != null ? `max="${o.max}"` : ""} value="${esc(val)}" dir="ltr">`);
      case "check": return `<label class="fld chk"><input type="checkbox" name="${key}" ${val ? "checked" : ""}> ${esc(label)}</label>`;
      case "select": return wrap(`<select id="${id}" name="${key}">${o.options.map(([v, t]) => `<option value="${esc(v)}" ${String(v) === String(val) ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>`);
      case "icon": return wrap(`<div class="icons">${ICON_NAMES.map(n => `<label title="${n}"><input type="radio" name="${key}" value="${n}" ${n === val ? "checked" : ""}><span>${icon(n)}</span></label>`).join("")}</div>`);
      case "image": return wrap(`<div class="img-fld"><div class="img-pv">${val ? `<img src="${esc(src(val))}" alt="">` : "بدون تصویر"}</div>
          <div><input id="${id}" name="${key}" value="${esc(val)}" dir="ltr" placeholder="uploads/... یا https://..."><div class="row">
          <label class="btn sm">بارگذاری تصویر<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden data-up="${key}"></label>
          <button type="button" class="btn sm ghost" data-clear="${key}">حذف تصویر</button></div></div></div>`);
      case "bg": return wrap(`<div class="bg-fld"><input id="${id}" name="${key}" value="${esc(val)}" dir="ltr"><div class="presets">${BG_PRESETS.map(b => `<button type="button" style="background:${b}" data-bg="${esc(b)}" aria-label="رنگ"></button>`).join("")}</div></div>`);
      case "specs": return wrap(`<div class="specs" id="specs">${Object.entries(val || {}).map(([k, v]) => specRow(k, v)).join("")}</div><button type="button" class="btn sm ghost" id="add-spec">+ افزودن ردیف</button>`);
      default: return wrap(`<input id="${id}" name="${key}" value="${esc(val)}" ${dir} ${req} ${o.pattern ? `pattern="${o.pattern}"` : ""} ${o.placeholder ? `placeholder="${esc(o.placeholder)}"` : ""}>`);
    }
  }
  const specRow = (k = "", v = "") => `<div class="spec"><input placeholder="عنوان (مثلاً قطر)" value="${esc(k)}"><input placeholder="مقدار" value="${esc(v)}"><button type="button" class="btn sm danger" data-rmspec>✕</button></div>`;

  /* رویدادهای مشترک فرم: بارگذاری تصویر، پیش‌نمایش، رنگ و ردیف مشخصات */
  function wireForm(form) {
    form.addEventListener("change", run(async e => {
      const up = e.target.closest("[data-up]"); if (!up || !up.files[0]) return;
      const fd = new FormData(); fd.append("file", up.files[0]);
      const box = up.closest(".img-fld"); box.classList.add("busy");
      try {
        const { path } = await api("upload", fd, true);
        $(`[name="${up.dataset.up}"]`, form).value = path;
        $(".img-pv", box).innerHTML = `<img src="${esc(src(path))}" alt="">`;
        toast("تصویر بارگذاری شد؛ برای اعمال، ذخیره کنید.");
      } finally { box.classList.remove("busy"); up.value = ""; }
    }));
    form.addEventListener("input", e => {
      if (e.target.closest(".img-fld") && e.target.name) $(".img-pv", e.target.closest(".img-fld")).innerHTML = e.target.value ? `<img src="${esc(src(e.target.value))}" alt="">` : "بدون تصویر";
    });
    form.addEventListener("click", e => {
      const c = e.target.closest("[data-clear]"), b = e.target.closest("[data-bg]"), rm = e.target.closest("[data-rmspec]");
      if (c) { $(`[name="${c.dataset.clear}"]`, form).value = ""; $(".img-pv", c.closest(".img-fld")).textContent = "بدون تصویر"; }
      if (b) $("[name=bg]", form).value = b.dataset.bg;
      if (rm) rm.closest(".spec").remove();
      if (e.target.id === "add-spec") $("#specs", form).insertAdjacentHTML("beforeend", specRow());
    });
  }
  function readForm(form, fields) {
    const out = {};
    for (const [key, , type] of fields) {
      if (type === "check") out[key] = $(`[name="${key}"]`, form).checked;
      else if (type === "icon") out[key] = $(`[name="${key}"]:checked`, form)?.value || "shield";
      else if (type === "specs") out[key] = Object.fromEntries($$(".spec", form).map(r => $$("input", r).map(i => i.value.trim())).filter(([k]) => k));
      else out[key] = $(`[name="${key}"]`, form).value;
    }
    return out;
  }

  function editView(ent, id) {
    const E = ENT[ent], isNew = id === "new", view = $("#view");
    const item = isNew ? E.blank() : C[ent].find(x => String(x.id) === id);
    if (!item) { view.innerHTML = `<p>یافت نشد. <a href="#${ent}">بازگشت</a></p>`; return; }
    const fields = E.fields();
    view.innerHTML = `<div class="head"><h1>${isNew ? "افزودن" : "ویرایش"} ${E.one}</h1><a class="btn ghost" href="#${ent}">→ بازگشت به لیست</a></div>
      <form class="card form" novalidate>${fields.map(f => field(f, item[f[0]])).join("")}
        <div class="form-foot"><button class="btn">ذخیره</button>${ent === "products" && !isNew ? `<a class="btn ghost" target="_blank" rel="noopener" href="../product.html?id=${item.id}">مشاهده در سایت ↗</a>` : ""}</div></form>`;
    const form = $("form", view);
    wireForm(form);
    form.onsubmit = run(async e => {
      e.preventDefault();
      const bad = $$("[required]", form).find(i => !i.value.trim()) || $$("[pattern]", form).find(i => i.value && !new RegExp(`^${i.pattern}$`).test(i.value));
      if (bad) { bad.focus(); throw new Error(`فیلد «${bad.closest(".fld").querySelector("label").textContent.replace(" *", "")}» را درست پر کنید.`); }
      $("button.btn", form).disabled = true;
      try {
        const r = await api("save", { entity: ent, origId: isNew ? "" : String(item.id), item: { ...readForm(form, fields), id: isNew ? 0 : item.id, ...(E.numeric ? {} : { id: $("[name=id]", form).value.trim() }) } });
        C = r.content; toast("ذخیره شد");
        location.hash = `${ent}`;
      } finally { $("button.btn", form).disabled = false; }
    });
  }

  /* ---------- سفارش‌ها ---------- */
  let orderFilter = "";
  async function ordersView(view) {
    view.innerHTML = `<div class="head"><h1>سفارش‌ها و پیام‌ها</h1></div><div class="toolbar"><select id="of"><option value="">همه</option><option value="new">جدید</option><option value="doing">در حال پیگیری</option><option value="done">انجام شد</option></select></div><div id="ol">...</div>`;
    $("#of").value = orderFilter;
    let { orders } = await api("orders");
    const draw = () => {
      const list = orders.filter(o => !orderFilter || o.status === orderFilter);
      $("#ol").innerHTML = list.length ? list.map(o => `<article class="card order ${o.status}" data-id="${esc(o.id)}">
        <header><b>${o.type === "order" ? "🛒 سفارش" : "✉ پیام"} — ${esc(o.name)}</b>${statusTag(o.status)}<small>${dateFa(o.date)}</small></header>
        <div class="o-meta"><a href="tel:${esc(o.phone)}" dir="ltr">${esc(o.phone)}</a>${o.city ? `<span>شهر: ${esc(o.city)}</span>` : ""}${o.company ? `<span>${esc(o.company)}</span>` : ""}${o.subject ? `<span>موضوع: ${esc(o.subject)}</span>` : ""}</div>
        ${o.items?.length ? `<table class="tbl compact"><tr><th>کالا</th><th>تعداد</th><th>قیمت واحد</th></tr>${o.items.map(i => `<tr><td>${esc(i.title)}</td><td>${fa(i.qty)}</td><td>${money(i.price)}</td></tr>`).join("")}</table>` : ""}
        ${o.note ? `<p class="note">${esc(o.note)}</p>` : ""}
        <div class="o-acts"><select data-status>${Object.entries(STATUS).map(([k, [t]]) => `<option value="${k}" ${o.status === k ? "selected" : ""}>${t}</option>`).join("")}</select>
          <input data-note placeholder="یادداشت داخلی" value="${esc(o.adminNote || "")}"><button class="btn sm" data-save>ثبت</button><button class="btn sm danger" data-odel>حذف</button></div>
      </article>`).join("") : `<p class="muted">موردی وجود ندارد.</p>`;
    };
    $("#of").onchange = e => { orderFilter = e.target.value; draw(); };
    $("#ol").onclick = run(async e => {
      const card = e.target.closest(".order"); if (!card) return;
      const id = card.dataset.id;
      if (e.target.matches("[data-save]")) ({ orders } = await api("order", { id, status: $("[data-status]", card).value, adminNote: $("[data-note]", card).value }));
      else if (e.target.matches("[data-odel]") && confirm("این مورد حذف شود؟")) ({ orders } = await api("order", { id, delete: true }));
      else return;
      newOrders = orders.filter(o => o.status === "new").length; badge(); toast("انجام شد"); draw();
    });
    draw();
  }

  /* ---------- تنظیمات سایت ---------- */
  const SITE_FIELDS = [["name", "نام فروشگاه (فارسی)", "text", { required: true }], ["nameEn", "نام انگلیسی (لوگوی متنی؛ کلمه اول بزرگ)", "text", { dir: "ltr" }],
    ["slogan", "شعار", "text"], ["foundedYear", "سال تأسیس (شمسی)", "text"], ["phone", "تلفن", "text", { required: true, dir: "ltr" }], ["mobile", "موبایل", "text", { dir: "ltr" }],
    ["fax", "فکس", "text", { dir: "ltr" }], ["whatsapp", "شماره واتساپ (با کد کشور، مثل 98912...)", "text", { dir: "ltr" }], ["email", "ایمیل", "text", { dir: "ltr" }],
    ["hours", "ساعات کاری", "text"], ["address", "آدرس", "textarea", { rows: 2, full: true }], ["about", "متن درباره ما (هر خط یک پاراگراف)", "textarea", { rows: 6, full: true }],
    ["clients", "مشتریان ما (هر خط یک مورد)", "textarea", { rows: 4 }], ["url", "آدرس سایت (برای sitemap، مثل https://example.com)", "text", { dir: "ltr" }],
    ["catalog", "لینک فایل کاتالوگ (PDF)", "text", { dir: "ltr" }], ["video", "لینک ویدیوی معرفی (mp4)", "text", { dir: "ltr" }]];
  const SOCIAL = ["instagram", "telegram", "whatsapp", "linkedin", "facebook", "twitter", "youtube", "pinterest"];
  const SLIDE_FIELDS = [["kicker", "متن کوچک بالا", "text"], ["title", "تیتر", "text", { required: true }], ["text", "متن", "textarea", { rows: 2, full: true }],
    ["image", "تصویر پس‌زمینه", "image", { hint: "۱۹۲۰×۸۰۰" }], ["link", "لینک دکمه «محصولات»", "text", { dir: "ltr" }], ["bg", "رنگ پس‌زمینه (وقتی تصویر نیست)", "text", { dir: "ltr" }],
    ["icons", "آیکن‌های جایگزین (با ویرگول)", "text", { dir: "ltr" }]];

  function settingsView(view) {
    const s = C.site;
    const slideBox = (sl, i) => `<fieldset class="card slide-box" data-i="${i}"><legend>اسلاید ${fa(i + 1)} <button type="button" class="btn sm danger" data-rmslide>حذف</button></legend>
      ${SLIDE_FIELDS.map(f => field([`s${i}_${f[0]}`, f[1], f[2], f[3]], sl[f[0]])).join("")}</fieldset>`;
    view.innerHTML = `<div class="head"><h1>تنظیمات سایت</h1></div>
      <form id="sf" novalidate>
        <section class="card form"><h3 class="full">اطلاعات اصلی</h3>${SITE_FIELDS.map(f => field(f, f[0] === "clients" ? (s.clients || []).join("\n") : s[f[0]])).join("")}</section>
        <section class="card form"><h3 class="full">شبکه‌های اجتماعی (لینک کامل)</h3>${SOCIAL.map(k => field([`soc_${k}`, k, "text", { dir: "ltr" }], s.social?.[k])).join("")}</section>
        <h2>اسلایدر صفحه اصلی</h2><div id="slides">${(s.slides || []).map(slideBox).join("")}</div>
        <button type="button" class="btn ghost" id="add-slide">+ افزودن اسلاید</button>
        <div class="form-foot sticky"><button class="btn">ذخیره تنظیمات</button></div>
      </form>`;
    const form = $("#sf");
    wireForm(form);
    $("#add-slide").onclick = () => {
      const boxes = $$(".slide-box", form);
      if (boxes.length >= 6) return toast("حداکثر ۶ اسلاید", true);
      const next = Math.max(-1, ...boxes.map(b => +b.dataset.i)) + 1;
      $("#slides").insertAdjacentHTML("beforeend", slideBox({ title: "", kicker: "", text: "", image: "", link: "shop.html", bg: "#14325e", icons: "trocar" }, next));
    };
    form.addEventListener("click", e => { if (e.target.closest("[data-rmslide]") && confirm("اسلاید حذف شود؟")) e.target.closest(".slide-box").remove(); });
    form.onsubmit = run(async e => {
      e.preventDefault();
      const site = readForm(form, SITE_FIELDS);
      site.clients = site.clients.split("\n").map(x => x.trim()).filter(Boolean);
      site.social = Object.fromEntries(SOCIAL.map(k => [k, $(`[name=soc_${k}]`, form).value.trim()]));
      site.slides = $$(".slide-box", form).map(b => Object.fromEntries(SLIDE_FIELDS.map(([k]) => [k, $(`[name=s${b.dataset.i}_${k}]`, b).value])));
      C = (await api("settings", { site })).content;
      toast("تنظیمات ذخیره شد");
      $(".brand-box b").textContent = C.site.name;
    });
  }

  /* ---------- حساب کاربری و پشتیبان ---------- */
  function accountView(view) {
    view.innerHTML = `<div class="head"><h1>حساب کاربری و پشتیبان‌گیری</h1></div>
      <div class="cards2">
        <form class="card form" id="pw"><h3 class="full">تغییر رمز عبور</h3>
          <div class="fld full"><label>رمز فعلی</label><input type="password" name="current" autocomplete="current-password" required></div>
          <div class="fld full"><label>رمز جدید (حداقل ۸ کاراکتر)</label><input type="password" name="next" autocomplete="new-password" minlength="8" required></div>
          <div class="form-foot"><button class="btn">تغییر رمز</button></div></form>
        <section class="card"><h3>پشتیبان‌گیری</h3><p class="muted">شامل همه محصولات، دسته‌ها، تنظیمات و سفارش‌ها. تصاویر پوشه uploads را جداگانه از هاست دانلود کنید.</p>
          <a class="btn" href="api.php?action=backup">دانلود فایل پشتیبان</a>
          <h3 class="mt">بازگردانی</h3><p class="muted">محتوای فعلی سایت با فایل پشتیبان جایگزین می‌شود (سفارش‌ها دست نمی‌خورند).</p>
          <label class="btn ghost">انتخاب فایل پشتیبان<input type="file" accept="application/json,.json" hidden id="restore"></label></section>
      </div>`;
    $("#pw").onsubmit = run(async e => {
      e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
      await api("password", d); e.target.reset(); toast("رمز عبور تغییر کرد");
    });
    $("#restore").onchange = run(async e => {
      const f = e.target.files[0]; if (!f) return;
      if (!confirm("همه محتوای فعلی سایت جایگزین شود؟")) return;
      const data = JSON.parse(await f.text());
      C = (await api("restore", { content: data.content || data })).content; toast("بازگردانی انجام شد");
    });
  }

  /* ---------- ورود / راه‌اندازی ---------- */
  function authView(setup) {
    document.body.className = "auth";
    app.innerHTML = `<form class="card login" novalidate><h1>${setup ? "ساخت حساب مدیر" : "ورود به پنل مدیریت"}</h1>
      ${setup ? `<p class="muted">اولین ورود: نام کاربری و رمز عبور مدیر سایت را تعیین کنید.</p>` : ""}
      <div class="fld full"><label>نام کاربری</label><input name="user" dir="ltr" autocomplete="username" required></div>
      <div class="fld full"><label>رمز عبور ${setup ? "(حداقل ۸ کاراکتر)" : ""}</label><input name="pass" type="password" dir="ltr" autocomplete="${setup ? "new-password" : "current-password"}" required></div>
      ${setup ? `<div class="fld full"><label>تکرار رمز عبور</label><input name="pass2" type="password" dir="ltr" autocomplete="new-password" required></div>` : ""}
      <button class="btn">${setup ? "ساخت حساب و ورود" : "ورود"}</button><p class="err" role="alert"></p></form>`;
    const form = $("form");
    form.onsubmit = async e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form));
      try {
        if (setup && d.pass !== d.pass2) throw new Error("تکرار رمز عبور یکسان نیست.");
        await api(setup ? "setup" : "login", { user: d.user.trim(), pass: d.pass });
        boot();
      } catch (err) { $(".err", form).textContent = err.message; }
    };
    $("input", form).focus();
  }

  async function boot() {
    try {
      const st = await api("state");
      csrf = st.csrf;
      if (st.needsSetup) return authView(true);
      if (!st.authed) return authView(false);
      user = st.user;
      const r = await api("content");
      C = r.content; ICON_NAMES = r.icons; newOrders = r.newOrders;
      warn = [];
      if (!r.writable) warn.push("پوشه data یا فایل data/content.js قابل نوشتن نیست؛ تغییرات ذخیره نمی‌شود. دسترسی (755/644 یا 775) را در هاست اصلاح کنید.");
      if (!r.uploadsWritable) warn.push("پوشه uploads قابل نوشتن نیست؛ بارگذاری تصویر کار نمی‌کند.");
      document.body.className = "";
      shell();
    } catch (e) {
      app.innerHTML = `<div class="boot err">${esc(e.message)}<br><small>این پنل باید روی هاست دارای PHP 8+ اجرا شود.</small></div>`;
    }
  }
  boot();
})();
