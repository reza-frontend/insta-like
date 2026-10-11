/* صفحه اصلی */
(function () {
  "use strict";
  const slideHtml = s => `<div class="slide" data-img="${esc(s.image)}" style="background:radial-gradient(circle at 30% 50%,${esc(s.bg)}cc,${esc(s.bg)} 55%,#0a0f18)">
      <div class="fallback"><div class="fb-icons">${String(s.icons || "").split(",").filter(Boolean).map(i => `<div>${icon(i.trim())}</div>`).join("")}</div></div>
      <div class="container"><div class="slide-txt">
        <span class="kicker">${esc(s.kicker)}</span><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p>
        <div class="hero-btns"><a href="${esc(s.link || "shop.html")}"><i>✚</i> محصولات</a><a href="about.html">درباره ما</a></div>
      </div></div></div>`;

  $("#slides").outerHTML = (SITE.slides || []).map(slideHtml).join("");
  const firstTitle = $(".slide h2"); if (firstTitle) firstTitle.outerHTML = `<h1>${firstTitle.innerHTML}</h1>`;

  $("#cats").innerHTML = CATEGORIES.filter(c => c.home).map(catCard).join("");
  const newest = PRODUCTS.filter(p => p.isNew), best = PRODUCTS.filter(p => p.isBest);
  $("#newest").innerHTML = (newest.length ? newest : PRODUCTS.slice(-8).reverse()).map(card).join("");
  $("#best").innerHTML = (best.length ? best : PRODUCTS.slice(0, 8)).map(card).join("");
  $("#brands").innerHTML = BRANDS.map(brandCard).join("");
  $("#posts").innerHTML = POSTS.slice(0, 4).map(postCard).join("");
  $("#faq-list").innerHTML = FAQ.map((f, i) => `<details${i ? "" : " open"}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");
  $("#clients").innerHTML = (SITE.clients || []).map(c => `<span>${esc(c)}</span>`).join("");
  $("#about-title").textContent = SITE.name;
  $("#about-text").innerHTML = paragraphs(SITE.about);
  $("#newest-art").innerHTML = img("assets/img/newest-side.jpg", "", "lungs");
  const call = $("#call-btn"); call.href = tel(SITE.phone); call.textContent = "تماس با " + SITE.name;

  /* ویدیو معرفی: کاور از assets/img/about.jpg ، فایل از تنظیمات (یا assets/video/about.mp4) */
  const v = $("#video"), src = SITE.video || "assets/video/about.mp4";
  probe("assets/img/about.jpg", s => v.insertAdjacentHTML("afterbegin", `<img src="${s}" alt="">`));
  const play = () => {
    v.innerHTML = `<video src="${esc(src)}" controls autoplay playsinline></video>`;
    $("video", v).onerror = () => { v.innerHTML = `<p class="video-missing">ویدیو هنوز بارگذاری نشده است.</p>`; };
  };
  v.addEventListener("click", play, { once: true });
  v.addEventListener("keydown", e => { if (e.key === "Enter") play(); }, { once: true });
})();
