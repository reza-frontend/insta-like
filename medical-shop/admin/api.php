<?php
/**
 * API پنل مدیریت. همه درخواست‌های POST (به‌جز ورود و راه‌اندازی اولیه) به توکن CSRF در هدر X-CSRF نیاز دارند.
 */
declare(strict_types=1);
require __DIR__ . '/lib.php';

security_headers();
start_session();

$action = (string) ($_GET['action'] ?? '');
$isPost = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
$admin = store_read('admin', null);
$authed = !empty($_SESSION['uid']) && $admin && hash_equals($admin['user'], $_SESSION['uid']);

/* ---------- بدون نیاز به ورود ---------- */
if ($action === 'state') {
    respond(['ok' => true, 'needsSetup' => !$admin, 'authed' => (bool) $authed, 'csrf' => $_SESSION['csrf'], 'user' => $authed ? $admin['user'] : null]);
}

if ($action === 'setup' && $isPost) {
    if ($admin) fail('حساب مدیر قبلاً ساخته شده است.', 403);
    $in = json_body();
    $user = one_line((string) ($in['user'] ?? ''));
    $pass = (string) ($in['pass'] ?? '');
    if (!preg_match('/^[\w.@-]{3,40}$/u', $user)) fail('نام کاربری باید ۳ تا ۴۰ کاراکتر (حروف انگلیسی، عدد، . @ - _) باشد.');
    if (mb_strlen($pass) < 8) fail('رمز عبور باید حداقل ۸ کاراکتر باشد.');
    store_write('admin', ['user' => $user, 'hash' => password_hash($pass, PASSWORD_DEFAULT)]);
    session_regenerate_id(true);
    $_SESSION['uid'] = $user;
    respond(['ok' => true]);
}

if ($action === 'login' && $isPost) {
    if (!$admin) fail('ابتدا حساب مدیر را بسازید.', 403);
    $ip = client_ip();
    $t = store_read('throttle');
    if (($t[$ip]['until'] ?? 0) > time()) fail('به دلیل تلاش‌های ناموفق زیاد، ۱۵ دقیقه دیگر دوباره امتحان کنید.', 429);
    $in = json_body();
    $ok = hash_equals($admin['user'], (string) ($in['user'] ?? '')) & password_verify((string) ($in['pass'] ?? ''), $admin['hash']);
    store_update('throttle', function (array &$t) use ($ip, $ok) {
        foreach ($t as $k => $v) if (($v['until'] ?? 0) < time() && ($v['at'] ?? 0) < time() - 900) unset($t[$k]);
        if ($ok) { unset($t[$ip]); return; }
        $n = ($t[$ip]['n'] ?? 0) + 1;
        $t[$ip] = ['n' => $n, 'at' => time(), 'until' => $n >= 5 ? time() + 900 : 0];
    });
    if (!$ok) { usleep(400000); fail('نام کاربری یا رمز عبور اشتباه است.', 401); }
    if (password_needs_rehash($admin['hash'], PASSWORD_DEFAULT)) store_write('admin', ['user' => $admin['user'], 'hash' => password_hash((string) $in['pass'], PASSWORD_DEFAULT)]);
    session_regenerate_id(true);
    $_SESSION['uid'] = $admin['user'];
    respond(['ok' => true]);
}

/* ---------- از اینجا به بعد ورود الزامی است ---------- */
if (!$authed) fail('لطفاً وارد شوید.', 401);
if ($isPost && !hash_equals($_SESSION['csrf'], (string) ($_SERVER['HTTP_X_CSRF'] ?? ''))) fail('نشست منقضی شده؛ صفحه را دوباره بارگذاری کنید.', 403);

const LABELS = [
    'title' => 'عنوان', 'cat' => 'دسته‌بندی', 'brand' => 'برند', 'id' => 'شناسه', 'slug' => 'نامک', 'image' => 'تصویر', 'logo' => 'لوگو',
    'q' => 'سوال', 'a' => 'پاسخ', 'name' => 'نام سایت', 'phone' => 'تلفن', 'parent' => 'دسته والد', 'link' => 'لینک', 'url' => 'آدرس سایت',
    'catalog' => 'لینک کاتالوگ', 'video' => 'ویدیو',
];

function clean_site(array $in): array {
    $site = clean_item(SITE_SCHEMA, $in, LABELS);
    $site['whatsapp'] = preg_replace('/\D/', '', fa_digits($site['whatsapp']));
    $site['social'] = [];
    foreach (SOCIAL_KEYS as $k) $site['social'][$k] = clean_value('link', $in['social'][$k] ?? '', $k);
    $site['slides'] = [];
    foreach (array_slice((array) ($in['slides'] ?? []), 0, 6) as $s) $site['slides'][] = clean_item(SLIDE_SCHEMA, (array) $s, LABELS);
    return $site;
}

switch ($action) {
    case 'logout':
        $_SESSION = [];
        session_destroy();
        respond(['ok' => true]);

    case 'content':
        $orders = store_read('orders');
        respond(['ok' => true, 'content' => content_load(), 'icons' => ICONS,
            'newOrders' => count(array_filter($orders, fn($o) => ($o['status'] ?? 'new') === 'new')),
            'writable' => is_writable(CONTENT_FILE) && is_writable(dirname(CONTENT_FILE)), 'uploadsWritable' => is_dir(UPLOAD_DIR) && is_writable(UPLOAD_DIR)]);

    case 'save': /* افزودن یا ویرایش آیتم یک مجموعه */
        $in = json_body();
        $entity = (string) ($in['entity'] ?? '');
        if (!isset(SCHEMAS[$entity])) fail('نوع داده نامعتبر است.');
        $c = content_load();
        $item = clean_item(SCHEMAS[$entity], (array) ($in['item'] ?? []), LABELS, $c);
        $orig = (string) ($in['origId'] ?? '');
        $list = &$c[$entity];
        $numeric = SCHEMAS[$entity]['id'] === 'int';

        if ($numeric) {
            $item['id'] = $orig === '' ? max([0, ...array_column($list, 'id')]) + 1 : (int) $orig;
            if ($orig !== '' && !find_index($list, $orig)) fail('این آیتم پیدا نشد؛ صفحه را دوباره بارگذاری کنید.', 404);
        } elseif ($orig !== '' && $orig !== $item['id']) {
            if (find_index($list, $item['id'])) fail('این شناسه قبلاً استفاده شده است.');
            /* تغییر شناسه: ارجاع‌ها هم به‌روز شوند */
            foreach ($c['products'] as &$p) if ($p[$entity === 'brands' ? 'brand' : 'cat'] === $orig) $p[$entity === 'brands' ? 'brand' : 'cat'] = $item['id'];
            unset($p);
            if ($entity === 'categories') foreach ($c['categories'] as &$x) if (($x['parent'] ?? '') === $orig) $x['parent'] = $item['id'];
            unset($x);
        } elseif ($orig === '' && find_index($list, $item['id'])) {
            fail('این شناسه قبلاً استفاده شده است.');
        }

        if ($entity === 'categories' && $item['parent'] !== '') {
            if ($item['parent'] === $item['id']) fail('دسته نمی‌تواند والد خودش باشد.');
            $par = $c['categories'][find_index($c['categories'], $item['parent']) - 1];
            if (($par['parent'] ?? '') !== '') fail('فقط یک سطح زیر‌دسته پشتیبانی می‌شود.');
        }
        if ($entity === 'products') {
            $item['slug'] = $item['slug'] ?: 'p' . $item['id'];
            foreach ($list as $x) if ($x['slug'] === $item['slug'] && (string) $x['id'] !== (string) ($orig ?: $item['id'])) fail('این نامک برای محصول دیگری استفاده شده است.');
        }
        $idx = find_index($list, $orig !== '' ? $orig : $item['id']);
        if ($idx) $list[$idx - 1] = $item; else $list[] = $item;
        unset($list);
        content_save($c);
        respond(['ok' => true, 'item' => $item, 'content' => $c]);

    case 'delete':
        $in = json_body();
        $entity = (string) ($in['entity'] ?? '');
        if (!isset(SCHEMAS[$entity])) fail('نوع داده نامعتبر است.');
        $c = content_load();
        $id = (string) ($in['id'] ?? '');
        if ($entity === 'categories') {
            if (array_filter($c['products'], fn($p) => $p['cat'] === $id)) fail('ابتدا محصولات این دسته را به دسته دیگری منتقل کنید.');
            if (array_filter($c['categories'], fn($x) => ($x['parent'] ?? '') === $id)) fail('این دسته زیر‌دسته دارد؛ ابتدا آن‌ها را حذف یا منتقل کنید.');
        }
        if ($entity === 'brands' && array_filter($c['products'], fn($p) => $p['brand'] === $id)) fail('محصولاتی با این برند وجود دارد.');
        $c[$entity] = array_values(array_filter($c[$entity], fn($x) => (string) $x['id'] !== $id));
        content_save($c);
        respond(['ok' => true, 'content' => $c]);

    case 'reorder': /* ترتیب نمایش آیتم‌ها */
        $in = json_body();
        $entity = (string) ($in['entity'] ?? '');
        if (!isset(SCHEMAS[$entity])) fail('نوع داده نامعتبر است.');
        $c = content_load();
        $pos = array_flip(array_map('strval', (array) ($in['ids'] ?? [])));
        usort($c[$entity], fn($a, $b) => ($pos[(string) $a['id']] ?? PHP_INT_MAX) <=> ($pos[(string) $b['id']] ?? PHP_INT_MAX));
        content_save($c);
        respond(['ok' => true, 'content' => $c]);

    case 'settings':
        $in = json_body();
        $c = content_load();
        $c['site'] = clean_site((array) ($in['site'] ?? []));
        content_save($c);
        respond(['ok' => true, 'content' => $c]);

    case 'upload':
        if (!$isPost || empty($_FILES['file'])) fail('فایلی ارسال نشد.');
        $f = $_FILES['file'];
        if ($f['error'] !== UPLOAD_ERR_OK) fail($f['error'] === UPLOAD_ERR_INI_SIZE || $f['error'] === UPLOAD_ERR_FORM_SIZE ? 'حجم فایل بیش از حد مجاز سرور است.' : 'بارگذاری ناموفق بود.');
        if ($f['size'] > 5 * 1024 * 1024) fail('حداکثر حجم تصویر ۵ مگابایت است.');
        $info = @getimagesize($f['tmp_name']);
        $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'][$info['mime'] ?? ''] ?? null;
        if (!$ext) fail('فقط تصاویر JPG، PNG، WEBP و GIF مجاز است.');
        if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0775, true);
        $name = date('Ymd') . '-' . bin2hex(random_bytes(6)) . '.' . $ext;
        if (!move_uploaded_file($f['tmp_name'], UPLOAD_DIR . '/' . $name)) fail('ذخیره فایل ممکن نیست؛ دسترسی پوشه uploads را بررسی کنید.', 500);
        respond(['ok' => true, 'path' => 'uploads/' . $name, 'width' => $info[0], 'height' => $info[1]]);

    case 'orders':
        respond(['ok' => true, 'orders' => array_reverse(store_read('orders'))]);

    case 'order':
        $in = json_body();
        $id = (string) ($in['id'] ?? '');
        $del = !empty($in['delete']);
        $status = in_array($in['status'] ?? '', ['new', 'doing', 'done'], true) ? $in['status'] : null;
        $note = array_key_exists('adminNote', $in) ? mb_substr(trim((string) $in['adminNote']), 0, 1000) : null;
        store_update('orders', function (array &$orders) use ($id, $del, $status, $note) {
            foreach ($orders as $i => &$o) {
                if ($o['id'] !== $id) continue;
                if ($del) { unset($orders[$i]); $orders = array_values($orders); return; }
                if ($status) $o['status'] = $status;
                if ($note !== null) $o['adminNote'] = $note;
            }
            unset($o);
        });
        respond(['ok' => true, 'orders' => array_reverse(store_read('orders'))]);

    case 'password':
        $in = json_body();
        if (!password_verify((string) ($in['current'] ?? ''), $admin['hash'])) fail('رمز فعلی اشتباه است.');
        if (mb_strlen((string) ($in['next'] ?? '')) < 8) fail('رمز جدید باید حداقل ۸ کاراکتر باشد.');
        store_write('admin', ['user' => $admin['user'], 'hash' => password_hash((string) $in['next'], PASSWORD_DEFAULT)]);
        session_regenerate_id(true);
        respond(['ok' => true]);

    case 'backup':
        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="backup-' . date('Y-m-d') . '.json"');
        echo json_encode(['content' => content_load(), 'orders' => store_read('orders')], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        exit;

    case 'restore':
        $in = json_body();
        $src = (array) ($in['content'] ?? []);
        foreach (['site', 'categories', 'brands', 'products', 'posts', 'faq'] as $k) if (!isset($src[$k]) || !is_array($src[$k])) fail('فایل پشتیبان نامعتبر است.');
        $c = ['site' => clean_site((array) $src['site'])];
        /* بازسازی با اعتبارسنجی کامل؛ ترتیب برای بررسی ارجاع‌ها مهم است */
        foreach (['brands', 'categories', 'products', 'posts', 'faq'] as $k) {
            $c[$k] = [];
            foreach ($src[$k] as $row) $c[$k][] = clean_item(SCHEMAS[$k], (array) $row, LABELS, $k === 'categories' ? null : $c);
        }
        content_save($c);
        respond(['ok' => true, 'content' => $c]);
}

fail('عملیات نامعتبر است.', 404);
