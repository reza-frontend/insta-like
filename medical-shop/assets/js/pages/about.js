/* درباره ما */
(function () {
  "use strict";
  $("#about-title").textContent = `درباره ${SITE.name}`;
  $("#about-text").innerHTML = paragraphs(SITE.about);
  const year = parseInt(String(SITE.foundedYear).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)), 10);
  const now = +new Intl.DateTimeFormat("en-u-ca-persian", { year: "numeric" }).format(new Date()).replace(/\D/g, "");
  $("#st-years").textContent = year && now > year ? "+" + fa(now - year) : "—";
  $("#st-products").textContent = "+" + fa(PRODUCTS.length);
  $("#st-brands").textContent = fa(BRANDS.length);
})();
