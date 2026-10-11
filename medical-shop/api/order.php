<?php
/**
 * ثبت سفارش (لیست استعلام) و پیام تماس از سایت. ذخیره در admin/storage/orders.json.php
 */
declare(strict_types=1);
require __DIR__ . '/../admin/lib.php';

header('X-Content-Type-Options: nosniff');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail('روش درخواست نامعتبر است.', 405);

$in = json_body();
if (!empty($in['website'])) respond(['ok' => true]); /* تله ربات (honeypot) */

$type = ($in['type'] ?? '') === 'contact' ? 'contact' : 'order';
$name = mb_substr(one_line((string) ($in['name'] ?? '')), 0, 80);
$phone = mb_substr(one_line(fa_digits((string) ($in['phone'] ?? ''))), 0, 20);
if ($name === '') fail('نام را وارد کنید.');
if (!preg_match('/^[+\d\s-]{7,20}$/', $phone)) fail('شماره تماس معتبر نیست.');

$order = [
    'id' => date('ymdHis') . bin2hex(random_bytes(2)),
    'type' => $type,
    'date' => date('c'),
    'status' => 'new',
    'name' => $name,
    'phone' => $phone,
    'city' => mb_substr(one_line((string) ($in['city'] ?? '')), 0, 60),
    'company' => mb_substr(one_line((string) ($in['company'] ?? '')), 0, 120),
    'subject' => mb_substr(one_line((string) ($in['subject'] ?? '')), 0, 60),
    'note' => mb_substr(trim(str_replace("\r", '', (string) ($in['note'] ?? ''))), 0, 2000),
    'items' => [],
    'ip' => client_ip(),
];

if ($type === 'order') {
    $products = array_column(content_load()['products'], null, 'id');
    foreach (array_slice((array) ($in['items'] ?? []), 0, 100) as $it) {
        $id = (int) ($it['id'] ?? 0);
        if (!isset($products[$id])) continue;
        $order['items'][] = ['id' => $id, 'title' => $products[$id]['title'], 'qty' => min(100000, max(1, (int) ($it['qty'] ?? 1))), 'price' => (int) $products[$id]['price']];
    }
    if (!$order['items']) fail('لیست سفارش خالی است.');
} elseif ($order['note'] === '') {
    fail('متن پیام را وارد کنید.');
}

/* محدودیت: حداکثر ۵ ثبت در ۱۰ دقیقه برای هر IP */
$ip = client_ip();
$allowed = store_update('ratelimit', function (array &$r) use ($ip) {
    $now = time();
    foreach ($r as $k => $times) { $r[$k] = array_values(array_filter($times, fn($t) => $t > $now - 600)); if (!$r[$k]) unset($r[$k]); }
    if (count($r[$ip] ?? []) >= 5) return false;
    $r[$ip][] = $now;
    return true;
});
if (!$allowed) fail('تعداد درخواست‌ها زیاد است؛ چند دقیقه بعد دوباره تلاش کنید.', 429);

store_update('orders', function (array &$orders) use ($order) {
    $orders[] = $order;
    if (count($orders) > 5000) $orders = array_slice($orders, -5000);
});
respond(['ok' => true, 'id' => $order['id']]);
