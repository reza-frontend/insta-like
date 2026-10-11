/* صفحه مقاله */
(function () {
  "use strict";
  const p = byId(POSTS, qs("id"));
  if (!p) { $("#post").innerHTML = `<div class="empty">مقاله پیدا نشد. <a href="blog.html">همه مقالات</a></div>`; return; }
  document.title = `${p.title} | ${SITE.name}`;
  $('meta[name="description"]').content = p.excerpt;
  $("#crumb").innerHTML = `<a href="index.html">خانه</a> / <a href="blog.html">مقالات</a> / <b>${esc(p.title)}</b>`;
  $("#post").innerHTML = `<div class="post-cover">${postImg(p)}</div>
    <div class="post-meta"><span>${esc(p.cat)}</span><span>${esc(fa(p.date))}</span></div>
    <h1>${esc(p.title)}</h1><div class="post-body">${paragraphs(p.body || p.excerpt)}</div>`;
  $("#more").innerHTML = POSTS.filter(x => x.id !== p.id).slice(0, 4).map(postCard).join("");
})();
