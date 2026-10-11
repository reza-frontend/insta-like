/* لیست مقالات */
$("#posts").innerHTML = POSTS.length ? POSTS.map(postCard).join("") : `<div class="empty">هنوز مقاله‌ای منتشر نشده است.</div>`;
