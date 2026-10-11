/* تماس با ما */
(function () {
  "use strict";
  const rows = [
    ["📞", "تلفن", `<a href="${tel(SITE.phone)}" dir="ltr">${esc(fa(SITE.phone))}</a>`],
    SITE.mobile && ["📱", "موبایل / واتساپ", `<a href="${tel(SITE.mobile)}" dir="ltr">${esc(fa(SITE.mobile))}</a>`],
    SITE.fax && ["📠", "فکس", `<span dir="ltr">${esc(fa(SITE.fax))}</span>`],
    ["✉️", "ایمیل", `<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>`],
    SITE.hours && ["🕘", "ساعات کاری", esc(SITE.hours)],
    ["📍", "آدرس", esc(SITE.address)]
  ].filter(Boolean);
  $("#c-cards").innerHTML = rows.map(([i, t, v]) => `<div class="c-card"><span class="fi" aria-hidden="true">${i}</span><div><small>${t}</small><b>${v}</b></div></div>`).join("");
  if (SITE.address) $("#map").innerHTML = `<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/${encodeURIComponent(SITE.address)}">مشاهده آدرس روی نقشه</a>`;

  $("#contact-form").onsubmit = async e => {
    e.preventDefault();
    const f = e.target, data = Object.fromEntries(new FormData(f)), msg = $("#form-msg");
    if (!data.name.trim() || !data.note.trim() || !/^[+\d۰-۹\s-]{7,20}$/.test(data.phone.trim())) {
      msg.className = "form-msg err"; msg.textContent = "نام، شماره تماس معتبر و متن پیام را وارد کنید."; return;
    }
    f.querySelector("button").disabled = true;
    try {
      if (await sendLead({ type: "contact", ...data })) {
        f.reset(); msg.className = "form-msg ok"; msg.textContent = "پیام شما ثبت شد. به‌زودی با شما تماس می‌گیریم.";
      } else {
        location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`${data.note}\n\n${data.name} - ${data.phone} - ${data.company}`)}`;
      }
    } catch (err) { msg.className = "form-msg err"; msg.textContent = err.message; }
    f.querySelector("button").disabled = false;
  };
})();
