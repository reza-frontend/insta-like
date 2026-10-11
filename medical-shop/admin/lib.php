<?php
/**
 * کتابخانه مشترک پنل مدیریت و API عمومی.
 * ذخیره‌سازی: محتوای سایت در data/content.js (همان فایلی که سایت می‌خواند)،
 * سفارش‌ها و حساب مدیر در admin/storage/*.json.php (با گارد exit تا از وب خوانده نشوند).
 */
declare(strict_types=1);

const ROOT = __DIR__ . '/..';
const STORAGE = __DIR__ . '/storage';
const CONTENT_FILE = ROOT . '/data/content.js';
const UPLOAD_DIR = ROOT . '/uploads';
const CONTENT_PREFIX = 'window.CONTENT = ';
const STORE_GUARD = "<?php http_response_code(404); exit; ?>\n";

/* ---------------- پاسخ JSON ---------------- */
function respond(array $data, int $code = 200): never {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function fail(string $msg, int $code = 400): never { respond(['ok' => false, 'error' => $msg], $code); }

function json_body(): array {
    $raw = file_get_contents('php://input', false, null, 0, 2_000_000);
    $data = json_decode($raw ?: '[]', true);
    if (!is_array($data)) fail('درخواست نامعتبر است.');
    return $data;
}

/* ---------------- فایل‌ها (نوشتن اتمیک با قفل) ---------------- */
function write_atomic(string $file, string $data): void {
    $dir = dirname($file);
    if (!is_dir($dir) && !mkdir($dir, 0775, true)) fail('ساخت پوشه ممکن نیست: ' . basename($dir), 500);
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $data, LOCK_EX) === false || !rename($tmp, $file)) {
        @unlink($tmp);
        fail('ذخیره فایل ممکن نیست. دسترسی نوشتن پوشه «' . basename($dir) . '» را بررسی کنید.', 500);
    }
}

function store_path(string $name): string { return STORAGE . "/$name.json.php"; }

function store_read(string $name, $default = []) {
    $f = store_path($name);
    if (!is_file($f)) return $default;
    $raw = (string) file_get_contents($f);
    $json = substr($raw, strlen(STORE_GUARD));
    $data = json_decode($json, true);
    return is_array($data) ? $data : $default;
}

function store_write(string $name, array $data): void {
    write_atomic(store_path($name), STORE_GUARD . json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
}

/** خواندن-تغییر-نوشتن با قفل انحصاری (برای سفارش‌ها و محدودیت نرخ) */
function store_update(string $name, callable $fn) {
    if (!is_dir(STORAGE)) mkdir(STORAGE, 0775, true);
    $lock = fopen(STORAGE . "/$name.lock", 'c');
    flock($lock, LOCK_EX);
    try {
        $data = store_read($name);
        $result = $fn($data);
        store_write($name, $data);
        return $result;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

/* ---------------- محتوای سایت ---------------- */
function content_load(): array {
    $raw = is_file(CONTENT_FILE) ? (string) file_get_contents(CONTENT_FILE) : '';
    $start = strpos($raw, '{');
    $end = strrpos($raw, '}');
    $data = ($start !== false && $end !== false) ? json_decode(substr($raw, $start, $end - $start + 1), true) : null;
    if (!is_array($data)) fail('فایل data/content.js خراب یا ناموجود است.', 500);
    foreach (['site' => [], 'categories' => [], 'brands' => [], 'products' => [], 'posts' => [], 'faq' => []] as $k => $d) $data[$k] ??= $d;
    return $data;
}

function content_save(array $c): void {
    /* JSON_HEX_TAG مانع شکستن اسکریپت با متن‌هایی مثل </script> می‌شود */
    $json = json_encode($c, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_HEX_TAG);
    write_atomic(CONTENT_FILE, CONTENT_PREFIX . $json . ";\n");
    write_sitemap($c);
}

/** sitemap.xml و robots.txt وقتی آدرس سایت در تنظیمات وارد شده باشد */
function write_sitemap(array $c): void {
    $base = rtrim((string) ($c['site']['url'] ?? ''), '/');
    if (!preg_match('~^https?://~', $base)) return;
    $urls = ['', 'shop.html', 'blog.html', 'about.html', 'contact.html'];
    foreach ($c['categories'] as $x) $urls[] = 'shop.html?cat=' . rawurlencode($x['id']);
    foreach ($c['products'] as $x) $urls[] = 'product.html?id=' . $x['id'];
    foreach ($c['posts'] as $x) $urls[] = 'post.html?id=' . $x['id'];
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($urls as $u) $xml .= '  <url><loc>' . htmlspecialchars("$base/$u", ENT_XML1) . "</loc></url>\n";
    write_atomic(ROOT . '/sitemap.xml', $xml . "</urlset>\n");
    write_atomic(ROOT . '/robots.txt', "User-agent: *\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: $base/sitemap.xml\n");
}

/* ---------------- اعتبارسنجی داده‌ها ----------------
   نوع‌ها: str:N (متن یک‌خطی)، text:N (چندخطی)، slug، int، uint، bool، rate، icon، path، link، css، specs، ref:X، list
   علامت ! یعنی الزامی */
const ICONS = ['trocar','needle','grasper','scissors','suction','bag','scalpel','clip','stapler','cartridge','circular','skin','mesh','pencil','plate','ecg','spo2','cuff','endo','cover','shield','lungs'];

const SCHEMAS = [
    'products' => ['id' => 'int', 'slug' => 'slug', 'title' => 'str:150!', 'en' => 'str:150', 'cat' => 'ref:categories!', 'brand' => 'ref:brands!',
        'icon' => 'icon', 'image' => 'path', 'price' => 'uint', 'oldPrice' => 'uint', 'stock' => 'bool', 'rating' => 'rate',
        'isNew' => 'bool', 'isBest' => 'bool', 'short' => 'text:600', 'body' => 'text:20000', 'specs' => 'specs'],
    'categories' => ['id' => 'slug!', 'title' => 'str:150!', 'parent' => 'ref:categories', 'icon' => 'icon', 'bg' => 'css', 'image' => 'path', 'home' => 'bool'],
    'brands' => ['id' => 'slug!', 'title' => 'str:100!', 'en' => 'str:100', 'logo' => 'path', 'style' => 'css'],
    'posts' => ['id' => 'int', 'title' => 'str:200!', 'date' => 'str:20', 'cat' => 'str:60', 'icon' => 'icon', 'image' => 'path', 'excerpt' => 'text:600', 'body' => 'text:50000'],
    'faq' => ['id' => 'int', 'q' => 'str:300!', 'a' => 'text:2000!'],
];

const SITE_SCHEMA = [
    'name' => 'str:80!', 'nameEn' => 'str:80', 'slogan' => 'str:200', 'phone' => 'str:30!', 'mobile' => 'str:30', 'fax' => 'str:30',
    'whatsapp' => 'str:20', 'email' => 'str:120', 'hours' => 'str:120', 'address' => 'text:400', 'foundedYear' => 'str:10',
    'url' => 'link', 'catalog' => 'link', 'video' => 'link', 'about' => 'text:5000', 'clients' => 'list',
];
const SLIDE_SCHEMA = ['kicker' => 'str:100', 'title' => 'str:200!', 'text' => 'text:600', 'image' => 'path', 'link' => 'link', 'icons' => 'str:120', 'bg' => 'css'];
const SOCIAL_KEYS = ['instagram', 'telegram', 'whatsapp', 'facebook', 'twitter', 'youtube', 'linkedin', 'pinterest'];

function fa_digits(string $s): string {
    return strtr($s, ['۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4', '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9']);
}

function one_line(string $s): string { return trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s)); }

function clean_value(string $type, $v, string $label, ?array $content = null) {
    [$base, $arg] = array_pad(explode(':', rtrim($type, '!')), 2, null);
    $required = str_ends_with($type, '!');
    switch ($base) {
        case 'str':  $v = mb_substr(one_line((string) $v), 0, (int) $arg); break;
        case 'text': $v = mb_substr(trim(str_replace("\r", '', preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', '', (string) $v))), 0, (int) $arg); break;
        case 'slug':
            $v = strtolower(one_line((string) $v));
            if ($v !== '' && !preg_match('/^[a-z0-9][a-z0-9-]{0,59}$/', $v)) fail("«{$label}» فقط حروف کوچک انگلیسی، عدد و خط تیره مجاز است.");
            break;
        case 'int':  $v = max(0, (int) $v); break;
        case 'uint': $v = max(0, (int) preg_replace('/[^\d]/', '', fa_digits((string) $v))); break;
        case 'bool': $v = filter_var($v, FILTER_VALIDATE_BOOLEAN); break;
        case 'rate': $v = min(5, max(0, (int) $v)); break;
        case 'icon': $v = in_array($v, ICONS, true) ? $v : 'shield'; break;
        case 'path':
            $v = one_line((string) $v);
            if ($v !== '' && !preg_match('~^(uploads|assets)/[\w\-./]+$~', $v) && !preg_match('~^https?://[^\s"<>]+$~i', $v)) fail("آدرس «{$label}» نامعتبر است.");
            if (str_contains($v, '..')) fail("آدرس «{$label}» نامعتبر است.");
            break;
        case 'link':
            $v = one_line((string) $v);
            if ($v !== '' && !preg_match('~^(https?://|mailto:|tel:|[\w\-./?=&%#]+$)~i', $v)) fail("لینک «{$label}» نامعتبر است.");
            if (preg_match('~^\s*(javascript|data|vbscript):~i', $v)) fail("لینک «{$label}» نامعتبر است.");
            break;
        case 'css':  $v = mb_substr(preg_replace('/[<>"{};\\\\]/', '', one_line((string) $v)), 0, 300); break;
        case 'list':
            $v = is_array($v) ? $v : preg_split('/\n+/', (string) $v);
            $v = array_values(array_filter(array_map(fn($x) => mb_substr(one_line((string) $x), 0, 100), $v), 'strlen'));
            break;
        case 'specs':
            $out = [];
            foreach ((is_array($v) ? $v : []) as $k => $val) {
                if (is_array($val)) [$k, $val] = [$val['k'] ?? $val[0] ?? '', $val['v'] ?? $val[1] ?? ''];
                $k = mb_substr(one_line((string) $k), 0, 80);
                if ($k !== '') $out[$k] = mb_substr(one_line((string) $val), 0, 300);
            }
            $v = (object) $out; /* حتی خالی هم شیء JSON بماند */
            break;
        case 'ref':
            $v = one_line((string) $v);
            if ($v !== '' && $content !== null && !find_index($content[$arg], $v)) fail("«{$label}» انتخاب‌شده وجود ندارد.");
            break;
    }
    if ($required && ($v === '' || $v === null)) fail("فیلد «{$label}» الزامی است.");
    return $v;
}

function clean_item(array $schema, array $in, array $labels = [], ?array $content = null): array {
    $out = [];
    foreach ($schema as $key => $type) $out[$key] = clean_value($type, $in[$key] ?? '', $labels[$key] ?? $key, $content);
    return $out;
}

/** اندیس+۱ آیتم با شناسه داده‌شده (۰ یعنی پیدا نشد؛ برای استفاده در شرط) */
function find_index(array $list, $id): int {
    foreach ($list as $i => $x) if ((string) $x['id'] === (string) $id) return $i + 1;
    return 0;
}

/* ---------------- نشست و امنیت ---------------- */
function start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
    session_name('msadmin');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'httponly' => true, 'secure' => $https, 'samesite' => 'Strict']);
    session_start();
    if (!empty($_SESSION['uid']) && time() - ($_SESSION['seen'] ?? 0) > 7200) $_SESSION = []; /* خروج خودکار پس از ۲ ساعت بیکاری */
    $_SESSION['seen'] = time();
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
}

function client_ip(): string { return substr((string) ($_SERVER['REMOTE_ADDR'] ?? '0'), 0, 45); }

function security_headers(): void {
    header('X-Frame-Options: DENY');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: same-origin');
}
